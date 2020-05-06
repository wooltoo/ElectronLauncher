import { InstallCallback } from '../general/installcallback';
import { DownloadCallback } from '../general/downloadcallback';
import { DownloadFile } from '../general/downloadfile';
import { HomeComponent } from '../home/home.component';
import { DownloadState } from '../general/downloadstate';
import { DownloadListService } from '../download-list.service';
import { LocalStorageService } from 'ngx-webstorage';
import { DownloadPatchFilter } from '../general/downloadpatchfilter';
import { InstallState } from '../general/installstate';
import { ClientHelper } from '../general/clienthelper';
import { DownloadHelper } from '../general/downloadhelper';

export class HomeInstallManager implements DownloadCallback, InstallCallback {

    installState : InstallState;

    constructor(private homeComponent : HomeComponent, 
                private downloadListService : DownloadListService,
                private localSt : LocalStorageService,
                ) 
    { }
    
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
        if (!this.GetActiveInstallState())
            return;

        this.installState.OnFilesToDownloadResult(hasFilesToCheckForDownload);
    }

    OnInstallExtractionCompleted(downloadFile: DownloadFile): void {
        this.installState.OnInstallExtractionCompleted(downloadFile);
    }

    OnInstallProgressUpdate(downloadFile: DownloadFile, progress: number, currFile: number, fileCount: number): void {
        this.installState.OnInstallProgressUpdate(downloadFile, progress, currFile, fileCount);
    }

    /* STATE METHODS */
    public EnterInstallState(newInstallState : InstallState) : void {
        if (this.GetActiveInstallState())
            this.installState.OnExitState();
        
        this.installState = newInstallState;
        this.installState.OnEnterState();
    }

    public GetActiveInstallState() : InstallState {
        return this.installState;
    }

    /* MANAGER METHODS */

    public downloadPatches() : void {
        let downloadPatchFilter = new DownloadPatchFilter(this.downloadListService);
        let clientDir = ClientHelper.getInstance().getClientDirectory();
        this.homeComponent.downloadHelper.prepare(
          downloadPatchFilter.getPatchesToInstall(clientDir),
          clientDir
        );
    
        this.homeComponent.downloadHelper.download();
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