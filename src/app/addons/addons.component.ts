import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Addon } from '../general/addon';
import { AddonComponent } from '../addon/addon.component';
import { AddonService } from '../addon.service';

import * as $ from 'jquery';
import { AddonServiceObserver } from '../general/addonserviceobserver';

@Component({
  selector: 'app-addons',
  templateUrl: './addons.component.html',
  styleUrls: ['./addons.component.css']
})
export class AddonsComponent implements OnInit, AddonServiceObserver {
  @ViewChildren(AddonComponent) viewChildren!: QueryList<AddonComponent>;

  addons : Addon[] = [];
  filter : string = "";  

  constructor(private translate : TranslateService,
              private addonService : AddonService) { }

  ngOnInit(): void {
    this.prepareSearchField();
    this.loadAddons();
    this.addonService.observe(this);
  }

  loadAddons() : void {
    this.addonService.getAddons().forEach((addon : Addon) => {
      this.addAddon(addon);
    });
  }

  OnAddonsUpdated(addons: Addon[]): void {
    addons.forEach((addon : Addon) => {
      this.addAddon(addon);
    });
  }

  onScrollDown() : void { }
  onScrollUp() : void { }

  private prepareSearchField() : void {
    $('#addons-search-field').on('change keydown paste input', () => {
      if (this.filter != $('#addons-search-field').val()) {
        let val : any = $('#addons-search-field').val();
        this.filter = val.toString();
        this.filterAddons();
      }
    });
  }

  private filterAddons() : void {
    let activeFilter = this.filter.toLowerCase();

    this.viewChildren.forEach((addonComponent : AddonComponent) => {
      let lowerName = addonComponent.getAddon().getName().toLowerCase();
      if (lowerName.indexOf(activeFilter) != -1) {
        addonComponent.show();
      } else 
        addonComponent.hide();
    });
  }

  private addAddon(newAddon : Addon) : void {
    let addon : Addon | undefined = this.addons.find(addon => addon.getId() == newAddon.getId());
    if (!addon)
      this.addons.push(newAddon);
  }
}
