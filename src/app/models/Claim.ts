export class Claim {
    claimId:number=0
    claimAmount!: number
    claimDate: Date = new Date()
    bankIFSCCode:string=''
    bankAccountNo:string=''
    status: boolean = false
    policyNumber!: number
}