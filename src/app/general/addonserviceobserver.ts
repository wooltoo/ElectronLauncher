import { Addon } from './addon';

export interface AddonServiceObserver {
    OnAddonsUpdated(addons : Addon[]) : void;
}