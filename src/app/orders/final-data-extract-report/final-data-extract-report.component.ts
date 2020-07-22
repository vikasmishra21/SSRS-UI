import { Component, OnInit, Input } from '@angular/core';
import { FinalDataExtractReport } from '../../_models/models';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-final-data-extract-report',
  templateUrl: './final-data-extract-report.component.html',
  styleUrls: ['./final-data-extract-report.component.css']
})
export class FinalDataExtractReportComponent implements OnInit {
    @Input()
    response: FinalDataExtractReport;
    constructor(public activeModal: NgbActiveModal) { }

  ngOnInit() {
     // console.log(this.response); 
  }

}
