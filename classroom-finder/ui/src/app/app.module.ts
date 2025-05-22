import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { ProfessorManagementComponent } from './component/professor-management/professor-management.component';
import { SubjectManagementComponent } from './component/subject-management/subject-management.component';
import { ClassroomManagementComponent } from './component/classroom-management/classroom-management.component';
import { MajorManagementComponent } from './component/major-management/major-management.component';
import { ScheduleManagementComponent } from './component/schedule-management/schedule-management.component';
import { EmptyClassroomComponent } from './component/empty-classroom/empty-classroom.component';
import { NavbarComponent } from './component/navbar/navbar.component';
import { DashboardComponent } from './component/dashbord/dashboard.component';

const routes: Routes = [
  { path: 'professors', component: ProfessorManagementComponent },
  { path: 'subjects', component: SubjectManagementComponent },
  { path: 'classrooms', component: ClassroomManagementComponent },
  { path: 'majors', component: MajorManagementComponent },
  { path: 'schedule', component: ScheduleManagementComponent },
  { path: 'empty-classrooms', component: EmptyClassroomComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' }
];

@NgModule({
  declarations: [
    AppComponent,
    ProfessorManagementComponent,
    SubjectManagementComponent,
    ClassroomManagementComponent,
    MajorManagementComponent,
    ScheduleManagementComponent,
    EmptyClassroomComponent,
    NavbarComponent,
    DashboardComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot(routes)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }