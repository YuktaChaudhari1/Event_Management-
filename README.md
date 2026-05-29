# Event Management System

A full-stack Event Management System built using the MERN stack. This project allows users to browse events, book tickets, manage bookings, and provides an admin dashboard for event and booking management.

## Live Demo

Frontend: https://event-management-1-xp6o.onrender.com
---

## Project Overview

This project was built to understand how a complete MERN application works, including authentication, authorization, event management, booking workflows, and admin features.

---

## Features

### User Features

* User Registration
* User Login
* JWT Authentication
* Event Browsing
* Event Booking
* View My Bookings
* Cancel Bookings

### Admin Features

* Admin Login
* Create Events
* Edit Events
* Delete Events
* View All Bookings
* Approve Booking Requests
* Reject Booking Requests
* Seat Management
* Booking Monitoring Dashboard

---

## Tech Stack

### Frontend

* React.js
* Vite
* Tailwind CSS
* Axios

### Backend

* Node.js
* Express.js
* MongoDB Atlas
* Mongoose
* JWT Authentication
* Bcrypt.js
* Nodemailer

### Deployment

* Render
* MongoDB Atlas

---

## Folder Structure

```text
Event_Management/
│
├── Backend/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   └── index.js
│
├── Frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   └── services/
│   └── public/
│
└── README.md
```

---

## Authentication & Authorization

The application uses:

* JWT-based Authentication
* Protected Routes
* Role-based Authorization
* Admin and User Access Control

---

## Database Models

### User

* Name
* Email
* Password
* Role
* Verification Status

### Event

* Title
* Description
* Date
* Location
* Ticket Price
* Total Seats
* Available Seats

### Booking

* User
* Event
* Status
* Payment Status
* Amount


## Installation

### Clone Repository

```bash
git clone https://github.com/YuktaChaudhari1/Event_Management-.git
cd Event_Management-
```

### Backend Setup

```bash
cd Backend
npm install
npm run dev
```

### Frontend Setup

```bash
cd Frontend
npm install
npm run dev
```

---

## Environment Variables

Backend `.env`

```env
PORT=3000
MONGO_URL=YOUR_MONGODB_URI
JWT_SECRET=YOUR_SECRET_KEY
EMAIL_USER=YOUR_EMAIL
EMAIL_PASS=YOUR_APP_PASSWORD
```

Frontend `.env`

```env
VITE_API_URL=YOUR_BACKEND_URL/api
```

---

## Learning Outcomes

Through this project, I gained practical experience with:

* MERN Architecture
* REST APIs
* Authentication & Authorization
* MongoDB Relationships
* Route Protection
* State Management
* Frontend-Backend Integration
* Deployment on Render
* Environment Variable Management
* Real-world Project Structure

---

## Future Improvements

* Online Payment Integration
* Event Search & Filtering
* User Profile Management
* Improved Notification System
* Analytics Dashboard
* Enhanced Email Services

---

## Author

Yukta Chaudhari

GitHub: https://github.com/YuktaChaudhari1
