import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiauthService } from 'src/app/services/apiauth.service';
import { FormGroup, FormBuilder ,FormControl, Validators} from '@angular/forms'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  public user!: string;
  public password!: string;
  formLogin!: FormGroup;
  
  constructor(public apiAuthService: ApiauthService,
              private formBuilder: FormBuilder,
              private router: Router) {
      // if(this.apiAuthService.userData){
      //   this.router.navigate(['/'])
      // }

      this.formLogin = this.formBuilder.group({
        usr_usuario: ['',[Validators.required,Validators.maxLength(25)]],
        usr_password: ['',[Validators.required,Validators.maxLength(25)]]
      });
  }

  ngOnInit(): void {
  }

  login(){
    console.log(this.formLogin.value)
    this.apiAuthService.login(this.formLogin.value).subscribe(data => {
      if(data != null){
        this.router.navigate(['/']);
      }
    })
  }
}
