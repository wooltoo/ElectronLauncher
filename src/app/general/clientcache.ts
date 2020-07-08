import { ClientHelper } from './clienthelper';
import { FileRemover } from './fileremover';
import * as fs from 'fs';
import * as path from 'path';

export class ClientCache
{
    public clean() : void {
        let dir : string | undefined | null = ClientHelper.getInstance().getClientDirectory();
        if(!dir) 
            return;

        let cacheDirectory : string = path.join(dir, "Cache");
        if (fs.existsSync(cacheDirectory)) {
            FileRemover.removeDir(cacheDirectory);
        }
    }
}