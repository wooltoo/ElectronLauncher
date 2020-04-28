import { InstallCallback } from "./installcallback";
import { DownloadFile } from "./downloadfile";

export class ZipInstaller
{
    constructor(private installCallback : InstallCallback) { }

    public install(downloadFile : DownloadFile, directory : string) {
        const DecompressZip = require('decompress-zip');
        let clientFile = directory + '/' + downloadFile.getFileName();
        let unzipper = new DecompressZip(clientFile);

        unzipper.on('progress', (fileIndex, fileCount) => {
            let progress : number = (fileIndex + 1) / fileCount;
            this.installCallback.OnInstallProgressUpdate(downloadFile, progress);
            if (fileIndex + 1 == fileCount) 
                this.installCallback.OnInstallExtractionCompleted(downloadFile);
        });

        unzipper.extract({
            path: directory,
        });
    }
}