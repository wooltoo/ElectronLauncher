import { Component, OnInit, Inject } from '@angular/core';
import { HomeComponent } from '../home/home.component';
import { ModalComponent } from '../modal/modal.component';
import { ComponentRegistry, ComponentRegistryEntry } from '../general/componentregistry';
import { FileHelper } from '../general/filehelper';
import { ClientHelper } from '../general/clienthelper';
import { LauncherConfig } from '../general/launcherconfig';

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
      this.modalComponent.ShowSingle(
        "Could not find client",
        "The launcher could not detect a client in your selected directory. Please choose another directory or press download.",
        "CONTINUE",
        () => {}
      );
      return;
    } 

    if (!FileHelper.hasEnoughSpaceToInstallPatches(directory)) {
      this.modalComponent.ShowSingle(
        "Not enough disk space",
        "There is not enough disk space to install the required patches. Please make some space available and try again.",
        "CONTINUE",
        () => {}
      );
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
      this.modalComponent.ShowDouble(
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
      return;
    }
    
    if (!FileHelper.hasEnoughSpaceToInstallClient(directory)) {
      this.modalComponent.ShowSingle(
        "Not enough disk space", 
        "There is not enough disk space to install the client. Please make some space available and try again.",
        "CONTINUE",
        () => {}
      );
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
