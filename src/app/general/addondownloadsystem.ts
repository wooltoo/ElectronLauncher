import { DownloadFile } from './downloadfile';
import { AddonService } from '../addon.service';
import { DownloadHelper } from './downloadhelper';

export class AddonDownloadSystem
{
    private static instance : AddonDownloadSystem;
    private addonService! : AddonService;

    constructor(private downloadHelper : DownloadHelper) { }

    public static getInstance() : AddonDownloadSystem {
        if (!this.instance)
            this.instance = new AddonDownloadSystem(new DownloadHelper());

        return this.instance;
    }

    public setAddonService(addonService : AddonService) {
        this.addonService = addonService;
    }

    public download(files : DownloadFile[]) : void {
        this.downloadHelper.add(files);
        
        if (!this.downloadHelper.isDownloading())
            this.downloadHelper.download();
    }
}