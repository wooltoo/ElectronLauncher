import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from 'ngx-webstorage';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

  toggleActive : boolean = true;
  directoryPath : string = "unk";

  constructor(private localSt : LocalStorageService) { }

  ngOnInit(): void {
    this.directoryPath = this.localSt.retrieve('clientDirectory');
    this.directoryPath = "unk";
  }

  OnPressToggleAutomaticUpdates() {
    this.toggleActive = !this.toggleActive;
  }
x
}
