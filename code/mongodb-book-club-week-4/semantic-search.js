const { HierarchicalNSW } = require("hnswlib-node");
require("@tensorflow/tfjs-node");
const use = require("@tensorflow-models/universal-sentence-encoder");
const fs = require("fs");
const winkNLP = require("wink-nlp");
const model = require("wink-eng-lite-web-model");
const path = require("path");

const BM25Vectorizer = require("wink-nlp/utilities/bm25-vectorizer");
// Instantiate a vectorizer with the default configuration — no input config
// parameter indicates use default.
const bm25 = BM25Vectorizer();

// const spacy = require('spacy');
// import spacy from 'spacy'

const numDimensions = 512; // the length of data point vector that will be indexed.
const idx = new HierarchicalNSW("l2", numDimensions);
idx.initIndex(1000000);
// inserting data points to index.
const nlp = winkNLP(model);

async function getEntitiesFromText(text) {
    return nlp.readDoc(text).entities().out();
}

function getSentences(text) {
    return nlp.readDoc(text).sentences().out();
}

function loadTextFileFromDisk() {
    const fs = require("fs");
    const text = fs.readFileSync(path.resolve(__dirname, "./data.txt"), "utf8");
    return getSentences(text);
    // const lines = text.split("\n").map((line) => line.trim());
    // return lines;
}

(async () => {
    const db = {};
    const lines = loadTextFileFromDisk();
    for (const [id, line] of lines.entries()) {
        db[id] = line.toLowerCase();
    }

    const useModel = await use.load();
    idx.initIndex(100000);
    console.log("building index...");
    let i = 0;
    console.log(lines.length);

    if (!fs.existsSync("db.dat")) {
        for (const line of lines) {
            const embedding = await useModel.embed([line]);
            idx.addPoint(embedding.arraySync()[0], i);
            i++;
            console.log(i);
        }
        await idx.writeIndex("db.dat");
    }

    await idx.readIndex("db.dat");

    const query = process.argv[2];
    const queryEmbedding = await useModel.embed([query]);
    const knnRes = await idx.searchKnn(queryEmbedding.arraySync()[0], 5);
    knnRes.neighbors.forEach((id) => {
        console.log(db[id]);
    });
})();
