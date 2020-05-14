import { Component, OnInit, Input } from '@angular/core';
import { Addon } from '../general/addon';
import { LauncherConfig } from '../general/launcherconfig';

@Component({
  selector: 'app-addon',
  templateUrl: './addon.component.html',
  styleUrls: ['./addon.component.css']
})
export class AddonComponent implements OnInit {

  @Input() private addon : Addon;
  visible : boolean = true;
  downloaded : boolean = false;

  public constructor() { }

  ngOnInit(): void {
    this.runDownloadedCheck();
  }

  OnPressDownloadButton() { }

  public hide() : void {
    this.visible = false;
  }

  public show() : void {
    this.visible = true;
  }

  public getAddon() : Addon {
    return this.addon;
  }

  private runDownloadedCheck() : void {
    setInterval(() => {
      this.downloaded = this.addon.isInstalled();
    }, LauncherConfig.INTERVAL_INVESTIGATE_ADDON_STATUS);
  }
}
