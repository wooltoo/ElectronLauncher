import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from 'ngx-webstorage';
import { LauncherConfig } from '../general/launcherconfig';
import { ClientHelper } from '../general/clienthelper';
import { ComponentRegistryEntry, ComponentRegistry } from '../general/componentregistry';
import { HomeComponent } from '../home/home.component';
import { SettingsManager, Setting } from '../general/settingsmanager';
import { DownloadSystem } from '../general/downloadsystem';
import { ModalComponent } from '../modal/modal.component';
import { ModalEntrySingle, ModalEntryDouble } from '../general/modalentry';
import { Modals } from '../general/modals';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

  toggleActive : boolean = true;
  directoryPath : string = "";
  modalComponent : ModalComponent = null;
  hasSaved : boolean = true;

  constructor(private localSt : LocalStorageService) { }

  ngOnInit(): void {
    ComponentRegistry.getInstance().register(ComponentRegistryEntry.SETTINGS_COMPONENT, this);

    this.LoadSettings();
    this.Update();
  }

  private LoadSettings() : void {
    if (ClientHelper.getInstance().hasClientInstalled()) 
      this.directoryPath = ClientHelper.getInstance().getClientDirectory();

    this.toggleActive = SettingsManager.getInstance().getSetting(Setting.SHOULD_AUTO_PATCH);
  }

  OnPressToggleAutomaticUpdates() : void {
    this.toggleActive = !this.toggleActive;
    this.hasSaved = false;
  }

  OnPressHome() : void {
    this.LoadSettings();
    let homeComponent : HomeComponent = <HomeComponent> ComponentRegistry.getInstance().get(ComponentRegistryEntry.HOME_COMPONENT);
    homeComponent.OnPressHomeButton();
  }

  OnPressSaveChanges() : void {
    this.prepareModalComponent();

    if (this.directoryPath === " ") 
    {
      let modal : ModalEntrySingle = new ModalEntrySingle(
        Modals.SETTINGS_INVALID_SETTING,
        "Invalid setting",
        "You must choose a client directory before you can save your settings.",
        "CONTINUE",
        () => {}
      );

      this.modalComponent.enqueue(modal);
      return;
    }

    if (ClientHelper.hasClientInDirectory(this.directoryPath)) 
      SettingsManager.getInstance().setSetting(Setting.CLIENT_DIRECTORY, this.directoryPath);
    SettingsManager.getInstance().setSetting(Setting.SHOULD_AUTO_PATCH, this.toggleActive);

    let modal : ModalEntrySingle = new ModalEntrySingle(
      Modals.SETTINGS_SAVED,
      "Save changes",
      "Settings saved successfully.",
      "CONFIRM",
      () => {}
    );

    this.hasSaved = true;
    this.modalComponent.enqueue(modal);
  }

  OnPressReset() : void {
    this.prepareModalComponent();

    let modal : ModalEntryDouble = new ModalEntryDouble(
      Modals.SETTINGS_RESET,
      "Reset Settings",
      "This will reset your launcher settings to the default. All changes made will be wiped.",
      "CANCEL",
      "RESET",
      () => {},
      () => { this.Reset(); }
    );

    this.modalComponent.enqueue(modal);
  }

  OnPressClearPath() : void {
    this.directoryPath = " ";
    this.hasSaved = false;
  }

  OnPressChangeGameLocation() : void {
    let selectedDir = this.SelectGameDirectory();
    if (selectedDir != null && selectedDir != undefined) {
      if (!ClientHelper.hasClientInDirectory(selectedDir)) {
        this.prepareModalComponent();

        let modal : ModalEntryDouble = new ModalEntryDouble(
          Modals.SETTINGS_COULD_NOT_FIND_CLIENT,
          "Could not find client",
          "The launcher could not detect a client in your selected directory. Would you like to install a client?",
          "CANCEL",
          "CONFIRM",
          () => {},
          () => {
            this.directoryPath = selectedDir;
            ClientHelper.getInstance().clearClientDirectory();
            ClientHelper.getInstance().setRequestedClientDirectory(this.directoryPath);
            DownloadSystem.getInstance().downloadAll();
            this.hasSaved = true;
          }
        ); 

        this.modalComponent.enqueue(modal);
      } 
    }
  }

  Update() : void {
    setInterval(() => {
      if (ClientHelper.getInstance().hasClientInstalled()) {
        if (this.directoryPath == "") {
          this.directoryPath = ClientHelper.getInstance().getClientDirectory()
        }
      }

      if (this.hasSaved) {
        this.toggleActive = SettingsManager.getInstance().getSetting(Setting.SHOULD_AUTO_PATCH);
      }
    }, LauncherConfig.INTERVAL_UPDATE_SETTINGS);
  }

  public OnHide() : void {
    this.LoadSettings();
  }

  private Reset() : void {
    this.LoadSettings();

    SettingsManager.getInstance().setSetting(Setting.SHOULD_AUTO_PATCH, true);
    this.toggleActive = true;
  }

  private SelectGameDirectory() : string {
    const {dialog} = require('electron').remote;
    let dir = dialog.showOpenDialogSync({ properties: ['openDirectory']});

    if (dir == undefined || dir.length == 0) return;
    return dir[0];
  }

  private prepareModalComponent() : void {
    if (!this.modalComponent)
      this.modalComponent = <ModalComponent> ComponentRegistry.getInstance().get(ComponentRegistryEntry.MODAL_COMPONENT);
  }
}
