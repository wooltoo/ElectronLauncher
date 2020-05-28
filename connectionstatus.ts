const request = require('request');

// Should only be running in the main process of electron.
export class ConnectionStatus
{
    connected : boolean = false;

        // How often the launcher should check if it's online or offline (MS).
    // Should be higher than MAXIMUM_RESPONSE_TIME.
    static INTERVAL_CHECK_ONLINE_STATUS = 2000;

    // Maximum response time to be counted as online in (MS).
    static MAXIMUM_RESPONSE_TIME_ONLINE = 1500;

    constructor() {
        this.checkConnectivity();
        setInterval(
          () => { this.checkConnectivity(); },
         ConnectionStatus.INTERVAL_CHECK_ONLINE_STATUS
        );
    } 

    private checkConnectivity() : void {
        request.get({
            url: 'http://127.0.0.1:3000/reachable',
            timeout: ConnectionStatus.MAXIMUM_RESPONSE_TIME_ONLINE,
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