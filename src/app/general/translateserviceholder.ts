import { TranslateService } from '@ngx-translate/core';

export class TranslateServiceHolder {

    private static instance : TranslateServiceHolder | null = null;
    private translate : TranslateService | null = null;

    private constructor() { }

    public static getInstance() : TranslateServiceHolder {
        if (this.instance)
            return this.instance;

        this.instance = new TranslateServiceHolder();
        return this.instance;
    }

    public setTranslateService(translate : TranslateService) : void {
        this.translate = translate;
    }

    public getService() : TranslateService | null {
        return this.translate;
    }
}