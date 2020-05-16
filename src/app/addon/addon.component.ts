import { Component, OnInit, Input } from '@angular/core';
import { Addon } from '../general/addon';
import { LauncherConfig } from '../general/launcherconfig';
import { DownloadFileUtil } from '../general/downloadfileutil';
import { DownloadFile } from '../general/downloadfile';
import { ModalComponent } from '../modal/modal.component';
import { ComponentRegistry, ComponentRegistryEntry } from '../general/componentregistry';
import { ModalEntrySingle } from '../general/modalentry';
import { Modals } from '../general/modals';
import { TranslateService } from '@ngx-translate/core';
import { DownloadSystem } from '../general/downloadsystem';

@Component({
  selector: 'app-addon',
  templateUrl: './addon.component.html',
  styleUrls: ['./addon.component.css']
})
export class AddonComponent implements OnInit {

  @Input() private addon! : Addon;
  visible : boolean = true;
  downloaded : boolean = false;
  downloading : boolean = false;

  public constructor(private translate : TranslateService) { }

  ngOnInit(): void {
    this.runDownloadedCheck();
  }

  public OnPressDownloadButton() {
    if (this.downloaded || this.addon.isInstalled()) 
      return false;

    this.downloading = true;

    DownloadFileUtil.fetchDownloadFile(
      this.addon.getDownloadFileId(), 
     
      (downloadfile : DownloadFile | null) => {
        if (downloadfile) 
          this.onFetchDownloadFileSuccess(downloadfile) 
      },
      
      () => {
         this.onFetchDownloadFileError()
      }
    );
  }

  public hide() : void {
    this.visible = false;
  }

  public show() : void {
    this.visible = true;
  }

  public getAddon() : Addon {
    return this.addon;
  }

  private onFetchDownloadFileSuccess(downloadFile : DownloadFile) : void {
    let downloadSystem : DownloadSystem = DownloadSystem.getInstance();
    downloadSystem.download([downloadFile]);
    if (!downloadSystem.isDownloading()) 
      downloadSystem.start();
  }

  private onFetchDownloadFileError() : void {
     let modalComponent : ModalComponent = <ModalComponent> ComponentRegistry.getInstance().get(ComponentRegistryEntry.MODAL_COMPONENT);
    
      let modal : ModalEntrySingle = new ModalEntrySingle(  
        Modals.ADDON_COULD_NOT_FIND_DOWNLOADFILE,
        this.translate.instant('MODALS.ADDON-COULD-NOT-FIND-DOWNLOADFILE.TITLE'),
        this.translate.instant('MODALS.ADDON-COULD-NOT-FIND-DOWNLOADFILE.TEXT'),
        this.translate.instant('MODALS.ADDON-COULD-NOT-FIND-DOWNLOADFILE.BUTTON-SINGLE'),
        () => {}
      );

      modalComponent.enqueue(modal);
  }

  private runDownloadedCheck() : void {
    setInterval(() => {
      if (this.addon.isInstalled()) {
        this.downloaded = true;
        this.downloading = false;
      } else if (!this.downloading) {
        this.downloaded = false;
      }
    }, LauncherConfig.INTERVAL_INVESTIGATE_ADDON_STATUS);
  }
}
