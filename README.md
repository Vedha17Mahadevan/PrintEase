# PrintEase 🖨️ Revolutionizing Printing Services at Your Fingertips
[![Status](https://img.shields.io/badge/status-in%20progress-yellow)]()
[![Tech](https://img.shields.io/badge/built%20with-HTML%2C%20CSS%2C%20JavaScript-blue)]()
<img src="media/Thumbnail.png">

## Idea Overview :
PrintEase is a modern full-stack web application that simplifies printing workflows for students and local print shops. With user-friendly dashboards, online file uploads, payment integration, and real-time order tracking, PrintEase bridges the digital gap in conventional printing services.

## ✨ Features Proposed: 
- 📤 Upload files and place print orders online
- 📝 Add specific print instructions (copies, color/B&W, etc.)
- 💳 Integrated payment gateway
- 📦 Track order status in real-time
- 🖥️ Admin dashboard for order management
- 🔐 Secure authentication system
- 📱 Responsive UI for all screen sizes

## ✅ Current Status : 
This repository contains the basic implementation (MVP) of the PrintEase platform.
### What has been implemented
  - Basic authentication system for user and admin roles
  - User can upload files, give print instructions, and place orders
  - Admin can view orders and update their status
  - User dashboard shows their placed orders and details
### What is part of the broader idea (yet to be added)
  - Multi-shop support and shop selection
  - Online payment integration
  - Notification system (SMS/email)
  - Mobile app version
  - Cloud storage and reprint support
  - Admin analytics dashboard

## 🧰 Tech Stack :
### Frontend
- HTML, CSS, JavaScript
- JS validation & interactivity
### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for secure authentication
- bcryptjs for password hashing

## 📸 Screenshots :
### Home Page
![Home Page](screenshots/home.png)
### Order Page
![Order Page](screenshots/order.png)
### User Dashboard
![User Dashboard](screenshots/user_dashboard.png)
### Admin Dashboard
![Admin Dashboard](screenshots/admin_dashboard.png)

## 🚀 Prerequisites : 
Node.js (v16+)
npm
MongoDB

## Installation :
1. Clone the repository
git clone https://github.com/<your-username>/printease.git
2. Navigate to Project folder
cd PrintEase
3. Install Backend Dependencies
Set up environment variables
Create a .env file in the backend directory:
ini
Copy
Edit
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret_key
PORT=5000

## Running the Application :

## API EndPoints :

## Security Measures
  - JWT-based authentication for session control
  - Password hashing using bcryptjs
  - Input validation for file uploads and form submissions

## 🔮 Future Enhancements
  📱 Mobile App
  ☁️ Cloud Storage
  🧾 Advanced Admin Control and User tools 
  📊 Shop Analytics
  🔔 Notification System
  🧩 Multi-Shop Support

## Authors : 
  - Chris Thomas Abraham
  - Vedha Mahadevan
  ### - Mentor: Ms. Prathibha S Nair

## 📜 License
This project is licensed under the MIT License.
Developed as part of a micro-project at Mar Baselios College of Engineering and Technology (MBCET).
For any use beyond that, please contact the team.

## 🌟 Acknowledgements
  - Google Forms Survey Participants
  - Inspiration from local campus print shops
  - Thanks to our college micro-project initiative!
