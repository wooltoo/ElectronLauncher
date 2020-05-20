import { Component, OnInit } from '@angular/core';
import { LauncherConfig } from '../general/launcherconfig';
import { ClientHelper } from '../general/clienthelper';
import { ComponentRegistryEntry, ComponentRegistry } from '../general/componentregistry';
import { HomeComponent } from '../home/home.component';
import { SettingsManager, Setting } from '../general/settingsmanager';
import { DownloadSystem } from '../general/downloadsystem';
import { ModalComponent } from '../modal/modal.component';
import { ModalEntrySingle, ModalEntryDouble } from '../general/modalentry';
import { Modals } from '../general/modals';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

  toggleActive : boolean = true;
  directoryPath : string = "";
  hasSaved : boolean = true;

  constructor(private translate : TranslateService )
  { }

  ngOnInit(): void {
    ComponentRegistry.getInstance().register(ComponentRegistryEntry.SETTINGS_COMPONENT, this);

    this.LoadSettings();
    this.Update();
  }

  private LoadSettings() : void {
    if (ClientHelper.getInstance().hasClientInstalled())  {
      let dir : string | undefined | null =  ClientHelper.getInstance().getClientDirectory();
      if (dir)
        this.directoryPath = dir;
    }

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
    if (this.directoryPath === " ") 
    {
      let modal : ModalEntrySingle = new ModalEntrySingle(
        Modals.SETTINGS_INVALID_SETTING,
        this.translate.instant('MODALS.INVALID-SETTING.TITLE'),
        this.translate.instant('MODALS.INVALID-SETTING.TEXT'),
        this.translate.instant('MODALS.INVALID-SETTING.BUTTON-SINGLE'),
        () => {}
      );

      let modalComponent : ModalComponent = <ModalComponent> ComponentRegistry.getInstance().get(ComponentRegistryEntry.MODAL_COMPONENT);
      modalComponent.enqueue(modal);
      return;
    }

    if (ClientHelper.hasClientInDirectory(this.directoryPath)) 
      SettingsManager.getInstance().setSetting(Setting.CLIENT_DIRECTORY, this.directoryPath);
    SettingsManager.getInstance().setSetting(Setting.SHOULD_AUTO_PATCH, this.toggleActive);

    let modal : ModalEntrySingle = new ModalEntrySingle(
      Modals.SETTINGS_SAVED,
      this.translate.instant('MODALS.SETTINGS-SAVED.TITLE'),
      this.translate.instant('MODALS.SETTINGS-SAVED.TEXT'),
      this.translate.instant('MODALS.SETTINGS-SAVED.BUTTON-SINGLE'),
      () => {}
    );

    this.hasSaved = true;
    let modalComponent : ModalComponent = <ModalComponent> ComponentRegistry.getInstance().get(ComponentRegistryEntry.MODAL_COMPONENT);
    modalComponent.enqueue(modal);
  }

  OnPressReset() : void {
    let modal : ModalEntryDouble = new ModalEntryDouble(
      Modals.SETTINGS_RESET,
      this.translate.instant('MODALS.SETTINGS-RESET.TITLE'),
      this.translate.instant('MODALS.SETTINGS-RESET.TEXT'),
      this.translate.instant('MODALS.SETTINGS-RESET.BUTTON-NEGATIVE'),
      this.translate.instant('MODALS.SETTINGS-RESET.BUTTON-POSITIVE'),
      () => { this.Reset(); },
      () => {}
    );

    let modalComponent : ModalComponent = <ModalComponent> ComponentRegistry.getInstance().get(ComponentRegistryEntry.MODAL_COMPONENT);
    modalComponent.enqueue(modal);
  }

  OnPressClearPath() : void {
    this.directoryPath = " ";
    this.hasSaved = false;
  }

  OnPressChangeGameLocation() : void {
    let selectedDir = this.SelectGameDirectory();
    if (selectedDir != null && selectedDir != undefined) {
      if (!ClientHelper.hasClientInDirectory(selectedDir)) {
        let modal : ModalEntryDouble = new ModalEntryDouble(
          Modals.SETTINGS_COULD_NOT_FIND_CLIENT,
          this.translate.instant('MODALS.SETTINGS-COULD-NOT-FIND-CLIENT.TITLE'),
          this.translate.instant('MODALS.SETTINGS-COULD-NOT-FIND-CLIENT.TEXT'),
          this.translate.instant('MODALS.SETTINGS-COULD-NOT-FIND-CLIENT.BUTTON-POSITIVE'),
          this.translate.instant('MODALS.SETTINGS-COULD-NOT-FIND-CLIENT.BUTTON-NEGATIVE'),
          () => {
            if (selectedDir)
              this.directoryPath = selectedDir;
            
            ClientHelper.getInstance().clearClientDirectory();
            ClientHelper.getInstance().setRequestedClientDirectory(this.directoryPath);
            DownloadSystem.getInstance().queueClient();
            this.hasSaved = true;
          },
          () => {}
        ); 

       let modalComponent : ModalComponent = <ModalComponent> ComponentRegistry.getInstance().get(ComponentRegistryEntry.MODAL_COMPONENT);
        modalComponent.enqueue(modal);
      } 
    }
  }

  Update() : void {
    setInterval(() => {
      if (ClientHelper.getInstance().hasClientInstalled()) {
        if (this.directoryPath == "") {
          let directory : string | undefined | null = ClientHelper.getInstance().getClientDirectory();
          if (directory)
            this.directoryPath = directory;
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

  private SelectGameDirectory() : string | null {
    const {dialog} = require('electron').remote;
    let dir = dialog.showOpenDialogSync({ properties: ['openDirectory']});

    if (dir == undefined || dir.length == 0)
      return null;
    
    return dir[0];
  }
}
