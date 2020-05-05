import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from 'ngx-webstorage';
import { LauncherConfig } from '../general/launcherconfig';
import { ClientHelper } from '../general/clienthelper';
import { HomeComponentHolder } from '../general/homecomponentholder';

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
    if (this.localSt.hasOwnProperty('clientDirectory')) {
      this.directoryPath = this.localSt.retrieve('clientDirectory');
    }

    this.UpdateGamePath();
  }

  OnPressToggleAutomaticUpdates() : void {
    this.toggleActive = !this.toggleActive;
    this.localSt.store('settingAutomaticUpdates', this.toggleActive);
  }

  OnPressHome() : void {
    HomeComponentHolder.getInstance().getHomeComponent().OnPressHomeButton();
  }

  OnPressSaveChanges() : void {
    if (this.directoryPath != " ") {
      // Should prompt error trying to save empty game directory
      this.localSt.store('clientDirectory', this.directoryPath);
    }
  }

  OnPressReset() : void {
    this.directoryPath = ClientHelper.getInstance().getClientDirectory();
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

  private SelectGameDirectory() : string {
    const {dialog} = require('electron').remote;
    let dir = dialog.showOpenDialogSync({ properties: ['openDirectory']});

    if (dir == undefined || dir.length == 0) return;
    return dir[0];
  }

}
