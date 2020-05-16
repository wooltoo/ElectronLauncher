import { ComponentRegistryEntry, ComponentRegistry } from "./componentregistry";
import { ModalComponent } from "../modal/modal.component";
import { LauncherConfig } from "./launcherconfig";
import { ModalEntrySingle } from "./modalentry";
import { Modals } from "./modals";
import { TranslateService } from "@ngx-translate/core";

const { remote } = require("electron");
const request = require('request');

export class VersionChecker {

    private static translate : TranslateService;

    public static setTranslate(translate : TranslateService) {
        this.translate = translate;
    }

    public static check() : void {
        request.get({
            url: LauncherConfig.BACKEND_HOST + '/version',
            json: true
          }, (_error: any, _response: any, json: { [x: string]: any; } | undefined) => {
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
            let modalComponent : ModalComponent = <ModalComponent>ComponentRegistry.getInstance().get(ComponentRegistryEntry.MODAL_COMPONENT);
            let modal : ModalEntrySingle = new ModalEntrySingle(
                Modals.VERSION_CHECKER_NEW_VERSION_AVAILABLE,
                this.translate.instant('MODALS.VERSION-CHECKER-NEW-VERSION-AVAILABLE.TITLE'),
                this.translate.instant('MODALS.VERSION-CHECKER-NEW-VERSION-AVAILABLE.TEXT'),
                this.translate.instant('MODALS.VERSION-CHECKER-NEW-VERSION-AVAILABLE.BUTTON-SINGLE'),
                () => {
                    let window : Electron.BrowserWindow | null = remote.BrowserWindow.getFocusedWindow();
                    if (!window)
                        return;

                   window.close();
                }
            );
            modalComponent.enqueue(modal);
        }, 500);
    }
}