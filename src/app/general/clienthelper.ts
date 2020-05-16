import { Setting, SettingsManager } from './settingsmanager';

export class ClientHelper {
    private static instance : ClientHelper;
    private requestedDirectory : string | null | undefined;

    private constructor() {}

    public static getInstance(): ClientHelper {
        if (!ClientHelper.instance)
            ClientHelper.instance = new ClientHelper();

        return ClientHelper.instance;
    }

    public hasClientInstalled() : boolean {
        return SettingsManager.getInstance().getSetting(Setting.CLIENT_DIRECTORY) != null;
    }

    public getClientDirectory() : string | null {
        if (!this.hasClientInstalled())
            return null;

        return SettingsManager.getInstance().getSetting(Setting.CLIENT_DIRECTORY);
    }

    public setClientDirectory(directory : String) : void {
        SettingsManager.getInstance().setSetting(Setting.CLIENT_DIRECTORY, directory);
    }

    public clearClientDirectory() : void {
        SettingsManager.getInstance().setSetting(Setting.CLIENT_DIRECTORY, null);
    }

    public setRequestedClientDirectory(directory : string) : void {
        this.requestedDirectory = directory;
    }

    public getRequestedClientDirectory() : string | undefined | null {
        return this.requestedDirectory;
    }

    public static hasClientInDirectory(directory : string) : boolean {
        const fs = require('fs');
        const path = require('path');

        let executablePath = path.join(directory, 'Data');
        return fs.existsSync(executablePath);
    }
}