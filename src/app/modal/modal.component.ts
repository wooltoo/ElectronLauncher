import { Component, OnInit } from '@angular/core';
import { ComponentRegistry, ComponentRegistryEntry } from '../general/componentregistry';

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
  showSingleButton : boolean = false;
  showDoubleButtons : boolean = true;

  onPressSingleFunc : () => void =  null;
  onPressPositiveFunc : () => void = null;
  onPressNegativeFunc : () => void = null;

  constructor() { }
  ngOnInit(): void {
    console.log("REGISTERING");
    ComponentRegistry.getInstance().register(ComponentRegistryEntry.MODAL_COMPONENT, this);
  }

  public ShowSingle(title : string, text : string, singleButtonText : string, onPressSingleFunc: () => void) : void {
    this.title = title;
    this.text = text;
    this.singleButtonText = singleButtonText;
    this.onPressSingleFunc = onPressSingleFunc;
    this.showSingleButton = true;
    this.showDoubleButtons = false;
    this.show = true;
  }

  public ShowDouble(title : string, text : string, buttonPositiveText : string, buttonNegativeText : string, 
                    onPressPositiveFunc: () => void, onPressNegativeFunc: () => void) : void {
    this.title = title;
    this.text = text;
    this.buttonPositiveText = buttonPositiveText;
    this.buttonNegativeText = buttonNegativeText;
    this.onPressPositiveFunc = onPressPositiveFunc;
    this.onPressNegativeFunc = onPressNegativeFunc;
    this.showSingleButton = false;
    this.showDoubleButtons = true;
    this.show = true;
  }

  private OnPressSingleButton() : void {
    this.onPressSingleFunc();
    this.show = false;
    this.showSingleButton = false;
  }

  private OnPressDoubleButtonNegative() : void {
    this.onPressNegativeFunc();
    this.show = false;
    this.showDoubleButtons = false;
  }

  private OnPressDoubleButtonPositive() : void {
    this.onPressPositiveFunc();
    this.show = false;
    this.showDoubleButtons = false;
  }
}
