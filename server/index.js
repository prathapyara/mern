import dotevn from "dotenv";
import express from "express";
import apiRoutes from "./routes/apiRoutes.js";
import { MongoDB } from "./config/db.js";
import fileUpload from "express-fileupload";
import cookieParser from "cookie-parser";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
//import {helmet} from "helmet";

const app = express();
dotevn.config();

app.use(cors({
    origin: process.env.NODE_ENV === "production" ? "https://client-o608.onrender.com" : "http://localhost:3000", // Allow requests from this origin
    methods: ['GET', 'POST'], // Allow specific methods
    allowedHeaders: ['Content-Type'], // Allow specific headers
    credentials: true // Allow credentials (cookies, authorization headers, etc.)
}));

app.use(express.json());
app.use(fileUpload());
app.use(cookieParser());
//app.use(helmet());
MongoDB();

const httpServer = createServer(app);

// Configure CORS for Socket.IO
const io = new Server(httpServer, {
    cors: {
        origin: process.env.NODE_ENV === "production" ? "https://client-o608.onrender.com" : "http://localhost:3000", // Allow requests from this origin
        methods: ['GET', 'POST'], // Allow specific methods
        allowedHeaders: ['Content-Type'], // Allow specific headers
        credentials: true // Allow credentials (cookies, authorization headers, etc.)
    }
});

const admin = [];
const activeChats = [];

const getRandomActiveAdmin = (admin) => {
    return admin[Math.floor(Math.random() * admin.length)].id;
}

//activeChats will store client side ids and server side socket ids to a particlular conversation

global.io = io;

io.on("connection", (socket) => {

    socket.on("admin is logged in", (adminName) => {
        admin.push({ id: socket.id, adminName: adminName });
    })

    socket.on("client side message", (msg) => {
        if (admin.length === 0) {
            socket.emit("no admin is logged in", "No admin currently");
        } else {
            const client = activeChats.find((item) => item.clientId === socket.id);
            let targetAdminId;
            if (client) {
                targetAdminId = client.adminId;
            } else {

                targetAdminId = getRandomActiveAdmin(admin);
                activeChats.push({ clientId: socket.id, adminId: targetAdminId });

            }
            socket.broadcast.to(targetAdminId).emit("message sent from client to admin", {
                message: msg,
                user: socket.id
            })
        }

    })

    socket.on("admin reply to client", ({ user, replyMessage }) => {

        socket.broadcast.to(user).emit("message sent from admin to client", {
            message: replyMessage
        })
    })

    socket.on("admin closes the chat", (socketId) => {

        socket.broadcast.to(socketId).emit("admin closed the chat", "chat closed by admin!!")
    })

    socket.on("disconnect", (reason) => {
        //console.log("A user disconnected");
        const adminIndex = admin.findIndex((item) => item.id === socket.id)
        if (adminIndex !== -1) {
            admin.slice(adminIndex, 1);
        }
        activeChats.filter((item) => item.adminId != socket.id);

        const clientIndex = activeChats.find((item) => item.clientId === socket.id)
        if (clientIndex !== -1) {
            activeChats.slice(clientIndex, 1);
        }
        socket.broadcast.emit("disconnected", { reason: reason, socketId: socket.id })
    });
});

app.get("/", (req, res) => {
    res.send("hello world!!");
});

app.use("/api", apiRoutes);

app.use((error, req, res, next) => {
    if (process.env.NODE_ENV === "development") {
        console.log(error);
        next(error);
    }
});

app.use((error, req, res, next) => {
    if (process.env.NODE_ENV === "development") {
        res.status(500).json({
            message: error.message,
            stack: error.stack,
        });
    } else {
        res.status(500).json({
            message: error.message,
        });
    }
});

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});
