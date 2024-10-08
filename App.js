const express = require("express");
const { createServer } = require("http");
const path = require("path");
const { Server } = require("socket.io");
const session = require('express-session');
const mongoose = require("mongoose");
const MongoStore = require('connect-mongo');

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);
Port = process.env.PORT;

const sessionMiddleware = session({
    secret: "changeit",
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({ mongoUrl: `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.zmi7wvh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0` })
});

app.use(sessionMiddleware);
io.engine.use(sessionMiddleware);

app.set("view engine", "hbs");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }))

app.get("/", (req, res) => {
    res.render("home");
})

app.get("/login", (req, res) => {
    if (req.session.isLogin) {
        return res.redirect("/profile");
    }
    res.render("login");
})

app.post("/login", (req, res) => {
    const { name } = req.body;
    req.session.name = name;
    req.session.isLogin = true;
    res.redirect("/profile");
})

app.get("/profile", (req, res) => {
    if (!req.session.isLogin) {
        return res.redirect("/login");
    }
    res.render("profile", {
        name: req.session.name
    });
})

app.get("/logout", (req, res) => {
    req.session.destroy((err) => {
        if (err) res.send(err);
        res.redirect("/");
    })
})

io.on("connection", (socket) => {

    require("./Socket/newUser")(socket, io);

    require("./Socket/newmessage")(socket, io);

    require("./Socket/disconnect")(socket, io);


})

mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.zmi7wvh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`)
    .then(() => {
        httpServer.listen(Port, () => {
            console.log("Server Running at Port", Port);
        })
    }).catch(() => {
        console.log("unable to connect");
    })
