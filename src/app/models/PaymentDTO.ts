export class PaymentDTO {
    paymentType: number = 0
    paymentDate: Date = new Date()
    amount: number = 0
    tax: number = 0
    totalPayment: number = 0
    status: Boolean = true
    cardHolderName: string = ''
    cvvNo: string = ''
    cardNumber: string = ''
    expiryDate: Date = new Date()
    policyNumber!: number
}