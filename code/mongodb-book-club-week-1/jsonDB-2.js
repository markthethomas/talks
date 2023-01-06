class JSONDB {
    constructor(path) {
        this.path = path;
        if (!fs.existsSync(this.path)) {
            fs.writeFileSync(this.path, JSON.stringify({}));
        }
        this.data = JSON.parse(fs.readFileSync(this.path, "utf8"));
    }
    get(key) {
        return this.data[key];
    }
    set(key, value) {
        this.data[key] = value;
        this.save();
    }
    delete(key) {
        delete this.data[key];
        this.save();
    }
    save() {
        fs.writeFileSync(this.path, JSON.stringify(this.data));
    }
}
