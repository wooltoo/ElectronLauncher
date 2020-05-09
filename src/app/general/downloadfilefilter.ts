
import {DownloadFile} from './downloadfile';
import { DownloadListService } from '../download-list.service';
import { TargetPath } from './targetpath';
import * as path from 'path';

const md5File = require('md5-file')

export class DownloadFileFilter
{
    constructor(private downloadListService : DownloadListService) { }

    public filterFromInstalled(files : DownloadFile[]) : DownloadFile[] {
        if (!files)
            return [];

        let uninstalledFiles : DownloadFile[] = [] ;

        files.forEach((patch : DownloadFile) => {
            if (!this.isInstalled(patch))
                uninstalledFiles.push(patch);
        });

        return uninstalledFiles;
    }

    public getFilesToInstall() : DownloadFile[] {
        return this.filterFromInstalled(this.downloadListService.getFiles());
    }

    private isInstalled(file : DownloadFile) : boolean {
        let fullDir = path.join(TargetPath.process(file.getTarget()), file.getFileName());

        const fs = require('fs');
        if(!fs.existsSync(fullDir)) {
            return false;
        }

        let localMD5 = md5File.sync(fullDir);
        return localMD5 == file.getMD5();
    }
}