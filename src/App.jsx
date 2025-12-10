// ============================================================
// MATERIALS MANAGER V26.1 - APP.JSX COMPLETA
// MAX STREICHER Edition - All Features Implemented
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
        maxWidth: wide ? '800px' : '500px',
        width: '90%',
        maxHeight: '80vh',
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
// LOGIN SCREEN
// ============================================================
function LoginScreen({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!username || !password) {
      setError('Please enter username and password');
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
        setError('Invalid username or password');
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
          <p style={{ color: '#6b7280', marginTop: '4px' }}>Materials Manager V26.1</p>
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
    activeRequests: 0, pendingEng: 0, toOrder: 0
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

    // Load request counts
    const { data: siteData } = await supabase
      .from('request_components')
      .select('id')
      .eq('status', 'Site');
    
    const { data: engData } = await supabase
      .from('request_components')
      .select('id')
      .eq('status', 'Eng');

    const { data: orderData } = await supabase
      .from('request_components')
      .select('id')
      .eq('status', 'Order');

    setStats(prev => ({
      ...prev,
      activeRequests: siteData?.length || 0,
      pendingEng: engData?.length || 0,
      toOrder: orderData?.length || 0
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

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
        <StatBox title="YARD" value={stats.yard.toLocaleString()} color={COLORS.secondary} />
        <StatBox title="SITE" value={stats.site.toLocaleString()} color={COLORS.info} />
        <StatBox title="LOST" value={stats.lost.toLocaleString()} color={COLORS.orange} />
        <StatBox title="BROKEN" value={stats.broken.toLocaleString()} color={COLORS.purple} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
        <div style={{ ...styles.card, padding: '24px' }}>
          <h3 style={{ color: '#6b7280', fontSize: '14px', marginBottom: '8px' }}>Active Requests</h3>
          <p style={{ fontSize: '32px', fontWeight: 'bold', color: COLORS.primary }}>{stats.activeRequests}</p>
        </div>
        <div style={{ ...styles.card, padding: '24px' }}>
          <h3 style={{ color: '#6b7280', fontSize: '14px', marginBottom: '8px' }}>Pending Engineering</h3>
          <p style={{ fontSize: '32px', fontWeight: 'bold', color: COLORS.purple }}>{stats.pendingEng}</p>
        </div>
        <div style={{ ...styles.card, padding: '24px' }}>
          <h3 style={{ color: '#6b7280', fontSize: '14px', marginBottom: '8px' }}>To Order</h3>
          <p style={{ fontSize: '32px', fontWeight: 'bold', color: COLORS.warning }}>{stats.toOrder}</p>
        </div>
      </div>

      <div style={styles.card}>
        <div style={styles.cardHeader}>
          <h3 style={{ fontWeight: '600' }}>Recent Movements</h3>
        </div>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Date</th>
              <th style={styles.th}>Type</th>
              <th style={styles.th}>Code</th>
              <th style={styles.th}>Qty</th>
              <th style={styles.th}>From → To</th>
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
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ============================================================
// PAGINA NUOVA RICHIESTA - V26.1 con HF Check e Secondary Collector
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
  const [spoolOptions, setSpoolOptions] = useState([]);
  const [identOptions, setIdentOptions] = useState([]);
  const [tagOptions, setTagOptions] = useState([]);
  const [nextNumber, setNextNumber] = useState(1);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [overQuantityWarning, setOverQuantityWarning] = useState(null);
  const [hfError, setHfError] = useState('');
  // NEW: Secondary Collector for TestPack
  const [secondaryCollector, setSecondaryCollector] = useState('');
  const [allUsers, setAllUsers] = useState([]);

  useEffect(() => {
    loadIsoOptions();
    loadNextNumber();
    loadTagOptions();
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

  const loadIsoOptions = async () => {
    const { data } = await supabase
      .from('project_materials')
      .select('iso_number')
      .order('iso_number');
    if (data) {
      const unique = [...new Set(data.map(d => d.iso_number).filter(Boolean))];
      setIsoOptions(unique);
    }
  };

  const loadTagOptions = async () => {
    const { data } = await supabase
      .from('project_materials')
      .select('tag_number')
      .not('tag_number', 'is', null);
    if (data) {
      const unique = [...new Set(data.map(d => d.tag_number).filter(Boolean))];
      setTagOptions(unique.map(t => ({ tag_code: t, description: t })));
    }
  };

  // NEW: Load all users for autocomplete
  const loadUsers = async () => {
    const { data } = await supabase
      .from('users')
      .select('id, username, full_name, badge_number')
      .eq('is_active', true)
      .order('full_name');
    if (data) setAllUsers(data);
  };

  const loadSpoolOptions = async (iso) => {
    const { data } = await supabase
      .from('project_materials')
      .select('full_spool_number')
      .eq('iso_number', iso)
      .order('full_spool_number');
    if (data) {
      const unique = [...new Set(data.map(d => d.full_spool_number).filter(Boolean))];
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

  const handleIsoChange = (value) => {
    setIsoNumber(value);
    setSpoolNumber('');
    setSpoolOptions([]);
    setIdentOptions([]);
    setOverQuantityWarning(null);
    if (value) loadSpoolOptions(value);
  };

  const handleSpoolChange = (value) => {
    setSpoolNumber(value);
    setIdentOptions([]);
    setOverQuantityWarning(null);
    if (value) loadIdentOptions(value);
  };

  // NEW: Check HF duplicate when user enters HF number
  const checkHfDuplicate = async (hf) => {
    if (!hf) {
      setHfError('');
      return false;
    }
    
    const { data } = await supabase
      .from('requests')
      .select('id, request_number')
      .eq('hf_number', hf)
      .neq('status', 'Cancelled');
    
    if (data && data.length > 0) {
      const existingReq = String(data[0].request_number).padStart(5, '0');
      setHfError(`⚠️ HF "${hf}" already exists in request ${existingReq}`);
      return true;
    }
    setHfError('');
    return false;
  };

  const handleHfChange = async (value) => {
    setHfNumber(value);
    if (value.length >= 3) {
      await checkHfDuplicate(value);
    } else {
      setHfError('');
    }
  };

  // Check over-quantity when adding material
  const checkOverQuantity = async (identCode, qty) => {
    if (!spoolNumber || !identCode) return false;
    
    const { data: projectData } = await supabase
      .from('project_materials')
      .select('pos_qty')
      .eq('full_spool_number', spoolNumber)
      .eq('ident_code', identCode);
    
    const projectQty = projectData?.reduce((sum, d) => sum + (d.pos_qty || 0), 0) || 0;
    
    const { data: requestedData } = await supabase
      .from('request_components')
      .select('quantity')
      .eq('full_spool_number', spoolNumber)
      .eq('ident_code', identCode)
      .not('status', 'in', '("Done","Cancelled")');
    
    const alreadyRequested = requestedData?.reduce((sum, d) => sum + (d.quantity || 0), 0) || 0;
    const totalRequested = alreadyRequested + parseInt(qty || 0);
    
    if (totalRequested > projectQty) {
      setOverQuantityWarning({
        ident_code: identCode,
        projectQty,
        alreadyRequested,
        totalRequested
      });
      return true;
    }
    
    setOverQuantityWarning(null);
    return false;
  };

  const handleRequestTypeChange = (type) => {
    setRequestType(type);
    setIsoNumber('');
    setSpoolNumber('');
    setSpoolOptions([]);
    setHfNumber('');
    setHfError('');
    setDescription('');
    setTestPackNumber('');
    setMaterials([]);
    setOverQuantityWarning(null);
    setSecondaryCollector('');
  };

  const addMaterial = async () => {
    if (!currentMaterial.ident_code || !currentMaterial.qty) return;
    
    // Check over-quantity
    if (requestType === 'Piping' && spoolNumber) {
      await checkOverQuantity(currentMaterial.ident_code, currentMaterial.qty);
    }
    
    const selected = identOptions.find(o => o.ident_code === currentMaterial.ident_code);
    setMaterials([...materials, {
      ident_code: currentMaterial.ident_code,
      tag: currentMaterial.tag,
      description: selected?.description || '',
      qty: currentMaterial.qty,
      pos_qty: selected?.pos_qty || 0
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
      // Validations
      if (requestType === 'Piping') {
        if (!isoNumber) throw new Error('ISO Number is required');
        if (!spoolNumber) throw new Error('Full Spool Number is required');
        if (subCategory === 'Erection' && !hfNumber) throw new Error('HF Number is required for Erection');
        if (subCategory === 'Erection' && hfError) throw new Error('Cannot create request with duplicate HF Number');
        if (materials.length === 0) throw new Error('Add at least one material');
      }
      if (requestType === 'Mechanical') {
        if (!description) throw new Error('Description is required');
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
          secondary_collector: requestType === 'TestPack' ? (secondaryCollector || null) : null,
          description: description || null
        })
        .select()
        .single();

      if (reqError) throw reqError;

      // Create components
      const statusMap = { 'site': 'Site', 'yard': 'Yard', 'engineering': 'Eng' };
      const status = statusMap[destination];

      if (requestType === 'Mechanical') {
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
        for (const mat of materials) {
          const { error: compError } = await supabase
            .from('request_components')
            .insert({
              request_id: request.id,
              ident_code: mat.ident_code,
              tag: mat.tag || null,
              iso_number: requestType === 'Piping' ? isoNumber : null,
              full_spool_number: requestType === 'Piping' ? spoolNumber : null,
              tag_number: mat.tag || null,
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
      setSpoolOptions([]);
      setHfNumber('');
      setHfError('');
      setDescription('');
      setTestPackNumber('');
      setMaterials([]);
      setOverQuantityWarning(null);
      setSecondaryCollector('');
      loadNextNumber();

    } catch (error) {
      setMessage({ type: 'error', text: `Error creating request: ${error.message}` });
    } finally {
      setLoading(false);
    }
  };

  const canModify = user.role === 'admin' || user.perm_requests === 'modify';
  const hasOverQuantity = overQuantityWarning !== null;

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

              {/* ISO Number & Full Spool Number */}
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
                    {isoOptions.slice(0, 100).map(iso => (
                      <option key={iso} value={iso} />
                    ))}
                  </datalist>
                </div>
                <div>
                  <label style={styles.label}>Full Spool Number *</label>
                  {isoNumber ? (
                    <>
                      <input
                        type="text"
                        list="spool-options"
                        value={spoolNumber}
                        onChange={(e) => handleSpoolChange(e.target.value)}
                        style={styles.input}
                        placeholder="Select spool..."
                        disabled={!canModify}
                      />
                      <datalist id="spool-options">
                        {spoolOptions.map(spool => (
                          <option key={spool} value={spool} />
                        ))}
                      </datalist>
                    </>
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

              {/* HF Number - Only for Erection with duplicate check */}
              {subCategory === 'Erection' && (
                <div style={{ 
                  marginBottom: '20px', 
                  padding: '16px', 
                  backgroundColor: hfError ? '#FEE2E2' : '#FEF3C7', 
                  borderRadius: '8px',
                  border: `1px solid ${hfError ? '#EF4444' : '#F59E0B'}`
                }}>
                  <label style={{ ...styles.label, color: hfError ? '#DC2626' : '#92400E' }}>
                    🔩 HF Number (Flanged Joint) *
                  </label>
                  <input
                    type="text"
                    value={hfNumber}
                    onChange={(e) => handleHfChange(e.target.value)}
                    style={{ ...styles.input, backgroundColor: 'white', borderColor: hfError ? '#EF4444' : '#d1d5db' }}
                    placeholder="Enter HF Number"
                    disabled={!canModify}
                  />
                  {hfError ? (
                    <p style={{ fontSize: '13px', color: '#DC2626', marginTop: '8px', fontWeight: '500' }}>
                      {hfError}
                    </p>
                  ) : (
                    <p style={{ fontSize: '12px', color: '#92400E', marginTop: '6px' }}>
                      Required for Erection materials - identifies the flanged joint
                    </p>
                  )}
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
              {/* Test Pack Number */}
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

              {/* NEW: Secondary Collector with autocomplete */}
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
                <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '6px' }}>
                  Optional: Another person authorized to collect this TestPack
                </p>
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
              
              {/* Material Input Row */}
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 100px 80px', gap: '12px', alignItems: 'end' }}>
                <div>
                  <label style={styles.label}>Ident Code</label>
                  <select
                    value={currentMaterial.ident_code}
                    onChange={(e) => setCurrentMaterial({ ...currentMaterial, ident_code: e.target.value })}
                    style={styles.select}
                    disabled={!canModify || (requestType === 'Piping' && !spoolNumber)}
                  >
                    <option value="">{requestType === 'Piping' && !spoolNumber ? 'Select spool first' : 'Select code...'}</option>
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

              {/* Over-Quantity Warning */}
              {overQuantityWarning && (
                <div style={{
                  marginTop: '16px',
                  padding: '12px 16px',
                  backgroundColor: '#FEE2E2',
                  border: '2px solid #EF4444',
                  borderRadius: '8px',
                  color: '#DC2626'
                }}>
                  <div style={{ fontWeight: '600', marginBottom: '4px' }}>
                    ⚠️ Over-Quantity Warning for {overQuantityWarning.ident_code}
                  </div>
                  <div style={{ fontSize: '13px' }}>
                    Project Qty: <strong>{overQuantityWarning.projectQty}</strong> | 
                    Already Requested: <strong>{overQuantityWarning.alreadyRequested}</strong> | 
                    Total Would Be: <strong style={{ color: '#B91C1C' }}>{overQuantityWarning.totalRequested}</strong>
                  </div>
                  <div style={{ fontSize: '12px', marginTop: '8px' }}>
                    Site/Yard buttons disabled. Send to Engineering for review.
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
                      <th style={styles.th}>Tag</th>
                      <th style={styles.th}>Qty</th>
                      <th style={{ ...styles.th, backgroundColor: COLORS.purple, color: 'white' }}>Project</th>
                      <th style={styles.th}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {materials.map((mat, idx) => (
                      <tr key={idx}>
                        <td style={{ ...styles.td, fontFamily: 'monospace' }}>{mat.ident_code}</td>
                        <td style={styles.td}>{mat.description}</td>
                        <td style={styles.td}>{mat.tag || '-'}</td>
                        <td style={styles.td}>{mat.qty}</td>
                        <td style={{ ...styles.td, backgroundColor: '#F3E8FF' }}>{mat.pos_qty}</td>
                        <td style={styles.td}>
                          <button
                            onClick={() => removeMaterial(idx)}
                            style={{ ...styles.actionButton, backgroundColor: COLORS.primary }}
                          >
                            ×
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
            gap: '12px',
            justifyContent: 'flex-end'
          }}>
            <button
              onClick={() => submitRequest('site')}
              disabled={!canModify || loading || hasOverQuantity || hfError}
              style={{
                ...styles.button,
                backgroundColor: (hasOverQuantity || hfError) ? '#d1d5db' : COLORS.info,
                color: 'white',
                cursor: (hasOverQuantity || hfError) ? 'not-allowed' : 'pointer'
              }}
            >
              📤 Send to WH Site
            </button>
            <button
              onClick={() => submitRequest('yard')}
              disabled={!canModify || loading || hasOverQuantity || hfError}
              style={{
                ...styles.button,
                backgroundColor: (hasOverQuantity || hfError) ? '#d1d5db' : COLORS.secondary,
                color: 'white',
                cursor: (hasOverQuantity || hfError) ? 'not-allowed' : 'pointer'
              }}
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
                border: hasOverQuantity ? '3px solid #7C3AED' : 'none'
              }}
            >
              ⚙️ Send to Engineering {hasOverQuantity && '(Required)'}
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
  const [readyOut, setReadyOut] = useState([]);
  const [engNotes, setEngNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPartialModal, setShowPartialModal] = useState(false);
  const [selectedComponent, setSelectedComponent] = useState(null);
  const [partialQty, setPartialQty] = useState('');

  useEffect(() => {
    loadComponents();
  }, []);

  const loadComponents = async () => {
    setLoading(true);
    
    const { data: siteData } = await supabase
      .from('request_components')
      .select(`*, requests (request_number, sub_number, sub_category, request_type)`)
      .eq('status', 'Site');

    const { data: toCollectData } = await supabase
      .from('request_components')
      .select(`*, requests (request_number, sub_number, sub_category, request_type)`)
      .eq('status', 'ToCollect');

    const { data: notesData } = await supabase
      .from('request_components')
      .select(`*, requests (request_number, sub_number)`)
      .eq('has_eng_check', true)
      .eq('eng_check_sent_to', 'Site');

    if (siteData) setComponents(siteData);
    if (toCollectData) setReadyOut(toCollectData);
    if (notesData) setEngNotes(notesData);
    setLoading(false);
  };

  const handleAction = async (component, action) => {
    try {
      switch (action) {
        case 'ready':
          await supabase.from('request_components')
            .update({ status: 'ToCollect' })
            .eq('id', component.id);
          break;
        case 'pt':
          setSelectedComponent(component);
          setShowPartialModal(true);
          return;
        case 'yard':
          await supabase.from('request_components')
            .update({ status: 'Yard', current_location: 'YARD' })
            .eq('id', component.id);
          break;
        case 'eng':
          await supabase.from('request_components')
            .update({ status: 'Eng' })
            .eq('id', component.id);
          break;
        case 'return':
          await supabase.from('request_components')
            .update({ status: 'Site' })
            .eq('id', component.id);
          break;
        case 'deliver':
          await supabase.from('request_components')
            .update({ status: 'Done' })
            .eq('id', component.id);
          // Update inventory
          await supabase.rpc('decrement_site_qty', { 
            p_ident_code: component.ident_code, 
            p_qty: component.quantity 
          });
          // Record movement
          await supabase.from('movements').insert({
            ident_code: component.ident_code,
            movement_type: 'OUT',
            quantity: component.quantity,
            from_location: 'SITE',
            to_location: 'DELIVERED',
            performed_by: user.full_name,
            note: `Request ${component.requests?.request_number}-${component.requests?.sub_number}`
          });
          break;
        case 'delete':
          if (confirm('Delete this component?')) {
            await supabase.from('request_components')
              .update({ status: 'Cancelled' })
              .eq('id', component.id);
          }
          return;
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

  const submitPartial = async () => {
    if (!partialQty || parseInt(partialQty) >= selectedComponent.quantity) {
      alert('Partial quantity must be less than total');
      return;
    }
    
    const remainingQty = selectedComponent.quantity - parseInt(partialQty);
    
    // Update original to partial qty and mark ready
    await supabase.from('request_components')
      .update({ quantity: parseInt(partialQty), status: 'ToCollect' })
      .eq('id', selectedComponent.id);
    
    // Get next sub_number
    const { data: subData } = await supabase
      .from('requests')
      .select('sub_number')
      .eq('request_number', selectedComponent.requests.request_number)
      .order('sub_number', { ascending: false })
      .limit(1);
    
    const nextSub = (subData?.[0]?.sub_number || 0) + 1;
    
    // Create new request for remaining
    const { data: newReq } = await supabase.from('requests')
      .insert({
        request_number: selectedComponent.requests.request_number,
        sub_number: nextSub,
        request_type: selectedComponent.requests.request_type,
        sub_category: selectedComponent.requests.sub_category
      })
      .select()
      .single();
    
    // Create component for remaining qty
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

  const canModify = user.role === 'admin' || user.perm_wh_site === 'modify';

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      {/* Engineering Notes Alert */}
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
              <div style={{ display: 'flex', gap: '4px' }}>
                <ActionButton color={COLORS.success} onClick={() => handleAction(note, 'ack')} disabled={!canModify} title="Acknowledge">✓</ActionButton>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Ready OUT / To Collect Section */}
      {readyOut.length > 0 && (
        <div style={{ ...styles.card, marginBottom: '24px' }}>
          <div style={{ ...styles.cardHeader, backgroundColor: '#D1FAE5' }}>
            <h3 style={{ fontWeight: '600', color: '#065F46' }}>Ready OUT - To Collect ({readyOut.length})</h3>
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
              {readyOut.map(comp => (
                <tr key={comp.id}>
                  <td style={{ ...styles.td, fontFamily: 'monospace', fontWeight: '600' }}>
                    {String(comp.requests?.request_number).padStart(5, '0')}-{comp.requests?.sub_number}
                  </td>
                  <td style={{ ...styles.td, fontFamily: 'monospace' }}>{comp.ident_code}</td>
                  <td style={styles.td}>{comp.description}</td>
                  <td style={styles.td}>{comp.quantity}</td>
                  <td style={styles.td}>
                    <div style={{ display: 'flex', gap: '4px' }}>
                      <ActionButton color={COLORS.success} onClick={() => handleAction(comp, 'deliver')} disabled={!canModify} title="Deliver">📤</ActionButton>
                      <ActionButton color={COLORS.gray} onClick={() => handleAction(comp, 'return')} disabled={!canModify} title="Return to Site">↩</ActionButton>
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
          <h3 style={{ fontWeight: '600' }}>Warehouse Site - Components ({components.length})</h3>
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
                <td style={styles.td}>{comp.requests?.sub_category || comp.requests?.request_type}</td>
                <td style={styles.td}>
                  <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                    <ActionButton color={COLORS.success} onClick={() => handleAction(comp, 'ready')} disabled={!canModify} title="Ready for pickup">✓</ActionButton>
                    <ActionButton color={COLORS.warning} onClick={() => handleAction(comp, 'pt')} disabled={!canModify} title="Partial">PT</ActionButton>
                    <ActionButton color={COLORS.secondary} onClick={() => handleAction(comp, 'yard')} disabled={!canModify} title="Send to Yard">Y</ActionButton>
                    <ActionButton color={COLORS.purple} onClick={() => handleAction(comp, 'eng')} disabled={!canModify} title="Send to Engineering">UT</ActionButton>
                    <ActionButton color={COLORS.primary} onClick={() => handleAction(comp, 'delete')} disabled={!canModify} title="Cancel">🗑️</ActionButton>
                  </div>
                </td>
              </tr>
            ))}
            {components.length === 0 && (
              <tr>
                <td colSpan="6" style={{ ...styles.td, textAlign: 'center', color: '#9ca3af' }}>
                  No components in Site warehouse
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Partial Modal */}
      <Modal isOpen={showPartialModal} onClose={() => setShowPartialModal(false)} title="Split Partial Quantity">
        <p style={{ marginBottom: '16px' }}>
          <strong>{selectedComponent?.ident_code}</strong> - Total Qty: {selectedComponent?.quantity}
        </p>
        <div style={{ marginBottom: '16px' }}>
          <label style={styles.label}>Available Quantity (to mark ready)</label>
          <input
            type="number"
            value={partialQty}
            onChange={(e) => setPartialQty(e.target.value)}
            style={styles.input}
            min="1"
            max={selectedComponent?.quantity - 1}
          />
          <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '6px' }}>
            Remaining {selectedComponent?.quantity - (parseInt(partialQty) || 0)} will stay in queue
          </p>
        </div>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          <button onClick={() => setShowPartialModal(false)} style={{ ...styles.button, ...styles.buttonSecondary }}>Cancel</button>
          <button onClick={submitPartial} style={{ ...styles.button, backgroundColor: COLORS.warning, color: 'white' }}>Split</button>
        </div>
      </Modal>
    </div>
  );
}

// ============================================================
// WH YARD PAGE
// ============================================================
function WHYardPage({ user }) {
  const [components, setComponents] = useState([]);
  const [inventory, setInventory] = useState({});
  const [loading, setLoading] = useState(true);
  const [showPartialModal, setShowPartialModal] = useState(false);
  const [selectedComponent, setSelectedComponent] = useState(null);
  const [partialQty, setPartialQty] = useState('');

  useEffect(() => {
    loadComponents();
  }, []);

  const loadComponents = async () => {
    setLoading(true);
    
    const { data: yardData } = await supabase
      .from('request_components')
      .select(`*, requests (request_number, sub_number, sub_category, request_type)`)
      .eq('status', 'Yard');

    if (yardData) {
      setComponents(yardData);
      // Load inventory for each code
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

  const handleAction = async (component, action) => {
    try {
      const available = inventory[component.ident_code] || 0;
      
      switch (action) {
        case 'found':
          if (available < component.quantity) {
            alert(`Only ${available} available in YARD!`);
            return;
          }
          await supabase.from('request_components')
            .update({ status: 'Trans' })
            .eq('id', component.id);
          // Decrement yard, will add to site on arrival
          await supabase.rpc('decrement_yard_qty', { 
            p_ident_code: component.ident_code, 
            p_qty: component.quantity 
          });
          await supabase.from('movements').insert({
            ident_code: component.ident_code,
            movement_type: 'TRANSFER',
            quantity: component.quantity,
            from_location: 'YARD',
            to_location: 'SITE (Transit)',
            performed_by: user.full_name
          });
          break;
        case 'pt':
          setSelectedComponent(component);
          setShowPartialModal(true);
          return;
        case 'eng':
          await supabase.from('request_components')
            .update({ status: 'Eng' })
            .eq('id', component.id);
          break;
        case 'return':
          await supabase.from('request_components')
            .update({ status: 'Site', current_location: 'SITE' })
            .eq('id', component.id);
          break;
        case 'delete':
          if (confirm('Delete this component?')) {
            await supabase.from('request_components')
              .update({ status: 'Cancelled' })
              .eq('id', component.id);
          }
          return;
      }
      loadComponents();
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };

  const submitPartial = async () => {
    const available = inventory[selectedComponent.ident_code] || 0;
    if (!partialQty || parseInt(partialQty) > available) {
      alert(`Max available: ${available}`);
      return;
    }
    
    const sendQty = parseInt(partialQty);
    const remainingQty = selectedComponent.quantity - sendQty;
    
    // Update original quantity
    await supabase.from('request_components')
      .update({ quantity: sendQty, status: 'Trans' })
      .eq('id', selectedComponent.id);
    
    // Decrement inventory
    await supabase.rpc('decrement_yard_qty', { 
      p_ident_code: selectedComponent.ident_code, 
      p_qty: sendQty 
    });

    // Get next sub_number
    const { data: subData } = await supabase
      .from('requests')
      .select('sub_number')
      .eq('request_number', selectedComponent.requests.request_number)
      .order('sub_number', { ascending: false })
      .limit(1);
    
    const nextSub = (subData?.[0]?.sub_number || 0) + 1;
    
    // Create new request for remaining
    const { data: newReq } = await supabase.from('requests')
      .insert({
        request_number: selectedComponent.requests.request_number,
        sub_number: nextSub,
        request_type: selectedComponent.requests.request_type,
        sub_category: selectedComponent.requests.sub_category
      })
      .select()
      .single();
    
    // Create component - remaining goes to Order
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
      to_location: 'SITE (Transit)',
      performed_by: user.full_name,
      note: `Partial - ${remainingQty} remaining to order`
    });

    setShowPartialModal(false);
    setPartialQty('');
    loadComponents();
  };

  const canModify = user.role === 'admin' || user.perm_wh_yard === 'modify';

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <div style={styles.card}>
        <div style={styles.cardHeader}>
          <h3 style={{ fontWeight: '600' }}>Warehouse Yard - Components ({components.length})</h3>
        </div>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Request #</th>
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
              return (
                <tr key={comp.id}>
                  <td style={{ ...styles.td, fontFamily: 'monospace', fontWeight: '600' }}>
                    {String(comp.requests?.request_number).padStart(5, '0')}-{comp.requests?.sub_number}
                  </td>
                  <td style={{ ...styles.td, fontFamily: 'monospace' }}>{comp.ident_code}</td>
                  <td style={styles.td}>{comp.description}</td>
                  <td style={styles.td}>{comp.quantity}</td>
                  <td style={styles.td}>
                    <span style={{ 
                      fontWeight: '600', 
                      color: canFulfill ? COLORS.success : COLORS.primary 
                    }}>
                      {available}
                    </span>
                  </td>
                  <td style={styles.td}>
                    <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                      <ActionButton 
                        color={canFulfill ? COLORS.success : COLORS.gray} 
                        onClick={() => handleAction(comp, 'found')} 
                        disabled={!canModify || !canFulfill} 
                        title={canFulfill ? "Found - Transfer to Site" : "Insufficient quantity"}
                      >
                        ✓
                      </ActionButton>
                      <ActionButton color={COLORS.warning} onClick={() => handleAction(comp, 'pt')} disabled={!canModify || available === 0} title="Partial">PT</ActionButton>
                      <ActionButton color={COLORS.purple} onClick={() => handleAction(comp, 'eng')} disabled={!canModify} title="Send to Engineering">UT</ActionButton>
                      <ActionButton color={COLORS.gray} onClick={() => handleAction(comp, 'return')} disabled={!canModify} title="Return to Site">↩</ActionButton>
                      <ActionButton color={COLORS.primary} onClick={() => handleAction(comp, 'delete')} disabled={!canModify} title="Cancel">🗑️</ActionButton>
                    </div>
                  </td>
                </tr>
              );
            })}
            {components.length === 0 && (
              <tr>
                <td colSpan="6" style={{ ...styles.td, textAlign: 'center', color: '#9ca3af' }}>
                  No components in Yard warehouse
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Partial Modal */}
      <Modal isOpen={showPartialModal} onClose={() => setShowPartialModal(false)} title="Send Partial Quantity">
        <p style={{ marginBottom: '16px' }}>
          <strong>{selectedComponent?.ident_code}</strong><br />
          Requested: {selectedComponent?.quantity} | Available: {inventory[selectedComponent?.ident_code] || 0}
        </p>
        <div style={{ marginBottom: '16px' }}>
          <label style={styles.label}>Quantity to send now</label>
          <input
            type="number"
            value={partialQty}
            onChange={(e) => setPartialQty(e.target.value)}
            style={styles.input}
            min="1"
            max={inventory[selectedComponent?.ident_code] || 0}
          />
          <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '6px' }}>
            Remaining will be sent to Orders
          </p>
        </div>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          <button onClick={() => setShowPartialModal(false)} style={{ ...styles.button, ...styles.buttonSecondary }}>Cancel</button>
          <button onClick={submitPartial} style={{ ...styles.button, backgroundColor: COLORS.warning, color: 'white' }}>Send Partial</button>
        </div>
      </Modal>
    </div>
  );
}

// ============================================================
// SITE IN PAGE - Transit from Yard to Site
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
      .select(`*, requests (request_number, sub_number, sub_category, request_type)`)
      .eq('status', 'Trans');
    if (data) setComponents(data);
    setLoading(false);
  };

  const handleReceive = async (component) => {
    try {
      await supabase.from('request_components')
        .update({ status: 'Site', current_location: 'SITE' })
        .eq('id', component.id);
      
      // Add to site inventory
      await supabase.rpc('increment_site_qty', { 
        p_ident_code: component.ident_code, 
        p_qty: component.quantity 
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

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <div style={styles.card}>
        <div style={styles.cardHeader}>
          <h3 style={{ fontWeight: '600' }}>Site IN - Material in Transit ({components.length})</h3>
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
                    onClick={() => handleReceive(comp)}
                    disabled={!canModify}
                    style={{ ...styles.button, backgroundColor: COLORS.success, color: 'white' }}
                  >
                    📥 Receive at Site
                  </button>
                </td>
              </tr>
            ))}
            {components.length === 0 && (
              <tr>
                <td colSpan="5" style={{ ...styles.td, textAlign: 'center', color: '#9ca3af' }}>
                  No material in transit
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
// ENGINEERING PAGE
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

  useEffect(() => {
    loadComponents();
  }, []);

  const loadComponents = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('request_components')
      .select(`*, requests (request_number, sub_number, sub_category, request_type)`)
      .eq('status', 'Eng');
    if (data) setComponents(data);
    setLoading(false);
  };

  const handleAction = async (component, action) => {
    try {
      switch (action) {
        case 'resolved':
          await supabase.from('request_components')
            .update({ status: 'Site' })
            .eq('id', component.id);
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
          break;
        case 'mng':
          await supabase.from('request_components')
            .update({ status: 'Mng' })
            .eq('id', component.id);
          break;
        case 'return':
          await supabase.from('request_components')
            .update({ status: 'Site' })
            .eq('id', component.id);
          break;
        case 'delete':
          if (confirm('Delete this component?')) {
            await supabase.from('request_components')
              .update({ status: 'Cancelled' })
              .eq('id', component.id);
          }
          return;
      }
      loadComponents();
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };

  const sendCheck = async () => {
    await supabase.from('request_components')
      .update({ 
        has_eng_check: true, 
        eng_check_message: checkMessage,
        eng_check_sent_to: checkDestination
      })
      .eq('id', selectedComponent.id);
    
    setShowCheckModal(false);
    setCheckMessage('');
    loadComponents();
  };

  const submitPartial = async () => {
    // Similar logic to WH Site partial
    const sendQty = parseInt(partialQty);
    const remainingQty = selectedComponent.quantity - sendQty;
    
    await supabase.from('request_components')
      .update({ quantity: sendQty, status: 'Spare' })
      .eq('id', selectedComponent.id);

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

  const canModify = user.role === 'admin' || user.perm_engineering === 'modify';

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <div style={styles.card}>
        <div style={styles.cardHeader}>
          <h3 style={{ fontWeight: '600' }}>Engineering (UT) - Components Under Review ({components.length})</h3>
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
                    <ActionButton color={COLORS.success} onClick={() => handleAction(comp, 'resolved')} disabled={!canModify || comp.has_eng_check} title="Resolved">✓</ActionButton>
                    <ActionButton color={COLORS.purple} onClick={() => handleAction(comp, 'check')} disabled={!canModify || comp.has_eng_check} title="Send Check">🔍</ActionButton>
                    <ActionButton color={COLORS.warning} onClick={() => handleAction(comp, 'pt')} disabled={!canModify} title="Partial">PT</ActionButton>
                    <ActionButton color={COLORS.pink} onClick={() => handleAction(comp, 'spare')} disabled={!canModify} title="Spare Parts">Sp</ActionButton>
                    <ActionButton color={COLORS.yellow} onClick={() => handleAction(comp, 'mng')} disabled={!canModify} title="Management">Mng</ActionButton>
                    <ActionButton color={COLORS.gray} onClick={() => handleAction(comp, 'return')} disabled={!canModify} title="Return">↩</ActionButton>
                    <ActionButton color={COLORS.primary} onClick={() => handleAction(comp, 'delete')} disabled={!canModify} title="Delete">🗑️</ActionButton>
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
              <input type="radio" name="checkDest" value="Site" checked={checkDestination === 'Site'} onChange={(e) => setCheckDestination(e.target.value)} />
              WH Site
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              <input type="radio" name="checkDest" value="Yard" checked={checkDestination === 'Yard'} onChange={(e) => setCheckDestination(e.target.value)} />
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
            Remaining will go to Orders
          </p>
        </div>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          <button onClick={() => setShowPartialModal(false)} style={{ ...styles.button, ...styles.buttonSecondary }}>Cancel</button>
          <button onClick={submitPartial} style={{ ...styles.button, backgroundColor: COLORS.warning, color: 'white' }}>Split</button>
        </div>
      </Modal>
    </div>
  );
}

// ============================================================
// MATERIAL IN PAGE - REDESIGNED con selezione MIR
// ============================================================
function MaterialInPage({ user }) {
  const [orderedComponents, setOrderedComponents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showReceiveModal, setShowReceiveModal] = useState(false);
  const [selectedComponent, setSelectedComponent] = useState(null);
  const [receiveData, setReceiveData] = useState({
    destination: 'YARD',
    tag_number: '',
    note: ''
  });
  const [allTags, setAllTags] = useState([]);
  const [allIdents, setAllIdents] = useState([]);
  // Bulk receive from MIR
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [selectedMir, setSelectedMir] = useState('');
  const [mirOptions, setMirOptions] = useState([]);
  const [mirComponents, setMirComponents] = useState([]);
  const [bulkDestination, setBulkDestination] = useState('YARD');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    
    // Load ordered components
    const { data: ordData } = await supabase
      .from('request_components')
      .select(`*, requests (request_number, sub_number)`)
      .eq('status', 'Ordered');
    if (ordData) setOrderedComponents(ordData);

    // Load tags for autocomplete
    const { data: tagData } = await supabase
      .from('project_materials')
      .select('tag_number')
      .not('tag_number', 'is', null);
    if (tagData) {
      const unique = [...new Set(tagData.map(t => t.tag_number).filter(Boolean))];
      setAllTags(unique);
    }

    // Load all idents for autocomplete
    const { data: identData } = await supabase
      .from('inventory')
      .select('ident_code, description');
    if (identData) setAllIdents(identData);

    // Load MIR options (open MIRs with ordered components)
    const { data: mirData } = await supabase
      .from('mirs')
      .select('id, mir_number, category')
      .eq('status', 'Open');
    if (mirData) setMirOptions(mirData);

    setLoading(false);
  };

  const openReceiveModal = (component) => {
    setSelectedComponent(component);
    setReceiveData({ destination: 'YARD', tag_number: '', note: '' });
    setShowReceiveModal(true);
  };

  const receiveComponent = async () => {
    try {
      const dest = receiveData.destination;
      
      // Update component status
      await supabase.from('request_components')
        .update({ 
          status: dest === 'YARD' ? 'Yard' : 'Site',
          current_location: dest,
          tag_number: receiveData.tag_number || null
        })
        .eq('id', selectedComponent.id);
      
      // Update inventory
      if (dest === 'YARD') {
        await supabase.rpc('increment_yard_qty', { 
          p_ident_code: selectedComponent.ident_code, 
          p_qty: selectedComponent.quantity 
        });
      } else {
        await supabase.rpc('increment_site_qty', { 
          p_ident_code: selectedComponent.ident_code, 
          p_qty: selectedComponent.quantity 
        });
      }

      // Record movement
      await supabase.from('movements').insert({
        ident_code: selectedComponent.ident_code,
        movement_type: 'IN',
        quantity: selectedComponent.quantity,
        from_location: 'SUPPLIER',
        to_location: dest,
        performed_by: user.full_name,
        note: receiveData.note || `Order received - Tag: ${receiveData.tag_number || 'N/A'}`
      });

      setShowReceiveModal(false);
      loadData();
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };

  // Load components for selected MIR
  const loadMirComponents = async (mirId) => {
    const { data } = await supabase
      .from('request_components')
      .select(`*, requests (request_number, sub_number)`)
      .eq('mir_id', mirId)
      .eq('status', 'Ordered');
    if (data) setMirComponents(data);
  };

  const handleMirChange = (mirId) => {
    setSelectedMir(mirId);
    if (mirId) {
      loadMirComponents(mirId);
    } else {
      setMirComponents([]);
    }
  };

  const receiveBulk = async () => {
    try {
      for (const comp of mirComponents) {
        const dest = bulkDestination;
        
        await supabase.from('request_components')
          .update({ 
            status: dest === 'YARD' ? 'Yard' : 'Site',
            current_location: dest
          })
          .eq('id', comp.id);
        
        if (dest === 'YARD') {
          await supabase.rpc('increment_yard_qty', { 
            p_ident_code: comp.ident_code, 
            p_qty: comp.quantity 
          });
        } else {
          await supabase.rpc('increment_site_qty', { 
            p_ident_code: comp.ident_code, 
            p_qty: comp.quantity 
          });
        }

        await supabase.from('movements').insert({
          ident_code: comp.ident_code,
          movement_type: 'IN',
          quantity: comp.quantity,
          from_location: 'SUPPLIER',
          to_location: dest,
          performed_by: user.full_name,
          note: `MIR bulk receive`
        });
      }

      setShowBulkModal(false);
      setSelectedMir('');
      setMirComponents([]);
      loadData();
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };

  const canModify = user.role === 'admin' || user.perm_material_in === 'modify';

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      {/* Header with bulk receive button */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px', gap: '12px' }}>
        <button
          onClick={() => setShowBulkModal(true)}
          disabled={!canModify}
          style={{ ...styles.button, backgroundColor: COLORS.info, color: 'white' }}
        >
          📦 Receive from MIR
        </button>
      </div>

      {/* Ordered Components waiting for arrival */}
      <div style={styles.card}>
        <div style={styles.cardHeader}>
          <h3 style={{ fontWeight: '600' }}>Material IN - Ordered Components Awaiting ({orderedComponents.length})</h3>
        </div>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Request #</th>
              <th style={styles.th}>Code</th>
              <th style={styles.th}>Description</th>
              <th style={styles.th}>Qty</th>
              <th style={styles.th}>Order Date</th>
              <th style={styles.th}>Expected</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orderedComponents.map(comp => (
              <tr key={comp.id}>
                <td style={{ ...styles.td, fontFamily: 'monospace', fontWeight: '600' }}>
                  {String(comp.requests?.request_number).padStart(5, '0')}-{comp.requests?.sub_number}
                </td>
                <td style={{ ...styles.td, fontFamily: 'monospace' }}>{comp.ident_code}</td>
                <td style={styles.td}>{comp.description}</td>
                <td style={styles.td}>{comp.quantity}</td>
                <td style={styles.td}>{comp.order_date ? new Date(comp.order_date).toLocaleDateString() : '-'}</td>
                <td style={styles.td}>{comp.order_forecast ? new Date(comp.order_forecast).toLocaleDateString() : '-'}</td>
                <td style={styles.td}>
                  <button
                    onClick={() => openReceiveModal(comp)}
                    disabled={!canModify}
                    style={{ ...styles.button, backgroundColor: COLORS.success, color: 'white' }}
                  >
                    📥 Receive
                  </button>
                </td>
              </tr>
            ))}
            {orderedComponents.length === 0 && (
              <tr>
                <td colSpan="7" style={{ ...styles.td, textAlign: 'center', color: '#9ca3af' }}>
                  No ordered components awaiting delivery
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Single Receive Modal */}
      <Modal isOpen={showReceiveModal} onClose={() => setShowReceiveModal(false)} title="Receive Material">
        <div style={{ marginBottom: '16px' }}>
          <p><strong>Code:</strong> {selectedComponent?.ident_code}</p>
          <p><strong>Description:</strong> {selectedComponent?.description}</p>
          <p><strong>Quantity:</strong> {selectedComponent?.quantity}</p>
        </div>
        
        <div style={{ marginBottom: '16px' }}>
          <label style={styles.label}>Destination Warehouse</label>
          <div style={{ display: 'flex', gap: '16px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              <input 
                type="radio" 
                value="YARD" 
                checked={receiveData.destination === 'YARD'} 
                onChange={(e) => setReceiveData({...receiveData, destination: e.target.value})} 
              />
              WH Yard
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              <input 
                type="radio" 
                value="SITE" 
                checked={receiveData.destination === 'SITE'} 
                onChange={(e) => setReceiveData({...receiveData, destination: e.target.value})} 
              />
              WH Site
            </label>
          </div>
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={styles.label}>Tag Number (optional)</label>
          <input
            type="text"
            list="tag-options"
            value={receiveData.tag_number}
            onChange={(e) => setReceiveData({...receiveData, tag_number: e.target.value})}
            style={styles.input}
            placeholder="Select or enter tag..."
          />
          <datalist id="tag-options">
            {allTags.map(t => <option key={t} value={t} />)}
          </datalist>
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={styles.label}>Note (optional)</label>
          <textarea
            value={receiveData.note}
            onChange={(e) => setReceiveData({...receiveData, note: e.target.value})}
            style={{ ...styles.input, minHeight: '60px' }}
            placeholder="Delivery note, tracking number..."
          />
        </div>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          <button onClick={() => setShowReceiveModal(false)} style={{ ...styles.button, ...styles.buttonSecondary }}>Cancel</button>
          <button onClick={receiveComponent} style={{ ...styles.button, backgroundColor: COLORS.success, color: 'white' }}>
            Confirm Receive
          </button>
        </div>
      </Modal>

      {/* Bulk Receive Modal */}
      <Modal isOpen={showBulkModal} onClose={() => setShowBulkModal(false)} title="Receive from MIR" wide>
        <div style={{ marginBottom: '16px' }}>
          <label style={styles.label}>Select MIR</label>
          <select
            value={selectedMir}
            onChange={(e) => handleMirChange(e.target.value)}
            style={styles.select}
          >
            <option value="">-- Select MIR --</option>
            {mirOptions.map(mir => (
              <option key={mir.id} value={mir.id}>
                MIR-{String(mir.mir_number || mir.id).slice(-6)} - {mir.category}
              </option>
            ))}
          </select>
        </div>

        {mirComponents.length > 0 && (
          <>
            <div style={{ marginBottom: '16px' }}>
              <label style={styles.label}>Destination for all materials</label>
              <div style={{ display: 'flex', gap: '16px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input 
                    type="radio" 
                    value="YARD" 
                    checked={bulkDestination === 'YARD'} 
                    onChange={(e) => setBulkDestination(e.target.value)} 
                  />
                  WH Yard
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input 
                    type="radio" 
                    value="SITE" 
                    checked={bulkDestination === 'SITE'} 
                    onChange={(e) => setBulkDestination(e.target.value)} 
                  />
                  WH Site
                </label>
              </div>
            </div>

            <table style={{ ...styles.table, marginBottom: '16px' }}>
              <thead>
                <tr>
                  <th style={styles.th}>Code</th>
                  <th style={styles.th}>Description</th>
                  <th style={styles.th}>Qty</th>
                </tr>
              </thead>
              <tbody>
                {mirComponents.map(comp => (
                  <tr key={comp.id}>
                    <td style={{ ...styles.td, fontFamily: 'monospace' }}>{comp.ident_code}</td>
                    <td style={styles.td}>{comp.description}</td>
                    <td style={styles.td}>{comp.quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button onClick={() => setShowBulkModal(false)} style={{ ...styles.button, ...styles.buttonSecondary }}>Cancel</button>
              <button onClick={receiveBulk} style={{ ...styles.button, backgroundColor: COLORS.success, color: 'white' }}>
                Receive All ({mirComponents.length} items)
              </button>
            </div>
          </>
        )}

        {selectedMir && mirComponents.length === 0 && (
          <p style={{ color: '#6b7280', textAlign: 'center', padding: '20px' }}>
            No ordered components in this MIR
          </p>
        )}
      </Modal>
    </div>
  );
}

// ============================================================
// SPARE PARTS PAGE
// ============================================================
function SparePartsPage({ user }) {
  const [components, setComponents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadComponents();
  }, []);

  const loadComponents = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('request_components')
      .select(`*, requests (request_number, sub_number, sub_category, request_type)`)
      .eq('status', 'Spare');
    if (data) setComponents(data);
    setLoading(false);
  };

  const handleAction = async (component, action) => {
    try {
      switch (action) {
        case 'client':
          await supabase.from('request_components')
            .update({ status: 'Order', order_type: 'Client' })
            .eq('id', component.id);
          break;
        case 'internal':
          await supabase.from('request_components')
            .update({ status: 'Order', order_type: 'Internal' })
            .eq('id', component.id);
          break;
        case 'mng':
          await supabase.from('request_components')
            .update({ status: 'Mng' })
            .eq('id', component.id);
          break;
        case 'return':
          await supabase.from('request_components')
            .update({ status: 'Eng' })
            .eq('id', component.id);
          break;
      }
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
          <h3 style={{ fontWeight: '600' }}>Spare Parts - Client Coordination ({components.length})</h3>
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
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    <button onClick={() => handleAction(comp, 'client')} disabled={!canModify} style={{ ...styles.button, backgroundColor: COLORS.cyan, color: 'white' }}>
                      👤 Client Order
                    </button>
                    <button onClick={() => handleAction(comp, 'internal')} disabled={!canModify} style={{ ...styles.button, backgroundColor: COLORS.info, color: 'white' }}>
                      🏢 Internal Order
                    </button>
                    <button onClick={() => handleAction(comp, 'mng')} disabled={!canModify} style={{ ...styles.button, backgroundColor: COLORS.yellow, color: 'white' }}>
                      💼 Management
                    </button>
                    <ActionButton color={COLORS.gray} onClick={() => handleAction(comp, 'return')} disabled={!canModify} title="Return to Engineering">↩</ActionButton>
                  </div>
                </td>
              </tr>
            ))}
            {components.length === 0 && (
              <tr>
                <td colSpan="5" style={{ ...styles.td, textAlign: 'center', color: '#9ca3af' }}>
                  No components in Spare Parts
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
// ORDERS PAGE - con popup migliorato per data ordine + forecast
// ============================================================
function OrdersPage({ user }) {
  const [activeTab, setActiveTab] = useState('daOrdinare');
  const [toOrderComponents, setToOrderComponents] = useState([]);
  const [orderedComponents, setOrderedComponents] = useState([]);
  const [orderLog, setOrderLog] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [selectedComponent, setSelectedComponent] = useState(null);
  // NEW: Order date and forecast
  const [orderDate, setOrderDate] = useState(new Date().toISOString().split('T')[0]);
  const [expectedDate, setExpectedDate] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    
    const { data: toOrder } = await supabase
      .from('request_components')
      .select(`*, requests (request_number, sub_number)`)
      .eq('status', 'Order');
    if (toOrder) setToOrderComponents(toOrder);

    const { data: ordered } = await supabase
      .from('request_components')
      .select(`*, requests (request_number, sub_number)`)
      .eq('status', 'Ordered');
    if (ordered) setOrderedComponents(ordered);

    const { data: log } = await supabase
      .from('order_log')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50);
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
    try {
      await supabase.from('request_components')
        .update({ 
          status: 'Ordered',
          order_date: orderDate,
          order_forecast: expectedDate || null
        })
        .eq('id', selectedComponent.id);

      // Log the order
      await supabase.from('order_log').insert({
        ident_code: selectedComponent.ident_code,
        quantity: selectedComponent.quantity,
        order_type: selectedComponent.order_type || 'Internal',
        order_date: orderDate,
        expected_date: expectedDate || null,
        ordered_by: user.full_name
      });

      // Record movement
      await supabase.from('movements').insert({
        ident_code: selectedComponent.ident_code,
        movement_type: 'ORDER',
        quantity: selectedComponent.quantity,
        from_location: 'ORDER',
        to_location: 'SUPPLIER',
        performed_by: user.full_name,
        note: `Order placed - Expected: ${expectedDate || 'TBD'}`
      });

      setShowOrderModal(false);
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
      <div style={{ display: 'flex', gap: '4px', marginBottom: '16px' }}>
        {[
          { id: 'daOrdinare', label: `To Order (${toOrderComponents.length})` },
          { id: 'ordinati', label: `Ordered (${orderedComponents.length})` },
          { id: 'log', label: 'Log' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              ...styles.button,
              backgroundColor: activeTab === tab.id ? 'white' : '#e5e7eb',
              color: activeTab === tab.id ? '#1f2937' : '#6b7280',
              borderRadius: '8px 8px 0 0',
              boxShadow: activeTab === tab.id ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div style={styles.card}>
        {activeTab === 'daOrdinare' && (
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
                    <span style={{ ...styles.statusBadge, backgroundColor: comp.order_type === 'Client' ? COLORS.cyan : COLORS.info }}>
                      {comp.order_type || 'Internal'}
                    </span>
                  </td>
                  <td style={styles.td}>
                    <button
                      onClick={() => openOrderModal(comp)}
                      disabled={!canModify}
                      style={{ ...styles.button, backgroundColor: COLORS.success, color: 'white' }}
                    >
                      🛒 Place Order
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

        {activeTab === 'ordinati' && (
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Request #</th>
                <th style={styles.th}>Code</th>
                <th style={styles.th}>Qty</th>
                <th style={styles.th}>Order Date</th>
                <th style={styles.th}>Expected</th>
                <th style={styles.th}>Type</th>
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
                  <td style={styles.td}>
                    <span style={{ ...styles.statusBadge, backgroundColor: comp.order_type === 'Client' ? COLORS.cyan : COLORS.info }}>
                      {comp.order_type || 'Internal'}
                    </span>
                  </td>
                </tr>
              ))}
              {orderedComponents.length === 0 && (
                <tr>
                  <td colSpan="6" style={{ ...styles.td, textAlign: 'center', color: '#9ca3af' }}>
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

      {/* Order Modal with date and forecast */}
      <Modal isOpen={showOrderModal} onClose={() => setShowOrderModal(false)} title="Place Order">
        <div style={{ marginBottom: '16px' }}>
          <p><strong>Code:</strong> {selectedComponent?.ident_code}</p>
          <p><strong>Quantity:</strong> {selectedComponent?.quantity}</p>
          <p><strong>Type:</strong> {selectedComponent?.order_type || 'Internal'}</p>
        </div>
        
        <div style={{ marginBottom: '16px' }}>
          <label style={styles.label}>Order Date *</label>
          <input
            type="date"
            value={orderDate}
            onChange={(e) => setOrderDate(e.target.value)}
            style={styles.input}
          />
        </div>

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
// MANAGEMENT PAGE
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
      .select(`*, requests (request_number, sub_number, request_type)`)
      .eq('status', 'Mng');
    if (data) setComponents(data);
    setLoading(false);
  };

  const handleDecision = async (component, orderType) => {
    try {
      await supabase.from('request_components')
        .update({ status: 'Order', order_type: orderType })
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
          <h3 style={{ fontWeight: '600' }}>Management - Purchase Decisions ({components.length})</h3>
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
                    <button onClick={() => handleDecision(comp, 'Internal')} disabled={!canModify} style={{ ...styles.button, backgroundColor: COLORS.info, color: 'white' }}>
                      🏢 Internal Order
                    </button>
                    <button onClick={() => handleDecision(comp, 'Client')} disabled={!canModify} style={{ ...styles.button, backgroundColor: COLORS.cyan, color: 'white' }}>
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
// MIR PAGE
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
        <button onClick={() => setShowCreateModal(true)} disabled={!canModify} style={{ ...styles.button, ...styles.buttonPrimary }}>
          + New MIR
        </button>
      </div>

      <div style={styles.card}>
        <div style={styles.cardHeader}>
          <h3 style={{ fontWeight: '600' }}>Material Issue Reports ({mirs.length})</h3>
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
                  MIR-{String(mir.mir_number || mir.id).slice(-6)}
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

      <Modal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} title="+ New MIR">
        <div style={{ marginBottom: '16px' }}>
          <label style={styles.label}>Category</label>
          <select value={newMir.category} onChange={(e) => setNewMir({ ...newMir, category: e.target.value })} style={styles.select}>
            {MIR_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
        </div>
        <div style={{ marginBottom: '16px' }}>
          <label style={styles.label}>Priority</label>
          <select value={newMir.priority} onChange={(e) => setNewMir({ ...newMir, priority: e.target.value })} style={styles.select}>
            <option value="Normal">Normal</option>
            <option value="High">High</option>
            <option value="Urgent">Urgent</option>
          </select>
        </div>
        <div style={{ marginBottom: '16px' }}>
          <label style={styles.label}>Expected Date</label>
          <input type="date" value={newMir.expected_date} onChange={(e) => setNewMir({ ...newMir, expected_date: e.target.value })} style={styles.input} />
        </div>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          <button onClick={() => setShowCreateModal(false)} style={{ ...styles.button, ...styles.buttonSecondary }}>Cancel</button>
          <button onClick={createMir} style={{ ...styles.button, ...styles.buttonPrimary }}>Create MIR</button>
        </div>
      </Modal>
    </div>
  );
}

// ============================================================
// LOG PAGE - con + Add Movement e filtri avanzati
// ============================================================
function LogPage({ user }) {
  const [movements, setMovements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ type: '', code: '', request: '' });
  const [showAddModal, setShowAddModal] = useState(false);
  const [newMovement, setNewMovement] = useState({
    movement_type: 'IN',
    ident_code: '',
    quantity: '',
    from_location: '',
    to_location: '',
    note: ''
  });
  const [allIdents, setAllIdents] = useState([]);

  useEffect(() => {
    loadMovements();
    loadIdents();
  }, []);

  const loadMovements = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('movements')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(200);
    if (data) setMovements(data);
    setLoading(false);
  };

  const loadIdents = async () => {
    const { data } = await supabase
      .from('inventory')
      .select('ident_code')
      .order('ident_code');
    if (data) setAllIdents(data.map(d => d.ident_code));
  };

  const filteredMovements = movements.filter(mov => {
    if (filter.type && mov.movement_type !== filter.type) return false;
    if (filter.code && !mov.ident_code?.toLowerCase().includes(filter.code.toLowerCase())) return false;
    if (filter.request && !mov.note?.toLowerCase().includes(filter.request.toLowerCase())) return false;
    return true;
  });

  const addMovement = async () => {
    if (!newMovement.ident_code || !newMovement.quantity) {
      alert('Code and quantity are required');
      return;
    }

    try {
      // Insert movement
      await supabase.from('movements').insert({
        ident_code: newMovement.ident_code,
        movement_type: newMovement.movement_type,
        quantity: parseInt(newMovement.quantity),
        from_location: newMovement.from_location || newMovement.movement_type,
        to_location: newMovement.to_location || newMovement.movement_type,
        performed_by: user.full_name,
        note: newMovement.note
      });

      // Update inventory based on movement type
      const qty = parseInt(newMovement.quantity);
      switch (newMovement.movement_type) {
        case 'IN':
          if (newMovement.to_location === 'YARD') {
            await supabase.rpc('increment_yard_qty', { p_ident_code: newMovement.ident_code, p_qty: qty });
          } else {
            await supabase.rpc('increment_site_qty', { p_ident_code: newMovement.ident_code, p_qty: qty });
          }
          break;
        case 'OUT':
          if (newMovement.from_location === 'YARD') {
            await supabase.rpc('decrement_yard_qty', { p_ident_code: newMovement.ident_code, p_qty: qty });
          } else {
            await supabase.rpc('decrement_site_qty', { p_ident_code: newMovement.ident_code, p_qty: qty });
          }
          break;
        case 'LOST':
          await supabase.from('inventory')
            .update({ lost_qty: supabase.raw('lost_qty + ' + qty) })
            .eq('ident_code', newMovement.ident_code);
          break;
        case 'BROKEN':
          await supabase.from('inventory')
            .update({ broken_qty: supabase.raw('broken_qty + ' + qty) })
            .eq('ident_code', newMovement.ident_code);
          break;
        case 'TRANSFER':
          if (newMovement.from_location === 'YARD' && newMovement.to_location === 'SITE') {
            await supabase.rpc('decrement_yard_qty', { p_ident_code: newMovement.ident_code, p_qty: qty });
            await supabase.rpc('increment_site_qty', { p_ident_code: newMovement.ident_code, p_qty: qty });
          } else if (newMovement.from_location === 'SITE' && newMovement.to_location === 'YARD') {
            await supabase.rpc('decrement_site_qty', { p_ident_code: newMovement.ident_code, p_qty: qty });
            await supabase.rpc('increment_yard_qty', { p_ident_code: newMovement.ident_code, p_qty: qty });
          }
          break;
      }

      setShowAddModal(false);
      setNewMovement({ movement_type: 'IN', ident_code: '', quantity: '', from_location: '', to_location: '', note: '' });
      loadMovements();
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };

  const canModify = user.role === 'admin' || user.perm_movements === 'modify';

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      {/* Header with Add button and filters */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <select 
            value={filter.type} 
            onChange={(e) => setFilter({...filter, type: e.target.value})} 
            style={{ ...styles.select, width: '120px' }}
          >
            <option value="">All Types</option>
            {MOVEMENT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
          <input
            type="text"
            placeholder="Filter by code..."
            value={filter.code}
            onChange={(e) => setFilter({...filter, code: e.target.value})}
            style={{ ...styles.input, width: '150px' }}
          />
          <input
            type="text"
            placeholder="Filter by request/IB..."
            value={filter.request}
            onChange={(e) => setFilter({...filter, request: e.target.value})}
            style={{ ...styles.input, width: '180px' }}
          />
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          disabled={!canModify}
          style={{ ...styles.button, ...styles.buttonPrimary }}
        >
          + Add Movement
        </button>
      </div>

      <div style={styles.card}>
        <div style={styles.cardHeader}>
          <h3 style={{ fontWeight: '600' }}>Movement Log ({filteredMovements.length})</h3>
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
                                    mov.movement_type === 'TRANSFER' ? COLORS.info : COLORS.yellow
                  }}>
                    {mov.movement_type}
                  </span>
                </td>
                <td style={{ ...styles.td, fontFamily: 'monospace' }}>{mov.ident_code}</td>
                <td style={styles.td}>{mov.quantity}</td>
                <td style={styles.td}>{mov.from_location} → {mov.to_location}</td>
                <td style={{ ...styles.td, fontSize: '12px', color: '#6b7280', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {mov.note}
                </td>
                <td style={styles.td}>{mov.performed_by}</td>
              </tr>
            ))}
            {filteredMovements.length === 0 && (
              <tr>
                <td colSpan="7" style={{ ...styles.td, textAlign: 'center', color: '#9ca3af' }}>
                  No movements found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add Movement Modal */}
      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="+ Add Movement">
        <div style={{ marginBottom: '16px' }}>
          <label style={styles.label}>Movement Type *</label>
          <select 
            value={newMovement.movement_type} 
            onChange={(e) => setNewMovement({...newMovement, movement_type: e.target.value})} 
            style={styles.select}
          >
            {MOVEMENT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={styles.label}>Ident Code *</label>
          <input
            type="text"
            list="ident-options"
            value={newMovement.ident_code}
            onChange={(e) => setNewMovement({...newMovement, ident_code: e.target.value})}
            style={styles.input}
            placeholder="Select or type code..."
          />
          <datalist id="ident-options">
            {allIdents.map(code => <option key={code} value={code} />)}
          </datalist>
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={styles.label}>Quantity *</label>
          <input
            type="number"
            value={newMovement.quantity}
            onChange={(e) => setNewMovement({...newMovement, quantity: e.target.value})}
            style={styles.input}
            min="1"
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
          <div>
            <label style={styles.label}>From Location</label>
            <select 
              value={newMovement.from_location} 
              onChange={(e) => setNewMovement({...newMovement, from_location: e.target.value})} 
              style={styles.select}
            >
              <option value="">Select...</option>
              <option value="YARD">YARD</option>
              <option value="SITE">SITE</option>
              <option value="SUPPLIER">SUPPLIER</option>
              <option value="EXTERNAL">EXTERNAL</option>
            </select>
          </div>
          <div>
            <label style={styles.label}>To Location</label>
            <select 
              value={newMovement.to_location} 
              onChange={(e) => setNewMovement({...newMovement, to_location: e.target.value})} 
              style={styles.select}
            >
              <option value="">Select...</option>
              <option value="YARD">YARD</option>
              <option value="SITE">SITE</option>
              <option value="DELIVERED">DELIVERED</option>
              <option value="LOST">LOST</option>
              <option value="BROKEN">BROKEN</option>
            </select>
          </div>
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={styles.label}>Note / Reference</label>
          <textarea
            value={newMovement.note}
            onChange={(e) => setNewMovement({...newMovement, note: e.target.value})}
            style={{ ...styles.input, minHeight: '60px' }}
            placeholder="Request number, IB number, reason..."
          />
        </div>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          <button onClick={() => setShowAddModal(false)} style={{ ...styles.button, ...styles.buttonSecondary }}>Cancel</button>
          <button onClick={addMovement} style={{ ...styles.button, ...styles.buttonPrimary }}>Add Movement</button>
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
  const [search, setSearch] = useState('');
  const [tagFilter, setTagFilter] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [editData, setEditData] = useState({ yard_qty: 0, site_qty: 0, lost_qty: 0, broken_qty: 0 });
  const [allTags, setAllTags] = useState([]);

  useEffect(() => {
    loadInventory();
    loadTags();
  }, []);

  const loadInventory = async () => {
    setLoading(true);
    
    // Load inventory with project data
    const { data: invData } = await supabase
      .from('inventory')
      .select('*')
      .order('ident_code');

    if (invData) {
      // Get project quantities
      const codes = invData.map(i => i.ident_code);
      const { data: projData } = await supabase
        .from('project_materials')
        .select('ident_code, pos_qty')
        .in('ident_code', codes);

      const projMap = {};
      projData?.forEach(p => {
        projMap[p.ident_code] = (projMap[p.ident_code] || 0) + (p.pos_qty || 0);
      });

      const combined = invData.map(inv => ({
        ...inv,
        as_per_project: projMap[inv.ident_code] || 0,
        total: (inv.yard_qty || 0) + (inv.site_qty || 0) + (inv.lost_qty || 0) + (inv.broken_qty || 0)
      }));

      setInventory(combined);
    }
    setLoading(false);
  };

  const loadTags = async () => {
    const { data } = await supabase
      .from('inventory')
      .select('tag_number')
      .not('tag_number', 'is', null);
    if (data) {
      const unique = [...new Set(data.map(d => d.tag_number).filter(Boolean))];
      setAllTags(unique);
    }
  };

  const filteredInventory = inventory.filter(item => {
    if (search && !item.ident_code?.toLowerCase().includes(search.toLowerCase()) && 
        !item.description?.toLowerCase().includes(search.toLowerCase())) return false;
    if (tagFilter && item.tag_number !== tagFilter) return false;
    return true;
  });

  const totals = filteredInventory.reduce((acc, item) => ({
    yard: acc.yard + (item.yard_qty || 0),
    site: acc.site + (item.site_qty || 0),
    lost: acc.lost + (item.lost_qty || 0),
    broken: acc.broken + (item.broken_qty || 0),
    project: acc.project + (item.as_per_project || 0)
  }), { yard: 0, site: 0, lost: 0, broken: 0, project: 0 });

  const openEditModal = (item) => {
    setSelectedItem(item);
    setEditData({
      yard_qty: item.yard_qty || 0,
      site_qty: item.site_qty || 0,
      lost_qty: item.lost_qty || 0,
      broken_qty: item.broken_qty || 0
    });
    setShowEditModal(true);
  };

  const saveEdit = async () => {
    try {
      await supabase.from('inventory')
        .update({
          yard_qty: parseInt(editData.yard_qty) || 0,
          site_qty: parseInt(editData.site_qty) || 0,
          lost_qty: parseInt(editData.lost_qty) || 0,
          broken_qty: parseInt(editData.broken_qty) || 0
        })
        .eq('ident_code', selectedItem.ident_code);

      // Log the balance
      await supabase.from('movements').insert({
        ident_code: selectedItem.ident_code,
        movement_type: 'BAL',
        quantity: 0,
        from_location: 'BALANCE',
        to_location: 'BALANCE',
        performed_by: user.full_name,
        note: `Manual balance adjustment`
      });

      setShowEditModal(false);
      loadInventory();
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };

  const exportCSV = () => {
    const headers = ['Ident Code', 'Description', 'Yard', 'Site', 'Lost', 'Broken', 'Total', 'As Per Project'];
    const rows = filteredInventory.map(item => [
      item.ident_code,
      item.description,
      item.yard_qty,
      item.site_qty,
      item.lost_qty,
      item.broken_qty,
      item.total,
      item.as_per_project
    ]);
    
    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `inventory_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const canModify = user.role === 'admin' || user.perm_database === 'modify';

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      {/* Filters and Actions */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <input
            type="text"
            placeholder="Search code or description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ ...styles.input, width: '250px' }}
          />
          <select
            value={tagFilter}
            onChange={(e) => setTagFilter(e.target.value)}
            style={{ ...styles.select, width: '150px' }}
          >
            <option value="">All Tags</option>
            {allTags.map(tag => <option key={tag} value={tag}>{tag}</option>)}
          </select>
          <span style={{ fontSize: '14px', color: '#6b7280' }}>
            Showing {filteredInventory.length} of {inventory.length}
          </span>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={exportCSV} style={{ ...styles.button, ...styles.buttonSecondary }}>
            📥 Export CSV
          </button>
          <button onClick={() => openEditModal({ ident_code: '', description: '' })} disabled={!canModify} style={{ ...styles.button, backgroundColor: COLORS.info, color: 'white' }}>
            + Manual Balance
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '12px', marginBottom: '16px' }}>
        <div style={{ padding: '16px', backgroundColor: COLORS.secondary, borderRadius: '8px', color: 'white', textAlign: 'center' }}>
          <div style={{ fontSize: '12px', opacity: 0.8 }}>YARD</div>
          <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{totals.yard.toLocaleString()}</div>
        </div>
        <div style={{ padding: '16px', backgroundColor: COLORS.info, borderRadius: '8px', color: 'white', textAlign: 'center' }}>
          <div style={{ fontSize: '12px', opacity: 0.8 }}>SITE</div>
          <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{totals.site.toLocaleString()}</div>
        </div>
        <div style={{ padding: '16px', backgroundColor: COLORS.orange, borderRadius: '8px', color: 'white', textAlign: 'center' }}>
          <div style={{ fontSize: '12px', opacity: 0.8 }}>LOST</div>
          <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{totals.lost.toLocaleString()}</div>
        </div>
        <div style={{ padding: '16px', backgroundColor: COLORS.purple, borderRadius: '8px', color: 'white', textAlign: 'center' }}>
          <div style={{ fontSize: '12px', opacity: 0.8 }}>BROKEN</div>
          <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{totals.broken.toLocaleString()}</div>
        </div>
        <div style={{ padding: '16px', backgroundColor: '#059669', borderRadius: '8px', color: 'white', textAlign: 'center' }}>
          <div style={{ fontSize: '12px', opacity: 0.8 }}>AS PER PROJECT</div>
          <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{totals.project.toLocaleString()}</div>
        </div>
      </div>

      {/* Inventory Table */}
      <div style={styles.card}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Ident Code</th>
              <th style={styles.th}>Description</th>
              <th style={{ ...styles.th, backgroundColor: COLORS.secondary, color: 'white', textAlign: 'center' }}>YARD</th>
              <th style={{ ...styles.th, backgroundColor: COLORS.info, color: 'white', textAlign: 'center' }}>SITE</th>
              <th style={{ ...styles.th, backgroundColor: COLORS.orange, color: 'white', textAlign: 'center' }}>LOST</th>
              <th style={{ ...styles.th, backgroundColor: COLORS.purple, color: 'white', textAlign: 'center' }}>BROKEN</th>
              <th style={{ ...styles.th, textAlign: 'center' }}>TOTAL</th>
              <th style={{ ...styles.th, backgroundColor: '#059669', color: 'white', textAlign: 'center' }}>PROJECT</th>
              <th style={styles.th}></th>
            </tr>
          </thead>
          <tbody>
            {filteredInventory.slice(0, 100).map(item => (
              <tr key={item.ident_code}>
                <td style={{ ...styles.td, fontFamily: 'monospace', fontWeight: '600' }}>{item.ident_code}</td>
                <td style={{ ...styles.td, maxWidth: '250px', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.description}</td>
                <td style={{ ...styles.td, textAlign: 'center', fontWeight: '600' }}>{item.yard_qty || 0}</td>
                <td style={{ ...styles.td, textAlign: 'center', fontWeight: '600' }}>{item.site_qty || 0}</td>
                <td style={{ ...styles.td, textAlign: 'center', fontWeight: '600' }}>{item.lost_qty || 0}</td>
                <td style={{ ...styles.td, textAlign: 'center', fontWeight: '600' }}>{item.broken_qty || 0}</td>
                <td style={{ ...styles.td, textAlign: 'center', fontWeight: '600', color: COLORS.primary }}>{item.total}</td>
                <td style={{ ...styles.td, textAlign: 'center', fontWeight: '600', backgroundColor: '#D1FAE5' }}>{item.as_per_project}</td>
                <td style={styles.td}>
                  <ActionButton color={COLORS.info} onClick={() => openEditModal(item)} disabled={!canModify} title="Edit">✏️</ActionButton>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredInventory.length > 100 && (
          <div style={{ padding: '16px', textAlign: 'center', color: '#6b7280' }}>
            Showing first 100 of {filteredInventory.length} results. Use search to filter.
          </div>
        )}
      </div>

      {/* Edit Modal */}
      <Modal isOpen={showEditModal} onClose={() => setShowEditModal(false)} title={`Edit: ${selectedItem?.ident_code}`}>
        <p style={{ marginBottom: '16px', color: '#6b7280' }}>{selectedItem?.description}</p>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
          <div>
            <label style={styles.label}>Yard Qty</label>
            <input type="number" value={editData.yard_qty} onChange={(e) => setEditData({...editData, yard_qty: e.target.value})} style={styles.input} min="0" />
          </div>
          <div>
            <label style={styles.label}>Site Qty</label>
            <input type="number" value={editData.site_qty} onChange={(e) => setEditData({...editData, site_qty: e.target.value})} style={styles.input} min="0" />
          </div>
          <div>
            <label style={styles.label}>Lost Qty</label>
            <input type="number" value={editData.lost_qty} onChange={(e) => setEditData({...editData, lost_qty: e.target.value})} style={styles.input} min="0" />
          </div>
          <div>
            <label style={styles.label}>Broken Qty</label>
            <input type="number" value={editData.broken_qty} onChange={(e) => setEditData({...editData, broken_qty: e.target.value})} style={styles.input} min="0" />
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          <button onClick={() => setShowEditModal(false)} style={{ ...styles.button, ...styles.buttonSecondary }}>Cancel</button>
          <button onClick={saveEdit} style={{ ...styles.button, ...styles.buttonPrimary }}>Save</button>
        </div>
      </Modal>
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
  const [badges, setBadges] = useState({});

  useEffect(() => {
    if (user) {
      loadBadges();
      const interval = setInterval(loadBadges, 30000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const loadBadges = async () => {
    const counts = {};
    
    const { data: siteData } = await supabase.from('request_components').select('id', { count: 'exact' }).eq('status', 'Site');
    const { data: yardData } = await supabase.from('request_components').select('id', { count: 'exact' }).eq('status', 'Yard');
    const { data: engData } = await supabase.from('request_components').select('id', { count: 'exact' }).eq('status', 'Eng');
    const { data: transData } = await supabase.from('request_components').select('id', { count: 'exact' }).eq('status', 'Trans');
    const { data: orderData } = await supabase.from('request_components').select('id', { count: 'exact' }).eq('status', 'Order');
    const { data: mngData } = await supabase.from('request_components').select('id', { count: 'exact' }).eq('status', 'Mng');
    const { data: spareData } = await supabase.from('request_components').select('id', { count: 'exact' }).eq('status', 'Spare');
    const { data: orderedData } = await supabase.from('request_components').select('id', { count: 'exact' }).eq('status', 'Ordered');

    counts.whSite = siteData?.length || 0;
    counts.whYard = yardData?.length || 0;
    counts.engineering = engData?.length || 0;
    counts.siteIn = transData?.length || 0;
    counts.orders = orderData?.length || 0;
    counts.management = mngData?.length || 0;
    counts.spareParts = spareData?.length || 0;
    counts.materialIn = orderedData?.length || 0;

    setBadges(counts);
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentPage('dashboard');
  };

  if (!user) {
    return <LoginScreen onLogin={setUser} />;
  }

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
    log: 'Movement Log',
    management: 'Management',
    database: 'Database'
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
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1f2937' }}>
            {pageTitles[currentPage]}
          </h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span style={{ fontSize: '14px', color: '#6b7280' }}>
              👤 {user.full_name} ({user.role})
            </span>
            <button onClick={handleLogout} style={{ ...styles.button, ...styles.buttonSecondary }}>
              🚪 Logout
            </button>
          </div>
        </header>
        <main style={styles.content}>
          {renderPage()}
        </main>
      </div>
    </div>
  );
}

export default App;
