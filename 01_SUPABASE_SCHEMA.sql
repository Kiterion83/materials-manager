-- ============================================================
-- MATERIALS MANAGER - SCHEMA DATABASE COMPLETO
-- MAX STREICHER Edition
-- ============================================================
-- 
-- ISTRUZIONI:
-- 1. Vai su Supabase Dashboard → SQL Editor
-- 2. Copia e incolla TUTTO questo file
-- 3. Clicca "Run"
-- 4. Verifica che non ci siano errori
--
-- ============================================================

-- ============================================================
-- STEP 1: PULIZIA (se devi ricominciare da zero)
-- ============================================================
-- ATTENZIONE: Decommenta queste righe SOLO se vuoi cancellare tutto!
-- DROP TABLE IF EXISTS component_history CASCADE;
-- DROP TABLE IF EXISTS movements CASCADE;
-- DROP TABLE IF EXISTS log_requests CASCADE;
-- DROP TABLE IF EXISTS order_log CASCADE;
-- DROP TABLE IF EXISTS mir_items CASCADE;
-- DROP TABLE IF EXISTS mirs CASCADE;
-- DROP TABLE IF EXISTS request_components CASCADE;
-- DROP TABLE IF EXISTS requests CASCADE;
-- DROP TABLE IF EXISTS project_database CASCADE;
-- DROP TABLE IF EXISTS users CASCADE;
-- DROP TABLE IF EXISTS counters CASCADE;

-- ============================================================
-- STEP 2: TABELLA USERS (Utenti e Permessi)
-- ============================================================
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    badge_number VARCHAR(30),
    role VARCHAR(20) DEFAULT 'user',
    
    -- Permessi per schermata (none/read/modify)
    perm_dashboard VARCHAR(10) DEFAULT 'read',
    perm_requests VARCHAR(10) DEFAULT 'read',
    perm_wh_site VARCHAR(10) DEFAULT 'none',
    perm_wh_yard VARCHAR(10) DEFAULT 'none',
    perm_site_in VARCHAR(10) DEFAULT 'none',
    perm_engineering VARCHAR(10) DEFAULT 'none',
    perm_spare_parts VARCHAR(10) DEFAULT 'none',
    perm_management VARCHAR(10) DEFAULT 'none',
    perm_orders VARCHAR(10) DEFAULT 'none',
    perm_mir VARCHAR(10) DEFAULT 'none',
    perm_material_in VARCHAR(10) DEFAULT 'none',
    perm_test_pack VARCHAR(10) DEFAULT 'none',
    perm_log VARCHAR(10) DEFAULT 'read',
    perm_database VARCHAR(10) DEFAULT 'none',
    
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================
-- STEP 3: TABELLA PROJECT_DATABASE (Inventario Materiali)
-- ============================================================
CREATE TABLE IF NOT EXISTS project_database (
    id SERIAL PRIMARY KEY,
    
    -- Identificazione
    iso_number VARCHAR(50) NOT NULL,
    full_spool_number VARCHAR(60),
    ident_code VARCHAR(100) NOT NULL,
    tag VARCHAR(50),
    
    -- Descrizione
    description TEXT,
    diam1 VARCHAR(30),
    diam2 VARCHAR(30),
    uom VARCHAR(20) DEFAULT 'PCS',
    
    -- Quantità
    prj_qty INTEGER DEFAULT 0,
    withdrawn_qty INTEGER DEFAULT 0,
    qty_yard INTEGER DEFAULT 0,
    qty_site INTEGER DEFAULT 0,
    qty_to_collect INTEGER DEFAULT 0,
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    modified_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indici per performance
CREATE INDEX IF NOT EXISTS idx_pdb_iso ON project_database(iso_number);
CREATE INDEX IF NOT EXISTS idx_pdb_ident ON project_database(ident_code);
CREATE INDEX IF NOT EXISTS idx_pdb_tag ON project_database(tag) WHERE tag IS NOT NULL;

-- ============================================================
-- STEP 4: TABELLA REQUESTS (Testata Richieste)
-- ============================================================
CREATE TABLE IF NOT EXISTS requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    request_number INTEGER NOT NULL,
    sub_number INTEGER DEFAULT 0,
    
    -- Richiedente
    requester_user_id UUID REFERENCES users(id),
    
    -- Tipo Richiesta
    request_type VARCHAR(20) NOT NULL,
    sub_category VARCHAR(20),
    
    -- Test Pack
    test_pack_number VARCHAR(50),
    missing_type VARCHAR(20),
    
    -- Dati progetto
    iso_number VARCHAR(50),
    full_spool_number VARCHAR(60),
    hf_number VARCHAR(30),
    
    -- Descrizione
    description TEXT,
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(request_number, sub_number)
);

