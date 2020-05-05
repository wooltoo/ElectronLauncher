import { InstallCallback } from "./installcallback";
import { DownloadCallback } from "./downloadcallback";

export interface InstallState extends DownloadCallback, InstallCallback {
    OnEnterState() : void;
    OnExitState() : void;
}