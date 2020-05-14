import { Injectable, ɵConsole } from '@angular/core';
import { LauncherConfig } from './general/launcherconfig';
import { Addon } from './general/addon';
import { AddonServiceCallback } from './general/addonservicecallback';

const request = require("request");

@Injectable({
  providedIn: 'root'
})
export class AddonService {

  //Key: addon ID, Value: Addon
  addons : Object = {};

  callbacks : AddonServiceCallback[] = [];

  constructor() { 
    this.fetchAddons();

    setInterval(
      () => { this.fetchAddons(); },
      LauncherConfig.INTERVAL_FETCH_ADDONS
    );
  }

  public observe(addonServiceCallback : AddonServiceCallback) : void {
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
      let beforeCount = this.getAddons().length;
      body.forEach(addonData => {
        let id = addonData['id'];
        
        if (!this.addons.hasOwnProperty(id))
        {
          let addon : Addon = this.constructAddon(addonData);
          this.addons[addon.getId()] = addon;
        } else {
          if (this.updateAddon(addonData))
            hasBeenModified = true;
        }
      });

      let addedNewAddon = beforeCount !== this.getAddons().length;
      if (addedNewAddon || hasBeenModified) {
        this.notifyUpdate();
      }
    });
  }

  private constructAddon(json : Object) : Addon {
    let addon : Addon = new Addon(
      Number(json['id']),
      json['name'],
      json['description'],
      json['icon-resource']
    );

    return addon;
  }

  private updateAddon(json : Object) : boolean {
    let addon : Addon = this.addons[json['id']];

    let modified = false;
    if (addon.getName() !== json['name']) {
      addon.setName(json['name']);
      modified = true;
    }

    if (addon.getDescription() !== json['description']) {
      addon.setDescription(json['description']);
      modified = true;
    }

    if (addon.getIconResource() !== json['icon-resource']) {
      addon.setIconResource(json['icon-resource']);
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