CREATE INDEX IF NOT EXISTS idx_req_number ON requests(request_number);
CREATE INDEX IF NOT EXISTS idx_req_type ON requests(request_type);

-- ============================================================
-- STEP 5: TABELLA REQUEST_COMPONENTS (Righe Richieste)
-- ============================================================
CREATE TABLE IF NOT EXISTS request_components (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    request_id UUID REFERENCES requests(id) ON DELETE CASCADE,
    
    -- Materiale
    ident_code VARCHAR(100) NOT NULL,
    tag VARCHAR(50),
    description TEXT,
    quantity INTEGER NOT NULL,
    
    -- Status workflow
    status VARCHAR(20) DEFAULT 'Site',
    
    -- Engineering Check
    has_eng_check BOOLEAN DEFAULT false,
    eng_check_message TEXT,
    eng_check_sent_to VARCHAR(20),
    eng_check_site_response VARCHAR(20),
    eng_check_yard_response VARCHAR(20),
    
    -- Note passaggio
    sent_to VARCHAR(20),
    passage_note TEXT,
    
    -- Engineering
    eng_note TEXT,
    
    -- Management
    mng_note TEXT,
    
    -- Orders
    order_type VARCHAR(20),
    order_date DATE,
    order_forecast DATE,
    
    -- Spare
    spare_request_date DATE,
    spare_forecast_date DATE,
    
    -- Location tracking
    current_location VARCHAR(20),
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    modified_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_comp_request ON request_components(request_id);
CREATE INDEX IF NOT EXISTS idx_comp_status ON request_components(status);
CREATE INDEX IF NOT EXISTS idx_comp_eng_check ON request_components(has_eng_check) WHERE has_eng_check = true;

-- ============================================================
-- STEP 6: TABELLA COMPONENT_HISTORY (Storico Passaggi)
-- ============================================================
CREATE TABLE IF NOT EXISTS component_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    component_id UUID REFERENCES request_components(id) ON DELETE CASCADE,
    
    action VARCHAR(100) NOT NULL,
    from_status VARCHAR(20),
    to_status VARCHAR(20),
    from_location VARCHAR(20),
    to_location VARCHAR(20),
    
    note TEXT,
    check_response VARCHAR(20),
    
    performed_by_user_id UUID REFERENCES users(id),
    performed_by_name VARCHAR(100),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_history_comp ON component_history(component_id);
CREATE INDEX IF NOT EXISTS idx_history_date ON component_history(created_at DESC);

-- ============================================================
-- STEP 7: TABELLA MOVEMENTS (Log Movimenti Inventario)
-- ============================================================
CREATE TABLE IF NOT EXISTS movements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    movement_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    type VARCHAR(10) NOT NULL,
    location VARCHAR(30) NOT NULL,
    
    ident_code VARCHAR(100) NOT NULL,
    tag VARCHAR(50),
    quantity INTEGER NOT NULL,
    
    note TEXT NOT NULL,
    
    balance_type VARCHAR(20),
    request_reference VARCHAR(30),
    mir_number VARCHAR(30),
    auto_generated BOOLEAN DEFAULT false,
    
    created_by_user_id UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_mov_date ON movements(movement_date DESC);
CREATE INDEX IF NOT EXISTS idx_mov_code ON movements(ident_code);

-- ============================================================
-- STEP 8: TABELLA LOG_REQUESTS (Log Richieste Chiuse)
-- ============================================================
CREATE TABLE IF NOT EXISTS log_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    request_number VARCHAR(30),
    request_type VARCHAR(20),
    requester_name VARCHAR(100),
    requester_badge VARCHAR(30),
    iso_number VARCHAR(50),
    full_spool_number VARCHAR(60),
    
    ident_code VARCHAR(100),
    tag VARCHAR(50),
    description TEXT,
    quantity INTEGER,
    
    created_at TIMESTAMP WITH TIME ZONE,
    closed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    days_to_close INTEGER,
    
    passed_engineering BOOLEAN DEFAULT false,
    passed_management BOOLEAN DEFAULT false,
    became_order BOOLEAN DEFAULT false,
    order_type VARCHAR(20),
    
    closed_by_user_id UUID REFERENCES users(id),
    close_type VARCHAR(20)
);

