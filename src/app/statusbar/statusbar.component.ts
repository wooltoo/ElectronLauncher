import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { RealmService } from '../realm.service';
import { Realm } from '../general/realm';
import { RealmStatus } from '../general/realmstatus';

@Component({
  selector: 'app-statusbar',
  templateUrl: './statusbar.component.html',
  styleUrls: ['./statusbar.component.css']
})
export class StatusBarComponent implements OnInit {

  realmOneName : string = "SERVER ONE";
  realmOneStatus : string = "OFFLINE";
  realmOneStatusClass : string = "red";
  realmTwoName : string = "SERVER TWO";
  realmTwoStatus : string = "OFFLINE";
  realmTwoStatusClass : string = "red";

  constructor(private realmService : RealmService,
              private changeDetectorRef : ChangeDetectorRef) {

  }

  ngOnInit(): void {
    this.getRealms();
    setInterval(() => { this.getRealms(); }, 1000);
  }

  getRealms() : void {
    let realms : Realm[] =  this.realmService.getRealms();

    if (realms.length > 0) {
      this.realmOneName = realms[0].getName();

      if (realms[0].getStatus() == RealmStatus.ONLINE) {
        this.realmOneStatus = "ONLINE";
        this.realmOneStatusClass = "green";
      } else {
        this.realmOneStatus = "OFFLINE";
        this.realmOneStatusClass = "red";
      }
    }

    if (realms.length > 1) {
      this.realmTwoName = realms[1].getName();
      
      if (realms[1].getStatus() == RealmStatus.ONLINE) {
        this.realmTwoStatus = "ONLINE";
        this.realmTwoStatusClass = "green";
      } else {
        this.realmTwoStatus = "OFFLINE",
        this.realmTwoStatusClass = "red";
      }
    }


    //this.changeDetectorRef.detectChanges();
  }
}
