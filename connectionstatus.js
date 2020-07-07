"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var request = require('request');
// Should only be running in the main process of electron.
var ConnectionStatus = /** @class */ (function () {
    function ConnectionStatus() {
        var _this = this;
        this.connected = false;
        this.checkConnectivity();
        setInterval(function () { _this.checkConnectivity(); }, ConnectionStatus.INTERVAL_CHECK_ONLINE_STATUS);
    }
    ConnectionStatus.prototype.checkConnectivity = function () {
        var _this = this;
        request.get({
            url: 'http://127.0.0.1:3000/reachable',
            timeout: ConnectionStatus.MAXIMUM_RESPONSE_TIME_ONLINE,
            json: true,
        }, function (_error, _response, json) {
            if (_error || json == undefined) {
                _this.setConnected(false);
                return;
            }
            _this.setConnected(true);
        });
    };
    ConnectionStatus.prototype.setConnected = function (status) {
        this.connected = status;
    };
    ConnectionStatus.prototype.isConnected = function () {
        return this.connected;
    };
    // How often the launcher should check if it's online or offline (MS).
    // Should be higher than MAXIMUM_RESPONSE_TIME.
    ConnectionStatus.INTERVAL_CHECK_ONLINE_STATUS = 2000;
    // Maximum response time to be counted as online in (MS).
    ConnectionStatus.MAXIMUM_RESPONSE_TIME_ONLINE = 1500;
    return ConnectionStatus;
}());
exports.ConnectionStatus = ConnectionStatus;
//# sourceMappingURL=connectionstatus.js.map