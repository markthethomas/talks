const path = require("path");

// a function that takes a string and returns a list of trigrams
const trigram = (text) => {
    const trigrams = [];
    for (let i = 0; i < text.length - 2; i++) {
        trigrams.push(text.slice(i, i + 3));
    }
    return trigrams;
};

const db = {};
// a data structure that will hold a list of documents for each term. It will also need to hold
// the frequency of each term in each document
const postingList = new Map();

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
    db[id] = line.toLowerCase();
}

const addPosting = (term, docId) => {
    if (!postingList.has(term)) {
        postingList.set(term, new Map());
    }
    const docMap = postingList.get(term);
    if (!docMap.has(docId)) {
        docMap.set(docId, 0);
    }
    docMap.set(docId, docMap.get(docId) + 1);
};

// a function that splits a document into terms and then into trigrams. It should then add the
// trigrams to the posting list. Needs to do counting etc. as well
const index = (docId, text) => {
    const terms = text.split(" ");
    for (const term of terms) {
        const trigrams = trigram(term);
        for (const trigram of trigrams) {
            addPosting(trigram, docId);
        }
    }
};

// a function that takes a query and returns a list of documents that match the query. It should process
// the query into trigrams for matching and then do a set intersection of the posting lists for each trigram. It should then sort
// the results by the number of matching trigrams for pseudo-relevance
const search = (query) => {
    const trigrams = trigram(query);
    const results = new Map();
    for (const trigram of trigrams) {
        const docMap = postingList.get(trigram);
        if (docMap) {
            for (const [docId, count] of docMap.entries()) {
                if (!results.has(docId)) {
                    results.set(docId, 0);
                }
                results.set(docId, results.get(docId) + count);
            }
        }
    }
    return Array.from(results.entries())
        .sort((a, b) => b[1] - a[1])
        .map(([docId, count]) => ({
            docId,
            count,
            text: db[docId],
        }));
};

// // index everything in the database
for (const [id, text] of Object.entries(db)) {
    index(id, text);
}

const results = search(process.argv[2].toLowerCase());
console.log({ results });
