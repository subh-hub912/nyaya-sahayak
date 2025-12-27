
export type AppMode = 'SAHAYAK' | 'EXPERT' | 'DISPLAY';

export type Language = 'EN' | 'HI' | 'BN' | 'TE' | 'MR';

export interface GroundingChunk {
  web?: {
    uri: string;
    title: string;
  };
}

export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  citations?: Citation[];
  grounding?: GroundingChunk[];
}

export interface Citation {
  section: string;
  act: string;
  summary: string;
}

export interface MockResponse {
  keywords: string[];
  response: string;
  citations: Citation[];
}

export type LawyerSpecialization = 'Criminal' | 'Civil' | 'Family' | 'Property' | 'Corporate' | 'Cyber' | 'Bail Rules' | 'Domestic Violence' | 'Financial Fraud';

export interface Lawyer {
  id: string;
  name: string;
  specialization: LawyerSpecialization[];
  fee: number;
  wins: number;
  losses: number;
  rating: number;
  feedbackCount: number;
  image: string;
  isVerified: boolean;
  court: string;
}
