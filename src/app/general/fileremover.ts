export class FileRemover {
    public static remove(filePath : String) : void {
        const fs = require('fs');

        fs.unlink(filePath, (error: any) => {
            if (error) throw error;
        });
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