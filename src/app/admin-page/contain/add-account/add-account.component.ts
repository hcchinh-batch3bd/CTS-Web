import { Component, OnInit, TemplateRef } from '@angular/core';
import { ApiService } from 'src/app/api.service';
import { AccountModule } from 'src/app/models/account/account.module';
import { CookieService } from 'ngx-cookie-service';
import { LevelModule } from 'src/app/models/account/level.module';
import * as CryptoJS from 'crypto-js';
import { stringify } from 'querystring';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
@Component({
  selector: 'app-add-account',
  templateUrl: './add-account.component.html',
  styleUrls: ['./add-account.component.css']
})
export class AddAccountComponent implements OnInit {
  idd: boolean;
  confirm: BsModalRef;
  modalref: BsModalRef;
  listLevel: LevelModule[] = [
    { id: false, name: "Nhân viên" },
    { id: true, name: "Quản lí" }
  ];
  listaccount: AccountModule[];
  decPassword: string = "CTS-Security";
  apiKey: string;
  message: string;
  constructor(private apiService: ApiService, private cookieSerive: CookieService
    , private modal: BsModalService) {
  }
  ngOnInit(): void {
    this.Decrypt(this.cookieSerive.get('cookieLogin'));
    this.apiService.GetListAccount(this.apiKey).subscribe(data => {

      this.listaccount = data['results'];
      console.log(this.apiKey);
      console.log(this.listLevel);

    },
      err => {
        console.log(err);
      }
    )

  }
  Confirm(template: TemplateRef<any>){
    this.modalref = this.modal.show(template, {class: 'notify'});
  }
  CreateAC(name_employee: string, password: string, date: Date, levell: boolean, email: string, template: TemplateRef<any>): void {
    this.confirm = this.modal.show(template, {class: 'confirm'});
    this.modalref.hide();
    if (name_employee.valueOf() != "" && password.valueOf() != "" && email.valueOf() != "") {
      if (this.CheckName(name_employee.valueOf())) {
        if (this.CheckPassword(password.valueOf())) {
          if (this.getAge(date) > 18) {
            if (levell.valueOf() != null) {
              if (this.CheckEmail(email.valueOf()) == true) {
                  var account: AccountModule = new AccountModule();
                  account.name_employee = name_employee.trim();
                  account.password = password;
                  account.date = date;
                  account.level_employee = levell;
                  account.email = email;
                  this.idd = levell;
                  console.log(this.idd);
                  this.apiService.CreateAccount(this.apiKey, account).subscribe(data => {
                    //alert("Thêm tài khoản thành công");
                    //console.log(data);
                    this.message = data['message'];
                    this.ngOnInit();
                  },
                    err => {
                      console.log(err);
                    })
              } else {
                this.message = "Vui lòng nhập đúng định dạng Email. ví dụ: bmtrong@gmail.com";
              }

            } else {
              this.message = "Bạn phải chọn chức vụ đang có trên hệ thống !!!";
            }


          } else {
            this.message = "Tuổi của bạn nhập không hợp lệ.\nVui lòng nhập lại.";
          }

        } else {
          this.message = "Mật khẩu phải dài từ 8 đến 30 ký tự.\nMật phải chứa ít nhất một số.\nMật khẩu phải chứa ít nhất một chữ cái viết hoa.\nMật khẩu phải chứa ít nhất một chữ cái viết thường\nMật khẩu phải chứa ít nhất một kí tự đặc biệt.";
        }

      } else {
        this.message = "Tên nhân viên phải toàn là chữ cái";
      }
    } else {
      this.message = "Vui lòng nhập đầy đủ thông tin";
    }


  }
  private Decrypt(encryptText: string) {
    this.apiKey = CryptoJS.AES.decrypt(encryptText, this.decPassword.trim()).toString(CryptoJS.enc.Utf8);
  }

  getAge(a: Date): number {
    let b = new Date(a);
    let c = new Date().getFullYear() - b.getFullYear();
    return c;
  }
  CheckPassword(password: string): boolean {
    var Pattern1 = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*]).{8,30}$/;
    if (Pattern1.test(password) && password != null) {
      return true;
    }
    else {
      return false;
    }
  }
  CheckName(name: string): boolean {
    var Pattern2 = /[a-zA-Z]+$/;
    if (Pattern2.test(name) && name != null) {
      return true;
    }
    else {
      return false;
    }
  }
  CheckEmail(email: string): boolean {
    var Pattern3 = /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i;
    if (Pattern3.test(email) && email != null) {
      return true;
    }
    else {
      return false;
    }
  }
}