import { LocalStorageService } from "ngx-webstorage";

export class ClientHelper {
    private static instance : ClientHelper;
    private localSt : LocalStorageService;

    private constructor() { }
    public static getInstance(): ClientHelper {
        if (!ClientHelper.instance) {
            ClientHelper.instance = new ClientHelper();
        }

        return ClientHelper.instance;
    }

    public setLocalSt(localStI : LocalStorageService) : void {
        this.localSt = localStI;
    }

    public hasClientInstalled() : boolean {
        return this.localSt.retrieve('clientDirectory') != null
    }

    public getClientDirectory() : string {
        if (!this.hasClientInstalled())
            return null;

        return this.localSt.retrieve('clientDirectory');
    }
}