import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ProfessorTimetableComponent } from '../professor-timetable/professor-timetable.component';
import { MyScheduleComponent } from '../my-schedule/my-schedule.component';
import { DataService } from '../../services/data.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-dashboard-professor',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    ProfessorTimetableComponent,
    MyScheduleComponent
  ],
  templateUrl: './dashboard-professor.component.html',
  styleUrls: ['./dashboard-professor.component.scss']
})
export class DashboardProfessorComponent implements OnInit {
  professorName: string = '';
  activePanel: 'timetable' | 'schedule' = 'timetable';
  currentProfessor: any;

  constructor(
    private dataService: DataService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    // Always use the backend-provided username for the dashboard greeting
    const user = this.authService.getCurrentUser();
    this.professorName = user && user.username ? user.username : '';
    // Optionally, you can still fetch the full professor object for other data if needed
    const professorId = this.authService.getCurrentUserId();
    if (professorId) {
      this.dataService.getProfessorById(professorId).subscribe({
        next: (professor) => {
          this.currentProfessor = professor;
        },
        error: (error) => {
          console.error('Error fetching professor:', error);
        }
      });
    }
  }

  setActivePanel(panel: 'timetable' | 'schedule'): void {
    this.activePanel = panel;
  }

  logout() {
    this.authService.logout();
  }
}