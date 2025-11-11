import { Component, OnInit } from '@angular/core';
import {SharedComponentsModule} from "../../../../shared/components/shared-components.module";

@Component({
  selector: 'app-global-history',
  templateUrl: './global-history.component.html',
  styleUrls: ['./global-history.component.scss'],
  imports: [
    SharedComponentsModule
  ],
  standalone: true
})
export class GlobalHistoryComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
