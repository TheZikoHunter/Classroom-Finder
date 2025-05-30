import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class ProfessorGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    if (this.authService.isAuthenticated() && this.authService.isProfessor()) {
      return true;
    }

    // Redirect to login page if not authenticated
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login'], {
        queryParams: { returnUrl: state.url }
      });
    } else {
      // Redirect to appropriate dashboard if authenticated but not professor
      if (this.authService.isAdmin()) {
        this.router.navigate(['/admin-dashboard']);
      } else {
        this.router.navigate(['/']);
      }
    }
    return false;
  }
}
