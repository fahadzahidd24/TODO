import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Subject } from 'rxjs/internal/Subject';
import { User } from 'src/app/models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // private users: User[] = [];
  private userEmail: string;
  // private userId: string;
  private token: string;
  private isAuthenticated:boolean;
  private authListener = new Subject<{ status: boolean }>();
  private userEmailListener = new Subject<string>();
  private tokenTimer: any;
  // userSub = new Subject<User[]>();

  constructor(private http: HttpClient, private snackBar: MatSnackBar, private router: Router, private cookieService: CookieService) { }

  // getUserSub() {
  //   return this.userSub.asObservable();
  // }
  getAuthListener() {
    return this.authListener.asObservable();
  }
  getuserEmailListener() {
    return this.userEmailListener.asObservable();
  }
  getIsAuth() {
    return this.isAuthenticated;
  }
  getUserEmail() {
    return this.userEmail;
  }
  getUser(email: string) {
    return this.http.get<{ message: string, user: any }>('http://localhost:3000/api/users/' + email);
  }

  signUp(name: string, email: string, password: string, image: File) {
    const userData = new FormData();
    userData.append('name', name);
    userData.append('email', email);
    userData.append('password', password);
    userData.append('image', image, name);
    // const user: User = { name: name, email: email, password: password }
    this.http.post<{ message: string, user: any }>('http://localhost:3000/api/users/signup', userData).subscribe(response => {
      this.snackBar.open('SignUp Successfully', 'Close', { verticalPosition: "bottom", horizontalPosition: "end", panelClass: ['blue-snackbar'], duration: 2000 });
      this.router.navigate(['/login']);
    })
  }

  login(email: string, password: string) {
    const user: User = { email: email, password: password }
    this.http.post<{ message: string, token: string, expiresIn: number, userEmail: string }>('http://localhost:3000/api/users/login', user).subscribe(response => {
      this.isAuthenticated = true;
      this.userEmail = response.userEmail;
      this.token = response.token;
      this.authListener.next({ status: true });
      this.userEmailListener.next(this.userEmail);
      const expiresInDuration = response.expiresIn;
      const now = new Date();
      const expirationDate = new Date(now.getTime() + expiresInDuration * 1000);
      this.saveAuthData(this.token, expirationDate);
      this.setAuthTimer(expiresInDuration);
      this.snackBar.open('Login Successfully', 'Close', { verticalPosition: "bottom", horizontalPosition: "end", panelClass: ['blue-snackbar'], duration: 2000 });
      this.router.navigate(['/home']);
    })
  }

  logout() {
    this.token = null;
    this.isAuthenticated = false;
    this.authListener.next({ status: false });
    this.clearAuthData();
    clearTimeout(this.tokenTimer);
    this.snackBar.open('Logout Successfully', 'Close', { verticalPosition: "bottom", horizontalPosition: "end", panelClass: ['blue-snackbar'], duration: 2000 });
    // this.router.navigate(['/login']);
  }

  autoAuthUser() {
    console.log("AutoAuthUser")
    const authInformation = this.getAuthData();
    if (!authInformation)
      return ;
    const now = new Date();
    const isInFuture = authInformation.expirationDate > now;
    if (isInFuture) {
      this.token = authInformation.token;
      this.isAuthenticated = true;
      const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
      this.setAuthTimer(expiresIn / 1000);
      this.authListener.next({ status: true });
    }
  }

  private setAuthTimer(duration: number) {
    console.log('Setting timer: ' + duration);
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }

  private saveAuthData(token: string, expirationDate: Date) {
    this.cookieService.set('token', token);
    this.cookieService.set('expiration', expirationDate.toISOString());
  }

  private clearAuthData() {
    this.cookieService.deleteAll();
  }

  private getAuthData() {
    const token = this.cookieService.get('token');
    const expirationDate = this.cookieService.get('expiration');
    if (!token || !expirationDate)
      return null;
    return {
      token: token,
      expirationDate: new Date(expirationDate)
    }
  }
  // updateUser(name: string, email: string, image: File) {
  //   const userData = new FormData();
  //   userData.append('name', name);
  //   userData.append('email', email);
  //   userData.append('image', image, name);
  //   this.http.put<{ message: string, user: any }>(`http://localhost:3000/api/users/` + this.userId, userData).subscribe(response => {
  //     this.users[0].name = response.user.name;
  //     this.users[0].email = response.user.email;
  //     this.users[0].image = response.user.imagePath;
  //     this.userSub.next([...this.users]);
  //     this.snackBar.open('Profile Updated Successfully', 'Close', { verticalPosition: "top", horizontalPosition: "end", panelClass: ['blue-snackbar'], duration: 2000 });
  //     this.router.navigate(['/profile']);
  //   })
  // }
}
