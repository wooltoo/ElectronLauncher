export class Addon 
{
    constructor(private name : string,
                private description : string) 
    { }

    public getName() : string { 
        return this.name;
    }

    public getDescription() : string {
        return this.description;
    }
}