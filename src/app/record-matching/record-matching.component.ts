import { Component, OnInit } from '@angular/core';
import { RecordMatchingService } from "../_services/record-matching.service";

@Component({
  selector: 'app-record-matching',
  templateUrl: './record-matching.component.html',
  styleUrls: ['./record-matching.component.css']
})
export class RecordMatchingComponent implements OnInit {
  formData: FormData;
  matchType = '1';
  optValue = '2';
  gridData = {
    data: [],
    columnconfig: [
      { prop: 'ORDER ID', as: 'ORDER ID' },
      { prop: 'PASSWORD', as: 'PASSWORD' },
      { prop: 'RECIEPTED DATE', as: 'RECIEPTED DATE' },
      { prop: 'FINALIZE DATE', as: 'FINALIZE DATE' },
      { prop: 'FULL TEXT FROM FILE', as: 'FULL TEXT FROM FILE' }
    ],
    events: {
      // rowClicked: this.gridRowClicked.bind(this)
    },
    settings: {
      search: false,
      count: 0,
      currentPage: 1,
      csvDownload: true
    }
  };
  gridDataDB = {
    data: [],
    columnconfig: [
      { prop: 'ORDER ID', as: 'ORDER ID' },
      { prop: 'PASSWORD', as: 'PASSWORD' },
      { prop: 'RECIEPTED DATE', as: 'RECIEPTED DATE' },
      { prop: 'FINALIZE DATE', as: 'FINALIZE DATE' }
    ],
    events: {
      // rowClicked: this.gridRowClicked.bind(this)
    },
    settings: {
      search: false,
      count: 0,
      currentPage: 1,
      csvDownload: true
    }
  };
  constructor(private rmService: RecordMatchingService) { }

  ngOnInit() {
    this.optValue = '2';
  }

  SetFile(event) {
    let fileList: FileList = event.target.files;
    this.formData = new FormData();

    if (fileList.length > 0) {
      let file: File = fileList[0];
      this.formData.append('sampleFile', file, file.name);
    }
  }
 
  Upload() {
    if (this.formData != undefined) {
      this.rmService.UploadFile(this.formData, this.matchType).subscribe(response => {
        this.gridData.data = response.FileWithDB;
        this.gridDataDB.data = response.DBWithFile;
        this.formData = undefined;
        console.log(response);
      }, error => {
        this.formData = undefined;
      });
    } else {
      alert('Please Select a File to Proceed');
    }
  }
}
