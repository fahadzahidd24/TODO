import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
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
  users: User[];
  userSub: Subscription;
  form: FormGroup;
  dpPreview: string;
  constructor(private snackBar: MatSnackBar, private authService: AuthService) { }
  ngOnInit(){
    console.log('profile begins')
    this.form = new FormGroup({
      //only alphabets can have space in between
      name: new FormControl(null, { validators: [ Validators.minLength(3), Validators.maxLength(20), Validators.pattern(/^[a-zA-Z\ ]*$/)] }),
      email: new FormControl(null, { validators: [Validators.email] }),
      image: new FormControl(null, { validators: [Validators.required], asyncValidators: [mimeType] })
    })

    this.userSub = this.authService.getUserSub().subscribe((users: User[]) => {
      this.users = users;
      console.log(this.users);
      this.form.patchValue({
        name: this.users[0].name,
        email: this.users[0].email,
      })
      this.dpPreview = this.users[0].image;
      
    })
  }

  onUpdate() {
    if (this.form.invalid) {
      console.log("Invalid Form");
      return;
    }
    if (this.form.value.password !== this.form.value.confirmPassword) {
      this.snackBar.open("Passwords do not match", "Close", { duration: 2000 });
      return;
    }
    else{
      this.authService.updateUser(this.form.value.name, this.form.value.email, this.form.value.image);
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


  ngOnDestroy() {
    this.userSub.unsubscribe();
  }
} 
