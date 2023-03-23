import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/authentication/auth.service';
import { mimeType } from './mime-type.validator';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  form: FormGroup;
  dpPreview: string;

  constructor(private snackBar: MatSnackBar, private authService: AuthService) { }
  ngOnInit() {
    this.form = new FormGroup({
      name: new FormControl(null, { validators: [Validators.required, Validators.minLength(3), Validators.maxLength(20), Validators.pattern(/^[a-zA-Z\ ]*$/)] }),
      email: new FormControl(null, { validators: [Validators.required, Validators.email] }),
      password: new FormControl(null, { validators: [Validators.required, Validators.minLength(6), Validators.maxLength(20)] }),
      confirmPassword: new FormControl(null, { validators: [Validators.required, Validators.minLength(6), Validators.maxLength(20)] }),
      image: new FormControl(null, {validators: [Validators.required],asyncValidators: [mimeType]})
    })

  }
  
  onSignup() {
    if (this.form.invalid) {
      this.snackBar.open('Invalid Form', 'Close', { verticalPosition: "bottom", horizontalPosition: "end", panelClass: ['red-snackbar'], duration: 2000 });
      return;
    }
    else {
      if (this.form.value.password != this.form.value.confirmPassword) {
        this.snackBar.open('Password and Confirm Password must be same', 'Close', { verticalPosition: "bottom", horizontalPosition: "end", panelClass: ['red-snackbar'], duration: 2000 });
        return;
      }
      else {
        this.authService.signUp(this.form.value.name, this.form.value.email, this.form.value.password, this.form.value.image);
        this.form.reset();
        this.dpPreview = null;
      }
    }
  }

  onImageUpload(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({ image: file });
    this.form.get("image").updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.dpPreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }
}
