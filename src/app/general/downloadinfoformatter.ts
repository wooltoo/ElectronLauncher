export class DownloadInfoFormatter
{
    public static formatProgress(progress : string) : string {
        const number = Number(progress);
        return number.toFixed(2).toString() + "%";
    }
    
    public static formatDownloadSpeed(downloadSpeed) : string {
        let downloadSpeedNum = Number(downloadSpeed) / Math.pow(1024,2);
        return downloadSpeedNum.toFixed(2).toString() + " MB/s";
    }
}