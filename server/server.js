require('dotenv').config();
const express=require('express');
const cors=require('cors');
const morgan=require('morgan');
const http = require("http");
const { Server } = require("socket.io");
const connectDB = require("./config/db");


const app=express();
const PORT=process.env.PORT ||5000;

connectDB();

//middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
    },
});

const webhookRoutes = require("./routes/webhookRoutes")(io);
app.use('/api',webhookRoutes);


io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

app.get("/", (req, res) => {
  res.send("Server is running...");
});

server.listen(5000, () => {
  console.log("Server is running on port 5000");
});