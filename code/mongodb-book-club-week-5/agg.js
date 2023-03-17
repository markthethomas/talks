const agg = {};

agg.$project = (data, callback) =>
    data.map((item) => {
        const result = {};
        const fields = callback(item);
        Object.entries(fields).forEach(([key, value]) => {
            if (value === 1) {
                const path = key.split(".");
                let current = item;
                path.forEach((pathItem) => {
                    current = current[pathItem];
                });
                result[key] = current;
            } else if (typeof value === "string" && value.startsWith("$")) {
                value = value.slice(1);
                const path = value.split(".");
                let current = item;
                path.forEach((pathItem) => {
                    current = current[pathItem];
                });
                result[key] = current;
            }
        });
        return result;
    });

agg.$match = (data, callback) => {
    return data.filter(callback);
};

agg.$unwind = (data, callback) => {
    return data.reduce((acc, item) => {
        const result = [...acc];
        const key = callback(item);
        const values = item[key];
        values.forEach((value) => {
            result.push({ ...item, [key]: value });
        });
        return result;
    }, []);
};

agg.$group = (data, callback) => {
    return data.reduce((acc, item) => {
        const result = [...acc];
        const key = callback(item);
        const group = result.find((item) => item._id === key);
        if (group) {
            group.count += 1;
        } else {
            result.push({ _id: key, count: 1 });
        }
        return result;
    }, []);
};

// $lookup operation; takes in a collection to join with
agg.$lookup = (data, callback) => {
    return data.map((item) => {
        const result = { ...item };
        const { from, localField, foreignField, as } = callback(item);
        const foreignItem = from.find((foreignItem) => {
            return foreignItem[foreignField] === item[localField];
        });
        result[as] = foreignItem;
        return result;
    });
};

// $sort operation; gives you the ability to sort by a particular field of the document
agg.$sort = (data, callback) => data.sort(callback);

// Aggregate function
const aggregate = (data, pipeline) => {
    return pipeline.reduce((acc, item) => {
        const [key, callback] = Object.entries(item)[0];
        return agg[key](acc, callback);
    }, data);
};

const generateID = () => {
    return Math.floor(Math.random() * 100000000);
};

// Test data. Ages should be random between 20 and 30 and the hobbies should be mixese of ["baseball", "golf", "tennis"]
const data = [
    {
        _id: generateID(),
        name: "John U",
        age: 25,
        hobbies: ["baseball", "golf"],
    },
    {
        _id: generateID(),
        name: "Jane L",
        age: 24,
        hobbies: ["baseball"],
    },
    {
        _id: generateID(),
        name: "Jack E",
        age: 29,
        hobbies: ["baseball"],
    },
    {
        _id: generateID(),
        name: "Jill G",
        age: 30,
        hobbies: ["baseball", "tennis"],
    },
    {
        _id: generateID(),
        name: "Joe P",
        age: 31,
        hobbies: ["baseball"],
    },
    {
        _id: generateID(),
        name: "Jen",
        age: 30,
        hobbies: ["golf"],
    },
    {
        _id: generateID(),
        name: "Jim H",
        age: 28,
        hobbies: ["golf"],
    },
    {
        _id: generateID(),
        name: "Jimmy",
        age: 27,
        hobbies: ["golf"],
    },
    {
        _id: generateID(),
        name: "Jimmie S",
        age: 32,
        hobbies: ["baseball", "golf", "tennis"],
    },
    {
        _id: generateID(),
        name: "Jimmie E",
        age: 30,
        hobbies: ["baseball", "golf", "tennis"],
    },
    {
        _id: generateID(),
        name: "John A",
        age: 25,
        hobbies: ["baseball", "golf"],
    },
    {
        _id: generateID(),
        name: "Jane",
        age: 24,
        hobbies: ["baseball"],
    },
    {
        _id: generateID(),
        name: "Jack Jack",
        age: 29,
        hobbies: ["baseball"],
    },
    {
        _id: generateID(),
        name: "Jill O",
        age: 30,
        hobbies: ["baseball", "tennis"],
    },
    {
        _id: generateID(),
        name: "Joe V",
        age: 31,
        hobbies: ["baseball", "tennis"],
    },
    {
        _id: generateID(),
        name: "Jen K",
        age: 30,
        hobbies: ["golf", "tennis"],
    },
    {
        _id: generateID(),
        name: "Jim J",
        age: 28,
        hobbies: ["golf", "tennis"],
    },
    {
        _id: generateID(),
        name: "Jimmy I",
        age: 27,
        hobbies: ["golf"],
    },
    {
        _id: generateID(),
        name: "Jimmie M",
        age: 32,
        hobbies: ["baseball", "golf"],
    },
    {
        _id: generateID(),
        name: "Jimmie Z",
        age: 30,
        hobbies: ["baseball", "golf"],
    },
    {
        _id: generateID(),
        name: "John T",
        age: 25,
        hobbies: ["baseball", "golf"],
    },
    {
        _id: generateID(),
        name: "Jane D",
        age: 24,
        hobbies: ["baseball"],
    },
    {
        _id: generateID(),
        name: "Jack C",
        age: 29,
        hobbies: ["baseball"],
    },
    {
        _id: generateID(),
        name: "Jill E",
        age: 30,
        hobbies: ["baseball"],
    },
    {
        _id: generateID(),
        name: "Joe Q",
        age: 31,
        hobbies: ["baseball"],
    },
    {
        _id: generateID(),
        name: "Jen B",
        age: 30,
        hobbies: ["golf"],
    },
    {
        _id: generateID(),
        name: "Jim D",
        age: 28,
        hobbies: ["golf"],
    },
];

const hobbies = [
    {
        _id: 1,
        name: "baseball",
        players: 104220,
        description: "Truly the best sport ever",
    },
    {
        _id: 2,
        name: "golf",
        players: 14040,
        description: "Also the best sport ever",
    },
    {
        _id: 3,
        name: "tennis",
        players: 2142,
        description: "back and forth",
    },
];

const pipeline = [
    {
        $match: (item) => item.age > 25 && item.age < 32,
    },
    {
        $unwind: (item) => "hobbies",
    },
    {
        $group: (item) => item.hobbies,
    },
    {
        $lookup: (item) => ({
            from: hobbies,
            localField: "_id",
            foreignField: "name",
            as: "hobby",
        }),
    },
    {
        $project: (item) => ({
            _id: 0,
            hobbyists: "$count",
            name: "$hobby.name",
            description: "$hobby.description",
            sportPlayers: "$hobby.players",
        }),
    },
    {
        $sort: (a, b) => {
            return b.hobbyists - a.hobbyists;
        },
    },
];

console.log(`Items in data: ${data.length}`);
console.log(`Items in hobbies: ${hobbies.length}`);
console.log(`Pipeline steps: ${pipeline.length}`);

// run the pipeline
const result = aggregate(data, pipeline);
console.log(`result: ${JSON.stringify(result, null, 2)}`);
