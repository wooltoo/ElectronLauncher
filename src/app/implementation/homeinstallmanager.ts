import { InstallCallback } from '../general/installcallback';
import { DownloadCallback } from '../general/downloadcallback';
import { DownloadFile } from '../general/downloadfile';
import { HomeComponent } from '../home/home.component';
import { DownloadState } from '../general/downloadstate';
import { DownloadListService } from '../download-list.service';
import { LocalStorageService } from 'ngx-webstorage';
import { DownloadPatchFilter } from '../general/downloadpatchfilter';
import { InstallState } from '../general/installstate';
import { ClientInstallHandler } from '../implementation/clientinstallhandler';

export class HomeInstallManager implements DownloadCallback, InstallCallback {

    installState : InstallState;

    constructor(private homeComponent : HomeComponent, 
                private downloadListService : DownloadListService,
                private localSt : LocalStorageService,
                ) 
    { 
        this.installState = new ClientInstallHandler(
            homeComponent, 
            localSt, 
            downloadListService
        );    
    }
    
    /* MANAGER CALLBACKS */
    OnDownloadStart(): void {
        this.installState.OnDownloadStart();
    }

    OnDownloadSpeedUpdate(downloadSpeed: any): void {
        this.installState.OnDownloadSpeedUpdate(downloadSpeed);
    }
    
    OnDownloadProgressUpdate(downloadProgress: any): void {
        this.installState.OnDownloadProgressUpdate(downloadProgress);
    }

    OnDownloadPause(): void {
        this.installState.OnDownloadPause();
    }

    OnDownloadInterrupt(): void {
        this.installState.OnDownloadInterrupt();
    }

    OnDownloadResume(): void {
        this.installState.OnDownloadResume();
    }

    OnDownloadFileFinished(downloadFile: DownloadFile) {
        this.installState.OnDownloadFileFinished(downloadFile);
    }

    OnDownloadFinished(): void {
        this.installState.OnDownloadFinished();
    }

    OnFilesToDownloadResult(hasFilesToCheckForDownload: boolean): void {
        this.installState.OnFilesToDownloadResult(hasFilesToCheckForDownload);
    }

    OnInstallExtractionCompleted(downloadFile: DownloadFile): void {
        this.installState.OnInstallExtractionCompleted(downloadFile);
    }

    OnInstallProgressUpdate(downloadFile: DownloadFile, progress: number, currFile: number, fileCount: number): void {
        this.installState.OnInstallProgressUpdate(downloadFile, progress, currFile, fileCount);
    }

    /* MANAGER METHODS */

    public OnSelectClientDownload(path : string) : void {
        this.localSt.store('requestedClientDirectory', path);
        this.installState = new ClientInstallHandler(this.homeComponent, this.localSt, this.downloadListService);
        this.installState.OnEnterState();
    }

    public downloadPatches() : void {
        let downloadPatchFilter = new DownloadPatchFilter(this.downloadListService);
        let clientDir = this.localSt.retrieve('clientDirectory');
        this.homeComponent.downloadHelper.prepare(
          downloadPatchFilter.getPatchesToInstall(clientDir),
          clientDir
        );
    
        this.homeComponent.downloadHelper.download();
        this.homeComponent.state = DownloadState.DOWNLOADING;
      }
    
    public downloadClient() : void {
        let clientTargetDir = this.localSt.retrieve('requestedClientDirectory');
        this.homeComponent.downloadHelper.prepare(
          [this.downloadListService.getClient()],
          clientTargetDir,
        );
    
        this.homeComponent.downloadHelper.download();
        this.homeComponent.state = DownloadState.DOWNLOADING;
      }
}