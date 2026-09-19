import { CarouselImage, StatItem, FeatureItem, TabContent, StepItem, TestimonialItem } from './types';

export const CAROUSEL_IMAGES: CarouselImage[] = [
  {
    id: 'studying-group',
    url: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80',
    title: 'Collaborative Academic Excellence',
    subtitle: 'Students researching global endowment criteria',
  },
  {
    id: 'graduation-ceremony',
    url: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1200&q=80',
    title: 'Commencement & Debt-Free Graduation',
    subtitle: 'Over 150,000 students funded worldwide',
  },
  {
    id: 'university-campus',
    url: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1200&q=80',
    title: 'Tier-1 International Campuses',
    subtitle: 'Direct wire partnerships with 1,200+ universities',
  },
  {
    id: 'award-ceremony',
    url: 'https://images.unsplash.com/photo-1627556704290-2b1f5853ff78?auto=format&fit=crop&w=1200&q=80',
    title: 'Direct Bursar Grant Awards',
    subtitle: 'Merit and need-based fellowship allocations',
  },
  {
    id: 'student-laptop',
    url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80',
    title: 'Instant Autonomous Eligibility Verification',
    subtitle: 'Sub-second neural vector matching algorithm',
  },
];

export const STATS: StatItem[] = [
  {
    value: '10,000+',
    label: 'Scholarships Available',
    iconName: 'GraduationCap',
  },
  {
    value: '150,000+',
    label: 'Active Students',
    iconName: 'Users',
  },
  {
    value: '1,200+',
    label: 'Verified Global Providers',
    iconName: 'ShieldCheck',
  },
  {
    value: '98%',
    label: 'Match & Approval Rate',
    iconName: 'Percent',
  },
];

export const FEATURES: FeatureItem[] = [
  {
    title: 'AI Scholarship Recommendation',
    description:
      'Discover scholarships perfectly matched to your academic profile, GPA, background, and career aspirations.',
    linkText: 'Explore model →',
    iconName: 'Brain',
  },
  {
    title: 'Smart Eligibility Checker',
    description:
      'Know instantly whether you are eligible before applying, saving hundreds of hours of manual research.',
    linkText: 'Check qualifications →',
    iconName: 'ShieldCheck',
  },
  {
    title: 'Secure Document Verification',
    description:
      'Upload and verify transcripts, recommendation letters, and financial aids safely with end-to-end encryption.',
    linkText: 'Vault encryption →',
    iconName: 'FileCheck',
  },
  {
    title: 'Application Tracking',
    description:
      'Track every stage of your scholarship application in real-time with automated deadline alerts and status insights.',
    linkText: 'Real-time webhook →',
    iconName: 'Hourglass',
  },
];

export const TABS: TabContent[] = [
  {
    id: 'ai-rec',
    tabLabel: '1. AI Recommendations',
    tag: 'DEEP SEMANTIC PARSING',
    title: 'AI Recommendations (Deep semantic parsing)',
    description:
      'Our proprietary neural network digests your complete CV, research proposals, socio-economic factors, and ambitions to uncover tier-1 international endowments you qualify for with 99.4% alignment.',
    confidenceScore: '99.4% Match',
    confidenceLabel: 'Algorithmic Confidence',
    guaranteeText: 'Zero scam listings guaranteed by automated escrow validation.',
  },
  {
    id: 'verified',
    tabLabel: '2. Verified Scholarships',
    tag: 'INSTITUTIONAL ATTESTATION',
    title: 'Verified Scholarships (Sovereign Trust)',
    description:
      'Every endowment is backed by cryptographic trust verification with registered global bursars, ensuring zero ghost listings, phishing scams, or hidden application fees.',
    confidenceScore: '100% Verified',
    confidenceLabel: 'Registry Audit',
    guaranteeText: 'Direct institutional bursar deposit agreements active.',
  },
  {
    id: 'fast-app',
    tabLabel: '3. Fast Application',
    tag: 'UNIVERSAL COMMON SYNC',
    title: 'Fast Application (One-Click Submission)',
    description:
      'Auto-format essays, transfigure transcripts, and submit verified application dossiers across multiple institutional portals concurrently without repetitive manual data entry.',
    confidenceScore: '10x Faster',
    confidenceLabel: 'Friction Elimination',
    guaranteeText: 'Universal Common App standard compliance.',
  },
  {
    id: 'realtime-track',
    tabLabel: '4. Real-Time Tracking',
    tag: 'BIDIRECTIONAL WEBHOOKS',
    title: 'Real-Time Tracking (Live Telemetry)',
    description:
      'Follow your candidacy through admissions committee review, financial aid evaluation, and committee sign-off with granular sub-stage push telemetry and notifications.',
    confidenceScore: 'Live Sync',
    confidenceLabel: 'Telemetry Status',
    guaranteeText: 'Immediate SMS & email event notification protocols.',
  },
  {
    id: 'smart-notif',
    tabLabel: '5. Smart Notifications',
    tag: 'DEADLINE PREDICTIVE RADAR',
    title: 'Smart Notifications (Opportunity Alerts)',
    description:
      'Never miss a grant deadline. Our predictive dispatch algorithm surfaces upcoming bursar openings, renewal deadlines, and urgent fellowship windows ahead of time.',
    confidenceScore: '24/7 Radar',
    confidenceLabel: 'Deadline Engine',
    guaranteeText: 'Zero missed submission cutoffs across all enrolled tracks.',
  },
];

export const STEPS: StepItem[] = [
  {
    number: '01',
    title: 'Create Account',
    description: 'Quick SSO signup with institution email.',
    iconName: 'UserPlus',
    isCompleted: true,
  },
  {
    number: '02',
    title: 'Complete Profile',
    description: 'Input academic record, GPA, and goals.',
    iconName: 'FileText',
  },
  {
    number: '03',
    title: 'Discover Scholarships',
    description: 'Explore tailored global opportunities.',
    iconName: 'Compass',
  },
  {
    number: '04',
    title: 'AI Eligibility Check',
    description: 'Instant score on eligibility rules.',
    iconName: 'Sparkles',
  },
  {
    number: '05',
    title: 'Upload Documents',
    description: 'Encrypted transcripts & references.',
    iconName: 'Shield',
  },
  {
    number: '06',
    title: 'Apply with 1-Click',
    description: 'Universal common application sync.',
    iconName: 'Send',
  },
  {
    number: '07',
    title: 'Track Progress',
    description: 'Live portal status & webhook pings.',
    iconName: 'Activity',
  },
  {
    number: '08',
    title: 'Receive Funding',
    description: 'Grant wired directly to campus.',
    iconName: 'CheckCircle2',
  },
];

export const TESTIMONIALS: TestimonialItem[] = [
  {
    quote:
      '"ScholarBridge matched me with a $40,000 STEM grant in 48 hours that I never would have discovered on traditional portals."',
    name: 'Elena Rostova',
    university: 'Stanford University',
    initials: 'ER',
    rating: 5,
  },
  {
    quote:
      '"The eligibility checker prevented wasted effort on invalid applications and pinpointed the exact 5 funding sources I won."',
    name: 'Marcus Chen',
    university: 'MIT',
    initials: 'MC',
    rating: 5,
  },
  {
    quote:
      '"The secure document upload and verified provider guarantee gave me complete peace of mind."',
    name: 'Amara Okafor',
    university: 'Oxford University',
    initials: 'AO',
    rating: 5,
  },
];
