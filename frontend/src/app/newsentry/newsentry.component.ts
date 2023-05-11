import { Component, OnInit, Input } from '@angular/core';
import { NewsEntry } from '../news-entry'; 

@Component({
  selector: 'app-newsentry',
  templateUrl: './newsentry.component.html',
  styleUrls: ['./newsentry.component.css']
})
export class NewsEntryComponent implements OnInit {

  @Input() title : string | undefined;
  @Input() datetime : string | undefined;
  @Input() text : string | undefined;

  constructor() {
  }

  ngOnInit(): void {

  }

}
