import axios from 'axios';
import { env } from '../config/env.js';

class MpesaClient {
  constructor() {
    this.config = env.mpesa;
  }

  async authenticate() {
    // In a real implementation fetch OAuth token from M-Pesa
    return 'sandbox-token';
  }

  async c2bPayment({ amount, msisdn, reference }) {
    const token = await this.authenticate();
    const payload = {
      ShortCode: this.config.shortcode,
      Amount: amount,
      Msisdn: msisdn,
      BillRefNumber: reference
    };
    await axios.post(`${this.config.baseUrl}/mpesa/c2b/v1/simulate`, payload, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return { transactionId: reference };
  }

  async b2cPayment({ amount, msisdn, remarks }) {
    const token = await this.authenticate();
    const payload = {
      InitiatorName: this.config.initiatorName,
      SecurityCredential: this.config.initiatorPassword,
      CommandID: 'BusinessPayment',
      Amount: amount,
      PartyA: this.config.shortcode,
      PartyB: msisdn,
      Remarks: remarks
    };
    await axios.post(`${this.config.baseUrl}/mpesa/b2c/v1/paymentrequest`, payload, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return { payoutId: remarks };
  }
}

export const mpesaClient = new MpesaClient();
