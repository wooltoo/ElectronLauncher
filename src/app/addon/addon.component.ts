import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-addon',
  templateUrl: './addon.component.html',
  styleUrls: ['./addon.component.css']
})
export class AddonComponent implements OnInit {

  @Input() private title : string;
  @Input() private description: string;

  public constructor() { }

  ngOnInit(): void {

  }

}
