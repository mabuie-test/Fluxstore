import { AuditLog } from '../models/AuditLog.js';

export const auditService = {
  async log({ actor, role, action, targetType, targetId, description, metadata }) {
    return AuditLog.create({ actor, role, action, targetType, targetId, description, metadata });
  },

  async list(filters = {}) {
    const query = {};
    if (filters.action) query.action = filters.action;
    if (filters.targetType) query.targetType = filters.targetType;
    if (filters.role) query.role = filters.role;
    return AuditLog.find(query).sort({ createdAt: -1 }).limit(filters.limit || 200);
  }
};
