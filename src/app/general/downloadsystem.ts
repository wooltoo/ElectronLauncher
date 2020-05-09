import { DownloadFile } from '../general/downloadfile';
import { InstallState } from './installstate';
import { DownloadHelper } from './downloadhelper';
import { DownloadFileFilter } from './downloadfilefilter';

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
        if (!this.downloadHelper) return;
        if (this.downloadHelper.isDownloading()) return;

        this.downloadHelper.add(this.downloadFileFilter.getFilesToInstall());
        this.downloadHelper.download();
    }

    // Should download client.
    public downloadClient() : void {
        if (!this.installState) return;

        let client : DownloadFile = this.installState.GetDownloadListService().getClient();
        client.setTarget(this.installState.GetLocalStorageService().retrieve('requestedClientDirectory'));
        this.downloadHelper.addSingle(client);
        this.downloadHelper.download();
    }
}