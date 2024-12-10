import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  baseURL='https://localhost:7117/api'
  constructor(private http:HttpClient) { }
  getProfile(){
    let name=localStorage.getItem('userName');
    return this.http.get(this.baseURL+"Employee/getProfile?name="+name);
  }
  updateEmployee(data:any){
    return this.http.put(this.baseURL+"Employee/update",data);
  }
  containsOnlyDigits(s: string) {
    return /^\d+$/.test(s);
  }
  getFilterQueries(pgNo?: number, pgSize?: number, searchQuery?: any) {
    var serachUrl = this.baseURL+`/Complaint/get?PageNumber=${pgNo}&PageSize=${pgSize}`;
    if (searchQuery !== undefined) {
      if (this.containsOnlyDigits(searchQuery)) {
        searchQuery = parseInt(searchQuery);
      }

      serachUrl += (typeof searchQuery === 'number') ? `&Id=${searchQuery}` : `&Name=${searchQuery}`;
    }
    return this.http.get(serachUrl, { observe: 'response' });

  }
  updateQuery(data:any){
    return this.http.put(this.baseURL+"Complaint/update",data);

  }
  getClaims(pgNo?: number, pgSize?: number, searchQuery?: any){
    var serachUrl = this.baseURL+`/Claimm/get?PageNumber=${pgNo}&PageSize=${pgSize}`;
    if (searchQuery !== undefined) {
      serachUrl += `&Id=${searchQuery}` ;
    }
    return this.http.get(serachUrl, { observe: 'response' });
   
  }
  updateClaims(data:any)
  {
   return this.http.put(this.baseURL+"Claim/update",data);

  }
}
