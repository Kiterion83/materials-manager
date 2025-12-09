// ============================================================
// MATERIALS MANAGER V25 - VERSION 2
// MAX STREICHER Edition
// ============================================================
// UPDATES V2:
// - Ready OUT as separate section
// - Material In with MIR selection and Yard/Site load
// - MIR redesigned with RK field
// - All delete buttons with double confirmation
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
// CONSTANTS
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
  yellow: '#CA8A04'
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
  ReadyOut: COLORS.success,
  Done: COLORS.gray
};

const REQUEST_TYPES = ['Piping', 'Mechanical', 'TestPack'];
const SUB_CATEGORIES = ['Bulk', 'Erection', 'Support'];
const PRIORITIES = ['Alta', 'Media', 'Bassa'];

// ============================================================
// STYLES
// ============================================================
const styles = {
  card: {
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    marginBottom: '24px',
    overflow: 'hidden'
  },
  cardHeader: {
    padding: '16px 24px',
    borderBottom: '1px solid #e5e7eb',
    fontWeight: '600',
    fontSize: '18px'
  },
  cardHeaderGreen: {
    padding: '16px 24px',
    borderBottom: '1px solid #e5e7eb',
    fontWeight: '600',
    fontSize: '18px',
    backgroundColor: '#D1FAE5',
    color: '#065F46'
  },
  cardHeaderPurple: {
    padding: '16px 24px',
    borderBottom: '1px solid #e5e7eb',
    fontWeight: '600',
    fontSize: '18px',
    backgroundColor: '#F3E8FF',
    color: '#7C3AED'
  },
  table: {
    width: '100%',
    borderCollapse: 'separate',
    borderSpacing: '0'
  },
  th: {
    padding: '12px 16px',
    textAlign: 'left',
    fontSize: '12px',
    fontWeight: '500',
    color: '#6b7280',
    borderBottom: '1px solid #e5e7eb',
    backgroundColor: '#f9fafb'
  },
  td: {
    padding: '12px 16px',
    borderBottom: '1px solid #e5e7eb',
    fontSize: '14px',
    verticalAlign: 'middle'
  },
  btn: {
    padding: '8px 16px',
    borderRadius: '6px',
    border: 'none',
    cursor: 'pointer',
    fontWeight: '500',
    fontSize: '14px',
    transition: 'all 0.2s'
  },
  actionBtn: {
    width: '36px',
    height: '36px',
    borderRadius: '6px',
    border: 'none',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontWeight: 'bold',
    fontSize: '14px',
    marginRight: '4px',
    transition: 'transform 0.2s'
  },
  input: {
    width: '100%',
    padding: '10px 12px',
    borderRadius: '6px',
    border: '1px solid #d1d5db',
    fontSize: '14px',
    boxSizing: 'border-box'
  },
  select: {
    width: '100%',
    padding: '10px 12px',
    borderRadius: '6px',
    border: '1px solid #d1d5db',
    fontSize: '14px',
    backgroundColor: 'white',
    boxSizing: 'border-box'
  },
  label: {
    display: 'block',
    marginBottom: '6px',
    fontWeight: '500',
    fontSize: '14px',
    color: '#374151'
  },
  badge: {
    padding: '4px 12px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: '500',
    color: 'white',
    display: 'inline-block'
  },
  sidebar: {
    width: '260px',
    backgroundColor: COLORS.secondary,
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column'
  },
  navItem: {
    display: 'flex',
    alignItems: 'center',
    padding: '12px 20px',
    color: '#9ca3af',
    cursor: 'pointer',
    transition: 'all 0.2s',
    gap: '12px',
    fontSize: '14px'
  },
  navItemActive: {
    backgroundColor: 'rgba(227, 30, 36, 0.2)',
    color: 'white',
    borderLeft: `4px solid ${COLORS.primary}`
  },
  content: {
    flex: 1,
    padding: '24px',
    backgroundColor: '#f3f4f6',
    overflowY: 'auto'
  },
  modal: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '24px',
    maxWidth: '500px',
    width: '90%',
    maxHeight: '80vh',
    overflow: 'auto'
  }
};

// ============================================================
// UTILITY FUNCTIONS
// ============================================================
const formatRequestNumber = (num, sub) => {
  return `${String(num).padStart(5, '0')}-${sub}`;
};

