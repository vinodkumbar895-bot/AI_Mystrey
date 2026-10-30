export type EvidenceType = 'chat' | 'image' | 'cctv' | 'witness_statement' | 'security_log' | 'document' | 'forensic_report' | 'audio_transcript' | 'timeline_event';
export interface Suspect {
  id: string; name: string; age?: number; occupation: string; background: string; relationship: string;
  motive: string; alibi: string; personality: string; portraitAssetId?: string;
}
export interface Evidence {
  id: string; title: string; type: EvidenceType; description: string; source: string; timestamp?: string;
  associatedSuspectIds: string[]; thumbnailUrl?: string; content?: Record<string, unknown>;
}
export interface CaseData {
  caseId: string; title: string; category: string; difficulty: 'easy' | 'medium' | 'hard'; briefing: string;
  incidentDescription: string; suspects: Suspect[]; evidence: Evidence[];
  timeline: { id: string; timestamp: string; description: string; involvedSuspectIds: string[]; evidenceIds: string[] }[];
  progress: { status: string; reviewedEvidenceIds: string[]; hintsUsed: number; investigationId?: string } | null;
}
export interface ResultData {
  investigationId: string; caseTitle: string; status: string; correct: boolean; selectedSuspect: Suspect; actualCulprit: Suspect;
  score: number; scoreBreakdown: { accusation: number; evidence: number; hints: number };
  reviewedCount: number; evidenceCount: number; hintsUsed: number; explanation: string; motive: string;
  method: string; opportunity: string; decisiveEvidence: Evidence[];
  suspectContradictions: { suspect: string; contradiction: string; supportingEvidence: string[] }[];
  timeline: { id: string; timestamp: string; description: string; involvedSuspectIds: string[]; evidenceIds: string[] }[];
}

