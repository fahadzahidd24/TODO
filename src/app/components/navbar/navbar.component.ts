import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Subscription } from 'rxjs';
import { User } from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/authentication/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  showProfileMenu: boolean = false;
  user: User;
  userEmail: string;
  isAuth = false;
  userIdSub: Subscription;
  authSub: Subscription;
  constructor(private authService: AuthService, private cookieService: CookieService,private router:Router) { }
  ngOnInit() {
    if (this.cookieService.get('user')) {
      this.user = JSON.parse(this.cookieService.get('user'));
    }
    this.isAuth = this.authService.getIsAuth();
    this.authSub = this.authService.getAuthListener().subscribe(isAuth => {
      this.isAuth = isAuth.status;
    })
    
    this.userIdSub = this.authService.getuserEmailListener().subscribe(userEmail => {
      this.showProfileMenu = false;
      this.userEmail = userEmail;
      this.authService.getUser(this.userEmail).subscribe(response => {
        // this.user = response.user;
        this.user = {
          name: response.user[0].name,
          email: response.user[0].email,
          password: response.user[0].password,
          image: response.user[0].imagePath
        }
        this.cookieService.set('user', JSON.stringify(this.user));
      })
    })
  }

  onLogout() {
    this.authService.logout();
  }
  onClickProfile() {
    this.showProfileMenu = !this.showProfileMenu;
  }
  goToProfileEdit(){
    this.showProfileMenu = false;
    this.router.navigate(['/profile']);
  }
  ngOnDestroy() {
    this.userIdSub.unsubscribe();
    this.authSub.unsubscribe();
  }
}