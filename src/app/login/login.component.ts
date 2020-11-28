import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from  '@angular/forms';
import { Router } from  '@angular/router';
import { NgxSpinnerService } from "ngx-spinner";
import { FireService } from '../services/fire.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  isSubmitted  =  false;

  constructor( private formBuilder: FormBuilder,
               private router: Router,
               private fireService: FireService,
               private spinner: NgxSpinnerService,
               ) { }

  ngOnInit(): void {
    
    this.loginForm  =  this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  get formControls() { return this.loginForm.controls; }

  login(){
    this.spinner.show();
    console.log(this.loginForm.value);
    this.isSubmitted = true;
    if(this.loginForm.invalid){
      this.spinner.hide();
      return;
    }
    this.fireService.login(this.loginForm.value.email, this.loginForm.value.password).then((res: any) => {
      console.log(res);
      this.spinner.hide();
      this.router.navigate(['home']);
    }, (err) => {
      this.spinner.hide();
      console.log(err);
      alert(JSON.stringify(err.message));
    });
  }

  signup() {
    this.router.navigateByUrl('/register');
  }

  forget() {
    this.router.navigateByUrl('/forget');
  }

 

}
