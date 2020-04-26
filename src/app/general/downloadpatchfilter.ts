
import {DownloadFile} from './downloadfile';
import { DownloadListService } from '../download-list.service';

const md5File = require('md5-file')

export class DownloadPatchFilter
{
    constructor(private downloadListService : DownloadListService) { }

    public filterFromInstalled(patches : DownloadFile[]) : DownloadFile[] {
        let uninstalledPatches : DownloadFile[] = [] ;

        patches.forEach((patch : DownloadFile) => {
            if (!this.isInstalled(patch))
                uninstalledPatches.push(patch);
        });

        return uninstalledPatches;
    }

    public getPatchesToInstall() : DownloadFile[] {
        return this.filterFromInstalled(
            this.downloadListService.getPatches()
        );
    }

    private isInstalled(patch : DownloadFile) : boolean {
        let installDir = "D:/DownloadTest";
        let fullDir = installDir + '/' + patch.getName();

        const fs = require('fs');
        if(!fs.existsSync(fullDir)) {
            return false;
        }

        let localMD5 = md5File.sync(fullDir);
        return localMD5 == patch.getMD5();
    }
}