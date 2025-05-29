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
  type?: 'planning' | 'reservation' | null; // Type of the time slot: planning or reservation
  horaireId?: number; // ID of the horaire (time slot) in the database
} 