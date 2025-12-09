// ============================================================
// MATERIALS MANAGER - APP.JSX COMPLETA
// MAX STREICHER Edition
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
    borderCollapse: 'collapse'
  },
  th: {
    padding: '12px 16px',
    textAlign: 'left',
    fontSize: '12px',
    fontWeight: '500',
    color: '#6b7280',
    backgroundColor: '#f9fafb'
  },
  td: {
    padding: '12px 16px',
    borderTop: '1px solid #e5e7eb',
    fontSize: '14px'
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
  badge: {
    padding: '2px 8px',
    borderRadius: '4px',
    color: 'white',
    fontSize: '11px',
    fontWeight: '500'
  },
  input: {
    width: '100%',
    padding: '8px 12px',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    fontSize: '14px',
    outline: 'none'
  },
  select: {
    width: '100%',
    padding: '8px 12px',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    fontSize: '14px',
    backgroundColor: 'white'
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
    marginBottom: '4px',
    fontSize: '14px',
    fontWeight: '500',
    color: '#374151'
  },
  statsBox: {
    padding: '24px',
    borderRadius: '8px',
    color: 'white'
  }
};

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
        setError('Username o password non validi');
        setLoading(false);
        return;
      }

      localStorage.setItem('user', JSON.stringify(data));
      onLogin(data);
    } catch (err) {
      setError('Errore di connessione');
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: COLORS.secondary
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '40px',
        width: '400px',
        boxShadow: '0 25px 50px rgba(0,0,0,0.25)'
      }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            width: '80px',
            height: '80px',
            backgroundColor: COLORS.primary,
            borderRadius: '16px',
            margin: '0 auto 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <span style={{ color: 'white', fontSize: '28px', fontWeight: 'bold' }}>STR</span>
          </div>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: COLORS.secondary }}>
            MAX STREICHER
          </h1>
          <p style={{ color: '#6b7280', marginTop: '4px' }}>Materials Manager</p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={styles.input}
              placeholder="Inserisci username"
              required
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
              placeholder="Inserisci password"
              required
            />
          </div>
          
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

          <button
            type="submit"
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
            {loading ? 'Accesso...' : 'Accedi'}
          </button>
        </form>

        {/* Demo credentials */}
        <div style={{
          marginTop: '24px',
          padding: '16px',
          backgroundColor: '#f3f4f6',
          borderRadius: '8px',
          fontSize: '12px'
        }}>
          <p style={{ fontWeight: '600', marginBottom: '8px' }}>Credenziali Demo:</p>
          <p>Admin: admin / admin123</p>
          <p>User: mario.rossi / pass123</p>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// COMPONENTE SIDEBAR
