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
    this.fetchPatches();
    this.fetchClient();
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

  private fetchPatches() : void {
    request.get({
      url: LauncherConfig.BACKEND_HOST + '/patches',
      json: true
    }, (error, response, json) => {
      if (json == undefined) {
        console.log("Fetch patches was undefined!");
        return;
      }

      if(this.patches != null && this.patches.length == json.length) 
        return;

      this.patches = [];
      json.forEach(obj => {
        this.patches.push(
          new DownloadFile(obj['name'], obj['md5-checksum'], obj['resource'], obj['file-name'])
        );
      });

      this.updateState();
    });
  }

  private fetchClient() : void {
    request.get({
      url: LauncherConfig.BACKEND_HOST + '/client',
      json: true,
    }, (error, response, json) => {
      if (this.client != null || json == undefined) 
        return;

      this.client = new DownloadFile(json['name'], '', json['resource'], json['file-name']);

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
