const fs = require("fs");
const JSONDB = require("./jsonDB");

async function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
    const db = new JSONDB("data.json");
    try {
        await sleep(2000);
        let lastWrite = null;
        for (let i = 0; i < 100000; i++) {
            const key = Math.random();
            const value = Math.random();
            lastWrite = {
                key: i,
                value,
            };
            db.set(i, value);
            if (i === 132) {
                throw new Error(
                    `FATAL CRASH! Last write: ${JSON.stringify(lastWrite)}`
                );
            }
        }
    } catch (error) {
        await sleep(3000);
        console.error(error);
        console.log("\n");
        await sleep(2000);
        console.info("Recovering from crash...");

        // read the last 10 lines of the WAL
        const logFile = fs.readFileSync("data.json.log", "utf8");
        const entries = logFile.split("\n");
        const lastTenEntries = entries
            .filter((line) => line.length > 0)
            .slice(-10);
        console.info("Last 10 entries in WAL:", lastTenEntries);
        console.log("\n");

        await sleep(2000);

        db.replay();
        console.log(`Recovered value for key 132: ${db.get(132)}`);

        await sleep(2000);
        db.close();
    }
}

main();
