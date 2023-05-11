export class NewsEntry {
    constructor(private id : number,
                private title : string, 
                private datetime : string, 
                private text : string) 
    { }

    public getId() : number {
        return this.id;
    }

    public getTitle() : string {
        return this.title;
    }

    public getDateTime() : string {
        return this.datetime;
    }

    public getText() : string {
        return this.text;
    }

    public setId(id : number) : void {
        this.id = id;
    }

    public setTitle(title : string) : void {
        this.title = title;
    }

    public setDateTime(dateTime : string) : void {
        this.datetime = dateTime;
    }

    public setText(text : string) : void {
        this.text = text;
    }
}
