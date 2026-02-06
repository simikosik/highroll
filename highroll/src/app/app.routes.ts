import { Routes } from '@angular/router';
import { LoginComponent } from './login/login';
import { RegisterComponent } from './register/register';
import { DashboardComponent } from './dashboard/dashboard';
import { PlinkoComponent } from './games/plinko/plinko';
import { Home } from './home/home';
import { AuthGuard } from './guards/auth.guard';
import { Blog } from './blog/blog';

export const routes: Routes = [
    { path: '', component: Home },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
    { path: 'plinko', component: PlinkoComponent, canActivate: [AuthGuard] },
    { path: 'blog', component: Blog },
    { path: '**', redirectTo: '' }
];
