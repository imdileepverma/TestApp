import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from  '@angular/forms';
import { Router } from  '@angular/router';
import { FireService } from '../services/fire.service';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  registerForm: FormGroup;
  isSubmitted  =  false;

  constructor( private formBuilder: FormBuilder,
    private router: Router,
    private fireService: FireService, ) { }

  ngOnInit(): void {
    this.registerForm  =  this.formBuilder.group({
      fullname: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
  }
  

get formControls() { return this.registerForm.controls; }
  
register(){
  console.log(this.registerForm.value);
  this.isSubmitted = true;
  if(this.registerForm.invalid){
    return;
  }
  this.fireService.register(this.registerForm.value.fullname, this.registerForm.value.email, this.registerForm.value.password).then((res: any) => {
   alert('Register successfully!')
    console.log(res)
    this.router.navigateByUrl('/login');
  }, (err) => {
    console.log(err);
    alert(err.message);
  });
 
}

}
