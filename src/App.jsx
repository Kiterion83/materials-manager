// ============================================================
// MATERIALS MANAGER V28.5 - APP.JSX COMPLETE
// MAX STREICHER Edition - Full Features - ALL ENGLISH
// V28.5 Changes:
//   - Dashboard navigation: clickable boxes go to respective pages
//   - IB movements fix: SQL functions create movements + update inventory
//   - Site IN actions: Receive/Delete/Return dropdown with previous_status
//   - To Be Collected actions: Collect/Delete/Return dropdown
//   - Over quantity logic: sum ALL open requests vs available inventory
//   - P121 filter: ISO search limited to P121 project
//   - previous_status column: tracks status for Return actions
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
const APP_VERSION = 'V28.5';

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
  Spare: COLORS.pink,
  Mng: COLORS.yellow,
  Order: COLORS.orange,
  Ordered: COLORS.cyan,
  ToCollect: COLORS.success,
  HF: COLORS.teal,
  TP: COLORS.purple,
  Done: COLORS.gray
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
    backgroundColor: COLORS.primary,
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontWeight: 'bold',
    fontSize: '14px'
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
                Request: {String(componentInfo.requests?.request_number).padStart(5, '0')}-{componentInfo.requests?.sub_number}
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
          <div style={{
            width: '64px',
            height: '64px',
            backgroundColor: COLORS.primary,
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
            color: 'white',
            fontWeight: 'bold',
            fontSize: '20px'
          }}>
            STR
          </div>
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
    { id: 'toBeCollected', icon: '✅', label: 'To Be Collected', perm: 'perm_wh_site' },
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
        <div style={styles.logoIcon}>STR</div>
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
    const statuses = ['Yard', 'WH_Site', 'Eng', 'Mng', 'Spare', 'Order', 'Trans', 'ToCollect', 'TP', 'HF'];
    const counts = {};
    
    for (const status of statuses) {
      const { data } = await supabase.from('request_components').select('id').eq('status', status);
      counts[status] = data?.length || 0;
    }
    
    // V28.5 FIX: Also count Engineering Checks sent to WH_Site and Yard
    const { data: engChecksSite } = await supabase
      .from('request_components')
      .select('id')
      .eq('has_eng_check', true)
      .eq('eng_check_sent_to', 'WH_Site');
    
    const { data: engChecksYard } = await supabase
      .from('request_components')
      .select('id')
      .eq('has_eng_check', true)
      .eq('eng_check_sent_to', 'Yard');
    
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
      tp: counts['TP'] || 0,
      hf: counts['HF'] || 0,
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
          <p style={{ fontSize: '14px', opacity: 0.9, marginBottom: '8px' }}>To Be Collected</p>
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
  const [currentMaterial, setCurrentMaterial] = useState({ ident_code: '', tag: '', qty: '', description: '' });
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
    
    // Check project qty availability
    if (requestType === 'Piping') {
      await checkProjectQtyAvailable(currentMaterial.ident_code, currentMaterial.qty);
    }
    
    // Use description from currentMaterial (set by handleIdentCodeChange) or find from identOptions
    const selected = identOptions.find(o => o.ident_code === currentMaterial.ident_code);
    const materialDesc = currentMaterial.description || selected?.description || '';
    
    setMaterials([...materials, {
      ident_code: currentMaterial.ident_code,
      tag: currentMaterial.tag,
      description: materialDesc,
      dia1: currentMaterial.dia1 || '',
      qty: currentMaterial.qty,
      pos_qty: selected?.pos_qty || 0
    }]);
    setCurrentMaterial({ ident_code: '', tag: '', qty: '', description: '', dia1: '' });
    setTagOptions([]);
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
        if (!testPackNumber) throw new Error('Test Pack Number required');
        if (missingType === 'Material' && materials.length === 0) {
          throw new Error('Add at least one material');
        }
        if (missingType === 'Spool' && selectedSpools.length === 0) {
          throw new Error('Add at least one spool');
        }
      }

      // For TestPack Spool: Gather all materials from all selected spools
      let combinedMaterials = [...materials];
      if (requestType === 'TestPack' && missingType === 'Spool' && selectedSpools.length > 0) {
        // Fetch materials from all selected spools
        for (const spoolNum of selectedSpools) {
          const { data: spoolMats } = await supabase
            .from('project_materials')
            .select('ident_code, description, pos_qty, tag_number')
            .eq('full_spool_number', spoolNum);
          
          if (spoolMats) {
            // Add each material from the spool (with qty = pos_qty)
            spoolMats.forEach(mat => {
              combinedMaterials.push({
                ident_code: mat.ident_code,
                description: mat.description || '',
                qty: mat.pos_qty || 1,
                tag: mat.tag_number || '',
                from_spool: spoolNum
              });
            });
          }
        }
        // Set description to list of spools
        setDescription(selectedSpools.join(', '));
      }

      // Get next request number
      const { data: counterData } = await supabase.rpc('get_next_request_number');
      const reqNumber = counterData || nextNumber;

      // Create request
      const { data: request, error: reqError } = await supabase
        .from('requests')
        .insert({
          request_number: reqNumber,
          sub_number: 0,
          requester_user_id: user.id,
          request_type: requestType,
          sub_category: requestType === 'Piping' ? subCategory : null,
          iso_number: requestType !== 'TestPack' ? (isoNumber || null) : null,
          full_spool_number: requestType !== 'TestPack' ? (spoolNumber || null) : null,
          hf_number: (requestType === 'Piping' && subCategory === 'Erection') ? (hfNumber || null) : null,
          test_pack_number: requestType === 'TestPack' ? testPackNumber : null,
          missing_type: requestType === 'TestPack' ? missingType : null,
          description: requestType === 'TestPack' 
            ? (missingType === 'Spool' ? `Spools: ${selectedSpools.join(', ')}` : (componentDescription || null))
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
        // Use combinedMaterials for TestPack Spool, otherwise use materials
        const matsToInsert = (requestType === 'TestPack' && missingType === 'Spool') 
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
              current_location: destination === 'yard' ? 'YARD' : 'SITE'
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
            note: `Request ${String(reqNumber).padStart(5, '0')}-0 created and sent to ${destination.toUpperCase()}`
          });
        }
      }

      setMessage({ type: 'success', text: `Request ${String(reqNumber).padStart(5, '0')}-0 created successfully!` });
      
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

  const canModify = user.role === 'admin' || user.perm_requests === 'modify';
  const hasWarning = overQuantityWarning !== null;
  const siteYardDisabled = projectQtyExhausted || hfError;

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
          Preview: <strong>{String(nextNumber).padStart(5, '0')}-0</strong>
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
                <input
                  type="text"
                  value={testPackNumber}
                  onChange={(e) => setTestPackNumber(e.target.value)}
                  style={{ ...styles.input, backgroundColor: 'white', fontSize: '16px' }}
                  placeholder="Es: TP-2024-001"
                  disabled={!canModify}
                />
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
                <label style={styles.label}>Missing Type</label>
                <div style={{ display: 'flex', gap: '24px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                    <input
                      type="radio"
                      name="missingType"
                      value="Material"
                      checked={missingType === 'Material'}
                      onChange={(e) => setMissingType(e.target.value)}
                      style={{ width: '18px', height: '18px' }}
                    />
                    <span style={{ fontWeight: missingType === 'Material' ? '600' : '400' }}>Material</span>
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                    <input
                      type="radio"
                      name="missingType"
                      value="Spool"
                      checked={missingType === 'Spool'}
                      onChange={(e) => setMissingType(e.target.value)}
                      style={{ width: '18px', height: '18px' }}
                    />
                    <span style={{ fontWeight: missingType === 'Spool' ? '600' : '400' }}>Spool</span>
                  </label>
                </div>
              </div>

              {missingType === 'Spool' && (
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
          {requestType !== 'Mechanical' && (requestType !== 'TestPack' || missingType === 'Material') && (
            <div style={{
              marginTop: '24px',
              padding: '20px',
              backgroundColor: '#f9fafb',
              borderRadius: '8px',
              border: '1px solid #e5e7eb'
            }}>
              <h4 style={{ fontWeight: '600', marginBottom: '16px' }}>📦 Add Materials</h4>
              
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 100px 80px', gap: '12px', alignItems: 'end' }}>
                <div>
                  <label style={styles.label}>
                    Ident Code <span style={{ fontSize: '11px', color: '#9ca3af' }}>(type 3+ chars)</span>
                  </label>
                  <AsyncSearchInput
                    value={currentMaterial.ident_code}
                    onChange={(val) => {
                      const valStr = typeof val === 'object' ? val.value : val;
                      setCurrentMaterial({ ...currentMaterial, ident_code: valStr });
                    }}
                    onSearch={searchIdentCodeGlobal}
                    onSelect={(val) => handleIdentCodeChange(val)}
                    minChars={3}
                    placeholder="Type ident code (3+ chars)..."
                    disabled={!canModify}
                  />
                </div>
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
                  style={{ ...styles.button, ...styles.buttonPrimary, height: '42px', justifyContent: 'center' }}
                  disabled={!canModify || !currentMaterial.ident_code || !currentMaterial.qty}
                >
                  + Add
                </button>
              </div>

              {/* Material Preview - Shows Description and Diam after selection */}
              {currentMaterial.ident_code && (
                <div style={{
                  marginTop: '12px',
                  padding: '12px 16px',
                  backgroundColor: '#EFF6FF',
                  borderRadius: '6px',
                  border: '1px solid #BFDBFE',
                  display: 'flex',
                  gap: '24px',
                  alignItems: 'center'
                }}>
                  <div style={{ flex: 1 }}>
                    <span style={{ fontSize: '11px', color: '#6b7280', textTransform: 'uppercase' }}>Description</span>
                    <p style={{ fontSize: '14px', color: '#1f2937', marginTop: '2px' }}>
                      {currentMaterial.description || '(no description)'}
                    </p>
                  </div>
                  <div style={{ minWidth: '80px' }}>
                    <span style={{ fontSize: '11px', color: '#6b7280', textTransform: 'uppercase' }}>Diam</span>
                    <p style={{ fontSize: '14px', color: '#1f2937', fontWeight: '600', marginTop: '2px' }}>
                      {currentMaterial.dia1 || '-'}
                    </p>
                  </div>
                </div>
              )}

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
              title={siteYardDisabled ? 'Disabled - use Engineering' : ''}
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
              title={siteYardDisabled ? 'Disabled - use Engineering' : ''}
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
              ⚙️ Send to Engineering {siteYardDisabled && '(Required)'}
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
  const [engNotes, setEngNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPartialModal, setShowPartialModal] = useState(false);
  const [selectedComponent, setSelectedComponent] = useState(null);
  const [partialQty, setPartialQty] = useState('');
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

  useEffect(() => { loadComponents(); }, []);

  const loadComponents = async () => {
    setLoading(true);
    
    // Load inventory for WH_Site and WH_Yard quantities
    const { data: invData, error: invError } = await supabase.from('inventory').select('ident_code, site_qty, yard_qty');
    console.log('📦 WH Site - Inventory loaded:', { count: invData?.length, error: invError });
    
    const invMap = {};
    if (invData) {
      invData.forEach(i => { invMap[i.ident_code] = { site: i.site_qty || 0, yard: i.yard_qty || 0 }; });
      // Debug: show first 5 inventory items
      console.log('📦 WH Site - Sample inventory:', invData.slice(0, 5));
    }
    setInventoryMap(invMap);
    
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
      .select(`*, requests (request_number, sub_number, sub_category, request_type, iso_number, full_spool_number, hf_number, test_pack_number, description)`)
      .eq('status', 'WH_Site');

    console.log('WH Site - Loading components with status=WH_Site:', { siteData, siteError });
    
    // Debug: check if component ident_codes exist in inventory
    if (siteData && siteData.length > 0) {
      siteData.forEach(comp => {
        const inv = invMap[comp.ident_code];
        console.log(`📦 Component ${comp.ident_code}: inventory=`, inv || 'NOT FOUND');
      });
    }

    // Load Engineering Checks sent to Site (separate section)
    const { data: checksData, error: checksError } = await supabase
      .from('request_components')
      .select(`*, requests (request_number, sub_number, sub_category, request_type, iso_number, full_spool_number, hf_number, test_pack_number, description)`)
      .eq('has_eng_check', true)
      .eq('eng_check_sent_to', 'WH_Site');

    console.log('WH Site - Loading Engineering Checks:', { checksData, checksError });

    // Load Engineering Notes (legacy)
    const { data: notesData } = await supabase
      .from('request_components')
      .select(`*, requests (request_number, sub_number, description)`)
      .eq('has_eng_check', true)
      .eq('eng_check_sent_to', 'WH_Site');

    if (siteData) setComponents(siteData);
    if (checksData) setEngChecks(checksData);
    if (notesData) setEngNotes(notesData);
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
    let newStatus;
    let note = '';
    
    switch(dest) {
      case 'siteIn':
        newStatus = 'ToCollect';
        note = 'Ready for collection (normal)';
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
    
    await logHistory(component.id, `Ready - ${dest.toUpperCase()}`, 'WH_Site', newStatus, note);
    
    setShowDestPopup(false);
    setSelectedComponent(null);
    loadComponents();
  };

  const submitPartial = async () => {
    if (!partialQty || parseInt(partialQty) >= selectedComponent.quantity) {
      alert('Partial quantity must be less than total');
      return;
    }
    
    const sendQty = parseInt(partialQty);
    const remainingQty = selectedComponent.quantity - sendQty;
    
    // Update original
    await supabase.from('request_components')
      .update({ quantity: sendQty, status: 'ToCollect' })
      .eq('id', selectedComponent.id);
    
    await logHistory(selectedComponent.id, 'Partial Split', 'WH_Site', 'ToCollect', 
      `Qty ${sendQty} ready, ${remainingQty} remaining  in queue`);
    
    // Create new for remaining
    const { data: subData } = await supabase
      .from('requests')
      .select('sub_number')
      .eq('request_number', selectedComponent.requests.request_number)
      .order('sub_number', { ascending: false })
      .limit(1);
    
    const nextSub = (subData?.[0]?.sub_number || 0) + 1;
    
    const { data: newReq } = await supabase.from('requests')
      .insert({
        request_number: selectedComponent.requests.request_number,
        sub_number: nextSub,
        request_type: selectedComponent.requests.request_type,
        sub_category: selectedComponent.requests.sub_category
      })
      .select()
      .single();
    
    await supabase.from('request_components').insert({
      request_id: newReq.id,
      ident_code: selectedComponent.ident_code,
      description: selectedComponent.description,
      quantity: remainingQty,
      status: 'WH_Site',
      current_location: 'SITE'
    });

    setShowPartialModal(false);
    setPartialQty('');
    loadComponents();
  };

  // Handle Engineering Check actions
  const handleCheckAction = async (check, action) => {
    try {
      if (action === 'check_found') {
        // Found → move to ToCollect
        await supabase.from('request_components')
          .update({ 
            status: 'ToCollect', 
            has_eng_check: false,
            eng_check_message: null,
            eng_check_sent_to: null
          })
          .eq('id', check.id);
        await logHistory(check.id, 'Check - Found', 'WH_Site', 'ToCollect', 'Item found after Engineering check');
        loadComponents();
      } else if (action === 'check_notfound') {
        // Not Found → return to Engineering
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
      } else if (action === 'check_partial') {
        // Open partial modal
        setSelectedCheck(check);
        setCheckPartialQty('');
        setCheckFoundDest('ToCollect');
        setCheckNotFoundDest('Eng');
        setShowCheckPartialModal(true);
      }
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };

  // Handle Engineering Check Partial Submit
  const handleCheckPartialSubmit = async () => {
    if (!selectedCheck || !checkPartialQty) return;
    
    const foundQty = parseInt(checkPartialQty);
    const notFoundQty = selectedCheck.quantity - foundQty;
    
    if (foundQty <= 0 || foundQty >= selectedCheck.quantity) {
      alert('Quantity must be between 1 and ' + (selectedCheck.quantity - 1));
      return;
    }
    
    try {
      // Get current request info
      const reqNumber = selectedCheck.requests?.request_number;
      
      // Get next sub_number for this request
      const { data: subData } = await supabase
        .from('requests')
        .select('sub_number')
        .eq('request_number', reqNumber)
        .order('sub_number', { ascending: false })
        .limit(1);
      
      const nextSub = (subData?.[0]?.sub_number || 0) + 1;
      
      // Create new sub-request for NOT FOUND items
      const { data: newReq } = await supabase.from('requests')
        .insert({
          request_number: reqNumber,
          sub_number: nextSub,
          request_type: selectedCheck.requests?.request_type,
          sub_category: selectedCheck.requests?.sub_category,
          iso_number: selectedCheck.requests?.iso_number,
          full_spool_number: selectedCheck.requests?.full_spool_number,
          hf_number: selectedCheck.requests?.hf_number
        })
        .select()
        .single();
      
      // Create component for NOT FOUND quantity in new sub-request
      await supabase.from('request_components').insert({
        request_id: newReq.id,
        ident_code: selectedCheck.ident_code,
        description: selectedCheck.description,
        tag: selectedCheck.tag,
        dia1: selectedCheck.dia1,
        quantity: notFoundQty,
        status: checkNotFoundDest,
        current_location: checkNotFoundDest === 'Yard' ? 'YARD' : 'SITE',
        has_eng_check: false,
        eng_check_message: null,
        eng_check_sent_to: null
      });
      
      // Update original component with FOUND quantity and new status
      await supabase.from('request_components')
        .update({ 
          quantity: foundQty,
          status: checkFoundDest,
          has_eng_check: false,
          eng_check_message: null,
          eng_check_sent_to: null
        })
        .eq('id', selectedCheck.id);
      
      // Log history for original (found)
      await logHistory(selectedCheck.id, 'Check - Partial Found', 'WH_Site', checkFoundDest, 
        `Partial: ${foundQty} found → ${checkFoundDest}, ${notFoundQty} not found → ${checkNotFoundDest} (${String(reqNumber).padStart(5, '0')}-${nextSub})`);
      
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

  const canModify = user.role === 'admin' || user.perm_wh_site === 'modify';

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading...</div>;

  return (
    <div>
      {/* Engineering Notes */}
      {engNotes.length > 0 && (
        <div style={{
          backgroundColor: '#F3E8FF',
          border: '1px solid #A855F7',
          borderRadius: '8px',
          padding: '16px',
          marginBottom: '24px'
        }}>
          <h4 style={{ fontWeight: '600', color: '#7C3AED', marginBottom: '12px' }}>
            📝 Notes from Engineering ({engNotes.length})
          </h4>
          {engNotes.map(note => (
            <div key={note.id} style={{
              backgroundColor: 'white',
              padding: '12px',
              borderRadius: '6px',
              marginBottom: '8px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <span style={{ fontFamily: 'monospace', fontWeight: '600' }}>{note.ident_code}</span>
                <span style={{ marginLeft: '12px', color: '#6b7280' }}>{note.eng_check_message}</span>
              </div>
              <ActionButton color={COLORS.success} onClick={() => handleAction(note, 'ack')} disabled={!canModify} title="Confirm">✓</ActionButton>
            </div>
          ))}
        </div>
      )}

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
                  <th style={styles.th}>Tag</th>
                  <th style={styles.th}>Diam</th>
                  <th style={styles.th}>Qty</th>
                  <th style={styles.th}>Message</th>
                  <th style={styles.th}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {engChecks.map(check => (
                  <tr key={check.id} style={{ backgroundColor: '#FFFBEB' }}>
                    <td style={styles.td}>{check.requests?.request_type || '-'}</td>
                    <td style={styles.td}>{check.requests?.sub_category || '-'}</td>
                    <td style={{ ...styles.td, fontSize: '11px' }}>{check.requests?.iso_number || check.iso_number || '-'}</td>
                    <td style={{ ...styles.td, fontSize: '11px' }}>{check.requests?.full_spool_number || check.full_spool_number || '-'}</td>
                    <td style={styles.td}>{check.requests?.hf_number || '-'}</td>
                    <td style={styles.td}>{check.requests?.test_pack_number || '-'}</td>
                    <td style={{ ...styles.td, fontFamily: 'monospace', fontWeight: '600' }}>
                      {String(check.requests?.request_number).padStart(5, '0')}-{check.requests?.sub_number}
                    </td>
                    <td style={{ ...styles.td, fontFamily: 'monospace', fontSize: '11px' }}>{check.ident_code}</td>
                    <td style={{ ...styles.td, maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={check.description || ''}>
                      {check.description ? (check.description.length > 50 ? check.description.substring(0, 50) + '...' : check.description) : '-'}
                    </td>
                    <td style={styles.td}>{check.tag || '-'}</td>
                    <td style={styles.td}>{check.dia1 || '-'}</td>
                    <td style={styles.td}>{check.quantity}</td>
                    <td style={{ ...styles.td, color: '#B45309', fontStyle: 'italic' }}>{check.eng_check_message || '-'}</td>
                    <td style={styles.td}>
                      <ActionDropdown
                        actions={[
                          { id: 'check_found', icon: '✓', label: 'Found (All)' },
                          { id: 'check_partial', icon: '✂️', label: 'Partial' },
                          { id: 'check_notfound', icon: '✗', label: 'Not Found → Eng' }
                        ]}
                        onExecute={(action) => handleCheckAction(check, action)}
                        disabled={!canModify}
                        componentId={check.id}
                      />
                    </td>
                  </tr>
                ))}
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
                      <td>${comp.requests?.request_type || '-'}</td>
                      <td>${comp.requests?.sub_category || '-'}</td>
                      <td>${comp.requests?.iso_number || '-'}</td>
                      <td>${comp.requests?.full_spool_number || '-'}</td>
                      <td>${String(comp.requests?.request_number).padStart(5, '0')}-${comp.requests?.sub_number}</td>
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
                  <td style={styles.td}>{comp.requests?.request_type || '-'}</td>
                  <td style={styles.td}>{comp.requests?.sub_category || '-'}</td>
                  <td style={{ ...styles.td, fontSize: '11px' }}>{comp.requests?.iso_number || comp.iso_number || '-'}</td>
                  <td style={{ ...styles.td, fontSize: '11px' }}>{comp.requests?.full_spool_number || comp.full_spool_number || '-'}</td>
                  <td style={styles.td}>{comp.requests?.hf_number || '-'}</td>
                  <td style={styles.td}>{comp.requests?.test_pack_number || '-'}</td>
                  <td style={{ ...styles.td, fontFamily: 'monospace', fontWeight: '600' }}>
                    {String(comp.requests?.request_number).padStart(5, '0')}-{comp.requests?.sub_number}
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
                      actions={[
                        { id: 'ready', icon: '✓', label: 'Ready' },
                        { id: 'pt', icon: '✂️', label: 'Partial' },
                        { id: 'yard', icon: '🏢', label: 'To Yard' },
                        { id: 'eng', icon: '⚙️', label: 'To Engineering' },
                        { id: 'hf', icon: '🔩', label: 'To HF' },
                        { id: 'tp', icon: '📋', label: 'To TestPack' },
                        { id: 'delete', icon: '🗑️', label: 'Delete' }
                      ]}
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

      {/* Partial Modal */}
      <Modal isOpen={showPartialModal} onClose={() => setShowPartialModal(false)} title="Split Partial">
        <p style={{ marginBottom: '16px' }}>
          <strong>{selectedComponent?.ident_code}</strong> - Total Qty: {selectedComponent?.quantity}
        </p>
        <div style={{ marginBottom: '16px' }}>
          <label style={styles.label}>Available Quantity</label>
          <input
            type="number"
            value={partialQty}
            onChange={(e) => setPartialQty(e.target.value)}
            style={styles.input}
            min="1"
            max={selectedComponent?.quantity - 1}
          />
          <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '6px' }}>
            Remaining {(selectedComponent?.quantity || 0) - (parseInt(partialQty) || 0)}  in queue
          </p>
        </div>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          <button onClick={() => setShowPartialModal(false)} style={{ ...styles.button, ...styles.buttonSecondary }}>Cancel</button>
          <button onClick={submitPartial} style={{ ...styles.button, backgroundColor: COLORS.warning, color: 'white' }}>Split</button>
        </div>
      </Modal>

      {/* Engineering Check Partial Modal */}
      <Modal isOpen={showCheckPartialModal} onClose={() => setShowCheckPartialModal(false)} title="🔶 Rilascio Parziale">
        <div style={{ marginBottom: '16px' }}>
          <p style={{ marginBottom: '8px' }}>
            <strong>Item:</strong> <span style={{ fontFamily: 'monospace' }}>{selectedCheck?.ident_code}</span>
          </p>
          <p style={{ marginBottom: '16px' }}>
            <strong>Totale Richiesto:</strong> {selectedCheck?.quantity}
          </p>
        </div>
        
        <div style={{ marginBottom: '16px' }}>
          <label style={styles.label}>Quantità Trovata</label>
          <input
            type="number"
            value={checkPartialQty}
            onChange={(e) => setCheckPartialQty(e.target.value)}
            style={styles.input}
            min="1"
            max={selectedCheck?.quantity - 1}
            placeholder="Inserisci quantità trovata"
          />
        </div>
        
        <div style={{ marginBottom: '16px' }}>
          <label style={styles.label}>✅ Trovati ({checkPartialQty || 0} pz) vanno a:</label>
          <select
            value={checkFoundDest}
            onChange={(e) => setCheckFoundDest(e.target.value)}
            style={styles.input}
          >
            <option value="ToCollect">→ ToCollect</option>
            <option value="Yard">→ WH Yard</option>
            <option value="Eng">→ Engineering</option>
          </select>
        </div>
        
        <div style={{ marginBottom: '16px' }}>
          <label style={styles.label}>❌ Non Trovati ({(selectedCheck?.quantity || 0) - (parseInt(checkPartialQty) || 0)} pz) vanno a:</label>
          <select
            value={checkNotFoundDest}
            onChange={(e) => setCheckNotFoundDest(e.target.value)}
            style={styles.input}
          >
            <option value="Eng">→ Engineering</option>
            <option value="Yard">→ WH Yard</option>
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
            • <strong>{checkPartialQty || 0} pz</strong> → {checkFoundDest} (Richiesta originale)
          </p>
          <p style={{ fontSize: '13px', color: '#92400E' }}>
            • <strong>{(selectedCheck?.quantity || 0) - (parseInt(checkPartialQty) || 0)} pz</strong> → {checkNotFoundDest} (Nuova sub-richiesta)
          </p>
        </div>
        
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          <button onClick={() => setShowCheckPartialModal(false)} style={{ ...styles.button, ...styles.buttonSecondary }}>Annulla</button>
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
    
    // Load inventory for WH_Site and WH_Yard quantities
    const { data: invData } = await supabase.from('inventory').select('ident_code, site_qty, yard_qty');
    const invMap = {};
    if (invData) {
      invData.forEach(i => { invMap[i.ident_code] = { site: i.site_qty || 0, yard: i.yard_qty || 0 }; });
    }
    setInventoryMap(invMap);
    
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
      .select(`*, requests (request_number, sub_number, sub_category, request_type, iso_number, full_spool_number, hf_number, test_pack_number, description)`)
      .eq('status', 'Yard');

    // Load Engineering Checks sent to Yard
    const { data: checksData } = await supabase
      .from('request_components')
      .select(`*, requests (request_number, sub_number, sub_category, request_type, iso_number, full_spool_number, hf_number, test_pack_number, description)`)
      .eq('has_eng_check', true)
      .eq('eng_check_sent_to', 'Yard');

    if (checksData) setEngChecks(checksData);
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
    
    // Decrement yard
    await supabase.rpc('decrement_yard_qty', { 
      p_ident_code: component.ident_code, 
      p_qty: component.quantity 
    });
    
    let newStatus;
    let note = '';
    
    switch(dest) {
      case 'siteIn':
        newStatus = 'Trans';
        note = 'In transit to Site';
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
    if (!partialQty || parseInt(partialQty) > available) {
      alert(`Max available: ${available}`);
      return;
    }
    
    const sendQty = parseInt(partialQty);
    const remainingQty = selectedComponent.quantity - sendQty;
    
    await supabase.from('request_components')
      .update({ quantity: sendQty, status: 'Trans' })
      .eq('id', selectedComponent.id);
    
    await supabase.rpc('decrement_yard_qty', { 
      p_ident_code: selectedComponent.ident_code, 
      p_qty: sendQty 
    });

    await logHistory(selectedComponent.id, 'Partial Found', 'Yard', 'Trans', 
      `Qty ${sendQty} sent, ${remainingQty} goes to Order`);

    // Create new for remaining -> Order
    const { data: subData } = await supabase
      .from('requests')
      .select('sub_number')
      .eq('request_number', selectedComponent.requests.request_number)
      .order('sub_number', { ascending: false })
      .limit(1);
    
    const nextSub = (subData?.[0]?.sub_number || 0) + 1;
    
    const { data: newReq } = await supabase.from('requests')
      .insert({
        request_number: selectedComponent.requests.request_number,
        sub_number: nextSub,
        request_type: selectedComponent.requests.request_type,
        sub_category: selectedComponent.requests.sub_category
      })
      .select()
      .single();
    
    await supabase.from('request_components').insert({
      request_id: newReq.id,
      ident_code: selectedComponent.ident_code,
      description: selectedComponent.description,
      quantity: remainingQty,
      status: 'Order',
      current_location: 'YARD'
    });

    await supabase.from('movements').insert({
      ident_code: selectedComponent.ident_code,
      movement_type: 'TRANSFER',
      quantity: sendQty,
      from_location: 'YARD',
      to_location: 'TRANSIT',
      performed_by: user.full_name,
      note: `Partial - ${remainingQty} to order`
    });

    setShowPartialModal(false);
    setPartialQty('');
    loadComponents();
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
        // Found → decrement yard, move to Trans (Site IN)
        await supabase.rpc('decrement_yard_qty', { 
          p_ident_code: check.ident_code, 
          p_qty: check.quantity 
        });
        await supabase.from('request_components')
          .update({ 
            status: 'Trans', 
            has_eng_check: false,
            eng_check_message: null,
            eng_check_sent_to: null
          })
          .eq('id', check.id);
        await logHistory(check.id, 'Check - Found', 'Yard', 'Trans', 'Item found in Yard after Engineering check, sent to Site IN');
        loadComponents();
      } else if (action === 'check_notfound') {
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
      } else if (action === 'check_partial') {
        // Open partial modal
        setSelectedCheck(check);
        setCheckPartialQty('');
        setCheckFoundDest('Trans');
        setCheckNotFoundDest('Eng');
        setShowCheckPartialModal(true);
      }
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };

  // Handle Engineering Check Partial Submit for Yard
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
      // Get current request info
      const reqNumber = selectedCheck.requests?.request_number;
      
      // Get next sub_number for this request
      const { data: subData } = await supabase
        .from('requests')
        .select('sub_number')
        .eq('request_number', reqNumber)
        .order('sub_number', { ascending: false })
        .limit(1);
      
      const nextSub = (subData?.[0]?.sub_number || 0) + 1;
      
      // Create new sub-request for NOT FOUND items
      const { data: newReq } = await supabase.from('requests')
        .insert({
          request_number: reqNumber,
          sub_number: nextSub,
          request_type: selectedCheck.requests?.request_type,
          sub_category: selectedCheck.requests?.sub_category,
          iso_number: selectedCheck.requests?.iso_number,
          full_spool_number: selectedCheck.requests?.full_spool_number,
          hf_number: selectedCheck.requests?.hf_number
        })
        .select()
        .single();
      
      // Create component for NOT FOUND quantity in new sub-request
      await supabase.from('request_components').insert({
        request_id: newReq.id,
        ident_code: selectedCheck.ident_code,
        description: selectedCheck.description,
        tag: selectedCheck.tag,
        dia1: selectedCheck.dia1,
        quantity: notFoundQty,
        status: checkNotFoundDest,
        current_location: checkNotFoundDest === 'WH_Site' ? 'SITE' : (checkNotFoundDest === 'Yard' ? 'YARD' : 'SITE'),
        has_eng_check: false,
        eng_check_message: null,
        eng_check_sent_to: null
      });
      
      // If found items go to Trans (Site IN), decrement yard inventory
      if (checkFoundDest === 'Trans') {
        await supabase.rpc('decrement_yard_qty', { 
          p_ident_code: selectedCheck.ident_code, 
          p_qty: foundQty 
        });
      }
      
      // Update original component with FOUND quantity and new status
      await supabase.from('request_components')
        .update({ 
          quantity: foundQty,
          status: checkFoundDest,
          has_eng_check: false,
          eng_check_message: null,
          eng_check_sent_to: null
        })
        .eq('id', selectedCheck.id);
      
      // Log history for original (found)
      await logHistory(selectedCheck.id, 'Check - Partial Found', 'Yard', checkFoundDest, 
        `Partial: ${foundQty} found → ${checkFoundDest}, ${notFoundQty} not found → ${checkNotFoundDest} (${String(reqNumber).padStart(5, '0')}-${nextSub})`);
      
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

  const canModify = user.role === 'admin' || user.perm_wh_yard === 'modify';

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
                  <th style={styles.th}>Tag</th>
                  <th style={styles.th}>Diam</th>
                  <th style={styles.th}>Qty</th>
                  <th style={styles.th}>Available</th>
                  <th style={styles.th}>Message</th>
                  <th style={styles.th}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {engChecks.map(check => {
                  const available = inventoryMap[check?.ident_code]?.yard || 0;
                  const canFulfill = available >= check.quantity;
                  return (
                    <tr key={check.id} style={{ backgroundColor: '#FFFBEB' }}>
                      <td style={styles.td}>{check.requests?.request_type || '-'}</td>
                      <td style={styles.td}>{check.requests?.sub_category || '-'}</td>
                      <td style={{ ...styles.td, fontSize: '11px' }}>{check.requests?.iso_number || check.iso_number || '-'}</td>
                      <td style={{ ...styles.td, fontSize: '11px' }}>{check.requests?.full_spool_number || check.full_spool_number || '-'}</td>
                      <td style={styles.td}>{check.requests?.hf_number || '-'}</td>
                    <td style={styles.td}>{check.requests?.test_pack_number || '-'}</td>
                      <td style={{ ...styles.td, fontFamily: 'monospace', fontWeight: '600' }}>
                        {String(check.requests?.request_number).padStart(5, '0')}-{check.requests?.sub_number}
                      </td>
                      <td style={{ ...styles.td, fontFamily: 'monospace', fontSize: '11px' }}>{check.ident_code}</td>
                      <td style={{ ...styles.td, maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={check.description || ''}>
                        {check.description ? (check.description.length > 50 ? check.description.substring(0, 50) + '...' : check.description) : '-'}
                      </td>
                      <td style={styles.td}>{check.tag || '-'}</td>
                      <td style={styles.td}>{check.dia1 || '-'}</td>
                      <td style={styles.td}>{check.quantity}</td>
                      <td style={styles.td}>
                        <span style={{ fontWeight: '600', color: canFulfill ? COLORS.success : COLORS.primary }}>
                          {available}
                        </span>
                      </td>
                      <td style={{ ...styles.td, color: '#B45309', fontStyle: 'italic' }}>{check.eng_check_message || '-'}</td>
                      <td style={styles.td}>
                        <ActionDropdown
                          actions={canFulfill ? [
                            { id: 'check_found', icon: '✓', label: 'Found (All) → Site IN' },
                            { id: 'check_partial', icon: '✂️', label: 'Partial' },
                            { id: 'check_notfound', icon: '✗', label: 'Not Found → Eng' }
                          ] : available > 0 ? [
                            { id: 'check_partial', icon: '✂️', label: 'Partial' },
                            { id: 'check_notfound', icon: '✗', label: 'Not Found → Eng' }
                          ] : [
                            { id: 'check_notfound', icon: '✗', label: 'Not Found → Eng' }
                          ]}
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
                      <td>${comp.requests?.request_type || '-'}</td>
                      <td>${comp.requests?.sub_category || '-'}</td>
                      <td>${comp.requests?.iso_number || '-'}</td>
                      <td>${comp.requests?.full_spool_number || '-'}</td>
                      <td>${String(comp.requests?.request_number).padStart(5, '0')}-${comp.requests?.sub_number}</td>
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
                
                // Build actions list based on conditions
                const yardActions = [];
                if (canFulfill) {
                  yardActions.push({ id: 'found', icon: '✓', label: 'Found/Transfer' });
                }
                if (available > 0) {
                  yardActions.push({ id: 'pt', icon: '✂️', label: 'Partial' });
                }
                yardActions.push({ id: 'eng', icon: '⚙️', label: 'To Engineering' });
                yardActions.push({ id: 'hf', icon: '🔩', label: 'To HF' });
                yardActions.push({ id: 'tp', icon: '📋', label: 'To TestPack' });
                yardActions.push({ id: 'return', icon: '↩️', label: 'Return to Site' });
                yardActions.push({ id: 'delete', icon: '🗑️', label: 'Delete' });
                
                return (
                  <tr key={comp.id} style={isOverQty ? { backgroundColor: '#FEF2F2' } : {}}>
                    <td style={styles.td}>{comp.requests?.request_type || '-'}</td>
                    <td style={styles.td}>{comp.requests?.sub_category || '-'}</td>
                    <td style={{ ...styles.td, fontSize: '11px' }}>{comp.requests?.iso_number || comp.iso_number || '-'}</td>
                    <td style={{ ...styles.td, fontSize: '11px' }}>{comp.requests?.full_spool_number || comp.full_spool_number || '-'}</td>
                    <td style={styles.td}>{comp.requests?.hf_number || '-'}</td>
                    <td style={styles.td}>{comp.requests?.test_pack_number || '-'}</td>
                    <td style={{ ...styles.td, fontFamily: 'monospace', fontWeight: '600' }}>
                      {String(comp.requests?.request_number).padStart(5, '0')}-{comp.requests?.sub_number}
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

      {/* Partial Modal */}
      <Modal isOpen={showPartialModal} onClose={() => setShowPartialModal(false)} title="Send Partial">
        <p style={{ marginBottom: '16px' }}>
          <strong>{selectedComponent?.ident_code}</strong><br />
          Requested: {selectedComponent?.quantity} | Available: {inventoryMap[selectedComponent?.ident_code]?.yard || 0}
        </p>
        <div style={{ marginBottom: '16px' }}>
          <label style={styles.label}>Quantity to send</label>
          <input
            type="number"
            value={partialQty}
            onChange={(e) => setPartialQty(e.target.value)}
            style={styles.input}
            min="1"
            max={inventoryMap[selectedComponent?.ident_code]?.yard || 0}
          />
          <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '6px' }}>
            The rest will go to Orders
          </p>
        </div>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          <button onClick={() => setShowPartialModal(false)} style={{ ...styles.button, ...styles.buttonSecondary }}>Cancel</button>
          <button onClick={submitPartial} style={{ ...styles.button, backgroundColor: COLORS.warning, color: 'white' }}>Send Partial</button>
        </div>
      </Modal>

      {/* Engineering Check Partial Modal */}
      <Modal isOpen={showCheckPartialModal} onClose={() => setShowCheckPartialModal(false)} title="🔶 Rilascio Parziale">
        <div style={{ marginBottom: '16px' }}>
          <p style={{ marginBottom: '8px' }}>
            <strong>Item:</strong> <span style={{ fontFamily: 'monospace' }}>{selectedCheck?.ident_code}</span>
          </p>
          <p style={{ marginBottom: '8px' }}>
            <strong>Totale Richiesto:</strong> {selectedCheck?.quantity}
          </p>
          <p style={{ marginBottom: '16px' }}>
            <strong>Disponibile in YARD:</strong> <span style={{ color: COLORS.success, fontWeight: '600' }}>{inventoryMap[selectedCheck?.ident_code]?.yard || 0}</span>
          </p>
        </div>
        
        <div style={{ marginBottom: '16px' }}>
          <label style={styles.label}>Quantità Trovata</label>
          <input
            type="number"
            value={checkPartialQty}
            onChange={(e) => setCheckPartialQty(e.target.value)}
            style={styles.input}
            min="1"
            max={Math.min(selectedCheck?.quantity - 1, inventoryMap[selectedCheck?.ident_code]?.yard || 0)}
            placeholder="Inserisci quantità trovata"
          />
        </div>
        
        <div style={{ marginBottom: '16px' }}>
          <label style={styles.label}>✅ Trovati ({checkPartialQty || 0} pz) vanno a:</label>
          <select
            value={checkFoundDest}
            onChange={(e) => setCheckFoundDest(e.target.value)}
            style={styles.input}
          >
            <option value="Trans">→ Site IN (Transit)</option>
            <option value="WH_Site">→ WH Site</option>
            <option value="Eng">→ Engineering</option>
          </select>
        </div>
        
        <div style={{ marginBottom: '16px' }}>
          <label style={styles.label}>❌ Non Trovati ({(selectedCheck?.quantity || 0) - (parseInt(checkPartialQty) || 0)} pz) vanno a:</label>
          <select
            value={checkNotFoundDest}
            onChange={(e) => setCheckNotFoundDest(e.target.value)}
            style={styles.input}
          >
            <option value="Eng">→ Engineering</option>
            <option value="WH_Site">→ WH Site</option>
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
            • <strong>{checkPartialQty || 0} pz</strong> → {checkFoundDest === 'Trans' ? 'Site IN' : checkFoundDest} (Richiesta originale)
          </p>
          <p style={{ fontSize: '13px', color: '#92400E' }}>
            • <strong>{(selectedCheck?.quantity || 0) - (parseInt(checkPartialQty) || 0)} pz</strong> → {checkNotFoundDest === 'WH_Site' ? 'WH Site' : checkNotFoundDest} (Nuova sub-richiesta)
          </p>
        </div>
        
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          <button onClick={() => setShowCheckPartialModal(false)} style={{ ...styles.button, ...styles.buttonSecondary }}>Annulla</button>
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
// ============================================================
function SiteInPage({ user }) {
  const [components, setComponents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDropdown, setOpenDropdown] = useState(null);

  useEffect(() => { loadComponents(); }, []);

  const loadComponents = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('request_components')
      .select(`*, requests (request_number, sub_number, sub_category, request_type, iso_number, full_spool_number, hf_number, test_pack_number, description)`)
      .eq('status', 'Trans');
    if (data) setComponents(data);
    setLoading(false);
  };

  // V28.5: Receive → WH_Site (not ToCollect)
  const handleReceive = async (component) => {
    try {
      await supabase.from('request_components')
        .update({ status: 'WH_Site', current_location: 'SITE', previous_status: 'Trans' })
        .eq('id', component.id);
      
      await supabase.rpc('increment_site_qty', { 
        p_ident_code: component.ident_code, 
        p_qty: component.quantity 
      });

      await supabase.from('component_history').insert({
        component_id: component.id,
        action: 'Received at Site',
        from_status: 'Trans',
        to_status: 'WH_Site',
        performed_by_user_id: user.id,
        performed_by_name: user.full_name,
        note: 'Material arrived at Site warehouse'
      });

      await supabase.from('movements').insert({
        ident_code: component.ident_code,
        movement_type: 'IN',
        quantity: component.quantity,
        from_location: 'YARD',
        to_location: 'SITE',
        performed_by: user.full_name
      });

      setOpenDropdown(null);
      loadComponents();
    } catch (error) {
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

      setOpenDropdown(null);
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

      setOpenDropdown(null);
      loadComponents();
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };

  const handleAction = (component, action) => {
    switch(action) {
      case 'receive': handleReceive(component); break;
      case 'delete': handleDelete(component); break;
      case 'return': handleReturn(component); break;
    }
  };

  const canModify = user.role === 'admin' || user.perm_site_in === 'modify';

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
                    <td>${comp.requests?.request_type || '-'}</td>
                    <td>${comp.requests?.sub_category || '-'}</td>
                    <td>${comp.requests?.iso_number || '-'}</td>
                    <td>${comp.requests?.full_spool_number || '-'}</td>
                    <td>${String(comp.requests?.request_number).padStart(5, '0')}-${comp.requests?.sub_number}</td>
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
                <th style={styles.th}>Tag</th>
                <th style={styles.th}>Diam</th>
                <th style={styles.th}>Qty</th>
                <th style={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {components.map(comp => (
                <tr key={comp.id}>
                  <td style={styles.td}>{comp.requests?.request_type || '-'}</td>
                  <td style={styles.td}>{comp.requests?.sub_category || '-'}</td>
                  <td style={{ ...styles.td, fontSize: '11px' }}>{comp.requests?.iso_number || comp.iso_number || '-'}</td>
                  <td style={{ ...styles.td, fontSize: '11px' }}>{comp.requests?.full_spool_number || comp.full_spool_number || '-'}</td>
                  <td style={styles.td}>{comp.requests?.hf_number || '-'}</td>
                  <td style={styles.td}>{comp.requests?.test_pack_number || '-'}</td>
                  <td style={{ ...styles.td, fontFamily: 'monospace', fontWeight: '600' }}>
                    {String(comp.requests?.request_number).padStart(5, '0')}-{comp.requests?.sub_number}
                  </td>
                  <td style={{ ...styles.td, fontFamily: 'monospace', fontSize: '11px' }}>{comp.ident_code}</td>
                  <td style={{ ...styles.td, maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={comp.description || ''}>
                    {comp.description ? (comp.description.length > 50 ? comp.description.substring(0, 50) + '...' : comp.description) : '-'}
                  </td>
                  <td style={styles.td}>{comp.tag || '-'}</td>
                  <td style={styles.td}>{comp.dia1 || '-'}</td>
                  <td style={styles.td}>{comp.quantity}</td>
                  <td style={styles.td}>
                    {/* V28.5: Actions dropdown */}
                    <div style={{ position: 'relative' }}>
                      <button
                        onClick={() => setOpenDropdown(openDropdown === comp.id ? null : comp.id)}
                        disabled={!canModify}
                        style={{ 
                          ...styles.button, 
                          backgroundColor: COLORS.success, 
                          color: 'white',
                          padding: '6px 12px',
                          fontSize: '12px'
                        }}
                      >
                        Actions ▼
                      </button>
                      {openDropdown === comp.id && (
                        <div style={{
                          position: 'absolute',
                          right: 0,
                          top: '100%',
                          backgroundColor: 'white',
                          border: '1px solid #e5e7eb',
                          borderRadius: '6px',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                          zIndex: 100,
                          minWidth: '160px'
                        }}>
                          <div
                            onClick={() => handleAction(comp, 'receive')}
                            style={{ padding: '10px 14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid #f3f4f6' }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                          >
                            <span>📥</span> <span>Receive</span>
                          </div>
                          <div
                            onClick={() => handleAction(comp, 'return')}
                            style={{ padding: '10px 14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid #f3f4f6' }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                          >
                            <span>↩️</span> <span>Return</span>
                          </div>
                          <div
                            onClick={() => handleAction(comp, 'delete')}
                            style={{ padding: '10px 14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', color: COLORS.danger }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#FEE2E2'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                          >
                            <span>🗑️</span> <span>Delete</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {components.length === 0 && (
                <tr>
                  <td colSpan="13" style={{ ...styles.td, textAlign: 'center', color: '#9ca3af' }}>
                    No materials in transit
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
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
  const [showPartialModal, setShowPartialModal] = useState(false);
  const [partialQty, setPartialQty] = useState('');
  const [showHistory, setShowHistory] = useState(false);
  const [historyComponentId, setHistoryComponentId] = useState(null);
  // V28: Management Note Modal
  const [showMngNoteModal, setShowMngNoteModal] = useState(false);
  const [mngNote, setMngNote] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => { loadComponents(); }, []);

  const loadComponents = async () => {
    setLoading(true);
    
    // Waiting for Check: items sent to Site/Yard for verification
    const { data: waitingData } = await supabase
      .from('request_components')
      .select(`*, requests (request_number, sub_number, sub_category, request_type, iso_number, full_spool_number, hf_number, test_pack_number, description)`)
      .eq('has_eng_check', true);
    
    // To Process: items in Eng status without pending check
    const { data: processData } = await supabase
      .from('request_components')
      .select(`*, requests (request_number, sub_number, sub_category, request_type, iso_number, full_spool_number, hf_number, test_pack_number, description)`)
      .eq('status', 'Eng')
      .eq('has_eng_check', false);
    
    if (waitingData) setWaitingForCheck(waitingData);
    if (processData) setToProcess(processData);
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
        case 'pt':
          setSelectedComponent(component);
          setShowPartialModal(true);
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
      }
      loadComponents();
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };

  // Send Check - supporta Site, Yard, o Both
  const sendCheck = async () => {
    const destinations = checkDestination === 'Both' ? ['WH_Site', 'Yard'] : [checkDestination];
    
    for (const dest of destinations) {
      if (checkDestination === 'Both') {
        // Clone component for second destination
        // For simplicity, we just set the check on current component for both
      }
      await supabase.from('request_components')
        .update({ 
          has_eng_check: true, 
          eng_check_message: checkMessage,
          eng_check_sent_to: dest
        })
        .eq('id', selectedComponent.id);
    }
    
    await logHistory(selectedComponent.id, `Check sent to ${checkDestination}`, 'Eng', 'Eng', checkMessage);
    
    setShowCheckModal(false);
    setCheckMessage('');
    setCheckDestination('WH_Site');
    loadComponents();
  };

  const submitPartial = async () => {
    const sendQty = parseInt(partialQty);
    const remainingQty = selectedComponent.quantity - sendQty;
    
    await supabase.from('request_components')
      .update({ quantity: sendQty, status: 'Spare' })
      .eq('id', selectedComponent.id);

    await logHistory(selectedComponent.id, 'Partial to Spare', 'Eng', 'Spare', 
      `Qty ${sendQty} a Spare, ${remainingQty} a Order`);

    const { data: subData } = await supabase
      .from('requests')
      .select('sub_number')
      .eq('request_number', selectedComponent.requests.request_number)
      .order('sub_number', { ascending: false })
      .limit(1);
    
    const nextSub = (subData?.[0]?.sub_number || 0) + 1;
    
    const { data: newReq } = await supabase.from('requests')
      .insert({
        request_number: selectedComponent.requests.request_number,
        sub_number: nextSub,
        request_type: selectedComponent.requests.request_type,
        sub_category: selectedComponent.requests.sub_category
      })
      .select()
      .single();
    
    await supabase.from('request_components').insert({
      request_id: newReq.id,
      ident_code: selectedComponent.ident_code,
      description: selectedComponent.description,
      quantity: remainingQty,
      status: 'Order'
    });

    setShowPartialModal(false);
    setPartialQty('');
    loadComponents();
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

  const canModify = user.role === 'admin' || user.perm_engineering === 'modify';

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
    const engActions = [];
    if (section === 'toProcess') {
      engActions.push({ id: 'check', icon: '🔍', label: 'Send Check' });
      engActions.push({ id: 'pt', icon: '✂️', label: 'Partial' });
      engActions.push({ id: 'spare', icon: '🔧', label: 'Spare Parts' });
      engActions.push({ id: 'mng', icon: '👔', label: 'Management' });
      engActions.push({ id: 'return', icon: '↩️', label: 'Return to Site' });
      engActions.push({ id: 'delete', icon: '🗑️', label: 'Delete' });
    }
    
    return (
      <tr key={comp.id}>
        <td style={styles.td}>{comp.requests?.request_type || '-'}</td>
        <td style={styles.td}>{comp.requests?.sub_category || '-'}</td>
        <td style={{ ...styles.td, fontSize: '11px' }}>{comp.requests?.iso_number || comp.iso_number || '-'}</td>
        <td style={{ ...styles.td, fontSize: '11px' }}>{comp.requests?.full_spool_number || comp.full_spool_number || '-'}</td>
        <td style={styles.td}>{comp.requests?.hf_number || '-'}</td>
        <td style={styles.td}>{comp.requests?.test_pack_number || '-'}</td>
        <td style={{ ...styles.td, fontFamily: 'monospace', fontWeight: '600' }}>
          {String(comp.requests?.request_number).padStart(5, '0')}-{comp.requests?.sub_number}
        </td>
        <td style={{ ...styles.td, fontFamily: 'monospace', fontSize: '11px' }}>{comp.ident_code}</td>
        <td style={{ ...styles.td, maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={comp.description || ''}>
          {comp.description ? (comp.description.length > 50 ? comp.description.substring(0, 50) + '...' : comp.description) : '-'}
        </td>
        <td style={styles.td}>{comp.tag || '-'}</td>
        <td style={styles.td}>{comp.dia1 || '-'}</td>
        <td style={styles.td}>{comp.quantity}</td>
        {section === 'waiting' && (
          <td style={styles.td}>
            <span style={{ ...styles.statusBadge, backgroundColor: COLORS.purple }}>
              → {comp.eng_check_sent_to}
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
                      <td>${comp.requests?.request_type || '-'}</td>
                      <td>${comp.requests?.sub_category || '-'}</td>
                      <td>${comp.requests?.iso_number || '-'}</td>
                      <td>${comp.requests?.full_spool_number || '-'}</td>
                      <td>${comp.requests?.hf_number || '-'}</td>
                      <td>${comp.requests?.test_pack_number || '-'}</td>
                      <td>${String(comp.requests?.request_number).padStart(5, '0')}-${comp.requests?.sub_number}</td>
                      <td>${comp.ident_code}</td>
                      <td>${comp.description || '-'}</td>
                      <td>${comp.quantity}</td>
                      <td>${comp.eng_check_sent_to || '-'}</td>
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
                  <th style={styles.th}>Tag</th>
                  <th style={styles.th}>Diam</th>
                  <th style={styles.th}>Qty</th>
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
                    <td>${comp.requests?.request_type || '-'}</td>
                    <td>${comp.requests?.sub_category || '-'}</td>
                    <td>${comp.requests?.iso_number || '-'}</td>
                    <td>${comp.requests?.full_spool_number || '-'}</td>
                    <td>${String(comp.requests?.request_number).padStart(5, '0')}-${comp.requests?.sub_number}</td>
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
            🖨️ Print All
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

      {/* Partial Modal */}
      <Modal isOpen={showPartialModal} onClose={() => setShowPartialModal(false)} title="Split - Part to Spare">
        <p style={{ marginBottom: '16px' }}>
          <strong>{selectedComponent?.ident_code}</strong> - Total: {selectedComponent?.quantity}
        </p>
        <div style={{ marginBottom: '16px' }}>
          <label style={styles.label}>Qty to Spare Parts</label>
          <input
            type="number"
            value={partialQty}
            onChange={(e) => setPartialQty(e.target.value)}
            style={styles.input}
            min="1"
            max={selectedComponent?.quantity - 1}
          />
          <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '6px' }}>
            The rest will go to Orders
          </p>
        </div>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          <button onClick={() => setShowPartialModal(false)} style={{ ...styles.button, ...styles.buttonSecondary }}>Cancel</button>
          <button onClick={submitPartial} style={{ ...styles.button, backgroundColor: COLORS.warning, color: 'white' }}>Split</button>
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
  const [groups, setGroups] = useState({});
  const [loading, setLoading] = useState(true);
  const [showHistory, setShowHistory] = useState(false);
  const [historyComponentId, setHistoryComponentId] = useState(null);

  useEffect(() => { loadComponents(); }, []);

  const loadComponents = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('request_components')
      .select(`*, requests (request_number, sub_number, hf_number, requester_user_id)`)
      .eq('status', 'HF');
    
    if (data) {
      // Raggruppa per request_number
      const grouped = {};
      data.forEach(comp => {
        const reqNum = comp.requests?.request_number;
        if (!grouped[reqNum]) {
          grouped[reqNum] = {
            request_number: reqNum,
            hf_number: comp.requests?.hf_number,
            requester_user_id: comp.requests?.requester_user_id,
            components: []
          };
        }
        grouped[reqNum].components.push(comp);
      });
      setGroups(grouped);
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

  const isGroupComplete = (group) => {
    // Check that all le sub-richieste siano in HF
    return group.components.length > 0;
  };

  const handleDeliver = async (group, destination) => {
    // destination: 'toSite' o 'delivered'
    const newStatus = destination === 'toSite' ? 'Trans' : 'Done';
    
    for (const comp of group.components) {
      await supabase.from('request_components')
        .update({ status: newStatus })
        .eq('id', comp.id);
      
      await logHistory(comp.id, 
        destination === 'toSite' ? 'HF Complete - To Site' : 'HF Complete - Delivered',
        'HF', newStatus, 
        `HF ${group.hf_number} completato`
      );

      if (destination === 'delivered') {
        // Update inventory record_out using RPC
        await supabase.rpc('increment_record_out', { 
          p_ident_code: comp.ident_code, 
          p_qty: comp.quantity 
        });
        
        await supabase.from('movements').insert({
          ident_code: comp.ident_code,
          movement_type: 'OUT',
          quantity: comp.quantity,
          from_location: 'HF',
          to_location: 'DELIVERED',
          performed_by: user.full_name,
          note: `HF ${group.hf_number}`
        });
      }
    }
    
    loadComponents();
  };

  const openHistory = (compId) => {
    setHistoryComponentId(compId);
    setShowHistory(true);
  };

  const canModify = user.role === 'admin' || user.perm_wh_site === 'modify';

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading...</div>;

  const groupList = Object.values(groups);

  return (
    <div>
      <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '12px' }}>
            🔩 HF - Flanged Joints
            <span style={{ fontSize: '14px', fontWeight: 'normal', color: '#6b7280' }}>
              ({groupList.length} groups)
            </span>
          </h2>
          <p style={{ color: '#6b7280', fontSize: '14px', marginTop: '4px' }}>
            Complete all parts of an HF before delivering
          </p>
        </div>
        {groupList.length > 0 && (
          <button
            onClick={() => {
              const allComps = groupList.flatMap(g => g.components.map(c => ({ ...c, hf: g.hf_number })));
              const printWindow = window.open('', '_blank');
              printWindow.document.write(`
                <html><head><title>HF - Flanged Joints</title>
                <style>
                  body { font-family: Arial, sans-serif; padding: 20px; }
                  h1 { color: #0D9488; }
                  table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                  th, td { border: 1px solid #ddd; padding: 6px; text-align: left; font-size: 10px; }
                  th { background-color: #CCFBF1; }
                </style></head><body>
                <h1>🔩 HF - Flanged Joints</h1>
                <p>Printed: ${new Date().toLocaleString()} | Groups: ${groupList.length} | Components: ${allComps.length}</p>
                <table>
                  <tr><th>HF</th><th>Request</th><th>Code</th><th>Description</th><th>Tag</th><th>Qty</th></tr>
                  ${allComps.map(comp => `<tr>
                    <td>${comp.hf || '-'}</td>
                    <td>${String(comp.requests?.request_number).padStart(5, '0')}-${comp.requests?.sub_number || 0}</td>
                    <td>${comp.ident_code}</td>
                    <td>${comp.description || '-'}</td>
                    <td>${comp.tag || '-'}</td>
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

      {groupList.length === 0 ? (
        <div style={{ ...styles.card, padding: '40px', textAlign: 'center', color: '#9ca3af' }}>
          No HF components waiting
        </div>
      ) : (
        groupList.map(group => {
          const complete = isGroupComplete(group);
          const totalQty = group.components.reduce((sum, c) => sum + c.quantity, 0);
          
          return (
            <div key={group.request_number} style={{ ...styles.card, marginBottom: '16px' }}>
              <div style={{ 
                ...styles.cardHeader, 
                backgroundColor: complete ? '#D1FAE5' : '#FEF3C7',
                borderBottom: `2px solid ${complete ? COLORS.success : COLORS.warning}`
              }}>
                <div>
                  <span style={{ fontWeight: '700', fontSize: '16px' }}>
                    Request {String(group.request_number).padStart(5, '0')}
                  </span>
                  {group.hf_number && (
                    <span style={{ 
                      marginLeft: '12px', 
                      padding: '4px 10px', 
                      backgroundColor: COLORS.teal, 
                      color: 'white', 
                      borderRadius: '4px',
                      fontSize: '13px'
                    }}>
                      HF: {group.hf_number}
                    </span>
                  )}
                  <span style={{ marginLeft: '12px', color: '#6b7280', fontSize: '14px' }}>
                    {group.components.length} components | Total Qty: {totalQty}
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {complete ? (
                    <>
                      <button
                        onClick={() => handleDeliver(group, 'toSite')}
                        disabled={!canModify}
                        style={{ ...styles.button, backgroundColor: COLORS.info, color: 'white' }}
                      >
                        🚚 Send to Site
                      </button>
                      <button
                        onClick={() => handleDeliver(group, 'delivered')}
                        disabled={!canModify}
                        style={{ ...styles.button, backgroundColor: COLORS.success, color: 'white' }}
                      >
                        ✅ Deliver
                      </button>
                    </>
                  ) : (
                    <span style={{ 
                      padding: '8px 16px', 
                      backgroundColor: '#FEF3C7', 
                      color: '#92400E',
                      borderRadius: '6px',
                      fontSize: '13px'
                    }}>
                      ⏳ Waiting for completion
                    </span>
                  )}
                </div>
              </div>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Sub</th>
                    <th style={styles.th}>Code</th>
                    <th style={styles.th}>Description</th>
                    <th style={styles.th}>Qty</th>
                    <th style={styles.th}>Status</th>
                    <th style={styles.th}></th>
                  </tr>
                </thead>
                <tbody>
                  {group.components.map(comp => (
                    <tr key={comp.id}>
                      <td style={{ ...styles.td, fontFamily: 'monospace' }}>-{comp.requests?.sub_number}</td>
                      <td style={{ ...styles.td, fontFamily: 'monospace' }}>{comp.ident_code}</td>
                      <td style={styles.td}>{comp.description}</td>
                      <td style={styles.td}>{comp.quantity}</td>
                      <td style={styles.td}>
                        <span style={{ ...styles.statusBadge, backgroundColor: COLORS.success }}>
                          ✅ Ready
                        </span>
                      </td>
                      <td style={styles.td}>
                        <ActionButton color={comp.requests?.description ? COLORS.primary : COLORS.info} onClick={() => openHistory(comp.id)} title="History">ℹ️</ActionButton>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        })
      )}

      <HistoryPopup isOpen={showHistory} onClose={() => setShowHistory(false)} componentId={historyComponentId} />
    </div>
  );
}

// ============================================================
// TESTPACK PAGE - Componenti TP raggruppati per request
// ============================================================
function TestPackPage({ user }) {
  const [groups, setGroups] = useState({});
  const [loading, setLoading] = useState(true);
  const [showHistory, setShowHistory] = useState(false);
  const [historyComponentId, setHistoryComponentId] = useState(null);

  useEffect(() => { loadComponents(); }, []);

  const loadComponents = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('request_components')
      .select(`*, requests (request_number, sub_number, test_pack_number, requester_user_id, secondary_collector)`)
      .eq('status', 'TP');
    
    if (data) {
      const grouped = {};
      data.forEach(comp => {
        const reqNum = comp.requests?.request_number;
        if (!grouped[reqNum]) {
          grouped[reqNum] = {
            request_number: reqNum,
            test_pack_number: comp.requests?.test_pack_number,
            requester_user_id: comp.requests?.requester_user_id,
            secondary_collector: comp.requests?.secondary_collector,
            components: []
          };
        }
        grouped[reqNum].components.push(comp);
      });
      setGroups(grouped);
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

  const handleDeliver = async (group, destination) => {
    const newStatus = destination === 'toSite' ? 'Trans' : 'Done';
    
    for (const comp of group.components) {
      await supabase.from('request_components')
        .update({ status: newStatus })
        .eq('id', comp.id);
      
      await logHistory(comp.id, 
        destination === 'toSite' ? 'TP Complete - To Site' : 'TP Complete - Delivered',
        'TP', newStatus, 
        `TestPack ${group.test_pack_number} completato`
      );

      if (destination === 'delivered') {
        await supabase.rpc('increment_record_out', { 
          p_ident_code: comp.ident_code, 
          p_qty: comp.quantity 
        });
        
        await supabase.from('movements').insert({
          ident_code: comp.ident_code,
          movement_type: 'OUT',
          quantity: comp.quantity,
          from_location: 'TP',
          to_location: 'DELIVERED',
          performed_by: user.full_name,
          note: `TP ${group.test_pack_number}`
        });
      }
    }
    
    loadComponents();
  };

  const openHistory = (compId) => {
    setHistoryComponentId(compId);
    setShowHistory(true);
  };

  const canModify = user.role === 'admin' || user.perm_wh_site === 'modify';

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading...</div>;

  const groupList = Object.values(groups);

  return (
    <div>
      <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '12px' }}>
            📋 TestPack Materials
            <span style={{ fontSize: '14px', fontWeight: 'normal', color: '#6b7280' }}>
              ({groupList.length} groups)
            </span>
          </h2>
          <p style={{ color: '#6b7280', fontSize: '14px', marginTop: '4px' }}>
            Complete all parts of a TestPack before delivering
          </p>
        </div>
        {groupList.length > 0 && (
          <button
            onClick={() => {
              const allComps = groupList.flatMap(g => g.components.map(c => ({ ...c, tp: g.test_pack_number })));
              const printWindow = window.open('', '_blank');
              printWindow.document.write(`
                <html><head><title>TestPack Materials</title>
                <style>
                  body { font-family: Arial, sans-serif; padding: 20px; }
                  h1 { color: #7C3AED; }
                  table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                  th, td { border: 1px solid #ddd; padding: 6px; text-align: left; font-size: 10px; }
                  th { background-color: #F3E8FF; }
                </style></head><body>
                <h1>📋 TestPack Materials</h1>
                <p>Printed: ${new Date().toLocaleString()} | Groups: ${groupList.length} | Components: ${allComps.length}</p>
                <table>
                  <tr><th>TP</th><th>Request</th><th>Code</th><th>Description</th><th>Tag</th><th>Qty</th></tr>
                  ${allComps.map(comp => `<tr>
                    <td>${comp.tp || '-'}</td>
                    <td>${String(comp.requests?.request_number).padStart(5, '0')}-${comp.requests?.sub_number || 0}</td>
                    <td>${comp.ident_code}</td>
                    <td>${comp.description || '-'}</td>
                    <td>${comp.tag || '-'}</td>
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

      {groupList.length === 0 ? (
        <div style={{ ...styles.card, padding: '40px', textAlign: 'center', color: '#9ca3af' }}>
          No TestPack components waiting
        </div>
      ) : (
        groupList.map(group => {
          const totalQty = group.components.reduce((sum, c) => sum + c.quantity, 0);
          
          return (
            <div key={group.request_number} style={{ ...styles.card, marginBottom: '16px' }}>
              <div style={{ 
                ...styles.cardHeader, 
                backgroundColor: '#F3E8FF',
                borderBottom: `2px solid ${COLORS.purple}`
              }}>
                <div>
                  <span style={{ fontWeight: '700', fontSize: '16px' }}>
                    Request {String(group.request_number).padStart(5, '0')}
                  </span>
                  {group.test_pack_number && (
                    <span style={{ 
                      marginLeft: '12px', 
                      padding: '4px 10px', 
                      backgroundColor: COLORS.purple, 
                      color: 'white', 
                      borderRadius: '4px',
                      fontSize: '13px'
                    }}>
                      TP: {group.test_pack_number}
                    </span>
                  )}
                  <span style={{ marginLeft: '12px', color: '#6b7280', fontSize: '14px' }}>
                    {group.components.length} components | Total Qty: {totalQty}
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => handleDeliver(group, 'toSite')}
                    disabled={!canModify}
                    style={{ ...styles.button, backgroundColor: COLORS.info, color: 'white' }}
                  >
                    🚚 Send to Site
                  </button>
                  <button
                    onClick={() => handleDeliver(group, 'delivered')}
                    disabled={!canModify}
                    style={{ ...styles.button, backgroundColor: COLORS.success, color: 'white' }}
                  >
                    ✅ Deliver
                  </button>
                </div>
              </div>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Sub</th>
                    <th style={styles.th}>Code</th>
                    <th style={styles.th}>Description</th>
                    <th style={styles.th}>Qty</th>
                    <th style={styles.th}>Status</th>
                    <th style={styles.th}></th>
                  </tr>
                </thead>
                <tbody>
                  {group.components.map(comp => (
                    <tr key={comp.id}>
                      <td style={{ ...styles.td, fontFamily: 'monospace' }}>-{comp.requests?.sub_number}</td>
                      <td style={{ ...styles.td, fontFamily: 'monospace' }}>{comp.ident_code}</td>
                      <td style={styles.td}>{comp.description}</td>
                      <td style={styles.td}>{comp.quantity}</td>
                      <td style={styles.td}>
                        <span style={{ ...styles.statusBadge, backgroundColor: COLORS.success }}>
                          ✅ Ready
                        </span>
                      </td>
                      <td style={styles.td}>
                        <ActionButton color={comp.requests?.description ? COLORS.primary : COLORS.info} onClick={() => openHistory(comp.id)} title="History">ℹ️</ActionButton>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        })
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
  const [showActionMenu, setShowActionMenu] = useState(null);

  useEffect(() => { loadComponents(); loadUsers(); }, []);

  const loadComponents = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('request_components')
      .select(`*, requests (request_number, sub_number, requester_user_id, request_type, sub_category, iso_number, full_spool_number, hf_number, test_pack_number)`)
      .eq('status', 'ToCollect');
    if (data) setComponents(data);
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
    setShowActionMenu(null);
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
    if (!confirm(`Delete request ${String(comp.requests?.request_number).padStart(5, '0')}-${comp.requests?.sub_number}?`)) return;
    
    try {
      await supabase.from('request_components')
        .update({ status: 'Cancelled', previous_status: 'ToCollect' })
        .eq('id', comp.id);
      
      await logHistory(comp.id, 'Request Deleted', 'ToCollect', 'Cancelled', 'Deleted from To Be Collected');
      
      setShowActionMenu(null);
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
      
      setShowActionMenu(null);
      loadComponents();
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };

  const openHistory = (compId) => {
    setHistoryComponentId(compId);
    setShowHistory(true);
  };

  const canModify = user.role === 'admin' || user.perm_wh_site === 'modify';

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading...</div>;

  return (
    <div>
      <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold' }}>✅ To Be Collected</h2>
          <p style={{ color: '#6b7280', fontSize: '14px', marginTop: '4px' }}>
            Material ready for pickup - Enter collector name when collecting
          </p>
        </div>
        {components.length > 0 && (
          <button
            onClick={() => {
              const printWindow = window.open('', '_blank');
              printWindow.document.write(`
                <html><head><title>To Be Collected</title>
                <style>
                  body { font-family: Arial, sans-serif; padding: 20px; }
                  h1 { color: #16A34A; }
                  table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                  th, td { border: 1px solid #ddd; padding: 6px; text-align: left; font-size: 10px; }
                  th { background-color: #D1FAE5; }
                </style></head><body>
                <h1>✅ To Be Collected</h1>
                <p>Printed: ${new Date().toLocaleString()} | Total: ${components.length}</p>
                <table>
                  <tr><th>Cat</th><th>Sub</th><th>ISO</th><th>Spool</th><th>HF</th><th>TP</th><th>Request</th><th>Code</th><th>Description</th><th>Qty</th></tr>
                  ${components.map(comp => `<tr>
                    <td>${comp.requests?.request_type || '-'}</td>
                    <td>${comp.requests?.sub_category || '-'}</td>
                    <td>${comp.requests?.iso_number || '-'}</td>
                    <td>${comp.requests?.full_spool_number || '-'}</td>
                    <td>${comp.requests?.hf_number || '-'}</td>
                    <td>${comp.requests?.test_pack_number || '-'}</td>
                    <td>${String(comp.requests?.request_number).padStart(5, '0')}-${comp.requests?.sub_number}</td>
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
              </tr>
            </thead>
            <tbody>
              {components.map(comp => (
                <tr key={comp.id}>
                  <td style={styles.td}>{comp.requests?.request_type || '-'}</td>
                  <td style={styles.td}>{comp.requests?.sub_category || '-'}</td>
                  <td style={{ ...styles.td, fontSize: '11px' }}>{comp.requests?.iso_number || '-'}</td>
                  <td style={{ ...styles.td, fontSize: '11px' }}>{comp.requests?.full_spool_number || '-'}</td>
                  <td style={styles.td}>{comp.requests?.hf_number || '-'}</td>
                  <td style={styles.td}>{comp.requests?.test_pack_number || '-'}</td>
                  <td style={{ ...styles.td, fontFamily: 'monospace', fontWeight: '600' }}>
                    {String(comp.requests?.request_number).padStart(5, '0')}-{comp.requests?.sub_number}
                  </td>
                  <td style={{ ...styles.td, fontFamily: 'monospace', fontSize: '11px' }}>{comp.ident_code}</td>
                  <td style={{ ...styles.td, maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis' }} title={comp.description}>
                    {comp.description ? (comp.description.length > 40 ? comp.description.substring(0, 40) + '...' : comp.description) : '-'}
                  </td>
                  <td style={styles.td}>{comp.quantity}</td>
                  <td style={{ ...styles.td, position: 'relative' }}>
                    <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                      {canModify ? (
                        <div style={{ position: 'relative' }}>
                          <button
                            onClick={() => setShowActionMenu(showActionMenu === comp.id ? null : comp.id)}
                            style={{ 
                              ...styles.button, 
                              backgroundColor: COLORS.success, 
                              color: 'white',
                              padding: '6px 12px',
                              fontSize: '12px'
                            }}
                          >
                            ⚡ Actions ▼
                          </button>
                          {showActionMenu === comp.id && (
                            <div style={{
                              position: 'absolute',
                              top: '100%',
                              right: 0,
                              backgroundColor: 'white',
                              border: '1px solid #e5e7eb',
                              borderRadius: '8px',
                              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                              zIndex: 1000,
                              minWidth: '150px'
                            }}>
                              <button
                                onClick={() => openCollectModal(comp)}
                                style={{
                                  display: 'block',
                                  width: '100%',
                                  padding: '10px 16px',
                                  textAlign: 'left',
                                  border: 'none',
                                  background: 'none',
                                  cursor: 'pointer',
                                  fontSize: '13px',
                                  borderBottom: '1px solid #e5e7eb'
                                }}
                                onMouseOver={(e) => e.target.style.backgroundColor = '#D1FAE5'}
                                onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
                              >
                                ✅ Collect
                              </button>
                              <button
                                onClick={() => handleDelete(comp)}
                                style={{
                                  display: 'block',
                                  width: '100%',
                                  padding: '10px 16px',
                                  textAlign: 'left',
                                  border: 'none',
                                  background: 'none',
                                  cursor: 'pointer',
                                  fontSize: '13px',
                                  borderBottom: '1px solid #e5e7eb',
                                  color: COLORS.primary
                                }}
                                onMouseOver={(e) => e.target.style.backgroundColor = '#FEE2E2'}
                                onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
                              >
                                🗑️ Delete
                              </button>
                              <button
                                onClick={() => handleReturn(comp)}
                                style={{
                                  display: 'block',
                                  width: '100%',
                                  padding: '10px 16px',
                                  textAlign: 'left',
                                  border: 'none',
                                  background: 'none',
                                  cursor: 'pointer',
                                  fontSize: '13px'
                                }}
                                onMouseOver={(e) => e.target.style.backgroundColor = '#f3f4f6'}
                                onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
                              >
                                ↩️ Return
                              </button>
                            </div>
                          )}
                        </div>
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
                </tr>
              ))}
              {components.length === 0 && (
                <tr>
                  <td colSpan="11" style={{ ...styles.td, textAlign: 'center', color: '#9ca3af' }}>
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
  
  const [loading, setLoading] = useState(true);
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);

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
    
    setLoading(false);
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

  const canModify = user.role === 'admin' || user.perm_material_in === 'modify';

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading...</div>;

  return (
    <div>
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
                      setIdentCode(e.target.value);
                      searchIdentCode(e.target.value);
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
                </tr>
              ))}
              {partialsLog.length === 0 && (
                <tr><td colSpan="8" style={{ ...styles.td, textAlign: 'center', color: '#9ca3af' }}>No partial items recorded</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
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
      .select(`*, requests (request_number, sub_number, sub_category, request_type, iso_number, full_spool_number, hf_number, test_pack_number, description)`)
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

  const canModify = user.role === 'admin' || user.perm_spare_parts === 'modify';

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
              <td style={styles.td}>{comp.requests?.request_type || '-'}</td>
              <td style={styles.td}>{comp.requests?.sub_category || '-'}</td>
              <td style={{ ...styles.td, fontSize: '11px' }}>{comp.requests?.iso_number || '-'}</td>
              <td style={{ ...styles.td, fontSize: '11px' }}>{comp.requests?.full_spool_number || '-'}</td>
              <td style={{ ...styles.td, fontFamily: 'monospace', fontWeight: '600' }}>
                {String(comp.requests?.request_number).padStart(5, '0')}-{comp.requests?.sub_number}
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
                    <td>${comp.requests?.request_type || '-'}</td>
                    <td>${comp.requests?.sub_category || '-'}</td>
                    <td>${comp.requests?.iso_number || '-'}</td>
                    <td>${comp.requests?.full_spool_number || '-'}</td>
                    <td>${String(comp.requests?.request_number).padStart(5, '0')}-${comp.requests?.sub_number}</td>
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
                    <td>${comp.requests?.request_type || '-'}</td>
                    <td>${comp.requests?.sub_category || '-'}</td>
                    <td>${comp.requests?.iso_number || '-'}</td>
                    <td>${comp.requests?.full_spool_number || '-'}</td>
                    <td>${String(comp.requests?.request_number).padStart(5, '0')}-${comp.requests?.sub_number}</td>
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

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    setLoading(true);
    const { data: toOrder } = await supabase.from('request_components')
      .select(`*, requests (request_number, sub_number, sub_category, request_type, iso_number, full_spool_number, hf_number, test_pack_number, description)`)
      .eq('status', 'Order');
    const { data: ordered } = await supabase.from('request_components')
      .select(`*, requests (request_number, sub_number, sub_category, request_type, iso_number, full_spool_number, hf_number, test_pack_number, description)`)
      .eq('status', 'Ordered');
    if (toOrder) setToOrderComponents(toOrder);
    if (ordered) setOrderedComponents(ordered);
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
    setShowOrderModal(true);
  };

  const submitOrder = async () => {
    await supabase.from('request_components').update({ status: 'Ordered', order_date: orderDate, order_forecast: expectedDate || null }).eq('id', selectedComponent.id);
    await supabase.from('order_log').insert({ ident_code: selectedComponent.ident_code, quantity: selectedComponent.quantity, order_type: selectedComponent.order_type || 'Internal', order_date: orderDate, expected_date: expectedDate || null, ordered_by: user.full_name });
    await logHistory(selectedComponent.id, 'Order Placed', 'Order', 'Ordered', `Type: ${selectedComponent.order_type || 'Internal'}, Expected: ${expectedDate || 'TBD'}`);
    await supabase.from('movements').insert({ ident_code: selectedComponent.ident_code, movement_type: 'ORDER', quantity: selectedComponent.quantity, from_location: 'ORDER', to_location: 'SUPPLIER', performed_by: user.full_name });
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

  const canModify = user.role === 'admin' || user.perm_orders === 'modify';

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
            <td style={styles.td}>{comp.requests?.request_type || '-'}</td>
            <td style={{ ...styles.td, fontSize: '11px' }}>{comp.requests?.iso_number || '-'}</td>
            <td style={{ ...styles.td, fontFamily: 'monospace', fontWeight: '600' }}>
              {String(comp.requests?.request_number).padStart(5, '0')}-{comp.requests?.sub_number}
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
        </tr>
      </thead>
      <tbody>
        {components.map(comp => {
          const overdue = isOverdue(comp.order_forecast);
          return (
            <tr key={comp.id} style={{ backgroundColor: overdue ? COLORS.alertRed : 'transparent' }}>
              <td style={styles.td}>{comp.requests?.request_type || '-'}</td>
              <td style={{ ...styles.td, fontSize: '11px' }}>{comp.requests?.iso_number || '-'}</td>
              <td style={{ ...styles.td, fontFamily: 'monospace', fontWeight: '600' }}>
                {String(comp.requests?.request_number).padStart(5, '0')}-{comp.requests?.sub_number}
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
                      { id: 'toSite', icon: '📦', label: 'Received → Site' },
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
            </tr>
          );
        })}
        {components.length === 0 && (
          <tr><td colSpan="10" style={{ ...styles.td, textAlign: 'center', color: '#9ca3af' }}>No items</td></tr>
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
        <p style={{ marginBottom: '8px' }}><strong>{selectedComponent?.ident_code}</strong> - Qty: {selectedComponent?.quantity}</p>
        <p style={{ marginBottom: '16px', fontSize: '13px' }}>
          Type: <span style={{ ...styles.statusBadge, backgroundColor: selectedComponent?.order_type === 'Client' ? COLORS.cyan : COLORS.info }}>
            {selectedComponent?.order_type || 'Internal'}
          </span>
        </p>
        <div style={{ marginBottom: '16px' }}><label style={styles.label}>Order Date *</label><input type="date" value={orderDate} onChange={(e) => setOrderDate(e.target.value)} style={styles.input} /></div>
        <div style={{ marginBottom: '16px' }}><label style={styles.label}>Expected Delivery Date</label><input type="date" value={expectedDate} onChange={(e) => setExpectedDate(e.target.value)} style={styles.input} /></div>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          <button onClick={() => setShowOrderModal(false)} style={{ ...styles.button, ...styles.buttonSecondary }}>Cancel</button>
          <button onClick={submitOrder} style={{ ...styles.button, backgroundColor: COLORS.success, color: 'white' }}>Confirm Order</button>
        </div>
      </Modal>
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
      .select(`*, requests (request_number, sub_number, sub_category, request_type, iso_number, full_spool_number, hf_number, test_pack_number, description)`)
      .eq('status', 'Mng');
    if (data) setComponents(data);
    setLoading(false);
  };

  const handleDecision = async (component, orderType) => {
    await supabase.from('request_components').update({ status: 'Order', order_type: orderType, mng_note: null }).eq('id', component.id);
    await supabase.from('component_history').insert({ component_id: component.id, action: `Management Decision: ${orderType}`, from_status: 'Mng', to_status: 'Order', performed_by_user_id: user.id, performed_by_name: user.full_name });
    loadComponents();
  };

  const canModify = user.role === 'admin' || user.perm_management === 'modify';

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
                    <td>${comp.requests?.request_type || '-'}</td>
                    <td>${comp.requests?.sub_category || '-'}</td>
                    <td>${comp.requests?.iso_number || '-'}</td>
                    <td>${comp.requests?.full_spool_number || '-'}</td>
                    <td>${String(comp.requests?.request_number).padStart(5, '0')}-${comp.requests?.sub_number}</td>
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
                  <td style={styles.td}>{comp.requests?.request_type || '-'}</td>
                  <td style={styles.td}>{comp.requests?.sub_category || '-'}</td>
                  <td style={{ ...styles.td, fontSize: '11px' }}>{comp.requests?.iso_number || comp.iso_number || '-'}</td>
                  <td style={{ ...styles.td, fontSize: '11px' }}>{comp.requests?.full_spool_number || comp.full_spool_number || '-'}</td>
                  <td style={styles.td}>{comp.requests?.hf_number || '-'}</td>
                  <td style={styles.td}>{comp.requests?.test_pack_number || '-'}</td>
                  <td style={{ ...styles.td, fontFamily: 'monospace', fontWeight: '600' }}>{String(comp.requests?.request_number).padStart(5, '0')}-{comp.requests?.sub_number}</td>
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
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button onClick={() => handleDecision(comp, 'Internal')} disabled={!canModify} style={{ ...styles.button, backgroundColor: COLORS.info, color: 'white', padding: '6px 12px', fontSize: '12px' }}>🏢 Internal</button>
                      <button onClick={() => handleDecision(comp, 'Client')} disabled={!canModify} style={{ ...styles.button, backgroundColor: COLORS.cyan, color: 'white', padding: '6px 12px', fontSize: '12px' }}>👤 Client</button>
                    </div>
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

  const canModify = user.role === 'admin' || user.perm_mir === 'modify';

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
              <th style={styles.th}>Status</th>
              <th style={styles.th}>Created</th>
              {activeTab === 'open' && <th style={styles.th}>Actions</th>}
              {activeTab === 'closed' && <th style={styles.th}>Closed</th>}
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
                    <button
                      onClick={() => closeMir(mir)}
                      disabled={!canModify}
                      style={{ 
                        ...styles.button, 
                        backgroundColor: COLORS.success, 
                        color: 'white',
                        padding: '6px 12px',
                        fontSize: '12px'
                      }}
                    >
                      ✓ Close
                    </button>
                  </td>
                )}
                {activeTab === 'closed' && (
                  <td style={styles.td}>
                    {mir.closed_at ? new Date(mir.closed_at).toLocaleDateString() : '-'}
                  </td>
                )}
              </tr>
            ))}
            {displayedMirs.length === 0 && (
              <tr>
                <td colSpan={activeTab === 'open' ? 9 : 9} style={{ ...styles.td, textAlign: 'center', color: '#9ca3af' }}>
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
      const { data: reqData } = await supabase
        .from('request_components')
        .select('*, requests(*)')
        .order('created_at', { ascending: false })
        .limit(500);
      if (reqData) setRequests(reqData);

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

  const canModify = user.role === 'admin' || user.perm_movements === 'modify';

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
                  <th style={styles.th}>Current Status</th>
                  <th style={styles.th}>ℹ️</th>
                </tr>
              </thead>
              <tbody>
                {filteredRequests.map((req, idx) => (
                  <tr key={idx}>
                    <td style={{ ...styles.td, fontFamily: 'monospace', fontWeight: '600' }}>
                      {String(req.requests?.request_number).padStart(5, '0')}-{req.requests?.sub_number}
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
                      <StatusBadge status={req.status} />
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
  const [searchTerm, setSearchTerm] = useState('');
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
    
    // Get inventory data
    const { data: invData } = await supabase
      .from('inventory')
      .select('*');
    
    // Create inventory map by ident_code
    const invMap = {};
    if (invData) {
      invData.forEach(i => { invMap[i.ident_code] = i; });
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

  const filteredInventory = inventoryData.filter(item =>
    item.ident_code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.iso_number?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

    // Add to inventory
    const { error } = await supabase.from('inventory').insert({
      ident_code: newItem.ident_code,
      description: newItem.description,
      yard_qty: 0,
      site_qty: 0,
      lost_qty: 0,
      broken_qty: 0,
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

    setShowAddModal(false);
    setNewItem({ iso_number: '', ident_code: '', description: '' });
    loadInventory();
  };

  const exportCSV = () => {
    const headers = ['ISO', 'Ident Code', 'Description', 'Pos Qty', 'Collected TEN', 'YARD', 'SITE', 'LOST', 'BROKEN', 'Record Out'];
    const rows = filteredInventory.map(i => [
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

  const canModify = user.role === 'admin' || user.perm_database === 'modify';

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

        {/* Quick Search */}
        <div style={{ flex: 1, minWidth: '200px' }}>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#4B5563', marginBottom: '4px' }}>
            Quick Search (in results)
          </label>
          <input
            type="text"
            placeholder="🔍 Search in results..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ ...styles.input, width: '100%' }}
          />
        </div>

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
        ℹ️ Showing {filteredInventory.length} of {totalCount} results (max 500 per query). Use filters above to find specific items.
      </div>

      <div style={styles.card}>
        <div style={styles.cardHeader}>
          <h3 style={{ fontWeight: '600' }}>Inventory Database ({filteredInventory.length})</h3>
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
              {filteredInventory.map((item, idx) => (
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

      {/* Add Item Modal */}
      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="+ Add New Item">
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
        <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: '16px' }}>
          Note: Quantities can be set after adding the item using the Balance button.
        </p>
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

  useEffect(() => {
    if (user) loadBadges();
  }, [user, currentPage]);

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
    const { data: hfData } = await supabase.from('request_components').select('id', { count: 'exact' }).eq('status', 'HF');
    const { data: tpData } = await supabase.from('request_components').select('id', { count: 'exact' }).eq('status', 'TP');
    const { data: collectData } = await supabase.from('request_components').select('id', { count: 'exact' }).eq('status', 'ToCollect');
    
    // Engineering Checks counts - these should be added to WH Site and WH Yard badges
    const { data: engChecksSite } = await supabase.from('request_components').select('id', { count: 'exact' }).eq('has_eng_check', true).eq('eng_check_sent_to', 'WH_Site');
    const { data: engChecksYard } = await supabase.from('request_components').select('id', { count: 'exact' }).eq('has_eng_check', true).eq('eng_check_sent_to', 'Yard');

    counts.whSite = (siteData?.length || 0) + (engChecksSite?.length || 0);
    counts.whYard = (yardData?.length || 0) + (engChecksYard?.length || 0);
    counts.engineering = engData?.length || 0;
    counts.siteIn = transData?.length || 0;
    counts.orders = orderData?.length || 0;
    counts.materialIn = 0; // Material In doesn't need a badge
    counts.spareParts = spareData?.length || 0;
    counts.management = mngData?.length || 0;
    counts.hfPage = hfData?.length || 0;
    counts.testPackPage = tpData?.length || 0;
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
    toBeCollected: 'To Be Collected',
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
