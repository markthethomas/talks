class JSONDB {
    constructor(path) {
        if (!fs.existsSync(this.path + ".log")) {
            fs.writeFileSync(this.path + ".log", "");
        }
        this.WALFlushInterval = 3000;
        this.replay();
        this.WALinterval = setInterval(this.replay, this.WALFlushInterval);
    }

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
    // START OMIT
    replay() {
        if (!fs.existsSync(this.path + ".log")) return;
        const logFile = fs.readFileSync(this.path + ".log", "utf8"); // HL
        const entries = logFile.split("\n");

        const sortedEntries = entries // HL
            .filter((line) => line.length > 0) // HL
            .map(JSON.parse) // HL
            .sort((a, b) => a.ts - b.ts); // HL

        for (let line of sortedEntries) {
            const { key, value, action } = line;
            if (action === "set") {
                this.data[key] = value; // HL
            } else if (action === "delete") {
                delete this.data[key]; // HL
            }
        }
        fs.unlinkSync(this.path + ".log"); // HL
        fs.writeFileSync(this.path, JSON.stringify(this.data)); // HL
    }
    // END OMIT
    close() {
        console.info("Closing DB");
        clearInterval(this.WALinterval);
        this.replay();
    }
}
