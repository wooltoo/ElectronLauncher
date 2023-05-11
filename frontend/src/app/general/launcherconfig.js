"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var LauncherConfig = /** @class */ (function () {
    function LauncherConfig() {
    }
    // The launcher's version.
    LauncherConfig.VERSION = 0.90;
    // The project's website.
    LauncherConfig.WEBSITE = "http://www.website.com";
    // The hostname with port to the backend.
    //static BACKEND_HOST : string = "http://116.203.225.226:3000";
    LauncherConfig.BACKEND_HOST = "http://127.0.0.1:3000";
    // How often the launcher checks if a patch is missing locally (MS).
    LauncherConfig.INTERVAL_CHECK_FOR_PATCH_TO_DL = 1000;
    // How often the launcher checks for new patches added on the remote host (MS).
    //static INTERVAL_CHECK_FOR_NEW_REMOTE_FILES : number = 10000;
    LauncherConfig.INTERVAL_CHECK_FOR_NEW_REMOTE_FILES = 3000;
    // How often the launcher updates news locally from news service information (MS).
    LauncherConfig.INTERVAL_CHECK_FOR_NEWS = 2000;
    // How often the launchers check for new news on the remote host (MS).
    LauncherConfig.INTERVAL_CHECK_FOR_NEWS_REMOTE = 2500;
    // How often the launcher should update the settings panel  (MS).
    LauncherConfig.INTERVAL_UPDATE_SETTINGS = 500;
    // Interval to check for a new Youtube video to be shown (MS).
    LauncherConfig.INTERVAL_CHECK_FOR_YOUTUBE_VIDEO = 2500;
    // How often the launcher should fetch addons (MS).
    LauncherConfig.INTERVAL_FETCH_ADDONS = 5000;
    // How often the launcher should investigate if a addon is installed (MS).
    LauncherConfig.INTERVAL_INVESTIGATE_ADDON_STATUS = 1000;
    // How often the launcher should check if it's online or offline (MS).
    // Should be higher than MAXIMUM_RESPONSE_TIME.
    LauncherConfig.INTERVAL_CHECK_ONLINE_STATUS = 2000;
    // Maximum response time to be counted as online in (MS).
    LauncherConfig.MAXIMUM_RESPONSE_TIME_ONLINE = 1500;
    // The name of the client remote resource.
    LauncherConfig.CLIENT_RESOURCE_NAME = "client";
    // The name of the client.
    LauncherConfig.CLIENT_FILE_NAME = "client.zip";
    // Devices if landing screen should be forced upon startup.
    LauncherConfig.FORCE_LANDING_SCREEN = false;
    // Default Youtube video to be shown.
    LauncherConfig.DEFAULT_YOUTUBE_VIDEO = "https://www.youtube.com/embed/IBHL_-biMrQ";
    // Use https://www.gbmb.org/mb-to-bytes to convert from TB/MB to bytes (binary result)
    // This size should be an estimate and not specific.
    LauncherConfig.CLIENT_DOWNLOAD_SIZE = 159383552;
    LauncherConfig.CLIENT_FILE_SIZE = 267386880;
    LauncherConfig.PATCH_FILE_SIZE = 11324620;
    return LauncherConfig;
}());
exports.LauncherConfig = LauncherConfig;
//# sourceMappingURL=launcherconfig.js.map