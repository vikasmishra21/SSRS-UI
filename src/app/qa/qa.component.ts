import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { QaService } from "../_services/qa.service";
import { OrdersService } from '../_services/orders.service';
import * as _ from 'underscore';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-qa',
  templateUrl: './qa.component.html',
  styleUrls: ['./qa.component.css']
})
export class QaComponent implements OnInit, OnDestroy {
  orderCode: string;
  orderType: string;
  summaryID;
  image: string = '1';
  id;
  sub: any;
  SampleResponses: any[];
  imgsrc;
  password: string;

  constructor(private route: ActivatedRoute, private sanitizer: DomSanitizer,
    private ordersService: OrdersService, private qaService: QaService) { }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      this.id = +params['id']; // (+) converts string 'id' to a number
      this.orderCode = params['orderCode'];
      this.summaryID = +params['summaryId'];
      this.orderType = params['orderType']
      // In a real app: dispatch action to load the details here.

      this.LoadData();
    });
  }

  LoadData() {
    this.SampleResponses = [];
    this.qaService.GetSample(this.orderCode, this.orderType, this.summaryID, this.id).subscribe(
      response => {
        if (response.length != 0) {
          if (response.length > 1) {
            alert('Duplicate Entries Found.');
          } else {
            let temp = response[0];
            this.SetPassword(temp);
            for (var question in temp) {
              if (question == "Zip")
                temp[question] = temp[question].length > 5 ? temp[question].substring(0, 5) : temp[question];

              this.SampleResponses.push({
                question: question,
                answer: temp[question],
                result: null
              });
            }
          }

        } else
          alert('Bad Request.')
      },
      error => { console.log(error); })
    console.log(this.orderCode);
  }
  SetPassword(response) {
    if (response.s_password) {
      this.password = response.s_password;
      this.toggleImage(this.image);

      delete response.s_password;
    }

  }
  toggleImage(event) {
    this.image = event;
    this.ordersService.GetImageUrl(this.orderCode, this.password, this.image)
      .subscribe(response => {
        console.log(response);
        if (response.length > 0)
          this.imgsrc = this.sanitizer.bypassSecurityTrustUrl(response);
      }, error => {

      });
  }

  Submit() {

    let allSet = _.pluck(this.SampleResponses, 'result').indexOf(null) == -1;
    if (allSet) {
      let insertString = "";
      this.SampleResponses.forEach(row => {
        if (row.result == 'true')
          insertString += "[" + row.question + "]=1,";
        else
          insertString += "[" + row.question + "]=0,";
      });
      insertString = JSON.stringify(insertString.substring(0, insertString.length - 1));
      this.qaService.UpdateScoreCardingDetails(this.orderCode, this.summaryID, this.id, insertString).subscribe(
        response => { window.close(); console.log(response); },
        error => { console.log(error); })
    }
    else
      alert('Please Review All Questions before Submit.')
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
