import { Classroom } from './classroom.model';
import { Subject } from './subject.model';
import { Professor } from './professor.model';
import { Major } from './major.model';

export interface Planning {
  idPlanning: number;
  salle: Classroom;
  matiere: Subject;
  horaire: {
    idHoraire: number;
    heure_debut: string;
    heure_fin: string;
    jour: string;
  };
  professeur: Professor;
  filiere: Major;
} 