// START OMIT
class JSONDB {
    constructor(path) {
        // ...
        if (!fs.existsSync(this.path + ".log")) {
            fs.writeFileSync(this.path + ".log", ""); // HL
        }
        this.WALFlushInterval = 3000;
        // more on this shortly
        this.replay();
        this.WALinterval = setInterval(this.replay, this.WALFlushInterval);
    }
    //...
    // END OMIT
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
    replay() {
        if (!fs.existsSync(this.path + ".log")) return;
        let logFile = fs.readFileSync(this.path + ".log", "utf8");
        let entries = logFile.split("\n");

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
}
