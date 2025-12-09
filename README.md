# 📦 MATERIALS MANAGER - FILE DI SVILUPPO
## MAX STREICHER Edition

---

## 📁 CONTENUTO DEL PACCHETTO

| File | Descrizione |
|------|-------------|
| `01_SUPABASE_SCHEMA.sql` | Schema database completo da eseguire su Supabase |
| `02_GUIDA_SETUP.md` | Guida passo-passo per il setup completo |
| `03_IMPORT_TEMPLATE.csv` | Template CSV per importare dati inventario |
| `src/App.jsx` | Applicazione React completa |
| `MATERIALS_MANAGER_SPECIFICATIONS_FINAL.md` | Documento di specifiche completo |

---

## 🚀 QUICK START

### 1. Setup Supabase (5 minuti)
1. Vai su https://supabase.com e crea account
2. Crea nuovo progetto "materials-manager"
3. Vai in SQL Editor
4. Copia tutto il contenuto di `01_SUPABASE_SCHEMA.sql`
5. Clicca "Run"
6. Salva le credenziali API da Project Settings → API

### 2. Setup Vercel (10 minuti)
1. Crea repository GitHub con questi file:
   - `index.html` (vedi guida)
   - `package.json` (vedi guida)
   - `vite.config.js` (vedi guida)
   - `src/main.jsx` (vedi guida)
   - `src/App.jsx` (file fornito)
2. Vai su https://vercel.com
3. Importa il repository
4. Aggiungi variabili ambiente:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
5. Clicca "Deploy"

### 3. Test
Login con: `admin` / `admin123`

---

## 📋 CREDENZIALI DEMO

| Username | Password | Ruolo |
|----------|----------|-------|
| admin | admin123 | Admin (accesso completo) |
| mario.rossi | pass123 | WH Site |
| luigi.bianchi | pass123 | WH Yard + Engineering |
| anna.verdi | pass123 | Engineering + Management |

---

## ⚠️ NOTE IMPORTANTI

1. **Supabase Free Tier**: Il progetto va in pausa dopo 1 settimana di inattività. Accedi regolarmente!
2. **Password in chiaro**: In produzione, usa bcrypt per hashare le password
3. **Pagine placeholder**: Alcune pagine sono ancora in fase di sviluppo

---

## 📞 SUPPORTO

Leggi la guida `02_GUIDA_SETUP.md` per istruzioni dettagliate.
