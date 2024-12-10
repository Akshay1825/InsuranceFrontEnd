import { Component } from '@angular/core';
import { AgentService } from '../Services/agent.service';

@Component({
  selector: 'app-agent-dashboard',
  templateUrl: './agent-dashboard.component.html',
  styleUrls: ['./agent-dashboard.component.css']
})
export class AgentDashboardComponent {
  agentProfile:any={}
  constructor(private agent:AgentService)
  {}
  ngOnInit(){
    this.getAgentProfile();
  }
 getAgentProfile(){
  this.agent.getProfile().subscribe(
    (res)=>{
      this.agentProfile=res;
      this.agent.setAgent(res)
    },
    (err)=>{
      console.log(err);
    }
  )
 }
}
