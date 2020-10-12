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

    socket.on("message", (data) => {});

    socket.on("close", (code, reason) => {
        console.log("Cliend is disconnected", code);
    });

    socket.on("error", (err) => {
        console.log(err);
    });
});

function Request(req) {
    if (!client) {
        return "Unable to connect with client";
    }

    client.send(JSON.stringify(req));

    return new Promise((resolve, reject) => {
        client.on("message", (data) => {
            resolve(data);
        });
        client.on("error", (err) => {
            reject("Unable to retirve data");
        });
    });
}

app.get("/sales", async (req, res) => {
    try {
        const response = await Request({
            path: "/sale",
            start: req.query.start,
            end: req.query.end,
            person: req.query.customer,
            product: req.query.product,
        });
        res.json(JSON.parse(response));
    } catch (error) {
        return res.status(500).send("Error in client side");
    }
});

app.get("/buy", async (req, res) => {
    try {
        const response = await Request({
            path: "/buy",
            start: req.query.start,
            end: req.query.end,
            person: req.query.saler,
            product: req.query.product,
        });

        res.json(JSON.parse(response));
    } catch (error) {
        return res.status(500).send("Error in client side");
    }
});
