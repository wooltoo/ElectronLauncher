import { HomeComponent } from '../home/home.component';
import { DownloadState } from '../general/downloadstate';
import { DownloadInfoFormatter } from '../general/downloadinfoformatter';
import { LocalStorageService } from 'ngx-webstorage';
import { DownloadPatchFilter } from '../general/downloadpatchfilter';
import { DownloadListService } from '../download-list.service';
import { DownloadFile } from '../general/downloadfile';
import { InstallState } from '../general/installstate';
import { ClientHelper } from '../general/clienthelper';

export class PatchInstallState implements InstallState {

    constructor(private homeComponent : HomeComponent,
                private downloadListService : DownloadListService) {

    }

    OnExitState(): void {
     
    }

    OnEnterState(): void {
        this.homeComponent.state = DownloadState.WAITING_FOR_DOWNLOAD;
        this.homeComponent.isInstalling = true;
        this.homeComponent.hasFilesToDownload = true;
        this.homeComponent.buttonText = "DOWNLOAD";
    }

    OnDownloadStart(): void {
        this.homeComponent.state = DownloadState.DOWNLOADING;
        this.homeComponent.downloadSpeed = "0.00 MB/s"
        this.homeComponent.progress = "0.00%";
        this.homeComponent.progressBarWidth = 0;
        this.homeComponent.showPauseButton = true;
        this.homeComponent.showInterruptButton = true;
        this.homeComponent.showPlayButton = false;
        this.homeComponent.showDownloadStats = true;
        this.homeComponent.showDownloadBar = true;
        this.homeComponent.buttonText = "DOWNLOADING";
    }

    OnDownloadSpeedUpdate(downloadSpeed: any): void {
        this.homeComponent.downloadSpeed = DownloadInfoFormatter.formatDownloadSpeed(downloadSpeed);
    }
    
    OnDownloadProgressUpdate(downloadProgress: any): void {
        this.homeComponent.progressBarWidth = downloadProgress;
        this.homeComponent.progress = DownloadInfoFormatter.formatProgress(downloadProgress);
    }

    OnDownloadPause(): void {
        this.homeComponent.state = DownloadState.PAUSED;
        this.homeComponent.showPauseButton = false;
        this.homeComponent.showPlayButton = true;
        this.homeComponent.showInterruptButton = true;
        this.homeComponent.showDownloadStats = true;
        this.homeComponent.showDownloadBar = true;
        this.homeComponent.buttonText = "RESUME";
    }

    OnDownloadInterrupt(): void {
        this.homeComponent.state = DownloadState.WAITING_FOR_DOWNLOAD;
        this.homeComponent.showPauseButton = false;
        this.homeComponent.showPlayButton = false;
        this.homeComponent.showDownloadStats = false;
        this.homeComponent.showInterruptButton = false;
        this.homeComponent.showDownloadBar = false;
        this.homeComponent.buttonText = "DOWNLOAD";
    }

    OnDownloadResume(): void {
        this.homeComponent.state = DownloadState.DOWNLOADING;
        this.homeComponent.showPauseButton = true;
        this.homeComponent.showPlayButton = false;
        this.homeComponent.showDownloadStats = true;
        this.homeComponent.showInterruptButton = true;
        this.homeComponent.showDownloadBar = true;
        this.homeComponent.buttonText = "DOWNLOADING";
    }

    OnDownloadFileFinished(downloadFile: DownloadFile) {

    }

    OnDownloadFinished(): void {
        this.homeComponent.state = DownloadState.COMPLETED;
        this.homeComponent.showPauseButton = false;
        this.homeComponent.showPlayButton = false;
        this.homeComponent.showInterruptButton = false;
        this.homeComponent.hasFilesToDownload = false;
        this.homeComponent.progressBarWidth = 0;
        this.homeComponent.progress = "";
        this.homeComponent.downloadSpeed = "";
        this.homeComponent.showDownloadBar = false;
        this.homeComponent.buttonText = "START GAME"
    }

    OnFilesToDownloadResult(hasFilesToCheckForDownload: boolean): void {
        if (this.homeComponent.hasFilesToDownload)
            return;
  
        if (hasFilesToCheckForDownload)
        {
            let clientDir = ClientHelper.getInstance().getClientDirectory();
            let downloadPatchFilter = new DownloadPatchFilter(this.downloadListService);
            
            if (downloadPatchFilter.getPatchesToInstall(clientDir).length > 0) {
                this.homeComponent.state = DownloadState.WAITING_FOR_DOWNLOAD;
                this.homeComponent.buttonText = "UPDATE";    
                this.homeComponent.hasFilesToDownload = true;
                return;
            }
        }
  
        this.homeComponent.buttonText = "START GAME";
    }

    OnInstallProgressUpdate(downloadFile: DownloadFile, progress: number, currFile: number, fileCount: number): void {

    }

    OnInstallExtractionCompleted(downloadFile: DownloadFile): void {
    
    }
}