import { Component, OnInit, Inject } from '@angular/core';
import { HomeComponent } from '../home/home.component';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent implements OnInit {

  gameDirectory : string = null;

  constructor(@Inject(HomeComponent) private homeComponent : HomeComponent) { }

  ngOnInit(): void { }

  OnPressGo() : void {
    if (this.gameDirectory == null)
      return;

    this.homeComponent.OnPickGamePath(this.gameDirectory);
  }

  OnPressSelectGamePath() : void {
    this.gameDirectory = this.SelectDirectory();
  }

  OnPressDownload() : void {
    this.homeComponent.OnSelectClientDownload(
      this.SelectDirectory()
    );
  }

  SelectDirectory() : string {
    const {dialog} = require('electron').remote;
    let dir = dialog.showOpenDialogSync({ properties: ['openDirectory']});

    if (dir.length == 0) return;
    return dir[0];
  }
}
