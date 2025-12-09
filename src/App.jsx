// ============================================================
// MATERIALS MANAGER - APP.JSX COMPLETE
// MAX STREICHER Edition - Full English Version
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
  Check: COLORS.purple,
  Done: COLORS.gray
};

const MIR_CATEGORIES = ['Erection', 'Bulk', 'Instrument', 'Support'];
const REQUEST_TYPES = ['Piping', 'Mechanical', 'TestPack'];
const SUB_CATEGORIES = ['Bulk', 'Erection', 'Support'];

// ============================================================
// GLOBAL STYLES
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
    padding: '2px 8px',
    borderRadius: '4px',
    color: 'white',
    fontSize: '11px',
    fontWeight: '500'
  },
  navBadge: {
    position: 'absolute',
    right: '12px',
    backgroundColor: COLORS.primary,
    color: 'white',
    fontSize: '11px',
    fontWeight: 'bold',
    padding: '2px 6px',
    borderRadius: '10px',
    minWidth: '18px',
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
    color: 'white',
    minHeight: '120px'
  },
  gridEqual: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '16px',
    marginBottom: '24px'
  },
  gridThree: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '16px',
    marginBottom: '24px'
  }
};

// ============================================================
// MODAL COMPONENT
// ============================================================
function Modal({ isOpen, onClose, title, children, width = '500px' }) {
  if (!isOpen) return null;
  
  return (
    <div style={styles.modal} onClick={onClose}>
      <div 
        style={{ ...styles.modalContent, maxWidth: width }} 
        onClick={e => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1f2937' }}>{title}</h3>
          <button 
            onClick={onClose}
            style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: '#6b7280' }}
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
// ACTION BUTTON COMPONENT
// ============================================================
function ActionButton({ color, onClick, title, children, disabled = false }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      style={{
        ...styles.actionBtn,
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
// LOGIN SCREEN
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

      localStorage.setItem('user', JSON.stringify(data));
      onLogin(data);
    } catch (err) {
      setError('Connection error');
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
        padding: '40px',
        borderRadius: '16px',
        width: '100%',
        maxWidth: '400px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <div style={{
            width: '80px',
            height: '80px',
            backgroundColor: COLORS.primary,
            borderRadius: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px',
            fontSize: '24px',
            fontWeight: 'bold',
            color: 'white'
          }}>
            STR
          </div>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937', marginBottom: '5px' }}>
            MAX STREICHER
          </h1>
          <p style={{ color: '#6b7280' }}>Materials Manager</p>
        </div>

        <form onSubmit={handleLogin}>
          <div style={styles.formGroup}>
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
          <div style={styles.formGroup}>
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
          
          {error && (
            <div style={{
              backgroundColor: '#FEE2E2',
              color: '#DC2626',
              padding: '12px',
              borderRadius: '8px',
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
            {loading ? 'Loading...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
}

// ============================================================
// SIDEBAR WITH BADGES
// ============================================================
function Sidebar({ user, currentPage, setCurrentPage, collapsed, setCollapsed, onLogout, counts = {} }) {
  const menuItems = [
    { id: 'dashboard', icon: '📊', label: 'Dashboard', perm: 'perm_dashboard' },
    { id: 'requests', icon: '📋', label: 'New Request', perm: 'perm_requests' },
    { id: 'mir', icon: '📦', label: 'MIR', perm: 'perm_mir' },
    { id: 'materialIn', icon: '📥', label: 'Material IN', perm: 'perm_material_in' },
    { id: 'siteIn', icon: '🚚', label: 'Site IN', perm: 'perm_site_in', countKey: 'siteIn' },
    { id: 'whSite', icon: '🏗️', label: 'WH Site', perm: 'perm_wh_site', countKey: 'whSite' },
    { id: 'whYard', icon: '🏢', label: 'WH Yard', perm: 'perm_wh_yard', countKey: 'whYard' },
    { id: 'engineering', icon: '⚙️', label: 'Engineering', perm: 'perm_engineering', countKey: 'engineering' },
    { id: 'spareParts', icon: '🔧', label: 'Spare Parts', perm: 'perm_spare_parts', countKey: 'spare' },
    { id: 'orders', icon: '🛒', label: 'Orders', perm: 'perm_orders', countKey: 'orders' },
    { id: 'management', icon: '👔', label: 'Management', perm: 'perm_management', countKey: 'management' },
    { id: 'log', icon: '📝', label: 'LOG', perm: 'perm_log' },
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
            fontSize: '18px'
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
          >
            <span style={{ fontSize: '20px' }}>{item.icon}</span>
            {!collapsed && (
              <>
                <span style={{ fontSize: '14px' }}>{item.label}</span>
                {item.countKey && counts[item.countKey] > 0 && (
                  <span style={styles.navBadge}>{counts[item.countKey]}</span>
                )}
              </>
            )}
            {collapsed && item.countKey && counts[item.countKey] > 0 && (
              <span style={{
                ...styles.navBadge,
                position: 'absolute',
                top: '5px',
                right: '5px',
                fontSize: '9px',
                padding: '1px 4px'
              }}>
                {counts[item.countKey]}
              </span>
            )}
          </div>
        ))}
      </nav>

      {/* User & Logout */}
      <div style={{ padding: '16px', borderTop: '1px solid #374151' }}>
        {!collapsed && (
          <div style={{ color: '#9ca3af', fontSize: '12px', marginBottom: '8px' }}>
            👤 {user.full_name}
          </div>
        )}
        <div
          onClick={onLogout}
          style={{
            ...styles.navItem,
            padding: '8px 12px',
            borderLeft: 'none'
          }}
        >
          <span>🚪</span>
          {!collapsed && <span style={{ fontSize: '14px' }}>Logout</span>}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// DASHBOARD PAGE
// ============================================================
function DashboardPage({ user }) {
  const [stats, setStats] = useState({
    yardQty: 0, siteQty: 0, lostQty: 0, brokenQty: 0,
    activeRequests: 0, pendingEng: 0, toOrder: 0,
    closed1day: 0, closed7days: 0, closed3weeks: 0, closedOver3weeks: 0,
    passedEng: 0, passedMng: 0, becameOrders: 0
  });
  const [recentMovements, setRecentMovements] = useState([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // Load inventory stats
      const { data: inventory } = await supabase.from('project_database').select('qty_yard, qty_site');
      if (inventory) {
        const yardQty = inventory.reduce((sum, i) => sum + (i.qty_yard || 0), 0);
        const siteQty = inventory.reduce((sum, i) => sum + (i.qty_site || 0), 0);
        setStats(prev => ({ ...prev, yardQty, siteQty }));
      }

      // Load request stats
      const { data: components } = await supabase.from('request_components').select('status');
      if (components) {
        const activeRequests = components.filter(c => c.status !== 'Done').length;
        const pendingEng = components.filter(c => c.status === 'Eng').length;
        const toOrder = components.filter(c => c.status === 'Order').length;
        setStats(prev => ({ ...prev, activeRequests, pendingEng, toOrder }));
      }

      // Load recent movements
      const { data: movements } = await supabase
        .from('movements')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);
      if (movements) setRecentMovements(movements);

    } catch (error) {
      console.error('Error loading dashboard:', error);
    }
  };

  return (
    <div>
      {/* Inventory Stats - Equal boxes */}
      <div style={styles.gridEqual}>
        <div style={{ ...styles.statsBox, backgroundColor: COLORS.secondary }}>
          <h3 style={{ fontSize: '14px', opacity: 0.9, marginBottom: '8px' }}>🏢 YARD</h3>
          <p style={{ fontSize: '36px', fontWeight: 'bold' }}>{stats.yardQty.toLocaleString()}</p>
          <p style={{ fontSize: '12px', opacity: 0.7 }}>Total items</p>
        </div>
        <div style={{ ...styles.statsBox, backgroundColor: COLORS.info }}>
          <h3 style={{ fontSize: '14px', opacity: 0.9, marginBottom: '8px' }}>🏗️ SITE</h3>
          <p style={{ fontSize: '36px', fontWeight: 'bold' }}>{stats.siteQty.toLocaleString()}</p>
          <p style={{ fontSize: '12px', opacity: 0.7 }}>Total items</p>
        </div>
        <div style={{ ...styles.statsBox, backgroundColor: COLORS.orange }}>
          <h3 style={{ fontSize: '14px', opacity: 0.9, marginBottom: '8px' }}>⚠️ LOST</h3>
          <p style={{ fontSize: '36px', fontWeight: 'bold' }}>{stats.lostQty}</p>
          <p style={{ fontSize: '12px', opacity: 0.7 }}>Total items</p>
        </div>
        <div style={{ ...styles.statsBox, backgroundColor: COLORS.purple }}>
          <h3 style={{ fontSize: '14px', opacity: 0.9, marginBottom: '8px' }}>🔧 BROKEN</h3>
          <p style={{ fontSize: '36px', fontWeight: 'bold' }}>{stats.brokenQty}</p>
          <p style={{ fontSize: '12px', opacity: 0.7 }}>Total items</p>
        </div>
      </div>

      {/* Request Stats - Equal boxes */}
      <div style={styles.gridThree}>
        <div style={styles.card}>
          <div style={{ padding: '20px', textAlign: 'center' }}>
            <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '8px' }}>📋 Active Requests</p>
            <p style={{ fontSize: '32px', fontWeight: 'bold', color: COLORS.primary }}>{stats.activeRequests}</p>
          </div>
        </div>
        <div style={styles.card}>
          <div style={{ padding: '20px', textAlign: 'center' }}>
            <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '8px' }}>⚙️ Pending Engineering</p>
            <p style={{ fontSize: '32px', fontWeight: 'bold', color: COLORS.purple }}>{stats.pendingEng}</p>
          </div>
        </div>
        <div style={styles.card}>
          <div style={{ padding: '20px', textAlign: 'center' }}>
            <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '8px' }}>🛒 To Order</p>
            <p style={{ fontSize: '32px', fontWeight: 'bold', color: COLORS.warning }}>{stats.toOrder}</p>
          </div>
        </div>
      </div>

      {/* Closure Time Stats - Equal boxes */}
      <div style={styles.gridEqual}>
        <div style={{ ...styles.statsBox, backgroundColor: COLORS.success }}>
          <h3 style={{ fontSize: '12px', opacity: 0.9, marginBottom: '8px' }}>⚡ Closed in 1 day</h3>
          <p style={{ fontSize: '32px', fontWeight: 'bold' }}>{stats.closed1day}</p>
        </div>
        <div style={{ ...styles.statsBox, backgroundColor: COLORS.info }}>
          <h3 style={{ fontSize: '12px', opacity: 0.9, marginBottom: '8px' }}>📅 Closed 2-7 days</h3>
          <p style={{ fontSize: '32px', fontWeight: 'bold' }}>{stats.closed7days}</p>
        </div>
        <div style={{ ...styles.statsBox, backgroundColor: COLORS.warning }}>
          <h3 style={{ fontSize: '12px', opacity: 0.9, marginBottom: '8px' }}>📆 Closed &lt;3 weeks</h3>
          <p style={{ fontSize: '32px', fontWeight: 'bold' }}>{stats.closed3weeks}</p>
        </div>
        <div style={{ ...styles.statsBox, backgroundColor: COLORS.primary }}>
          <h3 style={{ fontSize: '12px', opacity: 0.9, marginBottom: '8px' }}>🕐 Closed &gt;3 weeks</h3>
          <p style={{ fontSize: '32px', fontWeight: 'bold' }}>{stats.closedOver3weeks}</p>
        </div>
      </div>

      {/* Flow Stats - Equal boxes */}
      <div style={styles.gridThree}>
        <div style={styles.card}>
          <div style={{ padding: '20px', textAlign: 'center' }}>
            <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '8px' }}>🔧 Passed through Engineering</p>
            <p style={{ fontSize: '32px', fontWeight: 'bold', color: COLORS.purple }}>{stats.passedEng}</p>
          </div>
        </div>
        <div style={styles.card}>
          <div style={{ padding: '20px', textAlign: 'center' }}>
            <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '8px' }}>👔 Passed through Management</p>
            <p style={{ fontSize: '32px', fontWeight: 'bold', color: COLORS.yellow }}>{stats.passedMng}</p>
          </div>
        </div>
        <div style={styles.card}>
          <div style={{ padding: '20px', textAlign: 'center' }}>
            <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '8px' }}>🛒 Became Orders</p>
            <p style={{ fontSize: '32px', fontWeight: 'bold', color: COLORS.primary }}>{stats.becameOrders}</p>
          </div>
        </div>
      </div>

      {/* Recent Movements */}
      <div style={styles.card}>
        <div style={styles.cardHeader}>
          <h3 style={{ fontSize: '16px', fontWeight: 'bold' }}>📋 Recent Movements</h3>
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
            {recentMovements.map((mov, idx) => (
              <tr key={idx}>
                <td style={styles.td}>{new Date(mov.created_at).toLocaleDateString()}</td>
                <td style={styles.td}>
                  <span style={{
                    ...styles.badge,
                    backgroundColor: mov.type === 'IN' ? COLORS.success :
                                    mov.type === 'OUT' ? COLORS.primary :
                                    mov.type === 'TRF' ? COLORS.info : COLORS.warning
                  }}>
                    {mov.type}
                  </span>
                </td>
                <td style={{ ...styles.td, fontFamily: 'monospace' }}>{mov.ident_code}</td>
                <td style={styles.td}>{mov.quantity}</td>
                <td style={styles.td}>{mov.from_location} → {mov.to_location}</td>
              </tr>
            ))}
            {recentMovements.length === 0 && (
              <tr>
                <td colSpan="5" style={{ ...styles.td, textAlign: 'center', color: '#9ca3af' }}>
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
// REQUESTS PAGE - NEW REQUEST
// ============================================================
function RequestsPage({ user }) {
  const [requestType, setRequestType] = useState('Piping');
  const [subCategory, setSubCategory] = useState('Bulk');
  const [isoNumber, setIsoNumber] = useState('');
  const [spoolNumber, setSpoolNumber] = useState('');
  const [materials, setMaterials] = useState([]);
  const [identCodes, setIdentCodes] = useState([]);
  const [tags, setTags] = useState([]);
  const [selectedCode, setSelectedCode] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [qty, setQty] = useState('');
  const [nextNumber, setNextNumber] = useState('00001');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadIdentCodes();
    loadTags();
    loadNextNumber();
  }, []);

  const loadIdentCodes = async () => {
    const { data } = await supabase.from('project_database').select('ident_code, description').order('ident_code');
    if (data) setIdentCodes(data);
  };

  const loadTags = async () => {
    const { data } = await supabase.from('tags').select('*').order('tag_code');
    if (data) setTags(data);
  };

  const loadNextNumber = async () => {
    const { data } = await supabase
      .from('requests')
      .select('request_number')
      .order('request_number', { ascending: false })
      .limit(1);
    
    if (data && data.length > 0) {
      const lastNum = parseInt(data[0].request_number.split('-')[0]) || 0;
      setNextNumber(String(lastNum + 1).padStart(5, '0'));
    }
  };

  const addMaterial = () => {
    if (!selectedCode || !qty) {
      setError('Please select a code and enter quantity');
      return;
    }
    const codeInfo = identCodes.find(c => c.ident_code === selectedCode);
    setMaterials([...materials, {
      ident_code: selectedCode,
      description: codeInfo?.description || '',
      tag: selectedTag || null,
      quantity: parseInt(qty)
    }]);
    setSelectedCode('');
    setSelectedTag('');
    setQty('');
    setError('');
  };

  const removeMaterial = (index) => {
    setMaterials(materials.filter((_, i) => i !== index));
  };

  const submitRequest = async (destination) => {
    if (materials.length === 0) {
      setError('Add at least one material');
      return;
    }
    if (!isoNumber) {
      setError('ISO Number is required');
      return;
    }

    setError('');
    try {
      // Create request
      const { data: request, error: reqError } = await supabase
        .from('requests')
        .insert({
          request_number: `${nextNumber}-0`,
          request_type: requestType,
          sub_category: subCategory,
          iso_number: isoNumber,
          spool_number: spoolNumber,
          created_by: user.id,
          status: 'Open'
        })
        .select()
        .single();

      if (reqError) throw reqError;

      // Create components
      const componentsToInsert = materials.map(m => ({
        request_id: request.id,
        ident_code: m.ident_code,
        tag_id: m.tag || null,
        requested_qty: m.quantity,
        status: destination === 'Site' ? 'Site' : destination === 'Yard' ? 'Yard' : 'Eng'
      }));

      const { error: compError } = await supabase
        .from('request_components')
        .insert(componentsToInsert);

      if (compError) throw compError;

      setSuccess(`Request ${nextNumber}-0 created successfully!`);
      setMaterials([]);
      setIsoNumber('');
      setSpoolNumber('');
      loadNextNumber();
      
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Error creating request: ' + err.message);
    }
  };

  return (
    <div>
      {/* Preview */}
      <div style={{ textAlign: 'right', marginBottom: '16px', color: '#6b7280' }}>
        Preview: <strong>{nextNumber}-0</strong> (not saved)
      </div>

      {/* Alerts */}
      {error && (
        <div style={{
          backgroundColor: '#FEE2E2',
          color: '#DC2626',
          padding: '12px 16px',
          borderRadius: '8px',
          marginBottom: '16px'
        }}>
          {error}
        </div>
      )}
      {success && (
        <div style={{
          backgroundColor: '#D1FAE5',
          color: '#059669',
          padding: '12px 16px',
          borderRadius: '8px',
          marginBottom: '16px'
        }}>
          {success}
        </div>
      )}

      {/* Request Form */}
      <div style={styles.card}>
        <div style={{ padding: '24px' }}>
          {/* Request Type */}
          <div style={styles.formGroup}>
            <label style={styles.label}>Request Type</label>
            <div style={{ display: 'flex', gap: '16px' }}>
              {REQUEST_TYPES.map(type => (
                <label key={type} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input
                    type="radio"
                    checked={requestType === type}
                    onChange={() => setRequestType(type)}
                  />
                  {type}
                </label>
              ))}
            </div>
          </div>

          {/* Sub-Category */}
          <div style={styles.formGroup}>
            <label style={styles.label}>Sub-Category</label>
            <select
              value={subCategory}
              onChange={(e) => setSubCategory(e.target.value)}
              style={styles.select}
            >
              {SUB_CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* ISO and Spool */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div style={styles.formGroup}>
              <label style={styles.label}>ISO Number *</label>
              <input
                type="text"
                value={isoNumber}
                onChange={(e) => setIsoNumber(e.target.value)}
                placeholder="Ex: I181C02-DF21065-0-01"
                style={styles.input}
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Full Spool Number *</label>
              <input
                type="text"
                value={spoolNumber}
                onChange={(e) => setSpoolNumber(e.target.value)}
                placeholder="Ex: I181C02-DF21065-0-01-SP001"
                style={styles.input}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Add Materials */}
      <div style={{ ...styles.card, backgroundColor: '#f9fafb' }}>
        <div style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '16px' }}>📦 Add Materials</h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr auto', gap: '12px', alignItems: 'end' }}>
            <div>
              <label style={styles.label}>Ident Code</label>
              <select
                value={selectedCode}
                onChange={(e) => setSelectedCode(e.target.value)}
                style={styles.select}
              >
                <option value="">Select code...</option>
                {identCodes.map(c => (
                  <option key={c.ident_code} value={c.ident_code}>
                    {c.ident_code} - {c.description}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label style={styles.label}>Tag</label>
              <select
                value={selectedTag}
                onChange={(e) => setSelectedTag(e.target.value)}
                style={styles.select}
              >
                <option value="">None</option>
                {tags.map(t => (
                  <option key={t.id} value={t.id}>{t.tag_code}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={styles.label}>Qty</label>
              <input
                type="number"
                value={qty}
                onChange={(e) => setQty(e.target.value)}
                min="1"
                style={styles.input}
              />
            </div>
            <button
              onClick={addMaterial}
              style={{ ...styles.button, ...styles.buttonPrimary, height: '42px' }}
            >
              + Add
            </button>
          </div>

          {/* Materials List */}
          {materials.length > 0 && (
            <div style={{ marginTop: '20px' }}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Code</th>
                    <th style={styles.th}>Description</th>
                    <th style={styles.th}>Tag</th>
                    <th style={styles.th}>Qty</th>
                    <th style={styles.th}></th>
                  </tr>
                </thead>
                <tbody>
                  {materials.map((m, idx) => (
                    <tr key={idx}>
                      <td style={{ ...styles.td, fontFamily: 'monospace' }}>{m.ident_code}</td>
                      <td style={styles.td}>{m.description}</td>
                      <td style={styles.td}>{m.tag || '-'}</td>
                      <td style={styles.td}>{m.quantity}</td>
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
            </div>
          )}
        </div>
      </div>

      {/* Submit Buttons */}
      <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
        <button
          onClick={() => submitRequest('Site')}
          style={{ ...styles.button, backgroundColor: COLORS.info, color: 'white' }}
        >
          🏗️ Send to Site
        </button>
        <button
          onClick={() => submitRequest('Yard')}
          style={{ ...styles.button, backgroundColor: COLORS.secondary, color: 'white' }}
        >
          🏢 Send to Yard
        </button>
        <button
          onClick={() => submitRequest('Eng')}
          style={{ ...styles.button, backgroundColor: COLORS.purple, color: 'white' }}
        >
          ⚙️ Send to Engineering
        </button>
      </div>
    </div>
  );
}

// ============================================================
// WH SITE PAGE
// ============================================================
function WHSitePage({ user, onRefreshCounts }) {
  const [components, setComponents] = useState([]);
  const [readyOut, setReadyOut] = useState([]);
  const [checkNotifications, setCheckNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [showPTModal, setShowPTModal] = useState(false);
  const [selectedComponent, setSelectedComponent] = useState(null);
  const [note, setNote] = useState('');
  const [ptQty, setPtQty] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      // Load Site components
      const { data: siteComps } = await supabase
        .from('request_components')
        .select(`
          *,
          request:requests(*),
          inventory:project_database(description)
        `)
        .eq('status', 'Site')
        .order('created_at', { ascending: false });
      
      if (siteComps) setComponents(siteComps);

      // Load Ready for delivery
      const { data: readyComps } = await supabase
        .from('request_components')
        .select(`
          *,
          request:requests(*),
          inventory:project_database(description)
        `)
        .eq('status', 'ToCollect')
        .order('created_at', { ascending: false });
      
      if (readyComps) setReadyOut(readyComps);

      // Load Check notifications from Engineering
      const { data: checks } = await supabase
        .from('request_components')
        .select(`
          *,
          request:requests(*),
          inventory:project_database(description)
        `)
        .eq('status', 'Check')
        .eq('check_target', 'Site')
        .order('created_at', { ascending: false });
      
      if (checks) setCheckNotifications(checks);

    } catch (error) {
      console.error('Error loading WH Site data:', error);
    }
    setLoading(false);
  };

  const handleAction = async (component, action) => {
    try {
      switch (action) {
        case 'ready':
          await supabase
            .from('request_components')
            .update({ status: 'ToCollect', updated_at: new Date().toISOString() })
            .eq('id', component.id);
          break;
        
        case 'toYard':
          setSelectedComponent(component);
          setShowNoteModal(true);
          return;
        
        case 'toEng':
          await supabase
            .from('request_components')
            .update({ status: 'Eng', updated_at: new Date().toISOString() })
            .eq('id', component.id);
          break;
        
        case 'pt':
          setSelectedComponent(component);
          setPtQty('');
          setShowPTModal(true);
          return;
        
        case 'deliver':
          await supabase
            .from('request_components')
            .update({ status: 'Done', delivered_at: new Date().toISOString() })
            .eq('id', component.id);
          // Update inventory
          await supabase.rpc('decrement_site_qty', {
            p_ident_code: component.ident_code,
            p_qty: component.requested_qty
          });
          break;
        
        case 'delete':
          if (window.confirm('Are you sure you want to delete this component?')) {
            await supabase.from('request_components').delete().eq('id', component.id);
          }
          break;
      }
      loadData();
      if (onRefreshCounts) onRefreshCounts();
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };

  const handleCheckResponse = async (component, response) => {
    try {
      if (response === 'found') {
        await supabase
          .from('request_components')
          .update({ status: 'ToCollect', check_response: 'Found', updated_at: new Date().toISOString() })
          .eq('id', component.id);
      } else if (response === 'partial') {
        setSelectedComponent(component);
        setPtQty('');
        setShowPTModal(true);
        return;
      } else if (response === 'notfound') {
        await supabase
          .from('request_components')
          .update({ status: 'Eng', check_response: 'Not Found', updated_at: new Date().toISOString() })
          .eq('id', component.id);
      }
      loadData();
      if (onRefreshCounts) onRefreshCounts();
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };

  const submitTransferToYard = async () => {
    if (!selectedComponent) return;
    try {
      await supabase
        .from('request_components')
        .update({ 
          status: 'Yard', 
          notes: note,
          updated_at: new Date().toISOString() 
        })
        .eq('id', selectedComponent.id);
      
      setShowNoteModal(false);
      setNote('');
      setSelectedComponent(null);
      loadData();
      if (onRefreshCounts) onRefreshCounts();
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };

  const submitPartialTransfer = async () => {
    if (!selectedComponent || !ptQty) return;
    const partialQty = parseInt(ptQty);
    if (partialQty >= selectedComponent.requested_qty) {
      alert('Partial quantity must be less than requested quantity');
      return;
    }

    try {
      // Update original with reduced qty
      await supabase
        .from('request_components')
        .update({ 
          requested_qty: selectedComponent.requested_qty - partialQty,
          updated_at: new Date().toISOString()
        })
        .eq('id', selectedComponent.id);

      // Create new component for partial qty - ready for delivery
      const { data: request } = await supabase
        .from('requests')
        .select('request_number')
        .eq('id', selectedComponent.request_id)
        .single();

      // Get split number
      const baseNum = request.request_number.split('-')[0];
      const { data: splits } = await supabase
        .from('requests')
        .select('request_number')
        .like('request_number', `${baseNum}-%`);
      
      const nextSplit = splits ? splits.length : 1;

      // Create split request
      const { data: newRequest } = await supabase
        .from('requests')
        .insert({
          request_number: `${baseNum}-${nextSplit}`,
          request_type: selectedComponent.request?.request_type,
          sub_category: selectedComponent.request?.sub_category,
          iso_number: selectedComponent.request?.iso_number,
          spool_number: selectedComponent.request?.spool_number,
          created_by: user.id,
          status: 'Open',
          parent_request_id: selectedComponent.request_id
        })
        .select()
        .single();

      await supabase
        .from('request_components')
        .insert({
          request_id: newRequest.id,
          ident_code: selectedComponent.ident_code,
          requested_qty: partialQty,
          status: 'ToCollect'
        });

      setShowPTModal(false);
      setPtQty('');
      setSelectedComponent(null);
      loadData();
      if (onRefreshCounts) onRefreshCounts();
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>Loading...</div>;
  }

  return (
    <div>
      {/* Check Notifications from Engineering */}
      {checkNotifications.length > 0 && (
        <div style={{
          backgroundColor: '#F5F3FF',
          border: '1px solid #C4B5FD',
          borderRadius: '8px',
          padding: '16px',
          marginBottom: '24px'
        }}>
          <h4 style={{ fontWeight: 'bold', color: COLORS.purple, marginBottom: '12px' }}>
            🔍 Check Requests from Engineering
          </h4>
          {checkNotifications.map(comp => (
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
                <span style={{ fontFamily: 'monospace', fontWeight: 'bold' }}>{comp.ident_code}</span>
                <span style={{ marginLeft: '12px', color: '#6b7280' }}>{comp.check_note}</span>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <ActionButton
                  color={COLORS.success}
                  onClick={() => handleCheckResponse(comp, 'found')}
                  title="Found"
                >
                  ✓
                </ActionButton>
                <ActionButton
                  color={COLORS.warning}
                  onClick={() => handleCheckResponse(comp, 'partial')}
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
          ))}
        </div>
      )}

      {/* Ready OUT Section */}
      {readyOut.length > 0 && (
        <div style={{ ...styles.card, marginBottom: '24px' }}>
          <div style={{ ...styles.cardHeader, backgroundColor: '#D1FAE5' }}>
            <h3 style={{ fontWeight: 'bold', color: COLORS.success }}>✅ Ready OUT - Ready for delivery</h3>
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
                  <td style={{ ...styles.td, fontFamily: 'monospace', fontWeight: 'bold' }}>
                    {comp.request?.request_number}
                  </td>
                  <td style={{ ...styles.td, fontFamily: 'monospace' }}>{comp.ident_code}</td>
                  <td style={styles.td}>{comp.inventory?.description}</td>
                  <td style={styles.td}>{comp.requested_qty}</td>
                  <td style={styles.td}>
                    <div style={{ display: 'flex', gap: '4px' }}>
                      <ActionButton color={COLORS.success} onClick={() => handleAction(comp, 'deliver')} title="Deliver">
                        📤
                      </ActionButton>
                      <ActionButton color={COLORS.primary} onClick={() => {}} title="Create MIR">
                        📋
                      </ActionButton>
                      <ActionButton color={COLORS.gray} onClick={() => {}} title="Cancel">
                        ↩
                      </ActionButton>
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
          <h3 style={{ fontWeight: 'bold' }}>🏗️ Warehouse Site - Components</h3>
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
                <td style={{ ...styles.td, fontFamily: 'monospace', fontWeight: 'bold' }}>
                  {comp.request?.request_number}
                </td>
                <td style={{ ...styles.td, fontFamily: 'monospace' }}>{comp.ident_code}</td>
                <td style={styles.td}>{comp.inventory?.description}</td>
                <td style={styles.td}>{comp.requested_qty}</td>
                <td style={styles.td}>{comp.request?.sub_category}</td>
                <td style={styles.td}>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    <ActionButton color={COLORS.success} onClick={() => handleAction(comp, 'ready')} title="Prepare delivery">
                      ✓
                    </ActionButton>
                    <ActionButton color={COLORS.warning} onClick={() => handleAction(comp, 'pt')} title="Partial Split">
                      PT
                    </ActionButton>
                    <ActionButton color={COLORS.secondary} onClick={() => handleAction(comp, 'toYard')} title="Send to Yard">
                      Y
                    </ActionButton>
                    <ActionButton color={COLORS.purple} onClick={() => handleAction(comp, 'toEng')} title="Send to Engineering">
                      UT
                    </ActionButton>
                    <ActionButton color={COLORS.gray} onClick={() => {}} title="Return">
                      ↩
                    </ActionButton>
                    <ActionButton color={COLORS.primary} onClick={() => handleAction(comp, 'delete')} title="Delete">
                      🗑️
                    </ActionButton>
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

      {/* Note Modal for Yard Transfer */}
      <Modal isOpen={showNoteModal} onClose={() => setShowNoteModal(false)} title="Transfer to Yard">
        <div style={styles.formGroup}>
          <label style={styles.label}>Note (optional)</label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            style={{ ...styles.input, minHeight: '100px' }}
            placeholder="Add a note for Yard warehouse..."
          />
        </div>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          <button
            onClick={() => setShowNoteModal(false)}
            style={{ ...styles.button, ...styles.buttonSecondary }}
          >
            Cancel
          </button>
          <button
            onClick={submitTransferToYard}
            style={{ ...styles.button, ...styles.buttonPrimary }}
          >
            Send to Yard
          </button>
        </div>
      </Modal>

      {/* PT Modal for Partial Split */}
      <Modal isOpen={showPTModal} onClose={() => setShowPTModal(false)} title="Partial Split (PT)">
        <div style={{ marginBottom: '16px', padding: '12px', backgroundColor: '#f3f4f6', borderRadius: '8px' }}>
          <p><strong>Code:</strong> {selectedComponent?.ident_code}</p>
          <p><strong>Total Requested:</strong> {selectedComponent?.requested_qty}</p>
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Quantity found (will be ready for delivery)</label>
          <input
            type="number"
            value={ptQty}
            onChange={(e) => setPtQty(e.target.value)}
            min="1"
            max={selectedComponent?.requested_qty - 1}
            style={styles.input}
            placeholder="Enter partial quantity"
          />
        </div>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          <button
            onClick={() => setShowPTModal(false)}
            style={{ ...styles.button, ...styles.buttonSecondary }}
          >
            Cancel
          </button>
          <button
            onClick={submitPartialTransfer}
            style={{ ...styles.button, ...styles.buttonPrimary }}
          >
            Split
          </button>
        </div>
      </Modal>
    </div>
  );
}

// ============================================================
// WH YARD PAGE
// ============================================================
function WHYardPage({ user, onRefreshCounts }) {
  const [components, setComponents] = useState([]);
  const [checkNotifications, setCheckNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [showPTModal, setShowPTModal] = useState(false);
  const [selectedComponent, setSelectedComponent] = useState(null);
  const [note, setNote] = useState('');
  const [ptQty, setPtQty] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      // Load Yard components
      const { data: yardComps } = await supabase
        .from('request_components')
        .select(`
          *,
          request:requests(*),
          inventory:project_database(description, qty_yard)
        `)
        .eq('status', 'Yard')
        .order('created_at', { ascending: false });
      
      if (yardComps) setComponents(yardComps);

      // Load Check notifications from Engineering
      const { data: checks } = await supabase
        .from('request_components')
        .select(`
          *,
          request:requests(*),
          inventory:project_database(description, qty_yard)
        `)
        .eq('status', 'Check')
        .eq('check_target', 'Yard')
        .order('created_at', { ascending: false });
      
      if (checks) setCheckNotifications(checks);

    } catch (error) {
      console.error('Error loading WH Yard data:', error);
    }
    setLoading(false);
  };

  const handleAction = async (component, action) => {
    try {
      switch (action) {
        case 'found':
          // Transfer to Site IN (Trans status)
          setSelectedComponent(component);
          setShowNoteModal(true);
          return;
        
        case 'toEng':
          await supabase
            .from('request_components')
            .update({ status: 'Eng', updated_at: new Date().toISOString() })
            .eq('id', component.id);
          break;
        
        case 'pt':
          setSelectedComponent(component);
          setPtQty('');
          setShowPTModal(true);
          return;
        
        case 'return':
          await supabase
            .from('request_components')
            .update({ status: 'Site', updated_at: new Date().toISOString() })
            .eq('id', component.id);
          break;
        
        case 'delete':
          if (window.confirm('Are you sure you want to delete this component?')) {
            await supabase.from('request_components').delete().eq('id', component.id);
          }
          break;
      }
      loadData();
      if (onRefreshCounts) onRefreshCounts();
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };

  const handleCheckResponse = async (component, response) => {
    try {
      if (response === 'found') {
        // Found - send to Site IN
        await supabase
          .from('request_components')
          .update({ status: 'Trans', check_response: 'Found', updated_at: new Date().toISOString() })
          .eq('id', component.id);
      } else if (response === 'partial') {
        setSelectedComponent(component);
        setPtQty('');
        setShowPTModal(true);
        return;
      } else if (response === 'notfound') {
        await supabase
          .from('request_components')
          .update({ status: 'Eng', check_response: 'Not Found', updated_at: new Date().toISOString() })
          .eq('id', component.id);
      }
      loadData();
      if (onRefreshCounts) onRefreshCounts();
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };

  const submitFoundTransfer = async () => {
    if (!selectedComponent) return;
    try {
      // Update component to Transit status
      await supabase
        .from('request_components')
        .update({ 
          status: 'Trans', 
          notes: note,
          updated_at: new Date().toISOString() 
        })
        .eq('id', selectedComponent.id);
      
      // Decrement Yard qty
      await supabase.rpc('decrement_yard_qty', {
        p_ident_code: selectedComponent.ident_code,
        p_qty: selectedComponent.requested_qty
      });
      
      setShowNoteModal(false);
      setNote('');
      setSelectedComponent(null);
      loadData();
      if (onRefreshCounts) onRefreshCounts();
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };

  const submitPartialTransfer = async () => {
    if (!selectedComponent || !ptQty) return;
    const partialQty = parseInt(ptQty);
    if (partialQty >= selectedComponent.requested_qty) {
      alert('Partial quantity must be less than requested quantity');
      return;
    }

    try {
      // Update original - remains in Yard with reduced qty
      await supabase
        .from('request_components')
        .update({ 
          requested_qty: selectedComponent.requested_qty - partialQty,
          updated_at: new Date().toISOString()
        })
        .eq('id', selectedComponent.id);

      // Create split for found part
      const { data: request } = await supabase
        .from('requests')
        .select('request_number, request_type, sub_category, iso_number, spool_number')
        .eq('id', selectedComponent.request_id)
        .single();

      const baseNum = request.request_number.split('-')[0];
      const { data: splits } = await supabase
        .from('requests')
        .select('request_number')
        .like('request_number', `${baseNum}-%`);
      
      const nextSplit = splits ? splits.length : 1;

      const { data: newRequest } = await supabase
        .from('requests')
        .insert({
          request_number: `${baseNum}-${nextSplit}`,
          request_type: request.request_type,
          sub_category: request.sub_category,
          iso_number: request.iso_number,
          spool_number: request.spool_number,
          created_by: user.id,
          status: 'Open',
          parent_request_id: selectedComponent.request_id
        })
        .select()
        .single();

      await supabase
        .from('request_components')
        .insert({
          request_id: newRequest.id,
          ident_code: selectedComponent.ident_code,
          requested_qty: partialQty,
          status: 'Trans'
        });

      // Decrement Yard qty for the partial found
      await supabase.rpc('decrement_yard_qty', {
        p_ident_code: selectedComponent.ident_code,
        p_qty: partialQty
      });

      setShowPTModal(false);
      setPtQty('');
      setSelectedComponent(null);
      loadData();
      if (onRefreshCounts) onRefreshCounts();
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>Loading...</div>;
  }

  return (
    <div>
      {/* Check Notifications from Engineering */}
      {checkNotifications.length > 0 && (
        <div style={{
          backgroundColor: '#F5F3FF',
          border: '1px solid #C4B5FD',
          borderRadius: '8px',
          padding: '16px',
          marginBottom: '24px'
        }}>
          <h4 style={{ fontWeight: 'bold', color: COLORS.purple, marginBottom: '12px' }}>
            🔍 Check Requests from Engineering
          </h4>
          {checkNotifications.map(comp => (
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
                <span style={{ fontFamily: 'monospace', fontWeight: 'bold' }}>{comp.ident_code}</span>
                <span style={{ marginLeft: '12px', color: '#6b7280' }}>{comp.check_note}</span>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <ActionButton
                  color={COLORS.success}
                  onClick={() => handleCheckResponse(comp, 'found')}
                  title="Found"
                >
                  ✓
                </ActionButton>
                <ActionButton
                  color={COLORS.warning}
                  onClick={() => handleCheckResponse(comp, 'partial')}
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
          ))}
        </div>
      )}

      {/* Yard Components */}
      <div style={styles.card}>
        <div style={styles.cardHeader}>
          <h3 style={{ fontWeight: 'bold' }}>🏢 Warehouse Yard - Components</h3>
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
              const available = comp.inventory?.qty_yard || 0;
              const canProcess = available >= comp.requested_qty;
              
              return (
                <tr key={comp.id}>
                  <td style={{ ...styles.td, fontFamily: 'monospace', fontWeight: 'bold' }}>
                    {comp.request?.request_number}
                  </td>
                  <td style={{ ...styles.td, fontFamily: 'monospace' }}>{comp.ident_code}</td>
                  <td style={styles.td}>{comp.inventory?.description}</td>
                  <td style={styles.td}>{comp.requested_qty}</td>
                  <td style={styles.td}>
                    <span style={{ 
                      fontWeight: 'bold', 
                      color: canProcess ? COLORS.success : COLORS.primary 
                    }}>
                      {available}
                    </span>
                  </td>
                  <td style={styles.td}>
                    <div style={{ display: 'flex', gap: '4px' }}>
                      <ActionButton 
                        color={canProcess ? COLORS.success : '#d1d5db'} 
                        onClick={() => handleAction(comp, 'found')} 
                        title={canProcess ? "Found / Transfer" : "Insufficient quantity"}
                        disabled={!canProcess}
                      >
                        ✓
                      </ActionButton>
                      <ActionButton color={COLORS.warning} onClick={() => handleAction(comp, 'pt')} title="Partial Split">
                        PT
                      </ActionButton>
                      <ActionButton color={COLORS.purple} onClick={() => handleAction(comp, 'toEng')} title="Send to Engineering">
                        UT
                      </ActionButton>
                      <ActionButton color={COLORS.gray} onClick={() => handleAction(comp, 'return')} title="Return to Site">
                        ↩
                      </ActionButton>
                      <ActionButton color={COLORS.primary} onClick={() => handleAction(comp, 'delete')} title="Delete">
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
                  No components in Yard warehouse
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Note Modal for Transfer */}
      <Modal isOpen={showNoteModal} onClose={() => setShowNoteModal(false)} title="Found - Transfer to Site">
        <div style={{ marginBottom: '16px', padding: '12px', backgroundColor: '#D1FAE5', borderRadius: '8px' }}>
          <p><strong>Code:</strong> {selectedComponent?.ident_code}</p>
          <p><strong>Quantity:</strong> {selectedComponent?.requested_qty}</p>
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Note (optional)</label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            style={{ ...styles.input, minHeight: '100px' }}
            placeholder="Add a note..."
          />
        </div>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          <button
            onClick={() => setShowNoteModal(false)}
            style={{ ...styles.button, ...styles.buttonSecondary }}
          >
            Cancel
          </button>
          <button
            onClick={submitFoundTransfer}
            style={{ ...styles.button, backgroundColor: COLORS.success, color: 'white' }}
          >
            ✓ Confirm Transfer
          </button>
        </div>
      </Modal>

      {/* PT Modal */}
      <Modal isOpen={showPTModal} onClose={() => setShowPTModal(false)} title="Partial Split (PT)">
        <div style={{ marginBottom: '16px', padding: '12px', backgroundColor: '#f3f4f6', borderRadius: '8px' }}>
          <p><strong>Code:</strong> {selectedComponent?.ident_code}</p>
          <p><strong>Total Requested:</strong> {selectedComponent?.requested_qty}</p>
          <p><strong>Available in Yard:</strong> {selectedComponent?.inventory?.qty_yard || 0}</p>
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Quantity found (will be transferred)</label>
          <input
            type="number"
            value={ptQty}
            onChange={(e) => setPtQty(e.target.value)}
            min="1"
            max={Math.min(selectedComponent?.requested_qty - 1, selectedComponent?.inventory?.qty_yard || 0)}
            style={styles.input}
            placeholder="Enter partial quantity"
          />
        </div>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          <button
            onClick={() => setShowPTModal(false)}
            style={{ ...styles.button, ...styles.buttonSecondary }}
          >
            Cancel
          </button>
          <button
            onClick={submitPartialTransfer}
            style={{ ...styles.button, ...styles.buttonPrimary }}
          >
            Split & Transfer
          </button>
        </div>
      </Modal>
    </div>
  );
}

// ============================================================
// ENGINEERING PAGE
// ============================================================
function EngineeringPage({ user, onRefreshCounts }) {
  const [components, setComponents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCheckModal, setShowCheckModal] = useState(false);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [showPTModal, setShowPTModal] = useState(false);
  const [selectedComponent, setSelectedComponent] = useState(null);
  const [checkTarget, setCheckTarget] = useState('Site');
  const [checkNote, setCheckNote] = useState('');
  const [note, setNote] = useState('');
  const [ptQty, setPtQty] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const { data: engComps } = await supabase
        .from('request_components')
        .select(`
          *,
          request:requests(*),
          inventory:project_database(description, qty_yard, qty_site)
        `)
        .eq('status', 'Eng')
        .order('created_at', { ascending: false });
      
      if (engComps) setComponents(engComps);
    } catch (error) {
      console.error('Error loading Engineering data:', error);
    }
    setLoading(false);
  };

  const handleAction = async (component, action) => {
    try {
      switch (action) {
        case 'resolved':
          // Resolved - send back to Site as ready
          await supabase
            .from('request_components')
            .update({ status: 'ToCollect', updated_at: new Date().toISOString() })
            .eq('id', component.id);
          break;
        
        case 'check':
          setSelectedComponent(component);
          setCheckTarget('Site');
          setCheckNote('');
          setShowCheckModal(true);
          return;
        
        case 'note':
          setSelectedComponent(component);
          setNote('');
          setShowNoteModal(true);
          return;
        
        case 'pt':
          setSelectedComponent(component);
          setPtQty('');
          setShowPTModal(true);
          return;
        
        case 'spare':
          await supabase
            .from('request_components')
            .update({ status: 'Spare', updated_at: new Date().toISOString() })
            .eq('id', component.id);
          break;
        
        case 'mng':
          await supabase
            .from('request_components')
            .update({ status: 'Mng', updated_at: new Date().toISOString() })
            .eq('id', component.id);
          break;
        
        case 'return':
          await supabase
            .from('request_components')
            .update({ status: 'Site', updated_at: new Date().toISOString() })
            .eq('id', component.id);
          break;
        
        case 'delete':
          if (window.confirm('Are you sure you want to delete this component?')) {
            await supabase.from('request_components').delete().eq('id', component.id);
          }
          break;
      }
      loadData();
      if (onRefreshCounts) onRefreshCounts();
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
          status: 'Check',
          check_target: checkTarget,
          check_note: checkNote,
          updated_at: new Date().toISOString() 
        })
        .eq('id', selectedComponent.id);
      
      setShowCheckModal(false);
      setSelectedComponent(null);
      loadData();
      if (onRefreshCounts) onRefreshCounts();
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
          eng_note: note,
          updated_at: new Date().toISOString() 
        })
        .eq('id', selectedComponent.id);
      
      setShowNoteModal(false);
      setNote('');
      setSelectedComponent(null);
      loadData();
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };

  const submitPartialTransfer = async () => {
    if (!selectedComponent || !ptQty) return;
    const partialQty = parseInt(ptQty);
    if (partialQty >= selectedComponent.requested_qty) {
      alert('Partial quantity must be less than requested quantity');
      return;
    }

    try {
      await supabase
        .from('request_components')
        .update({ 
          requested_qty: selectedComponent.requested_qty - partialQty,
          updated_at: new Date().toISOString()
        })
        .eq('id', selectedComponent.id);

      const { data: request } = await supabase
        .from('requests')
        .select('request_number, request_type, sub_category, iso_number, spool_number')
        .eq('id', selectedComponent.request_id)
        .single();

      const baseNum = request.request_number.split('-')[0];
      const { data: splits } = await supabase
        .from('requests')
        .select('request_number')
        .like('request_number', `${baseNum}-%`);
      
      const nextSplit = splits ? splits.length : 1;

      const { data: newRequest } = await supabase
        .from('requests')
        .insert({
          request_number: `${baseNum}-${nextSplit}`,
          request_type: request.request_type,
          sub_category: request.sub_category,
          iso_number: request.iso_number,
          spool_number: request.spool_number,
          created_by: user.id,
          status: 'Open',
          parent_request_id: selectedComponent.request_id
        })
        .select()
        .single();

      await supabase
        .from('request_components')
        .insert({
          request_id: newRequest.id,
          ident_code: selectedComponent.ident_code,
          requested_qty: partialQty,
          status: 'ToCollect'
        });

      setShowPTModal(false);
      setPtQty('');
      setSelectedComponent(null);
      loadData();
      if (onRefreshCounts) onRefreshCounts();
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>Loading...</div>;
  }

  return (
    <div>
      {/* Info Box */}
      <div style={{
        backgroundColor: '#F5F3FF',
        border: '1px solid #C4B5FD',
        borderRadius: '8px',
        padding: '16px',
        marginBottom: '24px'
      }}>
        <h4 style={{ fontWeight: 'bold', color: COLORS.purple, marginBottom: '8px' }}>
          ⚙️ Engineering Workflow
        </h4>
        <p style={{ fontSize: '14px', color: '#6b7280' }}>
          Review materials, check archives, send verification requests to warehouses, or forward to Spare Parts / Management.
        </p>
      </div>

      {/* Components Table */}
      <div style={styles.card}>
        <div style={styles.cardHeader}>
          <h3 style={{ fontWeight: 'bold' }}>⚙️ Engineering - Components under review</h3>
        </div>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Request #</th>
              <th style={styles.th}>Code</th>
              <th style={styles.th}>Description</th>
              <th style={styles.th}>Qty</th>
              <th style={styles.th}>Yard Stock</th>
              <th style={styles.th}>Site Stock</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {components.map(comp => (
              <tr key={comp.id}>
                <td style={{ ...styles.td, fontFamily: 'monospace', fontWeight: 'bold' }}>
                  {comp.request?.request_number}
                </td>
                <td style={{ ...styles.td, fontFamily: 'monospace' }}>{comp.ident_code}</td>
                <td style={styles.td}>{comp.inventory?.description}</td>
                <td style={styles.td}>{comp.requested_qty}</td>
                <td style={styles.td}>
                  <span style={{ fontWeight: 'bold', color: comp.inventory?.qty_yard > 0 ? COLORS.success : COLORS.gray }}>
                    {comp.inventory?.qty_yard || 0}
                  </span>
                </td>
                <td style={styles.td}>
                  <span style={{ fontWeight: 'bold', color: comp.inventory?.qty_site > 0 ? COLORS.success : COLORS.gray }}>
                    {comp.inventory?.qty_site || 0}
                  </span>
                </td>
                <td style={styles.td}>
                  <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                    <ActionButton color={COLORS.success} onClick={() => handleAction(comp, 'resolved')} title="Resolved">
                      ✓
                    </ActionButton>
                    <ActionButton color={COLORS.warning} onClick={() => handleAction(comp, 'pt')} title="Partial Split">
                      PT
                    </ActionButton>
                    <ActionButton color={COLORS.info} onClick={() => handleAction(comp, 'check')} title="Send Check">
                      🔍
                    </ActionButton>
                    <ActionButton color={COLORS.cyan} onClick={() => handleAction(comp, 'note')} title="Add Note">
                      📝
                    </ActionButton>
                    <ActionButton color={COLORS.pink} onClick={() => handleAction(comp, 'spare')} title="Spare Parts">
                      Sp
                    </ActionButton>
                    <ActionButton color={COLORS.yellow} onClick={() => handleAction(comp, 'mng')} title="Management">
                      Mng
                    </ActionButton>
                    <ActionButton color={COLORS.gray} onClick={() => handleAction(comp, 'return')} title="Return">
                      ↩
                    </ActionButton>
                    <ActionButton color={COLORS.primary} onClick={() => handleAction(comp, 'delete')} title="Delete">
                      🗑️
                    </ActionButton>
                  </div>
                </td>
              </tr>
            ))}
            {components.length === 0 && (
              <tr>
                <td colSpan="7" style={{ ...styles.td, textAlign: 'center', color: '#9ca3af' }}>
                  No components pending engineering review
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Check Modal */}
      <Modal isOpen={showCheckModal} onClose={() => setShowCheckModal(false)} title="🔍 Send Check Request">
        <div style={{ marginBottom: '16px', padding: '12px', backgroundColor: '#f3f4f6', borderRadius: '8px' }}>
          <p><strong>Code:</strong> {selectedComponent?.ident_code}</p>
          <p><strong>Qty:</strong> {selectedComponent?.requested_qty}</p>
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Send check to:</label>
          <div style={{ display: 'flex', gap: '16px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              <input
                type="radio"
                checked={checkTarget === 'Site'}
                onChange={() => setCheckTarget('Site')}
              />
              WH Site
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              <input
                type="radio"
                checked={checkTarget === 'Yard'}
                onChange={() => setCheckTarget('Yard')}
              />
              WH Yard
            </label>
          </div>
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Note / Instructions</label>
          <textarea
            value={checkNote}
            onChange={(e) => setCheckNote(e.target.value)}
            style={{ ...styles.input, minHeight: '100px' }}
            placeholder="Instructions for warehouse to recheck..."
          />
        </div>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          <button
            onClick={() => setShowCheckModal(false)}
            style={{ ...styles.button, ...styles.buttonSecondary }}
          >
            Cancel
          </button>
          <button
            onClick={submitCheck}
            style={{ ...styles.button, backgroundColor: COLORS.info, color: 'white' }}
          >
            🔍 Send Check
          </button>
        </div>
      </Modal>

      {/* Note Modal */}
      <Modal isOpen={showNoteModal} onClose={() => setShowNoteModal(false)} title="📝 Add Engineering Note">
        <div style={styles.formGroup}>
          <label style={styles.label}>Note</label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            style={{ ...styles.input, minHeight: '100px' }}
            placeholder="Add notes or observations..."
          />
        </div>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          <button
            onClick={() => setShowNoteModal(false)}
            style={{ ...styles.button, ...styles.buttonSecondary }}
          >
            Cancel
          </button>
          <button
            onClick={submitNote}
            style={{ ...styles.button, ...styles.buttonPrimary }}
          >
            Save Note
          </button>
        </div>
      </Modal>

      {/* PT Modal */}
      <Modal isOpen={showPTModal} onClose={() => setShowPTModal(false)} title="Partial Split (PT)">
        <div style={{ marginBottom: '16px', padding: '12px', backgroundColor: '#f3f4f6', borderRadius: '8px' }}>
          <p><strong>Code:</strong> {selectedComponent?.ident_code}</p>
          <p><strong>Total Requested:</strong> {selectedComponent?.requested_qty}</p>
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Quantity to split (will be ready for delivery)</label>
          <input
            type="number"
            value={ptQty}
            onChange={(e) => setPtQty(e.target.value)}
            min="1"
            max={selectedComponent?.requested_qty - 1}
            style={styles.input}
          />
        </div>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          <button
            onClick={() => setShowPTModal(false)}
            style={{ ...styles.button, ...styles.buttonSecondary }}
          >
            Cancel
          </button>
          <button
            onClick={submitPartialTransfer}
            style={{ ...styles.button, ...styles.buttonPrimary }}
          >
            Split
          </button>
        </div>
      </Modal>
    </div>
  );
}

// ============================================================
// SITE IN PAGE
// ============================================================
function SiteInPage({ user, onRefreshCounts }) {
  const [components, setComponents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const { data: transComps } = await supabase
        .from('request_components')
        .select(`
          *,
          request:requests(*),
          inventory:project_database(description)
        `)
        .eq('status', 'Trans')
        .order('created_at', { ascending: false });
      
      if (transComps) setComponents(transComps);
    } catch (error) {
      console.error('Error loading Site IN data:', error);
    }
    setLoading(false);
  };

  const confirmArrival = async (component) => {
    try {
      // Update status to Site
      await supabase
        .from('request_components')
        .update({ 
          status: 'Site',
          arrived_at: new Date().toISOString(),
          updated_at: new Date().toISOString() 
        })
        .eq('id', component.id);

      // Increment Site qty
      await supabase.rpc('increment_site_qty', {
        p_ident_code: component.ident_code,
        p_qty: component.requested_qty
      });

      // Log movement
      await supabase.from('movements').insert({
        type: 'TRF',
        ident_code: component.ident_code,
        quantity: component.requested_qty,
        from_location: 'YARD',
        to_location: 'SITE',
        user_id: user.id,
        notes: `Request ${component.request?.request_number}`
      });

      loadData();
      if (onRefreshCounts) onRefreshCounts();
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>Loading...</div>;
  }

  return (
    <div>
      <div style={styles.card}>
        <div style={styles.cardHeader}>
          <h3 style={{ fontWeight: 'bold' }}>🚚 Site IN - Materials in transit from Yard</h3>
        </div>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Request #</th>
              <th style={styles.th}>Code</th>
              <th style={styles.th}>Description</th>
              <th style={styles.th}>Qty</th>
              <th style={styles.th}>Sent Date</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {components.map(comp => (
              <tr key={comp.id}>
                <td style={{ ...styles.td, fontFamily: 'monospace', fontWeight: 'bold' }}>
                  {comp.request?.request_number}
                </td>
                <td style={{ ...styles.td, fontFamily: 'monospace' }}>{comp.ident_code}</td>
                <td style={styles.td}>{comp.inventory?.description}</td>
                <td style={styles.td}>{comp.requested_qty}</td>
                <td style={styles.td}>{new Date(comp.updated_at).toLocaleDateString()}</td>
                <td style={styles.td}>
                  <button
                    onClick={() => confirmArrival(comp)}
                    style={{ ...styles.button, backgroundColor: COLORS.success, color: 'white' }}
                  >
                    ✓ Confirm Arrival
                  </button>
                </td>
              </tr>
            ))}
            {components.length === 0 && (
              <tr>
                <td colSpan="6" style={{ ...styles.td, textAlign: 'center', color: '#9ca3af' }}>
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
// MATERIAL IN PAGE
// ============================================================
function MaterialInPage({ user }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showReceiveModal, setShowReceiveModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [receivedQty, setReceivedQty] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const { data: orderedComps } = await supabase
        .from('request_components')
        .select(`
          *,
          request:requests(*),
          inventory:project_database(description)
        `)
        .eq('status', 'Ordered')
        .order('created_at', { ascending: false });
      
      if (orderedComps) setOrders(orderedComps);
    } catch (error) {
      console.error('Error loading Material IN data:', error);
    }
    setLoading(false);
  };

  const openReceiveModal = (order) => {
    setSelectedOrder(order);
    setReceivedQty(order.requested_qty.toString());
    setShowReceiveModal(true);
  };

  const confirmReceive = async () => {
    if (!selectedOrder || !receivedQty) return;
    
    try {
      const qty = parseInt(receivedQty);
      
      // Update component status
      await supabase
        .from('request_components')
        .update({ 
          status: 'Site',
          received_qty: qty,
          received_at: new Date().toISOString(),
          updated_at: new Date().toISOString() 
        })
        .eq('id', selectedOrder.id);

      // Increment Site qty
      await supabase.rpc('increment_site_qty', {
        p_ident_code: selectedOrder.ident_code,
        p_qty: qty
      });

      // Log movement
      await supabase.from('movements').insert({
        type: 'IN',
        ident_code: selectedOrder.ident_code,
        quantity: qty,
        from_location: 'SUPPLIER',
        to_location: 'SITE',
        user_id: user.id,
        notes: `Order received - Request ${selectedOrder.request?.request_number}`
      });

      setShowReceiveModal(false);
      setSelectedOrder(null);
      loadData();
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>Loading...</div>;
  }

  return (
    <div>
      <div style={styles.card}>
        <div style={styles.cardHeader}>
          <h3 style={{ fontWeight: 'bold' }}>📥 Material IN - Ordered materials pending arrival</h3>
        </div>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Request #</th>
              <th style={styles.th}>Code</th>
              <th style={styles.th}>Description</th>
              <th style={styles.th}>Qty Ordered</th>
              <th style={styles.th}>Order Date</th>
              <th style={styles.th}>Expected</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.id}>
                <td style={{ ...styles.td, fontFamily: 'monospace', fontWeight: 'bold' }}>
                  {order.request?.request_number}
                </td>
                <td style={{ ...styles.td, fontFamily: 'monospace' }}>{order.ident_code}</td>
                <td style={styles.td}>{order.inventory?.description}</td>
                <td style={styles.td}>{order.requested_qty}</td>
                <td style={styles.td}>{order.ordered_at ? new Date(order.ordered_at).toLocaleDateString() : '-'}</td>
                <td style={styles.td}>{order.expected_date ? new Date(order.expected_date).toLocaleDateString() : '-'}</td>
                <td style={styles.td}>
                  <button
                    onClick={() => openReceiveModal(order)}
                    style={{ ...styles.button, backgroundColor: COLORS.success, color: 'white' }}
                  >
                    📥 Receive
                  </button>
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan="7" style={{ ...styles.td, textAlign: 'center', color: '#9ca3af' }}>
                  No orders pending arrival
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Receive Modal */}
      <Modal isOpen={showReceiveModal} onClose={() => setShowReceiveModal(false)} title="📥 Receive Material">
        <div style={{ marginBottom: '16px', padding: '12px', backgroundColor: '#f3f4f6', borderRadius: '8px' }}>
          <p><strong>Code:</strong> {selectedOrder?.ident_code}</p>
          <p><strong>Ordered Qty:</strong> {selectedOrder?.requested_qty}</p>
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Received Quantity</label>
          <input
            type="number"
            value={receivedQty}
            onChange={(e) => setReceivedQty(e.target.value)}
            min="1"
            style={styles.input}
          />
        </div>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          <button
            onClick={() => setShowReceiveModal(false)}
            style={{ ...styles.button, ...styles.buttonSecondary }}
          >
            Cancel
          </button>
          <button
            onClick={confirmReceive}
            style={{ ...styles.button, backgroundColor: COLORS.success, color: 'white' }}
          >
            ✓ Confirm Receipt
          </button>
        </div>
      </Modal>
    </div>
  );
}

// ============================================================
// SPARE PARTS PAGE
// ============================================================
function SparePartsPage({ user, onRefreshCounts }) {
  const [components, setComponents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showResponseModal, setShowResponseModal] = useState(false);
  const [selectedComponent, setSelectedComponent] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const { data: spareComps } = await supabase
        .from('request_components')
        .select(`
          *,
          request:requests(*),
          inventory:project_database(description)
        `)
        .eq('status', 'Spare')
        .order('created_at', { ascending: false });
      
      if (spareComps) setComponents(spareComps);
    } catch (error) {
      console.error('Error loading Spare Parts data:', error);
    }
    setLoading(false);
  };

  const handleClientResponse = async (component, hasSpare) => {
    try {
      if (hasSpare) {
        // Client has the spare - ready for delivery
        await supabase
          .from('request_components')
          .update({ 
            status: 'ToCollect',
            spare_response: 'Client has spare',
            updated_at: new Date().toISOString() 
          })
          .eq('id', component.id);
      } else {
        // Client doesn't have spare - show modal for Mng
        setSelectedComponent(component);
        setShowResponseModal(true);
        return;
      }
      loadData();
      if (onRefreshCounts) onRefreshCounts();
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };

  const sendToManagement = async () => {
    if (!selectedComponent) return;
    try {
      await supabase
        .from('request_components')
        .update({ 
          status: 'Mng',
          spare_response: 'Client does not have spare - needs purchase',
          updated_at: new Date().toISOString() 
        })
        .eq('id', selectedComponent.id);
      
      setShowResponseModal(false);
      setSelectedComponent(null);
      loadData();
      if (onRefreshCounts) onRefreshCounts();
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>Loading...</div>;
  }

  return (
    <div>
      {/* Info Box */}
      <div style={{
        backgroundColor: '#FDF2F8',
        border: '1px solid #F9A8D4',
        borderRadius: '8px',
        padding: '16px',
        marginBottom: '24px'
      }}>
        <h4 style={{ fontWeight: 'bold', color: COLORS.pink, marginBottom: '8px' }}>
          🔧 Spare Parts Workflow
        </h4>
        <p style={{ fontSize: '14px', color: '#6b7280' }}>
          Contact client to check if they have spare parts available. If yes, mark as ready. If no, send to Management for purchase.
        </p>
      </div>

      <div style={styles.card}>
        <div style={styles.cardHeader}>
          <h3 style={{ fontWeight: 'bold' }}>🔧 Spare Parts - Pending client response</h3>
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
                <td style={{ ...styles.td, fontFamily: 'monospace', fontWeight: 'bold' }}>
                  {comp.request?.request_number}
                </td>
                <td style={{ ...styles.td, fontFamily: 'monospace' }}>{comp.ident_code}</td>
                <td style={styles.td}>{comp.inventory?.description}</td>
                <td style={styles.td}>{comp.requested_qty}</td>
                <td style={styles.td}>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => handleClientResponse(comp, true)}
                      style={{ ...styles.button, backgroundColor: COLORS.success, color: 'white' }}
                    >
                      ✓ Client Has It
                    </button>
                    <button
                      onClick={() => handleClientResponse(comp, false)}
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
                <td colSpan="5" style={{ ...styles.td, textAlign: 'center', color: '#9ca3af' }}>
                  No spare parts requests pending
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Confirmation Modal for Mng */}
      <Modal isOpen={showResponseModal} onClose={() => setShowResponseModal(false)} title="⚠️ Client doesn't have spare">
        <div style={{ marginBottom: '16px', padding: '12px', backgroundColor: '#FEF3C7', borderRadius: '8px' }}>
          <p><strong>Code:</strong> {selectedComponent?.ident_code}</p>
          <p><strong>Qty:</strong> {selectedComponent?.requested_qty}</p>
          <p style={{ marginTop: '12px', color: COLORS.warning }}>
            <strong>Note:</strong> Client does not have this spare part available. Request will be sent to Management for purchase decision.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          <button
            onClick={() => setShowResponseModal(false)}
            style={{ ...styles.button, ...styles.buttonSecondary }}
          >
            Cancel
          </button>
          <button
            onClick={sendToManagement}
            style={{ ...styles.button, backgroundColor: COLORS.yellow, color: 'white' }}
          >
            👔 Send to Management
          </button>
        </div>
      </Modal>
    </div>
  );
}

// ============================================================
// ORDERS PAGE
// ============================================================
function OrdersPage({ user, onRefreshCounts }) {
  const [activeTab, setActiveTab] = useState('toOrder');
  const [toOrder, setToOrder] = useState([]);
  const [ordered, setOrdered] = useState([]);
  const [orderLog, setOrderLog] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [selectedComponent, setSelectedComponent] = useState(null);
  const [expectedDate, setExpectedDate] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      // To Order
      const { data: orderComps } = await supabase
        .from('request_components')
        .select(`
          *,
          request:requests(*),
          inventory:project_database(description)
        `)
        .eq('status', 'Order')
        .order('created_at', { ascending: false });
      if (orderComps) setToOrder(orderComps);

      // Ordered
      const { data: orderedComps } = await supabase
        .from('request_components')
        .select(`
          *,
          request:requests(*),
          inventory:project_database(description)
        `)
        .eq('status', 'Ordered')
        .order('ordered_at', { ascending: false });
      if (orderedComps) setOrdered(orderedComps);

      // Order Log
      const { data: logData } = await supabase
        .from('order_log')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);
      if (logData) setOrderLog(logData);

    } catch (error) {
      console.error('Error loading Orders data:', error);
    }
    setLoading(false);
  };

  const openOrderModal = (component) => {
    setSelectedComponent(component);
    setExpectedDate('');
    setShowOrderModal(true);
  };

  const confirmOrder = async () => {
    if (!selectedComponent) return;
    
    try {
      await supabase
        .from('request_components')
        .update({ 
          status: 'Ordered',
          ordered_at: new Date().toISOString(),
          expected_date: expectedDate || null,
          updated_at: new Date().toISOString() 
        })
        .eq('id', selectedComponent.id);

      // Log the order
      await supabase.from('order_log').insert({
        component_id: selectedComponent.id,
        ident_code: selectedComponent.ident_code,
        quantity: selectedComponent.requested_qty,
        ordered_by: user.id,
        expected_date: expectedDate || null
      });

      setShowOrderModal(false);
      setSelectedComponent(null);
      loadData();
      if (onRefreshCounts) onRefreshCounts();
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>Loading...</div>;
  }

  const tabs = [
    { id: 'toOrder', label: 'To Order', count: toOrder.length },
    { id: 'ordered', label: 'Ordered', count: ordered.length },
    { id: 'log', label: 'Log', count: null }
  ];

  return (
    <div>
      {/* Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              ...styles.button,
              backgroundColor: activeTab === tab.id ? 'white' : '#e5e7eb',
              color: activeTab === tab.id ? COLORS.primary : '#6b7280',
              boxShadow: activeTab === tab.id ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
            }}
          >
            {tab.label} {tab.count !== null && `(${tab.count})`}
          </button>
        ))}
      </div>

      {/* To Order Tab */}
      {activeTab === 'toOrder' && (
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <h3 style={{ fontWeight: 'bold' }}>🛒 To Order</h3>
          </div>
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
              {toOrder.map(comp => (
                <tr key={comp.id}>
                  <td style={{ ...styles.td, fontFamily: 'monospace', fontWeight: 'bold' }}>
                    {comp.request?.request_number}
                  </td>
                  <td style={{ ...styles.td, fontFamily: 'monospace' }}>{comp.ident_code}</td>
                  <td style={styles.td}>{comp.inventory?.description}</td>
                  <td style={styles.td}>{comp.requested_qty}</td>
                  <td style={styles.td}>{comp.order_type || 'Internal'}</td>
                  <td style={styles.td}>
                    <button
                      onClick={() => openOrderModal(comp)}
                      style={{ ...styles.button, backgroundColor: COLORS.success, color: 'white' }}
                    >
                      🛒 Place Order
                    </button>
                  </td>
                </tr>
              ))}
              {toOrder.length === 0 && (
                <tr>
                  <td colSpan="6" style={{ ...styles.td, textAlign: 'center', color: '#9ca3af' }}>
                    No orders pending
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Ordered Tab */}
      {activeTab === 'ordered' && (
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <h3 style={{ fontWeight: 'bold' }}>📦 Ordered - Awaiting delivery</h3>
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
              </tr>
            </thead>
            <tbody>
              {ordered.map(comp => (
                <tr key={comp.id}>
                  <td style={{ ...styles.td, fontFamily: 'monospace', fontWeight: 'bold' }}>
                    {comp.request?.request_number}
                  </td>
                  <td style={{ ...styles.td, fontFamily: 'monospace' }}>{comp.ident_code}</td>
                  <td style={styles.td}>{comp.inventory?.description}</td>
                  <td style={styles.td}>{comp.requested_qty}</td>
                  <td style={styles.td}>{comp.ordered_at ? new Date(comp.ordered_at).toLocaleDateString() : '-'}</td>
                  <td style={styles.td}>{comp.expected_date ? new Date(comp.expected_date).toLocaleDateString() : '-'}</td>
                </tr>
              ))}
              {ordered.length === 0 && (
                <tr>
                  <td colSpan="6" style={{ ...styles.td, textAlign: 'center', color: '#9ca3af' }}>
                    No active orders
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Log Tab */}
      {activeTab === 'log' && (
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <h3 style={{ fontWeight: 'bold' }}>📋 Order Log</h3>
          </div>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Date</th>
                <th style={styles.th}>Code</th>
                <th style={styles.th}>Qty</th>
                <th style={styles.th}>Expected</th>
              </tr>
            </thead>
            <tbody>
              {orderLog.map((log, idx) => (
                <tr key={idx}>
                  <td style={styles.td}>{new Date(log.created_at).toLocaleString()}</td>
                  <td style={{ ...styles.td, fontFamily: 'monospace' }}>{log.ident_code}</td>
                  <td style={styles.td}>{log.quantity}</td>
                  <td style={styles.td}>{log.expected_date ? new Date(log.expected_date).toLocaleDateString() : '-'}</td>
                </tr>
              ))}
              {orderLog.length === 0 && (
                <tr>
                  <td colSpan="4" style={{ ...styles.td, textAlign: 'center', color: '#9ca3af' }}>
                    No order history
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Order Modal */}
      <Modal isOpen={showOrderModal} onClose={() => setShowOrderModal(false)} title="🛒 Place Order">
        <div style={{ marginBottom: '16px', padding: '12px', backgroundColor: '#f3f4f6', borderRadius: '8px' }}>
          <p><strong>Code:</strong> {selectedComponent?.ident_code}</p>
          <p><strong>Qty:</strong> {selectedComponent?.requested_qty}</p>
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Expected Delivery Date</label>
          <input
            type="date"
            value={expectedDate}
            onChange={(e) => setExpectedDate(e.target.value)}
            style={styles.input}
          />
        </div>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          <button
            onClick={() => setShowOrderModal(false)}
            style={{ ...styles.button, ...styles.buttonSecondary }}
          >
            Cancel
          </button>
          <button
            onClick={confirmOrder}
            style={{ ...styles.button, backgroundColor: COLORS.success, color: 'white' }}
          >
            ✓ Confirm Order
          </button>
        </div>
      </Modal>
    </div>
  );
}

// ============================================================
// MANAGEMENT PAGE
// ============================================================
function ManagementPage({ user, onRefreshCounts }) {
  const [components, setComponents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const { data: mngComps } = await supabase
        .from('request_components')
        .select(`
          *,
          request:requests(*),
          inventory:project_database(description)
        `)
        .eq('status', 'Mng')
        .order('created_at', { ascending: false });
      
      if (mngComps) setComponents(mngComps);
    } catch (error) {
      console.error('Error loading Management data:', error);
    }
    setLoading(false);
  };

  const handleDecision = async (component, decision) => {
    try {
      await supabase
        .from('request_components')
        .update({ 
          status: 'Order',
          order_type: decision, // 'Internal' or 'Client'
          updated_at: new Date().toISOString() 
        })
        .eq('id', component.id);

      loadData();
      if (onRefreshCounts) onRefreshCounts();
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>Loading...</div>;
  }

  return (
    <div>
      {/* Info Box */}
      <div style={{
        backgroundColor: '#FEF9C3',
        border: '1px solid #FDE047',
        borderRadius: '8px',
        padding: '16px',
        marginBottom: '24px'
      }}>
        <h4 style={{ fontWeight: 'bold', color: COLORS.yellow, marginBottom: '8px' }}>
          👔 Management Decisions
        </h4>
        <p style={{ fontSize: '14px', color: '#6b7280' }}>
          Review requests and decide: Internal Order (company pays) or Client Order (client pays).
        </p>
      </div>

      <div style={styles.card}>
        <div style={styles.cardHeader}>
          <h3 style={{ fontWeight: 'bold' }}>👔 Management - Pending decisions</h3>
        </div>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Request #</th>
              <th style={styles.th}>Code</th>
              <th style={styles.th}>Description</th>
              <th style={styles.th}>Qty</th>
              <th style={styles.th}>Notes</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {components.map(comp => (
              <tr key={comp.id}>
                <td style={{ ...styles.td, fontFamily: 'monospace', fontWeight: 'bold' }}>
                  {comp.request?.request_number}
                </td>
                <td style={{ ...styles.td, fontFamily: 'monospace' }}>{comp.ident_code}</td>
                <td style={styles.td}>{comp.inventory?.description}</td>
                <td style={styles.td}>{comp.requested_qty}</td>
                <td style={styles.td}>
                  <span style={{ fontSize: '12px', color: '#6b7280' }}>
                    {comp.spare_response || comp.eng_note || '-'}
                  </span>
                </td>
                <td style={styles.td}>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => handleDecision(comp, 'Internal')}
                      style={{ ...styles.button, backgroundColor: COLORS.info, color: 'white' }}
                    >
                      🏢 Internal Order
                    </button>
                    <button
                      onClick={() => handleDecision(comp, 'Client')}
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
                  No decisions pending
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
  const [newMir, setNewMir] = useState({
    category: 'Erection',
    priority: 'Normal',
    expected_date: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const { data: mirData } = await supabase
        .from('mirs')
        .select('*')
        .order('created_at', { ascending: false });
      if (mirData) setMirs(mirData);
    } catch (error) {
      console.error('Error loading MIR data:', error);
    }
    setLoading(false);
  };

  const createMir = async () => {
    try {
      // Generate MIR number
      const { data: lastMir } = await supabase
        .from('mirs')
        .select('mir_number')
        .order('mir_number', { ascending: false })
        .limit(1);
      
      const nextNum = lastMir && lastMir.length > 0 
        ? String(parseInt(lastMir[0].mir_number.replace('MIR-', '')) + 1).padStart(4, '0')
        : '0001';

      await supabase.from('mirs').insert({
        mir_number: `MIR-${nextNum}`,
        category: newMir.category,
        priority: newMir.priority,
        expected_date: newMir.expected_date || null,
        status: 'Open',
        created_by: user.id
      });

      setShowCreateModal(false);
      setNewMir({ category: 'Erection', priority: 'Normal', expected_date: '' });
      loadData();
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>Loading...</div>;
  }

  return (
    <div>
      <div style={styles.card}>
        <div style={styles.cardHeader}>
          <h3 style={{ fontWeight: 'bold' }}>📦 MIR - Material Issue Report</h3>
          <button
            onClick={() => setShowCreateModal(true)}
            style={{ ...styles.button, ...styles.buttonPrimary }}
          >
            + New MIR
          </button>
        </div>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>MIR Number</th>
              <th style={styles.th}>RK Number</th>
              <th style={styles.th}>Category</th>
              <th style={styles.th}>Created Date</th>
              <th style={styles.th}>Expected Date</th>
              <th style={styles.th}>Priority</th>
              <th style={styles.th}>Status</th>
            </tr>
          </thead>
          <tbody>
            {mirs.map(mir => (
              <tr key={mir.id}>
                <td style={{ ...styles.td, fontFamily: 'monospace', fontWeight: 'bold' }}>{mir.mir_number}</td>
                <td style={{ ...styles.td, fontFamily: 'monospace' }}>{mir.rk_number || '-'}</td>
                <td style={styles.td}>{mir.category}</td>
                <td style={styles.td}>{new Date(mir.created_at).toLocaleDateString()}</td>
                <td style={styles.td}>{mir.expected_date ? new Date(mir.expected_date).toLocaleDateString() : '-'}</td>
                <td style={styles.td}>
                  <span style={{
                    ...styles.badge,
                    backgroundColor: mir.priority === 'High' ? COLORS.primary : 
                                    mir.priority === 'Normal' ? COLORS.info : COLORS.gray
                  }}>
                    {mir.priority}
                  </span>
                </td>
                <td style={styles.td}>
                  <span style={{
                    ...styles.badge,
                    backgroundColor: mir.status === 'Open' ? COLORS.warning :
                                    mir.status === 'Completed' ? COLORS.success : COLORS.gray
                  }}>
                    {mir.status}
                  </span>
                </td>
              </tr>
            ))}
            {mirs.length === 0 && (
              <tr>
                <td colSpan="7" style={{ ...styles.td, textAlign: 'center', color: '#9ca3af' }}>
                  No MIR registered
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Create MIR Modal */}
      <Modal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} title="+ New MIR">
        <div style={styles.formGroup}>
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
        <div style={styles.formGroup}>
          <label style={styles.label}>Priority</label>
          <select
            value={newMir.priority}
            onChange={(e) => setNewMir({ ...newMir, priority: e.target.value })}
            style={styles.select}
          >
            <option value="Low">Low</option>
            <option value="Normal">Normal</option>
            <option value="High">High</option>
          </select>
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Expected Date</label>
          <input
            type="date"
            value={newMir.expected_date}
            onChange={(e) => setNewMir({ ...newMir, expected_date: e.target.value })}
            style={styles.input}
          />
        </div>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          <button
            onClick={() => setShowCreateModal(false)}
            style={{ ...styles.button, ...styles.buttonSecondary }}
          >
            Cancel
          </button>
          <button
            onClick={createMir}
            style={{ ...styles.button, ...styles.buttonPrimary }}
          >
            Create MIR
          </button>
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
  const [showAddModal, setShowAddModal] = useState(false);
  const [newItem, setNewItem] = useState({
    ident_code: '',
    description: '',
    qty_yard: 0,
    qty_site: 0
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const { data: invData } = await supabase
        .from('project_database')
        .select('*')
        .order('ident_code');
      if (invData) setInventory(invData);
    } catch (error) {
      console.error('Error loading Database:', error);
    }
    setLoading(false);
  };

  const addItem = async () => {
    if (!newItem.ident_code) {
      alert('Ident Code is required');
      return;
    }
    try {
      await supabase.from('project_database').insert({
        ident_code: newItem.ident_code,
        description: newItem.description,
        qty_yard: parseInt(newItem.qty_yard) || 0,
        qty_site: parseInt(newItem.qty_site) || 0
      });
      setShowAddModal(false);
      setNewItem({ ident_code: '', description: '', qty_yard: 0, qty_site: 0 });
      loadData();
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>Loading...</div>;
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }}>
        <button
          onClick={() => setShowAddModal(true)}
          style={{ ...styles.button, backgroundColor: COLORS.info, color: 'white' }}
        >
          + Manual Balance
        </button>
      </div>

      <div style={styles.card}>
        <div style={styles.cardHeader}>
          <h3 style={{ fontWeight: 'bold' }}>💾 Inventory Database</h3>
        </div>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Code</th>
              <th style={styles.th}>Description</th>
              <th style={{ ...styles.th, textAlign: 'center', backgroundColor: COLORS.secondary, color: 'white' }}>YARD</th>
              <th style={{ ...styles.th, textAlign: 'center', backgroundColor: COLORS.info, color: 'white' }}>SITE</th>
              <th style={{ ...styles.th, textAlign: 'center', backgroundColor: COLORS.orange, color: 'white' }}>LOST</th>
              <th style={{ ...styles.th, textAlign: 'center', backgroundColor: COLORS.purple, color: 'white' }}>BROKEN</th>
              <th style={{ ...styles.th, textAlign: 'center' }}>TOTAL</th>
            </tr>
          </thead>
          <tbody>
            {inventory.map(item => {
              const total = (item.qty_yard || 0) + (item.qty_site || 0);
              return (
                <tr key={item.id}>
                  <td style={{ ...styles.td, fontFamily: 'monospace', fontWeight: 'bold' }}>{item.ident_code}</td>
                  <td style={styles.td}>{item.description}</td>
                  <td style={{ ...styles.td, textAlign: 'center', fontWeight: 'bold' }}>{item.qty_yard || 0}</td>
                  <td style={{ ...styles.td, textAlign: 'center', fontWeight: 'bold' }}>{item.qty_site || 0}</td>
                  <td style={{ ...styles.td, textAlign: 'center', fontWeight: 'bold' }}>{item.qty_lost || 0}</td>
                  <td style={{ ...styles.td, textAlign: 'center', fontWeight: 'bold' }}>{item.qty_broken || 0}</td>
                  <td style={{ ...styles.td, textAlign: 'center', fontWeight: 'bold', color: COLORS.primary }}>{total}</td>
                </tr>
              );
            })}
            {inventory.length === 0 && (
              <tr>
                <td colSpan="7" style={{ ...styles.td, textAlign: 'center', color: '#9ca3af' }}>
                  No items in database
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add Item Modal */}
      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="+ Manual Balance">
        <div style={styles.formGroup}>
          <label style={styles.label}>Ident Code *</label>
          <input
            type="text"
            value={newItem.ident_code}
            onChange={(e) => setNewItem({ ...newItem, ident_code: e.target.value })}
            style={styles.input}
          />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Description</label>
          <input
            type="text"
            value={newItem.description}
            onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
            style={styles.input}
          />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Qty Yard</label>
            <input
              type="number"
              value={newItem.qty_yard}
              onChange={(e) => setNewItem({ ...newItem, qty_yard: e.target.value })}
              style={styles.input}
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Qty Site</label>
            <input
              type="number"
              value={newItem.qty_site}
              onChange={(e) => setNewItem({ ...newItem, qty_site: e.target.value })}
              style={styles.input}
            />
          </div>
        </div>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          <button
            onClick={() => setShowAddModal(false)}
            style={{ ...styles.button, ...styles.buttonSecondary }}
          >
            Cancel
          </button>
          <button
            onClick={addItem}
            style={{ ...styles.button, ...styles.buttonPrimary }}
          >
            ✓ Save
          </button>
        </div>
      </Modal>
    </div>
  );
}

// ============================================================
// LOG PAGE
// ============================================================
function LogPage({ user }) {
  const [movements, setMovements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newMovement, setNewMovement] = useState({
    type: 'IN',
    ident_code: '',
    quantity: '',
    from_location: '',
    to_location: '',
    notes: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const { data: movData } = await supabase
        .from('movements')
        .select('*, user:users(full_name)')
        .order('created_at', { ascending: false })
        .limit(100);
      if (movData) setMovements(movData);
    } catch (error) {
      console.error('Error loading Log:', error);
    }
    setLoading(false);
  };

  const addMovement = async () => {
    if (!newMovement.ident_code || !newMovement.quantity) {
      alert('Code and quantity are required');
      return;
    }
    try {
      await supabase.from('movements').insert({
        type: newMovement.type,
        ident_code: newMovement.ident_code,
        quantity: parseInt(newMovement.quantity),
        from_location: newMovement.from_location,
        to_location: newMovement.to_location,
        notes: newMovement.notes,
        user_id: user.id
      });
      setShowAddModal(false);
      setNewMovement({ type: 'IN', ident_code: '', quantity: '', from_location: '', to_location: '', notes: '' });
      loadData();
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'IN': return COLORS.success;
      case 'OUT': return COLORS.primary;
      case 'TRF': return COLORS.info;
      case 'LOST': return COLORS.orange;
      case 'BROKEN': return COLORS.purple;
      case 'BAL': return COLORS.yellow;
      default: return COLORS.gray;
    }
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>Loading...</div>;
  }

  return (
    <div>
      <div style={styles.card}>
        <div style={styles.cardHeader}>
          <h3 style={{ fontWeight: 'bold' }}>📝 Movement Log</h3>
          <button
            onClick={() => setShowAddModal(true)}
            style={{ ...styles.button, ...styles.buttonPrimary }}
          >
            + Add Movement
          </button>
        </div>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Date</th>
              <th style={styles.th}>Type</th>
              <th style={styles.th}>Code</th>
              <th style={styles.th}>Qty</th>
              <th style={styles.th}>From → To</th>
              <th style={styles.th}>Notes</th>
              <th style={styles.th}>User</th>
            </tr>
          </thead>
          <tbody>
            {movements.map((mov, idx) => (
              <tr key={idx}>
                <td style={styles.td}>{new Date(mov.created_at).toLocaleString()}</td>
                <td style={styles.td}>
                  <span style={{ ...styles.badge, backgroundColor: getTypeColor(mov.type) }}>
                    {mov.type}
                  </span>
                </td>
                <td style={{ ...styles.td, fontFamily: 'monospace' }}>{mov.ident_code}</td>
                <td style={styles.td}>{mov.quantity}</td>
                <td style={styles.td}>{mov.from_location} → {mov.to_location}</td>
                <td style={{ ...styles.td, fontSize: '12px', color: '#6b7280' }}>{mov.notes || '-'}</td>
                <td style={styles.td}>{mov.user?.full_name || '-'}</td>
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

      {/* Add Movement Modal */}
      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="+ Add Movement">
        <div style={styles.formGroup}>
          <label style={styles.label}>Type</label>
          <select
            value={newMovement.type}
            onChange={(e) => setNewMovement({ ...newMovement, type: e.target.value })}
            style={styles.select}
          >
            <option value="IN">IN</option>
            <option value="OUT">OUT</option>
            <option value="TRF">TRANSFER</option>
            <option value="LOST">LOST</option>
            <option value="BROKEN">BROKEN</option>
            <option value="BAL">BALANCE</option>
          </select>
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Ident Code *</label>
          <input
            type="text"
            value={newMovement.ident_code}
            onChange={(e) => setNewMovement({ ...newMovement, ident_code: e.target.value })}
            style={styles.input}
          />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Quantity *</label>
          <input
            type="number"
            value={newMovement.quantity}
            onChange={(e) => setNewMovement({ ...newMovement, quantity: e.target.value })}
            style={styles.input}
          />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div style={styles.formGroup}>
            <label style={styles.label}>From</label>
            <input
              type="text"
              value={newMovement.from_location}
              onChange={(e) => setNewMovement({ ...newMovement, from_location: e.target.value })}
              style={styles.input}
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>To</label>
            <input
              type="text"
              value={newMovement.to_location}
              onChange={(e) => setNewMovement({ ...newMovement, to_location: e.target.value })}
              style={styles.input}
            />
          </div>
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Notes</label>
          <textarea
            value={newMovement.notes}
            onChange={(e) => setNewMovement({ ...newMovement, notes: e.target.value })}
            style={{ ...styles.input, minHeight: '80px' }}
          />
        </div>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          <button
            onClick={() => setShowAddModal(false)}
            style={{ ...styles.button, ...styles.buttonSecondary }}
          >
            Cancel
          </button>
          <button
            onClick={addMovement}
            style={{ ...styles.button, ...styles.buttonPrimary }}
          >
            ✓ Save
          </button>
        </div>
      </Modal>
    </div>
  );
}

// ============================================================
// MAIN APP
// ============================================================
export default function App() {
  const [user, setUser] = useState(null);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [counts, setCounts] = useState({});

  useEffect(() => {
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

  useEffect(() => {
    if (user) {
      loadCounts();
      // Refresh counts every 30 seconds
      const interval = setInterval(loadCounts, 30000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const loadCounts = async () => {
    try {
      const { data: components } = await supabase
        .from('request_components')
        .select('status, check_target');
      
      if (components) {
        const newCounts = {
          siteIn: components.filter(c => c.status === 'Trans').length,
          whSite: components.filter(c => c.status === 'Site' || (c.status === 'Check' && c.check_target === 'Site')).length,
          whYard: components.filter(c => c.status === 'Yard' || (c.status === 'Check' && c.check_target === 'Yard')).length,
          engineering: components.filter(c => c.status === 'Eng').length,
          spare: components.filter(c => c.status === 'Spare').length,
          orders: components.filter(c => c.status === 'Order').length,
          management: components.filter(c => c.status === 'Mng').length
        };
        setCounts(newCounts);
      }
    } catch (error) {
      console.error('Error loading counts:', error);
    }
  };

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
        <div style={{ color: 'white', fontSize: '18px' }}>Loading...</div>
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
        return <WHSitePage user={user} onRefreshCounts={loadCounts} />;
      case 'whYard':
        return <WHYardPage user={user} onRefreshCounts={loadCounts} />;
      case 'engineering':
        return <EngineeringPage user={user} onRefreshCounts={loadCounts} />;
      case 'siteIn':
        return <SiteInPage user={user} onRefreshCounts={loadCounts} />;
      case 'materialIn':
        return <MaterialInPage user={user} />;
      case 'spareParts':
        return <SparePartsPage user={user} onRefreshCounts={loadCounts} />;
      case 'orders':
        return <OrdersPage user={user} onRefreshCounts={loadCounts} />;
      case 'management':
        return <ManagementPage user={user} onRefreshCounts={loadCounts} />;
      case 'mir':
        return <MIRPage user={user} />;
      case 'database':
        return <DatabasePage user={user} />;
      case 'log':
        return <LogPage user={user} />;
      default:
        return <DashboardPage user={user} />;
    }
  };

  const pageTitles = {
    dashboard: 'Dashboard',
    requests: 'New Request',
    mir: 'MIR',
    materialIn: 'Material IN',
    siteIn: 'Site IN',
    whSite: 'WH Site',
    whYard: 'WH Yard',
    engineering: 'Engineering',
    spareParts: 'Spare Parts',
    orders: 'Orders',
    management: 'Management',
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
        counts={counts}
      />
      <div style={styles.main}>
        <header style={styles.header}>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1f2937' }}>
            {pageTitles[currentPage] || currentPage}
          </h2>
          <button
            onClick={() => {
              loadCounts();
              window.location.reload();
            }}
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
