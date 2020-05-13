import { DownloadFile } from "./downloadfile";

export class Addon 
{
    downloadFile : DownloadFile;

    constructor(
                private id : number,
                private name : string,
                private description : string,
                private iconResource : string) 
    { }

    public getId() : number {
        return this.id;
    }

    public getName() : string { 
        return this.name;
    }

    public getDescription() : string {
        return this.description;
    }

    public setName(name : string) : void {
        this.name = name;
    }

    public setDescription(description : string) : void {
        this.description = description;
    }

    public setDownloadFile(downloadFile : DownloadFile) : void {
        this.downloadFile = downloadFile;
    }

    public getDownloadFile() : DownloadFile {
        return this.downloadFile;
    }

    public getIconResource() : string {
        return this.iconResource;
    }

    public setIconResource(iconResource : string) {
        this.iconResource = iconResource;
    }
}