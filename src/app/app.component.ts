import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  options = {
    position: ["bottom", "right"],
    timeOut: 3000,
    lastOnBottom: true,
    clickToClose: true

  }

  constructor(private router: Router) { }

  ShowNavs() {
    let hideRoutes = ['login', 'qa'];
    let parentUrl = this.router.url.split('/')[1];
    if (!parentUrl)
      return false;
      
    return hideRoutes.indexOf(parentUrl) == -1;;
  }
}
