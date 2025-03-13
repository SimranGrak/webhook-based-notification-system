require('dotenv').config();       //load environment variables
const express=require('express');
const cors=require('cors');
const morgan=require('morgan');
const http = require("http");   //make an http server
const { Server } = require("socket.io");    //require server for the real-time connection
const connectDB = require("./config/db");     //connect with mongodb


const app=express();
const PORT=process.env.PORT ||5000;

connectDB();

//middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));     //for debugging 

const server = http.createServer(app);
const io = new Server(server, {        //maintains a server and cors for clearing the error between different ports
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
    },
});

const webhookRoutes = require("./routes/webhookRoutes")(io);    //it maintain the different server for the real-time updates
app.use('/api',webhookRoutes);


io.on("connection", (socket) => {        //to check the user connect with real time
  console.log("A user connected");   

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

app.get("/", (req, res) => {
  res.send("Server is running...");
});

server.listen(PORT, () => {
  console.log("Server is running on port 5000");
});