import { Component, OnInit } from '@angular/core';
import {SharedComponentsModule} from "../../../../shared/components/shared-components.module";

@Component({
  selector: 'app-agency-history',
  templateUrl: './agency-history.component.html',
  styleUrls: ['./agency-history.component.scss'],
  imports: [
    SharedComponentsModule
  ],
  standalone: true
})
export class AgencyHistoryComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
