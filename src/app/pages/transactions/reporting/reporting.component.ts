import { Component, OnInit } from '@angular/core';
import { SharedComponentsModule } from "src/app/shared/components/shared-components.module";

@Component({
  selector: 'app-reporting',
  templateUrl: './reporting.component.html',
  styleUrls: ['./reporting.component.scss'],
  imports: [SharedComponentsModule],
})
export class ReportingComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
