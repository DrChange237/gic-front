import { Component, OnInit } from '@angular/core';
import { SharedComponentsModule } from "src/app/shared/components/shared-components.module";

@Component({
  selector: 'app-mgn-role',
  templateUrl: './mgn-role.component.html',
  styleUrls: ['./mgn-role.component.scss'],
  imports: [SharedComponentsModule]
})
export class MgnRoleComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
