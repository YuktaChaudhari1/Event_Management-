const Booking = require("../models/Booking");
const OTP = require("../models/OTP");
const Event = require("../models/Event");
const User = require("../models/User");

const { sendOTPEmail, sendBookingEmail } = require("../utils/email");

const generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

exports.sendBookingOTP = async (req, res) => {
  const otp = generateOtp();
  await OTP.findOneAndDelete({
    email: req.user.email,
    action: "event_booking",
  });
  await OTP.create({
    email: req.user.email,
    otp: otp,
    action: "event_booking",
  });
  await sendOTPEmail(req.user.email, otp, "event_booking");
  res.json({ message: "OTP sent to email", otp });
  console.log(otp);
};

exports.bookEvent = async (req, res) => {
  const { eventId, otp } = req.body;

  const otpRecord = await OTP.findOne({
    email: req.user.email,
    otp,
    action: "event_booking",
  });

  if (!otpRecord) {
    return res.status(400).json({ error: "Invalid or expired OTP" });
  }

  const event = await Event.findById(eventId);
  if (!event) {
    return res.status(404).json({ error: "Event not found" });
  }

  if (event.totalSeats <= 0) {
    return res.status(400).json({ error: "No seats available" });
  }

  const existingBooking = await Booking.findOne({
    userId: req.user._id,
    eventId,
    amount: event.ticketPrice,
  });

  if (existingBooking) {
    return res
      .status(400)
      .json({ error: "You have already booked this event" });
  }
  const booking = await Booking.create({
    userId: req.user._id,
    eventId,
    status: "pending",
    paymentStatus: "not_paid",
    amount: event.ticketPrice,
  });

  await OTP.deleteMany({ email: req.user.email, action: "event_booking" });
  res.status(201).json({
    message: "Booking created . Please check  your email for confirmation",
    booking,
  });
};

exports.confirmBooking = async (req, res) => {
  const paymentStatus = req.body.paymentStatus;

  if (!["paid", "not_paid"].includes(paymentStatus)) {
    return res.status(400).json({ error: "Invalid payment status" });
  }
  const booking = await Booking.findById(req.params.id)
    .populate("eventId")
    .populate("userId", "name email");

  if (!booking) {
    return res.status(404).json({ error: "Booking not found" });
  }
  if (booking.status === "confirmed") {
    return res.status(400).json({ error: "Booking is already confirmed" });
  }
  const event = await Event.findById(booking.eventId);

  if (event.availableSeats <= 0) {
    return res.status(400).json({ error: "No seats available " });
  }
  booking.status = "confirmed";

  if (paymentStatus) {
    booking.paymentStatus = paymentStatus;
  }
  await booking.save();
  event.availableSeats -= 1;
  await event.save();

  //admin confirm booking ,send email to user
  await sendBookingEmail(
    booking.userId.email,
    booking.userId.name,
    event.title,
  );
  res.json({ message: "Booking confirmed", booking });
};

exports.getMyBookings = async (req, res) => {
  const bookings = await Booking.find({ userId: req.user._id }).populate(
    "eventId",
  );
  res.json(bookings);
};

exports.cancelBooking = async (req, res) => {
  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    return res.status(404).json({ error: "Booking not found" });
  }

  if (
    booking.userId.toString() !== req.user._id.toString() &&
    req.user.role !== "admin"
  ) {
    return res.status(403).json({ error: "Unauthorized" });
  }

  if (booking.status === "confirmed") {
    const event = await Event.findById(booking.eventId);
    event.availableSeats += 1;
    await event.save();
  }
  booking.status = "cancelled";
  await booking.save();

  await Booking.findByIdAndDelete(req.params.id);

  res.json({ message: "Booking cancelled" });
};

exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("eventId")
      .populate("userId", "name email")
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    console.error("GET ALL BOOKINGS ERROR:");
    console.error(error);

    res.status(500).json({
      error: error.message,
      stack: error.stack,
    });
  }
};
