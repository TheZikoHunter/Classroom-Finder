import { Routes } from '@angular/router';
import { DashboardComponent } from './component/dashboard/dashboard.component';
import { LoginComponent } from './component/login/login.component';
import { authGuard } from './guards/auth.guard';
import { ProfessorTimetableComponent } from './component/professor-timetable/professor-timetable.component';
export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },
  { path: 'professor-timetable', component: ProfessorTimetableComponent, canActivate: [authGuard] }
];
