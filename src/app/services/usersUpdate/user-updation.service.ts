import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from 'src/app/models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserUpdationService {

  constructor(private http:HttpClient) { }
  updateUser(name:string,email:string,image:File){
    const userData = new FormData();
    userData.append('name', name);
    userData.append('email', email);
    userData.append('image', image, name);

    // console.log(user.email);
    this.http.put<{ message: string}>('http://localhost:3000/api/users/update/'+email,userData).subscribe(response => {
      console.log(response.message);
    })
  }
}