// ============================================================
// CONFIRM DELETE MODAL
// ============================================================
function ConfirmModal({ title, message, onConfirm, onCancel }) {
  return (
    <div style={styles.modal} onClick={onCancel}>
      <div style={{ ...styles.modalContent, maxWidth: '400px' }} onClick={e => e.stopPropagation()}>
        <h3 style={{ margin: '0 0 16px', fontSize: '18px', color: COLORS.primary }}>⚠️ {title}</h3>
        <p style={{ margin: '0 0 24px', color: '#374151' }}>{message}</p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          <button
            onClick={onCancel}
            style={{ ...styles.btn, backgroundColor: '#e5e7eb', color: '#374151' }}
          >
            Annulla
          </button>
          <button
            onClick={onConfirm}
            style={{ ...styles.btn, backgroundColor: COLORS.primary, color: 'white' }}
          >
            Conferma Eliminazione
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// LOGIN SCREEN COMPONENT
// ============================================================
function LoginScreen({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data, error: dbError } = await supabase
        .from('users')
        .select('*')
        .eq('username', username)
        .eq('password_hash', password)
        .eq('is_active', true)
        .single();

      if (dbError || !data) {
        setError('Invalid username or password');
        setLoading(false);
        return;
      }

      onLogin(data);
    } catch (err) {
      setError('Login error. Please try again.');
      setLoading(false);
    }
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
            width: '80px',
            height: '80px',
            backgroundColor: COLORS.primary,
            borderRadius: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
            color: 'white',
            fontWeight: 'bold',
            fontSize: '24px'
          }}>
            STR
          </div>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: COLORS.secondary, margin: '0 0 8px' }}>
            MAX STREICHER
          </h1>
          <p style={{ color: '#6b7280', margin: 0 }}>Materials Manager</p>
        </div>

        <form onSubmit={handleLogin}>
          {error && (
            <div style={{
              backgroundColor: '#FEE2E2',
              color: '#DC2626',
              padding: '12px',
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
              required
            />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              ...styles.btn,
              width: '100%',
              backgroundColor: COLORS.primary,
              color: 'white',
              padding: '12px',
              fontSize: '16px',
              opacity: loading ? 0.7 : 1
            }}
          >
            {loading ? 'Loading...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
}

// ============================================================
// HISTORY MODAL COMPONENT
// ============================================================
function HistoryModal({ componentId, onClose }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHistory();
  }, [componentId]);

  const loadHistory = async () => {
    const { data } = await supabase
      .from('component_history')
      .select('*')
      .eq('component_id', componentId)
      .order('created_at', { ascending: false });
    
    if (data) setHistory(data);
    setLoading(false);
  };

  return (
    <div style={styles.modal} onClick={onClose}>
      <div style={styles.modalContent} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ margin: 0, fontSize: '18px' }}>📜 Component History</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer' }}>×</button>
        </div>
        
        {loading ? (
          <p>Loading...</p>
        ) : history.length === 0 ? (
          <p style={{ color: '#6b7280' }}>No history available</p>
        ) : (
          <div style={{ maxHeight: '400px', overflow: 'auto' }}>
            {history.map((h, idx) => (
              <div key={h.id} style={{
                padding: '12px',
                backgroundColor: idx % 2 === 0 ? '#f9fafb' : 'white',
                borderRadius: '6px',
                marginBottom: '8px',
                borderLeft: `4px solid ${STATUS_COLORS[h.to_status] || COLORS.gray}`
              }}>
                <div style={{ fontWeight: '500', marginBottom: '4px' }}>{h.action}</div>
                <div style={{ fontSize: '12px', color: '#6b7280' }}>
                  {h.from_status && <span style={{ marginRight: '8px' }}>{h.from_status} → {h.to_status}</span>}
                  <span>{new Date(h.created_at).toLocaleString()}</span>
                </div>
                {h.performed_by_name && (
                  <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
                    By: {h.performed_by_name}
                  </div>
                )}
                {h.note && (
                  <div style={{ fontSize: '12px', color: '#374151', marginTop: '4px', fontStyle: 'italic' }}>
                    "{h.note}"
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================
// SPLIT MODAL COMPONENT
// ============================================================
function SplitModal({ component, page, onClose, onSplit, user }) {
  const [splitQty, setSplitQty] = useState(1);
  const [foundDestination, setFoundDestination] = useState('');
  const [notFoundDestination, setNotFoundDestination] = useState('');

  const getDestinations = () => {
    switch(page) {
      case 'whSite':
        return {
          foundOptions: [{ value: 'ReadyOut', label: 'Ready OUT (To Collect)' }],
          notFoundOptions: [
            { value: 'Yard', label: 'WH Yard' },
            { value: 'Eng', label: 'Engineering' }
          ]
        };
      case 'whYard':
        return {
          foundOptions: [{ value: 'Trans', label: 'Site IN (Transit)' }],
          notFoundOptions: [
            { value: 'Site', label: 'WH Site' },
            { value: 'Eng', label: 'Engineering' }
          ]
        };
      case 'engineering':
        return {
          foundOptions: [
            { value: 'ReadyOut', label: 'Ready OUT (found at Site)' },
            { value: 'Trans', label: 'Site IN (found at Yard)' }
          ],
          notFoundOptions: [{ value: 'Mng', label: 'Management' }]
        };
      default:
        return { foundOptions: [], notFoundOptions: [] };
    }
  };

  const destinations = getDestinations();

  useEffect(() => {
    if (destinations.foundOptions.length > 0) {
      setFoundDestination(destinations.foundOptions[0].value);
    }
    if (destinations.notFoundOptions.length > 0) {
      setNotFoundDestination(destinations.notFoundOptions[0].value);
    }
  }, [page]);

  const handleSplit = () => {
    const foundQty = parseInt(splitQty);
    const notFoundQty = component.quantity - foundQty;
    
    if (foundQty <= 0 || foundQty >= component.quantity) {
      alert('Invalid quantity');
      return;
    }

    onSplit({
      componentId: component.id,
      requestId: component.request_id,
      foundQty,
      notFoundQty,
      foundDestination,
      notFoundDestination,
      originalComponent: component
    });
  };

  const foundQty = parseInt(splitQty) || 0;
  const notFoundQty = component.quantity - foundQty;

  return (
    <div style={styles.modal} onClick={onClose}>
      <div style={{ ...styles.modalContent, maxWidth: '450px' }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ margin: 0, fontSize: '18px' }}>📦 Rilascio Parziale</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer' }}>×</button>
        </div>

        <div style={{ marginBottom: '16px', padding: '12px', backgroundColor: '#FEF3C7', borderRadius: '6px', border: '1px solid #F59E0B' }}>
          <strong>{component.ident_code}</strong>
          <div style={{ color: '#92400E', fontSize: '13px' }}>Totale: {component.quantity}</div>
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={styles.label}>Quantità Trovata</label>
          <input
            type="number"
            min="1"
            max={component.quantity - 1}
            value={splitQty}
            onChange={(e) => setSplitQty(e.target.value)}
            style={styles.input}
          />
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={styles.label}>Trovati ({foundQty} pz) → Destinazione:</label>
          <select
            value={foundDestination}
            onChange={(e) => setFoundDestination(e.target.value)}
            style={styles.select}
          >
            {destinations.foundOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={styles.label}>Non Trovati ({notFoundQty} pz) → Destinazione:</label>
          <select
            value={notFoundDestination}
            onChange={(e) => setNotFoundDestination(e.target.value)}
            style={styles.select}
          >
            {destinations.notFoundOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        <div style={{ 
          marginBottom: '20px', 
          padding: '12px', 
          backgroundColor: '#D1FAE5', 
          borderRadius: '6px',
          fontSize: '13px'
        }}>
          <div style={{ marginBottom: '4px' }}>
            <span style={{ color: COLORS.success }}>●</span> {foundQty} pz → {destinations.foundOptions.find(o => o.value === foundDestination)?.label}
          </div>
          <div>
            <span style={{ color: COLORS.warning }}>●</span> {notFoundQty} pz → {destinations.notFoundOptions.find(o => o.value === notFoundDestination)?.label}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={handleSplit}
            style={{ ...styles.btn, flex: 1, backgroundColor: COLORS.warning, color: 'white' }}
          >
            SPLIT
          </button>
          <button
            onClick={onClose}
            style={{ ...styles.btn, flex: 1, backgroundColor: '#e5e7eb', color: '#374151' }}
          >
            Annulla
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// CHECK MODAL COMPONENT
// ============================================================
function CheckModal({ component, onClose, onSendCheck }) {
  const [sendToSite, setSendToSite] = useState(true);
  const [sendToYard, setSendToYard] = useState(true);
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (!sendToSite && !sendToYard) {
      alert('Seleziona almeno una destinazione');
      return;
    }
    onSendCheck({
      componentId: component.id,
      sendToSite,
      sendToYard,
      message
    });
  };

  return (
    <div style={styles.modal} onClick={onClose}>
      <div style={styles.modalContent} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ margin: 0, fontSize: '18px' }}>🔍 Invia Richiesta Check</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer' }}>×</button>
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={styles.label}>Invia a (seleziona uno o entrambi):</label>
          <div style={{ display: 'flex', gap: '24px', marginTop: '8px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={sendToSite}
                onChange={(e) => setSendToSite(e.target.checked)}
                style={{ width: '18px', height: '18px' }}
              />
              <span>WH Site</span>
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={sendToYard}
                onChange={(e) => setSendToYard(e.target.checked)}
                style={{ width: '18px', height: '18px' }}
              />
              <span>WH Yard</span>
            </label>
          </div>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={styles.label}>Messaggio / Istruzioni</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Verificare posizione, quantità, ecc..."
            style={{ ...styles.input, minHeight: '100px', resize: 'vertical' }}
          />
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={onClose} style={{ ...styles.btn, flex: 1, backgroundColor: '#e5e7eb', color: '#374151' }}>
            Annulla
          </button>
          <button onClick={handleSend} style={{ ...styles.btn, flex: 1, backgroundColor: COLORS.purple, color: 'white' }}>
            Invia Check 🔍
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// MAIN APP COMPONENT
// ============================================================
function App() {
  const [user, setUser] = useState(null);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [badges, setBadges] = useState({});
  const [inventory, setInventory] = useState([]);

  const loadBadges = useCallback(async () => {
    const { data } = await supabase
      .from('request_components')
      .select('status, has_eng_check, eng_check_sent_to');
    
    if (data) {
      const counts = {
        site: data.filter(c => c.status === 'Site' || (c.has_eng_check && c.eng_check_sent_to?.includes('Site'))).length,
        yard: data.filter(c => c.status === 'Yard' || (c.has_eng_check && c.eng_check_sent_to?.includes('Yard'))).length,
        trans: data.filter(c => c.status === 'Trans').length,
        eng: data.filter(c => c.status === 'Eng').length,
        spare: data.filter(c => c.status === 'Spare').length,
        mng: data.filter(c => c.status === 'Mng').length,
        order: data.filter(c => c.status === 'Order').length,
        ordered: data.filter(c => c.status === 'Ordered').length,
        readyOut: data.filter(c => c.status === 'ReadyOut').length,
        toCollect: data.filter(c => c.status === 'ToCollect').length
      };
      setBadges(counts);
    }
  }, []);

  const loadInventory = useCallback(async () => {
    const { data } = await supabase
      .from('project_database')
      .select('ident_code, qty_yard, qty_site');
    if (data) setInventory(data);
  }, []);

  useEffect(() => {
    if (user) {
      loadBadges();
      loadInventory();
      const interval = setInterval(() => {
        loadBadges();
        loadInventory();
      }, 30000);
      return () => clearInterval(interval);
    }
  }, [user, loadBadges, loadInventory]);

  const getAvailable = (identCode, location) => {
    const item = inventory.find(i => i.ident_code === identCode);
    if (!item) return 0;
    return location === 'Yard' ? (item.qty_yard || 0) : (item.qty_site || 0);
  };

  const logHistory = async (componentId, action, fromStatus, toStatus, note = '') => {
    await supabase.from('component_history').insert({
      component_id: componentId,
      action,
      from_status: fromStatus,
      to_status: toStatus,
      performed_by_user_id: user?.id,
      performed_by_name: user?.full_name,
      note
    });
  };

  const handleLogin = (userData) => setUser(userData);
  const handleLogout = () => {
    setUser(null);
    setCurrentPage('dashboard');
  };

  const hasPermission = (page, level = 'read') => {
    if (!user) return false;
    if (user.role === 'admin') return true;
    const perm = user[`perm_${page}`];
    if (level === 'read') return perm === 'read' || perm === 'modify';
    return perm === 'modify';
  };

  if (!user) return <LoginScreen onLogin={handleLogin} />;

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊', perm: 'dashboard' },
    { id: 'requests', label: 'Requests', icon: '📋', perm: 'requests' },
    { id: 'mir', label: 'MIR', icon: '📦', perm: 'mir' },
    { id: 'materialIn', label: 'Material In', icon: '📥', perm: 'material_in', badge: badges.ordered },
    { id: 'siteIn', label: 'Site IN', icon: '🏗️', perm: 'site_in', badge: badges.trans },
    { id: 'whSite', label: 'WH Site', icon: '🏭', perm: 'wh_site', badge: badges.site },
    { id: 'whYard', label: 'WH Yard', icon: '🏢', perm: 'wh_yard', badge: badges.yard },
    { id: 'engineering', label: 'Engineering', icon: '⚙️', perm: 'engineering', badge: badges.eng },
    { id: 'readyOut', label: 'Ready OUT', icon: '✅', perm: 'wh_site', badge: badges.readyOut },
    { id: 'spareParts', label: 'Spare Parts', icon: '🔧', perm: 'spare_parts', badge: badges.spare },
    { id: 'management', label: 'Management', icon: '💼', perm: 'management', badge: badges.mng },
    { id: 'orders', label: 'Orders', icon: '🛒', perm: 'orders', badge: badges.order },
    { id: 'toCollect', label: 'To Collect', icon: '🎯', perm: 'requests', badge: badges.toCollect },
    { id: 'log', label: 'Log', icon: '📜', perm: 'log' },
    { id: 'database', label: 'Database', icon: '💾', perm: 'database' }
  ];

  const renderPage = () => {
    switch(currentPage) {
      case 'dashboard': return <DashboardPage user={user} />;
      case 'requests': return <RequestsPage user={user} hasPermission={hasPermission} loadBadges={loadBadges} />;
      case 'mir': return <MIRPage user={user} hasPermission={hasPermission} loadBadges={loadBadges} logHistory={logHistory} />;
      case 'materialIn': return <MaterialInPage user={user} hasPermission={hasPermission} loadBadges={loadBadges} logHistory={logHistory} />;
      case 'whSite': return <WHSitePage user={user} hasPermission={hasPermission} loadBadges={loadBadges} getAvailable={getAvailable} logHistory={logHistory} />;
      case 'whYard': return <WHYardPage user={user} hasPermission={hasPermission} loadBadges={loadBadges} getAvailable={getAvailable} logHistory={logHistory} />;
      case 'engineering': return <EngineeringPage user={user} hasPermission={hasPermission} loadBadges={loadBadges} logHistory={logHistory} />;
      case 'readyOut': return <ReadyOutPage user={user} hasPermission={hasPermission} loadBadges={loadBadges} logHistory={logHistory} />;
      case 'siteIn': return <SiteInPage user={user} hasPermission={hasPermission} loadBadges={loadBadges} logHistory={logHistory} />;
      case 'spareParts': return <SparePartsPage user={user} hasPermission={hasPermission} loadBadges={loadBadges} logHistory={logHistory} />;
      case 'management': return <ManagementPage user={user} hasPermission={hasPermission} loadBadges={loadBadges} logHistory={logHistory} />;
      case 'orders': return <OrdersPage user={user} hasPermission={hasPermission} loadBadges={loadBadges} logHistory={logHistory} />;
      case 'toCollect': return <ToCollectPage user={user} hasPermission={hasPermission} loadBadges={loadBadges} logHistory={logHistory} />;
      case 'log': return <LogPage />;
      case 'database': return <DatabasePage />;
      default: return <DashboardPage user={user} />;
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <div style={{ ...styles.sidebar, width: sidebarCollapsed ? '70px' : '260px', transition: 'width 0.3s' }}>
        <div style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '12px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{
            width: '40px', height: '40px', backgroundColor: COLORS.primary, borderRadius: '8px',
            display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', fontSize: '14px', flexShrink: 0
          }}>STR</div>
          {!sidebarCollapsed && (
            <div>
              <div style={{ color: 'white', fontWeight: 'bold', fontSize: '14px' }}>MAX STREICHER</div>
              <div style={{ color: '#9ca3af', fontSize: '12px' }}>Materials Manager</div>
            </div>
          )}
          <button onClick={() => setSidebarCollapsed(!sidebarCollapsed)} style={{ marginLeft: 'auto', background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer', fontSize: '18px' }}>←</button>
        </div>

        <nav style={{ flex: 1, padding: '12px 0', overflowY: 'auto' }}>
          {navItems.map(item => {
            if (!hasPermission(item.perm)) return null;
            const isActive = currentPage === item.id;
            return (
              <div
                key={item.id}
                onClick={() => setCurrentPage(item.id)}
                style={{
                  ...styles.navItem,
                  ...(isActive ? styles.navItemActive : {}),
                  paddingLeft: isActive ? '16px' : '20px',
                  justifyContent: sidebarCollapsed ? 'center' : 'flex-start'
                }}
              >
                <span style={{ fontSize: '18px' }}>{item.icon}</span>
                {!sidebarCollapsed && (
                  <>
                    <span style={{ flex: 1 }}>{item.label}</span>
                    {item.badge > 0 && (
                      <span style={{ backgroundColor: COLORS.primary, color: 'white', padding: '2px 8px', borderRadius: '10px', fontSize: '12px', fontWeight: 'bold' }}>
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </div>
            );
          })}
        </nav>

        <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', padding: '12px' }}>
          <div onClick={handleLogout} style={{ ...styles.navItem, justifyContent: sidebarCollapsed ? 'center' : 'flex-start' }}>
            <span style={{ fontSize: '18px' }}>🚪</span>
            {!sidebarCollapsed && <span>Logout</span>}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <header style={{ backgroundColor: 'white', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <h1 style={{ margin: 0, fontSize: '20px', fontWeight: '600', color: COLORS.secondary }}>
            {navItems.find(n => n.id === currentPage)?.label || 'Dashboard'}
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span style={{ color: '#6b7280' }}>👤 {user.full_name}</span>
            <button onClick={handleLogout} style={{ ...styles.btn, backgroundColor: '#f3f4f6', color: '#374151' }}>Logout</button>
          </div>
        </header>
        <div style={styles.content}>{renderPage()}</div>
      </div>
    </div>
  );
}

// ============================================================
// DASHBOARD PAGE
// ============================================================
function DashboardPage({ user }) {
  const [stats, setStats] = useState({ totalYard: 0, totalSite: 0, totalLost: 0, totalBroken: 0, activeRequests: 0, pendingEng: 0, toOrder: 0 });

  useEffect(() => { loadStats(); }, []);

  const loadStats = async () => {
    const { data: invData } = await supabase.from('project_database').select('qty_yard, qty_site, qty_lost, qty_broken');
    if (invData) {
      const totals = invData.reduce((acc, item) => ({
        yard: acc.yard + (item.qty_yard || 0), site: acc.site + (item.qty_site || 0),
        lost: acc.lost + (item.qty_lost || 0), broken: acc.broken + (item.qty_broken || 0)
      }), { yard: 0, site: 0, lost: 0, broken: 0 });
      setStats(prev => ({ ...prev, totalYard: totals.yard, totalSite: totals.site, totalLost: totals.lost, totalBroken: totals.broken }));
    }
    const { data: compData } = await supabase.from('request_components').select('status');
    if (compData) {
      setStats(prev => ({
        ...prev,
        activeRequests: compData.filter(c => !['Done', 'ToCollect', 'ReadyOut'].includes(c.status)).length,
        pendingEng: compData.filter(c => c.status === 'Eng').length,
        toOrder: compData.filter(c => c.status === 'Order').length
      }));
    }
  };

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
        <div style={{ padding: '24px', borderRadius: '8px', backgroundColor: COLORS.secondary, color: 'white' }}>
          <h3 style={{ margin: '0 0 8px', fontSize: '16px', opacity: 0.9 }}>YARD</h3>
          <p style={{ margin: 0, fontSize: '32px', fontWeight: 'bold' }}>{stats.totalYard}</p>
        </div>
        <div style={{ padding: '24px', borderRadius: '8px', backgroundColor: COLORS.info, color: 'white' }}>
          <h3 style={{ margin: '0 0 8px', fontSize: '16px', opacity: 0.9 }}>SITE</h3>
          <p style={{ margin: 0, fontSize: '32px', fontWeight: 'bold' }}>{stats.totalSite}</p>
        </div>
        <div style={{ padding: '24px', borderRadius: '8px', backgroundColor: COLORS.orange, color: 'white' }}>
          <h3 style={{ margin: '0 0 8px', fontSize: '16px', opacity: 0.9 }}>LOST</h3>
          <p style={{ margin: 0, fontSize: '32px', fontWeight: 'bold' }}>{stats.totalLost}</p>
        </div>
        <div style={{ padding: '24px', borderRadius: '8px', backgroundColor: COLORS.purple, color: 'white' }}>
          <h3 style={{ margin: '0 0 8px', fontSize: '16px', opacity: 0.9 }}>BROKEN</h3>
          <p style={{ margin: 0, fontSize: '32px', fontWeight: 'bold' }}>{stats.totalBroken}</p>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
        <div style={styles.card}><div style={{ padding: '24px' }}>
          <h3 style={{ margin: '0 0 8px', fontSize: '14px', color: '#6b7280' }}>Active Requests</h3>
          <p style={{ margin: 0, fontSize: '32px', fontWeight: 'bold', color: COLORS.primary }}>{stats.activeRequests}</p>
        </div></div>
        <div style={styles.card}><div style={{ padding: '24px' }}>
          <h3 style={{ margin: '0 0 8px', fontSize: '14px', color: '#6b7280' }}>Pending Engineering</h3>
          <p style={{ margin: 0, fontSize: '32px', fontWeight: 'bold', color: COLORS.purple }}>{stats.pendingEng}</p>
        </div></div>
        <div style={styles.card}><div style={{ padding: '24px' }}>
          <h3 style={{ margin: '0 0 8px', fontSize: '14px', color: '#6b7280' }}>To Order</h3>
          <p style={{ margin: 0, fontSize: '32px', fontWeight: 'bold', color: COLORS.warning }}>{stats.toOrder}</p>
        </div></div>
      </div>
    </div>
  );
}

// ============================================================
// MIR PAGE - REDESIGNED
// ============================================================
function MIRPage({ user, hasPermission, loadBadges, logHistory }) {
  const [mirs, setMirs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [mirNumber, setMirNumber] = useState('');
  const [rkNumber, setRkNumber] = useState('');
  const [forecast, setForecast] = useState('');
  const [priority, setPriority] = useState('Media');

  const canModify = hasPermission('mir', 'modify');

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    setLoading(true);
    const { data } = await supabase.from('mirs').select('*').order('created_at', { ascending: false });
    if (data) setMirs(data);
    setLoading(false);
  };

  const handleCreate = async () => {
    if (!mirNumber || !rkNumber || !forecast) {
      alert('Compila tutti i campi obbligatori');
      return;
    }

    await supabase.from('mirs').insert({
      mir_number: mirNumber,
      rk_number: rkNumber,
      forecast_date: forecast,
      priority: priority,
      status: 'Pending',
      created_by: user.id
    });

    setMirNumber('');
    setRkNumber('');
    setForecast('');
    setPriority('Media');
    setShowForm(false);
    loadData();
  };

  const handleClose = async (mir) => {
    await supabase.from('mirs').update({ status: 'Closed' }).eq('id', mir.id);
    loadData();
  };

  const handleReopen = async (mir) => {
    await supabase.from('mirs').update({ status: 'Pending' }).eq('id', mir.id);
    loadData();
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      {/* Form Section */}
      <div style={{ ...styles.card, border: `2px solid ${COLORS.purple}` }}>
        <div style={styles.cardHeaderPurple}>
          <span style={{ cursor: 'pointer' }} onClick={() => setShowForm(!showForm)}>
            {showForm ? '−' : '+'} Nuovo MIR
          </span>
        </div>
        {showForm && (
          <div style={{ padding: '20px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label style={styles.label}>MIR *</label>
                <input
                  type="text"
                  value={mirNumber}
                  onChange={(e) => setMirNumber(e.target.value)}
                  style={styles.input}
                  placeholder="Es: MRS2145"
                />
              </div>
              <div>
                <label style={styles.label}>RK *</label>
                <input
                  type="text"
                  value={rkNumber}
                  onChange={(e) => setRkNumber(e.target.value)}
                  style={styles.input}
                  placeholder="Es: RK0020_1123"
                />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label style={styles.label}>Forecast *</label>
                <input
                  type="date"
                  value={forecast}
                  onChange={(e) => setForecast(e.target.value)}
                  style={styles.input}
                />
              </div>
              <div>
                <label style={styles.label}>Priorità</label>
                <select value={priority} onChange={(e) => setPriority(e.target.value)} style={styles.select}>
                  {PRIORITIES.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
            </div>
            <button
              onClick={handleCreate}
              disabled={!canModify}
              style={{ ...styles.btn, backgroundColor: COLORS.success, color: 'white' }}
            >
              + CREA MIR
            </button>
          </div>
        )}
      </div>

      {/* MIR List */}
      <div style={styles.card}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>MIR</th>
              <th style={styles.th}>RK</th>
              <th style={styles.th}>Data</th>
              <th style={styles.th}>Forecast</th>
              <th style={styles.th}>Pri.</th>
              <th style={styles.th}>Stato</th>
              <th style={styles.th}>Az.</th>
            </tr>
          </thead>
          <tbody>
            {mirs.length === 0 ? (
              <tr><td colSpan="7" style={{ ...styles.td, textAlign: 'center', color: '#6b7280' }}>Nessun MIR</td></tr>
            ) : (
              mirs.map(mir => (
                <tr key={mir.id}>
                  <td style={{ ...styles.td, fontWeight: '600' }}>{mir.mir_number}</td>
                  <td style={styles.td}>{mir.rk_number}</td>
                  <td style={styles.td}>{new Date(mir.created_at).toLocaleDateString()}</td>
                  <td style={{ ...styles.td, color: new Date(mir.forecast_date) < new Date() ? COLORS.primary : COLORS.success }}>
                    {mir.forecast_date}
                  </td>
                  <td style={styles.td}>
                    <span style={{ 
                      color: mir.priority === 'Alta' ? COLORS.primary : mir.priority === 'Media' ? COLORS.warning : COLORS.success 
                    }}>
                      {mir.priority}
                    </span>
                  </td>
                  <td style={styles.td}>
                    <span style={{ 
                      ...styles.badge, 
                      backgroundColor: mir.status === 'Pending' ? COLORS.warning : COLORS.success 
                    }}>
                      {mir.status}
                    </span>
                  </td>
                  <td style={styles.td}>
                    {canModify && (
                      mir.status === 'Pending' ? (
                        <button
                          onClick={() => handleClose(mir)}
                          style={{ ...styles.actionBtn, backgroundColor: COLORS.success }}
                          title="Chiudi MIR"
                        >✓</button>
                      ) : (
                        <button
                          onClick={() => handleReopen(mir)}
                          style={{ ...styles.actionBtn, backgroundColor: COLORS.gray }}
                          title="Riapri MIR"
                        >↺</button>
                      )
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ============================================================
// MATERIAL IN PAGE - REDESIGNED
// ============================================================
function MaterialInPage({ user, hasPermission, loadBadges, logHistory }) {
  const [mirs, setMirs] = useState([]);
  const [selectedMir, setSelectedMir] = useState('');
  const [manualMode, setManualMode] = useState(true);
  const [identOptions, setIdentOptions] = useState([]);
  const [selectedCode, setSelectedCode] = useState('');
  const [quantity, setQuantity] = useState('');
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(true);
  const [orderedItems, setOrderedItems] = useState([]);

  const canModify = hasPermission('material_in', 'modify');

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    setLoading(true);
    
    // Load MIRs
    const { data: mirData } = await supabase.from('mirs').select('*').eq('status', 'Pending');
    if (mirData) setMirs(mirData);

    // Load ident codes
    const { data: identData } = await supabase.from('project_database').select('ident_code, description');
    if (identData) setIdentOptions(identData);

    // Load ordered items waiting
    const { data: orderedData } = await supabase
      .from('request_components')
      .select(`*, requests (request_number, sub_number)`)
      .eq('status', 'Ordered')
      .order('created_at', { ascending: false });
    if (orderedData) setOrderedItems(orderedData);

    setLoading(false);
  };

  const handleLoadToWarehouse = async (destination) => {
    if (!selectedCode || !quantity || parseInt(quantity) <= 0) {
      alert('Seleziona un codice e inserisci una quantità valida');
      return;
    }

    const qty = parseInt(quantity);

    // Update inventory
    if (destination === 'Yard') {
      await supabase.rpc('increment_yard_qty', { p_ident_code: selectedCode, p_qty: qty });
    } else {
      await supabase.rpc('increment_site_qty', { p_ident_code: selectedCode, p_qty: qty });
    }

    // Log movement
    await supabase.from('movements').insert({
      movement_type: 'IN',
      ident_code: selectedCode,
      quantity: qty,
      from_location: 'SUPPLIER',
      to_location: destination.toUpperCase(),
      note: note || (selectedMir ? `MIR: ${mirs.find(m => m.id === selectedMir)?.mir_number}` : 'Manual load'),
      performed_by: user.full_name
    });

    alert(`✅ ${qty} pezzi caricati in ${destination}`);
    setSelectedCode('');
    setQuantity('');
    setNote('');
    loadData();
    loadBadges();
  };

  const handleReceiveOrdered = async (component, destination) => {
    const qty = component.quantity;

    // Update inventory
    if (destination === 'Yard') {
      await supabase.rpc('increment_yard_qty', { p_ident_code: component.ident_code, p_qty: qty });
    } else {
      await supabase.rpc('increment_site_qty', { p_ident_code: component.ident_code, p_qty: qty });
    }

    // Update component status
    await supabase.from('request_components').update({ 
      status: destination === 'Yard' ? 'Trans' : 'Site',
      current_location: destination
    }).eq('id', component.id);

    await logHistory(component.id, `Received from order to ${destination}`, 'Ordered', destination === 'Yard' ? 'Trans' : 'Site');
    
    loadData();
    loadBadges();
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      {/* Manual Load Section */}
      <div style={{ ...styles.card, border: '2px solid #10B981' }}>
        <div style={{ ...styles.cardHeader, backgroundColor: '#D1FAE5', color: '#065F46' }}>
          📦 Carico {manualMode ? 'Manuale' : 'da MIR'}
        </div>
        <div style={{ padding: '20px' }}>
          {/* Mode Selection */}
          <div style={{ marginBottom: '16px' }}>
            <select
              value={manualMode ? 'manual' : 'mir'}
              onChange={(e) => setManualMode(e.target.value === 'manual')}
              style={styles.select}
            >
              <option value="manual">-- Manuale --</option>
              <option value="mir">-- Da MIR --</option>
            </select>
          </div>

          {!manualMode && (
            <div style={{ marginBottom: '16px' }}>
              <label style={styles.label}>Seleziona MIR</label>
              <select
                value={selectedMir}
                onChange={(e) => setSelectedMir(e.target.value)}
                style={styles.select}
              >
                <option value="">-- Seleziona MIR --</option>
                {mirs.map(m => (
                  <option key={m.id} value={m.id}>{m.mir_number} - {m.rk_number}</option>
                ))}
              </select>
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '3fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <div>
              <label style={styles.label}>Codice</label>
              <select
                value={selectedCode}
                onChange={(e) => setSelectedCode(e.target.value)}
                style={styles.select}
              >
                <option value="">--Code--</option>
                {identOptions.map(opt => (
                  <option key={opt.ident_code} value={opt.ident_code}>
                    {opt.ident_code} - {opt.description}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label style={styles.label}>Qtà</label>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                style={styles.input}
                placeholder="Qtà"
              />
            </div>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              style={styles.input}
              placeholder="Nota (opzionale)"
            />
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={() => handleLoadToWarehouse('Yard')}
              disabled={!canModify}
              style={{ ...styles.btn, backgroundColor: COLORS.secondary, color: 'white' }}
            >
              + CARICA YARD
            </button>
            <button
              onClick={() => handleLoadToWarehouse('Site')}
              disabled={!canModify}
              style={{ ...styles.btn, backgroundColor: COLORS.info, color: 'white' }}
            >
              + CARICA SITE
            </button>
          </div>
        </div>
      </div>

      {/* Ordered Items Waiting */}
      <div style={styles.card}>
        <div style={styles.cardHeader}>Material In - Ordered Items</div>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Request #</th>
              <th style={styles.th}>Code</th>
              <th style={styles.th}>Description</th>
              <th style={styles.th}>Qty</th>
              <th style={styles.th}>Expected</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orderedItems.length === 0 ? (
              <tr><td colSpan="6" style={{ ...styles.td, textAlign: 'center', color: '#6b7280' }}>No ordered materials waiting</td></tr>
            ) : (
              orderedItems.map(comp => (
                <tr key={comp.id}>
                  <td style={{ ...styles.td, fontFamily: 'monospace', fontWeight: '600' }}>
                    {formatRequestNumber(comp.requests?.request_number, comp.requests?.sub_number)}
                  </td>
                  <td style={{ ...styles.td, fontFamily: 'monospace' }}>{comp.ident_code}</td>
                  <td style={styles.td}>{comp.description}</td>
                  <td style={styles.td}>{comp.quantity}</td>
                  <td style={styles.td}>{comp.order_date || '-'}</td>
                  <td style={styles.td}>
                    {canModify && (
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          onClick={() => handleReceiveOrdered(comp, 'Yard')}
                          style={{ ...styles.btn, backgroundColor: COLORS.secondary, color: 'white', padding: '6px 12px', fontSize: '12px' }}
                        >
                          → Yard
                        </button>
                        <button
                          onClick={() => handleReceiveOrdered(comp, 'Site')}
                          style={{ ...styles.btn, backgroundColor: COLORS.info, color: 'white', padding: '6px 12px', fontSize: '12px' }}
                        >
                          → Site
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ============================================================
// READY OUT PAGE - NEW
// ============================================================
function ReadyOutPage({ user, hasPermission, loadBadges, logHistory }) {
  const [components, setComponents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirmDelete, setConfirmDelete] = useState(null);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('request_components')
      .select(`*, requests (request_number, sub_number, requester_user_id)`)
      .eq('status', 'ReadyOut')
      .order('created_at', { ascending: false });
    if (data) setComponents(data);
    setLoading(false);
  };

  const handleCollected = async (component) => {
    // Decrement site inventory (material is leaving)
    await supabase.rpc('decrement_site_qty', { p_ident_code: component.ident_code, p_qty: component.quantity });

    await supabase.from('request_components').update({ status: 'Done' }).eq('id', component.id);
    await logHistory(component.id, 'Collected by requester', 'ReadyOut', 'Done', `Collected by ${user.full_name}`);
    
    // Log movement
    await supabase.from('movements').insert({
      movement_type: 'OUT',
      ident_code: component.ident_code,
      quantity: component.quantity,
      from_location: 'SITE',
      to_location: 'DELIVERED',
      note: `Request ${formatRequestNumber(component.requests?.request_number, component.requests?.sub_number)}`,
      performed_by: user.full_name
    });

    loadData();
    loadBadges();
  };

  const handleReturn = async (component) => {
    await supabase.from('request_components').update({ status: 'Site' }).eq('id', component.id);
    await logHistory(component.id, 'Returned to WH Site', 'ReadyOut', 'Site');
    loadData();
    loadBadges();
  };

  const handleDelete = async (component) => {
    await supabase.from('request_components').delete().eq('id', component.id);
    await logHistory(component.id, 'Deleted from Ready OUT', 'ReadyOut', 'Deleted');
    setConfirmDelete(null);
    loadData();
    loadBadges();
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <div style={{ ...styles.card, border: '2px solid #10B981' }}>
        <div style={styles.cardHeaderGreen}>Ready OUT - To Collect</div>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Request #</th>
              <th style={styles.th}>Code</th>
              <th style={styles.th}>Description</th>
              <th style={styles.th}>Qty</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {components.length === 0 ? (
              <tr><td colSpan="5" style={{ ...styles.td, textAlign: 'center', color: '#6b7280' }}>No items ready for collection</td></tr>
            ) : (
              components.map(comp => {
                const isRequester = comp.requests?.requester_user_id === user.id || user.role === 'admin';
                return (
                  <tr key={comp.id}>
                    <td style={{ ...styles.td, fontFamily: 'monospace', fontWeight: '600' }}>
                      {formatRequestNumber(comp.requests?.request_number, comp.requests?.sub_number)}
                    </td>
                    <td style={{ ...styles.td, fontFamily: 'monospace' }}>{comp.ident_code}</td>
                    <td style={styles.td}>{comp.description}</td>
                    <td style={styles.td}>{comp.quantity}</td>
                    <td style={styles.td}>
                      <div style={{ display: 'flex', gap: '4px' }}>
                        {isRequester ? (
                          <button
                            onClick={() => handleCollected(comp)}
                            style={{ ...styles.actionBtn, backgroundColor: COLORS.success }}
                            title="Ritirato"
                          >📤</button>
                        ) : (
                          <button
                            style={{ ...styles.actionBtn, backgroundColor: '#9CA3AF', cursor: 'not-allowed' }}
                            title="Solo il richiedente può ritirare"
                            disabled
                          >📤</button>
                        )}
                        <button
                          onClick={() => handleReturn(comp)}
                          style={{ ...styles.actionBtn, backgroundColor: COLORS.gray }}
                          title="Restituisci a WH Site"
                        >↩</button>
                        <button
                          onClick={() => setConfirmDelete(comp)}
                          style={{ ...styles.actionBtn, backgroundColor: COLORS.primary }}
                          title="Elimina"
                        >🗑️</button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {confirmDelete && (
        <ConfirmModal
          title="Conferma Eliminazione"
          message={`Sei sicuro di voler eliminare ${confirmDelete.ident_code} dalla lista Ready OUT?`}
          onConfirm={() => handleDelete(confirmDelete)}
          onCancel={() => setConfirmDelete(null)}
        />
      )}
    </div>
  );
}

// ============================================================
// WH SITE PAGE
// ============================================================
function WHSitePage({ user, hasPermission, loadBadges, getAvailable, logHistory }) {
  const [components, setComponents] = useState([]);
  const [checkRequests, setCheckRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [splitModal, setSplitModal] = useState(null);
  const [historyModal, setHistoryModal] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const canModify = hasPermission('wh_site', 'modify');

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    setLoading(true);
    const { data: compData } = await supabase
      .from('request_components')
      .select(`*, requests (request_number, sub_number, sub_category)`)
      .eq('status', 'Site')
      .order('created_at', { ascending: false });
    if (compData) setComponents(compData);

    const { data: checkData } = await supabase
      .from('request_components')
      .select(`*, requests (request_number, sub_number)`)
      .eq('has_eng_check', true)
      .like('eng_check_sent_to', '%Site%')
      .is('eng_check_site_response', null)
      .order('created_at', { ascending: false });
    if (checkData) setCheckRequests(checkData);
    setLoading(false);
  };

  const handleAction = async (component, action) => {
    let newStatus = '';
    let note = '';

    switch(action) {
      case 'ready':
        newStatus = 'ReadyOut';
        note = 'Ready for collection';
        break;
      case 'toYard':
        newStatus = 'Yard';
        note = 'Sent to Yard for search';
        break;
      case 'toEng':
        newStatus = 'Eng';
        note = 'Sent to Engineering';
        break;
      default: return;
    }

    await supabase.from('request_components').update({ status: newStatus }).eq('id', component.id);
    await logHistory(component.id, `Status changed to ${newStatus}`, component.status, newStatus, note);
    loadData();
    loadBadges();
  };

  const handleDelete = async (component) => {
    await supabase.from('request_components').delete().eq('id', component.id);
    await logHistory(component.id, 'Deleted', component.status, 'Deleted');
    setConfirmDelete(null);
    loadData();
    loadBadges();
  };

  const handleCheckResponse = async (component, found) => {
    await supabase.from('request_components').update({ eng_check_site_response: found ? 'Found' : 'NotFound' }).eq('id', component.id);
    await logHistory(component.id, `Site check response: ${found ? 'Found' : 'Not Found'}`, component.status, component.status);
    loadData();
  };

  const handleSplit = async (splitData) => {
    const { componentId, requestId, foundQty, notFoundQty, foundDestination, notFoundDestination, originalComponent } = splitData;

    await supabase.from('request_components').update({ quantity: foundQty, status: foundDestination }).eq('id', componentId);
    await logHistory(componentId, `Split: ${foundQty} pcs to ${foundDestination}`, originalComponent.status, foundDestination);

    const { data: reqData } = await supabase.from('requests').select('request_number, sub_number').eq('id', requestId).single();
    const { data: maxSubData } = await supabase.from('requests').select('sub_number').eq('request_number', reqData.request_number).order('sub_number', { ascending: false }).limit(1).single();
    const newSubNumber = (maxSubData?.sub_number || 0) + 1;

    const { data: newRequest } = await supabase.from('requests').insert({
      request_number: reqData.request_number,
      sub_number: newSubNumber,
      requester_user_id: user.id,
      request_type: 'Piping',
      sub_category: originalComponent.requests?.sub_category
    }).select().single();

    const { data: newComp } = await supabase.from('request_components').insert({
      request_id: newRequest.id,
      ident_code: originalComponent.ident_code,
      tag: originalComponent.tag,
      description: originalComponent.description,
      quantity: notFoundQty,
      status: notFoundDestination
    }).select().single();

    await logHistory(newComp.id, `Split from ${formatRequestNumber(reqData.request_number, reqData.sub_number)}: ${notFoundQty} pcs`, null, notFoundDestination);
    setSplitModal(null);
    loadData();
    loadBadges();
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      {/* Check Requests */}
      {checkRequests.length > 0 && (
        <div style={{ ...styles.card, marginBottom: '24px', border: `2px solid ${COLORS.purple}` }}>
          <div style={styles.cardHeaderPurple}>🔍 Check Requests from Engineering</div>
          <div style={{ padding: '16px' }}>
            {checkRequests.map(comp => (
              <div key={comp.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', backgroundColor: '#FAFAFA', borderRadius: '6px', marginBottom: '8px' }}>
                <div>
                  <strong>{formatRequestNumber(comp.requests?.request_number, comp.requests?.sub_number)}</strong>
                  <span style={{ marginLeft: '12px' }}>{comp.ident_code}</span>
                  <span style={{ marginLeft: '12px', color: '#6b7280' }}>Qty: {comp.quantity}</span>
                  {comp.eng_check_message && <div style={{ fontSize: '12px', color: COLORS.purple, marginTop: '4px' }}>📝 {comp.eng_check_message}</div>}
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button onClick={() => handleCheckResponse(comp, true)} style={{ ...styles.actionBtn, backgroundColor: COLORS.success }} title="Found">✓</button>
                  <button onClick={() => handleCheckResponse(comp, false)} style={{ ...styles.actionBtn, backgroundColor: COLORS.primary }} title="Not Found">✗</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Table */}
      <div style={styles.card}>
        <div style={styles.cardHeader}>Warehouse Site - Components</div>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Request #</th>
              <th style={styles.th}>Code</th>
              <th style={styles.th}>Description</th>
              <th style={styles.th}>Qty</th>
              <th style={styles.th}>Available</th>
              <th style={styles.th}>Category</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {components.length === 0 ? (
              <tr><td colSpan="7" style={{ ...styles.td, textAlign: 'center', color: '#6b7280' }}>No components in Site</td></tr>
            ) : (
              components.map(comp => {
                const available = getAvailable(comp.ident_code, 'Site');
                const hasEnough = available >= comp.quantity;
                return (
                  <tr key={comp.id}>
                    <td style={{ ...styles.td, fontFamily: 'monospace', fontWeight: '600' }}>{formatRequestNumber(comp.requests?.request_number, comp.requests?.sub_number)}</td>
                    <td style={{ ...styles.td, fontFamily: 'monospace' }}>{comp.ident_code}</td>
                    <td style={styles.td}>{comp.description}</td>
                    <td style={styles.td}>{comp.quantity}</td>
                    <td style={{ ...styles.td, color: hasEnough ? COLORS.success : COLORS.primary, fontWeight: '600' }}>{available}</td>
                    <td style={styles.td}>{comp.requests?.sub_category || '-'}</td>
                    <td style={styles.td}>
                      <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                        <button onClick={() => setHistoryModal(comp.id)} style={{ ...styles.actionBtn, backgroundColor: '#6b7280', fontSize: '12px' }} title="History">ℹ️</button>
                        {canModify && (
                          <>
                            <button onClick={() => handleAction(comp, 'ready')} style={{ ...styles.actionBtn, backgroundColor: hasEnough ? COLORS.success : '#9CA3AF' }} title="Ready OUT" disabled={!hasEnough}>✓</button>
                            <button onClick={() => setSplitModal(comp)} style={{ ...styles.actionBtn, backgroundColor: COLORS.warning }} title="Split">PT</button>
                            <button onClick={() => handleAction(comp, 'toYard')} style={{ ...styles.actionBtn, backgroundColor: COLORS.secondary }} title="To Yard">Y</button>
                            <button onClick={() => handleAction(comp, 'toEng')} style={{ ...styles.actionBtn, backgroundColor: COLORS.purple }} title="To Engineering">UT</button>
                            <button onClick={() => setConfirmDelete(comp)} style={{ ...styles.actionBtn, backgroundColor: COLORS.primary }} title="Delete">🗑️</button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {splitModal && <SplitModal component={splitModal} page="whSite" onClose={() => setSplitModal(null)} onSplit={handleSplit} user={user} />}
      {historyModal && <HistoryModal componentId={historyModal} onClose={() => setHistoryModal(null)} />}
      {confirmDelete && <ConfirmModal title="Conferma Eliminazione" message={`Eliminare ${confirmDelete.ident_code}?`} onConfirm={() => handleDelete(confirmDelete)} onCancel={() => setConfirmDelete(null)} />}
    </div>
  );
}

// ============================================================
// WH YARD PAGE
// ============================================================
function WHYardPage({ user, hasPermission, loadBadges, getAvailable, logHistory }) {
  const [components, setComponents] = useState([]);
  const [checkRequests, setCheckRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [splitModal, setSplitModal] = useState(null);
  const [historyModal, setHistoryModal] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const canModify = hasPermission('wh_yard', 'modify');

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    setLoading(true);
    const { data: compData } = await supabase.from('request_components').select(`*, requests (request_number, sub_number, sub_category)`).eq('status', 'Yard').order('created_at', { ascending: false });
    if (compData) setComponents(compData);

    const { data: checkData } = await supabase.from('request_components').select(`*, requests (request_number, sub_number)`).eq('has_eng_check', true).like('eng_check_sent_to', '%Yard%').is('eng_check_yard_response', null).order('created_at', { ascending: false });
    if (checkData) setCheckRequests(checkData);
    setLoading(false);
  };

  const handleAction = async (component, action) => {
    let newStatus = '';
    let note = '';

    switch(action) {
      case 'found':
        await supabase.rpc('decrement_yard_qty', { p_ident_code: component.ident_code, p_qty: component.quantity });
        newStatus = 'Trans';
        note = 'Found and sent to Site IN';
        break;
      case 'toSite':
        newStatus = 'Site';
        note = 'Sent to WH Site';
        break;
      case 'toEng':
        newStatus = 'Eng';
        note = 'Sent to Engineering';
        break;
      default: return;
    }

    await supabase.from('request_components').update({ status: newStatus }).eq('id', component.id);
    await logHistory(component.id, `Status changed to ${newStatus}`, component.status, newStatus, note);
    loadData();
    loadBadges();
  };

  const handleDelete = async (component) => {
    await supabase.from('request_components').delete().eq('id', component.id);
    await logHistory(component.id, 'Deleted', component.status, 'Deleted');
    setConfirmDelete(null);
    loadData();
    loadBadges();
  };

  const handleCheckResponse = async (component, found) => {
    await supabase.from('request_components').update({ eng_check_yard_response: found ? 'Found' : 'NotFound' }).eq('id', component.id);
    await logHistory(component.id, `Yard check response: ${found ? 'Found' : 'Not Found'}`, component.status, component.status);
    loadData();
  };

  const handleSplit = async (splitData) => {
    const { componentId, requestId, foundQty, notFoundQty, foundDestination, notFoundDestination, originalComponent } = splitData;

    await supabase.rpc('decrement_yard_qty', { p_ident_code: originalComponent.ident_code, p_qty: foundQty });
    await supabase.from('request_components').update({ quantity: foundQty, status: foundDestination }).eq('id', componentId);
    await logHistory(componentId, `Split: ${foundQty} pcs to ${foundDestination}`, originalComponent.status, foundDestination);

    const { data: reqData } = await supabase.from('requests').select('request_number, sub_number').eq('id', requestId).single();
    const { data: maxSubData } = await supabase.from('requests').select('sub_number').eq('request_number', reqData.request_number).order('sub_number', { ascending: false }).limit(1).single();
    const newSubNumber = (maxSubData?.sub_number || 0) + 1;

    const { data: newRequest } = await supabase.from('requests').insert({
      request_number: reqData.request_number,
      sub_number: newSubNumber,
      requester_user_id: user.id,
      request_type: 'Piping',
      sub_category: originalComponent.requests?.sub_category
    }).select().single();

    const { data: newComp } = await supabase.from('request_components').insert({
      request_id: newRequest.id,
      ident_code: originalComponent.ident_code,
      tag: originalComponent.tag,
      description: originalComponent.description,
      quantity: notFoundQty,
      status: notFoundDestination
    }).select().single();

    await logHistory(newComp.id, `Split from ${formatRequestNumber(reqData.request_number, reqData.sub_number)}: ${notFoundQty} pcs`, null, notFoundDestination);
    setSplitModal(null);
    loadData();
    loadBadges();
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      {checkRequests.length > 0 && (
        <div style={{ ...styles.card, marginBottom: '24px', border: `2px solid ${COLORS.purple}` }}>
          <div style={styles.cardHeaderPurple}>🔍 Check Requests from Engineering</div>
          <div style={{ padding: '16px' }}>
            {checkRequests.map(comp => {
              const available = getAvailable(comp.ident_code, 'Yard');
              return (
                <div key={comp.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', backgroundColor: '#FAFAFA', borderRadius: '6px', marginBottom: '8px' }}>
                  <div>
                    <strong>{formatRequestNumber(comp.requests?.request_number, comp.requests?.sub_number)}</strong>
                    <span style={{ marginLeft: '12px' }}>{comp.ident_code}</span>
                    <span style={{ marginLeft: '12px' }}>Need: {comp.quantity}</span>
                    <span style={{ marginLeft: '12px', color: available >= comp.quantity ? COLORS.success : COLORS.primary, fontWeight: '600' }}>Available: {available}</span>
                    {comp.eng_check_message && <div style={{ fontSize: '12px', color: COLORS.purple, marginTop: '4px' }}>📝 {comp.eng_check_message}</div>}
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={() => handleCheckResponse(comp, true)} style={{ ...styles.actionBtn, backgroundColor: available >= comp.quantity ? COLORS.success : '#9CA3AF' }} title="Found" disabled={available < comp.quantity}>✓</button>
                    <button onClick={() => setSplitModal(comp)} style={{ ...styles.actionBtn, backgroundColor: COLORS.warning }} title="Partial">PT</button>
                    <button onClick={() => handleCheckResponse(comp, false)} style={{ ...styles.actionBtn, backgroundColor: COLORS.primary }} title="Not Found">X</button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div style={styles.card}>
        <div style={styles.cardHeader}>Warehouse Yard - Components</div>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Request #</th>
              <th style={styles.th}>Code</th>
              <th style={styles.th}>Description</th>
              <th style={styles.th}>Qty Requested</th>
              <th style={styles.th}>Available</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {components.length === 0 ? (
              <tr><td colSpan="6" style={{ ...styles.td, textAlign: 'center', color: '#6b7280' }}>No components in Yard</td></tr>
            ) : (
              components.map(comp => {
                const available = getAvailable(comp.ident_code, 'Yard');
                const hasEnough = available >= comp.quantity;
                return (
                  <tr key={comp.id}>
                    <td style={{ ...styles.td, fontFamily: 'monospace', fontWeight: '600' }}>{formatRequestNumber(comp.requests?.request_number, comp.requests?.sub_number)}</td>
                    <td style={{ ...styles.td, fontFamily: 'monospace' }}>{comp.ident_code}</td>
                    <td style={styles.td}>{comp.description}</td>
                    <td style={styles.td}>{comp.quantity}</td>
                    <td style={{ ...styles.td, color: hasEnough ? COLORS.success : COLORS.primary, fontWeight: '600' }}>{available}</td>
                    <td style={styles.td}>
                      <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                        <button onClick={() => setHistoryModal(comp.id)} style={{ ...styles.actionBtn, backgroundColor: '#6b7280', fontSize: '12px' }} title="History">ℹ️</button>
                        {canModify && (
                          <>
                            <button onClick={() => handleAction(comp, 'found')} style={{ ...styles.actionBtn, backgroundColor: hasEnough ? COLORS.success : '#9CA3AF' }} title="Found - To Site IN" disabled={!hasEnough}>✓</button>
                            <button onClick={() => setSplitModal(comp)} style={{ ...styles.actionBtn, backgroundColor: COLORS.warning }} title="Split">PT</button>
                            <button onClick={() => handleAction(comp, 'toSite')} style={{ ...styles.actionBtn, backgroundColor: COLORS.info }} title="To WH Site">S</button>
                            <button onClick={() => handleAction(comp, 'toEng')} style={{ ...styles.actionBtn, backgroundColor: COLORS.purple }} title="To Engineering">UT</button>
                            <button onClick={() => setConfirmDelete(comp)} style={{ ...styles.actionBtn, backgroundColor: COLORS.primary }} title="Delete">🗑️</button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {splitModal && <SplitModal component={splitModal} page="whYard" onClose={() => setSplitModal(null)} onSplit={handleSplit} user={user} />}
      {historyModal && <HistoryModal componentId={historyModal} onClose={() => setHistoryModal(null)} />}
      {confirmDelete && <ConfirmModal title="Conferma Eliminazione" message={`Eliminare ${confirmDelete.ident_code}?`} onConfirm={() => handleDelete(confirmDelete)} onCancel={() => setConfirmDelete(null)} />}
    </div>
  );
}

// ============================================================
// ENGINEERING PAGE
// ============================================================
function EngineeringPage({ user, hasPermission, loadBadges, logHistory }) {
  const [components, setComponents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [splitModal, setSplitModal] = useState(null);
  const [checkModal, setCheckModal] = useState(null);
  const [historyModal, setHistoryModal] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const canModify = hasPermission('engineering', 'modify');

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    setLoading(true);
    const { data } = await supabase.from('request_components').select(`*, requests (request_number, sub_number, sub_category)`).eq('status', 'Eng').order('created_at', { ascending: false });
    if (data) setComponents(data);
    setLoading(false);
  };

  const handleAction = async (component, action) => {
    let newStatus = '';
    let note = '';

    switch(action) {
      case 'toCollect': newStatus = 'ReadyOut'; note = 'Found at Site - Ready OUT'; break;
      case 'toTrans': newStatus = 'Trans'; note = 'Found at Yard - Site IN'; break;
      case 'toSpare': newStatus = 'Spare'; note = 'Sent to Spare Parts'; break;
      case 'toMng': newStatus = 'Mng'; note = 'Sent to Management'; break;
      case 'toSite': newStatus = 'Site'; note = 'Returned to WH Site'; break;
      default: return;
    }

    await supabase.from('request_components').update({ status: newStatus }).eq('id', component.id);
    await logHistory(component.id, `Status changed to ${newStatus}`, component.status, newStatus, note);
    loadData();
    loadBadges();
  };

  const handleDelete = async (component) => {
    await supabase.from('request_components').delete().eq('id', component.id);
    await logHistory(component.id, 'Deleted', component.status, 'Deleted');
    setConfirmDelete(null);
    loadData();
    loadBadges();
  };

  const handleSendCheck = async (checkData) => {
    const { componentId, sendToSite, sendToYard, message } = checkData;
    let sentTo = [];
    if (sendToSite) sentTo.push('Site');
    if (sendToYard) sentTo.push('Yard');

    await supabase.from('request_components').update({
      has_eng_check: true,
      eng_check_sent_to: sentTo.join(','),
      eng_check_message: message,
      eng_check_site_response: null,
      eng_check_yard_response: null
    }).eq('id', componentId);

    await logHistory(componentId, `Check sent to ${sentTo.join(' & ')}`, 'Eng', 'Eng', message);
    setCheckModal(null);
    loadData();
    loadBadges();
  };

  const handleSplit = async (splitData) => {
    const { componentId, requestId, foundQty, notFoundQty, foundDestination, notFoundDestination, originalComponent } = splitData;

    await supabase.from('request_components').update({ quantity: foundQty, status: foundDestination }).eq('id', componentId);
    await logHistory(componentId, `Split: ${foundQty} pcs to ${foundDestination}`, originalComponent.status, foundDestination);

    const { data: reqData } = await supabase.from('requests').select('request_number, sub_number').eq('id', requestId).single();
    const { data: maxSubData } = await supabase.from('requests').select('sub_number').eq('request_number', reqData.request_number).order('sub_number', { ascending: false }).limit(1).single();
    const newSubNumber = (maxSubData?.sub_number || 0) + 1;

    const { data: newRequest } = await supabase.from('requests').insert({
      request_number: reqData.request_number,
      sub_number: newSubNumber,
      requester_user_id: user.id,
      request_type: 'Piping',
      sub_category: originalComponent.requests?.sub_category
    }).select().single();

    const { data: newComp } = await supabase.from('request_components').insert({
      request_id: newRequest.id,
      ident_code: originalComponent.ident_code,
      tag: originalComponent.tag,
      description: originalComponent.description,
      quantity: notFoundQty,
      status: notFoundDestination
    }).select().single();

    await logHistory(newComp.id, `Split from ${formatRequestNumber(reqData.request_number, reqData.sub_number)}: ${notFoundQty} pcs`, null, notFoundDestination);
    setSplitModal(null);
    loadData();
    loadBadges();
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <div style={styles.card}>
        <div style={styles.cardHeader}>Engineering - Components</div>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Request #</th>
              <th style={styles.th}>Code</th>
              <th style={styles.th}>Description</th>
              <th style={styles.th}>Qty</th>
              <th style={styles.th}>Check Status</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {components.length === 0 ? (
              <tr><td colSpan="6" style={{ ...styles.td, textAlign: 'center', color: '#6b7280' }}>No components in Engineering</td></tr>
            ) : (
              components.map(comp => (
                <tr key={comp.id}>
                  <td style={{ ...styles.td, fontFamily: 'monospace', fontWeight: '600' }}>{formatRequestNumber(comp.requests?.request_number, comp.requests?.sub_number)}</td>
                  <td style={{ ...styles.td, fontFamily: 'monospace' }}>{comp.ident_code}</td>
                  <td style={styles.td}>{comp.description}</td>
                  <td style={styles.td}>{comp.quantity}</td>
                  <td style={styles.td}>
                    {comp.has_eng_check ? (
                      <div style={{ fontSize: '12px' }}>
                        <div>Sent: {comp.eng_check_sent_to}</div>
                        {comp.eng_check_site_response && <div>Site: {comp.eng_check_site_response}</div>}
                        {comp.eng_check_yard_response && <div>Yard: {comp.eng_check_yard_response}</div>}
                      </div>
                    ) : <span style={{ color: '#9ca3af' }}>No check</span>}
                  </td>
                  <td style={styles.td}>
                    <div style={{ display: 'flex', gap: '4px', alignItems: 'center', flexWrap: 'wrap' }}>
                      <button onClick={() => setHistoryModal(comp.id)} style={{ ...styles.actionBtn, backgroundColor: '#6b7280', fontSize: '12px' }} title="History">ℹ️</button>
                      {canModify && (
                        <>
                          <button onClick={() => handleAction(comp, 'toCollect')} style={{ ...styles.actionBtn, backgroundColor: COLORS.success }} title="Ready OUT (Site)">✓</button>
                          <button onClick={() => handleAction(comp, 'toTrans')} style={{ ...styles.actionBtn, backgroundColor: COLORS.warning }} title="Site IN (Yard)">📦</button>
                          <button onClick={() => setCheckModal(comp)} style={{ ...styles.actionBtn, backgroundColor: COLORS.info }} title="Send Check">🔍</button>
                          <button onClick={() => setSplitModal(comp)} style={{ ...styles.actionBtn, backgroundColor: COLORS.orange }} title="Split">PT</button>
                          <button onClick={() => handleAction(comp, 'toSpare')} style={{ ...styles.actionBtn, backgroundColor: COLORS.pink }} title="Spare Parts">Sp</button>
                          <button onClick={() => handleAction(comp, 'toMng')} style={{ ...styles.actionBtn, backgroundColor: COLORS.yellow }} title="Management">Mng</button>
                          <button onClick={() => handleAction(comp, 'toSite')} style={{ ...styles.actionBtn, backgroundColor: '#6b7280' }} title="Return to Site">↩</button>
                          <button onClick={() => setConfirmDelete(comp)} style={{ ...styles.actionBtn, backgroundColor: COLORS.primary }} title="Delete">🗑️</button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {checkModal && <CheckModal component={checkModal} onClose={() => setCheckModal(null)} onSendCheck={handleSendCheck} />}
      {splitModal && <SplitModal component={splitModal} page="engineering" onClose={() => setSplitModal(null)} onSplit={handleSplit} user={user} />}
      {historyModal && <HistoryModal componentId={historyModal} onClose={() => setHistoryModal(null)} />}
      {confirmDelete && <ConfirmModal title="Conferma Eliminazione" message={`Eliminare ${confirmDelete.ident_code}?`} onConfirm={() => handleDelete(confirmDelete)} onCancel={() => setConfirmDelete(null)} />}
    </div>
  );
}

// ============================================================
// SITE IN PAGE
// ============================================================
function SiteInPage({ user, hasPermission, loadBadges, logHistory }) {
  const [components, setComponents] = useState([]);
  const [loading, setLoading] = useState(true);

  const canModify = hasPermission('site_in', 'modify');

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    setLoading(true);
    const { data } = await supabase.from('request_components').select(`*, requests (request_number, sub_number)`).eq('status', 'Trans').order('created_at', { ascending: false });
    if (data) setComponents(data);
    setLoading(false);
  };

  const handleConfirm = async (component) => {
    await supabase.rpc('increment_site_qty', { p_ident_code: component.ident_code, p_qty: component.quantity });
    await supabase.from('request_components').update({ status: 'Site' }).eq('id', component.id);
    await logHistory(component.id, 'Arrived at Site', 'Trans', 'Site', 'Confirmed arrival from Yard');
    loadData();
    loadBadges();
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div style={styles.card}>
      <div style={styles.cardHeader}>Site IN - Materials in Transit</div>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Request #</th>
            <th style={styles.th}>Code</th>
            <th style={styles.th}>Description</th>
            <th style={styles.th}>Qty</th>
            <th style={styles.th}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {components.length === 0 ? (
            <tr><td colSpan="5" style={{ ...styles.td, textAlign: 'center', color: '#6b7280' }}>No materials in transit</td></tr>
          ) : (
            components.map(comp => (
              <tr key={comp.id}>
                <td style={{ ...styles.td, fontFamily: 'monospace', fontWeight: '600' }}>{formatRequestNumber(comp.requests?.request_number, comp.requests?.sub_number)}</td>
                <td style={{ ...styles.td, fontFamily: 'monospace' }}>{comp.ident_code}</td>
                <td style={styles.td}>{comp.description}</td>
                <td style={styles.td}>{comp.quantity}</td>
                <td style={styles.td}>
                  {canModify && (
                    <button onClick={() => handleConfirm(comp)} style={{ ...styles.btn, backgroundColor: COLORS.success, color: 'white' }}>✓ Confirm Arrival</button>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

// ============================================================
// SPARE PARTS, MANAGEMENT, ORDERS, TO COLLECT PAGES
// (Simplified versions - same structure as before)
// ============================================================
function SparePartsPage({ user, hasPermission, loadBadges, logHistory }) {
  const [components, setComponents] = useState([]);
  const [loading, setLoading] = useState(true);
  const canModify = hasPermission('spare_parts', 'modify');

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    setLoading(true);
    const { data } = await supabase.from('request_components').select(`*, requests (request_number, sub_number)`).eq('status', 'Spare').order('created_at', { ascending: false });
    if (data) setComponents(data);
    setLoading(false);
  };

  const handleAction = async (component, action) => {
    const newStatus = action === 'clientHas' ? 'ReadyOut' : 'Mng';
    const note = action === 'clientHas' ? 'Client has spare part' : 'No spare available';
    await supabase.from('request_components').update({ status: newStatus }).eq('id', component.id);
    await logHistory(component.id, note, 'Spare', newStatus);
    loadData();
    loadBadges();
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div style={styles.card}>
      <div style={styles.cardHeader}>Spare Parts</div>
      <table style={styles.table}>
        <thead><tr><th style={styles.th}>Request #</th><th style={styles.th}>Code</th><th style={styles.th}>Description</th><th style={styles.th}>Qty</th><th style={styles.th}>Actions</th></tr></thead>
        <tbody>
          {components.length === 0 ? (
            <tr><td colSpan="5" style={{ ...styles.td, textAlign: 'center', color: '#6b7280' }}>No components</td></tr>
          ) : (
            components.map(comp => (
              <tr key={comp.id}>
                <td style={{ ...styles.td, fontFamily: 'monospace', fontWeight: '600' }}>{formatRequestNumber(comp.requests?.request_number, comp.requests?.sub_number)}</td>
                <td style={{ ...styles.td, fontFamily: 'monospace' }}>{comp.ident_code}</td>
                <td style={styles.td}>{comp.description}</td>
                <td style={styles.td}>{comp.quantity}</td>
                <td style={styles.td}>
                  {canModify && (
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button onClick={() => handleAction(comp, 'clientHas')} style={{ ...styles.actionBtn, backgroundColor: COLORS.success }} title="Client has">✓</button>
                      <button onClick={() => handleAction(comp, 'noSpare')} style={{ ...styles.actionBtn, backgroundColor: COLORS.primary }} title="No spare">✗</button>
                    </div>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

function ManagementPage({ user, hasPermission, loadBadges, logHistory }) {
  const [components, setComponents] = useState([]);
  const [loading, setLoading] = useState(true);
  const canModify = hasPermission('management', 'modify');

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    setLoading(true);
    const { data } = await supabase.from('request_components').select(`*, requests (request_number, sub_number)`).eq('status', 'Mng').order('created_at', { ascending: false });
    if (data) setComponents(data);
    setLoading(false);
  };

  const handleOrder = async (component, orderType) => {
    await supabase.from('request_components').update({ status: 'Order', order_type: orderType }).eq('id', component.id);
    await logHistory(component.id, `Order decision: ${orderType}`, 'Mng', 'Order');
    loadData();
    loadBadges();
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div style={styles.card}>
      <div style={styles.cardHeader}>Management - Decisions</div>
      <table style={styles.table}>
        <thead><tr><th style={styles.th}>Request #</th><th style={styles.th}>Code</th><th style={styles.th}>Description</th><th style={styles.th}>Qty</th><th style={styles.th}>Actions</th></tr></thead>
        <tbody>
          {components.length === 0 ? (
            <tr><td colSpan="5" style={{ ...styles.td, textAlign: 'center', color: '#6b7280' }}>No pending decisions</td></tr>
          ) : (
            components.map(comp => (
              <tr key={comp.id}>
                <td style={{ ...styles.td, fontFamily: 'monospace', fontWeight: '600' }}>{formatRequestNumber(comp.requests?.request_number, comp.requests?.sub_number)}</td>
                <td style={{ ...styles.td, fontFamily: 'monospace' }}>{comp.ident_code}</td>
                <td style={styles.td}>{comp.description}</td>
                <td style={styles.td}>{comp.quantity}</td>
                <td style={styles.td}>
                  {canModify && (
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button onClick={() => handleOrder(comp, 'Internal')} style={{ ...styles.actionBtn, backgroundColor: COLORS.info }} title="Internal Order">🏢</button>
                      <button onClick={() => handleOrder(comp, 'Client')} style={{ ...styles.actionBtn, backgroundColor: COLORS.cyan }} title="Client Order">👤</button>
                    </div>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

function OrdersPage({ user, hasPermission, loadBadges, logHistory }) {
  const [tab, setTab] = useState('toOrder');
  const [toOrder, setToOrder] = useState([]);
  const [ordered, setOrdered] = useState([]);
  const [loading, setLoading] = useState(true);
  const canModify = hasPermission('orders', 'modify');

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    setLoading(true);
    const { data: toOrderData } = await supabase.from('request_components').select(`*, requests (request_number, sub_number)`).eq('status', 'Order').order('created_at', { ascending: false });
    const { data: orderedData } = await supabase.from('request_components').select(`*, requests (request_number, sub_number)`).eq('status', 'Ordered').order('created_at', { ascending: false });
    if (toOrderData) setToOrder(toOrderData);
    if (orderedData) setOrdered(orderedData);
    setLoading(false);
  };

  const handlePlaceOrder = async (component) => {
    await supabase.from('request_components').update({ status: 'Ordered', order_date: new Date().toISOString().split('T')[0] }).eq('id', component.id);
    await logHistory(component.id, 'Order placed', 'Order', 'Ordered');
    loadData();
    loadBadges();
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
        <button onClick={() => setTab('toOrder')} style={{ ...styles.btn, backgroundColor: tab === 'toOrder' ? 'white' : '#e5e7eb', color: tab === 'toOrder' ? COLORS.primary : '#6b7280', boxShadow: tab === 'toOrder' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none' }}>To Order ({toOrder.length})</button>
        <button onClick={() => setTab('ordered')} style={{ ...styles.btn, backgroundColor: tab === 'ordered' ? 'white' : '#e5e7eb', color: tab === 'ordered' ? COLORS.cyan : '#6b7280', boxShadow: tab === 'ordered' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none' }}>Ordered ({ordered.length})</button>
      </div>
      <div style={styles.card}>
        <div style={styles.cardHeader}>{tab === 'toOrder' ? 'To Order' : 'Ordered'}</div>
        <table style={styles.table}>
          <thead><tr><th style={styles.th}>Request #</th><th style={styles.th}>Code</th><th style={styles.th}>Description</th><th style={styles.th}>Qty</th><th style={styles.th}>Type</th><th style={styles.th}>Actions</th></tr></thead>
          <tbody>
            {(tab === 'toOrder' ? toOrder : ordered).length === 0 ? (
              <tr><td colSpan="6" style={{ ...styles.td, textAlign: 'center', color: '#6b7280' }}>No orders</td></tr>
            ) : (
              (tab === 'toOrder' ? toOrder : ordered).map(comp => (
                <tr key={comp.id}>
                  <td style={{ ...styles.td, fontFamily: 'monospace', fontWeight: '600' }}>{formatRequestNumber(comp.requests?.request_number, comp.requests?.sub_number)}</td>
                  <td style={{ ...styles.td, fontFamily: 'monospace' }}>{comp.ident_code}</td>
                  <td style={styles.td}>{comp.description}</td>
                  <td style={styles.td}>{comp.quantity}</td>
                  <td style={styles.td}><span style={{ ...styles.badge, backgroundColor: comp.order_type === 'Internal' ? COLORS.info : COLORS.cyan }}>{comp.order_type}</span></td>
                  <td style={styles.td}>
                    {tab === 'toOrder' && canModify && (
                      <button onClick={() => handlePlaceOrder(comp)} style={{ ...styles.btn, backgroundColor: COLORS.success, color: 'white' }}>🛒 Place Order</button>
                    )}
                    {tab === 'ordered' && <span style={{ color: '#6b7280', fontSize: '12px' }}>Ordered: {comp.order_date}</span>}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ToCollectPage({ user, hasPermission, loadBadges, logHistory }) {
  const [components, setComponents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    setLoading(true);
    const { data } = await supabase.from('request_components').select(`*, requests (request_number, sub_number, requester_user_id)`).eq('status', 'ToCollect').order('created_at', { ascending: false });
    if (data) setComponents(data);
    setLoading(false);
  };

  const handleCollected = async (component) => {
    await supabase.from('request_components').update({ status: 'Done' }).eq('id', component.id);
    await logHistory(component.id, 'Collected', 'ToCollect', 'Done', `Collected by ${user.full_name}`);
    loadData();
    loadBadges();
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div style={styles.card}>
      <div style={styles.cardHeader}>To Be Collected</div>
      <table style={styles.table}>
        <thead><tr><th style={styles.th}>Request #</th><th style={styles.th}>Code</th><th style={styles.th}>Description</th><th style={styles.th}>Qty</th><th style={styles.th}>Actions</th></tr></thead>
        <tbody>
          {components.length === 0 ? (
            <tr><td colSpan="5" style={{ ...styles.td, textAlign: 'center', color: '#6b7280' }}>No materials to collect</td></tr>
          ) : (
            components.map(comp => {
              const canCollect = comp.requests?.requester_user_id === user.id || user.role === 'admin';
              return (
                <tr key={comp.id}>
                  <td style={{ ...styles.td, fontFamily: 'monospace', fontWeight: '600' }}>{formatRequestNumber(comp.requests?.request_number, comp.requests?.sub_number)}</td>
                  <td style={{ ...styles.td, fontFamily: 'monospace' }}>{comp.ident_code}</td>
                  <td style={styles.td}>{comp.description}</td>
                  <td style={styles.td}>{comp.quantity}</td>
                  <td style={styles.td}>
                    {canCollect ? (
                      <button onClick={() => handleCollected(comp)} style={{ ...styles.btn, backgroundColor: COLORS.success, color: 'white' }}>✓ Collected</button>
                    ) : (
                      <span style={{ color: '#9ca3af', fontSize: '12px' }}>Solo il richiedente</span>
                    )}
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}

// ============================================================
// LOG PAGE
// ============================================================
function LogPage() {
  const [movements, setMovements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    setLoading(true);
    const { data } = await supabase.from('movements').select('*').order('created_at', { ascending: false }).limit(100);
    if (data) setMovements(data);
    setLoading(false);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div style={styles.card}>
      <div style={styles.cardHeader}>Movement Log</div>
      <table style={styles.table}>
        <thead><tr><th style={styles.th}>Date</th><th style={styles.th}>Type</th><th style={styles.th}>Code</th><th style={styles.th}>Qty</th><th style={styles.th}>From → To</th><th style={styles.th}>Note</th><th style={styles.th}>By</th></tr></thead>
        <tbody>
          {movements.length === 0 ? (
            <tr><td colSpan="7" style={{ ...styles.td, textAlign: 'center', color: '#6b7280' }}>No movements</td></tr>
          ) : (
            movements.map(mov => (
              <tr key={mov.id}>
                <td style={styles.td}>{new Date(mov.created_at).toLocaleString()}</td>
                <td style={styles.td}><span style={{ ...styles.badge, backgroundColor: mov.movement_type === 'IN' ? COLORS.success : mov.movement_type === 'OUT' ? COLORS.primary : mov.movement_type === 'LOST' ? COLORS.orange : mov.movement_type === 'BROKEN' ? COLORS.purple : COLORS.yellow }}>{mov.movement_type}</span></td>
                <td style={{ ...styles.td, fontFamily: 'monospace' }}>{mov.ident_code}</td>
                <td style={styles.td}>{mov.quantity}</td>
                <td style={styles.td}>{mov.from_location} → {mov.to_location}</td>
                <td style={styles.td}>{mov.note || '-'}</td>
                <td style={styles.td}>{mov.performed_by || '-'}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

// ============================================================
// DATABASE PAGE
// ============================================================
function DatabasePage() {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    setLoading(true);
    const { data } = await supabase.from('project_database').select('*').order('ident_code');
    if (data) setInventory(data);
    setLoading(false);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div style={styles.card}>
      <div style={styles.cardHeader}>Inventory Database</div>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Code</th>
            <th style={styles.th}>Description</th>
            <th style={{ ...styles.th, backgroundColor: COLORS.secondary, color: 'white', textAlign: 'center' }}>YARD</th>
            <th style={{ ...styles.th, backgroundColor: COLORS.info, color: 'white', textAlign: 'center' }}>SITE</th>
            <th style={{ ...styles.th, backgroundColor: COLORS.orange, color: 'white', textAlign: 'center' }}>LOST</th>
            <th style={{ ...styles.th, backgroundColor: COLORS.purple, color: 'white', textAlign: 'center' }}>BROKEN</th>
            <th style={{ ...styles.th, textAlign: 'center' }}>TOTAL</th>
          </tr>
        </thead>
        <tbody>
          {inventory.map(item => {
            const total = (item.qty_yard || 0) + (item.qty_site || 0);
            return (
              <tr key={item.id}>
                <td style={{ ...styles.td, fontFamily: 'monospace', fontWeight: '600' }}>{item.ident_code}</td>
                <td style={styles.td}>{item.description}</td>
                <td style={{ ...styles.td, textAlign: 'center', fontWeight: '600' }}>{item.qty_yard || 0}</td>
                <td style={{ ...styles.td, textAlign: 'center', fontWeight: '600' }}>{item.qty_site || 0}</td>
                <td style={{ ...styles.td, textAlign: 'center', fontWeight: '600' }}>{item.qty_lost || 0}</td>
                <td style={{ ...styles.td, textAlign: 'center', fontWeight: '600' }}>{item.qty_broken || 0}</td>
                <td style={{ ...styles.td, textAlign: 'center', fontWeight: '600', color: COLORS.primary }}>{total}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// ============================================================
// REQUESTS PAGE (Simplified - same as before)
// ============================================================
function RequestsPage({ user, hasPermission, loadBadges }) {
  const [requestType, setRequestType] = useState('Piping');
  const [subCategory, setSubCategory] = useState('Bulk');
  const [isoNumber, setIsoNumber] = useState('');
  const [spoolNumber, setSpoolNumber] = useState('');
  const [hfNumber, setHfNumber] = useState('');
  const [testPackNumber, setTestPackNumber] = useState('');
  const [missingType, setMissingType] = useState('Material');
  const [description, setDescription] = useState('');
  const [materials, setMaterials] = useState([]);
  const [currentMaterial, setCurrentMaterial] = useState({ ident_code: '', tag: '', qty: '' });
  const [isoOptions, setIsoOptions] = useState([]);
  const [identOptions, setIdentOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const canModify = hasPermission('requests', 'modify');

  useEffect(() => { loadIsoOptions(); }, []);

  const loadIsoOptions = async () => {
    const { data } = await supabase.from('project_database').select('iso_number').not('iso_number', 'is', null);
    if (data) setIsoOptions([...new Set(data.map(d => d.iso_number).filter(Boolean))]);
  };

  const loadIdentOptions = async (iso) => {
    const { data } = await supabase.from('project_database').select('ident_code, tag, description, qty_yard, qty_site').eq('iso_number', iso);
    if (data) setIdentOptions(data);
  };

  const handleIsoChange = (value) => {
    setIsoNumber(value);
    if (value) loadIdentOptions(value);
  };

  const addMaterial = () => {
    if (!currentMaterial.ident_code || !currentMaterial.qty) return;
    const selectedMat = identOptions.find(o => o.ident_code === currentMaterial.ident_code);
    setMaterials([...materials, { ...currentMaterial, description: selectedMat?.description || '' }]);
    setCurrentMaterial({ ident_code: '', tag: '', qty: '' });
  };

  const removeMaterial = (index) => setMaterials(materials.filter((_, i) => i !== index));

  const submitRequest = async (destination) => {
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      if (requestType === 'Piping') {
        if (!isoNumber) throw new Error('ISO Number richiesto');
        if (!spoolNumber) throw new Error('Full Spool Number richiesto');
        if (subCategory === 'Erection' && !hfNumber) throw new Error('HF Number richiesto per Erection');
        if (materials.length === 0) throw new Error('Aggiungi almeno un materiale');
      }
      if (requestType === 'Mechanical' && !description) throw new Error('Description richiesta per Mechanical');
      if (requestType === 'TestPack') {
        if (!testPackNumber) throw new Error('Test Pack Number richiesto');
        if (missingType === 'Material' && materials.length === 0) throw new Error('Aggiungi almeno un materiale');
      }

      const { data: counterData } = await supabase.rpc('get_next_request_number');
      const reqNumber = counterData || 1;

      const { data: request, error: reqError } = await supabase.from('requests').insert({
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
        description: description || null
      }).select().single();

      if (reqError) throw reqError;

      if (materials.length > 0) {
        const components = materials.map(m => ({
          request_id: request.id,
          ident_code: m.ident_code,
          tag: m.tag || null,
          description: m.description,
          quantity: parseInt(m.qty),
          status: destination
        }));
        const { error: compError } = await supabase.from('request_components').insert(components);
        if (compError) throw compError;
      }

      setMessage({ type: 'success', text: `Request ${formatRequestNumber(reqNumber, 0)} creata!` });
      setIsoNumber(''); setSpoolNumber(''); setHfNumber(''); setTestPackNumber(''); setDescription(''); setMaterials([]);
      loadBadges();
    } catch (err) {
      setMessage({ type: 'error', text: `Errore: ${err.message}` });
    }
    setLoading(false);
  };

  return (
    <div>
      {message.text && (
        <div style={{ padding: '12px 16px', borderRadius: '6px', marginBottom: '16px', backgroundColor: message.type === 'success' ? '#D1FAE5' : '#FEE2E2', color: message.type === 'success' ? '#065F46' : '#DC2626' }}>
          {message.text}
        </div>
      )}
      <div style={styles.card}>
        <div style={{ padding: '24px' }}>
          <div style={{ marginBottom: '24px' }}>
            <label style={{ ...styles.label, marginBottom: '12px' }}>Request Type</label>
            <div style={{ display: 'flex', gap: '24px' }}>
              {REQUEST_TYPES.map(type => (
                <label key={type} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input type="radio" name="requestType" value={type} checked={requestType === type} onChange={(e) => { setRequestType(e.target.value); setMaterials([]); }} disabled={!canModify} style={{ width: '18px', height: '18px' }} />
                  <span style={{ fontWeight: requestType === type ? '600' : '400' }}>{type}</span>
                </label>
              ))}
            </div>
          </div>

          {requestType === 'Piping' && (
            <>
              <div style={{ marginBottom: '20px' }}>
                <label style={styles.label}>Sub-Category</label>
                <select value={subCategory} onChange={(e) => setSubCategory(e.target.value)} style={{ ...styles.select, maxWidth: '300px' }} disabled={!canModify}>
                  {SUB_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                <div>
                  <label style={styles.label}>ISO Number *</label>
                  <input type="text" list="iso-options" value={isoNumber} onChange={(e) => handleIsoChange(e.target.value)} style={styles.input} placeholder="Ex: I181C02-DF21065-0-01" disabled={!canModify} />
                  <datalist id="iso-options">{isoOptions.map(iso => <option key={iso} value={iso} />)}</datalist>
                </div>
                <div>
                  <label style={styles.label}>Full Spool Number *</label>
                  <input type="text" value={spoolNumber} onChange={(e) => setSpoolNumber(e.target.value)} style={styles.input} placeholder="Ex: I181C02-DF21065-0-01-SP001" disabled={!canModify} />
                </div>
              </div>
              {subCategory === 'Erection' && (
                <div style={{ marginBottom: '20px', padding: '16px', backgroundColor: '#FEF3C7', borderRadius: '8px', border: '1px solid #F59E0B' }}>
                  <label style={{ ...styles.label, color: '#92400E' }}>🔩 HF Number *</label>
                  <input type="text" value={hfNumber} onChange={(e) => setHfNumber(e.target.value)} style={{ ...styles.input, backgroundColor: 'white' }} placeholder="Enter HF Number" disabled={!canModify} />
                </div>
              )}
            </>
          )}

          {requestType === 'Mechanical' && (
            <div style={{ marginBottom: '20px' }}>
              <label style={styles.label}>Description *</label>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} style={{ ...styles.input, minHeight: '120px', resize: 'vertical' }} placeholder="Describe..." disabled={!canModify} />
            </div>
          )}

          {requestType === 'TestPack' && (
            <>
              <div style={{ marginBottom: '20px', padding: '16px', backgroundColor: '#DBEAFE', borderRadius: '8px', border: '1px solid #3B82F6' }}>
                <label style={{ ...styles.label, color: '#1E40AF' }}>📋 Test Pack Number *</label>
                <input type="text" value={testPackNumber} onChange={(e) => setTestPackNumber(e.target.value)} style={{ ...styles.input, backgroundColor: 'white' }} placeholder="Ex: TP-2024-001" disabled={!canModify} />
              </div>
              <div style={{ marginBottom: '20px' }}>
                <label style={styles.label}>Missing Type</label>
                <div style={{ display: 'flex', gap: '24px' }}>
                  {['Material', 'Spool'].map(t => (
                    <label key={t} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                      <input type="radio" name="missingType" value={t} checked={missingType === t} onChange={(e) => setMissingType(e.target.value)} style={{ width: '18px', height: '18px' }} />
                      <span>{t}</span>
                    </label>
                  ))}
                </div>
              </div>
            </>
          )}

          {(requestType === 'Piping' || (requestType === 'TestPack' && missingType === 'Material')) && (
            <div style={styles.card}>
              <div style={styles.cardHeader}>📦 Add Materials</div>
              <div style={{ padding: '16px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 100px 80px', gap: '12px', marginBottom: '16px' }}>
                  <div>
                    <label style={styles.label}>Ident Code</label>
                    <select value={currentMaterial.ident_code} onChange={(e) => setCurrentMaterial({ ...currentMaterial, ident_code: e.target.value })} style={styles.select} disabled={!canModify}>
                      <option value="">Select...</option>
                      {identOptions.map(opt => <option key={opt.ident_code} value={opt.ident_code}>{opt.ident_code} - {opt.description}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={styles.label}>Tag</label>
                    <select value={currentMaterial.tag} onChange={(e) => setCurrentMaterial({ ...currentMaterial, tag: e.target.value })} style={styles.select} disabled={!canModify}>
                      <option value="">None</option>
                    </select>
                  </div>
                  <div>
                    <label style={styles.label}>Qty</label>
                    <input type="number" min="1" value={currentMaterial.qty} onChange={(e) => setCurrentMaterial({ ...currentMaterial, qty: e.target.value })} style={styles.input} disabled={!canModify} />
                  </div>
                  <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                    <button onClick={addMaterial} disabled={!canModify} style={{ ...styles.btn, backgroundColor: COLORS.primary, color: 'white', width: '100%' }}>+ Add</button>
                  </div>
                </div>
                {materials.length > 0 && (
                  <table style={styles.table}>
                    <thead><tr><th style={styles.th}>Code</th><th style={styles.th}>Description</th><th style={styles.th}>Tag</th><th style={styles.th}>Qty</th><th style={styles.th}></th></tr></thead>
                    <tbody>
                      {materials.map((mat, idx) => (
                        <tr key={idx}>
                          <td style={{ ...styles.td, fontFamily: 'monospace', fontWeight: '500' }}>{mat.ident_code}</td>
                          <td style={styles.td}>{mat.description}</td>
                          <td style={styles.td}>{mat.tag || '-'}</td>
                          <td style={styles.td}>{mat.qty}</td>
                          <td style={styles.td}><button onClick={() => removeMaterial(idx)} style={{ ...styles.actionBtn, backgroundColor: COLORS.primary }}>🗑️</button></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          )}

          {canModify && (
            <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
              <button onClick={() => submitRequest('Site')} disabled={loading} style={{ ...styles.btn, backgroundColor: COLORS.info, color: 'white', opacity: loading ? 0.7 : 1 }}>🏭 Send to Site</button>
              <button onClick={() => submitRequest('Yard')} disabled={loading} style={{ ...styles.btn, backgroundColor: COLORS.secondary, color: 'white', opacity: loading ? 0.7 : 1 }}>🏢 Send to Yard</button>
              <button onClick={() => submitRequest('Eng')} disabled={loading} style={{ ...styles.btn, backgroundColor: COLORS.purple, color: 'white', opacity: loading ? 0.7 : 1 }}>⚙️ Send to Engineering</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
