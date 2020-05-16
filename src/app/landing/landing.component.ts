import { Component, OnInit, Inject } from '@angular/core';
import { HomeComponent } from '../home/home.component';
import { ModalComponent } from '../modal/modal.component';
import { ComponentRegistry, ComponentRegistryEntry } from '../general/componentregistry';
import { FileHelper } from '../general/filehelper';
import { ClientHelper } from '../general/clienthelper';
import { ModalEntrySingle, ModalEntryDouble } from '../general/modalentry';
import { Modals } from '../general/modals';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent implements OnInit {
  
  clientDirectory : string = '';
  hasSelectedPath : boolean = false;

  constructor(@Inject(HomeComponent) private homeComponent : HomeComponent,
                                     private translate : TranslateService)
  { }

  ngOnInit(): void {
    this.translate.get('LANDING.TEXT-SELECT-PATH').subscribe((result) => {
      this.clientDirectory = result;
    });
  }

  OnPressGo() : void {
    if (!this.hasSelectedPath)
      return;

    this.homeComponent.OnPickGamePath(this.clientDirectory);
  }

  OnPressSelectGamePath() : void {
    let directory = this.SelectDirectory();
    if (directory == undefined)
      return;


    if (!ClientHelper.hasClientInDirectory(directory)) {
      let modal : ModalEntrySingle = new ModalEntrySingle(
        Modals.LANDING_COULD_NOT_FIND_CLIENT,
        this.translate.instant('MODALS.LANDING-COULD-NOT-FIND-CLIENT.TITLE'),
        this.translate.instant('MODALS.LANDING-COULD-NOT-FIND-CLIENT.TEXT'),
        this.translate.instant('MODALS.LANDING-COULD-NOT-FIND-CLIENT.BUTTON-SINGLE'),
        () => {}
      );

      let modalComponent : ModalComponent = <ModalComponent> ComponentRegistry.getInstance().get(ComponentRegistryEntry.MODAL_COMPONENT);
      modalComponent.enqueue(modal);
      return;
    } 

    if (!FileHelper.hasEnoughSpaceToInstallPatches(directory)) {
      let modal : ModalEntrySingle = new ModalEntrySingle(
        Modals.LANDING_NOT_ENOUGH_DISK_SPACE,
        this.translate.instant('MODALS.LANDING-NOT-ENOUGH-DISK-SPACE.TITLE'),
        this.translate.instant('MODALS.LANDING-NOT-ENOUGH-DISK-SPACE.TEXT'),
        this.translate.instant('MODALS.LANDING-NOT-ENOUGH-DISK-SPACE.BUTTON-SINGLE'),
        () => {}
      );
      
      let modalComponent : ModalComponent = <ModalComponent> ComponentRegistry.getInstance().get(ComponentRegistryEntry.MODAL_COMPONENT);
      modalComponent.enqueue(modal);
      return;
    }

    this.PickGamePath(directory);
  }

  PickGamePath(directory : string) : void {
    this.clientDirectory = directory;
    this.hasSelectedPath = true;
  } 

  OnPressDownload() : void {
    let directory = this.SelectDirectory();
    if (directory == null)
      return;
    
    if (!FileHelper.isDirectoryEmpty(directory)) {
      let modal : ModalEntryDouble = new ModalEntryDouble(
        Modals.LANDING_DIRECTORY_NOT_EMPTY,
        this.translate.instant('MODALS.LANDING-DIRECTORY-NOT-EMPTY.TITLE'),
        this.translate.instant('MODALS.LANDING-DIRECTORY-NOT-EMPTY.TEXT'),
        this.translate.instant('MODALS.LANDING-DIRECTORY-NOT-EMPTY.BUTTON-POSITIVE'),
        this.translate.instant('MODALS.LANDING-DIRECTORY-NOT-EMPTY.BUTTON-NEGATIVE'),
        () => {
          if (directory !== null) {
            this.PickGamePath(directory);
            this.OnPressGo();
          }
        },
        () => {}
      );

      let modalComponent : ModalComponent = <ModalComponent> ComponentRegistry.getInstance().get(ComponentRegistryEntry.MODAL_COMPONENT);
      modalComponent.enqueue(modal);
      return;
    }
    
    if (!FileHelper.hasEnoughSpaceToInstallClient(directory)) {
      let modal : ModalEntrySingle = new ModalEntrySingle(
        Modals.LANDING_NOT_ENOUGH_DISK_SPACE_CLIENT,
        this.translate.instant('MODALS.LANDING-NOT-ENOUGH-DISK-SPACE-CLIENT.TITLE'),
        this.translate.instant('MODALS.LANDING-NOT-ENOUGH-DISK-SPACE-CLIENT.TEXT'),
        this.translate.instant('MODALS.LANDING-NOT-ENOUGH-DISK-SPACE-CLIENT.BUTTON-SINGLE'),
        () => {}
      );

      let modalComponent : ModalComponent = <ModalComponent> ComponentRegistry.getInstance().get(ComponentRegistryEntry.MODAL_COMPONENT);
      modalComponent.enqueue(modal);
      return;
    }
      
    this.PickDirectory(directory);
  }

  PickDirectory(directory : string) : void {
    this.hasSelectedPath = true;
    this.homeComponent.OnSelectClientDownload(directory);
  }

  SelectDirectory() : string | null {
    const {dialog} = require('electron').remote;
    let dir = dialog.showOpenDialogSync({ properties: ['openDirectory']});

    if (dir == undefined || dir.length == 0) 
      return null;

    return dir[0];
  }
}
