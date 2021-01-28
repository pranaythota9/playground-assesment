import {Component, OnInit, ViewChild} from '@angular/core';
import { ApiService } from '../app/services/api-service.service';
import {FormBuilder, FormGroup} from '@angular/forms';
import * as moment from 'moment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit  {
  title = 'fhir-app-test';
  timeDiff: number;
  dataSource: any;
  currentDateTime: Date = new Date();
  displayedColumns: string[] = ['id', 'name', 'birthdate'];
  searchForm: FormGroup;
  submitted = false;

  constructor(
    private apiService: ApiService,
    private fb: FormBuilder,
  ) { }

  ngOnInit() {
    this.searchForm = this.fb.group({
      name: [''],
      dateIntMin: [moment(new Date('1960-01-01')).toDate()],
      dateIntMax: [moment(new Date('1965-01-01')).toDate()],
    });
    setInterval(() => {
      this.currentDateTime = new Date();
    }, 1000);
    this.apiRequest({startDate: 'ge1960-01-01', endDate: 'le1965-01-01', name: ''});
  }

  search(e: FormGroup) {
    this.submitted = true;
    const name = e.controls['name'].value;
    const startDate = moment(new Date(e.controls['dateIntMin'].value)).format('[ge]YYYY-MM-DD');
    const endDate = moment(new Date(e.controls['dateIntMax'].value)).format('[le]YYYY-MM-DD');
    const params = {name, startDate, endDate};
    this.apiRequest(params);
  }

  apiRequest(params: any) {
    const startFrom = new Date().getTime();
    this.apiService.getPatients(params).subscribe(
        (data: any) => {
          this.timeDiff = (new Date().getTime() - startFrom) / 1000;
          this.dataSource = data.entry;
          this.submitted = false;
          this.searchForm.markAsPristine();
        }
    );
  }
}


