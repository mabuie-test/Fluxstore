import { Report } from '../models/Report.js';
import { assertAuthenticated, requireRole } from '../utils/authMiddleware.js';
import { notificationService } from '../services/notificationService.js';
import { auditService } from '../services/auditService.js';

export const createReport = [assertAuthenticated, async (req, res) => {
  const { targetType, targetId, reason, context, severity, attachments } = req.body;
  const report = await Report.create({
    reporter: req.user.id,
    targetType,
    targetId,
    reason,
    context,
    severity,
    attachments
  });
  await notificationService.broadcastRole('admin', {
    title: 'Nova denúncia',
    message: `Nova denúncia ${report.id} sobre ${targetType}.`,
    type: 'report',
    actionUrl: `/admin/reports/${report.id}`,
    meta: { reportId: report.id, targetType }
  });
  await auditService.log({
    actor: req.user.id,
    role: req.user.role,
    action: 'report_created',
    targetType,
    targetId: targetId?.toString(),
    description: 'Denúncia registrada',
    metadata: { severity }
  });
  res.status(201).json(report);
}];

export const listReports = [requireRole('admin'), async (req, res) => {
  const { status, severity } = req.query;
  const filters = {};
  if (status) filters.status = status;
  if (severity) filters.severity = severity;
  const reports = await Report.find(filters).sort({ createdAt: -1 });
  res.json(reports);
}];

export const updateReport = [requireRole('admin'), async (req, res) => {
  const { status, resolutionNote, adminTags, assignedTo } = req.body;
  const updated = await Report.findByIdAndUpdate(
    req.params.id,
    { status, resolutionNote, adminTags, assignedTo },
    { new: true }
  );
  if (!updated) return res.status(404).json({ message: 'Report not found' });
  await notificationService.notify({
    userId: updated.reporter,
    type: 'report',
    title: 'Denúncia atualizada',
    message: `Sua denúncia ${updated.id} foi marcada como ${status}.`,
    actionUrl: `/reports/${updated.id}`,
    meta: { status }
  });
  await auditService.log({
    actor: req.user.id,
    role: req.user.role,
    action: 'report_updated',
    targetType: updated.targetType,
    targetId: updated.targetId?.toString(),
    description: 'Denúncia revisada por admin',
    metadata: { status }
  });
  res.json(updated);
}];
