import { Injectable } from '@angular/core';
import { DownloadFile } from './general/downloadfile';
import { AppConfig } from '../environments/environment';
import { DownloadListServiceState } from './general/downloadlistservicestate';
import { LauncherConfig } from './general/launcherconfig';

const request = require('request');

@Injectable({
  providedIn: 'root'
})
export class DownloadListService {

  patches : DownloadFile[] = null;
  client : DownloadFile = null;
  state : DownloadListServiceState = DownloadListServiceState.RETRIEVING_INFORMATION;

  constructor()
  { 
    this.fetchRemoteFiles();

    if (LauncherConfig.SHOULD_CHECK_FOR_NEW_REMOTE_PATCHES) 
      this.checkForRemotePatches();
  }

  private checkForRemotePatches() : void {
    setInterval(
      () => {
        this.fetchRemoteFiles()
      }, LauncherConfig.INTERVAL_CHECK_FOR_NEW_REMOTE_PATCHES
    );
  }

  public fetchRemoteFiles() : void {
    let fetchPatchesId = setInterval(
      () => { 
        this.fetchPatches(fetchPatchesId);
      }, 
      1000
    );

    let fetchClientId = setInterval(
      () => {
        this.fetchClient(fetchClientId);
      }, 
      1000
    );
  }

  public getPatches() : DownloadFile[] {
    return this.patches;
  }

  public getClient() : DownloadFile {
    return this.client;
  }

  public getState() : DownloadListServiceState {
    return this.state;
  }

  private fetchPatches(fetchPatchesId : any) : void {
    request.get({
      url: AppConfig.backend_url + '/patches',
      json: true
    }, (error, response, json) => {
      if(this.patches != null && this.patches.length == json.length) 
        return;

      this.patches = [];
      json.forEach(obj => {
        this.patches.push(
          new DownloadFile(obj['name'], obj['md5-checksum'], obj['resource'])
        );
      });

      console.log("GOT PATCHES!");
      clearInterval(fetchPatchesId); 
      this.updateState();
    });
  }

  private fetchClient(fetchClientId : any) : void {
    request.get({
      url: AppConfig.backend_url + '/client',
      json: true,
    }, (error, response, json) => {
      if (this.client != null) 
        return;

      this.client = new DownloadFile(json['name'], '', json['resource']);

      console.log("GOT CLIENT!");
      clearInterval(fetchClientId);
      this.updateState();
    });
  }

  private updateState() : void {
    if (this.patches != null && this.client != null)
      this.state = DownloadListServiceState.READY;
    else
      this.state = DownloadListServiceState.RETRIEVING_INFORMATION;
  }
}