CREATE INDEX IF NOT EXISTS idx_log_date ON log_requests(closed_at DESC);

-- ============================================================
-- STEP 9: TABELLA MIRS
-- ============================================================
CREATE TABLE IF NOT EXISTS mirs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    mir_number VARCHAR(30) UNIQUE NOT NULL,
    rk_number VARCHAR(50) NOT NULL,
    category VARCHAR(20) NOT NULL,
    insert_date DATE DEFAULT CURRENT_DATE,
    forecast_date DATE NOT NULL,
    priority VARCHAR(10) DEFAULT 'Medium',
    status VARCHAR(20) DEFAULT 'Pending',
    note TEXT,
    created_by_user_id UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX IF NOT EXISTS idx_mir_number ON mirs(mir_number);
CREATE INDEX IF NOT EXISTS idx_mir_status ON mirs(status);

-- ============================================================
-- STEP 10: TABELLA MIR_ITEMS (Componenti MIR)
-- ============================================================
CREATE TABLE IF NOT EXISTS mir_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    mir_id UUID REFERENCES mirs(id) ON DELETE CASCADE,
    
    ident_code VARCHAR(100) NOT NULL,
    tag VARCHAR(50),
    description TEXT,
    quantity INTEGER NOT NULL,
    
    status VARCHAR(20) DEFAULT 'Pending',
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_mir_items_mir ON mir_items(mir_id);

-- ============================================================
-- STEP 11: TABELLA ORDER_LOG
-- ============================================================
CREATE TABLE IF NOT EXISTS order_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    component_id UUID REFERENCES request_components(id),
    request_number VARCHAR(30),
    
    ident_code VARCHAR(100),
    tag VARCHAR(50),
    description TEXT,
    quantity INTEGER,
    
    order_type VARCHAR(20) NOT NULL,
    order_date DATE NOT NULL,
    forecast_date DATE NOT NULL,
    
    status VARCHAR(20) DEFAULT 'Ordered',
    arrived_date DATE,
    
    created_by_user_id UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_order_log_date ON order_log(order_date DESC);

-- ============================================================
-- STEP 12: TABELLA COUNTERS
-- ============================================================
CREATE TABLE IF NOT EXISTS counters (
    id VARCHAR(50) PRIMARY KEY,
    value INTEGER DEFAULT 0
);

-- Inserisci il contatore se non esiste
INSERT INTO counters (id, value) 
VALUES ('request_number', 0)
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- STEP 13: UTENTI DEMO
-- ============================================================
-- Password: Per semplicità usiamo password in chiaro (in produzione usare hash!)
-- In un'app reale useresti bcrypt o simile

-- Admin
INSERT INTO users (username, password_hash, full_name, badge_number, role,
    perm_dashboard, perm_requests, perm_wh_site, perm_wh_yard, perm_site_in,
    perm_engineering, perm_spare_parts, perm_management, perm_orders, perm_mir,
    perm_material_in, perm_test_pack, perm_log, perm_database)
VALUES ('admin', 'admin123', 'Amministratore', 'ADM001', 'admin',
    'modify', 'modify', 'modify', 'modify', 'modify',
    'modify', 'modify', 'modify', 'modify', 'modify',
    'modify', 'modify', 'modify', 'modify')
