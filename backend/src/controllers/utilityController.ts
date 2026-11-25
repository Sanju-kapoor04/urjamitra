import { Request, Response } from 'express';
import axios from 'axios';
import { db } from '../database.js';
import { AuthRequest } from '../middleware/auth.js';

const AI_SERVICE_URL = (process.env.AI_SERVICE_URL || 'http://127.0.0.1:8001').replace(/\/+$/, '');

function round2(num: number) {
  return Math.round((num + Number.EPSILON) * 100) / 100;
}

export const aiChat = async (req: AuthRequest, res: Response) => {
  const { message, language } = req.body;
  const latestBill = db.prepare('SELECT * FROM bills WHERE user_id = ? ORDER BY created_at DESC LIMIT 1').get(req.user.id);

  try {
    const aiRes = await axios.post(`${AI_SERVICE_URL}/ai-assistant-chat`, {
      message,
      language: language || 'en',
      current_bill: latestBill
    });
    res.json(aiRes.data);
  } catch (err) {
    res.json({
      reply: `UrjaMitra AI: Analyzed your request. Regarding your electricity consumption (${(latestBill as any)?.units_consumed || 230} units), keep usage below 300 units to stay out of the maximum tariff tier.`,
      language: language || 'en',
      assistant: 'UrjaMitra AI'
    });
  }
};

export const generateDisputeLetter = (req: AuthRequest, res: Response) => {
  const { billId, reason, language } = req.body;
  const user: any = db.prepare('SELECT * FROM users WHERE id = ?').get(req.user.id);
  const bill: any = db.prepare('SELECT * FROM bills WHERE id = ? AND user_id = ?').get(billId, req.user.id);

  if (!bill) return res.status(404).json({ error: 'Bill not found' });

  const isHindi = language === 'hi';
  const disputeId = `disp_${Date.now()}`;
  let subject = '';
  let content = '';

  if (isHindi) {
    subject = `विद्युत बिल विसंगति एवं मीटर जांच हेतु औपचारिक आवेदन – उपभोक्ता सं: ${bill.consumer_number || 'N/A'}`;
    content = `सेवा में,\nसहायक यंत्री / कार्यपालन यंत्री,\n${bill.provider_name}\n\nविषय: बिल क्रमांक ${bill.bill_number || 'N/A'} में अत्यधिक खपत / विसंगति हेतु शिकायत\n\nमहोदय,\nसादर निवेदन है कि मैं, ${user.full_name}, ${user.city}, ${user.state} का निवासी हूँ। मेरा उपभोक्ता क्रमांक ${bill.consumer_number || 'N/A'} है।\n\nहाल ही में प्राप्त बिल में बिलिंग अवधि ${bill.billing_period || 'वर्तमान चक्र'} के दौरान कुल खपत ${bill.units_consumed} यूनिट्स एवं कुल देय राशि ₹${bill.net_payable_amount} अंकित की गई है।\nयह राशि एवं उपभोग मेरे सामान्य ऐतिहासिक उपयोग से अत्यधिक अधिक है।\n\nविसंगति का कारण: ${reason || 'मीटर रीडिंग में अचानक अनुचित वृद्धि एवं फिक्स्ड चार्ज में बदलाव'}\n\nअतः आपसे विनम्र निवेदन है कि:\n1. संबंधित परिसर के विद्युत मीटर की तकनीकी जांच एवं सटीकता (Accuracy Test) कराई जाए।\n2. इस माह के बिल का पुनर्मूल्यांकन (Provisional revision) करते हुए संशोधित बिल जारी किया जाए।\n\nसंलग्नक: वर्तमान बिल की प्रति एवं UrjaMitra AI विसंगति विश्लेषण रिपोर्ट।\n\nभवदीय,\n${user.full_name}\nमोबाइल: ${user.mobile_number}\nदिनांक: ${new Date().toLocaleDateString('en-GB')}`;
  } else {
    subject = `Formal Dispute & Clarification for Utility Bill – Consumer No: ${bill.consumer_number || 'N/A'}`;
    content = `To,\nThe Assistant Engineer / Billing Officer,\n${bill.provider_name}\n\nSubject: Request for Meter Reading Verification & Billing Adjustment – Bill No: ${bill.bill_number || 'N/A'}\n\nRespected Sir/Madam,\n\nI am writing to formally raise a dispute regarding the utility bill issued for consumer number ${bill.consumer_number || 'N/A'} in the name of ${user.full_name}.\n\nThe recent billing cycle reflects a total consumption of ${bill.units_consumed} units resulting in a net payable amount of ₹${bill.net_payable_amount}. This represents an unprecedented surge compared to historical consumption records on this connection.\n\nDisputed Observation:\n${reason || 'Significant discrepancy in recorded meter reading units and unexplained variation in fixed/additional charges.'}\n\nAs a bona fide consumer, I request your office to:\n1. Conduct an on-site meter accuracy check / inspection for any physical or calibration defects.\n2. Provide a detailed itemized breakdown of energy charges, fuel surcharges (FPPCA), and fixed charges for this cycle.\n3. Issue an amended or provisional bill until the discrepancy is formally resolved.\n\nEnclosed: Copy of bill and UrjaMitra AI Anomaly Audit Sheet.\n\nSincerely,\n${user.full_name}\nContact: ${user.mobile_number}\nDate: ${new Date().toLocaleDateString('en-GB')}`;
  }

  db.prepare(`
    INSERT INTO dispute_letters (id, user_id, bill_id, language, subject, content, dispute_reason)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(disputeId, user.id, bill.id, language || 'en', subject, content, reason || 'Billing Surge');

  res.status(201).json({
    id: disputeId,
    subject,
    content,
    bill
  });
};

export const getDisputes = (req: AuthRequest, res: Response) => {
  const disputes = db.prepare('SELECT * FROM dispute_letters WHERE user_id = ? ORDER BY created_at DESC').all(req.user.id);
  res.json({ disputes });
};

export const getTariffs = (req: Request, res: Response) => {
  const tariffs = db.prepare('SELECT * FROM tariffs').all();
  res.json({ tariffs });
};

export const calculateSavings = async (req: Request, res: Response) => {
  try {
    const aiRes = await axios.post(`${AI_SERVICE_URL}/calculate-savings`, req.body);
    res.json(aiRes.data);
  } catch (err: any) {
    const cur = parseFloat(req.body.current_units || '250');
    const prop = parseFloat(req.body.proposed_units || '190');
    const diff = Math.max(0, cur - prop);
    const savings = round2(diff * 6.45);
    res.json({
      current_units: cur,
      proposed_units: prop,
      units_saved: diff,
      current_bill_estimate: round2(cur * 6.2 + 85),
      proposed_bill_estimate: round2(prop * 5.5 + 85),
      estimated_monthly_savings: savings,
      estimated_annual_savings: round2(savings * 12),
      marginal_unit_rate: 6.45,
      tips: [
        'Reducing peak consumption below the 300 unit threshold provides substantial tiered savings.',
        'UrjaMitra Smart Advisor recommends solar rooftop integration for year-round utility containment.'
      ]
    });
  }
};

export const getNotifications = (req: AuthRequest, res: Response) => {
  const notifs = db.prepare('SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC').all(req.user.id);
  res.json({ notifications: notifs });
};

export const markNotificationRead = (req: AuthRequest, res: Response) => {
  db.prepare('UPDATE notifications SET is_read = 1 WHERE id = ? AND user_id = ?').run(req.params.id, req.user.id);
  res.json({ success: true });
};
