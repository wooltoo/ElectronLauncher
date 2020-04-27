import { Component, OnInit, Inject } from '@angular/core';
import { HomeComponent } from '../home/home.component';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent implements OnInit {

  clientDirectory : string = "SELECT GAME PATH";
  hasSelectedPath : boolean = false;

  constructor(@Inject(HomeComponent) private homeComponent : HomeComponent) { }

  ngOnInit(): void { }

  OnPressGo() : void {
    if (!this.hasSelectedPath)
      return;

    this.homeComponent.OnPickGamePath(this.clientDirectory);
  }

  OnPressSelectGamePath() : void {
    this.clientDirectory = this.SelectDirectory();
    this.hasSelectedPath = true;
  }

  OnPressDownload() : void {
    this.hasSelectedPath = true;
    this.homeComponent.OnSelectClientDownload(
      this.SelectDirectory()
    );
  }

  SelectDirectory() : string {
    const {dialog} = require('electron').remote;
    let dir = dialog.showOpenDialogSync({ properties: ['openDirectory']});

    if (dir == undefined || dir.length == 0) return;
    return dir[0];
  }
}
