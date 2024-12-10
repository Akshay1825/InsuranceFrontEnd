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
  updateAgent(data: any) {
    return this.http.put(this.baseURL + '/Agent/', data);
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
  getSchemesByPlan(planId: number) {
    return this.http.get(this.baseURL+"/InsurancePlan/getId?Id=" + planId,{ observe: 'response'})
  }
  getAgentByUserName(): Observable<any> {
    let usrName = localStorage.getItem('userName')!
    return this.http.get(this.baseURL+'/Agent/GetByUserName?userName=' + usrName,{ observe: 'response'})
  }

  getAgentCommission(agentID: number, pgNo?: number, pgSize?: number, searchQuery?: number) {
    let serachUrl = this.baseURL+`Commissions/get?AgentId=${agentID}&PageNumber=${pgNo}&PageSize=${pgSize}`
    if (searchQuery != undefined) {
      serachUrl += `&Id=${searchQuery}`
    }
    return this.http.get(serachUrl, { observe: 'response' });

  }
  getCommission( pgNo?: number, pgSize?: number, searchQuery?: number) {
    let status=1
    let serachUrl = this.baseURL+`Commissions/get?Status=${status}&PageNumber=${pgNo}&PageSize=${pgSize}`
    if (searchQuery != undefined) {
      serachUrl += `&Id=${searchQuery}`
    }
    return this.http.get(serachUrl,{ observe: 'response' });

  }
  updateAgentCommission(data: any) {
    return this.http.put(this.baseURL+'Commissions/update', data);
  }

  getAgentPolicies( AgentId:number,status:number,pgNo?:number,pgSize?:number,searchQuery?:number){
   let searchURL=this.baseURL+`Policy/get?Status=${status}&AgentId=${AgentId}&PageNumber=${pgNo}&PageSize=${pgSize}`
  if(searchQuery!=undefined){
    searchURL+=`&Id=${searchQuery}`

  }
  return this.http.get(searchURL,{observe:'response'})
  }
}
