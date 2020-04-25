import { Injectable } from '@angular/core';
import { DownloadFile } from './general/downloadfile';
import { AppConfig } from '../environments/environment';

const request = require('request');

@Injectable({
  providedIn: 'root'
})
export class DownloadListService {

  patches : DownloadFile[] = [];
  client : DownloadFile = null;

  constructor()
  { 
    this.fetchPatches();
    this.fetchClient();
  }

  public getPatches() : DownloadFile[] {
    return this.patches;
  }

  public getClient() : DownloadFile {
    return this.client;
  }

  private fetchPatches() : void {
    request.get(AppConfig.backend_url + '/patches', (error, response, body) => {
      let json = JSON.parse(body);

      json.forEach(obj => {
        this.patches.push(
          new DownloadFile(obj['name'], obj['md5-checksum'], obj['resource'])
        );
      });

      console.log("GOT PATCHES!");
      console.log(this.patches);
    });
  }

  private fetchClient() : void {
    request.get(AppConfig.backend_url + '/client', (error, response, body) => {
      let json = JSON.parse(body);
      this.client = new DownloadFile(json['name'], '', json['resource']);

      console.log("GOT CLIENT!");
      console.log(this.client);
    });
  }
}
