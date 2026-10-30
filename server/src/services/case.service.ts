import mongoose from 'mongoose';
import { randomInt, randomUUID } from 'node:crypto';
import { env } from '../config/env.js';
import { CaseModel } from '../models/Case.js';
import type { CaseGenerationInput, MysteryPublicData } from '../types/domain.js';
import { generateMystery } from './gemini.service.js';

export const createCase = async (input: CaseGenerationInput) => {
  if (input.suspectCount > env.MAX_SUSPECTS || input.evidenceCount > env.MAX_EVIDENCE_ITEMS) {
    const error = new Error('Choose a supported number of suspects and evidence items.'); Object.assign(error, { status: 400, code: 'VALIDATION_ERROR' }); throw error;
  }
  const generated = await generateMystery(input);
  const suspectIds = new Map(generated.suspects.map((item) => [item.id, `sus_${randomUUID()}`]));
  const evidenceIds = new Map(generated.evidence.map((item) => [item.id, `ev_${randomUUID()}`]));
  const timelineIds = new Map(generated.timeline.map((item) => [item.id, `tl_${randomUUID()}`]));
  const suspects = generated.suspects.map((item) => ({ ...item, id: suspectIds.get(item.id)! }));
  const evidence = generated.evidence.map((item) => ({
    ...item,
    id: evidenceIds.get(item.id)!,
    associatedSuspectIds: item.associatedSuspectIds.map((id) => suspectIds.get(id)!)
  }));
  const timeline = generated.timeline.map((item) => ({
    ...item,
    id: timelineIds.get(item.id)!,
    involvedSuspectIds: item.involvedSuspectIds.map((id) => suspectIds.get(id)!),
    evidenceIds: item.evidenceIds.map((id) => evidenceIds.get(id)!)
  }));
  const hiddenSolution = {
    ...generated.solution,
    culpritSuspectId: suspectIds.get(generated.solution.culpritSuspectId)!,
    decisiveEvidenceIds: generated.solution.decisiveEvidenceIds.map((id) => evidenceIds.get(id)!),
    suspectContradictions: generated.solution.suspectContradictions.map((item) => ({
      ...item,
      suspectId: suspectIds.get(item.suspectId)!,
      supportingEvidenceIds: item.supportingEvidenceIds.map((id) => evidenceIds.get(id)!)
    }))
  };
  const shuffle = <T,>(items: T[]): T[] => {
    const copy = [...items];
    for (let index = copy.length - 1; index > 0; index -= 1) {
      const other = randomInt(index + 1); [copy[index], copy[other]] = [copy[other]!, copy[index]!];
    }
    return copy;
  };
  const publicData: MysteryPublicData = {
    title: input.title || generated.title,
    category: input.category,
    difficulty: input.difficulty,
    briefing: generated.briefing,
    incidentDescription: generated.incidentDescription,
    suspects: shuffle(suspects),
    evidence: shuffle(evidence),
    timeline,
    createdAt: new Date().toISOString()
  };
  const created = await CaseModel.create({ publicData, hiddenSolution, originalScenario: input.scenario, generationStatus: 'ready', schemaVersion: 1 });
  return created;
};

export async function findPublicCase(caseId: string) {
  if (!mongoose.isValidObjectId(caseId)) return null;
  return CaseModel.findOne({ _id: caseId, generationStatus: 'ready' }).select('publicData').lean();
}

