import { z } from 'zod';
import { evidenceTypes } from '../types/domain.js';

const id = z.string().min(1).max(80);
const suspectSchema = z.object({
  id, name: z.string().min(2).max(80), age: z.number().int().min(18).max(110).optional(),
  occupation: z.string().min(2).max(120), background: z.string().min(20).max(700),
  relationship: z.string().min(5).max(300), motive: z.string().min(5).max(400),
  alibi: z.string().min(5).max(500), personality: z.string().min(5).max(250), portraitAssetId: id.optional()
});
const evidenceSchema = z.object({
  id, title: z.string().min(3).max(120), type: z.enum(evidenceTypes),
  description: z.string().min(10).max(500), content: z.record(z.unknown()),
  source: z.string().min(2).max(160), timestamp: z.string().datetime().optional(),
  associatedSuspectIds: z.array(id), relevanceExplanation: z.string().min(10).max(700),
  assetUrl: z.string().url().optional(), thumbnailUrl: z.string().url().optional()
});
const timelineSchema = z.object({ id, timestamp: z.string().datetime(), description: z.string().min(8).max(500), involvedSuspectIds: z.array(id), evidenceIds: z.array(id) });

export const generatedMysterySchema = z.object({
  title: z.string().min(3).max(120), briefing: z.string().min(50).max(1800),
  incidentDescription: z.string().min(30).max(1000),
  suspects: z.array(suspectSchema).min(3).max(6),
  evidence: z.array(evidenceSchema).min(4).max(12),
  timeline: z.array(timelineSchema).min(3).max(20),
  solution: z.object({
    culpritSuspectId: id, motive: z.string().min(10).max(500), method: z.string().min(10).max(600),
    opportunity: z.string().min(10).max(500), explanation: z.string().min(50).max(2500),
    decisiveEvidenceIds: z.array(id).min(2),
    suspectContradictions: z.array(z.object({ suspectId: id, contradiction: z.string().min(10).max(500), supportingEvidenceIds: z.array(id).min(1) })),
    hints: z.array(z.string().min(8).max(300)).length(3)
  })
});

export function validateMysteryReferences(data: z.infer<typeof generatedMysterySchema>): string[] {
  const issues: string[] = [];
  const suspectIds = data.suspects.map((suspect) => suspect.id);
  const evidenceIds = data.evidence.map((item) => item.id);
  const timelineIds = data.timeline.map((event) => event.id);
  if (new Set(suspectIds).size !== suspectIds.length) issues.push('Suspect IDs must be unique.');
  if (new Set(evidenceIds).size !== evidenceIds.length) issues.push('Evidence IDs must be unique.');
  if (new Set(timelineIds).size !== timelineIds.length) issues.push('Timeline event IDs must be unique.');
  if (!suspectIds.includes(data.solution.culpritSuspectId)) issues.push('Culprit must reference an existing suspect.');
  const culprit = data.suspects.find((suspect) => suspect.id === data.solution.culpritSuspectId);
  const suspectSet = new Set(suspectIds); const evidenceSet = new Set(evidenceIds);
  for (const item of data.evidence) if (item.associatedSuspectIds.some((ref) => !suspectSet.has(ref))) issues.push(`Evidence ${item.id} references an unknown suspect.`);
  for (const event of data.timeline) {
    if (event.involvedSuspectIds.some((ref) => !suspectSet.has(ref))) issues.push(`Timeline ${event.id} references an unknown suspect.`);
    if (event.evidenceIds.some((ref) => !evidenceSet.has(ref))) issues.push(`Timeline ${event.id} references unknown evidence.`);
  }
  const solution = data.solution;
  if (solution.decisiveEvidenceIds.some((ref) => !evidenceSet.has(ref))) issues.push('Solution references unknown evidence.');
  if (!solution.decisiveEvidenceIds.every((ref) => data.evidence.some((item) => item.id === ref && item.associatedSuspectIds.includes(solution.culpritSuspectId)))) issues.push('Decisive evidence must be associated with the culprit.');
  if (solution.suspectContradictions.some((item) => !suspectSet.has(item.suspectId) || item.supportingEvidenceIds.some((ref) => !evidenceSet.has(ref)))) issues.push('A suspect contradiction contains an unknown reference.');
  if (culprit && solution.hints.some((hint) => hint.toLocaleLowerCase().includes(culprit.name.toLocaleLowerCase()))) issues.push('Hints must not name the culprit.');
  if (data.timeline.some((event, index) => index > 0 && Date.parse(data.timeline[index - 1]!.timestamp) > Date.parse(event.timestamp))) issues.push('Timeline must be chronological.');
  return issues;
}

