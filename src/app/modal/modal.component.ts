import { Component, OnInit } from '@angular/core';
import { ComponentRegistry, ComponentRegistryEntry } from '../general/componentregistry';
import { ModalEntry } from '../general/modalentry';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent implements OnInit {

  title : String = "Troubleshooting";
  text : String = "Would you like to initiate the client repair? This will take effect once the launcher has been relaunched."
  singleButtonText : String = "OKAY";

  buttonPositiveText : String = "CONFIRM";
  buttonNegativeText : String = "CANCEL";
  
  show : boolean = false;
  shouldShowSingleButton : boolean = false;
  shouldShowDoubleButtons : boolean = false;

  onPressSingleFunc : () => void =  null;
  onPressPositiveFunc : () => void = null;
  onPressNegativeFunc : () => void = null;

  queue : ModalEntry[] = [];

  constructor() { }
  ngOnInit(): void {
    ComponentRegistry.getInstance().register(ComponentRegistryEntry.MODAL_COMPONENT, this);
  }

  public enqueue(entry : ModalEntry) : void {
    if (this.isInQueue(entry))
      return;

    console.log("ENQUEUING: " + entry.getModal());
    this.queue.unshift(entry);

    if (!this.show) 
      this.showNext();
  }

  private showNext() : void {
    if (this.queue.length < 1)
      return;

    let entry : ModalEntry = this.queue[this.queue.length - 1];
    entry.prepare(this);
    this.show = true;
  }

  private isInQueue(entry : ModalEntry) {
    for (let modal of this.queue) 
      if (modal.isSame(entry))
        return true;

    return false;
  }

  public setTitle(title : string) {
    this.title = title;
  }

  public setText(text : string) {
    this.text = text;
  }

  public setSingleButtonText(text : string) {
    this.singleButtonText = text;
  }

  public setPositiveButtonText(text : string) {
    this.buttonPositiveText = text;
  }

  public setNegativeButtonText(text : string) {
    this.buttonNegativeText = text;
  }

  public setOnPressSingleButtonFunc(onPressSingleButtonFunc : any) {
    this.onPressSingleFunc = onPressSingleButtonFunc;
  }

  public setOnPressPositiveFunc(onPressPositiveFunc : any) {
    this.onPressPositiveFunc = onPressPositiveFunc;
  }

  public setOnPressNegativeFunc(onPressNegativeFunc : any) {
    this.onPressNegativeFunc = onPressNegativeFunc;
  }

  public showSingleButton() : void {
    this.shouldShowSingleButton = true;
  }

  public showDoubleButtons() : void {
    this.shouldShowDoubleButtons = true;
  }

  private OnPressSingleButton() : void {
    this.onPressSingleFunc();
    this.queue.pop();
    this.hideAll();
    this.showNext();
  }

  private OnPressDoubleButtonNegative() : void {
    this.onPressNegativeFunc();
    this.queue.pop();
    this.hideAll();
    this.showNext();
  }

  private OnPressDoubleButtonPositive() : void {
    this.onPressPositiveFunc();
    this.queue.pop();
    this.hideAll();
    this.showNext();
  }

  private hideAll() {
    this.show = false;
    this.shouldShowDoubleButtons = false;
    this.shouldShowSingleButton = false;
  }
}
