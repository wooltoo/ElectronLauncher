import { DownloadFile, DownloadFileType } from '../general/downloadfile';

/**
 * DownloadFileUpdater is responsible for updating data for downloadfiles.
 */
export class DownloadFileUpdater {

    /**
     * Updates the DownloadFile with information from a JSON object,
     * if the information differs.
     * @param file The file to be updated.
     * @param json The JSON information to be checked against.
     * @returns true if a value has been updated and false if not.
     */
    public static update(file : DownloadFile, json : Object) : boolean {
        let modified = false;

        if (file.getType() != <any>DownloadFileType[json['type']]) {
            file.setType(<any>DownloadFileType[json['type']]);
            modified = true;
        } 
        
        if (file.getTarget() != json['target']) {
            file.setTarget(json['target']);
            modified = true;
        }

        if (file.getResource() != json['resource']) {
            file.setResource(json['resource']);
            modified = true;
        }

        if (file.getName() != json['name']) {
            file.setName(json['name']);
            modified = true;
        }

        if (file.getMD5() != json['md5-checksum']) {
            file.setMD5(json['md5-checksum']);
            modified = true;
        }

        if (file.getFileSize() != json['file-size']) {
            file.setFileSize(json['file-size']);
            modified = true;
        }

        if (file.getFileName() != json['file-name']) {
            file.setFileName(json['file-name']);
            modified = true;
        }

        if (file.getExtract() != json['extract']) {
            file.setExtract(json['extract']);
            modified = true;
        }

        return modified;
    }
}