import { Component, OnInit, Inject } from '@angular/core';
import { HomeComponent } from '../home/home.component';
import { ModalComponent } from '../modal/modal.component';
import { ComponentRegistry, ComponentRegistryEntry } from '../general/componentregistry';
import { FileHelper } from '../general/filehelper';
import { ClientHelper } from '../general/clienthelper';
import { LauncherConfig } from '../general/launcherconfig';
import { ModalEntrySingle, ModalEntryDouble } from '../general/modalentry';
import { Modals } from '../general/modals';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent implements OnInit {
  
  clientDirectory : string = "SELECT GAME PATH";
  hasSelectedPath : boolean = false;

  modalComponent : ModalComponent = null;

  constructor(@Inject(HomeComponent) private homeComponent : HomeComponent) {
  }

  ngOnInit(): void { }

  OnPressGo() : void {
    if (!this.hasSelectedPath)
      return;

    this.homeComponent.OnPickGamePath(this.clientDirectory);
  }

  OnPressSelectGamePath() : void {
    let directory = this.SelectDirectory();
    if (directory == undefined)
      return;

    if (!this.modalComponent)
      this.modalComponent = <ModalComponent> ComponentRegistry.getInstance().get(ComponentRegistryEntry.MODAL_COMPONENT);

    if (!ClientHelper.hasClientInDirectory(directory)) {
      let modal : ModalEntrySingle = new ModalEntrySingle(
        Modals.LANDING_COULD_NOT_FIND_CLIENT,
        "Could not find client",
        "The launcher could not detect a client in your selected directory. Please choose another directory or press download.",
        "CONTINUE",
        () => {}
      );

      this.modalComponent.enqueue(modal);
      return;
    } 

    if (!FileHelper.hasEnoughSpaceToInstallPatches(directory)) {
      let modal : ModalEntrySingle = new ModalEntrySingle(
        Modals.LANDING_NOT_ENOUGH_DISK_SPACE,
        "Not enough disk space",
        "There is not enough disk space to install the required patches. Please make some space available and try again.",
        "CONTINUE",
        () => {}
      );
      
      this.modalComponent.enqueue(modal);
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
    if (directory == undefined)
      return;
    
    if (!this.modalComponent)
      this.modalComponent = <ModalComponent> ComponentRegistry.getInstance().get(ComponentRegistryEntry.MODAL_COMPONENT);
    
    if (!FileHelper.isDirectoryEmpty(directory)) {
      let modal : ModalEntryDouble = new ModalEntryDouble(
        Modals.LANDING_DIRECTORY_NOT_EMPTY,
        "Directory not empty",
        "Would you like to continue? This can cause problems down the road.",
        "CANCEL",
        "CONFIRM",
        () => {},
        () => {
          this.PickGamePath(directory);
          this.OnPressGo();
        }
      );

      this.modalComponent.enqueue(modal);
      return;
    }
    
    if (!FileHelper.hasEnoughSpaceToInstallClient(directory)) {
      let modal : ModalEntrySingle = new ModalEntrySingle(
        Modals.LANDING_NOT_ENOUGH_DISK_SPACE_CLIENT,
        "Not enough disk space", 
        "There is not enough disk space to install the client. Please make some space available and try again.",
        "CONTINUE",
        () => {}
      );

      this.modalComponent.enqueue(modal);
      return;
    }
      
    this.PickDirectory(directory);
  }

  PickDirectory(directory : string) : void {
    this.hasSelectedPath = true;
    this.homeComponent.OnSelectClientDownload(directory);
  }

  SelectDirectory() : string {
    const {dialog} = require('electron').remote;
    let dir = dialog.showOpenDialogSync({ properties: ['openDirectory']});

    if (dir == undefined || dir.length == 0) return;
    return dir[0];
  }
}
