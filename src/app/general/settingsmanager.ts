import { LocalStorageService } from "ngx-webstorage";

export class SettingsManager {
    private static instance : SettingsManager;
    private localSt : LocalStorageService;

    private constructor() { }
    public static getInstance(): SettingsManager {
        if (!SettingsManager.instance) {
            SettingsManager.instance = new SettingsManager();
        }

        return SettingsManager.instance;
    }

    public setLocalSt(localStI : LocalStorageService) : void {
        this.localSt = localStI;
    }
}