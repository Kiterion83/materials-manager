// ============================================================
// MATERIALS MANAGER - APP.JSX COMPLETA
// MAX STREICHER Edition - English Version with Fixes
// ============================================================

import React, { useState, useEffect, useCallback } from 'react';
import { createClient } from '@supabase/supabase-js';

// ============================================================
// CONFIGURAZIONE SUPABASE
// ============================================================
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// ============================================================
// COSTANTI E CONFIGURAZIONE
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
  TestPackReady: '#059669',
  Done: COLORS.gray
};

const MIR_CATEGORIES = ['Erection', 'Bulk', 'Instrument', 'Support'];
const REQUEST_TYPES = ['Piping', 'Mechanical', 'TestPack'];
const SUB_CATEGORIES = ['Bulk', 'Erection', 'Support'];

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
    borderLeft: '4px solid transparent',
    position: 'relative'
  },
  navItemActive: {
    backgroundColor: 'rgba(227, 30, 36, 0.2)',
    borderLeftColor: COLORS.primary,
    color: 'white'
  },
  badge: {
    position: 'absolute',
    right: '12px',
    backgroundColor: COLORS.primary,
    color: 'white',
    borderRadius: '10px',
    padding: '2px 8px',
    fontSize: '11px',
    fontWeight: 'bold',
    minWidth: '20px',
    textAlign: 'center'
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
    alignItems: 'center',
    justifyContent: 'space-between'
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
    marginBottom: '24px'
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
    borderCollapse: 'separate',
    borderSpacing: '0'
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
    fontSize: '14px',
    verticalAlign: 'middle'
  },
  button: {
    padding: '8px 16px',
    borderRadius: '6px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    transition: 'all 0.2s'
  },
  buttonPrimary: {
    backgroundColor: COLORS.primary,
    color: 'white'
  },
  buttonSecondary: {
    backgroundColor: '#e5e7eb',
    color: '#374151'
  },
  actionBtn: {
    width: '32px',
    height: '32px',
    borderRadius: '4px',
    border: 'none',
    color: 'white',
    fontSize: '12px',
    fontWeight: 'bold',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'transform 0.2s'
  },
  statusBadge: {
    padding: '2px 8px',
    borderRadius: '4px',
    color: 'white',
    fontSize: '11px',
    fontWeight: '500'
  },
  input: {
    width: '100%',
    padding: '10px 12px',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    fontSize: '14px',
    outline: 'none',
    boxSizing: 'border-box'
  },
  select: {
    width: '100%',
    padding: '10px 12px',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    fontSize: '14px',
    backgroundColor: 'white',
    boxSizing: 'border-box'
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
    maxHeight: '90vh',
    overflowY: 'auto'
  },
  formGroup: {
    marginBottom: '16px'
  },
  label: {
    display: 'block',
    marginBottom: '6px',
    fontSize: '14px',
    fontWeight: '500',
    color: '#374151'
  },
  statsBox: {
    padding: '24px',
    borderRadius: '8px',
    color: 'white'
  },
  // Grid styles for consistent spacing
  gridRow: {
    display: 'grid',
    gap: '16px',
    marginBottom: '16px'
  },
  gridTwo: {
    gridTemplateColumns: '1fr 1fr'
  },
  gridThree: {
    gridTemplateColumns: '1fr 1fr 1fr'
  }
};

// ============================================================
// COMPONENTI UTILITY
// ============================================================
function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;
  
  return (
    <div style={styles.modal} onClick={onClose}>
      <div style={styles.modalContent} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '600' }}>{title}</h3>
          <button 
            onClick={onClose}
            style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: '#9ca3af' }}
          >
            ×
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function ActionButton({ color, onClick, disabled, title, children }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      style={{
        ...styles.actionBtn,
        backgroundColor: disabled ? '#9CA3AF' : color,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.6 : 1
      }}
    >
      {children}
    </button>
  );
}

function StatusBadge({ status }) {
  return (
    <span style={{ ...styles.statusBadge, backgroundColor: STATUS_COLORS[status] || COLORS.gray }}>
      {status}
    </span>
  );
}

