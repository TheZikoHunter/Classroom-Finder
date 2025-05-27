import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, Routes } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { inject } from '@angular/core';

import { AppComponent } from './app.component';
import { ProfessorManagementComponent } from './component/professor-management/professor-management.component';
import { SubjectManagementComponent } from './component/subject-management/subject-management.component';
import { ClassroomManagementComponent } from './component/classroom-management/classroom-management.component';
import { MajorManagementComponent } from './component/major-management/major-management.component';
import { ScheduleManagementComponent } from './component/schedule-management/schedule-management.component';
import { EmptyClassroomComponent } from './component/empty-classroom/empty-classroom.component';
import { NavbarComponent } from './component/navbar/navbar.component';
import { DashboardComponent } from './component/dashboard/dashboard.component';
import { ProfessorTimetableComponent } from './component/professor-timetable/professor-timetable.component';
import { LoginComponent } from './component/login/login.component';
import { AuthService } from './auth/auth.service';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { 
    path: 'professors', 
    component: ProfessorManagementComponent,
    canActivate: [() => inject(AuthService).isAdmin()]
  },
  { 
    path: 'subjects', 
    component: SubjectManagementComponent,
    canActivate: [() => inject(AuthService).isAdmin()]
  },
  { 
    path: 'classrooms', 
    component: ClassroomManagementComponent,
    canActivate: [() => inject(AuthService).isAdmin()]
  },
  { 
    path: 'majors', 
    component: MajorManagementComponent,
    canActivate: [() => inject(AuthService).isAdmin()]
  },
  { 
    path: 'schedule', 
    component: ScheduleManagementComponent,
    canActivate: [() => inject(AuthService).isAdmin()]
  },
  { 
    path: 'empty-classrooms', 
    component: EmptyClassroomComponent,
    canActivate: [() => inject(AuthService).isAdmin()]
  },
  { 
    path: 'dashboard', 
    component: DashboardComponent,
    canActivate: [() => inject(AuthService).isAdmin()]
  },
  { 
    path: 'professor-timetable', 
    component: ProfessorTimetableComponent,
    canActivate: [() => inject(AuthService).isProfessor()]
  }
];

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    provideAnimations()
  ]
}).catch(err => console.error(err));