import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
    console.log("init");
   }

  download()
  {

    // https://www.npmjs.com/package/electron-download-manager

    const { remote } = require('electron');
    const asset = "https://dl.paragon-servers.com/Paragon_3.3.5a_Win.zip";
    const target = "D:/DownloadTest";
    remote.require("electron-download-manager").download({
      url: asset,
      downloadFolder: target,
      onProgress: (progress, item) => {
        console.log("progress: " + progress);
      }
    }, function(error, info) {
      if (error) {
        console.log("Error: " + error);
      }
      console.log(info);
    });
    //download(remote.BrowserWindow.getFocusedWindow(), asset, {
    //  directory: "D:/DownloadTest"
   // });
    //https://dl.paragon-servers.com/Paragon_3.3.5a_Win.zip
  }
}
