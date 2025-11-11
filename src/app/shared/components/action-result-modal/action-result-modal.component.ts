import {Component, Input, OnInit} from '@angular/core';
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-confirm-action-modal',
  templateUrl: './action-result-modal.component.html',
  styleUrls: ['./action-result-modal.component.scss'],
  standalone: false,
})
export class ActionResultModalComponent implements OnInit {
  @Input() title: string = 'modal.action_performed';
  @Input() message: string = 'modal.action_performed_message';
  @Input() isSuccess: boolean = true;
  @Input() closeButtonText: string = 'btn.close';
  @Input() actionButtonText: string;

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit() {
    this.title = this.title || 'modal.action_performed';
    this.message = this.message || 'modal.action_performed_message';
  }

  close(action?: string) {
    this.activeModal.close(action);
  }

}