// ============================================================
function Sidebar({ user, currentPage, setCurrentPage, collapsed, setCollapsed, onLogout }) {
  const menuItems = [
    { id: 'dashboard', icon: '📊', label: 'Dashboard', perm: 'perm_dashboard' },
    { id: 'requests', icon: '📋', label: 'Requests', perm: 'perm_requests' },
    { id: 'mir', icon: '📦', label: 'MIR', perm: 'perm_mir' },
    { id: 'materialIn', icon: '📥', label: 'Material IN', perm: 'perm_material_in' },
    { id: 'siteIn', icon: '🏗️', label: 'Site IN', perm: 'perm_site_in' },
    { id: 'whSite', icon: '🏭', label: 'WH Site', perm: 'perm_wh_site' },
    { id: 'whYard', icon: '🏢', label: 'WH Yard', perm: 'perm_wh_yard' },
    { id: 'engineering', icon: '⚙️', label: 'Engineering', perm: 'perm_engineering' },
    { id: 'spareParts', icon: '🔧', label: 'Spare Parts', perm: 'perm_spare_parts' },
    { id: 'orders', icon: '🛒', label: 'Orders', perm: 'perm_orders' },
    { id: 'management', icon: '👔', label: 'Management', perm: 'perm_management' },
    { id: 'testPack', icon: '📦', label: 'Test Pack', perm: 'perm_test_pack' },
    { id: 'log', icon: '📜', label: 'LOG', perm: 'perm_log' },
    { id: 'database', icon: '💾', label: 'Database', perm: 'perm_database' }
  ];

  const visibleItems = menuItems.filter(item => {
    if (user.role === 'admin') return true;
    return user[item.perm] && user[item.perm] !== 'none';
  });

  return (
    <div style={{
      ...styles.sidebar,
      ...(collapsed ? styles.sidebarCollapsed : {})
    }}>
      {/* Logo */}
      <div style={styles.logo}>
        <div style={styles.logoIcon}>STR</div>
        {!collapsed && (
          <div>
            <div style={{ color: 'white', fontWeight: 'bold', fontSize: '14px' }}>MAX STREICHER</div>
            <div style={{ color: '#9ca3af', fontSize: '12px' }}>Materials Manager</div>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          style={{
            marginLeft: 'auto',
            background: 'none',
            border: 'none',
            color: '#9ca3af',
            cursor: 'pointer',
            fontSize: '18px',
            padding: '4px'
          }}
        >
          {collapsed ? '→' : '←'}
        </button>
      </div>

      {/* Navigation */}
      <nav style={styles.nav}>
        {visibleItems.map(item => (
          <div
            key={item.id}
            onClick={() => setCurrentPage(item.id)}
            style={{
              ...styles.navItem,
              ...(currentPage === item.id ? styles.navItemActive : {})
            }}
            title={collapsed ? item.label : ''}
          >
            <span style={{ fontSize: '20px' }}>{item.icon}</span>
            {!collapsed && <span style={{ fontSize: '14px' }}>{item.label}</span>}
          </div>
        ))}
      </nav>

      {/* User & Logout */}
      <div style={{ padding: '16px', borderTop: '1px solid #374151' }}>
        {!collapsed && (
          <div style={{ color: '#9ca3af', fontSize: '12px', marginBottom: '8px' }}>
            {user.full_name} ({user.role})
          </div>
        )}
        <div
          onClick={onLogout}
          style={{ ...styles.navItem, padding: '8px 16px' }}
        >
          <span>🚪</span>
          {!collapsed && <span style={{ fontSize: '14px' }}>Logout</span>}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// COMPONENTE MODAL GENERICO
// ============================================================
function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;

  return (
    <div style={styles.modal} onClick={onClose}>
      <div style={styles.modalContent} onClick={e => e.stopPropagation()}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px'
        }}>
          <h3 style={{ fontSize: '18px', fontWeight: '600' }}>{title}</h3>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer',
              color: '#6b7280'
            }}
          >
            ×
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

// ============================================================
// PAGINA DASHBOARD
// ============================================================
function DashboardPage({ user }) {
  const [stats, setStats] = useState({
    yard: 0,
    site: 0,
    lost: 0,
    broken: 0,
    activeRequests: 0,
    inEngineering: 0,
    toOrder: 0
  });
  const [recentMovements, setRecentMovements] = useState([]);
  const [kpis, setKpis] = useState({
    closedIn1Day: 0,
    closed2to7Days: 0,
    closedUnder3Weeks: 0,
    closedOver3Weeks: 0,
    passedEngineering: 0,
    passedManagement: 0,
    becameOrders: 0
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    // Load inventory stats
    const { data: inventory } = await supabase
      .from('project_database')
      .select('qty_yard, qty_site');

    if (inventory) {
      setStats(prev => ({
        ...prev,
        yard: inventory.reduce((sum, item) => sum + (item.qty_yard || 0), 0),
        site: inventory.reduce((sum, item) => sum + (item.qty_site || 0), 0)
      }));
    }

    // Load active requests count
    const { count: activeCount } = await supabase
      .from('request_components')
      .select('*', { count: 'exact', head: true })
      .not('status', 'eq', 'Done');

    setStats(prev => ({ ...prev, activeRequests: activeCount || 0 }));

    // Load recent movements
    const { data: movements } = await supabase
      .from('movements')
      .select('*')
      .order('movement_date', { ascending: false })
      .limit(5);

    setRecentMovements(movements || []);

    // Load KPIs from log
    const { data: logData } = await supabase
      .from('log_requests')
      .select('days_to_close, passed_engineering, passed_management, became_order');

    if (logData) {
      setKpis({
        closedIn1Day: logData.filter(r => r.days_to_close <= 1).length,
        closed2to7Days: logData.filter(r => r.days_to_close >= 2 && r.days_to_close <= 7).length,
        closedUnder3Weeks: logData.filter(r => r.days_to_close >= 8 && r.days_to_close <= 21).length,
        closedOver3Weeks: logData.filter(r => r.days_to_close > 21).length,
        passedEngineering: logData.filter(r => r.passed_engineering).length,
        passedManagement: logData.filter(r => r.passed_management).length,
        becameOrders: logData.filter(r => r.became_order).length
      });
    }
  };

  return (
    <div>
      <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '24px' }}>Dashboard</h2>

      {/* Inventory Overview */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
        <div style={{ ...styles.statsBox, backgroundColor: COLORS.secondary }}>
          <h3 style={{ fontSize: '18px', marginBottom: '8px' }}>YARD</h3>
          <p style={{ fontSize: '32px', fontWeight: 'bold' }}>{stats.yard.toLocaleString()}</p>
        </div>
        <div style={{ ...styles.statsBox, backgroundColor: COLORS.info }}>
          <h3 style={{ fontSize: '18px', marginBottom: '8px' }}>SITE</h3>
          <p style={{ fontSize: '32px', fontWeight: 'bold' }}>{stats.site.toLocaleString()}</p>
        </div>
        <div style={{ ...styles.statsBox, backgroundColor: COLORS.orange }}>
          <h3 style={{ fontSize: '18px', marginBottom: '8px' }}>LOST</h3>
          <p style={{ fontSize: '32px', fontWeight: 'bold' }}>{stats.lost}</p>
        </div>
        <div style={{ ...styles.statsBox, backgroundColor: COLORS.purple }}>
          <h3 style={{ fontSize: '18px', marginBottom: '8px' }}>BROKEN</h3>
          <p style={{ fontSize: '32px', fontWeight: 'bold' }}>{stats.broken}</p>
        </div>
      </div>

      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
        <div style={{ ...styles.statsBox, backgroundColor: COLORS.success }}>
          <h3 style={{ fontSize: '14px', marginBottom: '8px' }}>⚡ Chiuse in 1 giorno</h3>
          <p style={{ fontSize: '28px', fontWeight: 'bold' }}>{kpis.closedIn1Day}</p>
        </div>
        <div style={{ ...styles.statsBox, backgroundColor: COLORS.info }}>
          <h3 style={{ fontSize: '14px', marginBottom: '8px' }}>📅 Chiuse 2-7 giorni</h3>
          <p style={{ fontSize: '28px', fontWeight: 'bold' }}>{kpis.closed2to7Days}</p>
        </div>
        <div style={{ ...styles.statsBox, backgroundColor: COLORS.warning }}>
          <h3 style={{ fontSize: '14px', marginBottom: '8px' }}>📆 Chiuse &lt;3 settimane</h3>
          <p style={{ fontSize: '28px', fontWeight: 'bold' }}>{kpis.closedUnder3Weeks}</p>
        </div>
        <div style={{ ...styles.statsBox, backgroundColor: COLORS.primary }}>
          <h3 style={{ fontSize: '14px', marginBottom: '8px' }}>⏰ Chiuse &gt;3 settimane</h3>
          <p style={{ fontSize: '28px', fontWeight: 'bold' }}>{kpis.closedOver3Weeks}</p>
        </div>
      </div>

      {/* Active Requests */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
        <div style={styles.card}>
          <div style={{ padding: '24px', textAlign: 'center' }}>
            <p style={{ color: '#6b7280', marginBottom: '8px' }}>🔧 Passate da Engineering</p>
            <p style={{ fontSize: '32px', fontWeight: 'bold', color: COLORS.purple }}>{kpis.passedEngineering}</p>
          </div>
        </div>
        <div style={styles.card}>
          <div style={{ padding: '24px', textAlign: 'center' }}>
            <p style={{ color: '#6b7280', marginBottom: '8px' }}>👔 Passate da Management</p>
            <p style={{ fontSize: '32px', fontWeight: 'bold', color: COLORS.yellow }}>{kpis.passedManagement}</p>
          </div>
        </div>
        <div style={styles.card}>
          <div style={{ padding: '24px', textAlign: 'center' }}>
            <p style={{ color: '#6b7280', marginBottom: '8px' }}>🛒 Diventate Ordini</p>
            <p style={{ fontSize: '32px', fontWeight: 'bold', color: COLORS.primary }}>{kpis.becameOrders}</p>
          </div>
        </div>
      </div>

      {/* Recent Movements */}
      <div style={styles.card}>
        <div style={styles.cardHeader}>
          <h3 style={{ fontSize: '18px', fontWeight: '600' }}>Ultimi Movimenti</h3>
        </div>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Data</th>
              <th style={styles.th}>Tipo</th>
              <th style={styles.th}>Codice</th>
              <th style={styles.th}>Qty</th>
              <th style={styles.th}>Location</th>
              <th style={styles.th}>Note</th>
            </tr>
          </thead>
          <tbody>
            {recentMovements.map(mov => (
              <tr key={mov.id}>
                <td style={styles.td}>{new Date(mov.movement_date).toLocaleDateString('it-IT')}</td>
                <td style={styles.td}>
                  <span style={{
                    ...styles.badge,
                    backgroundColor: mov.type === 'IN' ? COLORS.success : 
                                    mov.type === 'OUT' ? COLORS.primary :
                                    mov.type === 'BAL' ? COLORS.warning : COLORS.info
                  }}>
                    {mov.type}
                  </span>
                </td>
                <td style={{ ...styles.td, fontFamily: 'monospace' }}>{mov.ident_code}</td>
                <td style={styles.td}>{mov.quantity > 0 ? '+' : ''}{mov.quantity}</td>
                <td style={styles.td}>{mov.location}</td>
                <td style={{ ...styles.td, color: '#6b7280', fontSize: '12px' }}>{mov.note}</td>
              </tr>
            ))}
            {recentMovements.length === 0 && (
              <tr>
                <td colSpan="6" style={{ ...styles.td, textAlign: 'center', color: '#9ca3af' }}>
                  Nessun movimento registrato
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
// PAGINA NUOVA RICHIESTA
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
  const [nextNumber, setNextNumber] = useState(1);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    loadIsoOptions();
    loadNextNumber();
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
      const unique = [...new Set(data.map(d => d.iso_number))];
      setIsoOptions(unique);
    }
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
    loadIdentOptions(value);
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
      if (requestType === 'Piping' && (!isoNumber || !spoolNumber)) {
        throw new Error('ISO Number e Full Spool Number sono obbligatori per Piping');
      }
      if (requestType === 'Mechanical' && !description) {
        throw new Error('Descrizione è obbligatoria per Mechanical');
      }
      if (requestType === 'TestPack' && !testPackNumber) {
        throw new Error('Test Pack Number è obbligatorio');
      }
      if (requestType !== 'Mechanical' && materials.length === 0 && missingType === 'Material') {
        throw new Error('Aggiungi almeno un materiale');
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
          iso_number: isoNumber || null,
          full_spool_number: spoolNumber || null,
          hf_number: requestType === 'Piping' && subCategory === 'Erection' ? hfNumber : null,
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

      setMessage({ type: 'success', text: `Richiesta ${String(reqNumber).padStart(5, '0')}-0 creata con successo!` });
      
      // Reset form
      setIsoNumber('');
      setSpoolNumber('');
      setHfNumber('');
      setDescription('');
      setTestPackNumber('');
      setMaterials([]);
      loadNextNumber();

    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setLoading(false);
    }
  };

  const canModify = user.role === 'admin' || user.perm_requests === 'modify';

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 'bold' }}>Nuova Richiesta</h2>
        <div style={{
          padding: '8px 16px',
          backgroundColor: '#f3f4f6',
          borderRadius: '6px',
          fontSize: '14px'
        }}>
          Preview: <strong>{String(nextNumber).padStart(5, '0')}-0</strong> (non salvato)
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
            <label style={{ ...styles.label, marginBottom: '12px' }}>Tipo Richiesta</label>
            <div style={{ display: 'flex', gap: '16px' }}>
              {REQUEST_TYPES.map(type => (
                <label key={type} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name="requestType"
                    value={type}
                    checked={requestType === type}
                    onChange={(e) => setRequestType(e.target.value)}
                    disabled={!canModify}
                  />
                  <span style={{ fontWeight: requestType === type ? '600' : '400' }}>{type}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Piping Form */}
          {requestType === 'Piping' && (
            <>
              <div style={{ marginBottom: '16px' }}>
                <label style={styles.label}>Sub-Category</label>
                <select
                  value={subCategory}
                  onChange={(e) => setSubCategory(e.target.value)}
                  style={styles.select}
                  disabled={!canModify}
                >
                  {SUB_CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <label style={styles.label}>ISO Number *</label>
                  <input
                    type="text"
                    list="iso-options"
                    value={isoNumber}
                    onChange={(e) => handleIsoChange(e.target.value)}
                    style={styles.input}
                    placeholder="Es: I181C02-DF21065-0-01"
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
                    placeholder="Es: I181C02-DF21065-0-01-SP001"
                    disabled={!canModify}
                  />
                </div>
              </div>

              {subCategory === 'Erection' && (
                <div style={{ marginBottom: '16px' }}>
                  <label style={styles.label}>HF Number *</label>
                  <input
                    type="text"
                    value={hfNumber}
                    onChange={(e) => setHfNumber(e.target.value)}
                    style={styles.input}
                    placeholder="Numero HF"
                    disabled={!canModify}
                  />
                </div>
              )}
            </>
          )}

          {/* Mechanical Form */}
          {requestType === 'Mechanical' && (
            <div style={{ marginBottom: '16px' }}>
              <label style={styles.label}>Descrizione *</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                style={{ ...styles.input, minHeight: '100px' }}
                placeholder="Descrivi la richiesta mechanical..."
                disabled={!canModify}
              />
              <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
                Per richieste Mechanical, tutti gli altri campi sono disabilitati.
              </p>
            </div>
          )}

          {/* TestPack Form */}
          {requestType === 'TestPack' && (
            <>
              <div style={{ marginBottom: '16px' }}>
                <label style={styles.label}>Test Pack Number *</label>
                <input
                  type="text"
                  value={testPackNumber}
                  onChange={(e) => setTestPackNumber(e.target.value)}
                  style={styles.input}
                  placeholder="Es: TP-2024-001"
                  disabled={!canModify}
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <label style={styles.label}>ISO Number (opzionale)</label>
                  <input
                    type="text"
                    value={isoNumber}
                    onChange={(e) => handleIsoChange(e.target.value)}
                    style={styles.input}
                    disabled={!canModify}
                  />
                </div>
                <div>
                  <label style={styles.label}>Full Spool Number (opzionale)</label>
                  <input
                    type="text"
                    value={spoolNumber}
                    onChange={(e) => setSpoolNumber(e.target.value)}
                    style={styles.input}
                    disabled={!canModify}
                  />
                </div>
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label style={styles.label}>Missing Type</label>
                <div style={{ display: 'flex', gap: '16px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <input
                      type="radio"
                      name="missingType"
                      value="Material"
                      checked={missingType === 'Material'}
                      onChange={(e) => setMissingType(e.target.value)}
                    />
                    Material
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <input
                      type="radio"
                      name="missingType"
                      value="Spool"
                      checked={missingType === 'Spool'}
                      onChange={(e) => setMissingType(e.target.value)}
                    />
                    Spool
                  </label>
                </div>
              </div>
              {missingType === 'Spool' && (
                <div style={{ marginBottom: '16px' }}>
                  <label style={styles.label}>Descrizione Spool Mancante</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    style={{ ...styles.input, minHeight: '80px' }}
                    placeholder="Descrivi lo spool mancante..."
                    disabled={!canModify}
                  />
                </div>
              )}
            </>
          )}

          {/* Materials Section (for Piping and TestPack with Material) */}
          {requestType !== 'Mechanical' && (requestType !== 'TestPack' || missingType === 'Material') && (
            <div style={{
              marginTop: '24px',
              padding: '16px',
              backgroundColor: '#f9fafb',
              borderRadius: '8px'
            }}>
              <h4 style={{ fontWeight: '600', marginBottom: '16px' }}>📦 Aggiungi Materiali</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr auto', gap: '12px', alignItems: 'end' }}>
                <div>
                  <label style={styles.label}>Ident Code</label>
                  <select
                    value={currentMaterial.ident_code}
                    onChange={(e) => setCurrentMaterial({ ...currentMaterial, ident_code: e.target.value })}
                    style={styles.select}
                    disabled={!canModify}
                  >
                    <option value="">Seleziona...</option>
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
                    disabled={!canModify || !identOptions.some(o => o.ident_code === currentMaterial.ident_code && o.tag)}
                  >
                    <option value="">Nessuno</option>
                    {identOptions
                      .filter(o => o.ident_code === currentMaterial.ident_code && o.tag)
                      .map(o => (
                        <option key={o.tag} value={o.tag}>{o.tag}</option>
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
                  style={{ ...styles.button, ...styles.buttonPrimary, height: '38px' }}
                  disabled={!canModify}
                >
                  + Add
                </button>
              </div>

              {/* Materials List */}
              {materials.length > 0 && (
                <table style={{ ...styles.table, marginTop: '16px' }}>
                  <thead>
                    <tr>
                      <th style={styles.th}>Codice</th>
                      <th style={styles.th}>Tag</th>
                      <th style={styles.th}>Descrizione</th>
                      <th style={styles.th}>Qty</th>
                      <th style={styles.th}>YARD</th>
                      <th style={styles.th}>SITE</th>
                      <th style={styles.th}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {materials.map((mat, idx) => (
                      <tr key={idx}>
                        <td style={{ ...styles.td, fontFamily: 'monospace' }}>{mat.ident_code}</td>
                        <td style={styles.td}>{mat.tag || '-'}</td>
                        <td style={styles.td}>{mat.description}</td>
                        <td style={styles.td}>{mat.qty}</td>
                        <td style={{ ...styles.td, color: COLORS.secondary, fontWeight: '600' }}>{mat.qty_yard}</td>
                        <td style={{ ...styles.td, color: COLORS.info, fontWeight: '600' }}>{mat.qty_site}</td>
                        <td style={styles.td}>
                          <button
                            onClick={() => removeMaterial(idx)}
                            style={{ ...styles.actionBtn, backgroundColor: COLORS.primary }}
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

          {/* Submit Buttons */}
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
  const [engNotes, setEngNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedComponent, setSelectedComponent] = useState(null);
  const [showPassageModal, setShowPassageModal] = useState(false);
  const [passageNote, setPassageNote] = useState('');
  const [passageDestination, setPassageDestination] = useState('Yard');
  const [showCheckResponseModal, setShowCheckResponseModal] = useState(false);

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
          requester_user_id,
          iso_number
        )
      `)
      .eq('status', 'Site')
      .order('created_at', { ascending: false });

    // Get inventory data for each component
    if (siteComponents) {
      const enrichedComponents = await Promise.all(
        siteComponents.map(async (comp) => {
          const { data: invData } = await supabase
            .from('project_database')
            .select('qty_yard, qty_site')
            .eq('ident_code', comp.ident_code)
            .maybeSingle();
          
          return {
            ...comp,
            qty_yard: invData?.qty_yard || 0,
            qty_site: invData?.qty_site || 0
          };
        })
      );
      setComponents(enrichedComponents);
    }

    // Load ToCollect items
    const { data: collectItems } = await supabase
      .from('request_components')
      .select(`
        *,
        requests (
          request_number,
          sub_number,
          requester_user_id
        )
      `)
      .eq('status', 'ToCollect')
      .eq('current_location', 'SITE');

    if (collectItems) {
      // Get requester names
      const enrichedCollect = await Promise.all(
        collectItems.map(async (item) => {
          const { data: userData } = await supabase
            .from('users')
            .select('full_name')
            .eq('id', item.requests.requester_user_id)
            .single();
          return { ...item, requester_name: userData?.full_name || 'Unknown' };
        })
      );
      setToCollect(enrichedCollect);
    }

    // Load engineering notes (checks pending)
    const { data: checkItems } = await supabase
      .from('request_components')
      .select(`
        *,
        requests (request_number, sub_number)
      `)
      .eq('has_eng_check', true)
      .or('eng_check_sent_to.eq.Site,eng_check_sent_to.eq.Both')
      .is('eng_check_site_response', null);

    setEngNotes(checkItems || []);
    setLoading(false);
  };

  const handleAction = async (component, action) => {
    setSelectedComponent(component);
    
    switch(action) {
      case 'ready':
        await moveToCollect(component);
        break;
      case 'yard':
        setPassageDestination('Yard');
        setShowPassageModal(true);
        break;
      case 'engineering':
        setPassageDestination('Eng');
        setShowPassageModal(true);
        break;
      case 'checkResponse':
        setShowCheckResponseModal(true);
        break;
      default:
        break;
    }
  };

  const moveToCollect = async (component) => {
    await supabase
      .from('request_components')
      .update({ status: 'ToCollect' })
      .eq('id', component.id);

    await logHistory(component.id, 'Prepared for Collection', 'Site', 'ToCollect');
    loadComponents();
  };

  const confirmPassage = async () => {
    if (!selectedComponent) return;

    await supabase
      .from('request_components')
      .update({
        status: passageDestination,
        passage_note: passageNote,
        current_location: passageDestination === 'Yard' ? 'YARD' : null
      })
      .eq('id', selectedComponent.id);

    await logHistory(
      selectedComponent.id,
      `Sent to ${passageDestination}`,
      'Site',
      passageDestination,
      passageNote
    );

    setShowPassageModal(false);
    setPassageNote('');
    loadComponents();
  };

  const handleCheckResponse = async (response) => {
    if (!selectedComponent) return;

    const updates = {
      eng_check_site_response: response
    };

    // If resolved, move to ToCollect
    if (response === 'Resolved') {
      updates.status = 'ToCollect';
      updates.has_eng_check = false;

      // If sent to Both, clear the check for Yard too
      if (selectedComponent.eng_check_sent_to === 'Both') {
        // The notification should disappear from Yard
      }
    }

    await supabase
      .from('request_components')
      .update(updates)
      .eq('id', selectedComponent.id);

    await logHistory(
      selectedComponent.id,
      `Check Response: ${response}`,
      'Site',
      response === 'Resolved' ? 'ToCollect' : 'Site'
    );

    // If both responded NotFound, create BAL movement
    if (response === 'NotFound') {
      const { data: comp } = await supabase
        .from('request_components')
        .select('eng_check_yard_response, eng_check_sent_to')
        .eq('id', selectedComponent.id)
        .single();

      if (comp.eng_check_sent_to === 'Both' && comp.eng_check_yard_response === 'NotFound') {
        // Both not found - create automatic BAL
        await createAutomaticBAL(selectedComponent);
      }
    }

    setShowCheckResponseModal(false);
    loadComponents();
  };

  const createAutomaticBAL = async (component) => {
    // Zero out quantities
    await supabase
      .from('project_database')
      .update({ qty_yard: 0, qty_site: 0 })
      .eq('ident_code', component.ident_code);

    // Create movement record
    await supabase.from('movements').insert({
      type: 'BAL',
      location: 'YARD+SITE',
      ident_code: component.ident_code,
      tag: component.tag,
      quantity: 0,
      note: 'Azzeramento automatico da Check Engineering - Non trovato in Site e Yard',
      balance_type: 'CheckNotFound',
      auto_generated: true,
      created_by_user_id: user.id
    });
  };

  const logHistory = async (componentId, action, fromStatus, toStatus, note = null) => {
    await supabase.from('component_history').insert({
      component_id: componentId,
      action,
      from_status: fromStatus,
      to_status: toStatus,
      note,
      performed_by_user_id: user.id,
      performed_by_name: user.full_name
    });
  };

  const handleCollect = async (item) => {
    // Only requester can collect
    if (item.requests.requester_user_id !== user.id && user.role !== 'admin') {
      alert('Solo chi ha creato la richiesta può ritirare il materiale');
      return;
    }

    // Update status to Done
    await supabase
      .from('request_components')
      .update({ status: 'Done' })
      .eq('id', item.id);

    // Subtract from inventory
    const { data: inv } = await supabase
      .from('project_database')
      .select('qty_site')
      .eq('ident_code', item.ident_code)
      .maybeSingle();

    if (inv) {
      await supabase
        .from('project_database')
        .update({ qty_site: Math.max(0, inv.qty_site - item.quantity) })
        .eq('ident_code', item.ident_code);
    }

    // Create movement
    await supabase.from('movements').insert({
      type: 'DEL',
      location: 'SITE',
      ident_code: item.ident_code,
      tag: item.tag,
      quantity: -item.quantity,
      note: `Delivered - Request ${item.requests.request_number}-${item.requests.sub_number}`,
      request_reference: `${item.requests.request_number}-${item.requests.sub_number}`,
      created_by_user_id: user.id
    });

    // Log to log_requests
    await supabase.from('log_requests').insert({
      request_number: `${item.requests.request_number}-${item.requests.sub_number}`,
      ident_code: item.ident_code,
      tag: item.tag,
      description: item.description,
      quantity: item.quantity,
      created_at: item.created_at,
      close_type: 'Delivered',
      closed_by_user_id: user.id
    });

    await logHistory(item.id, 'Collected/Delivered', 'ToCollect', 'Done');
    loadComponents();
  };

  const canModify = user.role === 'admin' || user.perm_wh_site === 'modify';

  if (loading) {
    return <div style={{ padding: '24px', textAlign: 'center' }}>Caricamento...</div>;
  }

  return (
    <div>
      <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '24px' }}>WH Site</h2>

      {/* Engineering Notes Alert */}
      {engNotes.length > 0 && (
        <div style={{
          backgroundColor: '#F3E8FF',
          border: '1px solid #C4B5FD',
          borderRadius: '8px',
          padding: '16px',
          marginBottom: '24px'
        }}>
          <h4 style={{ color: COLORS.purple, fontWeight: '600', marginBottom: '12px' }}>
            🔍 Check da Engineering ({engNotes.length})
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
              <button
                onClick={() => handleAction(note, 'checkResponse')}
                style={{ ...styles.actionBtn, backgroundColor: COLORS.purple }}
                disabled={!canModify}
              >
                🔍
              </button>
            </div>
          ))}
        </div>
      )}

      {/* To Be Collected Section */}
      {toCollect.length > 0 && (
        <div style={{ ...styles.card, marginBottom: '24px' }}>
          <div style={{ ...styles.cardHeader, backgroundColor: '#DCFCE7' }}>
            <h3 style={{ color: COLORS.success, fontWeight: '600' }}>📤 To Be Collected</h3>
          </div>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>N° Richiesta</th>
                <th style={styles.th}>Codice</th>
                <th style={styles.th}>Qty</th>
                <th style={styles.th}>Richiedente</th>
                <th style={styles.th}>Azioni</th>
              </tr>
            </thead>
            <tbody>
              {toCollect.map(item => (
                <tr key={item.id}>
                  <td style={{ ...styles.td, fontFamily: 'monospace', fontWeight: '600' }}>
                    {String(item.requests.request_number).padStart(5, '0')}-{item.requests.sub_number}
                  </td>
                  <td style={{ ...styles.td, fontFamily: 'monospace' }}>{item.ident_code}</td>
                  <td style={styles.td}>{item.quantity}</td>
                  <td style={styles.td}>{item.requester_name}</td>
                  <td style={styles.td}>
                    <button
                      onClick={() => handleCollect(item)}
                      disabled={!canModify || (item.requests.requester_user_id !== user.id && user.role !== 'admin')}
                      style={{
                        ...styles.actionBtn,
                        backgroundColor: item.requests.requester_user_id === user.id || user.role === 'admin'
                          ? COLORS.success
                          : COLORS.gray,
                        cursor: item.requests.requester_user_id === user.id || user.role === 'admin'
                          ? 'pointer'
                          : 'not-allowed'
                      }}
                      title={item.requests.requester_user_id !== user.id && user.role !== 'admin'
                        ? `Solo ${item.requester_name} può ritirare`
                        : 'Ritira'}
                    >
                      ✓
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Main Components Table */}
      <div style={styles.card}>
        <div style={styles.cardHeader}>
          <h3 style={{ fontWeight: '600' }}>Componenti in WH Site</h3>
        </div>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>N° Richiesta</th>
              <th style={styles.th}>Codice</th>
              <th style={styles.th}>Tag</th>
              <th style={styles.th}>Descrizione</th>
              <th style={styles.th}>Qty</th>
              <th style={{ ...styles.th, backgroundColor: COLORS.secondary, color: 'white' }}>YARD</th>
              <th style={{ ...styles.th, backgroundColor: COLORS.info, color: 'white' }}>SITE</th>
              <th style={styles.th}>Azioni</th>
            </tr>
          </thead>
          <tbody>
            {components.map(comp => (
              <tr key={comp.id}>
                <td style={{ ...styles.td, fontFamily: 'monospace', fontWeight: '600' }}>
                  {comp.requests ? `${String(comp.requests.request_number).padStart(5, '0')}-${comp.requests.sub_number}` : '-'}
                </td>
                <td style={{ ...styles.td, fontFamily: 'monospace' }}>{comp.ident_code}</td>
                <td style={styles.td}>{comp.tag || '-'}</td>
                <td style={styles.td}>{comp.description}</td>
                <td style={styles.td}>{comp.quantity}</td>
                <td style={{ ...styles.td, fontWeight: '600' }}>{comp.qty_yard}</td>
                <td style={{ ...styles.td, fontWeight: '600' }}>{comp.qty_site}</td>
                <td style={styles.td}>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    <button
                      onClick={() => handleAction(comp, 'ready')}
                      style={{ ...styles.actionBtn, backgroundColor: COLORS.success }}
                      title="Prepara consegna"
                      disabled={!canModify}
                    >
                      ✓
                    </button>
                    <button
                      onClick={() => handleAction(comp, 'yard')}
                      style={{ ...styles.actionBtn, backgroundColor: COLORS.secondary }}
                      title="Invia a Yard"
                      disabled={!canModify}
                    >
                      Y
                    </button>
                    <button
                      onClick={() => handleAction(comp, 'engineering')}
                      style={{ ...styles.actionBtn, backgroundColor: COLORS.purple }}
                      title="Invia a Engineering"
                      disabled={!canModify}
                    >
                      UT
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {components.length === 0 && (
              <tr>
                <td colSpan="8" style={{ ...styles.td, textAlign: 'center', color: '#9ca3af' }}>
                  Nessun componente in WH Site
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Passage Modal */}
      <Modal
        isOpen={showPassageModal}
        onClose={() => setShowPassageModal(false)}
        title="📝 Nota Passaggio"
      >
        <div style={styles.formGroup}>
          <label style={styles.label}>Destinazione</label>
          <select
            value={passageDestination}
            onChange={(e) => setPassageDestination(e.target.value)}
            style={styles.select}
          >
            <option value="Yard">→ YARD</option>
            <option value="Eng">→ ENGINEERING</option>
          </select>
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Nota (opzionale)</label>
          <textarea
            value={passageNote}
            onChange={(e) => setPassageNote(e.target.value)}
            style={{ ...styles.input, minHeight: '100px' }}
            placeholder="Spiega il motivo del passaggio..."
          />
        </div>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          <button
            onClick={() => setShowPassageModal(false)}
            style={{ ...styles.button, ...styles.buttonSecondary }}
          >
            Annulla
          </button>
          <button
            onClick={confirmPassage}
            style={{ ...styles.button, ...styles.buttonPrimary }}
          >
            ✓ Conferma
          </button>
        </div>
      </Modal>

      {/* Check Response Modal */}
      <Modal
        isOpen={showCheckResponseModal}
        onClose={() => setShowCheckResponseModal(false)}
        title="📥 Check U.T."
      >
        <div style={{
          padding: '12px',
          backgroundColor: '#f3f4f6',
          borderRadius: '6px',
          marginBottom: '16px'
        }}>
          {selectedComponent?.eng_check_message}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <button
            onClick={() => handleCheckResponse('Resolved')}
            style={{
              ...styles.button,
              backgroundColor: COLORS.success,
              color: 'white',
              justifyContent: 'center',
              padding: '12px'
            }}
          >
            ✓ Risolto
          </button>
          <button
            onClick={() => handleCheckResponse('NotFound')}
            style={{
              ...styles.button,
              backgroundColor: COLORS.orange,
              color: 'white',
              justifyContent: 'center',
              padding: '12px'
            }}
          >
            ✗ Non trovato
          </button>
          <button
            onClick={() => handleCheckResponse('Other')}
            style={{
              ...styles.button,
              backgroundColor: COLORS.info,
              color: 'white',
              justifyContent: 'center',
              padding: '12px'
            }}
          >
            ↔ Altro
          </button>
          <button
            onClick={() => setShowCheckResponseModal(false)}
            style={{
              ...styles.button,
              ...styles.buttonSecondary,
              justifyContent: 'center',
              padding: '12px'
            }}
          >
            Chiudi
          </button>
        </div>
      </Modal>
    </div>
  );
}

// Continua nel prossimo file per completare tutte le pagine...
// Per ora esportiamo l'App principale

// ============================================================
// PAGINE PLACEHOLDER (da completare)
// ============================================================
function PlaceholderPage({ title }) {
  return (
    <div style={styles.card}>
      <div style={{ padding: '48px', textAlign: 'center' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px' }}>{title}</h2>
        <p style={{ color: '#6b7280' }}>Questa pagina è in fase di sviluppo...</p>
      </div>
    </div>
  );
}

// ============================================================
// PAGINA MIR
// ============================================================
function MIRPage({ user }) {
  const [mirs, setMirs] = useState([]);
  const [showNewMirModal, setShowNewMirModal] = useState(false);
  const [newMir, setNewMir] = useState({
    mir_number: '',
    rk_number: '',
    category: 'Erection',
    forecast_date: '',
    priority: 'Medium',
    note: ''
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMirs();
  }, []);

  const loadMirs = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('mirs')
      .select('*')
      .order('created_at', { ascending: false });
    setMirs(data || []);
    setLoading(false);
  };

  const createMir = async () => {
    if (!newMir.mir_number || !newMir.rk_number || !newMir.forecast_date) {
      alert('Compila tutti i campi obbligatori');
      return;
    }

    const { error } = await supabase.from('mirs').insert({
      ...newMir,
      created_by_user_id: user.id
    });

    if (error) {
      alert('Errore: ' + error.message);
      return;
    }

    setShowNewMirModal(false);
    setNewMir({
      mir_number: '',
      rk_number: '',
      category: 'Erection',
      forecast_date: '',
      priority: 'Medium',
      note: ''
    });
    loadMirs();
  };

  const canModify = user.role === 'admin' || user.perm_mir === 'modify';

  const getCategoryColor = (cat) => {
    switch(cat) {
      case 'Erection': return COLORS.purple;
      case 'Bulk': return COLORS.info;
      case 'Instrument': return COLORS.cyan;
      case 'Support': return COLORS.warning;
      default: return COLORS.gray;
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 'bold' }}>MIR - Material Issue Report</h2>
        {canModify && (
          <button
            onClick={() => setShowNewMirModal(true)}
            style={{ ...styles.button, ...styles.buttonPrimary }}
          >
            + Nuovo MIR
          </button>
        )}
      </div>

      <div style={styles.card}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>MIR Number</th>
              <th style={styles.th}>RK Number</th>
              <th style={styles.th}>Categoria</th>
              <th style={styles.th}>Data Inserimento</th>
              <th style={styles.th}>Data Prevista</th>
              <th style={styles.th}>Priorità</th>
              <th style={styles.th}>Status</th>
            </tr>
          </thead>
          <tbody>
            {mirs.map(mir => (
              <tr key={mir.id}>
                <td style={{ ...styles.td, fontFamily: 'monospace', fontWeight: '600' }}>{mir.mir_number}</td>
                <td style={styles.td}>{mir.rk_number}</td>
                <td style={styles.td}>
                  <span style={{ ...styles.badge, backgroundColor: getCategoryColor(mir.category) }}>
                    {mir.category}
                  </span>
                </td>
                <td style={styles.td}>{new Date(mir.insert_date).toLocaleDateString('it-IT')}</td>
                <td style={styles.td}>{new Date(mir.forecast_date).toLocaleDateString('it-IT')}</td>
                <td style={styles.td}>
                  <span style={{
                    ...styles.badge,
                    backgroundColor: mir.priority === 'High' ? COLORS.primary :
                                    mir.priority === 'Medium' ? COLORS.warning : COLORS.gray
                  }}>
                    {mir.priority}
                  </span>
                </td>
                <td style={styles.td}>
                  <span style={{
                    ...styles.badge,
                    backgroundColor: mir.status === 'Done' ? COLORS.success :
                                    mir.status === 'Partial' ? COLORS.warning : COLORS.info
                  }}>
                    {mir.status}
                  </span>
                </td>
              </tr>
            ))}
            {mirs.length === 0 && (
              <tr>
                <td colSpan="7" style={{ ...styles.td, textAlign: 'center', color: '#9ca3af' }}>
                  Nessun MIR registrato
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* New MIR Modal */}
      <Modal
        isOpen={showNewMirModal}
        onClose={() => setShowNewMirModal(false)}
        title="📦 Nuovo MIR"
      >
        <div style={styles.formGroup}>
          <label style={styles.label}>MIR Number *</label>
          <input
            type="text"
            value={newMir.mir_number}
            onChange={(e) => setNewMir({ ...newMir, mir_number: e.target.value })}
            style={styles.input}
            placeholder="Es: MIR-2024-001"
          />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>RK Number *</label>
          <input
            type="text"
            value={newMir.rk_number}
            onChange={(e) => setNewMir({ ...newMir, rk_number: e.target.value })}
            style={styles.input}
            placeholder="Es: RK-12345"
          />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Categoria *</label>
          <select
            value={newMir.category}
            onChange={(e) => setNewMir({ ...newMir, category: e.target.value })}
            style={styles.select}
          >
            {MIR_CATEGORIES.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
            ⚠️ Importante: indica il tipo di materiale per chi deve ritirare
          </p>
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Data Prevista Consegna *</label>
          <input
            type="date"
            value={newMir.forecast_date}
            onChange={(e) => setNewMir({ ...newMir, forecast_date: e.target.value })}
            style={styles.input}
          />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Priorità</label>
          <select
            value={newMir.priority}
            onChange={(e) => setNewMir({ ...newMir, priority: e.target.value })}
            style={styles.select}
          >
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Note</label>
          <textarea
            value={newMir.note}
            onChange={(e) => setNewMir({ ...newMir, note: e.target.value })}
            style={{ ...styles.input, minHeight: '80px' }}
            placeholder="Note aggiuntive..."
          />
        </div>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          <button
            onClick={() => setShowNewMirModal(false)}
            style={{ ...styles.button, ...styles.buttonSecondary }}
          >
            Annulla
          </button>
          <button
            onClick={createMir}
            style={{ ...styles.button, ...styles.buttonPrimary }}
          >
            ✓ Crea MIR
          </button>
        </div>
      </Modal>
    </div>
  );
}

// ============================================================
// PAGINA DATABASE
// ============================================================
function DatabasePage({ user }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editItem, setEditItem] = useState(null);

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('project_database')
      .select('*')
      .order('iso_number', { ascending: true });
    setItems(data || []);
    setLoading(false);
  };

  const filteredItems = items.filter(item =>
    item.ident_code.toLowerCase().includes(search.toLowerCase()) ||
    item.iso_number.toLowerCase().includes(search.toLowerCase()) ||
    (item.description && item.description.toLowerCase().includes(search.toLowerCase()))
  );

  const canModify = user.role === 'admin' || user.perm_database === 'modify';

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 'bold' }}>Database Inventario</h2>
        <div style={{ display: 'flex', gap: '12px' }}>
          <input
            type="text"
            placeholder="Cerca..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ ...styles.input, width: '250px' }}
          />
          {canModify && (
            <button
              onClick={() => setShowAddModal(true)}
              style={{ ...styles.button, ...styles.buttonPrimary }}
            >
              + Aggiungi Riga
            </button>
          )}
        </div>
      </div>

      <div style={styles.card}>
        <div style={{ overflowX: 'auto' }}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>ISO Number</th>
                <th style={styles.th}>Spool</th>
                <th style={styles.th}>Ident Code</th>
                <th style={styles.th}>Tag</th>
                <th style={styles.th}>Descrizione</th>
                <th style={{ ...styles.th, textAlign: 'center' }}>PRJ</th>
                <th style={{ ...styles.th, textAlign: 'center' }}>WTD</th>
                <th style={{ ...styles.th, textAlign: 'center', backgroundColor: COLORS.secondary, color: 'white' }}>YARD</th>
                <th style={{ ...styles.th, textAlign: 'center', backgroundColor: COLORS.info, color: 'white' }}>SITE</th>
                <th style={{ ...styles.th, textAlign: 'center' }}>TOT</th>
                {canModify && <th style={styles.th}>Azioni</th>}
              </tr>
            </thead>
            <tbody>
              {filteredItems.map(item => (
                <tr key={item.id}>
                  <td style={{ ...styles.td, fontFamily: 'monospace', fontSize: '12px' }}>{item.iso_number}</td>
                  <td style={{ ...styles.td, fontFamily: 'monospace', fontSize: '11px' }}>
                    {item.full_spool_number ? item.full_spool_number.split('-').pop() : '-'}
                  </td>
                  <td style={{ ...styles.td, fontFamily: 'monospace', fontWeight: '600' }}>{item.ident_code}</td>
                  <td style={styles.td}>{item.tag || '-'}</td>
                  <td style={{ ...styles.td, maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {item.description}
                  </td>
                  <td style={{ ...styles.td, textAlign: 'center' }}>{item.prj_qty}</td>
                  <td style={{ ...styles.td, textAlign: 'center' }}>{item.withdrawn_qty}</td>
                  <td style={{ ...styles.td, textAlign: 'center', fontWeight: '600' }}>{item.qty_yard}</td>
                  <td style={{ ...styles.td, textAlign: 'center', fontWeight: '600' }}>{item.qty_site}</td>
                  <td style={{ ...styles.td, textAlign: 'center', fontWeight: '600', color: COLORS.primary }}>
                    {item.qty_yard + item.qty_site}
                  </td>
                  {canModify && (
                    <td style={styles.td}>
                      <button
                        onClick={() => setEditItem(item)}
                        style={{ ...styles.actionBtn, backgroundColor: COLORS.info }}
                      >
                        ✏️
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div style={{ marginTop: '16px', color: '#6b7280', fontSize: '12px' }}>
        <strong>Legenda:</strong> PRJ = Project Qty, WTD = Withdrawn Qty, TOT = Total Available (YARD + SITE)
      </div>
    </div>
  );
}

// ============================================================
// PAGINA LOG
// ============================================================
function LogPage({ user }) {
  const [movements, setMovements] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newMovement, setNewMovement] = useState({
    type: 'BAL',
    location: 'YARD',
    ident_code: '',
    tag: '',
    quantity: '',
    note: '',
    balance_type: 'Adjustment'
  });
  const [identOptions, setIdentOptions] = useState([]);

  useEffect(() => {
    loadMovements();
    loadIdentOptions();
  }, []);

  const loadMovements = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('movements')
      .select('*')
      .order('movement_date', { ascending: false })
      .limit(100);
    setMovements(data || []);
    setLoading(false);
  };

  const loadIdentOptions = async () => {
    const { data } = await supabase
      .from('project_database')
      .select('ident_code, tag')
      .order('ident_code');
    if (data) {
      setIdentOptions(data);
    }
  };

  const createMovement = async () => {
    if (!newMovement.ident_code || !newMovement.quantity || !newMovement.note) {
      alert('Compila tutti i campi obbligatori (Codice, Quantità, Note)');
      return;
    }

    const quantity = parseInt(newMovement.quantity);
    const isNegative = ['Lost', 'Broken', 'Adjustment'].includes(newMovement.balance_type) && newMovement.type === 'BAL';

    // Create movement
    const { error } = await supabase.from('movements').insert({
      type: newMovement.type,
      location: newMovement.location,
      ident_code: newMovement.ident_code,
      tag: newMovement.tag || null,
      quantity: isNegative ? -Math.abs(quantity) : quantity,
      note: newMovement.note,
      balance_type: newMovement.type === 'BAL' ? newMovement.balance_type : null,
      created_by_user_id: user.id
    });

    if (error) {
      alert('Errore: ' + error.message);
      return;
    }

    // Update inventory
    const { data: inv } = await supabase
      .from('project_database')
      .select('qty_yard, qty_site')
      .eq('ident_code', newMovement.ident_code)
      .maybeSingle();

    if (inv) {
      const updates = {};
      if (newMovement.location === 'YARD') {
        updates.qty_yard = Math.max(0, inv.qty_yard + (isNegative ? -Math.abs(quantity) : quantity));
      } else {
        updates.qty_site = Math.max(0, inv.qty_site + (isNegative ? -Math.abs(quantity) : quantity));
      }
      await supabase.from('project_database').update(updates).eq('ident_code', newMovement.ident_code);
    }

    setShowAddModal(false);
    setNewMovement({
      type: 'BAL',
      location: 'YARD',
      ident_code: '',
      tag: '',
      quantity: '',
      note: '',
      balance_type: 'Adjustment'
    });
    loadMovements();
  };

  const canModify = user.role === 'admin' || user.perm_log === 'modify';

  const filteredMovements = movements.filter(m => 
    filter === 'all' || m.type === filter
  );

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 'bold' }}>LOG Movimenti</h2>
        <div style={{ display: 'flex', gap: '12px' }}>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            style={{ ...styles.select, width: '150px' }}
          >
            <option value="all">Tutti</option>
            <option value="IN">IN</option>
            <option value="OUT">OUT</option>
            <option value="BAL">BAL</option>
            <option value="TRF">TRF</option>
            <option value="DEL">DEL</option>
          </select>
          {canModify && (
            <button
              onClick={() => setShowAddModal(true)}
              style={{ ...styles.button, ...styles.buttonPrimary }}
            >
              + Registra Movimento
            </button>
          )}
        </div>
      </div>

      <div style={styles.card}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Data/Ora</th>
              <th style={styles.th}>Tipo</th>
              <th style={styles.th}>Codice</th>
              <th style={styles.th}>Tag</th>
              <th style={styles.th}>Qty</th>
              <th style={styles.th}>Location</th>
              <th style={styles.th}>Note</th>
            </tr>
          </thead>
          <tbody>
            {filteredMovements.map(mov => (
              <tr key={mov.id}>
                <td style={styles.td}>
                  {new Date(mov.movement_date).toLocaleDateString('it-IT')} {new Date(mov.movement_date).toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })}
                </td>
                <td style={styles.td}>
                  <span style={{
                    ...styles.badge,
                    backgroundColor: mov.type === 'IN' ? COLORS.success :
                                    mov.type === 'OUT' || mov.type === 'DEL' ? COLORS.primary :
                                    mov.type === 'BAL' ? COLORS.warning :
                                    mov.type === 'TRF' ? COLORS.info : COLORS.gray
                  }}>
                    {mov.type}
                  </span>
                </td>
                <td style={{ ...styles.td, fontFamily: 'monospace' }}>{mov.ident_code}</td>
                <td style={styles.td}>{mov.tag || '-'}</td>
                <td style={{
                  ...styles.td,
                  fontWeight: '600',
                  color: mov.quantity > 0 ? COLORS.success : COLORS.primary
                }}>
                  {mov.quantity > 0 ? '+' : ''}{mov.quantity}
                </td>
                <td style={styles.td}>{mov.location}</td>
                <td style={{ ...styles.td, fontSize: '12px', color: '#6b7280', maxWidth: '250px' }}>
                  {mov.note}
                  {mov.auto_generated && (
                    <span style={{ marginLeft: '8px', fontSize: '10px', color: COLORS.purple }}>[AUTO]</span>
                  )}
                </td>
              </tr>
            ))}
            {filteredMovements.length === 0 && (
              <tr>
                <td colSpan="7" style={{ ...styles.td, textAlign: 'center', color: '#9ca3af' }}>
                  Nessun movimento registrato
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add Movement Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="📦 Registra Movimento"
      >
        <div style={styles.formGroup}>
          <label style={styles.label}>Tipo</label>
          <select
            value={newMovement.type}
            onChange={(e) => setNewMovement({ ...newMovement, type: e.target.value })}
            style={styles.select}
          >
            <option value="IN">IN (Entrata)</option>
            <option value="BAL">BAL (Bilanciamento)</option>
          </select>
        </div>
        {newMovement.type === 'BAL' && (
          <div style={styles.formGroup}>
            <label style={styles.label}>Tipo Bilanciamento</label>
            <select
              value={newMovement.balance_type}
              onChange={(e) => setNewMovement({ ...newMovement, balance_type: e.target.value })}
              style={styles.select}
            >
              <option value="Adjustment">Adjustment (+/-)</option>
              <option value="Lost">Lost (-)</option>
              <option value="Broken">Broken (-)</option>
            </select>
          </div>
        )}
        <div style={styles.formGroup}>
          <label style={styles.label}>Location</label>
          <select
            value={newMovement.location}
            onChange={(e) => setNewMovement({ ...newMovement, location: e.target.value })}
            style={styles.select}
          >
            <option value="YARD">YARD</option>
            <option value="SITE">SITE</option>
          </select>
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Codice Materiale *</label>
          <select
            value={newMovement.ident_code}
            onChange={(e) => setNewMovement({ ...newMovement, ident_code: e.target.value })}
            style={styles.select}
          >
            <option value="">Seleziona...</option>
            {[...new Set(identOptions.map(o => o.ident_code))].map(code => (
              <option key={code} value={code}>{code}</option>
            ))}
          </select>
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Tag</label>
          <select
            value={newMovement.tag}
            onChange={(e) => setNewMovement({ ...newMovement, tag: e.target.value })}
            style={styles.select}
          >
            <option value="">Nessuno</option>
            {identOptions
              .filter(o => o.ident_code === newMovement.ident_code && o.tag)
              .map(o => (
                <option key={o.tag} value={o.tag}>{o.tag}</option>
              ))}
          </select>
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Quantità * {newMovement.type === 'BAL' && newMovement.balance_type !== 'Adjustment' && '(verrà sottratta)'}</label>
          <input
            type="number"
            value={newMovement.quantity}
            onChange={(e) => setNewMovement({ ...newMovement, quantity: e.target.value })}
            style={styles.input}
            min="1"
          />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Note * (OBBLIGATORIE)</label>
          <textarea
            value={newMovement.note}
            onChange={(e) => setNewMovement({ ...newMovement, note: e.target.value })}
            style={{ ...styles.input, minHeight: '80px' }}
            placeholder="Spiega il motivo del movimento..."
          />
        </div>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          <button
            onClick={() => setShowAddModal(false)}
            style={{ ...styles.button, ...styles.buttonSecondary }}
          >
            Annulla
          </button>
          <button
            onClick={createMovement}
            style={{ ...styles.button, ...styles.buttonPrimary }}
          >
            ✓ Registra
          </button>
        </div>
      </Modal>
    </div>
  );
}

// ============================================================
// APP PRINCIPALE
// ============================================================
export default function App() {
  const [user, setUser] = useState(null);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for saved session
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    setCurrentPage('dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.secondary
      }}>
        <div style={{ color: 'white', fontSize: '18px' }}>Caricamento...</div>
      </div>
    );
  }

  if (!user) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  const renderPage = () => {
    switch(currentPage) {
      case 'dashboard':
        return <DashboardPage user={user} />;
      case 'requests':
        return <RequestsPage user={user} />;
      case 'whSite':
        return <WHSitePage user={user} />;
      case 'mir':
        return <MIRPage user={user} />;
      case 'database':
        return <DatabasePage user={user} />;
      case 'log':
        return <LogPage user={user} />;
      case 'whYard':
        return <PlaceholderPage title="WH Yard" />;
      case 'engineering':
        return <PlaceholderPage title="Engineering" />;
      case 'spareParts':
        return <PlaceholderPage title="Spare Parts" />;
      case 'orders':
        return <PlaceholderPage title="Orders" />;
      case 'management':
        return <PlaceholderPage title="Management" />;
      case 'testPack':
        return <PlaceholderPage title="Test Pack Materials" />;
      case 'materialIn':
        return <PlaceholderPage title="Material IN" />;
      case 'siteIn':
        return <PlaceholderPage title="Site IN" />;
      default:
        return <DashboardPage user={user} />;
    }
  };

  const pageTitles = {
    dashboard: 'Dashboard',
    requests: 'Nuova Richiesta',
    mir: 'MIR',
    materialIn: 'Material IN',
    siteIn: 'Site IN',
    whSite: 'WH Site',
    whYard: 'WH Yard',
    engineering: 'Engineering',
    spareParts: 'Spare Parts',
    orders: 'Orders',
    management: 'Management',
    testPack: 'Test Pack Materials',
    log: 'LOG',
    database: 'Database'
  };

  return (
    <div style={styles.container}>
      <Sidebar
        user={user}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
        onLogout={handleLogout}
      />
      <div style={styles.main}>
        <header style={styles.header}>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1f2937' }}>
            {pageTitles[currentPage] || currentPage}
          </h2>
          <button
            onClick={() => window.location.reload()}
            style={{ ...styles.button, ...styles.buttonSecondary }}
          >
            🔄 Refresh
          </button>
        </header>
        <main style={styles.content}>
          {renderPage()}
        </main>
      </div>
    </div>
  );
}
