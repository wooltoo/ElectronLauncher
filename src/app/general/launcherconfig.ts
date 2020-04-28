export class LauncherConfig 
{
    // The project's website.
    static WEBSITE = "http://www.website.com";

    // The hostname with port to the backend.
    static BACKEND_HOST = "http://116.203.225.226:3000";
    // How often the launcher checks if a patch is missing locally (MS).
    static INTERVAL_CHECK_FOR_PATCH_TO_DL : number = 500;

    // Decides if the launcher should check for new patches on the remote host.
    static SHOULD_CHECK_FOR_NEW_REMOTE_PATCHES : boolean = true;
    // How often the launcher checks for new patches added on the remote host (MS).
    static INTERVAL_CHECK_FOR_NEW_REMOTE_PATCHES : number = 2500;

    // How often the launcher updates news (MS).
    static INTERVAL_CHECK_FOR_NEWS : number = 1000;

    // The name of the client remote resource.
    static CLIENT_RESOURCE_NAME = "client";
}