export class DownloadFile
{
    constructor(private name : string, 
                private md5 : string, 
                private resource : string,
                private fileName : string ) { }

    public getName() : string {
        return this.name;
    }

    public getMD5() : string {
        return this.md5;
    }

    public getResource() : string {
        return this.resource;
    }

    public getFileName() : string {
        return this.fileName;
    }
}