// ============================================================
// COMPONENTE LOGIN
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
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937' }}>MAX STREICHER</h1>
          <p style={{ color: '#6b7280', marginTop: '8px' }}>Materials Manager</p>
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
              placeholder="Enter username"
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
              placeholder="Enter password"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              ...styles.button,
              ...styles.buttonPrimary,
              width: '100%',
              justifyContent: 'center',
              padding: '12px',
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
// SIDEBAR CON BADGE
// ============================================================
function Sidebar({ currentPage, setCurrentPage, user, collapsed, setCollapsed, badges }) {
  const menuItems = [
    { id: 'dashboard', icon: '📊', label: 'Dashboard' },
    { id: 'requests', icon: '📋', label: 'Requests', perm: 'perm_requests' },
    { id: 'mir', icon: '📦', label: 'MIR', perm: 'perm_mir' },
    { id: 'materialIn', icon: '📥', label: 'Material In', perm: 'perm_material_in', badge: 'materialIn' },
    { id: 'siteIn', icon: '🏗️', label: 'Site IN', perm: 'perm_site_in', badge: 'siteIn' },
    { id: 'whSite', icon: '🏭', label: 'WH Site', perm: 'perm_wh_site', badge: 'whSite' },
    { id: 'whYard', icon: '🏢', label: 'WH Yard', perm: 'perm_wh_yard', badge: 'whYard' },
    { id: 'engineering', icon: '⚙️', label: 'Engineering', perm: 'perm_engineering', badge: 'engineering' },
    { id: 'spareParts', icon: '🔧', label: 'Spare Parts', perm: 'perm_spare_parts', badge: 'spareParts' },
    { id: 'orders', icon: '🛒', label: 'Orders', perm: 'perm_orders', badge: 'orders' },
    { id: 'management', icon: '💼', label: 'Management', perm: 'perm_management', badge: 'management' },
    { id: 'log', icon: '📜', label: 'Log', perm: 'perm_log' },
    { id: 'database', icon: '💾', label: 'Database', perm: 'perm_database' }
  ];

  const canAccess = (item) => {
    if (user.role === 'admin') return true;
    if (!item.perm) return true;
    return user[item.perm] && user[item.perm] !== 'none';
  };

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
        {menuItems.filter(canAccess).map(item => (
          <div
            key={item.id}
            onClick={() => setCurrentPage(item.id)}
            style={{
              ...styles.navItem,
              ...(currentPage === item.id ? styles.navItemActive : {})
            }}
          >
            <span style={{ fontSize: '20px' }}>{item.icon}</span>
            {!collapsed && <span style={{ fontSize: '14px' }}>{item.label}</span>}
            {!collapsed && item.badge && badges[item.badge] > 0 && (
              <span style={styles.badge}>{badges[item.badge]}</span>
            )}
          </div>
        ))}
      </nav>

      <div style={{ padding: '16px', borderTop: '1px solid #374151' }}>
        <div style={{ ...styles.navItem, padding: '8px 0' }}>
          <span>🚪</span>
          {!collapsed && <span style={{ fontSize: '14px' }}>Logout</span>}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// PAGINA DASHBOARD
// ============================================================
function DashboardPage({ user }) {
  const [stats, setStats] = useState({
    yardQty: 0, siteQty: 0, lostQty: 0, brokenQty: 0,
    yardItems: 0, siteItems: 0, lostItems: 0, brokenItems: 0,
    activeRequests: 0, waitingEng: 0, toOrder: 0
  });
  const [recentMovements, setRecentMovements] = useState([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    // Load inventory stats
    const { data: inventory } = await supabase
      .from('project_database')
      .select('qty_yard, qty_site, qty_lost, qty_broken');

    if (inventory) {
      let yard = 0, site = 0, lost = 0, broken = 0;
      let yardI = 0, siteI = 0, lostI = 0, brokenI = 0;
      
      inventory.forEach(item => {
        if (item.qty_yard > 0) { yard += item.qty_yard; yardI++; }
        if (item.qty_site > 0) { site += item.qty_site; siteI++; }
        if (item.qty_lost > 0) { lost += item.qty_lost; lostI++; }
        if (item.qty_broken > 0) { broken += item.qty_broken; brokenI++; }
      });

      setStats(prev => ({
        ...prev,
        yardQty: yard, siteQty: site, lostQty: lost, brokenQty: broken,
        yardItems: yardI, siteItems: siteI, lostItems: lostI, brokenItems: brokenI
      }));
    }

    // Load request counts
    const { data: components } = await supabase
      .from('request_components')
      .select('status');

    if (components) {
      const active = components.filter(c => !['Done', 'ToCollect'].includes(c.status)).length;
      const waiting = components.filter(c => c.status === 'Eng').length;
      const toOrder = components.filter(c => c.status === 'Order').length;

      setStats(prev => ({
        ...prev,
        activeRequests: active,
        waitingEng: waiting,
        toOrder: toOrder
      }));
    }

    // Load recent movements
    const { data: movements } = await supabase
      .from('movements')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10);

    if (movements) setRecentMovements(movements);
  };

  return (
    <div>
      {/* Inventory Boxes - 4 columns equal size */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
        <div style={{ ...styles.statsBox, backgroundColor: COLORS.secondary }}>
          <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px' }}>YARD</h3>
          <p style={{ fontSize: '32px', fontWeight: 'bold' }}>{stats.yardQty.toLocaleString()}</p>
          <p style={{ fontSize: '14px', opacity: 0.75 }}>{stats.yardItems} items</p>
        </div>
        <div style={{ ...styles.statsBox, backgroundColor: COLORS.info }}>
          <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px' }}>SITE</h3>
          <p style={{ fontSize: '32px', fontWeight: 'bold' }}>{stats.siteQty.toLocaleString()}</p>
          <p style={{ fontSize: '14px', opacity: 0.75 }}>{stats.siteItems} items</p>
        </div>
        <div style={{ ...styles.statsBox, backgroundColor: COLORS.orange }}>
          <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px' }}>LOST</h3>
          <p style={{ fontSize: '32px', fontWeight: 'bold' }}>{stats.lostQty.toLocaleString()}</p>
          <p style={{ fontSize: '14px', opacity: 0.75 }}>{stats.lostItems} items</p>
        </div>
        <div style={{ ...styles.statsBox, backgroundColor: COLORS.purple }}>
          <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px' }}>BROKEN</h3>
          <p style={{ fontSize: '32px', fontWeight: 'bold' }}>{stats.brokenQty.toLocaleString()}</p>
          <p style={{ fontSize: '14px', opacity: 0.75 }}>{stats.brokenItems} items</p>
        </div>
      </div>

      {/* Stats - 3 columns equal size */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
        <div style={styles.card}>
          <div style={{ padding: '24px' }}>
            <h3 style={{ color: '#6b7280', fontSize: '14px', marginBottom: '8px' }}>Active Requests</h3>
            <p style={{ fontSize: '32px', fontWeight: 'bold', color: COLORS.primary }}>{stats.activeRequests}</p>
          </div>
        </div>
        <div style={styles.card}>
          <div style={{ padding: '24px' }}>
            <h3 style={{ color: '#6b7280', fontSize: '14px', marginBottom: '8px' }}>Waiting Engineering</h3>
            <p style={{ fontSize: '32px', fontWeight: 'bold', color: COLORS.purple }}>{stats.waitingEng}</p>
          </div>
        </div>
        <div style={styles.card}>
          <div style={{ padding: '24px' }}>
            <h3 style={{ color: '#6b7280', fontSize: '14px', marginBottom: '8px' }}>To Order</h3>
            <p style={{ fontSize: '32px', fontWeight: 'bold', color: COLORS.warning }}>{stats.toOrder}</p>
          </div>
        </div>
      </div>

      {/* Recent Movements */}
      <div style={styles.card}>
        <div style={styles.cardHeader}>
          <h3 style={{ fontSize: '16px', fontWeight: '600' }}>Recent Movements</h3>
        </div>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Date</th>
              <th style={styles.th}>Type</th>
              <th style={styles.th}>Code</th>
              <th style={styles.th}>Qty</th>
              <th style={styles.th}>Location</th>
              <th style={styles.th}>Note</th>
            </tr>
          </thead>
          <tbody>
            {recentMovements.map((mov, idx) => (
              <tr key={idx}>
                <td style={styles.td}>{new Date(mov.created_at).toLocaleString()}</td>
                <td style={styles.td}>
                  <span style={{
                    ...styles.statusBadge,
                    backgroundColor: mov.movement_type === 'IN' ? COLORS.success :
                                    mov.movement_type === 'OUT' ? COLORS.primary :
                                    mov.movement_type === 'LOST' ? COLORS.orange :
                                    mov.movement_type === 'BROKEN' ? COLORS.purple : COLORS.gray
                  }}>
                    {mov.movement_type}
                  </span>
                </td>
                <td style={{ ...styles.td, fontFamily: 'monospace', fontWeight: '600' }}>{mov.ident_code}</td>
                <td style={styles.td}>{mov.quantity > 0 ? '+' : ''}{mov.quantity}</td>
                <td style={styles.td}>{mov.from_location} → {mov.to_location}</td>
                <td style={{ ...styles.td, color: '#6b7280', fontSize: '12px' }}>{mov.note}</td>
              </tr>
            ))}
            {recentMovements.length === 0 && (
              <tr>
                <td colSpan="6" style={{ ...styles.td, textAlign: 'center', color: '#9ca3af' }}>
                  No movements recorded
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
// PAGINA NUOVA RICHIESTA - FIXED VERSION
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
  const [currentMaterial, setCurrentMaterial] = useState({ ident_code: '', tag: '', qty: '' });
  const [isoOptions, setIsoOptions] = useState([]);
  const [identOptions, setIdentOptions] = useState([]);
  const [tagOptions, setTagOptions] = useState([]);
  const [nextNumber, setNextNumber] = useState(1);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    loadIsoOptions();
    loadNextNumber();
    loadTagOptions();
  }, []);

  const loadNextNumber = async () => {
    const { data } = await supabase
      .from('counters')
      .select('value')
      .eq('id', 'request_number')
      .single();
    if (data) setNextNumber(data.value + 1);
  };

  const loadIsoOptions = async () => {
    const { data } = await supabase
      .from('project_database')
      .select('iso_number')
      .order('iso_number');
    if (data) {
      const unique = [...new Set(data.map(d => d.iso_number).filter(Boolean))];
      setIsoOptions(unique);
    }
  };

  const loadTagOptions = async () => {
    const { data } = await supabase
      .from('tags')
      .select('tag_code, description')
      .order('tag_code');
    if (data) setTagOptions(data);
  };

  const loadIdentOptions = async (iso) => {
    const { data } = await supabase
      .from('project_database')
      .select('ident_code, tag, description, qty_yard, qty_site')
      .eq('iso_number', iso);
    if (data) {
      setIdentOptions(data);
    }
  };

  const handleIsoChange = (value) => {
    setIsoNumber(value);
    if (value) loadIdentOptions(value);
  };

  const handleRequestTypeChange = (type) => {
    setRequestType(type);
    // Reset fields when changing type
    setIsoNumber('');
    setSpoolNumber('');
    setHfNumber('');
    setTestPackNumber('');
    setDescription('');
    setMaterials([]);
  };

  const addMaterial = () => {
    if (!currentMaterial.ident_code || !currentMaterial.qty) return;
    
    const selectedMat = identOptions.find(o => 
      o.ident_code === currentMaterial.ident_code && 
      (o.tag || '') === (currentMaterial.tag || '')
    );

    setMaterials([...materials, {
      ...currentMaterial,
      description: selectedMat?.description || '',
      qty_yard: selectedMat?.qty_yard || 0,
      qty_site: selectedMat?.qty_site || 0
    }]);
    setCurrentMaterial({ ident_code: '', tag: '', qty: '' });
  };

  const removeMaterial = (index) => {
    setMaterials(materials.filter((_, i) => i !== index));
  };

  const submitRequest = async (destination) => {
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      // Validation
      if (requestType === 'Piping') {
        if (!isoNumber) throw new Error('ISO Number is required for Piping');
        if (!spoolNumber) throw new Error('Full Spool Number is required for Piping');
        if (subCategory === 'Erection' && !hfNumber) throw new Error('HF Number is required for Erection');
        if (materials.length === 0) throw new Error('Add at least one material');
      }
      if (requestType === 'Mechanical' && !description) {
        throw new Error('Description is required for Mechanical');
      }
      if (requestType === 'TestPack') {
        if (!testPackNumber) throw new Error('Test Pack Number is required');
        if (missingType === 'Material' && materials.length === 0) {
          throw new Error('Add at least one material');
        }
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
          description: description || null
        })
        .select()
        .single();

      if (reqError) throw reqError;

      // Create components
      const statusMap = {
        'site': 'Site',
        'yard': 'Yard',
        'engineering': 'Eng'
      };
      const status = statusMap[destination];

      if (requestType === 'Mechanical') {
        // For Mechanical, create one component with just description
        await supabase
          .from('request_components')
          .insert({
            request_id: request.id,
            ident_code: 'MECHANICAL',
            description: description,
            quantity: 1,
            status: status,
            current_location: destination === 'yard' ? 'YARD' : 'SITE'
          });
      } else {
        // For Piping and TestPack, create components from materials list
        for (const mat of materials) {
          const { error: compError } = await supabase
            .from('request_components')
            .insert({
              request_id: request.id,
              ident_code: mat.ident_code,
              tag: mat.tag || null,
              description: mat.description,
              quantity: parseInt(mat.qty),
              status: status,
              current_location: destination === 'yard' ? 'YARD' : 'SITE'
            });
          if (compError) throw compError;
        }
      }

      // Log the creation
      await supabase.from('component_history').insert({
        component_id: null,
        action: 'Request Created',
        to_status: status,
        performed_by_user_id: user.id,
        performed_by_name: user.full_name,
        note: `Request ${String(reqNumber).padStart(5, '0')}-0 created and sent to ${destination}`
      });

      setMessage({ type: 'success', text: `Request ${String(reqNumber).padStart(5, '0')}-0 created successfully!` });
      
      // Reset form
      setIsoNumber('');
      setSpoolNumber('');
      setHfNumber('');
      setDescription('');
      setTestPackNumber('');
      setMaterials([]);
      loadNextNumber();

    } catch (error) {
      setMessage({ type: 'error', text: `Error creating request: ${error.message}` });
    } finally {
      setLoading(false);
    }
  };

  const canModify = user.role === 'admin' || user.perm_requests === 'modify';

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
          Preview: <strong>{String(nextNumber).padStart(5, '0')}-0</strong> (not saved)
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
              {/* Sub-Category */}
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

              {/* ISO Number & Full Spool Number - Equal columns */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                <div>
                  <label style={styles.label}>ISO Number *</label>
                  <input
                    type="text"
                    list="iso-options"
                    value={isoNumber}
                    onChange={(e) => handleIsoChange(e.target.value)}
                    style={styles.input}
                    placeholder="Ex: I181C02-DF21065-0-01"
                    disabled={!canModify}
                  />
                  <datalist id="iso-options">
                    {isoOptions.map(iso => (
                      <option key={iso} value={iso} />
                    ))}
                  </datalist>
                </div>
                <div>
                  <label style={styles.label}>Full Spool Number *</label>
                  <input
                    type="text"
                    value={spoolNumber}
                    onChange={(e) => setSpoolNumber(e.target.value)}
                    style={styles.input}
                    placeholder="Ex: I181C02-DF21065-0-01-SP001"
                    disabled={!canModify}
                  />
                </div>
              </div>

              {/* HF Number - Only visible for Erection */}
              {subCategory === 'Erection' && (
                <div style={{ 
                  marginBottom: '20px', 
                  padding: '16px', 
                  backgroundColor: '#FEF3C7', 
                  borderRadius: '8px',
                  border: '1px solid #F59E0B'
                }}>
                  <label style={{ ...styles.label, color: '#92400E' }}>
                    🔩 HF Number (Flanged Joint) *
                  </label>
                  <input
                    type="text"
                    value={hfNumber}
                    onChange={(e) => setHfNumber(e.target.value)}
                    style={{ ...styles.input, backgroundColor: 'white' }}
                    placeholder="Enter HF Number"
                    disabled={!canModify}
                  />
                  <p style={{ fontSize: '12px', color: '#92400E', marginTop: '6px' }}>
                    Required for Erection materials - identifies the flanged joint
                  </p>
                </div>
              )}

              {/* Optional Description */}
              <div style={{ marginBottom: '20px' }}>
                <label style={styles.label}>Description (optional)</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  style={{ ...styles.input, minHeight: '80px', resize: 'vertical' }}
                  placeholder="Additional notes or description..."
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
              <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '6px' }}>
                For Mechanical requests, ISO Number and Spool fields are not required.
              </p>
            </div>
          )}

          {/* =============== TESTPACK FORM =============== */}
          {requestType === 'TestPack' && (
            <>
              {/* Test Pack Number - Prominent */}
              <div style={{ 
                marginBottom: '20px', 
                padding: '16px', 
                backgroundColor: '#DBEAFE', 
                borderRadius: '8px',
                border: '1px solid #3B82F6'
              }}>
                <label style={{ ...styles.label, color: '#1E40AF' }}>
                  📋 Test Pack Number *
                </label>
                <input
                  type="text"
                  value={testPackNumber}
                  onChange={(e) => setTestPackNumber(e.target.value)}
                  style={{ ...styles.input, backgroundColor: 'white', fontSize: '16px' }}
                  placeholder="Ex: TP-2024-001"
                  disabled={!canModify}
                />
              </div>

              {/* ISO & Spool - DISABLED for TestPack */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                <div style={{ opacity: 0.5 }}>
                  <label style={styles.label}>ISO Number (disabled)</label>
                  <input
                    type="text"
                    value=""
                    style={{ ...styles.input, backgroundColor: '#f3f4f6' }}
                    disabled={true}
                    placeholder="Not used for TestPack"
                  />
                </div>
                <div style={{ opacity: 0.5 }}>
                  <label style={styles.label}>Full Spool Number (disabled)</label>
                  <input
                    type="text"
                    value=""
                    style={{ ...styles.input, backgroundColor: '#f3f4f6' }}
                    disabled={true}
                    placeholder="Not used for TestPack"
                  />
                </div>
              </div>

              {/* Missing Type */}
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
                  <label style={styles.label}>Missing Spool Description</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    style={{ ...styles.input, minHeight: '80px', resize: 'vertical' }}
                    placeholder="Describe the missing spool..."
                    disabled={!canModify}
                  />
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
              <h4 style={{ fontWeight: '600', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                📦 Add Materials
              </h4>
              
              {/* Material Input Row - Fixed equal columns */}
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 100px 80px', gap: '12px', alignItems: 'end' }}>
                <div>
                  <label style={styles.label}>Ident Code</label>
                  <select
                    value={currentMaterial.ident_code}
                    onChange={(e) => setCurrentMaterial({ ...currentMaterial, ident_code: e.target.value })}
                    style={styles.select}
                    disabled={!canModify}
                  >
                    <option value="">Select code...</option>
                    {[...new Set(identOptions.map(o => o.ident_code))].map(code => (
                      <option key={code} value={code}>{code}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={styles.label}>Tag</label>
                  <select
                    value={currentMaterial.tag}
                    onChange={(e) => setCurrentMaterial({ ...currentMaterial, tag: e.target.value })}
                    style={styles.select}
                    disabled={!canModify}
                  >
                    <option value="">None</option>
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

              {/* Materials List */}
              {materials.length > 0 && (
                <table style={{ ...styles.table, marginTop: '16px' }}>
                  <thead>
                    <tr>
                      <th style={styles.th}>Code</th>
                      <th style={styles.th}>Description</th>
                      <th style={styles.th}>Tag</th>
                      <th style={styles.th}>Qty</th>
                      <th style={{ ...styles.th, backgroundColor: COLORS.secondary, color: 'white' }}>YARD</th>
                      <th style={{ ...styles.th, backgroundColor: COLORS.info, color: 'white' }}>SITE</th>
                      <th style={styles.th}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {materials.map((mat, idx) => (
                      <tr key={idx}>
                        <td style={{ ...styles.td, fontFamily: 'monospace', fontWeight: '600' }}>{mat.ident_code}</td>
                        <td style={styles.td}>{mat.description}</td>
                        <td style={styles.td}>{mat.tag || '-'}</td>
                        <td style={styles.td}>{mat.qty}</td>
                        <td style={{ ...styles.td, fontWeight: '600' }}>{mat.qty_yard}</td>
                        <td style={{ ...styles.td, fontWeight: '600' }}>{mat.qty_site}</td>
                        <td style={styles.td}>
                          <button
                            onClick={() => removeMaterial(idx)}
                            style={{ ...styles.actionBtn, backgroundColor: COLORS.primary }}
                          >
                            🗑️
                          </button>
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
            gap: '12px'
          }}>
            <button
              onClick={() => submitRequest('site')}
              disabled={loading || !canModify}
              style={{
                ...styles.button,
                backgroundColor: COLORS.info,
                color: 'white',
                padding: '12px 24px',
                opacity: loading ? 0.7 : 1
              }}
            >
              🏭 Send to Site
            </button>
            <button
              onClick={() => submitRequest('yard')}
              disabled={loading || !canModify}
              style={{
                ...styles.button,
                backgroundColor: COLORS.secondary,
                color: 'white',
                padding: '12px 24px',
                opacity: loading ? 0.7 : 1
              }}
            >
              🏢 Send to Yard
            </button>
            <button
              onClick={() => submitRequest('engineering')}
              disabled={loading || !canModify}
              style={{
                ...styles.button,
                backgroundColor: COLORS.purple,
                color: 'white',
                padding: '12px 24px',
                opacity: loading ? 0.7 : 1
              }}
            >
              ⚙️ Send to Engineering
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// PAGINA WH SITE
// ============================================================
function WHSitePage({ user }) {
  const [components, setComponents] = useState([]);
  const [toCollect, setToCollect] = useState([]);
  const [checkRequests, setCheckRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedComponent, setSelectedComponent] = useState(null);
  const [showPTModal, setShowPTModal] = useState(false);
  const [ptQty, setPtQty] = useState('');
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [passageNote, setPassageNote] = useState('');
  const [passageDestination, setPassageDestination] = useState('');

  useEffect(() => {
    loadComponents();
  }, []);

  const loadComponents = async () => {
    setLoading(true);
    
    // Load components in Site status
    const { data: siteComponents } = await supabase
      .from('request_components')
      .select(`
        *,
        requests (
          request_number,
          sub_number,
          request_type,
          iso_number
        )
      `)
      .eq('status', 'Site');

    if (siteComponents) setComponents(siteComponents);

    // Load ToCollect items
    const { data: collectComponents } = await supabase
      .from('request_components')
      .select(`
        *,
        requests (
          request_number,
          sub_number,
          request_type,
          iso_number
        )
      `)
      .eq('status', 'ToCollect');

    if (collectComponents) setToCollect(collectComponents);

    // Load Check requests from Engineering
    const { data: checks } = await supabase
      .from('request_components')
      .select(`
        *,
        requests (
          request_number,
          sub_number
        )
      `)
      .eq('has_eng_check', true)
      .eq('eng_check_sent_to', 'Site')
      .is('eng_check_site_response', null);

    if (checks) setCheckRequests(checks);

    setLoading(false);
  };

  const handleAction = async (component, action) => {
    try {
      switch (action) {
        case 'ready':
          await supabase
            .from('request_components')
            .update({ status: 'ToCollect' })
            .eq('id', component.id);
          break;
        case 'toYard':
          setSelectedComponent(component);
          setPassageDestination('Yard');
          setShowNoteModal(true);
          return;
        case 'toEng':
          setSelectedComponent(component);
          setPassageDestination('Eng');
          setShowNoteModal(true);
          return;
        case 'pt':
          setSelectedComponent(component);
          setShowPTModal(true);
          return;
        case 'delete':
          if (window.confirm('Are you sure you want to delete this component?')) {
            await supabase
              .from('request_components')
              .delete()
              .eq('id', component.id);
          }
          break;
      }
      loadComponents();
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };

  const handleCheckResponse = async (component, response) => {
    try {
      if (response === 'found') {
        await supabase
          .from('request_components')
          .update({ 
            eng_check_site_response: 'Found',
            status: 'ToCollect',
            has_eng_check: false
          })
          .eq('id', component.id);
      } else if (response === 'notfound') {
        await supabase
          .from('request_components')
          .update({ 
            eng_check_site_response: 'Not Found',
            status: 'Eng',
            has_eng_check: false
          })
          .eq('id', component.id);
      } else if (response === 'partial') {
        setSelectedComponent(component);
        setShowPTModal(true);
      }
      loadComponents();
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };

  const submitPassage = async () => {
    if (!selectedComponent) return;
    try {
      await supabase
        .from('request_components')
        .update({ 
          status: passageDestination,
          passage_note: passageNote,
          current_location: passageDestination === 'Yard' ? 'YARD' : selectedComponent.current_location
        })
        .eq('id', selectedComponent.id);
      
      setShowNoteModal(false);
      setPassageNote('');
      setSelectedComponent(null);
      loadComponents();
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };

  const submitPT = async () => {
    if (!selectedComponent || !ptQty) return;
    const foundQty = parseInt(ptQty);
    const remainingQty = selectedComponent.quantity - foundQty;
    
    if (foundQty <= 0 || foundQty >= selectedComponent.quantity) {
      alert('Quantity must be between 1 and ' + (selectedComponent.quantity - 1));
      return;
    }

    try {
      // Update original to ToCollect with found qty
      await supabase
        .from('request_components')
        .update({ 
          quantity: foundQty,
          status: 'ToCollect',
          has_eng_check: false,
          eng_check_site_response: 'Partial'
        })
        .eq('id', selectedComponent.id);

      // Create new component for remaining
      const { data: reqData } = await supabase
        .from('requests')
        .select('*')
        .eq('id', selectedComponent.request_id)
        .single();

      if (reqData) {
        // Get next sub_number
        const { data: existingReqs } = await supabase
          .from('requests')
          .select('sub_number')
          .eq('request_number', reqData.request_number)
          .order('sub_number', { ascending: false })
          .limit(1);

        const nextSubNumber = existingReqs && existingReqs.length > 0 ? existingReqs[0].sub_number + 1 : 1;

        // Create new request with sub_number
        const { data: newReq } = await supabase
          .from('requests')
          .insert({
            ...reqData,
            id: undefined,
            sub_number: nextSubNumber,
            created_at: new Date().toISOString()
          })
          .select()
          .single();

        if (newReq) {
          await supabase
            .from('request_components')
            .insert({
              request_id: newReq.id,
              ident_code: selectedComponent.ident_code,
              tag: selectedComponent.tag,
              description: selectedComponent.description,
              quantity: remainingQty,
              status: selectedComponent.has_eng_check ? 'Eng' : 'Site'
            });
        }
      }

      setShowPTModal(false);
      setPtQty('');
      setSelectedComponent(null);
      loadComponents();
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };

  const canModify = user.role === 'admin' || user.perm_wh_site === 'modify';

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      {/* Check Requests from Engineering */}
      {checkRequests.length > 0 && (
        <div style={{ 
          backgroundColor: '#F3E8FF', 
          border: '1px solid #A855F7', 
          borderRadius: '8px', 
          padding: '16px', 
          marginBottom: '24px' 
        }}>
          <h4 style={{ fontWeight: '600', color: '#7C3AED', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            🔍 Check Requests from Engineering
          </h4>
          {checkRequests.map(comp => (
            <div key={comp.id} style={{ 
              backgroundColor: 'white', 
              padding: '12px', 
              borderRadius: '6px', 
              marginBottom: '8px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <span style={{ fontFamily: 'monospace', fontWeight: '600' }}>
                  {String(comp.requests?.request_number).padStart(5, '0')}-{comp.requests?.sub_number}
                </span>
                <span style={{ marginLeft: '12px' }}>{comp.ident_code}</span>
                <span style={{ marginLeft: '12px', color: '#6b7280' }}>Qty: {comp.quantity}</span>
                {comp.eng_check_message && (
                  <p style={{ fontSize: '12px', color: '#7C3AED', marginTop: '4px' }}>
                    📝 {comp.eng_check_message}
                  </p>
                )}
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <ActionButton color={COLORS.success} onClick={() => handleCheckResponse(comp, 'found')} title="Found">
                  ✓
                </ActionButton>
                <ActionButton color={COLORS.warning} onClick={() => handleCheckResponse(comp, 'partial')} title="Partial Found">
                  PT
                </ActionButton>
                <ActionButton color={COLORS.primary} onClick={() => handleCheckResponse(comp, 'notfound')} title="Not Found">
                  ✗
                </ActionButton>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Ready OUT - To Collect */}
      {toCollect.length > 0 && (
        <div style={styles.card}>
          <div style={{ ...styles.cardHeader, backgroundColor: '#DCFCE7' }}>
            <h3 style={{ fontWeight: '600', color: '#166534' }}>Ready OUT - To Collect</h3>
          </div>
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
              {toCollect.map(comp => (
                <tr key={comp.id}>
                  <td style={{ ...styles.td, fontFamily: 'monospace', fontWeight: '600' }}>
                    {String(comp.requests?.request_number).padStart(5, '0')}-{comp.requests?.sub_number}
                  </td>
                  <td style={{ ...styles.td, fontFamily: 'monospace' }}>{comp.ident_code}</td>
                  <td style={styles.td}>{comp.description}</td>
                  <td style={styles.td}>{comp.quantity}</td>
                  <td style={styles.td}>
                    <div style={{ display: 'flex', gap: '4px' }}>
                      <ActionButton color={COLORS.success} title="Deliver">📤</ActionButton>
                      <ActionButton color={COLORS.primary} title="Create MIR">📋</ActionButton>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Site Components */}
      <div style={styles.card}>
        <div style={styles.cardHeader}>
          <h3 style={{ fontWeight: '600' }}>Warehouse Site - Components</h3>
        </div>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Request #</th>
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
                <td style={styles.td}>{comp.requests?.request_type}</td>
                <td style={styles.td}>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    <ActionButton color={COLORS.success} onClick={() => handleAction(comp, 'ready')} disabled={!canModify} title="Ready">
                      ✓
                    </ActionButton>
                    <ActionButton color={COLORS.warning} onClick={() => handleAction(comp, 'pt')} disabled={!canModify} title="Partial">
                      PT
                    </ActionButton>
                    <ActionButton color={COLORS.secondary} onClick={() => handleAction(comp, 'toYard')} disabled={!canModify} title="To Yard">
                      Y
                    </ActionButton>
                    <ActionButton color={COLORS.purple} onClick={() => handleAction(comp, 'toEng')} disabled={!canModify} title="To Engineering">
                      UT
                    </ActionButton>
                    <ActionButton color={COLORS.primary} onClick={() => handleAction(comp, 'delete')} disabled={!canModify} title="Delete">
                      🗑️
                    </ActionButton>
                  </div>
                </td>
              </tr>
            ))}
            {components.length === 0 && (
              <tr>
                <td colSpan="6" style={{ ...styles.td, textAlign: 'center', color: '#9ca3af' }}>
                  No components in Site
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Note Modal */}
      <Modal isOpen={showNoteModal} onClose={() => setShowNoteModal(false)} title={`Send to ${passageDestination}`}>
        <div style={{ marginBottom: '16px' }}>
          <label style={styles.label}>Note (optional)</label>
          <textarea
            value={passageNote}
            onChange={(e) => setPassageNote(e.target.value)}
            style={{ ...styles.input, minHeight: '80px' }}
            placeholder="Add a note..."
          />
        </div>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          <button onClick={() => setShowNoteModal(false)} style={{ ...styles.button, ...styles.buttonSecondary }}>
            Cancel
          </button>
          <button onClick={submitPassage} style={{ ...styles.button, ...styles.buttonPrimary }}>
            Send
          </button>
        </div>
      </Modal>

      {/* PT Modal */}
      <Modal isOpen={showPTModal} onClose={() => setShowPTModal(false)} title="Partial - Split Quantity">
        <p style={{ marginBottom: '16px', color: '#6b7280' }}>
          Total quantity: <strong>{selectedComponent?.quantity}</strong>
        </p>
        <div style={{ marginBottom: '16px' }}>
          <label style={styles.label}>Found Quantity</label>
          <input
            type="number"
            value={ptQty}
            onChange={(e) => setPtQty(e.target.value)}
            style={styles.input}
            min="1"
            max={selectedComponent?.quantity - 1}
            placeholder={`Enter quantity found (1-${selectedComponent?.quantity - 1})`}
          />
        </div>
        <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: '16px' }}>
          Found quantity will be marked as ready. Remaining ({selectedComponent?.quantity - parseInt(ptQty || 0)}) will continue in the workflow.
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          <button onClick={() => setShowPTModal(false)} style={{ ...styles.button, ...styles.buttonSecondary }}>
            Cancel
          </button>
          <button onClick={submitPT} style={{ ...styles.button, ...styles.buttonPrimary }}>
            Split
          </button>
        </div>
      </Modal>
    </div>
  );
}

// ============================================================
// PAGINA WH YARD
// ============================================================
function WHYardPage({ user }) {
  const [components, setComponents] = useState([]);
  const [checkRequests, setCheckRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedComponent, setSelectedComponent] = useState(null);
  const [showPTModal, setShowPTModal] = useState(false);
  const [ptQty, setPtQty] = useState('');
  const [inventory, setInventory] = useState({});

  useEffect(() => {
    loadComponents();
  }, []);

  const loadComponents = async () => {
    setLoading(true);
    
    // Load components in Yard status
    const { data: yardComponents } = await supabase
      .from('request_components')
      .select(`
        *,
        requests (
          request_number,
          sub_number,
          request_type,
          iso_number
        )
      `)
      .eq('status', 'Yard');

    if (yardComponents) {
      setComponents(yardComponents);
      
      // Load inventory for these components
      const identCodes = [...new Set(yardComponents.map(c => c.ident_code))];
      if (identCodes.length > 0) {
        const { data: invData } = await supabase
          .from('project_database')
          .select('ident_code, qty_yard')
          .in('ident_code', identCodes);
        
        if (invData) {
          const invMap = {};
          invData.forEach(item => {
            invMap[item.ident_code] = item.qty_yard || 0;
          });
          setInventory(invMap);
        }
      }
    }

    // Load Check requests from Engineering
    const { data: checks } = await supabase
      .from('request_components')
      .select(`
        *,
        requests (
          request_number,
          sub_number
        )
      `)
      .eq('has_eng_check', true)
      .eq('eng_check_sent_to', 'Yard')
      .is('eng_check_yard_response', null);

    if (checks) setCheckRequests(checks);

    setLoading(false);
  };

  const handleAction = async (component, action) => {
    try {
      const available = inventory[component.ident_code] || 0;
      
      switch (action) {
        case 'found':
          if (available < component.quantity) {
            alert(`Insufficient quantity! Available: ${available}, Required: ${component.quantity}`);
            return;
          }
          // Decrease inventory and send to Trans
          await supabase.rpc('decrement_yard_qty', { 
            p_ident_code: component.ident_code, 
            p_qty: component.quantity 
          });
          await supabase
            .from('request_components')
            .update({ status: 'Trans', current_location: 'TRANSIT' })
            .eq('id', component.id);
          break;
        case 'pt':
          setSelectedComponent(component);
          setShowPTModal(true);
          return;
        case 'toEng':
          await supabase
            .from('request_components')
            .update({ status: 'Eng' })
            .eq('id', component.id);
          break;
        case 'toSite':
          await supabase
            .from('request_components')
            .update({ status: 'Site', current_location: 'SITE' })
            .eq('id', component.id);
          break;
        case 'delete':
          if (window.confirm('Delete this component?')) {
            await supabase
              .from('request_components')
              .delete()
              .eq('id', component.id);
          }
          break;
      }
      loadComponents();
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };

  const handleCheckResponse = async (component, response) => {
    try {
      if (response === 'found') {
        // Decrease inventory and mark as ready
        await supabase.rpc('decrement_yard_qty', { 
          p_ident_code: component.ident_code, 
          p_qty: component.quantity 
        });
        await supabase
          .from('request_components')
          .update({ 
            eng_check_yard_response: 'Found',
            status: 'Trans',
            has_eng_check: false
          })
          .eq('id', component.id);
      } else if (response === 'notfound') {
        await supabase
          .from('request_components')
          .update({ 
            eng_check_yard_response: 'Not Found',
            status: 'Eng',
            has_eng_check: false
          })
          .eq('id', component.id);
      } else if (response === 'partial') {
        setSelectedComponent(component);
        setShowPTModal(true);
      }
      loadComponents();
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };

  const submitPT = async () => {
    if (!selectedComponent || !ptQty) return;
    const foundQty = parseInt(ptQty);
    const available = inventory[selectedComponent.ident_code] || 0;
    
    if (foundQty <= 0 || foundQty > available) {
      alert(`Invalid quantity. Available: ${available}`);
      return;
    }

    try {
      // Decrease inventory by found amount
      await supabase.rpc('decrement_yard_qty', { 
        p_ident_code: selectedComponent.ident_code, 
        p_qty: foundQty 
      });

      // Update original to Trans with found qty
      await supabase
        .from('request_components')
        .update({ 
          quantity: foundQty,
          status: 'Trans',
          has_eng_check: false,
          eng_check_yard_response: 'Partial'
        })
        .eq('id', selectedComponent.id);

      // Create new component for remaining qty
      const remainingQty = selectedComponent.quantity - foundQty;
      
      const { data: reqData } = await supabase
        .from('requests')
        .select('*')
        .eq('id', selectedComponent.request_id)
        .single();

      if (reqData) {
        const { data: existingReqs } = await supabase
          .from('requests')
          .select('sub_number')
          .eq('request_number', reqData.request_number)
          .order('sub_number', { ascending: false })
          .limit(1);

        const nextSubNumber = existingReqs?.length > 0 ? existingReqs[0].sub_number + 1 : 1;

        const { data: newReq } = await supabase
          .from('requests')
          .insert({
            ...reqData,
            id: undefined,
            sub_number: nextSubNumber,
            created_at: new Date().toISOString()
          })
          .select()
          .single();

        if (newReq) {
          await supabase
            .from('request_components')
            .insert({
              request_id: newReq.id,
              ident_code: selectedComponent.ident_code,
              tag: selectedComponent.tag,
              description: selectedComponent.description,
              quantity: remainingQty,
              status: 'Eng'
            });
        }
      }

      setShowPTModal(false);
      setPtQty('');
      setSelectedComponent(null);
      loadComponents();
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };

  const canModify = user.role === 'admin' || user.perm_wh_yard === 'modify';

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      {/* Check Requests from Engineering */}
      {checkRequests.length > 0 && (
        <div style={{ 
          backgroundColor: '#F3E8FF', 
          border: '1px solid #A855F7', 
          borderRadius: '8px', 
          padding: '16px', 
          marginBottom: '24px' 
        }}>
          <h4 style={{ fontWeight: '600', color: '#7C3AED', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            🔍 Check Requests from Engineering
          </h4>
          {checkRequests.map(comp => {
            const available = inventory[comp.ident_code] || 0;
            return (
              <div key={comp.id} style={{ 
                backgroundColor: 'white', 
                padding: '12px', 
                borderRadius: '6px', 
                marginBottom: '8px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div>
                  <span style={{ fontFamily: 'monospace', fontWeight: '600' }}>
                    {String(comp.requests?.request_number).padStart(5, '0')}-{comp.requests?.sub_number}
                  </span>
                  <span style={{ marginLeft: '12px' }}>{comp.ident_code}</span>
                  <span style={{ marginLeft: '12px', color: '#6b7280' }}>Need: {comp.quantity}</span>
                  <span style={{ 
                    marginLeft: '12px', 
                    color: available >= comp.quantity ? COLORS.success : COLORS.primary,
                    fontWeight: '600'
                  }}>
                    Available: {available}
                  </span>
                  {comp.eng_check_message && (
                    <p style={{ fontSize: '12px', color: '#7C3AED', marginTop: '4px' }}>
                      📝 {comp.eng_check_message}
                    </p>
                  )}
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <ActionButton 
                    color={COLORS.success} 
                    onClick={() => handleCheckResponse(comp, 'found')} 
                    disabled={available < comp.quantity}
                    title="Found"
                  >
                    ✓
                  </ActionButton>
                  <ActionButton 
                    color={COLORS.warning} 
                    onClick={() => handleCheckResponse(comp, 'partial')} 
                    disabled={available === 0}
                    title="Partial Found"
                  >
                    PT
                  </ActionButton>
                  <ActionButton 
                    color={COLORS.primary} 
                    onClick={() => handleCheckResponse(comp, 'notfound')} 
                    title="Not Found"
                  >
                    ✗
                  </ActionButton>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Yard Components */}
      <div style={styles.card}>
        <div style={styles.cardHeader}>
          <h3 style={{ fontWeight: '600' }}>Warehouse Yard - Components</h3>
        </div>
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
            {components.map(comp => {
              const available = inventory[comp.ident_code] || 0;
              const hasEnough = available >= comp.quantity;
              
              return (
                <tr key={comp.id}>
                  <td style={{ ...styles.td, fontFamily: 'monospace', fontWeight: '600' }}>
                    {String(comp.requests?.request_number).padStart(5, '0')}-{comp.requests?.sub_number}
                  </td>
                  <td style={{ ...styles.td, fontFamily: 'monospace' }}>{comp.ident_code}</td>
                  <td style={styles.td}>{comp.description}</td>
                  <td style={styles.td}>{comp.quantity}</td>
                  <td style={{ 
                    ...styles.td, 
                    fontWeight: '600',
                    color: hasEnough ? COLORS.success : COLORS.primary
                  }}>
                    {available}
                  </td>
                  <td style={styles.td}>
                    <div style={{ display: 'flex', gap: '4px' }}>
                      <ActionButton 
                        color={COLORS.success} 
                        onClick={() => handleAction(comp, 'found')} 
                        disabled={!canModify || !hasEnough} 
                        title={hasEnough ? "Found/Transfer" : "Insufficient qty"}
                      >
                        ✓
                      </ActionButton>
                      <ActionButton 
                        color={COLORS.warning} 
                        onClick={() => handleAction(comp, 'pt')} 
                        disabled={!canModify || available === 0} 
                        title="Partial"
                      >
                        PT
                      </ActionButton>
                      <ActionButton 
                        color={COLORS.purple} 
                        onClick={() => handleAction(comp, 'toEng')} 
                        disabled={!canModify} 
                        title="To Engineering"
                      >
                        UT
                      </ActionButton>
                      <ActionButton 
                        color={COLORS.gray} 
                        onClick={() => handleAction(comp, 'toSite')} 
                        disabled={!canModify} 
                        title="Return to Site"
                      >
                        ↩
                      </ActionButton>
                      <ActionButton 
                        color={COLORS.primary} 
                        onClick={() => handleAction(comp, 'delete')} 
                        disabled={!canModify} 
                        title="Delete"
                      >
                        🗑️
                      </ActionButton>
                    </div>
                  </td>
                </tr>
              );
            })}
            {components.length === 0 && (
              <tr>
                <td colSpan="6" style={{ ...styles.td, textAlign: 'center', color: '#9ca3af' }}>
                  No components in Yard
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* PT Modal */}
      <Modal isOpen={showPTModal} onClose={() => setShowPTModal(false)} title="Partial - Split Quantity">
        <p style={{ marginBottom: '8px', color: '#6b7280' }}>
          Requested: <strong>{selectedComponent?.quantity}</strong>
        </p>
        <p style={{ marginBottom: '16px', color: '#6b7280' }}>
          Available in Yard: <strong>{inventory[selectedComponent?.ident_code] || 0}</strong>
        </p>
        <div style={{ marginBottom: '16px' }}>
          <label style={styles.label}>Quantity to Transfer</label>
          <input
            type="number"
            value={ptQty}
            onChange={(e) => setPtQty(e.target.value)}
            style={styles.input}
            min="1"
            max={Math.min(selectedComponent?.quantity - 1, inventory[selectedComponent?.ident_code] || 0)}
            placeholder="Enter quantity found"
          />
        </div>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          <button onClick={() => setShowPTModal(false)} style={{ ...styles.button, ...styles.buttonSecondary }}>
            Cancel
          </button>
          <button onClick={submitPT} style={{ ...styles.button, ...styles.buttonPrimary }}>
            Split & Transfer
          </button>
        </div>
      </Modal>
    </div>
  );
}

// ============================================================
// PAGINA ENGINEERING
// ============================================================
function EngineeringPage({ user }) {
  const [components, setComponents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedComponent, setSelectedComponent] = useState(null);
  const [showCheckModal, setShowCheckModal] = useState(false);
  const [checkDestination, setCheckDestination] = useState('Site');
  const [checkMessage, setCheckMessage] = useState('');
  const [showPTModal, setShowPTModal] = useState(false);
  const [ptQty, setPtQty] = useState('');
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [noteText, setNoteText] = useState('');
  const [noteDestination, setNoteDestination] = useState('');

  useEffect(() => {
    loadComponents();
  }, []);

  const loadComponents = async () => {
    setLoading(true);
    
    const { data } = await supabase
      .from('request_components')
      .select(`
        *,
        requests (
          request_number,
          sub_number,
          request_type,
          sub_category,
          iso_number
        )
      `)
      .eq('status', 'Eng');

    if (data) setComponents(data);
    setLoading(false);
  };

  const handleAction = async (component, action) => {
    try {
      switch (action) {
        case 'resolved':
          await supabase
            .from('request_components')
            .update({ status: 'ToCollect' })
            .eq('id', component.id);
          break;
        case 'check':
          setSelectedComponent(component);
          setShowCheckModal(true);
          return;
        case 'pt':
          setSelectedComponent(component);
          setShowPTModal(true);
          return;
        case 'spare':
          await supabase
            .from('request_components')
            .update({ status: 'Spare', spare_request_date: new Date().toISOString() })
            .eq('id', component.id);
          break;
        case 'mng':
          setSelectedComponent(component);
          setNoteDestination('Mng');
          setShowNoteModal(true);
          return;
        case 'return':
          await supabase
            .from('request_components')
            .update({ status: 'Site' })
            .eq('id', component.id);
          break;
        case 'delete':
          if (window.confirm('Delete this component?')) {
            await supabase
              .from('request_components')
              .delete()
              .eq('id', component.id);
          }
          break;
      }
      loadComponents();
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };

  const submitCheck = async () => {
    if (!selectedComponent) return;
    try {
      await supabase
        .from('request_components')
        .update({ 
          has_eng_check: true,
          eng_check_sent_to: checkDestination,
          eng_check_message: checkMessage,
          eng_check_site_response: null,
          eng_check_yard_response: null
        })
        .eq('id', selectedComponent.id);
      
      setShowCheckModal(false);
      setCheckMessage('');
      setSelectedComponent(null);
      loadComponents();
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };

  const submitNote = async () => {
    if (!selectedComponent) return;
    try {
      await supabase
        .from('request_components')
        .update({ 
          status: noteDestination,
          eng_note: noteText
        })
        .eq('id', selectedComponent.id);
      
      setShowNoteModal(false);
      setNoteText('');
      setSelectedComponent(null);
      loadComponents();
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };

  const submitPT = async () => {
    if (!selectedComponent || !ptQty) return;
    const resolvedQty = parseInt(ptQty);
    const remainingQty = selectedComponent.quantity - resolvedQty;
    
    if (resolvedQty <= 0 || resolvedQty >= selectedComponent.quantity) {
      alert('Invalid quantity');
      return;
    }

    try {
      await supabase
        .from('request_components')
        .update({ 
          quantity: resolvedQty,
          status: 'ToCollect'
        })
        .eq('id', selectedComponent.id);

      const { data: reqData } = await supabase
        .from('requests')
        .select('*')
        .eq('id', selectedComponent.request_id)
        .single();

      if (reqData) {
        const { data: existingReqs } = await supabase
          .from('requests')
          .select('sub_number')
          .eq('request_number', reqData.request_number)
          .order('sub_number', { ascending: false })
          .limit(1);

        const nextSubNumber = existingReqs?.length > 0 ? existingReqs[0].sub_number + 1 : 1;

        const { data: newReq } = await supabase
          .from('requests')
          .insert({
            ...reqData,
            id: undefined,
            sub_number: nextSubNumber,
            created_at: new Date().toISOString()
          })
          .select()
          .single();

        if (newReq) {
          await supabase
            .from('request_components')
            .insert({
              request_id: newReq.id,
              ident_code: selectedComponent.ident_code,
              tag: selectedComponent.tag,
              description: selectedComponent.description,
              quantity: remainingQty,
              status: 'Eng'
            });
        }
      }

      setShowPTModal(false);
      setPtQty('');
      setSelectedComponent(null);
      loadComponents();
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };

  const canModify = user.role === 'admin' || user.perm_engineering === 'modify';

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <div style={styles.card}>
        <div style={styles.cardHeader}>
          <h3 style={{ fontWeight: '600' }}>Engineering (UT) - Components Under Review</h3>
        </div>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Request #</th>
              <th style={styles.th}>Code</th>
              <th style={styles.th}>Description</th>
              <th style={styles.th}>Qty</th>
              <th style={styles.th}>Category</th>
              <th style={styles.th}>Check Status</th>
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
                  {comp.has_eng_check ? (
                    <span style={{ ...styles.statusBadge, backgroundColor: COLORS.purple }}>
                      🔍 Sent to {comp.eng_check_sent_to}
                    </span>
                  ) : (
                    <span style={{ color: '#9ca3af' }}>-</span>
                  )}
                </td>
                <td style={styles.td}>
                  <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                    <ActionButton 
                      color={COLORS.success} 
                      onClick={() => handleAction(comp, 'resolved')} 
                      disabled={!canModify || comp.has_eng_check} 
                      title="Resolved"
                    >
                      ✓
                    </ActionButton>
                    <ActionButton 
                      color={COLORS.purple} 
                      onClick={() => handleAction(comp, 'check')} 
                      disabled={!canModify || comp.has_eng_check} 
                      title="Send Check"
                    >
                      🔍
                    </ActionButton>
                    <ActionButton 
                      color={COLORS.warning} 
                      onClick={() => handleAction(comp, 'pt')} 
                      disabled={!canModify} 
                      title="Partial"
                    >
                      PT
                    </ActionButton>
                    <ActionButton 
                      color={COLORS.pink} 
                      onClick={() => handleAction(comp, 'spare')} 
                      disabled={!canModify} 
                      title="Spare Parts"
                    >
                      Sp
                    </ActionButton>
                    <ActionButton 
                      color={COLORS.yellow} 
                      onClick={() => handleAction(comp, 'mng')} 
                      disabled={!canModify} 
                      title="Management"
                    >
                      Mng
                    </ActionButton>
                    <ActionButton 
                      color={COLORS.gray} 
                      onClick={() => handleAction(comp, 'return')} 
                      disabled={!canModify} 
                      title="Return"
                    >
                      ↩
                    </ActionButton>
                    <ActionButton 
                      color={COLORS.primary} 
                      onClick={() => handleAction(comp, 'delete')} 
                      disabled={!canModify} 
                      title="Delete"
                    >
                      🗑️
                    </ActionButton>
                  </div>
                </td>
              </tr>
            ))}
            {components.length === 0 && (
              <tr>
                <td colSpan="7" style={{ ...styles.td, textAlign: 'center', color: '#9ca3af' }}>
                  No components in Engineering
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Check Modal */}
      <Modal isOpen={showCheckModal} onClose={() => setShowCheckModal(false)} title="Send Check Request">
        <div style={{ marginBottom: '16px' }}>
          <label style={styles.label}>Send to</label>
          <div style={{ display: 'flex', gap: '16px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              <input
                type="radio"
                name="checkDest"
                value="Site"
                checked={checkDestination === 'Site'}
                onChange={(e) => setCheckDestination(e.target.value)}
              />
              WH Site
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              <input
                type="radio"
                name="checkDest"
                value="Yard"
                checked={checkDestination === 'Yard'}
                onChange={(e) => setCheckDestination(e.target.value)}
              />
              WH Yard
            </label>
          </div>
        </div>
        <div style={{ marginBottom: '16px' }}>
          <label style={styles.label}>Message / Instructions</label>
          <textarea
            value={checkMessage}
            onChange={(e) => setCheckMessage(e.target.value)}
            style={{ ...styles.input, minHeight: '80px' }}
            placeholder="Please recheck location, quantity, etc..."
          />
        </div>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          <button onClick={() => setShowCheckModal(false)} style={{ ...styles.button, ...styles.buttonSecondary }}>
            Cancel
          </button>
          <button onClick={submitCheck} style={{ ...styles.button, backgroundColor: COLORS.purple, color: 'white' }}>
            Send Check 🔍
          </button>
        </div>
      </Modal>

      {/* Note Modal for Management */}
      <Modal isOpen={showNoteModal} onClose={() => setShowNoteModal(false)} title="Send to Management">
        <div style={{ marginBottom: '16px' }}>
          <label style={styles.label}>Note / Reason</label>
          <textarea
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            style={{ ...styles.input, minHeight: '80px' }}
            placeholder="Explain why this needs management decision..."
          />
        </div>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          <button onClick={() => setShowNoteModal(false)} style={{ ...styles.button, ...styles.buttonSecondary }}>
            Cancel
          </button>
          <button onClick={submitNote} style={{ ...styles.button, backgroundColor: COLORS.yellow, color: 'white' }}>
            Send to Management
          </button>
        </div>
      </Modal>

      {/* PT Modal */}
      <Modal isOpen={showPTModal} onClose={() => setShowPTModal(false)} title="Partial - Split Quantity">
        <p style={{ marginBottom: '16px', color: '#6b7280' }}>
          Total quantity: <strong>{selectedComponent?.quantity}</strong>
        </p>
        <div style={{ marginBottom: '16px' }}>
          <label style={styles.label}>Resolved Quantity</label>
          <input
            type="number"
            value={ptQty}
            onChange={(e) => setPtQty(e.target.value)}
            style={styles.input}
            min="1"
            max={selectedComponent?.quantity - 1}
          />
        </div>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          <button onClick={() => setShowPTModal(false)} style={{ ...styles.button, ...styles.buttonSecondary }}>
            Cancel
          </button>
          <button onClick={submitPT} style={{ ...styles.button, ...styles.buttonPrimary }}>
            Split
          </button>
        </div>
      </Modal>
    </div>
  );
}

// ============================================================
// PAGINA SITE IN
// ============================================================
function SiteInPage({ user }) {
  const [components, setComponents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadComponents();
  }, []);

  const loadComponents = async () => {
    setLoading(true);
    
    const { data } = await supabase
      .from('request_components')
      .select(`
        *,
        requests (
          request_number,
          sub_number,
          request_type
        )
      `)
      .eq('status', 'Trans');

    if (data) setComponents(data);
    setLoading(false);
  };

  const handleConfirm = async (component) => {
    try {
      // Increment site inventory
      await supabase.rpc('increment_site_qty', { 
        p_ident_code: component.ident_code, 
        p_qty: component.quantity 
      });

      // Update status to Site (ready for collection)
      await supabase
        .from('request_components')
        .update({ 
          status: 'Site',
          current_location: 'SITE'
        })
        .eq('id', component.id);

      // Log movement
      await supabase.from('movements').insert({
        ident_code: component.ident_code,
        movement_type: 'IN',
        quantity: component.quantity,
        from_location: 'YARD',
        to_location: 'SITE',
        note: `Transfer from Yard - Request ${component.requests?.request_number}`,
        performed_by: user.full_name
      });

      loadComponents();
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };

  const canModify = user.role === 'admin' || user.perm_site_in === 'modify';

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <div style={styles.card}>
        <div style={styles.cardHeader}>
          <h3 style={{ fontWeight: '600' }}>Site IN - Materials in Transit from Yard</h3>
        </div>
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
                    onClick={() => handleConfirm(comp)}
                    disabled={!canModify}
                    style={{ ...styles.button, backgroundColor: COLORS.success, color: 'white' }}
                  >
                    ✓ Confirm Arrival
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
// PAGINA SPARE PARTS
// ============================================================
function SparePartsPage({ user }) {
  const [components, setComponents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedComponent, setSelectedComponent] = useState(null);
  const [showMngModal, setShowMngModal] = useState(false);
  const [mngNote, setMngNote] = useState('');

  useEffect(() => {
    loadComponents();
  }, []);

  const loadComponents = async () => {
    setLoading(true);
    
    const { data } = await supabase
      .from('request_components')
      .select(`
        *,
        requests (
          request_number,
          sub_number,
          request_type
        )
      `)
      .eq('status', 'Spare');

    if (data) setComponents(data);
    setLoading(false);
  };

  const handleClientHas = async (component) => {
    try {
      await supabase
        .from('request_components')
        .update({ status: 'ToCollect' })
        .eq('id', component.id);
      loadComponents();
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };

  const handleNoSpare = (component) => {
    setSelectedComponent(component);
    setShowMngModal(true);
  };

  const submitToMng = async () => {
    if (!selectedComponent) return;
    try {
      await supabase
        .from('request_components')
        .update({ 
          status: 'Mng',
          mng_note: mngNote || 'Client does not have spare parts - needs purchase'
        })
        .eq('id', selectedComponent.id);
      
      setShowMngModal(false);
      setMngNote('');
      setSelectedComponent(null);
      loadComponents();
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };

  const canModify = user.role === 'admin' || user.perm_spare_parts === 'modify';

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <div style={styles.card}>
        <div style={styles.cardHeader}>
          <h3 style={{ fontWeight: '600' }}>Spare Parts - Client Request</h3>
        </div>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Request #</th>
              <th style={styles.th}>Code</th>
              <th style={styles.th}>Description</th>
              <th style={styles.th}>Qty</th>
              <th style={styles.th}>Request Date</th>
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
                  {comp.spare_request_date ? new Date(comp.spare_request_date).toLocaleDateString() : '-'}
                </td>
                <td style={styles.td}>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => handleClientHas(comp)}
                      disabled={!canModify}
                      style={{ ...styles.button, backgroundColor: COLORS.success, color: 'white' }}
                    >
                      ✓ Client Has It
                    </button>
                    <button
                      onClick={() => handleNoSpare(comp)}
                      disabled={!canModify}
                      style={{ ...styles.button, backgroundColor: COLORS.yellow, color: 'white' }}
                    >
                      ✗ No Spare → Mng
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {components.length === 0 && (
              <tr>
                <td colSpan="6" style={{ ...styles.td, textAlign: 'center', color: '#9ca3af' }}>
                  No spare parts requests
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Management Modal */}
      <Modal isOpen={showMngModal} onClose={() => setShowMngModal(false)} title="Send to Management">
        <p style={{ marginBottom: '16px', color: '#6b7280' }}>
          Client does not have this spare part. This will be sent to Management for purchase decision.
        </p>
        <div style={{ marginBottom: '16px' }}>
          <label style={styles.label}>Additional Note (optional)</label>
          <textarea
            value={mngNote}
            onChange={(e) => setMngNote(e.target.value)}
            style={{ ...styles.input, minHeight: '80px' }}
            placeholder="Add any additional information..."
          />
        </div>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          <button onClick={() => setShowMngModal(false)} style={{ ...styles.button, ...styles.buttonSecondary }}>
            Cancel
          </button>
          <button onClick={submitToMng} style={{ ...styles.button, backgroundColor: COLORS.yellow, color: 'white' }}>
            Send to Management
          </button>
        </div>
      </Modal>
    </div>
  );
}

// ============================================================
// PAGINA ORDERS
// ============================================================
function OrdersPage({ user }) {
  const [activeTab, setActiveTab] = useState('toOrder');
  const [toOrderComponents, setToOrderComponents] = useState([]);
  const [orderedComponents, setOrderedComponents] = useState([]);
  const [orderLog, setOrderLog] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedComponent, setSelectedComponent] = useState(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [expectedDate, setExpectedDate] = useState('');

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    setLoading(true);
    
    if (activeTab === 'toOrder') {
      const { data } = await supabase
        .from('request_components')
        .select(`*, requests (request_number, sub_number)`)
        .eq('status', 'Order');
      if (data) setToOrderComponents(data);
    } else if (activeTab === 'ordered') {
      const { data } = await supabase
        .from('request_components')
        .select(`*, requests (request_number, sub_number)`)
        .eq('status', 'Ordered');
      if (data) setOrderedComponents(data);
    } else {
      const { data } = await supabase
        .from('order_log')
        .select('*')
        .order('created_at', { ascending: false });
      if (data) setOrderLog(data);
    }
    
    setLoading(false);
  };

  const handleOrder = (component) => {
    setSelectedComponent(component);
    setShowOrderModal(true);
  };

  const submitOrder = async () => {
    if (!selectedComponent || !expectedDate) return;
    try {
      await supabase
        .from('request_components')
        .update({ 
          status: 'Ordered',
          order_date: new Date().toISOString(),
          order_forecast: expectedDate
        })
        .eq('id', selectedComponent.id);

      await supabase.from('order_log').insert({
        component_id: selectedComponent.id,
        ident_code: selectedComponent.ident_code,
        quantity: selectedComponent.quantity,
        order_type: selectedComponent.order_type,
        expected_date: expectedDate,
        ordered_by: user.full_name
      });

      setShowOrderModal(false);
      setExpectedDate('');
      setSelectedComponent(null);
      loadData();
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };

  const canModify = user.role === 'admin' || user.perm_orders === 'modify';

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      {/* Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
        {['toOrder', 'ordered', 'log'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              ...styles.button,
              backgroundColor: activeTab === tab ? 'white' : '#e5e7eb',
              color: activeTab === tab ? COLORS.secondary : '#6b7280',
              boxShadow: activeTab === tab ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
            }}
          >
            {tab === 'toOrder' ? 'To Order' : tab === 'ordered' ? 'Ordered' : 'Log'}
          </button>
        ))}
      </div>

      <div style={styles.card}>
        <div style={styles.cardHeader}>
          <h3 style={{ fontWeight: '600' }}>
            {activeTab === 'toOrder' ? 'To Order' : activeTab === 'ordered' ? 'Ordered' : 'Order Log'}
          </h3>
        </div>

        {activeTab === 'toOrder' && (
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Request #</th>
                <th style={styles.th}>Code</th>
                <th style={styles.th}>Description</th>
                <th style={styles.th}>Qty</th>
                <th style={styles.th}>Type</th>
                <th style={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {toOrderComponents.map(comp => (
                <tr key={comp.id}>
                  <td style={{ ...styles.td, fontFamily: 'monospace', fontWeight: '600' }}>
                    {String(comp.requests?.request_number).padStart(5, '0')}-{comp.requests?.sub_number}
                  </td>
                  <td style={{ ...styles.td, fontFamily: 'monospace' }}>{comp.ident_code}</td>
                  <td style={styles.td}>{comp.description}</td>
                  <td style={styles.td}>{comp.quantity}</td>
                  <td style={styles.td}>
                    <span style={{ 
                      ...styles.statusBadge, 
                      backgroundColor: comp.order_type === 'Internal' ? COLORS.info : COLORS.cyan 
                    }}>
                      {comp.order_type || 'Internal'}
                    </span>
                  </td>
                  <td style={styles.td}>
                    <button
                      onClick={() => handleOrder(comp)}
                      disabled={!canModify}
                      style={{ ...styles.button, backgroundColor: COLORS.success, color: 'white' }}
                    >
                      🛒 Order
                    </button>
                  </td>
                </tr>
              ))}
              {toOrderComponents.length === 0 && (
                <tr>
                  <td colSpan="6" style={{ ...styles.td, textAlign: 'center', color: '#9ca3af' }}>
                    No items to order
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}

        {activeTab === 'ordered' && (
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Request #</th>
                <th style={styles.th}>Code</th>
                <th style={styles.th}>Qty</th>
                <th style={styles.th}>Order Date</th>
                <th style={styles.th}>Expected</th>
              </tr>
            </thead>
            <tbody>
              {orderedComponents.map(comp => (
                <tr key={comp.id}>
                  <td style={{ ...styles.td, fontFamily: 'monospace', fontWeight: '600' }}>
                    {String(comp.requests?.request_number).padStart(5, '0')}-{comp.requests?.sub_number}
                  </td>
                  <td style={{ ...styles.td, fontFamily: 'monospace' }}>{comp.ident_code}</td>
                  <td style={styles.td}>{comp.quantity}</td>
                  <td style={styles.td}>{comp.order_date ? new Date(comp.order_date).toLocaleDateString() : '-'}</td>
                  <td style={styles.td}>{comp.order_forecast ? new Date(comp.order_forecast).toLocaleDateString() : '-'}</td>
                </tr>
              ))}
              {orderedComponents.length === 0 && (
                <tr>
                  <td colSpan="5" style={{ ...styles.td, textAlign: 'center', color: '#9ca3af' }}>
                    No ordered items
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}

        {activeTab === 'log' && (
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Date</th>
                <th style={styles.th}>Code</th>
                <th style={styles.th}>Qty</th>
                <th style={styles.th}>Type</th>
                <th style={styles.th}>Expected</th>
                <th style={styles.th}>Ordered By</th>
              </tr>
            </thead>
            <tbody>
              {orderLog.map((log, idx) => (
                <tr key={idx}>
                  <td style={styles.td}>{new Date(log.created_at).toLocaleDateString()}</td>
                  <td style={{ ...styles.td, fontFamily: 'monospace' }}>{log.ident_code}</td>
                  <td style={styles.td}>{log.quantity}</td>
                  <td style={styles.td}>{log.order_type || 'Internal'}</td>
                  <td style={styles.td}>{log.expected_date ? new Date(log.expected_date).toLocaleDateString() : '-'}</td>
                  <td style={styles.td}>{log.ordered_by}</td>
                </tr>
              ))}
              {orderLog.length === 0 && (
                <tr>
                  <td colSpan="6" style={{ ...styles.td, textAlign: 'center', color: '#9ca3af' }}>
                    No order history
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Order Modal */}
      <Modal isOpen={showOrderModal} onClose={() => setShowOrderModal(false)} title="Place Order">
        <p style={{ marginBottom: '16px' }}>
          <strong>{selectedComponent?.ident_code}</strong> - Qty: {selectedComponent?.quantity}
        </p>
        <div style={{ marginBottom: '16px' }}>
          <label style={styles.label}>Expected Delivery Date</label>
          <input
            type="date"
            value={expectedDate}
            onChange={(e) => setExpectedDate(e.target.value)}
            style={styles.input}
          />
        </div>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          <button onClick={() => setShowOrderModal(false)} style={{ ...styles.button, ...styles.buttonSecondary }}>
            Cancel
          </button>
          <button onClick={submitOrder} style={{ ...styles.button, backgroundColor: COLORS.success, color: 'white' }}>
            Confirm Order
          </button>
        </div>
      </Modal>
    </div>
  );
}

// ============================================================
// PAGINA MANAGEMENT
// ============================================================
function ManagementPage({ user }) {
  const [components, setComponents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadComponents();
  }, []);

  const loadComponents = async () => {
    setLoading(true);
    
    const { data } = await supabase
      .from('request_components')
      .select(`
        *,
        requests (
          request_number,
          sub_number,
          request_type
        )
      `)
      .eq('status', 'Mng');

    if (data) setComponents(data);
    setLoading(false);
  };

  const handleDecision = async (component, orderType) => {
    try {
      await supabase
        .from('request_components')
        .update({ 
          status: 'Order',
          order_type: orderType
        })
        .eq('id', component.id);
      loadComponents();
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };

  const canModify = user.role === 'admin' || user.perm_management === 'modify';

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <div style={styles.card}>
        <div style={styles.cardHeader}>
          <h3 style={{ fontWeight: '600' }}>Management - Purchase Decisions</h3>
        </div>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Request #</th>
              <th style={styles.th}>Code</th>
              <th style={styles.th}>Description</th>
              <th style={styles.th}>Qty</th>
              <th style={styles.th}>Note</th>
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
                <td style={{ ...styles.td, fontSize: '12px', color: '#6b7280' }}>{comp.mng_note || comp.eng_note || '-'}</td>
                <td style={styles.td}>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => handleDecision(comp, 'Internal')}
                      disabled={!canModify}
                      style={{ ...styles.button, backgroundColor: COLORS.info, color: 'white' }}
                    >
                      🏢 Internal Order
                    </button>
                    <button
                      onClick={() => handleDecision(comp, 'Client')}
                      disabled={!canModify}
                      style={{ ...styles.button, backgroundColor: COLORS.cyan, color: 'white' }}
                    >
                      👤 Client Order
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {components.length === 0 && (
              <tr>
                <td colSpan="6" style={{ ...styles.td, textAlign: 'center', color: '#9ca3af' }}>
                  No items pending management decision
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
// PAGINA MIR
// ============================================================
function MIRPage({ user }) {
  const [mirs, setMirs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newMir, setNewMir] = useState({ category: 'Bulk', priority: 'Normal', expected_date: '' });

  useEffect(() => {
    loadMirs();
  }, []);

  const loadMirs = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('mirs')
      .select('*')
      .order('created_at', { ascending: false });
    if (data) setMirs(data);
    setLoading(false);
  };

  const createMir = async () => {
    try {
      await supabase.from('mirs').insert({
        ...newMir,
        created_by: user.id,
        status: 'Open'
      });
      setShowCreateModal(false);
      setNewMir({ category: 'Bulk', priority: 'Normal', expected_date: '' });
      loadMirs();
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };

  const canModify = user.role === 'admin' || user.perm_mir === 'modify';

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }}>
        <button
          onClick={() => setShowCreateModal(true)}
          disabled={!canModify}
          style={{ ...styles.button, ...styles.buttonPrimary }}
        >
          + New MIR
        </button>
      </div>

      <div style={styles.card}>
        <div style={styles.cardHeader}>
          <h3 style={{ fontWeight: '600' }}>Material Issue Reports</h3>
        </div>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>MIR #</th>
              <th style={styles.th}>Category</th>
              <th style={styles.th}>Priority</th>
              <th style={styles.th}>Status</th>
              <th style={styles.th}>Created</th>
              <th style={styles.th}>Expected</th>
            </tr>
          </thead>
          <tbody>
            {mirs.map(mir => (
              <tr key={mir.id}>
                <td style={{ ...styles.td, fontFamily: 'monospace', fontWeight: '600' }}>
                  MIR-{String(mir.id).slice(-6)}
                </td>
                <td style={styles.td}>{mir.category}</td>
                <td style={styles.td}>
                  <span style={{
                    ...styles.statusBadge,
                    backgroundColor: mir.priority === 'High' ? COLORS.primary : 
                                    mir.priority === 'Urgent' ? COLORS.orange : COLORS.gray
                  }}>
                    {mir.priority}
                  </span>
                </td>
                <td style={styles.td}>
                  <span style={{
                    ...styles.statusBadge,
                    backgroundColor: mir.status === 'Open' ? COLORS.info : 
                                    mir.status === 'Closed' ? COLORS.success : COLORS.gray
                  }}>
                    {mir.status}
                  </span>
                </td>
                <td style={styles.td}>{new Date(mir.created_at).toLocaleDateString()}</td>
                <td style={styles.td}>{mir.expected_date ? new Date(mir.expected_date).toLocaleDateString() : '-'}</td>
              </tr>
            ))}
            {mirs.length === 0 && (
              <tr>
                <td colSpan="6" style={{ ...styles.td, textAlign: 'center', color: '#9ca3af' }}>
                  No MIRs created
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Create MIR Modal */}
      <Modal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} title="+ New MIR">
        <div style={{ marginBottom: '16px' }}>
          <label style={styles.label}>Category</label>
          <select
            value={newMir.category}
            onChange={(e) => setNewMir({ ...newMir, category: e.target.value })}
            style={styles.select}
          >
            {MIR_CATEGORIES.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
        <div style={{ marginBottom: '16px' }}>
          <label style={styles.label}>Priority</label>
          <select
            value={newMir.priority}
            onChange={(e) => setNewMir({ ...newMir, priority: e.target.value })}
            style={styles.select}
          >
            <option value="Normal">Normal</option>
            <option value="High">High</option>
            <option value="Urgent">Urgent</option>
          </select>
        </div>
        <div style={{ marginBottom: '16px' }}>
          <label style={styles.label}>Expected Date</label>
          <input
            type="date"
            value={newMir.expected_date}
            onChange={(e) => setNewMir({ ...newMir, expected_date: e.target.value })}
            style={styles.input}
          />
        </div>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          <button onClick={() => setShowCreateModal(false)} style={{ ...styles.button, ...styles.buttonSecondary }}>
            Cancel
          </button>
          <button onClick={createMir} style={{ ...styles.button, ...styles.buttonPrimary }}>
            Create MIR
          </button>
        </div>
      </Modal>
    </div>
  );
}

// ============================================================
// PAGINA MATERIAL IN
// ============================================================
function MaterialInPage({ user }) {
  const [components, setComponents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadComponents();
  }, []);

  const loadComponents = async () => {
    setLoading(true);
    
    const { data } = await supabase
      .from('request_components')
      .select(`
        *,
        requests (
          request_number,
          sub_number
        )
      `)
      .eq('status', 'Ordered');

    if (data) setComponents(data);
    setLoading(false);
  };

  const handleReceive = async (component) => {
    try {
      // Increment yard inventory
      await supabase.rpc('increment_yard_qty', { 
        p_ident_code: component.ident_code, 
        p_qty: component.quantity 
      });

      // Update status to Trans (will go to Site)
      await supabase
        .from('request_components')
        .update({ status: 'Trans' })
        .eq('id', component.id);

      // Log movement
      await supabase.from('movements').insert({
        ident_code: component.ident_code,
        movement_type: 'IN',
        quantity: component.quantity,
        from_location: 'SUPPLIER',
        to_location: 'YARD',
        note: `Order received - Request ${component.requests?.request_number}`,
        performed_by: user.full_name
      });

      loadComponents();
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };

  const canModify = user.role === 'admin' || user.perm_material_in === 'modify';

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <div style={styles.card}>
        <div style={styles.cardHeader}>
          <h3 style={{ fontWeight: '600' }}>Material In - Ordered Items</h3>
        </div>
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
            {components.map(comp => (
              <tr key={comp.id}>
                <td style={{ ...styles.td, fontFamily: 'monospace', fontWeight: '600' }}>
                  {String(comp.requests?.request_number).padStart(5, '0')}-{comp.requests?.sub_number}
                </td>
                <td style={{ ...styles.td, fontFamily: 'monospace' }}>{comp.ident_code}</td>
                <td style={styles.td}>{comp.description}</td>
                <td style={styles.td}>{comp.quantity}</td>
                <td style={styles.td}>
                  {comp.order_forecast ? new Date(comp.order_forecast).toLocaleDateString() : '-'}
                </td>
                <td style={styles.td}>
                  <button
                    onClick={() => handleReceive(comp)}
                    disabled={!canModify}
                    style={{ ...styles.button, backgroundColor: COLORS.success, color: 'white' }}
                  >
                    📥 Receive
                  </button>
                </td>
              </tr>
            ))}
            {components.length === 0 && (
              <tr>
                <td colSpan="6" style={{ ...styles.td, textAlign: 'center', color: '#9ca3af' }}>
                  No ordered materials waiting
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
// PAGINA LOG
// ============================================================
function LogPage({ user }) {
  const [movements, setMovements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMovements();
  }, []);

  const loadMovements = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('movements')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100);
    if (data) setMovements(data);
    setLoading(false);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <div style={styles.card}>
        <div style={styles.cardHeader}>
          <h3 style={{ fontWeight: '600' }}>Movement Log</h3>
        </div>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Date</th>
              <th style={styles.th}>Type</th>
              <th style={styles.th}>Code</th>
              <th style={styles.th}>Qty</th>
              <th style={styles.th}>From → To</th>
              <th style={styles.th}>Note</th>
              <th style={styles.th}>User</th>
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
                                    mov.movement_type === 'BROKEN' ? COLORS.purple : COLORS.yellow
                  }}>
                    {mov.movement_type}
                  </span>
                </td>
                <td style={{ ...styles.td, fontFamily: 'monospace' }}>{mov.ident_code}</td>
                <td style={styles.td}>{mov.quantity}</td>
                <td style={styles.td}>{mov.from_location} → {mov.to_location}</td>
                <td style={{ ...styles.td, fontSize: '12px', color: '#6b7280' }}>{mov.note}</td>
                <td style={styles.td}>{mov.performed_by}</td>
              </tr>
            ))}
            {movements.length === 0 && (
              <tr>
                <td colSpan="7" style={{ ...styles.td, textAlign: 'center', color: '#9ca3af' }}>
                  No movements recorded
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
// PAGINA DATABASE
// ============================================================
function DatabasePage({ user }) {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadInventory();
  }, []);

  const loadInventory = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('project_database')
      .select('*')
      .order('ident_code');
    if (data) setInventory(data);
    setLoading(false);
  };

  const filtered = inventory.filter(item =>
    item.ident_code?.toLowerCase().includes(search.toLowerCase()) ||
    item.description?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <div style={{ marginBottom: '16px' }}>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by code or description..."
          style={{ ...styles.input, maxWidth: '400px' }}
        />
      </div>

      <div style={styles.card}>
        <div style={styles.cardHeader}>
          <h3 style={{ fontWeight: '600' }}>Inventory Database</h3>
        </div>
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
            {filtered.map(item => {
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
            {filtered.length === 0 && (
              <tr>
                <td colSpan="7" style={{ ...styles.td, textAlign: 'center', color: '#9ca3af' }}>
                  No items found
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
// APP PRINCIPALE
// ============================================================
function App() {
  const [user, setUser] = useState(null);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [badges, setBadges] = useState({
    whSite: 0,
    whYard: 0,
    engineering: 0,
    spareParts: 0,
    orders: 0,
    management: 0,
    siteIn: 0,
    materialIn: 0
  });

  useEffect(() => {
    if (user) {
      loadBadges();
      const interval = setInterval(loadBadges, 30000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const loadBadges = async () => {
    const { data: components } = await supabase
      .from('request_components')
      .select('status, has_eng_check, eng_check_sent_to');

    if (components) {
      const counts = {
        whSite: components.filter(c => c.status === 'Site' || (c.has_eng_check && c.eng_check_sent_to === 'Site')).length,
        whYard: components.filter(c => c.status === 'Yard' || (c.has_eng_check && c.eng_check_sent_to === 'Yard')).length,
        engineering: components.filter(c => c.status === 'Eng').length,
        spareParts: components.filter(c => c.status === 'Spare').length,
        orders: components.filter(c => c.status === 'Order').length,
        management: components.filter(c => c.status === 'Mng').length,
        siteIn: components.filter(c => c.status === 'Trans').length,
        materialIn: components.filter(c => c.status === 'Ordered').length
      };
      setBadges(counts);
    }
  };

  const pageTitles = {
    dashboard: 'Dashboard',
    requests: 'New Request',
    mir: 'MIR',
    materialIn: 'Material In',
    siteIn: 'Site IN',
    whSite: 'WH Site',
    whYard: 'WH Yard',
    engineering: 'Engineering',
    spareParts: 'Spare Parts',
    orders: 'Orders',
    management: 'Management',
    log: 'Log',
    database: 'Database'
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard': return <DashboardPage user={user} />;
      case 'requests': return <RequestsPage user={user} />;
      case 'mir': return <MIRPage user={user} />;
      case 'materialIn': return <MaterialInPage user={user} />;
      case 'siteIn': return <SiteInPage user={user} />;
      case 'whSite': return <WHSitePage user={user} />;
      case 'whYard': return <WHYardPage user={user} />;
      case 'engineering': return <EngineeringPage user={user} />;
      case 'spareParts': return <SparePartsPage user={user} />;
      case 'orders': return <OrdersPage user={user} />;
      case 'management': return <ManagementPage user={user} />;
      case 'log': return <LogPage user={user} />;
      case 'database': return <DatabasePage user={user} />;
      default: return <DashboardPage user={user} />;
    }
  };

  if (!user) {
    return <LoginScreen onLogin={setUser} />;
  }

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
        <div style={styles.header}>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold' }}>{pageTitles[currentPage]}</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span style={{ color: '#6b7280' }}>👤 {user.full_name}</span>
            <button
              onClick={() => {
                setUser(null);
                setCurrentPage('dashboard');
              }}
              style={{ ...styles.button, ...styles.buttonSecondary }}
            >
              Logout
            </button>
          </div>
        </div>
        <div style={styles.content}>
          {renderPage()}
        </div>
      </div>
    </div>
  );
}

export default App;
