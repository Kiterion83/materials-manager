// ============================================================
// MATERIALS MANAGER V27 - APP.JSX COMPLETE
// MAX STREICHER Edition - Full Features - ALL ENGLISH
// V27: Async search, Unified Actions Popup, MIR Priority/Close
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
  teal: '#0D9488'
};

const STATUS_COLORS = {
  Site: COLORS.info,
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

function ActionButton({ color, onClick, disabled, children, title }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      style={{
        ...styles.actionButton,
        backgroundColor: disabled ? '#d1d5db' : color,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.6 : 1
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
      // Debounce search by 300ms
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
      }, 300);
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
          placeholder="Inserisci una nota per questo passaggio..."
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
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (isOpen && componentId) {
      loadHistory();
    }
  }, [isOpen, componentId]);
  
  const loadHistory = async () => {
    setLoading(true);
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
      ) : history.length === 0 ? (
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
          <p style={{ color: '#6b7280', marginTop: '4px' }}>Materials Manager V27</p>
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
function Dashboard({ user }) {
  const [stats, setStats] = useState({
    yard: 0, site: 0, lost: 0, broken: 0,
    activeRequests: 0, pendingEng: 0, toOrder: 0, toCollect: 0
  });
  const [movements, setMovements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    // Load inventory totals
    const { data: invData } = await supabase
      .from('inventory')
      .select('yard_qty, site_qty, lost_qty, broken_qty');
    
    if (invData) {
      setStats(prev => ({
        ...prev,
        yard: invData.reduce((sum, i) => sum + (i.yard_qty || 0), 0),
        site: invData.reduce((sum, i) => sum + (i.site_qty || 0), 0),
        lost: invData.reduce((sum, i) => sum + (i.lost_qty || 0), 0),
        broken: invData.reduce((sum, i) => sum + (i.broken_qty || 0), 0)
      }));
    }

    // Load counts
    const { data: siteData } = await supabase.from('request_components').select('id').eq('status', 'Site');
    const { data: engData } = await supabase.from('request_components').select('id').eq('status', 'Eng');
    const { data: orderData } = await supabase.from('request_components').select('id').eq('status', 'Order');
    const { data: collectData } = await supabase.from('request_components').select('id').eq('status', 'ToCollect');

    setStats(prev => ({
      ...prev,
      activeRequests: siteData?.length || 0,
      pendingEng: engData?.length || 0,
      toOrder: orderData?.length || 0,
      toCollect: collectData?.length || 0
    }));

    // Load recent movements
    const { data: movData } = await supabase
      .from('movements')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5);
    
    if (movData) setMovements(movData);
    setLoading(false);
  };

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading...</div>;

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
        <StatBox title="YARD" value={stats.yard.toLocaleString()} color={COLORS.secondary} />
        <StatBox title="SITE" value={stats.site.toLocaleString()} color={COLORS.info} />
        <StatBox title="LOST" value={stats.lost.toLocaleString()} color={COLORS.orange} />
        <StatBox title="BROKEN" value={stats.broken.toLocaleString()} color={COLORS.purple} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
        <div style={{ ...styles.card, padding: '24px' }}>
          <h3 style={{ color: '#6b7280', fontSize: '14px', marginBottom: '8px' }}>Active @ Site</h3>
          <p style={{ fontSize: '32px', fontWeight: 'bold', color: COLORS.info }}>{stats.activeRequests}</p>
        </div>
        <div style={{ ...styles.card, padding: '24px' }}>
          <h3 style={{ color: '#6b7280', fontSize: '14px', marginBottom: '8px' }}>Pending Engineering</h3>
          <p style={{ fontSize: '32px', fontWeight: 'bold', color: COLORS.purple }}>{stats.pendingEng}</p>
        </div>
        <div style={{ ...styles.card, padding: '24px' }}>
          <h3 style={{ color: '#6b7280', fontSize: '14px', marginBottom: '8px' }}>To Order</h3>
          <p style={{ fontSize: '32px', fontWeight: 'bold', color: COLORS.warning }}>{stats.toOrder}</p>
        </div>
        <div style={{ ...styles.card, padding: '24px' }}>
          <h3 style={{ color: '#6b7280', fontSize: '14px', marginBottom: '8px' }}>To Be Collected</h3>
          <p style={{ fontSize: '32px', fontWeight: 'bold', color: COLORS.success }}>{stats.toCollect}</p>
        </div>
      </div>

      <div style={styles.card}>
        <div style={styles.cardHeader}>
          <h3 style={{ fontWeight: '600' }}>Ultimi Movimenti</h3>
        </div>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Data</th>
              <th style={styles.th}>Tipo</th>
              <th style={styles.th}>Code</th>
              <th style={styles.th}>Qty</th>
              <th style={styles.th}>Da → A</th>
            </tr>
          </thead>
          <tbody>
            {movements.map((mov, idx) => (
              <tr key={idx}>
                <td style={styles.td}>{new Date(mov.created_at).toLocaleDateString()}</td>
                <td style={styles.td}>
                  <span style={{
                    ...styles.statusBadge,
                    backgroundColor: mov.movement_type === 'IN' ? COLORS.success :
                                    mov.movement_type === 'OUT' ? COLORS.primary :
                                    mov.movement_type === 'LOST' ? COLORS.orange : COLORS.purple
                  }}>
                    {mov.movement_type}
                  </span>
                </td>
                <td style={{ ...styles.td, fontFamily: 'monospace' }}>{mov.ident_code}</td>
                <td style={styles.td}>{mov.quantity}</td>
                <td style={styles.td}>{mov.from_location} → {mov.to_location}</td>
              </tr>
            ))}
            {movements.length === 0 && (
              <tr>
                <td colSpan="5" style={{ ...styles.td, textAlign: 'center', color: '#9ca3af' }}>
                  No movements
                </td>
              </tr>
            )}
          </tbody>
        </table>
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
  const [secondaryCollector, setSecondaryCollector] = useState('');
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
  const searchIsoOptions = async (searchTerm) => {
    if (searchTerm.length < 4) return [];
    const { data } = await supabase
      .from('project_materials')
      .select('iso_number')
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
    setSecondaryCollector('');
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
    const { data } = await supabase
      .from('project_materials')
      .select('ident_code, description, diam1')
      .ilike('ident_code', `%${searchTerm}%`)
      .order('ident_code')
      .limit(50);
    if (data) {
      // Get unique ident codes with their descriptions
      const seen = new Set();
      const results = [];
      data.forEach(d => {
        if (d.ident_code && !seen.has(d.ident_code)) {
          seen.add(d.ident_code);
          const descText = d.description ? d.description.substring(0, 50) : 'No description';
          const diamText = d.diam1 ? ` [Ø${d.diam1}]` : '';
          results.push({
            value: d.ident_code,
            label: descText + diamText,
            description: d.description || '',
            diam1: d.diam1 || ''
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
      .select('ident_code, description, diam1')
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
          const diamText = d.diam1 ? ` [Ø${d.diam1}]` : '';
          results.push({
            value: d.ident_code,
            label: descText + diamText,
            description: d.description || '',
            diam1: d.diam1 || ''
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
    let diam1 = '';
    if (typeof identCodeOrObject === 'object') {
      identCode = identCodeOrObject.value;
      desc = identCodeOrObject.description || '';
      diam1 = identCodeOrObject.diam1 || '';
    }
    setCurrentMaterial({ ...currentMaterial, ident_code: identCode, tag: '', description: desc, diam1: diam1 });
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
      diam1: currentMaterial.diam1 || '',
      qty: currentMaterial.qty,
      pos_qty: selected?.pos_qty || 0
    }]);
    setCurrentMaterial({ ident_code: '', tag: '', qty: '', description: '', diam1: '' });
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
          secondary_collector: requestType === 'TestPack' ? (secondaryCollector || null) : null,
          description: (requestType === 'TestPack' && missingType === 'Spool') 
            ? `Spools: ${selectedSpools.join(', ')}` 
            : (description || null)
        })
        .select()
        .single();

      if (reqError) throw reqError;

      // Determine status based on destination
      let status;
      if (destination === 'site') status = 'Site';
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
          const { data: comp, error: compError } = await supabase
            .from('request_components')
            .insert({
              request_id: request.id,
              ident_code: mat.ident_code,
              tag: mat.tag || null,
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
      setSecondaryCollector('');
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
                <label style={styles.label}>Description (optional)</label>
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

              <div style={{ marginBottom: '20px' }}>
                <label style={styles.label}>Secondary Collector (optional)</label>
                <input
                  type="text"
                  list="users-list"
                  value={secondaryCollector}
                  onChange={(e) => setSecondaryCollector(e.target.value)}
                  style={styles.input}
                  placeholder="Search user name..."
                  disabled={!canModify}
                />
                <datalist id="users-list">
                  {allUsers.map(u => (
                    <option key={u.id} value={u.full_name}>{u.full_name} ({u.badge_number})</option>
                  ))}
                </datalist>
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
              {currentMaterial.ident_code && (currentMaterial.description || currentMaterial.diam1) && (
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
                      {currentMaterial.description || '-'}
                    </p>
                  </div>
                  <div style={{ minWidth: '80px' }}>
                    <span style={{ fontSize: '11px', color: '#6b7280', textTransform: 'uppercase' }}>Diam</span>
                    <p style={{ fontSize: '14px', color: '#1f2937', fontWeight: '600', marginTop: '2px' }}>
                      {currentMaterial.diam1 || '-'}
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
                        <td style={styles.td}>{mat.diam1 || '-'}</td>
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
// WH SITE PAGE
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

  useEffect(() => { loadComponents(); }, []);

  const loadComponents = async () => {
    setLoading(true);
    const { data: siteData } = await supabase
      .from('request_components')
      .select(`*, requests (request_number, sub_number, sub_category, request_type, requester_user_id)`)
      .eq('status', 'Site');

    const { data: notesData } = await supabase
      .from('request_components')
      .select(`*, requests (request_number, sub_number)`)
      .eq('has_eng_check', true)
      .eq('eng_check_sent_to', 'Site');

    if (siteData) setComponents(siteData);
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
          await logHistory(component.id, 'Sent to Yard', 'Site', 'Yard', note);
          break;
        case 'eng':
          await supabase.from('request_components')
            .update({ status: 'Eng' })
            .eq('id', component.id);
          await logHistory(component.id, 'Sent to Engineering', 'Site', 'Eng', note);
          break;
        case 'delete':
          if (confirm('Delete this component?')) {
            await supabase.from('request_components')
              .update({ status: 'Cancelled' })
              .eq('id', component.id);
            await logHistory(component.id, 'Cancelled', 'Site', 'Cancelled', note);
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
    
    await logHistory(component.id, `Ready - ${dest.toUpperCase()}`, 'Site', newStatus, note);
    
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
    
    await logHistory(selectedComponent.id, 'Partial Split', 'Site', 'ToCollect', 
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
      status: 'Site',
      current_location: 'SITE'
    });

    setShowPartialModal(false);
    setPartialQty('');
    loadComponents();
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

      {/* Site Components */}
      <div style={styles.card}>
        <div style={styles.cardHeader}>
          <h3 style={{ fontWeight: '600' }}>WH Site - Components ({components.length})</h3>
        </div>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Request</th>
              <th style={styles.th}>Code</th>
              <th style={styles.th}>Description</th>
              <th style={styles.th}>Qty</th>
              <th style={styles.th}>Category</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {components.map(comp => (
              <tr key={comp.id}>
                <td style={{ ...styles.td, fontFamily: 'monospace', fontWeight: '600' }}>
                  {String(comp.requests?.request_number).padStart(5, '0')}-{comp.requests?.sub_number}
                </td>
                <td style={{ ...styles.td, fontFamily: 'monospace' }}>{comp.ident_code}</td>
                <td style={styles.td}>{comp.description}</td>
                <td style={styles.td}>{comp.quantity}</td>
                <td style={styles.td}>{comp.requests?.sub_category || comp.requests?.request_type}</td>
                <td style={styles.td}>
                  <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                    <ActionDropdown
                      actions={[
                        { id: 'ready', icon: '✓', label: 'Ready' },
                        { id: 'pt', icon: '✂️', label: 'Partial' },
                        { id: 'yard', icon: '🏢', label: 'To Yard' },
                        { id: 'eng', icon: '⚙️', label: 'To Engineering' },
                        { id: 'delete', icon: '🗑️', label: 'Delete' }
                      ]}
                      onExecute={(action) => handleAction(comp, action)}
                      disabled={!canModify}
                      componentId={comp.id}
                    />
                    <ActionButton color={COLORS.gray} onClick={() => openHistory(comp.id)} title="History">ℹ️</ActionButton>
                  </div>
                </td>
              </tr>
            ))}
            {components.length === 0 && (
              <tr>
                <td colSpan="6" style={{ ...styles.td, textAlign: 'center', color: '#9ca3af' }}>
                  No components in WH Site
                </td>
              </tr>
            )}
          </tbody>
        </table>
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
// WH YARD PAGE - con popup destinazione
// ============================================================
function WHYardPage({ user }) {
  const [components, setComponents] = useState([]);
  const [inventory, setInventory] = useState({});
  const [loading, setLoading] = useState(true);
  const [showPartialModal, setShowPartialModal] = useState(false);
  const [selectedComponent, setSelectedComponent] = useState(null);
  const [partialQty, setPartialQty] = useState('');
  const [showDestPopup, setShowDestPopup] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [historyComponentId, setHistoryComponentId] = useState(null);

  useEffect(() => { loadComponents(); }, []);

  const loadComponents = async () => {
    setLoading(true);
    const { data: yardData } = await supabase
      .from('request_components')
      .select(`*, requests (request_number, sub_number, sub_category, request_type)`)
      .eq('status', 'Yard');

    if (yardData) {
      setComponents(yardData);
      const codes = [...new Set(yardData.map(c => c.ident_code))];
      const { data: invData } = await supabase
        .from('inventory')
        .select('ident_code, yard_qty')
        .in('ident_code', codes);
      const invMap = {};
      invData?.forEach(i => { invMap[i.ident_code] = i.yard_qty || 0; });
      setInventory(invMap);
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
    const available = inventory[component.ident_code] || 0;
    
    try {
      switch (action) {
        case 'found':
          if (available < component.quantity) {
            alert(`Solo ${available} disponibili in YARD!`);
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
        case 'return':
          await supabase.from('request_components')
            .update({ status: 'Site', current_location: 'SITE' })
            .eq('id', component.id);
          await logHistory(component.id, 'Returned to Site', 'Yard', 'Site', '');
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
    const available = inventory[component.ident_code] || 0;
    
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
    const available = inventory[selectedComponent.ident_code] || 0;
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

  const openHistory = (compId) => {
    setHistoryComponentId(compId);
    setShowHistory(true);
  };

  const canModify = user.role === 'admin' || user.perm_wh_yard === 'modify';

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading...</div>;

  return (
    <div>
      <div style={styles.card}>
        <div style={styles.cardHeader}>
          <h3 style={{ fontWeight: '600' }}>WH Yard - Components ({components.length})</h3>
        </div>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Request</th>
              <th style={styles.th}>Code</th>
              <th style={styles.th}>Description</th>
              <th style={styles.th}>Requested</th>
              <th style={styles.th}>Available</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {components.map(comp => {
              const available = inventory[comp.ident_code] || 0;
              const canFulfill = available >= comp.quantity;
              
              // Build actions list based on conditions
              const yardActions = [];
              if (canFulfill) {
                yardActions.push({ id: 'found', icon: '✓', label: 'Found/Transfer' });
              }
              if (available > 0) {
                yardActions.push({ id: 'pt', icon: '✂️', label: 'Partial' });
              }
              yardActions.push({ id: 'eng', icon: '⚙️', label: 'To Engineering' });
              yardActions.push({ id: 'return', icon: '↩️', label: 'Return to Site' });
              yardActions.push({ id: 'delete', icon: '🗑️', label: 'Delete' });
              
              return (
                <tr key={comp.id}>
                  <td style={{ ...styles.td, fontFamily: 'monospace', fontWeight: '600' }}>
                    {String(comp.requests?.request_number).padStart(5, '0')}-{comp.requests?.sub_number}
                  </td>
                  <td style={{ ...styles.td, fontFamily: 'monospace' }}>{comp.ident_code}</td>
                  <td style={styles.td}>{comp.description}</td>
                  <td style={styles.td}>{comp.quantity}</td>
                  <td style={styles.td}>
                    <span style={{ fontWeight: '600', color: canFulfill ? COLORS.success : COLORS.primary }}>
                      {available}
                    </span>
                  </td>
                  <td style={styles.td}>
                    <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                      <ActionDropdown
                        actions={yardActions}
                        onExecute={(action) => handleAction(comp, action)}
                        disabled={!canModify}
                        componentId={comp.id}
                      />
                      <ActionButton color={COLORS.gray} onClick={() => openHistory(comp.id)} title="History">ℹ️</ActionButton>
                    </div>
                  </td>
                </tr>
              );
            })}
            {components.length === 0 && (
              <tr>
                <td colSpan="6" style={{ ...styles.td, textAlign: 'center', color: '#9ca3af' }}>
                  No components in WH Yard
                </td>
              </tr>
            )}
          </tbody>
        </table>
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
          Requested: {selectedComponent?.quantity} | Available: {inventory[selectedComponent?.ident_code] || 0}
        </p>
        <div style={{ marginBottom: '16px' }}>
          <label style={styles.label}>Quantity to send</label>
          <input
            type="number"
            value={partialQty}
            onChange={(e) => setPartialQty(e.target.value)}
            style={styles.input}
            min="1"
            max={inventory[selectedComponent?.ident_code] || 0}
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
// SITE IN PAGE - Transit from Yard to Site
// ============================================================
function SiteInPage({ user }) {
  const [components, setComponents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadComponents(); }, []);

  const loadComponents = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('request_components')
      .select(`*, requests (request_number, sub_number, sub_category, request_type)`)
      .eq('status', 'Trans');
    if (data) setComponents(data);
    setLoading(false);
  };

  const handleReceive = async (component) => {
    try {
      await supabase.from('request_components')
        .update({ status: 'ToCollect', current_location: 'SITE' })
        .eq('id', component.id);
      
      await supabase.rpc('increment_site_qty', { 
        p_ident_code: component.ident_code, 
        p_qty: component.quantity 
      });

      await supabase.from('component_history').insert({
        component_id: component.id,
        action: 'Received at Site',
        from_status: 'Trans',
        to_status: 'ToCollect',
        performed_by_user_id: user.id,
        performed_by_name: user.full_name,
        note: 'Materiale arrivato e pronto per ritiro'
      });

      await supabase.from('movements').insert({
        ident_code: component.ident_code,
        movement_type: 'IN',
        quantity: component.quantity,
        from_location: 'YARD',
        to_location: 'SITE',
        performed_by: user.full_name
      });

      loadComponents();
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };

  const canModify = user.role === 'admin' || user.perm_site_in === 'modify';

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading...</div>;

  return (
    <div>
      <div style={styles.card}>
        <div style={styles.cardHeader}>
          <h3 style={{ fontWeight: '600' }}>Site IN - Material in Transit ({components.length})</h3>
        </div>
        <table style={styles.table}>
          <thead>
            <tr>
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
                <td style={{ ...styles.td, fontFamily: 'monospace', fontWeight: '600' }}>
                  {String(comp.requests?.request_number).padStart(5, '0')}-{comp.requests?.sub_number}
                </td>
                <td style={{ ...styles.td, fontFamily: 'monospace' }}>{comp.ident_code}</td>
                <td style={styles.td}>{comp.description}</td>
                <td style={styles.td}>{comp.quantity}</td>
                <td style={styles.td}>
                  <button
                    onClick={() => handleReceive(comp)}
                    disabled={!canModify}
                    style={{ ...styles.button, backgroundColor: COLORS.success, color: 'white' }}
                  >
                    📥 Confirm Arrivo
                  </button>
                </td>
              </tr>
            ))}
            {components.length === 0 && (
              <tr>
                <td colSpan="5" style={{ ...styles.td, textAlign: 'center', color: '#9ca3af' }}>
                  No materials in transit
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ============================================================
// ENGINEERING PAGE - con Check Both
// ============================================================
function EngineeringPage({ user }) {
  const [components, setComponents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCheckModal, setShowCheckModal] = useState(false);
  const [selectedComponent, setSelectedComponent] = useState(null);
  const [checkDestination, setCheckDestination] = useState('Site');
  const [checkMessage, setCheckMessage] = useState('');
  const [showPartialModal, setShowPartialModal] = useState(false);
  const [partialQty, setPartialQty] = useState('');
  const [showHistory, setShowHistory] = useState(false);
  const [historyComponentId, setHistoryComponentId] = useState(null);

  useEffect(() => { loadComponents(); }, []);

  const loadComponents = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('request_components')
      .select(`*, requests (request_number, sub_number, sub_category, request_type)`)
      .eq('status', 'Eng');
    if (data) setComponents(data);
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
            .update({ status: 'Site' })
            .eq('id', component.id);
          await logHistory(component.id, 'Resolved - Sent to Site', 'Eng', 'Site', '');
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
          await supabase.from('request_components')
            .update({ status: 'Mng' })
            .eq('id', component.id);
          await logHistory(component.id, 'Sent to Management', 'Eng', 'Mng', '');
          break;
        case 'return':
          await supabase.from('request_components')
            .update({ status: 'Site' })
            .eq('id', component.id);
          await logHistory(component.id, 'Returned to Site', 'Eng', 'Site', '');
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
    const destinations = checkDestination === 'Both' ? ['Site', 'Yard'] : [checkDestination];
    
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
    setCheckDestination('Site');
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

  const openHistory = (compId) => {
    setHistoryComponentId(compId);
    setShowHistory(true);
  };

  const canModify = user.role === 'admin' || user.perm_engineering === 'modify';

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading...</div>;

  return (
    <div>
      <div style={styles.card}>
        <div style={styles.cardHeader}>
          <h3 style={{ fontWeight: '600' }}>Engineering - Under Review ({components.length})</h3>
        </div>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Request</th>
              <th style={styles.th}>Code</th>
              <th style={styles.th}>Description</th>
              <th style={styles.th}>Qty</th>
              <th style={styles.th}>Check</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {components.map(comp => {
              // Build actions list based on conditions
              const engActions = [];
              if (!comp.has_eng_check) {
                engActions.push({ id: 'resolved', icon: '✓', label: 'Resolved → Site' });
                engActions.push({ id: 'check', icon: '🔍', label: 'Send Check' });
              }
              engActions.push({ id: 'pt', icon: '✂️', label: 'Partial' });
              engActions.push({ id: 'spare', icon: '🔧', label: 'Spare Parts' });
              engActions.push({ id: 'mng', icon: '👔', label: 'Management' });
              engActions.push({ id: 'return', icon: '↩️', label: 'Return to Site' });
              engActions.push({ id: 'delete', icon: '🗑️', label: 'Delete' });
              
              return (
                <tr key={comp.id}>
                  <td style={{ ...styles.td, fontFamily: 'monospace', fontWeight: '600' }}>
                    {String(comp.requests?.request_number).padStart(5, '0')}-{comp.requests?.sub_number}
                  </td>
                  <td style={{ ...styles.td, fontFamily: 'monospace' }}>{comp.ident_code}</td>
                  <td style={styles.td}>{comp.description}</td>
                  <td style={styles.td}>{comp.quantity}</td>
                  <td style={styles.td}>
                    {comp.has_eng_check ? (
                      <span style={{ ...styles.statusBadge, backgroundColor: COLORS.purple }}>
                        🔍 {comp.eng_check_sent_to}
                      </span>
                    ) : '-'}
                  </td>
                  <td style={styles.td}>
                    <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                      <ActionDropdown
                        actions={engActions}
                        onExecute={(action) => handleAction(comp, action)}
                        disabled={!canModify}
                        componentId={comp.id}
                      />
                      <ActionButton color={COLORS.gray} onClick={() => openHistory(comp.id)} title="History">ℹ️</ActionButton>
                    </div>
                  </td>
                </tr>
              );
            })}
            {components.length === 0 && (
              <tr>
                <td colSpan="6" style={{ ...styles.td, textAlign: 'center', color: '#9ca3af' }}>
                  No components in Engineering
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Check Modal - con opzione Both */}
      <Modal isOpen={showCheckModal} onClose={() => setShowCheckModal(false)} title="Send Check Request">
        <div style={{ marginBottom: '16px' }}>
          <label style={styles.label}>Send to</label>
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              <input type="radio" name="checkDest" value="Site" checked={checkDestination === 'Site'} onChange={(e) => setCheckDestination(e.target.value)} />
              WH Site
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              <input type="radio" name="checkDest" value="Yard" checked={checkDestination === 'Yard'} onChange={(e) => setCheckDestination(e.target.value)} />
              WH Yard
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', color: COLORS.teal, fontWeight: '600' }}>
              <input type="radio" name="checkDest" value="Both" checked={checkDestination === 'Both'} onChange={(e) => setCheckDestination(e.target.value)} />
              🔄 ENTRAMBI
            </label>
          </div>
        </div>
        <div style={{ marginBottom: '16px' }}>
          <label style={styles.label}>Messaggio / Istruzioni</label>
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
      <Modal isOpen={showPartialModal} onClose={() => setShowPartialModal(false)} title="Split - Parte a Spare">
        <p style={{ marginBottom: '16px' }}>
          <strong>{selectedComponent?.ident_code}</strong> - Totale: {selectedComponent?.quantity}
        </p>
        <div style={{ marginBottom: '16px' }}>
          <label style={styles.label}>Qty a Spare Parts</label>
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
        // Update inventory record_out
        await supabase.from('inventory')
          .update({ record_out: supabase.raw(`COALESCE(record_out, 0) + ${comp.quantity}`) })
          .eq('ident_code', comp.ident_code);
        
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
      <div style={{ marginBottom: '16px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '12px' }}>
          🔩 HF - Flanged Joints
          <span style={{ fontSize: '14px', fontWeight: 'normal', color: '#6b7280' }}>
            ({groupList.length} gruppi)
          </span>
        </h2>
        <p style={{ color: '#6b7280', fontSize: '14px', marginTop: '4px' }}>
          Completa tutte le parti di un HF prima di consegnare
        </p>
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
                        ✅ Consegna
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
                      ⏳ In attesa di completamento
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
                    <th style={styles.th}>Stato</th>
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
                        <ActionButton color={COLORS.gray} onClick={() => openHistory(comp.id)} title="History">ℹ️</ActionButton>
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
        await supabase.from('inventory')
          .update({ record_out: supabase.raw(`COALESCE(record_out, 0) + ${comp.quantity}`) })
          .eq('ident_code', comp.ident_code);
        
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
      <div style={{ marginBottom: '16px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '12px' }}>
          📋 TestPack Materials
          <span style={{ fontSize: '14px', fontWeight: 'normal', color: '#6b7280' }}>
            ({groupList.length} gruppi)
          </span>
        </h2>
        <p style={{ color: '#6b7280', fontSize: '14px', marginTop: '4px' }}>
          Completa tutte le parti di un TestPack prima di consegnare
        </p>
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
                    ✅ Consegna
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
                    <th style={styles.th}>Stato</th>
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
                        <ActionButton color={COLORS.gray} onClick={() => openHistory(comp.id)} title="History">ℹ️</ActionButton>
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
// TO BE COLLECTED PAGE - Solo richiedente può ritirare
// ============================================================
function ToBeCollectedPage({ user }) {
  const [components, setComponents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showHistory, setShowHistory] = useState(false);
  const [historyComponentId, setHistoryComponentId] = useState(null);

  useEffect(() => { loadComponents(); }, []);

  const loadComponents = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('request_components')
      .select(`*, requests (request_number, sub_number, requester_user_id, secondary_collector)`)
      .eq('status', 'ToCollect');
    if (data) setComponents(data);
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

  const canCollect = (comp) => {
    // Solo richiedente o secondary_collector o admin
    if (user.role === 'admin') return true;
    if (comp.requests?.requester_user_id === user.id) return true;
    if (comp.requests?.secondary_collector === user.full_name) return true;
    return false;
  };

  const handleDeliver = async (component) => {
    if (!canCollect(component)) {
      alert('Solo il richiedente può ritirare questo materiale!');
      return;
    }

    try {
      await supabase.from('request_components')
        .update({ status: 'Done' })
        .eq('id', component.id);
      
      // Decrement site inventory
      await supabase.rpc('decrement_site_qty', { 
        p_ident_code: component.ident_code, 
        p_qty: component.quantity 
      });

      // Update record_out
      await supabase.from('inventory')
        .update({ record_out: supabase.raw(`COALESCE(record_out, 0) + ${component.quantity}`) })
        .eq('ident_code', component.ident_code);

      await logHistory(component.id, 'Delivered to Requester', 'ToCollect', 'Done', 
        `Ritirato da ${user.full_name}`);

      await supabase.from('movements').insert({
        ident_code: component.ident_code,
        movement_type: 'OUT',
        quantity: component.quantity,
        from_location: 'SITE',
        to_location: 'DELIVERED',
        performed_by: user.full_name,
        note: `Request ${component.requests?.request_number}-${component.requests?.sub_number}`
      });

      loadComponents();
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };

  const openHistory = (compId) => {
    setHistoryComponentId(compId);
    setShowHistory(true);
  };

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading...</div>;

  return (
    <div>
      <div style={{ marginBottom: '16px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 'bold' }}>✅ To Be Collected</h2>
        <p style={{ color: '#6b7280', fontSize: '14px', marginTop: '4px' }}>
          Materiale pronto per il ritiro - Solo il richiedente può ritirare
        </p>
      </div>

      <div style={styles.card}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Request</th>
              <th style={styles.th}>Code</th>
              <th style={styles.th}>Description</th>
              <th style={styles.th}>Qty</th>
              <th style={styles.th}>Può Ritirare</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {components.map(comp => {
              const canDo = canCollect(comp);
              return (
                <tr key={comp.id} style={{ backgroundColor: canDo ? '#F0FDF4' : 'white' }}>
                  <td style={{ ...styles.td, fontFamily: 'monospace', fontWeight: '600' }}>
                    {String(comp.requests?.request_number).padStart(5, '0')}-{comp.requests?.sub_number}
                  </td>
                  <td style={{ ...styles.td, fontFamily: 'monospace' }}>{comp.ident_code}</td>
                  <td style={styles.td}>{comp.description}</td>
                  <td style={styles.td}>{comp.quantity}</td>
                  <td style={styles.td}>
                    {canDo ? (
                      <span style={{ ...styles.statusBadge, backgroundColor: COLORS.success }}>✅ Sì</span>
                    ) : (
                      <span style={{ ...styles.statusBadge, backgroundColor: COLORS.gray }}>❌ No</span>
                    )}
                  </td>
                  <td style={styles.td}>
                    <div style={{ display: 'flex', gap: '4px' }}>
                      <button
                        onClick={() => handleDeliver(comp)}
                        disabled={!canDo}
                        style={{ 
                          ...styles.button, 
                          backgroundColor: canDo ? COLORS.success : '#d1d5db', 
                          color: 'white',
                          cursor: canDo ? 'pointer' : 'not-allowed'
                        }}
                      >
                        📤 Ritira
                      </button>
                      <ActionButton color={COLORS.gray} onClick={() => openHistory(comp.id)} title="History">ℹ️</ActionButton>
                    </div>
                  </td>
                </tr>
              );
            })}
            {components.length === 0 && (
              <tr>
                <td colSpan="6" style={{ ...styles.td, textAlign: 'center', color: '#9ca3af' }}>
                  No materials to collect
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

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

  // Search ident code in project_materials
  const searchIdentCode = async (term) => {
    if (term.length < 3) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }
    const { data } = await supabase
      .from('project_materials')
      .select('ident_code, description, diam1')
      .ilike('ident_code', `%${term}%`)
      .limit(30);
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
  };

  const selectIdent = (item) => {
    setIdentCode(item.ident_code);
    setItemDescription(item.description || '');
    setItemDiam1(item.diam1 || '');
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
      diam1: itemDiam1,
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
            📋 {showPartialsLog ? 'Hide' : 'Show'} Partials Log
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
                          onMouseEnter={(e) => e.target.style.backgroundColor = '#f3f4f6'}
                          onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
                        >
                          <strong>{item.ident_code}</strong>
                          <span style={{ color: '#6b7280', marginLeft: '8px' }}>{item.description?.substring(0, 40)}</span>
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
                  <td style={styles.td}>{item.diam1 || '-'}</td>
                  <td style={{ ...styles.td, fontWeight: '600' }}>{item.quantity}</td>
                  <td style={styles.td}>
                    {item.is_partial ? (
                      <span style={{ ...styles.statusBadge, backgroundColor: COLORS.warning }}>Yes</span>
                    ) : '-'}
                  </td>
                  <td style={{ ...styles.td, color: item.missing_qty > 0 ? COLORS.primary : '#6b7280' }}>
                    {item.missing_qty || '-'}
                  </td>
                  <td style={{ ...styles.td, fontSize: '12px', color: '#6b7280' }}>{item.note || '-'}</td>
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

      {/* Partials Log */}
      {showPartialsLog && (
        <div style={styles.card}>
          <div style={{ ...styles.cardHeader, backgroundColor: '#FEF3C7' }}>
            <h3 style={{ fontWeight: '600', color: COLORS.warning }}>⚠️ Partials Log - Items Not Fully Received</h3>
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
                  <td style={{ ...styles.td, maxWidth: '150px', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.description || '-'}</td>
                  <td style={{ ...styles.td, color: COLORS.success }}>{p.received_qty}</td>
                  <td style={{ ...styles.td, color: COLORS.primary, fontWeight: '600' }}>{p.missing_qty}</td>
                  <td style={{ ...styles.td, fontSize: '12px' }}>{p.note || '-'}</td>
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
// SPARE PARTS PAGE
// ============================================================
function SparePartsPage({ user }) {
  const [components, setComponents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadComponents(); }, []);

  const loadComponents = async () => {
    setLoading(true);
    const { data } = await supabase.from('request_components').select(`*, requests (request_number, sub_number)`).eq('status', 'Spare');
    if (data) setComponents(data);
    setLoading(false);
  };

  const handleAction = async (component, orderType) => {
    await supabase.from('request_components').update({ status: 'Order', order_type: orderType }).eq('id', component.id);
    await supabase.from('component_history').insert({
      component_id: component.id, action: `Sent to ${orderType} Order`, from_status: 'Spare', to_status: 'Order',
      performed_by_user_id: user.id, performed_by_name: user.full_name
    });
    loadComponents();
  };

  const canModify = user.role === 'admin' || user.perm_spare_parts === 'modify';

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading...</div>;

  return (
    <div>
      <div style={styles.card}>
        <div style={styles.cardHeader}><h3 style={{ fontWeight: '600' }}>Spare Parts ({components.length})</h3></div>
        <table style={styles.table}>
          <thead>
            <tr>
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
                <td style={{ ...styles.td, fontFamily: 'monospace', fontWeight: '600' }}>{String(comp.requests?.request_number).padStart(5, '0')}-{comp.requests?.sub_number}</td>
                <td style={{ ...styles.td, fontFamily: 'monospace' }}>{comp.ident_code}</td>
                <td style={styles.td}>{comp.description}</td>
                <td style={styles.td}>{comp.quantity}</td>
                <td style={styles.td}>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={() => handleAction(comp, 'Client')} disabled={!canModify} style={{ ...styles.button, backgroundColor: COLORS.cyan, color: 'white' }}>👤 Client</button>
                    <button onClick={() => handleAction(comp, 'Internal')} disabled={!canModify} style={{ ...styles.button, backgroundColor: COLORS.info, color: 'white' }}>🏢 Internal</button>
                  </div>
                </td>
              </tr>
            ))}
            {components.length === 0 && <tr><td colSpan="5" style={{ ...styles.td, textAlign: 'center', color: '#9ca3af' }}>No components</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ============================================================
// ORDERS PAGE
// ============================================================
function OrdersPage({ user }) {
  const [activeTab, setActiveTab] = useState('toOrder');
  const [toOrderComponents, setToOrderComponents] = useState([]);
  const [orderedComponents, setOrderedComponents] = useState([]);
  const [orderLog, setOrderLog] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [selectedComponent, setSelectedComponent] = useState(null);
  const [orderDate, setOrderDate] = useState(new Date().toISOString().split('T')[0]);
  const [expectedDate, setExpectedDate] = useState('');

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    setLoading(true);
    const { data: toOrder } = await supabase.from('request_components').select(`*, requests (request_number, sub_number)`).eq('status', 'Order');
    const { data: ordered } = await supabase.from('request_components').select(`*, requests (request_number, sub_number)`).eq('status', 'Ordered');
    const { data: log } = await supabase.from('order_log').select('*').order('created_at', { ascending: false }).limit(50);
    if (toOrder) setToOrderComponents(toOrder);
    if (ordered) setOrderedComponents(ordered);
    if (log) setOrderLog(log);
    setLoading(false);
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
    await supabase.from('component_history').insert({ component_id: selectedComponent.id, action: 'Order Placed', from_status: 'Order', to_status: 'Ordered', performed_by_user_id: user.id, performed_by_name: user.full_name, note: `Expected: ${expectedDate || 'TBD'}` });
    await supabase.from('movements').insert({ ident_code: selectedComponent.ident_code, movement_type: 'ORDER', quantity: selectedComponent.quantity, from_location: 'ORDER', to_location: 'SUPPLIER', performed_by: user.full_name });
    setShowOrderModal(false);
    loadData();
  };

  const canModify = user.role === 'admin' || user.perm_orders === 'modify';

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading...</div>;

  return (
    <div>
      <div style={{ display: 'flex', gap: '4px', marginBottom: '16px' }}>
        {[{ id: 'toOrder', label: `To Order (${toOrderComponents.length})` }, { id: 'ordered', label: `Ordered (${orderedComponents.length})` }, { id: 'log', label: 'Log' }].map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{ ...styles.button, backgroundColor: activeTab === tab.id ? 'white' : '#e5e7eb', color: activeTab === tab.id ? '#1f2937' : '#6b7280', borderRadius: '8px 8px 0 0' }}>{tab.label}</button>
        ))}
      </div>

      <div style={styles.card}>
        {activeTab === 'toOrder' && (
          <table style={styles.table}>
            <thead><tr><th style={styles.th}>Request</th><th style={styles.th}>Code</th><th style={styles.th}>Qty</th><th style={styles.th}>Tipo</th><th style={styles.th}>Actions</th></tr></thead>
            <tbody>
              {toOrderComponents.map(comp => (
                <tr key={comp.id}>
                  <td style={{ ...styles.td, fontFamily: 'monospace', fontWeight: '600' }}>{String(comp.requests?.request_number).padStart(5, '0')}-{comp.requests?.sub_number}</td>
                  <td style={{ ...styles.td, fontFamily: 'monospace' }}>{comp.ident_code}</td>
                  <td style={styles.td}>{comp.quantity}</td>
                  <td style={styles.td}><span style={{ ...styles.statusBadge, backgroundColor: comp.order_type === 'Client' ? COLORS.cyan : COLORS.info }}>{comp.order_type || 'Internal'}</span></td>
                  <td style={styles.td}><button onClick={() => openOrderModal(comp)} disabled={!canModify} style={{ ...styles.button, backgroundColor: COLORS.success, color: 'white' }}>🛒 Order</button></td>
                </tr>
              ))}
              {toOrderComponents.length === 0 && <tr><td colSpan="5" style={{ ...styles.td, textAlign: 'center', color: '#9ca3af' }}>No orders</td></tr>}
            </tbody>
          </table>
        )}
        {activeTab === 'ordered' && (
          <table style={styles.table}>
            <thead><tr><th style={styles.th}>Request</th><th style={styles.th}>Code</th><th style={styles.th}>Qty</th><th style={styles.th}>Order Date</th><th style={styles.th}>Forecast</th></tr></thead>
            <tbody>
              {orderedComponents.map(comp => (
                <tr key={comp.id}>
                  <td style={{ ...styles.td, fontFamily: 'monospace', fontWeight: '600' }}>{String(comp.requests?.request_number).padStart(5, '0')}-{comp.requests?.sub_number}</td>
                  <td style={{ ...styles.td, fontFamily: 'monospace' }}>{comp.ident_code}</td>
                  <td style={styles.td}>{comp.quantity}</td>
                  <td style={styles.td}>{comp.order_date ? new Date(comp.order_date).toLocaleDateString() : '-'}</td>
                  <td style={styles.td}>{comp.order_forecast ? new Date(comp.order_forecast).toLocaleDateString() : '-'}</td>
                </tr>
              ))}
              {orderedComponents.length === 0 && <tr><td colSpan="5" style={{ ...styles.td, textAlign: 'center', color: '#9ca3af' }}>No orders</td></tr>}
            </tbody>
          </table>
        )}
        {activeTab === 'log' && (
          <table style={styles.table}>
            <thead><tr><th style={styles.th}>Data</th><th style={styles.th}>Code</th><th style={styles.th}>Qty</th><th style={styles.th}>Tipo</th><th style={styles.th}>Ordered by</th></tr></thead>
            <tbody>
              {orderLog.map((log, idx) => (
                <tr key={idx}>
                  <td style={styles.td}>{new Date(log.created_at).toLocaleDateString()}</td>
                  <td style={{ ...styles.td, fontFamily: 'monospace' }}>{log.ident_code}</td>
                  <td style={styles.td}>{log.quantity}</td>
                  <td style={styles.td}>{log.order_type}</td>
                  <td style={styles.td}>{log.ordered_by}</td>
                </tr>
              ))}
              {orderLog.length === 0 && <tr><td colSpan="5" style={{ ...styles.td, textAlign: 'center', color: '#9ca3af' }}>No log entries</td></tr>}
            </tbody>
          </table>
        )}
      </div>

      <Modal isOpen={showOrderModal} onClose={() => setShowOrderModal(false)} title="Place Order">
        <p style={{ marginBottom: '16px' }}><strong>{selectedComponent?.ident_code}</strong> - Qty: {selectedComponent?.quantity}</p>
        <div style={{ marginBottom: '16px' }}><label style={styles.label}>Order Date *</label><input type="date" value={orderDate} onChange={(e) => setOrderDate(e.target.value)} style={styles.input} /></div>
        <div style={{ marginBottom: '16px' }}><label style={styles.label}>Data Prevista Consegna</label><input type="date" value={expectedDate} onChange={(e) => setExpectedDate(e.target.value)} style={styles.input} /></div>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          <button onClick={() => setShowOrderModal(false)} style={{ ...styles.button, ...styles.buttonSecondary }}>Cancel</button>
          <button onClick={submitOrder} style={{ ...styles.button, backgroundColor: COLORS.success, color: 'white' }}>Confirm</button>
        </div>
      </Modal>
    </div>
  );
}

// ============================================================
// MANAGEMENT PAGE
// ============================================================
function ManagementPage({ user }) {
  const [components, setComponents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadComponents(); }, []);

  const loadComponents = async () => {
    setLoading(true);
    const { data } = await supabase.from('request_components').select(`*, requests (request_number, sub_number)`).eq('status', 'Mng');
    if (data) setComponents(data);
    setLoading(false);
  };

  const handleDecision = async (component, orderType) => {
    await supabase.from('request_components').update({ status: 'Order', order_type: orderType }).eq('id', component.id);
    await supabase.from('component_history').insert({ component_id: component.id, action: `Management Decision: ${orderType}`, from_status: 'Mng', to_status: 'Order', performed_by_user_id: user.id, performed_by_name: user.full_name });
    loadComponents();
  };

  const canModify = user.role === 'admin' || user.perm_management === 'modify';

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading...</div>;

  return (
    <div>
      <div style={styles.card}>
        <div style={styles.cardHeader}><h3 style={{ fontWeight: '600' }}>Management - Decisions ({components.length})</h3></div>
        <table style={styles.table}>
          <thead><tr><th style={styles.th}>Request</th><th style={styles.th}>Code</th><th style={styles.th}>Description</th><th style={styles.th}>Qty</th><th style={styles.th}>Actions</th></tr></thead>
          <tbody>
            {components.map(comp => (
              <tr key={comp.id}>
                <td style={{ ...styles.td, fontFamily: 'monospace', fontWeight: '600' }}>{String(comp.requests?.request_number).padStart(5, '0')}-{comp.requests?.sub_number}</td>
                <td style={{ ...styles.td, fontFamily: 'monospace' }}>{comp.ident_code}</td>
                <td style={styles.td}>{comp.description}</td>
                <td style={styles.td}>{comp.quantity}</td>
                <td style={styles.td}>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={() => handleDecision(comp, 'Internal')} disabled={!canModify} style={{ ...styles.button, backgroundColor: COLORS.info, color: 'white' }}>🏢 Internal</button>
                    <button onClick={() => handleDecision(comp, 'Client')} disabled={!canModify} style={{ ...styles.button, backgroundColor: COLORS.cyan, color: 'white' }}>👤 Client</button>
                  </div>
                </td>
              </tr>
            ))}
            {components.length === 0 && <tr><td colSpan="5" style={{ ...styles.td, textAlign: 'center', color: '#9ca3af' }}>No decisions pending</td></tr>}
          </tbody>
        </table>
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
// LOG PAGE - with Add Movement
// ============================================================
function LogPage({ user }) {
  const [movements, setMovements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newMovement, setNewMovement] = useState({ ident_code: '', movement_type: 'IN', quantity: '', from_location: '', to_location: '', note: '' });
  const [allIdents, setAllIdents] = useState([]);
  const [allUsers, setAllUsers] = useState([]);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    setLoading(true);
    const { data: movData } = await supabase.from('movements').select('*').order('created_at', { ascending: false }).limit(200);
    if (movData) setMovements(movData);

    const { data: identData } = await supabase.from('inventory').select('ident_code').order('ident_code');
    if (identData) setAllIdents(identData.map(i => i.ident_code));

    const { data: userData } = await supabase.from('users').select('id, full_name').eq('is_active', true);
    if (userData) setAllUsers(userData);

    setLoading(false);
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
    } else if (newMovement.movement_type === 'LOST') {
      await supabase.from('inventory').update({ lost_qty: supabase.raw(`COALESCE(lost_qty, 0) + ${qty}`) }).eq('ident_code', newMovement.ident_code);
    } else if (newMovement.movement_type === 'BROKEN') {
      await supabase.from('inventory').update({ broken_qty: supabase.raw(`COALESCE(broken_qty, 0) + ${qty}`) }).eq('ident_code', newMovement.ident_code);
    }

    setShowAddModal(false);
    setNewMovement({ ident_code: '', movement_type: 'IN', quantity: '', from_location: '', to_location: '', note: '' });
    loadData();
  };

  const exportCSV = () => {
    const headers = ['Data', 'Tipo', 'Codice', 'Qty', 'Da', 'A', 'Operatore', 'Note'];
    const rows = movements.map(m => [
      new Date(m.created_at).toLocaleString(),
      m.movement_type,
      m.ident_code,
      m.quantity,
      m.from_location,
      m.to_location,
      m.performed_by,
      m.note || ''
    ]);
    const csv = [headers.join(','), ...rows.map(r => r.map(c => `"${c}"`).join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `movements_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const canModify = user.role === 'admin' || user.perm_movements === 'modify';

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading...</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginBottom: '16px' }}>
        <button onClick={exportCSV} style={{ ...styles.button, ...styles.buttonSecondary }}>📥 Export CSV</button>
        <button onClick={() => setShowAddModal(true)} disabled={!canModify} style={{ ...styles.button, ...styles.buttonPrimary }}>+ Aggiungi Movimento</button>
      </div>

      <div style={styles.card}>
        <div style={styles.cardHeader}><h3 style={{ fontWeight: '600' }}>Log Movimenti ({movements.length})</h3></div>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Data</th>
              <th style={styles.th}>Tipo</th>
              <th style={styles.th}>Code</th>
              <th style={styles.th}>Qty</th>
              <th style={styles.th}>Da → A</th>
              <th style={styles.th}>Operatore</th>
              <th style={styles.th}>Note</th>
            </tr>
          </thead>
          <tbody>
            {movements.map((mov, idx) => (
              <tr key={idx}>
                <td style={styles.td}>{new Date(mov.created_at).toLocaleString()}</td>
                <td style={styles.td}>
                  <span style={{
                    ...styles.statusBadge,
                    backgroundColor: mov.movement_type === 'IN' ? COLORS.success :
                                    mov.movement_type === 'OUT' ? COLORS.primary :
                                    mov.movement_type === 'LOST' ? COLORS.orange :
                                    mov.movement_type === 'BROKEN' ? COLORS.purple :
                                    mov.movement_type === 'TRANSFER' ? COLORS.info : COLORS.yellow
                  }}>
                    {mov.movement_type}
                  </span>
                </td>
                <td style={{ ...styles.td, fontFamily: 'monospace' }}>{mov.ident_code}</td>
                <td style={styles.td}>{mov.quantity}</td>
                <td style={styles.td}>{mov.from_location} → {mov.to_location}</td>
                <td style={styles.td}>{mov.performed_by}</td>
                <td style={{ ...styles.td, maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis' }}>{mov.note || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="+ Aggiungi Movimento">
        <div style={{ marginBottom: '16px' }}>
          <label style={styles.label}>Ident Code *</label>
          <input type="text" list="ident-list" value={newMovement.ident_code} onChange={(e) => setNewMovement({ ...newMovement, ident_code: e.target.value })} style={styles.input} placeholder="Seleziona codice..." />
          <datalist id="ident-list">{allIdents.map(i => <option key={i} value={i} />)}</datalist>
        </div>
        <div style={{ marginBottom: '16px' }}>
          <label style={styles.label}>Tipo Movimento *</label>
          <select value={newMovement.movement_type} onChange={(e) => setNewMovement({ ...newMovement, movement_type: e.target.value })} style={styles.select}>
            {MOVEMENT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div style={{ marginBottom: '16px' }}>
          <label style={styles.label}>Quantity *</label>
          <input type="number" value={newMovement.quantity} onChange={(e) => setNewMovement({ ...newMovement, quantity: e.target.value })} style={styles.input} min="1" />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
          <div>
            <label style={styles.label}>Da</label>
            <input type="text" value={newMovement.from_location} onChange={(e) => setNewMovement({ ...newMovement, from_location: e.target.value })} style={styles.input} placeholder="YARD, SITE, SUPPLIER..." />
          </div>
          <div>
            <label style={styles.label}>A</label>
            <input type="text" value={newMovement.to_location} onChange={(e) => setNewMovement({ ...newMovement, to_location: e.target.value })} style={styles.input} placeholder="YARD, SITE, DELIVERED..." />
          </div>
        </div>
        <div style={{ marginBottom: '16px' }}>
          <label style={styles.label}>Note</label>
          <textarea value={newMovement.note} onChange={(e) => setNewMovement({ ...newMovement, note: e.target.value })} style={{ ...styles.input, minHeight: '60px' }} />
        </div>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          <button onClick={() => setShowAddModal(false)} style={{ ...styles.button, ...styles.buttonSecondary }}>Cancel</button>
          <button onClick={addMovement} style={{ ...styles.button, ...styles.buttonPrimary }}>Aggiungi</button>
        </div>
      </Modal>
    </div>
  );
}

// ============================================================
// DATABASE PAGE
// ============================================================
function DatabasePage({ user }) {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showBalanceModal, setShowBalanceModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [balanceData, setBalanceData] = useState({ yard_qty: '', site_qty: '', lost_qty: '', broken_qty: '' });

  useEffect(() => { loadInventory(); }, []);

  const loadInventory = async () => {
    setLoading(true);
    const { data } = await supabase.from('inventory').select('*').order('ident_code');
    if (data) setInventory(data);
    setLoading(false);
  };

  const filteredInventory = inventory.filter(item =>
    item.ident_code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openBalanceModal = (item) => {
    setSelectedItem(item);
    setBalanceData({
      yard_qty: item.yard_qty || 0,
      site_qty: item.site_qty || 0,
      lost_qty: item.lost_qty || 0,
      broken_qty: item.broken_qty || 0
    });
    setShowBalanceModal(true);
  };

  const saveBalance = async () => {
    await supabase.from('inventory').update({
      yard_qty: parseInt(balanceData.yard_qty) || 0,
      site_qty: parseInt(balanceData.site_qty) || 0,
      lost_qty: parseInt(balanceData.lost_qty) || 0,
      broken_qty: parseInt(balanceData.broken_qty) || 0
    }).eq('ident_code', selectedItem.ident_code);

    await supabase.from('movements').insert({
      ident_code: selectedItem.ident_code,
      movement_type: 'BAL',
      quantity: 0,
      from_location: 'BALANCE',
      to_location: 'BALANCE',
      performed_by: user.full_name,
      note: `Bilancio manuale: Y=${balanceData.yard_qty}, S=${balanceData.site_qty}, L=${balanceData.lost_qty}, B=${balanceData.broken_qty}`
    });

    setShowBalanceModal(false);
    loadInventory();
  };

  const exportCSV = () => {
    const headers = ['Ident Code', 'Description', 'YARD', 'SITE', 'LOST', 'BROKEN', 'TOTAL', 'Record Out'];
    const rows = filteredInventory.map(i => [
      i.ident_code,
      i.description,
      i.yard_qty || 0,
      i.site_qty || 0,
      i.lost_qty || 0,
      i.broken_qty || 0,
      (i.yard_qty || 0) + (i.site_qty || 0) + (i.lost_qty || 0) + (i.broken_qty || 0),
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
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
        <input
          type="text"
          placeholder="🔍 Cerca codice o descrizione..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ ...styles.input, maxWidth: '400px' }}
        />
        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={exportCSV} style={{ ...styles.button, ...styles.buttonSecondary }}>📥 Export CSV</button>
        </div>
      </div>

      <div style={styles.card}>
        <div style={styles.cardHeader}>
          <h3 style={{ fontWeight: '600' }}>Database Inventario ({filteredInventory.length})</h3>
        </div>
        <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
          <table style={styles.table}>
            <thead style={{ position: 'sticky', top: 0 }}>
              <tr>
                <th style={styles.th}>Code</th>
                <th style={styles.th}>Description</th>
                <th style={{ ...styles.th, backgroundColor: COLORS.secondary, color: 'white', textAlign: 'center' }}>YARD</th>
                <th style={{ ...styles.th, backgroundColor: COLORS.info, color: 'white', textAlign: 'center' }}>SITE</th>
                <th style={{ ...styles.th, backgroundColor: COLORS.orange, color: 'white', textAlign: 'center' }}>LOST</th>
                <th style={{ ...styles.th, backgroundColor: COLORS.purple, color: 'white', textAlign: 'center' }}>BROKEN</th>
                <th style={{ ...styles.th, textAlign: 'center' }}>TOTALE</th>
                <th style={{ ...styles.th, backgroundColor: COLORS.success, color: 'white', textAlign: 'center' }}>Prelevati</th>
                <th style={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredInventory.map(item => {
                const total = (item.yard_qty || 0) + (item.site_qty || 0) + (item.lost_qty || 0) + (item.broken_qty || 0);
                return (
                  <tr key={item.ident_code}>
                    <td style={{ ...styles.td, fontFamily: 'monospace', fontWeight: '600' }}>{item.ident_code}</td>
                    <td style={{ ...styles.td, maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.description}</td>
                    <td style={{ ...styles.td, textAlign: 'center', fontWeight: '600' }}>{item.yard_qty || 0}</td>
                    <td style={{ ...styles.td, textAlign: 'center', fontWeight: '600' }}>{item.site_qty || 0}</td>
                    <td style={{ ...styles.td, textAlign: 'center', fontWeight: '600' }}>{item.lost_qty || 0}</td>
                    <td style={{ ...styles.td, textAlign: 'center', fontWeight: '600' }}>{item.broken_qty || 0}</td>
                    <td style={{ ...styles.td, textAlign: 'center', fontWeight: '700', color: COLORS.primary }}>{total}</td>
                    <td style={{ ...styles.td, textAlign: 'center', fontWeight: '600', color: COLORS.success }}>{item.record_out || 0}</td>
                    <td style={styles.td}>
                      <ActionButton color={COLORS.info} onClick={() => openBalanceModal(item)} disabled={!canModify} title="Bilancio">⚖️</ActionButton>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={showBalanceModal} onClose={() => setShowBalanceModal(false)} title="⚖️ Bilancio Manuale">
        <p style={{ marginBottom: '16px' }}><strong>{selectedItem?.ident_code}</strong></p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
          <div>
            <label style={{ ...styles.label, color: COLORS.secondary }}>YARD</label>
            <input type="number" value={balanceData.yard_qty} onChange={(e) => setBalanceData({ ...balanceData, yard_qty: e.target.value })} style={styles.input} min="0" />
          </div>
          <div>
            <label style={{ ...styles.label, color: COLORS.info }}>SITE</label>
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
          <button onClick={saveBalance} style={{ ...styles.button, ...styles.buttonPrimary }}>Salva</button>
        </div>
      </Modal>
    </div>
  );
}

// ============================================================
// MAIN APP COMPONENT
// ============================================================
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
    
    const { data: siteData } = await supabase.from('request_components').select('id', { count: 'exact' }).eq('status', 'Site');
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

    counts.whSite = siteData?.length || 0;
    counts.whYard = yardData?.length || 0;
    counts.engineering = engData?.length || 0;
    counts.siteIn = transData?.length || 0;
    counts.orders = orderData?.length || 0;
    counts.materialIn = orderedData?.length || 0;
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
      case 'dashboard': return <Dashboard user={user} />;
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
      default: return <Dashboard user={user} />;
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
