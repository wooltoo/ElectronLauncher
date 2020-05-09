import { InstallCallback } from "./installcallback";
import { DownloadFile } from "./downloadfile";

export class ZipInstaller
{
    constructor(private installCallback : InstallCallback) { }

    public async install(downloadFile : DownloadFile, directory : string, completeFunc = null) {
        let clientFile = directory + '/' + downloadFile.getFileName();
        const AdmZip = require('../../custom_modules/adm-zip/adm-zip.js');
        let zip = new AdmZip(clientFile);
        let entries = zip.getEntries();

        zip.extractAllToAsync(directory, true, (error) => {
            if (error) console.log(error);
        }, (currCount : number, fileCount : number, progress : number) => {
            this.installCallback.OnInstallProgressUpdate(downloadFile, progress, currCount, fileCount);
            if (progress == 1) {
                this.installCallback.OnInstallExtractionCompleted(downloadFile);
                if (completeFunc)
                    completeFunc();
            }
        });
    }
}