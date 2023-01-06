class JSONDB {
    constructor() {
        this.data = {};
    }
    get(key) {
        return this.data[key];
    }
    set(key, value) {
        this.data[key] = value;
    }
    delete(key) {
        delete this.data[key];
    }
}
