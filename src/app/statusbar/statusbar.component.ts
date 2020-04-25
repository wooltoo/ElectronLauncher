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
  realmOneEllipse : string = "offline-ellipse";
  realmOneGlow : string = "offline-server";

  realmTwoName : string = "SERVER TWO";
  realmTwoStatus : string = "OFFLINE";
  realmTwoStatusClass : string = "red";
  realmTwoEllipse : string = "offline-ellipse";
  realmTwoGlow : string = "offline-server";

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
        this.realmOneEllipse = "online-ellipse";
        this.realmOneGlow = "online-server";
      } else {
        this.realmOneStatus = "OFFLINE";
        this.realmOneStatusClass = "red";
        this.realmOneEllipse = "offline-ellipse";
        this.realmOneGlow = "offline-server";
      }
    }

    if (realms.length > 1) {
      this.realmTwoName = realms[1].getName();
      
      if (realms[1].getStatus() == RealmStatus.ONLINE) {
        this.realmTwoStatus = "ONLINE";
        this.realmTwoStatusClass = "green";
        this.realmTwoEllipse = "online-ellipse";
        this.realmTwoGlow = "online-server";
      } else {
        this.realmTwoStatus = "OFFLINE",
        this.realmTwoStatusClass = "red";
        this.realmTwoEllipse = "offline-ellipse";
        this.realmTwoGlow = "offline-server";
      }
    }


    //this.changeDetectorRef.detectChanges();
  }
}
