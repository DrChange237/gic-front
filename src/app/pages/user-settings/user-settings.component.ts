import { Component, OnInit } from '@angular/core';
import {SharedComponentsModule} from "../../shared/components/shared-components.module";

@Component({
  selector: 'app-user-settings',
  templateUrl: './user-settings.component.html',
  styleUrls: ['./user-settings.component.scss'],
  imports: [SharedComponentsModule]
})
export class UserSettingsComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
