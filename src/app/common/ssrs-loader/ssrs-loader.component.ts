import { Component, OnInit } from '@angular/core';
import { LoaderSeviceService } from '../../_services/loader-sevice.service';

@Component({
  selector: 'app-ssrs-loader',
  templateUrl: './ssrs-loader.component.html',
  styleUrls: ['./ssrs-loader.component.css']
})
export class SsrsLoaderComponent implements OnInit {

  public loading: boolean = false;

  constructor(public loaderService: LoaderSeviceService) { }

  ngOnInit() {
    this.loaderService.showLoader.subscribe(response => {
      this.loading = true;
    });

    this.loaderService.hideLoader.subscribe(response => {
      this.loading = false;
    });
  }




}
