import { Injectable } from '@angular/core';
import { DownloadFile, DownloadFileType } from './general/downloadfile';
import { DownloadListServiceState } from './general/downloadlistservicestate';
import { LauncherConfig } from './general/launcherconfig';
import { DownloadListObserver } from './general/downloadlistobserver';
import { DownloadFileUpdater } from './general/downloadfileupdater';
import { DownloadFileUtil } from './general/downloadfileutil';
const request = require('request');

/**
 * DownloadListService is responsible for providing storage and retrieval functionality for DownloadFiles.
 * This service will keep the client's DownloadFile data in sync with the servers. 
 * 
 * @author Fredriksa @ Github
*/

@Injectable({
  providedIn: 'root'
})
export class DownloadListService {
  callbacks : DownloadListObserver[] = [];
  
  files : Record<number, DownloadFile> = {};
  client : DownloadFile | null = null;

  state : DownloadListServiceState = DownloadListServiceState.RETRIEVING_INFORMATION;

  constructor()
  { 
    this.fetchRemoteFiles();
    this.checkForRemoteFiles();
  }

  /**
   * Starts checking for remote files. 
   */
  private checkForRemoteFiles() : void {
    setInterval(
      () => {
        this.fetchRemoteFiles()
      }, LauncherConfig.INTERVAL_CHECK_FOR_NEW_REMOTE_FILES
    );
  }

  /**
   * Fetches all the resource and patch DownloadFiles.
   * @returns An DownloadFile[] for all the resource and patch DownloadFiles 
   */
  public getFiles() : DownloadFile[] {
    return (<any>Object).values(this.files);
  }

  /**
   * Fetches the DownloadFile for the client.
   * @returns The client DownloadFile.
   */
  public getClient() : DownloadFile | null {
    return this.client;
  }

  /**
   * Fetches current state.
   * @returns state The current state of the download list service.
   */
  public getState() : DownloadListServiceState {
    return this.state;
  }

  /**
   * Adds an observer to the download list service.
   * @param downloadListObserver The observer to be added.
   */
  public observe(downloadListObserver : DownloadListObserver) : void {
    if (!this.callbacks.includes(downloadListObserver))
      this.callbacks.push(downloadListObserver);
  }

  /**
   * Fetches remote files.
   */
  private fetchRemoteFiles() : void {
    request.get({
      url: LauncherConfig.BACKEND_HOST + '/files',
      json: true
    }, (_error: any, _response: any, json: undefined) => {
      if (json == undefined) 
        return;
      
      this.processFileResponse(json);
      if (this.state == DownloadListServiceState.RETRIEVING_INFORMATION) {
        this.state = DownloadListServiceState.READY;
      }
    });
  }

  /**
   * Processes the JSON file response from the backend server.
   * Starts the process to add/update downloadfiles.
   * @param json The JSON data to process. 
   */
  private processFileResponse(json : any) {
    let modified = false;
    json.forEach((obj : any) => {
      let file : DownloadFile | null = DownloadFileUtil.constructFromJSON(obj);
      if (!file)
        throw new Error('DownloadListService.ts could not construct file from JSON.');

      if (file.getType() == DownloadFileType.client) {
        this.client = file;
      }
      else {
        if (this.updateOrAddFile(file, obj))
          modified = true;
      }
    });

    if (modified) 
      this.notifyFilesUpdated();
  }
  
  /**
   * Updates or adds a DownloadFile to its belonging container.
   * @param file The file to be added.
   * @param json The JSON data used to modify the file.
   * @returns true if a file has been added or modified false if not.
   */
  private updateOrAddFile(file : DownloadFile, json : Object) : boolean {
    if (this.files.hasOwnProperty(file.getId())) 
      return this.updateFile(json);

      
    this.files[file.getId()] = file;
    return true;
  }


  /**
   * Updates the target DownloadFile in DownloadListService based
   * on the values in the JSON object.
   * 
   * E.g, if the title differs in the json object the download file
   * instance will be updated.
   * 
   * @param json The JSON object containing information for the download file.
   * @returns true if changes have been made false if not.
   */
  private updateFile(json : any) : boolean {
    let type : DownloadFileType = <any>DownloadFileType[json['type']];
    let currFile : DownloadFile = this.files[json['id']];

    return DownloadFileUpdater.update(currFile, json);
  }

  /**
   * Notifies all observers that the download files 
   * list has been updated together with all the files.
   */
  private notifyFilesUpdated() : void {
    this.callbacks.forEach((callback) => {
      callback.OnNewFilesFetched(this.getFiles());
    });
  }
}
