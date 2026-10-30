import mongoose, { Schema } from 'mongoose';

export interface InvestigationDocument extends mongoose.Document {
  caseId: mongoose.Types.ObjectId;
  sessionId: string;
  status: 'in_progress' | 'completed' | 'expired';
  reviewedEvidenceIds: string[];
  hintsUsed: number;
  accusation: { suspectId: string; reasoning?: string; submittedAt: Date } | null;
  result: { correct: boolean; score: number; accusationPoints: number; evidencePoints: number; hintPoints: number; completedAt: Date } | null;
  createdAt: Date;
  updatedAt: Date;
}

const investigationSchema = new Schema<InvestigationDocument>({
  caseId: { type: Schema.Types.ObjectId, ref: 'Case', required: true, index: true },
  sessionId: { type: String, required: true, index: true },
  status: { type: String, enum: ['in_progress', 'completed', 'expired'], default: 'in_progress', index: true },
  reviewedEvidenceIds: { type: [String], default: [] },
  hintsUsed: { type: Number, default: 0, min: 0, max: 3 },
  accusation: { type: Schema.Types.Mixed, default: null },
  result: { type: Schema.Types.Mixed, default: null }
}, { timestamps: true });

investigationSchema.index({ caseId: 1, sessionId: 1 }, { unique: true });
investigationSchema.index({ createdAt: 1 });
export const InvestigationModel = mongoose.model<InvestigationDocument>('Investigation', investigationSchema);

