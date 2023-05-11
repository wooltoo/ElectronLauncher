"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var request = require('request');
var launcherconfig_1 = require("../general/launcherconfig");
// Should only be running in the main process of electron.
var ConnectionStatus = /** @class */ (function () {
    function ConnectionStatus() {
        var _this = this;
        this.connected = false;
        this.checkConnectivity();
        setInterval(function () { _this.checkConnectivity(); }, launcherconfig_1.LauncherConfig.INTERVAL_CHECK_ONLINE_STATUS);
    }
    ConnectionStatus.prototype.checkConnectivity = function () {
        var _this = this;
        request.get({
            url: launcherconfig_1.LauncherConfig.BACKEND_HOST + '/reachable',
            timeout: launcherconfig_1.LauncherConfig.MAXIMUM_RESPONSE_TIME_ONLINE,
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
    return ConnectionStatus;
}());
exports.ConnectionStatus = ConnectionStatus;
//# sourceMappingURL=connectionstatus.js.map