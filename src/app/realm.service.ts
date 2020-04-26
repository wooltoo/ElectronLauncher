import { Injectable } from '@angular/core';
import { AppConfig } from '../environments/environment';
import { Realm } from './general/realm';
import { RealmStatus } from './general/realmstatus';
import { LauncherConfig } from './general/launcherconfig';

const request = require("request"); // Need to uncomment when running web

@Injectable({
  providedIn: 'root'
})
export class RealmService {

  realms : Realm[] = [];

  constructor() { 
    this.fetchRealms();

    setInterval(() => { 
      this.fetchRealms(); 
    }, 1000);
  }

  fetchRealms() {
    request.get(LauncherConfig.BACKEND_HOST + '/realms', (error, response, body) => {
      this.realms = [];
      let json = JSON.parse(body);

      json.forEach(obj => {
        let status : RealmStatus = null; 
        if (obj["status"] == "ONLINE")
          status = RealmStatus.ONLINE;
        else 
          status = RealmStatus.OFFLINE;

        this.realms.push(
          new Realm(obj["name"], status)
        );
      });
    });
  }

  getRealms() : Realm[] {
    return this.realms;
  }
}