ON CONFLICT (username) DO NOTHING;

-- User 1: Warehouse Site
INSERT INTO users (username, password_hash, full_name, badge_number, role,
    perm_dashboard, perm_requests, perm_wh_site, perm_wh_yard, perm_site_in,
    perm_engineering, perm_spare_parts, perm_management, perm_orders, perm_mir,
    perm_material_in, perm_test_pack, perm_log, perm_database)
VALUES ('mario.rossi', 'pass123', 'Mario Rossi', 'MR001', 'user',
    'read', 'modify', 'modify', 'read', 'modify',
    'none', 'none', 'none', 'read', 'read',
    'modify', 'read', 'read', 'none')
ON CONFLICT (username) DO NOTHING;

-- User 2: Warehouse Yard + Engineering
INSERT INTO users (username, password_hash, full_name, badge_number, role,
    perm_dashboard, perm_requests, perm_wh_site, perm_wh_yard, perm_site_in,
    perm_engineering, perm_spare_parts, perm_management, perm_orders, perm_mir,
    perm_material_in, perm_test_pack, perm_log, perm_database)
VALUES ('luigi.bianchi', 'pass123', 'Luigi Bianchi', 'LB002', 'user',
    'read', 'modify', 'read', 'modify', 'read',
    'modify', 'read', 'none', 'read', 'read',
    'read', 'read', 'read', 'none')
ON CONFLICT (username) DO NOTHING;

-- User 3: Engineering + Management
INSERT INTO users (username, password_hash, full_name, badge_number, role,
    perm_dashboard, perm_requests, perm_wh_site, perm_wh_yard, perm_site_in,
    perm_engineering, perm_spare_parts, perm_management, perm_orders, perm_mir,
    perm_material_in, perm_test_pack, perm_log, perm_database)
VALUES ('anna.verdi', 'pass123', 'Anna Verdi', 'AV003', 'user',
    'read', 'modify', 'read', 'read', 'read',
    'modify', 'modify', 'modify', 'modify', 'read',
    'none', 'modify', 'read', 'none')
ON CONFLICT (username) DO NOTHING;

