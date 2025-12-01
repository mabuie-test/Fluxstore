import { SellerApplication } from '../models/SellerApplication.js';
import { User } from '../models/User.js';

export const submitSellerApplication = async (req, res) => {
  const { storeName, category, description, mpesaNumber, website, documents } = req.body;
  const existing = await SellerApplication.findOne({ user: req.user.id });
  if (existing) {
    return res.status(200).json(existing);
  }

  const application = await SellerApplication.create({
    user: req.user.id,
    storeName,
    category,
    description,
    mpesaNumber,
    website,
    documents,
    history: [{ status: 'pending', note: 'Submetido com taxa anual de 50 MZN' }]
  });

  res.status(201).json(application);
};

export const getMySellerApplication = async (req, res) => {
  const application = await SellerApplication.findOne({ user: req.user.id });
  if (!application) return res.status(404).json({ message: 'Nenhuma candidatura encontrada' });
  res.json(application);
};

export const listSellerApplications = async (_req, res) => {
  const applications = await SellerApplication.find().populate('user', 'name email role status');
  res.json(applications);
};

export const reviewSellerApplication = async (req, res) => {
  const { id } = req.params;
  const { status, note, feeStatus, paymentReference } = req.body;
  const application = await SellerApplication.findById(id);
  if (!application) return res.status(404).json({ message: 'Candidatura não encontrada' });

  if (status) application.status = status;
  if (feeStatus) application.feeStatus = feeStatus;
  if (paymentReference) application.paymentReference = paymentReference;
  if (note) application.notes = note;
  application.reviewedBy = req.user.id;
  application.history.push({ status: application.status, note: note || '' });
  await application.save();

  if (status === 'approved') {
    const seller = await User.findById(application.user);
    if (seller) {
      seller.role = 'seller';
      seller.sellerProfile = {
        ...(seller.sellerProfile?.toObject ? seller.sellerProfile.toObject() : seller.sellerProfile),
        storeName: application.storeName,
        payoutMpesaNumber: application.mpesaNumber,
        verificationStage: 'approved'
      };
      seller.accountTags = Array.from(new Set([...(seller.accountTags || []), 'seller-approved']));
      await seller.save();
    }
  }

  res.json(application);
};
