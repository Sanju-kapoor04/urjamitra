"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
exports.initDb = initDb;
const better_sqlite3_1 = __importDefault(require("better-sqlite3"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const dataDir = path_1.default.resolve(__dirname, '../../data');
if (!fs_1.default.existsSync(dataDir)) {
    fs_1.default.mkdirSync(dataDir, { recursive: true });
}
const dbPath = path_1.default.join(dataDir, 'urjamitra.db');
exports.db = new better_sqlite3_1.default(dbPath);
exports.db.pragma('journal_mode = WAL');
function initDb() {
    exports.db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      full_name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      mobile_number TEXT NOT NULL,
      password_hash TEXT NOT NULL,
      state TEXT NOT NULL,
      city TEXT NOT NULL,
      pin_code TEXT NOT NULL,
      role TEXT DEFAULT 'user',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS bills (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      utility_type TEXT NOT NULL, -- electricity, water, internet
      provider_name TEXT NOT NULL,
      consumer_number TEXT,
      bill_number TEXT,
      meter_number TEXT,
      billing_period TEXT,
      previous_reading REAL,
      current_reading REAL,
      units_consumed REAL,
      billing_days INTEGER DEFAULT 30,
      energy_charges REAL,
      fixed_charges REAL,
      taxes_and_duties REAL,
      additional_charges REAL DEFAULT 0,
      fppca_charges REAL DEFAULT 0,
      arrears REAL DEFAULT 0,
      subsidies REAL DEFAULT 0,
      rebates REAL DEFAULT 0,
      net_payable_amount REAL NOT NULL,
      due_date TEXT,
      bill_date TEXT,
      file_path TEXT,
      confidence_score REAL DEFAULT 0.85,
      verification_status TEXT DEFAULT 'verified',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS tariffs (
      id TEXT PRIMARY KEY,
      state TEXT NOT NULL,
      discom TEXT NOT NULL,
      category TEXT NOT NULL, -- domestic, commercial
      connection_type TEXT DEFAULT 'LT-Domestic',
      slab_json TEXT NOT NULL,
      fixed_charge REAL NOT NULL,
      duty_percent REAL DEFAULT 9.0,
      effective_date TEXT,
      source_reference TEXT,
      verified INTEGER DEFAULT 1
    );

    CREATE TABLE IF NOT EXISTS dispute_letters (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      bill_id TEXT NOT NULL,
      language TEXT DEFAULT 'en',
      subject TEXT NOT NULL,
      content TEXT NOT NULL,
      dispute_reason TEXT NOT NULL,
      status TEXT DEFAULT 'draft',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (bill_id) REFERENCES bills(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS notifications (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      title TEXT NOT NULL,
      message TEXT NOT NULL,
      type TEXT DEFAULT 'info', -- alert, warning, info, success
      is_read INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
  `);
    // Seed sample admin & user if not exists
    const existingUser = exports.db.prepare('SELECT id FROM users WHERE email = ?').get('demo@urjamitra.in');
    if (!existingUser) {
        const salt = bcryptjs_1.default.genSaltSync(10);
        const hash = bcryptjs_1.default.hashSync('UrjaMitra@2026', salt);
        exports.db.prepare(`
      INSERT INTO users (id, full_name, email, mobile_number, password_hash, state, city, pin_code, role)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run('usr_demo_01', 'Arjun Sharma', 'demo@urjamitra.in', '+919876543210', hash, 'Madhya Pradesh', 'Bhopal', '462001', 'user');
        // Seed realistic sample bills for MP and Delhi
        seedSampleBills('usr_demo_01');
    }
    // Seed standard tariffs
    const existingTariff = exports.db.prepare('SELECT id FROM tariffs WHERE id = ?').get('trf_mp_dom');
    if (!existingTariff) {
        const mpSlabs = JSON.stringify([
            { min_units: 0, max_units: 50, rate_per_unit: 4.15 },
            { min_units: 51, max_units: 150, rate_per_unit: 5.05 },
            { min_units: 151, max_units: 300, rate_per_unit: 6.45 },
            { min_units: 301, max_units: null, rate_per_unit: 7.10 }
        ]);
        exports.db.prepare(`
      INSERT INTO tariffs (id, state, discom, category, connection_type, slab_json, fixed_charge, duty_percent, effective_date, source_reference)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run('trf_mp_dom', 'Madhya Pradesh', 'MPMKVVCL', 'domestic', 'LT-1 Domestic Single Phase', mpSlabs, 85.0, 9.0, '2026-04-01', 'MPERC Retail Tariff Order FY26');
    }
}
function seedSampleBills(userId) {
    const insertBill = exports.db.prepare(`
    INSERT INTO bills (
      id, user_id, utility_type, provider_name, consumer_number, bill_number, meter_number,
      billing_period, previous_reading, current_reading, units_consumed, billing_days,
      energy_charges, fixed_charges, taxes_and_duties, fppca_charges, net_payable_amount,
      due_date, bill_date, confidence_score
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
    const samples = [
        {
            id: 'bill_oct_2026',
            period: '01/09/2026 - 30/09/2026',
            prev: 4120,
            curr: 4330,
            units: 210,
            energy: 1184.50,
            fixed: 85.0,
            tax: 106.60,
            fppca: 42.0,
            amount: 1418.10,
            due: '15/10/2026',
            date: '02/10/2026'
        },
        {
            id: 'bill_nov_2026',
            period: '01/10/2026 - 31/10/2026',
            prev: 4330,
            curr: 4565,
            units: 235,
            energy: 1345.75,
            fixed: 85.0,
            tax: 121.10,
            fppca: 47.0,
            amount: 1598.85,
            due: '15/11/2026',
            date: '02/11/2026'
        },
        {
            id: 'bill_dec_2026',
            period: '01/11/2026 - 30/11/2026',
            prev: 4565,
            curr: 4895,
            units: 330, // Spike in units to trigger anomaly
            energy: 2045.00,
            fixed: 110.0, // Slight hike in fixed charge
            tax: 184.05,
            fppca: 82.50,
            amount: 2421.55,
            due: '15/12/2026',
            date: '02/12/2026'
        }
    ];
    for (const s of samples) {
        insertBill.run(s.id, userId, 'electricity', 'MP Madhya Kshetra Vidyut Vitaran Company (MPMKVVCL)', '1029384756', `INV-${s.id.toUpperCase()}`, 'MPM-994821', s.period, s.prev, s.curr, s.units, 30, s.energy, s.fixed, s.tax, s.fppca, s.amount, s.due, s.date, 0.95);
    }
    // Insert initial notification
    exports.db.prepare(`
    INSERT INTO notifications (id, user_id, title, message, type)
    VALUES (?, ?, ?, ?, ?)
  `).run('notif_welcome', userId, 'Welcome to UrjaMitra', 'Your Smart Utility Companion is ready. You have 3 verified historical bills analyzed with AI anomaly detection.', 'success');
}
