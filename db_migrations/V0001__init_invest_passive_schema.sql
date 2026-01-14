-- Таблица пользователей
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    telegram_id BIGINT UNIQUE NOT NULL,
    username VARCHAR(255),
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    referral_code VARCHAR(50) UNIQUE NOT NULL,
    referred_by INTEGER,
    balance DECIMAL(15, 2) DEFAULT 0,
    available_balance DECIMAL(15, 2) DEFAULT 0,
    total_invested DECIMAL(15, 2) DEFAULT 0,
    total_withdrawn DECIMAL(15, 2) DEFAULT 0,
    total_earned DECIMAL(15, 2) DEFAULT 0,
    referral_earnings DECIMAL(15, 2) DEFAULT 0,
    is_admin BOOLEAN DEFAULT FALSE,
    chat_bonus_claimed BOOLEAN DEFAULT FALSE,
    referral_bonus_claimed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_users_telegram_id ON users(telegram_id);
CREATE INDEX IF NOT EXISTS idx_users_referral_code ON users(referral_code);

-- Таблица депозитов
CREATE TABLE IF NOT EXISTS deposits (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    amount DECIMAL(15, 2) NOT NULL,
    rate DECIMAL(5, 2) DEFAULT 10.6,
    days_total INTEGER DEFAULT 30,
    days_elapsed INTEGER DEFAULT 0,
    earned DECIMAL(15, 2) DEFAULT 0,
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_deposits_user_id ON deposits(user_id);
CREATE INDEX IF NOT EXISTS idx_deposits_status ON deposits(status);

-- Таблица транзакций
CREATE TABLE IF NOT EXISTS transactions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    type VARCHAR(50) NOT NULL,
    amount DECIMAL(15, 2) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    card_number VARCHAR(19),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_type ON transactions(type);
CREATE INDEX IF NOT EXISTS idx_transactions_status ON transactions(status);

-- Таблица рефералов
CREATE TABLE IF NOT EXISTS referrals (
    id SERIAL PRIMARY KEY,
    referrer_id INTEGER NOT NULL,
    referred_id INTEGER NOT NULL,
    bonus_paid DECIMAL(15, 2) DEFAULT 0,
    total_deposits DECIMAL(15, 2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(referrer_id, referred_id)
);

CREATE INDEX IF NOT EXISTS idx_referrals_referrer_id ON referrals(referrer_id);
CREATE INDEX IF NOT EXISTS idx_referrals_referred_id ON referrals(referred_id);

-- Таблица настроек (для админ-панели)
CREATE TABLE IF NOT EXISTS settings (
    id SERIAL PRIMARY KEY,
    key VARCHAR(100) UNIQUE NOT NULL,
    value TEXT NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO settings (key, value) VALUES 
    ('payment_card', '2202 2063 4578 9012'),
    ('daily_rate', '10.6'),
    ('min_deposit', '100'),
    ('min_withdrawal', '100'),
    ('chat_bonus', '100'),
    ('referral_bonus_amount', '2000'),
    ('referral_bonus_target', '25'),
    ('referral_percent', '25')
ON CONFLICT (key) DO NOTHING;
