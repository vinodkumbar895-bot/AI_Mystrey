export const evidenceTypes = ['chat', 'image', 'cctv', 'witness_statement', 'security_log', 'document', 'forensic_report', 'audio_transcript', 'timeline_event'] as const;
export type EvidenceType = typeof evidenceTypes[number];
export type Difficulty = 'easy' | 'medium' | 'hard';

export interface Suspect {
  id: string; name: string; age?: number; occupation: string; background: string;
  relationship: string; motive: string; alibi: string; personality: string; portraitAssetId?: string;
}
export interface Evidence {
  id: string; title: string; type: EvidenceType; description: string;
  content: Record<string, unknown>; source: string; timestamp?: string;
  associatedSuspectIds: string[]; relevanceExplanation: string; assetUrl?: string; thumbnailUrl?: string;
}
export interface TimelineEvent {
  id: string; timestamp: string; description: string; involvedSuspectIds: string[]; evidenceIds: string[];
}
export interface MysteryPublicData {
  title: string; category: string; difficulty: Difficulty; briefing: string;
  incidentDescription: string; suspects: Suspect[]; evidence: Evidence[]; timeline: TimelineEvent[];
  createdAt: string;
}
export interface HiddenSolution {
  culpritSuspectId: string; motive: string; method: string; opportunity: string; explanation: string;
  decisiveEvidenceIds: string[]; suspectContradictions: { suspectId: string; contradiction: string; supportingEvidenceIds: string[] }[];
  hints: string[];
}
export interface CaseGenerationInput {
  scenario: string; title?: string; category: string; difficulty: Difficulty;
  suspectCount: number; evidenceCount: number; tone?: string;
}

