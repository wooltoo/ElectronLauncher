import { TargetPath } from "./targetpath";
import * as path from 'path';
import { ClientHelper } from "./clienthelper";

export enum DownloadFileType 
{
    patch,
    client,
    resource
}

export class DownloadFile
{
    constructor(
                private id : string,
                private name : string, 
                private type : DownloadFileType,
                private md5 : string, 
                private resource : string,
                private fileName : string,
                private extract : boolean,
                private target : string,
                private fileSize : number) 
    { 
    
    }

    public static existsInArray(downloadFile : DownloadFile, array : DownloadFile[]) : boolean {
        array.forEach((item) => {
            if (item.getId() == downloadFile.getId())
                return true;
        });

        return false;
    }

    public getId() : string {
        return this.id;
    }

    public getName() : string {
        return this.name;
    }

    public getType() : DownloadFileType {
        return this.type;
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

    public getExtract() : boolean {
        return this.extract;
    }

    public getTarget() : string {
        return this.target;
    }

    public setTarget(target: string) : void {
        this.target = target;
    }

    public getFileSize() : number {
        return this.fileSize;
    }

    // Fetches the full local path of this DownloadFile.
    // e.g. D:\Client\Data\enGB\file.zip
    public getFullLocalPath() : string {
        return path.join(this.getLocalDirectory(), this.getFileName());
    }

    // Fetches the local directory of this DownloadFile.
    // e.g. D:\Client\Data\enGB
    public getLocalDirectory() : string {
        if (ClientHelper.getInstance().hasClientInstalled())
            return TargetPath.process(this.getTarget());
        else
            return this.getTarget();
    }
}