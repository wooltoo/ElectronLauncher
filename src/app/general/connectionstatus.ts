const request = require('request');
import { LauncherConfig } from '../general/launcherconfig';

// Should only be running in the main process of electron.
export class ConnectionStatus
{
    connected : boolean = false;

    constructor() {
        this.checkConnectivity();
        setInterval(
          () => { this.checkConnectivity(); },
          LauncherConfig.INTERVAL_CHECK_ONLINE_STATUS
        );
    } 

    private checkConnectivity() : void {
        request.get({
            url: LauncherConfig.BACKEND_HOST + '/reachable',
            timeout: LauncherConfig.MAXIMUM_RESPONSE_TIME_ONLINE,
            json: true,
        }, (_error: any, _response: any, json: undefined) => 
        {
            if (_error || json == undefined) {
                this.setConnected(false);
                return;
            }

            this.setConnected(true);
        });
    }

    private setConnected(status : boolean) : void {
        this.connected = status;
    }

    public isConnected() : boolean {
       return this.connected;
    }
}