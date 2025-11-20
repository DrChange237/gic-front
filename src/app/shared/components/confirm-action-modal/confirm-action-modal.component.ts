import {Component, Input, OnInit} from '@angular/core';
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-confirm-action-modal',
  templateUrl: './confirm-action-modal.component.html',
  styleUrls: ['./confirm-action-modal.component.scss'],
  standalone: false,
})
export class ConfirmActionModalComponent implements OnInit {
  @Input() title: string = '';
  @Input() message: string = '';
  @Input() confirmButtonText: string = 'btn.confirm';
  @Input() cancelButtonText: string = 'btn.cancel';
  @Input() requirePin: boolean = true;
  @Input() withoutAuth: boolean = false;

  pinOrPassword: string = '';
  errorMessage: string = '';

  constructor(public activeModal: NgbActiveModal, private translate: TranslateService) {}

  ngOnInit() {
    this.title = this.title || 'modal.confirm_action';
    this.message = this.message || (this.requirePin ? 'modal.confirm_action_message_pin' : 'modal.confirm_action_message_password');
  }

  confirm() {
    if (this.withoutAuth) return this.activeModal.close(true);

    if (!this.pinOrPassword || this.pinOrPassword.trim().length < 4) {
      this.errorMessage = this.translate.instant('modal.invalid_code');
      return;
    }
    this.activeModal.close(this.pinOrPassword);
  }

  cancel() {
    this.activeModal.dismiss('cancel');
  }

}
