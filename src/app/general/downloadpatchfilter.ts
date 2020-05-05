
import {DownloadFile} from './downloadfile';
import { DownloadListService } from '../download-list.service';

const md5File = require('md5-file')

export class DownloadPatchFilter
{
    constructor(private downloadListService : DownloadListService) { }

    public filterFromInstalled(clientDirectory : string, patches : DownloadFile[]) : DownloadFile[] {
        if (!patches)
            return [];

        let uninstalledPatches : DownloadFile[] = [] ;

        patches.forEach((patch : DownloadFile) => {
            if (!this.isInstalled(clientDirectory, patch))
                uninstalledPatches.push(patch);
        });

        return uninstalledPatches;
    }

    public getPatchesToInstall(clientDirectory : string) : DownloadFile[] {
        return this.filterFromInstalled(
            clientDirectory, 
            this.downloadListService.getPatches()
        );
    }

    private isInstalled(clientDirectory : string, patch : DownloadFile) : boolean {
        let fullDir = clientDirectory + '/' + patch.getName();

        const fs = require('fs');
        if(!fs.existsSync(fullDir)) {
            return false;
        }

        let localMD5 = md5File.sync(fullDir);
        return localMD5 == patch.getMD5();
    }
}