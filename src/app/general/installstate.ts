import { InstallCallback } from "./installcallback";
import { DownloadCallback } from "./downloadcallback";
import { DownloadListService } from "../download-list.service";
import { LocalStorageService } from "ngx-webstorage";

export interface InstallState extends DownloadCallback, InstallCallback {
    OnEnterState() : void;
    OnExitState() : void;
    GetDownloadListService() : DownloadListService;
    GetLocalStorageService() : LocalStorageService;
}