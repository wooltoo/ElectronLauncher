import { LocalStorageService } from "ngx-webstorage";

export enum Setting {
    CLIENT_DIRECTORY, // string
    SHOULD_AUTO_PATCH // boolean
}

export class SettingsManager {
    private static instance : SettingsManager;
    
    private localSt : LocalStorageService;

    private settingsMap : Object = {};
    private settings : Object = {};

    private constructor() { 
        this.prepareSettingsMap();
    }

    public static getInstance(): SettingsManager {
        if (!SettingsManager.instance) {
            SettingsManager.instance = new SettingsManager();
        }

        return SettingsManager.instance;
    }

    public setLocalSt(localStI : LocalStorageService) : void {
        this.localSt = localStI;
        this.loadSettings();
        this.setDefaults();
    }

    public getSetting(setting : Setting) : any {
        return this.settings[setting];
    }

    public setSetting(setting : Setting, value : any) {
        this.settings[setting] = value;
        this.localSt.store(this.settingsMap[setting], value);
    }

    private loadSettings() : void {
        this.settings[Setting.CLIENT_DIRECTORY] = this.localSt.retrieve(this.settingsMap[Setting.CLIENT_DIRECTORY]);
        this.settings[Setting.SHOULD_AUTO_PATCH] = this.localSt.retrieve(this.settingsMap[Setting.SHOULD_AUTO_PATCH]);
    }

    private setDefaults() : void {
        if (!this.getSetting(Setting.SHOULD_AUTO_PATCH)) 
            this.setSetting(Setting.SHOULD_AUTO_PATCH, true);
    }

    private prepareSettingsMap() : void {
        this.settingsMap[Setting.CLIENT_DIRECTORY] = 'clientDirectory';
        this.settingsMap[Setting.SHOULD_AUTO_PATCH] = 'shouldAutoPatch';
    }
}