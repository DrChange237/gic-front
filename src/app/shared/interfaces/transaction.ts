import {PaymentStatus, TransactionStatus} from "../enums";
import {Cashier} from "./user.interface";

export interface Transaction {
    id: string,
    date: string | Date,
    cashier: Cashier,
    status: TransactionStatus,
    transactionId: string,
    amount: number,
    commission: number,
    commissionPaid: boolean,
    clientFees: number,
    reference: string,
    receiptId: string,
    serviceName: string,
    serviceLogo: string,
    description: string,
    info: string,
    choice: string
}

export interface InitPaymentData {
    service: string;
    reference?: string;
    amount?: number;
    form: { id: string, name?: string, value?: any }[]
}

export interface InitPaymentResponse {
    id: string;
    service: ServiceModel;
    username: string,
    status: PaymentStatus,
    options: { label: string, amount: number, id: string, description: string }[],
    information: { key: string, name: string, value: string }[],
    reference: string,
    event: string,
    clearId: string,
    choice: string,
    countryCode: string,
    agencyCode: string,
    agencyName: string,
    description: string,
    info: string,
    post: { additionalProp1: string, additionalProp2: string, additionalProp3: string },
    trxid: string,
    amount: number,
    clientFees: number,
    form: FormItem,
    flow: string,
    signatory: { name: string, function: string, signature: string },
    sourceAgencyCode: string,
    sourceAccountNumber: string,
    sourceAccountKey: string,
    depositor: string,
    narration: string,
    totalAmount: number
}

export interface FormItemOptions {
    label: string;
    amount: number;
    id: string;
    description: string;
}

export interface FormItem {
    id: string;
    label: string;
    name: string;
    type: string;
    position: number;
    regex: string;
    optionString: string;
    removeBill: boolean;
    required: boolean;
    size: boolean;
    options: FormItemOptions[];
}

export interface ServiceForm {
    name: string;
    formItems: FormItem[];
}

export interface ServiceType {
    id: string,
    code: string,
    name: string,
    logo: string,
    visible: boolean,
    file: string
}

export interface ServiceModel {
    id: string;
    type: ServiceType;
    logo: string;
    name: string;
    reverse: boolean;
    code: string;
    labelRef: string;
    typeRef: string;
    labelOption: string;
    withAmount: boolean;
    withRef: boolean;
    withOptions: boolean;
    withForm: boolean;
    regex: string;
    initForm: ServiceForm;
    description: string;
    typeAccount: string;
    instructions: string;
    maintenance: boolean;
}

export interface InitTransfertFund {
    agencyOriginId: string,
    agencyDestinationId: string,
    amount: number,
    description: string,
    password: string
}
