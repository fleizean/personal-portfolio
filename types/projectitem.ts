export interface ProjectItem {
  projectName: string;
  type: 'present' | 'past';
  icon: string;
  year: string;
  status: 'development' | 'completed' | 'ongoing';
  description?: string;
  techStack?: string[];
  githubLink?: string;
  liveLink?: string;
  image?: string;
}
