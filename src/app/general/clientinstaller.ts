import { fstat } from "fs";

export class ClientInstaller
{
    public install(fileName : string, clientDirectory : string) {
        const DecompressZip = require('decompress-zip');
        let clientFile = clientDirectory + '/' + fileName;
        let unzipper = new DecompressZip(clientFile);

        unzipper.on('progress', (fileIndex, fileCount) => {
            console.log('Extracted file ' + (fileIndex + 1) + ' of ' + fileCount);
        });

        unzipper.extract({
            path: clientDirectory,
        });

        console.log("installing" + clientFile);
    }
}