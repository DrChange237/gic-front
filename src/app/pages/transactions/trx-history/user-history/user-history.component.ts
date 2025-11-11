import { Component, OnInit } from '@angular/core';
import {SharedComponentsModule} from "../../../../shared/components/shared-components.module";

@Component({
  selector: 'app-user-history',
  templateUrl: './user-history.component.html',
  styleUrls: ['./user-history.component.scss'],
  imports: [
    SharedComponentsModule
  ],
  standalone: true
})
export class UserHistoryComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
