import { InstallCallback } from '../general/installcallback';
import { DownloadCallback } from '../general/downloadcallback';
import { DownloadFile } from '../general/downloadfile';
import { HomeComponent } from '../home/home.component';
import { DownloadState } from '../general/downloadstate';
import { ZipInstaller } from '../general/zipinstaller';
import { LauncherConfig } from '../general/launcherconfig';
import { DownloadListService } from '../download-list.service';
import { LocalStorageService } from 'ngx-webstorage';
import { DownloadPatchFilter } from '../general/downloadpatchfilter';
import { DownloadInfoFormatter } from '../general/downloadinfoformatter';


export class HomeInstallManager implements DownloadCallback, InstallCallback {

    constructor(private homeComponent : HomeComponent, 
                private downloadListService : DownloadListService,
                private localSt : LocalStorageService,
                ) { }
    
    /* MANAGER CALLBACKS */
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
        this.homeComponent.buttonText = this.homeComponent.getButtonText();
    }

    OnDownloadSpeedUpdate(downloadSpeed: any): void {
        this.homeComponent.downloadSpeed = DownloadInfoFormatter.formatDownloadSpeed(downloadSpeed);
    }
    
    OnDownloadProgressUpdate(downloadProgress: any): void {
        this.homeComponent.progressBarWidth = downloadProgress;
        this.homeComponent.progress = DownloadInfoFormatter.formatProgress(downloadProgress);
        this.homeComponent.cd.detectChanges(); 
    }

    OnDownloadPause(): void {
        this.homeComponent.state = DownloadState.PAUSED;
        this.homeComponent.showPauseButton = false;
        this.homeComponent.showPlayButton = true;
        this.homeComponent.showInterruptButton = true;
        this.homeComponent.showDownloadStats = true;
        this.homeComponent.showDownloadBar = true;
        this.homeComponent.buttonText = this.homeComponent.getButtonText();
    }

    OnDownloadInterrupt(): void {
        this.homeComponent.state = DownloadState.WAITING_FOR_DOWNLOAD;
        this.homeComponent.showPauseButton = false;
        this.homeComponent.showPlayButton = false;
        this.homeComponent.showDownloadStats = false;
        this.homeComponent.showInterruptButton = false;
        this.homeComponent.showDownloadBar = false;
        this.homeComponent.buttonText = this.homeComponent.getButtonText();
    }

    OnDownloadResume(): void {
        this.homeComponent.state = DownloadState.DOWNLOADING;
        this.homeComponent.showPauseButton = true;
        this.homeComponent.showPlayButton = false;
        this.homeComponent.showDownloadStats = true;
        this.homeComponent.showInterruptButton = true;
        this.homeComponent.showDownloadBar = true;
        this.homeComponent.buttonText = this.homeComponent.getButtonText();
    }

    OnDownloadFileFinished(downloadFile: import("../general/downloadfile").DownloadFile) {
        console.log("File: " + downloadFile.getFileName());
        if (downloadFile.getName() == LauncherConfig.CLIENT_RESOURCE_NAME) {
          let installer : ZipInstaller = new ZipInstaller(this);
          installer.install(downloadFile, this.localSt.retrieve('requestedClientDirectory'));
        }
    }

    OnDownloadFinished(): void {
        this.homeComponent.state = DownloadState.COMPLETED;
        this.homeComponent.showPauseButton = false;
        this.homeComponent.showPlayButton = false;
        this.homeComponent.showDownloadStats = false;
        this.homeComponent.showInterruptButton = false;
        this.homeComponent.showDownloadBar = false;
        this.homeComponent.hasFilesToDownload = false;
        this.homeComponent.buttonText = this.homeComponent.getButtonText();
        this.homeComponent.isInstalling = false;
    }

    OnFilesToDownloadResult(hasFilesToCheckForDownload: boolean): void {
        if (this.homeComponent.hasFilesToDownload)
            return;
  
        if (hasFilesToCheckForDownload)
        {
            let clientDir = this.localSt.retrieve('clientDirectory');
            let downloadPatchFilter = new DownloadPatchFilter(this.downloadListService);
            if (downloadPatchFilter.getPatchesToInstall(clientDir).length > 0) {
                this.scheduleDownload();
                return;
            }
        }
  
        this.homeComponent.buttonText = "START GAME";
    }

    OnInstallExtractionCompleted(downloadFile: DownloadFile): void {
        console.log("EXTRACTION FINISHED FOR: " + downloadFile.getName());

        if (downloadFile.getName() == LauncherConfig.CLIENT_RESOURCE_NAME) {
            this.finishedInstallingClient();
            console.log("FINISHED INSTALLING CLIENT!");
        }
    }

    OnInstallProgressUpdate(downloadFile: DownloadFile, progress: number, currFile: number, fileCount: number): void {
        console.log("Progress: number");
        this.homeComponent.state = DownloadState.INSTALLING;
        this.homeComponent.showPauseButton = false;
        this.homeComponent.showPlayButton = false;
        this.homeComponent.showDownloadStats = true;
        this.homeComponent.showInterruptButton = false;
        this.homeComponent.showDownloadBar = true;
        this.homeComponent.buttonText = this.homeComponent.getButtonText();
        this.homeComponent.downloadSpeed = "of " + fileCount.toString();
        this.homeComponent.progress = currFile.toString();
        this.homeComponent.progressBarWidth = (progress * 100);
    }

    /* MANAGER METHODS */

    public OnSelectClientDownload(path : string) : void {
        this.homeComponent.state = DownloadState.WAITING_FOR_DOWNLOAD;
        this.homeComponent.isInstalling = true;
        this.localSt.store('requestedClientDirectory', path);
        this.scheduleDownload();
        this.homeComponent.buttonText = this.homeComponent.getButtonText();
        this.homeComponent.hideLanding();
    }

    private scheduleDownload() : void {
        this.homeComponent.state = DownloadState.WAITING_FOR_DOWNLOAD;
        this.homeComponent.buttonText = this.homeComponent.getButtonText();    
        this.homeComponent.hasFilesToDownload = true;
    }

    private finishedInstallingClient() : void {
        this.localSt.store('clientDirectory', this.localSt.retrieve('requestedClientDirectory'));
        this.homeComponent.isInstalling = false;
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