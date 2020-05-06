import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from 'ngx-webstorage';
import { LauncherConfig } from '../general/launcherconfig';
import { ClientHelper } from '../general/clienthelper';
import { ComponentRegistryEntry, ComponentRegistry } from '../general/componentregistry';
import { HomeComponent } from '../home/home.component';
import { SettingsManager, Setting } from '../general/settingsmanager';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

  toggleActive : boolean = true;
  directoryPath : string = "";

  constructor(private localSt : LocalStorageService) { }

  ngOnInit(): void {
    ComponentRegistry.getInstance().register(ComponentRegistryEntry.SETTINGS_COMPONENT, this);

    this.LoadSettings();
    this.UpdateGamePath();
  }

  private LoadSettings() : void {
    if (ClientHelper.getInstance().hasClientInstalled()) 
      this.directoryPath = ClientHelper.getInstance().getClientDirectory();

    this.toggleActive = SettingsManager.getInstance().getSetting(Setting.SHOULD_AUTO_PATCH);
  }

  OnPressToggleAutomaticUpdates() : void {
    this.toggleActive = !this.toggleActive;

    // This has breaking changes for download system
    /*if (this.toggleActive === false) {
      let homeComponent : HomeComponent = <HomeComponent> ComponentRegistry.getInstance().get(ComponentRegistryEntry.HOME_COMPONENT);
      homeComponent.CancelDownload();
    }*/
  }

  OnPressHome() : void {
    this.Reset();
    let homeComponent : HomeComponent = <HomeComponent> ComponentRegistry.getInstance().get(ComponentRegistryEntry.HOME_COMPONENT);
    homeComponent.OnPressHomeButton();
  }

  OnPressSaveChanges() : void {
    if (this.directoryPath != " ") {
      // Should prompt error trying to save empty game directory
      SettingsManager.getInstance().setSetting(Setting.CLIENT_DIRECTORY, this.directoryPath);
    }

    SettingsManager.getInstance().setSetting(Setting.SHOULD_AUTO_PATCH, this.toggleActive);
  }

  OnPressReset() : void {
    this.Reset();
  }

  OnPressClearPath() : void {
    // Having an space avoids UpdateGamePath() from overwriting the stored game directory.
    this.directoryPath = " ";
  }

  OnPressChangeGameLocation() : void {
    let selectedDir = this.SelectGameDirectory();
    if (selectedDir != null && selectedDir != undefined) {
      this.directoryPath = selectedDir;
    }
  }

  UpdateGamePath() : void {
    setInterval(() => {
      if (ClientHelper.getInstance().hasClientInstalled()) {
        if (this.directoryPath == "") {
          this.directoryPath = ClientHelper.getInstance().getClientDirectory()
        }
      }
    }, LauncherConfig.INTERVAL_UPDATE_SETTINGS_GAME_DIRECTORY);
  }

  // Called when the settings panel is hidden. 
  public OnHide() : void {
    this.Reset();
  }

  private Reset() : void {
    this.LoadSettings();
  }

  private SelectGameDirectory() : string {
    const {dialog} = require('electron').remote;
    let dir = dialog.showOpenDialogSync({ properties: ['openDirectory']});

    if (dir == undefined || dir.length == 0) return;
    return dir[0];
  }
}
