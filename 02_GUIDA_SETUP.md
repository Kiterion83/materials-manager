# 📚 GUIDA SETUP COMPLETA - PASSO PER PASSO
## Materials Manager - MAX STREICHER Edition

---

## 📋 INDICE

1. [Prerequisiti](#1-prerequisiti)
2. [Setup Supabase](#2-setup-supabase)
3. [Setup Progetto React](#3-setup-progetto-react)
4. [Configurazione Variabili Ambiente](#4-configurazione-variabili-ambiente)
5. [Deploy su Vercel](#5-deploy-su-vercel)
6. [Import Dati Excel](#6-import-dati-excel)
7. [Test dell'Applicazione](#7-test-dellapplicazione)
8. [Troubleshooting](#8-troubleshooting)

---

## 1. PREREQUISITI

### Cosa ti serve:
- ✅ Un account GitHub (gratuito)
- ✅ Un account Supabase (gratuito)
- ✅ Un account Vercel (gratuito)
- ✅ Un browser moderno (Chrome, Firefox, Edge)

### File che ti fornisco:
1. `01_SUPABASE_SCHEMA.sql` - Schema database completo
2. `02_APP_COMPLETE.jsx` - Applicazione React completa
3. `03_IMPORT_TEMPLATE.xlsx` - Template per import dati
4. `MATERIALS_MANAGER_SPECIFICATIONS_FINAL.md` - Documentazione

---

## 2. SETUP SUPABASE

### STEP 2.1: Crea Account Supabase
1. Vai su https://supabase.com
2. Clicca "Start your project"
3. Accedi con GitHub (consigliato) o crea account email

### STEP 2.2: Crea Nuovo Progetto
1. Clicca "New Project"
2. Compila i campi:
   - **Name**: `materials-manager`
   - **Database Password**: scegli una password SICURA e SALVALA!
   - **Region**: `West EU (Ireland)` (più vicino all'Italia)
3. Clicca "Create new project"
4. ASPETTA 2-3 minuti che il progetto sia pronto

### STEP 2.3: Esegui lo Schema SQL
1. Nel menu a sinistra, clicca su **"SQL Editor"** (icona </> )
2. Clicca su **"New query"**
3. Apri il file `01_SUPABASE_SCHEMA.sql`
4. **COPIA TUTTO** il contenuto
5. **INCOLLA** nell'editor SQL di Supabase
6. Clicca il pulsante verde **"Run"** (o premi Ctrl+Enter)
7. Aspetta che appaia "Success. No rows returned"

### STEP 2.4: Verifica le Tabelle
1. Nel menu a sinistra, clicca su **"Table Editor"**
2. Dovresti vedere queste tabelle:
   - ✅ users (4 righe - utenti demo)
   - ✅ project_database (15 righe - materiali demo)
   - ✅ requests (vuota)
   - ✅ request_components (vuota)
   - ✅ component_history (vuota)
   - ✅ movements (vuota)
   - ✅ log_requests (vuota)
   - ✅ mirs (vuota)
   - ✅ mir_items (vuota)
   - ✅ order_log (vuota)
   - ✅ counters (1 riga)

### STEP 2.5: Ottieni le Credenziali API
1. Nel menu a sinistra, clicca su **"Project Settings"** (icona ingranaggio ⚙️)
2. Clicca su **"API"** nel sottomenu
3. Copia questi due valori (ti serviranno dopo):

```
Project URL: https://xxxxxxxxxxxxx.supabase.co
anon public key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.xxxxx...
```

**⚠️ IMPORTANTE**: Salva questi valori in un posto sicuro!

---

## 3. SETUP PROGETTO REACT

### STEP 3.1: Crea Repository GitHub

**Opzione A: Da GitHub (consigliata per principianti)**
1. Vai su https://github.com
2. Clicca "+" in alto a destra → "New repository"
3. Nome: `materials-manager`
4. Seleziona "Public" o "Private"
5. ✅ Spunta "Add a README file"
6. Clicca "Create repository"

**Opzione B: Da terminale (per esperti)**
```bash
mkdir materials-manager
cd materials-manager
git init
```

### STEP 3.2: Struttura del Progetto
Il tuo progetto deve avere questa struttura:

```
materials-manager/
├── index.html
├── package.json
├── vite.config.js
├── .env                    ← NON committare su GitHub!
├── .gitignore
└── src/
    ├── main.jsx
    └── App.jsx             ← Il file principale
```

### STEP 3.3: Crea i File Base

#### FILE: `package.json`
```json
{
  "name": "materials-manager",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "@supabase/supabase-js": "^2.39.0"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.2.0",
    "vite": "^5.0.0"
  }
}
```

#### FILE: `vite.config.js`
```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist'
  }
})
```

#### FILE: `index.html`
```html
<!DOCTYPE html>
<html lang="it">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>MAX STREICHER - Materials Manager</title>
    <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect fill='%23E31E24' width='100' height='100' rx='20'/><text x='50' y='65' font-size='50' fill='white' text-anchor='middle' font-weight='bold'>MS</text></svg>" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

#### FILE: `src/main.jsx`
```javascript
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
```

#### FILE: `.gitignore`
```
node_modules
dist
.env
.env.local
.env.*.local
*.log
```

#### FILE: `.env` (NON committare!)
```
VITE_SUPABASE_URL=https://TUO_PROJECT_URL.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.TUA_KEY_QUI
```

### STEP 3.4: Copia App.jsx
1. Prendi il file `02_APP_COMPLETE.jsx` che ti fornisco
2. Rinominalo in `App.jsx`
3. Mettilo nella cartella `src/`

---

## 4. CONFIGURAZIONE VARIABILI AMBIENTE

### Per Sviluppo Locale
1. Crea il file `.env` nella root del progetto
2. Inserisci le tue credenziali Supabase:
```
VITE_SUPABASE_URL=https://abcdefghijk.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Per Vercel (Produzione)
Lo configurerai nel passo successivo durante il deploy.

---

## 5. DEPLOY SU VERCEL

### STEP 5.1: Collega GitHub a Vercel
1. Vai su https://vercel.com
2. Clicca "Sign Up" → "Continue with GitHub"
3. Autorizza Vercel ad accedere ai tuoi repository

### STEP 5.2: Importa il Progetto
1. Clicca "Add New..." → "Project"
2. Trova `materials-manager` nella lista
3. Clicca "Import"

### STEP 5.3: Configura le Variabili Ambiente
1. Nella schermata di configurazione, scorri fino a **"Environment Variables"**
2. Aggiungi le due variabili:

| Name | Value |
|------|-------|
| `VITE_SUPABASE_URL` | `https://TUO_URL.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | `eyJhbGci...` (la tua chiave completa) |

3. Clicca "Add" per ognuna

### STEP 5.4: Deploy
1. Clicca "Deploy"
2. Aspetta 1-2 minuti
3. Vedrai "Congratulations! Your project is now live"
4. Clicca sul link per vedere la tua app! 🎉

### STEP 5.5: URL della Tua App
La tua app sarà disponibile a:
- `https://materials-manager-TUO_USERNAME.vercel.app`

Puoi anche configurare un dominio personalizzato.

---

## 6. IMPORT DATI EXCEL

### STEP 6.1: Prepara il File Excel
1. Apri il template `03_IMPORT_TEMPLATE.xlsx`
2. Compila le righe con i tuoi dati
3. Salva come **CSV UTF-8**:
   - File → Salva con nome
   - Tipo: "CSV UTF-8 (delimitato da virgole)"

### STEP 6.2: Importa in Supabase
1. Vai su Supabase → Table Editor
2. Seleziona la tabella `project_database`
3. Clicca "Insert" → "Import data from CSV"
4. Trascina il tuo file CSV
5. Verifica il mapping delle colonne
6. Clicca "Import"

### Colonne del Template

| Colonna Excel | Colonna DB | Obbligatorio | Note |
|---------------|------------|--------------|------|
| ISO Number | iso_number | ✅ | Es: I181C02-DF21065-0-01 |
| Full Spool Number | full_spool_number | ❌ | Es: I181C02-DF21065-0-01-SP001 |
| Ident Code | ident_code | ✅ | Codice materiale |
| Tag | tag | ❌ | Per duplicati |
| Description | description | ❌ | Descrizione |
| Diam 1 | diam1 | ❌ | Primo diametro |
| Diam 2 | diam2 | ❌ | Secondo diametro |
| UoM | uom | ❌ | Default: PCS |
| Project Qty | prj_qty | ❌ | Default: 0 |
| Withdrawn Qty | withdrawn_qty | ❌ | Default: 0 |
| Qty Yard | qty_yard | ❌ | Default: 0 |
| Qty Site | qty_site | ❌ | Default: 0 |

---

## 7. TEST DELL'APPLICAZIONE

### Credenziali di Test

| Username | Password | Ruolo | Accesso |
|----------|----------|-------|---------|
| `admin` | `admin123` | Admin | Tutto |
| `mario.rossi` | `pass123` | User | WH Site, Site IN |
| `luigi.bianchi` | `pass123` | User | WH Yard, Engineering |
| `anna.verdi` | `pass123` | User | Engineering, Management |

### Checklist Test

1. ✅ **Login**: Accedi con `admin` / `admin123`
2. ✅ **Dashboard**: Verifica che mostri i dati
3. ✅ **Nuova Richiesta**: Crea una richiesta Piping
4. ✅ **WH Site**: Vedi la richiesta, prova le azioni
5. ✅ **Passaggio a Yard**: Usa il popup nota
6. ✅ **WH Yard**: Vedi la richiesta trasferita
7. ✅ **Engineering**: Prova il sistema Check
8. ✅ **LOG**: Verifica che le azioni siano registrate
9. ✅ **Database**: Vedi l'inventario
10. ✅ **MIR**: Crea un nuovo MIR con categoria

---

## 8. TROUBLESHOOTING

### Problema: "Failed to fetch" o errori di rete
**Soluzione**:
1. Verifica che le variabili ambiente siano corrette
2. Controlla che Supabase non sia in pausa (accedi ogni settimana)
3. Verifica la connessione internet

### Problema: "Invalid API Key"
**Soluzione**:
1. Vai su Supabase → Settings → API
2. Copia nuovamente la chiave `anon public`
3. Aggiorna la variabile in Vercel
4. Rideploya

### Problema: Tabelle vuote dopo import
**Soluzione**:
1. Verifica che il CSV sia in UTF-8
2. Controlla che le colonne corrispondano
3. Prova con un file più piccolo prima

### Problema: App non si carica
**Soluzione**:
1. Apri Console del browser (F12)
2. Guarda gli errori nella tab "Console"
3. Se vedi "CORS", verifica le impostazioni Supabase

### Problema: Login non funziona
**Soluzione**:
1. Verifica che la tabella `users` abbia gli utenti
2. Controlla username e password (case-sensitive!)
3. Prova con l'utente admin

### Problema: Supabase in pausa
**Nota**: Nel piano gratuito, Supabase mette in pausa i progetti dopo 1 settimana di inattività.
**Soluzione**:
1. Vai su Supabase Dashboard
2. Clicca "Restore project"
3. Aspetta 1-2 minuti

---

## 📞 SUPPORTO

Se hai problemi:
1. Rileggi questa guida passo per passo
2. Controlla la sezione Troubleshooting
3. Verifica le credenziali Supabase
4. Controlla la console del browser per errori

---

## ✅ CHECKLIST FINALE

Prima di considerare il setup completo, verifica:

- [ ] Supabase: Progetto creato
- [ ] Supabase: Schema SQL eseguito senza errori
- [ ] Supabase: Tabelle create (11 tabelle)
- [ ] Supabase: Utenti demo presenti (4 utenti)
- [ ] Supabase: Dati demo presenti (15+ materiali)
- [ ] GitHub: Repository creato
- [ ] GitHub: Tutti i file caricati
- [ ] Vercel: Progetto importato
- [ ] Vercel: Variabili ambiente configurate
- [ ] Vercel: Deploy completato con successo
- [ ] App: Login funziona
- [ ] App: Dashboard mostra dati
- [ ] App: Puoi creare richieste

**Se tutto è ✅, hai finito! 🎉**
