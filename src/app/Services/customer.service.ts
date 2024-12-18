import { HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, switchMap } from 'rxjs';
import { Policy } from '../models/Policy';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class CustomerService {

  constructor(private http: HttpClient) { }
  cloudinaryUrl = 'https://api.cloudinary.com/v1_1/dxq7e2s2v/image/upload';

  // uploadImage(data:any):Observable<any>{
  //   return this.http.post(this.cloudinaryUrl, data,{ observe: 'response' });
  // }
 
  baseUrl="https://localhost:7117/api"
  planToScheme: any
  policy!: Policy
  public data: any;

  uploadImage(data:any):Observable<any>{
    return this.http.post(this.baseUrl+"/Document/upload", data,{ observe: 'response' });
  }
  
  getData(): any {
    console.log(this.data);
    return this.data;
  }
  getAllPlan():Observable<any> {
    return this.http.get(this.baseUrl + "/InsurancePlan/get",{observe:'response'});
  }
  getPlanByID(id: any): Observable<any> {
    return this.http.get("https://localhost:7117/api/InsurancePlan/" + id,{ observe: 'response' });
  }
  setPolicy(policy: Policy) {
    this.policy = policy
  }
  getPolicy(): Policy {
    return this.policy
  }

  getDocumentType():Observable<any>{
    return this.http.get(this.baseUrl+"/Document/DocTypes");
  }

  addDocument(data:any): Observable<any>{
    return this.http.post(this.baseUrl+"/Document/", data);
  }

  getDetail(schemeId: any):Observable<any> {
    return this.http.get(this.baseUrl+"/InsuranceScheme/" + schemeId,{observe:'response'});
  }

  getCustomerProfile(): Observable<any> {
    const userName = localStorage.getItem('userName');
    const token = localStorage.getItem('token');
  
    if (!userName) {
      console.error('No userName found in localStorage');
      return throwError(() => new Error('User name is not available in localStorage'));
    }
  
    if (!token) {
      console.error('No token found in localStorage');
      return throwError(() => new Error('Token is not available in localStorage'));
    }
    
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const payload = { userName }; 
    
    return this.http.get('https://localhost:7117/api/Customer/GetByUserName?userName='+ payload.userName);
  }

  getCustomerProfile2(data:any): Observable<any> {
    return this.http.get('https://localhost:7117/api/Customer/GetByUserName?userName='+ data,{observe:'response'});
  }
  purchasePolicy(policy: any): Observable<any>{
    return this.http.post(this.baseUrl+"/Policy", policy, { observe: 'response'});
  }
  getPolicies(customerId:any,status:number, pgNo?: number, pgSize?: number, searchQuery?: any) {
    var serachUrl = this.baseUrl+"/Policy/Policy?"+"&PageNumber=" + pgNo + "&PageSize=" + pgSize + "&id="+customerId;
    
    if (searchQuery !== undefined) {
      serachUrl += `&Name=${searchQuery}`;
    }
    return this.http.get(serachUrl, { observe: 'response' });
    
  }
  getPolicyDetail(policyId:any): Observable<any>
  {
    return this.http.get("https://localhost:7117/api/Policy/"+ policyId,{ observe: 'response' });
  }
  updateCustomer(data: any):Observable<any> {
    return this.http.put(this.baseUrl+"/Customer", data,{ observe: 'response' });

  }
  getTaxPercent(): Observable<any>{
    return this.http.get(this.baseUrl+"/Tax",{ observe: 'response' });
  }
  addComplaint(data: any) {
    return this.http.post(this.baseUrl+"/Complaint/", data);
  }
  getCustomerById(id: any): Observable<any>{
    return this.http.get(this.baseUrl + "/Customer/" + id,{ observe: 'response' });
  }
  getUserById(id:number):Observable<Object>{
    return this.http.get(this.baseUrl+"User/getId?id="+id)
  }
  containsOnlyDigits(s: string) {
    return /^\d+$/.test(s);
  }
  getComplaints(userName: string, pgNo?: number, pgSize?: number, searchQuery?: any) {
    var serachUrl =this.baseUrl+ "/Customer/complaints?PageNumber=" + pgNo + "&PageSize=" + pgSize + "&userName=" + userName;
    if (searchQuery !== undefined) {
      if (this.containsOnlyDigits(searchQuery)) {
        searchQuery = parseInt(searchQuery);
      }

      serachUrl += (typeof searchQuery === 'number') ? `&Id=${searchQuery}` : `&Name=${searchQuery}`;
    }
    return this.http.get(serachUrl, { observe: 'response' });
  }

  uploadDocument(data: any, id: any,type:any):Observable<any> {
    console.log(data);
    console.log(type['docType']);

      const headers = new HttpHeaders();
      headers.set('Content-Type', 'multipart/form-data');
      return this.http.post(this.baseUrl+"/Document/Cloudinary?id="+ id + "&type="+ type, data, { headers });
    }

  downloadFile(fileId: any): Observable<any> {
    const url = this.baseUrl + `/Document/Cloudinary?documentId=${fileId}`;
    return this.http.get<string>(url); 
}
  getCustomerDocuments(customerId: any, pgNo?: number, pgSize?: number) {
    return this.http.get(this.baseUrl+"/Customer/documents?PageNumber=" + pgNo + "&PageSize=" + pgSize + "&customerId=" + customerId, { observe: 'response' });
  }
  updateCustomerDocuments(data:any):Observable<any> {
    console.log(data);
    console.log(data.id);
    
    const documentData = 
    { id: data.id,
      name: data.name,
      status: data.status,
      note: data.note,
      customerId:data.customerId,
      filePath: data.filePath
    };
    console.log(documentData);
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.put(this.baseUrl+"/Document" + {id: data.id,
      name: data.name,
      status: data.status,
      note: data.note,
      customerId:data.customerId,
      filePath: data.filePath},{observe:'response'});
  }
  getSchemeById(schemeId:any): Observable<any> 
  {
    return this.http.get(this.baseUrl+"/InsuranceScheme/"+schemeId,{observe:'response'})
  }
  makePayment(data:any){
  return this.http.post(this.baseUrl+"Payment/add",data);
  }
  getPaymentById(index:number,policyId:any):Observable<any>
  {
    return this.http.get(this.baseUrl+"/Payment/GetID?index="+index+"&policyId="+policyId,{observe:'response'});
  }

  updatePolicy(data:any):Observable<any> {
    return this.http.put(this.baseUrl+"/Policy/UpdatePolicy",data,{ observe:'response'});
  }

   registerCliam(claim:any):Observable<any>{
    return this.http.post(this.baseUrl+"/Claimm",claim,{observe:'response'})
   }

   getPaymentFullDetail(policyId:number)
   {
    return this.http.get(this.baseUrl+"Policy/GetId?Id="+policyId).pipe(
      switchMap((policy: any) => {
        // Use the result of the first call to make the second call
        return this.http.get(this.baseUrl + "Customer/getId?Id="+policy.customerID);
      })
    );
   }
}

