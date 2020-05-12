import { ModalComponent } from '../modal/modal.component';
import { Modals } from './modals';

export class ModalEntry {
    constructor(
                protected modal : Modals,
                protected title : string,
                protected text : string) 
    { }

    public prepare(modalComponent : ModalComponent) {
        modalComponent.setTitle(this.title);
        modalComponent.setText(this.text);
    }

    public isSame(modal : ModalEntry) : boolean {
        return this.modal === modal.getModal();
    }

    public getModal() : Modals {
        return this.modal;
    }
}

export class ModalEntrySingle extends ModalEntry
{
    constructor(
                modal : Modals,
                title : string,
                text : string,
                private buttonText : string,
                private onPressFunc : () => void) 
    {
        super(modal, title, text);
    }

    public prepare(modalComponent : ModalComponent) {
        super.prepare(modalComponent);
        modalComponent.setSingleButtonText(this.buttonText);
        modalComponent.setOnPressSingleButtonFunc(this.onPressFunc);
        modalComponent.showSingleButton();
    }
}

export class ModalEntryDouble extends ModalEntry
{
    constructor(
                modal : Modals,
                title : string,
                text : string,
                private buttonPositiveText : string,
                private buttonNegativeText : string,
                private onPressPositiveFunc : () => void,
                private onPressNegativeFunc : () => void) 
    {
        super(modal, title, text);
    }

    public prepare(modalComponent : ModalComponent) {
        super.prepare(modalComponent);
        modalComponent.setPositiveButtonText(this.buttonPositiveText);
        modalComponent.setNegativeButtonText(this.buttonNegativeText);
        modalComponent.setOnPressNegativeFunc(this.onPressNegativeFunc);
        modalComponent.setOnPressPositiveFunc(this.onPressPositiveFunc);
        modalComponent.showDoubleButtons();
    }
}