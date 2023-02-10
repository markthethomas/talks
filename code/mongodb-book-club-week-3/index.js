class Trie {
    constructor() {
        this.rootNode = {};
    }
    add(str) {
        let currentNode = this.rootNode;
        for (const seg of str) {
            if (!currentNode.hasOwnProperty(seg)) {
                currentNode[seg] = {};
            }
            currentNode = currentNode[seg];
        }
    }
    has(str) {
        let currentNode = this.rootNode;
        if (!str.length) {
            return false;
        }
        for (const seg of str) {
            if (currentNode.hasOwnProperty(seg)) {
                currentNode = currentNode[seg];
                continue;
            }
            return false;
        }
        return true;
    }
}

const generateRandomStringWithLength = (length) => {
    let result = "";
    const characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(
            Math.floor(Math.random() * charactersLength)
        );
    }
    return result;
};

const getRandomNumberBetween = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1) + min);
};

console.time("createArray");
const hayStack = Array(1000000)
    .fill()
    .map(() => generateRandomStringWithLength(getRandomNumberBetween(1, 25)));
console.timeEnd("createArray");

// START OMIT

const needle = "blah";
const t = new Trie();
// let result = "";
for (const i of hayStack) {
    t.add(i);
}
console.time("find");
console.log(t.has(needle));
console.timeEnd("find");
// END OMIT
