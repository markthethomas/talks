// START`
const fs = require("fs");
const http = require("http");

// ignoring errors everywhere for simplicity
module.exports = class JSONDB {
    constructor(path) {
        console.info("Opening DB");
        this.path = path;
        if (!fs.existsSync(this.path)) {
            fs.writeFileSync(this.path, JSON.stringify({}));
        }
        this.data = JSON.parse(fs.readFileSync(this.path, "utf8"));
        if (!fs.existsSync(this.path + ".log")) {
            fs.writeFileSync(this.path + ".log", "");
        }
        this.WALFlushInterval = 3000;
        this.replay();
        this.WALinterval = setInterval(this.replay, this.WALFlushInterval);
    }
    // create a WAL entry
    log(action, key, value) {
        console.log("Logging to WAL: ", action, key, value);
        const logEntry = JSON.stringify({
            key,
            value,
            action,
            ts: new Date().getTime(),
        });
        fs.appendFileSync(this.path + ".log", logEntry + "\n");
    }
    // replay the WAL
    replay() {
        if (!fs.existsSync(this.path + ".log")) return;
        const logFile = fs.readFileSync(this.path + ".log", "utf8");
        const entries = logFile.split("\n");

        const sortedEntries = entries
            .filter((line) => line.length > 0)
            .map(JSON.parse)
            .sort((a, b) => a.ts - b.ts);

        console.info("Replaying", sortedEntries.length, "entries");

        for (let line of sortedEntries) {
            const { key, value, action } = line;
            if (action === "set") {
                this.data[key] = value;
            } else if (action === "delete") {
                delete this.data[key];
            }
        }
        fs.unlinkSync(this.path + ".log");
        fs.writeFileSync(this.path, JSON.stringify(this.data));
    }
    close() {
        console.info("Closing DB");
        clearInterval(this.WALinterval);
        this.replay();
    }
    get(key) {
        return this.data[key];
    }
    set(key, value, writeToWAL = true) {
        if (writeToWAL) this.log("set", key, value);
        this.data[key] = value;
    }
    delete(key, writeToWAL = true) {
        if (writeToWAL) this.log("delete", key);
        delete this.data[key];
    }
    connect() {
        console.info("Starting JSONDB server");
        // create an HTTP server and listen for commands
        this.server = http.createServer((req, res) => {
            if (req.method !== "POST") {
                res.statusCode = 400;
                res.end("Bad Request");
                return;
            }

            // parse the JSON body
            let body = "";
            req.on("data", (chunk) => {
                body += chunk;
            });
            req.on("end", () => {
                let data = JSON.parse(body);
                // execute the command
                if (data.action === "set") {
                    this.set(data.key, data.value);
                } else if (data.action === "delete") {
                    this.delete(data.key);
                } else if (data.action === "get") {
                    return res.end(JSON.stringify(this.get(data.key)));
                } else {
                    res.statusCode = 400;
                    res.end("Bad Request");
                    return;
                }
                // send the result back
                res.end(
                    JSON.stringify({
                        status: "ok",
                    })
                );
            });
        });
        this.server.listen(2023, () => {
            console.info("JSONDB listening on port 2023");
        });
    }
    disconnect() {
        this.replay();
        clearInterval(this.WALinterval);
        this.server.close();
    }
};
