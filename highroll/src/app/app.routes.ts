import { Routes } from '@angular/router';
import { Home } from './home/home';
import { Blackjack } from './blackjack/blackjack';
import { Blog } from './blog/blog';
import { About } from './about/about';
import { Login } from './login/login';
import { authGuard } from './auth-guard';
import { Profile } from './profile/profile';
import { Admin } from './admin/admin';
import { adminGuard } from './admin-guard';


export const routes: Routes = [
    { path: '', component: Home }, 
    { path: 'login', component: Login },
    { path: 'bj', component: Blackjack, canActivate: [authGuard] },
    { path: 'profile', component: Profile, canActivate: [authGuard] },
    { path: 'about', component: About },
    { path: 'blog', component: Blog },
    { path: 'admin', component: Admin, canActivate: [authGuard, adminGuard] },
    { path: '**', redirectTo: '' },
];
