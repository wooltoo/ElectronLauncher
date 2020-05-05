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
    this.directoryPath = this.localSt.retrieve('clientDirectory');
    this.UpdateGamePath();
  }

  OnPressToggleAutomaticUpdates() {
    this.toggleActive = !this.toggleActive;
  }

  OnPressHome() {
    HomeComponentHolder.getInstance().getHomeComponent().OnPressHomeButton();
  }

  UpdateGamePath() : void {
    setInterval(() => {
      if (ClientHelper.getInstance().hasClientInstalled()) {
        this.directoryPath = ClientHelper.getInstance().getClientDirectory()
      }
    }, LauncherConfig.INTERVAL_UPDATE_SETTINGS_GAME_DIRECTORY);
  }

}
