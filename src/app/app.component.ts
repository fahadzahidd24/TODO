import { Component } from '@angular/core';
import { AuthService } from './services/authentication/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'todo_APP';
  constructor(private authService:AuthService){}
  ngOnInit(){
    this.authService.autoAuthUser();
  }
}
