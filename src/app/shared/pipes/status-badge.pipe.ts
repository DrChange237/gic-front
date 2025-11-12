import { Pipe, PipeTransform } from '@angular/core';
import { PaymentStatus, TransactionStatus } from '../enums';

@Pipe({
  name: 'statusBadge',
  standalone: false
})
export class StatusBadgePipe implements PipeTransform {

  transform(value: PaymentStatus | TransactionStatus): string {
    if (!value) return 'secondary';

    switch (value) {

      // ---- PaymentStatus ----
      case PaymentStatus.INIT:
      case PaymentStatus.QUOTE:
        return 'secondary';

      case PaymentStatus.PENDING:
      case PaymentStatus.WAITING:
      case PaymentStatus.SYNC_WAITING:
        return 'warning';

      case PaymentStatus.SUCCESS:
        return 'success text-white';

      case PaymentStatus.FAILED:
      case PaymentStatus.REJECTED:
        return 'danger';


      // ---- TransactionStatus ----
      case TransactionStatus.PENDING:
        return 'warning';

      case TransactionStatus.DEBITED:
        return 'info';

      case TransactionStatus.SUCCESS:
        return 'success text-white';

      case TransactionStatus.FAILED:
        return 'danger';

      default:
        return 'primary';
    }
  }

}
