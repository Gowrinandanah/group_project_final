# 🧠 BRAINHIVE: Your Ultimate Study Group Hub

Are you tired of studying alone? Struggling to find like-minded individuals to collaborate with? **BrainHive** is here to revolutionize your study experience!

BrainHive is a dynamic, full-stack web application designed to help you effortlessly **create, discover, and join study groups**. Whether you're preparing for exams, tackling complex projects, or simply seeking a collaborative learning environment, BrainHive connects you with the right people at the right time.

Built with the powerful **MERN stack** (MongoDB, Express, React, Node.js) as part of the ICT Academy of Kerala FSD program, BrainHive is your go-to platform for fostering a vibrant and effective learning community.

---

## ✨ What Can You Do with BrainHive?

BrainHive is packed with features to enhance your group study journey:

* **Secure User Authentication:** Your data is safe with robust **JWT-based authentication**.
* **Seamless Group Management:** Easily **create, join, or leave study groups** tailored to your needs.
* **Admin Approval for Quality:** New groups are reviewed by admins to ensure a focused and productive environment.
* **Personalized User Profiles:** Showcase your academic interests, update your info, and **upload a profile picture** to connect with others.
* **Real-time Group Chat:** Communicate and collaborate instantly with your group members through an integrated **messaging system**.
* **Stay Informed with Email Notifications:** Get timely updates and reminders directly to your inbox with **SMTP-powered email notifications**.
* **Powerful Admin Dashboard:** Admins have comprehensive tools to manage users and groups, ensuring a smooth experience for everyone.

---

## 🚀 The Tech Behind BrainHive

We've leveraged a modern and robust tech stack to bring BrainHive to life:

* **Frontend:** Crafted with **React** for a dynamic user interface and styled beautifully with **Material UI**.
* **Backend:** Powered by **Node.js** and **Express.js** for a fast and scalable server.
* **Database:** Data is securely stored and managed with **MongoDB Atlas**.
* **Authentication:** Secure user sessions with **JSON Web Tokens (JWT)**.
* **Email Service:** Sending notifications is a breeze with **Nodemailer** using **SMTP**.

```

## 📂 Project Blueprint: A Glimpse Under the Hood

Here's how our project is organized, making it easy to navigate and understand:

src/
├── api/                  # API communication services
│   ├── Axios.js
│   ├── GroupApi.js
│   └── UserApi.js
├── assets/               # Static assets like images
├── components/           # Reusable React components for UI
│   ├── Admin.jsx
│   ├── AdminUserProfiles.jsx
│   ├── Creategroup.jsx
│   ├── Groupcard.jsx
│   ├── Groupdetails.jsx
│   ├── Header.jsx
│   ├── Homepage.jsx
│   ├── Login.jsx
│   ├── Materialitem.jsx
│   ├── Messagebox.jsx
│   ├── Navbar.jsx
│   ├── Register.jsx
│   ├── RequireAuth.jsx
│   ├── SplashScreen.jsx
│   ├── Usercard.jsx
│   ├── Userprofile.jsx
│   └── Welcomepage.jsx
├── App.jsx               # Main application component
├── App.css               # Global CSS styles
├── main.jsx              
├── index.css             

BACKEND_PROJECT/
├── middleware/           # Express middleware functions
│   └── auth.js
├── project_module/       # Core backend logic and utilities
│   ├── model.js
│   └── notify.js
├── routes/               # API routes definitions
│   ├── authRoutes.js
│   └── materialRoutes.js
├── .env                  # Environment variables (local only)
├── app.js                # Main backend application file
├── connection.js         # Database connection setup
├── package.json          # Backend dependencies and scripts

```
## ⚙️ Get BrainHive Up and Running!

Ready to explore BrainHive? Follow these simple steps to set up the project locally:

### 🔐 Environment Variables

Before you start, create a `.env` file in the root of your `backend_project` folder and populate it with the following:
```
JWT_SECRET=your_super_secret_jwt_key_here
SMTP_EMAIL=your_email@example.com
SMTP_PASSWORD=your_email_password
MONGO_URL=your_mongodb_atlas_connection_string
```
> ⚠️ **Important:** Never commit your actual `.env` file to version control (like GitHub)! Make sure it's included in your `.gitignore`.

### 📦 Installation Steps

1.  **Backend Setup:**
    ```bash
    # Navigate to the backend directory
    cd backend_project

    # Install all necessary backend dependencies
    npm install

    # Start the backend server
    node app.js
    ```

2.  **Frontend Setup:**
    ```bash
    # Navigate to the frontend directory
    cd project

    # Install all necessary frontend dependencies
    npm install

    # Start the frontend development server
    npm run dev
    ```

    Once both servers are running, open your browser and navigate to the address provided by the frontend development server (usually `http://localhost:5173/` or similar).

---

## 👨‍👩‍👧‍👦 Meet the Minds Behind BrainHive

This project was a collaborative effort by a talented team:

* **Gowri Nandana H**
* **Gowri Lekshmi J**
* **Anagha Sunny**
* **Arjun K A**



## 📄 License

This project is open-sourced under the **MIT License**. See the full license text in the [LICENSE](LICENSE) file for more details.
