// ============================================================
// MATERIALS MANAGER V32.5 - APP.JSX COMPLETE
// MAX STREICHER Edition - Full Features - ALL ENGLISH
// V32.5 Changes:
//   - TestPack Number Format: MAX-TP-XXXX (fixed prefix + 4 digits)
//   - TestPack Form: Input shows "MAX-TP-" prefix fixed, user enters only 4 digits
//   - HF Page: Exclude TestPack requests (only Piping/Erection)
//   - TestPack Erection: HF column visible in table
//   - TestPack Log: Delete button available
//   - TestPack Log: Click on stats boxes to filter list
// V32.4 Changes:
//   - Add New Item: ISO + initial quantities (Site, Yard, Lost, Broken)
//   - Request Tracker: Mother number shown, child number on hover tooltip
//   - Request Tracker: Last Update column with date/time, ordered by most recent
//   - Orders Badge: Shows To Order + Ordered count
//   - Place Order: Added Quantity field, only Yard destination
//   - Ordered: Removed "Received → Site" option (only Yard)
//   - Partial Split: Allow qty == total when Not Found = None
//   - WH Yard Partial: Better validation, allow full qty with None
// V32.3 Changes:
//   - Sub-category visible in Requests material list (colored badge)
//   - Ready/Partial logic: Ready only when qty==site_qty
//   - To TestPack available even partial (to freeze material)
//   - Request Tracker: Previous Status column + distinct colors
//   - Request Tracker: Shows 4-level request number
//   - Site IN Receive: Enhanced logging + closes Yard sibling for Both
//   - STATUS_COLORS: Distinct colors for each status
// V32.2 Changes:
//   - Fixed: 4-level request number format (XXXXX-LL-SS-PP) everywhere
//   - Fixed: sub_category propagated from component in Both requests
//   - Fixed: Ident code input converts to UPPERCASE automatically
//   - Fixed: Badge counts exclude 'Both' parent items (match table display)
//   - Enhanced: displayRequestNumber always generates 4-level format
// V32.1 Changes:
//   - Both with Visibility: Site/Yard see each other's sent qty
//   - New columns: "Site Sent" / "Yard Sent" + "Da Trovare"
//   - Magazzinieri decide: To TP / Partial (no Eng consolidation)
//   - Yard → Site IN: Material transits through Site IN to TP
//   - Auto-cancel: When one WH completes, other's request disappears
//   - Labels: 3 new labels (Site→TP, Yard→SiteIN, TP ToCollect)
//   - Partial Modal: Enhanced with Found/Not Found destinations
// V32.0 Changes:
//   - Request Numbering: 4-level system XXXXX-LL-SS-PP
//     - LL = level_component (00-99)
//     - SS = level_wh_split (00=none, 01=Site, 02=Yard)
//     - PP = level_yard_split (00=none, 01+=sub-split)
//   - Engineering Checks: "Found (All)" disabled when qty < requested
//   - Send to Both: Creates parallel sub-requests for Site and Yard
//   - Partial from Yard: Auto-creates not-found sub-request in Eng
//   - sent_to tracking: Both → Site/Yard → (complete)
// V31.0 Changes:
//   - MIR Page: Generate RK Document (📄) - auto-fills template with MIR/RK numbers and date
//   - MIR Page: Download tracking - records who downloaded and when
//   - MIR Page: Info icon (ℹ️) shows download history on hover
//   - RK Template: Uses docx template with placeholder substitution
//   - Database: Added rk_downloaded_at, rk_downloaded_by, rk_downloaded_by_name to mirs table
// V30.0 Changes:
//   - Database: Added parent_request_number for mother/child request tracking
//   - Partial Split: Sub-requests now link to mother request via parent_request_number
//   - TestPack: Counts include ALL sub-requests of the same mother request
//   - TestPack Log: Complete redesign with 6 counters (Full/Partial × ToCollect/Collected/Completed)
//   - TestPack Log: Search by TP# and detailed list of all TestPacks
//   - HF Log: Complete redesign with counters and delivered HF list
//   - HF Tab Materials: Now shows count of unique HF numbers (not total components)
//   - Spool Icon: Changed from 🔧 to tube/pipe icon (⊜)
//   - Management: ActionDropdown with Internal, Client, Delete, Return options
//   - Print Label: Now shows TP# and HF# in preview modal
//   - Info Icon (ℹ️): Red when request has description/note, Blue otherwise
// V29.0 Changes:
//   - Dashboard: Fixed TestPack/HF counts to match Sidebar badges
//   - Labels: New 🏷️ column in Site IN, To Collect, Orders (Ordered tab)
//   - Labels: Print popup with all request info, status, partial indicator
//   - Labels: Added Requester name to printed label
//   - Request Tracker: Fixed Requester column (loads names for old requests without created_by_name)
//   - All Pages: Enriched old requests with requester names from users table
//   - WH Yard: Removed "To HF" / "To TestPack" - material must go through Site IN first
//   - WH Yard: "Found → Site IN" available for ALL items including HF/TP
//   - WH Site: "To HF" / "To TP" only if qty_site >= qty_requested
//   - WH Yard: "Partial" if qty_yard < qty_requested
//   - Request Form: Redesigned like Material IN (inline search results)
//   - Request Form: Clears completely after + Add
//   - TestPack Badge: Counts unique test_pack_numbers (not components/requests)
//   - HF Badge: Counts unique hf_numbers (not components/requests)
//   - Partial Split: Already validates max = available inventory
// V28.12 Changes:
//   - TestPack Spool: New sub-category 'Spool' for ordering spools from supplier
//   - Engineering: "Sent to Site" action for Spool items → status = 'TP_Spool_Sent'
//   - TestPack: 🔧 Spool section shows spool status (In Engineering / Sent to Site)
//   - No inventory decrement for Spool items (they come from external supplier)
//   - Sub-category abbreviation: SP for Spool
//   - HF Page: Complete redesign like TestPack (Materials/Log tabs, inventory columns)
//   - HF Page: Shows items in Engineering for monitoring
//   - HF Page: Delivery only when ALL components ready (no partial)
//   - WH Site/Yard: "Ready" DISABLED for HF/TP items - must use "To HF" / "To TP"
// V28.11 Changes:
//   - TestPack: Request number display shows sub_number (00051-0)
//   - TestPack: Components removed from TP when delivered/sent to site
//   - TestPack: Inventory decrement on delivery
// V28.9 Changes:
//   - Engineering Page: Added WH_Site and WH_Yard columns, removed Partial action
//   - Site IN: Fixed dropdown (uses ActionDropdown, no scrollbar)
//   - HF Page: Added Actions dropdown with Delete option
//   - TestPack Page: Complete rewrite with sub-category grouping
//     - Shows all components (any status) grouped by TP → Request → SubCategory
//     - Delivery per sub-category when all items ready
//     - "Deliver All" only when all items across all sub-categories ready
// V28.8 Changes:
//   - Engineering Checks: Added WH_Site and WH_Yard columns
//   - Engineering Checks: Actions conditional on inventory availability
//   - Engineering Checks: Added "To Yard" / "To Site" options
//   - Removed redundant "Notes from Engineering" section in WH Site
//   - Partial modals: Show both SITE and YARD availability
// V28.7 Changes:
//   - Split Partial Modal: Complete redesign like "Partial Split"
//   - Actions To HF/TestPack: Only visible if HF/TP columns are not empty
//   - To Collect page: Renamed from "To Be Collected", dropdown fix
//   - Partial destinations include HF/TP options conditionally
// V28.6 Changes:
//   - MIR Alert: ⚠️ column when forecast_date is overdue
//   - Engineering Check: To HF/TestPack options if originated from HF/TP
//   - Action disabling: Based on site_qty/yard_qty availability
//   - Role-based permissions: admin, engineering, wh_site, wh_yard, foreman, management, buyer
//   - previous_status tracking for Engineering checks
// V28.5 Changes:
//   - Dashboard navigation: clickable boxes go to respective pages
//   - IB movements fix: SQL functions create movements + update inventory
//   - Site IN actions: Receive/Delete/Return dropdown with previous_status
//   - To Collect actions: Collect/Delete/Return dropdown
//   - Over quantity logic: sum ALL open requests vs available inventory
//   - P121 filter: ISO search limited to P121 project
// ============================================================

import React, { useState, useEffect, useCallback } from 'react';
import { createClient } from '@supabase/supabase-js';

// ============================================================
// SUPABASE CONFIGURATION
// ============================================================
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// ============================================================
// APP VERSION - CENTRALIZED
// ============================================================
const APP_VERSION = 'V32.5';

// ============================================================
// CONSTANTS AND CONFIGURATION
// ============================================================
const COLORS = {
  primary: '#E31E24',
  primaryDark: '#B91C1C',
  secondary: '#1F2937',
  success: '#16a34a',
  warning: '#D97706',
  info: '#2563EB',
  purple: '#7C3AED',
  pink: '#EC4899',
  cyan: '#0891B2',
  orange: '#EA580C',
  gray: '#6B7280',
  yellow: '#CA8A04',
  teal: '#0D9488',
  alertRed: '#FEE2E2'
};

// ============================================================
// V28 UTILITY FUNCTIONS
// ============================================================
function isOverdue(forecastDate) {
  if (!forecastDate) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const forecast = new Date(forecastDate);
  forecast.setHours(0, 0, 0, 0);
  return today > forecast;
}

// V28.11: Abbreviation helpers for compact display
function abbrevCategory(cat) {
  if (!cat) return '-';
  const map = {
    'Piping': 'P',
    'Mechanical': 'M',
    'TestPack': 'TP'
  };
  return map[cat] || cat.substring(0, 2).toUpperCase();
}

function abbrevSubCategory(sub) {
  if (!sub) return '-';
  // V32.1: Case-insensitive matching
  const normalized = sub.toLowerCase();
  const map = {
    'erection': 'E',
    'support': 'S',
    'instrument': 'I',
    'bulk': 'B',
    'spool': 'SP'  // V28.11: Spool sub-category
  };
  return map[normalized] || sub.substring(0, 1).toUpperCase();
}

function abbrevSpool(spool) {
  if (!spool) return '-';
  // Return last 5 characters
  return spool.length > 5 ? spool.slice(-5) : spool;
}

// V28.6: Role-based permission helper
// Roles: admin, engineering, management (full access), wh_site, wh_yard, foreman, buyer
function canModifyPage(user, page) {
  if (!user) return false;
  const role = user.role?.toLowerCase();
  
  // Admin, Engineering and Management can modify everything
  if (role === 'admin' || role === 'engineering' || role === 'management') return true;
  
  // Role-specific permissions
  switch(page) {
    case 'requests':
      return role === 'foreman';
    case 'wh_site':
    case 'site_in':
    case 'to_be_collected':
      return role === 'wh_site';
    case 'wh_yard':
      return role === 'wh_yard';
    // V28.10: Both WH Site and WH Yard can access HF and TestPack
    case 'hf':
    case 'testpack':
      return role === 'wh_site' || role === 'wh_yard';
    case 'orders':
      return role === 'buyer';
    default:
      return false;
  }
}

// ============================================================
// V32.0: 4-Level Request Numbering System Helper Functions
// Format: XXXXX-LL-SS-PP (base-component-wh_split-yard_split)
// ============================================================

// Parse request_number_full into components
function parseRequestNumber(requestNumberFull) {
  if (!requestNumberFull) return { base: 0, component: 0, whSplit: 0, yardSplit: 0 };
  const parts = String(requestNumberFull).split('-');
  return {
    base: parseInt(parts[0]) || 0,
    component: parseInt(parts[1]) || 0,
    whSplit: parseInt(parts[2]) || 0,
    yardSplit: parseInt(parts[3]) || 0
  };
}

// Format request number from components
function formatRequestNumber(base, component = 0, whSplit = 0, yardSplit = 0) {
  return `${String(base).padStart(5, '0')}-${String(component).padStart(2, '0')}-${String(whSplit).padStart(2, '0')}-${String(yardSplit).padStart(2, '0')}`;
}

// Get display version of request number (ALWAYS shows 4-level format)
function displayRequestNumber(request, showFull = true) {
  // If request_number_full exists, use it
  if (request?.request_number_full) {
    return request.request_number_full;
  }
  // Always generate 4-level format
  const base = String(request?.request_number || 0).padStart(5, '0');
  const comp = String(request?.level_component ?? request?.sub_number ?? 0).padStart(2, '0');
  const wh = String(request?.level_wh_split ?? 0).padStart(2, '0');
  const yard = String(request?.level_yard_split ?? 0).padStart(2, '0');
  return `${base}-${comp}-${wh}-${yard}`;
}

// V32.3: Show mother request number only (XXXXX-00-00-00)
function displayMotherNumber(request) {
  const base = String(request?.request_number || 0).padStart(5, '0');
  return `${base}-00-00-00`;
}

// V32.3: Get full child number for tooltip
function getChildNumber(request) {
  if (request?.request_number_full) {
    return request.request_number_full;
  }
  const base = String(request?.request_number || 0).padStart(5, '0');
  const comp = String(request?.level_component ?? request?.sub_number ?? 0).padStart(2, '0');
  const wh = String(request?.level_wh_split ?? 0).padStart(2, '0');
  const yard = String(request?.level_yard_split ?? 0).padStart(2, '0');
  return `${base}-${comp}-${wh}-${yard}`;
}

// Short display version (just base-component for tables)
function displayRequestNumberShort(request) {
  const reqNum = String(request?.request_number || 0).padStart(5, '0');
  const subNum = String(request?.sub_number ?? request?.level_component ?? 0);
  return `${reqNum}-${subNum}`;
}

// Check if this is a sub-request (has parent)
function isSubRequest(request) {
  return request?.parent_request_id || 
         request?.level_component > 0 || 
         request?.level_wh_split > 0 || 
         request?.level_yard_split > 0;
}

// V31.0: RK Document Template URL
// Option 1: Put RK_0020_TEMPLATE.docx in public folder and use '/RK_0020_TEMPLATE.docx'
// Option 2: Upload to Supabase Storage and use the public URL
const RK_TEMPLATE_URL = '/RK_0020_TEMPLATE.docx';

// V31.0: Generate RK Document function
// Uses JSZip to modify the DOCX template and replace placeholders
async function generateRKDocument(mirNumber, rkNumber, description, onProgress) {
  try {
    if (onProgress) onProgress('Loading template...');
    
    // Load JSZip dynamically if not available
    if (typeof JSZip === 'undefined') {
      await new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js';
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
      });
    }
    
    // Fetch template
    const response = await fetch(RK_TEMPLATE_URL);
    if (!response.ok) {
      alert(`Template not found!\n\nPlease upload RK_0020_TEMPLATE.docx to:\n1. The public folder of your project, OR\n2. Supabase Storage and update RK_TEMPLATE_URL`);
      return null;
    }
    const templateBlob = await response.blob();
    
    if (onProgress) onProgress('Processing document...');
    
    // Load ZIP
    const zip = await JSZip.loadAsync(templateBlob);
    
    // Get document.xml
    let docXml = await zip.file('word/document.xml').async('string');
    
    // Get current date parts
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const year = String(today.getFullYear());
    
    // ============================================================
    // Simple approach: Find and replace specific text patterns
    // The template has these placeholders:
    // 1. XX/XX/XXXX - header date (single node)
    // 2. RDCG/MIRS + XXXX + /0 - in row 1 (three nodes)
    // 3. RK0020_ + XXXX - in Remarks (two nodes)  
    // 4. Date: + XX + / + XX + / + XXXX - Section A date (split nodes)
    // ============================================================
    
    // STEP 1: Header date XX/XX/XXXX -> DD/MM/YYYY
    docXml = docXml.replace(/<w:t>XX\/XX\/XXXX<\/w:t>/g, `<w:t>${day}/${month}/${year}</w:t>`);
    
    // STEP 2: MIRS number - the text RDCG/MIRS followed by XXXX in next node
    // If MIR exists, just replace the XXXX node after MIRS
    // Template structure: <w:t>RDCG/MIRS</w:t></w:r><w:r...><...><w:t>XXXX</w:t></w:r><w:r...><w:t>/0</w:t>
    if (mirNumber) {
      // Find RDCG/MIRS and replace the XXXX that follows
      const mirsPattern = /RDCG\/MIRS<\/w:t><\/w:r>(<w:r[^>]*>(?:<[^>]*>)*<w:t>)XXXX(<\/w:t>)/;
      docXml = docXml.replace(mirsPattern, `RDCG/MIRS</w:t></w:r>$1${mirNumber}$2`);
    } else {
      // No MIR (Mechanical) - replace RDCG/MIRS with description and remove XXXX and /0
      const descText = (description || 'MECHANICAL').substring(0, 25);
      // Replace RDCG/MIRS with description
      docXml = docXml.replace(/<w:t>RDCG\/MIRS<\/w:t>/, `<w:t>${descText}</w:t>`);
      // Remove the XXXX that was after (now it's after description) - keep the run but empty text
      docXml = docXml.replace(/(<w:t>)XXXX(<\/w:t><\/w:r><w:r[^>]*>(?:<[^>]*>)*<w:t>)\/0(<\/w:t>)/, '$1$2$3');
    }
    
    // V32.3: STEP 2b: If description exists, replace DESC_PLACEHOLDER in row 2
    if (description && description.trim() && mirNumber) {
      const descriptionText = description.substring(0, 50); // Limit length for cell width
      // Simple text replacement for the placeholder
      docXml = docXml.replace(/DESC_PLACEHOLDER/g, descriptionText);
    } else {
      // Remove placeholder if no description
      docXml = docXml.replace(/DESC_PLACEHOLDER/g, '');
    }
    
    // STEP 3: RK number - RK0020_ followed by XXXX
    const rkPattern = /RK0020_<\/w:t><\/w:r>(<w:r[^>]*>(?:<[^>]*>)*<w:t>)XXXX(<\/w:t>)/;
    docXml = docXml.replace(rkPattern, `RK0020_</w:t></w:r>$1${rkNumber}$2`);
    
    // STEP 4: Section A date - Date: followed by XX / XX / XXXX in separate nodes
    // Find the pattern where Date: is followed by XX then / then XX then / then XXXX
    // We need to replace these individually
    
    // The pattern in the template is:
    // <w:t>Date:</w:t></w:r><w:r...><w:t>XX</w:t></w:r><w:r...><w:t>/</w:t></w:r><w:r...><w:t>XX</w:t></w:r><w:r...><w:t>/</w:t></w:r><w:r...><w:t>XXXX</w:t>
    
    // Strategy: Find Date: and then replace the XX and XXXX that follow before the next section
    // Use a marker to identify we're in the right section
    
    const datePattern = /(Date:<\/w:t><\/w:r><w:r[^>]*>(?:<[^>]*>)*<w:t>)XX(<\/w:t><\/w:r><w:r[^>]*>(?:<[^>]*>)*<w:t>\/<\/w:t><\/w:r><w:r[^>]*>(?:<[^>]*>)*<w:t>)XX(<\/w:t><\/w:r><w:r[^>]*>(?:<[^>]*>)*<w:t>\/<\/w:t><\/w:r><w:r[^>]*>(?:<[^>]*>)*<w:t>)XXXX(<\/w:t>)/;
    docXml = docXml.replace(datePattern, `$1${day}$2${month}$3${year}$4`);
    
    // Save modified document.xml
    zip.file('word/document.xml', docXml);
    
    if (onProgress) onProgress('Generating file...');
    
    // Generate new DOCX
    const newDocx = await zip.generateAsync({ type: 'blob' });
    
    // Create download link
    const url = URL.createObjectURL(newDocx);
    const a = document.createElement('a');
    a.href = url;
    a.download = `RK0020_${rkNumber}.docx`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    return true;
  } catch (error) {
    console.error('Error generating RK document:', error);
    alert('Error generating document: ' + error.message);
    return false;
  }
}

function SearchBox({ value, onChange, placeholder = 'Search...' }) {
  return (
    <div style={{ marginBottom: '16px' }}>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          padding: '10px 16px',
          border: '1px solid #d1d5db',
          borderRadius: '8px',
          fontSize: '14px',
          width: '300px',
          outline: 'none'
        }}
      />
    </div>
  );
}

function OverdueBadge() {
  return (
    <span style={{
      backgroundColor: '#EF4444',
      color: 'white',
      padding: '2px 8px',
      borderRadius: '4px',
      fontSize: '11px',
      fontWeight: 'bold',
      marginLeft: '8px'
    }}>
      ⚠️ OVERDUE
    </span>
  );
}

// Over Quantity Info Button - shows tooltip with over-qty note on hover
function OverQtyInfo({ note }) {
  const [showTooltip, setShowTooltip] = useState(false);
  
  if (!note) return null;
  
  return (
    <span
      style={{ position: 'relative', display: 'inline-block', cursor: 'pointer', marginLeft: '4px' }}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <span style={{
        backgroundColor: COLORS.warning,
        color: 'white',
        borderRadius: '50%',
        width: '18px',
        height: '18px',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '10px',
        fontWeight: 'bold'
      }}>!</span>
      {showTooltip && (
        <div style={{
          position: 'absolute',
          bottom: '100%',
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: '#1f2937',
          color: 'white',
          padding: '8px 12px',
          borderRadius: '6px',
          fontSize: '12px',
          whiteSpace: 'nowrap',
          zIndex: 1000,
          marginBottom: '4px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.2)'
        }}>
          ⚠️ {note}
        </div>
      )}
    </span>
  );
}

// Status Badge Component for Request Tracker
function StatusBadge({ status }) {
  const color = STATUS_COLORS[status] || COLORS.gray;
  return (
    <span style={{
      backgroundColor: color,
      color: 'white',
      padding: '2px 8px',
      borderRadius: '4px',
      fontSize: '11px',
      fontWeight: '500'
    }}>
      {status || '-'}
    </span>
  );
}

// Note Icon with hover tooltip - V28.2
function NoteIcon({ note }) {
  const [showTooltip, setShowTooltip] = useState(false);
  
  if (!note) return null;
  
  return (
    <span
      style={{ position: 'relative', display: 'inline-block', cursor: 'pointer' }}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <span style={{
        backgroundColor: '#FEF3C7',
        padding: '4px 8px',
        borderRadius: '4px',
        fontSize: '14px'
      }}>📝</span>
      {showTooltip && (
        <div style={{
          position: 'absolute',
          bottom: '100%',
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: '#1f2937',
          color: 'white',
          padding: '8px 12px',
          borderRadius: '6px',
          fontSize: '12px',
          whiteSpace: 'pre-wrap',
          maxWidth: '250px',
          zIndex: 1000,
          marginBottom: '4px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.2)'
        }}>
          {note}
        </div>
      )}
    </span>
  );
}

// V28.2: Print Requests Preview Button
function PrintRequestsButton({ requests }) {
  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    const today = new Date().toLocaleDateString();
    
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Materials Manager - Requests List</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; font-size: 12px; }
          h1 { color: #E31E24; font-size: 18px; margin-bottom: 5px; }
          h2 { color: #666; font-size: 14px; margin-top: 0; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { border: 1px solid #ddd; padding: 6px 8px; text-align: left; }
          th { background-color: #1f2937; color: white; font-size: 11px; }
          tr:nth-child(even) { background-color: #f9fafb; }
          .status { padding: 2px 6px; border-radius: 3px; color: white; font-size: 10px; }
          .status-done { background-color: #16a34a; }
          .status-wh { background-color: #2563eb; }
          .status-eng { background-color: #7c3aed; }
          .status-other { background-color: #6b7280; }
          @media print { body { padding: 10px; } }
        </style>
      </head>
      <body>
        <h1>MAX STREICHER - Materials Manager</h1>
        <h2>Requests List - ${today}</h2>
        <table>
          <thead>
            <tr>
              <th>Request #</th>
              <th>Type</th>
              <th>TP#</th>
              <th>HF</th>
              <th>Code</th>
              <th>Description</th>
              <th>Qty</th>
              <th>Status</th>
              <th>Requester</th>
            </tr>
          </thead>
          <tbody>
            ${requests.map(r => `
              <tr>
                <td style="font-weight:bold;">${String(r.requests?.request_number || r.request_number || '').padStart(5, '0')}-${r.requests?.sub_number || r.sub_number || 0}</td>
                <td>${r.requests?.request_type || r.request_type || '-'}</td>
                <td>${r.requests?.test_pack_number || r.test_pack_number || '-'}</td>
                <td>${r.requests?.hf_number || r.hf_number || '-'}</td>
                <td style="font-family:monospace;font-size:10px;">${r.ident_code || '-'}</td>
                <td style="max-width:200px;">${(r.description || '').substring(0, 50)}</td>
                <td>${r.quantity || '-'}</td>
                <td><span class="status ${r.status === 'Done' ? 'status-done' : r.status?.includes('WH') ? 'status-wh' : r.status === 'Eng' ? 'status-eng' : 'status-other'}">${r.status || '-'}</span></td>
                <td>${r.requests?.created_by_name || '-'}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        <p style="margin-top:20px;color:#666;font-size:10px;">Total: ${requests.length} requests - Printed from Materials Manager ${APP_VERSION}</p>
      </body>
      </html>
    `;
    
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => printWindow.print(), 500);
  };
  
  return (
    <button 
      onClick={handlePrint}
      style={{
        ...styles.button,
        backgroundColor: COLORS.secondary,
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        gap: '6px'
      }}
    >
      🖨️ Print Preview
    </button>
  );
}

// V28.3: Generic Print Table Button for all pages
function PrintTableButton({ title, columns, data, fileName }) {
  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    const today = new Date().toLocaleDateString();
    
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>${title} - Materials Manager</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; font-size: 11px; }
          h1 { color: #E31E24; font-size: 16px; margin-bottom: 5px; }
          h2 { color: #666; font-size: 12px; margin-top: 0; font-weight: normal; }
          table { width: 100%; border-collapse: collapse; margin-top: 15px; }
          th, td { border: 1px solid #ddd; padding: 4px 6px; text-align: left; }
          th { background-color: #1f2937; color: white; font-size: 10px; }
          tr:nth-child(even) { background-color: #f9fafb; }
          .mono { font-family: monospace; }
          .alert { color: #DC2626; font-weight: bold; }
          @media print { body { print-color-adjust: exact; -webkit-print-color-adjust: exact; } }
        </style>
      </head>
      <body>
        <h1>MAX STREICHER - ${title}</h1>
        <h2>Generated: ${today} | Total: ${data.length} items</h2>
        <table>
          <thead>
            <tr>${columns.map(c => `<th>${c.header}</th>`).join('')}</tr>
          </thead>
          <tbody>
            ${data.map(row => `<tr>${columns.map(c => `<td class="${c.mono ? 'mono' : ''} ${c.alert && c.alert(row) ? 'alert' : ''}">${c.render ? c.render(row) : (row[c.key] || '-')}</td>`).join('')}</tr>`).join('')}
          </tbody>
        </table>
      </body>
      </html>
    `;
    
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => printWindow.print(), 500);
  };
  
  return (
    <button 
      onClick={handlePrint}
      style={{
        ...styles.button,
        backgroundColor: COLORS.purple,
        color: 'white',
        fontSize: '12px',
        padding: '6px 12px',
        display: 'flex',
        alignItems: 'center',
        gap: '4px'
      }}
      title={`Print ${title}`}
    >
      🖨️ Print
    </button>
  );
}

const STATUS_COLORS = {
  WH_Site: COLORS.info,
  Yard: COLORS.secondary,
  Trans: COLORS.warning,
  Eng: COLORS.purple,
  Eng_Both: '#9333EA', // Viola più scuro per Both
  Spare: COLORS.pink,
  Mng: COLORS.yellow,
  Order: COLORS.orange,
  Ordered: COLORS.cyan,
  ToCollect: COLORS.success,
  HF: COLORS.teal,
  TP: '#059669', // Verde smeraldo per TP
  TP_Spool_Sent: '#10B981', // Verde chiaro per Spool Sent
  Done: COLORS.success, // Verde per Done
  Cancelled: COLORS.primary, // Rosso per Cancelled
  Deleted: '#6B7280' // Grigio per Deleted
};

const MIR_CATEGORIES = ['Erection', 'Bulk', 'Instrument', 'Support'];
const MIR_PRIORITIES = ['High', 'Medium', 'Low'];
const REQUEST_TYPES = ['Piping', 'Mechanical', 'TestPack'];
const SUB_CATEGORIES = ['Bulk', 'Erection', 'Support', 'Instrument'];
const MOVEMENT_TYPES = ['IN', 'OUT', 'LOST', 'BROKEN', 'BAL', 'TRANSFER'];

// ============================================================
// STILI GLOBALI
// ============================================================
const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    backgroundColor: '#f3f4f6',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  },
  sidebar: {
    width: '256px',
    backgroundColor: COLORS.secondary,
    display: 'flex',
    flexDirection: 'column',
    transition: 'width 0.3s ease'
  },
  sidebarCollapsed: {
    width: '64px'
  },
  logo: {
    padding: '16px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    borderBottom: '1px solid #374151'
  },
  logoIcon: {
    width: '40px',
    height: '40px',
    borderRadius: '8px',
    objectFit: 'cover'
  },
  nav: {
    flex: 1,
    padding: '16px 0',
    overflowY: 'auto'
  },
  navItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 16px',
    color: '#9ca3af',
    cursor: 'pointer',
    transition: 'all 0.2s',
    borderLeft: '4px solid transparent'
  },
  navItemActive: {
    backgroundColor: 'rgba(227, 30, 36, 0.2)',
    borderLeftColor: COLORS.primary,
    color: 'white'
  },
  main: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden'
  },
  header: {
    backgroundColor: 'white',
    padding: '16px 24px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  content: {
    flex: 1,
    padding: '24px',
    overflowY: 'auto'
  },
  card: {
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    overflow: 'hidden'
  },
  cardHeader: {
    padding: '16px',
    borderBottom: '1px solid #e5e7eb',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse'
  },
  th: {
    padding: '12px 16px',
    textAlign: 'left',
    fontSize: '12px',
    fontWeight: '500',
    color: '#6b7280',
    backgroundColor: '#f9fafb',
    borderBottom: '1px solid #e5e7eb'
  },
  td: {
    padding: '12px 16px',
    borderBottom: '1px solid #e5e7eb',
    fontSize: '14px'
  },
  button: {
    padding: '8px 16px',
    borderRadius: '6px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    transition: 'all 0.2s'
  },
  buttonPrimary: {
    backgroundColor: COLORS.primary,
    color: 'white'
  },
  buttonSecondary: {
    backgroundColor: '#f3f4f6',
    color: '#374151'
  },
  input: {
    width: '100%',
    padding: '10px 12px',
    borderRadius: '6px',
    border: '1px solid #d1d5db',
    fontSize: '14px',
    outline: 'none',
    boxSizing: 'border-box'
  },
  select: {
    width: '100%',
    padding: '10px 12px',
    borderRadius: '6px',
    border: '1px solid #d1d5db',
    fontSize: '14px',
    outline: 'none',
    backgroundColor: 'white',
    boxSizing: 'border-box'
  },
  label: {
    display: 'block',
    marginBottom: '6px',
    fontSize: '14px',
    fontWeight: '500',
    color: '#374151'
  },
  statusBadge: {
    padding: '4px 8px',
    borderRadius: '4px',
    color: 'white',
    fontSize: '11px',
    fontWeight: '500',
    display: 'inline-block'
  },
  actionButton: {
    width: '32px',
    height: '32px',
    borderRadius: '4px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontSize: '12px',
    fontWeight: 'bold',
    cursor: 'pointer',
    border: 'none',
    transition: 'transform 0.2s'
  }
};

// ============================================================
// COMPONENTI DI UTILITÀ
// ============================================================
function Modal({ isOpen, onClose, title, children, wide }) {
  if (!isOpen) return null;
  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }} onClick={onClose}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '24px',
        maxWidth: wide ? '900px' : '500px',
        width: '90%',
        maxHeight: '85vh',
        overflow: 'auto'
      }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '600' }}>{title}</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: '#6b7280' }}>×</button>
        </div>
        {children}
      </div>
    </div>
  );
}

function ActionButton({ color, onClick, disabled, children, title, style = {} }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      style={{
        ...styles.actionButton,
        backgroundColor: disabled ? '#d1d5db' : color,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.6 : 1,
        ...style
      }}
    >
      {children}
    </button>
  );
}

// ============================================================
// ACTION DROPDOWN - V27.2 - Dropdown select + Execute button
// ============================================================
function ActionDropdown({ actions, onExecute, disabled, componentId }) {
  const [selectedAction, setSelectedAction] = useState('');
  
  const handleExecute = () => {
    if (selectedAction && onExecute) {
      onExecute(selectedAction);
      setSelectedAction('');
    }
  };
  
  return (
    <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
      <select
        value={selectedAction}
        onChange={(e) => setSelectedAction(e.target.value)}
        disabled={disabled}
        style={{
          padding: '6px 8px',
          borderRadius: '4px',
          border: '1px solid #d1d5db',
          fontSize: '12px',
          backgroundColor: disabled ? '#f3f4f6' : 'white',
          cursor: disabled ? 'not-allowed' : 'pointer',
          minWidth: '120px'
        }}
      >
        <option value="">Select action...</option>
        {actions.map(action => (
          <option key={action.id} value={action.id}>{action.icon} {action.label}</option>
        ))}
      </select>
      <button
        onClick={handleExecute}
        disabled={disabled || !selectedAction}
        style={{
          padding: '6px 12px',
          borderRadius: '4px',
          border: 'none',
          backgroundColor: selectedAction ? COLORS.info : '#d1d5db',
          color: 'white',
          fontSize: '12px',
          fontWeight: '600',
          cursor: (disabled || !selectedAction) ? 'not-allowed' : 'pointer',
          opacity: (disabled || !selectedAction) ? 0.6 : 1
        }}
      >
        Go
      </button>
    </div>
  );
}

function StatBox({ title, value, color, subtitle }) {
  return (
    <div style={{
      padding: '24px',
      borderRadius: '8px',
      backgroundColor: color,
      color: 'white'
    }}>
      <h3 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px', opacity: 0.9 }}>{title}</h3>
      <p style={{ fontSize: '32px', fontWeight: 'bold' }}>{value}</p>
      {subtitle && <p style={{ fontSize: '12px', opacity: 0.75, marginTop: '4px' }}>{subtitle}</p>}
    </div>
  );
}

// ============================================================
// V29.0 LABEL PRINT MODAL - Print labels for materials
// V32.1: Enhanced with Both request info (Site IN shows qty requested, Site sent, Yard sending)
// ============================================================
function LabelPrintModal({ isOpen, onClose, component }) {
  if (!isOpen || !component) return null;

  // V32.1: Get Both request info if available
  const isBothRequest = component._isBoth || false;
  const originalQty = component._originalQty || component.quantity;
  const siteSent = component._siteSent || 0;
  const yardSending = component.quantity;
  const totalSentSoFar = siteSent + yardSending;
  const remaining = originalQty - totalSentSoFar;
  
  // V32.1: Always use 4-level format
  const requestNumberDisplay = displayRequestNumber(component.requests);

  const printLabel = () => {
    const printWindow = window.open('', '_blank', 'width=400,height=600');
    const labelContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Material Label</title>
        <style>
          @page { size: 100mm 70mm; margin: 0; }
          body { 
            font-family: Arial, sans-serif; 
            padding: 8px;
            margin: 0;
            width: 100mm;
            height: 70mm;
            box-sizing: border-box;
          }
          .label-container {
            border: 2px solid #000;
            padding: 6px;
            height: calc(100% - 4px);
            box-sizing: border-box;
          }
          .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 2px solid #000;
            padding-bottom: 4px;
            margin-bottom: 4px;
          }
          .logo { font-weight: bold; font-size: 12px; color: #E31E24; }
          .status { 
            padding: 2px 6px; 
            background: ${component.status === 'Trans' ? '#2563EB' : component.status === 'ToCollect' ? '#16a34a' : '#D97706'}; 
            color: white; 
            border-radius: 4px; 
            font-size: 10px;
            font-weight: bold;
          }
          .request-num { 
            font-size: 14px; 
            font-weight: bold; 
            text-align: center; 
            margin: 4px 0;
            font-family: monospace;
          }
          .info-grid { 
            display: grid; 
            grid-template-columns: 1fr 1fr; 
            gap: 3px; 
            font-size: 9px;
            margin-bottom: 4px;
          }
          .info-item { 
            padding: 2px 4px; 
            background: #f3f4f6; 
            border-radius: 2px;
          }
          .info-label { font-weight: bold; color: #666; }
          .code { 
            font-family: monospace; 
            font-size: 10px; 
            font-weight: bold;
            background: #1F2937;
            color: white;
            padding: 3px 5px;
            border-radius: 3px;
            text-align: center;
            margin: 3px 0;
          }
          .description {
            font-size: 8px;
            color: #374151;
            text-align: center;
            margin: 2px 0;
            max-height: 18px;
            overflow: hidden;
          }
          .qty { 
            font-size: 20px; 
            font-weight: bold; 
            text-align: center;
            color: #E31E24;
            margin: 4px 0;
          }
          .both-info {
            background: #EFF6FF;
            border: 1px solid #2563EB;
            padding: 4px;
            font-size: 8px;
            border-radius: 3px;
            margin: 4px 0;
          }
          .both-info div { margin: 1px 0; }
          .partial { 
            background: #FEF3C7; 
            border: 1px solid #F59E0B;
            padding: 2px 4px;
            font-size: 9px;
            text-align: center;
            border-radius: 3px;
            color: #92400E;
            margin-top: 3px;
          }
          .footer {
            font-size: 7px;
            color: #9ca3af;
            text-align: center;
            margin-top: 3px;
          }
        </style>
      </head>
      <body>
        <div class="label-container">
          <div class="header">
            <span class="logo">MAX STREICHER</span>
            <span class="status">${component.status === 'Trans' ? (isBothRequest ? '🚚 YARD → SITE IN' : 'SITE IN') : component.status === 'ToCollect' ? 'TO COLLECT' : component.status === 'Ordered' ? 'ORDERED' : component.status}</span>
          </div>
          
          <div class="request-num">${requestNumberDisplay}</div>
          
          <div class="info-grid">
            <div class="info-item"><span class="info-label">Cat:</span> ${component.requests?.request_type || component.request_type || '-'}</div>
            <div class="info-item"><span class="info-label">Sub:</span> ${component.sub_category || component.requests?.sub_category || '-'}</div>
            <div class="info-item"><span class="info-label">ISO:</span> ${component.requests?.iso_number || component.iso_number || '-'}</div>
            <div class="info-item"><span class="info-label">Spool:</span> ${component.requests?.full_spool_number || component.full_spool_number || '-'}</div>
            ${component.requests?.hf_number ? `<div class="info-item" style="background:#F0FDFA;border:1px solid #14B8A6;"><span class="info-label">HF:</span> ${component.requests.hf_number}</div>` : ''}
            ${component.requests?.test_pack_number ? `<div class="info-item" style="background:#F3E8FF;border:1px solid #A855F7;"><span class="info-label">TP:</span> ${component.requests.test_pack_number}</div>` : ''}
          </div>
          
          <div style="font-size: 8px; text-align: center; margin-bottom: 2px; color: #374151;">
            <span style="font-weight: bold;">Requester:</span> ${component.requests?.created_by_name || '-'}
          </div>
          
          <div class="code">${component.ident_code || '-'}</div>
          <div class="description">${component.description ? (component.description.length > 50 ? component.description.substring(0, 50) + '...' : component.description) : '-'}</div>
          
          <div class="qty">🚚 ${component.quantity} pz</div>
          
          ${isBothRequest ? `
          <div class="both-info">
            <div><strong>Totale Richiesto:</strong> ${originalQty} pz</div>
            <div><strong>WH Site inviato:</strong> ${siteSent > 0 ? '✅ ' + siteSent + ' pz' : '⏳ in attesa'}</div>
            <div><strong>WH Yard (questo):</strong> 🚚 ${yardSending} pz</div>
            <div><strong>Totale inviato:</strong> ${totalSentSoFar} di ${originalQty}</div>
          </div>
          ${remaining > 0 ? `<div class="partial">⚠️ PARZIALE - Mancano ancora ${remaining} pz</div>` : ''}
          ` : ''}
          
          ${!isBothRequest && (component.is_partial || component.requests?.is_partial) ? '<div class="partial">⚠️ PARTIAL DELIVERY</div>' : ''}
          
          <div class="footer">Printed: ${new Date().toLocaleString()}</div>
        </div>
      </body>
      </html>
    `;
    printWindow.document.write(labelContent);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 250);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="🏷️ Print Label">
      <div style={{ textAlign: 'center' }}>
        <div style={{ 
          border: '2px solid #d1d5db', 
          borderRadius: '8px', 
          padding: '16px',
          marginBottom: '16px',
          backgroundColor: '#f9fafb'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontWeight: 'bold', color: COLORS.primary }}>MAX STREICHER</span>
            <span style={{ 
              padding: '4px 12px', 
              backgroundColor: component.status === 'Trans' ? COLORS.info : component.status === 'ToCollect' ? COLORS.success : COLORS.warning,
              color: 'white',
              borderRadius: '4px',
              fontSize: '12px',
              fontWeight: 'bold'
            }}>
              {component.status === 'Trans' ? (isBothRequest ? '🚚 YARD → SITE IN' : 'SITE IN') : component.status === 'ToCollect' ? 'TO COLLECT' : component.status === 'Ordered' ? 'ORDERED' : component.status}
            </span>
          </div>
          
          <div style={{ fontSize: '20px', fontWeight: 'bold', fontFamily: 'monospace', marginBottom: '12px' }}>
            {requestNumberDisplay}
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '12px', marginBottom: '12px' }}>
            <div style={{ padding: '4px 8px', backgroundColor: '#e5e7eb', borderRadius: '4px' }}>
              <strong>Cat:</strong> {component.requests?.request_type || '-'}
            </div>
            <div style={{ padding: '4px 8px', backgroundColor: '#e5e7eb', borderRadius: '4px' }}>
              <strong>Sub:</strong> {component.sub_category || component.requests?.sub_category || '-'}
            </div>
            {component.requests?.test_pack_number && (
              <div style={{ padding: '4px 8px', backgroundColor: '#F3E8FF', borderRadius: '4px', border: '1px solid #A855F7' }}>
                <strong>TP#:</strong> {component.requests.test_pack_number}
              </div>
            )}
            {component.requests?.hf_number && (
              <div style={{ padding: '4px 8px', backgroundColor: '#F0FDFA', borderRadius: '4px', border: '1px solid #14B8A6' }}>
                <strong>HF#:</strong> {component.requests.hf_number}
              </div>
            )}
          </div>
          
          <div style={{ fontSize: '11px', textAlign: 'center', marginBottom: '8px', color: '#374151' }}>
            <strong>Requester:</strong> {component.requests?.created_by_name || '-'}
          </div>
          
          <div style={{ 
            backgroundColor: COLORS.secondary, 
            color: 'white', 
            padding: '8px', 
            borderRadius: '4px',
            fontFamily: 'monospace',
            fontWeight: 'bold',
            marginBottom: '8px'
          }}>
            {component.ident_code}
          </div>
          
          <div style={{ fontSize: '11px', color: '#6b7280', marginBottom: '8px' }}>
            {component.description ? (component.description.length > 50 ? component.description.substring(0, 50) + '...' : component.description) : '-'}
          </div>
          
          <div style={{ fontSize: '28px', fontWeight: 'bold', color: COLORS.primary }}>
            🚚 {component.quantity} pz
          </div>
          
          {/* V32.1: Both request info panel */}
          {isBothRequest && (
            <div style={{ 
              marginTop: '12px',
              padding: '12px', 
              backgroundColor: '#EFF6FF',
              border: '1px solid #2563EB',
              borderRadius: '8px',
              fontSize: '13px',
              textAlign: 'left'
            }}>
              <div style={{ fontWeight: 'bold', color: '#1E40AF', marginBottom: '8px', textAlign: 'center' }}>
                📦 Info Both Request
              </div>
              <div style={{ display: 'grid', gap: '4px' }}>
                <div><strong>Totale Richiesto:</strong> <span style={{ color: '#7C3AED', fontWeight: 'bold' }}>{originalQty} pz</span></div>
                <div><strong>WH Site inviato:</strong> <span style={{ color: siteSent > 0 ? '#16a34a' : '#9CA3AF', fontWeight: 'bold' }}>{siteSent > 0 ? `✅ ${siteSent} pz` : '⏳ in attesa'}</span></div>
                <div><strong>WH Yard (questo):</strong> <span style={{ color: '#EA580C', fontWeight: 'bold' }}>🚚 {yardSending} pz</span></div>
                <div style={{ borderTop: '1px solid #93C5FD', paddingTop: '4px', marginTop: '4px' }}>
                  <strong>Totale inviato:</strong> <span style={{ fontWeight: 'bold' }}>{totalSentSoFar} di {originalQty}</span>
                </div>
              </div>
              {remaining > 0 && (
                <div style={{ 
                  marginTop: '8px',
                  padding: '4px 8px', 
                  backgroundColor: '#FEF3C7',
                  border: '1px solid #F59E0B',
                  borderRadius: '4px',
                  color: '#92400E',
                  fontSize: '12px',
                  textAlign: 'center'
                }}>
                  ⚠️ PARZIALE - Mancano ancora {remaining} pz
                </div>
              )}
            </div>
          )}
          
          {!isBothRequest && (component.is_partial || component.requests?.is_partial) && (
            <div style={{ 
              marginTop: '8px',
              padding: '4px 12px', 
              backgroundColor: '#FEF3C7',
              border: '1px solid #F59E0B',
              borderRadius: '4px',
              color: '#92400E',
              fontSize: '12px'
            }}>
              ⚠️ PARTIAL DELIVERY
            </div>
          )}
        </div>
        
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <button onClick={onClose} style={{ ...styles.button, ...styles.buttonSecondary }}>
            Cancel
          </button>
          <button onClick={printLabel} style={{ ...styles.button, backgroundColor: COLORS.info, color: 'white' }}>
            🖨️ Print Label
          </button>
        </div>
      </div>
    </Modal>
  );
}

// ============================================================
// V32.1: BOTH LABELS - Labels for Send to Both workflow
// ============================================================

// Label A: WH Site → TestPack (for segregation)
function printLabelSiteToTP(component, user, yardSent, totalQty) {
  const printWindow = window.open('', '_blank', 'width=400,height=500');
  const isPending = yardSent < totalQty - component.quantity;
  const labelContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Site to TP Label</title>
      <style>
        @page { size: 100mm 70mm; margin: 0; }
        body { font-family: Arial, sans-serif; padding: 8px; margin: 0; width: 100mm; height: 70mm; box-sizing: border-box; }
        .label { border: 2px solid #000; padding: 8px; height: calc(100% - 4px); box-sizing: border-box; }
        .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #000; padding-bottom: 4px; margin-bottom: 6px; }
        .logo { font-weight: bold; font-size: 12px; }
        .status { padding: 2px 8px; background: #8B5CF6; color: white; border-radius: 4px; font-size: 10px; font-weight: bold; }
        .tp-num { font-size: 14px; font-weight: bold; text-align: center; margin: 4px 0; color: #7C3AED; }
        .request-num { font-size: 11px; text-align: center; font-family: monospace; margin: 4px 0; }
        .code { font-family: monospace; font-size: 12px; font-weight: bold; background: #1F2937; color: white; padding: 4px; border-radius: 4px; text-align: center; margin: 4px 0; }
        .qty { font-size: 22px; font-weight: bold; text-align: center; color: #E31E24; margin: 6px 0; }
        .pending { background: #FEF3C7; border: 1px solid #F59E0B; padding: 4px; font-size: 9px; text-align: center; border-radius: 4px; color: #92400E; margin: 4px 0; }
        .complete { background: #D1FAE5; border: 1px solid #16a34a; padding: 4px; font-size: 9px; text-align: center; border-radius: 4px; color: #065F46; margin: 4px 0; }
        .tracking { font-size: 8px; border-top: 1px solid #ccc; padding-top: 4px; margin-top: 4px; }
        .tracking div { margin: 2px 0; }
        .footer { font-size: 7px; color: #9ca3af; text-align: center; margin-top: 4px; }
      </style>
    </head>
    <body>
      <div class="label">
        <div class="header">
          <span class="logo">MAX STREICHER</span>
          <span class="status">📦 TO TESTPACK</span>
        </div>
        <div class="tp-num">TP: ${component.requests?.test_pack_number || '-'}</div>
        <div class="code">${component.ident_code || '-'}</div>
        <div style="font-size: 8px; text-align: center; color: #374151; margin: 2px 0;">${component.description ? (component.description.length > 40 ? component.description.substring(0, 40) + '...' : component.description) : '-'}</div>
        <div class="qty">${component.quantity} pz</div>
        ${isPending ? `
          <div class="pending">⏳ PARZIALE - In attesa da WH Yard</div>
        ` : `
          <div class="complete">✅ COMPLETO</div>
        `}
        <div class="tracking">
          <div><strong>Madre:</strong> ${component.requests?.parent_request_number || component.requests?.request_number || '-'}</div>
          <div><strong>Figlio:</strong> ${component.requests?.request_number_full || '-'}</div>
          <div><strong>Richiedente:</strong> ${component.requests?.created_by_name || '-'}</div>
        </div>
        <div class="footer">Stampato: ${new Date().toLocaleString()} | Op: ${user?.full_name || '-'}</div>
      </div>
    </body>
    </html>
  `;
  printWindow.document.write(labelContent);
  printWindow.document.close();
  printWindow.focus();
  setTimeout(() => printWindow.print(), 250);
}

// Label B: WH Yard → Site IN (material in transit for TestPack)
function printLabelYardToSiteIN(component, user, siteSent, totalQty, notFoundQty = 0) {
  const printWindow = window.open('', '_blank', 'width=400,height=500');
  const totalSentSoFar = siteSent + component.quantity;
  const remaining = totalQty - totalSentSoFar - notFoundQty;
  const labelContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Yard to Site IN Label</title>
      <style>
        @page { size: 100mm 70mm; margin: 0; }
        body { font-family: Arial, sans-serif; padding: 8px; margin: 0; width: 100mm; height: 70mm; box-sizing: border-box; }
        .label { border: 2px solid #000; padding: 8px; height: calc(100% - 4px); box-sizing: border-box; }
        .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #000; padding-bottom: 4px; margin-bottom: 6px; }
        .logo { font-weight: bold; font-size: 12px; }
        .status { padding: 2px 8px; background: #2563EB; color: white; border-radius: 4px; font-size: 10px; font-weight: bold; }
        .dest { font-size: 11px; text-align: center; margin: 4px 0; color: #1E40AF; }
        .tp-num { font-size: 12px; font-weight: bold; text-align: center; margin: 4px 0; color: #7C3AED; }
        .code { font-family: monospace; font-size: 12px; font-weight: bold; background: #1F2937; color: white; padding: 4px; border-radius: 4px; text-align: center; margin: 4px 0; }
        .qty { font-size: 22px; font-weight: bold; text-align: center; color: #E31E24; margin: 6px 0; }
        .summary { background: #F3F4F6; border: 1px solid #D1D5DB; padding: 4px; font-size: 8px; border-radius: 4px; margin: 4px 0; }
        .summary div { margin: 1px 0; }
        .warning { background: #FEF3C7; border: 1px solid #F59E0B; padding: 3px; font-size: 8px; text-align: center; border-radius: 4px; color: #92400E; margin: 4px 0; }
        .tracking { font-size: 8px; border-top: 1px solid #ccc; padding-top: 4px; margin-top: 4px; }
        .tracking div { margin: 2px 0; }
        .footer { font-size: 7px; color: #9ca3af; text-align: center; margin-top: 4px; }
      </style>
    </head>
    <body>
      <div class="label">
        <div class="header">
          <span class="logo">MAX STREICHER</span>
          <span class="status">🚚 YARD → SITE IN</span>
        </div>
        <div class="dest">Destinazione: SITE IN → TestPack</div>
        <div class="tp-num">TP: ${component.requests?.test_pack_number || '-'}</div>
        <div class="code">${component.ident_code || '-'}</div>
        <div style="font-size: 8px; text-align: center; color: #374151; margin: 2px 0;">${component.description ? (component.description.length > 40 ? component.description.substring(0, 40) + '...' : component.description) : '-'}</div>
        <div class="qty">${component.quantity} pz</div>
        <div class="summary">
          <div><strong>Richiesti:</strong> ${totalQty}</div>
          <div><strong>WH Site inviato:</strong> ${siteSent}</div>
          <div><strong>WH Yard (questo):</strong> ${component.quantity}</div>
          <div><strong>Totale inviato:</strong> ${totalSentSoFar} di ${totalQty}</div>
          ${notFoundQty > 0 ? `<div style="color: #DC2626;"><strong>❌ Not Found:</strong> ${notFoundQty} → Engineering</div>` : ''}
        </div>
        ${remaining > 0 ? `<div class="warning">⚠️ PARZIALE - Mancano ancora ${remaining} pz</div>` : ''}
        <div class="tracking">
          <div><strong>Madre:</strong> ${component.requests?.parent_request_number || component.requests?.request_number || '-'}</div>
          <div><strong>Figlio:</strong> ${component.requests?.request_number_full || '-'}</div>
          <div><strong>Richiedente:</strong> ${component.requests?.created_by_name || '-'}</div>
        </div>
        <div class="footer">Stampato: ${new Date().toLocaleString()} | Op: ${user?.full_name || '-'}</div>
      </div>
    </body>
    </html>
  `;
  printWindow.document.write(labelContent);
  printWindow.document.close();
  printWindow.focus();
  setTimeout(() => printWindow.print(), 250);
}

// Label C: TestPack To Collect (final label when component goes to ToCollect)
function printLabelTPToCollect(component, user, siteSentQty = 0, yardSentQty = 0) {
  const printWindow = window.open('', '_blank', 'width=400,height=500');
  const labelContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>TP To Collect Label</title>
      <style>
        @page { size: 100mm 70mm; margin: 0; }
        body { font-family: Arial, sans-serif; padding: 8px; margin: 0; width: 100mm; height: 70mm; box-sizing: border-box; }
        .label { border: 2px solid #000; padding: 8px; height: calc(100% - 4px); box-sizing: border-box; }
        .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #000; padding-bottom: 4px; margin-bottom: 6px; }
        .logo { font-weight: bold; font-size: 12px; }
        .status { padding: 2px 8px; background: #16a34a; color: white; border-radius: 4px; font-size: 10px; font-weight: bold; }
        .tp-num { font-size: 16px; font-weight: bold; text-align: center; margin: 6px 0; color: #7C3AED; }
        .code { font-family: monospace; font-size: 12px; font-weight: bold; background: #1F2937; color: white; padding: 4px; border-radius: 4px; text-align: center; margin: 4px 0; }
        .qty { font-size: 24px; font-weight: bold; text-align: center; color: #16a34a; margin: 8px 0; }
        .complete { background: #D1FAE5; border: 1px solid #16a34a; padding: 4px; font-size: 9px; text-align: center; border-radius: 4px; color: #065F46; margin: 4px 0; }
        .source { background: #F3F4F6; border: 1px solid #D1D5DB; padding: 4px; font-size: 8px; border-radius: 4px; margin: 4px 0; }
        .source div { margin: 1px 0; }
        .tracking { font-size: 8px; border-top: 1px solid #ccc; padding-top: 4px; margin-top: 4px; }
        .tracking div { margin: 2px 0; }
        .footer { font-size: 7px; color: #9ca3af; text-align: center; margin-top: 4px; }
      </style>
    </head>
    <body>
      <div class="label">
        <div class="header">
          <span class="logo">MAX STREICHER</span>
          <span class="status">✅ TO COLLECT</span>
        </div>
        <div class="tp-num">TP: ${component.requests?.test_pack_number || '-'}</div>
        <div class="code">${component.ident_code || '-'}</div>
        <div style="font-size: 8px; text-align: center; color: #374151; margin: 2px 0;">${component.description ? (component.description.length > 40 ? component.description.substring(0, 40) + '...' : component.description) : '-'}</div>
        <div class="qty">${component.quantity} pz ✅</div>
        <div class="complete">✅ COMPLETO - Pronto per ritiro</div>
        ${(siteSentQty > 0 || yardSentQty > 0) ? `
          <div class="source">
            <div><strong>Provenienza:</strong></div>
            ${siteSentQty > 0 ? `<div>WH Site: ${siteSentQty} pz</div>` : ''}
            ${yardSentQty > 0 ? `<div>WH Yard: ${yardSentQty} pz</div>` : ''}
          </div>
        ` : ''}
        <div class="tracking">
          <div><strong>Madre:</strong> ${component.requests?.parent_request_number || component.requests?.request_number || '-'}</div>
          <div><strong>Richiedente:</strong> ${component.requests?.created_by_name || '-'}</div>
        </div>
        <div class="footer">Stampato: ${new Date().toLocaleString()} | Op: ${user?.full_name || '-'}</div>
      </div>
    </body>
    </html>
  `;
  printWindow.document.write(labelContent);
  printWindow.document.close();
  printWindow.focus();
  setTimeout(() => printWindow.print(), 250);
}

// ============================================================
// ASYNC SEARCH INPUT - V27 NEW COMPONENT
// ============================================================
function AsyncSearchInput({ 
  placeholder, 
  value, 
  onChange, 
  onSearch, 
  onSelect,
  minChars = 3,
  disabled = false,
  label = ''
}) {
  const [options, setOptions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchTimeout, setSearchTimeout] = useState(null);

  const handleInputChange = (e) => {
    const val = e.target.value;
    onChange(val);
    
    // Clear previous timeout
    if (searchTimeout) clearTimeout(searchTimeout);
    
    if (val.length >= minChars) {
      // V28.4: Debounce search by 500ms (increased from 300ms)
      const timeout = setTimeout(async () => {
        setLoading(true);
        try {
          const results = await onSearch(val);
          setOptions(results || []);
          setShowDropdown(true);
        } catch (err) {
          console.error('Search error:', err);
          setOptions([]);
        }
        setLoading(false);
      }, 500);
      setSearchTimeout(timeout);
    } else {
      setOptions([]);
      setShowDropdown(false);
    }
  };

  const handleSelect = (option) => {
    const selectedValue = typeof option === 'object' ? option.value : option;
    onChange(selectedValue);
    if (onSelect) onSelect(option);
    setShowDropdown(false);
    setOptions([]);
  };

  return (
    <div style={{ position: 'relative' }}>
      {label && <label style={styles.label}>{label}</label>}
      <div style={{ position: 'relative' }}>
        <input
          type="text"
          value={value}
          onChange={handleInputChange}
          onFocus={() => options.length > 0 && setShowDropdown(true)}
          onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
          placeholder={placeholder || `Type ${minChars}+ chars to search...`}
          disabled={disabled}
          style={{
            ...styles.input,
            backgroundColor: disabled ? '#f3f4f6' : 'white',
            paddingRight: loading ? '36px' : '12px'
          }}
        />
        {loading && (
          <div style={{ 
            position: 'absolute', 
            right: '12px', 
            top: '50%', 
            transform: 'translateY(-50%)', 
            color: '#9ca3af',
            fontSize: '14px'
          }}>
            ⏳
          </div>
        )}
      </div>
      {showDropdown && options.length > 0 && (
        <div style={{
          position: 'absolute',
          top: label ? 'calc(100% - 6px)' : '100%',
          left: 0,
          right: 0,
          maxHeight: '250px',
          overflowY: 'auto',
          backgroundColor: 'white',
          border: '1px solid #d1d5db',
          borderRadius: '6px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          zIndex: 100
        }}>
          {options.map((option, idx) => {
            const isObject = typeof option === 'object';
            const displayValue = isObject ? option.value : option;
            const displayLabel = isObject ? option.label : null;
            return (
              <div
                key={idx}
                onClick={() => handleSelect(option)}
                style={{
                  padding: '12px 14px',
                  cursor: 'pointer',
                  borderBottom: idx < options.length - 1 ? '1px solid #e5e7eb' : 'none',
                  fontSize: '14px',
                  transition: 'background-color 0.15s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#EFF6FF'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
              >
                <div style={{ fontWeight: '600', fontFamily: 'monospace', color: '#1F2937' }}>{displayValue}</div>
                {displayLabel && (
                  <div style={{ fontSize: '12px', color: '#4B5563', marginTop: '4px', lineHeight: '1.4' }}>
                    📝 {displayLabel}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
      {value.length > 0 && value.length < minChars && (
        <p style={{ fontSize: '11px', color: '#9ca3af', marginTop: '4px' }}>
          Type {minChars - value.length} more character{minChars - value.length > 1 ? 's' : ''} to search...
        </p>
      )}
    </div>
  );
}

// ============================================================
// UNIFIED ACTIONS POPUP - V27 NEW COMPONENT
// ============================================================
function UnifiedActionsPopup({ isOpen, onClose, component, onAction, currentPage, canModify }) {
  const [note, setNote] = useState('');
  const [selectedAction, setSelectedAction] = useState(null);
  const [partialQty, setPartialQty] = useState('');
  
  useEffect(() => {
    if (isOpen) {
      setNote('');
      setSelectedAction(null);
      setPartialQty('');
    }
  }, [isOpen]);
  
  if (!isOpen || !component) return null;

  const allActions = [
    { id: 'ready', label: 'Ready', icon: '✅', color: COLORS.success, desc: 'Mark as ready for collection' },
    { id: 'hf', label: 'HF', icon: '🔩', color: COLORS.teal, desc: 'Send to Flanged Joints page' },
    { id: 'tp', label: 'TP', icon: '📋', color: COLORS.purple, desc: 'Send to TestPack page' },
    { id: 'ws', label: 'WS', icon: '🏭', color: COLORS.info, desc: 'Send to Warehouse Site' },
    { id: 'wy', label: 'WY', icon: '🏢', color: COLORS.secondary, desc: 'Send to Warehouse Yard' },
    { id: 'ut', label: 'UT', icon: '⚙️', color: COLORS.purple, desc: 'Send to Engineering' },
    { id: 'pt', label: 'PT', icon: '✂️', color: COLORS.warning, desc: 'Partial split' },
    { id: 'spare', label: 'Spare', icon: '🔧', color: COLORS.pink, desc: 'Send to Spare Parts', pages: ['engineering'] },
    { id: 'mng', label: 'Mng', icon: '👔', color: COLORS.yellow, desc: 'Send to Management', pages: ['engineering'] },
    { id: 'order', label: 'Order', icon: '🛒', color: COLORS.orange, desc: 'Send to Orders', pages: ['engineering', 'whYard'] },
    { id: 'return', label: 'Return', icon: '↩️', color: COLORS.gray, desc: 'Return to previous' },
    { id: 'delete', label: 'Delete', icon: '🗑️', color: COLORS.primary, desc: 'Cancel request' }
  ];

  // Filter by current page
  const filteredActions = allActions.filter(action => {
    if (action.pages && !action.pages.includes(currentPage)) return false;
    if (currentPage === 'whSite' && action.id === 'ws') return false;
    if (currentPage === 'whYard' && action.id === 'wy') return false;
    if (currentPage === 'engineering' && action.id === 'ut') return false;
    return true;
  });

  const handleConfirm = () => {
    if (!selectedAction || !canModify) return;
    
    if (selectedAction === 'pt') {
      const qty = parseInt(partialQty);
      if (!qty || qty >= component.quantity || qty < 1) {
        alert('Partial quantity must be between 1 and ' + (component.quantity - 1));
        return;
      }
      onAction(component, selectedAction, note, qty);
    } else {
      onAction(component, selectedAction, note);
    }
    onClose();
  };

  const reqNum = String(component.requests?.request_number || component.request_number || 0).padStart(5, '0');
  const subNum = component.requests?.sub_number ?? component.sub_number ?? 0;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="⚡ Select Action" wide>
      <div style={{ marginBottom: '16px', padding: '12px', backgroundColor: '#f3f4f6', borderRadius: '8px' }}>
        <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
          <span><strong>Request:</strong> {reqNum}-{subNum}</span>
          <span><strong>Code:</strong> {component.ident_code || 'N/A'}</span>
          <span><strong>Qty:</strong> {component.quantity}</span>
          <span><strong>Status:</strong> <span style={{ ...styles.statusBadge, backgroundColor: STATUS_COLORS[component.status] || COLORS.gray }}>{component.status}</span></span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', marginBottom: '20px' }}>
        {filteredActions.map(action => (
          <div
            key={action.id}
            onClick={() => canModify && setSelectedAction(action.id)}
            style={{
              padding: '12px',
              border: `2px solid ${selectedAction === action.id ? action.color : '#e5e7eb'}`,
              borderRadius: '8px',
              cursor: canModify ? 'pointer' : 'not-allowed',
              backgroundColor: selectedAction === action.id ? `${action.color}20` : 'white',
              opacity: canModify ? 1 : 0.5,
              textAlign: 'center',
              transition: 'all 0.2s'
            }}
          >
            <div style={{ fontSize: '24px', marginBottom: '4px' }}>{action.icon}</div>
            <div style={{ fontWeight: '600', color: action.color, fontSize: '12px' }}>{action.label}</div>
            <div style={{ fontSize: '10px', color: '#6b7280', marginTop: '2px' }}>{action.desc}</div>
          </div>
        ))}
      </div>

      {selectedAction === 'pt' && (
        <div style={{ marginBottom: '16px', padding: '16px', backgroundColor: '#FEF3C7', borderRadius: '8px' }}>
          <label style={{ ...styles.label, color: COLORS.warning }}>Partial Quantity to deliver now:</label>
          <input
            type="number"
            value={partialQty}
            onChange={(e) => setPartialQty(e.target.value)}
            style={{ ...styles.input, maxWidth: '150px' }}
            min="1"
            max={component.quantity - 1}
            placeholder="Qty..."
          />
          <p style={{ fontSize: '12px', color: '#92400E', marginTop: '6px' }}>
            Remaining {component.quantity - (parseInt(partialQty) || 0)} will stay in queue
          </p>
        </div>
      )}

      {selectedAction && selectedAction !== 'pt' && (
        <div style={{ marginBottom: '16px' }}>
          <label style={styles.label}>Note (optional)</label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            style={{ ...styles.input, minHeight: '70px', resize: 'vertical' }}
            placeholder="Add a note..."
          />
        </div>
      )}

      <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', paddingTop: '16px', borderTop: '1px solid #e5e7eb' }}>
        <button onClick={onClose} style={{ ...styles.button, ...styles.buttonSecondary }}>Cancel</button>
        <button 
          onClick={handleConfirm}
          disabled={!selectedAction || !canModify}
          style={{ 
            ...styles.button, 
            backgroundColor: selectedAction ? COLORS.success : '#d1d5db', 
            color: 'white',
            cursor: selectedAction && canModify ? 'pointer' : 'not-allowed'
          }}
        >
          ✓ Confirm
        </button>
      </div>
    </Modal>
  );
}

// Popup per note durante i passaggi
function NotePopup({ isOpen, onClose, onConfirm, title, actionLabel }) {
  const [note, setNote] = useState('');
  
  if (!isOpen) return null;
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title || "Add Note"}>
      <div style={{ marginBottom: '16px' }}>
        <label style={styles.label}>Note (optional)</label>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          style={{ ...styles.input, minHeight: '100px', resize: 'vertical' }}
          placeholder="Enter a note for this step..."
        />
      </div>
      <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
        <button onClick={onClose} style={{ ...styles.button, ...styles.buttonSecondary }}>Cancel</button>
        <button 
          onClick={() => { onConfirm(note); setNote(''); }}
          style={{ ...styles.button, backgroundColor: COLORS.success, color: 'white' }}
        >
          {actionLabel || 'Confirm'}
        </button>
      </div>
    </Modal>
  );
}

// Popup per scegliere destinazione (Site-IN / HF / TP)
function DestinationPopup({ isOpen, onClose, onSelect, title }) {
  const [selected, setSelected] = useState('');
  
  if (!isOpen) return null;
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title || "Select Destination"}>
      <div style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <label style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '12px', 
            padding: '16px',
            border: `2px solid ${selected === 'siteIn' ? COLORS.info : '#e5e7eb'}`,
            borderRadius: '8px',
            cursor: 'pointer',
            backgroundColor: selected === 'siteIn' ? '#EFF6FF' : 'white'
          }}>
            <input 
              type="radio" 
              name="destination" 
              value="siteIn" 
              checked={selected === 'siteIn'}
              onChange={(e) => setSelected(e.target.value)}
              style={{ width: '20px', height: '20px' }}
            />
            <div>
              <div style={{ fontWeight: '600', color: COLORS.info }}>🏗️ Site-IN (Normal)</div>
              <div style={{ fontSize: '12px', color: '#6b7280' }}>Standard transfer to WH Site</div>
            </div>
          </label>
          
          <label style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '12px', 
            padding: '16px',
            border: `2px solid ${selected === 'hf' ? COLORS.teal : '#e5e7eb'}`,
            borderRadius: '8px',
            cursor: 'pointer',
            backgroundColor: selected === 'hf' ? '#F0FDFA' : 'white'
          }}>
            <input 
              type="radio" 
              name="destination" 
              value="hf" 
              checked={selected === 'hf'}
              onChange={(e) => setSelected(e.target.value)}
              style={{ width: '20px', height: '20px' }}
            />
            <div>
              <div style={{ fontWeight: '600', color: COLORS.teal }}>🔩 HF (Flanged Joint)</div>
              <div style={{ fontSize: '12px', color: '#6b7280' }}>Send to HF page for completion</div>
            </div>
          </label>
          
          <label style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '12px', 
            padding: '16px',
            border: `2px solid ${selected === 'tp' ? COLORS.purple : '#e5e7eb'}`,
            borderRadius: '8px',
            cursor: 'pointer',
            backgroundColor: selected === 'tp' ? '#F5F3FF' : 'white'
          }}>
            <input 
              type="radio" 
              name="destination" 
              value="tp" 
              checked={selected === 'tp'}
              onChange={(e) => setSelected(e.target.value)}
              style={{ width: '20px', height: '20px' }}
            />
            <div>
              <div style={{ fontWeight: '600', color: COLORS.purple }}>📋 TP (Test Pack)</div>
              <div style={{ fontSize: '12px', color: '#6b7280' }}>Send to TestPack page for completion</div>
            </div>
          </label>
        </div>
      </div>
      <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
        <button onClick={onClose} style={{ ...styles.button, ...styles.buttonSecondary }}>Cancel</button>
        <button 
          onClick={() => { if(selected) onSelect(selected); }}
          disabled={!selected}
          style={{ 
            ...styles.button, 
            backgroundColor: selected ? COLORS.success : '#d1d5db', 
            color: 'white',
            cursor: selected ? 'pointer' : 'not-allowed'
          }}
        >
          Confirm
        </button>
      </div>
    </Modal>
  );
}

// Component History Popup
function HistoryPopup({ isOpen, onClose, componentId }) {
  const [history, setHistory] = useState([]);
  const [componentInfo, setComponentInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (isOpen && componentId) {
      loadHistory();
    }
  }, [isOpen, componentId]);
  
  const loadHistory = async () => {
    setLoading(true);
    
    // Load component info including description
    const { data: compData } = await supabase
      .from('request_components')
      .select('*, requests(request_number, sub_number, description, created_by_name)')
      .eq('id', componentId)
      .single();
    if (compData) setComponentInfo(compData);
    
    // Load history
    const { data } = await supabase
      .from('component_history')
      .select('*')
      .eq('component_id', componentId)
      .order('created_at', { ascending: true });
    if (data) setHistory(data);
    setLoading(false);
  };
  
  if (!isOpen) return null;
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="📜 Component History" wide>
      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>Loading...</div>
      ) : (
        <>
          {/* V28.2: Show component info and description at top */}
          {componentInfo && (
            <div style={{ 
              backgroundColor: '#f9fafb', 
              padding: '12px 16px', 
              borderRadius: '8px', 
              marginBottom: '20px',
              border: '1px solid #e5e7eb'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontWeight: '600' }}>{componentInfo.ident_code}</span>
                <span style={{ color: '#6b7280' }}>Qty: {componentInfo.quantity}</span>
              </div>
              <div style={{ fontSize: '13px', color: '#6b7280', marginBottom: '4px' }}>
                Request: {displayRequestNumber(componentInfo.requests)}
                {componentInfo.requests?.created_by_name && ` • Created by: ${componentInfo.requests.created_by_name}`}
              </div>
              {(componentInfo.description || componentInfo.requests?.description) && (
                <div style={{ 
                  marginTop: '8px', 
                  padding: '8px 12px', 
                  backgroundColor: '#FEF3C7', 
                  borderRadius: '6px',
                  fontSize: '13px',
                  color: '#92400E'
                }}>
                  📝 <strong>Description:</strong> {componentInfo.description || componentInfo.requests?.description}
                </div>
              )}
            </div>
          )}

          {history.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>No history recorded</div>
          ) : (
            <div style={{ position: 'relative', paddingLeft: '30px' }}>
              {/* Timeline line */}
              <div style={{ 
                position: 'absolute', 
                left: '10px', 
                top: '10px', 
                bottom: '10px', 
                width: '2px', 
                backgroundColor: '#e5e7eb' 
              }} />
              
              {history.map((item, idx) => (
                <div key={idx} style={{ 
                  position: 'relative', 
                  marginBottom: '20px',
                  paddingBottom: '20px',
                  borderBottom: idx < history.length - 1 ? '1px dashed #e5e7eb' : 'none'
                }}>
                  {/* Timeline dot */}
                  <div style={{
                    position: 'absolute',
                    left: '-25px',
                    top: '5px',
                    width: '12px',
                    height: '12px',
                    borderRadius: '50%',
                    backgroundColor: STATUS_COLORS[item.to_status] || COLORS.gray,
                    border: '2px solid white',
                    boxShadow: '0 0 0 2px ' + (STATUS_COLORS[item.to_status] || COLORS.gray)
                  }} />
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <div style={{ fontWeight: '600', marginBottom: '4px' }}>
                        {item.action}
                      </div>
                      <div style={{ fontSize: '13px', color: '#6b7280' }}>
                        {item.from_status && (
                          <span>
                            <span style={{ ...styles.statusBadge, backgroundColor: STATUS_COLORS[item.from_status] || COLORS.gray, fontSize: '10px' }}>
                              {item.from_status}
                            </span>
                            <span style={{ margin: '0 8px' }}>→</span>
                          </span>
                        )}
                        <span style={{ ...styles.statusBadge, backgroundColor: STATUS_COLORS[item.to_status] || COLORS.gray, fontSize: '10px' }}>
                          {item.to_status}
                        </span>
                      </div>
                      {item.note && (
                        <div style={{ 
                          marginTop: '8px', 
                          padding: '8px 12px', 
                          backgroundColor: '#f9fafb', 
                          borderRadius: '6px',
                          fontSize: '13px',
                          color: '#374151'
                        }}>
                          📝 {item.note}
                        </div>
                      )}
                    </div>
                    <div style={{ textAlign: 'right', fontSize: '12px', color: '#9ca3af' }}>
                      <div>{new Date(item.created_at).toLocaleDateString()}</div>
                      <div>{new Date(item.created_at).toLocaleTimeString()}</div>
                      <div style={{ marginTop: '4px', color: '#6b7280' }}>{item.performed_by_name}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </Modal>
  );
}

// ============================================================
// LOGIN SCREEN
// ============================================================
function LoginScreen({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!username || !password) {
      setError('Enter username and password');
      return;
    }
    setLoading(true);
    setError('');

    try {
      const { data, error: queryError } = await supabase
        .from('users')
        .select('*')
        .eq('username', username)
        .eq('password_hash', password)
        .eq('is_active', true)
        .single();

      if (queryError || !data) {
        setError('Username o password non validi');
      } else {
        onLogin(data);
      }
    } catch (err) {
      setError('Connection error');
    }
    setLoading(false);
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f3f4f6'
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '40px',
        borderRadius: '12px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        width: '100%',
        maxWidth: '400px'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <img 
            src="/streicher-logo.png" 
            alt="STREICHER Logo"
            style={{
              width: '100px',
              height: '100px',
              borderRadius: '12px',
              margin: '0 auto 16px',
              display: 'block'
            }}
          />
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937' }}>MAX STREICHER</h1>
          <p style={{ color: '#6b7280', marginTop: '4px', border: '2px solid #16a34a', borderRadius: '4px', padding: '4px 12px', display: 'inline-block' }}>Materials Manager {APP_VERSION}</p>
        </div>

        {error && (
          <div style={{
            padding: '12px',
            backgroundColor: '#FEE2E2',
            color: '#DC2626',
            borderRadius: '6px',
            marginBottom: '16px',
            fontSize: '14px'
          }}>
            {error}
          </div>
        )}

        <div style={{ marginBottom: '16px' }}>
          <label style={styles.label}>Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={styles.input}
            placeholder="Enter username"
            onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
          />
        </div>

        <div style={{ marginBottom: '24px' }}>
          <label style={styles.label}>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
            placeholder="Enter password"
            onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
          />
        </div>

        <button
          onClick={handleLogin}
          disabled={loading}
          style={{
            ...styles.button,
            ...styles.buttonPrimary,
            width: '100%',
            justifyContent: 'center',
            padding: '12px',
            fontSize: '16px'
          }}
        >
          {loading ? 'Loading...' : 'Login'}
        </button>
      </div>
    </div>
  );
}

// ============================================================
// SIDEBAR NAVIGATION
// ============================================================
function Sidebar({ currentPage, setCurrentPage, user, collapsed, setCollapsed, badges }) {
  const menuItems = [
    { id: 'dashboard', icon: '📊', label: 'Dashboard', perm: null },
    { id: 'requests', icon: '📋', label: 'Requests', perm: 'perm_requests' },
    { id: 'mir', icon: '📦', label: 'MIR', perm: 'perm_mir' },
    { id: 'materialIn', icon: '📥', label: 'Material In', perm: 'perm_material_in' },
    { id: 'siteIn', icon: '🏗️', label: 'Site IN', perm: 'perm_site_in' },
    { id: 'whSite', icon: '🏭', label: 'WH Site', perm: 'perm_wh_site' },
    { id: 'whYard', icon: '🏢', label: 'WH Yard', perm: 'perm_wh_yard' },
    { id: 'engineering', icon: '⚙️', label: 'Engineering', perm: 'perm_engineering' },
    { id: 'hfPage', icon: '🔩', label: 'HF', perm: 'perm_wh_site' },
    { id: 'testPackPage', icon: '📋', label: 'TestPack', perm: 'perm_wh_site' },
    { id: 'toBeCollected', icon: '✅', label: 'To Collect', perm: 'perm_wh_site' },
    { id: 'spareParts', icon: '🔧', label: 'Spare Parts', perm: 'perm_spare_parts' },
    { id: 'orders', icon: '🛒', label: 'Orders', perm: 'perm_orders' },
    { id: 'log', icon: '📄', label: 'Log', perm: 'perm_movements' },
    { id: 'management', icon: '💼', label: 'Management', perm: 'perm_management' },
    { id: 'database', icon: '💾', label: 'Database', perm: 'perm_database' }
    // V28.4: Removed Print Requests menu item
  ];

  const visibleItems = menuItems.filter(item => {
    if (!item.perm) return true;
    if (user.role === 'admin') return true;
    return user[item.perm] && user[item.perm] !== 'none';
  });

  return (
    <div style={{ ...styles.sidebar, ...(collapsed ? styles.sidebarCollapsed : {}) }}>
      <div style={styles.logo}>
        <img src="/streicher-logo.png" alt="STREICHER" style={styles.logoIcon} />
        {!collapsed && (
          <div>
            <h1 style={{ color: 'white', fontWeight: 'bold', fontSize: '14px' }}>MAX STREICHER</h1>
            <p style={{ color: '#9ca3af', fontSize: '12px' }}>Materials Manager</p>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          style={{ marginLeft: 'auto', background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer', fontSize: '18px' }}
        >
          {collapsed ? '→' : '←'}
        </button>
      </div>
      
      <nav style={styles.nav}>
        {visibleItems.map(item => (
          <div
            key={item.id}
            onClick={() => setCurrentPage(item.id)}
            style={{
              ...styles.navItem,
              ...(currentPage === item.id ? styles.navItemActive : {})
            }}
          >
            <span style={{ fontSize: '20px' }}>{item.icon}</span>
            {!collapsed && (
              <span style={{ fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                {item.label}
                {badges[item.id] > 0 && (
                  <span style={{
                    backgroundColor: COLORS.primary,
                    color: 'white',
                    padding: '2px 6px',
                    borderRadius: '10px',
                    fontSize: '10px',
                    fontWeight: 'bold'
                  }}>
                    {badges[item.id]}
                  </span>
                )}
              </span>
            )}
          </div>
        ))}
      </nav>
      
      <div style={{ padding: '16px', borderTop: '1px solid #374151' }}>
        <div style={{ ...styles.navItem, padding: '8px 16px' }}>
          <span>🚪</span>
          {!collapsed && <span style={{ fontSize: '14px' }}>Logout</span>}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// DASHBOARD
// ============================================================
function Dashboard({ user, setActivePage }) {
  // V28.5: Dashboard with clickable status boxes
  const [stats, setStats] = useState({
    yard: 0, site: 0, eng: 0, mng: 0, spare: 0,
    order: 0, siteIn: 0, toCollect: 0, tp: 0, hf: 0,
    mirOpen: 0, lost: 0, broken: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    // Load all component counts by status
    const statuses = ['Yard', 'WH_Site', 'Eng', 'Mng', 'Spare', 'Order', 'Trans', 'ToCollect', 'TP', 'HF', 'TP_Spool_Sent'];
    const counts = {};
    
    for (const status of statuses) {
      const { data } = await supabase.from('request_components').select('id').eq('status', status);
      counts[status] = data?.length || 0;
    }
    
    // V28.5 FIX: Also count Engineering Checks sent to WH_Site and Yard
    // V32.2: Don't count 'Both' in individual counts - those are parent items
    const { data: engChecksSite } = await supabase
      .from('request_components')
      .select('id')
      .eq('has_eng_check', true)
      .eq('eng_check_sent_to', 'WH_Site'); // V32.2: Only 'WH_Site', not 'Both'
    
    const { data: engChecksYard } = await supabase
      .from('request_components')
      .select('id')
      .eq('has_eng_check', true)
      .eq('eng_check_sent_to', 'Yard'); // V32.2: Only 'Yard', not 'Both'
    
    // V29.0: Count unique test_pack_numbers with pending items (same as sidebar badge)
    const { data: tpData } = await supabase
      .from('requests')
      .select('test_pack_number')
      .not('test_pack_number', 'is', null);
    let tpCount = 0;
    if (tpData) {
      const uniqueTPs = [...new Set(tpData.map(r => r.test_pack_number).filter(Boolean))];
      for (const tpNum of uniqueTPs) {
        const { data: comps } = await supabase
          .from('request_components')
          .select('id, requests!inner(test_pack_number)')
          .eq('requests.test_pack_number', tpNum)
          .in('status', ['TP', 'Eng', 'TP_Spool_Sent']);
        if (comps && comps.length > 0) tpCount++;
      }
    }
    
    // V29.0: Count unique hf_numbers with pending items (same as sidebar badge)
    const { data: hfData } = await supabase
      .from('requests')
      .select('hf_number')
      .not('hf_number', 'is', null);
    let hfCount = 0;
    if (hfData) {
      const uniqueHFs = [...new Set(hfData.map(r => r.hf_number).filter(Boolean))];
      for (const hfNum of uniqueHFs) {
        const { data: comps } = await supabase
          .from('request_components')
          .select('id, requests!inner(hf_number)')
          .eq('requests.hf_number', hfNum)
          .in('status', ['HF', 'Eng']);
        if (comps && comps.length > 0) hfCount++;
      }
    }
    
    // Load Open MIRs count
    const { data: mirData } = await supabase.from('mirs').select('id').eq('status', 'Open');
    
    // Load inventory totals for Lost/Broken
    const { data: invData } = await supabase
      .from('inventory')
      .select('lost_qty, broken_qty');
    
    let totalLost = 0, totalBroken = 0;
    if (invData) {
      totalLost = invData.reduce((sum, i) => sum + (i.lost_qty || 0), 0);
      totalBroken = invData.reduce((sum, i) => sum + (i.broken_qty || 0), 0);
    }

    setStats({
      yard: (counts['Yard'] || 0) + (engChecksYard?.length || 0),
      site: (counts['WH_Site'] || 0) + (engChecksSite?.length || 0),
      eng: counts['Eng'] || 0,
      mng: counts['Mng'] || 0,
      spare: counts['Spare'] || 0,
      order: counts['Order'] || 0,
      siteIn: counts['Trans'] || 0,
      toCollect: counts['ToCollect'] || 0,
      tp: tpCount,
      hf: hfCount,
      mirOpen: mirData?.length || 0,
      lost: totalLost,
      broken: totalBroken
    });
    
    setLoading(false);
  };

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading...</div>;

  // V28.5: Clickable dashboard box style
  const boxStyle = (color, clickable = true) => ({
    backgroundColor: color,
    padding: '20px',
    borderRadius: '12px',
    color: 'white',
    textAlign: 'center',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    cursor: clickable ? 'pointer' : 'default',
    transition: 'transform 0.2s, box-shadow 0.2s'
  });

  const handleBoxClick = (pageId) => {
    if (setActivePage) {
      setActivePage(pageId);
    }
  };

  return (
    <div>
      <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '20px' }}>📊 Request Status Overview</h2>
      <p style={{ color: '#6b7280', fontSize: '13px', marginBottom: '16px' }}>Click on any box to navigate to that section</p>
      
      {/* Main Status Grid - 5 columns */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '16px', marginBottom: '24px' }}>
        <div 
          style={boxStyle(COLORS.secondary)} 
          onClick={() => handleBoxClick('whYard')}
          onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.03)'; e.currentTarget.style.boxShadow = '0 6px 12px rgba(0,0,0,0.15)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)'; }}
        >
          <p style={{ fontSize: '14px', opacity: 0.9, marginBottom: '8px' }}>Yard</p>
          <p style={{ fontSize: '36px', fontWeight: 'bold' }}>{stats.yard}</p>
        </div>
        <div 
          style={boxStyle(COLORS.info)} 
          onClick={() => handleBoxClick('whSite')}
          onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.03)'; e.currentTarget.style.boxShadow = '0 6px 12px rgba(0,0,0,0.15)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)'; }}
        >
          <p style={{ fontSize: '14px', opacity: 0.9, marginBottom: '8px' }}>WH Site</p>
          <p style={{ fontSize: '36px', fontWeight: 'bold' }}>{stats.site}</p>
        </div>
        <div 
          style={boxStyle(COLORS.purple)} 
          onClick={() => handleBoxClick('engineering')}
          onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.03)'; e.currentTarget.style.boxShadow = '0 6px 12px rgba(0,0,0,0.15)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)'; }}
        >
          <p style={{ fontSize: '14px', opacity: 0.9, marginBottom: '8px' }}>Engineering</p>
          <p style={{ fontSize: '36px', fontWeight: 'bold' }}>{stats.eng}</p>
        </div>
        <div 
          style={boxStyle(COLORS.yellow)} 
          onClick={() => handleBoxClick('management')}
          onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.03)'; e.currentTarget.style.boxShadow = '0 6px 12px rgba(0,0,0,0.15)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)'; }}
        >
          <p style={{ fontSize: '14px', opacity: 0.9, marginBottom: '8px' }}>Management</p>
          <p style={{ fontSize: '36px', fontWeight: 'bold' }}>{stats.mng}</p>
        </div>
        <div 
          style={boxStyle(COLORS.pink)} 
          onClick={() => handleBoxClick('spareParts')}
          onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.03)'; e.currentTarget.style.boxShadow = '0 6px 12px rgba(0,0,0,0.15)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)'; }}
        >
          <p style={{ fontSize: '14px', opacity: 0.9, marginBottom: '8px' }}>Spare Parts</p>
          <p style={{ fontSize: '36px', fontWeight: 'bold' }}>{stats.spare}</p>
        </div>
      </div>

      {/* Second Row - 5 columns */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '16px', marginBottom: '24px' }}>
        <div 
          style={boxStyle(COLORS.orange)} 
          onClick={() => handleBoxClick('orders')}
          onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.03)'; e.currentTarget.style.boxShadow = '0 6px 12px rgba(0,0,0,0.15)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)'; }}
        >
          <p style={{ fontSize: '14px', opacity: 0.9, marginBottom: '8px' }}>Orders</p>
          <p style={{ fontSize: '36px', fontWeight: 'bold' }}>{stats.order}</p>
        </div>
        <div 
          style={boxStyle(COLORS.cyan)} 
          onClick={() => handleBoxClick('siteIn')}
          onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.03)'; e.currentTarget.style.boxShadow = '0 6px 12px rgba(0,0,0,0.15)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)'; }}
        >
          <p style={{ fontSize: '14px', opacity: 0.9, marginBottom: '8px' }}>Site IN</p>
          <p style={{ fontSize: '36px', fontWeight: 'bold' }}>{stats.siteIn}</p>
        </div>
        <div 
          style={boxStyle(COLORS.success)} 
          onClick={() => handleBoxClick('toBeCollected')}
          onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.03)'; e.currentTarget.style.boxShadow = '0 6px 12px rgba(0,0,0,0.15)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)'; }}
        >
          <p style={{ fontSize: '14px', opacity: 0.9, marginBottom: '8px' }}>To Collect</p>
          <p style={{ fontSize: '36px', fontWeight: 'bold' }}>{stats.toCollect}</p>
        </div>
        <div 
          style={boxStyle('#8B5CF6')} 
          onClick={() => handleBoxClick('testPack')}
          onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.03)'; e.currentTarget.style.boxShadow = '0 6px 12px rgba(0,0,0,0.15)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)'; }}
        >
          <p style={{ fontSize: '14px', opacity: 0.9, marginBottom: '8px' }}>TestPack</p>
          <p style={{ fontSize: '36px', fontWeight: 'bold' }}>{stats.tp}</p>
        </div>
        <div 
          style={boxStyle(COLORS.teal)} 
          onClick={() => handleBoxClick('hf')}
          onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.03)'; e.currentTarget.style.boxShadow = '0 6px 12px rgba(0,0,0,0.15)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)'; }}
        >
          <p style={{ fontSize: '14px', opacity: 0.9, marginBottom: '8px' }}>HF</p>
          <p style={{ fontSize: '36px', fontWeight: 'bold' }}>{stats.hf}</p>
        </div>
      </div>

      {/* Third Row - MIR, Lost, Broken (Lost and Broken NOT clickable) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
        <div 
          style={boxStyle(COLORS.primary)} 
          onClick={() => handleBoxClick('mir')}
          onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.03)'; e.currentTarget.style.boxShadow = '0 6px 12px rgba(0,0,0,0.15)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)'; }}
        >
          <p style={{ fontSize: '14px', opacity: 0.9, marginBottom: '8px' }}>📋 MIR Open</p>
          <p style={{ fontSize: '36px', fontWeight: 'bold' }}>{stats.mirOpen}</p>
        </div>
        <div style={boxStyle('#DC2626', false)}>
          <p style={{ fontSize: '14px', opacity: 0.9, marginBottom: '8px' }}>⚠️ Lost</p>
          <p style={{ fontSize: '36px', fontWeight: 'bold' }}>{stats.lost}</p>
        </div>
        <div style={boxStyle('#7C3AED', false)}>
          <p style={{ fontSize: '14px', opacity: 0.9, marginBottom: '8px' }}>🔧 Broken</p>
          <p style={{ fontSize: '36px', fontWeight: 'bold' }}>{stats.broken}</p>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// REQUESTS PAGE - V27 with async search
// ============================================================
function RequestsPage({ user }) {
  const [requestType, setRequestType] = useState('Piping');
  const [subCategory, setSubCategory] = useState('Bulk');
  const [isoNumber, setIsoNumber] = useState('');
  const [spoolNumber, setSpoolNumber] = useState('');
  const [hfNumber, setHfNumber] = useState('');
  const [description, setDescription] = useState('');
  const [testPackNumber, setTestPackNumber] = useState('');
  const [missingType, setMissingType] = useState('Material');
  const [materials, setMaterials] = useState([]);
  const [currentMaterial, setCurrentMaterial] = useState({ ident_code: '', tag: '', qty: '', description: '', dia1: '' });
  const [isoOptions, setIsoOptions] = useState([]);
  const [spoolOptions, setSpoolOptions] = useState([]);
  const [identOptions, setIdentOptions] = useState([]);
  const [tagOptions, setTagOptions] = useState([]);
  const [nextNumber, setNextNumber] = useState(1);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [overQuantityWarning, setOverQuantityWarning] = useState(null);
  const [projectQtyExhausted, setProjectQtyExhausted] = useState(false);
  const [hfError, setHfError] = useState(null);
  const [componentDescription, setComponentDescription] = useState('');
  const [allUsers, setAllUsers] = useState([]);
  // V27: Multi-spool support for TestPack
  const [selectedSpools, setSelectedSpools] = useState([]);
  const [currentSpoolInput, setCurrentSpoolInput] = useState('');
  // V29.0: Search results for ident code (like Material IN)
  const [identSearchResults, setIdentSearchResults] = useState([]);
  const [showIdentResults, setShowIdentResults] = useState(false);
  const [identSearchTimeout, setIdentSearchTimeout] = useState(null);

  useEffect(() => {
    loadNextNumber();
    loadUsers();
  }, []);

  const loadNextNumber = async () => {
    const { data } = await supabase
      .from('counters')
      .select('value')
      .eq('id', 'request_number')
      .single();
    if (data) setNextNumber(data.value + 1);
  };

  // V27: Async ISO search (4+ characters)
  // V28.5: Filtered to P121 project only
  const searchIsoOptions = async (searchTerm) => {
    if (searchTerm.length < 4) return [];
    const { data } = await supabase
      .from('project_materials')
      .select('iso_number')
      .like('iso_number', 'P121%')  // V28.5: P121 project filter
      .ilike('iso_number', `%${searchTerm}%`)
      .order('iso_number')
      .limit(50);
    if (data) {
      const unique = [...new Set(data.map(d => d.iso_number).filter(Boolean))];
      return unique;
    }
    return [];
  };

  // V27: Async Spool search (3+ characters, filtered by ISO, excludes ending with SP000/SPSUP/SPTAG)
  const searchSpoolOptions = async (searchTerm) => {
    if (!isoNumber || searchTerm.length < 3) return [];
    const { data } = await supabase
      .from('project_materials')
      .select('full_spool_number')
      .eq('iso_number', isoNumber)
      .ilike('full_spool_number', `%${searchTerm}%`)
      .order('full_spool_number')
      .limit(50);
    if (data) {
      const unique = [...new Set(data.map(d => d.full_spool_number).filter(Boolean))]
        .filter(s => {
          const upper = s.toUpperCase();
          return !upper.endsWith('SP000') && !upper.endsWith('SPSUP') && !upper.endsWith('SPTAG') &&
                 !upper.includes('-SP000') && !upper.includes('-SPSUP') && !upper.includes('-SPTAG');
        });
      return unique;
    }
    return [];
  };

  const loadUsers = async () => {
    const { data } = await supabase
      .from('users')
      .select('id, username, full_name, badge_number')
      .eq('is_active', true)
      .order('full_name');
    if (data) setAllUsers(data);
  };

  // Load spools for dropdown (when ISO selected) - excludes ending with SP000/SPSUP/SPTAG
  const loadSpoolOptions = async (iso) => {
    const { data } = await supabase
      .from('project_materials')
      .select('full_spool_number')
      .eq('iso_number', iso)
      .order('full_spool_number')
      .limit(100);
    if (data) {
      const unique = [...new Set(data.map(d => d.full_spool_number).filter(Boolean))]
        .filter(s => {
          const upper = s.toUpperCase();
          return !upper.endsWith('SP000') && !upper.endsWith('SPSUP') && !upper.endsWith('SPTAG') &&
                 !upper.includes('-SP000') && !upper.includes('-SPSUP') && !upper.includes('-SPTAG');
        });
      setSpoolOptions(unique);
    }
  };

  const loadIdentOptions = async (spool) => {
    const { data } = await supabase
      .from('project_materials')
      .select('ident_code, tag_number, description, pos_qty, uom')
      .eq('full_spool_number', spool);
    if (data) {
      const mapped = data.map(d => ({
        ident_code: d.ident_code,
        tag: d.tag_number || '',
        description: d.description,
        pos_qty: d.pos_qty || 0,
        uom: d.uom
      }));
      setIdentOptions(mapped);
    }
  };

  // Load tags ONLY for selected ident_code
  const loadTagsForIdent = async (identCode) => {
    if (!identCode) {
      setTagOptions([]);
      return;
    }
    const { data } = await supabase
      .from('project_materials')
      .select('tag_number')
      .eq('ident_code', identCode)
      .not('tag_number', 'is', null);
    if (data) {
      const unique = [...new Set(data.map(d => d.tag_number).filter(Boolean))];
      setTagOptions(unique.map(t => ({ tag_code: t, description: t })));
    } else {
      setTagOptions([]);
    }
  };

  const handleIsoChange = (value) => {
    setIsoNumber(value);
    setSpoolNumber('');
    setSpoolOptions([]);
    setIdentOptions([]);
    setTagOptions([]);
    setOverQuantityWarning(null);
    setProjectQtyExhausted(false);
    if (value) loadSpoolOptions(value);
  };

  const handleSpoolChange = (value) => {
    setSpoolNumber(value);
    setIdentOptions([]);
    setTagOptions([]);
    setOverQuantityWarning(null);
    setProjectQtyExhausted(false);
    if (value) loadIdentOptions(value);
  };

  // Check HF duplicate - IMPROVED with date and person
  const checkHfDuplicate = async (hf) => {
    if (!hf) {
      setHfError(null);
      return false;
    }
    
    const { data } = await supabase
      .from('requests')
      .select('id, request_number, created_at, requester_user_id')
      .eq('hf_number', hf)
      .neq('status', 'Cancelled');
    
    if (data && data.length > 0) {
      // Get user name
      const { data: userData } = await supabase
        .from('users')
        .select('full_name')
        .eq('id', data[0].requester_user_id)
        .single();
      
      const existingReq = String(data[0].request_number).padStart(5, '0');
      const reqDate = new Date(data[0].created_at).toLocaleDateString();
      const reqPerson = userData?.full_name || 'Unknown';
      
      setHfError({
        message: `HF "${hf}" already requested`,
        request: existingReq,
        date: reqDate,
        person: reqPerson
      });
      return true;
    }
    setHfError(null);
    return false;
  };

  // HF must be exactly "HF" + 6 digits (e.g., HF123456)
  const handleHfChange = async (value) => {
    // Auto-uppercase and format
    let formatted = value.toUpperCase();
    
    // If starts typing digits without HF, auto-prepend HF
    if (/^\d/.test(formatted) && !formatted.startsWith('HF')) {
      formatted = 'HF' + formatted;
    }
    
    // Limit to HF + 6 digits max
    if (formatted.startsWith('HF')) {
      const digits = formatted.slice(2).replace(/\D/g, '').slice(0, 6);
      formatted = 'HF' + digits;
    }
    
    setHfNumber(formatted);
    
    // Check for duplicates only when complete (HF + 6 digits)
    if (/^HF\d{6}$/.test(formatted)) {
      await checkHfDuplicate(formatted);
    } else {
      setHfError(null);
    }
  };

  // Check project qty vs record_out - NUOVO!
  const checkProjectQtyAvailable = async (identCode, requestedQty) => {
    if (!identCode) return true;
    
    // Get project qty
    const { data: projData } = await supabase
      .from('project_materials')
      .select('pos_qty')
      .eq('ident_code', identCode);
    
    const projectQty = projData?.reduce((sum, d) => sum + (d.pos_qty || 0), 0) || 0;
    
    // Get record_out (already collected)
    const { data: invData } = await supabase
      .from('inventory')
      .select('record_out')
      .eq('ident_code', identCode)
      .single();
    
    const recordOut = invData?.record_out || 0;
    
    // Get already requested (not yet delivered)
    const { data: reqData } = await supabase
      .from('request_components')
      .select('quantity')
      .eq('ident_code', identCode)
      .not('status', 'in', '("Done","Cancelled")');
    
    const alreadyRequested = reqData?.reduce((sum, d) => sum + (d.quantity || 0), 0) || 0;
    
    const available = projectQty - recordOut - alreadyRequested;
    const totalRequested = alreadyRequested + parseInt(requestedQty || 0);
    
    if (available <= 0) {
      setProjectQtyExhausted(true);
      setOverQuantityWarning({
        ident_code: identCode,
        projectQty,
        recordOut,
        alreadyRequested,
        available: 0
      });
      return false;
    } else if (parseInt(requestedQty || 0) > available) {
      setProjectQtyExhausted(false);
      setOverQuantityWarning({
        ident_code: identCode,
        projectQty,
        recordOut,
        alreadyRequested,
        available,
        totalRequested
      });
      return false;
    }
    
    setProjectQtyExhausted(false);
    setOverQuantityWarning(null);
    return true;
  };

  const handleRequestTypeChange = (type) => {
    setRequestType(type);
    setIsoNumber('');
    setSpoolNumber('');
    setSpoolOptions([]);
    setHfNumber('');
    setHfError(null);
    setDescription('');
    setTestPackNumber('');
    setMaterials([]);
    setOverQuantityWarning(null);
    setProjectQtyExhausted(false);
    setComponentDescription('');
    setSelectedSpools([]);
    setCurrentSpoolInput('');
  };

  // Load ALL spools for TestPack (filtered, no SP000/SPSUP/SPTAG)
  const loadAllSpoolsForTestPack = async () => {
    // V27: No longer preload all spools - use async search instead
  };

  // V27: Async search for TestPack Material (3+ chars)
  // V27: Async search for Ident Code (3+ chars, with description) - INDEPENDENT from ISO
  const searchIdentCodeGlobal = async (searchTerm) => {
    if (searchTerm.length < 3) return [];
    const { data, error } = await supabase
      .from('project_materials')
      .select('ident_code, description, dia1')
      .ilike('ident_code', `%${searchTerm}%`)
      .order('ident_code')
      .limit(50);
    
    console.log('Search results for', searchTerm, ':', data); // Debug
    if (error) console.error('Search error:', error);
    
    if (data) {
      // Get unique ident codes with their descriptions
      const seen = new Set();
      const results = [];
      data.forEach(d => {
        if (d.ident_code && !seen.has(d.ident_code)) {
          seen.add(d.ident_code);
          const descText = d.description ? d.description.substring(0, 50) : 'No description';
          const diamText = d.dia1 ? ` [Ø${d.dia1}]` : '';
          results.push({
            value: d.ident_code,
            label: descText + diamText,
            description: d.description || '',
            dia1: d.dia1 || ''
          });
        }
      });
      return results;
    }
    return [];
  };

  // V27: Async search for TestPack Material (3+ chars, with description)
  const searchTestPackMaterial = async (searchTerm) => {
    if (searchTerm.length < 3) return [];
    const { data } = await supabase
      .from('project_materials')
      .select('ident_code, description, dia1')
      .ilike('ident_code', `%${searchTerm}%`)
      .order('ident_code')
      .limit(50);
    if (data) {
      const seen = new Set();
      const results = [];
      data.forEach(d => {
        if (d.ident_code && !seen.has(d.ident_code)) {
          seen.add(d.ident_code);
          const descText = d.description ? d.description.substring(0, 50) : 'No description';
          const diamText = d.dia1 ? ` [Ø${d.dia1}]` : '';
          results.push({
            value: d.ident_code,
            label: descText + diamText,
            description: d.description || '',
            dia1: d.dia1 || ''
          });
        }
      });
      return results;
    }
    return [];
  };

  // V27: Async search for TestPack Spool (6+ chars, filtered)
  const searchTestPackSpool = async (searchTerm) => {
    if (searchTerm.length < 6) return [];
    const { data } = await supabase
      .from('project_materials')
      .select('full_spool_number')
      .ilike('full_spool_number', `%${searchTerm}%`)
      .order('full_spool_number')
      .limit(50);
    if (data) {
      const unique = [...new Set(data.map(d => d.full_spool_number).filter(Boolean))]
        .filter(s => {
          const upper = s.toUpperCase();
          return !upper.includes('SP000') && !upper.includes('SPSUP') && !upper.includes('SPTAG');
        });
      return unique;
    }
    return [];
  };

  // V29.0: Search ident code for Request form (like Material IN)
  const searchIdentForRequest = (searchTerm) => {
    // Clear previous timeout
    if (identSearchTimeout) clearTimeout(identSearchTimeout);
    
    // Clear description/dia1 when typing
    setCurrentMaterial(prev => ({ ...prev, ident_code: searchTerm, description: '', dia1: '' }));
    
    if (searchTerm.length < 3) {
      setIdentSearchResults([]);
      setShowIdentResults(false);
      return;
    }
    
    // Debounce search
    const timeout = setTimeout(async () => {
      const { data } = await supabase
        .from('project_materials')
        .select('ident_code, description, dia1')
        .ilike('ident_code', `%${searchTerm}%`)
        .order('ident_code')
        .limit(50);
      
      if (data) {
        // Remove duplicates
        const seen = new Set();
        const results = [];
        data.forEach(d => {
          if (!seen.has(d.ident_code)) {
            seen.add(d.ident_code);
            results.push(d);
          }
        });
        setIdentSearchResults(results);
        setShowIdentResults(results.length > 0);
      } else {
        setIdentSearchResults([]);
        setShowIdentResults(false);
      }
    }, 500);
    setIdentSearchTimeout(timeout);
  };

  // V29.0: Select ident code from search results
  const selectIdentForRequest = (item) => {
    setCurrentMaterial(prev => ({
      ...prev,
      ident_code: item.ident_code,
      description: item.description || '',
      dia1: item.dia1 || ''
    }));
    setShowIdentResults(false);
    setIdentSearchResults([]);
    loadTagsForIdent(item.ident_code);
  };

  const handleIdentCodeChange = async (identCodeOrObject) => {
    // Handle both string and object (from AsyncSearchInput with description)
    let identCode = identCodeOrObject;
    let desc = '';
    let dia1 = '';
    
    if (typeof identCodeOrObject === 'object' && identCodeOrObject !== null) {
      identCode = identCodeOrObject.value || identCodeOrObject;
      desc = identCodeOrObject.description || '';
      dia1 = identCodeOrObject.dia1 || '';
      console.log('Selected material:', identCodeOrObject); // Debug log
    }
    
    // If description is still empty, try to fetch from database
    if (!desc && identCode) {
      const { data } = await supabase
        .from('project_materials')
        .select('description, dia1')
        .eq('ident_code', identCode)
        .limit(1)
        .single();
      
      if (data) {
        desc = data.description || '';
        dia1 = data.dia1 || '';
        console.log('Fetched from DB:', data); // Debug log
      }
    }
    
    setCurrentMaterial({ 
      ...currentMaterial, 
      ident_code: identCode, 
      tag: '', 
      description: desc, 
      dia1: dia1 
    });
    loadTagsForIdent(identCode);
    // Reset warnings when changing ident
    setOverQuantityWarning(null);
    setProjectQtyExhausted(false);
  };

  const addMaterial = async () => {
    if (!currentMaterial.ident_code || !currentMaterial.qty) return;
    
    // V28.11: Block if description is empty
    const selected = identOptions.find(o => o.ident_code === currentMaterial.ident_code);
    const materialDesc = currentMaterial.description || selected?.description || '';
    
    if (!materialDesc) {
      alert('Description is required. Please select a valid item with description.');
      return;
    }
    
    // Check project qty availability
    if (requestType === 'Piping') {
      await checkProjectQtyAvailable(currentMaterial.ident_code, currentMaterial.qty);
    }
    
    // V28.10: Include sub_category with each material
    setMaterials([...materials, {
      ident_code: currentMaterial.ident_code,
      tag: currentMaterial.tag,
      description: materialDesc,
      dia1: currentMaterial.dia1 || '',
      qty: currentMaterial.qty,
      pos_qty: selected?.pos_qty || 0,
      sub_category: subCategory || null  // Save current sub_category with material
    }]);
    // V29.0: Clear form completely including search results
    setCurrentMaterial({ ident_code: '', tag: '', qty: '', description: '', dia1: '' });
    setTagOptions([]);
    setIdentSearchResults([]);
    setShowIdentResults(false);
  };

  const removeMaterial = (index) => {
    setMaterials(materials.filter((_, i) => i !== index));
    setOverQuantityWarning(null);
    setProjectQtyExhausted(false);
  };

  const submitRequest = async (destination) => {
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      // Validations
      if (requestType === 'Piping') {
        if (!isoNumber) throw new Error('ISO Number required');
        if (!spoolNumber) throw new Error('Full Spool Number required');
        if (subCategory === 'Erection' && !hfNumber) throw new Error('HF Number required for Erection');
        if (subCategory === 'Erection' && hfError) throw new Error('Cannot create request with duplicate HF');
        if (subCategory === 'Erection' && !/^HF\d{6}$/.test(hfNumber)) throw new Error('HF Number must be HF + 6 digits (e.g., HF123456)');
        if (materials.length === 0) throw new Error('Add at least one material');
      }
      if (requestType === 'Mechanical') {
        if (!description) throw new Error('Description required');
      }
      if (requestType === 'TestPack') {
        if (!testPackNumber || testPackNumber.length !== 4) throw new Error('Test Pack Number must be 4 digits');
        // V28.11: Handle 'Both' case
        if (missingType === 'Material' && materials.length === 0) {
          throw new Error('Add at least one material');
        }
        if (missingType === 'Spool' && selectedSpools.length === 0) {
          throw new Error('Add at least one spool');
        }
        if (missingType === 'Both' && materials.length === 0 && selectedSpools.length === 0) {
          throw new Error('Add at least one material or spool');
        }
      }

      // For TestPack: Handle materials and spools separately
      let combinedMaterials = [...materials];
      
      // V28.11: For Spool type, add spool as a component with sub_category='Spool'
      // (NOT fetching materials from spool - spool is a separate item to be ordered from supplier)
      if (requestType === 'TestPack' && (missingType === 'Spool' || missingType === 'Both') && selectedSpools.length > 0) {
        // Add each selected spool as a separate component
        for (const spoolNum of selectedSpools) {
          combinedMaterials.push({
            ident_code: 'SPOOL', // Placeholder - spools don't have ident_code
            description: spoolNum, // Spool name goes in description
            dia1: '',
            qty: 1,
            tag: '',
            from_spool: spoolNum,
            sub_category: 'Spool' // NEW sub-category for spools
          });
        }
        
        // Set description to list of spools if only spools
        if (missingType === 'Spool') {
          setDescription(selectedSpools.join(', '));
        }
      }

      // Get next request number
      const { data: counterData } = await supabase.rpc('get_next_request_number');
      const reqNumber = counterData || nextNumber;

      // Create request with 4-level format
      const { data: request, error: reqError } = await supabase
        .from('requests')
        .insert({
          request_number: reqNumber,
          sub_number: 0,
          level_component: 0,
          level_wh_split: 0,
          level_yard_split: 0,
          request_number_full: formatRequestNumber(reqNumber, 0, 0, 0),
          requester_user_id: user.id,
          created_by_name: user.full_name,  // V29.0: Store requester name
          request_type: requestType,
          sub_category: requestType === 'Piping' ? subCategory : 
                       (requestType === 'TestPack' && (missingType === 'Material' || missingType === 'Both') ? subCategory : null),
          iso_number: requestType !== 'TestPack' ? (isoNumber || null) : null,
          full_spool_number: requestType !== 'TestPack' ? (spoolNumber || null) : null,
          hf_number: (requestType === 'Piping' && subCategory === 'Erection') ? (hfNumber || null) : 
                     (requestType === 'TestPack' && (missingType === 'Material' || missingType === 'Both') && hfNumber) ? hfNumber : null,
          test_pack_number: requestType === 'TestPack' ? `MAX-TP-${testPackNumber.padStart(4, '0')}` : null,
          missing_type: requestType === 'TestPack' ? missingType : null,
          description: requestType === 'TestPack' 
            ? (missingType === 'Spool' ? `Spools: ${selectedSpools.join(', ')}` : 
               missingType === 'Both' ? `Materials + Spools: ${selectedSpools.join(', ')}` : 
               (componentDescription || null))
            : (description || null)
        })
        .select()
        .single();

      if (reqError) throw reqError;

      // Determine status based on destination
      let status;
      if (destination === 'site') status = 'WH_Site';
      else if (destination === 'yard') status = 'Yard';
      else status = 'Eng';

      // Create components
      if (requestType === 'Mechanical') {
        await supabase.from('request_components').insert({
          request_id: request.id,
          ident_code: 'MECHANICAL',
          description: description,
          quantity: 1,
          status: status,
          current_location: destination === 'yard' ? 'YARD' : 'SITE'
        });
      } else {
        // Use combinedMaterials for TestPack Spool or Both, otherwise use materials
        const matsToInsert = (requestType === 'TestPack' && (missingType === 'Spool' || missingType === 'Both')) 
          ? combinedMaterials 
          : materials;
          
        for (const mat of matsToInsert) {
          console.log('Creating component with status:', status, 'for ident:', mat.ident_code);
          
          const { data: comp, error: compError } = await supabase
            .from('request_components')
            .insert({
              request_id: request.id,
              ident_code: mat.ident_code,
              tag: mat.tag || null,
              dia1: mat.dia1 || null,
              iso_number: requestType === 'Piping' ? isoNumber : null,
              full_spool_number: requestType === 'Piping' ? spoolNumber : (mat.from_spool || null),
              tag_number: mat.tag || null,
              description: mat.description,
              quantity: parseInt(mat.qty) || 1,
              status: status,
              current_location: destination === 'yard' ? 'YARD' : 'SITE',
              sub_category: mat.sub_category || subCategory || null  // V28.10: Use material's sub_category
            })
            .select()
            .single();
          
          console.log('Component created:', { comp, compError });
            
          if (compError) throw compError;
          
          // Log to component_history
          await supabase.from('component_history').insert({
            component_id: comp.id,
            action: 'Request Created',
            from_status: null,
            to_status: status,
            performed_by_user_id: user.id,
            performed_by_name: user.full_name,
            note: `Request ${String(reqNumber).padStart(5, '0')}-00-00-00 created and sent to ${destination.toUpperCase()}`
          });
        }
      }

      setMessage({ type: 'success', text: `Request ${String(reqNumber).padStart(5, '0')}-00-00-00 created successfully!` });
      
      // Reset form
      setIsoNumber('');
      setSpoolNumber('');
      setSpoolOptions([]);
      setHfNumber('');
      setHfError(null);
      setDescription('');
      setTestPackNumber('');
      setMaterials([]);
      setOverQuantityWarning(null);
      setProjectQtyExhausted(false);
      setComponentDescription('');
      setSelectedSpools([]);
      setCurrentSpoolInput('');
      loadNextNumber();

    } catch (error) {
      setMessage({ type: 'error', text: `Error: ${error.message}` });
    } finally {
      setLoading(false);
    }
  };

  const canModify = canModifyPage(user, 'requests');
  const hasWarning = overQuantityWarning !== null;
  // V28.10: TestPack requests must go to Engineering only
  const siteYardDisabled = projectQtyExhausted || hfError || requestType === 'TestPack';

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 'bold' }}>New Request</h2>
        <div style={{
          padding: '8px 16px',
          backgroundColor: '#f3f4f6',
          borderRadius: '6px',
          fontSize: '14px'
        }}>
          Preview: <strong>{String(nextNumber).padStart(5, '0')}-00-00-00</strong>
        </div>
      </div>

      {message.text && (
        <div style={{
          padding: '12px 16px',
          borderRadius: '6px',
          marginBottom: '16px',
          backgroundColor: message.type === 'success' ? '#D1FAE5' : '#FEE2E2',
          color: message.type === 'success' ? '#065F46' : '#DC2626'
        }}>
          {message.text}
        </div>
      )}

      <div style={styles.card}>
        <div style={{ padding: '24px' }}>
          {/* Request Type Selection */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{ ...styles.label, marginBottom: '12px' }}>Request Type</label>
            <div style={{ display: 'flex', gap: '24px' }}>
              {REQUEST_TYPES.map(type => (
                <label key={type} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name="requestType"
                    value={type}
                    checked={requestType === type}
                    onChange={(e) => handleRequestTypeChange(e.target.value)}
                    disabled={!canModify}
                    style={{ width: '18px', height: '18px' }}
                  />
                  <span style={{ fontWeight: requestType === type ? '600' : '400', fontSize: '15px' }}>{type}</span>
                </label>
              ))}
            </div>
          </div>

          {/* =============== PIPING FORM =============== */}
          {requestType === 'Piping' && (
            <>
              <div style={{ marginBottom: '20px' }}>
                <label style={styles.label}>Sub-Category</label>
                <select
                  value={subCategory}
                  onChange={(e) => setSubCategory(e.target.value)}
                  style={{ ...styles.select, maxWidth: '300px' }}
                  disabled={!canModify}
                >
                  {SUB_CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                <div>
                  <label style={styles.label}>ISO Number * <span style={{ fontSize: '11px', color: '#9ca3af' }}>(type 4+ chars)</span></label>
                  <AsyncSearchInput
                    value={isoNumber}
                    onChange={handleIsoChange}
                    onSearch={searchIsoOptions}
                    onSelect={(val) => {
                      handleIsoChange(val);
                      loadSpoolOptions(val);
                    }}
                    minChars={4}
                    placeholder="Type ISO number (4+ chars)..."
                    disabled={!canModify}
                  />
                </div>
                <div>
                  <label style={styles.label}>Full Spool Number * <span style={{ fontSize: '11px', color: '#9ca3af' }}>(type 3+ chars)</span></label>
                  {isoNumber ? (
                    <AsyncSearchInput
                      value={spoolNumber}
                      onChange={handleSpoolChange}
                      onSearch={searchSpoolOptions}
                      onSelect={(val) => handleSpoolChange(val)}
                      minChars={3}
                      placeholder="Type spool number (3+ chars)..."
                      disabled={!canModify}
                    />
                  ) : (
                    <input
                      type="text"
                      value=""
                      style={{ ...styles.input, backgroundColor: '#f3f4f6' }}
                      disabled={true}
                      placeholder="Select ISO first"
                    />
                  )}
                </div>
              </div>

              {/* HF Number with duplicate check - IMPROVED */}
              {subCategory === 'Erection' && (
                <div style={{ 
                  marginBottom: '20px', 
                  padding: '16px', 
                  backgroundColor: hfError ? '#FEE2E2' : '#FEF3C7', 
                  borderRadius: '8px',
                  border: `2px solid ${hfError ? '#EF4444' : '#F59E0B'}`
                }}>
                  <label style={{ ...styles.label, color: hfError ? '#DC2626' : '#92400E' }}>
                    🔩 HF Number (Flanged Joint) *
                  </label>
                  <input
                    type="text"
                    value={hfNumber}
                    onChange={(e) => handleHfChange(e.target.value)}
                    style={{ ...styles.input, backgroundColor: 'white', borderColor: hfError ? '#EF4444' : '#d1d5db' }}
                    placeholder="HF123456"
                    maxLength={8}
                    disabled={!canModify}
                  />
                  {hfError && (
                    <div style={{ 
                      marginTop: '12px', 
                      padding: '12px', 
                      backgroundColor: 'white', 
                      borderRadius: '6px',
                      border: '1px solid #EF4444'
                    }}>
                      <p style={{ fontWeight: '600', color: '#DC2626', marginBottom: '8px' }}>
                        ⚠️ {hfError.message}
                      </p>
                      <p style={{ fontSize: '13px', color: '#6b7280' }}>
                        <strong>Request:</strong> {hfError.request}<br />
                        <strong>Date:</strong> {hfError.date}<br />
                        <strong>Requested by:</strong> {hfError.person}
                      </p>
                    </div>
                  )}
                  {!hfError && (
                    <p style={{ fontSize: '12px', color: '#92400E', marginTop: '6px' }}>
                      Format: HF + 6 digits (e.g., HF123456)
                    </p>
                  )}
                </div>
              )}

              <div style={{ marginBottom: '20px' }}>
                <label style={styles.label}>Note (optional)</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  style={{ ...styles.input, minHeight: '80px', resize: 'vertical' }}
                  placeholder="Additional notes..."
                  disabled={!canModify}
                />
              </div>
            </>
          )}

          {/* =============== MECHANICAL FORM =============== */}
          {requestType === 'Mechanical' && (
            <div style={{ marginBottom: '20px' }}>
              <label style={styles.label}>Description *</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                style={{ ...styles.input, minHeight: '120px', resize: 'vertical' }}
                placeholder="Describe the mechanical request..."
                disabled={!canModify}
              />
            </div>
          )}

          {/* =============== TESTPACK FORM =============== */}
          {requestType === 'TestPack' && (
            <>
              <div style={{ 
                marginBottom: '20px', 
                padding: '16px', 
                backgroundColor: '#DBEAFE', 
                borderRadius: '8px',
                border: '1px solid #3B82F6'
              }}>
                <label style={{ ...styles.label, color: '#1E40AF' }}>📋 Test Pack Number *</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0' }}>
                  <span style={{ 
                    padding: '10px 12px', 
                    backgroundColor: '#1E40AF', 
                    color: 'white', 
                    fontWeight: '700', 
                    fontSize: '16px',
                    borderRadius: '6px 0 0 6px',
                    fontFamily: 'monospace'
                  }}>
                    MAX-TP-
                  </span>
                  <input
                    type="text"
                    value={testPackNumber}
                    onChange={(e) => {
                      // Only allow digits, max 4 characters
                      const val = e.target.value.replace(/\D/g, '').slice(0, 4);
                      setTestPackNumber(val);
                    }}
                    style={{ 
                      ...styles.input, 
                      backgroundColor: 'white', 
                      fontSize: '16px', 
                      fontFamily: 'monospace',
                      fontWeight: '700',
                      borderRadius: '0 6px 6px 0',
                      width: '100px',
                      textAlign: 'center',
                      letterSpacing: '2px'
                    }}
                    placeholder="0001"
                    maxLength={4}
                    disabled={!canModify}
                  />
                </div>
                <p style={{ fontSize: '12px', color: '#1E40AF', marginTop: '8px' }}>
                  Enter 4 digits. Result: MAX-TP-{testPackNumber.padStart(4, '0') || 'XXXX'}
                </p>
              </div>

              {/* V28.3: Note field for TestPack */}
              <div style={{ marginBottom: '20px' }}>
                <label style={styles.label}>Note (optional)</label>
                <textarea
                  value={componentDescription}
                  onChange={(e) => setComponentDescription(e.target.value)}
                  style={{ ...styles.input, minHeight: '80px' }}
                  placeholder="Enter any additional notes..."
                  disabled={!canModify}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={styles.label}>Add Items From</label>
                <div style={{ display: 'flex', gap: '24px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={missingType === 'Material' || missingType === 'Both'}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setMissingType(missingType === 'Spool' ? 'Both' : 'Material');
                        } else {
                          setMissingType(missingType === 'Both' ? 'Spool' : 'Material');
                        }
                      }}
                      style={{ width: '18px', height: '18px' }}
                    />
                    <span style={{ fontWeight: (missingType === 'Material' || missingType === 'Both') ? '600' : '400' }}>📦 Materials</span>
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={missingType === 'Spool' || missingType === 'Both'}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setMissingType(missingType === 'Material' ? 'Both' : 'Spool');
                        } else {
                          setMissingType(missingType === 'Both' ? 'Material' : 'Spool');
                        }
                      }}
                      style={{ width: '18px', height: '18px' }}
                    />
                    <span style={{ fontWeight: (missingType === 'Spool' || missingType === 'Both') ? '600' : '400' }}>◎ Spools</span>
                  </label>
                </div>
                <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
                  Select one or both to add materials and/or entire spools
                </p>
              </div>

              {/* V28.11: Sub-Category for TestPack Material - always show when Materials checked */}
              {(missingType === 'Material' || missingType === 'Both') && (
                <div style={{ marginBottom: '20px' }}>
                  <label style={styles.label}>Sub-Category *</label>
                  <select
                    value={subCategory}
                    onChange={(e) => setSubCategory(e.target.value)}
                    style={styles.input}
                    disabled={!canModify}
                  >
                    <option value="Bulk">Bulk</option>
                    <option value="Erection">Erection</option>
                    <option value="Instrument">Instrument</option>
                    <option value="Support">Support</option>
                  </select>
                </div>
              )}

              {/* V28.9: HF Number (optional) for TestPack Erection only - just for info */}
              {(missingType === 'Material' || missingType === 'Both') && subCategory === 'Erection' && (
                <div style={{ marginBottom: '20px' }}>
                  <label style={styles.label}>HF Number (optional - for reference only)</label>
                  <input
                    type="text"
                    value={hfNumber}
                    onChange={async (e) => {
                      setHfNumber(e.target.value);
                      // Check for duplicate HF
                      if (e.target.value && e.target.value.length >= 8) {
                        const { data: existing } = await supabase
                          .from('requests')
                          .select('request_number, requester_user_id, created_at')
                          .eq('hf_number', e.target.value)
                          .limit(1)
                          .single();
                        if (existing) {
                          const { data: userData } = await supabase
                            .from('users')
                            .select('full_name')
                            .eq('id', existing.requester_user_id)
                            .single();
                          setHfError({
                            request_number: existing.request_number,
                            requester: userData?.full_name || 'Unknown',
                            date: new Date(existing.created_at).toLocaleDateString()
                          });
                        } else {
                          setHfError(null);
                        }
                      } else {
                        setHfError(null);
                      }
                    }}
                    style={{ 
                      ...styles.input, 
                      borderColor: hfError ? COLORS.danger : undefined,
                      backgroundColor: hfError ? '#FEE2E2' : undefined
                    }}
                    placeholder="Es: HF123456 (optional)"
                    disabled={!canModify}
                  />
                  {hfError && (
                    <div style={{ 
                      marginTop: '8px', 
                      padding: '12px', 
                      backgroundColor: '#FEE2E2', 
                      borderRadius: '6px',
                      border: '1px solid #F87171'
                    }}>
                      <p style={{ color: '#B91C1C', fontWeight: '600' }}>⚠️ HF già richiesto!</p>
                      <p style={{ color: '#7F1D1D', fontSize: '13px', marginTop: '4px' }}>
                        Request: <strong>{String(hfError.request_number).padStart(5, '0')}</strong><br/>
                        Richiedente: <strong>{hfError.requester}</strong><br/>
                        Data: <strong>{hfError.date}</strong>
                      </p>
                    </div>
                  )}
                  <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
                    In TestPack, HF è solo informativo. La richiesta segue il flusso TestPack.
                  </p>
                </div>
              )}

              {(missingType === 'Spool' || missingType === 'Both') && (
                <div style={{ marginBottom: '20px' }}>
                  <label style={styles.label}>Full Spool Number * <span style={{ fontSize: '11px', color: '#9ca3af' }}>(type 6+ chars)</span></label>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                    <div style={{ flex: 1 }}>
                      <AsyncSearchInput
                        value={currentSpoolInput}
                        onChange={(val) => setCurrentSpoolInput(val)}
                        onSearch={searchTestPackSpool}
                        onSelect={(val) => setCurrentSpoolInput(val)}
                        minChars={6}
                        placeholder="Type spool number (6+ chars)..."
                        disabled={!canModify}
                      />
                    </div>
                    <button
                      onClick={() => {
                        if (currentSpoolInput && !selectedSpools.includes(currentSpoolInput)) {
                          setSelectedSpools([...selectedSpools, currentSpoolInput]);
                          setCurrentSpoolInput('');
                        }
                      }}
                      disabled={!currentSpoolInput || selectedSpools.includes(currentSpoolInput)}
                      style={{
                        ...styles.button,
                        backgroundColor: currentSpoolInput && !selectedSpools.includes(currentSpoolInput) ? COLORS.success : '#d1d5db',
                        color: 'white',
                        marginTop: '0px',
                        height: '42px',
                        padding: '0 16px'
                      }}
                    >
                      + Add
                    </button>
                  </div>
                  <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '6px' }}>Excludes SP000, SPSUP, SPTAG. Add multiple spools to combine in one request.</p>
                  
                  {/* Selected Spools List */}
                  {selectedSpools.length > 0 && (
                    <div style={{ 
                      marginTop: '16px', 
                      padding: '12px', 
                      backgroundColor: '#ECFDF5', 
                      borderRadius: '8px',
                      border: '1px solid #10B981'
                    }}>
                      <p style={{ fontWeight: '600', color: '#065F46', marginBottom: '8px' }}>
                        📦 Selected Spools ({selectedSpools.length}):
                      </p>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                        {selectedSpools.map((spool, idx) => (
                          <div key={idx} style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '6px',
                            backgroundColor: 'white',
                            padding: '6px 10px',
                            borderRadius: '6px',
                            border: '1px solid #A7F3D0',
                            fontSize: '13px',
                            fontFamily: 'monospace'
                          }}>
                            {spool}
                            <button
                              onClick={() => setSelectedSpools(selectedSpools.filter((_, i) => i !== idx))}
                              style={{
                                background: 'none',
                                border: 'none',
                                color: COLORS.primary,
                                cursor: 'pointer',
                                fontSize: '16px',
                                padding: '0 2px',
                                lineHeight: 1
                              }}
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </>
          )}

          {/* =============== MATERIALS SECTION =============== */}
          {requestType !== 'Mechanical' && (requestType !== 'TestPack' || missingType === 'Material' || missingType === 'Both') && (
            <div style={{
              marginTop: '24px',
              padding: '20px',
              backgroundColor: '#f9fafb',
              borderRadius: '8px',
              border: '1px solid #e5e7eb'
            }}>
              <h4 style={{ fontWeight: '600', marginBottom: '16px' }}>📦 Add Materials</h4>
              
              <div style={{ display: 'flex', gap: '12px', alignItems: 'end' }}>
                {/* V29.0: Ident Code with search like Material IN */}
                <div style={{ flex: 1, position: 'relative' }}>
                  <label style={styles.label}>
                    Ident Code * <span style={{ fontSize: '11px', color: '#9ca3af' }}>(type 3+ chars)</span>
                  </label>
                  <input
                    type="text"
                    value={currentMaterial.ident_code}
                    onChange={(e) => searchIdentForRequest(e.target.value)}
                    onFocus={() => identSearchResults.length > 0 && setShowIdentResults(true)}
                    onBlur={() => setTimeout(() => setShowIdentResults(false), 200)}
                    style={styles.input}
                    placeholder="Type 3+ chars to search..."
                    disabled={!canModify}
                  />
                  {showIdentResults && identSearchResults.length > 0 && (
                    <div style={{
                      position: 'absolute',
                      top: '100%',
                      left: 0,
                      right: 0,
                      maxHeight: '200px',
                      overflowY: 'auto',
                      backgroundColor: 'white',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                      zIndex: 100
                    }}>
                      {identSearchResults.map((item, idx) => (
                        <div
                          key={idx}
                          onClick={() => selectIdentForRequest(item)}
                          style={{
                            padding: '10px 12px',
                            cursor: 'pointer',
                            borderBottom: '1px solid #f3f4f6',
                            fontSize: '13px'
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
                          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                        >
                          <div style={{ fontWeight: '600', fontFamily: 'monospace' }}>{item.ident_code}</div>
                          <div style={{ color: '#6b7280', fontSize: '12px', marginTop: '2px' }}>
                            📦 {item.description ? item.description.substring(0, 50) + (item.description.length > 50 ? '...' : '') : '(no description)'}
                            {item.dia1 && <span style={{ marginLeft: '8px', color: '#3b82f6' }}>[Ø{item.dia1}]</span>}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                {/* Description (auto-filled) */}
                <div style={{ flex: 2 }}>
                  <label style={styles.label}>Description</label>
                  <input
                    type="text"
                    value={currentMaterial.description || ''}
                    readOnly
                    style={{ ...styles.input, backgroundColor: '#f3f4f6' }}
                    placeholder="Auto-filled"
                  />
                </div>
                {/* Diam (auto-filled) */}
                <div style={{ width: '80px' }}>
                  <label style={styles.label}>Diam</label>
                  <input
                    type="text"
                    value={currentMaterial.dia1 || ''}
                    readOnly
                    style={{ ...styles.input, backgroundColor: '#f3f4f6' }}
                    placeholder="Auto"
                  />
                </div>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 100px 80px', gap: '12px', alignItems: 'end', marginTop: '12px' }}>
                <div>
                  <label style={styles.label}>Tag</label>
                  <select
                    value={currentMaterial.tag}
                    onChange={(e) => setCurrentMaterial({ ...currentMaterial, tag: e.target.value })}
                    style={styles.select}
                    disabled={!canModify || !currentMaterial.ident_code}
                  >
                    <option value="">{currentMaterial.ident_code ? 'None' : 'Select Ident first'}</option>
                    {tagOptions.map(t => (
                      <option key={t.tag_code} value={t.tag_code}>{t.tag_code}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={styles.label}>Qty</label>
                  <input
                    type="number"
                    value={currentMaterial.qty}
                    onChange={(e) => setCurrentMaterial({ ...currentMaterial, qty: e.target.value })}
                    style={styles.input}
                    min="1"
                    disabled={!canModify}
                  />
                </div>
                <button
                  onClick={addMaterial}
                  style={{ 
                    ...styles.button, 
                    ...styles.buttonPrimary, 
                    height: '42px', 
                    justifyContent: 'center',
                    opacity: (!canModify || !currentMaterial.ident_code || !currentMaterial.qty || !currentMaterial.description) ? 0.5 : 1
                  }}
                  disabled={!canModify || !currentMaterial.ident_code || !currentMaterial.qty || !currentMaterial.description}
                  title={!currentMaterial.description ? 'Select an item with description first' : ''}
                >
                  + Add
                </button>
              </div>

              {/* Quantity Exhausted Warning */}
              {projectQtyExhausted && (
                <div style={{
                  marginTop: '16px',
                  padding: '16px',
                  backgroundColor: '#FEE2E2',
                  border: '2px solid #EF4444',
                  borderRadius: '8px',
                  color: '#DC2626'
                }}>
                  <div style={{ fontWeight: '700', marginBottom: '8px', fontSize: '15px' }}>
                    🚫 QUANTITY ALREADY COLLECTED
                  </div>
                  <div style={{ fontSize: '13px', marginBottom: '8px' }}>
                    For <strong>{overQuantityWarning?.ident_code}</strong>:
                    <br />• Already Collected: <strong>{overQuantityWarning?.recordOut}</strong>
                    <br />• Already Requested: <strong>{overQuantityWarning?.alreadyRequested}</strong>
                  </div>
                  <div style={{ 
                    padding: '10px', 
                    backgroundColor: '#FECACA', 
                    borderRadius: '4px',
                    fontWeight: '600'
                  }}>
                    ⚠️ For this item you can only send to Engineering
                  </div>
                </div>
              )}

              {/* Over-Quantity Warning */}
              {hasWarning && !projectQtyExhausted && (
                <div style={{
                  marginTop: '16px',
                  padding: '12px 16px',
                  backgroundColor: '#FEF3C7',
                  border: '2px solid #F59E0B',
                  borderRadius: '8px',
                  color: '#92400E'
                }}>
                  <div style={{ fontWeight: '600', marginBottom: '4px' }}>
                    ⚠️ Over-Quantity Warning for {overQuantityWarning.ident_code}
                  </div>
                  <div style={{ fontSize: '13px' }}>
                    Available: <strong>{overQuantityWarning.available}</strong> | 
                    Requested: <strong>{overQuantityWarning.totalRequested}</strong>
                  </div>
                </div>
              )}

              {/* Materials List */}
              {materials.length > 0 && (
                <table style={{ ...styles.table, marginTop: '16px' }}>
                  <thead>
                    <tr>
                      <th style={styles.th}>Sub</th>
                      <th style={styles.th}>Code</th>
                      <th style={styles.th}>Description</th>
                      <th style={styles.th}>Diam</th>
                      <th style={styles.th}>Tag</th>
                      <th style={styles.th}>Qty</th>
                      <th style={styles.th}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {materials.map((mat, idx) => (
                      <tr key={idx}>
                        <td style={styles.td}>
                          <span style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            backgroundColor: mat.sub_category === 'Bulk' ? '#DBEAFE' : 
                                            mat.sub_category === 'Erection' ? '#FEE2E2' :
                                            mat.sub_category === 'Support' ? '#FEF3C7' :
                                            mat.sub_category === 'Spool' ? '#E0E7FF' : '#F3F4F6',
                            padding: '2px 6px',
                            borderRadius: '4px',
                            fontSize: '11px',
                            fontWeight: '600'
                          }}>
                            <span style={{
                              width: '8px',
                              height: '8px',
                              borderRadius: '50%',
                              backgroundColor: mat.sub_category === 'Bulk' ? COLORS.info : 
                                              mat.sub_category === 'Erection' ? COLORS.primary :
                                              mat.sub_category === 'Support' ? COLORS.warning :
                                              mat.sub_category === 'Spool' ? COLORS.purple : COLORS.gray
                            }}></span>
                            {abbrevSubCategory(mat.sub_category)}
                          </span>
                        </td>
                        <td style={{ ...styles.td, fontFamily: 'monospace' }}>{mat.ident_code}</td>
                        <td style={{ ...styles.td, maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis' }}>{mat.description || '-'}</td>
                        <td style={styles.td}>{mat.dia1 || '-'}</td>
                        <td style={styles.td}>{mat.tag || '-'}</td>
                        <td style={styles.td}>{mat.qty}</td>
                        <td style={styles.td}>
                          <ActionButton color={COLORS.primary} onClick={() => removeMaterial(idx)} title="Remove">×</ActionButton>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {/* =============== SUBMIT BUTTONS =============== */}
          <div style={{ 
            marginTop: '24px', 
            paddingTop: '24px', 
            borderTop: '1px solid #e5e7eb',
            display: 'flex',
            gap: '12px',
            justifyContent: 'flex-end'
          }}>
            <button
              onClick={() => submitRequest('site')}
              disabled={!canModify || loading || siteYardDisabled}
              style={{
                ...styles.button,
                backgroundColor: siteYardDisabled ? '#d1d5db' : COLORS.info,
                color: 'white',
                cursor: siteYardDisabled ? 'not-allowed' : 'pointer'
              }}
              title={siteYardDisabled ? (requestType === 'TestPack' ? 'TestPack → Solo Engineering' : 'Disabled - use Engineering') : ''}
            >
              📤 Send to WH Site
            </button>
            <button
              onClick={() => submitRequest('yard')}
              disabled={!canModify || loading || siteYardDisabled}
              style={{
                ...styles.button,
                backgroundColor: siteYardDisabled ? '#d1d5db' : COLORS.secondary,
                color: 'white',
                cursor: siteYardDisabled ? 'not-allowed' : 'pointer'
              }}
              title={siteYardDisabled ? (requestType === 'TestPack' ? 'TestPack → Solo Engineering' : 'Disabled - use Engineering') : ''}
            >
              📤 Send to WH Yard
            </button>
            <button
              onClick={() => submitRequest('engineering')}
              disabled={!canModify || loading}
              style={{
                ...styles.button,
                backgroundColor: COLORS.purple,
                color: 'white',
                border: siteYardDisabled ? '3px solid #7C3AED' : 'none',
                animation: siteYardDisabled ? 'pulse 2s infinite' : 'none'
              }}
            >
              ⚙️ Send to Engineering {siteYardDisabled && requestType !== 'TestPack' && '(Required)'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// WH SITE PAGE - V28.1 with WH_Site/WH_Yard columns
// ============================================================
function WHSitePage({ user }) {
  const [components, setComponents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPartialModal, setShowPartialModal] = useState(false);
  const [selectedComponent, setSelectedComponent] = useState(null);
  const [partialQty, setPartialQty] = useState('');
  // V28.7: New state for improved Split Partial modal
  const [partialFoundDest, setPartialFoundDest] = useState('ToCollect');
  const [partialNotFoundDest, setPartialNotFoundDest] = useState('Eng');
  const [showNotePopup, setShowNotePopup] = useState(false);
  const [showDestPopup, setShowDestPopup] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);
  const [showHistory, setShowHistory] = useState(false);
  const [historyComponentId, setHistoryComponentId] = useState(null);
  const [engChecks, setEngChecks] = useState([]);
  const [inventoryMap, setInventoryMap] = useState({});
  const [totalRequestedMap, setTotalRequestedMap] = useState({}); // V28.5: Sum of all open requests per ident_code
  // Engineering Check Partial state
  const [showCheckPartialModal, setShowCheckPartialModal] = useState(false);
  const [selectedCheck, setSelectedCheck] = useState(null);
  const [checkPartialQty, setCheckPartialQty] = useState('');
  const [checkFoundDest, setCheckFoundDest] = useState('ToCollect');
  const [checkNotFoundDest, setCheckNotFoundDest] = useState('Eng');
  // V28.10: Collector selection for notifications
  const [showCollectorModal, setShowCollectorModal] = useState(false);
  const [allUsers, setAllUsers] = useState([]);
  const [selectedCollectorId, setSelectedCollectorId] = useState('');
  const [collectorSearchTerm, setCollectorSearchTerm] = useState('');

  useEffect(() => { loadComponents(); loadUsers(); }, []);

  // V28.10: Load all active users for collector selection
  const loadUsers = async () => {
    const { data } = await supabase.from('users').select('id, full_name, role').eq('is_active', true).order('full_name');
    if (data) setAllUsers(data);
  };

  const loadComponents = async () => {
    setLoading(true);
    
    // V28.5: Load ALL open requests to sum quantities per ident_code
    const openStatuses = ['WH_Site', 'Yard', 'Eng', 'Order', 'Trans', 'ToCollect', 'TP', 'HF', 'Spare', 'Mng'];
    const { data: allOpenData } = await supabase
      .from('request_components')
      .select('ident_code, quantity')
      .in('status', openStatuses);
    
    const reqMap = {};
    if (allOpenData) {
      allOpenData.forEach(c => {
        reqMap[c.ident_code] = (reqMap[c.ident_code] || 0) + (c.quantity || 0);
      });
    }
    setTotalRequestedMap(reqMap);
    
    // Load components with full request info
    const { data: siteData, error: siteError } = await supabase
      .from('request_components')
      .select(`*, requests (request_number, sub_number, request_number_full, level_component, level_wh_split, level_yard_split, sub_category, request_type, iso_number, full_spool_number, hf_number, test_pack_number, description)`)
      .eq('status', 'WH_Site');

    console.log('WH Site - Loading components with status=WH_Site:', { siteData, siteError });

    // Load Engineering Checks sent to Site (separate section)
    // V32.2: Use simpler query first, then try with extended fields
    let checksData = [];
    let checksError = null;
    
    // Try with full fields first
    const { data: fullChecks, error: fullError } = await supabase
      .from('request_components')
      .select(`*, requests (id, request_number, sub_number, request_number_full, level_component, level_wh_split, level_yard_split, sub_category, request_type, iso_number, full_spool_number, hf_number, test_pack_number, description, parent_request_id, parent_request_number, site_sent_qty, yard_sent_qty, both_status, requester_user_id, created_by_name)`)
      .eq('has_eng_check', true)
      .eq('eng_check_sent_to', 'WH_Site');
    
    if (fullError || !fullChecks) {
      // Fallback: simpler query without potentially missing fields
      console.log('WH Site - Full query failed, trying simple query:', fullError);
      const { data: simpleChecks, error: simpleError } = await supabase
        .from('request_components')
        .select(`*, requests (id, request_number, sub_number, request_number_full, level_component, level_wh_split, level_yard_split, sub_category, request_type, iso_number, full_spool_number, hf_number, test_pack_number, description, requester_user_id, created_by_name)`)
        .eq('has_eng_check', true)
        .eq('eng_check_sent_to', 'WH_Site');
      checksData = simpleChecks || [];
      checksError = simpleError;
    } else {
      checksData = fullChecks;
    }

    console.log('WH Site - Engineering Checks loaded:', { checksData, checksError, count: checksData?.length });
    
    // V28.5 FIX: Get unique ident_codes from loaded components, then load ONLY those from inventory
    const allComponents = [...(siteData || []), ...(checksData || [])];
    const uniqueIdentCodes = [...new Set(allComponents.map(c => c.ident_code).filter(Boolean))];
    
    console.log('📦 WH Site - Unique ident_codes to look up:', uniqueIdentCodes);
    
    // Load inventory ONLY for the ident_codes we need (not all 52000+!)
    let invMap = {};
    if (uniqueIdentCodes.length > 0) {
      const { data: invData, error: invError } = await supabase
        .from('inventory')
        .select('ident_code, site_qty, yard_qty')
        .in('ident_code', uniqueIdentCodes);
      
      console.log('📦 WH Site - Inventory for our components:', { invData, invError });
      
      if (invData) {
        invData.forEach(i => { 
          invMap[i.ident_code] = { site: i.site_qty || 0, yard: i.yard_qty || 0 }; 
        });
      }
    }
    
    // Debug: verify C1GXTDJK
    console.log('📦 WH Site - invMap[C1GXTDJK]:', invMap['C1GXTDJK']);
    
    setInventoryMap(invMap);

    if (siteData) setComponents(siteData);
    setEngChecks(checksData);
    setLoading(false);
  };

  const logHistory = async (compId, action, fromStatus, toStatus, note) => {
    await supabase.from('component_history').insert({
      component_id: compId,
      action: action,
      from_status: fromStatus,
      to_status: toStatus,
      performed_by_user_id: user.id,
      performed_by_name: user.full_name,
      note: note
    });
  };

  const handleAction = async (component, action, note = '') => {
    try {
      switch (action) {
        case 'ready':
          setSelectedComponent(component);
          setShowDestPopup(true);
          setPendingAction('ready');
          return;
        case 'pt':
          setSelectedComponent(component);
          setShowPartialModal(true);
          return;
        case 'yard':
          await supabase.from('request_components')
            .update({ status: 'Yard', current_location: 'YARD' })
            .eq('id', component.id);
          await logHistory(component.id, 'Sent to Yard', 'WH_Site', 'Yard', note);
          break;
        case 'eng':
          await supabase.from('request_components')
            .update({ status: 'Eng' })
            .eq('id', component.id);
          await logHistory(component.id, 'Sent to Engineering', 'WH_Site', 'Eng', note);
          break;
        case 'hf':
          // V28.4: Direct to HF page
          await supabase.from('request_components')
            .update({ status: 'HF' })
            .eq('id', component.id);
          await logHistory(component.id, 'Sent to HF', 'WH_Site', 'HF', 'Direct to HF from WH Site');
          break;
        case 'tp':
          // V28.4: Direct to TestPack page
          await supabase.from('request_components')
            .update({ status: 'TP' })
            .eq('id', component.id);
          await logHistory(component.id, 'Sent to TestPack', 'WH_Site', 'TP', 'Direct to TestPack from WH Site');
          break;
        case 'delete':
          if (confirm('Delete this component?')) {
            await supabase.from('request_components')
              .update({ status: 'Cancelled' })
              .eq('id', component.id);
            await logHistory(component.id, 'Cancelled', 'WH_Site', 'Cancelled', note);
          }
          break;
        case 'ack':
          await supabase.from('request_components')
            .update({ has_eng_check: false, eng_check_message: null, eng_check_sent_to: null })
            .eq('id', component.id);
          break;
      }
      loadComponents();
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };

  const handleDestinationSelect = async (dest) => {
    const component = selectedComponent;
    
    // V28.10: If going to ToCollect, show collector selection modal first
    if (dest === 'siteIn') {
      setShowDestPopup(false);
      setShowCollectorModal(true);
      return;
    }
    
    let newStatus;
    let note = '';
    
    switch(dest) {
      case 'hf':
        newStatus = 'HF';
        note = 'Sent to HF Page for completion';
        break;
      case 'tp':
        newStatus = 'TP';
        note = 'Sent to TestPack Page for completion';
        break;
    }
    
    await supabase.from('request_components')
      .update({ status: newStatus })
      .eq('id', component.id);
    
    await logHistory(component.id, `Ready - ${dest.toUpperCase()}`, 'WH_Site', newStatus, note);
    
    setShowDestPopup(false);
    setSelectedComponent(null);
    loadComponents();
  };

  // V28.10: Complete ToCollect with collector selection and notification
  const completeToCollect = async () => {
    const component = selectedComponent;
    const collectorUser = allUsers.find(u => u.id === selectedCollectorId);
    
    await supabase.from('request_components')
      .update({ 
        status: 'ToCollect',
        designated_collector_id: selectedCollectorId || null
      })
      .eq('id', component.id);
    
    await logHistory(component.id, 'Ready for Collection', 'WH_Site', 'ToCollect', 
      collectorUser ? `Assigned to: ${collectorUser.full_name}` : 'Ready for collection');
    
    // V28.10: Send notification to selected user
    if (selectedCollectorId) {
      try {
        await supabase.from('notifications').insert({
          user_id: selectedCollectorId,
          title: 'Material Ready for Collection',
          message: `${component.ident_code} (Qty: ${component.quantity}) is ready to collect at Site warehouse`,
          type: 'collect',
          related_component_id: component.id
        });
      } catch (err) {
        console.log('Notification not sent - table may not exist yet');
      }
    }
    
    setShowCollectorModal(false);
    setSelectedCollectorId('');
    setCollectorSearchTerm('');
    setSelectedComponent(null);
    loadComponents();
  };

  const submitPartial = async () => {
    const foundQty = parseInt(partialQty) || 0;
    const notFoundQty = selectedComponent.quantity - foundQty;
    
    // V32.3: Allow found == total ONLY if Not Found destination is "None" (close without sub-request)
    if (foundQty <= 0) {
      alert('Found quantity must be at least 1');
      return;
    }
    if (foundQty > selectedComponent.quantity) {
      alert('Found quantity cannot exceed total requested');
      return;
    }
    if (foundQty === selectedComponent.quantity && partialNotFoundDest !== 'None') {
      alert('If sending all quantity, select "None (Close)" for Not Found destination');
      return;
    }
    if (foundQty < selectedComponent.quantity && partialNotFoundDest === 'None' && notFoundQty > 0) {
      // This is OK - user wants to close without creating sub-request for not found
    }
    
    try {
      // V28.7: Update original component with found quantity and destination
      await supabase.from('request_components')
        .update({ 
          quantity: foundQty, 
          status: partialFoundDest,
          previous_status: 'WH_Site',
          current_location: partialFoundDest === 'Yard' ? 'YARD' : 'SITE'
        })
        .eq('id', selectedComponent.id);
      
      let notFoundReqNumber = 'Closed';
      
      // V32.1: Only create sub-request if NOT "None"
      if (partialNotFoundDest !== 'None') {
        // Create new sub-request for not found items
        const { data: subData } = await supabase
          .from('requests')
          .select('sub_number')
          .eq('request_number', selectedComponent.requests.request_number)
          .order('sub_number', { ascending: false })
          .limit(1);
        
        const nextSub = (subData?.[0]?.sub_number || 0) + 1;
        
        // V30.0: Get parent_request_number - use existing parent or the mother request_number
        const parentReqNum = selectedComponent.requests.parent_request_number || selectedComponent.requests.request_number;
        
        const { data: newReq, error: reqError } = await supabase.from('requests')
          .insert({
            request_number: selectedComponent.requests.request_number,
            sub_number: nextSub,
            parent_request_number: parentReqNum,
            request_type: selectedComponent.requests.request_type,
            sub_category: selectedComponent.requests.sub_category,
            iso_number: selectedComponent.requests.iso_number,
            full_spool_number: selectedComponent.requests.full_spool_number,
            hf_number: selectedComponent.requests.hf_number,
            test_pack_number: selectedComponent.requests.test_pack_number,
            requester_user_id: selectedComponent.requests.requester_user_id,
            created_by_name: selectedComponent.requests.created_by_name
          })
          .select()
          .single();
        
        if (reqError || !newReq) {
          console.error('Request insert error:', reqError);
          alert('Error creating sub-request: ' + (reqError?.message || 'Unknown error'));
          loadComponents();
          return;
        }
        
        notFoundReqNumber = newReq.request_number_full || formatRequestNumber(newReq.request_number, newReq.sub_number || 0, 0, 0);
        
        // V28.7: Create component for not found quantity with selected destination
        await supabase.from('request_components').insert({
          request_id: newReq.id,
          ident_code: selectedComponent.ident_code,
          description: selectedComponent.description,
          tag: selectedComponent.tag,
          dia1: selectedComponent.dia1,
          quantity: notFoundQty,
          status: partialNotFoundDest,
          current_location: partialNotFoundDest === 'Yard' ? 'YARD' : 'SITE'
        });
      }
      
      // V32.1: Log history with proper message
      const logNote = partialNotFoundDest === 'None' 
        ? `Partial: ${foundQty} found → ${partialFoundDest}, ${notFoundQty} not found → Closed (no sub-request)`
        : `Partial: ${foundQty} found → ${partialFoundDest}, ${notFoundQty} not found → ${partialNotFoundDest} (${notFoundReqNumber})`;
      await logHistory(selectedComponent.id, 'Partial Split', 'WH_Site', partialFoundDest, logNote);

      setShowPartialModal(false);
      setPartialQty('');
      setPartialFoundDest('ToCollect');
      setPartialNotFoundDest('Eng');
      loadComponents();
    } catch (error) {
      console.error('Partial split error:', error);
      alert('Error during partial split: ' + error.message);
      loadComponents();
    }
  };

  // Handle Engineering Check actions
  const handleCheckAction = async (check, action) => {
    try {
      if (action === 'check_found') {
        // V32.1: Found → move to ToCollect with tracking
        const isBothRequest = check.requests?.both_status !== null;
        const parentRequestId = check.requests?.parent_request_id;
        const yardSent = check.requests?.yard_sent_qty || 0;
        const qtyToSend = check.quantity;
        
        await supabase.from('request_components')
          .update({ 
            status: 'ToCollect', 
            has_eng_check: false,
            eng_check_message: null,
            eng_check_sent_to: null,
            found_qty: qtyToSend
          })
          .eq('id', check.id);
        
        // V32.1: If Both request, update site_sent_qty on parent
        if (isBothRequest && parentRequestId) {
          const currentSiteSent = check.requests?.site_sent_qty || 0;
          const newSiteSent = currentSiteSent + qtyToSend;
          const totalSent = newSiteSent + yardSent;
          
          await supabase.from('requests')
            .update({ 
              site_sent_qty: newSiteSent,
              both_status: totalSent >= check.quantity ? 'complete' : 'waiting_yard'
            })
            .eq('id', parentRequestId);
          
          // V32.1: If total sent >= qty, auto-cancel the Yard request
          if (totalSent >= check.quantity) {
            const { data: siblingReq } = await supabase
              .from('requests')
              .select('id')
              .eq('parent_request_id', parentRequestId)
              .eq('level_wh_split', 2) // Yard = 2
              .single();
            
            if (siblingReq) {
              await supabase.from('request_components')
                .update({ 
                  status: 'Cancelled', 
                  has_eng_check: false,
                  eng_check_sent_to: null 
                })
                .eq('request_id', siblingReq.id);
            }
          }
          
          // V32.1: Print Label A (Site → segregate material)
          printLabelSiteToTP(check, user, yardSent, check.quantity);
        }
        
        await logHistory(check.id, 'Check - Found', 'WH_Site', 'ToCollect', 'Item found after Engineering check');
        loadComponents();
      } else if (action === 'check_notfound') {
        // V32.1: Not Found → return to Engineering
        await supabase.from('request_components')
          .update({ 
            status: 'Eng', 
            has_eng_check: false,
            eng_check_message: null,
            eng_check_sent_to: null
          })
          .eq('id', check.id);
        await logHistory(check.id, 'Check - Not Found', 'WH_Site', 'Eng', 'Item not found, returned to Engineering');
        loadComponents();
      } else if (action === 'check_to_hf') {
        // V28.6: Send to HF
        await supabase.from('request_components')
          .update({ 
            status: 'HF', 
            has_eng_check: false,
            eng_check_message: null,
            eng_check_sent_to: null
          })
          .eq('id', check.id);
        await logHistory(check.id, 'Check - To HF', 'WH_Site', 'HF', 'Sent to HF from Engineering check');
        loadComponents();
      } else if (action === 'check_to_tp') {
        // V32.1: Send to TestPack with label printing
        const isBothRequest = check.requests?.both_status !== null;
        const parentRequestId = check.requests?.parent_request_id;
        const yardSent = check.requests?.yard_sent_qty || 0;
        const qtyToSend = check.quantity;
        
        // Update component status
        await supabase.from('request_components')
          .update({ 
            status: 'TP', 
            has_eng_check: false,
            eng_check_message: null,
            eng_check_sent_to: null,
            sent_to_tp_qty: qtyToSend
          })
          .eq('id', check.id);
        
        // V32.1: If Both request, update site_sent_qty on parent and check for auto-cancel
        if (isBothRequest && parentRequestId) {
          const currentSiteSent = check.requests?.site_sent_qty || 0;
          const newSiteSent = currentSiteSent + qtyToSend;
          const totalSent = newSiteSent + yardSent;
          
          await supabase.from('requests')
            .update({ 
              site_sent_qty: newSiteSent,
              both_status: totalSent >= check.quantity ? 'complete' : 'waiting_yard'
            })
            .eq('id', parentRequestId);
          
          // V32.1: If total sent >= qty, auto-cancel the Yard request
          if (totalSent >= check.quantity) {
            const { data: siblingReq } = await supabase
              .from('requests')
              .select('id')
              .eq('parent_request_id', parentRequestId)
              .eq('level_wh_split', 2) // Yard = 2
              .single();
            
            if (siblingReq) {
              await supabase.from('request_components')
                .update({ 
                  status: 'Cancelled', 
                  has_eng_check: false,
                  eng_check_sent_to: null 
                })
                .eq('request_id', siblingReq.id);
            }
          }
        }
        
        // V32.1: Print Label A (Site → TP)
        printLabelSiteToTP(check, user, yardSent, check.quantity);
        
        await logHistory(check.id, 'Check - To TestPack', 'WH_Site', 'TP', `Sent ${qtyToSend} to TestPack from Engineering check`);
        loadComponents();
      } else if (action === 'check_to_yard') {
        // V28.8: Send to Yard for checking there
        await supabase.from('request_components')
          .update({ 
            status: 'Yard', 
            current_location: 'YARD',
            has_eng_check: false,
            eng_check_message: null,
            eng_check_sent_to: null
          })
          .eq('id', check.id);
        await logHistory(check.id, 'Check - To Yard', 'WH_Site', 'Yard', 'Sent to Yard from Engineering check (no stock in Site)');
        loadComponents();
      } else if (action === 'check_partial') {
        // Open partial modal
        setSelectedCheck(check);
        setCheckPartialQty('');
        setCheckFoundDest('ToCollect');
        setCheckNotFoundDest('Eng');
        setShowCheckPartialModal(true);
      } else if (action === 'check_return') {
        // V28.10: Return to Engineering
        await supabase.from('request_components')
          .update({ 
            status: 'Eng', 
            has_eng_check: false,
            eng_check_message: null,
            eng_check_sent_to: null
          })
          .eq('id', check.id);
        await logHistory(check.id, 'Check - Returned', 'WH_Site', 'Eng', 'Returned to Engineering from check');
        loadComponents();
      } else if (action === 'check_delete') {
        // V28.10: Delete component
        if (!confirm('Are you sure you want to delete this item?')) return;
        await supabase.from('request_components')
          .update({ 
            status: 'Deleted',
            has_eng_check: false,
            eng_check_message: null,
            eng_check_sent_to: null
          })
          .eq('id', check.id);
        await logHistory(check.id, 'Deleted from Check', 'WH_Site', 'Deleted', 'Item deleted from Engineering check');
        loadComponents();
      }
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };

  // V32.0: Handle Engineering Check Partial Submit for WH Site
  const handleCheckPartialSubmit = async () => {
    if (!selectedCheck || !checkPartialQty) return;
    
    const foundQty = parseInt(checkPartialQty);
    const notFoundQty = selectedCheck.quantity - foundQty;
    
    if (foundQty <= 0 || foundQty >= selectedCheck.quantity) {
      alert('Quantity must be between 1 and ' + (selectedCheck.quantity - 1));
      return;
    }
    
    try {
      const currentReq = selectedCheck.requests;
      const reqNumber = currentReq?.request_number;
      
      let notFoundReqNumber = 'Closed';
      
      // V32.1: Only create sub-request if NOT "None"
      if (checkNotFoundDest !== 'None') {
        // Get next sub_number
        const { data: subData } = await supabase
          .from('requests')
          .select('sub_number')
          .eq('request_number', reqNumber)
          .order('sub_number', { ascending: false })
          .limit(1);
        
        const nextSub = (subData?.[0]?.sub_number || 0) + 1;
        
        // Create sub-request for NOT FOUND items
        const insertData = {
          request_number: reqNumber,
          sub_number: nextSub,
          parent_request_number: currentReq?.parent_request_number || reqNumber,
          request_type: currentReq?.request_type,
          sub_category: currentReq?.sub_category,
          iso_number: currentReq?.iso_number,
          full_spool_number: currentReq?.full_spool_number,
          hf_number: currentReq?.hf_number,
          test_pack_number: currentReq?.test_pack_number,
          requester_user_id: currentReq?.requester_user_id,
          created_by_name: currentReq?.created_by_name
        };
        
        const { data: newReq, error: reqError } = await supabase.from('requests')
          .insert(insertData)
          .select()
          .single();
        
        if (reqError || !newReq) {
          console.error('Request insert error:', reqError);
          alert('Error creating sub-request: ' + (reqError?.message || 'Unknown error'));
          loadComponents();
          return;
        }
        
        // Create component for NOT FOUND quantity - goes to destination
        await supabase.from('request_components').insert({
          request_id: newReq.id,
          ident_code: selectedCheck.ident_code,
          description: selectedCheck.description,
          tag: selectedCheck.tag,
          dia1: selectedCheck.dia1,
          quantity: notFoundQty,
          status: checkNotFoundDest === 'Eng' ? 'Eng' : checkNotFoundDest,
          current_location: checkNotFoundDest === 'Yard' ? 'YARD' : 'SITE',
          has_eng_check: false,
          eng_check_message: null,
          eng_check_sent_to: null,
          parent_component_id: selectedCheck.id,
          split_type: 'not_found'
        });
        
        // V32.1: Build the new request number string
        notFoundReqNumber = newReq.request_number_full || formatRequestNumber(newReq.request_number, newReq.sub_number || 0, 0, 0);
      }
      
      // Update original component with FOUND quantity
      await supabase.from('request_components')
        .update({ 
          quantity: foundQty,
          status: checkFoundDest,
          has_eng_check: false,
          eng_check_message: null,
          eng_check_sent_to: null,
          split_type: 'found'
        })
        .eq('id', selectedCheck.id);
      
      // Log history
      const logNote = checkNotFoundDest === 'None' 
        ? `Partial: ${foundQty} found → ${checkFoundDest}, ${notFoundQty} not found → Closed (no sub-request)`
        : `Partial: ${foundQty} found → ${checkFoundDest}, ${notFoundQty} not found → ${checkNotFoundDest} (${notFoundReqNumber})`;
      await logHistory(selectedCheck.id, 'Check - Partial Found', 'WH_Site', checkFoundDest, logNote);
      
      setShowCheckPartialModal(false);
      setSelectedCheck(null);
      loadComponents();
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };

  const openHistory = (compId) => {
    setHistoryComponentId(compId);
    setShowHistory(true);
  };

  const canModify = canModifyPage(user, 'wh_site');

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading...</div>;

  return (
    <div>
      {/* V28.8: Removed Engineering Notes section - message already in Engineering Checks table */}

      {/* Engineering Checks Section - Separate from regular components */}
      {engChecks.length > 0 && (
        <div style={{
          backgroundColor: '#FEF3C7',
          border: '2px solid #F59E0B',
          borderRadius: '8px',
          padding: '16px',
          marginBottom: '24px'
        }}>
          <h4 style={{ fontWeight: '600', color: '#B45309', marginBottom: '12px' }}>
            🔍 Engineering Checks ({engChecks.length})
          </h4>
          <div style={{ overflowX: 'auto' }}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Cat</th>
                  <th style={styles.th}>Sub</th>
                  <th style={styles.th}>ISO</th>
                  <th style={styles.th}>Spool</th>
                  <th style={styles.th}>HF</th>
                  <th style={styles.th}>TP</th>
                  <th style={styles.th}>Request</th>
                  <th style={styles.th}>Code</th>
                  <th style={styles.th}>Description</th>
                  <th style={styles.th}>Qty</th>
                  <th style={{ ...styles.th, backgroundColor: '#7C3AED', color: 'white', textAlign: 'center' }}>Yard Sent</th>
                  <th style={{ ...styles.th, backgroundColor: '#DC2626', color: 'white', textAlign: 'center' }}>Da Trovare</th>
                  <th style={{ ...styles.th, backgroundColor: COLORS.info, color: 'white', textAlign: 'center' }}>WH Site</th>
                  <th style={{ ...styles.th, backgroundColor: COLORS.secondary, color: 'white', textAlign: 'center' }}>WH Yard</th>
                  <th style={styles.th}>Message</th>
                  <th style={styles.th}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {engChecks.map(check => {
                  const inv = inventoryMap[check.ident_code] || { site: 0, yard: 0 };
                  const hasSiteQty = inv.site > 0;
                  const hasYardQty = inv.yard > 0;
                  // V32.1: Calculate "Da Trovare" = qty - yard_sent_qty (what Yard already sent)
                  const yardSent = check.requests?.yard_sent_qty || 0;
                  const daTrovare = Math.max(0, check.quantity - yardSent);
                  const isBothRequest = check.requests?.both_status !== null;
                  return (
                  <tr key={check.id} style={{ backgroundColor: '#FFFBEB' }}>
                    <td style={styles.td}>{abbrevCategory(check.requests?.request_type)}</td>
                    <td style={styles.td}>{abbrevSubCategory(check.sub_category || check.requests?.sub_category)}</td>
                    <td style={{ ...styles.td, fontSize: '11px' }}>{check.requests?.iso_number || check.iso_number || '-'}</td>
                    <td style={{ ...styles.td, fontSize: '11px' }}>{abbrevSpool(check.requests?.full_spool_number || check.full_spool_number)}</td>
                    <td style={styles.td}>{check.requests?.hf_number || '-'}</td>
                    <td style={styles.td}>{check.requests?.test_pack_number || '-'}</td>
                    <td style={{ ...styles.td, fontFamily: 'monospace', fontWeight: '600' }}>
                      {displayRequestNumber(check.requests)}
                    </td>
                    <td style={{ ...styles.td, fontFamily: 'monospace', fontSize: '11px' }}>{check.ident_code}</td>
                    <td style={{ ...styles.td, maxWidth: '150px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={check.description || ''}>
                      {check.description ? (check.description.length > 30 ? check.description.substring(0, 30) + '...' : check.description) : '-'}
                    </td>
                    <td style={styles.td}>{check.quantity}</td>
                    {/* V32.1: Yard Sent column */}
                    <td style={{ ...styles.td, textAlign: 'center', fontWeight: '600', color: yardSent > 0 ? '#16a34a' : '#9CA3AF' }}>
                      {isBothRequest ? (yardSent > 0 ? yardSent : '⏳') : '-'}
                    </td>
                    {/* V32.1: Da Trovare column */}
                    <td style={{ ...styles.td, textAlign: 'center', fontWeight: '700', color: daTrovare > 0 ? '#DC2626' : '#16a34a', backgroundColor: daTrovare === 0 ? '#D1FAE5' : 'transparent' }}>
                      {isBothRequest ? daTrovare : check.quantity}
                    </td>
                    <td style={{ ...styles.td, textAlign: 'center', fontWeight: '600', color: inv.site > 0 ? COLORS.success : COLORS.primary }}>
                      {inv.site}
                    </td>
                    <td style={{ ...styles.td, textAlign: 'center', fontWeight: '600', color: inv.yard > 0 ? COLORS.success : COLORS.primary }}>
                      {inv.yard}
                    </td>
                    <td style={{ ...styles.td, color: '#B45309', fontStyle: 'italic', maxWidth: '120px', overflow: 'hidden', textOverflow: 'ellipsis' }} title={check.eng_check_message || ''}>
                      {check.eng_check_message || '-'}
                    </td>
                    <td style={styles.td}>
                      <ActionDropdown
                        actions={(() => {
                          // V28.8: Build actions based on inventory in THIS warehouse (Site)
                          const actions = [];
                          
                          // V32: Found (All) only if site_qty >= requested qty
                          const canFulfillSite = inv.site >= check.quantity;
                          if (canFulfillSite) {
                            actions.push({ id: 'check_found', icon: '✓', label: 'Found (All)' });
                          }
                          
                          // Partial only if site_qty > 0 but < requested
                          if (hasSiteQty) {
                            actions.push({ id: 'check_partial', icon: '✂️', label: 'Partial' });
                          }
                          
                          // To HF only if site_qty > 0 AND has hf_number
                          if (hasSiteQty && (check.requests?.hf_number || check.previous_status === 'HF')) {
                            actions.push({ id: 'check_to_hf', icon: '🔩', label: 'To HF' });
                          }
                          
                          // V28.11: To TestPack only if FULL qty available (site_qty >= requested)
                          const isTestPackItem = check.requests?.test_pack_number || check.requests?.request_type === 'TestPack' || check.previous_status === 'TP';
                          if (isTestPackItem) {
                            // Only show To TestPack if full qty available
                            if (inv.site >= check.quantity) {
                              actions.push({ id: 'check_to_tp', icon: '📋', label: 'To TestPack' });
                            }
                            // Partial is already added above, so user can use Partial if not full qty
                          }
                          
                          // To Yard always available if yard has qty
                          if (hasYardQty) {
                            actions.push({ id: 'check_to_yard', icon: '🏢', label: 'To Yard' });
                          }
                          
                          // Not Found always available
                          actions.push({ id: 'check_notfound', icon: '✗', label: 'Not Found → Eng' });
                          
                          // V28.10: Return and Delete always available
                          actions.push({ id: 'check_return', icon: '↩️', label: 'Return to Eng' });
                          actions.push({ id: 'check_delete', icon: '🗑️', label: 'Delete' });
                          
                          return actions;
                        })()}
                        onExecute={(action) => handleCheckAction(check, action)}
                        disabled={!canModify}
                        componentId={check.id}
                      />
                    </td>
                  </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Site Components */}
      <div style={styles.card}>
        <div style={{ ...styles.cardHeader, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontWeight: '600' }}>WH Site - Components ({components.length})</h3>
          <button
            onClick={() => {
              const printWindow = window.open('', '_blank');
              printWindow.document.write(`
                <html><head><title>WH Site Components</title>
                <style>
                  body { font-family: Arial, sans-serif; padding: 20px; }
                  h1 { color: #2563EB; }
                  table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                  th, td { border: 1px solid #ddd; padding: 6px; text-align: left; font-size: 10px; }
                  th { background-color: #DBEAFE; }
                  .alert { color: #DC2626; font-weight: bold; }
                </style></head><body>
                <h1>🏭 WH Site - Components</h1>
                <p>Printed: ${new Date().toLocaleString()} | Total: ${components.length}</p>
                <table>
                  <tr><th>Cat</th><th>Sub</th><th>ISO</th><th>Spool</th><th>Request</th><th>Code</th><th>Description</th><th>Qty</th><th>Site</th><th>Yard</th><th>Alert</th></tr>
                  ${components.map(comp => {
                    const inv = inventoryMap[comp.ident_code] || { site: 0, yard: 0 };
                    const totalAvailable = inv.site + inv.yard;
                    const totalRequested = totalRequestedMap[comp.ident_code] || 0;
                    const isOverQty = totalRequested > totalAvailable;
                    return `<tr>
                      <td>${abbrevCategory(comp.requests?.request_type)}</td>
                      <td>${abbrevSubCategory(comp.sub_category || comp.requests?.sub_category)}</td>
                      <td>${comp.requests?.iso_number || '-'}</td>
                      <td>${comp.requests?.full_spool_number || '-'}</td>
                      <td>${displayRequestNumber(comp.requests)}</td>
                      <td>${comp.ident_code}</td>
                      <td>${comp.description || '-'}</td>
                      <td>${comp.quantity}</td>
                      <td>${inv.site}</td>
                      <td>${inv.yard}</td>
                      <td class="${isOverQty ? 'alert' : ''}">${isOverQty ? '⚠️' : ''}</td>
                    </tr>`;
                  }).join('')}
                </table>
                </body></html>
              `);
              printWindow.document.close();
              printWindow.print();
            }}
            style={{ ...styles.button, backgroundColor: COLORS.purple, color: 'white' }}
          >
            🖨️ Print
          </button>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Cat</th>
                <th style={styles.th}>Sub</th>
                <th style={styles.th}>ISO</th>
                <th style={styles.th}>Spool</th>
                <th style={styles.th}>HF</th>
                <th style={styles.th}>TP</th>
                <th style={styles.th}>Request</th>
                <th style={styles.th}>Code</th>
                <th style={styles.th}>Description</th>
                <th style={styles.th}>Qty</th>
                <th style={{ ...styles.th, backgroundColor: COLORS.info, color: 'white', textAlign: 'center' }}>WH Site</th>
                <th style={{ ...styles.th, backgroundColor: COLORS.secondary, color: 'white', textAlign: 'center' }}>WH Yard</th>
                <th style={styles.th}>Actions</th>
                <th style={{ ...styles.th, textAlign: 'center', width: '40px' }}>ℹ️</th>
                <th style={{ ...styles.th, textAlign: 'center', width: '50px' }}>Alert</th>
              </tr>
            </thead>
            <tbody>
              {components.map(comp => {
                const inv = inventoryMap[comp.ident_code] || { site: 0, yard: 0 };
                const totalAvailable = inv.site + inv.yard;
                // V28.5: Use sum of ALL open requests for this ident_code
                const totalRequested = totalRequestedMap[comp.ident_code] || 0;
                const isOverQty = totalRequested > totalAvailable;
                return (
                <tr key={comp.id} style={isOverQty ? { backgroundColor: '#FEF2F2' } : {}}>
                  <td style={styles.td}>{abbrevCategory(comp.requests?.request_type)}</td>
                  <td style={styles.td}>{abbrevSubCategory(comp.sub_category || comp.requests?.sub_category)}</td>
                  <td style={{ ...styles.td, fontSize: '11px' }}>{comp.requests?.iso_number || comp.iso_number || '-'}</td>
                  <td style={{ ...styles.td, fontSize: '11px' }}>{abbrevSpool(comp.requests?.full_spool_number || comp.full_spool_number)}</td>
                  <td style={styles.td}>{comp.requests?.hf_number || '-'}</td>
                  <td style={styles.td}>{comp.requests?.test_pack_number || '-'}</td>
                  <td style={{ ...styles.td, fontFamily: 'monospace', fontWeight: '600' }}>
                    {displayRequestNumber(comp.requests)}
                  </td>
                  <td style={{ ...styles.td, fontFamily: 'monospace', fontSize: '11px' }}>{comp.ident_code}</td>
                  <td style={{ ...styles.td, maxWidth: '150px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={comp.description || ''}>
                    {comp.description ? (comp.description.length > 30 ? comp.description.substring(0, 30) + '...' : comp.description) : '-'}
                  </td>
                  <td style={styles.td}>{comp.quantity}</td>
                  <td style={{ ...styles.td, textAlign: 'center', fontWeight: '600', color: inv.site > 0 ? COLORS.success : COLORS.primary }}>
                    {inv.site}
                  </td>
                  <td style={{ ...styles.td, textAlign: 'center', fontWeight: '600', color: inv.yard > 0 ? COLORS.success : COLORS.primary }}>
                    {inv.yard}
                  </td>
                  <td style={styles.td}>
                    <ActionDropdown
                      actions={(() => {
                        // V32.3: Updated action logic
                        // Ready → only when qty_site >= qty_requested
                        // Partial → when qty_site < qty_requested (with tooltip)
                        // To TestPack → available even partial to "freeze" material
                        const actions = [];
                        const hasSiteQty = inv.site > 0;
                        const hasYardQty = inv.yard > 0;
                        const hasEnoughSite = inv.site >= comp.quantity;
                        const isHF = !!comp.requests?.hf_number;
                        const isTP = !!comp.requests?.test_pack_number;
                        
                        // V32.3: Ready only when qty_site >= qty_requested
                        if (hasEnoughSite && !isHF && !isTP) {
                          actions.push({ id: 'ready', icon: '✓', label: 'Ready' });
                        }
                        // V32.3: Partial when site has some qty but not enough
                        if (hasSiteQty && !hasEnoughSite && !isHF && !isTP) {
                          actions.push({ id: 'pt', icon: '✂️', label: 'Partial', tooltip: 'Not all quantities available at Site' });
                        }
                        // V32.3: For HF/TP items
                        if (hasSiteQty && (isHF || isTP)) {
                          // Ready only if enough
                          if (hasEnoughSite) {
                            actions.push({ id: 'ready', icon: '✓', label: 'Ready (All)' });
                          }
                          // Partial always available if has some qty
                          actions.push({ id: 'pt', icon: '✂️', label: 'Partial', tooltip: hasEnoughSite ? '' : 'Not all quantities available at Site' });
                        }
                        // To Yard requires yard_qty > 0
                        if (hasYardQty) {
                          actions.push({ id: 'yard', icon: '🏢', label: 'To Yard' });
                        }
                        // Engineering always available
                        actions.push({ id: 'eng', icon: '⚙️', label: 'To Engineering' });
                        // V32.3: HF available if has hf_number and has some qty
                        if (hasSiteQty && isHF) {
                          actions.push({ id: 'hf', icon: '🔩', label: hasEnoughSite ? 'To HF (Complete)' : 'To HF (Partial)' });
                        }
                        // V32.3: TestPack available if has test_pack_number and has some qty (to freeze material)
                        if (hasSiteQty && isTP) {
                          actions.push({ id: 'tp', icon: '📋', label: hasEnoughSite ? 'To TestPack (Complete)' : 'To TestPack (Partial)' });
                        }
                        // Delete always available
                        actions.push({ id: 'delete', icon: '🗑️', label: 'Delete' });
                        return actions;
                      })()}
                      onExecute={(action) => handleAction(comp, action)}
                      disabled={!canModify}
                      componentId={comp.id}
                    />
                  </td>
                  <td style={{ ...styles.td, textAlign: 'center' }}>
                    <ActionButton color={comp.requests?.description ? COLORS.primary : COLORS.info} onClick={() => openHistory(comp.id)} title="History">ℹ️</ActionButton>
                  </td>
                  <td style={{ ...styles.td, textAlign: 'center' }}>
                    {isOverQty && (
                      <span title={`Total requested: ${totalRequested}, available: ${totalAvailable}`} style={{ cursor: 'help', fontSize: '18px' }}>⚠️</span>
                    )}
                  </td>
                </tr>
                );
              })}
              {components.length === 0 && (
                <tr>
                  <td colSpan="15" style={{ ...styles.td, textAlign: 'center', color: '#9ca3af' }}>
                    No components in WH Site
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Destination Popup */}
      <DestinationPopup
        isOpen={showDestPopup}
        onClose={() => setShowDestPopup(false)}
        onSelect={handleDestinationSelect}
        title="Where to send the material?"
      />

      {/* Partial Modal - V28.11: Translated to English + Request Number */}
      <Modal isOpen={showPartialModal} onClose={() => setShowPartialModal(false)} title="🔶 Partial Split">
        {(() => {
          const availableQty = inventoryMap[selectedComponent?.ident_code]?.site || 0;
          const isOverLimit = parseInt(partialQty) > availableQty;
          return (
        <>
        <div style={{ marginBottom: '16px' }}>
          <p style={{ marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: COLORS.info }}>
            📋 Request: {displayRequestNumber(selectedComponent?.requests)}
          </p>
          <p style={{ marginBottom: '8px' }}>
            <strong>Item:</strong> <span style={{ fontFamily: 'monospace' }}>{selectedComponent?.ident_code}</span>
          </p>
          <p style={{ marginBottom: '8px' }}>
            <strong>Total Requested:</strong> {selectedComponent?.quantity}
          </p>
          <p style={{ marginBottom: '16px' }}>
            <strong>Available in SITE:</strong> <span style={{ color: COLORS.success, fontWeight: '600' }}>{availableQty}</span>
          </p>
        </div>
        
        <div style={{ marginBottom: '16px' }}>
          <label style={styles.label}>Found Quantity</label>
          <input
            type="number"
            value={partialQty}
            onChange={(e) => setPartialQty(e.target.value)}
            style={{ ...styles.input, borderColor: isOverLimit ? COLORS.primary : undefined }}
            min="1"
            max={Math.min(availableQty, selectedComponent?.quantity - 1)}
            placeholder="Enter found quantity"
          />
          {isOverLimit && (
            <p style={{ color: COLORS.primary, fontSize: '12px', marginTop: '4px' }}>
              ⚠️ Cannot exceed available quantity ({availableQty})
            </p>
          )}
        </div>
        
        <div style={{ marginBottom: '16px' }}>
          <label style={styles.label}>✅ Found ({partialQty || 0} pcs) go to:</label>
          <select
            value={partialFoundDest}
            onChange={(e) => setPartialFoundDest(e.target.value)}
            style={styles.input}
          >
            <option value="ToCollect">→ To Collect</option>
            <option value="WH_Site">→ WH Site</option>
            <option value="Eng">→ Engineering</option>
            {selectedComponent?.requests?.hf_number && (
              <option value="HF">→ HF</option>
            )}
            {(selectedComponent?.requests?.test_pack_number || selectedComponent?.requests?.request_type === 'TestPack') && (
              <option value="TP">→ TestPack</option>
            )}
          </select>
        </div>
        
        <div style={{ marginBottom: '16px' }}>
          <label style={styles.label}>❌ Not Found ({(selectedComponent?.quantity || 0) - (parseInt(partialQty) || 0)} pcs) go to:</label>
          <select
            value={partialNotFoundDest}
            onChange={(e) => setPartialNotFoundDest(e.target.value)}
            style={styles.input}
          >
            <option value="None">→ None (Close)</option>
            <option value="Eng">→ Engineering</option>
            <option value="Yard">→ WH Yard</option>
            <option value="WH_Site">→ WH Site</option>
            {selectedComponent?.requests?.hf_number && (
              <option value="HF">→ HF</option>
            )}
            {(selectedComponent?.requests?.test_pack_number || selectedComponent?.requests?.request_type === 'TestPack') && (
              <option value="TP">→ TestPack</option>
            )}
          </select>
        </div>
        
        <div style={{ 
          backgroundColor: '#FEF3C7', 
          border: '1px solid #F59E0B', 
          borderRadius: '8px', 
          padding: '12px',
          marginBottom: '16px'
        }}>
          <p style={{ fontSize: '13px', color: '#92400E' }}>
            • <strong>{partialQty || 0} pcs</strong> → {partialFoundDest === 'ToCollect' ? 'To Collect' : partialFoundDest} (Original request)
          </p>
          <p style={{ fontSize: '13px', color: '#92400E' }}>
            • <strong>{(selectedComponent?.quantity || 0) - (parseInt(partialQty) || 0)} pcs</strong> → {partialNotFoundDest} (New sub-request)
          </p>
        </div>
        
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          <button onClick={() => setShowPartialModal(false)} style={{ ...styles.button, ...styles.buttonSecondary }}>Cancel</button>
          <button 
            onClick={submitPartial} 
            disabled={!partialQty || parseInt(partialQty) <= 0 || parseInt(partialQty) >= selectedComponent?.quantity || isOverLimit}
            style={{ 
              ...styles.button, 
              backgroundColor: COLORS.warning, 
              color: 'white',
              opacity: (!partialQty || parseInt(partialQty) <= 0 || parseInt(partialQty) >= selectedComponent?.quantity || isOverLimit) ? 0.5 : 1
            }}
          >
            SPLIT
          </button>
        </div>
        </>
          );
        })()}
      </Modal>

      {/* Engineering Check Partial Modal */}
      <Modal isOpen={showCheckPartialModal} onClose={() => setShowCheckPartialModal(false)} title="🔶 Partial Split">
        <div style={{ marginBottom: '16px' }}>
          <p style={{ marginBottom: '8px' }}>
            <strong>Item:</strong> <span style={{ fontFamily: 'monospace' }}>{selectedCheck?.ident_code}</span>
          </p>
          <p style={{ marginBottom: '8px' }}>
            <strong>Total Requested:</strong> {selectedCheck?.quantity}
          </p>
          <p style={{ marginBottom: '4px' }}>
            <strong>Available in SITE:</strong> <span style={{ color: (inventoryMap[selectedCheck?.ident_code]?.site || 0) > 0 ? COLORS.success : COLORS.primary, fontWeight: '600' }}>{inventoryMap[selectedCheck?.ident_code]?.site || 0}</span>
          </p>
          <p style={{ marginBottom: '16px' }}>
            <strong>Available in YARD:</strong> <span style={{ color: (inventoryMap[selectedCheck?.ident_code]?.yard || 0) > 0 ? COLORS.success : COLORS.primary, fontWeight: '600' }}>{inventoryMap[selectedCheck?.ident_code]?.yard || 0}</span>
          </p>
        </div>
        
        <div style={{ marginBottom: '16px' }}>
          <label style={styles.label}>Found Quantity</label>
          <input
            type="number"
            value={checkPartialQty}
            onChange={(e) => setCheckPartialQty(e.target.value)}
            style={styles.input}
            min="1"
            max={selectedCheck?.quantity - 1}
            placeholder="Enter found quantity"
          />
        </div>
        
        <div style={{ marginBottom: '16px' }}>
          <label style={styles.label}>✅ Found ({checkPartialQty || 0} pcs) go to:</label>
          <select
            value={checkFoundDest}
            onChange={(e) => setCheckFoundDest(e.target.value)}
            style={styles.input}
          >
            <option value="ToCollect">→ To Collect</option>
            <option value="Yard">→ WH Yard</option>
            <option value="Eng">→ Engineering</option>
            {(selectedCheck?.requests?.test_pack_number || selectedCheck?.requests?.request_type === 'TestPack') && (
              <option value="TP">→ TestPack</option>
            )}
          </select>
        </div>
        
        <div style={{ marginBottom: '16px' }}>
          <label style={styles.label}>❌ Not Found ({(selectedCheck?.quantity || 0) - (parseInt(checkPartialQty) || 0)} pcs) go to:</label>
          <select
            value={checkNotFoundDest}
            onChange={(e) => setCheckNotFoundDest(e.target.value)}
            style={styles.input}
          >
            <option value="None">→ None (Close)</option>
            <option value="Eng">→ Engineering</option>
            <option value="Yard">→ WH Yard</option>
            {(selectedCheck?.requests?.test_pack_number || selectedCheck?.requests?.request_type === 'TestPack') && (
              <option value="TP">→ TestPack</option>
            )}
          </select>
        </div>
        
        <div style={{ 
          backgroundColor: '#FEF3C7', 
          border: '1px solid #F59E0B', 
          borderRadius: '8px', 
          padding: '12px',
          marginBottom: '16px'
        }}>
          <p style={{ fontSize: '13px', color: '#92400E' }}>
            • <strong>{checkPartialQty || 0} pcs</strong> → {checkFoundDest} (Original request)
          </p>
          <p style={{ fontSize: '13px', color: '#92400E' }}>
            • <strong>{(selectedCheck?.quantity || 0) - (parseInt(checkPartialQty) || 0)} pcs</strong> → {checkNotFoundDest} (New sub-request)
          </p>
        </div>
        
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          <button onClick={() => setShowCheckPartialModal(false)} style={{ ...styles.button, ...styles.buttonSecondary }}>Cancel</button>
          <button 
            onClick={handleCheckPartialSubmit} 
            disabled={!checkPartialQty || parseInt(checkPartialQty) <= 0 || parseInt(checkPartialQty) >= selectedCheck?.quantity}
            style={{ 
              ...styles.button, 
              backgroundColor: COLORS.warning, 
              color: 'white',
              opacity: (!checkPartialQty || parseInt(checkPartialQty) <= 0 || parseInt(checkPartialQty) >= selectedCheck?.quantity) ? 0.5 : 1
            }}
          >
            SPLIT
          </button>
        </div>
      </Modal>

      {/* V28.10: Collector Selection Modal */}
      <Modal isOpen={showCollectorModal} onClose={() => { setShowCollectorModal(false); setSelectedCollectorId(''); setCollectorSearchTerm(''); }} title="📦 Ready for Collection">
        <div style={{ marginBottom: '16px' }}>
          <p style={{ marginBottom: '8px' }}>
            <strong>Item:</strong> <span style={{ fontFamily: 'monospace' }}>{selectedComponent?.ident_code}</span>
          </p>
          <p style={{ marginBottom: '16px' }}>
            <strong>Qty:</strong> {selectedComponent?.quantity}
          </p>
        </div>
        
        <div style={{ marginBottom: '16px' }}>
          <label style={styles.label}>🔔 Notify User for Collection (optional)</label>
          <input
            type="text"
            value={collectorSearchTerm}
            onChange={(e) => setCollectorSearchTerm(e.target.value)}
            placeholder="Search user name..."
            style={styles.input}
          />
          
          {collectorSearchTerm.length >= 2 && (
            <div style={{ 
              maxHeight: '200px', 
              overflowY: 'auto', 
              border: '1px solid #e5e7eb', 
              borderRadius: '6px',
              marginTop: '8px'
            }}>
              {allUsers
                .filter(u => u.full_name.toLowerCase().includes(collectorSearchTerm.toLowerCase()))
                .map(u => (
                  <div
                    key={u.id}
                    onClick={() => {
                      setSelectedCollectorId(u.id);
                      setCollectorSearchTerm(u.full_name);
                    }}
                    style={{
                      padding: '10px 12px',
                      cursor: 'pointer',
                      backgroundColor: selectedCollectorId === u.id ? '#DBEAFE' : 'white',
                      borderBottom: '1px solid #f3f4f6',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = selectedCollectorId === u.id ? '#DBEAFE' : '#f9fafb'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = selectedCollectorId === u.id ? '#DBEAFE' : 'white'}
                  >
                    <span>{u.full_name}</span>
                    <span style={{ fontSize: '11px', color: '#6b7280' }}>{u.role}</span>
                  </div>
                ))}
            </div>
          )}
          
          {selectedCollectorId && (
            <div style={{ 
              marginTop: '12px', 
              padding: '10px', 
              backgroundColor: '#DCFCE7', 
              borderRadius: '6px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <span>🔔 Notification will be sent to: <strong>{allUsers.find(u => u.id === selectedCollectorId)?.full_name}</strong></span>
              <button
                onClick={() => { setSelectedCollectorId(''); setCollectorSearchTerm(''); }}
                style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px' }}
              >
                ✕
              </button>
            </div>
          )}
        </div>
        
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          <button 
            onClick={() => { setShowCollectorModal(false); setSelectedCollectorId(''); setCollectorSearchTerm(''); }} 
            style={{ ...styles.button, ...styles.buttonSecondary }}
          >
            Cancel
          </button>
          <button 
            onClick={completeToCollect}
            style={{ ...styles.button, backgroundColor: COLORS.success, color: 'white' }}
          >
            ✓ {selectedCollectorId ? 'Ready & Notify' : 'Ready (No Notification)'}
          </button>
        </div>
      </Modal>

      {/* History Popup */}
      <HistoryPopup
        isOpen={showHistory}
        onClose={() => setShowHistory(false)}
        componentId={historyComponentId}
      />
    </div>
  );
}

// ============================================================
// WH YARD PAGE - V28.1 with WH_Site/WH_Yard columns
// ============================================================
function WHYardPage({ user }) {
  const [components, setComponents] = useState([]);
  const [inventoryMap, setInventoryMap] = useState({});
  const [totalRequestedMap, setTotalRequestedMap] = useState({}); // V28.5: Sum of all open requests per ident_code
  const [loading, setLoading] = useState(true);
  const [showPartialModal, setShowPartialModal] = useState(false);
  const [selectedComponent, setSelectedComponent] = useState(null);
  const [partialQty, setPartialQty] = useState('');
  // V28.7: New state for improved Split Partial modal
  const [partialFoundDest, setPartialFoundDest] = useState('Trans');
  const [partialNotFoundDest, setPartialNotFoundDest] = useState('Eng');
  const [showDestPopup, setShowDestPopup] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [historyComponentId, setHistoryComponentId] = useState(null);
  const [engChecks, setEngChecks] = useState([]);
  // Engineering Check Partial state
  const [showCheckPartialModal, setShowCheckPartialModal] = useState(false);
  const [selectedCheck, setSelectedCheck] = useState(null);
  const [checkPartialQty, setCheckPartialQty] = useState('');
  const [checkFoundDest, setCheckFoundDest] = useState('Trans');
  const [checkNotFoundDest, setCheckNotFoundDest] = useState('Eng');

  useEffect(() => { loadComponents(); }, []);

  const loadComponents = async () => {
    setLoading(true);
    
    // V28.5: Load ALL open requests to sum quantities per ident_code
    const openStatuses = ['WH_Site', 'Yard', 'Eng', 'Order', 'Trans', 'ToCollect', 'TP', 'HF', 'Spare', 'Mng'];
    const { data: allOpenData } = await supabase
      .from('request_components')
      .select('ident_code, quantity')
      .in('status', openStatuses);
    
    const reqMap = {};
    if (allOpenData) {
      allOpenData.forEach(c => {
        reqMap[c.ident_code] = (reqMap[c.ident_code] || 0) + (c.quantity || 0);
      });
    }
    setTotalRequestedMap(reqMap);
    
    const { data: yardData } = await supabase
      .from('request_components')
      .select(`*, requests (request_number, sub_number, request_number_full, level_component, level_wh_split, level_yard_split, sub_category, request_type, iso_number, full_spool_number, hf_number, test_pack_number, description)`)
      .eq('status', 'Yard');

    // Load Engineering Checks sent to Yard
    // V32.2: Use simpler query first, then try with extended fields
    let checksData = [];
    
    // Try with full fields first
    const { data: fullChecks, error: fullError } = await supabase
      .from('request_components')
      .select(`*, requests (id, request_number, sub_number, request_number_full, level_component, level_wh_split, level_yard_split, sub_category, request_type, iso_number, full_spool_number, hf_number, test_pack_number, description, parent_request_id, parent_request_number, site_sent_qty, yard_sent_qty, both_status, requester_user_id, created_by_name)`)
      .eq('has_eng_check', true)
      .eq('eng_check_sent_to', 'Yard');
    
    if (fullError || !fullChecks) {
      // Fallback: simpler query without potentially missing fields
      console.log('WH Yard - Full query failed, trying simple query:', fullError);
      const { data: simpleChecks } = await supabase
        .from('request_components')
        .select(`*, requests (id, request_number, sub_number, request_number_full, level_component, level_wh_split, level_yard_split, sub_category, request_type, iso_number, full_spool_number, hf_number, test_pack_number, description, requester_user_id, created_by_name)`)
        .eq('has_eng_check', true)
        .eq('eng_check_sent_to', 'Yard');
      checksData = simpleChecks || [];
    } else {
      checksData = fullChecks;
    }
    
    console.log('WH Yard - Engineering Checks loaded:', { checksData, count: checksData?.length });

    // V28.5 FIX: Get unique ident_codes from loaded components, then load ONLY those from inventory
    const allComponents = [...(yardData || []), ...(checksData || [])];
    const uniqueIdentCodes = [...new Set(allComponents.map(c => c.ident_code).filter(Boolean))];
    
    console.log('📦 WH Yard - Unique ident_codes to look up:', uniqueIdentCodes);
    
    // Load inventory ONLY for the ident_codes we need
    let invMap = {};
    if (uniqueIdentCodes.length > 0) {
      const { data: invData, error: invError } = await supabase
        .from('inventory')
        .select('ident_code, site_qty, yard_qty')
        .in('ident_code', uniqueIdentCodes);
      
      console.log('📦 WH Yard - Inventory for our components:', { invData, invError });
      
      if (invData) {
        invData.forEach(i => { 
          invMap[i.ident_code] = { site: i.site_qty || 0, yard: i.yard_qty || 0 }; 
        });
      }
    }
    
    setInventoryMap(invMap);

    setEngChecks(checksData);
    if (yardData) setComponents(yardData);
    setLoading(false);
  };

  const logHistory = async (compId, action, fromStatus, toStatus, note) => {
    await supabase.from('component_history').insert({
      component_id: compId,
      action: action,
      from_status: fromStatus,
      to_status: toStatus,
      performed_by_user_id: user.id,
      performed_by_name: user.full_name,
      note: note
    });
  };

  const handleAction = async (component, action) => {
    const inv = inventoryMap[component.ident_code] || { site: 0, yard: 0 };
    const available = inv.yard;
    
    try {
      switch (action) {
        case 'found':
          if (available < component.quantity) {
            alert(`Only ${available} available in YARD!`);
            return;
          }
          setSelectedComponent(component);
          setShowDestPopup(true);
          return;
        case 'pt':
          setSelectedComponent(component);
          setShowPartialModal(true);
          return;
        case 'eng':
          await supabase.from('request_components')
            .update({ status: 'Eng' })
            .eq('id', component.id);
          await logHistory(component.id, 'Sent to Engineering', 'Yard', 'Eng', '');
          break;
        case 'hf':
          // V28.4: Direct to HF page
          await supabase.from('request_components')
            .update({ status: 'HF' })
            .eq('id', component.id);
          await logHistory(component.id, 'Sent to HF', 'Yard', 'HF', 'Direct to HF from WH Yard');
          break;
        case 'tp':
          // V28.4: Direct to TestPack page
          await supabase.from('request_components')
            .update({ status: 'TP' })
            .eq('id', component.id);
          await logHistory(component.id, 'Sent to TestPack', 'Yard', 'TP', 'Direct to TestPack from WH Yard');
          break;
        case 'return':
          await supabase.from('request_components')
            .update({ status: 'WH_Site', current_location: 'SITE' })
            .eq('id', component.id);
          await logHistory(component.id, 'Returned to Site', 'Yard', 'WH_Site', '');
          break;
        case 'delete':
          if (confirm('Delete this component?')) {
            await supabase.from('request_components')
              .update({ status: 'Cancelled' })
              .eq('id', component.id);
            await logHistory(component.id, 'Cancelled', 'Yard', 'Cancelled', '');
          }
          break;
      }
      loadComponents();
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };

  const handleDestinationSelect = async (dest) => {
    const component = selectedComponent;
    const available = inventoryMap[component.ident_code]?.yard || 0;
    
    // V28.10: Decrement yard ONLY if NOT going to Site IN (Trans)
    // For Site IN, inventory changes only when confirmed at Site
    if (dest !== 'siteIn') {
      await supabase.rpc('decrement_yard_qty', { 
        p_ident_code: component.ident_code, 
        p_qty: component.quantity 
      });
    }
    
    let newStatus;
    let note = '';
    
    switch(dest) {
      case 'siteIn':
        newStatus = 'Trans';
        note = 'In transit to Site (inventory unchanged until confirmed)';
        break;
      case 'hf':
        newStatus = 'HF';
        note = 'Sent to HF Page for completion';
        break;
      case 'tp':
        newStatus = 'TP';
        note = 'Sent to TestPack Page for completion';
        break;
    }
    
    await supabase.from('request_components')
      .update({ status: newStatus })
      .eq('id', component.id);
    
    await logHistory(component.id, `Found - ${dest.toUpperCase()}`, 'Yard', newStatus, note);
    
    await supabase.from('movements').insert({
      ident_code: component.ident_code,
      movement_type: 'TRANSFER',
      quantity: component.quantity,
      from_location: 'YARD',
      to_location: dest === 'siteIn' ? 'TRANSIT' : dest.toUpperCase(),
      performed_by: user.full_name
    });
    
    setShowDestPopup(false);
    setSelectedComponent(null);
    loadComponents();
  };

  const submitPartial = async () => {
    const available = inventoryMap[selectedComponent?.ident_code]?.yard || 0;
    const foundQty = parseInt(partialQty) || 0;
    const notFoundQty = selectedComponent.quantity - foundQty;
    
    // V32.3: Validation - allow found == total only if Not Found is "None"
    if (foundQty <= 0) {
      alert('Found quantity must be at least 1');
      return;
    }
    if (foundQty > available) {
      alert(`Max available: ${available}`);
      return;
    }
    if (foundQty > selectedComponent.quantity) {
      alert('Found quantity cannot exceed total requested');
      return;
    }
    if (foundQty === selectedComponent.quantity && partialNotFoundDest !== 'None') {
      alert('If sending all quantity, select "None (Close)" for Not Found destination');
      return;
    }
    
    try {
      // V28.7: Update original component with found quantity and destination
      await supabase.from('request_components')
        .update({ 
          quantity: foundQty, 
          status: partialFoundDest,
          previous_status: 'Yard',
          current_location: partialFoundDest === 'Yard' ? 'YARD' : 'SITE'
        })
        .eq('id', selectedComponent.id);
      
      // V28.10: Decrement yard inventory ONLY if NOT going to Trans (Site IN)
      // For Trans, inventory updated when Site confirms receipt
      if (partialFoundDest !== 'Trans') {
        await supabase.rpc('decrement_yard_qty', { 
          p_ident_code: selectedComponent.ident_code, 
          p_qty: foundQty 
        });
      }

      let notFoundReqNumber = 'Closed';
      
      // V32.1: Only create sub-request if NOT "None"
      if (partialNotFoundDest !== 'None') {
        // Create new sub-request for not found items
        const { data: subData } = await supabase
          .from('requests')
          .select('sub_number')
          .eq('request_number', selectedComponent.requests.request_number)
          .order('sub_number', { ascending: false })
          .limit(1);
        
        const nextSub = (subData?.[0]?.sub_number || 0) + 1;
        
        // V30.0: Get parent_request_number - use existing parent or the mother request_number
        const parentReqNum = selectedComponent.requests.parent_request_number || selectedComponent.requests.request_number;
        
        const { data: newReq, error: reqError } = await supabase.from('requests')
          .insert({
            request_number: selectedComponent.requests.request_number,
            sub_number: nextSub,
            parent_request_number: parentReqNum,
            request_type: selectedComponent.requests.request_type,
            sub_category: selectedComponent.requests.sub_category,
            iso_number: selectedComponent.requests.iso_number,
            full_spool_number: selectedComponent.requests.full_spool_number,
            hf_number: selectedComponent.requests.hf_number,
            test_pack_number: selectedComponent.requests.test_pack_number,
            requester_user_id: selectedComponent.requests.requester_user_id,
            created_by_name: selectedComponent.requests.created_by_name
          })
          .select()
          .single();
        
        if (reqError || !newReq) {
          console.error('Request insert error:', reqError);
          alert('Error creating sub-request: ' + (reqError?.message || 'Unknown error'));
          loadComponents();
          return;
        }
        
        notFoundReqNumber = newReq.request_number_full || formatRequestNumber(newReq.request_number, newReq.sub_number || 0, 0, 0);
        
        // V28.7: Create component for not found quantity with selected destination
        await supabase.from('request_components').insert({
          request_id: newReq.id,
          ident_code: selectedComponent.ident_code,
          description: selectedComponent.description,
          tag: selectedComponent.tag,
          dia1: selectedComponent.dia1,
          quantity: notFoundQty,
          status: partialNotFoundDest,
          current_location: partialNotFoundDest === 'Yard' ? 'YARD' : 'SITE'
        });
      }

      // V32.1: Log history with proper message
      const logNote = partialNotFoundDest === 'None' 
        ? `Partial: ${foundQty} found → ${partialFoundDest}, ${notFoundQty} not found → Closed (no sub-request)`
        : `Partial: ${foundQty} found → ${partialFoundDest}, ${notFoundQty} not found → ${partialNotFoundDest} (${notFoundReqNumber})`;
      await logHistory(selectedComponent.id, 'Partial Found', 'Yard', partialFoundDest, logNote);

      await supabase.from('movements').insert({
        ident_code: selectedComponent.ident_code,
        movement_type: 'TRANSFER',
        quantity: foundQty,
        from_location: 'YARD',
        to_location: partialFoundDest === 'Trans' ? 'TRANSIT' : partialFoundDest,
        performed_by: user.full_name,
        note: partialNotFoundDest === 'None' ? `Partial - ${notFoundQty} closed` : `Partial - ${notFoundQty} to ${partialNotFoundDest}`
      });

      setShowPartialModal(false);
      setPartialQty('');
      setPartialFoundDest('Trans');
      setPartialNotFoundDest('Eng');
      loadComponents();
    } catch (error) {
      console.error('Partial split error:', error);
      alert('Error during partial split: ' + error.message);
      loadComponents();
    }
  };

  // Handle Engineering Check actions for Yard
  const handleCheckAction = async (check, action) => {
    const available = inventoryMap[check?.ident_code]?.yard || 0;
    try {
      if (action === 'check_found') {
        if (available < check.quantity) {
          alert(`Only ${available} available in YARD!`);
          return;
        }
        
        // V32.1: Get parent info for Both requests
        const isBothRequest = check.requests?.both_status !== null;
        const parentRequestId = check.requests?.parent_request_id;
        const siteSent = check.requests?.site_sent_qty || 0;
        const qtyToSend = check.quantity;
        
        // V32.1: Found → move to Trans (Site IN) with tracking
        await supabase.from('request_components')
          .update({ 
            status: 'Trans', 
            has_eng_check: false,
            eng_check_message: null,
            eng_check_sent_to: null,
            found_qty: qtyToSend,
            sent_to_tp_qty: qtyToSend
          })
          .eq('id', check.id);
        
        // V32.1: If Both request, update yard_sent_qty on parent
        if (isBothRequest && parentRequestId) {
          const currentYardSent = check.requests?.yard_sent_qty || 0;
          const newYardSent = currentYardSent + qtyToSend;
          const totalSent = siteSent + newYardSent;
          
          await supabase.from('requests')
            .update({ 
              yard_sent_qty: newYardSent,
              both_status: totalSent >= check.quantity ? 'complete' : 'waiting_site'
            })
            .eq('id', parentRequestId);
          
          // V32.1: If total sent >= qty, auto-cancel the Site request
          if (totalSent >= check.quantity) {
            const { data: siblingReq } = await supabase
              .from('requests')
              .select('id')
              .eq('parent_request_id', parentRequestId)
              .eq('level_wh_split', 1)
              .single();
            
            if (siblingReq) {
              await supabase.from('request_components')
                .update({ 
                  status: 'Cancelled', 
                  has_eng_check: false,
                  eng_check_sent_to: null 
                })
                .eq('request_id', siblingReq.id);
            }
          }
          
          // V32.1: Print Label B (Yard → Site IN)
          printLabelYardToSiteIN(check, user, siteSent, check.quantity, 0);
        }
        
        await logHistory(check.id, 'Check - Found', 'Yard', 'Trans', 'Item found in Yard, sent to Site IN (inventory updated on receipt)');
        loadComponents();
      } else if (action === 'check_notfound') {
        // V32.1: Not Found → return to Engineering (creates sub-request if needed)
        const isBothRequest = check.requests?.both_status !== null;
        
        // Not Found → return to Engineering
        await supabase.from('request_components')
          .update({ 
            status: 'Eng', 
            has_eng_check: false,
            eng_check_message: null,
            eng_check_sent_to: null
          })
          .eq('id', check.id);
        
        await logHistory(check.id, 'Check - Not Found', 'Yard', 'Eng', 'Item not found in Yard, returned to Engineering');
        loadComponents();
      } else if (action === 'check_to_hf') {
        // V28.6: Send to HF
        await supabase.from('request_components')
          .update({ 
            status: 'HF', 
            has_eng_check: false,
            eng_check_message: null,
            eng_check_sent_to: null
          })
          .eq('id', check.id);
        await logHistory(check.id, 'Check - To HF', 'Yard', 'HF', 'Sent to HF from Engineering check');
        loadComponents();
      } else if (action === 'check_to_tp') {
        // V32.1: For TestPack items from Yard, send to Site IN (Trans) with label
        // Material must transit through Site IN before going to TestPack
        const isBothRequest = check.requests?.both_status !== null;
        const parentRequestId = check.requests?.parent_request_id;
        const siteSent = check.requests?.site_sent_qty || 0;
        const qtyToSend = check.quantity;
        
        // Update component status to Trans (Site IN)
        await supabase.from('request_components')
          .update({ 
            status: 'Trans', 
            current_location: 'TRANSIT',
            has_eng_check: false,
            eng_check_message: null,
            eng_check_sent_to: null,
            sent_to_tp_qty: qtyToSend
          })
          .eq('id', check.id);
        
        // V32.1: If Both request, update yard_sent_qty on parent and check for auto-cancel
        if (isBothRequest && parentRequestId) {
          const currentYardSent = check.requests?.yard_sent_qty || 0;
          const newYardSent = currentYardSent + qtyToSend;
          const totalSent = siteSent + newYardSent;
          
          await supabase.from('requests')
            .update({ 
              yard_sent_qty: newYardSent,
              both_status: totalSent >= check.quantity ? 'complete' : 'waiting_site'
            })
            .eq('id', parentRequestId);
          
          // V32.1: If total sent >= qty, auto-cancel the Site request
          if (totalSent >= check.quantity) {
            // Find and cancel the Site sibling request
            const { data: siblingReq } = await supabase
              .from('requests')
              .select('id')
              .eq('parent_request_id', parentRequestId)
              .eq('level_wh_split', 1) // Site = 1
              .single();
            
            if (siblingReq) {
              await supabase.from('request_components')
                .update({ 
                  status: 'Cancelled', 
                  has_eng_check: false,
                  eng_check_sent_to: null 
                })
                .eq('request_id', siblingReq.id);
            }
          }
          
          // V32.1: Print Label B (Yard → Site IN)
          printLabelYardToSiteIN(check, user, siteSent, check.quantity, 0);
        }
        
        await logHistory(check.id, 'Check - To Site IN (for TP)', 'Yard', 'Trans', `Sent ${qtyToSend} to Site IN for TestPack`);
        loadComponents();
      } else if (action === 'check_to_site') {
        // V32.1: Send to Site IN (Trans) with tracking and label
        const isBothRequest = check.requests?.both_status !== null;
        const parentRequestId = check.requests?.parent_request_id;
        const siteSent = check.requests?.site_sent_qty || 0;
        const qtyToSend = check.quantity;
        
        await supabase.from('request_components')
          .update({ 
            status: 'Trans', 
            current_location: 'TRANSIT',
            has_eng_check: false,
            eng_check_message: null,
            eng_check_sent_to: null,
            sent_to_tp_qty: qtyToSend
          })
          .eq('id', check.id);
        
        // V32.1: If Both request, update yard_sent_qty on parent
        if (isBothRequest && parentRequestId) {
          const currentYardSent = check.requests?.yard_sent_qty || 0;
          const newYardSent = currentYardSent + qtyToSend;
          const totalSent = siteSent + newYardSent;
          
          await supabase.from('requests')
            .update({ 
              yard_sent_qty: newYardSent,
              both_status: totalSent >= check.quantity ? 'complete' : 'waiting_site'
            })
            .eq('id', parentRequestId);
          
          // V32.1: If total sent >= qty, auto-cancel the Site request
          if (totalSent >= check.quantity) {
            const { data: siblingReq } = await supabase
              .from('requests')
              .select('id')
              .eq('parent_request_id', parentRequestId)
              .eq('level_wh_split', 1)
              .single();
            
            if (siblingReq) {
              await supabase.from('request_components')
                .update({ 
                  status: 'Cancelled', 
                  has_eng_check: false,
                  eng_check_sent_to: null 
                })
                .eq('request_id', siblingReq.id);
            }
          }
          
          // V32.1: Print Label B (Yard → Site IN)
          printLabelYardToSiteIN(check, user, siteSent, check.quantity, 0);
        }
        
        await logHistory(check.id, 'Check - To Site IN', 'Yard', 'Trans', 'Sent to Site IN from Engineering check (inventory transferred on receipt)');
        loadComponents();
      } else if (action === 'check_partial') {
        // Open partial modal
        setSelectedCheck(check);
        setCheckPartialQty('');
        setCheckFoundDest('Trans');
        setCheckNotFoundDest('Eng');
        setShowCheckPartialModal(true);
      } else if (action === 'check_return') {
        // V28.10: Return to Engineering
        await supabase.from('request_components')
          .update({ 
            status: 'Eng', 
            has_eng_check: false,
            eng_check_message: null,
            eng_check_sent_to: null
          })
          .eq('id', check.id);
        await logHistory(check.id, 'Check - Returned', 'Yard', 'Eng', 'Returned to Engineering from check');
        loadComponents();
      } else if (action === 'check_delete') {
        // V28.10: Delete component
        if (!confirm('Are you sure you want to delete this item?')) return;
        await supabase.from('request_components')
          .update({ 
            status: 'Deleted',
            has_eng_check: false,
            eng_check_message: null,
            eng_check_sent_to: null
          })
          .eq('id', check.id);
        await logHistory(check.id, 'Deleted from Check', 'Yard', 'Deleted', 'Item deleted from Engineering check');
        loadComponents();
      }
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };

  // V32.0: Handle Engineering Check Partial Submit for Yard
  // When Yard does Partial, creates sub-request for "not found" items → Engineering
  const handleCheckPartialSubmit = async () => {
    if (!selectedCheck || !checkPartialQty) return;
    
    const foundQty = parseInt(checkPartialQty);
    const notFoundQty = selectedCheck.quantity - foundQty;
    const available = inventoryMap[selectedCheck?.ident_code]?.yard || 0;
    
    if (foundQty <= 0 || foundQty >= selectedCheck.quantity) {
      alert('Quantity must be between 1 and ' + (selectedCheck.quantity - 1));
      return;
    }
    
    if (foundQty > available) {
      alert(`Only ${available} available in YARD!`);
      return;
    }
    
    try {
      const currentReq = selectedCheck.requests;
      const reqNumber = currentReq?.request_number;
      
      let notFoundReqNumber = 'Closed';
      
      // V32.1: Only create sub-request if NOT "None"
      if (checkNotFoundDest !== 'None') {
        // Get next sub_number
        const { data: subData } = await supabase
          .from('requests')
          .select('sub_number')
          .eq('request_number', reqNumber)
          .order('sub_number', { ascending: false })
          .limit(1);
        
        const nextSub = (subData?.[0]?.sub_number || 0) + 1;
        
        // Create sub-request for NOT FOUND items
        const insertData = {
          request_number: reqNumber,
          sub_number: nextSub,
          parent_request_number: currentReq?.parent_request_number || reqNumber,
          request_type: currentReq?.request_type,
          sub_category: currentReq?.sub_category,
          iso_number: currentReq?.iso_number,
          full_spool_number: currentReq?.full_spool_number,
          hf_number: currentReq?.hf_number,
          test_pack_number: currentReq?.test_pack_number,
          requester_user_id: currentReq?.requester_user_id,
          created_by_name: currentReq?.created_by_name
        };
        
        const { data: newReq, error: reqError } = await supabase.from('requests')
          .insert(insertData)
          .select()
          .single();
        
        if (reqError || !newReq) {
          console.error('Request insert error:', reqError);
          alert('Error creating sub-request: ' + (reqError?.message || 'Unknown error'));
          loadComponents();
          return;
        }
        
        // Create component for NOT FOUND quantity - goes to Engineering "To Process"
        await supabase.from('request_components').insert({
          request_id: newReq.id,
          ident_code: selectedCheck.ident_code,
          description: selectedCheck.description,
          tag: selectedCheck.tag,
          dia1: selectedCheck.dia1,
          quantity: notFoundQty,
          status: checkNotFoundDest === 'Eng' ? 'Eng' : checkNotFoundDest,
          current_location: 'SITE',
          has_eng_check: false,
          eng_check_message: null,
          eng_check_sent_to: null,
          parent_component_id: selectedCheck.id,
          split_type: 'not_found'
        });
        
        // V32.1: Build the new request number string
        notFoundReqNumber = newReq.request_number_full || formatRequestNumber(newReq.request_number, newReq.sub_number || 0, 0, 0);
      }
      
      // V28.10: If found items go to Trans (Site IN), do NOT decrement yard here
      if (checkFoundDest !== 'Trans') {
        await supabase.rpc('decrement_yard_qty', { 
          p_ident_code: selectedCheck.ident_code, 
          p_qty: foundQty 
        });
      }
      
      // Update original component with FOUND quantity - goes to Site IN
      await supabase.from('request_components')
        .update({ 
          quantity: foundQty,
          status: checkFoundDest,
          has_eng_check: false,
          eng_check_message: null,
          eng_check_sent_to: null,
          split_type: 'found'
        })
        .eq('id', selectedCheck.id);
      
      // Log history with new format
      const destLabel = checkNotFoundDest === 'None' ? 'Closed' : checkNotFoundDest;
      const logNote = checkNotFoundDest === 'None' 
        ? `Partial: ${foundQty} found → ${checkFoundDest}, ${notFoundQty} not found → Closed (no sub-request)`
        : `Partial: ${foundQty} found → ${checkFoundDest}, ${notFoundQty} not found → ${destLabel} (${notFoundReqNumber})`;
      await logHistory(selectedCheck.id, 'Check - Partial Found', 'Yard', checkFoundDest, logNote);
      
      setShowCheckPartialModal(false);
      setSelectedCheck(null);
      loadComponents();
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };

  const openHistory = (compId) => {
    setHistoryComponentId(compId);
    setShowHistory(true);
  };

  const canModify = canModifyPage(user, 'wh_yard');

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading...</div>;

  return (
    <div>
      {/* Engineering Checks Section - Separate from regular components */}
      {engChecks.length > 0 && (
        <div style={{
          backgroundColor: '#FEF3C7',
          border: '2px solid #F59E0B',
          borderRadius: '8px',
          padding: '16px',
          marginBottom: '24px'
        }}>
          <h4 style={{ fontWeight: '600', color: '#B45309', marginBottom: '12px' }}>
            🔍 Engineering Checks ({engChecks.length})
          </h4>
          <div style={{ overflowX: 'auto' }}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Cat</th>
                  <th style={styles.th}>Sub</th>
                  <th style={styles.th}>ISO</th>
                  <th style={styles.th}>Spool</th>
                  <th style={styles.th}>HF</th>
                  <th style={styles.th}>TP</th>
                  <th style={styles.th}>Request</th>
                  <th style={styles.th}>Code</th>
                  <th style={styles.th}>Description</th>
                  <th style={styles.th}>Qty</th>
                  <th style={{ ...styles.th, backgroundColor: '#2563EB', color: 'white', textAlign: 'center' }}>Site Sent</th>
                  <th style={{ ...styles.th, backgroundColor: '#DC2626', color: 'white', textAlign: 'center' }}>Da Trovare</th>
                  <th style={{ ...styles.th, backgroundColor: COLORS.info, color: 'white', textAlign: 'center' }}>WH Site</th>
                  <th style={{ ...styles.th, backgroundColor: COLORS.secondary, color: 'white', textAlign: 'center' }}>WH Yard</th>
                  <th style={styles.th}>Message</th>
                  <th style={styles.th}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {engChecks.map(check => {
                  const inv = inventoryMap[check.ident_code] || { site: 0, yard: 0 };
                  const hasSiteQty = inv.site > 0;
                  const hasYardQty = inv.yard > 0;
                  const canFulfill = inv.yard >= check.quantity;
                  // V32.1: Calculate "Da Trovare" = qty - site_sent_qty (what Site already sent)
                  const siteSent = check.requests?.site_sent_qty || 0;
                  const daTrovare = Math.max(0, check.quantity - siteSent);
                  const isBothRequest = check.requests?.both_status !== null;
                  // V32.1: Auto-cancel if Site has already fulfilled the request
                  if (isBothRequest && siteSent >= check.quantity) {
                    return null; // Hide this row - Site already completed
                  }
                  return (
                    <tr key={check.id} style={{ backgroundColor: '#FFFBEB' }}>
                      <td style={styles.td}>{abbrevCategory(check.requests?.request_type)}</td>
                      <td style={styles.td}>{abbrevSubCategory(check.sub_category || check.requests?.sub_category)}</td>
                      <td style={{ ...styles.td, fontSize: '11px' }}>{check.requests?.iso_number || check.iso_number || '-'}</td>
                      <td style={{ ...styles.td, fontSize: '11px' }}>{abbrevSpool(check.requests?.full_spool_number || check.full_spool_number)}</td>
                      <td style={styles.td}>{check.requests?.hf_number || '-'}</td>
                      <td style={styles.td}>{check.requests?.test_pack_number || '-'}</td>
                      <td style={{ ...styles.td, fontFamily: 'monospace', fontWeight: '600' }}>
                        {displayRequestNumber(check.requests)}
                      </td>
                      <td style={{ ...styles.td, fontFamily: 'monospace', fontSize: '11px' }}>{check.ident_code}</td>
                      <td style={{ ...styles.td, maxWidth: '150px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={check.description || ''}>
                        {check.description ? (check.description.length > 30 ? check.description.substring(0, 30) + '...' : check.description) : '-'}
                      </td>
                      <td style={styles.td}>{check.quantity}</td>
                      {/* V32.1: Site Sent column */}
                      <td style={{ ...styles.td, textAlign: 'center', fontWeight: '600', color: siteSent > 0 ? '#16a34a' : '#9CA3AF' }}>
                        {isBothRequest ? (siteSent > 0 ? siteSent : '⏳') : '-'}
                      </td>
                      {/* V32.1: Da Trovare column */}
                      <td style={{ ...styles.td, textAlign: 'center', fontWeight: '700', color: daTrovare > 0 ? '#DC2626' : '#16a34a', backgroundColor: daTrovare === 0 ? '#D1FAE5' : 'transparent' }}>
                        {isBothRequest ? daTrovare : check.quantity}
                      </td>
                      <td style={{ ...styles.td, textAlign: 'center', fontWeight: '600', color: inv.site > 0 ? COLORS.success : COLORS.primary }}>
                        {inv.site}
                      </td>
                      <td style={{ ...styles.td, textAlign: 'center', fontWeight: '600', color: inv.yard > 0 ? COLORS.success : COLORS.primary }}>
                        {inv.yard}
                      </td>
                      <td style={{ ...styles.td, color: '#B45309', fontStyle: 'italic', maxWidth: '120px', overflow: 'hidden', textOverflow: 'ellipsis' }} title={check.eng_check_message || ''}>
                        {check.eng_check_message || '-'}
                      </td>
                      <td style={styles.td}>
                        <ActionDropdown
                          actions={(() => {
                            // V28.8: Build actions based on inventory in THIS warehouse (Yard)
                            const actions = [];
                            
                            // Found only if yard_qty >= requested (this is WH Yard page)
                            if (canFulfill) {
                              actions.push({ id: 'check_found', icon: '✓', label: 'Found (All) → Site IN' });
                            }
                            
                            // Partial only if yard_qty > 0
                            if (hasYardQty) {
                              actions.push({ id: 'check_partial', icon: '✂️', label: 'Partial' });
                            }
                            
                            // V30.0: Removed To HF - material must go through Site IN first
                            // V30.0: Removed To TestPack - material must go through Site IN first
                            // Flow: Yard → Site IN → WH Site → HF/TP
                            
                            // V30.0: To Site IN always available - sends request to Site IN for transfer
                            actions.push({ id: 'check_to_site', icon: '🏭', label: 'To Site IN' });
                            
                            // Not Found always available
                            actions.push({ id: 'check_notfound', icon: '✗', label: 'Not Found → Eng' });
                            
                            // V28.10: Return and Delete always available
                            actions.push({ id: 'check_return', icon: '↩️', label: 'Return to Eng' });
                            actions.push({ id: 'check_delete', icon: '🗑️', label: 'Delete' });
                            
                            return actions;
                          })()}
                          onExecute={(action) => handleCheckAction(check, action)}
                          disabled={!canModify}
                          componentId={check.id}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div style={styles.card}>
        <div style={{ ...styles.cardHeader, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontWeight: '600' }}>WH Yard - Components ({components.length})</h3>
          <button
            onClick={() => {
              const printWindow = window.open('', '_blank');
              printWindow.document.write(`
                <html><head><title>WH Yard Components</title>
                <style>
                  body { font-family: Arial, sans-serif; padding: 20px; }
                  h1 { color: #1F2937; }
                  table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                  th, td { border: 1px solid #ddd; padding: 6px; text-align: left; font-size: 10px; }
                  th { background-color: #F3F4F6; }
                  .alert { color: #DC2626; font-weight: bold; }
                </style></head><body>
                <h1>🏢 WH Yard - Components</h1>
                <p>Printed: ${new Date().toLocaleString()} | Total: ${components.length}</p>
                <table>
                  <tr><th>Cat</th><th>Sub</th><th>ISO</th><th>Spool</th><th>Request</th><th>Code</th><th>Description</th><th>Qty</th><th>Site</th><th>Yard</th><th>Alert</th></tr>
                  ${components.map(comp => {
                    const inv = inventoryMap[comp.ident_code] || { site: 0, yard: 0 };
                    const totalAvailable = inv.site + inv.yard;
                    const totalRequested = totalRequestedMap[comp.ident_code] || 0;
                    const isOverQty = totalRequested > totalAvailable;
                    return `<tr>
                      <td>${abbrevCategory(comp.requests?.request_type)}</td>
                      <td>${abbrevSubCategory(comp.sub_category || comp.requests?.sub_category)}</td>
                      <td>${comp.requests?.iso_number || '-'}</td>
                      <td>${comp.requests?.full_spool_number || '-'}</td>
                      <td>${displayRequestNumber(comp.requests)}</td>
                      <td>${comp.ident_code}</td>
                      <td>${comp.description || '-'}</td>
                      <td>${comp.quantity}</td>
                      <td>${inv.site}</td>
                      <td>${inv.yard}</td>
                      <td class="${isOverQty ? 'alert' : ''}">${isOverQty ? '⚠️' : ''}</td>
                    </tr>`;
                  }).join('')}
                </table>
                </body></html>
              `);
              printWindow.document.close();
              printWindow.print();
            }}
            style={{ ...styles.button, backgroundColor: COLORS.purple, color: 'white' }}
          >
            🖨️ Print
          </button>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Cat</th>
                <th style={styles.th}>Sub</th>
                <th style={styles.th}>ISO</th>
                <th style={styles.th}>Spool</th>
                <th style={styles.th}>HF</th>
                <th style={styles.th}>TP</th>
                <th style={styles.th}>Request</th>
                <th style={styles.th}>Code</th>
                <th style={styles.th}>Description</th>
                <th style={styles.th}>Qty</th>
                <th style={{ ...styles.th, backgroundColor: COLORS.info, color: 'white', textAlign: 'center' }}>WH Site</th>
                <th style={{ ...styles.th, backgroundColor: COLORS.secondary, color: 'white', textAlign: 'center' }}>WH Yard</th>
                <th style={styles.th}>Actions</th>
                <th style={{ ...styles.th, textAlign: 'center', width: '40px' }}>ℹ️</th>
                <th style={{ ...styles.th, textAlign: 'center', width: '50px' }}>Alert</th>
              </tr>
            </thead>
            <tbody>
              {components.map(comp => {
                const inv = inventoryMap[comp.ident_code] || { site: 0, yard: 0 };
                const available = inv.yard;
                const totalAvailable = inv.site + inv.yard;
                const canFulfill = available >= comp.quantity;
                // V28.5: Use sum of ALL open requests for this ident_code
                const totalRequested = totalRequestedMap[comp.ident_code] || 0;
                const isOverQty = totalRequested > totalAvailable;
                
                // V28.6: Build actions list based on inventory quantities
                // V29.0: HF/TP items from Yard must go to Site IN first, NOT directly to HF/TP
                const yardActions = [];
                const hasYardQty = available > 0;
                const hasSiteQty = inv.site > 0;
                const hasEnoughYard = inv.yard >= comp.quantity;
                const isHF = !!comp.requests?.hf_number;
                const isTP = !!comp.requests?.test_pack_number;
                
                // V29.0: Found/Transfer (Site IN) available for ALL items including HF/TP
                // From Yard, material must go to Site IN first, then from Site to HF/TP
                if (hasEnoughYard) {
                  yardActions.push({ id: 'found', icon: '✓', label: 'Found → Site IN' });
                }
                // Partial requires some quantity in yard
                if (hasYardQty) {
                  yardActions.push({ id: 'pt', icon: '✂️', label: 'Partial' });
                }
                // Engineering always available
                yardActions.push({ id: 'eng', icon: '⚙️', label: 'To Engineering' });
                // V29.0: NO "To HF" or "To TestPack" from Yard - must go through Site IN first!
                // Return to Site requires site_qty > 0 (material must be available at site)
                if (hasSiteQty) {
                  yardActions.push({ id: 'return', icon: '↩️', label: 'Return to Site' });
                }
                // Delete always available
                yardActions.push({ id: 'delete', icon: '🗑️', label: 'Delete' });
                
                return (
                  <tr key={comp.id} style={isOverQty ? { backgroundColor: '#FEF2F2' } : {}}>
                    <td style={styles.td}>{abbrevCategory(comp.requests?.request_type)}</td>
                    <td style={styles.td}>{abbrevSubCategory(comp.sub_category || comp.requests?.sub_category)}</td>
                    <td style={{ ...styles.td, fontSize: '11px' }}>{comp.requests?.iso_number || comp.iso_number || '-'}</td>
                    <td style={{ ...styles.td, fontSize: '11px' }}>{abbrevSpool(comp.requests?.full_spool_number || comp.full_spool_number)}</td>
                    <td style={styles.td}>{comp.requests?.hf_number || '-'}</td>
                    <td style={styles.td}>{comp.requests?.test_pack_number || '-'}</td>
                    <td style={{ ...styles.td, fontFamily: 'monospace', fontWeight: '600' }}>
                      {displayRequestNumber(comp.requests)}
                    </td>
                    <td style={{ ...styles.td, fontFamily: 'monospace', fontSize: '11px' }}>{comp.ident_code}</td>
                    <td style={{ ...styles.td, maxWidth: '150px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={comp.description || ''}>
                      {comp.description ? (comp.description.length > 30 ? comp.description.substring(0, 30) + '...' : comp.description) : '-'}
                    </td>
                    <td style={styles.td}>{comp.quantity}</td>
                    <td style={{ ...styles.td, textAlign: 'center', fontWeight: '600', color: inv.site > 0 ? COLORS.success : COLORS.primary }}>
                      {inv.site}
                    </td>
                    <td style={{ ...styles.td, textAlign: 'center', fontWeight: '600', color: available > 0 ? COLORS.success : COLORS.primary }}>
                      {available}
                    </td>
                    <td style={styles.td}>
                      <ActionDropdown
                        actions={yardActions}
                        onExecute={(action) => handleAction(comp, action)}
                        disabled={!canModify}
                        componentId={comp.id}
                      />
                    </td>
                    <td style={{ ...styles.td, textAlign: 'center' }}>
                      <ActionButton color={comp.requests?.description ? COLORS.primary : COLORS.info} onClick={() => openHistory(comp.id)} title="History">ℹ️</ActionButton>
                    </td>
                    <td style={{ ...styles.td, textAlign: 'center' }}>
                      {isOverQty && (
                        <span title={`Total requested: ${totalRequested}, available: ${totalAvailable}`} style={{ cursor: 'help', fontSize: '18px' }}>⚠️</span>
                      )}
                    </td>
                  </tr>
                );
              })}
              {components.length === 0 && (
                <tr>
                  <td colSpan="15" style={{ ...styles.td, textAlign: 'center', color: '#9ca3af' }}>
                    No components in WH Yard
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Destination Popup */}
      <DestinationPopup
        isOpen={showDestPopup}
        onClose={() => setShowDestPopup(false)}
        onSelect={handleDestinationSelect}
        title="Where to send the found material?"
      />

      {/* Partial Modal - V29.0: With inventory validation */}
      <Modal isOpen={showPartialModal} onClose={() => setShowPartialModal(false)} title="🔶 Partial Split">
        {(() => {
          const availableQty = inventoryMap[selectedComponent?.ident_code]?.yard || 0;
          const isOverLimit = parseInt(partialQty) > availableQty;
          return (
        <>
        <div style={{ marginBottom: '16px' }}>
          <p style={{ marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: COLORS.info }}>
            📋 Request: {displayRequestNumber(selectedComponent?.requests)}
          </p>
          <p style={{ marginBottom: '8px' }}>
            <strong>Item:</strong> <span style={{ fontFamily: 'monospace' }}>{selectedComponent?.ident_code}</span>
          </p>
          <p style={{ marginBottom: '8px' }}>
            <strong>Total Requested:</strong> {selectedComponent?.quantity}
          </p>
          <p style={{ marginBottom: '16px' }}>
            <strong>Available in YARD:</strong> <span style={{ color: COLORS.success, fontWeight: '600' }}>{availableQty}</span>
          </p>
        </div>
        
        <div style={{ marginBottom: '16px' }}>
          <label style={styles.label}>Found Quantity</label>
          <input
            type="number"
            value={partialQty}
            onChange={(e) => setPartialQty(e.target.value)}
            style={{ ...styles.input, borderColor: isOverLimit ? COLORS.primary : undefined }}
            min="1"
            max={availableQty}
            placeholder="Enter found quantity"
          />
          {isOverLimit && (
            <p style={{ color: COLORS.primary, fontSize: '12px', marginTop: '4px' }}>
              ⚠️ Cannot exceed available quantity ({availableQty})
            </p>
          )}
          {parseInt(partialQty) === selectedComponent?.quantity && (
            <p style={{ color: COLORS.info, fontSize: '12px', marginTop: '4px' }}>
              ℹ️ Sending all requested quantity - select "None (Close)" for Not Found
            </p>
          )}
        </div>
        
        <div style={{ marginBottom: '16px' }}>
          <label style={styles.label}>✅ Found ({partialQty || 0} pcs) go to:</label>
          <select
            value={partialFoundDest}
            onChange={(e) => setPartialFoundDest(e.target.value)}
            style={styles.input}
          >
            <option value="Trans">→ Site IN (Transit)</option>
            <option value="WH_Site">→ WH Site</option>
            <option value="Eng">→ Engineering</option>
            {selectedComponent?.requests?.hf_number && (
              <option value="HF">→ HF</option>
            )}
            {(selectedComponent?.requests?.test_pack_number || selectedComponent?.requests?.request_type === 'TestPack') && (
              <option value="TP">→ TestPack</option>
            )}
          </select>
        </div>
        
        <div style={{ marginBottom: '16px' }}>
          <label style={styles.label}>❌ Not Found ({(selectedComponent?.quantity || 0) - (parseInt(partialQty) || 0)} pcs) go to:</label>
          <select
            value={partialNotFoundDest}
            onChange={(e) => setPartialNotFoundDest(e.target.value)}
            style={styles.input}
          >
            <option value="None">→ None (Close)</option>
            <option value="Eng">→ Engineering</option>
            <option value="Order">→ Orders</option>
            <option value="WH_Site">→ WH Site</option>
            {selectedComponent?.requests?.hf_number && (
              <option value="HF">→ HF</option>
            )}
            {(selectedComponent?.requests?.test_pack_number || selectedComponent?.requests?.request_type === 'TestPack') && (
              <option value="TP">→ TestPack</option>
            )}
          </select>
        </div>
        
        <div style={{ 
          backgroundColor: '#FEF3C7', 
          border: '1px solid #F59E0B', 
          borderRadius: '8px', 
          padding: '12px',
          marginBottom: '16px'
        }}>
          <p style={{ fontSize: '13px', color: '#92400E' }}>
            • <strong>{partialQty || 0} pcs</strong> → {partialFoundDest === 'Trans' ? 'Site IN' : partialFoundDest} (Original request)
          </p>
          <p style={{ fontSize: '13px', color: '#92400E' }}>
            • <strong>{(selectedComponent?.quantity || 0) - (parseInt(partialQty) || 0)} pcs</strong> → {partialNotFoundDest} (New sub-request)
          </p>
        </div>
        
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          <button onClick={() => setShowPartialModal(false)} style={{ ...styles.button, ...styles.buttonSecondary }}>Cancel</button>
          <button 
            onClick={submitPartial} 
            disabled={!partialQty || parseInt(partialQty) <= 0 || parseInt(partialQty) >= selectedComponent?.quantity || isOverLimit}
            style={{ 
              ...styles.button, 
              backgroundColor: COLORS.warning, 
              color: 'white',
              opacity: (!partialQty || parseInt(partialQty) <= 0 || parseInt(partialQty) >= selectedComponent?.quantity || isOverLimit) ? 0.5 : 1
            }}
          >
            SPLIT
          </button>
        </div>
        </>
          );
        })()}
      </Modal>

      {/* Engineering Check Partial Modal */}
      <Modal isOpen={showCheckPartialModal} onClose={() => setShowCheckPartialModal(false)} title="🔶 Partial Split">
        <div style={{ marginBottom: '16px' }}>
          <p style={{ marginBottom: '8px' }}>
            <strong>Item:</strong> <span style={{ fontFamily: 'monospace' }}>{selectedCheck?.ident_code}</span>
          </p>
          <p style={{ marginBottom: '8px' }}>
            <strong>Total Requested:</strong> {selectedCheck?.quantity}
          </p>
          <p style={{ marginBottom: '4px' }}>
            <strong>Available in SITE:</strong> <span style={{ color: (inventoryMap[selectedCheck?.ident_code]?.site || 0) > 0 ? COLORS.success : COLORS.primary, fontWeight: '600' }}>{inventoryMap[selectedCheck?.ident_code]?.site || 0}</span>
          </p>
          <p style={{ marginBottom: '16px' }}>
            <strong>Available in YARD:</strong> <span style={{ color: (inventoryMap[selectedCheck?.ident_code]?.yard || 0) > 0 ? COLORS.success : COLORS.primary, fontWeight: '600' }}>{inventoryMap[selectedCheck?.ident_code]?.yard || 0}</span>
          </p>
        </div>
        
        <div style={{ marginBottom: '16px' }}>
          <label style={styles.label}>Found Quantity</label>
          <input
            type="number"
            value={checkPartialQty}
            onChange={(e) => setCheckPartialQty(e.target.value)}
            style={styles.input}
            min="1"
            max={Math.min(selectedCheck?.quantity - 1, inventoryMap[selectedCheck?.ident_code]?.yard || 0)}
            placeholder="Enter found quantity"
          />
        </div>
        
        <div style={{ marginBottom: '16px' }}>
          <label style={styles.label}>✅ Found ({checkPartialQty || 0} pcs) go to:</label>
          <select
            value={checkFoundDest}
            onChange={(e) => setCheckFoundDest(e.target.value)}
            style={styles.input}
          >
            <option value="Trans">→ Site IN (Transit)</option>
            <option value="WH_Site">→ WH Site</option>
            <option value="Eng">→ Engineering</option>
            {(selectedCheck?.requests?.test_pack_number || selectedCheck?.requests?.request_type === 'TestPack') && (
              <option value="TP">→ TestPack</option>
            )}
          </select>
        </div>
        
        <div style={{ marginBottom: '16px' }}>
          <label style={styles.label}>❌ Not Found ({(selectedCheck?.quantity || 0) - (parseInt(checkPartialQty) || 0)} pcs) go to:</label>
          <select
            value={checkNotFoundDest}
            onChange={(e) => setCheckNotFoundDest(e.target.value)}
            style={styles.input}
          >
            <option value="None">→ None (Close)</option>
            <option value="Eng">→ Engineering</option>
            <option value="WH_Site">→ WH Site</option>
            {(selectedCheck?.requests?.test_pack_number || selectedCheck?.requests?.request_type === 'TestPack') && (
              <option value="TP">→ TestPack</option>
            )}
          </select>
        </div>
        
        <div style={{ 
          backgroundColor: '#FEF3C7', 
          border: '1px solid #F59E0B', 
          borderRadius: '8px', 
          padding: '12px',
          marginBottom: '16px'
        }}>
          <p style={{ fontSize: '13px', color: '#92400E' }}>
            • <strong>{checkPartialQty || 0} pcs</strong> → {checkFoundDest === 'Trans' ? 'Site IN' : checkFoundDest} (Original request)
          </p>
          <p style={{ fontSize: '13px', color: '#92400E' }}>
            • <strong>{(selectedCheck?.quantity || 0) - (parseInt(checkPartialQty) || 0)} pcs</strong> → {checkNotFoundDest === 'WH_Site' ? 'WH Site' : checkNotFoundDest} (New sub-request)
          </p>
        </div>
        
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          <button onClick={() => setShowCheckPartialModal(false)} style={{ ...styles.button, ...styles.buttonSecondary }}>Cancel</button>
          <button 
            onClick={handleCheckPartialSubmit} 
            disabled={!checkPartialQty || parseInt(checkPartialQty) <= 0 || parseInt(checkPartialQty) >= selectedCheck?.quantity || parseInt(checkPartialQty) > (inventoryMap[selectedCheck?.ident_code]?.yard || 0)}
            style={{ 
              ...styles.button, 
              backgroundColor: COLORS.warning, 
              color: 'white',
              opacity: (!checkPartialQty || parseInt(checkPartialQty) <= 0 || parseInt(checkPartialQty) >= selectedCheck?.quantity || parseInt(checkPartialQty) > (inventoryMap[selectedCheck?.ident_code]?.yard || 0)) ? 0.5 : 1
            }}
          >
            SPLIT
          </button>
        </div>
      </Modal>

      {/* History Popup */}
      <HistoryPopup
        isOpen={showHistory}
        onClose={() => setShowHistory(false)}
        componentId={historyComponentId}
      />
    </div>
  );
}

// ============================================================
// SITE IN PAGE - V28.5: Actions dropdown with Receive/Delete/Return
// V32.1: Added Both visibility - shows total requested, Site sent, Yard sending
// ============================================================
function SiteInPage({ user }) {
  const [components, setComponents] = useState([]);
  const [loading, setLoading] = useState(true);
  // V29.0: Label print modal
  const [showLabelModal, setShowLabelModal] = useState(false);
  const [selectedForLabel, setSelectedForLabel] = useState(null);
  // V32.1: Parent request data for Both visibility
  const [parentDataMap, setParentDataMap] = useState({});

  useEffect(() => { loadComponents(); }, []);

  const loadComponents = async () => {
    setLoading(true);
    // V32.1: Load more fields from request including parent_request_id for Both tracking
    const { data } = await supabase
      .from('request_components')
      .select(`*, requests (
        id, request_number, sub_number, request_number_full, 
        level_component, level_wh_split, level_yard_split,
        parent_request_id, parent_request_number,
        site_sent_qty, yard_sent_qty, both_status,
        sub_category, request_type, iso_number, full_spool_number, 
        hf_number, test_pack_number, description, 
        created_by_name, requester_user_id
      )`)
      .eq('status', 'Trans');
    
    // V29.0: Enrich with requester names for old requests
    if (data) {
      const userIdsToLookup = [...new Set(
        data.filter(r => r.requests?.requester_user_id && !r.requests?.created_by_name)
            .map(r => r.requests.requester_user_id)
      )];
      let userNameMap = {};
      if (userIdsToLookup.length > 0) {
        const { data: usersData } = await supabase.from('users').select('id, full_name').in('id', userIdsToLookup);
        if (usersData) userNameMap = Object.fromEntries(usersData.map(u => [u.id, u.full_name]));
      }
      
      // V32.1: Load parent request data for Both requests
      const parentIds = [...new Set(
        data.filter(r => r.requests?.parent_request_id)
            .map(r => r.requests.parent_request_id)
      )];
      
      let parentMap = {};
      if (parentIds.length > 0) {
        // Load parent requests to get original qty and both status
        const { data: parentData } = await supabase
          .from('requests')
          .select('id, site_sent_qty, yard_sent_qty, both_status')
          .in('id', parentIds);
        
        if (parentData) {
          parentData.forEach(p => {
            parentMap[p.id] = {
              site_sent_qty: p.site_sent_qty || 0,
              yard_sent_qty: p.yard_sent_qty || 0,
              both_status: p.both_status
            };
          });
        }
        
        // Also load components from parent to get original requested qty
        const { data: parentComps } = await supabase
          .from('request_components')
          .select('request_id, quantity')
          .in('request_id', parentIds);
        
        if (parentComps) {
          parentComps.forEach(pc => {
            if (parentMap[pc.request_id]) {
              parentMap[pc.request_id].original_qty = pc.quantity;
            }
          });
        }
      }
      setParentDataMap(parentMap);
      
      const enriched = data.map(r => ({
        ...r,
        requests: r.requests ? { ...r.requests, created_by_name: r.requests.created_by_name || userNameMap[r.requests.requester_user_id] || null } : null
      }));
      setComponents(enriched);
    }
    setLoading(false);
  };

  // V28.9: Unified action handler
  const handleAction = async (comp, action) => {
    switch (action) {
      case 'receive':
        await handleReceive(comp);
        break;
      case 'return':
        await handleReturn(comp);
        break;
      case 'delete':
        await handleDelete(comp);
        break;
    }
  };

  // V28.5: Receive → WH_Site (not ToCollect)
  // V28.10: Inventory changes ONLY here (yard_qty decreases, site_qty increases)
  // V32.3: Enhanced with detailed logging and error handling
  const handleReceive = async (component) => {
    try {
      console.log('═══════════════════════════════════════════');
      console.log('📦 Site IN - RECEIVING COMPONENT');
      console.log('═══════════════════════════════════════════');
      console.log('   ident_code:', component.ident_code);
      console.log('   quantity:', component.quantity);
      console.log('   component_id:', component.id);
      
      // V32.3: Update component status FIRST
      const { error: statusError } = await supabase.from('request_components')
        .update({ status: 'WH_Site', current_location: 'SITE', previous_status: 'Trans' })
        .eq('id', component.id);
      
      if (statusError) {
        console.error('❌ Error updating component status:', statusError);
        alert('Error updating status: ' + statusError.message);
        return;
      }
      console.log('✅ Component status updated to WH_Site');
      
      // V32.3: Try transfer_yard_to_site RPC first (most reliable)
      console.log('📊 Attempting inventory transfer via RPC...');
      const { data: rpcResult, error: rpcError } = await supabase.rpc('transfer_yard_to_site', {
        p_ident_code: component.ident_code,
        p_qty: component.quantity
      });
      
      if (!rpcError && rpcResult?.success) {
        console.log('✅ RPC transfer successful:', rpcResult);
        console.log(`   Yard: ${rpcResult.old_yard} → ${rpcResult.new_yard}`);
        console.log(`   Site: ${rpcResult.old_site} → ${rpcResult.new_site}`);
      } else {
        // RPC failed or function doesn't exist - try direct update
        console.log('⚠️ RPC failed, trying direct update...', rpcError?.message || rpcResult?.error);
        
        // Get current inventory
        const { data: currentInv, error: invError } = await supabase
          .from('inventory')
          .select('id, ident_code, site_qty, yard_qty')
          .eq('ident_code', component.ident_code)
          .maybeSingle();
        
        if (invError) {
          console.error('❌ Error fetching inventory:', invError);
        }
        
        console.log('📊 Current inventory record:', currentInv);
        
        if (currentInv) {
          const oldYardQty = currentInv.yard_qty || 0;
          const oldSiteQty = currentInv.site_qty || 0;
          const newYardQty = Math.max(0, oldYardQty - component.quantity);
          const newSiteQty = oldSiteQty + component.quantity;
          
          console.log('📊 INVENTORY TRANSFER (direct):');
          console.log(`   Yard: ${oldYardQty} → ${newYardQty} (−${component.quantity})`);
          console.log(`   Site: ${oldSiteQty} → ${newSiteQty} (+${component.quantity})`);
          
          // Direct UPDATE
          const { error: updateError } = await supabase
            .from('inventory')
            .update({ 
              yard_qty: newYardQty, 
              site_qty: newSiteQty 
            })
            .eq('id', currentInv.id);
          
          if (updateError) {
            console.error('❌ Direct update failed:', updateError);
            // Last resort: try upsert
            console.log('🔄 Trying upsert as last resort...');
            const { error: upsertError } = await supabase
              .from('inventory')
              .upsert({
                ident_code: component.ident_code,
                yard_qty: newYardQty,
                site_qty: newSiteQty,
                lost_qty: 0,
                broken_qty: 0
              }, { onConflict: 'ident_code' });
            
            if (upsertError) {
              console.error('❌ Upsert also failed:', upsertError);
              alert('Could not update inventory. Please check database permissions and run the SQL migration.');
            } else {
              console.log('✅ Upsert successful!');
            }
          } else {
            console.log('✅ Direct update successful!');
          }
        } else {
          // No inventory record - create new with site_qty only
          console.log('⚠️ No inventory record found. Creating new...');
          const { error: insertError } = await supabase.from('inventory').insert({
            ident_code: component.ident_code,
            site_qty: component.quantity,
            yard_qty: 0,
            lost_qty: 0,
            broken_qty: 0
          });
          
          if (insertError) {
            console.error('❌ Insert failed:', insertError);
            // Try upsert
            const { error: upsertError } = await supabase
              .from('inventory')
              .upsert({
                ident_code: component.ident_code,
                site_qty: component.quantity,
                yard_qty: 0,
                lost_qty: 0,
                broken_qty: 0
              }, { onConflict: 'ident_code' });
            
            if (upsertError) {
              console.error('❌ Upsert also failed:', upsertError);
            } else {
              console.log('✅ Created via upsert');
            }
          } else {
            console.log('✅ Created new inventory record');
          }
        }
      }
      
      console.log('═══════════════════════════════════════════');

      // V32.3: If this is part of a Both request, mark the Yard sibling as Done
      if (component.requests?.both_status !== null || component.split_type === 'yard') {
        const parentReqId = component.requests?.parent_request_id;
        if (parentReqId) {
          const { data: siblings } = await supabase
            .from('request_components')
            .select('id, request_id')
            .eq('request_id', parentReqId)
            .neq('id', component.id);
          
          if (siblings && siblings.length > 0) {
            for (const sib of siblings) {
              await supabase.from('request_components')
                .update({ status: 'Done', previous_status: 'Yard' })
                .eq('id', sib.id);
              console.log('✅ Marked Yard sibling as Done:', sib.id);
            }
          }
        }
        
        if (component.requests?.id) {
          await supabase.from('requests')
            .update({ yard_sent_qty: component.quantity })
            .eq('id', component.requests.id);
        }
      }

      await supabase.from('component_history').insert({
        component_id: component.id,
        action: 'Received at Site',
        from_status: 'Trans',
        to_status: 'WH_Site',
        performed_by_user_id: user.id,
        performed_by_name: user.full_name,
        note: `Material arrived at Site warehouse - transferred ${component.quantity} pcs from Yard to Site`
      });

      await supabase.from('movements').insert({
        ident_code: component.ident_code,
        movement_type: 'TRANSFER',
        quantity: component.quantity,
        from_location: 'YARD',
        to_location: 'SITE',
        performed_by: user.full_name,
        note: 'Confirmed receipt at Site'
      });

      alert(`✅ Received ${component.quantity} pcs of ${component.ident_code}\nInventory updated: Yard → Site`);
      loadComponents();
    } catch (error) {
      console.error('❌ handleReceive error:', error);
      alert('Error: ' + error.message);
    }
  };

  // V28.5: Delete action
  const handleDelete = async (component) => {
    if (!confirm(`Delete request ${String(component.requests?.request_number).padStart(5, '0')}-${component.requests?.sub_number}?`)) return;
    
    try {
      await supabase.from('request_components')
        .update({ status: 'Deleted' })
        .eq('id', component.id);
      
      await supabase.from('component_history').insert({
        component_id: component.id,
        action: 'Deleted from Site IN',
        from_status: 'Trans',
        to_status: 'Deleted',
        performed_by_user_id: user.id,
        performed_by_name: user.full_name,
        note: 'Request deleted while in transit'
      });

      loadComponents();
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };

  // V28.5: Return to previous status (Yard)
  const handleReturn = async (component) => {
    const prevStatus = component.previous_status || 'Yard';
    
    try {
      await supabase.from('request_components')
        .update({ status: prevStatus, previous_status: 'Trans' })
        .eq('id', component.id);
      
      await supabase.from('component_history').insert({
        component_id: component.id,
        action: 'Returned from Site IN',
        from_status: 'Trans',
        to_status: prevStatus,
        performed_by_user_id: user.id,
        performed_by_name: user.full_name,
        note: `Returned to ${prevStatus}`
      });

      loadComponents();
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };

  const canModify = canModifyPage(user, 'site_in');

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading...</div>;

  return (
    <div>
      <div style={styles.card}>
        <div style={{ ...styles.cardHeader, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontWeight: '600' }}>Site IN - Material in Transit ({components.length})</h3>
          <button
            onClick={() => {
              const printWindow = window.open('', '_blank');
              printWindow.document.write(`
                <html><head><title>Site IN - Transit</title>
                <style>
                  body { font-family: Arial, sans-serif; padding: 20px; }
                  h1 { color: #16a34a; }
                  table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                  th, td { border: 1px solid #ddd; padding: 6px; text-align: left; font-size: 10px; }
                  th { background-color: #DCFCE7; }
                </style></head><body>
                <h1>🏗️ Site IN - Material in Transit</h1>
                <p>Printed: ${new Date().toLocaleString()} | Total: ${components.length}</p>
                <table>
                  <tr><th>Cat</th><th>Sub</th><th>ISO</th><th>Spool</th><th>Request</th><th>Code</th><th>Description</th><th>Qty</th></tr>
                  ${components.map(comp => `<tr>
                    <td>${abbrevCategory(comp.requests?.request_type)}</td>
                    <td>${abbrevSubCategory(comp.sub_category || comp.requests?.sub_category)}</td>
                    <td>${comp.requests?.iso_number || '-'}</td>
                    <td>${comp.requests?.full_spool_number || '-'}</td>
                    <td>${displayRequestNumber(comp.requests)}</td>
                    <td>${comp.ident_code}</td>
                    <td>${comp.description || '-'}</td>
                    <td>${comp.quantity}</td>
                  </tr>`).join('')}
                </table>
                </body></html>
              `);
              printWindow.document.close();
              printWindow.print();
            }}
            style={{ ...styles.button, backgroundColor: COLORS.purple, color: 'white' }}
          >
            🖨️ Print
          </button>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Cat</th>
                <th style={styles.th}>Sub</th>
                <th style={styles.th}>ISO</th>
                <th style={styles.th}>Spool</th>
                <th style={styles.th}>HF</th>
                <th style={styles.th}>TP</th>
                <th style={styles.th}>Request</th>
                <th style={styles.th}>Code</th>
                <th style={styles.th}>Description</th>
                <th style={{ ...styles.th, backgroundColor: '#7C3AED', color: 'white', textAlign: 'center' }}>Qty Ric.</th>
                <th style={{ ...styles.th, backgroundColor: '#2563EB', color: 'white', textAlign: 'center' }}>Site Sent</th>
                <th style={{ ...styles.th, backgroundColor: '#EA580C', color: 'white', textAlign: 'center' }}>Qty Arrivo</th>
                <th style={styles.th}>Actions</th>
                <th style={styles.th}>🏷️</th>
              </tr>
            </thead>
            <tbody>
              {components.map(comp => {
                // V32.1: Get parent data for Both requests
                const parentId = comp.requests?.parent_request_id;
                const parentInfo = parentId ? parentDataMap[parentId] : null;
                const isBothRequest = parentInfo?.both_status !== null && parentInfo?.both_status !== undefined;
                
                // Calculate values
                const originalQty = parentInfo?.original_qty || comp.quantity;
                const siteSent = parentInfo?.site_sent_qty || 0;
                const yardSending = comp.quantity; // This component's qty
                
                return (
                <tr key={comp.id}>
                  <td style={styles.td}>{abbrevCategory(comp.requests?.request_type)}</td>
                  <td style={styles.td}>{abbrevSubCategory(comp.sub_category || comp.requests?.sub_category)}</td>
                  <td style={{ ...styles.td, fontSize: '11px' }}>{comp.requests?.iso_number || comp.iso_number || '-'}</td>
                  <td style={{ ...styles.td, fontSize: '11px' }}>{abbrevSpool(comp.requests?.full_spool_number || comp.full_spool_number)}</td>
                  <td style={styles.td}>{comp.requests?.hf_number || '-'}</td>
                  <td style={styles.td}>{comp.requests?.test_pack_number || '-'}</td>
                  <td style={{ ...styles.td, fontFamily: 'monospace', fontWeight: '600' }}>
                    {displayRequestNumber(comp.requests)}
                  </td>
                  <td style={{ ...styles.td, fontFamily: 'monospace', fontSize: '11px' }}>{comp.ident_code}</td>
                  <td style={{ ...styles.td, maxWidth: '150px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={comp.description || ''}>
                    {comp.description ? (comp.description.length > 35 ? comp.description.substring(0, 35) + '...' : comp.description) : '-'}
                  </td>
                  {/* V32.1: Qty Richiesta (original total requested) */}
                  <td style={{ ...styles.td, textAlign: 'center', fontWeight: '600', color: '#7C3AED' }}>
                    {isBothRequest ? originalQty : comp.quantity}
                  </td>
                  {/* V32.1: Site Sent (what Site already sent) */}
                  <td style={{ ...styles.td, textAlign: 'center', fontWeight: '600', color: siteSent > 0 ? '#16a34a' : '#9CA3AF' }}>
                    {isBothRequest ? (siteSent > 0 ? `✅ ${siteSent}` : '⏳') : '-'}
                  </td>
                  {/* V32.1: Qty Arrivo (what Yard is sending - this component) */}
                  <td style={{ ...styles.td, textAlign: 'center', fontWeight: '700', fontSize: '15px', color: '#EA580C' }}>
                    🚚 {yardSending}
                  </td>
                  <td style={styles.td}>
                    {/* V28.9: Use ActionDropdown instead of custom dropdown */}
                    <ActionDropdown
                      actions={[
                        { id: 'receive', icon: '📥', label: 'Receive' },
                        { id: 'return', icon: '↩️', label: 'Return' },
                        { id: 'delete', icon: '🗑️', label: 'Delete' }
                      ]}
                      onExecute={(action) => handleAction(comp, action)}
                      disabled={!canModify}
                      componentId={comp.id}
                    />
                  </td>
                  <td style={{ ...styles.td, textAlign: 'center' }}>
                    <button
                      onClick={() => {
                        // V32.1: Pass parent data for Both label printing
                        const enrichedComp = {
                          ...comp,
                          _parentInfo: parentInfo,
                          _originalQty: originalQty,
                          _siteSent: siteSent,
                          _isBoth: isBothRequest
                        };
                        setSelectedForLabel(enrichedComp);
                        setShowLabelModal(true);
                      }}
                      style={{ 
                        padding: '4px 8px', 
                        border: 'none', 
                        borderRadius: '4px', 
                        backgroundColor: COLORS.info, 
                        color: 'white', 
                        cursor: 'pointer',
                        fontSize: '14px'
                      }}
                      title="Print Label"
                    >
                      🏷️
                    </button>
                  </td>
                </tr>
              );
              })}
              {components.length === 0 && (
                <tr>
                  <td colSpan="14" style={{ ...styles.td, textAlign: 'center', color: '#9ca3af' }}>
                    No materials in transit
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* V29.0: Label Print Modal */}
      <LabelPrintModal
        isOpen={showLabelModal}
        onClose={() => { setShowLabelModal(false); setSelectedForLabel(null); }}
        component={selectedForLabel}
      />
    </div>
  );
}

// ============================================================
// ENGINEERING PAGE - con Check Both
// ============================================================
function EngineeringPage({ user }) {
  const [waitingForCheck, setWaitingForCheck] = useState([]);
  const [toProcess, setToProcess] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCheckModal, setShowCheckModal] = useState(false);
  const [selectedComponent, setSelectedComponent] = useState(null);
  const [checkDestination, setCheckDestination] = useState('WH_Site');
  const [checkMessage, setCheckMessage] = useState('');
  const [showHistory, setShowHistory] = useState(false);
  const [historyComponentId, setHistoryComponentId] = useState(null);
  // V28: Management Note Modal
  const [showMngNoteModal, setShowMngNoteModal] = useState(false);
  const [mngNote, setMngNote] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [inventoryMap, setInventoryMap] = useState({}); // V28.9: Inventory map

  useEffect(() => { loadComponents(); }, []);

  const loadComponents = async () => {
    setLoading(true);
    
    try {
      // Waiting for Check: items sent to Site/Yard for verification
      // V32.0: Exclude parent items with 'Both' - only show child items with 'WH_Site' or 'Yard'
      const { data: waitingData } = await supabase
        .from('request_components')
        .select(`*, requests (request_number, sub_number, request_number_full, level_component, level_wh_split, level_yard_split, sub_category, request_type, iso_number, full_spool_number, hf_number, test_pack_number, description)`)
        .eq('has_eng_check', true)
        .neq('eng_check_sent_to', 'Both'); // Exclude parent items
      
      // To Process: items in Eng status without pending check
      // V32.0: Also exclude Eng_Both status (parent waiting for children)
      const { data: processData } = await supabase
        .from('request_components')
        .select(`*, requests (request_number, sub_number, request_number_full, level_component, level_wh_split, level_yard_split, sub_category, request_type, iso_number, full_spool_number, hf_number, test_pack_number, description)`)
        .eq('status', 'Eng')
        .eq('has_eng_check', false);
      
      // V28.9: Load inventory ONLY for the ident_codes we need (not all 237k!)
      const allComps = [...(waitingData || []), ...(processData || [])];
      const uniqueIdentCodes = [...new Set(allComps.map(c => c.ident_code).filter(Boolean))];
      
      const invMap = {};
      if (uniqueIdentCodes.length > 0) {
        const { data: invData } = await supabase
          .from('inventory')
          .select('ident_code, site_qty, yard_qty')
          .in('ident_code', uniqueIdentCodes);
        
        if (invData) {
          invData.forEach(inv => {
            invMap[inv.ident_code] = { site: inv.site_qty || 0, yard: inv.yard_qty || 0 };
          });
        }
      }
      setInventoryMap(invMap);
      
      if (waitingData) setWaitingForCheck(waitingData);
      if (processData) setToProcess(processData);
    } catch (error) {
      console.error('Engineering load error:', error);
      alert('Error loading Engineering data: ' + error.message);
    }
    
    setLoading(false);
  };

  const logHistory = async (compId, action, fromStatus, toStatus, note) => {
    await supabase.from('component_history').insert({
      component_id: compId,
      action: action,
      from_status: fromStatus,
      to_status: toStatus,
      performed_by_user_id: user.id,
      performed_by_name: user.full_name,
      note: note
    });
  };

  const handleAction = async (component, action) => {
    try {
      switch (action) {
        case 'resolved':
          await supabase.from('request_components')
            .update({ status: 'WH_Site' })
            .eq('id', component.id);
          await logHistory(component.id, 'Resolved - Sent to Site', 'Eng', 'WH_Site', '');
          break;
        case 'check':
          setSelectedComponent(component);
          setShowCheckModal(true);
          return;
        case 'spare':
          await supabase.from('request_components')
            .update({ status: 'Spare' })
            .eq('id', component.id);
          await logHistory(component.id, 'Sent to Spare Parts', 'Eng', 'Spare', '');
          break;
        case 'mng':
          // V28: Open modal for management note
          setSelectedComponent(component);
          setMngNote('');
          setShowMngNoteModal(true);
          return;
        case 'return':
          await supabase.from('request_components')
            .update({ status: 'WH_Site' })
            .eq('id', component.id);
          await logHistory(component.id, 'Returned to Site', 'Eng', 'WH_Site', '');
          break;
        case 'delete':
          if (confirm('Delete this component?')) {
            await supabase.from('request_components')
              .update({ status: 'Cancelled' })
              .eq('id', component.id);
            await logHistory(component.id, 'Cancelled', 'Eng', 'Cancelled', '');
          }
          break;
        // V28.11: Spool "Sent to Site" action - no inventory, just status change
        case 'spool_sent':
          await supabase.from('request_components')
            .update({ status: 'TP_Spool_Sent' })
            .eq('id', component.id);
          await logHistory(component.id, 'Spool Sent to Site', 'Eng', 'TP_Spool_Sent', 'Spool ordered from supplier');
          // Log movement (no qty change, just tracking)
          await supabase.from('movements').insert({
            ident_code: component.ident_code || 'SPOOL',
            movement_type: 'SPOOL_SENT',
            quantity: component.quantity || 1,
            from_location: 'ENGINEERING',
            to_location: 'SITE',
            performed_by: user.full_name,
            note: `Spool ${component.description} sent to site`
          });
          break;
      }
      loadComponents();
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };

  // V32.0: Send Check - supporta Site, Yard, o Both
  // When "Both" is selected, creates parallel sub-requests for Site and Yard
  // Format: XXXXX-LL-SS-PP where LL=component, SS=wh_split (1=Site, 2=Yard), PP=yard_split
  const sendCheck = async () => {
    try {
      if (checkDestination === 'Both') {
        // V32.0: "Send to Both" - Create two parallel sub-requests with 4-level format
        const reqNumber = selectedComponent.requests?.request_number;
        const currentReq = selectedComponent.requests;
        
        if (!reqNumber) {
          alert('Error: Request number not found');
          return;
        }
        
        // Get the component level from the original request
        const componentLevel = currentReq?.level_component || currentReq?.sub_number || 0;
        
        // Create sub-request for WH Site (level_wh_split = 1)
        const siteInsertData = {
          request_number: reqNumber,
          sub_number: componentLevel, // Keep same component level
          level_component: componentLevel,
          level_wh_split: 1, // Site = 1
          level_yard_split: 0,
          request_number_full: formatRequestNumber(reqNumber, componentLevel, 1, 0),
          parent_request_id: currentReq?.id,
          parent_request_number: currentReq?.parent_request_number || reqNumber,
          sent_to: 'WH_Site',
          request_type: currentReq?.request_type,
          sub_category: selectedComponent.sub_category || currentReq?.sub_category, // V32.2: Use component's sub_category first
          iso_number: currentReq?.iso_number,
          full_spool_number: currentReq?.full_spool_number,
          hf_number: currentReq?.hf_number,
          test_pack_number: currentReq?.test_pack_number,
          requester_user_id: currentReq?.requester_user_id,
          created_by_name: currentReq?.created_by_name
        };
        
        const { data: siteReq, error: siteError } = await supabase.from('requests')
          .insert(siteInsertData)
          .select()
          .single();
        
        if (siteError || !siteReq) {
          console.error('Site request insert error:', siteError);
          alert('Error creating Site sub-request: ' + (siteError?.message || 'Unknown error'));
          return;
        }
        
        // Create component for Site sub-request
        const { error: siteCompError } = await supabase.from('request_components').insert({
          request_id: siteReq.id,
          ident_code: selectedComponent.ident_code,
          description: selectedComponent.description,
          tag: selectedComponent.tag,
          dia1: selectedComponent.dia1,
          quantity: selectedComponent.quantity,
          sub_category: selectedComponent.sub_category, // V32.2: Preserve component's sub_category
          status: 'Eng',
          current_location: 'SITE',
          has_eng_check: true,
          eng_check_message: checkMessage,
          eng_check_sent_to: 'WH_Site',
          parent_component_id: selectedComponent.id,
          split_type: 'site'
        });
        
        if (siteCompError) {
          console.error('Site component insert error:', siteCompError);
        }
        
        // Create sub-request for WH Yard (level_wh_split = 2)
        const yardInsertData = {
          request_number: reqNumber,
          sub_number: componentLevel, // Keep same component level
          level_component: componentLevel,
          level_wh_split: 2, // Yard = 2
          level_yard_split: 0,
          request_number_full: formatRequestNumber(reqNumber, componentLevel, 2, 0),
          parent_request_id: currentReq?.id,
          parent_request_number: currentReq?.parent_request_number || reqNumber,
          sent_to: 'Yard',
          request_type: currentReq?.request_type,
          sub_category: selectedComponent.sub_category || currentReq?.sub_category, // V32.2: Use component's sub_category first
          iso_number: currentReq?.iso_number,
          full_spool_number: currentReq?.full_spool_number,
          hf_number: currentReq?.hf_number,
          test_pack_number: currentReq?.test_pack_number,
          requester_user_id: currentReq?.requester_user_id,
          created_by_name: currentReq?.created_by_name
        };
        
        const { data: yardReq, error: yardError } = await supabase.from('requests')
          .insert(yardInsertData)
          .select()
          .single();
        
        if (yardError || !yardReq) {
          console.error('Yard request insert error:', yardError);
          alert('Error creating Yard sub-request: ' + (yardError?.message || 'Unknown error'));
          return;
        }
        
        // Create component for Yard sub-request
        const { error: yardCompError } = await supabase.from('request_components').insert({
          request_id: yardReq.id,
          ident_code: selectedComponent.ident_code,
          description: selectedComponent.description,
          tag: selectedComponent.tag,
          dia1: selectedComponent.dia1,
          quantity: selectedComponent.quantity,
          sub_category: selectedComponent.sub_category, // V32.2: Preserve component's sub_category
          status: 'Eng',
          current_location: 'YARD',
          has_eng_check: true,
          eng_check_message: checkMessage,
          eng_check_sent_to: 'Yard',
          parent_component_id: selectedComponent.id,
          split_type: 'yard'
        });
        
        if (yardCompError) {
          console.error('Yard component insert error:', yardCompError);
        }
        
        // Update original component - mark as parent with "Both" status
        await supabase.from('request_components')
          .update({ 
            has_eng_check: true, 
            eng_check_message: checkMessage,
            eng_check_sent_to: 'Both',
            status: 'Eng_Both'
          })
          .eq('id', selectedComponent.id);
        
        // Update original request with 4-level format and both_status
        await supabase.from('requests')
          .update({ 
            sent_to: 'Both',
            level_wh_split: 0, // Mark as parent (no split)
            both_status: 'waiting_both', // V32.1: Track that we're waiting for both
            site_sent_qty: 0,
            yard_sent_qty: 0
          })
          .eq('id', currentReq?.id);
        
        const siteNum = formatRequestNumber(reqNumber, componentLevel, 1, 0);
        const yardNum = formatRequestNumber(reqNumber, componentLevel, 2, 0);
        await logHistory(selectedComponent.id, `Check sent to Both (Site & Yard)`, 'Eng', 'Eng', 
          `Split: ${siteNum} (Site) + ${yardNum} (Yard)`);
        
      } else {
        // Single destination (WH_Site or Yard) - original behavior
        await supabase.from('request_components')
          .update({ 
            has_eng_check: true, 
            eng_check_message: checkMessage,
            eng_check_sent_to: checkDestination
          })
          .eq('id', selectedComponent.id);
        
        await logHistory(selectedComponent.id, `Check sent to ${checkDestination}`, 'Eng', 'Eng', checkMessage);
      }
      
      setShowCheckModal(false);
      setCheckMessage('');
      setCheckDestination('WH_Site');
      loadComponents();
    } catch (error) {
      alert('Error sending check: ' + error.message);
    }
  };

  // V28: Submit Management Note
  const submitMngNote = async () => {
    await supabase.from('request_components')
      .update({ status: 'Mng', mng_note: mngNote || null })
      .eq('id', selectedComponent.id);
    await logHistory(selectedComponent.id, 'Sent to Management', 'Eng', 'Mng', mngNote || '');
    setShowMngNoteModal(false);
    setMngNote('');
    loadComponents();
  };

  const openHistory = (compId) => {
    setHistoryComponentId(compId);
    setShowHistory(true);
  };

  const canModify = canModifyPage(user, 'engineering');

  // V28: Filter by search
  const filterComponents = (comps) => {
    if (!searchTerm) return comps;
    const term = searchTerm.toLowerCase();
    return comps.filter(c =>
      c.ident_code?.toLowerCase().includes(term) ||
      c.description?.toLowerCase().includes(term) ||
      String(c.requests?.request_number).includes(term)
    );
  };
  const filteredWaiting = filterComponents(waitingForCheck);
  const filteredToProcess = filterComponents(toProcess);

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading...</div>;

  // Helper to render component row
  const renderComponentRow = (comp, section) => {
    // V28.11: Check if this is a Spool item (from TestPack)
    const isSpool = (comp.sub_category === 'Spool' || comp.ident_code === 'SPOOL');
    
    // V28.9: Remove Partial from Engineering actions
    const engActions = [];
    if (section === 'toProcess') {
      if (isSpool) {
        // V28.11: Spool items only have "Sent to Site" action
        engActions.push({ id: 'spool_sent', icon: '🚚', label: 'Sent to Site' });
        engActions.push({ id: 'return', icon: '↩️', label: 'Return' });
        engActions.push({ id: 'delete', icon: '🗑️', label: 'Delete' });
      } else {
        // Regular material actions
        engActions.push({ id: 'check', icon: '🔍', label: 'Send Check' });
        engActions.push({ id: 'spare', icon: '🔧', label: 'Spare Parts' });
        engActions.push({ id: 'mng', icon: '👔', label: 'Management' });
        engActions.push({ id: 'return', icon: '↩️', label: 'Return to Site' });
        engActions.push({ id: 'delete', icon: '🗑️', label: 'Delete' });
      }
    }
    
    const inv = inventoryMap[comp.ident_code] || { site: 0, yard: 0 };
    
    return (
      <tr key={comp.id}>
        <td style={styles.td}>{abbrevCategory(comp.requests?.request_type)}</td>
        <td style={styles.td}>{abbrevSubCategory(comp.sub_category || comp.requests?.sub_category)}</td>
        <td style={{ ...styles.td, fontSize: '11px' }}>{comp.requests?.iso_number || comp.iso_number || '-'}</td>
        <td style={{ ...styles.td, fontSize: '11px' }}>{abbrevSpool(comp.requests?.full_spool_number || comp.full_spool_number)}</td>
        <td style={styles.td}>{comp.requests?.hf_number || '-'}</td>
        <td style={styles.td}>{comp.requests?.test_pack_number || '-'}</td>
        <td style={{ ...styles.td, fontFamily: 'monospace', fontWeight: '600' }}>
          {displayRequestNumber(comp.requests)}
        </td>
        <td style={{ ...styles.td, fontFamily: 'monospace', fontSize: '11px' }}>{comp.ident_code}</td>
        <td style={{ ...styles.td, maxWidth: '150px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={comp.description || ''}>
          {comp.description ? (comp.description.length > 30 ? comp.description.substring(0, 30) + '...' : comp.description) : '-'}
        </td>
        <td style={styles.td}>{comp.quantity}</td>
        {/* V28.9: WH_Site and WH_Yard columns */}
        <td style={{ ...styles.td, textAlign: 'center', fontWeight: '600', color: inv.site > 0 ? COLORS.success : COLORS.primary }}>
          {inv.site}
        </td>
        <td style={{ ...styles.td, textAlign: 'center', fontWeight: '600', color: inv.yard > 0 ? COLORS.success : COLORS.primary }}>
          {inv.yard}
        </td>
        {section === 'waiting' && (
          <td style={styles.td}>
            <span style={{ ...styles.statusBadge, backgroundColor: COLORS.purple }}>
              → {comp.eng_check_sent_to === 'Yard' ? 'WH Yard' : comp.eng_check_sent_to}
            </span>
          </td>
        )}
        {section === 'toProcess' && (
          <td style={styles.td}>
            <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
              <ActionDropdown
                actions={engActions}
                onExecute={(action) => handleAction(comp, action)}
                disabled={!canModify}
                componentId={comp.id}
              />
              <ActionButton color={comp.requests?.description ? COLORS.primary : COLORS.info} onClick={() => openHistory(comp.id)} title="History">ℹ️</ActionButton>
            </div>
          </td>
        )}
      </tr>
    );
  };

  return (
    <div>
      <SearchBox value={searchTerm} onChange={setSearchTerm} placeholder="Search code, description, request..." />

      {/* Section 1: Waiting for Check */}
      <div style={{
        backgroundColor: '#F3E8FF',
        border: '2px solid #A855F7',
        borderRadius: '8px',
        padding: '16px',
        marginBottom: '24px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
          <div>
            <h3 style={{ fontWeight: '600', color: '#7C3AED', marginBottom: '4px' }}>
              🔍 Waiting for Check ({filteredWaiting.length})
            </h3>
            <p style={{ fontSize: '13px', color: '#6b7280' }}>
              Items sent to WH Site/Yard for verification - waiting for response
            </p>
          </div>
          {filteredWaiting.length > 0 && (
            <button
              onClick={() => {
                const printWindow = window.open('', '_blank');
                printWindow.document.write(`
                  <html><head><title>Engineering - Waiting for Check</title>
                  <style>
                    body { font-family: Arial, sans-serif; padding: 20px; }
                    h1 { color: #7C3AED; }
                    table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                    th, td { border: 1px solid #ddd; padding: 6px; text-align: left; font-size: 10px; }
                    th { background-color: #F3E8FF; }
                  </style></head><body>
                  <h1>🔍 Engineering - Waiting for Check</h1>
                  <p>Printed: ${new Date().toLocaleString()} | Total: ${filteredWaiting.length}</p>
                  <table>
                    <tr><th>Cat</th><th>Sub</th><th>ISO</th><th>Spool</th><th>HF</th><th>TP</th><th>Request</th><th>Code</th><th>Description</th><th>Qty</th><th>Sent To</th></tr>
                    ${filteredWaiting.map(comp => `<tr>
                      <td>${abbrevCategory(comp.requests?.request_type)}</td>
                      <td>${abbrevSubCategory(comp.sub_category || comp.requests?.sub_category)}</td>
                      <td>${comp.requests?.iso_number || '-'}</td>
                      <td>${comp.requests?.full_spool_number || '-'}</td>
                      <td>${comp.requests?.hf_number || '-'}</td>
                      <td>${comp.requests?.test_pack_number || '-'}</td>
                      <td>${displayRequestNumber(comp.requests)}</td>
                      <td>${comp.ident_code}</td>
                      <td>${comp.description || '-'}</td>
                      <td>${comp.quantity}</td>
                      <td>${comp.eng_check_sent_to === 'Yard' ? 'WH Yard' : (comp.eng_check_sent_to || '-')}</td>
                    </tr>`).join('')}
                  </table>
                  </body></html>
                `);
                printWindow.document.close();
                printWindow.print();
              }}
              style={{ ...styles.button, backgroundColor: COLORS.purple, color: 'white' }}
            >
              🖨️ Print
            </button>
          )}
        </div>
        {filteredWaiting.length > 0 ? (
          <div style={{ overflowX: 'auto' }}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Cat</th>
                  <th style={styles.th}>Sub</th>
                  <th style={styles.th}>ISO</th>
                  <th style={styles.th}>Spool</th>
                  <th style={styles.th}>HF</th>
                  <th style={styles.th}>TP</th>
                  <th style={styles.th}>Request</th>
                  <th style={styles.th}>Code</th>
                  <th style={styles.th}>Description</th>
                  <th style={styles.th}>Qty</th>
                  <th style={{ ...styles.th, backgroundColor: COLORS.info, color: 'white', textAlign: 'center' }}>WH Site</th>
                  <th style={{ ...styles.th, backgroundColor: COLORS.secondary, color: 'white', textAlign: 'center' }}>WH Yard</th>
                  <th style={styles.th}>Sent To</th>
                </tr>
              </thead>
              <tbody>
                {filteredWaiting.map(comp => renderComponentRow(comp, 'waiting'))}
              </tbody>
            </table>
          </div>
        ) : (
          <p style={{ textAlign: 'center', color: '#9ca3af', padding: '20px' }}>No items waiting for check</p>
        )}
      </div>

      {/* Section 2: To Process */}
      <div style={styles.card}>
        <div style={{ ...styles.cardHeader, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 style={{ fontWeight: '600' }}>📋 To Process ({filteredToProcess.length})</h3>
            <p style={{ fontSize: '13px', color: '#6b7280', marginTop: '4px' }}>
              Items verified by WH - need Engineering decision
            </p>
          </div>
          <button
            onClick={() => {
              const allComps = [...filteredWaiting, ...filteredToProcess];
              const printWindow = window.open('', '_blank');
              printWindow.document.write(`
                <html><head><title>Engineering Components</title>
                <style>
                  body { font-family: Arial, sans-serif; padding: 20px; }
                  h1 { color: #7C3AED; }
                  table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                  th, td { border: 1px solid #ddd; padding: 6px; text-align: left; font-size: 10px; }
                  th { background-color: #F3E8FF; }
                </style></head><body>
                <h1>⚙️ Engineering - All Components</h1>
                <p>Printed: ${new Date().toLocaleString()} | Waiting: ${filteredWaiting.length} | To Process: ${filteredToProcess.length}</p>
                <table>
                  <tr><th>Status</th><th>Cat</th><th>Sub</th><th>ISO</th><th>Spool</th><th>Request</th><th>Code</th><th>Description</th><th>Qty</th></tr>
                  ${allComps.map(comp => `<tr>
                    <td>${comp.has_eng_check ? 'Waiting Check' : 'To Process'}</td>
                    <td>${abbrevCategory(comp.requests?.request_type)}</td>
                    <td>${abbrevSubCategory(comp.sub_category || comp.requests?.sub_category)}</td>
                    <td>${comp.requests?.iso_number || '-'}</td>
                    <td>${comp.requests?.full_spool_number || '-'}</td>
                    <td>${displayRequestNumber(comp.requests)}</td>
                    <td>${comp.ident_code}</td>
                    <td>${comp.description || '-'}</td>
                    <td>${comp.quantity}</td>
                  </tr>`).join('')}
                </table>
                </body></html>
              `);
              printWindow.document.close();
              printWindow.print();
            }}
            style={{ ...styles.button, backgroundColor: COLORS.purple, color: 'white' }}
          >
            🖨️ Print
          </button>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Cat</th>
                <th style={styles.th}>Sub</th>
                <th style={styles.th}>ISO</th>
                <th style={styles.th}>Spool</th>
                <th style={styles.th}>HF</th>
                <th style={styles.th}>TP</th>
                <th style={styles.th}>Request</th>
                <th style={styles.th}>Code</th>
                <th style={styles.th}>Description</th>
                <th style={styles.th}>Qty</th>
                <th style={{ ...styles.th, backgroundColor: COLORS.info, color: 'white', textAlign: 'center' }}>WH Site</th>
                <th style={{ ...styles.th, backgroundColor: COLORS.secondary, color: 'white', textAlign: 'center' }}>WH Yard</th>
                <th style={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredToProcess.map(comp => renderComponentRow(comp, 'toProcess'))}
              {toProcess.length === 0 && (
                <tr>
                  <td colSpan="13" style={{ ...styles.td, textAlign: 'center', color: '#9ca3af' }}>
                    No items to process
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Check Modal - con opzione Both */}
      <Modal isOpen={showCheckModal} onClose={() => setShowCheckModal(false)} title="Send Check Request">
        <div style={{ marginBottom: '16px' }}>
          <label style={styles.label}>Send to</label>
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              <input type="radio" name="checkDest" value="WH_Site" checked={checkDestination === 'WH_Site'} onChange={(e) => setCheckDestination(e.target.value)} />
              WH Site
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              <input type="radio" name="checkDest" value="Yard" checked={checkDestination === 'Yard'} onChange={(e) => setCheckDestination(e.target.value)} />
              WH Yard
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', color: COLORS.teal, fontWeight: '600' }}>
              <input type="radio" name="checkDest" value="Both" checked={checkDestination === 'Both'} onChange={(e) => setCheckDestination(e.target.value)} />
              🔄 BOTH
            </label>
          </div>
        </div>
        <div style={{ marginBottom: '16px' }}>
          <label style={styles.label}>Message / Instructions</label>
          <textarea
            value={checkMessage}
            onChange={(e) => setCheckMessage(e.target.value)}
            style={{ ...styles.input, minHeight: '80px' }}
            placeholder="Check position, quantity, etc..."
          />
        </div>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          <button onClick={() => setShowCheckModal(false)} style={{ ...styles.button, ...styles.buttonSecondary }}>Cancel</button>
          <button onClick={sendCheck} style={{ ...styles.button, backgroundColor: COLORS.purple, color: 'white' }}>Send</button>
        </div>
      </Modal>

      {/* V28: Management Note Modal */}
      <Modal isOpen={showMngNoteModal} onClose={() => setShowMngNoteModal(false)} title="Send to Management">
        <p style={{ marginBottom: '16px' }}><strong>{selectedComponent?.ident_code}</strong> - Qty: {selectedComponent?.quantity}</p>
        <div style={{ marginBottom: '16px' }}>
          <label style={styles.label}>Note for Management (optional)</label>
          <textarea
            value={mngNote}
            onChange={(e) => setMngNote(e.target.value)}
            placeholder="Add a note explaining why this needs management attention..."
            style={{ ...styles.input, minHeight: '100px', resize: 'vertical' }}
          />
        </div>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          <button onClick={() => setShowMngNoteModal(false)} style={{ ...styles.button, ...styles.buttonSecondary }}>Cancel</button>
          <button onClick={submitMngNote} style={{ ...styles.button, backgroundColor: COLORS.yellow, color: 'white' }}>Send to Management</button>
        </div>
      </Modal>

      {/* History Popup */}
      <HistoryPopup
        isOpen={showHistory}
        onClose={() => setShowHistory(false)}
        componentId={historyComponentId}
      />
    </div>
  );
}

// ============================================================
// HF PAGE - Componenti HF raggruppati per request
// ============================================================
function HFPage({ user }) {
  const [hfGroups, setHfGroups] = useState({});
  const [loading, setLoading] = useState(true);
  const [showHistory, setShowHistory] = useState(false);
  const [historyComponentId, setHistoryComponentId] = useState(null);
  const [inventoryMap, setInventoryMap] = useState({});
  const [activeTab, setActiveTab] = useState('materials');
  // V30.0: Enhanced HF Log with counters and list
  const [hfLogStats, setHfLogStats] = useState({ delivered: 0, inProgress: 0 });
  const [hfLogList, setHfLogList] = useState([]);
  const [hfLogSearchTerm, setHfLogSearchTerm] = useState('');

  useEffect(() => { loadComponents(); }, []);

  const loadComponents = async () => {
    setLoading(true);
    
    try {
      // V29.0: Load components for HF monitoring
      // - HF: Components ready in HF queue
      // - Eng: Components still in Engineering (for monitoring)
      // V32.4: Exclude TestPack requests - HF page is only for Piping/Erection
      const { data } = await supabase
        .from('request_components')
        .select(`*, requests (request_number, sub_number, request_type, hf_number, requester_user_id)`)
        .not('requests.hf_number', 'is', null)
        .neq('requests.request_type', 'TestPack')
        .in('status', ['HF', 'Eng']);
      
      if (data) {
        // Get unique ident_codes and load inventory
        const uniqueIdentCodes = [...new Set(data.map(c => c.ident_code).filter(Boolean))];
        if (uniqueIdentCodes.length > 0) {
          const { data: invData } = await supabase
            .from('inventory')
            .select('ident_code, site_qty, yard_qty')
            .in('ident_code', uniqueIdentCodes);
          
          const invMap = {};
          if (invData) {
            invData.forEach(inv => {
              invMap[inv.ident_code] = { site: inv.site_qty || 0, yard: inv.yard_qty || 0 };
            });
          }
          setInventoryMap(invMap);
        }

        // Group by hf_number, then by request_number
        const grouped = {};
        data.forEach(comp => {
          const hfNum = comp.requests?.hf_number;
          if (!hfNum) return;
          
          if (!grouped[hfNum]) {
            grouped[hfNum] = {
              hf_number: hfNum,
              requests: {}
            };
          }
          
          const reqNum = comp.requests?.request_number;
          const subNum = comp.requests?.sub_number || 0;
          const reqKey = `${reqNum}-${subNum}`;
          
          if (!grouped[hfNum].requests[reqKey]) {
            grouped[hfNum].requests[reqKey] = {
              request_number: reqNum,
              sub_number: subNum,
              requester_user_id: comp.requests?.requester_user_id,
              components: []
            };
          }
          
          grouped[hfNum].requests[reqKey].components.push(comp);
        });
        
        setHfGroups(grouped);

        // V30.0: Calculate enhanced HF Log stats
        // V32.5: Exclude TestPack requests from HF Log (they have their own TestPack page)
        const { data: allHFRequests } = await supabase
          .from('requests')
          .select('id, hf_number, created_by_name, request_type')
          .not('hf_number', 'is', null)
          .neq('request_type', 'TestPack');
        
        if (allHFRequests) {
          let stats = { delivered: 0, inProgress: 0 };
          let logList = [];
          
          // Group by hf_number
          const hfRequestGroups = {};
          allHFRequests.forEach(req => {
            if (!hfRequestGroups[req.hf_number]) {
              hfRequestGroups[req.hf_number] = { requests: [], created_by_name: req.created_by_name };
            }
            hfRequestGroups[req.hf_number].requests.push(req);
          });
          
          for (const [hfNum, group] of Object.entries(hfRequestGroups)) {
            // Get all components for this HF
            let allComponents = [];
            for (const req of group.requests) {
              const { data: comps } = await supabase
                .from('request_components')
                .select('status')
                .eq('request_id', req.id);
              if (comps) {
                allComponents = allComponents.concat(comps);
              }
            }
            
            if (allComponents.length > 0) {
              const deliveredStatuses = ['Trans', 'ToCollect', 'Done'];
              const deliveredCount = allComponents.filter(c => deliveredStatuses.includes(c.status)).length;
              const allDelivered = deliveredCount === allComponents.length;
              
              if (allDelivered) {
                stats.delivered++;
                logList.push({
                  hf_number: hfNum,
                  status: 'delivered',
                  total_components: allComponents.length,
                  created_by_name: group.created_by_name || '-'
                });
              } else if (deliveredCount > 0) {
                // Partial - but HF doesn't allow partial, so this shouldn't happen
                stats.inProgress++;
              } else {
                stats.inProgress++;
              }
            }
          }
          
          setHfLogStats(stats);
          setHfLogList(logList);
        }
      }
    } catch (error) {
      console.error('HF load error:', error);
    }
    setLoading(false);
  };

  const logHistory = async (compId, action, fromStatus, toStatus, note) => {
    await supabase.from('component_history').insert({
      component_id: compId,
      action: action,
      from_status: fromStatus,
      to_status: toStatus,
      performed_by_user_id: user.id,
      performed_by_name: user.full_name,
      note: note
    });
  };

  // Check if a component is ready (in HF status with inventory available)
  const isReady = (comp) => {
    if (comp.status === 'Eng') return false;
    if (comp.status === 'HF') {
      const inv = inventoryMap[comp.ident_code] || { site: 0, yard: 0 };
      return (inv.site + inv.yard) >= comp.quantity;
    }
    return false;
  };

  const isInEngineering = (comp) => comp.status === 'Eng';

  // Check if ALL components in an HF group are ready
  const isHFComplete = (hfGroup) => {
    const allComps = Object.values(hfGroup.requests).flatMap(r => r.components);
    return allComps.length > 0 && allComps.every(isReady);
  };

  // Get ready/total counts for an HF group
  const getHFCounts = (hfGroup) => {
    const allComps = Object.values(hfGroup.requests).flatMap(r => r.components);
    const ready = allComps.filter(isReady).length;
    return { ready, total: allComps.length };
  };

  // Deliver entire HF (only when all ready)
  const handleDeliverHF = async (hfNum, hfGroup, destination) => {
    const newStatus = destination === 'toSite' ? 'Trans' : 'ToCollect';
    
    for (const request of Object.values(hfGroup.requests)) {
      for (const comp of request.components) {
        // Decrement inventory
        const inv = inventoryMap[comp.ident_code] || { site: 0, yard: 0 };
        let remaining = comp.quantity;
        
        if (inv.site >= remaining) {
          await supabase.rpc('decrement_site_qty', { p_ident_code: comp.ident_code, p_qty: remaining });
        } else {
          if (inv.site > 0) {
            await supabase.rpc('decrement_site_qty', { p_ident_code: comp.ident_code, p_qty: inv.site });
            remaining -= inv.site;
          }
          if (remaining > 0 && inv.yard >= remaining) {
            await supabase.rpc('decrement_yard_qty', { p_ident_code: comp.ident_code, p_qty: remaining });
          }
        }
        
        // Update status
        await supabase.from('request_components')
          .update({ status: newStatus })
          .eq('id', comp.id);
        
        await logHistory(comp.id, 
          destination === 'toSite' ? 'HF Complete - To Site IN' : 'HF Complete - To Collect',
          'HF', newStatus, 
          `HF ${hfNum} completed`
        );

        // Log movement
        await supabase.from('movements').insert({
          ident_code: comp.ident_code,
          movement_type: 'OUT',
          quantity: comp.quantity,
          from_location: 'HF',
          to_location: destination === 'toSite' ? 'SITE_IN' : 'TO_COLLECT',
          performed_by: user.full_name,
          note: `HF ${hfNum}`
        });
      }
    }
    
    setCompletedCount(prev => prev + 1);
    loadComponents();
  };

  // Handle component-level actions
  const handleComponentAction = async (comp, action) => {
    if (action === 'delete') {
      if (!confirm(`Delete component ${comp.ident_code}?`)) return;
      try {
        await supabase.from('request_components')
          .update({ status: 'Cancelled' })
          .eq('id', comp.id);
        await logHistory(comp.id, 'Deleted from HF', comp.status, 'Cancelled', '');
        loadComponents();
      } catch (error) {
        alert('Error: ' + error.message);
      }
    } else if (action === 'return') {
      try {
        await supabase.from('request_components')
          .update({ status: 'WH_Site' })
          .eq('id', comp.id);
        await logHistory(comp.id, 'Returned from HF to WH Site', comp.status, 'WH_Site', '');
        loadComponents();
      } catch (error) {
        alert('Error: ' + error.message);
      }
    }
  };

  const openHistory = (compId) => {
    setHistoryComponentId(compId);
    setShowHistory(true);
  };

  const canModify = canModifyPage(user, 'hf');

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading...</div>;

  const hfList = Object.values(hfGroups);
  const totalComponents = hfList.reduce((sum, hf) => 
    sum + Object.values(hf.requests).reduce((s, r) => s + r.components.length, 0), 0);

  return (
    <div>
      {/* Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
        <button
          onClick={() => setActiveTab('materials')}
          style={{
            ...styles.button,
            backgroundColor: activeTab === 'materials' ? COLORS.teal : '#e5e7eb',
            color: activeTab === 'materials' ? 'white' : '#374151'
          }}
        >
          📦 Materials ({hfList.length})
        </button>
        <button
          onClick={() => setActiveTab('log')}
          style={{
            ...styles.button,
            backgroundColor: activeTab === 'log' ? COLORS.teal : '#e5e7eb',
            color: activeTab === 'log' ? 'white' : '#374151'
          }}
        >
          📋 Log
        </button>
      </div>

      {activeTab === 'log' ? (
        // V30.0: Enhanced Log Tab with counters and list
        <div style={styles.card}>
          <div style={{ ...styles.cardHeader, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontWeight: '600' }}>📋 HF Completion Log</h3>
            <input
              type="text"
              placeholder="🔍 Search HF#..."
              value={hfLogSearchTerm}
              onChange={(e) => setHfLogSearchTerm(e.target.value)}
              style={{
                padding: '8px 12px',
                borderRadius: '6px',
                border: '1px solid #d1d5db',
                fontSize: '14px',
                width: '200px'
              }}
            />
          </div>
          <div style={{ padding: '20px' }}>
            {/* 2 Counters */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
              <div style={{ 
                padding: '24px', 
                backgroundColor: '#D1FAE5', 
                borderRadius: '8px', 
                textAlign: 'center',
                border: '2px solid #10B981'
              }}>
                <p style={{ fontSize: '32px', fontWeight: '700', color: COLORS.success }}>{hfLogStats.delivered}</p>
                <p style={{ color: COLORS.success, fontWeight: '500' }}>✅ Delivered</p>
              </div>
              <div style={{ 
                padding: '24px', 
                backgroundColor: '#FEF3C7', 
                borderRadius: '8px', 
                textAlign: 'center',
                border: '2px solid #F59E0B'
              }}>
                <p style={{ fontSize: '32px', fontWeight: '700', color: COLORS.warning }}>{hfLogStats.inProgress}</p>
                <p style={{ color: '#92400E', fontWeight: '500' }}>⏳ In Progress</p>
              </div>
            </div>
            
            {/* HF Delivered List */}
            <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '16px' }}>
              <h4 style={{ fontWeight: '600', marginBottom: '12px' }}>📦 Delivered HF ({hfLogList.filter(hf => 
                !hfLogSearchTerm || hf.hf_number?.toLowerCase().includes(hfLogSearchTerm.toLowerCase())
              ).length})</h4>
              <div style={{ overflowX: 'auto' }}>
                <table style={styles.table}>
                  <thead>
                    <tr>
                      <th style={styles.th}>HF#</th>
                      <th style={styles.th}>Status</th>
                      <th style={styles.th}>Components</th>
                      <th style={styles.th}>Requester</th>
                    </tr>
                  </thead>
                  <tbody>
                    {hfLogList
                      .filter(hf => !hfLogSearchTerm || hf.hf_number?.toLowerCase().includes(hfLogSearchTerm.toLowerCase()))
                      .map(hf => (
                        <tr key={hf.hf_number}>
                          <td style={{ ...styles.td, fontWeight: '600', fontFamily: 'monospace' }}>{hf.hf_number}</td>
                          <td style={styles.td}>
                            <span style={{
                              padding: '4px 8px',
                              borderRadius: '4px',
                              fontSize: '11px',
                              fontWeight: '600',
                              backgroundColor: '#D1FAE5',
                              color: '#065F46'
                            }}>
                              ✅ Delivered
                            </span>
                          </td>
                          <td style={styles.td}>{hf.total_components}</td>
                          <td style={{ ...styles.td, fontSize: '12px' }}>{hf.created_by_name}</td>
                        </tr>
                      ))}
                    {hfLogList.filter(hf => 
                      !hfLogSearchTerm || hf.hf_number?.toLowerCase().includes(hfLogSearchTerm.toLowerCase())
                    ).length === 0 && (
                      <tr>
                        <td colSpan="4" style={{ ...styles.td, textAlign: 'center', color: '#9ca3af' }}>
                          No delivered HF found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
            
            <p style={{ marginTop: '16px', color: '#6b7280', fontSize: '13px' }}>
              HF requires ALL components to be ready before delivery (no partial).
            </p>
          </div>
        </div>
      ) : (
        // Materials Tab
        <>
      {hfList.length === 0 ? (
        <div style={{ ...styles.card, padding: '40px', textAlign: 'center', color: '#9ca3af' }}>
          No HF components waiting
        </div>
      ) : (
        hfList.map(hf => {
          const counts = getHFCounts(hf);
          const allReady = isHFComplete(hf);
          
          return (
            <div key={hf.hf_number} style={{
              backgroundColor: '#F0FDFA',
              border: '2px solid #14B8A6',
              borderRadius: '8px',
              padding: '16px',
              marginBottom: '24px'
            }}>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                marginBottom: '16px'
              }}>
                <div>
                  <h3 style={{ fontWeight: '700', color: COLORS.teal, fontSize: '18px' }}>
                    🔩 HF: {hf.hf_number}
                  </h3>
                  <span style={{ color: '#6b7280', fontSize: '13px' }}>
                    {counts.ready}/{counts.total} ready
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  {!allReady && (
                    <span style={{ 
                      padding: '6px 12px', 
                      backgroundColor: '#FEF3C7', 
                      color: '#92400E',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: '500'
                    }}>
                      ⏳ {counts.total - counts.ready} items pending
                    </span>
                  )}
                  {allReady && (
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        onClick={() => handleDeliverHF(hf.hf_number, hf, 'toSite')}
                        disabled={!canModify}
                        style={{ ...styles.button, backgroundColor: COLORS.info, color: 'white' }}
                      >
                        🚚 To Site
                      </button>
                      <button
                        onClick={() => handleDeliverHF(hf.hf_number, hf, 'delivered')}
                        disabled={!canModify}
                        style={{ ...styles.button, backgroundColor: COLORS.success, color: 'white' }}
                      >
                        📦 To Collect
                      </button>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Requests within this HF */}
              {Object.values(hf.requests).map(request => (
                <div key={`${request.request_number}-${request.sub_number}`} style={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #e5e7eb',
                  borderRadius: '6px',
                  marginBottom: '12px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    backgroundColor: allReady ? '#D1FAE5' : '#FEF9C3',
                    padding: '10px 14px',
                    borderBottom: '1px solid #e5e7eb'
                  }}>
                    <span style={{ fontWeight: '600' }}>
                      Request {displayRequestNumber(request)}
                    </span>
                    <span style={{ marginLeft: '12px', color: '#6b7280', fontSize: '13px' }}>
                      ({request.components.filter(isReady).length}/{request.components.length} ready)
                    </span>
                  </div>
                  
                  <table style={{ ...styles.table, margin: 0 }}>
                    <thead>
                      <tr>
                        <th style={styles.th}>Code</th>
                        <th style={styles.th}>Description</th>
                        <th style={styles.th}>Qty</th>
                        <th style={{ ...styles.th, backgroundColor: COLORS.info, color: 'white' }}>WH Site</th>
                        <th style={{ ...styles.th, backgroundColor: COLORS.secondary, color: 'white' }}>WH Yard</th>
                        <th style={styles.th}>Status</th>
                        <th style={styles.th}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {request.components.map(comp => {
                        const inv = inventoryMap[comp.ident_code] || { site: 0, yard: 0 };
                        const compReady = isReady(comp);
                        const compInEng = isInEngineering(comp);
                        const rowBgColor = compReady ? '#F0FDF4' : compInEng ? '#F3E8FF' : '#FEE2E2';
                        
                        return (
                          <tr key={comp.id} style={{ backgroundColor: rowBgColor }}>
                            <td style={{ ...styles.td, fontFamily: 'monospace', fontSize: '11px' }}>{comp.ident_code}</td>
                            <td style={{ ...styles.td, maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {comp.description || '-'}
                            </td>
                            <td style={styles.td}>{comp.quantity}</td>
                            <td style={{ ...styles.td, textAlign: 'center', fontWeight: '600', color: compInEng ? '#9ca3af' : (inv.site >= comp.quantity ? COLORS.success : '#6b7280') }}>
                              {compInEng ? '-' : inv.site}
                            </td>
                            <td style={{ ...styles.td, textAlign: 'center', fontWeight: '600', color: compInEng ? '#9ca3af' : (inv.yard > 0 ? COLORS.secondary : '#6b7280') }}>
                              {compInEng ? '-' : inv.yard}
                            </td>
                            <td style={styles.td}>
                              {compInEng ? (
                                <span style={{ ...styles.statusBadge, backgroundColor: COLORS.purple }}>⏳ In Engineering</span>
                              ) : compReady ? (
                                <span style={{ ...styles.statusBadge, backgroundColor: COLORS.success }}>✅ Ready</span>
                              ) : (
                                <span style={{ ...styles.statusBadge, backgroundColor: COLORS.primary }}>❌ Not Available</span>
                              )}
                            </td>
                            <td style={styles.td}>
                              <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                                <ActionDropdown
                                  actions={[
                                    { id: 'return', icon: '↩️', label: 'Return to WH' },
                                    { id: 'delete', icon: '🗑️', label: 'Delete' }
                                  ]}
                                  onExecute={(action) => handleComponentAction(comp, action)}
                                  disabled={!canModify}
                                  componentId={comp.id}
                                />
                                <ActionButton 
                                  color={COLORS.info} 
                                  onClick={() => openHistory(comp.id)} 
                                  title="History"
                                >
                                  ℹ️
                                </ActionButton>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ))}
            </div>
          );
        })
      )}
      </>
      )}

      <HistoryPopup isOpen={showHistory} onClose={() => setShowHistory(false)} componentId={historyComponentId} />
    </div>
  );
}

// ============================================================
// TESTPACK PAGE - V28.9 with Sub-Category Grouping
// ============================================================
function TestPackPage({ user }) {
  const [testPacks, setTestPacks] = useState({});
  const [loading, setLoading] = useState(true);
  const [showHistory, setShowHistory] = useState(false);
  const [historyComponentId, setHistoryComponentId] = useState(null);
  // V28.11: Inventory map for WH Site/Yard display
  const [inventoryMap, setInventoryMap] = useState({});
  // V28.11: Tab navigation
  const [activeTab, setActiveTab] = useState('materials'); // 'materials' or 'log'
  // V30.0: Enhanced Log data with 6 counters
  const [logStats, setLogStats] = useState({ 
    fullCompleted: 0, fullToCollect: 0, fullCollected: 0,
    partialCompleted: 0, partialToCollect: 0, partialCollected: 0
  });
  const [logSearchTerm, setLogSearchTerm] = useState('');
  const [tpLogList, setTpLogList] = useState([]);
  // V32.4: Selected box filter for TestPack Log
  const [selectedLogBox, setSelectedLogBox] = useState(null);

  useEffect(() => { loadComponents(); }, []);

  const loadComponents = async () => {
    setLoading(true);
    
    try {
      // V29.0: Load components for TestPack monitoring
      // - Eng: Items in Engineering (waiting for check)
      // - TP: Materials ready in TestPack queue
      // - TP_Spool_Sent: Spools sent to site (ready for delivery)
      // Exclude: Trans, ToCollect, Done, Cancelled (already delivered/completed)
      // V32.4: Added hf_number to show in Erection category
      const { data } = await supabase
        .from('request_components')
        .select(`*, requests (request_number, sub_number, sub_category, request_type, test_pack_number, hf_number, requester_user_id, secondary_collector)`)
        .not('requests.test_pack_number', 'is', null)
        .in('status', ['Eng', 'TP', 'TP_Spool_Sent']); // Include Eng for monitoring
      
      if (data) {
        // V28.11: Get unique ident_codes and load inventory
        const uniqueIdentCodes = [...new Set(data.map(c => c.ident_code).filter(Boolean))];
        if (uniqueIdentCodes.length > 0) {
          const { data: invData } = await supabase
            .from('inventory')
            .select('ident_code, site_qty, yard_qty')
            .in('ident_code', uniqueIdentCodes);
          
          const invMap = {};
          if (invData) {
            invData.forEach(inv => {
              invMap[inv.ident_code] = { site: inv.site_qty || 0, yard: inv.yard_qty || 0 };
            });
          }
          setInventoryMap(invMap);
        }

      // Group by test_pack_number, then by request_number, then by sub_category
      const grouped = {};
      data.forEach(comp => {
        const tpNum = comp.requests?.test_pack_number;
        if (!tpNum) return;
        
        if (!grouped[tpNum]) {
          grouped[tpNum] = {
            test_pack_number: tpNum,
            requests: {}
          };
        }
        
        const reqNum = comp.requests?.request_number;
        if (!grouped[tpNum].requests[reqNum]) {
          grouped[tpNum].requests[reqNum] = {
            request_number: reqNum,
            sub_number: comp.requests?.sub_number || 0,
            requester_user_id: comp.requests?.requester_user_id,
            secondary_collector: comp.requests?.secondary_collector,
            subCategories: {}
          };
        }
        
        // V28.11: Use component-level sub_category (set when material was added)
        const subCat = comp.sub_category || comp.requests?.sub_category || 'Other';
        if (!grouped[tpNum].requests[reqNum].subCategories[subCat]) {
          grouped[tpNum].requests[reqNum].subCategories[subCat] = {
            name: subCat,
            hf_number: comp.requests?.hf_number || null, // V32.4: Store HF for Erection
            components: []
          };
        }
        
        // V32.4: Also store hf_number at component level
        comp.hf_number = comp.requests?.hf_number || null;
        grouped[tpNum].requests[reqNum].subCategories[subCat].components.push(comp);
      });
      
      setTestPacks(grouped);
      
      // V30.0: Calculate enhanced Log stats with 6 counters
      // Get all TestPack requests and check their completion status
      const { data: tpRequests } = await supabase
        .from('requests')
        .select('id, request_number, sub_number, test_pack_number, created_by_name, completed_at, delivery_status')
        .not('test_pack_number', 'is', null);
      
      if (tpRequests) {
        let stats = { 
          fullCompleted: 0, fullToCollect: 0, fullCollected: 0,
          partialCompleted: 0, partialToCollect: 0, partialCollected: 0
        };
        let logList = [];
        
        // Group requests by test_pack_number
        const tpGroups = {};
        tpRequests.forEach(req => {
          if (!tpGroups[req.test_pack_number]) {
            tpGroups[req.test_pack_number] = [];
          }
          tpGroups[req.test_pack_number].push(req);
        });
        
        for (const [tpNum, requests] of Object.entries(tpGroups)) {
          // Get all components for this TestPack
          let allComponents = [];
          for (const req of requests) {
            const { data: reqComps } = await supabase
              .from('request_components')
              .select('status, sub_category')
              .eq('request_id', req.id);
            if (reqComps) {
              allComponents = allComponents.concat(reqComps);
            }
          }
          
          if (allComponents.length > 0) {
            const doneCount = allComponents.filter(c => c.status === 'Done').length;
            const toCollectCount = allComponents.filter(c => c.status === 'ToCollect').length;
            const transCount = allComponents.filter(c => c.status === 'Trans').length;
            const deliveredCount = doneCount + toCollectCount + transCount;
            const inProgressCount = allComponents.filter(c => ['TP', 'Eng', 'TP_Spool_Sent'].includes(c.status)).length;
            
            const isFull = deliveredCount === allComponents.length;
            const isPartial = deliveredCount > 0 && deliveredCount < allComponents.length;
            
            // Determine status
            let status = 'inProgress';
            if (isFull) {
              if (doneCount === allComponents.length) {
                status = 'fullCollected';
                stats.fullCollected++;
              } else if (toCollectCount > 0 && doneCount === 0 && transCount === 0) {
                status = 'fullToCollect';
                stats.fullToCollect++;
              } else {
                status = 'fullCompleted';
                stats.fullCompleted++;
              }
            } else if (isPartial) {
              if (doneCount > 0) {
                status = 'partialCollected';
                stats.partialCollected++;
              } else if (toCollectCount > 0) {
                status = 'partialToCollect';
                stats.partialToCollect++;
              } else {
                status = 'partialCompleted';
                stats.partialCompleted++;
              }
            }
            
            // Add to log list if has any delivered items
            if (deliveredCount > 0 || doneCount > 0) {
              // Get unique sub-categories
              const subCats = [...new Set(allComponents.map(c => c.sub_category).filter(Boolean))];
              logList.push({
                test_pack_number: tpNum,
                status,
                total_components: allComponents.length,
                delivered: deliveredCount,
                in_progress: inProgressCount,
                done: doneCount,
                to_collect: toCollectCount,
                sub_categories: subCats.length,
                created_by_name: requests[0]?.created_by_name || '-'
              });
            }
          }
        }
        
        setLogStats(stats);
        setTpLogList(logList.sort((a, b) => b.delivered - a.delivered));
      }
    }
    } catch (error) {
      console.error('TestPack load error:', error);
    }
    setLoading(false);
  };

  const logHistory = async (compId, action, fromStatus, toStatus, note) => {
    await supabase.from('component_history').insert({
      component_id: compId,
      action: action,
      from_status: fromStatus,
      to_status: toStatus,
      performed_by_user_id: user.id,
      performed_by_name: user.full_name,
      note: note
    });
  };

  // V29.0: Check if a component is ready based on status and inventory
  const isReady = (comp) => {
    // Items in Engineering are NOT ready
    if (comp.status === 'Eng') {
      return false;
    }
    // V28.11: Spool items are ready when status = TP_Spool_Sent
    if (comp.sub_category === 'Spool' || comp.ident_code === 'SPOOL') {
      return comp.status === 'TP_Spool_Sent';
    }
    // Regular materials with status='TP': check inventory
    if (comp.status === 'TP') {
      const inv = inventoryMap[comp.ident_code] || { site: 0, yard: 0 };
      const totalAvailable = inv.site + inv.yard;
      return totalAvailable >= comp.quantity;
    }
    return false;
  };
  
  // V29.0: Check if in Engineering
  const isInEngineering = (comp) => comp.status === 'Eng';
  
  // V28.11: Check if partial ready (some but not all qty available)
  const isPartialReady = (comp) => {
    // Items in Engineering are not partial
    if (comp.status === 'Eng') {
      return false;
    }
    // Spools don't have partial - they're either sent or not
    if (comp.sub_category === 'Spool' || comp.ident_code === 'SPOOL') {
      return false;
    }
    // Only check partial for TP status
    if (comp.status === 'TP') {
      const inv = inventoryMap[comp.ident_code] || { site: 0, yard: 0 };
      const totalAvailable = inv.site + inv.yard;
      return totalAvailable > 0 && totalAvailable < comp.quantity;
    }
    return false;
  };
  
  // Check if all components in a sub-category are ready
  const isSubCategoryReady = (subCat) => subCat.components.every(isReady);
  
  // Get ready count for a sub-category
  const getReadyCount = (subCat) => subCat.components.filter(isReady).length;
  
  // V28.11: Get total components count for a request
  const getTotalComponentsCount = (request) => {
    return Object.values(request.subCategories).reduce((sum, subCat) => sum + subCat.components.length, 0);
  };
  
  // V28.11: Get ready components count for a request
  const getReadyComponentsCount = (request) => {
    return Object.values(request.subCategories).reduce((sum, subCat) => sum + getReadyCount(subCat), 0);
  };

  // Deliver a single sub-category
  const handleDeliverSubCategory = async (tpNum, request, subCat, destination) => {
    // V28.11: To Site = Trans (Site IN), Deliver = ToCollect
    const newStatus = destination === 'toSite' ? 'Trans' : 'ToCollect';
    
    // Get all sub-categories for this request
    const allSubCats = Object.values(request.subCategories);
    const otherSubCats = allSubCats.filter(sc => sc.name !== subCat.name);
    
    // Collect ALL components from OTHER sub-categories (they need to move to new sub-request)
    const componentsToMove = [];
    for (const otherSc of otherSubCats) {
      for (const comp of otherSc.components) {
        componentsToMove.push(comp);
      }
    }
    
    // If there are components to move, create a new sub-request for them
    if (componentsToMove.length > 0) {
      try {
        // Get the original request to copy its data
        const firstComp = subCat.components[0];
        const originalRequestId = firstComp.request_id;
        
        // Get original request data
        const { data: originalRequest } = await supabase
          .from('requests')
          .select('*')
          .eq('id', originalRequestId)
          .single();
        
        if (originalRequest) {
          // Find the next available sub_number
          const { data: existingSubs } = await supabase
            .from('requests')
            .select('sub_number')
            .eq('request_number', originalRequest.request_number)
            .order('sub_number', { ascending: false })
            .limit(1);
          
          const nextSubNumber = (existingSubs?.[0]?.sub_number || 0) + 1;
          
          // V30.0: Get parent_request_number - use existing parent or the mother request_number
          const parentReqNumTP = originalRequest.parent_request_number || originalRequest.request_number;
          
          // Create new sub-request
          const { data: newRequest, error: insertError } = await supabase
            .from('requests')
            .insert({
              request_number: originalRequest.request_number,
              sub_number: nextSubNumber,
              parent_request_number: parentReqNumTP, // V30.0: Link to mother request
              requester_user_id: originalRequest.requester_user_id,
              created_by_name: originalRequest.created_by_name, // V30.0: Preserve requester name
              request_type: originalRequest.request_type,
              sub_category: originalRequest.sub_category,
              iso_number: originalRequest.iso_number,
              full_spool_number: originalRequest.full_spool_number,
              hf_number: originalRequest.hf_number,
              test_pack_number: originalRequest.test_pack_number,
              status: 'Open',
              description: `Split from ${originalRequest.request_number}-${originalRequest.sub_number} (partial TP delivery)`
            })
            .select()
            .single();
          
          if (newRequest && !insertError) {
            // Move ALL components from other sub-categories to the new sub-request
            for (const comp of componentsToMove) {
              await supabase
                .from('request_components')
                .update({ request_id: newRequest.id })
                .eq('id', comp.id);
              
              await logHistory(comp.id, 
                'Moved to Sub-Request', 
                comp.status, comp.status, 
                `Moved to ${originalRequest.request_number}-${nextSubNumber} (partial TP delivery)`
              );
            }
            
            console.log(`Created sub-request ${originalRequest.request_number}-${nextSubNumber} with ${componentsToMove.length} components`);
          }
        }
      } catch (error) {
        console.error('Error creating sub-request:', error);
      }
    }
    
    // Now deliver the ready components from this sub-category
    for (const comp of subCat.components) {
      if (!isReady(comp)) continue; // Only deliver ready items
      
      // V28.11: Check if this is a Spool item (no inventory to decrement)
      const isSpool = (comp.sub_category === 'Spool' || comp.ident_code === 'SPOOL');
      
      if (!isSpool) {
        // V28.11: Decrement inventory when delivering (only for non-spool items)
        const inv = inventoryMap[comp.ident_code] || { site: 0, yard: 0 };
        
        // Determine which warehouse to decrement (prefer Site, then Yard)
        let decrementSite = 0;
        let decrementYard = 0;
        let remaining = comp.quantity;
        
        if (inv.site >= remaining) {
          decrementSite = remaining;
        } else {
          decrementSite = inv.site;
          remaining -= inv.site;
          decrementYard = Math.min(inv.yard, remaining);
        }
        
        // Decrement inventory
        if (decrementSite > 0) {
          await supabase.rpc('decrement_site_qty', { p_ident_code: comp.ident_code, p_qty: decrementSite });
        }
        if (decrementYard > 0) {
          await supabase.rpc('decrement_yard_qty', { p_ident_code: comp.ident_code, p_qty: decrementYard });
        }
      }
      
      // Update component status
      await supabase.from('request_components')
        .update({ status: newStatus })
        .eq('id', comp.id);
      
      await logHistory(comp.id, 
        isSpool 
          ? (destination === 'toSite' ? 'TP Spool - To Site IN' : 'TP Spool - To Collect')
          : (destination === 'toSite' ? 'TP SubCat - To Site IN' : 'TP SubCat - To Collect'),
        isSpool ? 'TP_Spool_Sent' : 'TP', newStatus, 
        `TestPack ${tpNum} - ${subCat.name} completed`
      );

      // Log movement
      await supabase.from('movements').insert({
        ident_code: comp.ident_code,
        movement_type: isSpool ? 'SPOOL_DELIVERED' : 'OUT',
        quantity: comp.quantity,
        from_location: 'TP',
        to_location: destination === 'toSite' ? 'SITE_IN' : 'TO_COLLECT',
        performed_by: user.full_name,
        note: `TP ${tpNum} - ${subCat.name}`
      });
    }
    
    // V29.0: Update completed requests counters based on actual component states
    // Check how many sub-categories have been delivered for this request
    const requestId = subCat.components[0]?.request_id;
    if (requestId) {
      // Get all components for this request (including just-delivered ones)
      const { data: allReqComponents } = await supabase
        .from('request_components')
        .select('id, status, sub_category')
        .eq('request_id', requestId);
      
      if (allReqComponents) {
        const deliveredStatuses = ['Trans', 'ToCollect', 'Done'];
        const deliveredCount = allReqComponents.filter(c => deliveredStatuses.includes(c.status)).length;
        const totalCount = allReqComponents.length;
        
        // V30.0: Counters will be recalculated on loadComponents
      }
    }
    
    loadComponents();
  };

  // Deliver all ready items in a request
  const handleDeliverAll = async (tpNum, request, destination) => {
    // V28.11: To Site = Trans (Site IN), Deliver = ToCollect
    const newStatus = destination === 'toSite' ? 'Trans' : 'ToCollect';
    
    for (const subCat of Object.values(request.subCategories)) {
      for (const comp of subCat.components) {
        if (!isReady(comp)) continue;
        
        // V28.11: Check if this is a Spool item (no inventory to decrement)
        const isSpool = (comp.sub_category === 'Spool' || comp.ident_code === 'SPOOL');
        
        if (!isSpool) {
          // V28.11: Decrement inventory when delivering (only for non-spool items)
          const inv = inventoryMap[comp.ident_code] || { site: 0, yard: 0 };
          
          // Determine which warehouse to decrement (prefer Site, then Yard)
          let decrementSite = 0;
          let decrementYard = 0;
          let remaining = comp.quantity;
          
          if (inv.site >= remaining) {
            decrementSite = remaining;
          } else {
            decrementSite = inv.site;
            remaining -= inv.site;
            decrementYard = Math.min(inv.yard, remaining);
          }
          
          // Decrement inventory
          if (decrementSite > 0) {
            await supabase.rpc('decrement_site_qty', { p_ident_code: comp.ident_code, p_qty: decrementSite });
          }
          if (decrementYard > 0) {
            await supabase.rpc('decrement_yard_qty', { p_ident_code: comp.ident_code, p_qty: decrementYard });
          }
        }
        
        // Update component status
        await supabase.from('request_components')
          .update({ status: newStatus })
          .eq('id', comp.id);
        
        await logHistory(comp.id, 
          destination === 'toSite' ? 'TP Complete - To Site IN' : 'TP Complete - To Collect',
          isSpool ? 'TP_Spool_Sent' : 'TP', newStatus, 
          `TestPack ${tpNum} completed`
        );

        // Log movement
        await supabase.from('movements').insert({
          ident_code: comp.ident_code,
          movement_type: isSpool ? 'SPOOL_DELIVERED' : 'OUT',
          quantity: comp.quantity,
          from_location: 'TP',
          to_location: destination === 'toSite' ? 'SITE_IN' : 'TO_COLLECT',
          performed_by: user.full_name,
          note: `TP ${tpNum}`
        });
      }
    }
    
    // V30.0: Counters will be recalculated on loadComponents
    loadComponents();
  };

  // V28.9: Handle component-level actions
  const handleComponentAction = async (comp, action) => {
    if (action === 'delete') {
      if (!confirm(`Delete component ${comp.ident_code}?`)) return;
      try {
        await supabase.from('request_components')
          .update({ status: 'Cancelled' })
          .eq('id', comp.id);
        await logHistory(comp.id, 'Deleted from TestPack', comp.status, 'Cancelled', '');
        loadComponents();
      } catch (error) {
        alert('Error: ' + error.message);
      }
    }
  };

  // V32.4: Delete entire TestPack from Log
  const handleDeleteTestPack = async (tpNumber) => {
    if (!confirm(`Delete entire TestPack "${tpNumber}"? This will cancel all associated requests and components.`)) return;
    
    try {
      // Get all requests with this test_pack_number
      const { data: requests } = await supabase
        .from('requests')
        .select('id')
        .eq('test_pack_number', tpNumber);
      
      if (requests && requests.length > 0) {
        const requestIds = requests.map(r => r.id);
        
        // Cancel all components
        await supabase
          .from('request_components')
          .update({ status: 'Cancelled' })
          .in('request_id', requestIds);
        
        // Cancel all requests
        await supabase
          .from('requests')
          .update({ status: 'Cancelled' })
          .in('id', requestIds);
        
        // Log movement
        await supabase.from('movements').insert({
          ident_code: 'TESTPACK',
          movement_type: 'CANCELLED',
          quantity: requests.length,
          from_location: 'TP_LOG',
          to_location: 'CANCELLED',
          performed_by: user.full_name,
          note: `Deleted TestPack ${tpNumber}`
        });
      }
      
      alert(`TestPack ${tpNumber} deleted successfully`);
      loadComponents();
    } catch (error) {
      alert('Error deleting TestPack: ' + error.message);
    }
  };

  const openHistory = (compId) => {
    setHistoryComponentId(compId);
    setShowHistory(true);
  };

  const canModify = canModifyPage(user, 'testpack');

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading...</div>;

  const tpList = Object.values(testPacks);
  const totalRequests = tpList.reduce((sum, tp) => sum + Object.keys(tp.requests).length, 0);

  // Helper to get status badge
  const getStatusBadge = (comp) => {
    const statusColors = {
      'ToCollect': { bg: COLORS.success, icon: '✅', label: 'Ready' },
      'TP': { bg: COLORS.purple, icon: '📋', label: 'In TP' },
      'WH_Site': { bg: COLORS.info, icon: '🏭', label: 'WH Site' },
      'Yard': { bg: COLORS.secondary, icon: '🏢', label: 'Yard' },
      'Eng': { bg: COLORS.warning, icon: '⚙️', label: 'Eng' },
      'Trans': { bg: COLORS.teal, icon: '🚚', label: 'Transit' }
    };
    const s = statusColors[comp.status] || { bg: '#9CA3AF', icon: '⏳', label: comp.status };
    return (
      <span style={{ ...styles.statusBadge, backgroundColor: s.bg }}>
        {s.icon} {s.label}
      </span>
    );
  };

  return (
    <div>
      <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '12px' }}>
            📋 TestPack Materials
            <span style={{ fontSize: '14px', fontWeight: 'normal', color: '#6b7280' }}>
              ({tpList.length} TestPacks, {totalRequests} requests)
            </span>
          </h2>
          <p style={{ color: '#6b7280', fontSize: '14px', marginTop: '4px' }}>
            Deliver by sub-category when all items are ready (✅)
          </p>
        </div>
        <button
          onClick={() => {
            const printWindow = window.open('', '_blank');
            printWindow.document.write(`
              <html><head><title>TestPack Materials</title>
              <style>
                body { font-family: Arial, sans-serif; padding: 20px; }
                h1, h2 { color: #7C3AED; }
                table { width: 100%; border-collapse: collapse; margin: 10px 0; }
                th, td { border: 1px solid #ddd; padding: 6px; text-align: left; font-size: 10px; }
                th { background-color: #F3E8FF; }
                .ready { color: #16a34a; font-weight: bold; }
                .waiting { color: #d97706; }
              </style></head><body>
              <h1>📋 TestPack Materials</h1>
              <p>Printed: ${new Date().toLocaleString()}</p>
              ${tpList.map(tp => `
                <h2>TestPack: ${tp.test_pack_number}</h2>
                ${Object.values(tp.requests).map(req => `
                  <h3>Request ${displayRequestNumber(req)}</h3>
                  ${Object.values(req.subCategories).map(subCat => `
                    <p><strong>${subCat.name}</strong> (${getReadyCount(subCat)}/${subCat.components.length} ready)</p>
                    <table>
                      <tr><th>Code</th><th>Description</th><th>Qty</th><th>WH Site</th><th>WH Yard</th><th>Status</th></tr>
                      ${subCat.components.map(c => {
                        const inv = inventoryMap[c.ident_code] || { site: 0, yard: 0 };
                        return `<tr>
                        <td>${c.ident_code}</td>
                        <td>${c.description || '-'}</td>
                        <td>${c.quantity}</td>
                        <td>${inv.site}</td>
                        <td>${inv.yard}</td>
                        <td class="${isReady(c) ? 'ready' : 'waiting'}">${isReady(c) ? 'Ready' : 'Pending'}</td>
                      </tr>`}).join('')}
                    </table>
                  `).join('')}
                `).join('')}
              `).join('')}
              </body></html>
            `);
            printWindow.document.close();
            printWindow.print();
          }}
          style={{ ...styles.button, backgroundColor: COLORS.purple, color: 'white' }}
        >
          🖨️ Print
        </button>
      </div>

      {/* V28.11: Tab Navigation */}
      <div style={{ display: 'flex', gap: '4px', marginBottom: '16px' }}>
        <button
          onClick={() => setActiveTab('materials')}
          style={{
            ...styles.button,
            backgroundColor: activeTab === 'materials' ? COLORS.purple : '#f3f4f6',
            color: activeTab === 'materials' ? 'white' : '#374151',
            borderRadius: '8px 8px 0 0'
          }}
        >
          📦 Materials ({totalRequests})
        </button>
        <button
          onClick={() => setActiveTab('log')}
          style={{
            ...styles.button,
            backgroundColor: activeTab === 'log' ? COLORS.purple : '#f3f4f6',
            color: activeTab === 'log' ? 'white' : '#374151',
            borderRadius: '8px 8px 0 0'
          }}
        >
          📋 Log
        </button>
      </div>

      {activeTab === 'log' ? (
        <div style={styles.card}>
          <div style={{ ...styles.cardHeader, backgroundColor: '#F3E8FF', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontWeight: '600' }}>📋 TestPack Log</h3>
            <input
              type="text"
              placeholder="🔍 Search TP#..."
              value={logSearchTerm}
              onChange={(e) => setLogSearchTerm(e.target.value)}
              style={{
                padding: '8px 12px',
                borderRadius: '6px',
                border: '1px solid #d1d5db',
                fontSize: '14px',
                width: '200px'
              }}
            />
          </div>
          <div style={{ padding: '16px' }}>
            {/* V30.0: 6 Counters in 2 rows - V32.4: Clickable boxes */}
            <div style={{ marginBottom: '16px' }}>
              <p style={{ fontWeight: '600', color: '#374151', marginBottom: '12px' }}>✅ Fully Completed TestPacks</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                <div 
                  onClick={() => setSelectedLogBox(selectedLogBox === 'fullCompleted' ? null : 'fullCompleted')}
                  style={{ 
                    padding: '16px', 
                    backgroundColor: '#D1FAE5', 
                    borderRadius: '8px', 
                    textAlign: 'center', 
                    border: selectedLogBox === 'fullCompleted' ? '3px solid #047857' : '2px solid #10B981',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    transform: selectedLogBox === 'fullCompleted' ? 'scale(1.02)' : 'scale(1)'
                  }}
                >
                  <div style={{ fontSize: '28px', fontWeight: '700', color: COLORS.success }}>{logStats.fullCompleted}</div>
                  <div style={{ color: '#065F46', fontWeight: '500', fontSize: '12px' }}>✅ Completed</div>
                </div>
                <div 
                  onClick={() => setSelectedLogBox(selectedLogBox === 'fullToCollect' ? null : 'fullToCollect')}
                  style={{ 
                    padding: '16px', 
                    backgroundColor: '#DBEAFE', 
                    borderRadius: '8px', 
                    textAlign: 'center', 
                    border: selectedLogBox === 'fullToCollect' ? '3px solid #1D4ED8' : '2px solid #3B82F6',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    transform: selectedLogBox === 'fullToCollect' ? 'scale(1.02)' : 'scale(1)'
                  }}
                >
                  <div style={{ fontSize: '28px', fontWeight: '700', color: COLORS.info }}>{logStats.fullToCollect}</div>
                  <div style={{ color: '#1E40AF', fontWeight: '500', fontSize: '12px' }}>⏳ To Collect</div>
                </div>
                <div 
                  onClick={() => setSelectedLogBox(selectedLogBox === 'fullCollected' ? null : 'fullCollected')}
                  style={{ 
                    padding: '16px', 
                    backgroundColor: '#FEF3C7', 
                    borderRadius: '8px', 
                    textAlign: 'center', 
                    border: selectedLogBox === 'fullCollected' ? '3px solid #92400E' : '2px solid #F59E0B',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    transform: selectedLogBox === 'fullCollected' ? 'scale(1.02)' : 'scale(1)'
                  }}
                >
                  <div style={{ fontSize: '28px', fontWeight: '700', color: '#B45309' }}>{logStats.fullCollected}</div>
                  <div style={{ color: '#92400E', fontWeight: '500', fontSize: '12px' }}>📦 Collected</div>
                </div>
              </div>
            </div>
            
            <div style={{ marginBottom: '24px' }}>
              <p style={{ fontWeight: '600', color: '#374151', marginBottom: '12px' }}>⚠️ Partially Completed TestPacks</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                <div 
                  onClick={() => setSelectedLogBox(selectedLogBox === 'partialCompleted' ? null : 'partialCompleted')}
                  style={{ 
                    padding: '16px', 
                    backgroundColor: '#FEF3C7', 
                    borderRadius: '8px', 
                    textAlign: 'center', 
                    border: selectedLogBox === 'partialCompleted' ? '3px solid #B45309' : '2px solid #F59E0B',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    transform: selectedLogBox === 'partialCompleted' ? 'scale(1.02)' : 'scale(1)'
                  }}
                >
                  <div style={{ fontSize: '28px', fontWeight: '700', color: COLORS.warning }}>{logStats.partialCompleted}</div>
                  <div style={{ color: '#92400E', fontWeight: '500', fontSize: '12px' }}>⚠️ Part Done</div>
                </div>
                <div 
                  onClick={() => setSelectedLogBox(selectedLogBox === 'partialToCollect' ? null : 'partialToCollect')}
                  style={{ 
                    padding: '16px', 
                    backgroundColor: '#FEF3C7', 
                    borderRadius: '8px', 
                    textAlign: 'center', 
                    border: selectedLogBox === 'partialToCollect' ? '3px solid #B45309' : '2px solid #D97706',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    transform: selectedLogBox === 'partialToCollect' ? 'scale(1.02)' : 'scale(1)'
                  }}
                >
                  <div style={{ fontSize: '28px', fontWeight: '700', color: '#B45309' }}>{logStats.partialToCollect}</div>
                  <div style={{ color: '#92400E', fontWeight: '500', fontSize: '12px' }}>⏳ To Collect</div>
                </div>
                <div 
                  onClick={() => setSelectedLogBox(selectedLogBox === 'partialCollected' ? null : 'partialCollected')}
                  style={{ 
                    padding: '16px', 
                    backgroundColor: '#FEF3C7', 
                    borderRadius: '8px', 
                    textAlign: 'center', 
                    border: selectedLogBox === 'partialCollected' ? '3px solid #B45309' : '2px solid #92400E',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    transform: selectedLogBox === 'partialCollected' ? 'scale(1.02)' : 'scale(1)'
                  }}
                >
                  <div style={{ fontSize: '28px', fontWeight: '700', color: '#78350F' }}>{logStats.partialCollected}</div>
                  <div style={{ color: '#92400E', fontWeight: '500', fontSize: '12px' }}>📦 Collected</div>
                </div>
              </div>
            </div>
            
            {/* V30.0: Detailed TestPack List - V32.4: Filtered by selected box */}
            {selectedLogBox && (
              <div style={{ 
                marginBottom: '16px', 
                padding: '12px', 
                backgroundColor: '#F0F9FF', 
                borderRadius: '8px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <span style={{ fontWeight: '500', color: '#0369A1' }}>
                  🔍 Showing: {selectedLogBox === 'fullCompleted' ? 'Fully Completed' :
                             selectedLogBox === 'fullToCollect' ? 'Full - To Collect' :
                             selectedLogBox === 'fullCollected' ? 'Full - Collected' :
                             selectedLogBox === 'partialCompleted' ? 'Partial Done' :
                             selectedLogBox === 'partialToCollect' ? 'Partial - To Collect' : 'Partial - Collected'}
                </span>
                <button
                  onClick={() => setSelectedLogBox(null)}
                  style={{ ...styles.button, backgroundColor: '#6B7280', color: 'white', fontSize: '12px', padding: '4px 12px' }}
                >
                  ✕ Clear Filter
                </button>
              </div>
            )}
            <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '16px' }}>
              <h4 style={{ fontWeight: '600', marginBottom: '12px' }}>📜 TestPack Details ({tpLogList.filter(tp => 
                (!logSearchTerm || tp.test_pack_number?.toLowerCase().includes(logSearchTerm.toLowerCase())) &&
                (!selectedLogBox || tp.status === selectedLogBox)
              ).length})</h4>
              <div style={{ overflowX: 'auto' }}>
                <table style={styles.table}>
                  <thead>
                    <tr>
                      <th style={styles.th}>TP#</th>
                      <th style={styles.th}>Status</th>
                      <th style={styles.th}>Progress</th>
                      <th style={styles.th}>To Collect</th>
                      <th style={styles.th}>Collected</th>
                      <th style={styles.th}>Sub-Cats</th>
                      <th style={styles.th}>Requester</th>
                      <th style={styles.th}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tpLogList
                      .filter(tp => 
                        (!logSearchTerm || tp.test_pack_number?.toLowerCase().includes(logSearchTerm.toLowerCase())) &&
                        (!selectedLogBox || tp.status === selectedLogBox)
                      )
                      .map(tp => (
                        <tr key={tp.test_pack_number}>
                          <td style={{ ...styles.td, fontWeight: '600', fontFamily: 'monospace' }}>{tp.test_pack_number}</td>
                          <td style={styles.td}>
                            <span style={{
                              padding: '4px 8px',
                              borderRadius: '4px',
                              fontSize: '11px',
                              fontWeight: '600',
                              backgroundColor: tp.status.includes('full') 
                                ? (tp.status === 'fullCollected' ? '#FEF3C7' : '#D1FAE5')
                                : '#FEF3C7',
                              color: tp.status.includes('full')
                                ? (tp.status === 'fullCollected' ? '#92400E' : '#065F46')
                                : '#92400E'
                            }}>
                              {tp.status === 'fullCompleted' ? '✅ Full' : 
                               tp.status === 'fullToCollect' ? '⏳ Full TC' :
                               tp.status === 'fullCollected' ? '📦 Full Done' :
                               tp.status === 'partialCompleted' ? '⚠️ Part Done' :
                               tp.status === 'partialToCollect' ? '⏳ Part TC' : '📦 Part Done'}
                            </span>
                          </td>
                          <td style={styles.td}>{tp.delivered}/{tp.total_components}</td>
                          <td style={styles.td}>{tp.to_collect}</td>
                          <td style={{ ...styles.td, color: tp.done > 0 ? '#B45309' : 'inherit', fontWeight: tp.done > 0 ? '600' : 'normal' }}>{tp.done}</td>
                          <td style={styles.td}>{tp.sub_categories}</td>
                          <td style={{ ...styles.td, fontSize: '12px' }}>{tp.created_by_name}</td>
                          <td style={styles.td}>
                            <button
                              onClick={() => handleDeleteTestPack(tp.test_pack_number)}
                              disabled={!canModify}
                              style={{ 
                                ...styles.button, 
                                backgroundColor: COLORS.primary, 
                                color: 'white', 
                                fontSize: '11px', 
                                padding: '4px 8px',
                                opacity: canModify ? 1 : 0.5
                              }}
                              title="Delete TestPack"
                            >
                              🗑️ Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    {tpLogList.filter(tp => 
                      (!logSearchTerm || tp.test_pack_number?.toLowerCase().includes(logSearchTerm.toLowerCase())) &&
                      (!selectedLogBox || tp.status === selectedLogBox)
                    ).length === 0 && (
                      <tr>
                        <td colSpan="8" style={{ ...styles.td, textAlign: 'center', color: '#9ca3af' }}>
                          {selectedLogBox ? 'No TestPacks match the selected filter' : 'No TestPacks with deliveries found'}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      ) : (
      <>
      {tpList.length === 0 ? (
        <div style={{ ...styles.card, padding: '40px', textAlign: 'center', color: '#9ca3af' }}>
          No TestPack components
        </div>
      ) : (
        tpList.map(tp => (
          <div key={tp.test_pack_number} style={{ marginBottom: '24px' }}>
            {/* TestPack Header */}
            <div style={{
              backgroundColor: '#F3E8FF',
              border: '2px solid ' + COLORS.purple,
              borderRadius: '8px 8px 0 0',
              padding: '12px 16px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <span style={{ fontWeight: '700', fontSize: '18px', color: COLORS.purple }}>
                📋 TestPack: {tp.test_pack_number}
              </span>
            </div>

            {/* Requests within this TestPack */}
            {Object.values(tp.requests).map(request => {
              const allSubCats = Object.values(request.subCategories);
              const allComponents = allSubCats.flatMap(sc => sc.components);
              const allReady = allComponents.every(isReady);
              const readyCount = allComponents.filter(isReady).length;
              
              return (
                <div key={request.request_number} style={{ 
                  ...styles.card, 
                  marginTop: '-1px',
                  borderRadius: '0 0 8px 8px',
                  border: '1px solid #e5e7eb'
                }}>
                  {/* Request Header */}
                  <div style={{ 
                    ...styles.cardHeader, 
                    backgroundColor: allReady ? '#D1FAE5' : '#FEF3C7',
                    borderBottom: `2px solid ${allReady ? COLORS.success : COLORS.warning}`,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <div>
                      <span style={{ fontWeight: '600' }}>
                        Request {displayRequestNumber(request)}
                      </span>
                      <span style={{ marginLeft: '12px', color: '#6b7280', fontSize: '13px' }}>
                        {readyCount}/{allComponents.length} ready
                      </span>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      {allReady ? (
                        <>
                          <button
                            onClick={() => handleDeliverAll(tp.test_pack_number, request, 'toSite')}
                            disabled={!canModify}
                            style={{ ...styles.button, backgroundColor: COLORS.info, color: 'white', fontSize: '12px' }}
                          >
                            🚚 All to Site
                          </button>
                          <button
                            onClick={() => handleDeliverAll(tp.test_pack_number, request, 'delivered')}
                            disabled={!canModify}
                            style={{ ...styles.button, backgroundColor: COLORS.success, color: 'white', fontSize: '12px' }}
                          >
                            ✅ Deliver All
                          </button>
                        </>
                      ) : (
                        <span style={{ 
                          padding: '6px 12px', 
                          backgroundColor: '#FEF3C7', 
                          color: '#92400E',
                          borderRadius: '4px',
                          fontSize: '12px'
                        }}>
                          ⏳ {allComponents.length - readyCount} items pending
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Sub-Categories */}
                  <div style={{ padding: '16px' }}>
                    {allSubCats.map(subCat => {
                      const subReady = isSubCategoryReady(subCat);
                      const subReadyCount = getReadyCount(subCat);
                      // V28.11: Check if this is the Spool sub-category
                      const isSpoolCategory = subCat.name === 'Spool';
                      
                      return (
                        <div key={subCat.name} style={{ 
                          marginBottom: '16px',
                          border: isSpoolCategory ? '2px solid #7C3AED' : '1px solid #e5e7eb',
                          borderRadius: '6px',
                          overflow: 'hidden'
                        }}>
                          {/* Sub-Category Header */}
                          <div style={{
                            backgroundColor: isSpoolCategory 
                              ? (subReady ? '#F3E8FF' : '#FDF4FF') 
                              : (subReady ? '#DCFCE7' : '#FEF9C3'),
                            padding: '10px 14px',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            borderBottom: '1px solid #e5e7eb'
                          }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                              <span style={{ fontWeight: '600' }}>
                                {isSpoolCategory ? '◎' : (subReady ? '🟢' : '🟡')} {subCat.name}
                                {/* V32.4: Show HF number for Erection category */}
                                {subCat.name === 'Erection' && subCat.hf_number && (
                                  <span style={{ 
                                    marginLeft: '8px', 
                                    padding: '2px 8px', 
                                    backgroundColor: '#EC4899', 
                                    color: 'white', 
                                    borderRadius: '4px', 
                                    fontSize: '11px',
                                    fontFamily: 'monospace'
                                  }}>
                                    {subCat.hf_number}
                                  </span>
                                )}
                              </span>
                              <span style={{ 
                                fontSize: '12px', 
                                color: isSpoolCategory ? COLORS.purple : (subReady ? COLORS.success : '#92400E'),
                                fontWeight: '500'
                              }}>
                                ({subReadyCount}/{subCat.components.length} ready)
                              </span>
                            </div>
                            {subReady && (
                              <div style={{ display: 'flex', gap: '6px' }}>
                                <button
                                  onClick={() => handleDeliverSubCategory(tp.test_pack_number, request, subCat, 'toSite')}
                                  disabled={!canModify}
                                  style={{ ...styles.button, backgroundColor: COLORS.info, color: 'white', fontSize: '11px', padding: '4px 8px' }}
                                >
                                  🚚 To Site
                                </button>
                                <button
                                  onClick={() => handleDeliverSubCategory(tp.test_pack_number, request, subCat, 'delivered')}
                                  disabled={!canModify}
                                  style={{ ...styles.button, backgroundColor: COLORS.success, color: 'white', fontSize: '11px', padding: '4px 8px' }}
                                >
                                  ✅ Deliver
                                </button>
                              </div>
                            )}
                          </div>
                          
                          {/* Components Table */}
                          <table style={{ ...styles.table, margin: 0 }}>
                            <thead>
                              <tr>
                                <th style={styles.th}>Code</th>
                                <th style={styles.th}>Description</th>
                                <th style={styles.th}>Qty</th>
                                {/* V32.4: Show HF column only for Erection category */}
                                {subCat.name === 'Erection' && <th style={styles.th}>HF</th>}
                                <th style={{ ...styles.th, backgroundColor: COLORS.info, color: 'white' }}>WH Site</th>
                                <th style={{ ...styles.th, backgroundColor: COLORS.secondary, color: 'white' }}>WH Yard</th>
                                <th style={styles.th}>Status</th>
                                <th style={styles.th}>Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {subCat.components.map(comp => {
                                const inv = inventoryMap[comp.ident_code] || { site: 0, yard: 0 };
                                const totalAvail = inv.site + inv.yard;
                                const compReady = isReady(comp);
                                const compPartial = isPartialReady(comp);
                                const compInEng = isInEngineering(comp);
                                // V28.11: Check if this is a Spool item
                                const isSpool = (comp.sub_category === 'Spool' || comp.ident_code === 'SPOOL');
                                
                                // V29.0: Row background color
                                const rowBgColor = compReady ? '#F0FDF4' : compInEng ? '#F3E8FF' : compPartial ? '#FFFBEB' : '#FEE2E2';
                                
                                return (
                                <tr key={comp.id} style={{ backgroundColor: rowBgColor }}>
                                  <td style={{ ...styles.td, fontFamily: 'monospace', fontSize: '11px' }}>
                                    {isSpool ? '◎ SPOOL' : comp.ident_code}
                                  </td>
                                  <td style={{ ...styles.td, maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                    {comp.description || '-'}
                                  </td>
                                  <td style={styles.td}>{comp.quantity}</td>
                                  {/* V32.4: Show HF cell only for Erection category */}
                                  {subCat.name === 'Erection' && (
                                    <td style={{ ...styles.td, fontFamily: 'monospace', fontSize: '11px', color: COLORS.primary }}>
                                      {comp.requests?.hf_number || '-'}
                                    </td>
                                  )}
                                  <td style={{ ...styles.td, textAlign: 'center', fontWeight: '600', color: isSpool ? '#9ca3af' : (compInEng ? '#9ca3af' : (inv.site >= comp.quantity ? COLORS.success : '#6b7280')) }}>
                                    {isSpool ? '-' : (compInEng ? '-' : inv.site)}
                                  </td>
                                  <td style={{ ...styles.td, textAlign: 'center', fontWeight: '600', color: isSpool ? '#9ca3af' : (compInEng ? '#9ca3af' : (inv.yard > 0 ? COLORS.secondary : '#6b7280')) }}>
                                    {isSpool ? '-' : (compInEng ? '-' : inv.yard)}
                                  </td>
                                  <td style={styles.td}>
                                    {compInEng ? (
                                      <span style={{ ...styles.statusBadge, backgroundColor: COLORS.purple }}>⏳ In Engineering</span>
                                    ) : isSpool ? (
                                      compReady ? (
                                        <span style={{ ...styles.statusBadge, backgroundColor: COLORS.success }}>✅ Sent to Site</span>
                                      ) : (
                                        <span style={{ ...styles.statusBadge, backgroundColor: COLORS.purple }}>⏳ In Engineering</span>
                                      )
                                    ) : compReady ? (
                                      <span style={{ ...styles.statusBadge, backgroundColor: COLORS.success }}>✅ Ready</span>
                                    ) : compPartial ? (
                                      <span style={{ ...styles.statusBadge, backgroundColor: COLORS.warning }}>⚠️ Partial ({totalAvail}/{comp.quantity})</span>
                                    ) : (
                                      <span style={{ ...styles.statusBadge, backgroundColor: COLORS.primary }}>❌ Not Available</span>
                                    )}
                                  </td>
                                  <td style={styles.td}>
                                    <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                                      <ActionDropdown
                                        actions={[
                                          { id: 'delete', icon: '🗑️', label: 'Delete' }
                                        ]}
                                        onExecute={(action) => handleComponentAction(comp, action)}
                                        disabled={!canModify}
                                        componentId={comp.id}
                                      />
                                      <ActionButton 
                                        color={COLORS.info} 
                                        onClick={() => openHistory(comp.id)} 
                                        title="History"
                                      >
                                        ℹ️
                                      </ActionButton>
                                    </div>
                                  </td>
                                </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        ))
      )}
      </>
      )}

      <HistoryPopup isOpen={showHistory} onClose={() => setShowHistory(false)} componentId={historyComponentId} />
    </div>
  );
}

// ============================================================
// TO BE COLLECTED PAGE - V28.5 with actions dropdown
// ============================================================
function ToBeCollectedPage({ user }) {
  const [components, setComponents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showHistory, setShowHistory] = useState(false);
  const [historyComponentId, setHistoryComponentId] = useState(null);
  const [showCollectModal, setShowCollectModal] = useState(false);
  const [selectedComponent, setSelectedComponent] = useState(null);
  const [collectorName, setCollectorName] = useState('');
  const [allUsers, setAllUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  // V29.0: Label print modal
  const [showLabelModal, setShowLabelModal] = useState(false);
  const [selectedForLabel, setSelectedForLabel] = useState(null);

  useEffect(() => { loadComponents(); loadUsers(); }, []);

  const loadComponents = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('request_components')
      .select(`*, requests (request_number, sub_number, request_number_full, level_component, level_wh_split, level_yard_split, requester_user_id, request_type, sub_category, iso_number, full_spool_number, hf_number, test_pack_number, created_by_name)`)
      .eq('status', 'ToCollect');
    
    // V29.0: Enrich with requester names for old requests
    if (data) {
      const userIdsToLookup = [...new Set(
        data.filter(r => r.requests?.requester_user_id && !r.requests?.created_by_name)
            .map(r => r.requests.requester_user_id)
      )];
      let userNameMap = {};
      if (userIdsToLookup.length > 0) {
        const { data: usersData } = await supabase.from('users').select('id, full_name').in('id', userIdsToLookup);
        if (usersData) userNameMap = Object.fromEntries(usersData.map(u => [u.id, u.full_name]));
      }
      const enriched = data.map(r => ({
        ...r,
        requests: r.requests ? { ...r.requests, created_by_name: r.requests.created_by_name || userNameMap[r.requests.requester_user_id] || null } : null
      }));
      setComponents(enriched);
    }
    setLoading(false);
  };

  const loadUsers = async () => {
    const { data } = await supabase.from('users').select('id, full_name').eq('is_active', true).order('full_name');
    if (data) setAllUsers(data);
  };

  const logHistory = async (compId, action, fromStatus, toStatus, note) => {
    await supabase.from('component_history').insert({
      component_id: compId,
      action: action,
      from_status: fromStatus,
      to_status: toStatus,
      performed_by_user_id: user.id,
      performed_by_name: user.full_name,
      note: note
    });
  };

  const openCollectModal = (comp) => {
    setSelectedComponent(comp);
    setCollectorName('');
    setFilteredUsers([]);
    setShowCollectModal(true);
  };

  const handleCollectorSearch = (value) => {
    setCollectorName(value);
    if (value.length >= 2) {
      const filtered = allUsers.filter(u => 
        u.full_name.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredUsers(filtered);
    } else {
      setFilteredUsers([]);
    }
  };

  const selectCollector = (userName) => {
    setCollectorName(userName);
    setFilteredUsers([]);
  };

  const handleDeliver = async () => {
    if (!collectorName.trim()) {
      alert('Please enter the collector name');
      return;
    }

    try {
      // V28.5: Save previous_status
      await supabase.from('request_components')
        .update({ 
          status: 'Done', 
          previous_status: 'ToCollect',
          collected_by: collectorName.trim() 
        })
        .eq('id', selectedComponent.id);
      
      // Decrement site inventory
      await supabase.rpc('decrement_site_qty', { 
        p_ident_code: selectedComponent.ident_code, 
        p_qty: selectedComponent.quantity 
      });

      // Update record_out using RPC
      await supabase.rpc('increment_record_out', { 
        p_ident_code: selectedComponent.ident_code, 
        p_qty: selectedComponent.quantity 
      });

      await logHistory(selectedComponent.id, 'Material Collected', 'ToCollect', 'Done', 
        `Collected by: ${collectorName.trim()}`);

      await supabase.from('movements').insert({
        ident_code: selectedComponent.ident_code,
        movement_type: 'OUT',
        quantity: selectedComponent.quantity,
        from_location: 'SITE',
        to_location: 'DELIVERED',
        performed_by: user.full_name,
        note: `Request ${selectedComponent.requests?.request_number}-${selectedComponent.requests?.sub_number} - Collector: ${collectorName.trim()}`
      });

      setShowCollectModal(false);
      loadComponents();
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };

  // V28.5: Delete action
  const handleDelete = async (comp) => {
    if (!confirm(`Delete request ${displayRequestNumber(comp.requests)}?`)) return;
    
    try {
      await supabase.from('request_components')
        .update({ status: 'Cancelled', previous_status: 'ToCollect' })
        .eq('id', comp.id);
      
      await logHistory(comp.id, 'Request Deleted', 'ToCollect', 'Cancelled', 'Deleted from To Collect');
      
      loadComponents();
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };

  // V28.5: Return action - go back to previous_status
  const handleReturn = async (comp) => {
    const prevStatus = comp.previous_status || 'WH_Site';
    
    try {
      await supabase.from('request_components')
        .update({ 
          status: prevStatus,
          previous_status: 'ToCollect'
        })
        .eq('id', comp.id);
      
      await logHistory(comp.id, 'Returned from ToCollect', 'ToCollect', prevStatus, `Returned to ${prevStatus}`);
      
      loadComponents();
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };

  const openHistory = (compId) => {
    setHistoryComponentId(compId);
    setShowHistory(true);
  };

  const canModify = canModifyPage(user, 'to_be_collected');

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading...</div>;

  return (
    <div>
      <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold' }}>✅ To Collect</h2>
          <p style={{ color: '#6b7280', fontSize: '14px', marginTop: '4px' }}>
            Material ready for pickup - Enter collector name when collecting
          </p>
        </div>
        {components.length > 0 && (
          <button
            onClick={() => {
              const printWindow = window.open('', '_blank');
              printWindow.document.write(`
                <html><head><title>To Collect</title>
                <style>
                  body { font-family: Arial, sans-serif; padding: 20px; }
                  h1 { color: #16A34A; }
                  table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                  th, td { border: 1px solid #ddd; padding: 6px; text-align: left; font-size: 10px; }
                  th { background-color: #D1FAE5; }
                </style></head><body>
                <h1>✅ To Collect</h1>
                <p>Printed: ${new Date().toLocaleString()} | Total: ${components.length}</p>
                <table>
                  <tr><th>Cat</th><th>Sub</th><th>ISO</th><th>Spool</th><th>HF</th><th>TP</th><th>Request</th><th>Code</th><th>Description</th><th>Qty</th></tr>
                  ${components.map(comp => `<tr>
                    <td>${abbrevCategory(comp.requests?.request_type)}</td>
                    <td>${abbrevSubCategory(comp.sub_category || comp.requests?.sub_category)}</td>
                    <td>${comp.requests?.iso_number || '-'}</td>
                    <td>${comp.requests?.full_spool_number || '-'}</td>
                    <td>${comp.requests?.hf_number || '-'}</td>
                    <td>${comp.requests?.test_pack_number || '-'}</td>
                    <td>${displayRequestNumber(comp.requests)}</td>
                    <td>${comp.ident_code}</td>
                    <td>${comp.description || '-'}</td>
                    <td>${comp.quantity}</td>
                  </tr>`).join('')}
                </table>
                </body></html>
              `);
              printWindow.document.close();
              printWindow.print();
            }}
            style={{ ...styles.button, backgroundColor: COLORS.purple, color: 'white' }}
          >
            🖨️ Print
          </button>
        )}
      </div>

      <div style={styles.card}>
        <div style={{ overflowX: 'auto' }}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Cat</th>
                <th style={styles.th}>Sub</th>
                <th style={styles.th}>ISO</th>
                <th style={styles.th}>Spool</th>
                <th style={styles.th}>HF</th>
                <th style={styles.th}>TP</th>
                <th style={styles.th}>Request</th>
                <th style={styles.th}>Code</th>
                <th style={styles.th}>Description</th>
                <th style={styles.th}>Qty</th>
                <th style={styles.th}>Actions</th>
                <th style={styles.th}>🏷️</th>
              </tr>
            </thead>
            <tbody>
              {components.map(comp => (
                <tr key={comp.id}>
                  <td style={styles.td}>{abbrevCategory(comp.requests?.request_type)}</td>
                  <td style={styles.td}>{abbrevSubCategory(comp.sub_category || comp.requests?.sub_category)}</td>
                  <td style={{ ...styles.td, fontSize: '11px' }}>{comp.requests?.iso_number || '-'}</td>
                  <td style={{ ...styles.td, fontSize: '11px' }}>{comp.requests?.full_spool_number || '-'}</td>
                  <td style={styles.td}>{comp.requests?.hf_number || '-'}</td>
                  <td style={styles.td}>{comp.requests?.test_pack_number || '-'}</td>
                  <td style={{ ...styles.td, fontFamily: 'monospace', fontWeight: '600' }}>
                    {displayRequestNumber(comp.requests)}
                  </td>
                  <td style={{ ...styles.td, fontFamily: 'monospace', fontSize: '11px' }}>{comp.ident_code}</td>
                  <td style={{ ...styles.td, maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis' }} title={comp.description}>
                    {comp.description ? (comp.description.length > 40 ? comp.description.substring(0, 40) + '...' : comp.description) : '-'}
                  </td>
                  <td style={styles.td}>{comp.quantity}</td>
                  <td style={styles.td}>
                    <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                      {canModify ? (
                        <ActionDropdown
                          actions={[
                            { id: 'collect', icon: '✅', label: 'Collect' },
                            { id: 'delete', icon: '🗑️', label: 'Delete' },
                            { id: 'return', icon: '↩️', label: 'Return' }
                          ]}
                          onExecute={(action) => {
                            if (action === 'collect') openCollectModal(comp);
                            else if (action === 'delete') handleDelete(comp);
                            else if (action === 'return') handleReturn(comp);
                          }}
                          disabled={!canModify}
                          componentId={comp.id}
                        />
                      ) : (
                        <span style={{ color: '#9ca3af', fontSize: '12px' }}>View only</span>
                      )}
                      <ActionButton 
                        color={comp.requests?.description ? COLORS.primary : COLORS.info} 
                        onClick={() => openHistory(comp.id)} 
                        title={comp.description ? "Has Description - Click for History" : "No Description - Click for History"}
                      >
                        ℹ️
                      </ActionButton>
                    </div>
                  </td>
                  <td style={{ ...styles.td, textAlign: 'center' }}>
                    <button
                      onClick={() => { setSelectedForLabel(comp); setShowLabelModal(true); }}
                      style={{ 
                        padding: '4px 8px', 
                        border: 'none', 
                        borderRadius: '4px', 
                        backgroundColor: COLORS.success, 
                        color: 'white', 
                        cursor: 'pointer',
                        fontSize: '14px'
                      }}
                      title="Print Label"
                    >
                      🏷️
                    </button>
                  </td>
                </tr>
              ))}
              {components.length === 0 && (
                <tr>
                  <td colSpan="12" style={{ ...styles.td, textAlign: 'center', color: '#9ca3af' }}>
                    No materials to collect
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Collect Modal with Autocomplete */}
      <Modal isOpen={showCollectModal} onClose={() => setShowCollectModal(false)} title="📦 Collect Material">
        <div style={{ marginBottom: '16px' }}>
          <p><strong>Code:</strong> {selectedComponent?.ident_code}</p>
          <p><strong>Qty:</strong> {selectedComponent?.quantity}</p>
          <p><strong>Request:</strong> {selectedComponent?.requests?.request_number}-{selectedComponent?.requests?.sub_number}</p>
        </div>
        
        <div style={{ marginBottom: '16px', position: 'relative' }}>
          <label style={styles.label}>Collector Name *</label>
          <input
            type="text"
            value={collectorName}
            onChange={(e) => handleCollectorSearch(e.target.value)}
            placeholder="Start typing name..."
            style={styles.input}
            autoComplete="off"
          />
          {filteredUsers.length > 0 && (
            <div style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '6px',
              maxHeight: '150px',
              overflowY: 'auto',
              zIndex: 1000,
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
            }}>
              {filteredUsers.map(u => (
                <div
                  key={u.id}
                  onClick={() => selectCollector(u.full_name)}
                  style={{
                    padding: '8px 12px',
                    cursor: 'pointer',
                    borderBottom: '1px solid #f3f4f6'
                  }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#f3f4f6'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
                >
                  {u.full_name}
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          <button onClick={() => setShowCollectModal(false)} style={{ ...styles.button, ...styles.buttonSecondary }}>Cancel</button>
          <button onClick={handleDeliver} style={{ ...styles.button, backgroundColor: COLORS.success, color: 'white' }}>
            ✅ Confirm Collection
          </button>
        </div>
      </Modal>

      <HistoryPopup isOpen={showHistory} onClose={() => setShowHistory(false)} componentId={historyComponentId} />
      
      {/* V29.0: Label Print Modal */}
      <LabelPrintModal
        isOpen={showLabelModal}
        onClose={() => { setShowLabelModal(false); setSelectedForLabel(null); }}
        component={selectedForLabel}
      />
    </div>
  );
}

// ============================================================
// MATERIAL IN PAGE
// ============================================================
function MaterialInPage({ user }) {
  // State for MIR loading
  const [openMirs, setOpenMirs] = useState([]);
  const [selectedMir, setSelectedMir] = useState(null);
  
  // State for item entry
  const [identCode, setIdentCode] = useState('');
  const [itemDescription, setItemDescription] = useState('');
  const [itemDiam1, setItemDiam1] = useState('');
  const [quantity, setQuantity] = useState('');
  const [isPartial, setIsPartial] = useState(false);
  const [missingQty, setMissingQty] = useState('');
  const [itemNote, setItemNote] = useState('');
  
  // State for loaded items list
  const [loadedItems, setLoadedItems] = useState([]);
  
  // State for partials log
  const [partialsLog, setPartialsLog] = useState([]);
  const [showPartialsLog, setShowPartialsLog] = useState(false);
  
  // V28.9: State for new delivery modal
  const [showDeliveryModal, setShowDeliveryModal] = useState(false);
  const [selectedPartial, setSelectedPartial] = useState(null);
  const [deliveryType, setDeliveryType] = useState('complete'); // 'partial' or 'complete'
  const [deliveryQty, setDeliveryQty] = useState('');
  const [deliveryDestination, setDeliveryDestination] = useState('site'); // 'site' or 'yard'
  
  // V28.9: State for full Material IN log
  const [activeTab, setActiveTab] = useState('load'); // 'load' or 'log'
  const [materialInLog, setMaterialInLog] = useState([]);
  const [logSearchMir, setLogSearchMir] = useState('');
  
  // V28.11: MIR Documents state
  const [showDocsModal, setShowDocsModal] = useState(false);
  const [selectedLogItem, setSelectedLogItem] = useState(null);
  const [mirDocs, setMirDocs] = useState([]);
  const [uploadingDoc, setUploadingDoc] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [previewDoc, setPreviewDoc] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  
  const [loading, setLoading] = useState(true);
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [identSearchTimeout, setIdentSearchTimeout] = useState(null);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    setLoading(true);
    // Load only Open + Piping MIRs
    const { data: mirData } = await supabase
      .from('mirs')
      .select('*')
      .eq('status', 'Open')
      .eq('mir_type', 'Piping')
      .order('created_at', { ascending: false });
    if (mirData) setOpenMirs(mirData);
    
    // Load partials log
    const { data: partialsData } = await supabase
      .from('material_in_partials')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50);
    if (partialsData) setPartialsLog(partialsData);
    
    // V28.9: Load full Material IN log from movements
    const { data: logData } = await supabase
      .from('movements')
      .select('*')
      .eq('movement_type', 'IN')
      .eq('from_location', 'TEN_WH')
      .order('created_at', { ascending: false })
      .limit(500);
    if (logData) setMaterialInLog(logData);
    
    setLoading(false);
  };

  // V28.11: MIR Documents functions
  const extractMirInfo = (note) => {
    if (!note) return { mir: null, rk: null };
    
    // Try different patterns:
    // 1. "MIR 1111/RK 2222" or "MIR 1111 / RK 2222"
    let match = note.match(/MIR\s*(\d+)\s*\/\s*RK\s*(\d+)/i);
    if (match) return { mir: match[1], rk: match[2] };
    
    // 2. "MIR 1111/2222" (MIR/RK without "RK" text)
    match = note.match(/MIR\s*(\d+)\s*\/\s*(\d+)/i);
    if (match) return { mir: match[1], rk: match[2] };
    
    // 3. "MIR 1111" (just MIR number)
    match = note.match(/MIR\s*(\d+)/i);
    if (match) return { mir: match[1], rk: null };
    
    return { mir: null, rk: null };
  };

  const openDocsModal = async (logItem) => {
    setSelectedLogItem(logItem);
    const { mir } = extractMirInfo(logItem.note);
    if (mir) {
      // Load existing docs for this MIR
      const { data } = await supabase
        .from('mir_documents')
        .select('*')
        .eq('mir_number', mir)
        .order('created_at', { ascending: false });
      setMirDocs(data || []);
    } else {
      setMirDocs([]);
    }
    setShowDocsModal(true);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const { mir, rk } = extractMirInfo(selectedLogItem?.note);
    if (!mir) {
      alert('Cannot extract MIR number from this record');
      return;
    }
    
    setUploadingDoc(true);
    
    try {
      // Generate filename: MIR-{mir}_RK-{rk}_{date}_{sequence}.{ext}
      const date = new Date().toISOString().split('T')[0];
      const ext = file.name.split('.').pop().toLowerCase();
      const sequence = String(mirDocs.length + 1).padStart(3, '0');
      const fileName = `MIR-${mir}_RK-${rk || 'NA'}_${date}_${sequence}.${ext}`;
      const filePath = `${mir}/${fileName}`;
      
      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('mir-documents')
        .upload(filePath, file);
      
      if (uploadError) throw uploadError;
      
      // Save reference in database
      const { error: dbError } = await supabase
        .from('mir_documents')
        .insert({
          mir_number: mir,
          voucher_number: rk,
          file_name: fileName,
          file_path: filePath,
          file_type: file.type,
          file_size: file.size,
          uploaded_by_user_id: user.id,
          uploaded_by_name: user.full_name
        });
      
      if (dbError) throw dbError;
      
      // Reload docs
      const { data } = await supabase
        .from('mir_documents')
        .select('*')
        .eq('mir_number', mir)
        .order('created_at', { ascending: false });
      setMirDocs(data || []);
      
      alert('Document uploaded successfully!');
    } catch (error) {
      console.error('Upload error:', error);
      alert('Upload failed: ' + error.message);
    }
    
    setUploadingDoc(false);
    e.target.value = ''; // Reset file input
  };

  const viewDocument = async (doc) => {
    try {
      const { data, error } = await supabase.storage
        .from('mir-documents')
        .createSignedUrl(doc.file_path, 3600); // 1 hour expiry
      
      if (error) throw error;
      
      setPreviewDoc(doc);
      setPreviewUrl(data.signedUrl);
      setShowPreview(true);
    } catch (error) {
      console.error('Preview error:', error);
      alert('Cannot preview document: ' + error.message);
    }
  };

  const downloadDocument = async (doc) => {
    try {
      const { data, error } = await supabase.storage
        .from('mir-documents')
        .download(doc.file_path);
      
      if (error) throw error;
      
      // Create download link
      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = doc.file_name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download error:', error);
      alert('Download failed: ' + error.message);
    }
  };

  const deleteDocument = async (doc) => {
    if (!confirm(`Delete ${doc.file_name}?`)) return;
    
    try {
      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('mir-documents')
        .remove([doc.file_path]);
      
      if (storageError) throw storageError;
      
      // Delete from database
      const { error: dbError } = await supabase
        .from('mir_documents')
        .delete()
        .eq('id', doc.id);
      
      if (dbError) throw dbError;
      
      // Update local state
      setMirDocs(mirDocs.filter(d => d.id !== doc.id));
    } catch (error) {
      console.error('Delete error:', error);
      alert('Delete failed: ' + error.message);
    }
  };

  // V28.4: Search ident code with debounce (3+ chars, 500ms delay)
  const searchIdentCode = (term) => {
    // Clear previous timeout
    if (identSearchTimeout) clearTimeout(identSearchTimeout);
    
    if (term.length < 3) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }
    
    // Debounce by 500ms
    const timeout = setTimeout(async () => {
      const { data, error } = await supabase
        .from('project_materials')
        .select('ident_code, description, dia1')
        .ilike('ident_code', `%${term}%`)
        .limit(30);
      
      console.log('Material IN search for', term, ':', data); // Debug
      if (error) console.error('Material IN search error:', error);
      
      if (data) {
        // Get unique ident codes with their data
        const unique = [];
        const seen = new Set();
        data.forEach(d => {
          if (!seen.has(d.ident_code)) {
            seen.add(d.ident_code);
            unique.push(d);
          }
        });
        setSearchResults(unique);
        setShowSearchResults(true);
      }
    }, 500);
    setIdentSearchTimeout(timeout);
  };

  const selectIdent = (item) => {
    console.log('Selected item:', item); // Debug
    setIdentCode(item.ident_code);
    setItemDescription(item.description || '');
    setItemDiam1(item.dia1 || '');
    setShowSearchResults(false);
  };

  const addToList = () => {
    if (!selectedMir) {
      alert('Please select a MIR first');
      return;
    }
    if (!identCode) {
      alert('Please enter an Ident Code');
      return;
    }
    
    const receivedQty = parseInt(quantity) || 0;
    const missing = isPartial ? (parseInt(missingQty) || 0) : 0;
    
    const newItem = {
      id: Date.now(),
      mir_id: selectedMir.id,
      mir_number: selectedMir.mir_number,
      rk_number: selectedMir.rk_number,
      ident_code: identCode,
      description: itemDescription,
      dia1: itemDiam1,
      quantity: receivedQty,
      is_partial: isPartial,
      missing_qty: missing,
      note: itemNote
    };
    
    setLoadedItems([...loadedItems, newItem]);
    
    // Reset form
    setIdentCode('');
    setItemDescription('');
    setItemDiam1('');
    setQuantity('');
    setIsPartial(false);
    setMissingQty('');
    setItemNote('');
  };

  const removeFromList = (id) => {
    setLoadedItems(loadedItems.filter(i => i.id !== id));
  };

  const assignToWarehouse = async (destination) => {
    if (loadedItems.length === 0) {
      alert('No items to assign');
      return;
    }
    
    try {
      for (const item of loadedItems) {
        // Update inventory
        if (item.quantity > 0) {
          // Update collected_ten_wh
          await supabase.rpc('increment_collected_ten_wh', { 
            p_ident_code: item.ident_code, 
            p_qty: item.quantity 
          });
          
          // Update yard or site qty
          if (destination === 'YARD') {
            await supabase.rpc('increment_yard_qty', { 
              p_ident_code: item.ident_code, 
              p_qty: item.quantity 
            });
          } else {
            await supabase.rpc('increment_site_qty', { 
              p_ident_code: item.ident_code, 
              p_qty: item.quantity 
            });
          }
        }
        
        // Log movement
        await supabase.from('movements').insert({
          ident_code: item.ident_code,
          movement_type: 'IN',
          quantity: item.quantity,
          from_location: 'TEN_WH',
          to_location: destination,
          performed_by: user.full_name,
          note: `MIR ${item.mir_number || item.rk_number}${item.is_partial ? ' (Partial)' : ''}${item.note ? ' - ' + item.note : ''}`
        });
        
        // If partial, log to partials table
        if (item.is_partial && item.missing_qty > 0) {
          await supabase.from('material_in_partials').insert({
            mir_id: item.mir_id,
            mir_number: item.mir_number,
            rk_number: item.rk_number,
            ident_code: item.ident_code,
            description: item.description,
            received_qty: item.quantity,
            missing_qty: item.missing_qty,
            note: item.note,
            created_by: user.id,
            created_by_name: user.full_name
          });
        }
      }
      
      alert(`Successfully assigned ${loadedItems.length} items to ${destination}`);
      setLoadedItems([]);
      loadData();
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };

  // V28.9: Open delivery modal for partial item
  const openDeliveryModal = (partial) => {
    setSelectedPartial(partial);
    setDeliveryType('complete');
    setDeliveryQty('');
    setDeliveryDestination('site');
    setShowDeliveryModal(true);
  };

  // V28.9: Process new delivery from partial
  const processDelivery = async () => {
    if (!selectedPartial) return;
    
    try {
      const deliverQty = deliveryType === 'complete' 
        ? selectedPartial.missing_qty 
        : parseInt(deliveryQty) || 0;
      
      if (deliverQty <= 0) {
        alert('Invalid quantity');
        return;
      }
      
      if (deliveryType === 'partial' && deliverQty >= selectedPartial.missing_qty) {
        alert('For partial delivery, quantity must be less than remaining missing quantity');
        return;
      }
      
      const newMissingQty = selectedPartial.missing_qty - deliverQty;
      
      // Update the partial record with new missing qty
      await supabase
        .from('material_in_partials')
        .update({ missing_qty: newMissingQty })
        .eq('id', selectedPartial.id);
      
      // Update inventory - add to yard or site
      if (deliveryDestination === 'yard') {
        await supabase.rpc('increment_yard_qty', { 
          p_ident_code: selectedPartial.ident_code, 
          p_qty: deliverQty 
        });
      } else {
        await supabase.rpc('increment_site_qty', { 
          p_ident_code: selectedPartial.ident_code, 
          p_qty: deliverQty 
        });
      }
      
      // Also increment collected_ten_wh since this is material arriving from TEN
      await supabase.rpc('increment_collected_ten_wh', { 
        p_ident_code: selectedPartial.ident_code, 
        p_qty: deliverQty 
      });
      
      // Log the movement
      await supabase.from('movements').insert({
        ident_code: selectedPartial.ident_code,
        movement_type: 'IN',
        quantity: deliverQty,
        from_location: 'TEN_WH',
        to_location: deliveryDestination.toUpperCase(),
        performed_by: user.full_name,
        note: `Partial delivery from MIR ${selectedPartial.mir_number || '-'}/${selectedPartial.rk_number} - ${deliveryType === 'complete' ? 'Complete' : 'Partial'} (${newMissingQty} still missing)`
      });
      
      alert(`Successfully delivered ${deliverQty} to ${deliveryDestination.toUpperCase()}. ${newMissingQty > 0 ? `${newMissingQty} still missing.` : 'Partial completed!'}`);
      setShowDeliveryModal(false);
      loadData();
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };

  const canModify = canModifyPage(user, 'material_in');

  // V28.9: Filter log by MIR search
  const filteredLog = logSearchMir 
    ? materialInLog.filter(m => m.note && m.note.toLowerCase().includes(logSearchMir.toLowerCase()))
    : materialInLog;

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading...</div>;

  return (
    <div>
      {/* V28.9: Tab Navigation */}
      <div style={{ display: 'flex', gap: '4px', marginBottom: '20px' }}>
        <button
          onClick={() => setActiveTab('load')}
          style={{
            padding: '12px 24px',
            backgroundColor: activeTab === 'load' ? COLORS.primary : '#E5E7EB',
            color: activeTab === 'load' ? 'white' : '#374151',
            border: 'none',
            borderRadius: '8px 8px 0 0',
            fontWeight: '600',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          📦 Load Material
        </button>
        <button
          onClick={() => setActiveTab('log')}
          style={{
            padding: '12px 24px',
            backgroundColor: activeTab === 'log' ? COLORS.info : '#E5E7EB',
            color: activeTab === 'log' ? 'white' : '#374151',
            border: 'none',
            borderRadius: '8px 8px 0 0',
            fontWeight: '600',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          📋 Material IN Log ({materialInLog.length})
        </button>
      </div>

      {/* TAB 1: Load Material */}
      {activeTab === 'load' && (
        <>
          {/* MIR Selection */}
          <div style={{ ...styles.card, marginBottom: '20px' }}>
            <div style={styles.cardHeader}>
              <h3 style={{ fontWeight: '600' }}>📦 Material IN - Load from TEN Warehouse</h3>
              <button 
                onClick={() => setShowPartialsLog(!showPartialsLog)}
                style={{ ...styles.button, ...styles.buttonSecondary }}
              >
                📋 {showPartialsLog ? 'Hide' : 'Show'} Partial/Note Log
              </button>
            </div>
            <div style={{ padding: '20px' }}>
              {/* Step 1: Select MIR */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ ...styles.label, fontSize: '16px', fontWeight: '600', color: COLORS.info }}>
                  Step 1: Select MIR (Piping Only)
            </label>
            <select
              value={selectedMir?.id || ''}
              onChange={(e) => {
                const mir = openMirs.find(m => m.id === e.target.value);
                setSelectedMir(mir || null);
              }}
              style={{ ...styles.select, maxWidth: '400px' }}
              disabled={!canModify}
            >
              <option value="">-- Select MIR --</option>
              {openMirs.map(mir => (
                <option key={mir.id} value={mir.id}>
                  MIR {mir.mir_number} / RK {mir.rk_number} - {mir.category} {mir.description ? `(${mir.description})` : ''}
                </option>
              ))}
            </select>
          </div>

          {/* Step 2: Add Items */}
          {selectedMir && (
            <div style={{ 
              padding: '16px', 
              backgroundColor: '#f9fafb', 
              borderRadius: '8px',
              border: '1px solid #e5e7eb'
            }}>
              <label style={{ ...styles.label, fontSize: '16px', fontWeight: '600', color: COLORS.success }}>
                Step 2: Add Items
              </label>
              
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 2fr 1fr', gap: '16px', marginBottom: '16px' }}>
                {/* Ident Code with search */}
                <div style={{ position: 'relative' }}>
                  <label style={styles.label}>Ident Code *</label>
                  <input
                    type="text"
                    value={identCode}
                    onChange={(e) => {
                      const upperValue = e.target.value.toUpperCase();
                      setIdentCode(upperValue);
                      searchIdentCode(upperValue);
                    }}
                    onFocus={() => searchResults.length > 0 && setShowSearchResults(true)}
                    onBlur={() => setTimeout(() => setShowSearchResults(false), 200)}
                    style={styles.input}
                    placeholder="Type 3+ chars to search..."
                    disabled={!canModify}
                  />
                  {showSearchResults && searchResults.length > 0 && (
                    <div style={{
                      position: 'absolute',
                      top: '100%',
                      left: 0,
                      right: 0,
                      maxHeight: '200px',
                      overflowY: 'auto',
                      backgroundColor: 'white',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                      zIndex: 100
                    }}>
                      {searchResults.map((item, idx) => (
                        <div
                          key={idx}
                          onClick={() => selectIdent(item)}
                          style={{
                            padding: '10px 12px',
                            cursor: 'pointer',
                            borderBottom: '1px solid #f3f4f6',
                            fontSize: '13px'
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
                          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                        >
                          <div style={{ fontWeight: '600', fontFamily: 'monospace' }}>{item.ident_code}</div>
                          <div style={{ color: '#6b7280', fontSize: '12px', marginTop: '2px' }}>
                            {item.description ? item.description.substring(0, 50) : '(no description)'}
                            {item.dia1 && <span style={{ marginLeft: '8px', color: '#3b82f6' }}>Ø{item.dia1}</span>}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                {/* Description (auto-filled) */}
                <div>
                  <label style={styles.label}>Description</label>
                  <input
                    type="text"
                    value={itemDescription}
                    readOnly
                    style={{ ...styles.input, backgroundColor: '#f3f4f6' }}
                    placeholder="Auto-filled"
                  />
                </div>
                
                {/* Diam1 (auto-filled) */}
                <div>
                  <label style={styles.label}>Diam</label>
                  <input
                    type="text"
                    value={itemDiam1}
                    readOnly
                    style={{ ...styles.input, backgroundColor: '#f3f4f6' }}
                    placeholder="Auto"
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '120px 150px 120px 1fr 100px', gap: '16px', alignItems: 'end' }}>
                {/* Quantity */}
                <div>
                  <label style={styles.label}>Quantity</label>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    style={styles.input}
                    min="0"
                    placeholder="0"
                    disabled={!canModify}
                  />
                </div>
                
                {/* Partial checkbox */}
                <div>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', marginTop: '24px' }}>
                    <input
                      type="checkbox"
                      checked={isPartial}
                      onChange={(e) => setIsPartial(e.target.checked)}
                      style={{ width: '18px', height: '18px' }}
                      disabled={!canModify}
                    />
                    <span style={{ fontWeight: isPartial ? '600' : '400', color: isPartial ? COLORS.warning : '#374151' }}>
                      Partial?
                    </span>
                  </label>
                </div>
                
                {/* Missing Qty (if partial) */}
                <div>
                  <label style={styles.label}>Missing Qty</label>
                  <input
                    type="number"
                    value={missingQty}
                    onChange={(e) => setMissingQty(e.target.value)}
                    style={{ ...styles.input, backgroundColor: isPartial ? 'white' : '#f3f4f6' }}
                    min="0"
                    placeholder="0"
                    disabled={!canModify || !isPartial}
                  />
                </div>
                
                {/* Note */}
                <div>
                  <label style={styles.label}>Note (optional)</label>
                  <input
                    type="text"
                    value={itemNote}
                    onChange={(e) => setItemNote(e.target.value)}
                    style={styles.input}
                    placeholder="Add note..."
                    disabled={!canModify}
                  />
                </div>
                
                {/* Load button */}
                <button
                  onClick={addToList}
                  disabled={!canModify || !identCode}
                  style={{ 
                    ...styles.button, 
                    backgroundColor: identCode ? COLORS.info : '#d1d5db',
                    color: 'white',
                    height: '42px',
                    justifyContent: 'center'
                  }}
                >
                  + Load
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Loaded Items List */}
      {loadedItems.length > 0 && (
        <div style={{ ...styles.card, marginBottom: '20px' }}>
          <div style={styles.cardHeader}>
            <h3 style={{ fontWeight: '600' }}>📋 Loaded Items ({loadedItems.length})</h3>
          </div>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>MIR/RK</th>
                <th style={styles.th}>Ident Code</th>
                <th style={styles.th}>Description</th>
                <th style={styles.th}>Diam</th>
                <th style={styles.th}>Qty</th>
                <th style={styles.th}>Partial</th>
                <th style={styles.th}>Missing</th>
                <th style={styles.th}>Note</th>
                <th style={styles.th}>Remove</th>
              </tr>
            </thead>
            <tbody>
              {loadedItems.map(item => (
                <tr key={item.id}>
                  <td style={{ ...styles.td, fontFamily: 'monospace' }}>{item.mir_number || '-'}/{item.rk_number}</td>
                  <td style={{ ...styles.td, fontFamily: 'monospace', fontWeight: '600' }}>{item.ident_code}</td>
                  <td style={{ ...styles.td, maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.description || '-'}</td>
                  <td style={styles.td}>{item.dia1 || '-'}</td>
                  <td style={{ ...styles.td, fontWeight: '600' }}>{item.quantity}</td>
                  <td style={styles.td}>
                    {item.is_partial ? (
                      <span style={{ ...styles.statusBadge, backgroundColor: COLORS.warning }}>Yes</span>
                    ) : '-'}
                  </td>
                  <td style={{ ...styles.td, color: item.missing_qty > 0 ? COLORS.primary : '#6b7280' }}>
                    {item.missing_qty || '-'}
                  </td>
                  <td style={styles.td}>
                    {item.note ? <NoteIcon note={item.note} /> : '-'}
                  </td>
                  <td style={styles.td}>
                    <button
                      onClick={() => removeFromList(item.id)}
                      style={{ ...styles.actionButton, backgroundColor: COLORS.primary }}
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {/* Assign buttons */}
          <div style={{ padding: '20px', borderTop: '1px solid #e5e7eb', display: 'flex', gap: '16px', justifyContent: 'center' }}>
            <button
              onClick={() => assignToWarehouse('SITE')}
              disabled={!canModify}
              style={{ 
                ...styles.button, 
                backgroundColor: COLORS.info, 
                color: 'white',
                padding: '12px 32px',
                fontSize: '16px'
              }}
            >
              🏭 Assign to SITE
            </button>
            <button
              onClick={() => assignToWarehouse('YARD')}
              disabled={!canModify}
              style={{ 
                ...styles.button, 
                backgroundColor: COLORS.secondary, 
                color: 'white',
                padding: '12px 32px',
                fontSize: '16px'
              }}
            >
              🏢 Assign to YARD
            </button>
          </div>
        </div>
      )}

      {/* Partial/Note Log */}
      {showPartialsLog && (
        <div style={styles.card}>
          <div style={{ ...styles.cardHeader, backgroundColor: '#FEF3C7', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
            <h3 style={{ fontWeight: '600', color: COLORS.warning }}>📋 Partial/Note Log</h3>
            {/* V28.3: Print + Export Buttons */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <button
                onClick={() => {
                  const printWindow = window.open('', '_blank');
                  printWindow.document.write(`
                    <html><head><title>Partial/Note Log</title>
                    <style>
                      body { font-family: Arial, sans-serif; padding: 20px; }
                      h1 { color: #B45309; }
                      table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                      th, td { border: 1px solid #ddd; padding: 8px; text-align: left; font-size: 12px; }
                      th { background-color: #FEF3C7; }
                    </style></head><body>
                    <h1>📋 Partial/Note Log - Material IN</h1>
                    <p>Printed: ${new Date().toLocaleString()}</p>
                    <table>
                      <tr><th>Date</th><th>MIR/RK</th><th>Ident Code</th><th>Description</th><th>Received</th><th>Missing</th><th>Note</th><th>By</th></tr>
                      ${partialsLog.map(p => `<tr>
                        <td>${new Date(p.created_at).toLocaleDateString()}</td>
                        <td>${p.mir_number || '-'}/${p.rk_number || '-'}</td>
                        <td>${p.ident_code}</td>
                        <td>${p.description || '-'}</td>
                        <td>${p.received_qty}</td>
                        <td style="color: ${p.missing_qty > 0 ? 'red' : 'inherit'}">${p.missing_qty}</td>
                        <td>${p.note || '-'}</td>
                        <td>${p.created_by_name || '-'}</td>
                      </tr>`).join('')}
                    </table>
                    </body></html>
                  `);
                  printWindow.document.close();
                  printWindow.print();
                }}
                style={{ ...styles.button, backgroundColor: COLORS.purple, color: 'white', fontSize: '12px', padding: '6px 12px' }}
              >
                🖨️ Print
              </button>
              <button
                onClick={() => {
                  // Export All
                  const headers = ['Date', 'MIR', 'RK', 'Ident Code', 'Description', 'Received', 'Missing', 'Note', 'By'];
                  const rows = partialsLog.map(p => [
                    new Date(p.created_at).toLocaleDateString(),
                    p.mir_number || '',
                    p.rk_number || '',
                    p.ident_code,
                    p.description || '',
                    p.received_qty,
                    p.missing_qty,
                    p.note || '',
                    p.created_by_name || ''
                  ]);
                  const csv = [headers.join(','), ...rows.map(r => r.map(c => `"${c}"`).join(','))].join('\n');
                  const blob = new Blob([csv], { type: 'text/csv' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `material_in_all_${new Date().toISOString().split('T')[0]}.csv`;
                  a.click();
                }}
                style={{ ...styles.button, backgroundColor: COLORS.secondary, color: 'white', fontSize: '12px', padding: '6px 12px' }}
              >
                📥 All
              </button>
              <button
                onClick={() => {
                  // Export only partials (with missing qty > 0)
                  const filtered = partialsLog.filter(p => p.missing_qty > 0);
                  const headers = ['Date', 'MIR', 'RK', 'Ident Code', 'Description', 'Received', 'Missing', 'Note', 'By'];
                  const rows = filtered.map(p => [
                    new Date(p.created_at).toLocaleDateString(),
                    p.mir_number || '',
                    p.rk_number || '',
                    p.ident_code,
                    p.description || '',
                    p.received_qty,
                    p.missing_qty,
                    p.note || '',
                    p.created_by_name || ''
                  ]);
                  const csv = [headers.join(','), ...rows.map(r => r.map(c => `"${c}"`).join(','))].join('\n');
                  const blob = new Blob([csv], { type: 'text/csv' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `material_in_partials_${new Date().toISOString().split('T')[0]}.csv`;
                  a.click();
                }}
                style={{ ...styles.button, backgroundColor: COLORS.warning, color: 'white', fontSize: '12px', padding: '6px 12px' }}
              >
                📥 Partials Only
              </button>
              <button
                onClick={() => {
                  // Export only items with notes
                  const filtered = partialsLog.filter(p => p.note && p.note.trim());
                  const headers = ['Date', 'MIR', 'RK', 'Ident Code', 'Description', 'Received', 'Missing', 'Note', 'By'];
                  const rows = filtered.map(p => [
                    new Date(p.created_at).toLocaleDateString(),
                    p.mir_number || '',
                    p.rk_number || '',
                    p.ident_code,
                    p.description || '',
                    p.received_qty,
                    p.missing_qty,
                    p.note || '',
                    p.created_by_name || ''
                  ]);
                  const csv = [headers.join(','), ...rows.map(r => r.map(c => `"${c}"`).join(','))].join('\n');
                  const blob = new Blob([csv], { type: 'text/csv' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `material_in_with_notes_${new Date().toISOString().split('T')[0]}.csv`;
                  a.click();
                }}
                style={{ ...styles.button, backgroundColor: COLORS.info, color: 'white', fontSize: '12px', padding: '6px 12px' }}
              >
                📥 With Notes
              </button>
            </div>
          </div>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Date</th>
                <th style={styles.th}>MIR/RK</th>
                <th style={styles.th}>Ident Code</th>
                <th style={styles.th}>Description</th>
                <th style={styles.th}>Received</th>
                <th style={styles.th}>Missing</th>
                <th style={styles.th}>Note</th>
                <th style={styles.th}>By</th>
                <th style={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {partialsLog.map(p => (
                <tr key={p.id}>
                  <td style={styles.td}>{new Date(p.created_at).toLocaleDateString()}</td>
                  <td style={{ ...styles.td, fontFamily: 'monospace' }}>{p.mir_number || '-'}/{p.rk_number}</td>
                  <td style={{ ...styles.td, fontFamily: 'monospace', fontWeight: '600' }}>{p.ident_code}</td>
                  <td style={{ ...styles.td, maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={p.description || ''}>
                    {p.description ? (p.description.length > 50 ? p.description.substring(0, 50) + '...' : p.description) : '-'}
                  </td>
                  <td style={{ ...styles.td, color: COLORS.success }}>{p.received_qty}</td>
                  <td style={{ ...styles.td, color: COLORS.primary, fontWeight: '600' }}>{p.missing_qty}</td>
                  <td style={styles.td}>
                    {p.note ? <NoteIcon note={p.note} /> : '-'}
                  </td>
                  <td style={{ ...styles.td, fontSize: '12px', color: '#6b7280' }}>{p.created_by_name}</td>
                  <td style={styles.td}>
                    {p.missing_qty > 0 && canModify && (
                      <button
                        onClick={() => openDeliveryModal(p)}
                        style={{
                          ...styles.button,
                          backgroundColor: COLORS.success,
                          color: 'white',
                          padding: '4px 10px',
                          fontSize: '11px'
                        }}
                      >
                        📦 New Delivery
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {partialsLog.length === 0 && (
                <tr><td colSpan="9" style={{ ...styles.td, textAlign: 'center', color: '#9ca3af' }}>No partial items recorded</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
        </>
      )}

      {/* TAB 2: Material IN Log */}
      {activeTab === 'log' && (
        <div style={styles.card}>
          <div style={{ ...styles.cardHeader, backgroundColor: '#DBEAFE' }}>
            <h3 style={{ fontWeight: '600', color: COLORS.info }}>📋 Material IN Log - All Loaded Items</h3>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <input
                type="text"
                value={logSearchMir}
                onChange={(e) => setLogSearchMir(e.target.value)}
                placeholder="Search by MIR..."
                style={{ ...styles.input, width: '200px', marginBottom: 0 }}
              />
              {logSearchMir && (
                <button
                  onClick={() => setLogSearchMir('')}
                  style={{ ...styles.button, backgroundColor: '#6B7280', color: 'white', padding: '6px 12px' }}
                >
                  Clear
                </button>
              )}
            </div>
          </div>
          
          {/* Results info */}
          <div style={{ padding: '12px 16px', backgroundColor: '#F3F4F6', borderBottom: '1px solid #E5E7EB' }}>
            <span style={{ fontSize: '13px', color: '#6B7280' }}>
              Showing {filteredLog.length} of {materialInLog.length} records
              {logSearchMir && <span> (filtered by: "{logSearchMir}")</span>}
            </span>
          </div>

          <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
            <table style={styles.table}>
              <thead style={{ position: 'sticky', top: 0, backgroundColor: 'white' }}>
                <tr>
                  <th style={styles.th}>Date/Time</th>
                  <th style={styles.th}>MIR Info</th>
                  <th style={styles.th}>Ident Code</th>
                  <th style={styles.th}>Qty</th>
                  <th style={styles.th}>Destination</th>
                  <th style={styles.th}>Operator</th>
                  <th style={styles.th}>📎 Docs</th>
                </tr>
              </thead>
              <tbody>
                {filteredLog.map(m => (
                  <tr key={m.id} style={{ backgroundColor: m.to_location === 'SITE' ? '#EFF6FF' : '#F9FAFB' }}>
                    <td style={{ ...styles.td, fontSize: '12px' }}>
                      {new Date(m.created_at).toLocaleDateString()}<br/>
                      <span style={{ color: '#9CA3AF' }}>{new Date(m.created_at).toLocaleTimeString()}</span>
                    </td>
                    <td style={{ ...styles.td, fontSize: '12px' }}>
                      {m.note || '-'}
                    </td>
                    <td style={{ ...styles.td, fontFamily: 'monospace', fontWeight: '600' }}>{m.ident_code}</td>
                    <td style={{ ...styles.td, fontWeight: '600', color: COLORS.success }}>{m.quantity}</td>
                    <td style={styles.td}>
                      <span style={{
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '11px',
                        fontWeight: '600',
                        backgroundColor: m.to_location === 'SITE' ? '#2563EB' : '#1F2937',
                        color: 'white'
                      }}>
                        {m.to_location === 'SITE' ? '🏭 SITE' : '🏢 YARD'}
                      </span>
                    </td>
                    <td style={{ ...styles.td, fontSize: '12px', color: '#6B7280' }}>{m.performed_by}</td>
                    <td style={styles.td}>
                      {(() => {
                        const mirInfo = extractMirInfo(m.note);
                        const hasMir = !!mirInfo.mir;
                        return (
                          <button
                            onClick={() => openDocsModal(m)}
                            style={{
                              ...styles.button,
                              backgroundColor: hasMir ? COLORS.info : '#E5E7EB',
                              color: hasMir ? 'white' : '#9CA3AF',
                              padding: '6px 10px',
                              fontSize: '12px',
                              cursor: hasMir ? 'pointer' : 'not-allowed',
                              border: hasMir ? 'none' : '1px solid #D1D5DB',
                              opacity: hasMir ? 1 : 0.6
                            }}
                            disabled={!hasMir}
                            title={hasMir ? `📎 Documents for MIR ${mirInfo.mir}` : 'No MIR number found'}
                          >
                            📎 {hasMir ? 'Docs' : '-'}
                          </button>
                        );
                      })()}
                    </td>
                  </tr>
                ))}
                {filteredLog.length === 0 && (
                  <tr>
                    <td colSpan="7" style={{ ...styles.td, textAlign: 'center', color: '#9CA3AF', padding: '40px' }}>
                      {logSearchMir ? `No results for "${logSearchMir}"` : 'No Material IN records yet'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* V28.9: New Delivery Modal */}
      <Modal isOpen={showDeliveryModal} onClose={() => setShowDeliveryModal(false)} title="📦 New Delivery">
        {selectedPartial && (
          <>
            <div style={{ marginBottom: '16px', padding: '12px', backgroundColor: '#F3F4F6', borderRadius: '8px' }}>
              <p style={{ fontWeight: '600', marginBottom: '8px' }}>Item Details:</p>
              <p><strong>Ident Code:</strong> {selectedPartial.ident_code}</p>
              <p><strong>MIR/RK:</strong> {selectedPartial.mir_number || '-'}/{selectedPartial.rk_number}</p>
              <p><strong>Still Missing:</strong> <span style={{ color: COLORS.primary, fontWeight: '600' }}>{selectedPartial.missing_qty}</span></p>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={styles.label}>Delivery Type</label>
              <select
                value={deliveryType}
                onChange={(e) => {
                  setDeliveryType(e.target.value);
                  if (e.target.value === 'complete') {
                    setDeliveryQty('');
                  }
                }}
                style={styles.select}
              >
                <option value="complete">Complete (deliver all {selectedPartial.missing_qty})</option>
                <option value="partial">Partial (deliver some)</option>
              </select>
            </div>

            {deliveryType === 'partial' && (
              <div style={{ marginBottom: '16px' }}>
                <label style={styles.label}>Quantity to Deliver</label>
                <input
                  type="number"
                  value={deliveryQty}
                  onChange={(e) => setDeliveryQty(e.target.value)}
                  min="1"
                  max={selectedPartial.missing_qty - 1}
                  style={styles.input}
                  placeholder={`Max ${selectedPartial.missing_qty - 1}`}
                />
                <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
                  Remaining after delivery: {selectedPartial.missing_qty - (parseInt(deliveryQty) || 0)}
                </p>
              </div>
            )}

            <div style={{ marginBottom: '20px' }}>
              <label style={styles.label}>Send To</label>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  onClick={() => setDeliveryDestination('site')}
                  style={{
                    ...styles.button,
                    flex: 1,
                    backgroundColor: deliveryDestination === 'site' ? '#2563EB' : '#E5E7EB',
                    color: deliveryDestination === 'site' ? 'white' : '#374151',
                    padding: '12px',
                    fontSize: '14px',
                    fontWeight: '600',
                    border: deliveryDestination === 'site' ? '2px solid #1D4ED8' : '2px solid #D1D5DB'
                  }}
                >
                  🏭 To SITE
                </button>
                <button
                  onClick={() => setDeliveryDestination('yard')}
                  style={{
                    ...styles.button,
                    flex: 1,
                    backgroundColor: deliveryDestination === 'yard' ? '#1F2937' : '#E5E7EB',
                    color: deliveryDestination === 'yard' ? 'white' : '#374151',
                    padding: '12px',
                    fontSize: '14px',
                    fontWeight: '600',
                    border: deliveryDestination === 'yard' ? '2px solid #111827' : '2px solid #D1D5DB'
                  }}
                >
                  🏢 To YARD
                </button>
              </div>
            </div>

            <div style={{ 
              padding: '12px', 
              backgroundColor: deliveryType === 'complete' ? '#DCFCE7' : '#FEF3C7', 
              borderRadius: '8px',
              marginBottom: '16px'
            }}>
              <p style={{ fontWeight: '600', color: deliveryType === 'complete' ? '#166534' : '#92400E' }}>
                Summary:
              </p>
              <p style={{ fontSize: '14px' }}>
                Delivering <strong>{deliveryType === 'complete' ? selectedPartial.missing_qty : (parseInt(deliveryQty) || 0)}</strong> to <strong>{deliveryDestination.toUpperCase()}</strong>
              </p>
              {deliveryType === 'partial' && (
                <p style={{ fontSize: '14px' }}>
                  Still missing after: <strong>{selectedPartial.missing_qty - (parseInt(deliveryQty) || 0)}</strong>
                </p>
              )}
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button 
                onClick={() => setShowDeliveryModal(false)} 
                style={{ ...styles.button, ...styles.buttonSecondary }}
              >
                Cancel
              </button>
              <button 
                onClick={processDelivery}
                disabled={deliveryType === 'partial' && (!deliveryQty || parseInt(deliveryQty) <= 0)}
                style={{ 
                  ...styles.button, 
                  backgroundColor: COLORS.success, 
                  color: 'white',
                  opacity: (deliveryType === 'partial' && (!deliveryQty || parseInt(deliveryQty) <= 0)) ? 0.5 : 1
                }}
              >
                ✓ Confirm Delivery
              </button>
            </div>
          </>
        )}
      </Modal>

      {/* V28.11: MIR Documents Modal */}
      <Modal isOpen={showDocsModal} onClose={() => { setShowDocsModal(false); setMirDocs([]); }} title="📎 MIR Documents">
        {selectedLogItem && (
          <>
            <div style={{ marginBottom: '16px', padding: '12px', backgroundColor: '#F3F4F6', borderRadius: '8px' }}>
              <p style={{ fontWeight: '600', marginBottom: '4px' }}>
                {selectedLogItem.note || 'No MIR info'}
              </p>
              <p style={{ fontSize: '12px', color: '#6B7280' }}>
                {new Date(selectedLogItem.created_at).toLocaleString()}
              </p>
            </div>

            {/* Upload Section */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ ...styles.label, display: 'block', marginBottom: '8px' }}>
                Upload New Document (PDF, JPG, PNG)
              </label>
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png,.gif"
                onChange={handleFileUpload}
                disabled={uploadingDoc}
                style={{ display: 'block', marginBottom: '8px' }}
              />
              {uploadingDoc && (
                <span style={{ color: COLORS.info, fontSize: '13px' }}>⏳ Uploading...</span>
              )}
            </div>

            {/* Documents List */}
            <div>
              <h4 style={{ marginBottom: '12px', fontWeight: '600' }}>
                Uploaded Documents ({mirDocs.length})
              </h4>
              {mirDocs.length === 0 ? (
                <p style={{ color: '#9CA3AF', fontSize: '14px' }}>No documents uploaded yet</p>
              ) : (
                <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                  {mirDocs.map(doc => (
                    <div key={doc.id} style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px 12px',
                      backgroundColor: '#F9FAFB',
                      borderRadius: '6px',
                      marginBottom: '8px',
                      border: '1px solid #E5E7EB'
                    }}>
                      <div style={{ flex: 1 }}>
                        <p style={{ fontWeight: '500', fontSize: '13px', marginBottom: '2px' }}>
                          {doc.file_type?.includes('pdf') ? '📄' : '🖼️'} {doc.file_name}
                        </p>
                        <p style={{ fontSize: '11px', color: '#6B7280' }}>
                          {(doc.file_size / 1024).toFixed(1)} KB • {doc.uploaded_by_name} • {new Date(doc.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button
                          onClick={() => viewDocument(doc)}
                          style={{ ...styles.button, backgroundColor: COLORS.info, color: 'white', padding: '4px 8px', fontSize: '11px' }}
                        >
                          👁️ View
                        </button>
                        <button
                          onClick={() => downloadDocument(doc)}
                          style={{ ...styles.button, backgroundColor: COLORS.success, color: 'white', padding: '4px 8px', fontSize: '11px' }}
                        >
                          ⬇️ Download
                        </button>
                        <button
                          onClick={() => deleteDocument(doc)}
                          style={{ ...styles.button, backgroundColor: COLORS.primary, color: 'white', padding: '4px 8px', fontSize: '11px' }}
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </Modal>

      {/* V28.11: Document Preview Modal */}
      <Modal isOpen={showPreview} onClose={() => { setShowPreview(false); setPreviewUrl(null); }} title={`📄 Preview: ${previewDoc?.file_name || ''}`}>
        {previewUrl && (
          <div style={{ maxHeight: '70vh', overflow: 'auto' }}>
            {previewDoc?.file_type?.includes('pdf') ? (
              <iframe
                src={previewUrl}
                style={{ width: '100%', height: '60vh', border: 'none' }}
                title="PDF Preview"
              />
            ) : (
              <img
                src={previewUrl}
                alt={previewDoc?.file_name}
                style={{ maxWidth: '100%', height: 'auto' }}
              />
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}

// ============================================================
// SPARE PARTS PAGE - V28.2 Split by Internal/Client
// ============================================================
function SparePartsPage({ user }) {
  const [internalComponents, setInternalComponents] = useState([]);
  const [clientComponents, setClientComponents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showClientModal, setShowClientModal] = useState(false);
  const [selectedComponent, setSelectedComponent] = useState(null);
  const [forecastDate, setForecastDate] = useState('');

  useEffect(() => { loadComponents(); }, []);

  const loadComponents = async () => {
    setLoading(true);
    const { data } = await supabase.from('request_components')
      .select(`*, requests (request_number, sub_number, request_number_full, level_component, level_wh_split, level_yard_split, sub_category, request_type, iso_number, full_spool_number, hf_number, test_pack_number, description)`)
      .eq('status', 'Spare');
    
    if (data) {
      // Split by order_type: Internal vs Client (default to Client if not set)
      const internal = data.filter(c => c.order_type === 'Internal');
      const client = data.filter(c => c.order_type !== 'Internal');
      setInternalComponents(internal);
      setClientComponents(client);
    }
    setLoading(false);
  };

  const logHistory = async (compId, action, fromStatus, toStatus, note) => {
    await supabase.from('component_history').insert({
      component_id: compId, action, from_status: fromStatus, to_status: toStatus,
      performed_by_user_id: user.id, performed_by_name: user.full_name, note
    });
  };

  const openClientModal = (component) => {
    setSelectedComponent(component);
    setForecastDate(component.forecast_date || '');
    setShowClientModal(true);
  };

  const submitClientConfirmation = async () => {
    if (!forecastDate) {
      alert('Please enter the expected delivery date');
      return;
    }
    await supabase.from('request_components')
      .update({ forecast_date: forecastDate })
      .eq('id', selectedComponent.id);
    await logHistory(selectedComponent.id, 'Delivery Date Set', 'Spare', 'Spare', `Expected: ${forecastDate}`);
    setShowClientModal(false);
    loadComponents();
  };

  const handleToSite = async (component) => {
    try {
      await supabase.rpc('increment_site_qty', { p_ident_code: component.ident_code, p_qty: component.quantity });
      await supabase.from('request_components')
        .update({ status: 'WH_Site', forecast_date: null })
        .eq('id', component.id);
      await supabase.from('movements').insert({
        ident_code: component.ident_code, movement_type: 'IN', quantity: component.quantity,
        from_location: component.order_type === 'Internal' ? 'INTERNAL' : 'CLIENT', to_location: 'SITE', 
        performed_by: user.full_name, note: `Spare Parts - ${component.order_type || 'Client'} Delivery`
      });
      await logHistory(component.id, 'Delivered - To Site', 'Spare', 'WH_Site', '');
      loadComponents();
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  const handleToYard = async (component) => {
    try {
      await supabase.rpc('increment_yard_qty', { p_ident_code: component.ident_code, p_qty: component.quantity });
      await supabase.from('request_components')
        .update({ status: 'Yard', forecast_date: null })
        .eq('id', component.id);
      await supabase.from('movements').insert({
        ident_code: component.ident_code, movement_type: 'IN', quantity: component.quantity,
        from_location: component.order_type === 'Internal' ? 'INTERNAL' : 'CLIENT', to_location: 'YARD', 
        performed_by: user.full_name, note: `Spare Parts - ${component.order_type || 'Client'} Delivery`
      });
      await logHistory(component.id, 'Delivered - To Yard', 'Spare', 'Yard', '');
      loadComponents();
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  const handleReturn = async (component) => {
    await supabase.from('request_components')
      .update({ status: 'Eng', forecast_date: null })
      .eq('id', component.id);
    await logHistory(component.id, 'Returned to Engineering', 'Spare', 'Eng', '');
    loadComponents();
  };

  const handleDelete = async (component) => {
    if (confirm('Delete this component?')) {
      await supabase.from('request_components')
        .update({ status: 'Cancelled', forecast_date: null })
        .eq('id', component.id);
      await logHistory(component.id, 'Cancelled', 'Spare', 'Cancelled', '');
      loadComponents();
    }
  };

  // V28.3: Handle dropdown action
  const handleAction = (component, actionId) => {
    switch (actionId) {
      case 'setDate': openClientModal(component); break;
      case 'toSite': handleToSite(component); break;
      case 'toYard': handleToYard(component); break;
      case 'return': handleReturn(component); break;
      case 'delete': handleDelete(component); break;
    }
  };

  const canModify = canModifyPage(user, 'spare_parts');

  const filterComponents = (comps) => {
    if (!searchTerm) return comps;
    const term = searchTerm.toLowerCase();
    return comps.filter(c =>
      c.ident_code?.toLowerCase().includes(term) ||
      c.description?.toLowerCase().includes(term) ||
      String(c.requests?.request_number).includes(term)
    );
  };

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading...</div>;

  const filteredInternal = filterComponents(internalComponents);
  const filteredClient = filterComponents(clientComponents);

  // Render table for a section
  const renderTable = (components, sectionType) => (
    <table style={styles.table}>
      <thead>
        <tr>
          <th style={styles.th}>Cat</th>
          <th style={styles.th}>Sub</th>
          <th style={styles.th}>ISO</th>
          <th style={styles.th}>Spool</th>
          <th style={styles.th}>Request</th>
          <th style={styles.th}>Code</th>
          <th style={styles.th}>Description</th>
          <th style={styles.th}>Qty</th>
          <th style={styles.th}>Expected</th>
          <th style={styles.th}>Actions</th>
        </tr>
      </thead>
      <tbody>
        {components.map(comp => {
          const overdue = comp.forecast_date && isOverdue(comp.forecast_date);
          return (
            <tr key={comp.id} style={{ backgroundColor: overdue ? COLORS.alertRed : 'transparent' }}>
              <td style={styles.td}>{abbrevCategory(comp.requests?.request_type)}</td>
              <td style={styles.td}>{abbrevSubCategory(comp.sub_category || comp.requests?.sub_category)}</td>
              <td style={{ ...styles.td, fontSize: '11px' }}>{comp.requests?.iso_number || '-'}</td>
              <td style={{ ...styles.td, fontSize: '11px' }}>{comp.requests?.full_spool_number || '-'}</td>
              <td style={{ ...styles.td, fontFamily: 'monospace', fontWeight: '600' }}>
                {displayRequestNumber(comp.requests)}
              </td>
              <td style={{ ...styles.td, fontFamily: 'monospace', fontSize: '11px' }}>{comp.ident_code}</td>
              <td style={{ ...styles.td, maxWidth: '150px', overflow: 'hidden', textOverflow: 'ellipsis' }} title={comp.description}>
                {comp.description ? (comp.description.length > 30 ? comp.description.substring(0, 30) + '...' : comp.description) : '-'}
              </td>
              <td style={styles.td}>{comp.quantity}</td>
              <td style={styles.td}>
                {comp.forecast_date ? (
                  <span>
                    {new Date(comp.forecast_date).toLocaleDateString()}
                    {overdue && <OverdueBadge />}
                  </span>
                ) : (
                  <span style={{ color: '#9ca3af' }}>Not set</span>
                )}
              </td>
              <td style={styles.td}>
                <ActionDropdown
                  actions={[
                    { id: 'setDate', icon: '📅', label: 'Set Expected Date' },
                    { id: 'toSite', icon: '📦', label: 'To Site' },
                    { id: 'toYard', icon: '🏭', label: 'To Yard' },
                    { id: 'return', icon: '↩️', label: 'Return to Eng' },
                    { id: 'delete', icon: '🗑️', label: 'Delete' }
                  ]}
                  onExecute={(action) => handleAction(comp, action)}
                  disabled={!canModify}
                  componentId={comp.id}
                />
              </td>
            </tr>
          );
        })}
        {components.length === 0 && (
          <tr><td colSpan="10" style={{ ...styles.td, textAlign: 'center', color: '#9ca3af' }}>No components</td></tr>
        )}
      </tbody>
    </table>
  );

  return (
    <div>
      <SearchBox value={searchTerm} onChange={setSearchTerm} placeholder="Search code, description, request..." />

      {/* INTERNAL SECTION (TOP) */}
      <div style={{ ...styles.card, marginBottom: '24px' }}>
        <div style={{ ...styles.cardHeader, backgroundColor: '#EFF6FF', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontWeight: '600', color: '#1E40AF' }}>🏢 Internal Spare Parts ({filteredInternal.length})</h3>
          <button
            onClick={() => {
              const printWindow = window.open('', '_blank');
              printWindow.document.write(`
                <html><head><title>Internal Spare Parts</title>
                <style>
                  body { font-family: Arial, sans-serif; padding: 20px; }
                  h1 { color: #1E40AF; }
                  table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                  th, td { border: 1px solid #ddd; padding: 6px; text-align: left; font-size: 10px; }
                  th { background-color: #EFF6FF; }
                  .overdue { color: #DC2626; font-weight: bold; }
                </style></head><body>
                <h1>🏢 Internal Spare Parts</h1>
                <p>Printed: ${new Date().toLocaleString()} | Total: ${filteredInternal.length}</p>
                <table>
                  <tr><th>Cat</th><th>Sub</th><th>ISO</th><th>Spool</th><th>Request</th><th>Code</th><th>Description</th><th>Qty</th><th>Expected</th></tr>
                  ${filteredInternal.map(comp => `<tr>
                    <td>${abbrevCategory(comp.requests?.request_type)}</td>
                    <td>${abbrevSubCategory(comp.sub_category || comp.requests?.sub_category)}</td>
                    <td>${comp.requests?.iso_number || '-'}</td>
                    <td>${comp.requests?.full_spool_number || '-'}</td>
                    <td>${displayRequestNumber(comp.requests)}</td>
                    <td>${comp.ident_code}</td>
                    <td>${comp.description || '-'}</td>
                    <td>${comp.quantity}</td>
                    <td class="${comp.forecast_date && new Date(comp.forecast_date) < new Date() ? 'overdue' : ''}">${comp.forecast_date ? new Date(comp.forecast_date).toLocaleDateString() : 'Not set'}</td>
                  </tr>`).join('')}
                </table>
                </body></html>
              `);
              printWindow.document.close();
              printWindow.print();
            }}
            style={{ ...styles.button, backgroundColor: COLORS.purple, color: 'white' }}
          >
            🖨️ Print
          </button>
        </div>
        <div style={{ overflowX: 'auto' }}>
          {renderTable(filteredInternal, 'Internal')}
        </div>
      </div>

      {/* CLIENT SECTION (BOTTOM) */}
      <div style={styles.card}>
        <div style={{ ...styles.cardHeader, backgroundColor: '#F0FDFA', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontWeight: '600', color: '#0F766E' }}>👤 Client Spare Parts ({filteredClient.length})</h3>
          <button
            onClick={() => {
              const printWindow = window.open('', '_blank');
              printWindow.document.write(`
                <html><head><title>Client Spare Parts</title>
                <style>
                  body { font-family: Arial, sans-serif; padding: 20px; }
                  h1 { color: #0F766E; }
                  table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                  th, td { border: 1px solid #ddd; padding: 6px; text-align: left; font-size: 10px; }
                  th { background-color: #F0FDFA; }
                  .overdue { color: #DC2626; font-weight: bold; }
                </style></head><body>
                <h1>👤 Client Spare Parts</h1>
                <p>Printed: ${new Date().toLocaleString()} | Total: ${filteredClient.length}</p>
                <table>
                  <tr><th>Cat</th><th>Sub</th><th>ISO</th><th>Spool</th><th>Request</th><th>Code</th><th>Description</th><th>Qty</th><th>Expected</th></tr>
                  ${filteredClient.map(comp => `<tr>
                    <td>${abbrevCategory(comp.requests?.request_type)}</td>
                    <td>${abbrevSubCategory(comp.sub_category || comp.requests?.sub_category)}</td>
                    <td>${comp.requests?.iso_number || '-'}</td>
                    <td>${comp.requests?.full_spool_number || '-'}</td>
                    <td>${displayRequestNumber(comp.requests)}</td>
                    <td>${comp.ident_code}</td>
                    <td>${comp.description || '-'}</td>
                    <td>${comp.quantity}</td>
                    <td class="${comp.forecast_date && new Date(comp.forecast_date) < new Date() ? 'overdue' : ''}">${comp.forecast_date ? new Date(comp.forecast_date).toLocaleDateString() : 'Not set'}</td>
                  </tr>`).join('')}
                </table>
                </body></html>
              `);
              printWindow.document.close();
              printWindow.print();
            }}
            style={{ ...styles.button, backgroundColor: COLORS.purple, color: 'white' }}
          >
            🖨️ Print
          </button>
        </div>
        <div style={{ overflowX: 'auto' }}>
          {renderTable(filteredClient, 'Client')}
        </div>
      </div>

      {/* Date Modal */}
      <Modal isOpen={showClientModal} onClose={() => setShowClientModal(false)} title="Set Expected Delivery Date">
        <p style={{ marginBottom: '16px' }}><strong>{selectedComponent?.ident_code}</strong> - Qty: {selectedComponent?.quantity}</p>
        <div style={{ marginBottom: '16px' }}>
          <label style={styles.label}>Expected Delivery Date *</label>
          <input type="date" value={forecastDate} onChange={(e) => setForecastDate(e.target.value)} style={styles.input} />
        </div>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          <button onClick={() => setShowClientModal(false)} style={{ ...styles.button, ...styles.buttonSecondary }}>Cancel</button>
          <button onClick={submitClientConfirmation} style={{ ...styles.button, backgroundColor: COLORS.success, color: 'white' }}>Confirm</button>
        </div>
      </Modal>
    </div>
  );
}

// ============================================================
// ORDERS PAGE - V28.2 with Internal/Client split, delete, back, dropdown
// ============================================================
function OrdersPage({ user }) {
  const [activeTab, setActiveTab] = useState('toOrder');
  const [toOrderComponents, setToOrderComponents] = useState([]);
  const [orderedComponents, setOrderedComponents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [selectedComponent, setSelectedComponent] = useState(null);
  const [orderDate, setOrderDate] = useState(new Date().toISOString().split('T')[0]);
  const [expectedDate, setExpectedDate] = useState('');
  const [orderQty, setOrderQty] = useState(''); // V32.3: Quantity to order
  // V29.0: Label print modal
  const [showLabelModal, setShowLabelModal] = useState(false);
  const [selectedForLabel, setSelectedForLabel] = useState(null);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    setLoading(true);
    const { data: toOrder } = await supabase.from('request_components')
      .select(`*, requests (request_number, sub_number, sub_category, request_type, iso_number, full_spool_number, hf_number, test_pack_number, description, created_by_name, requester_user_id)`)
      .eq('status', 'Order');
    const { data: ordered } = await supabase.from('request_components')
      .select(`*, requests (request_number, sub_number, sub_category, request_type, iso_number, full_spool_number, hf_number, test_pack_number, description, created_by_name, requester_user_id)`)
      .eq('status', 'Ordered');
    
    // V29.0: Enrich with requester names for old requests
    const allData = [...(toOrder || []), ...(ordered || [])];
    const userIdsToLookup = [...new Set(
      allData.filter(r => r.requests?.requester_user_id && !r.requests?.created_by_name)
             .map(r => r.requests.requester_user_id)
    )];
    let userNameMap = {};
    if (userIdsToLookup.length > 0) {
      const { data: usersData } = await supabase.from('users').select('id, full_name').in('id', userIdsToLookup);
      if (usersData) userNameMap = Object.fromEntries(usersData.map(u => [u.id, u.full_name]));
    }
    const enrichRequest = (r) => ({
      ...r,
      requests: r.requests ? { ...r.requests, created_by_name: r.requests.created_by_name || userNameMap[r.requests.requester_user_id] || null } : null
    });
    
    if (toOrder) setToOrderComponents(toOrder.map(enrichRequest));
    if (ordered) setOrderedComponents(ordered.map(enrichRequest));
    setLoading(false);
  };

  const logHistory = async (compId, action, fromStatus, toStatus, note) => {
    await supabase.from('component_history').insert({
      component_id: compId, action, from_status: fromStatus, to_status: toStatus,
      performed_by_user_id: user.id, performed_by_name: user.full_name, note
    });
  };

  const openOrderModal = (component) => {
    setSelectedComponent(component);
    setOrderDate(new Date().toISOString().split('T')[0]);
    setExpectedDate('');
    setOrderQty(component.quantity.toString()); // V32.3: Default to requested qty
    setShowOrderModal(true);
  };

  // V32.3: Submit order with quantity
  const submitOrder = async () => {
    const qtyToOrder = parseInt(orderQty) || selectedComponent.quantity;
    if (qtyToOrder <= 0) {
      alert('Quantity must be at least 1');
      return;
    }
    
    // Update component with ordered quantity
    await supabase.from('request_components')
      .update({ 
        status: 'Ordered', 
        quantity: qtyToOrder, // V32.3: Use specified quantity
        order_date: orderDate, 
        order_forecast: expectedDate || null 
      })
      .eq('id', selectedComponent.id);
    
    await supabase.from('order_log').insert({ 
      ident_code: selectedComponent.ident_code, 
      quantity: qtyToOrder, 
      order_type: selectedComponent.order_type || 'Internal', 
      order_date: orderDate, 
      expected_date: expectedDate || null, 
      ordered_by: user.full_name 
    });
    
    await logHistory(selectedComponent.id, 'Order Placed', 'Order', 'Ordered', 
      `Qty: ${qtyToOrder}, Type: ${selectedComponent.order_type || 'Internal'}, Expected: ${expectedDate || 'TBD'}`);
    
    await supabase.from('movements').insert({ 
      ident_code: selectedComponent.ident_code, 
      movement_type: 'ORDER', 
      quantity: qtyToOrder, 
      from_location: 'ORDER', 
      to_location: 'SUPPLIER', 
      performed_by: user.full_name 
    });
    
    setShowOrderModal(false);
    loadData();
  };

  // V28: Receive order and send To Site
  const handleReceivedToSite = async (component) => {
    try {
      await supabase.rpc('increment_site_qty', { p_ident_code: component.ident_code, p_qty: component.quantity });
      await supabase.from('request_components')
        .update({ status: 'WH_Site', order_forecast: null })
        .eq('id', component.id);
      await supabase.from('movements').insert({
        ident_code: component.ident_code, movement_type: 'IN', quantity: component.quantity,
        from_location: 'SUPPLIER', to_location: 'SITE', performed_by: user.full_name, note: 'Order Received'
      });
      await logHistory(component.id, 'Order Received - To Site', 'Ordered', 'WH_Site', '');
      loadData();
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  // V28: Receive order and send To Yard
  const handleReceivedToYard = async (component) => {
    try {
      await supabase.rpc('increment_yard_qty', { p_ident_code: component.ident_code, p_qty: component.quantity });
      await supabase.from('request_components')
        .update({ status: 'Yard', order_forecast: null })
        .eq('id', component.id);
      await supabase.from('movements').insert({
        ident_code: component.ident_code, movement_type: 'IN', quantity: component.quantity,
        from_location: 'SUPPLIER', to_location: 'YARD', performed_by: user.full_name, note: 'Order Received'
      });
      await logHistory(component.id, 'Order Received - To Yard', 'Ordered', 'Yard', '');
      loadData();
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  // V28.2: Back to To Order (from Ordered)
  const handleBackToOrder = async (component) => {
    await supabase.from('request_components')
      .update({ status: 'Order', order_date: null, order_forecast: null })
      .eq('id', component.id);
    await logHistory(component.id, 'Back to To Order', 'Ordered', 'Order', '');
    loadData();
  };

  // V28.2: Delete
  const handleDelete = async (component, fromStatus) => {
    if (confirm('Delete this component?')) {
      await supabase.from('request_components')
        .update({ status: 'Cancelled' })
        .eq('id', component.id);
      await logHistory(component.id, 'Cancelled', fromStatus, 'Cancelled', '');
      loadData();
    }
  };

  // V28.2: Handle action from dropdown
  const handleAction = async (component, action, fromStatus) => {
    switch (action) {
      case 'order':
        openOrderModal(component);
        break;
      case 'toSite':
        await handleReceivedToSite(component);
        break;
      case 'toYard':
        await handleReceivedToYard(component);
        break;
      case 'back':
        await handleBackToOrder(component);
        break;
      case 'delete':
        await handleDelete(component, fromStatus);
        break;
    }
  };

  const canModify = canModifyPage(user, 'orders');

  const filterComponents = (comps) => {
    if (!searchTerm) return comps;
    const term = searchTerm.toLowerCase();
    return comps.filter(c =>
      c.ident_code?.toLowerCase().includes(term) ||
      c.description?.toLowerCase().includes(term) ||
      String(c.requests?.request_number).includes(term) ||
      (c.order_type || '').toLowerCase().includes(term)
    );
  };

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading...</div>;

  const filteredToOrder = filterComponents(toOrderComponents);
  const filteredOrdered = filterComponents(orderedComponents);

  // Split by order_type
  const toOrderInternal = filteredToOrder.filter(c => c.order_type !== 'Client');
  const toOrderClient = filteredToOrder.filter(c => c.order_type === 'Client');
  const orderedInternal = filteredOrdered.filter(c => c.order_type !== 'Client');
  const orderedClient = filteredOrdered.filter(c => c.order_type === 'Client');

  // Render table for To Order
  const renderToOrderTable = (components) => (
    <table style={styles.table}>
      <thead>
        <tr>
          <th style={styles.th}>Cat</th>
          <th style={styles.th}>ISO</th>
          <th style={styles.th}>Request</th>
          <th style={styles.th}>Code</th>
          <th style={styles.th}>Description</th>
          <th style={styles.th}>Qty</th>
          <th style={styles.th}>Type</th>
          <th style={styles.th}>Actions</th>
        </tr>
      </thead>
      <tbody>
        {components.map(comp => (
          <tr key={comp.id}>
            <td style={styles.td}>{abbrevCategory(comp.requests?.request_type)}</td>
            <td style={{ ...styles.td, fontSize: '11px' }}>{comp.requests?.iso_number || '-'}</td>
            <td style={{ ...styles.td, fontFamily: 'monospace', fontWeight: '600' }}>
              {displayRequestNumber(comp.requests)}
            </td>
            <td style={{ ...styles.td, fontFamily: 'monospace', fontSize: '11px' }}>{comp.ident_code}</td>
            <td style={{ ...styles.td, maxWidth: '150px', overflow: 'hidden', textOverflow: 'ellipsis' }} title={comp.description}>
              {comp.description ? (comp.description.length > 30 ? comp.description.substring(0, 30) + '...' : comp.description) : '-'}
            </td>
            <td style={styles.td}>{comp.quantity}</td>
            <td style={styles.td}>
              <span style={{ ...styles.statusBadge, backgroundColor: comp.order_type === 'Client' ? COLORS.cyan : COLORS.info }}>
                {comp.order_type || 'Internal'}
              </span>
            </td>
            <td style={styles.td}>
              <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                <ActionDropdown
                  actions={[
                    { id: 'order', icon: '🛒', label: 'Place Order' },
                    { id: 'delete', icon: '🗑️', label: 'Delete' }
                  ]}
                  onExecute={(action) => handleAction(comp, action, 'Order')}
                  disabled={!canModify}
                  componentId={comp.id}
                />
              </div>
            </td>
          </tr>
        ))}
        {components.length === 0 && (
          <tr><td colSpan="8" style={{ ...styles.td, textAlign: 'center', color: '#9ca3af' }}>No items</td></tr>
        )}
      </tbody>
    </table>
  );

  // Render table for Ordered
  const renderOrderedTable = (components) => (
    <table style={styles.table}>
      <thead>
        <tr>
          <th style={styles.th}>Cat</th>
          <th style={styles.th}>ISO</th>
          <th style={styles.th}>Request</th>
          <th style={styles.th}>Code</th>
          <th style={styles.th}>Description</th>
          <th style={styles.th}>Qty</th>
          <th style={styles.th}>Type</th>
          <th style={styles.th}>Order Date</th>
          <th style={styles.th}>Forecast</th>
          <th style={styles.th}>Actions</th>
          <th style={styles.th}>🏷️</th>
        </tr>
      </thead>
      <tbody>
        {components.map(comp => {
          const overdue = isOverdue(comp.order_forecast);
          return (
            <tr key={comp.id} style={{ backgroundColor: overdue ? COLORS.alertRed : 'transparent' }}>
              <td style={styles.td}>{abbrevCategory(comp.requests?.request_type)}</td>
              <td style={{ ...styles.td, fontSize: '11px' }}>{comp.requests?.iso_number || '-'}</td>
              <td style={{ ...styles.td, fontFamily: 'monospace', fontWeight: '600' }}>
                {displayRequestNumber(comp.requests)}
              </td>
              <td style={{ ...styles.td, fontFamily: 'monospace', fontSize: '11px' }}>{comp.ident_code}</td>
              <td style={{ ...styles.td, maxWidth: '150px', overflow: 'hidden', textOverflow: 'ellipsis' }} title={comp.description}>
                {comp.description ? (comp.description.length > 30 ? comp.description.substring(0, 30) + '...' : comp.description) : '-'}
              </td>
              <td style={styles.td}>{comp.quantity}</td>
              <td style={styles.td}>
                <span style={{ ...styles.statusBadge, backgroundColor: comp.order_type === 'Client' ? COLORS.cyan : COLORS.info }}>
                  {comp.order_type || 'Internal'}
                </span>
              </td>
              <td style={styles.td}>{comp.order_date ? new Date(comp.order_date).toLocaleDateString() : '-'}</td>
              <td style={styles.td}>
                {comp.order_forecast ? new Date(comp.order_forecast).toLocaleDateString() : '-'}
                {overdue && <OverdueBadge />}
              </td>
              <td style={styles.td}>
                <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                  <ActionDropdown
                    actions={[
                      { id: 'toYard', icon: '🏭', label: 'Received → Yard' },
                      { id: 'back', icon: '↩️', label: 'Back to To Order' },
                      { id: 'delete', icon: '🗑️', label: 'Delete' }
                    ]}
                    onExecute={(action) => handleAction(comp, action, 'Ordered')}
                    disabled={!canModify}
                    componentId={comp.id}
                  />
                </div>
              </td>
              <td style={{ ...styles.td, textAlign: 'center' }}>
                <button
                  onClick={() => { setSelectedForLabel({...comp, status: 'Ordered'}); setShowLabelModal(true); }}
                  style={{ 
                    padding: '4px 8px', 
                    border: 'none', 
                    borderRadius: '4px', 
                    backgroundColor: COLORS.warning, 
                    color: 'white', 
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}
                  title="Print Label"
                >
                  🏷️
                </button>
              </td>
            </tr>
          );
        })}
        {components.length === 0 && (
          <tr><td colSpan="11" style={{ ...styles.td, textAlign: 'center', color: '#9ca3af' }}>No items</td></tr>
        )}
      </tbody>
    </table>
  );

  return (
    <div>
      <SearchBox value={searchTerm} onChange={setSearchTerm} placeholder="Search code, description, request, type..." />

      <div style={{ display: 'flex', gap: '4px', marginBottom: '16px' }}>
        {[
          { id: 'toOrder', label: `To Order (${toOrderComponents.length})` },
          { id: 'ordered', label: `Ordered (${orderedComponents.length})` }
        ].map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{ ...styles.button, backgroundColor: activeTab === tab.id ? 'white' : '#e5e7eb', color: activeTab === tab.id ? '#1f2937' : '#6b7280', borderRadius: '8px 8px 0 0', fontWeight: activeTab === tab.id ? '600' : '400' }}>{tab.label}</button>
        ))}
      </div>

      {activeTab === 'toOrder' && (
        <>
          {/* Internal Section */}
          <div style={{ ...styles.card, marginBottom: '24px' }}>
            <div style={{ ...styles.cardHeader, backgroundColor: '#EFF6FF', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontWeight: '600', color: '#1E40AF' }}>🏢 Internal Orders ({toOrderInternal.length})</h3>
              <button
                onClick={() => {
                  const printWindow = window.open('', '_blank');
                  printWindow.document.write(`
                    <html><head><title>Internal Orders - To Order</title>
                    <style>body { font-family: Arial, sans-serif; padding: 20px; } h1 { color: #1E40AF; } table { width: 100%; border-collapse: collapse; margin-top: 20px; } th, td { border: 1px solid #ddd; padding: 6px; text-align: left; font-size: 10px; } th { background-color: #EFF6FF; }</style></head><body>
                    <h1>🏢 Internal Orders - To Order</h1>
                    <p>Printed: ${new Date().toLocaleString()} | Total: ${toOrderInternal.length}</p>
                    <table><tr><th>Cat</th><th>ISO</th><th>Request</th><th>Code</th><th>Description</th><th>Qty</th></tr>
                    ${toOrderInternal.map(c => `<tr><td>${c.requests?.request_type || '-'}</td><td>${c.requests?.iso_number || '-'}</td><td>${String(c.requests?.request_number).padStart(5, '0')}-${c.requests?.sub_number}</td><td>${c.ident_code}</td><td>${c.description || '-'}</td><td>${c.quantity}</td></tr>`).join('')}
                    </table></body></html>
                  `);
                  printWindow.document.close();
                  printWindow.print();
                }}
                style={{ ...styles.button, backgroundColor: COLORS.purple, color: 'white' }}
              >🖨️ Print</button>
            </div>
            <div style={{ overflowX: 'auto' }}>{renderToOrderTable(toOrderInternal)}</div>
          </div>
          {/* Client Section */}
          <div style={styles.card}>
            <div style={{ ...styles.cardHeader, backgroundColor: '#F0FDFA', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontWeight: '600', color: '#0F766E' }}>👤 Client Orders ({toOrderClient.length})</h3>
              <button
                onClick={() => {
                  const printWindow = window.open('', '_blank');
                  printWindow.document.write(`
                    <html><head><title>Client Orders - To Order</title>
                    <style>body { font-family: Arial, sans-serif; padding: 20px; } h1 { color: #0F766E; } table { width: 100%; border-collapse: collapse; margin-top: 20px; } th, td { border: 1px solid #ddd; padding: 6px; text-align: left; font-size: 10px; } th { background-color: #F0FDFA; }</style></head><body>
                    <h1>👤 Client Orders - To Order</h1>
                    <p>Printed: ${new Date().toLocaleString()} | Total: ${toOrderClient.length}</p>
                    <table><tr><th>Cat</th><th>ISO</th><th>Request</th><th>Code</th><th>Description</th><th>Qty</th></tr>
                    ${toOrderClient.map(c => `<tr><td>${c.requests?.request_type || '-'}</td><td>${c.requests?.iso_number || '-'}</td><td>${String(c.requests?.request_number).padStart(5, '0')}-${c.requests?.sub_number}</td><td>${c.ident_code}</td><td>${c.description || '-'}</td><td>${c.quantity}</td></tr>`).join('')}
                    </table></body></html>
                  `);
                  printWindow.document.close();
                  printWindow.print();
                }}
                style={{ ...styles.button, backgroundColor: COLORS.purple, color: 'white' }}
              >🖨️ Print</button>
            </div>
            <div style={{ overflowX: 'auto' }}>{renderToOrderTable(toOrderClient)}</div>
          </div>
        </>
      )}

      {activeTab === 'ordered' && (
        <>
          {/* Internal Section */}
          <div style={{ ...styles.card, marginBottom: '24px' }}>
            <div style={{ ...styles.cardHeader, backgroundColor: '#EFF6FF', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontWeight: '600', color: '#1E40AF' }}>🏢 Internal - Ordered ({orderedInternal.length})</h3>
              <button
                onClick={() => {
                  const printWindow = window.open('', '_blank');
                  printWindow.document.write(`
                    <html><head><title>Internal - Ordered</title>
                    <style>body { font-family: Arial, sans-serif; padding: 20px; } h1 { color: #1E40AF; } table { width: 100%; border-collapse: collapse; margin-top: 20px; } th, td { border: 1px solid #ddd; padding: 6px; text-align: left; font-size: 10px; } th { background-color: #EFF6FF; } .overdue { color: #DC2626; }</style></head><body>
                    <h1>🏢 Internal - Ordered</h1>
                    <p>Printed: ${new Date().toLocaleString()} | Total: ${orderedInternal.length}</p>
                    <table><tr><th>Cat</th><th>ISO</th><th>Request</th><th>Code</th><th>Description</th><th>Qty</th><th>Order Date</th><th>Forecast</th></tr>
                    ${orderedInternal.map(c => `<tr><td>${c.requests?.request_type || '-'}</td><td>${c.requests?.iso_number || '-'}</td><td>${String(c.requests?.request_number).padStart(5, '0')}-${c.requests?.sub_number}</td><td>${c.ident_code}</td><td>${c.description || '-'}</td><td>${c.quantity}</td><td>${c.order_date ? new Date(c.order_date).toLocaleDateString() : '-'}</td><td class="${c.order_forecast && new Date(c.order_forecast) < new Date() ? 'overdue' : ''}">${c.order_forecast ? new Date(c.order_forecast).toLocaleDateString() : '-'}</td></tr>`).join('')}
                    </table></body></html>
                  `);
                  printWindow.document.close();
                  printWindow.print();
                }}
                style={{ ...styles.button, backgroundColor: COLORS.purple, color: 'white' }}
              >🖨️ Print</button>
            </div>
            <div style={{ overflowX: 'auto' }}>{renderOrderedTable(orderedInternal)}</div>
          </div>
          {/* Client Section */}
          <div style={styles.card}>
            <div style={{ ...styles.cardHeader, backgroundColor: '#F0FDFA', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontWeight: '600', color: '#0F766E' }}>👤 Client - Ordered ({orderedClient.length})</h3>
              <button
                onClick={() => {
                  const printWindow = window.open('', '_blank');
                  printWindow.document.write(`
                    <html><head><title>Client - Ordered</title>
                    <style>body { font-family: Arial, sans-serif; padding: 20px; } h1 { color: #0F766E; } table { width: 100%; border-collapse: collapse; margin-top: 20px; } th, td { border: 1px solid #ddd; padding: 6px; text-align: left; font-size: 10px; } th { background-color: #F0FDFA; } .overdue { color: #DC2626; }</style></head><body>
                    <h1>👤 Client - Ordered</h1>
                    <p>Printed: ${new Date().toLocaleString()} | Total: ${orderedClient.length}</p>
                    <table><tr><th>Cat</th><th>ISO</th><th>Request</th><th>Code</th><th>Description</th><th>Qty</th><th>Order Date</th><th>Forecast</th></tr>
                    ${orderedClient.map(c => `<tr><td>${c.requests?.request_type || '-'}</td><td>${c.requests?.iso_number || '-'}</td><td>${String(c.requests?.request_number).padStart(5, '0')}-${c.requests?.sub_number}</td><td>${c.ident_code}</td><td>${c.description || '-'}</td><td>${c.quantity}</td><td>${c.order_date ? new Date(c.order_date).toLocaleDateString() : '-'}</td><td class="${c.order_forecast && new Date(c.order_forecast) < new Date() ? 'overdue' : ''}">${c.order_forecast ? new Date(c.order_forecast).toLocaleDateString() : '-'}</td></tr>`).join('')}
                    </table></body></html>
                  `);
                  printWindow.document.close();
                  printWindow.print();
                }}
                style={{ ...styles.button, backgroundColor: COLORS.purple, color: 'white' }}
              >🖨️ Print</button>
            </div>
            <div style={{ overflowX: 'auto' }}>{renderOrderedTable(orderedClient)}</div>
          </div>
        </>
      )}

      <Modal isOpen={showOrderModal} onClose={() => setShowOrderModal(false)} title="Place Order">
        <p style={{ marginBottom: '8px' }}><strong>{selectedComponent?.ident_code}</strong></p>
        <p style={{ marginBottom: '16px', fontSize: '13px' }}>
          Type: <span style={{ ...styles.statusBadge, backgroundColor: selectedComponent?.order_type === 'Client' ? COLORS.cyan : COLORS.info }}>
            {selectedComponent?.order_type || 'Internal'}
          </span>
        </p>
        
        {/* V32.3: Quantity to Order */}
        <div style={{ marginBottom: '16px' }}>
          <label style={styles.label}>Quantity to Order *</label>
          <input 
            type="number" 
            min="1"
            value={orderQty} 
            onChange={(e) => setOrderQty(e.target.value)} 
            style={styles.input} 
          />
          <p style={{ fontSize: '11px', color: '#6b7280', marginTop: '4px' }}>
            Requested: {selectedComponent?.quantity}
          </p>
        </div>
        
        <div style={{ marginBottom: '16px' }}><label style={styles.label}>Order Date *</label><input type="date" value={orderDate} onChange={(e) => setOrderDate(e.target.value)} style={styles.input} /></div>
        <div style={{ marginBottom: '16px' }}><label style={styles.label}>Expected Delivery Date</label><input type="date" value={expectedDate} onChange={(e) => setExpectedDate(e.target.value)} style={styles.input} /></div>
        
        <div style={{ backgroundColor: '#DBEAFE', padding: '12px', borderRadius: '8px', marginBottom: '16px', fontSize: '13px' }}>
          <strong>📦 Note:</strong> When received, material goes to <strong>WH Yard</strong>
        </div>
        
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          <button onClick={() => setShowOrderModal(false)} style={{ ...styles.button, ...styles.buttonSecondary }}>Cancel</button>
          <button onClick={submitOrder} style={{ ...styles.button, backgroundColor: COLORS.success, color: 'white' }}>Confirm Order</button>
        </div>
      </Modal>
      
      {/* V29.0: Label Print Modal */}
      <LabelPrintModal
        isOpen={showLabelModal}
        onClose={() => { setShowLabelModal(false); setSelectedForLabel(null); }}
        component={selectedForLabel}
      />
    </div>
  );
}

// ============================================================
// MANAGEMENT PAGE - V28 with mng_note display
// ============================================================
function ManagementPage({ user }) {
  const [components, setComponents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => { loadComponents(); }, []);

  const loadComponents = async () => {
    setLoading(true);
    const { data } = await supabase.from('request_components')
      .select(`*, requests (request_number, sub_number, request_number_full, level_component, level_wh_split, level_yard_split, sub_category, request_type, iso_number, full_spool_number, hf_number, test_pack_number, description)`)
      .eq('status', 'Mng');
    if (data) setComponents(data);
    setLoading(false);
  };

  const handleDecision = async (component, orderType) => {
    await supabase.from('request_components').update({ status: 'Order', order_type: orderType, mng_note: null }).eq('id', component.id);
    await supabase.from('component_history').insert({ component_id: component.id, action: `Management Decision: ${orderType}`, from_status: 'Mng', to_status: 'Order', performed_by_user_id: user.id, performed_by_name: user.full_name });
    loadComponents();
  };

  // V30.0: Handle all Management actions via dropdown
  const handleAction = async (component, action) => {
    try {
      if (action === 'internal') {
        await handleDecision(component, 'Internal');
      } else if (action === 'client') {
        await handleDecision(component, 'Client');
      } else if (action === 'return') {
        // Return to Engineering
        await supabase.from('request_components')
          .update({ status: 'Eng', mng_note: null })
          .eq('id', component.id);
        await supabase.from('component_history').insert({
          component_id: component.id,
          action: 'Returned from Management to Engineering',
          from_status: 'Mng',
          to_status: 'Eng',
          performed_by_user_id: user.id,
          performed_by_name: user.full_name
        });
        loadComponents();
      } else if (action === 'delete') {
        if (!window.confirm('Delete this component?')) return;
        await supabase.from('request_components')
          .update({ status: 'Deleted' })
          .eq('id', component.id);
        await supabase.from('component_history').insert({
          component_id: component.id,
          action: 'Deleted from Management',
          from_status: 'Mng',
          to_status: 'Deleted',
          performed_by_user_id: user.id,
          performed_by_name: user.full_name
        });
        loadComponents();
      }
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };

  const canModify = canModifyPage(user, 'management');

  // Filter by search
  const filterComponents = (comps) => {
    if (!searchTerm) return comps;
    const term = searchTerm.toLowerCase();
    return comps.filter(c =>
      c.ident_code?.toLowerCase().includes(term) ||
      c.description?.toLowerCase().includes(term) ||
      c.mng_note?.toLowerCase().includes(term) ||
      String(c.requests?.request_number).includes(term)
    );
  };

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading...</div>;

  const filteredComponents = filterComponents(components);

  return (
    <div>
      <SearchBox value={searchTerm} onChange={setSearchTerm} placeholder="Search code, description, note, request..." />

      <div style={styles.card}>
        <div style={{ ...styles.cardHeader, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontWeight: '600' }}>Management - Decisions ({components.length})</h3>
          <button
            onClick={() => {
              const printWindow = window.open('', '_blank');
              printWindow.document.write(`
                <html><head><title>Management Decisions</title>
                <style>
                  body { font-family: Arial, sans-serif; padding: 20px; }
                  h1 { color: #CA8A04; }
                  table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                  th, td { border: 1px solid #ddd; padding: 6px; text-align: left; font-size: 10px; }
                  th { background-color: #FEF9C3; }
                </style></head><body>
                <h1>👔 Management - Decisions</h1>
                <p>Printed: ${new Date().toLocaleString()} | Total: ${filteredComponents.length}</p>
                <table>
                  <tr><th>Cat</th><th>Sub</th><th>ISO</th><th>Spool</th><th>Request</th><th>Code</th><th>Description</th><th>Qty</th><th>Note</th></tr>
                  ${filteredComponents.map(comp => `<tr>
                    <td>${abbrevCategory(comp.requests?.request_type)}</td>
                    <td>${abbrevSubCategory(comp.sub_category || comp.requests?.sub_category)}</td>
                    <td>${comp.requests?.iso_number || '-'}</td>
                    <td>${comp.requests?.full_spool_number || '-'}</td>
                    <td>${displayRequestNumber(comp.requests)}</td>
                    <td>${comp.ident_code}</td>
                    <td>${comp.description || '-'}</td>
                    <td>${comp.quantity}</td>
                    <td>${comp.mng_note || '-'}</td>
                  </tr>`).join('')}
                </table>
                </body></html>
              `);
              printWindow.document.close();
              printWindow.print();
            }}
            style={{ ...styles.button, backgroundColor: COLORS.purple, color: 'white' }}
          >
            🖨️ Print
          </button>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Cat</th>
                <th style={styles.th}>Sub</th>
                <th style={styles.th}>ISO</th>
                <th style={styles.th}>Spool</th>
                <th style={styles.th}>HF</th>
                <th style={styles.th}>TP</th>
                  <th style={styles.th}>Request</th>
                <th style={styles.th}>Code</th>
                <th style={styles.th}>Description</th>
                <th style={styles.th}>Tag</th>
                <th style={styles.th}>Diam</th>
                <th style={styles.th}>Qty</th>
                <th style={styles.th}>Note</th>
                <th style={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredComponents.map(comp => (
                <tr key={comp.id}>
                  <td style={styles.td}>{abbrevCategory(comp.requests?.request_type)}</td>
                  <td style={styles.td}>{abbrevSubCategory(comp.sub_category || comp.requests?.sub_category)}</td>
                  <td style={{ ...styles.td, fontSize: '11px' }}>{comp.requests?.iso_number || comp.iso_number || '-'}</td>
                  <td style={{ ...styles.td, fontSize: '11px' }}>{abbrevSpool(comp.requests?.full_spool_number || comp.full_spool_number)}</td>
                  <td style={styles.td}>{comp.requests?.hf_number || '-'}</td>
                  <td style={styles.td}>{comp.requests?.test_pack_number || '-'}</td>
                  <td style={{ ...styles.td, fontFamily: 'monospace', fontWeight: '600' }}>{displayRequestNumber(comp.requests)}</td>
                  <td style={{ ...styles.td, fontFamily: 'monospace', fontSize: '11px' }}>{comp.ident_code}</td>
                  <td style={{ ...styles.td, maxWidth: '180px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={comp.description || ''}>
                    {comp.description ? (comp.description.length > 40 ? comp.description.substring(0, 40) + '...' : comp.description) : '-'}
                  </td>
                  <td style={styles.td}>{comp.tag || '-'}</td>
                  <td style={styles.td}>{comp.dia1 || '-'}</td>
                  <td style={styles.td}>{comp.quantity}</td>
                  <td style={styles.td}>
                    {comp.mng_note ? (
                      <NoteIcon note={comp.mng_note} />
                    ) : null}
                  </td>
                  <td style={styles.td}>
                    <ActionDropdown
                      actions={[
                        { id: 'internal', icon: '🏢', label: 'Internal Order' },
                        { id: 'client', icon: '👤', label: 'Client Order' },
                        { id: 'return', icon: '↩️', label: 'Return to Engineering' },
                        { id: 'delete', icon: '🗑️', label: 'Delete' }
                      ]}
                      onExecute={(action) => handleAction(comp, action)}
                      disabled={!canModify}
                      componentId={comp.id}
                    />
                  </td>
                </tr>
              ))}
              {filteredComponents.length === 0 && <tr><td colSpan="13" style={{ ...styles.td, textAlign: 'center', color: '#9ca3af' }}>No decisions pending</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// MIR PAGE - V27 with Priority, Close functionality, and Tabs
// ============================================================
function MIRPage({ user }) {
  const [mirs, setMirs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [mirType, setMirType] = useState('Piping');
  const [mirNumber, setMirNumber] = useState('');
  const [rkNumber, setRkNumber] = useState('');
  const [category, setCategory] = useState('Bulk');
  const [forecastDate, setForecastDate] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [mirDescription, setMirDescription] = useState('');
  const [activeTab, setActiveTab] = useState('open');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => { loadMirs(); }, []);

  const loadMirs = async () => {
    setLoading(true);
    const { data } = await supabase.from('mirs').select('*').order('created_at', { ascending: false });
    if (data) setMirs(data);
    setLoading(false);
  };

  const openCreateModal = () => {
    setMirType('Piping');
    setMirNumber('');
    setRkNumber('');
    setCategory('Bulk');
    setForecastDate('');
    setPriority('Medium');
    setMirDescription('');
    setShowCreateModal(true);
  };

  const createMir = async () => {
    // Validation
    if (mirType === 'Piping') {
      if (!mirNumber || mirNumber.length !== 4 || !/^\d{4}$/.test(mirNumber)) {
        alert('MIR Number must be exactly 4 digits!');
        return;
      }
    }
    if (!rkNumber || rkNumber.length !== 4 || !/^\d{4}$/.test(rkNumber)) {
      alert('RK Number must be exactly 4 digits!');
      return;
    }

    await supabase.from('mirs').insert({
      mir_type: mirType,
      mir_number: mirType === 'Piping' ? mirNumber : null,
      rk_number: rkNumber,
      category: mirType === 'Piping' ? category : null,
      forecast_date: forecastDate || null,
      priority: priority,
      description: mirDescription || null,
      created_by: user.id,
      status: 'Open'
    });

    setShowCreateModal(false);
    loadMirs();
  };

  // V27: Close MIR
  const closeMir = async (mir) => {
    if (!window.confirm(`Close MIR ${mir.mir_number || mir.rk_number}?`)) return;
    
    await supabase.from('mirs').update({
      status: 'Closed',
      closed_at: new Date().toISOString(),
      closed_by: user.id
    }).eq('id', mir.id);
    
    loadMirs();
  };

  // V28.9: Delete MIR
  const deleteMir = async (mir) => {
    if (!window.confirm(`Delete MIR ${mir.mir_number || mir.rk_number}? This cannot be undone.`)) return;
    
    await supabase.from('mirs').delete().eq('id', mir.id);
    
    loadMirs();
  };

  // V28.9: Handle MIR actions
  const handleMirAction = (mir, action) => {
    switch (action) {
      case 'close':
        closeMir(mir);
        break;
      case 'delete':
        deleteMir(mir);
        break;
    }
  };

  // V31.0: Download RK Document
  const [downloadingRK, setDownloadingRK] = useState(null);
  
  const handleDownloadRK = async (mir) => {
    setDownloadingRK(mir.id);
    try {
      const success = await generateRKDocument(
        mir.mir_number || '',
        mir.rk_number || '',
        mir.description || '',  // V31.0: Pass description for Mechanical type
        null
      );
      
      if (success) {
        // Update database with download info
        await supabase.from('mirs').update({
          rk_downloaded_at: new Date().toISOString(),
          rk_downloaded_by: user.id,
          rk_downloaded_by_name: user.full_name || user.email
        }).eq('id', mir.id);
        
        loadMirs();
      }
    } finally {
      setDownloadingRK(null);
    }
  };

  // V31.0: RK Download Info Tooltip component
  // V31.0: RK Download Info - Modal popup instead of tooltip
  const RKDownloadInfo = ({ mir }) => {
    const [showModal, setShowModal] = useState(false);
    
    // Gray icon if not downloaded
    if (!mir.rk_downloaded_at) {
      return (
        <span 
          style={{ 
            color: '#9ca3af', 
            cursor: 'help',
            fontSize: '16px'
          }}
          title="RK not downloaded yet"
        >
          ℹ️
        </span>
      );
    }
    
    // Green icon with click to show modal
    return (
      <>
        <span
          style={{ cursor: 'pointer' }}
          onClick={() => setShowModal(true)}
        >
          <span style={{ color: COLORS.success, fontSize: '16px' }}>ℹ️</span>
        </span>
        
        {/* Modal */}
        {showModal && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999
          }} onClick={() => setShowModal(false)}>
            <div style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '24px',
              minWidth: '320px',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
              position: 'relative'
            }} onClick={e => e.stopPropagation()}>
              {/* Close button */}
              <button
                onClick={() => setShowModal(false)}
                style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px',
                  background: 'none',
                  border: 'none',
                  fontSize: '20px',
                  cursor: 'pointer',
                  color: '#6b7280'
                }}
              >
                ✕
              </button>
              
              {/* Header */}
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '12px',
                marginBottom: '20px',
                paddingBottom: '16px',
                borderBottom: '1px solid #e5e7eb'
              }}>
                <span style={{ 
                  fontSize: '32px',
                  backgroundColor: '#DEF7EC',
                  borderRadius: '50%',
                  width: '48px',
                  height: '48px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>✅</span>
                <div>
                  <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '600', color: '#1f2937' }}>
                    RK Downloaded
                  </h3>
                  <p style={{ margin: 0, fontSize: '13px', color: '#6b7280' }}>
                    MIR {mir.mir_number || '-'} / RK {mir.rk_number}
                  </p>
                </div>
              </div>
              
              {/* Info */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '20px' }}>👤</span>
                  <div>
                    <div style={{ fontSize: '12px', color: '#6b7280' }}>Downloaded by</div>
                    <div style={{ fontWeight: '500', color: '#1f2937' }}>
                      {mir.rk_downloaded_by_name || 'Unknown'}
                    </div>
                  </div>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '20px' }}>📅</span>
                  <div>
                    <div style={{ fontSize: '12px', color: '#6b7280' }}>Date & Time</div>
                    <div style={{ fontWeight: '500', color: '#1f2937' }}>
                      {new Date(mir.rk_downloaded_at).toLocaleString('it-IT', {
                        day: '2-digit',
                        month: '2-digit', 
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Close button */}
              <button
                onClick={() => setShowModal(false)}
                style={{
                  marginTop: '24px',
                  width: '100%',
                  padding: '10px',
                  backgroundColor: COLORS.info,
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </>
    );
  };

  const canModify = canModifyPage(user, 'mir');

  // Filter MIRs by tab and search
  const openMirs = mirs.filter(m => m.status === 'Open');
  const closedMirs = mirs.filter(m => m.status === 'Closed');
  
  const filterMirs = (mirList) => {
    if (!searchTerm || searchTerm.trim() === '') return mirList;
    const term = searchTerm.toLowerCase().trim();
    return mirList.filter(m => {
      const mirNum = String(m.mir_number || '').toLowerCase();
      const rkNum = String(m.rk_number || '').toLowerCase();
      const cat = String(m.category || '').toLowerCase();
      const desc = String(m.description || '').toLowerCase();
      return mirNum.includes(term) || rkNum.includes(term) || cat.includes(term) || desc.includes(term);
    });
  };

  const displayedMirs = activeTab === 'open' ? filterMirs(openMirs) : filterMirs(closedMirs);

  const getPriorityColor = (p) => {
    if (p === 'High') return '#DC2626';
    if (p === 'Low') return '#16a34a';
    return '#D97706';
  };

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading...</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button 
            onClick={() => setActiveTab('open')}
            style={{ 
              ...styles.button, 
              backgroundColor: activeTab === 'open' ? COLORS.info : '#e5e7eb',
              color: activeTab === 'open' ? 'white' : '#374151'
            }}
          >
            📂 Open MIRs ({openMirs.length})
          </button>
          <button 
            onClick={() => setActiveTab('closed')}
            style={{ 
              ...styles.button, 
              backgroundColor: activeTab === 'closed' ? COLORS.success : '#e5e7eb',
              color: activeTab === 'closed' ? 'white' : '#374151'
            }}
          >
            ✅ Closed MIRs ({closedMirs.length})
          </button>
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search MIR#, RK#, Category..."
            style={{ ...styles.input, width: '250px' }}
          />
          <button
            onClick={() => {
              const printWindow = window.open('', '_blank');
              printWindow.document.write(`
                <html><head><title>MIR List</title>
                <style>
                  body { font-family: Arial, sans-serif; padding: 20px; }
                  h1 { color: #1F2937; }
                  table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                  th, td { border: 1px solid #ddd; padding: 8px; text-align: left; font-size: 11px; }
                  th { background-color: #F3F4F6; }
                  .high { color: #DC2626; font-weight: bold; }
                  .low { color: #16a34a; }
                </style></head><body>
                <h1>📋 Material Issue Reports - ${activeTab === 'open' ? 'Open' : 'Closed'}</h1>
                <p>Printed: ${new Date().toLocaleString()} | Total: ${displayedMirs.length}</p>
                <table>
                  <tr><th>Priority</th><th>Type</th><th>MIR #</th><th>RK #</th><th>Category</th><th>Description</th><th>Forecast</th><th>Status</th></tr>
                  ${displayedMirs.map(mir => `<tr>
                    <td class="${mir.priority === 'High' ? 'high' : mir.priority === 'Low' ? 'low' : ''}">${mir.priority}</td>
                    <td>${mir.mir_type}</td>
                    <td>${mir.mir_number || '-'}</td>
                    <td>${mir.rk_number}</td>
                    <td>${mir.category || '-'}</td>
                    <td>${mir.description || '-'}</td>
                    <td>${mir.forecast_date ? new Date(mir.forecast_date).toLocaleDateString() : '-'}</td>
                    <td>${mir.status}</td>
                  </tr>`).join('')}
                </table>
                </body></html>
              `);
              printWindow.document.close();
              printWindow.print();
            }}
            style={{ ...styles.button, backgroundColor: COLORS.purple, color: 'white' }}
          >
            🖨️ Print
          </button>
          <button onClick={openCreateModal} disabled={!canModify} style={{ ...styles.button, ...styles.buttonPrimary }}>+ New MIR</button>
        </div>
      </div>

      <div style={styles.card}>
        <div style={styles.cardHeader}>
          <h3 style={{ fontWeight: '600' }}>
            {activeTab === 'open' ? '📂 Open' : '✅ Closed'} Material Issue Reports ({displayedMirs.length})
          </h3>
        </div>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Priority</th>
              <th style={styles.th}>Type</th>
              <th style={styles.th}>MIR #</th>
              <th style={styles.th}>RK #</th>
              <th style={styles.th}>Category</th>
              <th style={styles.th}>Description</th>
              <th style={styles.th}>Forecast</th>
              <th style={{ ...styles.th, textAlign: 'center', width: '50px' }}>⚠️</th>
              <th style={styles.th}>Status</th>
              <th style={styles.th}>Created</th>
              {activeTab === 'open' && <th style={styles.th}>Actions</th>}
              {activeTab === 'closed' && <th style={styles.th}>Closed</th>}
              <th style={{ ...styles.th, textAlign: 'center', width: '50px' }}>📄</th>
              <th style={{ ...styles.th, textAlign: 'center', width: '50px' }}>ℹ️</th>
            </tr>
          </thead>
          <tbody>
            {displayedMirs.map(mir => (
              <tr key={mir.id}>
                <td style={styles.td}>
                  <span style={{ 
                    ...styles.statusBadge, 
                    backgroundColor: getPriorityColor(mir.priority || 'Medium')
                  }}>
                    {mir.priority || 'Medium'}
                  </span>
                </td>
                <td style={styles.td}>
                  <span style={{ ...styles.statusBadge, backgroundColor: mir.mir_type === 'Piping' ? COLORS.info : COLORS.purple }}>
                    {mir.mir_type || 'Piping'}
                  </span>
                </td>
                <td style={{ ...styles.td, fontFamily: 'monospace', fontWeight: '600' }}>{mir.mir_number || '-'}</td>
                <td style={{ ...styles.td, fontFamily: 'monospace', color: COLORS.info }}>{mir.rk_number || '-'}</td>
                <td style={styles.td}>{mir.category || '-'}</td>
                <td style={{ ...styles.td, maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={mir.description || ''}>{mir.description || '-'}</td>
                <td style={styles.td}>{mir.forecast_date ? new Date(mir.forecast_date).toLocaleDateString() : '-'}</td>
                <td style={{ ...styles.td, textAlign: 'center' }}>
                  {mir.forecast_date && isOverdue(mir.forecast_date) && (
                    <span title="Forecast date overdue!" style={{ fontSize: '18px', cursor: 'help' }}>⚠️</span>
                  )}
                </td>
                <td style={styles.td}>
                  <span style={{ 
                    ...styles.statusBadge, 
                    backgroundColor: mir.status === 'Open' ? COLORS.info : COLORS.success 
                  }}>
                    {mir.status}
                  </span>
                </td>
                <td style={styles.td}>{new Date(mir.created_at).toLocaleDateString()}</td>
                {activeTab === 'open' && (
                  <td style={styles.td}>
                    <ActionDropdown
                      actions={[
                        { id: 'close', icon: '✓', label: 'Close' },
                        { id: 'delete', icon: '🗑️', label: 'Delete' }
                      ]}
                      onExecute={(action) => handleMirAction(mir, action)}
                      disabled={!canModify}
                      componentId={mir.id}
                    />
                  </td>
                )}
                {activeTab === 'closed' && (
                  <td style={styles.td}>
                    {mir.closed_at ? new Date(mir.closed_at).toLocaleDateString() : '-'}
                  </td>
                )}
                {/* V31.0: RK Document Download */}
                <td style={{ ...styles.td, textAlign: 'center' }}>
                  <button
                    onClick={() => handleDownloadRK(mir)}
                    disabled={downloadingRK === mir.id}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: downloadingRK === mir.id ? 'wait' : 'pointer',
                      fontSize: '18px',
                      opacity: downloadingRK === mir.id ? 0.5 : 1,
                      padding: '4px'
                    }}
                    title="Download RK Document"
                  >
                    {downloadingRK === mir.id ? '⏳' : '📄'}
                  </button>
                </td>
                {/* V31.0: RK Download Info */}
                <td style={{ ...styles.td, textAlign: 'center' }}>
                  <RKDownloadInfo mir={mir} />
                </td>
              </tr>
            ))}
            {displayedMirs.length === 0 && (
              <tr>
                <td colSpan={13} style={{ ...styles.td, textAlign: 'center', color: '#9ca3af' }}>
                  No {activeTab === 'open' ? 'open' : 'closed'} MIRs
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Create MIR Modal - V27 with Priority */}
      <Modal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} title="+ New MIR">
        {/* Step 1: Type Selection */}
        <div style={{ marginBottom: '24px', padding: '16px', backgroundColor: '#f9fafb', borderRadius: '8px' }}>
          <label style={{ ...styles.label, marginBottom: '12px', fontSize: '16px', fontWeight: '600' }}>Step 1: Select Type</label>
          <div style={{ display: 'flex', gap: '16px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '16px 24px', border: `2px solid ${mirType === 'Piping' ? COLORS.info : '#e5e7eb'}`, borderRadius: '8px', cursor: 'pointer', backgroundColor: mirType === 'Piping' ? '#EFF6FF' : 'white', flex: 1 }}>
              <input type="radio" name="mirType" value="Piping" checked={mirType === 'Piping'} onChange={(e) => setMirType(e.target.value)} style={{ width: '20px', height: '20px' }} />
              <div>
                <div style={{ fontWeight: '600', color: COLORS.info }}>🔧 Piping</div>
                <div style={{ fontSize: '12px', color: '#6b7280' }}>MIR + RK + Category</div>
              </div>
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '16px 24px', border: `2px solid ${mirType === 'Mechanical' ? COLORS.purple : '#e5e7eb'}`, borderRadius: '8px', cursor: 'pointer', backgroundColor: mirType === 'Mechanical' ? '#F5F3FF' : 'white', flex: 1 }}>
              <input type="radio" name="mirType" value="Mechanical" checked={mirType === 'Mechanical'} onChange={(e) => setMirType(e.target.value)} style={{ width: '20px', height: '20px' }} />
              <div>
                <div style={{ fontWeight: '600', color: COLORS.purple }}>⚙️ Mechanical</div>
                <div style={{ fontSize: '12px', color: '#6b7280' }}>Only RK</div>
              </div>
            </label>
          </div>
        </div>

        {/* Step 2: Numbers */}
        <div style={{ marginBottom: '16px' }}>
          <label style={{ ...styles.label, fontSize: '16px', fontWeight: '600', marginBottom: '16px' }}>Step 2: Enter Numbers</label>
          
          {mirType === 'Piping' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label style={{ ...styles.label, color: COLORS.info }}>MIR Number * (4 digits)</label>
                <input type="text" value={mirNumber} onChange={(e) => setMirNumber(e.target.value.replace(/\D/g, '').slice(0, 4))} style={{ ...styles.input, fontSize: '18px', textAlign: 'center', letterSpacing: '4px' }} placeholder="0000" maxLength="4" />
              </div>
              <div>
                <label style={{ ...styles.label, color: COLORS.primary }}>RK Number * (4 digits)</label>
                <input type="text" value={rkNumber} onChange={(e) => setRkNumber(e.target.value.replace(/\D/g, '').slice(0, 4))} style={{ ...styles.input, fontSize: '18px', textAlign: 'center', letterSpacing: '4px' }} placeholder="0000" maxLength="4" />
              </div>
            </div>
          )}

          {mirType === 'Mechanical' && (
            <div style={{ marginBottom: '16px' }}>
              <label style={{ ...styles.label, color: COLORS.primary }}>RK Number * (4 digits)</label>
              <input type="text" value={rkNumber} onChange={(e) => setRkNumber(e.target.value.replace(/\D/g, '').slice(0, 4))} style={{ ...styles.input, fontSize: '18px', textAlign: 'center', letterSpacing: '4px', maxWidth: '200px' }} placeholder="0000" maxLength="4" />
            </div>
          )}
        </div>

        {/* Category (only for Piping) */}
        {mirType === 'Piping' && (
          <div style={{ marginBottom: '16px' }}>
            <label style={styles.label}>Category *</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)} style={styles.select}>
              {MIR_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>
        )}

        {/* V27: Priority Selection */}
        <div style={{ marginBottom: '16px' }}>
          <label style={styles.label}>Priority *</label>
          <div style={{ display: 'flex', gap: '12px' }}>
            {MIR_PRIORITIES.map(p => (
              <label key={p} style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px', 
                padding: '10px 16px',
                border: `2px solid ${priority === p ? getPriorityColor(p) : '#e5e7eb'}`,
                borderRadius: '6px',
                cursor: 'pointer',
                backgroundColor: priority === p ? `${getPriorityColor(p)}15` : 'white'
              }}>
                <input 
                  type="radio" 
                  name="priority" 
                  value={p} 
                  checked={priority === p}
                  onChange={(e) => setPriority(e.target.value)}
                  style={{ width: '16px', height: '16px' }}
                />
                <span style={{ fontWeight: priority === p ? '600' : '400', color: getPriorityColor(p) }}>{p}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Description (optional) */}
        <div style={{ marginBottom: '16px' }}>
          <label style={styles.label}>Description (optional)</label>
          <textarea
            value={mirDescription}
            onChange={(e) => setMirDescription(e.target.value)}
            style={{ ...styles.input, minHeight: '60px', resize: 'vertical' }}
            placeholder="Add a description for this MIR..."
          />
        </div>

        {/* Forecast Date */}
        <div style={{ marginBottom: '24px' }}>
          <label style={styles.label}>Forecast Date</label>
          <input type="date" value={forecastDate} onChange={(e) => setForecastDate(e.target.value)} style={styles.input} />
        </div>

        {/* Buttons */}
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', paddingTop: '16px', borderTop: '1px solid #e5e7eb' }}>
          <button onClick={() => setShowCreateModal(false)} style={{ ...styles.button, ...styles.buttonSecondary }}>Cancel</button>
          <button onClick={createMir} style={{ ...styles.button, ...styles.buttonPrimary }}>Create MIR</button>
        </div>
      </Modal>
    </div>
  );
}

// ============================================================
// LOG PAGE - V28.2 with IB linked to requests
// ============================================================
function LogPage({ user }) {
  const [activeTab, setActiveTab] = useState('movements');
  const [movements, setMovements] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showIBModal, setShowIBModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [newMovement, setNewMovement] = useState({ ident_code: '', movement_type: 'IN', quantity: '', from_location: '', to_location: '', note: '' });
  const [ibRequest, setIBRequest] = useState({ ident_code: '', description: '', tag: '', dia1: '', quantity: 1, reason: 'Broken', location: 'SITE', note: '', linked_request: '' });
  const [allIdents, setAllIdents] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [historyData, setHistoryData] = useState([]);
  const [activeRequests, setActiveRequests] = useState([]); // V28.2: For linking IB to requests
  // V28.4: Debounce timeout for IB ident search
  const [ibSearchTimeout, setIBSearchTimeout] = useState(null);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      // Load movements (IB)
      const { data: movData } = await supabase.from('movements').select('*').order('created_at', { ascending: false }).limit(200);
      if (movData) setMovements(movData);

      // Load all request components for Request Tracker
      // V32.3: Order by updated_at (last status change) descending
      const { data: reqData } = await supabase
        .from('request_components')
        .select('*, requests(*)')
        .order('updated_at', { ascending: false, nullsFirst: false })
        .limit(500);
      
      // V29.0: Load user names for old requests that don't have created_by_name
      if (reqData) {
        // Get unique requester_user_ids that need name lookup
        const userIdsToLookup = [...new Set(
          reqData
            .filter(r => r.requests?.requester_user_id && !r.requests?.created_by_name)
            .map(r => r.requests.requester_user_id)
        )];
        
        // Load user names
        let userNameMap = {};
        if (userIdsToLookup.length > 0) {
          const { data: usersData } = await supabase
            .from('users')
            .select('id, full_name')
            .in('id', userIdsToLookup);
          if (usersData) {
            userNameMap = Object.fromEntries(usersData.map(u => [u.id, u.full_name]));
          }
        }
        
        // Enrich requests with requester names
        const enrichedData = reqData.map(r => ({
          ...r,
          requests: r.requests ? {
            ...r.requests,
            created_by_name: r.requests.created_by_name || userNameMap[r.requests.requester_user_id] || null
          } : null
        }));
        
        setRequests(enrichedData);
      }

      // V28.2: Load active requests for IB linking
      const { data: activeReqData } = await supabase
        .from('request_components')
        .select('*, requests(request_number, sub_number)')
        .not('status', 'in', '("Done","Cancelled")')
        .order('created_at', { ascending: false })
        .limit(200);
      if (activeReqData) setActiveRequests(activeReqData);

      const { data: identData } = await supabase.from('inventory').select('ident_code').order('ident_code');
      if (identData) setAllIdents(identData.map(i => i.ident_code));

      const { data: userData } = await supabase.from('users').select('id, full_name').eq('is_active', true);
      if (userData) setAllUsers(userData);
    } catch (error) {
      console.error('LogPage loadData error:', error);
    }
    setLoading(false);
  };

  // Open history modal for a component
  const openHistory = async (componentId) => {
    const { data } = await supabase
      .from('component_history')
      .select('*')
      .eq('component_id', componentId)
      .order('created_at', { ascending: false });
    
    setHistoryData(data || []);
    setShowHistoryModal(true);
  };

  // V28.4: Search ident code for IB with debounce (3+ chars, 500ms delay)
  const searchIdentForIB = (term) => {
    // Clear previous timeout
    if (ibSearchTimeout) clearTimeout(ibSearchTimeout);
    
    if (term.length < 3) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }
    
    // Debounce by 500ms
    const timeout = setTimeout(async () => {
      const { data } = await supabase
        .from('project_materials')
        .select('ident_code, description, dia1, tag_number')
        .ilike('ident_code', `%${term}%`)
        .limit(20);
      if (data) {
        const unique = [];
        const seen = new Set();
        data.forEach(d => {
          if (!seen.has(d.ident_code)) {
            seen.add(d.ident_code);
            unique.push(d);
          }
        });
        setSearchResults(unique);
        setShowSearchResults(true);
      }
    }, 500);
    setIBSearchTimeout(timeout);
  };

  const selectIdentForIB = (item) => {
    setIBRequest({
      ...ibRequest,
      ident_code: item.ident_code,
      description: item.description || '',
      tag: item.tag_number || '',
      dia1: item.dia1 || ''
    });
    setShowSearchResults(false);
  };

  const addMovement = async () => {
    if (!newMovement.ident_code || !newMovement.quantity) {
      alert('Code and Quantity required');
      return;
    }

    await supabase.from('movements').insert({
      ...newMovement,
      quantity: parseInt(newMovement.quantity),
      performed_by: user.full_name
    });

    // Update inventory based on movement type
    const qty = parseInt(newMovement.quantity);
    if (newMovement.movement_type === 'IN') {
      if (newMovement.to_location === 'YARD') {
        await supabase.rpc('increment_yard_qty', { p_ident_code: newMovement.ident_code, p_qty: qty });
      } else if (newMovement.to_location === 'SITE') {
        await supabase.rpc('increment_site_qty', { p_ident_code: newMovement.ident_code, p_qty: qty });
      }
    } else if (newMovement.movement_type === 'OUT') {
      if (newMovement.from_location === 'YARD') {
        await supabase.rpc('decrement_yard_qty', { p_ident_code: newMovement.ident_code, p_qty: qty });
      } else if (newMovement.from_location === 'SITE') {
        await supabase.rpc('decrement_site_qty', { p_ident_code: newMovement.ident_code, p_qty: qty });
      }
    }

    setShowAddModal(false);
    setNewMovement({ ident_code: '', movement_type: 'IN', quantity: '', from_location: '', to_location: '', note: '' });
    loadData();
  };

  // Submit IB Request
  // V28.5: Fixed IB Request submission - direct SQL operations, always ADD to quantities
  const submitIBRequest = async () => {
    if (!ibRequest.ident_code || !ibRequest.quantity) {
      alert('Ident Code and Quantity required');
      return;
    }

    try {
      const qty = parseInt(ibRequest.quantity);
      if (qty <= 0) {
        alert('Quantity must be greater than 0');
        return;
      }
      
      // Generate IB number - V28.5: Fixed to properly find max number
      const { data: allIBs, error: ibError } = await supabase
        .from('movements')
        .select('ib_number')
        .not('ib_number', 'is', null)
        .ilike('ib_number', 'IB%');
      
      console.log('📋 IB Numbers found:', allIBs);
      
      let maxNum = 0;
      if (allIBs && allIBs.length > 0) {
        allIBs.forEach(row => {
          if (row.ib_number) {
            // Extract number from IB0001, IBA001, IBB001, IBL001 etc
            const match = row.ib_number.match(/IB[ABL]?(\d+)/);
            if (match) {
              const num = parseInt(match[1]);
              if (num > maxNum) maxNum = num;
            }
          }
        });
      }
      const nextNum = maxNum + 1;
      const ibNumber = 'IB' + String(nextNum).padStart(4, '0');
      console.log('📋 New IB Number:', ibNumber, '(max was:', maxNum, ')');

      // Get current inventory for this ident_code
      const { data: currentInv } = await supabase
        .from('inventory')
        .select('*')
        .eq('ident_code', ibRequest.ident_code)
        .single();

      // Determine movement details and update inventory
      let movementType, fromLoc, toLoc;
      
      if (ibRequest.reason === 'Broken') {
        movementType = 'BROKEN';
        fromLoc = ibRequest.location;
        toLoc = 'BROKEN';
        
        // V28.5 FIX: ADD to broken_qty (not overwrite)
        if (currentInv) {
          const newBrokenQty = (currentInv.broken_qty || 0) + qty;
          await supabase.from('inventory')
            .update({ broken_qty: newBrokenQty })
            .eq('ident_code', ibRequest.ident_code);
        } else {
          // Create new inventory record
          await supabase.from('inventory').insert({
            ident_code: ibRequest.ident_code,
            site_qty: 0,
            yard_qty: 0,
            broken_qty: qty,
            lost_qty: 0
          });
        }
        
      } else if (ibRequest.reason === 'Lost') {
        movementType = 'LOST';
        fromLoc = ibRequest.location;
        toLoc = 'LOST';
        
        // V28.5 FIX: ADD to lost_qty (not overwrite)
        if (currentInv) {
          const newLostQty = (currentInv.lost_qty || 0) + qty;
          await supabase.from('inventory')
            .update({ lost_qty: newLostQty })
            .eq('ident_code', ibRequest.ident_code);
        } else {
          await supabase.from('inventory').insert({
            ident_code: ibRequest.ident_code,
            site_qty: 0,
            yard_qty: 0,
            broken_qty: 0,
            lost_qty: qty
          });
        }
        
      } else if (ibRequest.reason === 'Balance') {
        movementType = 'BAL';
        fromLoc = 'BALANCE';
        toLoc = ibRequest.location;
        
        // V28.5 FIX: ADD to site_qty or yard_qty (not overwrite)
        if (currentInv) {
          if (ibRequest.location === 'SITE') {
            const newSiteQty = (currentInv.site_qty || 0) + qty;
            await supabase.from('inventory')
              .update({ site_qty: newSiteQty })
              .eq('ident_code', ibRequest.ident_code);
          } else {
            const newYardQty = (currentInv.yard_qty || 0) + qty;
            await supabase.from('inventory')
              .update({ yard_qty: newYardQty })
              .eq('ident_code', ibRequest.ident_code);
          }
        } else {
          await supabase.from('inventory').insert({
            ident_code: ibRequest.ident_code,
            site_qty: ibRequest.location === 'SITE' ? qty : 0,
            yard_qty: ibRequest.location === 'YARD' ? qty : 0,
            broken_qty: 0,
            lost_qty: 0
          });
        }
      }

      // Create movement record
      await supabase.from('movements').insert({
        ident_code: ibRequest.ident_code,
        movement_type: movementType,
        quantity: qty,
        from_location: fromLoc,
        to_location: toLoc,
        performed_by: user.full_name,
        note: ibRequest.note || null,
        ib_number: ibNumber,
        reason: ibRequest.reason
      });

      // V28.2: If linked to a request, update the request component
      if (ibRequest.linked_request) {
        const linkedComp = activeRequests.find(r => 
          `${String(r.requests?.request_number).padStart(5, '0')}-${r.requests?.sub_number}` === ibRequest.linked_request &&
          r.ident_code === ibRequest.ident_code
        );
        
        if (linkedComp) {
          // Add note to component history about IB link
          await supabase.from('component_history').insert({
            component_id: linkedComp.id,
            action: `IB ${ibRequest.reason} Applied`,
            from_status: linkedComp.status,
            to_status: linkedComp.status,
            performed_by_user_id: user.id,
            performed_by_name: user.full_name,
            note: `IB# ${ibNumber}: ${ibRequest.reason} ${qty} units. ${ibRequest.note || ''}`
          });
        }
        
        // Update movement with request number
        await supabase.from('movements')
          .update({ request_number: ibRequest.linked_request })
          .eq('ib_number', ibNumber);
      }

      alert(`IB Request ${ibNumber} created successfully!${ibRequest.linked_request ? ` Linked to Request ${ibRequest.linked_request}` : ''}`);
      setShowIBModal(false);
      setIBRequest({ ident_code: '', description: '', tag: '', dia1: '', quantity: 1, reason: 'Broken', location: 'SITE', note: '', linked_request: '' });
      loadData();
    } catch (error) {
      console.error('IB Error:', error);
      alert('Error: ' + error.message);
    }
  };

  const exportCSV = () => {
    const headers = ['Date', 'Type', 'IB#', 'Code', 'Qty', 'From', 'To', 'Operator', 'Reason', 'Note', 'Linked Request'];
    const rows = movements.map(m => [
      new Date(m.created_at).toLocaleString(),
      m.movement_type,
      m.ib_number || '',
      m.ident_code,
      m.quantity,
      m.from_location,
      m.to_location,
      m.performed_by,
      m.reason || '',
      m.note || '',
      m.request_number || ''
    ]);
    const csv = [headers.join(','), ...rows.map(r => r.map(c => `"${c}"`).join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `movements_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  // Filter movements by search term
  const filteredMovements = movements.filter(m => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      (m.ident_code || '').toLowerCase().includes(term) ||
      (m.performed_by || '').toLowerCase().includes(term) ||
      (m.movement_type || '').toLowerCase().includes(term) ||
      (m.ib_number || '').toLowerCase().includes(term) ||
      (m.request_number || '').toLowerCase().includes(term) ||
      (m.note || '').toLowerCase().includes(term)
    );
  });

  // Filter requests by search term
  const filteredRequests = requests.filter(r => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    // V28.4: Use padded request number for proper matching
    const paddedReqNum = String(r.requests?.request_number || '').padStart(5, '0');
    const fullReqNum = `${paddedReqNum}-${r.requests?.sub_number || 0}`;
    return (
      (r.ident_code || '').toLowerCase().includes(term) ||
      (r.description || '').toLowerCase().includes(term) ||
      paddedReqNum.includes(term) ||
      fullReqNum.includes(term) ||
      (r.requests?.hf_number || '').toLowerCase().includes(term) ||
      (r.requests?.test_pack_number || '').toLowerCase().includes(term) ||
      (r.requests?.created_by_name || '').toLowerCase().includes(term)
    );
  });

  const canModify = canModifyPage(user, 'movements');

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading...</div>;

  return (
    <div>
      {/* Tabs */}
      <div style={{ display: 'flex', gap: '4px', marginBottom: '16px' }}>
        <button
          onClick={() => setActiveTab('movements')}
          style={{
            padding: '12px 24px',
            backgroundColor: activeTab === 'movements' ? 'white' : '#e5e7eb',
            border: 'none',
            borderRadius: '8px 8px 0 0',
            cursor: 'pointer',
            fontWeight: activeTab === 'movements' ? '600' : '400',
            boxShadow: activeTab === 'movements' ? '0 -2px 4px rgba(0,0,0,0.1)' : 'none'
          }}
        >
          📦 Movements (IB)
        </button>
        <button
          onClick={() => setActiveTab('tracker')}
          style={{
            padding: '12px 24px',
            backgroundColor: activeTab === 'tracker' ? 'white' : '#e5e7eb',
            border: 'none',
            borderRadius: '8px 8px 0 0',
            cursor: 'pointer',
            fontWeight: activeTab === 'tracker' ? '600' : '400',
            boxShadow: activeTab === 'tracker' ? '0 -2px 4px rgba(0,0,0,0.1)' : 'none'
          }}
        >
          📋 Request Tracker
        </button>
      </div>

      {/* Search and Actions */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', marginBottom: '16px', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '200px', maxWidth: '400px' }}>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={activeTab === 'movements' ? "Search IB#, code, operator..." : "Search request, code, requester, HF..."}
            style={styles.input}
          />
        </div>
        {activeTab === 'movements' && (
          <div style={{ display: 'flex', gap: '12px' }}>
            <button onClick={exportCSV} style={{ ...styles.button, backgroundColor: COLORS.info, color: 'white', fontWeight: '600' }}>
              📥 Export CSV
            </button>
            <button onClick={() => setShowIBModal(true)} disabled={!canModify} style={{ ...styles.button, backgroundColor: COLORS.orange, color: 'white' }}>
              + IB Request
            </button>
          </div>
        )}
      </div>

      {/* Movements Tab */}
      {activeTab === 'movements' && (
        <div style={styles.card}>
          <div style={styles.cardHeader}><h3 style={{ fontWeight: '600' }}>Movements Log ({filteredMovements.length})</h3></div>
          <div style={{ overflowX: 'auto' }}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Date</th>
                  <th style={styles.th}>Type</th>
                  <th style={styles.th}>IB#</th>
                  <th style={styles.th}>Code</th>
                  <th style={styles.th}>Qty</th>
                  <th style={styles.th}>From → To</th>
                  <th style={styles.th}>Operator</th>
                  <th style={styles.th}>Reason</th>
                  <th style={styles.th}>Note</th>
                  <th style={styles.th}>Linked Req</th>
                </tr>
              </thead>
              <tbody>
                {filteredMovements.map((mov, idx) => (
                  <tr key={idx}>
                    <td style={styles.td}>{new Date(mov.created_at).toLocaleString()}</td>
                    <td style={styles.td}>
                      <span style={{
                        ...styles.statusBadge,
                        backgroundColor: mov.movement_type === 'IN' ? COLORS.success :
                                        mov.movement_type === 'OUT' ? COLORS.primary :
                                        mov.movement_type === 'LOST' ? COLORS.orange :
                                        mov.movement_type === 'BROKEN' ? COLORS.purple :
                                        mov.movement_type === 'TRANSFER' ? COLORS.info :
                                        mov.movement_type === 'BAL_IN' ? COLORS.teal :
                                        mov.movement_type === 'BAL_OUT' ? COLORS.yellow : COLORS.gray
                      }}>
                        {mov.movement_type}
                      </span>
                    </td>
                    <td style={{ ...styles.td, fontFamily: 'monospace', fontWeight: mov.ib_number ? '600' : 'normal', color: mov.ib_number ? COLORS.orange : 'inherit' }}>
                      {mov.ib_number || '-'}
                    </td>
                    <td style={{ ...styles.td, fontFamily: 'monospace' }}>{mov.ident_code}</td>
                    <td style={styles.td}>{mov.quantity}</td>
                    <td style={styles.td}>{mov.from_location} → {mov.to_location}</td>
                    <td style={styles.td}>{mov.performed_by}</td>
                    <td style={styles.td}>{mov.reason || '-'}</td>
                    <td style={{ ...styles.td, maxWidth: '150px', overflow: 'hidden', textOverflow: 'ellipsis' }} title={mov.note}>{mov.note || '-'}</td>
                    <td style={{ ...styles.td, fontFamily: 'monospace', fontWeight: mov.request_number ? '600' : 'normal', color: mov.request_number ? COLORS.info : '#9ca3af' }}>
                      {mov.request_number || '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Request Tracker Tab */}
      {activeTab === 'tracker' && (
        <div style={styles.card}>
          <div style={{ ...styles.cardHeader }}>
            <h3 style={{ fontWeight: '600' }}>Request Tracker ({filteredRequests.length})</h3>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Request</th>
                  <th style={styles.th}>Type</th>
                  <th style={styles.th}>TP#</th>
                  <th style={styles.th}>HF</th>
                  <th style={styles.th}>Code</th>
                  <th style={styles.th}>Description</th>
                  <th style={styles.th}>Qty</th>
                  <th style={styles.th}>Requester</th>
                  <th style={styles.th}>Prev Status</th>
                  <th style={styles.th}>Current Status</th>
                  <th style={styles.th}>Last Update</th>
                  <th style={styles.th}>ℹ️</th>
                </tr>
              </thead>
              <tbody>
                {filteredRequests.map((req, idx) => (
                  <tr key={idx}>
                    <td style={{ ...styles.td, fontFamily: 'monospace', fontWeight: '600', cursor: 'help' }}
                        title={`Child: ${getChildNumber(req.requests)}`}>
                      {displayMotherNumber(req.requests)}
                    </td>
                    <td style={styles.td}>{req.requests?.request_type || '-'}</td>
                    <td style={styles.td}>{req.requests?.test_pack_number || '-'}</td>
                    <td style={styles.td}>{req.requests?.hf_number || '-'}</td>
                    <td style={{ ...styles.td, fontFamily: 'monospace', fontSize: '11px' }}>{req.ident_code}</td>
                    <td style={{ ...styles.td, maxWidth: '150px', overflow: 'hidden', textOverflow: 'ellipsis' }} title={req.description}>
                      {req.description ? (req.description.length > 25 ? req.description.substring(0, 25) + '...' : req.description) : '-'}
                    </td>
                    <td style={styles.td}>{req.quantity}</td>
                    <td style={styles.td}>{req.requests?.created_by_name || '-'}</td>
                    <td style={styles.td}>
                      {req.previous_status ? <StatusBadge status={req.previous_status} /> : <span style={{ color: '#9ca3af' }}>-</span>}
                    </td>
                    <td style={styles.td}>
                      <StatusBadge status={req.status} />
                    </td>
                    <td style={{ ...styles.td, fontSize: '11px', whiteSpace: 'nowrap' }}>
                      {req.updated_at ? new Date(req.updated_at).toLocaleString('it-IT', { 
                        day: '2-digit', month: '2-digit', year: 'numeric',
                        hour: '2-digit', minute: '2-digit'
                      }) : '-'}
                    </td>
                    <td style={styles.td}>
                      <ActionButton color={COLORS.gray} onClick={() => openHistory(req.id)} title="View History">ℹ️</ActionButton>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* History Modal for Request Tracker */}
      <Modal isOpen={showHistoryModal} onClose={() => setShowHistoryModal(false)} title="📋 Component History">
        <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
          {historyData.length > 0 ? historyData.map((h, idx) => (
            <div key={idx} style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ fontWeight: '600' }}>{h.action}</span>
                <span style={{ fontSize: '12px', color: '#6b7280' }}>{new Date(h.created_at).toLocaleString()}</span>
              </div>
              <div style={{ fontSize: '13px', color: '#6b7280' }}>
                {h.from_status} → {h.to_status} | by {h.performed_by_name}
              </div>
              {h.note && (
                <div style={{ fontSize: '12px', color: COLORS.warning, marginTop: '4px', backgroundColor: '#FEF3C7', padding: '4px 8px', borderRadius: '4px' }}>
                  📝 {h.note}
                </div>
              )}
            </div>
          )) : (
            <p style={{ color: '#9ca3af', textAlign: 'center', padding: '20px' }}>No history available</p>
          )}
        </div>
      </Modal>

      {/* IB Request Modal */}
      <Modal isOpen={showIBModal} onClose={() => setShowIBModal(false)} title="📋 Internal Balance Request (IB)">
        <div style={{ backgroundColor: '#FEF3C7', padding: '12px', borderRadius: '6px', marginBottom: '16px' }}>
          <p style={{ fontSize: '13px', color: '#92400E' }}>
            Use IB requests to adjust inventory for broken, lost, or balance corrections.
          </p>
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={styles.label}>Reason *</label>
          <select value={ibRequest.reason} onChange={(e) => setIBRequest({ ...ibRequest, reason: e.target.value })} style={styles.select}>
            <option value="Broken">🔨 Broken</option>
            <option value="Lost">❓ Lost</option>
            <option value="Balance">⚖️ Balance Adjustment</option>
          </select>
        </div>

        <div style={{ marginBottom: '16px', position: 'relative' }}>
          <label style={styles.label}>Ident Code * <span style={{ fontSize: '11px', color: '#6b7280' }}>(type 3+ chars)</span></label>
          <input
            type="text"
            value={ibRequest.ident_code}
            onChange={(e) => {
              setIBRequest({ ...ibRequest, ident_code: e.target.value });
              searchIdentForIB(e.target.value);
            }}
            style={styles.input}
            placeholder="Search ident code..."
          />
          {showSearchResults && searchResults.length > 0 && (
            <div style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              maxHeight: '200px',
              overflowY: 'auto',
              backgroundColor: 'white',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
              zIndex: 100
            }}>
              {searchResults.map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => selectIdentForIB(item)}
                  style={{ padding: '10px 12px', cursor: 'pointer', borderBottom: '1px solid #f3f4f6', fontSize: '13px' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                >
                  <div style={{ fontWeight: '600', fontFamily: 'monospace' }}>{item.ident_code}</div>
                  <div style={{ color: '#6b7280', fontSize: '12px' }}>{item.description || '(no description)'}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {ibRequest.ident_code && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '16px', backgroundColor: '#f3f4f6', padding: '12px', borderRadius: '6px' }}>
            <div>
              <span style={{ fontSize: '11px', color: '#6b7280' }}>Description</span>
              <p style={{ fontSize: '13px' }}>{ibRequest.description || '-'}</p>
            </div>
            <div>
              <span style={{ fontSize: '11px', color: '#6b7280' }}>Tag</span>
              <p style={{ fontSize: '13px' }}>{ibRequest.tag || '-'}</p>
            </div>
            <div>
              <span style={{ fontSize: '11px', color: '#6b7280' }}>Diam</span>
              <p style={{ fontSize: '13px' }}>{ibRequest.dia1 || '-'}</p>
            </div>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
          <div>
            <label style={styles.label}>Quantity *</label>
            <input
              type="number"
              value={ibRequest.quantity}
              onChange={(e) => setIBRequest({ ...ibRequest, quantity: e.target.value })}
              style={styles.input}
              min="1"
            />
            {ibRequest.reason === 'Balance' && (
              <p style={{ fontSize: '11px', color: '#6b7280', marginTop: '4px' }}>Use negative for deductions</p>
            )}
          </div>
          <div>
            <label style={styles.label}>Deduct From *</label>
            <select value={ibRequest.location} onChange={(e) => setIBRequest({ ...ibRequest, location: e.target.value })} style={styles.select}>
              <option value="SITE">SITE</option>
              <option value="YARD">YARD</option>
            </select>
          </div>
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={styles.label}>Note (optional)</label>
          <textarea
            value={ibRequest.note}
            onChange={(e) => setIBRequest({ ...ibRequest, note: e.target.value })}
            style={{ ...styles.input, minHeight: '60px' }}
            placeholder="Additional details..."
          />
        </div>

        {/* V28.2: Link to existing request */}
        <div style={{ marginBottom: '16px' }}>
          <label style={styles.label}>Link to Request (optional)</label>
          <select
            value={ibRequest.linked_request}
            onChange={(e) => setIBRequest({ ...ibRequest, linked_request: e.target.value })}
            style={styles.select}
          >
            <option value="">-- No Link --</option>
            {activeRequests
              .filter(r => !ibRequest.ident_code || r.ident_code === ibRequest.ident_code)
              .map((r, idx) => (
                <option key={idx} value={`${String(r.requests?.request_number).padStart(5, '0')}-${r.requests?.sub_number}`}>
                  {String(r.requests?.request_number).padStart(5, '0')}-{r.requests?.sub_number} | {r.ident_code} | {r.status}
                </option>
              ))}
          </select>
          <p style={{ fontSize: '11px', color: '#6b7280', marginTop: '4px' }}>
            Link this IB to an existing request to track inventory adjustments
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          <button onClick={() => setShowIBModal(false)} style={{ ...styles.button, ...styles.buttonSecondary }}>Cancel</button>
          <button onClick={submitIBRequest} style={{ ...styles.button, backgroundColor: COLORS.orange, color: 'white' }}>
            Submit IB Request
          </button>
        </div>
      </Modal>
    </div>
  );
}

// ============================================================
// DATABASE PAGE - V28.1 with ISO separate rows
// ============================================================
function DatabasePage({ user }) {
  const [inventoryData, setInventoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showBalanceModal, setShowBalanceModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [balanceData, setBalanceData] = useState({ yard_qty: '', site_qty: '', lost_qty: '', broken_qty: '', collected_ten_wh: '' });
  const [newItem, setNewItem] = useState({ iso_number: '', ident_code: '', description: '' });
  
  // V28.3: Filter states
  const [isoFilter, setIsoFilter] = useState('');
  const [identFilter, setIdentFilter] = useState('');
  const [isoOptions, setIsoOptions] = useState([]);
  const [identOptions, setIdentOptions] = useState([]);
  const [showIsoDropdown, setShowIsoDropdown] = useState(false);
  const [showIdentDropdown, setShowIdentDropdown] = useState(false);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => { loadFilters(); loadInventory(); }, []);
  useEffect(() => { loadInventory(); }, [isoFilter, identFilter]);

  // V28.3: Load unique ISO and Ident options for autocomplete
  // V28.5: Filtered to P121 project only
  const loadFilters = async () => {
    // Get unique ISO numbers - P121 only
    const { data: isoData } = await supabase
      .from('project_materials')
      .select('iso_number')
      .like('iso_number', 'P121%')  // V28.5: P121 project filter
      .not('iso_number', 'is', null)
      .order('iso_number');
    
    if (isoData) {
      const uniqueIsos = [...new Set(isoData.map(d => d.iso_number).filter(Boolean))];
      setIsoOptions(uniqueIsos);
    }
    
    // Get unique ident codes from P121 project
    const { data: identData } = await supabase
      .from('project_materials')
      .select('ident_code')
      .like('iso_number', 'P121%')  // V28.5: P121 project filter
      .not('ident_code', 'is', null)
      .order('ident_code');
    
    if (identData) {
      const uniqueIdents = [...new Set(identData.map(d => d.ident_code).filter(Boolean))];
      setIdentOptions(uniqueIdents);
    }
  };

  const loadInventory = async () => {
    setLoading(true);
    
    // V28.3: Build query with filters
    // V28.5: P121 project filter
    let query = supabase
      .from('project_materials')
      .select('iso_number, ident_code, description, pos_qty, dia1')
      .like('iso_number', 'P121%')  // V28.5: P121 project filter
      .order('iso_number')
      .order('ident_code');
    
    // Apply filters if set
    if (isoFilter) {
      query = query.ilike('iso_number', `%${isoFilter}%`);
    }
    if (identFilter) {
      query = query.ilike('ident_code', `%${identFilter}%`);
    }
    
    // V28.3: Limit to 500 rows
    query = query.limit(500);
    
    const { data: projectData, count } = await query;
    
    // V28.5 FIX: Get unique ident_codes from project_materials, then load ONLY those from inventory
    const uniqueIdentCodes = [...new Set((projectData || []).map(p => p.ident_code).filter(Boolean))];
    console.log('🔍 DATABASE - Unique ident_codes from project_materials:', uniqueIdentCodes.length);
    
    // Load inventory ONLY for the ident_codes we need (not all 52000+!)
    let invMap = {};
    if (uniqueIdentCodes.length > 0) {
      const { data: invData, error: invError } = await supabase
        .from('inventory')
        .select('*')
        .in('ident_code', uniqueIdentCodes);
      
      console.log('🔍 DATABASE - Inventory for our materials:', { count: invData?.length, error: invError });
      
      if (invData) {
        invData.forEach(i => { 
          invMap[i.ident_code] = i; 
        });
      }
      
      // Debug: check for C1GXTDJK
      if (invMap['C1GXTDJK']) {
        console.log('🔍 DATABASE - Found C1GXTDJK:', invMap['C1GXTDJK']);
      }
    }
    
    // V28.1: Group by ISO + ident_code (unique combination)
    const groupedData = {};
    if (projectData) {
      projectData.forEach(item => {
        const key = `${item.iso_number}|${item.ident_code}`;
        if (!groupedData[key]) {
          const inv = invMap[item.ident_code] || {};
          
          groupedData[key] = {
            iso_number: item.iso_number,
            ident_code: item.ident_code,
            description: item.description,
            dia1: item.dia1,
            pos_qty: item.pos_qty || 0,
            yard_qty: inv.yard_qty || 0,
            site_qty: inv.site_qty || 0,
            lost_qty: inv.lost_qty || 0,
            broken_qty: inv.broken_qty || 0,
            record_out: inv.record_out || 0,
            collected_ten_wh: inv.collected_ten_wh || 0
          };
        } else {
          // Sum pos_qty for same ISO + ident_code
          groupedData[key].pos_qty += (item.pos_qty || 0);
        }
      });
    }
    
    // Convert to array and sort by ISO then ident_code
    const merged = Object.values(groupedData);
    merged.sort((a, b) => {
      const isoCompare = (a.iso_number || '').localeCompare(b.iso_number || '');
      if (isoCompare !== 0) return isoCompare;
      return (a.ident_code || '').localeCompare(b.ident_code || '');
    });
    
    setTotalCount(merged.length);
    setInventoryData(merged);
    setLoading(false);
  };

  // V28.3: Filtered options for autocomplete
  const filteredIsoOptions = isoOptions.filter(iso => 
    iso.toLowerCase().includes(isoFilter.toLowerCase())
  ).slice(0, 20);
  
  const filteredIdentOptions = identOptions.filter(ident => 
    ident.toLowerCase().includes(identFilter.toLowerCase())
  ).slice(0, 20);

  const openBalanceModal = async (item) => {
    // V28.5 FIX: Fetch fresh data from inventory table before opening modal
    const { data: freshInv, error: invError } = await supabase
      .from('inventory')
      .select('*')
      .eq('ident_code', item.ident_code)
      .maybeSingle(); // Use maybeSingle instead of single to avoid error when not found
    
    console.log('📦 Opening balance modal for:', item.ident_code);
    console.log('📦 Fresh inventory data:', freshInv);
    console.log('📦 Inventory error:', invError);
    console.log('📦 Item data:', item);
    
    setSelectedItem(item);
    
    // V28.5 FIX: Use freshInv if found, otherwise use item values, ensure numbers
    const yardVal = freshInv ? (freshInv.yard_qty ?? 0) : (item.yard_qty ?? 0);
    const siteVal = freshInv ? (freshInv.site_qty ?? 0) : (item.site_qty ?? 0);
    const lostVal = freshInv ? (freshInv.lost_qty ?? 0) : (item.lost_qty ?? 0);
    const brokenVal = freshInv ? (freshInv.broken_qty ?? 0) : (item.broken_qty ?? 0);
    const tenVal = freshInv ? (freshInv.collected_ten_wh ?? 0) : (item.collected_ten_wh ?? 0);
    
    console.log('📦 Setting balanceData:', { yard: yardVal, site: siteVal, lost: lostVal, broken: brokenVal, ten: tenVal });
    
    setBalanceData({
      yard_qty: yardVal,
      site_qty: siteVal,
      lost_qty: lostVal,
      broken_qty: brokenVal,
      collected_ten_wh: tenVal
    });
    setShowBalanceModal(true);
  };

  const saveBalance = async () => {
    // V28.5 FIX: Ensure all values are properly parsed as integers
    const yardQty = parseInt(balanceData.yard_qty, 10);
    const siteQty = parseInt(balanceData.site_qty, 10);
    const lostQty = parseInt(balanceData.lost_qty, 10);
    const brokenQty = parseInt(balanceData.broken_qty, 10);
    const tenQty = parseInt(balanceData.collected_ten_wh, 10);
    
    const dataToSave = {
      ident_code: selectedItem.ident_code,
      description: selectedItem.description || '',
      yard_qty: isNaN(yardQty) ? 0 : yardQty,
      site_qty: isNaN(siteQty) ? 0 : siteQty,
      lost_qty: isNaN(lostQty) ? 0 : lostQty,
      broken_qty: isNaN(brokenQty) ? 0 : brokenQty,
      collected_ten_wh: isNaN(tenQty) ? 0 : tenQty
    };
    
    console.log('📦 balanceData before save:', balanceData);
    console.log('📦 Saving balance to inventory:', dataToSave);
    
    // Check if record exists first
    const { data: existing } = await supabase
      .from('inventory')
      .select('id')
      .eq('ident_code', selectedItem.ident_code)
      .maybeSingle();
    
    let error;
    if (existing) {
      // Update existing record
      console.log('📦 Updating existing record');
      const result = await supabase
        .from('inventory')
        .update({
          yard_qty: dataToSave.yard_qty,
          site_qty: dataToSave.site_qty,
          lost_qty: dataToSave.lost_qty,
          broken_qty: dataToSave.broken_qty,
          collected_ten_wh: dataToSave.collected_ten_wh,
          description: dataToSave.description
        })
        .eq('ident_code', selectedItem.ident_code);
      error = result.error;
    } else {
      // Insert new record
      console.log('📦 Inserting new record');
      const result = await supabase.from('inventory').insert(dataToSave);
      error = result.error;
    }

    if (error) {
      console.error('📦 Save error:', error);
      alert('Error: ' + error.message);
      return;
    }
    
    console.log('📦 Save successful!');

    await supabase.from('movements').insert({
      ident_code: selectedItem.ident_code,
      movement_type: 'BAL',
      quantity: 0,
      from_location: 'BALANCE',
      to_location: 'BALANCE',
      performed_by: user.full_name,
      note: `Manual balance: Y=${balanceData.yard_qty}, S=${balanceData.site_qty}, L=${balanceData.lost_qty}, B=${balanceData.broken_qty}, TEN=${balanceData.collected_ten_wh}`
    });

    setShowBalanceModal(false);
    loadInventory();
  };

  const addNewItem = async () => {
    if (!newItem.ident_code) {
      alert('Ident Code is required');
      return;
    }

    // V32.3: Add to inventory with all fields including quantities
    const { error } = await supabase.from('inventory').insert({
      iso_number: newItem.iso_number || null,
      ident_code: newItem.ident_code,
      description: newItem.description || null,
      yard_qty: newItem.yard_qty || 0,
      site_qty: newItem.site_qty || 0,
      lost_qty: newItem.lost_qty || 0,
      broken_qty: newItem.broken_qty || 0,
      collected_ten_wh: 0,
      record_out: 0
    });

    if (error) {
      if (error.code === '23505') {
        alert('This Ident Code already exists');
      } else {
        alert('Error: ' + error.message);
      }
      return;
    }

    // V32.3: Log movement if any quantity was set
    const totalQty = (newItem.yard_qty || 0) + (newItem.site_qty || 0);
    if (totalQty > 0) {
      await supabase.from('movements').insert({
        ident_code: newItem.ident_code,
        movement_type: 'BAL',
        quantity: totalQty,
        from_location: 'NEW',
        to_location: 'BALANCE',
        performed_by: user.full_name,
        note: `New item added: Y=${newItem.yard_qty || 0}, S=${newItem.site_qty || 0}`
      });
    }

    setShowAddModal(false);
    setNewItem({ iso_number: '', ident_code: '', description: '', site_qty: 0, yard_qty: 0, lost_qty: 0, broken_qty: 0 });
    loadInventory();
  };

  const exportCSV = () => {
    const headers = ['ISO', 'Ident Code', 'Description', 'Pos Qty', 'Collected TEN', 'YARD', 'SITE', 'LOST', 'BROKEN', 'Record Out'];
    const rows = inventoryData.map(i => [
      i.iso_number,
      i.ident_code,
      i.description,
      i.pos_qty || 0,
      i.collected_ten_wh || 0,
      i.yard_qty || 0,
      i.site_qty || 0,
      i.lost_qty || 0,
      i.broken_qty || 0,
      i.record_out || 0
    ]);
    const csv = [headers.join(','), ...rows.map(r => r.map(c => `"${c}"`).join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `inventory_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const canModify = canModifyPage(user, 'database');

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading...</div>;

  return (
    <div>
      {/* V28.3: Filter Section */}
      <div style={{ 
        backgroundColor: '#F3F4F6', 
        padding: '16px', 
        borderRadius: '8px', 
        marginBottom: '16px',
        display: 'flex',
        flexWrap: 'wrap',
        gap: '16px',
        alignItems: 'flex-end'
      }}>
        {/* ISO Filter with Autocomplete */}
        <div style={{ position: 'relative', minWidth: '200px', flex: 1 }}>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#4B5563', marginBottom: '4px' }}>
            Filter by ISO
          </label>
          <input
            type="text"
            placeholder="Type to filter ISO..."
            value={isoFilter}
            onChange={(e) => { setIsoFilter(e.target.value); setShowIsoDropdown(true); }}
            onFocus={() => setShowIsoDropdown(true)}
            onBlur={() => setTimeout(() => setShowIsoDropdown(false), 200)}
            style={{ ...styles.input, width: '100%' }}
          />
          {showIsoDropdown && filteredIsoOptions.length > 0 && (
            <div style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              backgroundColor: 'white',
              border: '1px solid #D1D5DB',
              borderRadius: '4px',
              maxHeight: '200px',
              overflowY: 'auto',
              zIndex: 100,
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
            }}>
              {filteredIsoOptions.map(iso => (
                <div
                  key={iso}
                  onClick={() => { setIsoFilter(iso); setShowIsoDropdown(false); }}
                  style={{ padding: '8px 12px', cursor: 'pointer', fontSize: '13px', borderBottom: '1px solid #E5E7EB' }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#F3F4F6'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
                >
                  {iso}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Ident Code Filter with Autocomplete */}
        <div style={{ position: 'relative', minWidth: '200px', flex: 1 }}>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#4B5563', marginBottom: '4px' }}>
            Filter by Ident Code
          </label>
          <input
            type="text"
            placeholder="Type to filter Ident..."
            value={identFilter}
            onChange={(e) => { setIdentFilter(e.target.value); setShowIdentDropdown(true); }}
            onFocus={() => setShowIdentDropdown(true)}
            onBlur={() => setTimeout(() => setShowIdentDropdown(false), 200)}
            style={{ ...styles.input, width: '100%' }}
          />
          {showIdentDropdown && filteredIdentOptions.length > 0 && (
            <div style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              backgroundColor: 'white',
              border: '1px solid #D1D5DB',
              borderRadius: '4px',
              maxHeight: '200px',
              overflowY: 'auto',
              zIndex: 100,
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
            }}>
              {filteredIdentOptions.map(ident => (
                <div
                  key={ident}
                  onClick={() => { setIdentFilter(ident); setShowIdentDropdown(false); }}
                  style={{ padding: '8px 12px', cursor: 'pointer', fontSize: '13px', fontFamily: 'monospace', borderBottom: '1px solid #E5E7EB' }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#F3F4F6'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
                >
                  {ident}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Clear Filters Button */}
        <button 
          onClick={() => { setIsoFilter(''); setIdentFilter(''); }}
          style={{ ...styles.button, backgroundColor: COLORS.gray, color: 'white', height: '38px' }}
        >
          Clear Filters
        </button>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={exportCSV} style={{ ...styles.button, backgroundColor: COLORS.info, color: 'white', fontWeight: '600' }}>📥 Export</button>
          <button onClick={() => setShowAddModal(true)} disabled={!canModify} style={{ ...styles.button, ...styles.buttonPrimary }}>+ Add</button>
        </div>
      </div>

      {/* Info Banner */}
      <div style={{ 
        backgroundColor: '#DBEAFE', 
        padding: '8px 12px', 
        borderRadius: '6px', 
        marginBottom: '16px',
        fontSize: '13px',
        color: '#1E40AF'
      }}>
        ℹ️ Showing {inventoryData.length} of {totalCount} results (max 500 per query). Use filters above to find specific items.
      </div>

      <div style={styles.card}>
        <div style={styles.cardHeader}>
          <h3 style={{ fontWeight: '600' }}>Inventory Database ({inventoryData.length})</h3>
        </div>
        <div style={{ maxHeight: '600px', overflowY: 'auto', overflowX: 'auto' }}>
          <table style={styles.table}>
            <thead style={{ position: 'sticky', top: 0 }}>
              <tr>
                <th style={{ ...styles.th, minWidth: '100px' }}>ISO</th>
                <th style={{ ...styles.th, minWidth: '140px' }}>Ident Code</th>
                <th style={{ ...styles.th, minWidth: '180px' }}>Description</th>
                <th style={{ ...styles.th, backgroundColor: COLORS.info, color: 'white', textAlign: 'center' }}>Pos Qty</th>
                <th style={{ ...styles.th, backgroundColor: COLORS.teal, color: 'white', textAlign: 'center' }}>TEN WH</th>
                <th style={{ ...styles.th, backgroundColor: COLORS.secondary, color: 'white', textAlign: 'center' }}>YARD</th>
                <th style={{ ...styles.th, backgroundColor: '#2563EB', color: 'white', textAlign: 'center' }}>SITE</th>
                <th style={{ ...styles.th, backgroundColor: COLORS.orange, color: 'white', textAlign: 'center' }}>LOST</th>
                <th style={{ ...styles.th, backgroundColor: COLORS.purple, color: 'white', textAlign: 'center' }}>BROKEN</th>
                <th style={{ ...styles.th, backgroundColor: COLORS.success, color: 'white', textAlign: 'center' }}>Rec Out</th>
                <th style={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {inventoryData.map((item, idx) => (
                <tr key={`${item.iso_number}-${item.ident_code}-${idx}`}>
                  <td style={{ ...styles.td, fontSize: '11px' }}>
                    {item.iso_number || '-'}
                  </td>
                  <td style={{ ...styles.td, fontFamily: 'monospace', fontWeight: '600', fontSize: '12px' }}>{item.ident_code}</td>
                  <td style={{ ...styles.td, maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis', fontSize: '12px' }} title={item.description}>
                    {item.description || '-'}
                  </td>
                  <td style={{ ...styles.td, textAlign: 'center', fontWeight: '600', color: COLORS.info }}>{item.pos_qty || 0}</td>
                  <td style={{ ...styles.td, textAlign: 'center', fontWeight: '600', color: COLORS.teal }}>{item.collected_ten_wh || 0}</td>
                  <td style={{ ...styles.td, textAlign: 'center', fontWeight: '600' }}>{item.yard_qty || 0}</td>
                  <td style={{ ...styles.td, textAlign: 'center', fontWeight: '600' }}>{item.site_qty || 0}</td>
                  <td style={{ ...styles.td, textAlign: 'center', fontWeight: '600' }}>{item.lost_qty || 0}</td>
                  <td style={{ ...styles.td, textAlign: 'center', fontWeight: '600' }}>{item.broken_qty || 0}</td>
                  <td style={{ ...styles.td, textAlign: 'center', fontWeight: '600', color: COLORS.success }}>{item.record_out || 0}</td>
                  <td style={styles.td}>
                    <ActionButton color={COLORS.info} onClick={() => openBalanceModal(item)} disabled={!canModify} title="Balance">⚖️</ActionButton>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Balance Modal */}
      <Modal isOpen={showBalanceModal} onClose={() => setShowBalanceModal(false)} title="⚖️ Manual Balance">
        <p style={{ marginBottom: '16px' }}><strong>{selectedItem?.ident_code}</strong></p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '16px' }}>
          <div>
            <label style={{ ...styles.label, color: COLORS.teal }}>Collected TEN</label>
            <input type="number" value={balanceData.collected_ten_wh} onChange={(e) => setBalanceData({ ...balanceData, collected_ten_wh: e.target.value })} style={styles.input} min="0" />
          </div>
          <div>
            <label style={{ ...styles.label, color: COLORS.secondary }}>YARD</label>
            <input type="number" value={balanceData.yard_qty} onChange={(e) => setBalanceData({ ...balanceData, yard_qty: e.target.value })} style={styles.input} min="0" />
          </div>
          <div>
            <label style={{ ...styles.label, color: '#2563EB' }}>SITE</label>
            <input type="number" value={balanceData.site_qty} onChange={(e) => setBalanceData({ ...balanceData, site_qty: e.target.value })} style={styles.input} min="0" />
          </div>
          <div>
            <label style={{ ...styles.label, color: COLORS.orange }}>LOST</label>
            <input type="number" value={balanceData.lost_qty} onChange={(e) => setBalanceData({ ...balanceData, lost_qty: e.target.value })} style={styles.input} min="0" />
          </div>
          <div>
            <label style={{ ...styles.label, color: COLORS.purple }}>BROKEN</label>
            <input type="number" value={balanceData.broken_qty} onChange={(e) => setBalanceData({ ...balanceData, broken_qty: e.target.value })} style={styles.input} min="0" />
          </div>
        </div>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          <button onClick={() => setShowBalanceModal(false)} style={{ ...styles.button, ...styles.buttonSecondary }}>Cancel</button>
          <button onClick={saveBalance} style={{ ...styles.button, ...styles.buttonPrimary }}>Save</button>
        </div>
      </Modal>

      {/* Add Item Modal - V32.3 Enhanced */}
      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="+ Add New Item">
        <div style={{ marginBottom: '16px' }}>
          <label style={styles.label}>ISO Number (optional)</label>
          <input
            type="text"
            value={newItem.iso_number || ''}
            onChange={(e) => setNewItem({ ...newItem, iso_number: e.target.value.toUpperCase() })}
            style={styles.input}
            placeholder="e.g., P121A01-AL21011-8-01"
          />
        </div>
        <div style={{ marginBottom: '16px' }}>
          <label style={styles.label}>Ident Code *</label>
          <input
            type="text"
            value={newItem.ident_code}
            onChange={(e) => setNewItem({ ...newItem, ident_code: e.target.value.toUpperCase() })}
            style={styles.input}
            placeholder="e.g., BOLT-M16-100"
          />
        </div>
        <div style={{ marginBottom: '16px' }}>
          <label style={styles.label}>Description</label>
          <input
            type="text"
            value={newItem.description}
            onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
            style={styles.input}
            placeholder="Item description..."
          />
        </div>
        
        {/* V32.3: Quantity fields */}
        <div style={{ marginBottom: '16px', padding: '12px', backgroundColor: '#f9fafb', borderRadius: '8px' }}>
          <label style={{ ...styles.label, marginBottom: '12px' }}>Initial Quantities</label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '12px', color: COLORS.info, fontWeight: '500' }}>Site Qty</label>
              <input
                type="number"
                min="0"
                value={newItem.site_qty || 0}
                onChange={(e) => setNewItem({ ...newItem, site_qty: parseInt(e.target.value) || 0 })}
                style={{ ...styles.input, textAlign: 'center' }}
              />
            </div>
            <div>
              <label style={{ fontSize: '12px', color: COLORS.secondary, fontWeight: '500' }}>Yard Qty</label>
              <input
                type="number"
                min="0"
                value={newItem.yard_qty || 0}
                onChange={(e) => setNewItem({ ...newItem, yard_qty: parseInt(e.target.value) || 0 })}
                style={{ ...styles.input, textAlign: 'center' }}
              />
            </div>
            <div>
              <label style={{ fontSize: '12px', color: COLORS.orange, fontWeight: '500' }}>Lost Qty</label>
              <input
                type="number"
                min="0"
                value={newItem.lost_qty || 0}
                onChange={(e) => setNewItem({ ...newItem, lost_qty: parseInt(e.target.value) || 0 })}
                style={{ ...styles.input, textAlign: 'center' }}
              />
            </div>
            <div>
              <label style={{ fontSize: '12px', color: COLORS.purple, fontWeight: '500' }}>Broken Qty</label>
              <input
                type="number"
                min="0"
                value={newItem.broken_qty || 0}
                onChange={(e) => setNewItem({ ...newItem, broken_qty: parseInt(e.target.value) || 0 })}
                style={{ ...styles.input, textAlign: 'center' }}
              />
            </div>
          </div>
        </div>
        
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          <button onClick={() => setShowAddModal(false)} style={{ ...styles.button, ...styles.buttonSecondary }}>Cancel</button>
          <button onClick={addNewItem} style={{ ...styles.button, ...styles.buttonPrimary }}>Add Item</button>
        </div>
      </Modal>
    </div>
  );
}

// ============================================================
// MAIN APP COMPONENT
// ============================================================
// ============================================================
// PRINT REQUESTS PAGE - V28.2
// ============================================================
function PrintRequestsPage({ user }) {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadRequests(); }, []);

  const loadRequests = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('request_components')
      .select(`*, requests (request_number, sub_number, request_type, sub_category, iso_number, full_spool_number, hf_number, test_pack_number, created_by_name, created_at)`)
      .not('status', 'in', '("Done","Cancelled")')
      .order('created_at', { ascending: false });
    if (data) setRequests(data);
    setLoading(false);
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading...</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }} className="no-print">
        <h2 style={{ fontSize: '20px', fontWeight: 'bold' }}>🖨️ Print Requests</h2>
        <button onClick={handlePrint} style={{ ...styles.button, backgroundColor: COLORS.info, color: 'white', padding: '12px 24px', fontSize: '14px' }}>
          🖨️ Print Preview
        </button>
      </div>

      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { font-size: 10px; }
          table { page-break-inside: auto; }
          tr { page-break-inside: avoid; }
        }
      `}</style>

      <div style={{ ...styles.card, padding: '20px' }}>
        <div style={{ textAlign: 'center', marginBottom: '20px', borderBottom: '2px solid #E31E24', paddingBottom: '16px' }}>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#E31E24' }}>MAX STREICHER</h1>
          <p style={{ fontSize: '14px', color: '#6b7280' }}>Materials Manager - Active Requests</p>
          <p style={{ fontSize: '12px', color: '#9ca3af' }}>Printed: {new Date().toLocaleString()}</p>
        </div>

        <table style={{ ...styles.table, fontSize: '11px' }}>
          <thead>
            <tr style={{ backgroundColor: '#f3f4f6' }}>
              <th style={{ ...styles.th, padding: '8px 4px' }}>Request</th>
              <th style={{ ...styles.th, padding: '8px 4px' }}>Type</th>
              <th style={{ ...styles.th, padding: '8px 4px' }}>ISO</th>
              <th style={{ ...styles.th, padding: '8px 4px' }}>Code</th>
              <th style={{ ...styles.th, padding: '8px 4px' }}>Description</th>
              <th style={{ ...styles.th, padding: '8px 4px' }}>Qty</th>
              <th style={{ ...styles.th, padding: '8px 4px' }}>Status</th>
              <th style={{ ...styles.th, padding: '8px 4px' }}>Requester</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((req, idx) => (
              <tr key={idx} style={{ borderBottom: '1px solid #e5e7eb' }}>
                <td style={{ ...styles.td, padding: '6px 4px', fontFamily: 'monospace', fontWeight: '600' }}>
                  {String(req.requests?.request_number).padStart(5, '0')}-{req.requests?.sub_number}
                </td>
                <td style={{ ...styles.td, padding: '6px 4px' }}>{req.requests?.request_type || '-'}</td>
                <td style={{ ...styles.td, padding: '6px 4px', fontSize: '10px' }}>{req.requests?.iso_number || '-'}</td>
                <td style={{ ...styles.td, padding: '6px 4px', fontFamily: 'monospace', fontSize: '10px' }}>{req.ident_code}</td>
                <td style={{ ...styles.td, padding: '6px 4px', maxWidth: '150px', overflow: 'hidden', textOverflow: 'ellipsis' }}>{req.description?.substring(0, 40) || '-'}</td>
                <td style={{ ...styles.td, padding: '6px 4px', textAlign: 'center' }}>{req.quantity}</td>
                <td style={{ ...styles.td, padding: '6px 4px' }}>
                  <span style={{ ...styles.statusBadge, backgroundColor: STATUS_COLORS[req.status] || COLORS.gray, fontSize: '9px', padding: '2px 6px' }}>{req.status}</span>
                </td>
                <td style={{ ...styles.td, padding: '6px 4px', fontSize: '10px' }}>{req.requests?.created_by_name || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div style={{ marginTop: '20px', textAlign: 'center', color: '#9ca3af', fontSize: '11px' }}>
          Total: {requests.length} active requests
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [user, setUser] = useState(null);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [badges, setBadges] = useState({});
  // V28.10: Notification system
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    if (user) {
      loadBadges();
      loadNotifications();
    }
  }, [user, currentPage]);

  // V28.10: Load user notifications
  const loadNotifications = async () => {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_read', false)
        .order('created_at', { ascending: false })
        .limit(20);
      
      if (data) setNotifications(data);
    } catch (err) {
      console.log('Notifications not available yet');
    }
  };

  // V28.10: Mark notification as read
  const markAsRead = async (notifId) => {
    await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', notifId);
    loadNotifications();
  };

  // V28.10: Mark all as read
  const markAllAsRead = async () => {
    await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('user_id', user.id)
      .eq('is_read', false);
    setNotifications([]);
    setShowNotifications(false);
  };

  const loadBadges = async () => {
    const counts = {};
    
    const { data: siteData } = await supabase.from('request_components').select('id', { count: 'exact' }).eq('status', 'WH_Site');
    const { data: yardData } = await supabase.from('request_components').select('id', { count: 'exact' }).eq('status', 'Yard');
    const { data: engData } = await supabase.from('request_components').select('id', { count: 'exact' }).eq('status', 'Eng');
    const { data: transData } = await supabase.from('request_components').select('id', { count: 'exact' }).eq('status', 'Trans');
    const { data: orderData } = await supabase.from('request_components').select('id', { count: 'exact' }).eq('status', 'Order');
    const { data: orderedData } = await supabase.from('request_components').select('id', { count: 'exact' }).eq('status', 'Ordered');
    const { data: spareData } = await supabase.from('request_components').select('id', { count: 'exact' }).eq('status', 'Spare');
    const { data: mngData } = await supabase.from('request_components').select('id', { count: 'exact' }).eq('status', 'Mng');
    // V29.0: HF badge counts unique HF numbers (not components)
    const { data: hfData } = await supabase
      .from('requests')
      .select('hf_number')
      .not('hf_number', 'is', null);
    // Get unique HF numbers that have pending components
    let hfCount = 0;
    if (hfData) {
      const uniqueHFs = [...new Set(hfData.map(r => r.hf_number).filter(Boolean))];
      for (const hfNum of uniqueHFs) {
        const { data: comps } = await supabase
          .from('request_components')
          .select('id, requests!inner(hf_number)')
          .eq('requests.hf_number', hfNum)
          .in('status', ['HF', 'Eng']);
        if (comps && comps.length > 0) hfCount++;
      }
    }
    // V29.0: TestPack badge counts unique TEST_PACK_NUMBERS (not requests/components)
    const { data: tpData } = await supabase
      .from('requests')
      .select('test_pack_number')
      .not('test_pack_number', 'is', null);
    // Get unique test_pack_numbers that have pending components
    let tpCount = 0;
    if (tpData) {
      const uniqueTPs = [...new Set(tpData.map(r => r.test_pack_number).filter(Boolean))];
      for (const tpNum of uniqueTPs) {
        const { data: comps } = await supabase
          .from('request_components')
          .select('id, requests!inner(test_pack_number)')
          .eq('requests.test_pack_number', tpNum)
          .in('status', ['TP', 'Eng', 'TP_Spool_Sent']);
        if (comps && comps.length > 0) tpCount++;
      }
    }
    const { data: collectData } = await supabase.from('request_components').select('id', { count: 'exact' }).eq('status', 'ToCollect');
    
    // Engineering Checks counts - these should be added to WH Site and WH Yard badges
    // V32.2: Don't count 'Both' - parent items should not be counted
    const { data: engChecksSite } = await supabase.from('request_components').select('id', { count: 'exact' }).eq('has_eng_check', true).eq('eng_check_sent_to', 'WH_Site');
    const { data: engChecksYard } = await supabase.from('request_components').select('id', { count: 'exact' }).eq('has_eng_check', true).eq('eng_check_sent_to', 'Yard');

    counts.whSite = (siteData?.length || 0) + (engChecksSite?.length || 0);
    counts.whYard = (yardData?.length || 0) + (engChecksYard?.length || 0);
    counts.engineering = engData?.length || 0;
    counts.siteIn = transData?.length || 0;
    // V32.3: Orders badge = To Order + Ordered
    counts.orders = (orderData?.length || 0) + (orderedData?.length || 0);
    counts.materialIn = 0; // Material In doesn't need a badge
    counts.spareParts = spareData?.length || 0;
    counts.management = mngData?.length || 0;
    counts.hfPage = hfCount;
    counts.testPackPage = tpCount;
    counts.toBeCollected = collectData?.length || 0;

    setBadges(counts);
  };

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentPage('dashboard');
  };

  if (!user) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  const pageTitles = {
    dashboard: 'Dashboard',
    requests: 'Nuova Request',
    mir: 'MIR - Material Issue Report',
    materialIn: 'Material IN',
    siteIn: 'Site IN',
    whSite: 'WH Site',
    whYard: 'WH Yard',
    engineering: 'Engineering',
    hfPage: 'HF - Flanged Joints',
    testPackPage: 'TestPack Materials',
    toBeCollected: 'To Collect',
    spareParts: 'Spare Parts',
    orders: 'Orders',
    log: 'Log Movimenti',
    management: 'Management',
    database: 'Database Inventario'
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard': return <Dashboard user={user} setActivePage={setCurrentPage} />;
      case 'requests': return <RequestsPage user={user} />;
      case 'mir': return <MIRPage user={user} />;
      case 'materialIn': return <MaterialInPage user={user} />;
      case 'siteIn': return <SiteInPage user={user} />;
      case 'whSite': return <WHSitePage user={user} />;
      case 'whYard': return <WHYardPage user={user} />;
      case 'engineering': return <EngineeringPage user={user} />;
      case 'hfPage': return <HFPage user={user} />;
      case 'testPackPage': return <TestPackPage user={user} />;
      case 'toBeCollected': return <ToBeCollectedPage user={user} />;
      case 'spareParts': return <SparePartsPage user={user} />;
      case 'orders': return <OrdersPage user={user} />;
      case 'log': return <LogPage user={user} />;
      case 'management': return <ManagementPage user={user} />;
      case 'database': return <DatabasePage user={user} />;
      case 'print': return <PrintRequestsPage user={user} />;
      default: return <Dashboard user={user} setActivePage={setCurrentPage} />;
    }
  };

  return (
    <div style={styles.container}>
      <Sidebar
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        user={user}
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
        badges={badges}
      />
      <div style={styles.main}>
        <header style={styles.header}>
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#1f2937' }}>{pageTitles[currentPage]}</h2>
            <p style={{ fontSize: '12px', color: '#6b7280' }}>
              {user.full_name} ({user.role}) - Badge: {user.badge_number}
            </p>
          </div>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            {/* V28.10: Notification Bell */}
            <div style={{ position: 'relative' }}>
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                style={{ 
                  ...styles.button, 
                  backgroundColor: notifications.length > 0 ? '#FEF3C7' : '#f3f4f6',
                  border: notifications.length > 0 ? '2px solid #F59E0B' : '1px solid #d1d5db',
                  padding: '8px 12px',
                  position: 'relative'
                }}
              >
                🔔
                {notifications.length > 0 && (
                  <span style={{
                    position: 'absolute',
                    top: '-6px',
                    right: '-6px',
                    backgroundColor: COLORS.primary,
                    color: 'white',
                    borderRadius: '50%',
                    width: '20px',
                    height: '20px',
                    fontSize: '11px',
                    fontWeight: 'bold',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {notifications.length > 9 ? '9+' : notifications.length}
                  </span>
                )}
              </button>
              
              {/* Notification Dropdown */}
              {showNotifications && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  right: 0,
                  marginTop: '8px',
                  width: '350px',
                  maxHeight: '400px',
                  overflowY: 'auto',
                  backgroundColor: 'white',
                  borderRadius: '8px',
                  boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
                  border: '1px solid #e5e7eb',
                  zIndex: 1000
                }}>
                  <div style={{ 
                    padding: '12px 16px', 
                    borderBottom: '1px solid #e5e7eb',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    backgroundColor: '#f9fafb'
                  }}>
                    <span style={{ fontWeight: '600', color: '#374151' }}>🔔 Notifiche</span>
                    {notifications.length > 0 && (
                      <button 
                        onClick={markAllAsRead}
                        style={{ fontSize: '12px', color: COLORS.info, background: 'none', border: 'none', cursor: 'pointer' }}
                      >
                        Segna tutte lette
                      </button>
                    )}
                  </div>
                  
                  {notifications.length === 0 ? (
                    <div style={{ padding: '24px', textAlign: 'center', color: '#9ca3af' }}>
                      ✅ Nessuna nuova notifica
                    </div>
                  ) : (
                    notifications.map(notif => (
                      <div 
                        key={notif.id}
                        onClick={() => markAsRead(notif.id)}
                        style={{
                          padding: '12px 16px',
                          borderBottom: '1px solid #f3f4f6',
                          cursor: 'pointer',
                          backgroundColor: 'white',
                          transition: 'background 0.2s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                      >
                        <div style={{ fontWeight: '500', color: '#1f2937', marginBottom: '4px' }}>
                          {notif.type === 'collect' ? '📦' : notif.type === 'warning' ? '⚠️' : 'ℹ️'} {notif.title}
                        </div>
                        <div style={{ fontSize: '13px', color: '#6b7280' }}>{notif.message}</div>
                        <div style={{ fontSize: '11px', color: '#9ca3af', marginTop: '4px' }}>
                          {new Date(notif.created_at).toLocaleString('it-IT')}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
            
            <button onClick={loadBadges} style={{ ...styles.button, ...styles.buttonSecondary }}>🔄 Refresh</button>
            <button onClick={handleLogout} style={{ ...styles.button, backgroundColor: COLORS.gray, color: 'white' }}>🚪 Logout</button>
          </div>
        </header>
        <main style={styles.content}>
          {renderPage()}
        </main>
      </div>
    </div>
  );
}
