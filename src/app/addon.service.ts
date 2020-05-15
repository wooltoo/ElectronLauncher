import { Injectable } from '@angular/core';
import { LauncherConfig } from './general/launcherconfig';
import { Addon } from './general/addon';
import { AddonServiceObserver } from './general/addonserviceobserver';
import { DownloadListService } from './download-list.service';

const request = require("request");

@Injectable({
  providedIn: 'root'
})
export class AddonService {
W
  //Key: addon ID, Value: Addon
  addons : Object = {};
  callbacks : AddonServiceObserver[] = [];
  addonDownloadFiles : Object = null;

  constructor() { 
    this.fetchAddons();
    setInterval(
      () => { this.fetchAddons(); },
      LauncherConfig.INTERVAL_FETCH_ADDONS
    );
  }

  public observe(addonServiceCallback : AddonServiceObserver) : void {
    this.callbacks.push(addonServiceCallback);
  }

  public getAddons() : Addon[] {
    return (<any>Object).values(this.addons);
  }

  private fetchAddons() : void {
    request.get({url: LauncherConfig.BACKEND_HOST + '/addons', json: true}, (error, response, body) => {
      if (body == undefined) {
        console.log("Addons was undefined!");
        return;
      }
      
      let hasBeenModified = false;
      body.forEach(addonData => {
        let id = addonData['id'];
        
        if (!this.addons.hasOwnProperty(id))
        {
          let addon : Addon = this.constructAddon(addonData);
          this.addons[addon.getId()] = addon;
          hasBeenModified = true;
        } else {
          if (this.updateAddon(addonData))
            hasBeenModified = true;
        }
      });

      if (hasBeenModified) {
        this.notifyUpdate();
      }
    });
  }

  private constructAddon(json : Object) : Addon {
    let addon : Addon = new Addon(
      Number(json['id']),
      json['name'],
      json['description'],
      json['icon-resource'],
      json['folder-name'],
      json['download-file'],
    );

    return addon;
  }

  private updateAddon(json : Object) : boolean {
    let addon : Addon = this.addons[json['id']];

    let modified = false;
    if (addon.getName() != json['name']) {
      addon.setName(json['name']);
      modified = true;
    }

    if (addon.getDescription() != json['description']) {
      addon.setDescription(json['description']);
      modified = true;
    }

    if (addon.getIconResource() != json['icon-resource']) {
      addon.setIconResource(json['icon-resource']);
      modified = true;
    }

    if (addon.getFolderName() != json['folder-name']) {
      addon.setFolderName(json['folder-name']);
      modified = true;
    }

    if (addon.getDownloadFileId() != json['download-file']) {
      addon.setDownloadFileId(json['download-file']);
      modified = true;
    }

    return modified;
  }

  private notifyUpdate() : void {
    this.callbacks.forEach((callback) => {
        callback.OnAddonsUpdated(this.getAddons())
      }
    );
  }
}
