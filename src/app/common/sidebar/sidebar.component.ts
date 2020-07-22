import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  OpenPhoneSurvey(){
    window.open("https://ssrs-staging-callins.azurewebsites.net/");
  }

  EditRecord(){
    window.open("https://ssrs-editscreen-staging.azurewebsites.net/");
  }
}
