# ByteCart 🛒

ByteCart is a professional, full-stack e-commerce platform designed for a seamless shopping experience. It features a robust backend built with Node.js and Express, coupled with a modern, responsive frontend powered by React and Vite.

## 🚀 Tech Stack

### Frontend

- **Framework:** React 19
- **Build Tool:** Vite
- **Styling:** Vanilla CSS (Modern, Responsive)
- **State Management:** Hooks & Context API

### Backend

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB (via Mongoose)
- **Authentication:** JWT (JSON Web Tokens) & bcryptjs
- **File Uploads:** Multer & Cloudinary
- **Email Service:** Brevo / Resend
- **Security:** Express Rate Limit, Cookie Parser

---

## 📂 Project Structure

```text
byte-cart/
├── client/                # React frontend (Vite)
│   ├── src/               # Application source
│   ├── public/            # Static assets
│   └── vite.config.js     # Vite configuration
├── server/                # Express backend
│   ├── config/            # Database configuration
│   ├── controllers/       # Business logic / Request handlers
│   ├── email/             # Email templates and logic
│   ├── middleware/        # Custom middlewares (Auth, Admin, etc.)
│   ├── models/            # Mongoose schemas
│   ├── routes/            # API endpoints
│   ├── seed/              # Database seeding scripts
│   └── utils/             # Utility functions
├── index.js               # Main entry point (Server)
├── package.json           # Root dependencies and scripts
└── .env                   # Environment variables (Configuration)
```

---

## 🛠️ Setup Instructions

### Prerequisites

- Node.js (v18+ recommended)
- MongoDB account (Atlas or Local)
- Cloudinary account (for image hosting)

### 1. Clone the repository

```bash
git clone https://github.com/macdavid28/byte-cart.git
cd byte-cart
```

### 2. Backend Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Create a `.env` file in the root directory and configure the following:
   ```env
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   BREVO_API_KEY=your_brevo_key
   ```
3. Seed the admin account (optional):
   ```bash
   npm run admin
   ```
4. Start the server:
   ```bash
   npm run server
   ```

### 3. Frontend Setup

1. Navigate to the client directory:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

---

## 🚦 API Overview

### Authentication (`/api/auth/v1`)

- `POST /signup`: Register a new user.
- `POST /login`: Authenticate user and issue JWT.
- `POST /logout`: Logout user.
- `POST /verify-email`: Verify email with token.
- `POST /forgot-password`: Send password reset link.
- `POST /reset-password/:code`: Reset password using code.
- `GET /check-auth`: Check current authentication status.

### Products (`/api/products`)

- `GET /`: Retrieve all products.
- `GET /:id`: Fetch high-level details for a specific product.
- `POST /`: Create a new product (Admin Only).

### Users (`/api/users`)

- `GET /all`: List all users (Admin Only).
- `GET /user/profile`: Get authenticated user profile.
- `PUT /user/update/profile`: Update user profile details.
- `GET /user/:id`: Get user by ID (Admin Only).
- `DELETE /user/:id`: Delete user (Admin Only).

---

## 📜 Scripts

| Command          | Description                                             |
| :--------------- | :------------------------------------------------------ |
| `npm run server` | Starts the backend server with Nodemon (Root).          |
| `npm run admin`  | Runs the admin user seeding script (Root).              |
| `npm run dev`    | Launches the Vite frontend development server (Client). |
| `npm run build`  | Builds the frontend for production (Client).            |

---

## 👤 Author

**Temiloluwa Tomilola David (Mac)**

---

## 📄 License

This project is licensed under the ISC License.
