export class LauncherConfig 
{
    // The project's website.
    static WEBSITE : string = "http://www.website.com";

    // The hostname with port to the backend.
    //static BACKEND_HOST : string = "http://116.203.225.226:3000";
    static BACKEND_HOST : string = "http://127.0.0.1:3000";
    
    // How often the launcher checks if a patch is missing locally (MS).
    static INTERVAL_CHECK_FOR_PATCH_TO_DL : number = 1000; // orig

    // Decides if the launcher should check for new patches on the remote host.
    static SHOULD_CHECK_FOR_NEW_REMOTE_FILES : boolean = true;
    // How often the launcher checks for new patches added on the remote host (MS).
    static INTERVAL_CHECK_FOR_NEW_REMOTE_FILES : number = 10000; //orig
    
    // How often the launcher updates news (MS).
    static INTERVAL_CHECK_FOR_NEWS : number = 2000; //orig

    // How often the launcher should update the settings panel game directory (MS).
    static INTERVAL_UPDATE_SETTINGS_GAME_DIRECTORY = 500;

    // The name of the client remote resource.
    static CLIENT_RESOURCE_NAME : string = "client";

    // The name of the client.
    static CLIENT_FILE_NAME : string = "client.zip";

    // Devices if landing screen should be forced upon startup.
    static FORCE_LANDING_SCREEN : boolean = true;
}