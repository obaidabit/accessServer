const ws = require("ws");
const http = require("http");
const express = require("express");

const app = express();
const server = http.createServer(app);
let client;

server.listen(process.env.PORT || 4000, () => {
    console.log("Server is running on port 4000");
});

const wss = new ws.Server({ server });

wss.on("connection", (socket, request) => {
    client = socket;

    socket.on("message", (data) => {
        console.log(data);
    });

    socket.on("close", (code, reason) => {
        console.log("Cliend is connected", code);
    });

    socket.on("error", (err) => {
        console.log(err);
    });
});

app.get("/", (req, res) => {
    if (client) {
        client.send("I need data");
        return res.send("It is ok");
    }
    res.send("Hello world");
});
