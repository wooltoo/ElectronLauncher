import { TargetPath } from "./targetpath";
import * as path from 'path';
import { ClientHelper } from "./clienthelper";

export enum DownloadFileType 
{
    patch,
    client,
    resource,
    addon
}

export class DownloadFile
{
    constructor(
                private id : number,
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

    public getId() : number {
        return this.id;
    }

    public setId(id : number) : void {
        this.id = id;
    }

    public getName() : string {
        return this.name;
    }

    public setName(name : string) : void {
        this.name = name;
    }

    public getType() : DownloadFileType {
        return this.type;
    }

    public setType(downloadFileType : DownloadFileType) : void {
        this.type = downloadFileType;
    }

    public getMD5() : string {
        return this.md5;
    }

    public setMD5(md5 : string) : void {
        this.md5 = md5;
    }

    public getResource() : string {
        return this.resource;
    }

    public setResource(resource : string) : void {
        this.resource = resource;
    }

    public getFileName() : string {
        return this.fileName;
    }

    public setFileName(fileName : string) : void {
        this.fileName = fileName;
    }

    public getExtract() : boolean {
        return this.extract;
    }

    public setExtract(extract : boolean) {
        this.extract = extract;
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

    public setFileSize(fileSize : number) {
        this.fileSize = fileSize;
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