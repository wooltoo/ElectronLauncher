export class LauncherConfig 
{
    // The launcher's version.
    static VERSION : number = 0.90;

    // The project's website.
    static WEBSITE : string = "http://www.website.com";

    // The hostname with port to the backend.
    //static BACKEND_HOST : string = "http://116.203.225.226:3000";
    static BACKEND_HOST : string = "http://127.0.0.1:3000";
    
    // How often the launcher checks if a patch is missing locally (MS).
    static INTERVAL_CHECK_FOR_PATCH_TO_DL : number = 1000; 

    // Decides if the launcher should check for new patches on the remote host.
    static SHOULD_CHECK_FOR_NEW_REMOTE_FILES : boolean = true;
    // How often the launcher checks for new patches added on the remote host (MS).
    static INTERVAL_CHECK_FOR_NEW_REMOTE_FILES : number = 10000;
    
    // How often the launcher updates news locally from news service information (MS).
    static INTERVAL_CHECK_FOR_NEWS : number = 2000;

    // How often the launchers check for new news on the remote host (MS).
    static INTERVAL_CHECK_FOR_NEWS_REMOTE : number = 2500;

    // How often the launcher should update the settings panel  (MS).
    static INTERVAL_UPDATE_SETTINGS = 500;

    // Interval to check for a new Youtube video to be shown (MS).
    static INTERVAL_CHECK_FOR_YOUTUBE_VIDEO = 2500;

    // How often the launcher should fetch addons (MS).
    static INTERVAL_FETCH_ADDONS = 5000;

    // The name of the client remote resource.
    static CLIENT_RESOURCE_NAME : string = "client";

    // The name of the client.
    static CLIENT_FILE_NAME : string = "client.zip";

    // Devices if landing screen should be forced upon startup.
    static FORCE_LANDING_SCREEN : boolean = false;

    // Default Youtube video to be shown.
    static DEFAULT_YOUTUBE_VIDEO : string = "https://www.youtube.com/embed/IBHL_-biMrQ";

    // Use https://www.gbmb.org/mb-to-bytes to convert from TB/MB to bytes (binary result)
    // This size should be an estimate and not specific.
    static CLIENT_DOWNLOAD_SIZE : number = 159383552;
    static CLIENT_FILE_SIZE : number = 267386880;
    static PATCH_FILE_SIZE : number = 11324620;
}