import { InstallCallback } from "./installcallback";
import { DownloadFile } from "./downloadfile";

export class ZipInstaller
{
    constructor(private installCallback : InstallCallback) { }

            /*const DecompressZip = require('decompress-zip');
        let clientFile = directory + '/' + downloadFile.getFileName();
        let unzipper = new DecompressZip(clientFile);

        unzipper.on('progress', (fileIndex, fileCount) => {
            let progress : number = (fileIndex + 1) / fileCount;
            this.installCallback.OnInstallProgressUpdate(downloadFile, progress, fileIndex + 1, fileCount);

            console.log("fileIndex: " + (fileIndex + 1) + " fileCount " + fileCount);
            if (fileIndex + 1 == fileCount) {
                console.log("CALLBACK #1");
                this.installCallback.OnInstallProgressUpdate(downloadFile, 1, fileIndex + 1, fileCount);
                this.installCallback.OnInstallExtractionCompleted(downloadFile);
            }
        });

        unzipper.extract({
            path: directory,
        });*/

    public async install(downloadFile : DownloadFile, directory : string) {
        let clientFile = directory + '/' + downloadFile.getFileName();
        const AdmZip = require('../../custom_modules/adm-zip/adm-zip.js');
        let zip = new AdmZip(clientFile);
        let entries = zip.getEntries();

        zip.extractAllToAsync(directory, true, (error) => {
            if (error) console.log(error);

            console.log("DONE EXTRACTING ALL ASYNC");
        }, (currCount : number, fileCount : number, progress : number) => {
            this.installCallback.OnInstallProgressUpdate(downloadFile, progress, currCount, fileCount);
            if (progress == 1) {
                this.installCallback.OnInstallExtractionCompleted(downloadFile);
            }
        });
    }
}