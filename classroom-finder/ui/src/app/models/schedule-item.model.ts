export interface ScheduleItem {
  id?: number;
  day: number; // 0-6 for Sunday to Saturday
  timeSlot: number; // 1-8 for different periods
  professorId: number;
  subjectId: number;
  classroomId: number;
  majorId: number;
}