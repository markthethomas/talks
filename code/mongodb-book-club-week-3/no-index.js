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

console.time("find");

// START OMIT

const needle = "blah";
let result = "";
for (let i = 0; i < hayStack.length; i++) {
    if (hayStack[i] === needle) {
        result = hayStack[i];
        break;
    }
}

console.log(hayStack.includes(needle));
// END OMIT
console.timeEnd("find");
