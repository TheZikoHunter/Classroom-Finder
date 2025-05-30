import { Routes } from '@angular/router';
import { LandingPageComponent } from './component/landing-page/landing-page.component';
import { LoginComponent } from './component/login/login.component';
import { DashboardComponent } from './component/dashboard/dashboard.component';
import { ProfessorTimetableComponent } from './component/professor-timetable/professor-timetable.component';
import { ProfessorManagementComponent } from './component/professor-management/professor-management.component';
import { AuthGuard } from './auth/auth.guard';

export const routes: Routes = [
  { path: '', component: LandingPageComponent },
  { path: 'login', component: LoginComponent },
  { 
    path: 'dashboard', 
    component: DashboardComponent,
    canActivate: [AuthGuard]
  },
  { 
    path: 'professor-timetable', 
    component: ProfessorTimetableComponent,
    canActivate: [AuthGuard]
  },
  {
  path: 'professeurs',
  component: ProfessorManagementComponent
},
{ path: '**', redirectTo: '' }
];
