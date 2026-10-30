import { Router } from 'express';
import mongoose from 'mongoose';
import { z } from 'zod';
import { CaseModel } from '../models/Case.js';
import { InvestigationModel } from '../models/Investigation.js';
import type { InvestigationDocument } from '../models/Investigation.js';
import { HttpError, asyncRoute } from '../middleware/errors.js';
import { createCase, findPublicCase } from '../services/case.service.js';
import { calculateScore } from '../services/scoring.service.js';
import type { Evidence } from '../types/domain.js';

export const api = Router();
const envelope = (data: unknown) => ({ success: true, data, error: null });
const caseInputSchema = z.object({
  scenario: z.string().trim().min(30, 'Scenario must contain at least 30 characters.').max(2000, 'Scenario must be 2,000 characters or fewer.'),
  title: z.string().trim().max(100).optional(),
  category: z.enum(['theft', 'missing_object', 'disappearance', 'workplace', 'museum', 'locked_room', 'cyber', 'general']).default('general'),
  difficulty: z.enum(['easy', 'medium', 'hard']).default('medium'),
  suspectCount: z.number().int().min(3).max(6).default(4),
  evidenceCount: z.number().int().min(4).max(12).default(8),
  tone: z.string().trim().max(100).optional()
});
const objectId = (value: string) => mongoose.isValidObjectId(value);
const toPublicEvidence = ({ id, title, type, description, content, source, timestamp, associatedSuspectIds, assetUrl, thumbnailUrl }: Evidence) => ({
  id, title, type, description, content, source, timestamp, associatedSuspectIds, assetUrl, thumbnailUrl
});

api.get('/health', (_req, res) => res.json(envelope({ status: 'ok' })));

api.post('/cases', asyncRoute(async (req, res) => {
  const parsed = caseInputSchema.safeParse(req.body);
  if (!parsed.success) throw new HttpError(400, 'VALIDATION_ERROR', 'Please correct the mystery details and try again.', parsed.error.issues.map((issue) => ({ field: issue.path.join('.'), message: issue.message })));
  const created = await createCase(parsed.data);
  res.status(201).json(envelope({ caseId: created.id, status: 'ready', title: created.publicData.title, investigationUrl: `/cases/${created.id}` }));
}));

api.get('/cases/:caseId', asyncRoute(async (req, res) => {
  const data = await findPublicCase(req.params.caseId);
  if (!data) throw new HttpError(404, 'CASE_NOT_FOUND', 'This mystery could not be found.');
  const investigation = await InvestigationModel.findOne({ caseId: req.params.caseId, sessionId: req.guestSessionId }).select('status reviewedEvidenceIds hintsUsed').lean();
  const publicCase = data.publicData;
  res.json(envelope({
    caseId: req.params.caseId, title: publicCase.title, category: publicCase.category, difficulty: publicCase.difficulty,
    briefing: publicCase.briefing, incidentDescription: publicCase.incidentDescription, suspects: publicCase.suspects,
    evidence: publicCase.evidence.map(({ id, title, type, description, source, timestamp, associatedSuspectIds, thumbnailUrl }) => ({ id, title, type, description, source, timestamp, associatedSuspectIds, thumbnailUrl })),
    timeline: publicCase.timeline.map(({ id, timestamp, description, involvedSuspectIds, evidenceIds }) => ({ id, timestamp, description, involvedSuspectIds, evidenceIds })),
    progress: investigation ? { status: investigation.status, reviewedEvidenceIds: investigation.reviewedEvidenceIds, hintsUsed: investigation.hintsUsed, investigationId: String(investigation._id) } : null
  }));
}));

api.get('/cases/:caseId/evidence/search', asyncRoute(async (req, res) => {
  const query = z.string().trim().min(2).max(100).safeParse(req.query.q);
  if (!query.success) throw new HttpError(400, 'VALIDATION_ERROR', 'Enter at least two characters to search evidence.');
  const data = await findPublicCase(req.params.caseId);
  if (!data) throw new HttpError(404, 'CASE_NOT_FOUND', 'This mystery could not be found.');
  const needle = query.data.toLocaleLowerCase();
  const evidenceIds = data.publicData.evidence.filter((item) =>
    `${item.title} ${item.description} ${item.source} ${JSON.stringify(item.content)}`.toLocaleLowerCase().includes(needle)
  ).map((item) => item.id);
  res.json(envelope({ evidenceIds }));
}));

api.get('/cases/:caseId/evidence/:evidenceId', asyncRoute(async (req, res) => {
  const data = await findPublicCase(req.params.caseId);
  if (!data) throw new HttpError(404, 'CASE_NOT_FOUND', 'This mystery could not be found.');
  const evidence = data.publicData.evidence.find((item) => item.id === req.params.evidenceId);
  if (!evidence) throw new HttpError(404, 'EVIDENCE_NOT_FOUND', 'This evidence item could not be found.');
  res.json(envelope(toPublicEvidence(evidence)));
}));

