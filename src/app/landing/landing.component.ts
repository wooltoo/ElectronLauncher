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
    let directory = this.SelectDirectory();
    if (directory == undefined)
      return;
    
    this.clientDirectory = directory;
    this.hasSelectedPath = true;
  }

  OnPressDownload() : void {
    let directory = this.SelectDirectory();
    if (directory == undefined)
      return;

    /*const fs = require('fs');
    let isEmpty = fs.readdirSync(directory).length == 0;
    if (!isEmpty) {
      console.log("client directory not empty");
      return;
    }*/

    this.hasSelectedPath = true;
    this.homeComponent.OnSelectClientDownload(directory);
  }

  SelectDirectory() : string {
    const {dialog} = require('electron').remote;
    let dir = dialog.showOpenDialogSync({ properties: ['openDirectory']});

    if (dir == undefined || dir.length == 0) return;
    return dir[0];
  }
}
