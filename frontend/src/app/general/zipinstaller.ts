import { InstallCallback } from "./installcallback";
import { DownloadFile } from "./downloadfile";
import { FileRemover } from "./fileremover";

import * as path from 'path';
const fs = require('fs');

export class ZipInstaller
{
    constructor(private installCallback : InstallCallback | undefined) { }

    public async install(downloadFile : DownloadFile, directory : string, completeFunc : (() => void) | null = null) {
        let clientFile = directory + '/' + downloadFile.getFileName();
        const AdmZip = require('../../custom_modules/adm-zip/adm-zip.js');
        let zip = new AdmZip(clientFile);

        if (this.installCallback)
            this.installCallback.OnInstallExtractionBegin();

        zip.extractAllToAsync(directory, true, (_error: any) => {
            if (_error) 
                console.log(_error);
            
            // This function is called when all the files have been extracted (assuming _error is undefined).
            FileRemover.remove(downloadFile.getFullLocalPath());

            if (this.installCallback)
                this.installCallback.OnInstallExtractionCompleted(downloadFile);
            
            if (completeFunc)
                completeFunc();
        }, (currCount : number, fileCount : number, progress : number) => {
            if (this.installCallback)
                this.installCallback.OnInstallProgressUpdate(downloadFile, progress, currCount, fileCount);
        });
        

        /*let clientFile = directory + '/' + downloadFile.getFileName();
        const AdmZip = require('../../custom_modules/adm-zip/adm-zip.js');
        let zip = new AdmZip(clientFile);

        if (this.installCallback)
            this.installCallback.OnInstallExtractionBegin();

        zip.extractAllTo(directory, true);*/

        /*
        console.log("EXTRACTION START!");

        if (this.installCallback)
            this.installCallback.OnInstallExtractionBegin();

        let zipFile = path.join(directory, downloadFile.getFileName());
        const StreamZip = require('node-stream-zip');
        let zip : any = new StreamZip({
            file: zipFile,
            storeEntries: true
        });

        let fileCount = zip.entriesCount;
        let currCount = 0;

        zip.on('error', (err: string | undefined) => { 
            throw new Error(err); 
        });

        zip.on('extract', (entry : any, file : any) => {
            console.log(`Extracted ${entry.name} to ${file}`);
            currCount++;
            let progress = currCount / fileCount;
            console.log("PROGRESS: " + progress + " => " + currCount + " - " + fileCount);
            this.installCallback?.OnInstallProgressUpdate(downloadFile, progress, currCount, fileCount);
            console.log("CALLED ONINSTALLPROGRESSUPDATE");
        });
        
        zip.on('ready', () => {
            fileCount = zip.entriesCount;

            zip.extract(null, directory, (err : any, count : any) => {
                if (err)
                    throw new Error(err);

                //FileRemover.remove(downloadFile.getFullLocalPath());

                //this.installCallback?.OnInstallExtractionCompleted(downloadFile);
                //if (completeFunc)
                //    completeFunc();

                zip.close();
            });
        });
        console.log("HERE");*/
    }
}