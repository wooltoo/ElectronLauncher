import { InstallCallback } from "./installcallback";
import { DownloadCallback } from "./downloadcallback";
import { LocalStorageService } from "ngx-webstorage";

export interface InstallState extends DownloadCallback, InstallCallback {
    OnEnterState() : void;
    OnExitState() : void;
    GetLocalStorageService() : LocalStorageService;
}