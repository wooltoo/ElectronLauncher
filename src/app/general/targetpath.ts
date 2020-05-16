import * as path from 'path';
import { ClientHelper } from './clienthelper';
import { LocalizationDetector } from './localizationdetector';

export class TargetPath
{
    public static process(targetPath : string) : string {
        let dir : string | undefined | null = ClientHelper.getInstance().getClientDirectory();
        if (!dir)
            throw new Error('Could not process targetPath as client directory could not be located.');

        let fullPath = path.join(dir, targetPath);
        fullPath = fullPath.replace('<locale>', LocalizationDetector.find());
        return fullPath;
    }
}