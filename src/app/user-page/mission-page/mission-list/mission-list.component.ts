
import { MissionModule } from 'src/app/models/mission/mission.module';
import { ApiService } from 'src/app/api.service';
import { element } from 'protractor';
import { Component, OnInit, TemplateRef } from '@angular/core';
import * as CryptoJS from 'crypto-js';  
import { CookieService } from 'ngx-cookie-service';
import {BsModalRef, BsModalService} from 'ngx-bootstrap/modal'
@Component({
  selector: 'app-mission-list',
  templateUrl: './mission-list.component.html',
  styleUrls: ['./mission-list.component.css']
})
export class MissionListComponent implements OnInit {
  listMission;
  apiKey: string;
  totalRecords: string;
  page: number=1;
  decPassword:string = "CTS-Security";
  detail: BsModalRef;
  missiondetail;
  constructor(private apiService: ApiService, private cookieService: CookieService
    , private modalService: BsModalService) { }

  ngOnInit(): void {
      this.apiService.GetListMissionavailable().subscribe(
        (data: MissionModule[])=>{
          this.listMission = data['results'];
          this.listMission.forEach(element=>{
            if(element.point == 100)
            console.log(element);
          })
          this.totalRecords = data['results'].length;
          console.log(data['results'].length);
         // console.log(this.listMission[0].status);
        }
      );
    
  }
  showDetail(template: TemplateRef<any> ,id: number){
    this.detail = this.modalService.show(template, {class: "dialog-detail"});
    this.apiService.GetDetail(id).subscribe(data=>{
      this.missiondetail = data["results"][0];
    });
  }
  private Decrypt(encryptText: string){
    this.apiKey =  CryptoJS.AES.decrypt(encryptText, this.decPassword.trim()).toString(CryptoJS.enc.Utf8);
  }

}
