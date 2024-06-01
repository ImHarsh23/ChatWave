const express = require("express");
const { createServer } = require("http");
const path = require("path");
const { Server } = require("socket.io");

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);
Port = 4000;

app.set("view engine", "hbs");
app.use(express.static(path.join(__dirname, "public")));

let userMap ={};

app.get("/", (req, res)=>{
    res.render("index");
})

io.on("connection", (socket)=>{
    // console.log("Connection establish", socket.id);

    require("./Socket/newUser")(socket, userMap, io);
 
    require("./Socket/newmessage")(socket, userMap, io);

    require("./Socket/disconnect")(socket, userMap, io);

    
})

httpServer.listen(Port, ()=>{
    console.log("Server Running at Port", Port);
})