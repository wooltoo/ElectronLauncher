import { LocalStorageService } from "ngx-webstorage";
import { Setting, SettingsManager } from './settingsmanager';

export class ClientHelper {
    private static instance : ClientHelper;

    private constructor() {}

    public static getInstance(): ClientHelper {
        if (!ClientHelper.instance)
            ClientHelper.instance = new ClientHelper();

        return ClientHelper.instance;
    }

    public hasClientInstalled() : boolean {
        return SettingsManager.getInstance().getSetting(Setting.CLIENT_DIRECTORY) != null;
    }

    public getClientDirectory() : string {
        if (!this.hasClientInstalled())
            return null;

        return SettingsManager.getInstance().getSetting(Setting.CLIENT_DIRECTORY);
    }

    public setClientDirectory(directory : String) : void {
        SettingsManager.getInstance().setSetting(Setting.CLIENT_DIRECTORY, directory);
    }
}