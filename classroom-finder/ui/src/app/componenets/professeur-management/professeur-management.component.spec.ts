import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfesseurManagementComponent } from './professeur-management.component';

describe('ProfesseurManagementComponent', () => {
  let component: ProfesseurManagementComponent;
  let fixture: ComponentFixture<ProfesseurManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfesseurManagementComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProfesseurManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
