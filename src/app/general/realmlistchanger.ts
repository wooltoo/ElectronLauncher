import { LocalizationDetector } from './localizationdetector';
import * as path from 'path';
import * as fs from 'fs';
import { ClientHelper } from './clienthelper';
import { FileRemover } from './fileremover';

export class RealmListChanger
{
    public setRealmList(realmList : string) : boolean {
        if (!realmList) return false;

        let locale = LocalizationDetector.find();

        let dataPath = path.join(ClientHelper.getInstance().getClientDirectory(), 'Data');
        let localePath = path.join(dataPath, locale);
        let realmListPath = path.join(localePath, 'realmlist.wtf');
        
        if (fs.existsSync(realmListPath)) 
            FileRemover.remove(realmListPath);

        let fullRealmList = 'set realmlist ' + realmList;
        if (!fs.existsSync(localePath))
            fs.mkdirSync(localePath, { recursive: true });
            
        fs.writeFileSync(realmListPath, fullRealmList); 

        return true;
    }
}