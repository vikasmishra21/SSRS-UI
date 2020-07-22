import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-po-returns',
  templateUrl: './po-returns.component.html',
  styleUrls: ['./po-returns.component.css']
})
export class PoReturnsComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }

  ShowSummary() {
    let showOnUrls: string[] = ['/poreturns/scan', '/poreturns/scandetails'];
    return showOnUrls.indexOf(this.router.url) > -1;
  }

}
