# Wafa Hardware E-Commerce App

Wafa Hardware is a comprehensive React Native mobile application for browsing, purchasing, and managing hardware equipment and tools. This repository contains both the mobile frontend application and the centralized Node.js backend server.

## 🚀 Features

* **Product Catalog & Search**: Browse hardware items, search by category, and view detailed product descriptions with images.
* **Cart & Checkout**: Fast and easy checkout processes for users.
* **Multi-language Support**: Application is localized with dynamic translations (English & Urdu).
* **Admin Dashboard**: Specialized inventory management interface for administrators to seamlessly add, edit, or remove hardware products.
* **Push Notifications**: Real-time notifications for users.
* **Theme Styling**: Polished visuals including dark/light color themes and animations.

## 🛠 Technology Stack

### Frontend (Mobile App)
* **Framework**: React Native
* **Navigation**: React Navigation (Stack & Drawer)
* **State Management**: Redux / Redux-Thunk
* **Localization**: i18next & react-i18next
* **Icons & UI Layout**: react-native-vector-icons

### Backend (Server & Database)
* **Runtime**: Node.js with Express.js
* **Database**: MongoDB (via Mongoose) connected to MongoDB Atlas
* **Image Hosting**: Cloudinary (for storing product images safely)

---

## 📁 Project Structure

* `/src/`: Contains all React Native components, screens, themes, localization files, and Redux data models.
* `/backend/`: Contains the Node.js Express server, MongoDB schemas, RESTful API endpoints, and configuration.
* `/android/` & `/ios/`: Native Android and iOS application configurations.

---

## ⚙️ How to Setup and Run Locally

### 1. Backend Server Setup
First, prepare your server. Navigate into the `backend` directory and install the necessary dependencies:

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory with your database and Cloudinary keys:

```env
PORT=5000
MONGODB_URI=your_mongodb_atlas_connection_string
CLOUD_NAME=your_cloudinary_cloud_name
API_KEY=your_cloudinary_api_key
API_SECRET=your_cloudinary_api_secret
```

Start the backend server:

```bash
npm start
```
*(The API will now be running locally on port 5000.)*

### 2. Mobile App Setup
In the root directory, install the frontend React Native dependencies:

```bash
npm install
```

**Important**: Before running the app on a physical device, make sure the `BASE_URL` inside `src/config/api.js` points to your backend IP address (e.g. `http://YOUR_LOCAL_IP:5000`) or your active cloud deployment URL.

Run the Metro bundler:
```bash
npm start
```

Run the application natively:
```bash
npm run android
# OR
npm run ios
```

---

## 🌍 Deploying the Backend
To successfully use the APK on any mobile device over cellular data or external Wi-Fi networks, the `backend` folder must be hosted on a cloud provider such as [Render.com](https://render.com/). 

When deploying, ensure your Root Directory is set to `backend`, the environment is Node, and your `.env` variables are properly imported into the cloud provider's dashboard. Finally, update the `BASE_URL` in `src/config/api.js` to your new live URL before compiling your final APK build!

