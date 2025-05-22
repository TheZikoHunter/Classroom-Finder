import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from '../../models/subject.model';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-subject-management',
  templateUrl: './subject-management.component.html',
  styleUrls: ['./subject-management.component.scss']
})
export class SubjectManagementComponent implements OnInit {
  subjectForm: FormGroup;
  subjects: Subject[] = [];
  isEditing = false;
  currentSubjectId?: number;

  constructor(
    private fb: FormBuilder,
    private dataService: DataService
  ) {
    this.subjectForm = this.fb.group({
      name: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadSubjects();
  }

  loadSubjects(): void {
    this.dataService.getSubjects().subscribe(data => {
      this.subjects = data;
    });
  }

  onSubmit(): void {
    if (this.subjectForm.valid) {
      const subject: Subject = this.subjectForm.value;
      
      if (this.isEditing && this.currentSubjectId) {
        subject.id = this.currentSubjectId;
        this.dataService.updateSubject(subject).subscribe(() => {
          this.resetForm();
          this.loadSubjects();
        });
      } else {
        this.dataService.addSubject(subject).subscribe(() => {
          this.resetForm();
          this.loadSubjects();
        });
      }
    }
  }

  editSubject(subject: Subject): void {
    this.isEditing = true;
    this.currentSubjectId = subject.id;
    this.subjectForm.patchValue({
      name: subject.name
    });
  }

  deleteSubject(id?: number): void {
    if (id) {
      this.dataService.deleteSubject(id).subscribe(() => {
        this.loadSubjects();
      });
    }
  }

  resetForm(): void {
    this.subjectForm.reset();
    this.isEditing = false;
    this.currentSubjectId = undefined;
  }
}