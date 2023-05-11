import { LocalStorageService } from "ngx-webstorage";

export enum Setting {
    CLIENT_DIRECTORY, // string
    SHOULD_AUTO_PATCH // boolean
}

export class SettingsManager {
    private static instance : SettingsManager;
    
    private localSt : LocalStorageService | undefined;

    private settingsMap : Record<number, string> = {};
    private settings : Record<number, any> = {};

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
        // Clears loca storage, so e.g. game directory settings.
        this.localSt.clear();
        this.loadSettings();
        this.setDefaults();
    }

    public getSetting(setting : Setting) : any {
        return this.settings[setting];
    }

    public setSetting(setting : Setting, value : any) {
        this.settings[setting] = value;

        if (!this.localSt)
            throw new Error('Could not save setting ' + setting + '. Local storage is not set.');

        this.localSt.store(this.settingToStorageString(setting), value);
    }

    private loadSettings() : void {
        if (!this.localSt)
            throw new Error('Could not load settings. Local storage is not set.');
            
        this.settings[Setting.CLIENT_DIRECTORY] = this.localSt.retrieve(this.settingToStorageString(Setting.CLIENT_DIRECTORY));
        this.settings[Setting.SHOULD_AUTO_PATCH] = this.localSt.retrieve(this.settingToStorageString(Setting.SHOULD_AUTO_PATCH));
    }

    private setDefaults() : void {
        if (this.getSetting(Setting.SHOULD_AUTO_PATCH) == null) 
            this.setSetting(Setting.SHOULD_AUTO_PATCH, true);
    }

    private prepareSettingsMap() : void {
        this.settingsMap[Setting.CLIENT_DIRECTORY] = 'clientDirectory';
        this.settingsMap[Setting.SHOULD_AUTO_PATCH] = 'shouldAutoPatch';
    }

    private settingToStorageString(setting : Setting) : string {
        return this.settingsMap[setting];
    }
}