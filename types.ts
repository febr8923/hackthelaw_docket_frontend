export interface AttorneyInfo {
  fullName: string;
  workEmail: string;
  lawFirm: string;
}

export interface FoundBio {
  name: string;
  practiceArea?: string;
}

export interface PracticeArea {
  id: string;
  name: string;
}

export enum DeliveryFrequency {
  WEEKLY = 'weekly',
  BI_WEEKLY = 'bi-weekly',
  CUSTOM = 'custom',
}

export enum DeliveryFormat {
  EMAIL = 'email',
  PODCAST = 'podcast',
}

export interface DeliveryPreferences {
  frequency: DeliveryFrequency;
  customSchedule: string; // Empty if not custom
  formats: DeliveryFormat[];
  podcastApps: string[]; // IDs of selected podcast apps
}

export interface UserProfile extends AttorneyInfo {
  practiceAreas: string[]; // array of practice area IDs
  additionalInterests: string[];
  categories: string;
  deliveryPreferences: DeliveryPreferences;
  enableHighVolatilityAlerts: boolean;
  alertDeliveryMethod: 'email' | 'in-app';
}

export enum OnboardingStep {
  Welcome,
  AttorneyInfo,
  RefineInterests,
  DeliveryPreferences,
  Confirmation,
}

export interface DigestSummary {
  id: string;
  date: string;
  title: string;
  contentPreview: string; // Short preview of content
}

export interface PodcastApp {
  id: string;
  name: string;
  icon: React.ReactNode; // Can be SVG path string or component
  rssFeedAction?: () => void; // Action for "Add to [App Name]"
}
