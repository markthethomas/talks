const path = require("path");

const db = {};

// read the file and split it into lines
function loadTextFileFromDisk() {
    const fs = require("fs");
    const text = fs.readFileSync(path.resolve(__dirname, "./data.txt"), "utf8");
    const lines = text.split("\n").map((line) => line.trim());
    return lines;
}

const lines = loadTextFileFromDisk();

// create a database of documents
for (const [id, line] of lines.entries()) {
    db[id] = line;
}

console.log(Object.keys(db).length);

// search for a query
const search = (query) => {
    const terms = query.split(" ");
    const results = [];
    for (const term of terms) {
        for (const [id, line] of Object.entries(db)) {
            if (line.includes(term)) {
                results.push(id);
            }
        }
    }

    const final = [];
    for (const docId of results) {
        final.push({
            id: docId,
            text: db[docId],
        });
    }
    return final;
};

const results = search(process.argv[2]);
console.log({ results });
