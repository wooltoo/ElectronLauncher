export class DownloadFile
{
    constructor(private name : string, 
                private md5 : string, 
                private resource : string ) { }

    getName() : string {
        return this.name;
    }

    getMD5() : string {
        return this.md5;
    }

    getResource() : string {
        return this.resource;
    }
}