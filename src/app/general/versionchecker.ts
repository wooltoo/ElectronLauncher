import { ComponentRegistryEntry, ComponentRegistry } from "./componentregistry";
import { ModalComponent } from "../modal/modal.component";
import { LauncherConfig } from "./launcherconfig";

const { remote } = require("electron");
const request = require('request');

export class VersionChecker {
    public static check() : void {
        request.get({
            url: LauncherConfig.BACKEND_HOST + '/version',
            json: true
          }, (error, response, json) => {
            if (json == undefined) {
              console.log("Fetch version was undefined!");
              return;
            }
            
            let version = json['version'];

            if (LauncherConfig.VERSION < version)
                this.showModal();
          }
        );

    }

    private static showModal() : void {
        setTimeout(() => {
            console.log("CHECKING");
            let modal : ModalComponent = <ModalComponent>ComponentRegistry.getInstance().get(ComponentRegistryEntry.MODAL_COMPONENT);
            modal.ShowSingle(
                "A new launcher version is available",
                "Please download the new launcher from http://talesoftime.com/launcher.exe",
                "EXIT",
                () => {
                    remote.BrowserWindow.getFocusedWindow().close();
                }
            );
        }, 500);
    }
}