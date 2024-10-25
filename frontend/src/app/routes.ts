import { Routes } from '@angular/router';
import { HomeComponent } from './components/pages/home/home.component';
import { UserComponent } from './components/pages/user/user.component';
import { LoginPageComponent } from './components/pages/login-page/login-page.component';

const routeConfig: Routes = [
  {
    path:'',
    component: HomeComponent,
    title: 'Inicio'
  },
  {
    path:'login',
    component: LoginPageComponent,
    title: 'Iniciar Sesión'
  },
  {
    path:'profile/:user',
    component: UserComponent,
    title: 'Usuario'
  }
];
export default routeConfig;
