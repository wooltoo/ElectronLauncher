import { TranslateService } from '@ngx-translate/core';

export class TranslateServiceHolder {

    private static instance = null;
    private translate : TranslateService;

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

    public getService() : TranslateService {
        return this.translate;
    }
}