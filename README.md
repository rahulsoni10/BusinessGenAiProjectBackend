# 🚀 Smart Feedback Portal - Backend

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js"/>
  <img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express.js"/>
  <img src="https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB"/>
</p>

This is the Node.js and Express API that powers the Smart Feedback Portal. It handles all data, authentication, and AI integrations.

---

## ✨ Core Features

* **Authentication**: Secure JWT login & registration with Admin/Customer roles.
* **Post Management**: CRUD operations for admin posts.
* **Feedback System**: Handles likes, comments, and replies.
* **Complaint System**: Manages complaint submission, tracking, and resolution.
* **AI Integrations**:
    * Analyzes comment sentiment automatically.
    * Determines the severity of new complaints.
    * Generates smart reply suggestions for admins.

---

## 🛠️ Tech Stack & Integrations

* **Core**: Node.js, Express.js
* **Database**: MongoDB with Mongoose
* **Authentication**: JWT & bcrypt
* **File Storage**: Cloudinary
* **AI Services**: Hugging Face API

---

## 🚀 Getting Started

1.  **Clone the repo and enter the directory:**
    ```bash
    git clone https://github.com/iitian360/BusinessGenAiBackend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Create your `.env` file:**
    Copy the `.env.example` to a new file named `.env` and fill in your credentials.
    ```env
    MONGO_URI=
    PORT=
    CLOUDINARY_CLOUD_NAME=
    CLOUDINARY_API_KEY=
    CLOUDINARY_API_SECRET=
    JWT_SECRET=
    HUGGING_FACE_API_KEY=
    ```

4.  **Start the server:**
    ```bash
    npm run dev
    ```
    The API will be running on the `PORT` specified in your `.env` file.
