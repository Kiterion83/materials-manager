# MATERIALS MANAGER - SPECIFICHE COMPLETE FINALI
## MAX STREICHER Edition
### Documento di Specifica per Sviluppo - VERSIONE FINALE

---

## 📋 INDICE

1. [Panoramica Progetto](#1-panoramica-progetto)
2. [Stack Tecnologico](#2-stack-tecnologico)
3. [Sistema Autenticazione e Permessi](#3-sistema-autenticazione-e-permessi)
4. [Schema Database Completo](#4-schema-database-completo)
5. [Struttura Codici ISO e Spool](#5-struttura-codici-iso-e-spool)
6. [Schermate e Navigazione](#6-schermate-e-navigazione)
7. [Form Nuova Richiesta](#7-form-nuova-richiesta)
8. [Workflow Completi](#8-workflow-completi)
9. [Sistema Popup Nota Passaggi](#9-sistema-popup-nota-passaggi)
10. [Sistema Check Engineering-Warehouse](#10-sistema-check-engineering-warehouse)
11. [KPI Dashboard](#11-kpi-dashboard)
12. [Funzionalità CRUD Database](#12-funzionalità-crud-database)
13. [Sistema LOG](#13-sistema-log)
14. [Test Pack Materials](#14-test-pack-materials)
15. [To Be Collected](#15-to-be-collected)
16. [Spare Parts](#16-spare-parts)
17. [Orders](#17-orders)
18. [Storico Passaggi (Info Pallino)](#18-storico-passaggi-info-pallino)
19. [Bug Fix e Miglioramenti UI](#19-bug-fix-e-miglioramenti-ui)
20. [Import/Export Dati](#20-importexport-dati)
21. [Responsive Design (Tablet)](#21-responsive-design-tablet)
22. [Utenti Demo](#22-utenti-demo)

---

## 1. PANORAMICA PROGETTO

### 1.1 Cos'è Materials Manager
Sistema di gestione materiali per ambienti industriali/costruzioni (MAX STREICHER), progettato per tracciare il flusso di materiali dalla richiesta alla consegna.

### 1.2 Obiettivo
Gestire richieste di materiale attraverso:
- Warehouse YARD (magazzino principale)
- Warehouse SITE (magazzino cantiere)
- Engineering (ufficio tecnico)
- Management (direzione)
- Spare Parts (ricambi)
- Orders (ordini interni/cliente)
- Test Pack Materials (materiali per test pack)

### 1.3 Utenti Target
- **Admin**: Accesso completo a tutto
- **Warehouse Manager Site**: Gestisce WH Site
- **Warehouse Manager Yard**: Gestisce WH Yard
- **Engineering**: Verifica tecnica
- **Foreman**: Crea richieste e ritira materiali
- **Management**: Decisioni su ordini speciali

### 1.4 Branding
- **Nome Applicazione**: MAX STREICHER - Materials Manager (SENZA "V25" o "V26")
- **Colore Primario**: STREICHER Red `#E31E24`
- **Logo**: STR in cerchio rosso

---

## 2. STACK TECNOLOGICO

### 2.1 Frontend
- **React 18** (Single Page Application)
- **Vite** (Build tool)
- **JavaScript** (no TypeScript)
- **CSS-in-JS** (stili inline)
- **Single File Architecture** (App.jsx)

### 2.2 Backend
- **Supabase** (PostgreSQL hosted)
  - Database relazionale
  - REST API automatica
  - Row Level Security

### 2.3 Hosting
- **Vercel** (frontend)
- **Supabase Free Tier** (database - 500MB limit)

### 2.4 Variabili Ambiente
```
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs...
```

---

## 3. SISTEMA AUTENTICAZIONE E PERMESSI

### 3.1 Login
- Schermata login iniziale con Username e Password
- Nessun sistema di registrazione (utenti creati solo da Admin)
- Sessione persistente (localStorage)

### 3.2 Ruoli
| Ruolo | Descrizione |
|-------|-------------|
| `admin` | Accesso completo, può modificare tutto incluso Database |
| `user` | Permessi definiti per singola schermata |

### 3.3 Permessi per Schermata
Ogni utente ha un permesso per ogni schermata:
- `none`: Non può accedere (schermata nascosta nel menu)
- `read`: Può solo visualizzare
- `modify`: Può visualizzare e modificare/agire

### 3.4 Schermate con Permessi
| Schermata | Permesso DB |
|-----------|-------------|
| Dashboard | `perm_dashboard` |
| Requests (Nuova Richiesta) | `perm_requests` |
| WH Site | `perm_wh_site` |
| WH Yard | `perm_wh_yard` |
| Site IN | `perm_site_in` |
| Engineering | `perm_engineering` |
| Spare Parts | `perm_spare_parts` |
| Management | `perm_management` |
| Orders | `perm_orders` |
| MIR | `perm_mir` |
| Material IN | `perm_material_in` |
| Test Pack Materials | `perm_test_pack` |
| LOG | `perm_log` |
| Database | `perm_database` (solo Admin può avere `modify`) |

### 3.5 Logica Permessi
- Chi ha `modify` su WH Site può: vedere richieste, accettare, inviare a UT, restituire, creare split
- Chi ha `read` su WH Site può: solo vedere le richieste, nessun pulsante attivo
- Chi ha `none` su WH Site: la voce non appare nel menu

---

## 4. SCHEMA DATABASE COMPLETO

### 4.1 Tabella USERS
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    badge_number VARCHAR(30),
    role VARCHAR(20) DEFAULT 'user',  -- 'admin' o 'user'
    
    -- Permessi (none/read/modify)
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
    created_at TIMESTAMP DEFAULT NOW()
);
```

### 4.2 Tabella PROJECT_DATABASE (Items Materiali)
```sql
CREATE TABLE project_database (
    id SERIAL PRIMARY KEY,
    
    -- Identificazione
    iso_number VARCHAR(50) NOT NULL,        -- Es: I181C02-DF21065-0-01
    full_spool_number VARCHAR(60),          -- Es: I181C02-DF21065-0-01-SP003
    ident_code VARCHAR(100) NOT NULL,       -- Codice materiale
    tag VARCHAR(50),                        -- Tag per distinguere duplicati (nullable)
    
    -- Descrizione
    description TEXT,
    diam1 VARCHAR(30),                      -- Diametro 1
    diam2 VARCHAR(30),                      -- Diametro 2
    uom VARCHAR(20) DEFAULT 'PCS',          -- Unit of Measure
    
    -- Quantità
    prj_qty INTEGER DEFAULT 0,              -- Project Quantity (da Pos Qty)
    withdrawn_qty INTEGER DEFAULT 0,        -- Quantità ritirata da cliente (SI AGGIORNA con Site IN)
    qty_yard INTEGER DEFAULT 0,             -- Disponibile in Yard
    qty_site INTEGER DEFAULT 0,             -- Disponibile in Site
    qty_to_collect INTEGER DEFAULT 0,       -- To Be Collected (pronto per ritiro)
    
    -- Computed: total_available = qty_yard + qty_site (calcolato in app)
    
    -- Metadata
    created_at TIMESTAMP DEFAULT NOW(),
    modified_at TIMESTAMP DEFAULT NOW(),
    
    -- Vincolo unicità (stesso codice + tag = record unico)
    UNIQUE(iso_number, ident_code, COALESCE(tag, ''))
);

-- Indici per performance
CREATE INDEX idx_pdb_iso ON project_database(iso_number);
CREATE INDEX idx_pdb_ident ON project_database(ident_code);
CREATE INDEX idx_pdb_tag ON project_database(tag) WHERE tag IS NOT NULL;
```

#### 4.2.1 WITHDRAWN_QTY - Spiegazione Dettagliata
**Scopo**: Tracciare quanto materiale è stato ritirato dal cliente per doppio confronto.

**Logica di aggiornamento**:
- Valore iniziale: fornito dal cliente tramite import Excel
- Si aggiorna automaticamente con ogni **Site IN** (arrivo materiale da cliente)
- Esempio:
  - Cliente dice "hai ritirato 10" → withdrawn_qty = 10
  - Domani ritiro 3 dal cliente (Site IN) → withdrawn_qty = 10 + 3 = 13
  - Quando cliente manda aggiornamento, deve avere anche lui 13
- **Scopo**: Verifica incrociata che i dati coincidano con quelli del cliente

**Nota**: Il valore può anche essere modificato manualmente da Admin se necessario.

### 4.3 Tabella REQUESTS (Testata Richieste)
```sql
CREATE TABLE requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    request_number INTEGER NOT NULL,
    sub_number INTEGER DEFAULT 0,           -- Per split: 0, 1, 2...
    
    -- Richiedente (collegato a users)
    requester_user_id UUID REFERENCES users(id),
    
    -- Tipo Richiesta
    request_type VARCHAR(20) NOT NULL,      -- 'Piping', 'Mechanical', 'TestPack'
    sub_category VARCHAR(20),               -- 'Bulk', 'Erection', 'Support' (solo per Piping)
    
    -- Test Pack specifici
    test_pack_number VARCHAR(50),           -- Obbligatorio se TestPack
    missing_type VARCHAR(20),               -- 'Material' o 'Spool' (solo TestPack)
    
    -- Dati progetto
    iso_number VARCHAR(50),                 -- Obbligatorio per Piping, opzionale per TestPack, disabilitato per Mechanical
    full_spool_number VARCHAR(60),          -- Obbligatorio per Piping, opzionale per TestPack, disabilitato per Mechanical
    hf_number VARCHAR(30),                  -- Solo per Piping + Erection
    
    -- Descrizione
    description TEXT,                       -- Opzionale per Piping/TestPack, OBBLIGATORIO per Mechanical
    
    -- Metadata
    created_at TIMESTAMP DEFAULT NOW(),
    
    UNIQUE(request_number, sub_number)
);
```

### 4.4 Tabella REQUEST_COMPONENTS (Righe Richieste)
```sql
CREATE TABLE request_components (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    request_id UUID REFERENCES requests(id) ON DELETE CASCADE,
    
    -- Materiale
    ident_code VARCHAR(100) NOT NULL,
    tag VARCHAR(50),                        -- Tag se presente
    description TEXT,
    quantity INTEGER NOT NULL,
    
    -- Status workflow
    status VARCHAR(20) DEFAULT 'Site',
    -- Valori: 'Site', 'Yard', 'Trans', 'Eng', 'Spare', 'Mng', 'Order', 'Ordered', 
    --         'ToCollect', 'Done', 'TestPackReady'
    
    -- Engineering Check
    has_eng_check BOOLEAN DEFAULT false,    -- Ha un check pendente da Engineering
    eng_check_message TEXT,                 -- Messaggio del check
    eng_check_sent_to VARCHAR(20),          -- 'Site', 'Yard', 'Both'
    eng_check_site_response VARCHAR(20),    -- 'Resolved', 'NotFound', NULL
    eng_check_yard_response VARCHAR(20),    -- 'Resolved', 'NotFound', NULL
    
    -- Note passaggio
    sent_to VARCHAR(20),                    -- 'Site', 'Yard', 'Eng'
    passage_note TEXT,                      -- Nota quando passato ad altra schermata
    
    -- Engineering
    eng_note TEXT,
    
    -- Management
    mng_note TEXT,
    
    -- Orders
    order_type VARCHAR(20),                 -- 'Internal', 'Client', 'Spare'
    order_date DATE,
    order_forecast DATE,
    
    -- Spare
    spare_request_date DATE,
    spare_forecast_date DATE,
    
    -- Location tracking
    current_location VARCHAR(20),           -- 'YARD', 'SITE'
    
    -- Metadata
    created_at TIMESTAMP DEFAULT NOW(),
    modified_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_comp_request ON request_components(request_id);
CREATE INDEX idx_comp_status ON request_components(status);
CREATE INDEX idx_comp_eng_check ON request_components(has_eng_check) WHERE has_eng_check = true;
```

### 4.5 Tabella COMPONENT_HISTORY (Storico Passaggi)
```sql
CREATE TABLE component_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    component_id UUID REFERENCES request_components(id) ON DELETE CASCADE,
    
    action VARCHAR(100) NOT NULL,           -- 'Created', 'Sent to Yard', 'Split', 'Delivered', 
                                            -- 'Check Sent', 'Check Resolved', 'Check Not Found', etc.
    from_status VARCHAR(20),
    to_status VARCHAR(20),
    from_location VARCHAR(20),
    to_location VARCHAR(20),
    
    -- Dettagli aggiuntivi
    note TEXT,                              -- Nota del passaggio
    check_response VARCHAR(20),             -- Per risposte check: 'Resolved', 'NotFound', 'Other'
    
    performed_by_user_id UUID REFERENCES users(id),
    performed_by_name VARCHAR(100),         -- Nome per visualizzazione rapida
    
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_history_comp ON component_history(component_id);
CREATE INDEX idx_history_date ON component_history(created_at DESC);
```

### 4.6 Tabella MOVEMENTS (Log Movimenti Inventario)
```sql
CREATE TABLE movements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    movement_date TIMESTAMP DEFAULT NOW(),
    
    type VARCHAR(10) NOT NULL,              -- 'IN', 'OUT', 'TRF', 'BAL', 'DEL'
    location VARCHAR(20) NOT NULL,          -- 'YARD', 'SITE', 'YARD→SITE'
    
    ident_code VARCHAR(100) NOT NULL,
    tag VARCHAR(50),
    quantity INTEGER NOT NULL,              -- Positivo = aggiunge, Negativo = sottrae
    
    note TEXT NOT NULL,                     -- OBBLIGATORIO
    
    -- Riferimenti
    balance_type VARCHAR(20),               -- 'Adjustment', 'Lost', 'Broken', 'CheckNotFound' (per BAL)
    request_reference VARCHAR(30),          -- Numero richiesta collegata
    mir_number VARCHAR(30),
    auto_generated BOOLEAN DEFAULT false,   -- true se creato automaticamente (es. da Check non trovato)
    
    -- Chi ha fatto il movimento
    created_by_user_id UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_mov_date ON movements(movement_date DESC);
CREATE INDEX idx_mov_code ON movements(ident_code);
```

### 4.7 Tabella LOG_REQUESTS (Log Richieste Chiuse)
```sql
CREATE TABLE log_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Dati richiesta
    request_number VARCHAR(30),
    request_type VARCHAR(20),
    requester_name VARCHAR(100),
    requester_badge VARCHAR(30),
    iso_number VARCHAR(50),
    full_spool_number VARCHAR(60),
    
    -- Materiale
    ident_code VARCHAR(100),
    tag VARCHAR(50),
    description TEXT,
    quantity INTEGER,
    
    -- Tempi
    created_at TIMESTAMP,                   -- Quando creata
    closed_at TIMESTAMP DEFAULT NOW(),      -- Quando chiusa
    days_to_close INTEGER,                  -- Giorni per chiusura (calcolato)
    
    -- Percorso
    passed_engineering BOOLEAN DEFAULT false,
    passed_management BOOLEAN DEFAULT false,
    became_order BOOLEAN DEFAULT false,
    order_type VARCHAR(20),
    
    -- Chi ha chiuso
    closed_by_user_id UUID REFERENCES users(id),
    close_type VARCHAR(20)                  -- 'Delivered', 'Cancelled', 'Completed'
);

CREATE INDEX idx_log_date ON log_requests(closed_at DESC);
```

### 4.8 Tabella MIRS
```sql
CREATE TABLE mirs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    mir_number VARCHAR(30) UNIQUE NOT NULL,
    rk_number VARCHAR(50) NOT NULL,
    category VARCHAR(20) NOT NULL,          -- 'Erection', 'Bulk', 'Instrument', 'Support'
    insert_date DATE DEFAULT CURRENT_DATE,
    forecast_date DATE NOT NULL,
    priority VARCHAR(10) DEFAULT 'Medium',  -- 'High', 'Medium', 'Low'
    status VARCHAR(20) DEFAULT 'Pending',   -- 'Pending', 'Partial', 'Done'
    created_at TIMESTAMP DEFAULT NOW(),
    completed_at TIMESTAMP
);
```

#### 4.8.1 MIR Category - Importante per Ritiro
Il campo `category` è **OBBLIGATORIO** e indica il tipo di materiale:
- **Erection**: Materiale per montaggio
- **Bulk**: Materiale sfuso
- **Instrument**: Strumentazione
- **Support**: Supporti

Questa informazione è fondamentale per chi deve andare a ritirare il materiale.

### 4.9 Tabella ORDER_LOG
```sql
CREATE TABLE order_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    component_id UUID REFERENCES request_components(id),
    request_number VARCHAR(30),
    
    ident_code VARCHAR(100),
    tag VARCHAR(50),
    description TEXT,
    quantity INTEGER,
    
    order_type VARCHAR(20) NOT NULL,        -- 'Internal', 'Client', 'Spare'
    order_date DATE NOT NULL,
    forecast_date DATE NOT NULL,
    
    status VARCHAR(20) DEFAULT 'Ordered',   -- 'Ordered', 'Arrived', 'Cancelled'
    arrived_date DATE,
    
    created_by_user_id UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW()
);
```

### 4.10 Tabella COUNTERS
```sql
CREATE TABLE counters (
    id VARCHAR(50) PRIMARY KEY,
    value INTEGER DEFAULT 0
);

INSERT INTO counters (id, value) VALUES ('request_number', 0);
```

---

## 5. STRUTTURA CODICI ISO E SPOOL

### 5.1 ISO Number
**Formato**: `{AREA}-{LINE}-{SUBLINE}`

**Esempio**: `I181C02-DF21065-0-01`
- `I181C02` = Area
- `DF21065-0` = Line (include un separatore interno)
- `01` = Sub-line (01, 02, 03...)

**Varianti possibili**:
- Possono esserci lettere aggiuntive in mezzo
- Il numero di caratteri può variare

### 5.2 Full Spool Number
**Formato**: `{ISO_NUMBER}-SP{XXX}`

**Esempio**: `I181C02-DF21065-0-01-SP003`
- `I181C02-DF21065-0-01` = ISO Number completo
- `SP003` = Spool number (SP001, SP002, SP003, etc.)

**Significato**:
- Gli spool sono i componenti necessari per completare una linea
- Una linea può avere multipli spool (SP001, SP002, SP003...)

### 5.3 Ident Code
- Codice univoco del materiale
- Può essere duplicato se ha TAG diversi
- Esempi: `FLANGE-WN-150-6`, `BOLT-M16-100`, `GASKET-RF-300`

### 5.4 TAG
- Campo opzionale per distinguere materiali con stesso Ident Code
- Esempi: `01_SPTAG`, `02_SPTAG`, etc.
- Se non presente = NULL

---

## 6. SCHERMATE E NAVIGAZIONE

### 6.1 Menu Sidebar
```
┌─────────────────────────┐
│ [STR] MAX STREICHER     │
│       Materials Manager │
│                    [←→] │  ← Pulsante collapse/expand (SEMPRE VISIBILE!)
├─────────────────────────┤
│ 📊 Dashboard            │
│ 📋 Requests             │
│ 📦 MIR                  │
│ 📥 Material IN          │
│ 🏗️ Site IN              │
│ 🏭 WH Site              │
│ 🏢 WH Yard              │
│ ⚙️ Engineering          │
│ 🔧 Spare Parts          │
│ 🛒 Orders               │
│ 👔 Management           │
│ 📦 Test Pack Materials  │
│ 📜 LOG                  │
│ 💾 Database             │
├─────────────────────────┤
│ 🚪 Logout               │
└─────────────────────────┘
```

### 6.2 Visibilità Menu
- Ogni voce visibile solo se utente ha permesso `read` o `modify`
- Se `none` → voce nascosta

### 6.3 Header Pagina
```
┌─────────────────────────────────────────────────────────────┐
│ [← Back]  [Icon] Page Title                    [🔄 Refresh] │
│                  Materials Manager                          │
└─────────────────────────────────────────────────────────────┘
```

### 6.4 Visualizzazione Disponibilità in TUTTE le Schermate
In WH Site, WH Yard, Engineering, etc. - per ogni componente mostrare SEMPRE:
```
┌────────────────────────────────────────────────────────────────────────────┐
│ Request │ Code      │ Tag │ Qty │ Description    │ YARD: 20 │ SITE: 15 │ Actions │
└────────────────────────────────────────────────────────────────────────────┘
```
Così chi valuta vede subito le disponibilità di ENTRAMBI i magazzini.

---

## 7. FORM NUOVA RICHIESTA

### 7.1 Preview Numero Richiesta
- Mostrare in alto a destra: `Preview: 00001-0 (non salvato)`
- Il numero diventa valido SOLO dopo l'invio
- Parte da `00001-0`
- Formato: `{5 cifre}-{sub_number}`

### 7.2 Selezione Tipo Richiesta
```
REQUEST TYPE:
○ PIPING      ○ MECHANICAL      ○ TEST PACK
```

### 7.3 Form PIPING
```
┌─────────────────────────────────────────────────────────────┐
│ Sub-Category: [Bulk ▼]  [Erection ▼]  [Support ▼]           │
│                                                             │
│ ISO Number*:        [________________] (autocomplete)       │
│ Full Spool Number*: [________________] (autocomplete)       │
│ HF Number:          [________________] (solo se Erection)   │
│ Description:        [________________] (opzionale)          │
│                                                             │
│ 📦 ADD MATERIALS:                                           │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Ident Code: [dropdown + search filtrato per ISO]        ││
│ │ Tag:        [autocomplete] (disabilitato se non serve)  ││
│ │ Qty:        [____]                                      ││
│ │                                        [+ Add Material] ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ MATERIALS ADDED:                                            │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ CODE            │ TAG    │ DESCRIPTION      │ QTY │ ✕   ││
│ │ FLANGE-WN-150   │        │ Flange WN 150#   │ 10  │ [x] ││
│ │ BOLT-M16        │ 01_SPT │ Bolt M16x100     │ 40  │ [x] ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ [🏭 Send to Site] [🏢 Send to Yard] [⚙️ Send to Engineering]│
└─────────────────────────────────────────────────────────────┘
```

**Regole PIPING**:
- ISO Number: OBBLIGATORIO, autocomplete
- Full Spool Number: OBBLIGATORIO, autocomplete
- HF Number: OBBLIGATORIO solo se sub_category = "Erection", altrimenti disabilitato
- Description: Opzionale
- Ident Code dropdown: Filtrato per ISO Number selezionato
- Tag: Autocomplete, disabilitato se l'Ident Code selezionato non ha tag

### 7.4 Form MECHANICAL
```
┌─────────────────────────────────────────────────────────────┐
│ ISO Number:        [DISABILITATO - grigio]                  │
│ Full Spool Number: [DISABILITATO - grigio]                  │
│ Ident Code:        [DISABILITATO - grigio]                  │
│ Tag:               [DISABILITATO - grigio]                  │
│ Qty:               [DISABILITATO - grigio]                  │
│                                                             │
│ Description*:      [________________________________]       │
│                    (OBBLIGATORIO - testo libero)            │
│                                                             │
│ [🏭 Send to Site] [🏢 Send to Yard] [⚙️ Send to Engineering]│
└─────────────────────────────────────────────────────────────┘
```

**Regole MECHANICAL**:
- TUTTO disabilitato tranne Description
- Description: OBBLIGATORIO
- Non si aggiungono materiali, solo descrizione testuale

### 7.5 Form TEST PACK
```
┌─────────────────────────────────────────────────────────────┐
│ Test Pack Number*: [________________] (OBBLIGATORIO)        │
│ ISO Number:        [________________] (opzionale)           │
│ Full Spool Number: [________________] (opzionale)           │
│                                                             │
│ Missing Type: ○ Material    ○ Spool                         │
│                                                             │
│ SE "Material" SELEZIONATO:                                  │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Ident Code: [dropdown + search]                         ││
│ │ Tag:        [autocomplete]                              ││
│ │ Qty:        [____]                                      ││
│ │                                        [+ Add Material] ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ SE "Spool" SELEZIONATO:                                     │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Ident Code: [DISABILITATO]                              ││
│ │ Description: [spool mancante - testo libero]            ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ [🏭 Send to Site] [🏢 Send to Yard] [⚙️ Send to Engineering]│
└─────────────────────────────────────────────────────────────┘
```

**Regole TEST PACK**:
- Test Pack Number: OBBLIGATORIO
- ISO e Spool: Opzionali
- Se Missing = "Material": funziona come Piping (aggiungi materiali)
- Se Missing = "Spool": Ident Code disabilitato, solo descrizione libera

---

## 8. WORKFLOW COMPLETI

### 8.1 Workflow Principale
```
                         ┌─────────────┐
                         │ NEW REQUEST │
                         └──────┬──────┘
                                │
              ┌─────────────────┼─────────────────┐
              ▼                 ▼                 ▼
         ┌────────┐        ┌────────┐        ┌────────┐
         │  Site  │        │  Yard  │        │  Eng   │
         └────┬───┘        └────┬───┘        └────┬───┘
              │                 │                 │
              │    ┌────────────┤                 │
              │    ▼            │                 │
              │ ┌──────┐        │                 │
              │ │Trans │←───────┘                 │
              │ └──┬───┘                          │
              │    │                              │
              │    ▼                              │
              │ ┌──────┐                          │
              └─│ Site │←─────────────────────────┤
                └──┬───┘                          │
                   │                              │
                   ▼                              │
              ┌──────────┐      ┌───────┐        │
              │ToCollect │      │ Spare │←───────┤
              └────┬─────┘      └───┬───┘        │
                   │                │   ┌────────┤
                   ▼                ▼   ▼        │
              ┌────────┐       ┌───────────┐     │
              │  Done  │       │   Order   │←─┌──┤
              └────────┘       └─────┬─────┘  │  │
                                     │        │  │
                                     ▼        │  │
                               ┌─────────┐    │  │
                               │ Ordered │    │  │
                               └────┬────┘    │  │
                                    │         │  │
                                    ▼         │  │
                               ┌────────┐     │  │
                               │  Yard  │─────┘  │
                               └────────┘        │
                                                 │
                                    ┌────────┐   │
                                    │  Mng   │←──┘
                                    └────────┘
```

### 8.2 Stati Componenti
| Status | Schermata | Descrizione |
|--------|-----------|-------------|
| `Site` | WH Site | In valutazione magazzino Site |
| `Yard` | WH Yard | In valutazione magazzino Yard |
| `Trans` | Site IN | In transito da Yard a Site |
| `Eng` | Engineering | In verifica tecnica |
| `Spare` | Spare Parts | Gestione ricambi |
| `Mng` | Management | Decisione direzione |
| `Order` | Orders (Da Ordinare) | Da ordinare |
| `Ordered` | Orders (Ordinati) | Ordinato, in attesa arrivo |
| `ToCollect` | To Be Collected | Pronto per ritiro |
| `TestPackReady` | Test Pack Materials | Pronto per test pack |
| `Done` | LOG | Completato/Consegnato |

### 8.3 Azioni per Schermata

#### WH Site
| Pulsante | Azione | Risultato |
|----------|--------|-----------|
| ✓ (verde) | Prepara consegna | → ToCollect |
| PT (arancio) | Split Partial | Apre modal split |
| Y (grigio scuro) | Invia a Yard | → Popup nota → Yard |
| UT (viola) | Invia a Engineering | → Popup nota → Eng |
| TP (blu) | Test Pack Ready | → TestPackReady |
| ↩ (grigio) | Restituisci | → origine |
| 🗑️ (rosso) | Elimina | Cancella componente |
| 🔍 (se check) | Rispondi a Check | Popup risposta |

#### WH Yard
| Pulsante | Azione | Risultato |
|----------|--------|-----------|
| ✓ (verde) | Trovato - Trasferisci | → Trans (se qty disponibile) |
| PT | Split Partial | Modal split |
| UT | Invia a Engineering | → Popup nota → Eng |
| TP | Test Pack Ready | → TestPackReady |
| ↩ | Restituisci a Site | → Site |
| 🗑️ | Elimina | Cancella |
| 🔍 (se check) | Rispondi a Check | Popup risposta |

**NOTA**: Pulsante ✓ DISABILITATO se quantità richiesta > disponibile in Yard

#### Engineering
| Pulsante | Azione | Risultato |
|----------|--------|-----------|
| ✓ (verde) | Risolto | → Site |
| PT | Split Partial | Modal split |
| 🔍 (viola) | Invia Check | → Popup check → WH |
| Sp (rosa) | Spare Parts | Modal date → Spare |
| Mng (giallo) | Management | → Popup nota → Mng |
| TP | Test Pack Ready | → TestPackReady |
| ↩ | Restituisci | → Site/Yard |
| 🗑️ | Elimina | Cancella |

---

## 9. SISTEMA POPUP NOTA PASSAGGI

### 9.1 Quando Appare
Il popup nota appare quando si passa una richiesta tra schermate specifiche:
- **Site → Yard** (con possibilità di scegliere anche Engineering)
- **Site → Engineering**
- **Yard → Engineering**
- **Engineering → Management**

### 9.2 Struttura Popup
```
┌─────────────────────────────────────────┐
│ 📝 Nota Passaggio                       │
├─────────────────────────────────────────┤
│ Materiale: BOLT-M16 (10 pz)             │
│                                         │
│ Destinazione: [→ YARD        ▼]         │
│               ┌──────────────────┐      │
│               │ → YARD           │      │
│               │ → ENGINEERING    │      │
│               └──────────────────┘      │
│                                         │
│ Nota (opzionale):                       │
│ ┌─────────────────────────────────────┐ │
│ │ Anche se in Site risultano 20,      │ │
│ │ in realtà non li abbiamo.           │ │
│ │ Verificare in Yard.                 │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ [✓ Conferma]              [Annulla]     │
└─────────────────────────────────────────┘
```

### 9.3 Logica
- L'utente può scegliere la destinazione dal dropdown
- La nota è opzionale ma consigliata per spiegare il motivo
- Tutto viene tracciato nel LOG (component_history)

---

## 10. SISTEMA CHECK ENGINEERING-WAREHOUSE

### 10.1 Scopo
Permettere a Engineering di inviare richieste di verifica ai magazzini quando dai dati risulta che il materiale dovrebbe esserci.

### 10.2 Invio Check da Engineering

#### 10.2.1 Pulsante
In Engineering, per ogni componente: pulsante 🔍 "Invia Check"

#### 10.2.2 Popup Invio Check
```
┌─────────────────────────────────────────┐
│ 🔍 Invia Check                          │
├─────────────────────────────────────────┤
│ Materiale: BOLT-M16 (Qty: 10)           │
│ Disponibilità: YARD: 20 | SITE: 15      │
│                                         │
│ Messaggio*:                             │
│ ┌─────────────────────────────────────┐ │
│ │ Dai nostri dati risulta che dovete  │ │
│ │ avere questo materiale. Verificare  │ │
│ │ inventario.                         │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ Invia a: [→ ENTRAMBI     ▼]             │
│          ┌─────────────────┐            │
│          │ → SITE          │            │
│          │ → YARD          │            │
│          │ → ENTRAMBI      │            │
│          └─────────────────┘            │
│                                         │
│ [📤 Invia Check]           [Annulla]    │
└─────────────────────────────────────────┘
```

### 10.3 Ricezione Check in Warehouse

#### 10.3.1 Visualizzazione
In WH Site e/o WH Yard, i componenti con check pendente mostrano:
- **Icona speciale**: 🔍 invece delle normali azioni
- **Badge "CHECK"**: per identificare visivamente
- **Sfondo diverso**: es. viola chiaro per evidenziare

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ 🔍 CHECK DA ENGINEERING                                                     │
├─────────────────────────────────────────────────────────────────────────────┤
│ Request │ Code     │ Qty │ Message                    │ YARD │ SITE │Action │
│ 00015-0 │ BOLT-M16 │ 10  │ "Verificare inventario..." │  20  │  15  │[🔍]   │
└─────────────────────────────────────────────────────────────────────────────┘
```

#### 10.3.2 Popup Risposta Check
Quando l'operatore WH clicca sul pulsante 🔍:
```
┌─────────────────────────────────────────┐
│ 📥 Check U.T.                           │
├─────────────────────────────────────────┤
│ "Verificare inventario..."              │
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │         ✓ Risolto                   │ │  ← Verde: Trovato!
│ └─────────────────────────────────────┘ │
│ ┌─────────────────────────────────────┐ │
│ │         X Non trovato               │ │  ← Arancione: Non c'è
│ └─────────────────────────────────────┘ │
│ ┌─────────────────────────────────────┐ │
│ │         ↔ Altro                     │ │  ← Blu: L'altra WH l'ha trovato
│ └─────────────────────────────────────┘ │
│ ┌─────────────────────────────────────┐ │
│ │           Chiudi                    │ │  ← Grigio: Annulla
│ └─────────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

### 10.4 Logica Risposte Check

#### 10.4.1 Check inviato a SINGOLO magazzino (Site O Yard)
| Risposta | Azione |
|----------|--------|
| ✓ Risolto | Materiale trovato → va in ToCollect (Site) o Trans (Yard) |
| X Non trovato | Engineering riceve SUBITO notifica "Non trovato" |

#### 10.4.2 Check inviato a ENTRAMBI
| Scenario | Azione |
|----------|--------|
| **Site trova** (✓ Risolto) | → ToCollect, notifica SPARISCE da Yard |
| **Yard trova** (✓ Risolto) | → Trans (Site IN), notifica SPARISCE da Site |
| **Site non trova, Yard non risposto** | Notifica rimane su Yard, Engineering NON riceve ancora nulla |
| **Yard clicca "↔ Altro"** | Notifica sparisce (l'altro l'ha già trovato) |
| **ENTRAMBI non trovano** | Engineering riceve notifica → Movimento BAL automatico → Spare/Mng |

#### 10.4.3 Movimento BAL Automatico
Quando ENTRAMBI i magazzini rispondono "Non trovato":
1. Sistema crea automaticamente movimento di tipo `BAL` con `balance_type = 'CheckNotFound'`
2. Quantità in Yard e Site azzerate per quel materiale
3. Nota automatica: "Azzeramento automatico da Check Engineering - Non trovato in Site e Yard"
4. `auto_generated = true`

### 10.5 Diagramma Workflow Check
```
                    ┌─────────────┐
                    │ ENGINEERING │
                    └──────┬──────┘
                           │
                    [🔍 Invia Check]
                           │
         ┌─────────────────┼─────────────────┐
         ▼                 ▼                 ▼
    ┌─────────┐      ┌─────────┐      ┌───────────┐
    │Solo SITE│      │Solo YARD│      │  ENTRAMBI │
    └────┬────┘      └────┬────┘      └─────┬─────┘
         │                │                 │
         ▼                ▼           ┌─────┴─────┐
    [Risposta]       [Risposta]       ▼           ▼
         │                │       ┌──────┐   ┌──────┐
         │                │       │ SITE │   │ YARD │
         ▼                ▼       └──┬───┘   └──┬───┘
    ┌─────────┐      ┌─────────┐    │           │
    │Risolto? │      │Risolto? │    ▼           ▼
    └────┬────┘      └────┬────┘ [Risposta] [Risposta]
         │                │         │           │
    ┌────┴────┐      ┌────┴────┐   │           │
    ▼         ▼      ▼         ▼   ▼           ▼
  [Sì]      [No]   [Sì]      [No]
    │         │      │         │
    ▼         ▼      ▼         ▼
ToCollect  Eng     Trans     Eng
          notif            notif

                    LOGICA ENTRAMBI:
         ┌──────────────────────────────────────┐
         │ Se UNO trova:                        │
         │   → Notifica sparisce dall'altro    │
         │   → Engineering NON riceve "non     │
         │     trovato"                         │
         │                                      │
         │ Se ENTRAMBI non trovano:            │
         │   → Engineering riceve notifica     │
         │   → Movimento BAL AUTOMATICO        │
         │   → Qty Yard e Site → 0             │
         │   → Eng decide: Spare o Management  │
         └──────────────────────────────────────┘
```

### 10.6 Tracciamento LOG
Ogni azione del check viene registrata in `component_history`:
- "Check inviato a Site" / "Check inviato a Yard" / "Check inviato a Entrambi"
- "Check Risolto da Site" / "Check Risolto da Yard"
- "Check Non Trovato da Site" / "Check Non Trovato da Yard"
- "BAL automatico - Materiale non trovato"

---

## 11. KPI DASHBOARD

### 11.1 KPI Tempi Chiusura
| KPI | Calcolo | Colore |
|-----|---------|--------|
| ⚡ Chiuse in 1 giorno | `days_to_close <= 1` | Verde |
| 📅 Chiuse 2-7 giorni | `days_to_close BETWEEN 2 AND 7` | Blu |
| 📆 Chiuse < 3 settimane | `days_to_close BETWEEN 8 AND 21` | Arancione |
| ⏰ Chiuse > 3 settimane | `days_to_close > 21` | Rosso |

### 11.2 KPI Workflow
| KPI | Calcolo |
|-----|---------|
| 🔧 Passate da Engineering | `passed_engineering = true` |
| 👔 Passate da Management | `passed_management = true` |
| 🛒 Diventate Ordini | `became_order = true` |

### 11.3 Visualizzazione Dashboard
```
┌─────────────────────────────────────────────────────────────┐
│ 📊 DASHBOARD                                                │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ INVENTORY OVERVIEW                                          │
│ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐            │
│ │  YARD   │ │  SITE   │ │  LOST   │ │ BROKEN  │            │
│ │  1,250  │ │   890   │ │   23    │ │   15    │            │
│ │ 45 items│ │ 32 items│ │ 8 items │ │ 5 items │            │
│ └─────────┘ └─────────┘ └─────────┘ └─────────┘            │
│                                                             │
│ KPI TEMPI CHIUSURA                                          │
│ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐            │
│ │⚡ 1 day │ │📅 2-7 d │ │📆 <3 wk │ │⏰ >3 wk │            │
│ │   45    │ │   120   │ │   35    │ │   12    │            │
│ └─────────┘ └─────────┘ └─────────┘ └─────────┘            │
│                                                             │
│ KPI WORKFLOW                                                │
│ ┌───────────────┐ ┌───────────────┐ ┌───────────────┐      │
│ │🔧 Engineering │ │👔 Management  │ │🛒 Orders      │      │
│ │      89       │ │      23       │ │     45        │      │
│ └───────────────┘ └───────────────┘ └───────────────┘      │
│                                                             │
│ ACTIVE REQUESTS                                             │
│ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐            │
│ │ WH Site │ │ WH Yard │ │   Eng   │ │ Transit │            │
│ │   24    │ │   18    │ │    8    │ │    5    │            │
│ └─────────┘ └─────────┘ └─────────┘ └─────────┘            │
│                                                             │
│ RECENT MOVEMENTS (from LOG)                                 │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Date       │ Type │ Code        │ Qty │ From → To      ││
│ │ 08/12/2025 │ IN   │ BOLT-M16    │ +50 │ SUPPLIER→YARD  ││
│ │ 08/12/2025 │ DEL  │ GASKET-RF   │ -10 │ SITE→DELIVERED ││
│ └─────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────┘
```

---

## 12. FUNZIONALITÀ CRUD DATABASE

### 12.1 Accesso
- Solo utenti con `perm_database = 'modify'` possono modificare
- In pratica: solo Admin

### 12.2 Visualizzazione
```
┌─────────────────────────────────────────────────────────────────────┐
│ 💾 DATABASE                            [+ Add Row] [📥 Import Excel]│
├─────────────────────────────────────────────────────────────────────┤
│ Search: [________________] 🔍                                       │
│                                                                     │
│ ┌─────────────────────────────────────────────────────────────────┐│
│ │ID│ISO_NUM│SPOOL│IDENT_CODE│TAG│DESC│D1│D2│PRJ│WTD│YARD│SITE│TC│││
│ ├──┼───────┼─────┼──────────┼───┼────┼──┼──┼───┼───┼────┼────┼──┤││
│ │1 │I181C02│SP001│FLANGE-150│   │... │6"│  │20 │8  │5   │3   │0 │✏️│
│ │2 │I181C02│SP001│BOLT-M16  │T01│... │  │  │40 │15 │10  │5   │2 │✏️│
│ │3 │I181C02│SP001│BOLT-M16  │T02│... │  │  │40 │15 │8   │7   │0 │✏️│
│ └─────────────────────────────────────────────────────────────────┘│
│                                                                     │
│ Legend: PRJ=Project Qty, WTD=Withdrawn, TC=To Collect              │
│ Total Available = YARD + SITE                                       │
└─────────────────────────────────────────────────────────────────────┘
```

### 12.3 Edit Row (Modal)
```
┌─────────────────────────────────────────┐
│ ✏️ Edit Item                            │
├─────────────────────────────────────────┤
│ ISO Number:    [I181C02-DF21065-0-01  ] │
│ Spool Number:  [I181C02-...-SP001     ] │
│ Ident Code:    [FLANGE-WN-150-6       ] │
│ Tag:           [                      ] │  ← Modificabile
│ Description:   [Flange WN 150# 6"     ] │
│ Diam 1:        [6"                    ] │
│ Diam 2:        [                      ] │
│ Project Qty:   [20                    ] │  ← Modificabile
│ Withdrawn Qty: [8                     ] │  ← Modificabile (manuale)
│                                         │
│ ⚠️ Yard e Site modificabili via LOG    │
│                                         │
│ [💾 Save]                    [Cancel]   │
└─────────────────────────────────────────┘
```

### 12.4 Add Row (Modal)
Stesso layout di Edit, tutti i campi vuoti.

### 12.5 Import Excel
- Pulsante "📥 Import Excel"
- Accetta file .xlsx o .csv
- Colonne mappate automaticamente
- Preview prima di conferma
- Aggiunge righe (non sovrascrive esistenti)

---

## 13. SISTEMA LOG

### 13.1 Schermata LOG (ex Movements)
Registra TUTTO:
1. **Richieste chiuse** (delivered, cancelled)
2. **Material IN** (arrivo materiale)
3. **Site IN** (arrivo da Yard a Site) - aggiorna anche withdrawn_qty
4. **Movimenti manuali** (lost, broken, adjustment)
5. **Trasferimenti** (yard→site)
6. **Check Engineering** (invio, risposte, BAL automatici)
7. **Passaggi tra schermate** (con note)

### 13.2 Visualizzazione LOG
```
┌─────────────────────────────────────────────────────────────────────┐
│ 📜 LOG                                        [+ Add Movement]      │
├─────────────────────────────────────────────────────────────────────┤
│ Filter: [All ▼]  Date: [From: ___] [To: ___]  Search: [________]   │
│                                                                     │
│ ┌─────────────────────────────────────────────────────────────────┐│
│ │Date/Time    │Type │Code       │Qty │Location    │Note          ││
│ ├─────────────┼─────┼───────────┼────┼────────────┼──────────────┤│
│ │08/12 14:30  │IN   │BOLT-M16   │+50 │YARD        │MIR-2024-001  ││
│ │08/12 12:15  │DEL  │FLANGE-150 │-10 │SITE        │Req 00015-0   ││
│ │08/12 10:00  │BAL  │GASKET-RF  │-5  │YARD (LOST) │Inventario    ││
│ │08/12 09:30  │BAL  │VALVE-DN50 │0→0 │YARD+SITE   │Check NotFound││
│ │07/12 16:45  │TRF  │PIPE-DN200 │20  │YARD→SITE   │Transfer      ││
│ └─────────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────────┘
```

### 13.3 Add Movement (Modal)
```
┌─────────────────────────────────────────┐
│ 📦 Register Movement                    │
├─────────────────────────────────────────┤
│ Type: [Lost ▼]  [Broken ▼]  [IN ▼]      │
│                                         │
│ Location: [YARD ▼]  [SITE ▼]            │
│                                         │
│ Material Code: [dropdown + search     ] │
│ Tag:           [autocomplete          ] │
│ Quantity:      [________]               │
│                                         │
│ Note*:         [________________________│  ← OBBLIGATORIO
│                ________________________]│
│                                         │
│ [✓ Register]                 [Cancel]   │
└─────────────────────────────────────────┘
```

### 13.4 Logica Quantità Movimenti
- **Tipo IN (+)**: Aggiunge quantità a location selezionata
- **Tipo Lost/Broken (-)**: Sottrae quantità da location selezionata
- Aggiorna automaticamente `qty_yard` o `qty_site` in project_database

### 13.5 Site IN e Withdrawn Qty
Quando materiale arriva da cliente tramite **Site IN**:
1. Quantità aggiunta a `qty_site` (o `qty_yard` se va in Yard)
2. **withdrawn_qty incrementato** della stessa quantità
3. Questo permette il doppio confronto con i dati del cliente

---

## 14. TEST PACK MATERIALS

### 14.1 Scopo
Gestire richieste di tipo "Test Pack" che richiedono che TUTTO il materiale sia completo prima dell'emissione.

### 14.2 Logica Richiesta Madre/Figlie
```
Richiesta Madre: 00015-0
  ├── Split 1: 00015-1 (5 pz trovati, status: TestPackReady)
  ├── Split 2: 00015-2 (3 pz da ordinare, status: Ordered)
  └── Originale: 00015-0 (2 pz in Eng, status: Eng)

TUTTE devono essere TestPackReady per poter emettere.
```

### 14.3 Schermata Test Pack Materials
```
┌─────────────────────────────────────────────────────────────────────┐
│ 📦 TEST PACK MATERIALS                                              │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│ TEST PACK: TP-2024-001                                              │
│ ┌─────────────────────────────────────────────────────────────────┐│
│ │Request │Code       │Tag │Qty│Status        │Ready│             ││
│ ├────────┼───────────┼────┼───┼──────────────┼─────┼─────────────┤│
│ │00015-0 │FLANGE-150 │    │10 │TestPackReady │ ✓   │             ││
│ │00015-1 │FLANGE-150 │    │5  │TestPackReady │ ✓   │             ││
│ │00015-2 │FLANGE-150 │    │3  │Ordered       │ ✗   │             ││
│ └─────────────────────────────────────────────────────────────────┘│
│                                                                     │
│ Status: ⚠️ 2/3 ready - Cannot emit                                 │
│                                                                     │
│ [🏭 Send to Site] [📤 To Be Collected]  ← DISABILITATI             │
│                                                                     │
├─────────────────────────────────────────────────────────────────────┤
│ TEST PACK: TP-2024-002                                              │
│ ┌─────────────────────────────────────────────────────────────────┐│
│ │00020-0 │BOLT-M16   │T01 │40 │TestPackReady │ ✓   │             ││
│ │00020-1 │BOLT-M16   │T02 │40 │TestPackReady │ ✓   │             ││
│ └─────────────────────────────────────────────────────────────────┘│
│                                                                     │
│ Status: ✅ All ready - Can emit                                     │
│                                                                     │
│ [🏭 Send to Site] [📤 To Be Collected]  ← ABILITATI                │
└─────────────────────────────────────────────────────────────────────┘
```

### 14.4 Pulsante TP nelle altre schermate
- In WH Site, WH Yard, Engineering: pulsante "TP" per marcare come TestPackReady
- Solo per richieste di tipo TestPack

---

## 15. TO BE COLLECTED

### 15.1 Logica
1. Magazziniere prepara materiale → Status = `ToCollect`
2. Record appare in sezione "To Be Collected"
3. SOLO l'utente che ha creato la richiesta vede pulsante "✓ Ritirato" attivo
4. Altri utenti vedono pulsante disabilitato con tooltip "Solo {nome} può ritirare"
5. Al ritiro: quantità sottratta da location, record va in LOG

### 15.2 Visualizzazione (in WH Site)
```
┌─────────────────────────────────────────────────────────────────────┐
│ 📤 TO BE COLLECTED                                                  │
├─────────────────────────────────────────────────────────────────────┤
│ ┌─────────────────────────────────────────────────────────────────┐│
│ │Request │Code       │Qty│Requester    │Location│Actions         ││
│ ├────────┼───────────┼───┼─────────────┼────────┼────────────────┤│
│ │00015-0 │FLANGE-150 │10 │Mario Rossi  │SITE    │[✓ Ritirato]   ││  ← Solo Mario vede attivo
│ │00018-0 │BOLT-M16   │40 │Luigi Bianchi│YARD    │[🔒 Ritirato]  ││  ← Altri vedono bloccato
│ └─────────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────────┘
```

---

## 16. SPARE PARTS

### 16.1 Flusso
1. Da Engineering: click su "Sp" (Spare Parts)
2. Appare popup con:
   - Data richiesta spare (default: oggi)
   - Data consegna prevista (obbligatoria)
3. Conferma → Status = `Spare`
4. In schermata Spare Parts: opzioni per gestire

### 16.2 Popup Spare Parts
```
┌─────────────────────────────────────────┐
│ 🔧 Spare Parts Request                  │
├─────────────────────────────────────────┤
│ Material: VALVE-GATE-DN80               │
│ Quantity: 2                             │
│                                         │
│ Request Date*:  [08/12/2025]            │
│ Expected Date*: [___________]           │
│                                         │
│ [✓ Confirm]                  [Cancel]   │
└─────────────────────────────────────────┘
```

---

## 17. ORDERS

### 17.1 Struttura Tab
```
┌─────────────────────────────────────────────────────────────────────┐
│ 🛒 ORDERS                                                           │
├─────────────────────────────────────────────────────────────────────┤
│ [Da Ordinare]  [Ordinati]  [Log Ordini]                             │
├─────────────────────────────────────────────────────────────────────┤
```

### 17.2 Tab "Da Ordinare"
Lista componenti con status = `Order`

Azioni:
- 🏢 Ordine Interno → Popup conferma
- 👤 Ordine Cliente → Popup conferma

### 17.3 Popup Conferma Ordine
```
┌─────────────────────────────────────────┐
│ 🛒 Confirm Order                        │
├─────────────────────────────────────────┤
│ Material: REDUCER-DN200-150             │
│ Quantity: 6                             │
│ Type: Internal Order                    │
│                                         │
│ Order Date*:    [08/12/2025]            │
│ Expected Date*: [___________]           │
│                                         │
│ [✓ Confirm Order]            [Cancel]   │
└─────────────────────────────────────────┘
```

### 17.4 Tab "Ordinati"
Lista componenti con status = `Ordered`

Azioni:
- ✓ Arrivato → Materiale va in Yard + record in LOG

### 17.5 Tab "Log Ordini"
Storico tutti gli ordini fatti (da order_log)

---

## 18. STORICO PASSAGGI (INFO PALLINO)

### 18.1 Funzionalità
- Ogni riga componente ha un pallino "ℹ️" alla fine
- Hover sul pallino → Popup con storico completo

### 18.2 Visualizzazione Popup
```
┌─────────────────────────────────────────┐
│ 📋 Request History: 00015-0             │
├─────────────────────────────────────────┤
│ 08/12/2025 09:00 - Created              │
│   → Sent to WH Site                     │
│   By: Mario Rossi                       │
│                                         │
│ 08/12/2025 14:30 - WH Site              │
│   → Sent to WH Yard                     │
│   By: Paolo Verdi                       │
│   Note: "Site ha 0, verificare Yard"    │
│                                         │
│ 08/12/2025 16:00 - WH Yard              │
│   → Sent to Engineering                 │
│   By: Luigi Bianchi                     │
│   Note: "Anche Yard a 0"                │
│                                         │
│ 09/12/2025 10:15 - Engineering          │
│   → Check sent to Both                  │
│   By: Anna Neri                         │
│   Message: "Verificare inventario"      │
│                                         │
│ 09/12/2025 11:30 - WH Site              │
│   → Check: Not Found                    │
│   By: Paolo Verdi                       │
│                                         │
│ 09/12/2025 12:00 - WH Yard              │
│   → Check: Resolved (Found!)            │
│   By: Luigi Bianchi                     │
│                                         │
│ 09/12/2025 12:00 - Auto                 │
│   → Transfer to Site IN                 │
│                                         │
│ 10/12/2025 09:30 - Site IN              │
│   → Arrival Confirmed                   │
│   By: Paolo Verdi                       │
│                                         │
│ 10/12/2025 10:00 - WH Site              │
│   → Ready for pickup (ToCollect)        │
│   By: Paolo Verdi                       │
└─────────────────────────────────────────┘
```

### 18.3 In LOG
Quando la richiesta è completata, lo storico rimane visibile anche nella schermata LOG.

---

## 19. BUG FIX E MIGLIORAMENTI UI

### 19.1 Sidebar Collapse Fix
**Problema**: Quando sidebar è collassata, manca pulsante per espanderla.

**Soluzione**: 
- Pulsante "←" (collapse) / "→" (expand) SEMPRE visibile
- Posizione: in alto nella sidebar

```
Sidebar Expanded:          Sidebar Collapsed:
┌──────────────────┐       ┌────┐
│ [STR] MAX STR [←]│       │[→] │
├──────────────────┤       ├────┤
│ 📊 Dashboard     │       │ 📊 │
│ 📋 Requests      │       │ 📋 │
│ ...              │       │ ...│
└──────────────────┘       └────┘
```

### 19.2 Titolo Applicazione
- Rimuovere "V25" da tutti i posti
- Titolo: "MAX STREICHER - Materials Manager"

### 19.3 Rinomina Campi
| Vecchio | Nuovo |
|---------|-------|
| ISO Drawing | ISO Number |
| Spool | Full Spool Number |
| Movements | LOG |
| Ready OUT | To Be Collected |

### 19.4 Preview Numero Richiesta
- Mostrare in form: "Preview: 00001-0 (not saved)"
- Numero incrementa solo dopo salvataggio

---

## 20. IMPORT/EXPORT DATI

### 20.1 Import Database (Excel)
- Solo Admin
- Formato accettato: .xlsx, .csv
- Colonne richieste:
  - iso_number
  - full_spool_number (opzionale)
  - ident_code
  - tag (opzionale)
  - description (opzionale)
  - diam1 (opzionale)
  - diam2 (opzionale)
  - prj_qty (opzionale, default: 0)
  - withdrawn_qty (opzionale, default: 0)

### 20.2 Template Import
Fornire template Excel con:
- Header corretti
- Esempi dati
- Note su formati

### 20.3 Logica Import
1. Upload file
2. Preview dati (prime 10 righe)
3. Mapping colonne (se necessario)
4. Conferma
5. Insert in database (no overwrite)

---

## 21. RESPONSIVE DESIGN (TABLET)

### 21.1 Target Devices
- iPad (10-11")
- Android tablet (8-10")

### 21.2 Breakpoints
```css
/* Desktop */
@media (min-width: 1024px) { ... }

/* Tablet */
@media (min-width: 768px) and (max-width: 1023px) { ... }

/* Mobile */
@media (max-width: 767px) { ... }
```

### 21.3 Adattamenti Tablet
- Sidebar: default collapsed, swipe per aprire
- Tabelle: scroll orizzontale se necessario
- Pulsanti azione: più grandi per touch (min 44x44px)
- Form: layout verticale invece che grid
- Modal: full-width su schermi piccoli

---

## 22. UTENTI DEMO

### 22.1 Admin
```
Username: admin
Password: admin123
Full Name: Amministratore
Badge: ADM001
Role: admin
Permessi: ALL = modify
```

### 22.2 User 1 - Warehouse Site
```
Username: mario.rossi
Password: pass123
Full Name: Mario Rossi
Badge: MR001
Role: user
Permessi:
  - dashboard: read
  - requests: modify
  - wh_site: modify
  - wh_yard: read
  - site_in: modify
  - engineering: none
  - others: none/read
```

### 22.3 User 2 - Warehouse Yard + Engineering
```
Username: luigi.bianchi
Password: pass123
Full Name: Luigi Bianchi
Badge: LB002
Role: user
Permessi:
  - dashboard: read
  - requests: modify
  - wh_site: read
  - wh_yard: modify
  - engineering: modify
  - site_in: read
  - others: none/read
```

---

## APPENDICE A: MAPPING COLONNE IMPORT

| Colonna Excel/CSV | Colonna DB | Obbligatorio |
|-------------------|------------|--------------|
| ISO Number / ISO_NUM | iso_number | ✅ |
| Full Spool Number / SPOOL | full_spool_number | ❌ |
| Ident Code / IDENT_CODE | ident_code | ✅ |
| Tag / TAG | tag | ❌ |
| Description / DESC | description | ❌ |
| Dia1 / DIAM1 | diam1 | ❌ |
| Dia2 / DIAM2 | diam2 | ❌ |
| UoM | uom | ❌ (default: PCS) |
| Pos Qty / PRJ_QTY | prj_qty | ❌ (default: 0) |
| Withdrawn / WTD_QTY | withdrawn_qty | ❌ (default: 0) |

---

## APPENDICE B: COLORI APPLICAZIONE

| Nome | Hex | Uso |
|------|-----|-----|
| Primary (STREICHER Red) | `#E31E24` | Brand, azioni principali |
| Primary Dark | `#B91C1C` | Hover |
| Secondary | `#1F2937` | Sidebar, Yard |
| Success | `#16a34a` | Conferme, disponibile, Risolto |
| Warning | `#D97706` | Split, attenzione |
| Info (Site) | `#2563EB` | Site, informazioni, Altro |
| Purple (Engineering) | `#7C3AED` | Engineering, Check |
| Pink (Spare) | `#EC4899` | Spare Parts |
| Cyan (Client) | `#0891B2` | Client |
| Orange (Lost/NotFound) | `#EA580C` | Lost, Non Trovato |
| Gray | `#6B7280` | Disabled, return, Chiudi |

---

## APPENDICE C: STATUS BADGE COLORS

| Status | Background | Text |
|--------|------------|------|
| Site | `#2563EB` | white |
| Yard | `#1F2937` | white |
| Trans | `#D97706` | white |
| Eng | `#7C3AED` | white |
| Spare | `#EC4899` | white |
| Mng | `#CA8A04` | white |
| Order | `#EA580C` | white |
| Ordered | `#0891B2` | white |
| ToCollect | `#16a34a` | white |
| TestPackReady | `#059669` | white |
| Done | `#6B7280` | white |

---

## APPENDICE D: CHECKLIST SVILUPPO

### Fase 1: Setup Base
- [ ] Schema database Supabase
- [ ] Struttura React base
- [ ] Sistema login/autenticazione
- [ ] Sidebar con permessi

### Fase 2: Core Features
- [ ] Dashboard con KPI
- [ ] Form nuova richiesta (Piping/Mechanical/TestPack)
- [ ] WH Site con tutte le azioni
- [ ] WH Yard con tutte le azioni
- [ ] Engineering con sistema Check

### Fase 3: Workflow Avanzati
- [ ] Sistema Check Engineering ↔ Warehouse
- [ ] Popup nota passaggi
- [ ] Site IN con withdrawn_qty
- [ ] To Be Collected con blocco utente
- [ ] Test Pack Materials

### Fase 4: Gestione Dati
- [ ] CRUD Database
- [ ] Import Excel
- [ ] Sistema LOG completo
- [ ] Storico passaggi (info pallino)

### Fase 5: Finalizzazione
- [ ] Spare Parts con popup date
- [ ] Orders con popup conferma
- [ ] Management
- [ ] MIR
- [ ] Responsive tablet
- [ ] Bug fix sidebar

---

**Fine Documento Specifiche**

**Versione**: 2.0 FINAL
**Data**: Dicembre 2024
**Autore**: Claude (Anthropic) per Giuseppe
**Progetto**: MAX STREICHER Materials Manager
