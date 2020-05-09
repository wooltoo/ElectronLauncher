import * as path from 'path';
import { ClientHelper } from './clienthelper';
import { LocalizationDetector } from './localizationdetector';

export class TargetPath
{
    public static process(targetPath : string) : string {
        let fullPath = path.join(ClientHelper.getInstance().getClientDirectory(), targetPath);
        fullPath = fullPath.replace('<locale>', LocalizationDetector.find());
        return fullPath;
    }
}