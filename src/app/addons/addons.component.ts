import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Addon } from '../general/addon';

@Component({
  selector: 'app-addons',
  templateUrl: './addons.component.html',
  styleUrls: ['./addons.component.css']
})
export class AddonsComponent implements OnInit {
  addons : Addon[] = [];

  constructor(private translate : TranslateService) { }

  ngOnInit(): void {
    this.addons.push(
      new Addon(
        'Bartender', 
        'Bartender is a full ActionBar replacement mod. It provides you with all the features needed to fully customize most aspects of your action and related bars.'
      )
    );

    this.addons.push(
      new Addon(
        'Bagnon', 
        'Bagnon is a highly customizable bag replacement addon designed to help the player find items as quickly and as easily as possible.'
      )
    );

    this.addons.push(
      new Addon(
        'Recount', 
        'Recount is a damage meter Addon that views activity in the combat log, and uses that information to provide tables and graphs showing the damage and healing distribution of a group or raid.'
      )
    );

    this.addons.push(
      new Addon(
        'Gladius', 
        'Gladius adds enemy unit frames to arenas for easier targeting and focusing. It is highly configurable and you can disable most features of this addon.'
      )
    );
  }

}
