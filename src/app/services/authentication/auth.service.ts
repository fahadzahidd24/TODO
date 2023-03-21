import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { User } from 'src/app/models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient,private snackBar:MatSnackBar) { }

  signUp(name: string, email: string, password: string, image:File) {
    const userData = new FormData();
    userData.append('name', name);
    userData.append('email', email);
    userData.append('password', password);
    userData.append('image',image,name);
    // const user: User = { name: name, email: email, password: password }
    this.http.post<{message:string}>('http://localhost:3000/api/users/signup', userData).subscribe(response => {
      console.log(response.message);
      this.snackBar.open('SignUp Successfully', 'Close', { verticalPosition: "top", horizontalPosition: "end", panelClass: ['blue-snackbar'], duration: 2000 });
    })

  }
}
