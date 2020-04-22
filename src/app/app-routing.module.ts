import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [
  {path: '', redirectTo:'login-page', pathMatch:'full'},
  {path:'login-page', loadChildren:'../login-page/login.module#LoginModule'},
  // {path: '', redirectTo:'admin-page', pathMatch:'full'},
  // {path:'admin-page', loadChildren:'./admin-page/admin.module#AdminModule'}
  // {path: '', redirectTo: 'home', pathMatch:'full'},
  // {
  //   path: 'home', loadChildren:'./user-page/user.module#UserModule',
  // }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
