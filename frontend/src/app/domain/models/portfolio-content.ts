export type SocialKind = 'github' | 'linkedin' | 'youtube' | 'intra42';

export interface SocialLink {
  kind: SocialKind;
  label: string;
  url: string;
}

export interface Profile {
  name: string;
  greeting: string;
  role: string;
  company: string;
  description: string;
  portraitAlt: string;
  email: string;
  location: string;
  contactTitle: string;
  contactText: string;
  socials: SocialLink[];
}

export type ProjectStatus = 'development' | 'production' | 'completed' | 'ongoing';

export interface Project {
  name: string;
  year: string;
  status: ProjectStatus;
  description?: string;
  techStack: string[];
  githubUrl?: string;
  liveUrl?: string;
  image?: string;
  /** Şu an üzerinde çalışılan proje mi, arşiv mi */
  current: boolean;
}

export type JourneyKind = 'work' | 'education' | 'project' | 'personal' | 'other';

export interface JourneyEntry {
  title: string;
  place: string;
  period: string;
  description: string;
  kind: JourneyKind;
  link?: string;
  image?: string;
  current: boolean;
}

export const TECH_CATEGORIES = ['frontend', 'backend', 'database', 'devops', 'learning'] as const;

export type TechCategory = (typeof TECH_CATEGORIES)[number];

export interface Technology {
  name: string;
  category: TechCategory;
  description: string;
  link?: string;
}

export interface SchoolExperience {
  title: string;
  period: string;
  description: string;
  highlights: string[];
  reflection?: string;
  link?: string;
  image?: string;
}

/** Müzik çalardaki parça (YouTube gömülü oynatıcısıyla çalar) */
export interface MusicTrack {
  title: string;
  artist: string;
  /** 11 karakterlik YouTube video kimliği */
  videoId: string;
}

/** Sitenin bir dildeki tüm içeriği */
export interface PortfolioContent {
  profile: Profile;
  projects: Project[];
  journey: JourneyEntry[];
  technologies: Technology[];
  school: SchoolExperience[];
  tracks: MusicTrack[];
}
