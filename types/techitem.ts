export interface TechItem {
    name: string;
    color: string;
    icon: React.ElementType;
    description: string;
    category: 'frontend' | 'backend' | 'learning' | 'database' | 'devops';
    link?: string;
}