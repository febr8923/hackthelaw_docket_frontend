
import React from 'react';
import { PracticeArea, PodcastApp, DigestSummary } from './types';
import { BriefcaseIcon, TagIcon, CalendarDaysIcon, EnvelopeIcon, MicrophoneIcon, CheckCircleIcon, ArrowRightIcon, PencilIcon, XMarkIcon, InformationCircleIcon, RssIcon, BuildingOffice2Icon, UserCircleIcon, Cog6ToothIcon, BellIcon, EyeIcon } from './components/icons/HeroIcons';


export const APP_NAME = "The Docket";

export const PRACTICE_AREAS: PracticeArea[] = [
  { id: 'corporate', name: 'Corporate Law' },
  { id: 'litigation', name: 'Litigation & Dispute Resolution' },
  { id: 'ip', name: 'Intellectual Property & Technology' },
  { id: 'real_estate', name: 'Real Estate Law' },
  { id: 'family', name: 'Family Law' },
  { id: 'criminal', name: 'Criminal Defense' },
  { id: 'environmental', name: 'Environmental & Energy Law' },
  { id: 'bankruptcy', name: 'Bankruptcy & Restructuring' },
  { id: 'healthcare', name: 'Healthcare Law' },
  { id: 'immigration', name: 'Immigration Law' },
  { id: 'employment', name: 'Labor & Employment Law' },
  { id: 'tax', name: 'Tax Law' },
  { id: 'estate_planning', name: 'Estate Planning & Probate' },
  { id: 'international', name: 'International Law' },
  { id: 'ai_law', name: 'AI & Emerging Technologies Law' },
];

// NOTE: External image URLs for podcast icons might not perfectly fit a new theme.
// Consider hosting themed versions or using SVG icons if precise control is needed.
export const PODCAST_APPS_LIST: PodcastApp[] = [
    { id: 'apple', name: 'Apple Podcasts', icon: React.createElement('img', { src: 'https://developer.apple.com/assets/elements/icons/podcasts/podcasts-128x128_2x.png', alt: 'Apple Podcasts', className: 'w-6 h-6 inline mr-2 rounded' }) },
    { id: 'spotify', name: 'Spotify', icon: React.createElement('img', { src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/Spotify_logo_without_text.svg/1024px-Spotify_logo_without_text.svg.png', alt: 'Spotify', className: 'w-6 h-6 inline mr-2 rounded' }) },
    { id: 'google', name: 'Google Podcasts', icon: React.createElement('img', { src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Google_Podcasts_icon.svg/1200px-Google_Podcasts_icon.svg.png', alt: 'Google Podcasts', className: 'w-6 h-6 inline mr-2 rounded' }) },
    { id: 'overcast', name: 'Overcast', icon: React.createElement('img', { src: 'https://seeklogo.com/images/O/overcast-logo-B631779541-seeklogo.com.png', alt: 'Overcast', className: 'w-6 h-6 inline mr-2 rounded' }) },
    { id: 'pocketcasts', name: 'Pocket Casts', icon: React.createElement('img', { src: 'https://seeklogo.com/images/P/pocket-casts-logo-50567026F8-seeklogo.com.png', alt: 'Pocket Casts', className: 'w-6 h-6 inline mr-2 rounded' }) },
];

export const MOCK_PAST_DIGESTS: DigestSummary[] = [
  { id: '1', date: 'July 15, 2024', title: 'Weekly Digest: AI in Contract Review - Emerging Trends', contentPreview: "An analysis of recent court rulings and their impact on AI-driven contract analysis tools..." },
  { id: '2', date: 'July 8, 2024', title: 'Bi-Weekly Special: Navigating New Data Privacy Laws in the EU', contentPreview: "Key considerations for multinational corporations regarding GDPR updates and new directives..." },
  { id: '3', date: 'July 1, 2024', title: 'Industry Insight: The Rise of ESG Litigation', contentPreview: "Exploring the increasing frequency and complexity of ESG-related lawsuits against major firms..." },
  { id: '4', date: 'June 24, 2024', title: 'Weekly Digest: Intellectual Property Challenges in the Metaverse', contentPreview: "A look at trademark and copyright issues arising from virtual goods and digital identities..." },
];

export const UI_ACCENT_COLOR_CLASS = "primaryAccent"; // primaryAccent is #f29fe4 (pinkish)
export const UI_SECONDARY_ACCENT_COLOR_CLASS = "secondaryAccent"; // secondaryAccent is #3e00ff (blue/purple)

// Buttons: Primary uses primaryAccent (pink), Secondary uses secondaryAccent (blue)
export const UI_BUTTON_PRIMARY_BG = `bg-primaryAccent-700 hover:bg-primaryAccent-800`; // Darker pink for good contrast with white text
export const UI_BUTTON_PRIMARY_TEXT = `text-white`;
export const UI_BUTTON_SECONDARY_BG = `bg-secondaryAccent-600 hover:bg-secondaryAccent-700`; // Blue for secondary
export const UI_BUTTON_SECONDARY_TEXT = `text-white`;

// Focus ring uses primary accent
export const UI_FOCUS_RING = `focus:ring-primaryAccent-500`;
// General text accent uses primary accent
export const UI_TEXT_ACCENT = `text-primaryAccent-600`; // e.g. #ea80cf
// Border accent uses primary accent
export const UI_BORDER_ACCENT = `border-primaryAccent-500`;


export const ICONS = {
  BRIEFCASE: BriefcaseIcon,
  TAG: TagIcon,
  CALENDAR_DAYS: CalendarDaysIcon,
  ENVELOPE: EnvelopeIcon,
  MICROPHONE: MicrophoneIcon,
  CHECK_CIRCLE: CheckCircleIcon,
  ARROW_RIGHT: ArrowRightIcon,
  PENCIL: PencilIcon,
  X_MARK: XMarkIcon,
  INFORMATION_CIRCLE: InformationCircleIcon,
  RSS: RssIcon,
  BUILDING_OFFICE_2: BuildingOffice2Icon,
  USER_CIRCLE: UserCircleIcon,
  COG_6_TOOTH: Cog6ToothIcon,
  BELL: BellIcon,
  EYE: EyeIcon,
};
