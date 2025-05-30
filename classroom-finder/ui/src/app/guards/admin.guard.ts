import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    if (this.authService.isAuthenticated() && this.authService.isAdmin()) {
      return true;
    }

    // Redirect to login page if not authenticated
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login'], {
        queryParams: { returnUrl: state.url }
      });
    } else {
      // Redirect to appropriate dashboard if authenticated but not admin
      if (this.authService.isProfessor()) {
        this.router.navigate(['/professor-dashboard']);
      } else {
        this.router.navigate(['/']);
      }
    }
    return false;
  }
}
