export class Complaint {
    complaintName: string = ''
    complaintMessage: string = ''
    dateOfComplaint: Date = new Date()
    status: boolean = true
    customerId!: number
}