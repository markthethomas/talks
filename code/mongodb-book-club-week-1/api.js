const fs = require("fs");
const http = require("http");
const JSONDB = require("./jsonDB");

console.info(`${"=".repeat(10)}\nNetwork API \n${"=".repeat(10)}`);

const dbAPI = new JSONDB("data.json");
dbAPI.connect();

// write a ton of random keys to the DB
for (let i = 0; i < 100; i++) {
    makeAPIRequest({
        action: "set",
        key: Math.random(),
        value: Math.random(),
    });
}

setTimeout(() => {
    dbAPI.disconnect();
}, 10000);

function makeAPIRequest(payload) {
    const data = JSON.stringify(payload);
    const options = {
        hostname: "localhost",
        port: 2023,
        path: "/",
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Content-Length": data.length,
        },
    };
    const req = http.request(options);

    req.on("error", console.error);
    req.write(data);
    req.end();
}
