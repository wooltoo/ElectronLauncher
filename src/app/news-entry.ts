export class NewsEntry {
    title : string;
    datetime : string;
    text : string;

    constructor(title, datetime, text) {
        this.title = title;
        this.datetime = datetime;
        this.text = text;
    }

    getTitle() : string {
        return this.title;
    }

    getDateTime() : string {
        return this.datetime;
    }

    getText() : string {
        return this.text;
    }
}
