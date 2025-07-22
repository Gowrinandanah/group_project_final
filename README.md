# BRAINHIVE

A full-stack web application that allows users to create, find, and join study groups. Built with the MERN (MongoDB, Express, React, Node.js) stack as part of the ICT Academy of Kerala FSD program.

## 🚀 Features

- User Authentication with JWT
- Group Creation, Joining, and Leaving
- Admin Approval for New Groups
- User Profiles with Editable Info and Profile Picture Upload
- Group Chat / Messaging
- Email Notifications (SMTP)
- Admin Dashboard

## 🛠️ Tech Stack

- **Frontend**: React, Material UI
- **Backend**: Node.js, Express.js
- **Database**: MongoDB Atlas
- **Authentication**: JWT
- **Mail Service**: Nodemailer with SMTP

## 📁 Project Structure
```
src/
├── api/
│   ├── Axios.js
│   ├── GroupApi.js
│   └── UserApi.js
├── assets/
├── components/
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
├── App.jsx
├── App.css
├── main.jsx
├── index.css


BACKEND_PROJECT/
├── middleware/
│   └── auth.js
├── project_module/
│   ├── model.js
│   └── notify.js
├── routes/
│   ├── authRoutes.js
│   └── materialRoutes.js
├── .env
├── app.js
├── connection.js
├── package.json

```



## 🔐 Environment Variables

Create a `.env` file in the root of the `backend` folder:
```
JWT_SECRET=your_jwt_secret
SMTP_EMAIL=your_email@example.com
SMTP_PASSWORD=your_email_password
MONGO_URL=your_mongodb_connection_string

```



> ⚠️ Never commit your real `.env` to GitHub. Use `.gitignore` to exclude it.

## 📦 Installation

```bash
# Install backend dependencies
cd backend_project
npm install

# Start backend server
node app.js


# Install frontend dependencies
cd project
npm install

# Start frontend
npm run dev


```` 


## 👨‍💻 Team Members

- **Gowri Nandana H**  
- **Gowri Lekshmi J**  
- **Anagha Sunny**  
- **Arjun K A**


## 📄 License

MIT License

Copyright (c) 2025
Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights  
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell      
copies of the Software, and to permit persons to whom the Software is          
furnished to do so, subject to the following conditions:                       

The above copyright notice and this permission notice shall be included in     
all copies or substantial portions of the Software.                            

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR     
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,       
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE    
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER         
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING        
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS   
IN THE SOFTWARE.
