import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { catchError, Observable, of } from 'rxjs';
import { Scheme } from '../models/Scheme';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  baseUrl = "https://localhost:7117/api"

  constructor(private http: HttpClient) {
  }
  planScheme: any
  UpdatePayment(data: any): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json'); 
    return this.http.post("https://localhost:7117/api/Payment", data, { headers });
  }

  UpdatePolicy(data: any): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json'); 
    return this.http.put("https://localhost:7117/api/Policy", data, { headers }); 
  }
  
  getEmployees(pgNo?: number, pgSize?: number) 
  {
    return this.http.get(this.baseUrl+"/Employee/get?PageNumber=" + pgNo + "&PageSize=" + pgSize, { observe: 'response' });
  }
  containsOnlyDigits(s: string) {
    return /^\d+$/.test(s);
  }
  getFilterEmployees(pgNo?: number, pgSize?: number, searchQuery?: any) {
    var serachUrl = this.baseUrl+"/Employee/get?PageNumber=" + pgNo + "&PageSize=" + pgSize;
    if (searchQuery !== undefined) {
      // if (this.containsOnlyDigits(searchQuery)) {
      //   searchQuery = parseInt(searchQuery);
      // }

      serachUrl += (typeof searchQuery === 'number') ? `&Id=${searchQuery}` : `&Name=${searchQuery}`;
    }
    return this.http.get(serachUrl, { observe: 'response' });

  }
  getFilterCustomers(pgNo?: number, pgSize?: number, searchQuery?: any) {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    var serachUrl = this.baseUrl+"/Customer/get?PageNumber=" + pgNo + "&PageSize=" + pgSize;
    if (searchQuery !== undefined) {
      // if (this.containsOnlyDigits(searchQuery)) {
      //   searchQuery = parseInt(searchQuery);
      // }

      serachUrl += (typeof searchQuery === 'number') ? `&Id=${searchQuery}` : `&Name=${searchQuery}`;
    }
    return this.http.get(serachUrl, { observe: 'response' });
  }
  addEmp(data: any) {

    return this.http.post(this.baseUrl+"/Employee/", data);

  }

  updateEmplyee(data: any) {
    return this.http.put(this.baseUrl + "/Employee/", data)
  }
  deleteEmployee(id: any) {
    return this.http.delete(this.baseUrl + "/Employee/" + id);
  }

  //Insurance plan
  addPlan(data: any) {
    return this.http.post(this.baseUrl + "/InsurancePlan", data);
  }

  getPlans(pgNo?: number, pgSize?: number) {
    return this.http.get(this.baseUrl+"/InsurancePlan/get?PageNumber=" + pgNo + "&PageSize=" + pgSize, { observe: 'response' });
  }
  getFilterPlans(pgNo?: number, pgSize?: number, searchQuery?: any) {
    var serachUrl = this.baseUrl+"/InsurancePlan/get?PageNumber=" + pgNo + "&PageSize=" + pgSize;
    if (searchQuery !== undefined) {
      if (this.containsOnlyDigits(searchQuery)) {
        searchQuery = parseInt(searchQuery);
      }

      serachUrl += (typeof searchQuery === 'number') ? `&PlanId=${searchQuery}` : `&Name=${searchQuery}`;
    }
    return this.http.get(serachUrl, { observe: 'response' });

  }

  getPlans2(pgNo?: number, pgSize?: number) {
    return this.http.get(this.baseUrl+"/InsurancePlan/get2?PageNumber=" + pgNo + "&PageSize=" + pgSize, { observe: 'response' });
  }
  getFilterPlans2(pgNo?: number, pgSize?: number, searchQuery?: any) {
    var serachUrl = this.baseUrl+"/InsurancePlan/get2?PageNumber=" + pgNo + "&PageSize=" + pgSize;
    if (searchQuery !== undefined) {
      if (this.containsOnlyDigits(searchQuery)) {
        searchQuery = parseInt(searchQuery);
      }

      serachUrl += (typeof searchQuery === 'number') ? `&PlanId=${searchQuery}` : `&Name=${searchQuery}`;
    }
    return this.http.get(serachUrl, { observe: 'response' });

  }
  UpdataPlan(data: any) {
    return this.http.put(this.baseUrl + "/InsurancePlan/", data);
  }
  deletePlan(data: any):Observable<any> {
    return this.http.put(this.baseUrl + "/InsurancePlan" ,data, { observe:'response' });
  }
  getSchemeByPlanID(id:any,pgNo?: number, pgSize?: number,searchQuery?:any ): Observable<any> {
    var serachUrl = this.baseUrl+"/InsuranceScheme/getId?PageNumber=" + pgNo+"&PageSize="+pgSize+"&id=" + id;
    if (searchQuery !== undefined) {
      if (this.containsOnlyDigits(searchQuery)) {
        searchQuery = parseInt(searchQuery);
      }
      serachUrl += (typeof searchQuery === 'number') ? `&Id=${searchQuery}` : `&Name=${searchQuery}`;
    }
    return this.http.get(serachUrl,{observe:'response'});
  }

  getSchemesByPlanID(id:any):Observable<any>{
     return this.http.get("https://localhost:7117/api/InsuranceScheme/getById?id="+id,{observe:'response'});
  }
  getDetail(schemeId:any) {
    return this.http.get(this.baseUrl+"/SchemeDetails/getId?Id=" +schemeId);
  }
  setPlan(plan: any) {
    this.planScheme = plan
  }

  addAgent(data: any) {
    return this.http.post(this.baseUrl + "/Agent/", data);
  }
  getFilterAgents(pgNo?: number, pgSize?: number, searchQuery?: any) {
    var serachUrl =this.baseUrl+ "/Agent/get?PageNumber=" + pgNo + "&PageSize=" + pgSize;
    if (searchQuery !== undefined) {
      if (this.containsOnlyDigits(searchQuery)) {
        searchQuery = parseInt(searchQuery);
      }
      serachUrl += (typeof searchQuery === 'number') ? `&Id=${searchQuery}` : `&Name=${searchQuery}`;
    }
    return this.http.get(serachUrl, { observe: 'response' });

  }
  updateAgent(data: any) {
    return this.http.put(this.baseUrl + "/Agent/", data);
  }
  deleteAgent(id: any) {
    return this.http.delete(this.baseUrl + "/Agent/" + id);
  }

  getProfile(){
    let name=localStorage.getItem('userName');
    return this.http.get(this.baseUrl+"/Admin/getProfile?userName="+name);
  }
  updateTax(data:any):Observable<any>{
   
    return this.http.put(this.baseUrl+"/Tax",data,{observe:'response'});
  }

  checkSchemeNameDuplicate(schemeName: string): Observable<any> {
    // Assuming your API accepts a GET request to check for duplicate scheme names
    return this.http
      .get<{ exists: boolean }>(`${this.baseUrl}/InsuranceScheme/check-scheme-name?name=${schemeName}`,{observe:'response'})
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.error('Error checking scheme name:', error);
          return of(false); // Return false in case of an error (e.g., server is down)
        })
      );
  }
  addSchemeWithDetail(data:any):Observable<any> {
    return this.http.post(this.baseUrl+"/InsuranceScheme",data,{observe:'response'});
  }
  getPayments(pgNo: number, pgSize: number, fromDate?: string, toDate?: string, searchQuery?: any): Observable<any> {
    let url = `${this.baseUrl}/Payment/getAll?PageNumber=${pgNo}&PageSize=${pgSize}`;
    
    if (searchQuery) {
      url += `&PolicyNumber=${searchQuery}`;
    }
    if (fromDate && toDate) {
      url += `&FromDate=${fromDate}&ToDate=${toDate}`;
    }
  
    return this.http.get(url, { observe: 'response' });
  }
  getFilterPolicies(customerId:any,pgNo?:number,pgSize?:number,searchQuery?:any): Observable<any>{
    var serachUrl = this.baseUrl+"/Policy/Policy?PageNumber=" + pgNo + "&PageSize=" + pgSize+"&id="+customerId;
    if (searchQuery !== undefined) {
      if (this.containsOnlyDigits(searchQuery)) {
        searchQuery = parseInt(searchQuery);
      }
      serachUrl += (typeof searchQuery === 'number') ? `&Id=${searchQuery}` : `&Name=${searchQuery}`;
    }
    return this.http.get(serachUrl, { observe: 'response' });
  }
  updateScheme(data:any):Observable<any>{
    console.log(data);
   return this.http.put("https://localhost:7117/api/InsuranceScheme/Update",data ,{observe:'response'})
  }

  updateScheme2(data:any):Observable<any>{
    console.log(data);
   return this.http.put("https://localhost:7117/api/InsuranceScheme",data ,{observe:'response'})
  }

  getDocumentTypes(): Observable<any> {
    return this.http.get<any>("https://localhost:7117/api/Document/document-types",{observe:'response'});
  }

  deleteScheme(data:any):Observable<any>{
    return this.http.delete("https://localhost:7117/api/InsuranceScheme/"+data.schemeId,{observe:'response'});
  }
}
