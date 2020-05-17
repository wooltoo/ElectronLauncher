import { InstallCallback } from "./installcallback";
import { DownloadFile } from "./downloadfile";
import { FileRemover } from "./fileremover";

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
        }, (currCount : number, fileCount : number, progress : number) => {

            if (this.installCallback)
                this.installCallback.OnInstallProgressUpdate(downloadFile, progress, currCount, fileCount);
            
            if (progress == 1) {
                FileRemover.remove(downloadFile.getFullLocalPath());

                if (this.installCallback)
                    this.installCallback.OnInstallExtractionCompleted(downloadFile);
                
                if (completeFunc)
                    completeFunc();
            }
        });

    }
}