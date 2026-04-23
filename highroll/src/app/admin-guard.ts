import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserData } from './userdata';

export const adminGuard: CanActivateFn = () => {
  const userData = inject(UserData);
  const router = inject(Router);

  if (userData.role() === 'admin') {
    return true;
  }

  router.navigate(['/']);
  return false;
};