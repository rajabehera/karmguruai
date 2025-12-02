
export enum View {
  LANDING = 'LANDING',
  AUTH = 'AUTH',
  ONBOARDING = 'ONBOARDING',
  DASHBOARD = 'DASHBOARD',
  MOCK_INTERVIEW = 'MOCK_INTERVIEW',
  REVERSE_INTERVIEW = 'REVERSE_INTERVIEW',
  EXAM_PREP = 'EXAM_PREP',
  SKILL_DEV = 'SKILL_DEV',
  CODE_LAB = 'CODE_LAB',
  APTITUDE = 'APTITUDE',
  ENGLISH_COACH = 'ENGLISH_COACH',
  RESUME_BUILDER = 'RESUME_BUILDER',
  JOB_SEARCH = 'JOB_SEARCH',
  PRICING = 'PRICING',
  PROFILE = 'PROFILE',
  LEADERBOARD = 'LEADERBOARD',
  BLOG = 'BLOG',
  CAREERS = 'CAREERS',
  PRIVACY = 'PRIVACY',
  TERMS = 'TERMS',
  ADMIN = 'ADMIN',
  FORUM = 'FORUM',
  ANALYTICS = 'ANALYTICS',
  NOTIFICATIONS = 'NOTIFICATIONS'
}

export enum InterviewMode {
  VOICE = 'VOICE',
  MCQ = 'MCQ',
  DESCRIPTIVE = 'DESCRIPTIVE'
}

export type InterviewCategory = 'Warm Up' | 'Non Technical' | 'Coding' | 'Programming' | 'Role Related' | 'Technical' | 'Behavioral' | 'HR';

export type PlanType = 'FREE' | 'PRO' | 'ELITE';

export interface Resume {
  id: string;
  name: string;
  textContent: string;
  uploadedAt: string;
  isActive: boolean;
}

export interface ActivityItem {
  id: string;
  type: 'INTERVIEW' | 'CODE' | 'EXAM' | 'RESUME';
  title: string;
  desc: string;
  date: string;
  score?: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR';
  timestamp: string;
  read: boolean;
  link?: View;
}

export interface UserStats {
  streak: number;
  totalXp: number;
  interviewsCompleted: number;
  problemsSolved: number;
  testsTaken: number;
  avgTestScore: number;
  skills: {
    technical: number;
    communication: number;
    problemSolving: number;
  };
  recentActivity: ActivityItem[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  plan: PlanType;
  credits: {
    interviews: number; // -1 for unlimited
    aiAnalysis: number;
  };
  xp: number;
  joinedDate: string;
  onboarded: boolean;
  resumes: Resume[];
  stats: UserStats;
  notifications: Notification[];
  country?: string; 
  avatar?: string;
  coverImage?: string;
  role?: 'USER' | 'ADMIN';
}

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  name: string;
  xp: number;
  country: string;
  trend: 'UP' | 'DOWN' | 'SAME';
  avatar?: string;
  isCurrentUser?: boolean;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: any; // Lucide icon
  tier: 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM' | 'DIAMOND';
  requirement: string;
  progress: number; // 0 to 100
  isUnlocked: boolean;
  xpReward: number;
  redirectView?: View;
}

export interface Quest {
  id: string;
  title: string;
  xp: number;
  isCompleted: boolean;
  progress: number;
  total: number;
  redirectView?: View;
}

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  matchScore: number;
  matchReason: string;
  skills: string[];
  logo?: any;
}

export interface RoadmapStep {
  title: string;
  description: string;
  duration: string;
  skills: string[];
}

export interface ExamCategory {
  id: string;
  title: string;
  icon: any; 
  desc: string;
  color: string;
}

export interface Skill {
  name: string;
  level: number;
  category: string;
}

export interface InterviewConfig {
  role: string;
  subRole: string;
  techStack: string[];
  tools: string[];
  experience: string;
  company: string;
  mode: InterviewMode;
  category: InterviewCategory;
  resumeContext?: string;
}

export interface InterviewReport {
  overallScore: number;
  duration: string;
  metrics: {
    confidence: number;
    clarity: number;
    technicalAccuracy: number;
  };
  feedback: string;
  strengths: string[];
  improvements: string[];
  transcript?: { speaker: string; text: string; timestamp: string }[];
}

// Gemini Types
export interface MCQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  type?: 'MCQ' | 'TRUE_FALSE';
  explanation?: string;
}

export interface ExamQuestion extends MCQuestion {
  id: string;
  subject: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  userAnswer?: number;
  isMarked?: boolean;
}

export interface TestCase {
  input: string;
  expectedOutput: string;
}

export interface CodeProblem {
  id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  description: string;
  starterCode?: string;
  tag: string;
  testCasesList?: TestCase[];
  isCustom?: boolean;
}

export interface CodeRunResult {
  output: string;
  error?: string;
  analysis: string;
  testResults?: {
    input: string;
    expected: string;
    actual: string;
    passed: boolean;
  }[];
}

export interface CareerPathRecommendation {
  title: string;
  matchScore: number;
  description: string;
  requiredSkills: string[];
  steps: string[];
}

export interface RoleplayAnalysis {
  fluencyScore: number;
  accuracyScore: number;
  feedback: string;
  improvements: string[];
}

// Resume Types
export interface ResumeData {
  fullName: string;
  email: string;
  phone: string;
  role: string;
  summary: string;
  skills: string[];
  experience: {
    id: string;
    company: string;
    position: string;
    duration: string;
    description: string;
  }[];
  education: {
    id: string;
    school: string;
    degree: string;
    year: string;
  }[];
}

// NEW INTERFACES
export interface ForumPost {
  id: string;
  authorId: string;
  authorName: string;
  title: string;
  content: string;
  tags: string[];
  upvotes: number;
  comments: number;
  createdAt: string;
  isSolved: boolean;
}

export interface AnalyticsData {
  xpGrowth: { date: string; xp: number }[];
  skillRadar: { subject: string; A: number; fullMark: number }[];
  interviewPerformance: { id: number; score: number; date: string }[];
}

export interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  revenue: number;
  interviewsConducted: number;
}
