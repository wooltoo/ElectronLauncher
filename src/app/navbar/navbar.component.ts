import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  website = "http://www.website.com";

  constructor() { }

  ngOnInit(): void {
  }

  openWebsite(suburl) {
    window.open(this.website + suburl);
  }
}
