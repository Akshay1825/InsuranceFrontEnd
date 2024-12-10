import { NomineeDTO } from "./NomineeDTO"


export class Policy {
    schemeName : string = ''
    PolicyNo: number = 0
    issueDate: Date = new Date()
    maturityDate: Date = new Date()
    premiumType: number = 0
    premiumAmount: number = 0
    totalPremiumNumber: number = 0
    sumAssured: number = 0
    status: number = 1
    insuranceSchemeId: any
    customerId: any
    agentId?: any
    investmentAmount:number=0
    nominee:string=''
    nomineeRelation:string=''
}