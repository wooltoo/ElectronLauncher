import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { RealmService } from '../realm.service';
import { Realm } from '../general/realm';
import { RealmStatus } from '../general/realmstatus';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-statusbar',
  templateUrl: './statusbar.component.html',
  styleUrls: ['./statusbar.component.css']
})
export class StatusBarComponent implements OnInit {

  realmOneName : string = "REALM ONE";
  realmOneStatus : string = "OFFLINE";
  realmOneStatusClass : string = "red";
  realmOneEllipse : string = "offline-ellipse";
  realmOneGlow : string = "offline-server";

  realmTwoName : string = "REALM TWO";
  realmTwoStatus : string = "OFFLINE";
  realmTwoStatusClass : string = "red";
  realmTwoEllipse : string = "offline-ellipse";
  realmTwoGlow : string = "offline-server";

  constructor(private realmService : RealmService, private translate : TranslateService) { }

  ngOnInit(): void {
    this.getRealms();
    setInterval(() => { this.getRealms(); }, 1000);
  }

  getRealms() : void {
    let realms : Realm[] =  this.realmService.getRealms();

    if (realms.length > 0) {
      this.realmOneName = realms[0].getName();

      if (realms[0].getStatus() == RealmStatus.ONLINE) {
        this.realmOneStatus = this.translate.instant('STATUSBAR.TEXT-ONLINE');
        this.realmOneStatusClass = "green";
        this.realmOneEllipse = "online-ellipse";
        this.realmOneGlow = "online-server";
      } else {
        this.realmOneStatus = this.translate.instant('STATUSBAR.TEXT-OFFLINE');
        this.realmOneStatusClass = "red";
        this.realmOneEllipse = "offline-ellipse";
        this.realmOneGlow = "offline-server";
      }
    }

    if (realms.length > 1) {
      this.realmTwoName = realms[1].getName();
      
      if (realms[1].getStatus() == RealmStatus.ONLINE) {
        this.realmTwoStatus = this.translate.instant('STATUSBAR.TEXT-ONLINE');
        this.realmTwoStatusClass = "green";
        this.realmTwoEllipse = "online-ellipse";
        this.realmTwoGlow = "online-server";
      } else {
        this.realmTwoStatus = this.translate.instant('STATUSBAR.TEXT-OFFLINE');
        this.realmTwoStatusClass = "red";
        this.realmTwoEllipse = "offline-ellipse";
        this.realmTwoGlow = "offline-server";
      }
    }
  }
}
