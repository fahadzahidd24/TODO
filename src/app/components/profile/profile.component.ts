import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CookieService } from 'ngx-cookie-service';
import { Subscription } from 'rxjs';
import { User } from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/authentication/auth.service';
import { mimeType } from '../auth_components/signup/mime-type.validator';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {
  users: User;
  userImage:File;
  userEmail: string;
  userSub: Subscription;
  form: FormGroup;
  dpPreview: string;
  constructor(private snackBar: MatSnackBar, private authService: AuthService, private cookieService: CookieService) { }
  ngOnInit() {
    this.form = new FormGroup({
      name: new FormControl(null, { validators: [Validators.required, Validators.minLength(3), Validators.maxLength(20), Validators.pattern(/^[a-zA-Z\ ]*$/)] }),
      email: new FormControl(null, { validators: [Validators.email] }),
      image: new FormControl(null)
    })
    this.form.get('email').disable();
    if (this.cookieService.get('user')) {
      this.users = JSON.parse(this.cookieService.get('user'));
    } 
    this.userImage = new File([this.users.image], "image.png", { type: "image/png" });
    this.form.patchValue({
      name: this.users.name,
      email: this.users.email,
      image: this.userImage
    })
    this.dpPreview = this.users.image;  
    this.userEmail = this.form.get('email').value;
  }
  
  onUpdate() {
    if (this.form.invalid) {
      console.log("Invalid Form");
      this.snackBar.open('Invalid Input', 'Close', { verticalPosition: "bottom", horizontalPosition: "end", panelClass: ['red-snackbar'], duration: 2000 });
      return;
    }
    else {
      console.log(this.userEmail)
      this.authService.updateUser(this.form.value.name, this.userEmail, this.form.value.image);
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
