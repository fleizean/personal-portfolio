export interface JourneyItem {
  title: string;
  place: string;
  year: string;
  description: string;
  type: 'work' | 'education' | 'project' | 'personal' | 'other';
  emoji?: string;
  link?: string;
  photo?: string;
}
