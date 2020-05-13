import { Component, OnInit, Input } from '@angular/core';
import { Addon } from '../general/addon';

@Component({
  selector: 'app-addon',
  templateUrl: './addon.component.html',
  styleUrls: ['./addon.component.css']
})
export class AddonComponent implements OnInit {

  @Input() private addon : Addon;
  @Input() private downloaded : boolean;

  visible : boolean = true;

  public constructor() { }

  ngOnInit(): void {
    this.downloaded = Math.ceil(Math.random() * 2) == 1 ? true : false;
  }

  OnPressDownloadButton() {

  }

  public hide() : void {
    this.visible = false;
  }

  public show() : void {
    this.visible = true;
  }

  public getAddon() : Addon {
    return this.addon;
  }
}
