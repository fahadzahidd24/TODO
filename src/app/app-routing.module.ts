import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/auth_components/login/login.component';
import { SignupComponent } from './components/auth_components/signup/signup.component';

const routes: Routes = [
  {path:'' , component: LoginComponent},
  {path:'signup' , component: SignupComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
