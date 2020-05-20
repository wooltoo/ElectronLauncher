import { Injectable } from '@angular/core';
import { Realm } from './general/realm';
import { RealmStatus } from './general/realmstatus';
import { LauncherConfig } from './general/launcherconfig';

const request = require("request");

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
    request.get(LauncherConfig.BACKEND_HOST + '/realms', (_error: any, _response: any, body: string) => {
      if (body == undefined) 
        return;
      
      if (_error)
        throw new Error(_error);

      this.realms = [];
      let json = JSON.parse(body);

      json.forEach((obj: { [x: string]: string; }) => {
        let status : RealmStatus | null = null;

        if (obj['status'] == 'ONLINE')
          status = RealmStatus.ONLINE;
        else 
          status = RealmStatus.OFFLINE;

        this.realms.push(
          new Realm(obj['name'], status, obj['realmlist'])
        );
      });
    });
  }

  getRealms() : Realm[] {
    return this.realms;
  }
}
