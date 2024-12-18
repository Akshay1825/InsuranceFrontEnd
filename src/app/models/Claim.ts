export class Claim {
    claimId:any
    claimAmount!: any
    claimDate: Date = new Date()
    bankIFSCCode:string=''
    bankAccountNo:string=''
    status: any
    policyNumber!: number
    policyId:any
}