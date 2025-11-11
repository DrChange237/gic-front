export enum PaymentStatus {
    INIT = 'INIT',
    QUOTE = 'QUOTE',
    PENDING = 'PENDING',
    WAITING = 'WAITING',
    SYNC_WAITING = 'SYNC_WAITING',
    SUCCESS = 'SUCCESS',
    FAILED = 'FAILED',
    REJECTED = 'REJECTED',
}

export enum TransactionStatus {
    PENDING = 'PENDING',
    DEBITED = 'DEBITED',
    SUCCESS = 'SUCCESS',
    FAILED = 'FAILED'
}
