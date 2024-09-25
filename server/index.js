import express from 'express';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import authRoute from './routes/authRoute.js';
import contactRoute from './routes/contactRoute.js';
import MessagesRouter from "./routes/MessagesRoute.js";
import GroupsRouter from "./routes/GroupRoute.js";
import setupSocket from "./socket.js";

dotenv.config();
const app = express();
const port = process.env.PORT || 5000;
const dbURL = process.env.DATABASE_URL;


// List of allowed origins
const allowedOrigins = [
  process.env.ORIGIN_DEV,  // for local development
  process.env.ORIGIN_PROD  // for production on Vercel
];

const corsOptions = {
    origin: function (origin, callback) {
        // Check if the origin is in the list of allowedOrigins or is undefined (for server-to-server requests)
        if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
        callback(null, true);
        } else {
        callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true, // if you want to allow cookies or authentication headers
};

app.use(cors(corsOptions));


app.use("/uploads/profiles", express.static("uploads/profiles"));
app.use("/uploads/files", express.static("uploads/files"));
app.use(cookieParser());
app.use(express.json());

app.use("/api/auth", authRoute);
app.use("/api/contacts", contactRoute);
app.use("/api/messages", MessagesRouter);
app.use("/api/groups", GroupsRouter);


const server = app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});


setupSocket(server);

mongoose.connect(dbURL)
    .then(() => {
        console.log('Connected to the database');
    })
    .catch(err => console.log(err));