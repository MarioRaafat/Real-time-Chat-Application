
# Real-time Chat Application

This is a real-time chat application built using **MongoDB**, **React.js**, and **Express**. The application allows users to communicate with each other via direct messages (DMs), create group chats, and share files and images.

## Features

- **User Profile**
  - Edit personal profile image.
  
- **Messaging**
  - Send direct messages (DMs) to other users.
  - Create and manage group chats.
  - Edit sent messages.
  - Delete messages.

- **File Sharing**
  - Send images and other files (e.g., PDFs, zip files).
  - Download shared files directly from the chat.

- **Real-time Communication**
  - Instant message updates using web sockets.
  - Real-time group messaging with synced updates across all devices.

## Tech Stack

- **Backend**: Express.js, Node.js
- **Frontend**: React.js
- **Database**: MongoDB
- **Real-time**: WebSocket, Socket.io
- **Hosting**: Railway, Vercel

## Setup and Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/MarioRaafat/Real-time-Chat-Application.git
   cd Real-time-Chat-Application
   ```

2. Install backend dependencies:
   ```bash
   cd backend
   npm install
   ```

3. Install frontend dependencies:
   ```bash
   cd ../frontend
   npm install
   ```

4. Set up environment variables:
   - Create a `.env` file in the `backend` directory with the following:
     ```bash
     MONGODB_URI=<your-mongodb-connection-string>
     JWT_SECRET=<your-jwt-secret>
     ```
   - Optionally configure any other required environment variables.

5. Start the backend server:
   ```bash
   npm run dev
   ```

6. Start the frontend React app:
   ```bash
   cd ../frontend
   npm start
   ```

## Features in Action

- **Edit Profile Image**: Users can update their profile pictures from their account settings.
- **Create Groups**: Create group chats and invite multiple users. Manage group members by adding or removing users.
- **Message Editing**: Edit any sent message within a chat. The edited status is indicated in the message.
- **File Sharing**: Share various file types (PDFs, images, etc.). Files can be downloaded by any participant in the conversation.
- **Responsive Design**: The application is mobile-responsive, offering a clean interface similar to WhatsApp's design for both small and large screens.
