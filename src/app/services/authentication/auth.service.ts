import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject } from 'rxjs';
import { User } from 'src/app/models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private user:User[] = [];
  private userSub = new Subject<User[]>();
  constructor(private http: HttpClient,private snackBar:MatSnackBar) { }


  getUserSub(){
    return this.userSub.asObservable();
  }

  signUp(name: string, email: string, password: string, image:File) {
    const userData = new FormData();
    userData.append('name', name);
    userData.append('email', email);
    userData.append('password', password);
    userData.append('image',image,name);
    // const user: User = { name: name, email: email, password: password }
    this.http.post<{message:string,user:any}>('http://localhost:3000/api/users/signup', userData).subscribe(response => {
      console.log(response.message);
      const user: User = {
        name:response.user.name,
        email:response.user.email,
        password:response.user.password,
        image:response.user.imagePath
      }
      this.user.push(user);
      this.userSub.next([...this.user]);

      this.snackBar.open('SignUp Successfully', 'Close', { verticalPosition: "top", horizontalPosition: "end", panelClass: ['blue-snackbar'], duration: 2000 });
    })

  }
}
