export interface CarouselImage {
  id: string;
  url: string;
  title: string;
  subtitle: string;
}

export interface StatItem {
  value: string;
  label: string;
  iconName: string;
}

export interface FeatureItem {
  title: string;
  description: string;
  linkText: string;
  iconName: string;
  badge?: string;
}

export interface TabContent {
  id: string;
  tabLabel: string;
  tag: string;
  title: string;
  description: string;
  confidenceScore: string;
  confidenceLabel: string;
  guaranteeText: string;
}

export interface StepItem {
  number: string;
  title: string;
  description: string;
  iconName: string;
  isCompleted?: boolean;
}

export interface TestimonialItem {
  quote: string;
  name: string;
  university: string;
  initials: string;
  rating: number;
}
