export class FileRemover {
    public static remove(filePath : String) : void {
        const fs = require('fs');

        if (!fs.existsSync(filePath))
            return;

        fs.unlinkSync(filePath, (error: any) => {
            if (error) console.error(error);
        });
    }

    public static removeDir(dirPath : string) : void {
        const fs = require('fs');

        if (!fs.existsSync(dirPath))
            return;

        fs.rmdirSync(dirPath, { recursive: true });
    }

    public static removeIfMD5Mismatch(filePath : string, MD5 : string) : void {
        const fs = require('fs');

        if (!MD5) return;
        if (!fs.existsSync(filePath)) return;

        const md5File = require('md5-file');
        let localMD5 = md5File.sync(filePath);

        if (localMD5 !== MD5)
            this.remove(filePath);
    }
}