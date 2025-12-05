import { mpesaClient } from './mpesaClient.js';

const PLATFORM_FEE = 0.1;
const DISPUTE_HOLD = 0.15;

class PaymentService {
  calculateSplit(amount) {
    const platformShare = amount * PLATFORM_FEE;
    const pendingRelease = amount * DISPUTE_HOLD;
    const sellerShare = amount - platformShare - pendingRelease;
    return { sellerShare, platformShare, pendingRelease };
  }

  async chargeBuyer({ amount, buyerId }) {
    const reference = `ORDER-${buyerId}-${Date.now()}`;
    const response = await mpesaClient.c2bPayment({ amount, msisdn: 'buyer-msisdn', reference });
    return { transactionId: response.transactionId, reference };
  }

  async releaseToSeller(order) {
    const { sellerShare, pendingRelease } = order.payment.split;
    const payout = sellerShare + pendingRelease;
    return mpesaClient.b2cPayment({ amount: payout, msisdn: 'seller-msisdn', remarks: `PAYOUT-${order.id}` });
  }

  async refundBuyer(order) {
    return mpesaClient.b2cPayment({ amount: order.total, msisdn: 'buyer-msisdn', remarks: `REFUND-${order.id}` });
  }

  async holdEscrow(order) {
    return {
      holdId: `HOLD-${order.id}-${Date.now()}`,
      amount: order.payment.split.pendingRelease
    };
  }
}

export const paymentService = new PaymentService();
