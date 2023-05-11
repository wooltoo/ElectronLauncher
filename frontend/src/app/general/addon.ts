import { DownloadFile } from "./downloadfile";

import * as fs from 'fs';
import * as path  from 'path';
import { ClientHelper } from "./clienthelper";

export class Addon 
{
    constructor(
                private id : number,
                private name : string,
                private description : string,
                private iconResource : string,
                private folderName : string,
                private downloadFileId : number) 
    { }

    public isInstalled() : boolean {
        return fs.existsSync(this.getFolderPath());
    }

    public getFolderPath() : string {
        let dir : string | undefined | null = ClientHelper.getInstance().getClientDirectory();
        if (!dir)
            throw new Error('Could not get folder path for addon. Client installation directory not detected.');

        return path.join(
            dir,
            'Interface',
            'AddOns',
            this.getFolderName()
        );
    }

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

    public getIconResource() : string {
        return this.iconResource;
    }

    public setIconResource(iconResource : string) {
        this.iconResource = iconResource;
    }

    public getFolderName() : string {
        return this.folderName;
    }

    public setFolderName(folderName : string) : void {
        this.folderName = folderName;
    }

    public getDownloadFileId() : number {
        return this.downloadFileId;
    }

    public setDownloadFileId(id : number) : void {
        this.downloadFileId = id;
    }
}