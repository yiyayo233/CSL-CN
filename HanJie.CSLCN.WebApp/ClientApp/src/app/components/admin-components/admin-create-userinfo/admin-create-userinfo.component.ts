import { Component, OnInit } from '@angular/core';
import { Observable, Observer } from 'rxjs';
import { UserInfoDto } from '../../../models/user-info-dto';
import { AdminUserInfoService } from '../../../services/admin/admin-userinfo.service';
import { FormBuilder, FormGroup, Validators, FormControl, ValidationErrors } from '@angular/forms';
import { UserInfoService } from '../../../services/user-info.service';
import { UploaderComponent } from '../../uploader/uploader.component';
import { NzDrawerService } from 'ng-zorro-antd';
import { DrawerStatuService } from '../../../services/drawer-statu.service';
import { UploaderUsageEnum } from '../../../models/uploader-usage.enum';

@Component({
  selector: 'admin-create-userinfo',
  templateUrl: './admin-create-userinfo.component.html',
  styleUrls: ['./admin-create-userinfo.component.css']
})
export class AdminCreateUserInfoComponent implements OnInit {

  private timerForUsernameDuplicated: NodeJS.Timer;

  public userInfoForm: FormGroup;
  public userAvartarUrl: string;

  constructor(private formBuilder: FormBuilder,
    private userInfoService: UserInfoService,
    private drawerService: NzDrawerService) {
    this.userInfoForm = this.formBuilder.group({
      avatarUrl: ['', [Validators.required]],
      nickName: ['', [Validators.required]],
      userName: ['', [Validators.required], [this.userNameAsyncValidator]],
      password: ['', [Validators.required]],
      confirm: ['', [this.confirmPassword]],
      isAdmin: [false]
    });
  }

  ngOnInit(): void {

  }

  validateConfirmPassword(): void {
    setTimeout(() => { this.userInfoForm.controls["confirm"].updateValueAndValidity() });
  }

  confirmPassword = (control: FormControl): { [s: string]: boolean } => {   //https://stackoverflow.com/questions/59498128/what-is-the-code-s-string-boolean-in-the-angular-code-block
    if (!control.value) {
      return { error: true, required: true };
    } else if (control.value != this.userInfoForm.controls["password"].value) {
      return { error: true, confirm: true };
    }
    return {};
  };


  userNameAsyncValidator = (control: FormControl): Observable<any> => {
    return new Observable((observer: Observer<ValidationErrors | null>) => {
      if (this.timerForUsernameDuplicated !== null) { //请求防抖
        clearTimeout(this.timerForUsernameDuplicated);
      }
      let userName: string = control.value;
      this.timerForUsernameDuplicated = setTimeout(() => {
        this.userInfoService.isUserNameDuplicated(userName).subscribe(response => {
          if (response === true) {
            observer.next({ error: true, duplicated: true }); //必须返回 error:true 以标识此事件为校验错误
          } else {
            observer.next(null);
          }
          observer.complete();
        });
      }, 1000);
    });
  };

  submitForm(data: UserInfoDto): void {
    for (const item in this.userInfoForm.controls) {
      this.userInfoForm.controls[item].markAsDirty();            //标记为已触碰并修改
      this.userInfoForm.controls[item].updateValueAndValidity(); //再次执行校验
    }
    console.log(data);
    this.userInfoService.create(data).subscribe(response => {
      //返回给上层，添加到表格
    });
  }

  openUploader(): void {
    DrawerStatuService.createUserDrawerRef.nzOffsetX = 180;

    const drawerRef = this.drawerService.create<UploaderComponent, { directoryPath: string, usage: UploaderUsageEnum }, string>({
      nzTitle: '上传用户头像',
      nzContent: UploaderComponent,
      nzPlacement: 'right',
      nzWidth: 320,
      nzMaskClosable: false,
      nzClosable: false,
      nzContentParams: {
        directoryPath: 'user-avatar',
        usage: UploaderUsageEnum.userAvatar
      },
    });

    drawerRef.afterOpen.subscribe(() => {
      console.log('Drawer(Component) open');
    });

    drawerRef.afterClose.subscribe(data => {
      console.log(data);
      if (typeof data === 'string') {
        console.log(data.toString());
        this.userAvartarUrl = data;
      }
    });

  }

  resetForm(e: MouseEvent): void {
    e.preventDefault();
    this.userInfoForm.reset();
    for (const key in this.userInfoForm.controls) {
      this.userInfoForm.controls[key].markAsPristine();
      this.userInfoForm.controls[key].updateValueAndValidity();
    }
  }


}
