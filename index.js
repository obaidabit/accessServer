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
        console.log("Cliend is disconnected", code);
    });

    socket.on("error", (err) => {
        console.log(err);
    });
});

function Request(req) {
    client.send(req);
    return new Promise((resolve, reject) => {
        client.on("message", (data) => {
            resolve(data);
        });
        client.on("error", (err) => {
            reject("Unable to retirve data");
        });
    });
}

app.get("/", async (req, res) => {
    if (!client) {
        return res.status(500).send("Unable to retrive data");
    }
    res.send(await Request("GET /"));
});
