import { Subject } from './subject.model';
import { Professor } from './professor.model';
import { Classroom } from './classroom.model';

export interface TimeSlot {
  day: string;
  startTime: string;
  endTime: string;
  subject?: Subject | null;
  professor?: Professor | null;
  classroom?: Classroom | null;
  reservationDate?: string | null; // ISO date string for temporary reservations
} 