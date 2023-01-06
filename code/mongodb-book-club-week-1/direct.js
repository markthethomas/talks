const fs = require("fs");
const JSONDB = require("./jsonDB");

console.info(`${"=".repeat(10)}\nDirect access, no API \n${"=".repeat(10)}`);
const db = new JSONDB("data.json");

// write a ton of random keys to the DB
for (let i = 0; i < 100000; i++) {
    db.set(Math.random(), Math.random());
}

// log the size of the WAL
console.info("WAL size:", fs.statSync("data.json.log").size);

setTimeout(() => {
    db.close();
}, 3000);
