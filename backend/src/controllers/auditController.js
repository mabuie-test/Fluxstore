import { auditService } from '../services/auditService.js';
import { requireRole } from '../utils/authMiddleware.js';

export const listAuditLogs = [requireRole('admin'), async (req, res) => {
  const filters = {
    action: req.query.action,
    targetType: req.query.targetType,
    role: req.query.role,
    limit: Number(req.query.limit) || 200
  };
  const logs = await auditService.list(filters);
  res.json(logs);
}];
