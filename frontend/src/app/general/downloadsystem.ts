import { DownloadFile } from '../general/downloadfile';
import { InstallState } from './installstate';
import { DownloadHelper } from './downloadhelper';
import { DownloadFileFilter } from './downloadfilefilter';
import { ClientHelper } from './clienthelper';
import { FileRemover } from './fileremover';
import * as path from 'path';
import { LauncherConfig } from './launcherconfig';
import { DownloadListService } from '../download-list.service';
import { TouchBarScrubber } from 'electron';

export class DownloadSystem
{
    private static instance : DownloadSystem;

    private downloadHelper : DownloadHelper;
    private downloadFileFilter : DownloadFileFilter | undefined;

    private downloadListService : DownloadListService  | undefined;
    private installState : InstallState | undefined;
    private isCheckingForFilesToDownload : boolean = false;

    private constructor() {
        this.downloadHelper = new DownloadHelper();
        this.startCheckForFilesToDownload();
    }

    public static getInstance() : DownloadSystem {
        if (!this.instance)
            this.instance = new DownloadSystem();

        return this.instance;
    }

    public setDownloadListService(downloadListService : DownloadListService) : DownloadSystem {
        this.downloadListService = downloadListService;    
        return this;
    }

    public setInstallState(installState : InstallState) : DownloadSystem {
        if (!this.downloadListService)
            throw new Error('DownloadListService is not set. Can not set install state.');

        this.installState = installState;
        
        this.downloadListService.observe(this.downloadHelper);
        this.downloadHelper.setInstallState(installState);

        this.downloadFileFilter = new DownloadFileFilter(this.downloadListService);
        this.installState.OnEnterState();
        return this;
    }

    public queueFront(file : DownloadFile) : DownloadSystem {
        this.downloadHelper.queueSingle(file, true);
        return this;
    }

    public queue(files : DownloadFile[]) : DownloadSystem {
        this.downloadHelper.queue(files);
        return this;
    }

    public pause() : DownloadSystem {
        this.downloadHelper.pause();
        return this;
    }

    public resume() : DownloadSystem {
        this.downloadHelper.resume();
        return this;
    }

    public cancel() : DownloadSystem {
        this.downloadHelper.interrupt();
        return this;
    }

    // Should download all files, e.g. patches/exes/resources that are missing or have mismatching MD5.
    public queueClient() : DownloadSystem {    
        this.addClientDownload();
        return this;
    }

    public queuePatches() : DownloadSystem {
        if (!this.downloadFileFilter)
            throw new Error('Could not get files to install');

        this.queue(this.downloadFileFilter.getFilesToInstall());
        return this;
    }

    public isDownloading() : boolean {
        return this.downloadHelper.isDownloading();
    }

    // Adds client to be downloaded.
    private addClientDownload() : void {
        // Clear old client download files.

        let dir : string | undefined | null = ClientHelper.getInstance().getClientDirectory();
        if (dir) {
            FileRemover.remove(
                path.join(dir, LauncherConfig.CLIENT_FILE_NAME)
            );
        }

        if (!this.downloadListService)
            throw new Error('Can not add client download. Download list service is not set.')    
        
        let client : DownloadFile | null = this.downloadListService.getClient();
        if (!client)
            throw new Error('Could not fetch client download file.');


        let targetDir : string | undefined | null = ClientHelper.getInstance().getRequestedClientDirectory();
        if (!targetDir)
            throw new Error('Could not locate target directory.');

        client.setTarget(targetDir);
        this.downloadHelper.queueSingle(client);
    }

    private startCheckForFilesToDownload() : void {
        if (this.isCheckingForFilesToDownload)
            return;

        setInterval(() => {
            if (!ClientHelper.getInstance().hasClientInstalled())
                return;

            if (!this.downloadListService) 
                throw new Error('Can not check for files to download. Download list service is not set.');

            if (!this.installState)
                throw new Error('Can not check for files to download. Install state is not set.');

            let filter : DownloadFileFilter = new DownloadFileFilter(this.downloadListService);
            this.installState.OnFilesToDownloadResult(
                filter.getFilesToInstall().length > 0
            );
        }, LauncherConfig.INTERVAL_CHECK_FOR_PATCH_TO_DL);
        this.isCheckingForFilesToDownload = true;
    }
}