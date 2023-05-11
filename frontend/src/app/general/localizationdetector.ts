import { ClientHelper } from './clienthelper';
import * as fs from 'fs';
import * as path from 'path';

export class LocalizationDetector
{
    private static localeCandidates = ['frFr', 'deDE', 'enGB', 'enUS', 'itIT', 'koKR', 'zhCN', 'zhTW', 'ruRU', 'esES', 'esMX', 'ptBR'];

    public static find() : string {
        let dir : string | undefined | null = ClientHelper.getInstance().getClientDirectory();
        if (!dir)
            throw new Error('Could not find locale because client install directory could not be located.');

        let dataDirectory = path.join(dir, 'Data');

        let found : string = '';
        this.localeCandidates.forEach((candidate) => {
            let checkPath = path.join(dataDirectory, candidate);
            if (fs.existsSync(checkPath)) {
                found = candidate;
            }
        });

        if (found === '')
            throw new Error('Could not find locale for client.');

        return found;
    }
}