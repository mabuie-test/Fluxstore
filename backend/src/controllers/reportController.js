import { Report } from '../models/Report.js';
import { assertAuthenticated, requireRole } from '../utils/authMiddleware.js';

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
  res.json(updated);
}];
