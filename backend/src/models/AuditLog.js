import mongoose from 'mongoose';

const auditLogSchema = new mongoose.Schema(
  {
    actor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    role: { type: String, enum: ['buyer', 'seller', 'admin'] },
    action: String,
    targetType: String,
    targetId: String,
    description: String,
    metadata: mongoose.Schema.Types.Mixed
  },
  { timestamps: true }
);

export const AuditLog = mongoose.model('AuditLog', auditLogSchema);