api.post('/cases/:caseId/investigations', asyncRoute(async (req, res) => {
  if (!objectId(req.params.caseId)) throw new HttpError(404, 'CASE_NOT_FOUND', 'This mystery could not be found.');
  const caseDoc = await CaseModel.findOne({ _id: req.params.caseId, generationStatus: 'ready' }).select('_id').lean();
  if (!caseDoc) throw new HttpError(404, 'CASE_NOT_FOUND', 'This mystery could not be found.');
  let investigation: InvestigationDocument | null;
  try {
    investigation = await InvestigationModel.findOneAndUpdate(
      { caseId: caseDoc._id, sessionId: req.guestSessionId },
      { $setOnInsert: { caseId: caseDoc._id, sessionId: req.guestSessionId, status: 'in_progress', reviewedEvidenceIds: [], hintsUsed: 0, accusation: null, result: null } },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
  } catch (error) {
    if (!(typeof error === 'object' && error !== null && 'code' in error && error.code === 11000)) throw error;
    investigation = await InvestigationModel.findOne({ caseId: caseDoc._id, sessionId: req.guestSessionId });
    if (!investigation) throw error;
  }
  if (!investigation) throw new HttpError(500, 'INVESTIGATION_CREATE_FAILED', 'The investigation could not be started. Please try again.');
  res.status(201).json(envelope({ investigationId: investigation.id, status: investigation.status }));
}));

api.post('/investigations/:investigationId/evidence/:evidenceId/review', asyncRoute(async (req, res) => {
  if (!objectId(req.params.investigationId)) throw new HttpError(404, 'INVESTIGATION_NOT_FOUND', 'Investigation not found.');
  const investigation = await InvestigationModel.findOne({ _id: req.params.investigationId, sessionId: req.guestSessionId });
  if (!investigation) throw new HttpError(404, 'INVESTIGATION_NOT_FOUND', 'Investigation not found.');
  if (investigation.status !== 'in_progress') throw new HttpError(409, 'INVESTIGATION_COMPLETED', 'This investigation is complete.');
  const caseDoc = await CaseModel.findById(investigation.caseId).select('publicData');
  if (!caseDoc?.publicData.evidence.some((item) => item.id === req.params.evidenceId)) throw new HttpError(404, 'EVIDENCE_NOT_FOUND', 'This evidence item could not be found.');
  const updated = await InvestigationModel.findOneAndUpdate({ _id: investigation.id, status: 'in_progress' }, { $addToSet: { reviewedEvidenceIds: req.params.evidenceId } }, { new: true }).select('reviewedEvidenceIds');
  if (!updated) throw new HttpError(409, 'INVESTIGATION_COMPLETED', 'This investigation is complete.');
  res.json(envelope({ reviewedEvidenceIds: updated?.reviewedEvidenceIds ?? [], reviewedCount: updated?.reviewedEvidenceIds.length ?? 0 }));
}));

api.post('/investigations/:investigationId/hints', asyncRoute(async (req, res) => {
  const parsed = z.object({ level: z.number().int().min(1).max(3) }).safeParse(req.body);
  if (!parsed.success) throw new HttpError(400, 'VALIDATION_ERROR', 'Choose a hint level from 1 to 3.');
  if (!objectId(req.params.investigationId)) throw new HttpError(404, 'INVESTIGATION_NOT_FOUND', 'Investigation not found.');
  const investigation = await InvestigationModel.findOne({ _id: req.params.investigationId, sessionId: req.guestSessionId });
  if (!investigation) throw new HttpError(404, 'INVESTIGATION_NOT_FOUND', 'Investigation not found.');
  if (investigation.status !== 'in_progress') throw new HttpError(409, 'INVESTIGATION_COMPLETED', 'This investigation is complete.');
  const level = parsed.data.level;
  if (level !== investigation.hintsUsed + 1) throw new HttpError(409, 'HINT_ORDER', `Request hint ${investigation.hintsUsed + 1} next.`);
  const caseDoc = await CaseModel.findById(investigation.caseId).select('+hiddenSolution');
  if (!caseDoc) throw new HttpError(404, 'CASE_NOT_FOUND', 'This mystery could not be found.');
  const changed = await InvestigationModel.findOneAndUpdate({ _id: investigation.id, status: 'in_progress', hintsUsed: level - 1 }, { $inc: { hintsUsed: 1 } }, { new: true });
  if (!changed) throw new HttpError(409, 'HINT_ALREADY_USED', 'That hint request was already processed.');
  res.json(envelope({ level, hint: caseDoc.hiddenSolution.hints[level - 1], hintsUsed: changed.hintsUsed }));
}));

const accusationSchema = z.object({ suspectId: z.string().min(1).max(80), reasoning: z.string().trim().max(1000).optional() });
api.post('/investigations/:investigationId/accusation', asyncRoute(async (req, res) => {
  const parsed = accusationSchema.safeParse(req.body);
  if (!parsed.success) throw new HttpError(400, 'VALIDATION_ERROR', 'Select a suspect before making your accusation.');
  if (!objectId(req.params.investigationId)) throw new HttpError(404, 'INVESTIGATION_NOT_FOUND', 'Investigation not found.');
  const investigation = await InvestigationModel.findOne({ _id: req.params.investigationId, sessionId: req.guestSessionId });
  if (!investigation) throw new HttpError(404, 'INVESTIGATION_NOT_FOUND', 'Investigation not found.');
  if (investigation.status === 'completed' && investigation.result) return res.json(envelope(await resultPayload(investigation, true)));
  if (investigation.status !== 'in_progress') throw new HttpError(409, 'INVESTIGATION_COMPLETED', 'This investigation is complete.');
  const caseDoc = await CaseModel.findById(investigation.caseId).select('+hiddenSolution');
  if (!caseDoc) throw new HttpError(404, 'CASE_NOT_FOUND', 'This mystery could not be found.');
  if (!caseDoc.publicData.suspects.some((item) => item.id === parsed.data.suspectId)) throw new HttpError(400, 'INVALID_SUSPECT', 'Choose a suspect listed in this case.');
  const correct = parsed.data.suspectId === caseDoc.hiddenSolution.culpritSuspectId;
  const score = calculateScore(correct, investigation.reviewedEvidenceIds.length, caseDoc.publicData.evidence.length, investigation.hintsUsed);
  const completedAt = new Date();
  const saved = await InvestigationModel.findOneAndUpdate(
    { _id: investigation.id, sessionId: req.guestSessionId, status: 'in_progress', accusation: null },
    { $set: { status: 'completed', accusation: { ...parsed.data, submittedAt: completedAt }, result: { correct, ...score, completedAt } } },
    { new: true }
  );
  if (!saved) {
    const current = await InvestigationModel.findOne({ _id: investigation.id, sessionId: req.guestSessionId });
    if (current?.status === 'completed' && current.result) return res.json(envelope(await resultPayload(current, true)));
    throw new HttpError(409, 'ACCUSATION_ALREADY_SUBMITTED', 'A final accusation has already been submitted.');
  }
  res.json(envelope(await resultPayload(saved, true)));
}));

api.get('/investigations/:investigationId/result', asyncRoute(async (req, res) => {
  if (!objectId(req.params.investigationId)) throw new HttpError(404, 'INVESTIGATION_NOT_FOUND', 'Investigation not found.');
  const investigation = await InvestigationModel.findOne({ _id: req.params.investigationId, sessionId: req.guestSessionId });
  if (!investigation) throw new HttpError(404, 'INVESTIGATION_NOT_FOUND', 'Investigation not found.');
  if (investigation.status !== 'completed' || !investigation.result) throw new HttpError(409, 'RESULT_NOT_READY', 'Submit your final accusation to see the result.');
  res.json(envelope(await resultPayload(investigation, true)));
}));

async function resultPayload(investigation: InvestigationDocument, reveal: boolean) {
  const caseDoc = await CaseModel.findById(investigation.caseId).select('+hiddenSolution');
  if (!caseDoc || !investigation.result || !investigation.accusation) throw new HttpError(404, 'RESULT_NOT_FOUND', 'The investigation result could not be found.');
  const solution = caseDoc.hiddenSolution;
  const suspects = caseDoc.publicData.suspects;
  return {
    investigationId: investigation.id, caseTitle: caseDoc.publicData.title, status: investigation.status,
    correct: investigation.result.correct,
    selectedSuspect: suspects.find((person) => person.id === investigation.accusation!.suspectId),
    actualCulprit: reveal ? suspects.find((person) => person.id === solution.culpritSuspectId) : undefined,
    score: investigation.result.score,
    scoreBreakdown: { accusation: investigation.result.accusationPoints, evidence: investigation.result.evidencePoints, hints: investigation.result.hintPoints },
    reviewedCount: investigation.reviewedEvidenceIds.length, evidenceCount: caseDoc.publicData.evidence.length, hintsUsed: investigation.hintsUsed,
    explanation: reveal ? solution.explanation : undefined,
    motive: reveal ? solution.motive : undefined, method: reveal ? solution.method : undefined, opportunity: reveal ? solution.opportunity : undefined,
    decisiveEvidence: reveal ? caseDoc.publicData.evidence.filter((item) => solution.decisiveEvidenceIds.includes(item.id)).map(toPublicEvidence) : undefined,
    suspectContradictions: reveal ? solution.suspectContradictions.map((entry) => ({
      suspect: suspects.find((person) => person.id === entry.suspectId)?.name ?? 'A suspect',
      contradiction: entry.contradiction,
      supportingEvidence: entry.supportingEvidenceIds.map((id) => caseDoc.publicData.evidence.find((item) => item.id === id)?.title).filter(Boolean)
    })) : undefined,
    timeline: reveal ? caseDoc.publicData.timeline : undefined
  };
}

