import mongoose, { Schema } from 'mongoose';
import type { HiddenSolution, MysteryPublicData } from '../types/domain.js';

export interface CaseDocument extends mongoose.Document {
  publicData: MysteryPublicData;
  hiddenSolution: HiddenSolution;
  originalScenario: string;
  generationStatus: 'ready' | 'failed';
  schemaVersion: number;
  createdAt: Date;
  updatedAt: Date;
}

const caseSchema = new Schema<CaseDocument>({
  publicData: { type: Schema.Types.Mixed, required: true },
  hiddenSolution: { type: Schema.Types.Mixed, required: true, select: false },
  originalScenario: { type: String, required: true, maxlength: 2000 },
  generationStatus: { type: String, enum: ['ready', 'failed'], required: true, index: true },
  schemaVersion: { type: Number, required: true, default: 1 }
}, { timestamps: true, strict: 'throw' });

export const CaseModel = mongoose.model<CaseDocument>('Case', caseSchema);

