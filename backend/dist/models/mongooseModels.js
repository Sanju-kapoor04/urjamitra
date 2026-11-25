"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.MongoDisputeLetter = exports.MongoTariff = exports.MongoBill = exports.MongoUser = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const UserSchema = new mongoose_1.Schema({
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
exports.MongoUser = mongoose_1.default.model('User', UserSchema);
const BillSchema = new mongoose_1.Schema({
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
exports.MongoBill = mongoose_1.default.model('Bill', BillSchema);
const TariffSchema = new mongoose_1.Schema({
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
exports.MongoTariff = mongoose_1.default.model('Tariff', TariffSchema);
const DisputeLetterSchema = new mongoose_1.Schema({
    userId: { type: String, required: true, index: true },
    billId: { type: String, required: true },
    language: { type: String, default: 'en' },
    subject: { type: String, required: true },
    content: { type: String, required: true },
    disputeReason: { type: String, required: true },
    status: { type: String, default: 'draft' },
    createdAt: { type: Date, default: Date.now }
});
exports.MongoDisputeLetter = mongoose_1.default.model('DisputeLetter', DisputeLetterSchema);