-- ============================================================
-- STEP 14: DATI DEMO INVENTARIO
-- ============================================================
INSERT INTO project_database (iso_number, full_spool_number, ident_code, tag, description, diam1, diam2, uom, prj_qty, withdrawn_qty, qty_yard, qty_site)
VALUES 
    ('I181C02-DF21065-0-01', 'I181C02-DF21065-0-01-SP001', 'FLANGE-WN-150-6', NULL, 'Flange Welding Neck 150# 6"', '6"', NULL, 'PCS', 50, 20, 15, 5),
    ('I181C02-DF21065-0-01', 'I181C02-DF21065-0-01-SP001', 'BOLT-M16-100', NULL, 'Bolt M16x100 Zinc Plated', NULL, NULL, 'PCS', 500, 200, 150, 50),
    ('I181C02-DF21065-0-01', 'I181C02-DF21065-0-01-SP001', 'BOLT-M16-100', '01_SPTAG', 'Bolt M16x100 Zinc Plated (Tag 01)', NULL, NULL, 'PCS', 200, 80, 50, 30),
    ('I181C02-DF21065-0-01', 'I181C02-DF21065-0-01-SP001', 'BOLT-M16-100', '02_SPTAG', 'Bolt M16x100 Zinc Plated (Tag 02)', NULL, NULL, 'PCS', 200, 80, 45, 35),
    ('I181C02-DF21065-0-01', 'I181C02-DF21065-0-01-SP002', 'GASKET-RF-150-6', NULL, 'Gasket RF 150# 6"', '6"', NULL, 'PCS', 100, 40, 30, 10),
    ('I181C02-DF21065-0-02', 'I181C02-DF21065-0-02-SP001', 'PIPE-DN150-SCH40', NULL, 'Pipe Carbon Steel DN150 SCH40', '6"', NULL, 'MTR', 200, 80, 60, 20),
    ('I181C02-DF21065-0-02', 'I181C02-DF21065-0-02-SP001', 'ELBOW-90-DN150', NULL, 'Elbow 90° DN150 SCH40', '6"', NULL, 'PCS', 80, 30, 25, 5),
    ('I181C02-DF21065-0-02', 'I181C02-DF21065-0-02-SP002', 'TEE-DN150', NULL, 'Tee DN150 SCH40', '6"', NULL, 'PCS', 40, 15, 10, 5),
    ('I181C02-DF21065-0-03', 'I181C02-DF21065-0-03-SP001', 'REDUCER-DN200-150', NULL, 'Reducer DN200/DN150 SCH40', '8"', '6"', 'PCS', 30, 10, 8, 2),
    ('I181C02-DF21065-0-03', 'I181C02-DF21065-0-03-SP001', 'VALVE-GATE-DN150', NULL, 'Gate Valve DN150 PN16', '6"', NULL, 'PCS', 20, 8, 5, 3),
    ('I181C03-DF21066-0-01', 'I181C03-DF21066-0-01-SP001', 'FLANGE-WN-300-4', NULL, 'Flange Welding Neck 300# 4"', '4"', NULL, 'PCS', 40, 15, 12, 3),
    ('I181C03-DF21066-0-01', 'I181C03-DF21066-0-01-SP001', 'BOLT-M20-120', NULL, 'Bolt M20x120 Zinc Plated', NULL, NULL, 'PCS', 400, 150, 100, 50),
    ('I181C03-DF21066-0-01', 'I181C03-DF21066-0-01-SP002', 'GASKET-RF-300-4', NULL, 'Gasket RF 300# 4"', '4"', NULL, 'PCS', 80, 30, 25, 5),
    ('I181C03-DF21066-0-02', 'I181C03-DF21066-0-02-SP001', 'VALVE-CHECK-DN100', NULL, 'Check Valve DN100 PN16', '4"', NULL, 'PCS', 15, 5, 4, 1),
    ('I181C03-DF21066-0-02', 'I181C03-DF21066-0-02-SP001', 'PIPE-DN100-SCH80', NULL, 'Pipe Carbon Steel DN100 SCH80', '4"', NULL, 'MTR', 150, 60, 45, 15)
ON CONFLICT DO NOTHING;

-- ============================================================
-- STEP 15: FUNZIONI HELPER
-- ============================================================

-- Funzione per ottenere il prossimo numero richiesta
CREATE OR REPLACE FUNCTION get_next_request_number()
RETURNS INTEGER AS $$
DECLARE
    next_val INTEGER;
BEGIN
    UPDATE counters 
    SET value = value + 1 
    WHERE id = 'request_number'
    RETURNING value INTO next_val;
    
    RETURN next_val;
END;
$$ LANGUAGE plpgsql;

-- Funzione per aggiornare modified_at automaticamente
CREATE OR REPLACE FUNCTION update_modified_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.modified_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger per project_database
DROP TRIGGER IF EXISTS trg_pdb_modified ON project_database;
CREATE TRIGGER trg_pdb_modified
    BEFORE UPDATE ON project_database
    FOR EACH ROW
    EXECUTE FUNCTION update_modified_at();

-- Trigger per request_components
DROP TRIGGER IF EXISTS trg_comp_modified ON request_components;
CREATE TRIGGER trg_comp_modified
    BEFORE UPDATE ON request_components
    FOR EACH ROW
    EXECUTE FUNCTION update_modified_at();

-- ============================================================
-- STEP 16: VERIFICA FINALE
-- ============================================================
-- Esegui queste query per verificare che tutto sia stato creato:

-- SELECT 'users' as table_name, count(*) as rows FROM users
-- UNION ALL SELECT 'project_database', count(*) FROM project_database
-- UNION ALL SELECT 'requests', count(*) FROM requests
-- UNION ALL SELECT 'request_components', count(*) FROM request_components
-- UNION ALL SELECT 'mirs', count(*) FROM mirs
-- UNION ALL SELECT 'movements', count(*) FROM movements
-- UNION ALL SELECT 'counters', count(*) FROM counters;

-- ============================================================
-- FINE SCHEMA
-- ============================================================
