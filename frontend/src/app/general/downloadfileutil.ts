import { DownloadFile, DownloadFileType } from './downloadfile';
import { LauncherConfig } from './launcherconfig';

const axios = require('axios').default;

export class DownloadFileUtil 
{
    public static constructFromJSON(json : any) : DownloadFile | null {
        if (!json) {
            return null;
        }

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

    public static fetchDownloadFile(id : number, successFunc : (downloadfile : DownloadFile | null) => void, errorFunc : (() => void) | undefined = undefined) : void {
        let checkTime : number = 250;
        let interval = setInterval(() => {
            axios.get(LauncherConfig.BACKEND_HOST + '/download-file', {
                params: {
                    id: id
                }
            })
            .then(function (response : any) {
                console.log(response.data);
                successFunc(
                    DownloadFileUtil.constructFromJSON(response.data)
                );
                clearInterval(interval);
            })
            .catch(function (error : any) {
                console.log(error);
                if (errorFunc) {
                    errorFunc();
                }
            });
        }, checkTime);
    }
}