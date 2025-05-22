import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Major } from '../../models/major.model';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-major-management',
  templateUrl: './major-management.component.html',
  styleUrls: ['./major-management.component.scss']
})
export class MajorManagementComponent implements OnInit {
  majorForm: FormGroup;
  majors: Major[] = [];
  isEditing = false;
  currentMajorId?: number;

  constructor(
    private fb: FormBuilder,
    private dataService: DataService
  ) {
    this.majorForm = this.fb.group({
      nomFiliere: ['', Validators.required],
      email_representant: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit(): void {
    this.loadMajors();
  }

  loadMajors(): void {
    this.dataService.getMajors().subscribe(data => {
      this.majors = data;
    });
  }

  onSubmit(): void {
    if (this.majorForm.valid) {
      const major: Major = this.majorForm.value;
      
      if (this.isEditing && this.currentMajorId) {
        this.dataService.updateMajor(this.currentMajorId, major).subscribe(() => {
          this.resetForm();
          this.loadMajors();
        });
      } else {
        this.dataService.createMajor(major).subscribe(() => {
          this.resetForm();
          this.loadMajors();
        });
      }
    }
  }

  editMajor(major: Major): void {
    this.isEditing = true;
    this.currentMajorId = major.idFiliere;
    this.majorForm.patchValue({
      nomFiliere: major.nomFiliere,
      email_representant: major.email_representant
    });
  }

  deleteMajor(id?: number): void {
    if (id) {
      this.dataService.deleteMajor(id).subscribe(() => {
        this.loadMajors();
      });
    }
  }

  resetForm(): void {
    this.majorForm.reset();
    this.isEditing = false;
    this.currentMajorId = undefined;
  }
}