import { DownloadFile, DownloadFileType } from './downloadfile';
import { LauncherConfig } from './launcherconfig';
import * as request from 'request';

export class DownloadFileUtil 
{
    public static constructFromJSON(json : any) : DownloadFile {
        if (!json) return null;

        let type : DownloadFileType = <any>DownloadFileType[json['type']];
        let file = new DownloadFile(
            json['id'], 
            json['name'], 
            type, 
            json['md5-checksum'], 
            json['resource'], 
            json['file-name'], 
            json['extract'], 
            json['target'], 
            json['file-size']
        );

        return file;
    }

    public static fetchDownloadFile(id : number, successFunc : (downloadfile : DownloadFile) => void, errorFunc : () => void = undefined) : void {
        let query = {id: id};
        request.get({
            url: LauncherConfig.BACKEND_HOST + '/download-file',
            json: true,
            qs: query
        }, (error, response, json) => {
            if (json == undefined) {
                console.log("Fetch downloadfile from util was undefined!");
                if (errorFunc)
                    errorFunc();
                return null;
            }

            if ((<any>Object).keys(json).length == 0) {
                errorFunc();
            }

            successFunc(
                DownloadFileUtil.constructFromJSON(json)
            );
        });
    }
}