export interface TechItem {
  name: string;
  color: string;
  icon: string;
  description: string;
  category: 'frontend' | 'backend' | 'database' | 'devops' | 'learning';
  link: string;
}
