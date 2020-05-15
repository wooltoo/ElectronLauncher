import { DownloadFile } from '../general/downloadfile';
import { InstallState } from './installstate';
import { DownloadHelper } from './downloadhelper';
import { DownloadFileFilter } from './downloadfilefilter';
import { ClientHelper } from './clienthelper';
import { FileRemover } from './fileremover';
import * as path from 'path';
import { LauncherConfig } from './launcherconfig';

export class DownloadSystem
{
    private static instance : DownloadSystem;

    private downloadHelper : DownloadHelper = null;
    private downloadFileFilter : DownloadFileFilter = null;
    private installState : InstallState;

    private constructor() {}

    public static getInstance() : DownloadSystem {
        if (!this.instance)
            this.instance = new DownloadSystem();

        return this.instance;
    }

    public setInstallState(installState : InstallState) : void {
        this.installState = installState;
        this.downloadHelper = new DownloadHelper(installState, installState.GetDownloadListService());
        this.downloadFileFilter = new DownloadFileFilter(installState.GetDownloadListService());
        this.installState.OnEnterState();
    }

    public download(files : DownloadFile[]) : void {
        this.downloadHelper.add(files);
    }

    public pause() : void {
        this.downloadHelper.pause();
    }

    public resume() : void {
        this.downloadHelper.resume();
    }

    public cancel() : void {
        this.downloadHelper.interrupt();
    }

    // Should download all files, e.g. patches/exes/addons that are missing or have mismatching MD5.
    public downloadAll() : void {
        if (!ClientHelper.getInstance().hasClientInstalled()) 
            this.addClientDownload();
        else {
            this.downloadHelper.add(this.downloadFileFilter.getFilesToInstall());
        }
        
        this.start();
    }

    public start() : boolean {
        if (!this.downloadHelper)
            return false;

        this.downloadHelper.download();
        return true;
    }

    public isDownloading() : boolean {
        return this.downloadHelper.isDownloading();
    }

    // Adds client to be downloaded.
    private addClientDownload() : void {
        // Clear old client download files.
        FileRemover.remove(
            path.join(ClientHelper.getInstance().getRequestedClientDirectory(), LauncherConfig.CLIENT_FILE_NAME)
        );

        let client : DownloadFile = this.installState.GetDownloadListService().getClient();
        client.setTarget(ClientHelper.getInstance().getRequestedClientDirectory());
        this.downloadHelper.addSingle(client);
    }
}