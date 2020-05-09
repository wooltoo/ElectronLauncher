import { InstallCallback } from "./installcallback";
import { DownloadCallback } from "./downloadcallback";
import { DownloadListService } from "../download-list.service";

export interface InstallState extends DownloadCallback, InstallCallback {
    OnEnterState() : void;
    OnExitState() : void;
    GetDownloadListService() : DownloadListService;
}