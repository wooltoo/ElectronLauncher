import { ClientHelper } from './clienthelper';
import fs from 'fs';
import path from 'path';

export class LocalizationDetector
{
    private static localeCandidates = ["frFr", "deDE", "enGB", "enUS", "itIT", "koKR", "zhCN", "zhTW", "ruRU", "esES", "esMX", "ptBR"];

    public static find() : string {
        let found : string = null; 
        let dataDirectory = path.join(ClientHelper.getInstance().getClientDirectory(), 'Data');

        this.localeCandidates.forEach((candidate) => {
            let checkPath = path.join(dataDirectory, candidate);
            if (fs.existsSync(checkPath)) {
                console.log("CheckPath: " + checkPath);
                return candidate;      
            }
        });

        return found;
    }
}