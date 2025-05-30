import { Routes } from '@angular/router';
import { LandingPageComponent } from './component/landing-page/landing-page.component';
import { LoginComponent } from './component/login/login.component';
import { DashboardComponent } from './component/dashboard/dashboard.component';
import { DashboardProfessorComponent } from './component/dashboard-professor/dashboard-professor.component';
import { ProfessorTimetableComponent } from './component/professor-timetable/professor-timetable.component';
import { ProfessorManagementComponent } from './component/professor-management/professor-management.component';
import { UserManagementComponent } from './component/user-management/user-management.component';
import { EntityManagementComponent } from './component/entity-management/entity-management.component';
import { AuthGuard } from './auth/auth.guard';
import { AdminGuard } from './guards/admin.guard';
import { ProfessorGuard } from './guards/professor.guard';

export const routes: Routes = [
  { path: '', component: LandingPageComponent },
  { path: 'login', component: LoginComponent },
  { 
    path: 'dashboard', 
    component: DashboardComponent,
    canActivate: [AdminGuard]
  },
  { 
    path: 'professor-dashboard', 
    component: DashboardProfessorComponent,
    canActivate: [ProfessorGuard]
  },
  { 
    path: 'professor-timetable', 
    component: ProfessorTimetableComponent,
    canActivate: [ProfessorGuard]
  },
  {
    path: 'professeurs',
    component: ProfessorManagementComponent,
    canActivate: [AdminGuard]
  },
  {
    path: 'user-management',
    component: UserManagementComponent,
    canActivate: [AdminGuard]
  },
  {
    path: 'entity-management',
    component: EntityManagementComponent,
    canActivate: [AdminGuard]
  },
  { path: '**', redirectTo: '' }
];
