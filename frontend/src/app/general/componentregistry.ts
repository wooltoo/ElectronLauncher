export enum ComponentRegistryEntry 
{
    HOME_COMPONENT,
    SETTINGS_COMPONENT,
    MODAL_COMPONENT
}

export class ComponentRegistry {
    private static instance : ComponentRegistry;
    private registry : Record<number, any> = {};

    private constructor() { }
    public static getInstance() : ComponentRegistry {
        if (!ComponentRegistry.instance)
            ComponentRegistry.instance = new ComponentRegistry();

        return ComponentRegistry.instance;
    }

    public register(key : ComponentRegistryEntry, obj : Object) : void {
        this.registry[key] = obj;
    }

    public get(key : ComponentRegistryEntry) : any {
        return this.registry[key];
    } 
}