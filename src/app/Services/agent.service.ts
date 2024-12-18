import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AgentService {
  baseURL = 'https://localhost:7117/api'
  constructor(private http: HttpClient) { }
  private agentData: any
  setAgent(data: any) {
    this.agentData = data;
  }
  getAgent(): any {
    return this.agentData;

  }
  getProfile(): Observable<any> {
    let name = localStorage.getItem('userName')
    return this.http.get(this.baseURL + "/Agent/GetByUserName?userName=" + name,{observe:'response'});

  }
  updateAgent(data: any):Observable<any> {
    return this.http.put(this.baseURL + '/Agent', data,{observe:'response'});
  }
  containsOnlyDigits(s: string) {
    return /^\d+$/.test(s);
  }
  getAgentCustomers(name: string, pgNo?: number, pgSize?: number, searchQuery?: any): Observable<any> {
    var serachUrl = this.baseURL+"/Agent/customers?PageNumber=" + pgNo + "&PageSize=" + pgSize + "&userName=" + name;
    if (searchQuery !== undefined) {
      if (this.containsOnlyDigits(searchQuery)) {
        searchQuery = parseInt(searchQuery);
      }

      serachUrl += (typeof searchQuery === 'number') ? `&Id=${searchQuery}` : `&Name=${searchQuery}`;
    }
    return this.http.get(serachUrl, { observe: 'response' });

  }
  getSchemesByPlan(planId: any) {
    return this.http.get(this.baseURL+"/InsurancePlan/getId?Id=" + planId,{ observe: 'response'})
  }
  getAgentByUserName(): Observable<any> {
    let usrName = localStorage.getItem('userName')!
    return this.http.get(this.baseURL+'/Agent/GetByUserName?userName=' + usrName,{ observe: 'response'})
  }

  getCustomerByAgentId(id: any): Observable<any>{
    return this.http.get(this.baseURL+'/Customer/GetByAgentId?id=' + id,{ observe: 'response'})
  }

  getAgentCommission(agentID: any, pgNo?: number, pgSize?: number, searchQuery?: number): Observable<any> {  
    // Construct the base URL
    let searchUrl = `${this.baseURL}/Commission/get?AgentId=${agentID}&PageNumber=${pgNo}&PageSize=${pgSize}`;
    
    // Append the searchQuery if it exists
    if (searchQuery) {
      searchUrl += `&searchQuery=${encodeURIComponent(searchQuery)}`;
    }
  
    return this.http.get(searchUrl, { observe: 'response' });
  }
  getCommission(pgNo?: number, pgSize?: number, fromDate?: string, toDate?: string): Observable<any> {
    let searchUrl = this.baseURL + `/Commission/getAll?PageNumber=${pgNo}&PageSize=${pgSize}`;
    
    // Add date filters if provided
    if (fromDate) {
      searchUrl += `&FromDate=${fromDate}`;
    }
    if (toDate) {
      searchUrl += `&ToDate=${toDate}`;
    }
  
    return this.http.get(searchUrl, { observe: 'response' });
  }
  updateAgentCommission(data: any) {
    return this.http.put(this.baseURL+'Commissions/update', data);
  }

  getAgentPolicies( AgentId:any,pgNo?:number,pgSize?:number,searchQuery?:any){
   let searchURL=this.baseURL+`/Policy/get2?agentId=${AgentId}&PageNumber=${pgNo}&PageSize=${pgSize}`
  if(searchQuery!=undefined){
    searchURL+=`&Name=${searchQuery}`

  }
  return this.http.get(searchURL,{observe:'response'})
  }
}
