import { Addon } from './addon';

export interface AddonServiceCallback {
    OnAddonsUpdated(addons : Addon[]) : void;
}