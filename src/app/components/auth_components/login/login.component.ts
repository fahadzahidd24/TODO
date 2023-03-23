import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from 'src/app/services/authentication/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  form:FormGroup;
  error:boolean;
  constructor(private snackBar:MatSnackBar,private authService:AuthService) { }
  ngOnInit(): void {
    this.form = new FormGroup({
      email: new FormControl(null, { validators: [Validators.required, Validators.email] }),
      password: new FormControl(null, { validators: [Validators.required, Validators.minLength(6), Validators.maxLength(20)] })
    })
  }
  onLogin(){
    if(this.form.invalid){
      this.error = true;
      return;
    }
    else{
      this.authService.login(this.form.value.email,this.form.value.password);
    }
  }
}
