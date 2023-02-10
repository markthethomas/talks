class Trie {
    constructor() { this.rootNode = {}; }
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
