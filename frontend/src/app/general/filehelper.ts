import * as fs from 'fs';

import * as nodeDiskInfo from 'node-disk-info';
import { LauncherConfig } from './launcherconfig';
import { DownloadFile } from './downloadfile';
import { ClientHelper } from './clienthelper';

export class FileHelper 
{
    public static isDirectoryEmpty(directory : string) : boolean {
        return fs.readdirSync(directory).length == 0;
    }

    // Returns the free space in bytes or -1 if not found.
    public static getFreeSpace(directory : string) : number {
        let drive = directory.substring(0, directory.indexOf(':') + 1);

        const disks = nodeDiskInfo.getDiskInfoSync();
        for (const disk of disks) 
            if (disk.mounted === drive) 
                return disk.available;

        return -1;
    }

    /**
     * Checks whether or not a drive has enough space.
     * @param space The space to check for in bytes.
     */
    public static hasEnoughFreeSpace(directory : string, space : number) : boolean {
        return this.getFreeSpace(directory) >= space;
    }

    public static getRequiredSpaceForClient() : number {
        return LauncherConfig.CLIENT_FILE_SIZE + LauncherConfig.PATCH_FILE_SIZE;
    }

    public static getRequiredSpaceToInstallClient() : number {
        return this.getRequiredSpaceForClient() + LauncherConfig.CLIENT_DOWNLOAD_SIZE;
    }

    public static hasEnoughSpaceForClient(directory : string) : boolean {
        return FileHelper.hasEnoughFreeSpace(directory, FileHelper.getRequiredSpaceForClient());
    }

    public static hasEnoughSpaceToInstallClient(directory : string) : boolean {
        return FileHelper.hasEnoughFreeSpace(directory, FileHelper.getRequiredSpaceToInstallClient());
    }

    public static hasEnoughSpaceToInstallPatches(directory : string) : boolean {
        return FileHelper.hasEnoughFreeSpace(directory, LauncherConfig.PATCH_FILE_SIZE);
    }

    public static hasEnoughSpaceFor(downloadFile : DownloadFile) : boolean {
        return FileHelper.hasEnoughFreeSpace(downloadFile.getLocalDirectory(), downloadFile.getFileSize());
    }
}