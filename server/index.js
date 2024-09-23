import express from 'express';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import authRoute from './routes/authRoute.js';

dotenv.config();
const app = express();
const port = process.env.PORT || 5000;
const dbURL = process.env.DATABASE_URL;

app.use(cors({
    origin: process.env.ORIGIN,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));

app.use("/uploads/profiles", express.static("uploads/profiles"));
app.use(cookieParser());
app.use(express.json());

app.use("/api/auth", authRoute);


const server = app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});

mongoose.connect(dbURL)
    .then(() => {
        console.log('Connected to the database');
    })
    .catch(err => console.log(err));