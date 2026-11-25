import mongoose, { Schema, Document } from 'mongoose';

// 1. User Schema
export interface IUser extends Document {
  fullName: string;
  email: string;
  mobileNumber: string;
  passwordHash: string;
  state: string;
  city: string;
  pinCode: string;
  role: 'user' | 'admin';
  createdAt: Date;
}

const UserSchema = new Schema<IUser>({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  mobileNumber: { type: String, required: true },
  passwordHash: { type: String, required: true },
  state: { type: String, default: 'Madhya Pradesh' },
  city: { type: String, default: 'Bhopal' },
  pinCode: { type: String, default: '462001' },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  createdAt: { type: Date, default: Date.now }
});

export const MongoUser = mongoose.model<IUser>('User', UserSchema);

// 2. Bill Schema
export interface IBill extends Document {
  userId: string;
  utilityType: 'electricity' | 'water' | 'internet';
  providerName: string;
  consumerNumber?: string;
  billNumber?: string;
  meterNumber?: string;
  billingPeriod?: string;
  previousReading?: number;
  currentReading?: number;
  unitsConsumed: number;
  billingDays: number;
  energyCharges?: number;
  fixedCharges?: number;
  taxesAndDuties?: number;
  additionalCharges?: number;
  fppcaCharges?: number;
  arrears?: number;
  subsidies?: number;
  rebates?: number;
  netPayableAmount: number;
  dueDate?: string;
  billDate?: string;
  filePath?: string;
  confidenceScore: number;
  verificationStatus: string;
  createdAt: Date;
}

const BillSchema = new Schema<IBill>({
  userId: { type: String, required: true, index: true },
  utilityType: { type: String, enum: ['electricity', 'water', 'internet'], default: 'electricity' },
  providerName: { type: String, required: true },
  consumerNumber: { type: String },
  billNumber: { type: String },
  meterNumber: { type: String },
  billingPeriod: { type: String },
  previousReading: { type: Number },
  currentReading: { type: Number },
  unitsConsumed: { type: Number, required: true },
  billingDays: { type: Number, default: 30 },
  energyCharges: { type: Number },
  fixedCharges: { type: Number },
  taxesAndDuties: { type: Number },
  additionalCharges: { type: Number, default: 0 },
  fppcaCharges: { type: Number, default: 0 },
  arrears: { type: Number, default: 0 },
  subsidies: { type: Number, default: 0 },
  rebates: { type: Number, default: 0 },
  netPayableAmount: { type: Number, required: true },
  dueDate: { type: String },
  billDate: { type: String },
  filePath: { type: String },
  confidenceScore: { type: Number, default: 0.85 },
  verificationStatus: { type: String, default: 'verified' },
  createdAt: { type: Date, default: Date.now }
});

export const MongoBill = mongoose.model<IBill>('Bill', BillSchema);

// 3. Tariff Schema
export interface ITariff extends Document {
  state: string;
  discom: string;
  category: 'domestic' | 'commercial';
  connectionType: string;
  slabs: Array<{
    minUnits: number;
    maxUnits: number | null;
    ratePerUnit: number;
  }>;
  fixedCharge: number;
  dutyPercent: number;
  effectiveDate: string;
  sourceReference: string;
  verified: boolean;
}

const TariffSchema = new Schema<ITariff>({
  state: { type: String, required: true },
  discom: { type: String, required: true },
  category: { type: String, enum: ['domestic', 'commercial'], default: 'domestic' },
  connectionType: { type: String, default: 'LT-1 Domestic' },
  slabs: [{
    minUnits: Number,
    maxUnits: Number,
    ratePerUnit: Number
  }],
  fixedCharge: { type: Number, default: 85.0 },
  dutyPercent: { type: Number, default: 9.0 },
  effectiveDate: { type: String },
  sourceReference: { type: String },
  verified: { type: Boolean, default: true }
});

export const MongoTariff = mongoose.model<ITariff>('Tariff', TariffSchema);

// 4. Dispute Letter Schema
export interface IDisputeLetter extends Document {
  userId: string;
  billId: string;
  language: string;
  subject: string;
  content: string;
  disputeReason: string;
  status: string;
  createdAt: Date;
}

const DisputeLetterSchema = new Schema<IDisputeLetter>({
  userId: { type: String, required: true, index: true },
  billId: { type: String, required: true },
  language: { type: String, default: 'en' },
  subject: { type: String, required: true },
  content: { type: String, required: true },
  disputeReason: { type: String, required: true },
  status: { type: String, default: 'draft' },
  createdAt: { type: Date, default: Date.now }
});

export const MongoDisputeLetter = mongoose.model<IDisputeLetter>('DisputeLetter', DisputeLetterSchema);
