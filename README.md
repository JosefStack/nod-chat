# Nod - Real-Time Chat Application

A full-stack real-time chat application built with React, Node.js, Socket.io, and MongoDB. Features secure authentication, instant messaging, online presence tracking, and image sharing.

## 🚀 Live Demo

🔗 [https://nod-chat.onrender.com](https://nod-chat.onrender.com)

## 📋 Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Reference](#api-reference)
- [Project Structure](#project-structure)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [Contact](#contact)

---

## ✨ Features

### Authentication
- Secure JWT-based authentication with httpOnly cookies
- Password hashing with bcrypt (salt rounds: 12)
- Protected routes and socket connections
- Profile picture upload via Cloudinary

### Real-time Messaging
- Instant message delivery using WebSockets
- Online/offline user status tracking
- Typing indicators (coming soon)
- Read receipts (coming soon)

### User Experience
- Optimistic UI updates with rollback on failure
- Sound notifications with localStorage persistence
- Image sharing in conversations
- Responsive design for mobile and desktop
- Multi-tab support

---

## 🛠️ Tech Stack

### Frontend
| Technology           |            Purpose |
|----------------------|--------------------|
| React                | UI library         |
| Vite                 | Build tool         |
| Zustand              | State management   |
| TailwindCSS          | Styling            |
| Socket.io-client     | Real-time communication |
| React Router         | Navigation         |
| React Hot Toast      | Notifications      |
| Lucide React         | Icons              |

### Backend
| Technology | Purpose |
|------------|--------------|
| Node.js |  Runtime |
| Express | Web framework |
| Socket.io |  WebSocket server |
| MongoDB |  Database |
| Mongoose |  ODM |
| JSON Web Token |  Authentication |
| bcryptjs |  Password hashing |
| Cloudinary | Image storage |
| Resend |  Email service |

### DevOps & Tools
| Tool | Purpose |
|------|---------|
| Git | Version control |
| GitHub | Repository hosting |
| Render | Deployment |
| Postman | API testing |
| MongoDB Atlas | Database hosting |
| Vite | Development server |

---

### Data Flow

1. **Authentication Flow**
   - User submits login/signup form
   - Server validates credentials and sets httpOnly JWT cookie
   - Client stores user data in Zustand store
   - Socket.io connection established with same JWT

2. **Message Flow**
   - User sends message → Optimistic update in UI
   - Message sent to server via HTTP POST
   - Server saves to MongoDB
   - Server forwards to recipient via WebSocket
   - Recipient receives and updates UI

3. **Online Status Flow**
   - User connects → Socket.io adds to online map
   - Server broadcasts updated online list every 5 seconds
   - Client updates UI to show online/offline status

---

## 🚀 Getting Started

### Prerequisites

- Node.js v18 or higher
- npm or yarn
- MongoDB Atlas account (or local MongoDB)
- Cloudinary account

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/nod-chat.git
   cd nod-chat
   ```

2. **Backend setup**
   ```bash
   cd backend
   npm install
   ```

3. **Frontend setup**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Environment configuration**
   
   Create `.env` in backend directory (see [Environment Variables](#environment-variables))

5. **Run development servers**
   
   Terminal 1 (Backend):
   ```bash
   cd backend
   npm run dev
   ```
   
   Terminal 2 (Frontend):
   ```bash
   cd frontend
   npm run dev
   ```

6. **Open your browser**
   
   Navigate to `http://localhost:5173`

---

## 🔐 Environment Variables

Create a `.env` file in the `backend` directory:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database
MONGO_URI=your_mongodb_connection_string

# Authentication
JWT_SECRET=your_jwt_secret_key_here

# Email (Resend)
RESEND_API_KEY=your_resend_api_key
EMAIL_FROM=onboarding@resend.dev
EMAIL_FROM_NAME=Nod

# Client URL
CLIENT_URL=http://localhost:5173

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Rate Limiting (Arcjet) - Optional
ARCJET_KEY=your_arcjet_key
ARCJET_ENV=development
```

### Production Environment Variables (Render)

Add these to your Render dashboard:

| Variable | Description |
|----------|-------------|
| `PORT` | 3000 (set automatically by Render) |
| `NODE_ENV` | production |
| `MONGO_URI` | Your production MongoDB connection string |
| `JWT_SECRET` | Strong random string (min 32 chars) |
| `RESEND_API_KEY` | Your Resend API key |
| `EMAIL_FROM` | onboarding@resend.dev |
| `EMAIL_FROM_NAME` | Nod |
| `CLIENT_URL` | https://your-app.onrender.com |
| `CLOUDINARY_CLOUD_NAME` | Your Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Your Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Your Cloudinary API secret |
| `ARCJET_KEY` | Your Arcjet API key |
| `ARCJET_ENV` | production |

---

## 📡 API Reference

### Authentication Endpoints

| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|--------------|----------|
| POST | `/api/auth/signup` | Create new account | `{ fullName, email, password }` | User object |
| POST | `/api/auth/login` | Login user | `{ email, password }` | User object |
| POST | `/api/auth/logout` | Logout user | - | Success message |
| GET | `/api/auth/check` | Check auth status | - | User object |
| PUT | `/api/auth/update-profile` | Update profile | `{ profilePic }` | Updated user |

### Message Endpoints

| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|--------------|----------|
| GET | `/api/messages/contacts` | Get all users | - | Array of users |
| GET | `/api/messages/chats` | Get chat partners | - | Array of users |
| GET | `/api/messages/:id` | Get messages with user | - | Array of messages |
| POST | `/api/messages/send/:id` | Send message | `{ text, image }` | Message object |

### Response Formats

**Success Response (200/201)**
```json
{
  "_id": "65d4f2ac1f3b4c1a23456789",
  "fullName": "John Doe",
  "email": "john@example.com",
  "profilePic": "https://res.cloudinary.com/..."
}
```

**Error Response (400/401/500)**
```json
{
  "message": "Error description here"
}
```

---

## 📁 Project Structure
## 📁 Backend

```
├── 📁 src
│   ├── 📁 controllers
│   │   ├── 📄 auth.controller.js
│   │   └── 📄 message.controller.js
│   ├── 📁 emails
│   │   ├── 📄 emailHandler.js
│   │   └── 📄 emailTemplate.js
│   ├── 📁 lib
│   │   ├── 📄 arcjet.js
│   │   ├── 📄 cloudinary.js
│   │   ├── 📄 db.js
│   │   ├── 📄 env.js
│   │   ├── 📄 resend.js
│   │   ├── 📄 socket.js
│   │   └── 📄 utils.js
│   ├── 📁 middleware
│   │   ├── 📄 arcjet.middleware.js
│   │   ├── 📄 auth.middleware.js
│   │   └── 📄 socket.auth.middleware.js
│   ├── 📁 models
│   │   ├── 📄 Message.js
│   │   └── 📄 User.js
│   ├── 📁 routes
│   │   ├── 📄 auth.route.js
│   │   └── 📄 message.route.js
│   └── 📄 server.js
├── ⚙️ package-lock.json
└── ⚙️ package.json
```

## 📁 Frontend
```
├── 📁 public
│   ├── 📁 sounds
│   │   ├── 🎵 keystroke1.mp3
│   │   ├── 🎵 keystroke2.mp3
│   │   ├── 🎵 keystroke3.mp3
│   │   ├── 🎵 keystroke4.mp3
│   │   ├── 🎵 mouse-click.mp3
│   │   └── 🎵 notification.mp3
│   ├── 🖼️ avatar.png
│   ├── 🖼️ login.png
│   ├── 🖼️ signup.png
│   └── 🖼️ vite.svg
├── 📁 src
│   ├── 📁 components
│   │   ├── 📄 ActiveTabSwitch.jsx
│   │   ├── 📄 AnimatedBorderContainer.jsx
│   │   ├── 📄 ChatContainer.jsx
│   │   ├── 📄 ChatHeader.jsx
│   │   ├── 📄 ChatsList.jsx
│   │   ├── 📄 ContactsList.jsx
│   │   ├── 📄 MessageInput.jsx
│   │   ├── 📄 MessagesLoadingSkeletion.jsx
│   │   ├── 📄 NoChatHistoryPlaceholder.jsx
│   │   ├── 📄 NoChatsFound.jsx
│   │   ├── 📄 NoConversationPlaceholder.jsx
│   │   ├── 📄 PageLoader.jsx
│   │   ├── 📄 ProfileHeader.jsx
│   │   └── 📄 UsersLoadingSkeleton.jsx
│   ├── 📁 hooks
│   │   └── 📄 useKeyboardsound.js
│   ├── 📁 lib
│   │   └── 📄 axios.js
│   ├── 📁 pages
│   │   ├── 📄 ChatPage.jsx
│   │   ├── 📄 LoginPage.jsx
│   │   └── 📄 SignupPage.jsx
│   ├── 📁 store
│   │   ├── 📄 useAuthStore.js
│   │   └── 📄 useChatStore.js
│   ├── 📄 App.jsx
│   ├── 🎨 index.css
│   └── 📄 main.jsx
├── ⚙️ .gitignore
├── 📝 README.md
├── 📄 eslint.config.js
├── 🌐 index.html
├── ⚙️ package-lock.json
├── ⚙️ package.json
├── 📄 postcss.config.js
├── 📄 tailwind.config.js
└── 📄 vite.config.js
```

---

## 🚢 Deployment

### Deploy to Render

#### Backend Deployment

1. Push your code to GitHub
2. Log in to [Render](https://render.com)
3. Click "New +" and select "Web Service"
4. Connect your GitHub repository
5. Configure:
   - **Name:** nod-chat-backend
   - **Environment:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Root Directory:** `backend`
6. Add all environment variables from the [Environment Variables](#environment-variables) section
7. Click "Create Web Service"

#### Frontend Deployment

1. In Render dashboard, click "New +" and select "Static Site"
2. Connect your GitHub repository
3. Configure:
   - **Name:** nod-chat-frontend
   - **Build Command:** `npm install && npm run build`
   - **Publish Directory:** `frontend/dist`
   - **Root Directory:** `frontend`
4. Add environment variable:
   - `VITE_API_URL`: Your backend URL (e.g., `https://nod-chat-backend.onrender.com/api`)
5. Click "Create Static Site"

---

## 🤝 Contributing

Contributions are always welcome!

1. Fork the repository
2. Create your feature branch
   ```bash
   git checkout -b feature/AmazingFeature
   ```
3. Commit your changes
   ```bash
   git commit -m 'Add some AmazingFeature'
   ```
4. Push to the branch
   ```bash
   git push origin feature/AmazingFeature
   ```
5. Open a Pull Request

### Development Guidelines

- Follow existing code style
- Write meaningful commit messages
- Update documentation for new features
- Add tests for new functionality

---

## 📫 Contact

Joseph Johnson
- Email: josefstack.dev@gmail.com
- GitHub: [@JosefStack](https://github.com/JosefStack)
- LinkedIn: [Joseph Johnson](www.linkedin.com/in/joseph-johnson-ba5808277)
- Portfolio: [joseph-dev.com](https://portfolio-josefstack.vercel.app/)

Project Link: [https://github.com/JosefStack/nod-chat](https://github.com/JosefStack/nod-chat)

---

## 🙏 Acknowledgements

- [Socket.io](https://socket.io) for real-time communication
- [Zustand](https://github.com/pmndrs/zustand) for state management
- [TailwindCSS](https://tailwindcss.com) for styling
- [Cloudinary](https://cloudinary.com) for image hosting
- [Render](https://render.com) for hosting
- [Lucide Icons](https://lucide.dev) for icons
- [React Hot Toast](https://react-hot-toast.com) for notifications

---

## 📈 Performance

- **First Contentful Paint:** ~1.2s
- **Time to Interactive:** ~1.8s
- **WebSocket connection time:** ~200ms
- **Message delivery latency:** ~50ms

---

<p align="center">
  <img src="https://komarev.com/ghpvc/?username=JosefStack&label=Project%20Views&color=0e75b6&style=flat" />
</p>

<p align="center">
  ⭐ Star this project if you found it helpful!
</p>
