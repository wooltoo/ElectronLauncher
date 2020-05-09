import { Injectable } from '@angular/core';
import { DownloadFile, DownloadFileType } from './general/downloadfile';
import { DownloadListServiceState } from './general/downloadlistservicestate';
import { LauncherConfig } from './general/launcherconfig';
import { DownloadListCallback } from './general/downloadlistcallback';

const request = require('request');

@Injectable({
  providedIn: 'root'
})
export class DownloadListService {

  callbacks : DownloadListCallback[] = [];
  files : DownloadFile[] = null;
  client : DownloadFile = null;
  state : DownloadListServiceState = DownloadListServiceState.RETRIEVING_INFORMATION;

  constructor()
  { 
    this.fetchRemoteFiles();

    if (LauncherConfig.SHOULD_CHECK_FOR_NEW_REMOTE_FILES) 
      this.checkForRemoteFiles();
  }

  private checkForRemoteFiles() : void {
    setInterval(
      () => {
        this.fetchRemoteFiles()
      }, LauncherConfig.INTERVAL_CHECK_FOR_NEW_REMOTE_FILES
    );
  }

  public getFiles() : DownloadFile[] {
    return this.files;
  }

  public getClient() : DownloadFile {
    return this.client;
  }

  public getState() : DownloadListServiceState {
    return this.state;
  }

  public observe(downloadListCallback : DownloadListCallback) : void {
    if (!this.callbacks.includes(downloadListCallback))
      this.callbacks.push(downloadListCallback);
  }

  private fetchRemoteFiles() : void {
    request.get({
      url: LauncherConfig.BACKEND_HOST + '/files',
      json: true
    }, (error, response, json) => {
      if (json == undefined) {
        console.log("Fetch files was undefined!");
        return;
      }

      this.clearResources();
      json.forEach(obj => {
        let type : DownloadFileType = <any>DownloadFileType[obj['type']];
        let extract = obj['extract'] === 'true' ? true : false;
        let file = new DownloadFile(obj['_id'], obj['name'], type, obj['md5-checksum'], obj['resource'], obj['file-name'], extract, obj['target']);
        if (file.getType() == DownloadFileType.client) 
          this.client = file;
        else 
          this.files.push(file);
      });

      if (this.files.length > 0)
        this.notifyNewFilesFetched();
      
      this.updateState();
    });
  }

  private notifyNewFilesFetched() : void {
    this.callbacks.forEach((callback) => {
      callback.OnNewFilesFetched(this.files);
    });
  }

  private updateState() : void {
    if (this.files != null && this.client != null)
      this.state = DownloadListServiceState.READY;
    else
      this.state = DownloadListServiceState.RETRIEVING_INFORMATION;
  }

  private clearResources() : void {
    this.files = [];
    this.client = null;
  }
}
