// ============================================================
// MATERIALS MANAGER V26.3 - APP.JSX COMPLETE
// MAX STREICHER Edition - ALL ENGLISH
// FIXES: TestPack spool autocomplete, ISO autocomplete, Ident autocomplete, MIR redesign
// ============================================================

import React, { useState, useEffect, useCallback } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// CONSTANTS
const COLORS = {
  primary: '#E31E24', primaryDark: '#B91C1C', secondary: '#1F2937',
  success: '#16a34a', warning: '#D97706', info: '#2563EB',
  purple: '#7C3AED', pink: '#EC4899', cyan: '#0891B2',
  orange: '#EA580C', gray: '#6B7280', yellow: '#CA8A04', teal: '#0D9488'
};

const STATUS_COLORS = {
  Site: COLORS.info, Yard: COLORS.secondary, Trans: COLORS.warning,
  Eng: COLORS.purple, Spare: COLORS.pink, Mng: COLORS.yellow,
  Order: COLORS.orange, Ordered: COLORS.cyan, ToCollect: COLORS.success,
  HF: COLORS.teal, TP: COLORS.purple, Done: COLORS.gray
};

const MIR_CATEGORIES = ['Erection', 'Bulk', 'Instrument', 'Support'];
const REQUEST_TYPES = ['Piping', 'Mechanical', 'TestPack'];
const SUB_CATEGORIES = ['Bulk', 'Erection', 'Support'];
const MOVEMENT_TYPES = ['IN', 'OUT', 'LOST', 'BROKEN', 'BAL', 'TRANSFER'];

// STYLES
const styles = {
  container: { minHeight: '100vh', display: 'flex', backgroundColor: '#f3f4f6', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' },
  sidebar: { width: '256px', backgroundColor: COLORS.secondary, display: 'flex', flexDirection: 'column', transition: 'width 0.3s ease' },
  sidebarCollapsed: { width: '64px' },
  logo: { padding: '16px', display: 'flex', alignItems: 'center', gap: '12px', borderBottom: '1px solid #374151' },
  logoIcon: { width: '40px', height: '40px', backgroundColor: COLORS.primary, borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', fontSize: '14px' },
  nav: { flex: 1, padding: '16px 0', overflowY: 'auto' },
  navItem: { display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', color: '#9ca3af', cursor: 'pointer', transition: 'all 0.2s', borderLeft: '4px solid transparent' },
  navItemActive: { backgroundColor: 'rgba(227, 30, 36, 0.2)', borderLeftColor: COLORS.primary, color: 'white' },
  main: { flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' },
  header: { backgroundColor: 'white', padding: '16px 24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  content: { flex: 1, padding: '24px', overflowY: 'auto' },
  card: { backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden' },
  cardHeader: { padding: '16px', borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '500', color: '#6b7280', backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb' },
  td: { padding: '12px 16px', borderBottom: '1px solid #e5e7eb', fontSize: '14px' },
  button: { padding: '8px 16px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontSize: '14px', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '8px', transition: 'all 0.2s' },
  buttonPrimary: { backgroundColor: COLORS.primary, color: 'white' },
  buttonSecondary: { backgroundColor: '#f3f4f6', color: '#374151' },
  input: { width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '14px', outline: 'none', boxSizing: 'border-box' },
  select: { width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '14px', outline: 'none', backgroundColor: 'white', boxSizing: 'border-box' },
  label: { display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500', color: '#374151' },
  statusBadge: { padding: '4px 8px', borderRadius: '4px', color: 'white', fontSize: '11px', fontWeight: '500', display: 'inline-block' },
  actionButton: { width: '32px', height: '32px', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer', border: 'none', transition: 'transform 0.2s' }
};

// UTILITY COMPONENTS
function Modal({ isOpen, onClose, title, children, wide }) {
  if (!isOpen) return null;
  return (
    <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }} onClick={onClose}>
      <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '24px', maxWidth: wide ? '900px' : '500px', width: '90%', maxHeight: '85vh', overflow: 'auto' }} onClick={e => e.stopPropagation()}>
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
  return (<button onClick={onClick} disabled={disabled} title={title} style={{ ...styles.actionButton, backgroundColor: disabled ? '#d1d5db' : color, cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.6 : 1 }}>{children}</button>);
}

function StatBox({ title, value, color, subtitle }) {
  return (<div style={{ padding: '24px', borderRadius: '8px', backgroundColor: color, color: 'white' }}><h3 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px', opacity: 0.9 }}>{title}</h3><p style={{ fontSize: '32px', fontWeight: 'bold' }}>{value}</p>{subtitle && <p style={{ fontSize: '12px', opacity: 0.75, marginTop: '4px' }}>{subtitle}</p>}</div>);
}

function DestinationPopup({ isOpen, onClose, onSelect, title }) {
  const [selected, setSelected] = useState('');
  if (!isOpen) return null;
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title || "Select Destination"}>
      <div style={{ marginBottom: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {[{ id: 'siteIn', icon: '🏗️', label: 'Site-IN (Normal)', desc: 'Standard transfer to WH Site', color: COLORS.info },
          { id: 'hf', icon: '🔩', label: 'HF (Flanged Joint)', desc: 'Send to HF Page', color: COLORS.teal },
          { id: 'tp', icon: '📋', label: 'TP (Test Pack)', desc: 'Send to TestPack Page', color: COLORS.purple }
        ].map(opt => (
          <label key={opt.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', border: `2px solid ${selected === opt.id ? opt.color : '#e5e7eb'}`, borderRadius: '8px', cursor: 'pointer', backgroundColor: selected === opt.id ? '#f0f9ff' : 'white' }}>
            <input type="radio" name="dest" value={opt.id} checked={selected === opt.id} onChange={(e) => setSelected(e.target.value)} style={{ width: '20px', height: '20px' }} />
            <div><div style={{ fontWeight: '600', color: opt.color }}>{opt.icon} {opt.label}</div><div style={{ fontSize: '12px', color: '#6b7280' }}>{opt.desc}</div></div>
          </label>
        ))}
      </div>
      <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
        <button onClick={onClose} style={{ ...styles.button, ...styles.buttonSecondary }}>Cancel</button>
        <button onClick={() => { if(selected) onSelect(selected); }} disabled={!selected} style={{ ...styles.button, backgroundColor: selected ? COLORS.success : '#d1d5db', color: 'white' }}>Confirm</button>
      </div>
    </Modal>
  );
}

function HistoryPopup({ isOpen, onClose, componentId }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { if (isOpen && componentId) loadHistory(); }, [isOpen, componentId]);
  const loadHistory = async () => {
    setLoading(true);
    const { data } = await supabase.from('component_history').select('*').eq('component_id', componentId).order('created_at', { ascending: true });
    if (data) setHistory(data);
    setLoading(false);
  };
  if (!isOpen) return null;
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="📜 Status History" wide>
      {loading ? <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>Loading...</div> :
       history.length === 0 ? <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>No history</div> :
        <div style={{ position: 'relative', paddingLeft: '30px' }}>
          <div style={{ position: 'absolute', left: '10px', top: '10px', bottom: '10px', width: '2px', backgroundColor: '#e5e7eb' }} />
          {history.map((item, idx) => (
            <div key={idx} style={{ position: 'relative', marginBottom: '20px', paddingBottom: '20px', borderBottom: idx < history.length - 1 ? '1px dashed #e5e7eb' : 'none' }}>
              <div style={{ position: 'absolute', left: '-25px', top: '5px', width: '12px', height: '12px', borderRadius: '50%', backgroundColor: STATUS_COLORS[item.to_status] || COLORS.gray, border: '2px solid white', boxShadow: '0 0 0 2px ' + (STATUS_COLORS[item.to_status] || COLORS.gray) }} />
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontWeight: '600', marginBottom: '4px' }}>{item.action}</div>
                  <div style={{ fontSize: '13px', color: '#6b7280' }}>
                    {item.from_status && <><span style={{ ...styles.statusBadge, backgroundColor: STATUS_COLORS[item.from_status] || COLORS.gray, fontSize: '10px' }}>{item.from_status}</span><span style={{ margin: '0 8px' }}>→</span></>}
                    <span style={{ ...styles.statusBadge, backgroundColor: STATUS_COLORS[item.to_status] || COLORS.gray, fontSize: '10px' }}>{item.to_status}</span>
                  </div>
                  {item.note && <div style={{ marginTop: '8px', padding: '8px 12px', backgroundColor: '#f9fafb', borderRadius: '6px', fontSize: '13px' }}>📝 {item.note}</div>}
                </div>
                <div style={{ textAlign: 'right', fontSize: '12px', color: '#9ca3af' }}>
                  <div>{new Date(item.created_at).toLocaleDateString()}</div>
                  <div>{new Date(item.created_at).toLocaleTimeString()}</div>
                  <div style={{ marginTop: '4px', color: '#6b7280' }}>{item.performed_by_name}</div>
                </div>
              </div>
            </div>
          ))}
        </div>}
    </Modal>
  );
}

// LOGIN
function LoginScreen({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const handleLogin = async () => {
    if (!username || !password) { setError('Enter username and password'); return; }
    setLoading(true); setError('');
    try {
      const { data, error: queryError } = await supabase.from('users').select('*').eq('username', username).eq('password_hash', password).eq('is_active', true).single();
      if (queryError || !data) { setError('Invalid username or password'); } else { onLogin(data); }
    } catch (err) { setError('Connection error'); }
    setLoading(false);
  };
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f3f4f6' }}>
      <div style={{ backgroundColor: 'white', padding: '40px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', width: '100%', maxWidth: '400px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ width: '64px', height: '64px', backgroundColor: COLORS.primary, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: 'white', fontWeight: 'bold', fontSize: '20px' }}>STR</div>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937' }}>MAX STREICHER</h1>
          <p style={{ color: '#6b7280', marginTop: '4px' }}>Materials Manager V26.3</p>
        </div>
        {error && <div style={{ padding: '12px', backgroundColor: '#FEE2E2', color: '#DC2626', borderRadius: '6px', marginBottom: '16px', fontSize: '14px' }}>{error}</div>}
        <div style={{ marginBottom: '16px' }}><label style={styles.label}>Username</label><input type="text" value={username} onChange={(e) => setUsername(e.target.value)} style={styles.input} placeholder="Enter username" onKeyPress={(e) => e.key === 'Enter' && handleLogin()} /></div>
        <div style={{ marginBottom: '24px' }}><label style={styles.label}>Password</label><input type="password" value={password} onChange={(e) => setPassword(e.target.value)} style={styles.input} placeholder="Enter password" onKeyPress={(e) => e.key === 'Enter' && handleLogin()} /></div>
        <button onClick={handleLogin} disabled={loading} style={{ ...styles.button, ...styles.buttonPrimary, width: '100%', justifyContent: 'center', padding: '12px', fontSize: '16px' }}>{loading ? 'Loading...' : 'Login'}</button>
      </div>
    </div>
  );
}

// SIDEBAR
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
  ];
  const visibleItems = menuItems.filter(item => !item.perm || user.role === 'admin' || (user[item.perm] && user[item.perm] !== 'none'));
  return (
    <div style={{ ...styles.sidebar, ...(collapsed ? styles.sidebarCollapsed : {}) }}>
      <div style={styles.logo}>
        <div style={styles.logoIcon}>STR</div>
        {!collapsed && <div><h1 style={{ color: 'white', fontWeight: 'bold', fontSize: '14px' }}>MAX STREICHER</h1><p style={{ color: '#9ca3af', fontSize: '12px' }}>Materials Manager</p></div>}
        <button onClick={() => setCollapsed(!collapsed)} style={{ marginLeft: 'auto', background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer', fontSize: '18px' }}>{collapsed ? '→' : '←'}</button>
      </div>
      <nav style={styles.nav}>
        {visibleItems.map(item => (
          <div key={item.id} onClick={() => setCurrentPage(item.id)} style={{ ...styles.navItem, ...(currentPage === item.id ? styles.navItemActive : {}) }}>
            <span style={{ fontSize: '20px' }}>{item.icon}</span>
            {!collapsed && <span style={{ fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>{item.label}{badges[item.id] > 0 && <span style={{ backgroundColor: COLORS.primary, color: 'white', padding: '2px 6px', borderRadius: '10px', fontSize: '10px', fontWeight: 'bold' }}>{badges[item.id]}</span>}</span>}
          </div>
        ))}
      </nav>
      <div style={{ padding: '16px', borderTop: '1px solid #374151' }}><div style={{ ...styles.navItem, padding: '8px 16px' }}><span>🚪</span>{!collapsed && <span style={{ fontSize: '14px' }}>Logout</span>}</div></div>
    </div>
  );
}

// ============================================================
// SITE IN PAGE - English
// ============================================================
function SiteInPage({ user }) {
  const [components, setComponents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadComponents(); }, []);

  const loadComponents = async () => {
    setLoading(true);
    const { data } = await supabase.from('request_components').select(`*, requests (request_number, sub_number, sub_category, request_type)`).eq('status', 'Trans');
    if (data) setComponents(data);
    setLoading(false);
  };

  const handleReceive = async (component) => {
    try {
      await supabase.from('request_components').update({ status: 'ToCollect', current_location: 'SITE' }).eq('id', component.id);
      await supabase.rpc('increment_site_qty', { p_ident_code: component.ident_code, p_qty: component.quantity });
      await supabase.from('component_history').insert({ component_id: component.id, action: 'Received at Site', from_status: 'Trans', to_status: 'ToCollect', performed_by_user_id: user.id, performed_by_name: user.full_name, note: 'Material arrived and ready for collection' });
      await supabase.from('movements').insert({ ident_code: component.ident_code, movement_type: 'IN', quantity: component.quantity, from_location: 'YARD', to_location: 'SITE', performed_by: user.full_name });
      loadComponents();
    } catch (error) { alert('Error: ' + error.message); }
  };

  const canModify = user.role === 'admin' || user.perm_site_in === 'modify';
  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading...</div>;

  return (
    <div>
      <div style={styles.card}>
        <div style={styles.cardHeader}><h3 style={{ fontWeight: '600' }}>Site IN - Material in Transit ({components.length})</h3></div>
        <table style={styles.table}>
          <thead><tr><th style={styles.th}>Request</th><th style={styles.th}>Code</th><th style={styles.th}>Description</th><th style={styles.th}>Qty</th><th style={styles.th}>Actions</th></tr></thead>
          <tbody>
            {components.map(comp => (
              <tr key={comp.id}>
                <td style={{ ...styles.td, fontFamily: 'monospace', fontWeight: '600' }}>{String(comp.requests?.request_number).padStart(5, '0')}-{comp.requests?.sub_number}</td>
                <td style={{ ...styles.td, fontFamily: 'monospace' }}>{comp.ident_code}</td>
                <td style={styles.td}>{comp.description}</td>
                <td style={styles.td}>{comp.quantity}</td>
                <td style={styles.td}><button onClick={() => handleReceive(comp)} disabled={!canModify} style={{ ...styles.button, backgroundColor: COLORS.success, color: 'white' }}>📥 Confirm Arrival</button></td>
              </tr>
            ))}
            {components.length === 0 && <tr><td colSpan="5" style={{ ...styles.td, textAlign: 'center', color: '#9ca3af' }}>No material in transit</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ============================================================
// ENGINEERING PAGE - English, with Check Both
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
    const { data } = await supabase.from('request_components').select(`*, requests (request_number, sub_number, sub_category, request_type)`).eq('status', 'Eng');
    if (data) setComponents(data);
    setLoading(false);
  };

  const logHistory = async (compId, action, fromStatus, toStatus, note) => {
    await supabase.from('component_history').insert({ component_id: compId, action, from_status: fromStatus, to_status: toStatus, performed_by_user_id: user.id, performed_by_name: user.full_name, note });
  };

  const handleAction = async (component, action) => {
    try {
      switch (action) {
        case 'resolved':
          await supabase.from('request_components').update({ status: 'Site' }).eq('id', component.id);
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
          await supabase.from('request_components').update({ status: 'Spare' }).eq('id', component.id);
          await logHistory(component.id, 'Sent to Spare Parts', 'Eng', 'Spare', '');
          break;
        case 'mng':
          await supabase.from('request_components').update({ status: 'Mng' }).eq('id', component.id);
          await logHistory(component.id, 'Sent to Management', 'Eng', 'Mng', '');
          break;
        case 'return':
          await supabase.from('request_components').update({ status: 'Site' }).eq('id', component.id);
          await logHistory(component.id, 'Returned to Site', 'Eng', 'Site', '');
          break;
        case 'delete':
          if (confirm('Delete this component?')) {
            await supabase.from('request_components').update({ status: 'Cancelled' }).eq('id', component.id);
            await logHistory(component.id, 'Cancelled', 'Eng', 'Cancelled', '');
          }
          break;
      }
      loadComponents();
    } catch (error) { alert('Error: ' + error.message); }
  };

  const sendCheck = async () => {
    await supabase.from('request_components').update({ has_eng_check: true, eng_check_message: checkMessage, eng_check_sent_to: checkDestination }).eq('id', selectedComponent.id);
    await logHistory(selectedComponent.id, `Check sent to ${checkDestination}`, 'Eng', 'Eng', checkMessage);
    setShowCheckModal(false);
    setCheckMessage('');
    setCheckDestination('Site');
    loadComponents();
  };

  const submitPartial = async () => {
    const sendQty = parseInt(partialQty);
    const remainingQty = selectedComponent.quantity - sendQty;
    await supabase.from('request_components').update({ quantity: sendQty, status: 'Spare' }).eq('id', selectedComponent.id);
    await logHistory(selectedComponent.id, 'Partial to Spare', 'Eng', 'Spare', `Qty ${sendQty} to Spare, ${remainingQty} to Order`);
    const { data: subData } = await supabase.from('requests').select('sub_number').eq('request_number', selectedComponent.requests.request_number).order('sub_number', { ascending: false }).limit(1);
    const nextSub = (subData?.[0]?.sub_number || 0) + 1;
    const { data: newReq } = await supabase.from('requests').insert({ request_number: selectedComponent.requests.request_number, sub_number: nextSub, request_type: selectedComponent.requests.request_type, sub_category: selectedComponent.requests.sub_category }).select().single();
    await supabase.from('request_components').insert({ request_id: newReq.id, ident_code: selectedComponent.ident_code, description: selectedComponent.description, quantity: remainingQty, status: 'Order' });
    setShowPartialModal(false);
    setPartialQty('');
    loadComponents();
  };

  const canModify = user.role === 'admin' || user.perm_engineering === 'modify';
  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading...</div>;

  return (
    <div>
      <div style={styles.card}>
        <div style={styles.cardHeader}><h3 style={{ fontWeight: '600' }}>Engineering - Under Review ({components.length})</h3></div>
        <table style={styles.table}>
          <thead><tr><th style={styles.th}>Request</th><th style={styles.th}>Code</th><th style={styles.th}>Description</th><th style={styles.th}>Qty</th><th style={styles.th}>Check</th><th style={styles.th}>Actions</th></tr></thead>
          <tbody>
            {components.map(comp => (
              <tr key={comp.id}>
                <td style={{ ...styles.td, fontFamily: 'monospace', fontWeight: '600' }}>{String(comp.requests?.request_number).padStart(5, '0')}-{comp.requests?.sub_number}</td>
                <td style={{ ...styles.td, fontFamily: 'monospace' }}>{comp.ident_code}</td>
                <td style={styles.td}>{comp.description}</td>
                <td style={styles.td}>{comp.quantity}</td>
                <td style={styles.td}>{comp.has_eng_check ? <span style={{ ...styles.statusBadge, backgroundColor: COLORS.purple }}>🔍 {comp.eng_check_sent_to}</span> : '-'}</td>
                <td style={styles.td}>
                  <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                    <ActionButton color={COLORS.success} onClick={() => handleAction(comp, 'resolved')} disabled={!canModify || comp.has_eng_check} title="Resolved">✓</ActionButton>
                    <ActionButton color={COLORS.purple} onClick={() => handleAction(comp, 'check')} disabled={!canModify || comp.has_eng_check} title="Send Check">🔍</ActionButton>
                    <ActionButton color={COLORS.warning} onClick={() => handleAction(comp, 'pt')} disabled={!canModify} title="Partial">PT</ActionButton>
                    <ActionButton color={COLORS.pink} onClick={() => handleAction(comp, 'spare')} disabled={!canModify} title="Spare">Sp</ActionButton>
                    <ActionButton color={COLORS.yellow} onClick={() => handleAction(comp, 'mng')} disabled={!canModify} title="Management">Mng</ActionButton>
                    <ActionButton color={COLORS.gray} onClick={() => handleAction(comp, 'return')} disabled={!canModify} title="Return">↩</ActionButton>
                    <ActionButton color={COLORS.primary} onClick={() => handleAction(comp, 'delete')} disabled={!canModify} title="Delete">🗑️</ActionButton>
                    <ActionButton color={COLORS.gray} onClick={() => { setHistoryComponentId(comp.id); setShowHistory(true); }} title="History">ℹ️</ActionButton>
                  </div>
                </td>
              </tr>
            ))}
            {components.length === 0 && <tr><td colSpan="6" style={{ ...styles.td, textAlign: 'center', color: '#9ca3af' }}>No components in Engineering</td></tr>}
          </tbody>
        </table>
      </div>

      <Modal isOpen={showCheckModal} onClose={() => setShowCheckModal(false)} title="Send Check Request">
        <div style={{ marginBottom: '16px' }}>
          <label style={styles.label}>Send to</label>
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}><input type="radio" name="checkDest" value="Site" checked={checkDestination === 'Site'} onChange={(e) => setCheckDestination(e.target.value)} /> WH Site</label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}><input type="radio" name="checkDest" value="Yard" checked={checkDestination === 'Yard'} onChange={(e) => setCheckDestination(e.target.value)} /> WH Yard</label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', color: COLORS.teal, fontWeight: '600' }}><input type="radio" name="checkDest" value="Both" checked={checkDestination === 'Both'} onChange={(e) => setCheckDestination(e.target.value)} /> 🔄 BOTH</label>
          </div>
        </div>
        <div style={{ marginBottom: '16px' }}>
          <label style={styles.label}>Message / Instructions</label>
          <textarea value={checkMessage} onChange={(e) => setCheckMessage(e.target.value)} style={{ ...styles.input, minHeight: '80px' }} placeholder="Check position, quantity, etc..." />
        </div>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          <button onClick={() => setShowCheckModal(false)} style={{ ...styles.button, ...styles.buttonSecondary }}>Cancel</button>
          <button onClick={sendCheck} style={{ ...styles.button, backgroundColor: COLORS.purple, color: 'white' }}>Send</button>
        </div>
      </Modal>

      <Modal isOpen={showPartialModal} onClose={() => setShowPartialModal(false)} title="Split - Part to Spare">
        <p style={{ marginBottom: '16px' }}><strong>{selectedComponent?.ident_code}</strong> - Total: {selectedComponent?.quantity}</p>
        <div style={{ marginBottom: '16px' }}>
          <label style={styles.label}>Qty to Spare Parts</label>
          <input type="number" value={partialQty} onChange={(e) => setPartialQty(e.target.value)} style={styles.input} min="1" max={selectedComponent?.quantity - 1} />
          <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '6px' }}>Remainder goes to Orders</p>
        </div>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          <button onClick={() => setShowPartialModal(false)} style={{ ...styles.button, ...styles.buttonSecondary }}>Cancel</button>
          <button onClick={submitPartial} style={{ ...styles.button, backgroundColor: COLORS.warning, color: 'white' }}>Split</button>
        </div>
      </Modal>

      <HistoryPopup isOpen={showHistory} onClose={() => setShowHistory(false)} componentId={historyComponentId} />
    </div>
  );
}

// ============================================================
// HF PAGE - English
// ============================================================
function HFPage({ user }) {
  const [groups, setGroups] = useState({});
  const [loading, setLoading] = useState(true);
  const [showHistory, setShowHistory] = useState(false);
  const [historyComponentId, setHistoryComponentId] = useState(null);

  useEffect(() => { loadComponents(); }, []);

  const loadComponents = async () => {
    setLoading(true);
    const { data } = await supabase.from('request_components').select(`*, requests (request_number, sub_number, hf_number, requester_user_id)`).eq('status', 'HF');
    if (data) {
      const grouped = {};
      data.forEach(comp => {
        const reqNum = comp.requests?.request_number;
        if (!grouped[reqNum]) { grouped[reqNum] = { request_number: reqNum, hf_number: comp.requests?.hf_number, components: [] }; }
        grouped[reqNum].components.push(comp);
      });
      setGroups(grouped);
    }
    setLoading(false);
  };

  const handleDeliver = async (group, destination) => {
    const newStatus = destination === 'toSite' ? 'Trans' : 'Done';
    for (const comp of group.components) {
      await supabase.from('request_components').update({ status: newStatus }).eq('id', comp.id);
      await supabase.from('component_history').insert({ component_id: comp.id, action: destination === 'toSite' ? 'HF Complete - To Site' : 'HF Complete - Delivered', from_status: 'HF', to_status: newStatus, performed_by_user_id: user.id, performed_by_name: user.full_name, note: `HF ${group.hf_number} completed` });
      if (destination === 'delivered') {
        await supabase.from('movements').insert({ ident_code: comp.ident_code, movement_type: 'OUT', quantity: comp.quantity, from_location: 'HF', to_location: 'DELIVERED', performed_by: user.full_name, note: `HF ${group.hf_number}` });
      }
    }
    loadComponents();
  };

  const canModify = user.role === 'admin' || user.perm_wh_site === 'modify';
  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading...</div>;
  const groupList = Object.values(groups);

  return (
    <div>
      <div style={{ marginBottom: '16px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 'bold' }}>🔩 HF - Flanged Joints ({groupList.length} groups)</h2>
        <p style={{ color: '#6b7280', fontSize: '14px' }}>Complete all parts of an HF before delivery</p>
      </div>
      {groupList.length === 0 ? <div style={{ ...styles.card, padding: '40px', textAlign: 'center', color: '#9ca3af' }}>No HF components waiting</div> : (
        groupList.map(group => (
          <div key={group.request_number} style={{ ...styles.card, marginBottom: '16px' }}>
            <div style={{ ...styles.cardHeader, backgroundColor: '#D1FAE5', borderBottom: `2px solid ${COLORS.success}` }}>
              <div>
                <span style={{ fontWeight: '700', fontSize: '16px' }}>Request {String(group.request_number).padStart(5, '0')}</span>
                {group.hf_number && <span style={{ marginLeft: '12px', padding: '4px 10px', backgroundColor: COLORS.teal, color: 'white', borderRadius: '4px', fontSize: '13px' }}>HF: {group.hf_number}</span>}
                <span style={{ marginLeft: '12px', color: '#6b7280', fontSize: '14px' }}>{group.components.length} components</span>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={() => handleDeliver(group, 'toSite')} disabled={!canModify} style={{ ...styles.button, backgroundColor: COLORS.info, color: 'white' }}>🚚 Send to Site</button>
                <button onClick={() => handleDeliver(group, 'delivered')} disabled={!canModify} style={{ ...styles.button, backgroundColor: COLORS.success, color: 'white' }}>✅ Deliver</button>
              </div>
            </div>
            <table style={styles.table}>
              <thead><tr><th style={styles.th}>Sub</th><th style={styles.th}>Code</th><th style={styles.th}>Description</th><th style={styles.th}>Qty</th><th style={styles.th}>Status</th><th style={styles.th}></th></tr></thead>
              <tbody>
                {group.components.map(comp => (
                  <tr key={comp.id}>
                    <td style={{ ...styles.td, fontFamily: 'monospace' }}>-{comp.requests?.sub_number}</td>
                    <td style={{ ...styles.td, fontFamily: 'monospace' }}>{comp.ident_code}</td>
                    <td style={styles.td}>{comp.description}</td>
                    <td style={styles.td}>{comp.quantity}</td>
                    <td style={styles.td}><span style={{ ...styles.statusBadge, backgroundColor: COLORS.success }}>✅ Ready</span></td>
                    <td style={styles.td}><ActionButton color={COLORS.gray} onClick={() => { setHistoryComponentId(comp.id); setShowHistory(true); }} title="History">ℹ️</ActionButton></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))
      )}
      <HistoryPopup isOpen={showHistory} onClose={() => setShowHistory(false)} componentId={historyComponentId} />
    </div>
  );
}

// ============================================================
// TESTPACK PAGE - English
// ============================================================
function TestPackPage({ user }) {
  const [groups, setGroups] = useState({});
  const [loading, setLoading] = useState(true);
  const [showHistory, setShowHistory] = useState(false);
  const [historyComponentId, setHistoryComponentId] = useState(null);

  useEffect(() => { loadComponents(); }, []);

  const loadComponents = async () => {
    setLoading(true);
    const { data } = await supabase.from('request_components').select(`*, requests (request_number, sub_number, test_pack_number, requester_user_id, secondary_collector)`).eq('status', 'TP');
    if (data) {
      const grouped = {};
      data.forEach(comp => {
        const reqNum = comp.requests?.request_number;
        if (!grouped[reqNum]) { grouped[reqNum] = { request_number: reqNum, test_pack_number: comp.requests?.test_pack_number, components: [] }; }
        grouped[reqNum].components.push(comp);
      });
      setGroups(grouped);
    }
    setLoading(false);
  };

  const handleDeliver = async (group, destination) => {
    const newStatus = destination === 'toSite' ? 'Trans' : 'Done';
    for (const comp of group.components) {
      await supabase.from('request_components').update({ status: newStatus }).eq('id', comp.id);
      await supabase.from('component_history').insert({ component_id: comp.id, action: destination === 'toSite' ? 'TP Complete - To Site' : 'TP Complete - Delivered', from_status: 'TP', to_status: newStatus, performed_by_user_id: user.id, performed_by_name: user.full_name, note: `TestPack ${group.test_pack_number} completed` });
      if (destination === 'delivered') {
        await supabase.from('movements').insert({ ident_code: comp.ident_code, movement_type: 'OUT', quantity: comp.quantity, from_location: 'TP', to_location: 'DELIVERED', performed_by: user.full_name, note: `TP ${group.test_pack_number}` });
      }
    }
    loadComponents();
  };

  const canModify = user.role === 'admin' || user.perm_wh_site === 'modify';
  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading...</div>;
  const groupList = Object.values(groups);

  return (
    <div>
      <div style={{ marginBottom: '16px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 'bold' }}>📋 TestPack Materials ({groupList.length} groups)</h2>
        <p style={{ color: '#6b7280', fontSize: '14px' }}>Complete all parts of a TestPack before delivery</p>
      </div>
      {groupList.length === 0 ? <div style={{ ...styles.card, padding: '40px', textAlign: 'center', color: '#9ca3af' }}>No TestPack components waiting</div> : (
        groupList.map(group => (
          <div key={group.request_number} style={{ ...styles.card, marginBottom: '16px' }}>
            <div style={{ ...styles.cardHeader, backgroundColor: '#F3E8FF', borderBottom: `2px solid ${COLORS.purple}` }}>
              <div>
                <span style={{ fontWeight: '700', fontSize: '16px' }}>Request {String(group.request_number).padStart(5, '0')}</span>
                {group.test_pack_number && <span style={{ marginLeft: '12px', padding: '4px 10px', backgroundColor: COLORS.purple, color: 'white', borderRadius: '4px', fontSize: '13px' }}>TP: {group.test_pack_number}</span>}
                <span style={{ marginLeft: '12px', color: '#6b7280', fontSize: '14px' }}>{group.components.length} components</span>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={() => handleDeliver(group, 'toSite')} disabled={!canModify} style={{ ...styles.button, backgroundColor: COLORS.info, color: 'white' }}>🚚 Send to Site</button>
                <button onClick={() => handleDeliver(group, 'delivered')} disabled={!canModify} style={{ ...styles.button, backgroundColor: COLORS.success, color: 'white' }}>✅ Deliver</button>
              </div>
            </div>
            <table style={styles.table}>
              <thead><tr><th style={styles.th}>Sub</th><th style={styles.th}>Code</th><th style={styles.th}>Description</th><th style={styles.th}>Qty</th><th style={styles.th}>Status</th><th style={styles.th}></th></tr></thead>
              <tbody>
                {group.components.map(comp => (
                  <tr key={comp.id}>
                    <td style={{ ...styles.td, fontFamily: 'monospace' }}>-{comp.requests?.sub_number}</td>
                    <td style={{ ...styles.td, fontFamily: 'monospace' }}>{comp.ident_code}</td>
                    <td style={styles.td}>{comp.description}</td>
                    <td style={styles.td}>{comp.quantity}</td>
                    <td style={styles.td}><span style={{ ...styles.statusBadge, backgroundColor: COLORS.success }}>✅ Ready</span></td>
                    <td style={styles.td}><ActionButton color={COLORS.gray} onClick={() => { setHistoryComponentId(comp.id); setShowHistory(true); }} title="History">ℹ️</ActionButton></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))
      )}
      <HistoryPopup isOpen={showHistory} onClose={() => setShowHistory(false)} componentId={historyComponentId} />
    </div>
  );
}

// ============================================================
// TO BE COLLECTED PAGE - English
// ============================================================
function ToBeCollectedPage({ user }) {
  const [components, setComponents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showHistory, setShowHistory] = useState(false);
  const [historyComponentId, setHistoryComponentId] = useState(null);

  useEffect(() => { loadComponents(); }, []);

  const loadComponents = async () => {
    setLoading(true);
    const { data } = await supabase.from('request_components').select(`*, requests (request_number, sub_number, requester_user_id, secondary_collector)`).eq('status', 'ToCollect');
    if (data) setComponents(data);
    setLoading(false);
  };

  const canCollect = (comp) => {
    if (user.role === 'admin') return true;
    if (comp.requests?.requester_user_id === user.id) return true;
    if (comp.requests?.secondary_collector === user.full_name) return true;
    return false;
  };

  const handleDeliver = async (component) => {
    if (!canCollect(component)) { alert('Only the requester can collect this material!'); return; }
    try {
      await supabase.from('request_components').update({ status: 'Done' }).eq('id', component.id);
      await supabase.rpc('decrement_site_qty', { p_ident_code: component.ident_code, p_qty: component.quantity });
      await supabase.from('component_history').insert({ component_id: component.id, action: 'Delivered to Requester', from_status: 'ToCollect', to_status: 'Done', performed_by_user_id: user.id, performed_by_name: user.full_name, note: `Collected by ${user.full_name}` });
      await supabase.from('movements').insert({ ident_code: component.ident_code, movement_type: 'OUT', quantity: component.quantity, from_location: 'SITE', to_location: 'DELIVERED', performed_by: user.full_name, note: `Request ${component.requests?.request_number}-${component.requests?.sub_number}` });
      loadComponents();
    } catch (error) { alert('Error: ' + error.message); }
  };

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading...</div>;

  return (
    <div>
      <div style={{ marginBottom: '16px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 'bold' }}>✅ To Be Collected</h2>
        <p style={{ color: '#6b7280', fontSize: '14px' }}>Material ready for collection - Only the requester can collect</p>
      </div>
      <div style={styles.card}>
        <table style={styles.table}>
          <thead><tr><th style={styles.th}>Request</th><th style={styles.th}>Code</th><th style={styles.th}>Description</th><th style={styles.th}>Qty</th><th style={styles.th}>Can Collect</th><th style={styles.th}>Actions</th></tr></thead>
          <tbody>
            {components.map(comp => {
              const canDo = canCollect(comp);
              return (
                <tr key={comp.id} style={{ backgroundColor: canDo ? '#F0FDF4' : 'white' }}>
                  <td style={{ ...styles.td, fontFamily: 'monospace', fontWeight: '600' }}>{String(comp.requests?.request_number).padStart(5, '0')}-{comp.requests?.sub_number}</td>
                  <td style={{ ...styles.td, fontFamily: 'monospace' }}>{comp.ident_code}</td>
                  <td style={styles.td}>{comp.description}</td>
                  <td style={styles.td}>{comp.quantity}</td>
                  <td style={styles.td}>{canDo ? <span style={{ ...styles.statusBadge, backgroundColor: COLORS.success }}>✅ Yes</span> : <span style={{ ...styles.statusBadge, backgroundColor: COLORS.gray }}>❌ No</span>}</td>
                  <td style={styles.td}>
                    <div style={{ display: 'flex', gap: '4px' }}>
                      <button onClick={() => handleDeliver(comp)} disabled={!canDo} style={{ ...styles.button, backgroundColor: canDo ? COLORS.success : '#d1d5db', color: 'white', cursor: canDo ? 'pointer' : 'not-allowed' }}>📤 Collect</button>
                      <ActionButton color={COLORS.gray} onClick={() => { setHistoryComponentId(comp.id); setShowHistory(true); }} title="History">ℹ️</ActionButton>
                    </div>
                  </td>
                </tr>
              );
            })}
            {components.length === 0 && <tr><td colSpan="6" style={{ ...styles.td, textAlign: 'center', color: '#9ca3af' }}>No material to collect</td></tr>}
          </tbody>
        </table>
      </div>
      <HistoryPopup isOpen={showHistory} onClose={() => setShowHistory(false)} componentId={historyComponentId} />
    </div>
  );
}

// ============================================================
// MATERIAL IN PAGE - English
// ============================================================
function MaterialInPage({ user }) {
  const [orderedComponents, setOrderedComponents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showReceiveModal, setShowReceiveModal] = useState(false);
  const [selectedComponent, setSelectedComponent] = useState(null);
  const [receiveData, setReceiveData] = useState({ destination: 'YARD', tag_number: '', note: '' });

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    setLoading(true);
    const { data } = await supabase.from('request_components').select(`*, requests (request_number, sub_number)`).eq('status', 'Ordered');
    if (data) setOrderedComponents(data);
    setLoading(false);
  };

  const receiveComponent = async () => {
    try {
      const dest = receiveData.destination;
      await supabase.from('request_components').update({ status: dest === 'YARD' ? 'Yard' : 'Site', current_location: dest, tag_number: receiveData.tag_number || null }).eq('id', selectedComponent.id);
      if (dest === 'YARD') await supabase.rpc('increment_yard_qty', { p_ident_code: selectedComponent.ident_code, p_qty: selectedComponent.quantity });
      else await supabase.rpc('increment_site_qty', { p_ident_code: selectedComponent.ident_code, p_qty: selectedComponent.quantity });
      await supabase.from('component_history').insert({ component_id: selectedComponent.id, action: 'Order Received', from_status: 'Ordered', to_status: dest === 'YARD' ? 'Yard' : 'Site', performed_by_user_id: user.id, performed_by_name: user.full_name, note: receiveData.note });
      await supabase.from('movements').insert({ ident_code: selectedComponent.ident_code, movement_type: 'IN', quantity: selectedComponent.quantity, from_location: 'SUPPLIER', to_location: dest, performed_by: user.full_name, note: receiveData.note || 'Order received' });
      setShowReceiveModal(false);
      loadData();
    } catch (error) { alert('Error: ' + error.message); }
  };

  const canModify = user.role === 'admin' || user.perm_material_in === 'modify';
  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading...</div>;

  return (
    <div>
      <div style={styles.card}>
        <div style={styles.cardHeader}><h3 style={{ fontWeight: '600' }}>Material IN - Ordered Waiting ({orderedComponents.length})</h3></div>
        <table style={styles.table}>
          <thead><tr><th style={styles.th}>Request</th><th style={styles.th}>Code</th><th style={styles.th}>Description</th><th style={styles.th}>Qty</th><th style={styles.th}>Order Date</th><th style={styles.th}>Expected</th><th style={styles.th}>Actions</th></tr></thead>
          <tbody>
            {orderedComponents.map(comp => (
              <tr key={comp.id}>
                <td style={{ ...styles.td, fontFamily: 'monospace', fontWeight: '600' }}>{String(comp.requests?.request_number).padStart(5, '0')}-{comp.requests?.sub_number}</td>
                <td style={{ ...styles.td, fontFamily: 'monospace' }}>{comp.ident_code}</td>
                <td style={styles.td}>{comp.description}</td>
                <td style={styles.td}>{comp.quantity}</td>
                <td style={styles.td}>{comp.order_date ? new Date(comp.order_date).toLocaleDateString() : '-'}</td>
                <td style={styles.td}>{comp.order_forecast ? new Date(comp.order_forecast).toLocaleDateString() : '-'}</td>
                <td style={styles.td}><button onClick={() => { setSelectedComponent(comp); setReceiveData({ destination: 'YARD', tag_number: '', note: '' }); setShowReceiveModal(true); }} disabled={!canModify} style={{ ...styles.button, backgroundColor: COLORS.success, color: 'white' }}>📥 Receive</button></td>
              </tr>
            ))}
            {orderedComponents.length === 0 && <tr><td colSpan="7" style={{ ...styles.td, textAlign: 'center', color: '#9ca3af' }}>No orders waiting</td></tr>}
          </tbody>
        </table>
      </div>

      <Modal isOpen={showReceiveModal} onClose={() => setShowReceiveModal(false)} title="Receive Material">
        <p style={{ marginBottom: '16px' }}><strong>Code:</strong> {selectedComponent?.ident_code} | <strong>Qty:</strong> {selectedComponent?.quantity}</p>
        <div style={{ marginBottom: '16px' }}>
          <label style={styles.label}>Destination</label>
          <div style={{ display: 'flex', gap: '16px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}><input type="radio" value="YARD" checked={receiveData.destination === 'YARD'} onChange={(e) => setReceiveData({...receiveData, destination: e.target.value})} /> WH Yard</label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}><input type="radio" value="SITE" checked={receiveData.destination === 'SITE'} onChange={(e) => setReceiveData({...receiveData, destination: e.target.value})} /> WH Site</label>
          </div>
        </div>
        <div style={{ marginBottom: '16px' }}><label style={styles.label}>Tag (optional)</label><input type="text" value={receiveData.tag_number} onChange={(e) => setReceiveData({...receiveData, tag_number: e.target.value})} style={styles.input} /></div>
        <div style={{ marginBottom: '16px' }}><label style={styles.label}>Note</label><textarea value={receiveData.note} onChange={(e) => setReceiveData({...receiveData, note: e.target.value})} style={{ ...styles.input, minHeight: '60px' }} /></div>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          <button onClick={() => setShowReceiveModal(false)} style={{ ...styles.button, ...styles.buttonSecondary }}>Cancel</button>
          <button onClick={receiveComponent} style={{ ...styles.button, backgroundColor: COLORS.success, color: 'white' }}>Confirm</button>
        </div>
      </Modal>
    </div>
  );
}

// ============================================================
// SPARE PARTS PAGE - English
// ============================================================
function SparePartsPage({ user }) {
  const [components, setComponents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadComponents(); }, []);
  const loadComponents = async () => { setLoading(true); const { data } = await supabase.from('request_components').select(`*, requests (request_number, sub_number)`).eq('status', 'Spare'); if (data) setComponents(data); setLoading(false); };

  const handleAction = async (component, orderType) => {
    await supabase.from('request_components').update({ status: 'Order', order_type: orderType }).eq('id', component.id);
    await supabase.from('component_history').insert({ component_id: component.id, action: `Sent to ${orderType} Order`, from_status: 'Spare', to_status: 'Order', performed_by_user_id: user.id, performed_by_name: user.full_name });
    loadComponents();
  };

  const canModify = user.role === 'admin' || user.perm_spare_parts === 'modify';
  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading...</div>;

  return (
    <div>
      <div style={styles.card}>
        <div style={styles.cardHeader}><h3 style={{ fontWeight: '600' }}>Spare Parts ({components.length})</h3></div>
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
// ORDERS PAGE - English
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
  const loadData = async () => { setLoading(true); const { data: toOrder } = await supabase.from('request_components').select(`*, requests (request_number, sub_number)`).eq('status', 'Order'); const { data: ordered } = await supabase.from('request_components').select(`*, requests (request_number, sub_number)`).eq('status', 'Ordered'); const { data: log } = await supabase.from('order_log').select('*').order('created_at', { ascending: false }).limit(50); if (toOrder) setToOrderComponents(toOrder); if (ordered) setOrderedComponents(ordered); if (log) setOrderLog(log); setLoading(false); };

  const submitOrder = async () => {
    await supabase.from('request_components').update({ status: 'Ordered', order_date: orderDate, order_forecast: expectedDate || null }).eq('id', selectedComponent.id);
    await supabase.from('order_log').insert({ ident_code: selectedComponent.ident_code, quantity: selectedComponent.quantity, order_type: selectedComponent.order_type || 'Internal', order_date: orderDate, expected_date: expectedDate || null, ordered_by: user.full_name });
    await supabase.from('component_history').insert({ component_id: selectedComponent.id, action: 'Order Placed', from_status: 'Order', to_status: 'Ordered', performed_by_user_id: user.id, performed_by_name: user.full_name, note: `Expected: ${expectedDate || 'TBD'}` });
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
            <thead><tr><th style={styles.th}>Request</th><th style={styles.th}>Code</th><th style={styles.th}>Qty</th><th style={styles.th}>Type</th><th style={styles.th}>Actions</th></tr></thead>
            <tbody>
              {toOrderComponents.map(comp => (
                <tr key={comp.id}>
                  <td style={{ ...styles.td, fontFamily: 'monospace', fontWeight: '600' }}>{String(comp.requests?.request_number).padStart(5, '0')}-{comp.requests?.sub_number}</td>
                  <td style={{ ...styles.td, fontFamily: 'monospace' }}>{comp.ident_code}</td>
                  <td style={styles.td}>{comp.quantity}</td>
                  <td style={styles.td}><span style={{ ...styles.statusBadge, backgroundColor: comp.order_type === 'Client' ? COLORS.cyan : COLORS.info }}>{comp.order_type || 'Internal'}</span></td>
                  <td style={styles.td}><button onClick={() => { setSelectedComponent(comp); setOrderDate(new Date().toISOString().split('T')[0]); setExpectedDate(''); setShowOrderModal(true); }} disabled={!canModify} style={{ ...styles.button, backgroundColor: COLORS.success, color: 'white' }}>🛒 Place Order</button></td>
                </tr>
              ))}
              {toOrderComponents.length === 0 && <tr><td colSpan="5" style={{ ...styles.td, textAlign: 'center', color: '#9ca3af' }}>No orders</td></tr>}
            </tbody>
          </table>
        )}
        {activeTab === 'ordered' && (
          <table style={styles.table}>
            <thead><tr><th style={styles.th}>Request</th><th style={styles.th}>Code</th><th style={styles.th}>Qty</th><th style={styles.th}>Order Date</th><th style={styles.th}>Expected</th></tr></thead>
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
            <thead><tr><th style={styles.th}>Date</th><th style={styles.th}>Code</th><th style={styles.th}>Qty</th><th style={styles.th}>Type</th><th style={styles.th}>Ordered by</th></tr></thead>
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
        <div style={{ marginBottom: '16px' }}><label style={styles.label}>Expected Delivery Date</label><input type="date" value={expectedDate} onChange={(e) => setExpectedDate(e.target.value)} style={styles.input} /></div>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          <button onClick={() => setShowOrderModal(false)} style={{ ...styles.button, ...styles.buttonSecondary }}>Cancel</button>
          <button onClick={submitOrder} style={{ ...styles.button, backgroundColor: COLORS.success, color: 'white' }}>Confirm</button>
        </div>
      </Modal>
    </div>
  );
}

// ============================================================
// MANAGEMENT PAGE - English
// ============================================================
function ManagementPage({ user }) {
  const [components, setComponents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadComponents(); }, []);
  const loadComponents = async () => { setLoading(true); const { data } = await supabase.from('request_components').select(`*, requests (request_number, sub_number)`).eq('status', 'Mng'); if (data) setComponents(data); setLoading(false); };

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
// LOG PAGE - English
// ============================================================
function LogPage({ user }) {
  const [movements, setMovements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newMovement, setNewMovement] = useState({ ident_code: '', movement_type: 'IN', quantity: '', from_location: '', to_location: '', note: '' });
  const [allIdents, setAllIdents] = useState([]);

  useEffect(() => { loadData(); }, []);
  const loadData = async () => { setLoading(true); const { data: movData } = await supabase.from('movements').select('*').order('created_at', { ascending: false }).limit(200); if (movData) setMovements(movData); const { data: identData } = await supabase.from('inventory').select('ident_code').order('ident_code'); if (identData) setAllIdents(identData.map(i => i.ident_code)); setLoading(false); };

  const addMovement = async () => {
    if (!newMovement.ident_code || !newMovement.quantity) { alert('Code and Quantity required'); return; }
    await supabase.from('movements').insert({ ...newMovement, quantity: parseInt(newMovement.quantity), performed_by: user.full_name });
    const qty = parseInt(newMovement.quantity);
    if (newMovement.movement_type === 'IN') {
      if (newMovement.to_location === 'YARD') await supabase.rpc('increment_yard_qty', { p_ident_code: newMovement.ident_code, p_qty: qty });
      else if (newMovement.to_location === 'SITE') await supabase.rpc('increment_site_qty', { p_ident_code: newMovement.ident_code, p_qty: qty });
    } else if (newMovement.movement_type === 'OUT') {
      if (newMovement.from_location === 'YARD') await supabase.rpc('decrement_yard_qty', { p_ident_code: newMovement.ident_code, p_qty: qty });
      else if (newMovement.from_location === 'SITE') await supabase.rpc('decrement_site_qty', { p_ident_code: newMovement.ident_code, p_qty: qty });
    }
    setShowAddModal(false);
    setNewMovement({ ident_code: '', movement_type: 'IN', quantity: '', from_location: '', to_location: '', note: '' });
    loadData();
  };

  const exportCSV = () => {
    const headers = ['Date', 'Type', 'Code', 'Qty', 'From', 'To', 'Operator', 'Note'];
    const rows = movements.map(m => [new Date(m.created_at).toLocaleString(), m.movement_type, m.ident_code, m.quantity, m.from_location, m.to_location, m.performed_by, m.note || '']);
    const csv = [headers.join(','), ...rows.map(r => r.map(c => `"${c}"`).join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `movements_${new Date().toISOString().split('T')[0]}.csv`; a.click();
  };

  const canModify = user.role === 'admin' || user.perm_movements === 'modify';
  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading...</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginBottom: '16px' }}>
        <button onClick={exportCSV} style={{ ...styles.button, ...styles.buttonSecondary }}>📥 Export CSV</button>
        <button onClick={() => setShowAddModal(true)} disabled={!canModify} style={{ ...styles.button, ...styles.buttonPrimary }}>+ Add Movement</button>
      </div>
      <div style={styles.card}>
        <div style={styles.cardHeader}><h3 style={{ fontWeight: '600' }}>Movement Log ({movements.length})</h3></div>
        <table style={styles.table}>
          <thead><tr><th style={styles.th}>Date</th><th style={styles.th}>Type</th><th style={styles.th}>Code</th><th style={styles.th}>Qty</th><th style={styles.th}>From → To</th><th style={styles.th}>Operator</th><th style={styles.th}>Note</th></tr></thead>
          <tbody>
            {movements.map((mov, idx) => (
              <tr key={idx}>
                <td style={styles.td}>{new Date(mov.created_at).toLocaleString()}</td>
                <td style={styles.td}><span style={{ ...styles.statusBadge, backgroundColor: mov.movement_type === 'IN' ? COLORS.success : mov.movement_type === 'OUT' ? COLORS.primary : mov.movement_type === 'LOST' ? COLORS.orange : mov.movement_type === 'BROKEN' ? COLORS.purple : COLORS.info }}>{mov.movement_type}</span></td>
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

      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="+ Add Movement">
        <div style={{ marginBottom: '16px' }}><label style={styles.label}>Ident Code *</label><input type="text" list="ident-list" value={newMovement.ident_code} onChange={(e) => setNewMovement({ ...newMovement, ident_code: e.target.value })} style={styles.input} placeholder="Search code..." /><datalist id="ident-list">{allIdents.slice(0,100).map(i => <option key={i} value={i} />)}</datalist></div>
        <div style={{ marginBottom: '16px' }}><label style={styles.label}>Movement Type *</label><select value={newMovement.movement_type} onChange={(e) => setNewMovement({ ...newMovement, movement_type: e.target.value })} style={styles.select}>{MOVEMENT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}</select></div>
        <div style={{ marginBottom: '16px' }}><label style={styles.label}>Quantity *</label><input type="number" value={newMovement.quantity} onChange={(e) => setNewMovement({ ...newMovement, quantity: e.target.value })} style={styles.input} min="1" /></div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
          <div><label style={styles.label}>From</label><input type="text" value={newMovement.from_location} onChange={(e) => setNewMovement({ ...newMovement, from_location: e.target.value })} style={styles.input} placeholder="YARD, SITE, SUPPLIER..." /></div>
          <div><label style={styles.label}>To</label><input type="text" value={newMovement.to_location} onChange={(e) => setNewMovement({ ...newMovement, to_location: e.target.value })} style={styles.input} placeholder="YARD, SITE, DELIVERED..." /></div>
        </div>
        <div style={{ marginBottom: '16px' }}><label style={styles.label}>Note</label><textarea value={newMovement.note} onChange={(e) => setNewMovement({ ...newMovement, note: e.target.value })} style={{ ...styles.input, minHeight: '60px' }} /></div>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          <button onClick={() => setShowAddModal(false)} style={{ ...styles.button, ...styles.buttonSecondary }}>Cancel</button>
          <button onClick={addMovement} style={{ ...styles.button, ...styles.buttonPrimary }}>Add</button>
        </div>
      </Modal>
    </div>
  );
}

// ============================================================
// DATABASE PAGE - English
// ============================================================
function DatabasePage({ user }) {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showBalanceModal, setShowBalanceModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [balanceData, setBalanceData] = useState({ yard_qty: '', site_qty: '', lost_qty: '', broken_qty: '' });

  useEffect(() => { loadInventory(); }, []);
  const loadInventory = async () => { setLoading(true); const { data } = await supabase.from('inventory').select('*').order('ident_code'); if (data) setInventory(data); setLoading(false); };

  const filteredInventory = inventory.filter(item => item.ident_code?.toLowerCase().includes(searchTerm.toLowerCase()) || item.description?.toLowerCase().includes(searchTerm.toLowerCase()));

  const saveBalance = async () => {
    await supabase.from('inventory').update({ yard_qty: parseInt(balanceData.yard_qty) || 0, site_qty: parseInt(balanceData.site_qty) || 0, lost_qty: parseInt(balanceData.lost_qty) || 0, broken_qty: parseInt(balanceData.broken_qty) || 0 }).eq('ident_code', selectedItem.ident_code);
    await supabase.from('movements').insert({ ident_code: selectedItem.ident_code, movement_type: 'BAL', quantity: 0, from_location: 'BALANCE', to_location: 'BALANCE', performed_by: user.full_name, note: `Manual balance: Y=${balanceData.yard_qty}, S=${balanceData.site_qty}, L=${balanceData.lost_qty}, B=${balanceData.broken_qty}` });
    setShowBalanceModal(false);
    loadInventory();
  };

  const exportCSV = () => {
    const headers = ['Ident Code', 'Description', 'YARD', 'SITE', 'LOST', 'BROKEN', 'TOTAL', 'Record Out'];
    const rows = filteredInventory.map(i => [i.ident_code, i.description, i.yard_qty || 0, i.site_qty || 0, i.lost_qty || 0, i.broken_qty || 0, (i.yard_qty || 0) + (i.site_qty || 0) + (i.lost_qty || 0) + (i.broken_qty || 0), i.record_out || 0]);
    const csv = [headers.join(','), ...rows.map(r => r.map(c => `"${c}"`).join(','))].join('\n');
    const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' })); a.download = `inventory_${new Date().toISOString().split('T')[0]}.csv`; a.click();
  };

  const canModify = user.role === 'admin' || user.perm_database === 'modify';
  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading...</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
        <input type="text" placeholder="🔍 Search code or description..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{ ...styles.input, maxWidth: '400px' }} />
        <button onClick={exportCSV} style={{ ...styles.button, ...styles.buttonSecondary }}>📥 Export CSV</button>
      </div>
      <div style={styles.card}>
        <div style={styles.cardHeader}><h3 style={{ fontWeight: '600' }}>Inventory Database ({filteredInventory.length})</h3></div>
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
                <th style={{ ...styles.th, textAlign: 'center' }}>TOTAL</th>
                <th style={{ ...styles.th, backgroundColor: COLORS.success, color: 'white', textAlign: 'center' }}>Collected</th>
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
                    <td style={styles.td}><ActionButton color={COLORS.info} onClick={() => { setSelectedItem(item); setBalanceData({ yard_qty: item.yard_qty || 0, site_qty: item.site_qty || 0, lost_qty: item.lost_qty || 0, broken_qty: item.broken_qty || 0 }); setShowBalanceModal(true); }} disabled={!canModify} title="Balance">⚖️</ActionButton></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={showBalanceModal} onClose={() => setShowBalanceModal(false)} title="⚖️ Manual Balance">
        <p style={{ marginBottom: '16px' }}><strong>{selectedItem?.ident_code}</strong></p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
          <div><label style={{ ...styles.label, color: COLORS.secondary }}>YARD</label><input type="number" value={balanceData.yard_qty} onChange={(e) => setBalanceData({ ...balanceData, yard_qty: e.target.value })} style={styles.input} min="0" /></div>
          <div><label style={{ ...styles.label, color: COLORS.info }}>SITE</label><input type="number" value={balanceData.site_qty} onChange={(e) => setBalanceData({ ...balanceData, site_qty: e.target.value })} style={styles.input} min="0" /></div>
          <div><label style={{ ...styles.label, color: COLORS.orange }}>LOST</label><input type="number" value={balanceData.lost_qty} onChange={(e) => setBalanceData({ ...balanceData, lost_qty: e.target.value })} style={styles.input} min="0" /></div>
          <div><label style={{ ...styles.label, color: COLORS.purple }}>BROKEN</label><input type="number" value={balanceData.broken_qty} onChange={(e) => setBalanceData({ ...balanceData, broken_qty: e.target.value })} style={styles.input} min="0" /></div>
        </div>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          <button onClick={() => setShowBalanceModal(false)} style={{ ...styles.button, ...styles.buttonSecondary }}>Cancel</button>
          <button onClick={saveBalance} style={{ ...styles.button, ...styles.buttonPrimary }}>Save</button>
        </div>
      </Modal>
    </div>
  );
}

// ============================================================
// DASHBOARD
// ============================================================
function Dashboard({ user }) {
  const [stats, setStats] = useState({ yard: 0, site: 0, lost: 0, broken: 0, activeRequests: 0, pendingEng: 0, toOrder: 0, toCollect: 0 });
  const [movements, setMovements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadDashboard(); }, []);

  const loadDashboard = async () => {
    const { data: invData } = await supabase.from('inventory').select('yard_qty, site_qty, lost_qty, broken_qty');
    if (invData) {
      setStats(prev => ({
        ...prev,
        yard: invData.reduce((sum, i) => sum + (i.yard_qty || 0), 0),
        site: invData.reduce((sum, i) => sum + (i.site_qty || 0), 0),
        lost: invData.reduce((sum, i) => sum + (i.lost_qty || 0), 0),
        broken: invData.reduce((sum, i) => sum + (i.broken_qty || 0), 0)
      }));
    }
    const { data: siteData } = await supabase.from('request_components').select('id').eq('status', 'Site');
    const { data: engData } = await supabase.from('request_components').select('id').eq('status', 'Eng');
    const { data: orderData } = await supabase.from('request_components').select('id').eq('status', 'Order');
    const { data: collectData } = await supabase.from('request_components').select('id').eq('status', 'ToCollect');
    setStats(prev => ({ ...prev, activeRequests: siteData?.length || 0, pendingEng: engData?.length || 0, toOrder: orderData?.length || 0, toCollect: collectData?.length || 0 }));
    const { data: movData } = await supabase.from('movements').select('*').order('created_at', { ascending: false }).limit(5);
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
        <div style={{ ...styles.card, padding: '24px' }}><h3 style={{ color: '#6b7280', fontSize: '14px', marginBottom: '8px' }}>Active @ Site</h3><p style={{ fontSize: '32px', fontWeight: 'bold', color: COLORS.info }}>{stats.activeRequests}</p></div>
        <div style={{ ...styles.card, padding: '24px' }}><h3 style={{ color: '#6b7280', fontSize: '14px', marginBottom: '8px' }}>Pending Engineering</h3><p style={{ fontSize: '32px', fontWeight: 'bold', color: COLORS.purple }}>{stats.pendingEng}</p></div>
        <div style={{ ...styles.card, padding: '24px' }}><h3 style={{ color: '#6b7280', fontSize: '14px', marginBottom: '8px' }}>To Order</h3><p style={{ fontSize: '32px', fontWeight: 'bold', color: COLORS.warning }}>{stats.toOrder}</p></div>
        <div style={{ ...styles.card, padding: '24px' }}><h3 style={{ color: '#6b7280', fontSize: '14px', marginBottom: '8px' }}>To Collect</h3><p style={{ fontSize: '32px', fontWeight: 'bold', color: COLORS.success }}>{stats.toCollect}</p></div>
      </div>
      <div style={styles.card}>
        <div style={styles.cardHeader}><h3 style={{ fontWeight: '600' }}>Recent Movements</h3></div>
        <table style={styles.table}>
          <thead><tr><th style={styles.th}>Date</th><th style={styles.th}>Type</th><th style={styles.th}>Code</th><th style={styles.th}>Qty</th><th style={styles.th}>From → To</th></tr></thead>
          <tbody>
            {movements.map((mov, idx) => (
              <tr key={idx}>
                <td style={styles.td}>{new Date(mov.created_at).toLocaleDateString()}</td>
                <td style={styles.td}><span style={{ ...styles.statusBadge, backgroundColor: mov.movement_type === 'IN' ? COLORS.success : mov.movement_type === 'OUT' ? COLORS.primary : mov.movement_type === 'LOST' ? COLORS.orange : COLORS.purple }}>{mov.movement_type}</span></td>
                <td style={{ ...styles.td, fontFamily: 'monospace' }}>{mov.ident_code}</td>
                <td style={styles.td}>{mov.quantity}</td>
                <td style={styles.td}>{mov.from_location} → {mov.to_location}</td>
              </tr>
            ))}
            {movements.length === 0 && <tr><td colSpan="5" style={{ ...styles.td, textAlign: 'center', color: '#9ca3af' }}>No movements</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ============================================================
// REQUESTS PAGE - FIXED: ISO autocomplete, Ident autocomplete by ISO, TestPack spool autocomplete
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
  
  // FIXED: All autocomplete options
  const [allIsoNumbers, setAllIsoNumbers] = useState([]);
  const [filteredIsoOptions, setFilteredIsoOptions] = useState([]);
  const [spoolOptions, setSpoolOptions] = useState([]);
  const [filteredSpoolOptions, setFilteredSpoolOptions] = useState([]);
  const [identOptions, setIdentOptions] = useState([]);
  const [filteredIdentOptions, setFilteredIdentOptions] = useState([]);
  const [tagOptions, setTagOptions] = useState([]);
  
  const [nextNumber, setNextNumber] = useState(1);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [overQuantityWarning, setOverQuantityWarning] = useState(null);
  const [projectQtyExhausted, setProjectQtyExhausted] = useState(false);
  const [hfError, setHfError] = useState(null);
  const [secondaryCollector, setSecondaryCollector] = useState('');
  const [allUsers, setAllUsers] = useState([]);

  // Load initial data
  useEffect(() => {
    loadAllIsoNumbers();
    loadNextNumber();
    loadUsers();
  }, []);

  const loadNextNumber = async () => {
    const { data } = await supabase.from('counters').select('value').eq('id', 'request_number').single();
    if (data) setNextNumber(data.value + 1);
  };

  // FIXED: Load ALL ISO numbers at once for autocomplete
  const loadAllIsoNumbers = async () => {
    const { data } = await supabase.from('project_materials').select('iso_number').order('iso_number');
    if (data) {
      const unique = [...new Set(data.map(d => d.iso_number).filter(Boolean))];
      setAllIsoNumbers(unique);
      setFilteredIsoOptions(unique.slice(0, 50)); // Show first 50 initially
    }
  };

  const loadUsers = async () => {
    const { data } = await supabase.from('users').select('id, username, full_name, badge_number').eq('is_active', true).order('full_name');
    if (data) setAllUsers(data);
  };

  // FIXED: Filter ISO as user types
  const handleIsoInput = (value) => {
    setIsoNumber(value);
    if (value.length >= 2) {
      const filtered = allIsoNumbers.filter(iso => iso.toLowerCase().includes(value.toLowerCase()));
      setFilteredIsoOptions(filtered.slice(0, 50));
    } else {
      setFilteredIsoOptions(allIsoNumbers.slice(0, 50));
    }
    // Reset downstream
    setSpoolNumber('');
    setSpoolOptions([]);
    setIdentOptions([]);
    setTagOptions([]);
    setOverQuantityWarning(null);
    setProjectQtyExhausted(false);
  };

  // FIXED: Load spools when ISO is selected (onBlur or selection)
  const handleIsoSelect = async (iso) => {
    setIsoNumber(iso);
    if (iso) {
      const { data } = await supabase.from('project_materials').select('full_spool_number').eq('iso_number', iso).order('full_spool_number');
      if (data) {
        const unique = [...new Set(data.map(d => d.full_spool_number).filter(Boolean))];
        setSpoolOptions(unique);
        setFilteredSpoolOptions(unique.slice(0, 50));
      }
    }
  };

  // FIXED: Filter spools as user types
  const handleSpoolInput = (value) => {
    setSpoolNumber(value);
    if (value.length >= 2 && spoolOptions.length > 0) {
      const filtered = spoolOptions.filter(s => s.toLowerCase().includes(value.toLowerCase()));
      setFilteredSpoolOptions(filtered.slice(0, 50));
    } else {
      setFilteredSpoolOptions(spoolOptions.slice(0, 50));
    }
    // Reset downstream
    setIdentOptions([]);
    setTagOptions([]);
    setOverQuantityWarning(null);
    setProjectQtyExhausted(false);
  };

  // FIXED: Load idents when spool is selected
  const handleSpoolSelect = async (spool) => {
    setSpoolNumber(spool);
    if (spool) {
      const { data } = await supabase.from('project_materials').select('ident_code, tag_number, description, pos_qty, uom').eq('full_spool_number', spool);
      if (data) {
        const mapped = data.map(d => ({ ident_code: d.ident_code, tag: d.tag_number || '', description: d.description, pos_qty: d.pos_qty || 0, uom: d.uom }));
        setIdentOptions(mapped);
        setFilteredIdentOptions([...new Set(mapped.map(m => m.ident_code))].slice(0, 50));
      }
    }
  };

  // FIXED: Filter idents as user types
  const handleIdentInput = (value) => {
    setCurrentMaterial({ ...currentMaterial, ident_code: value, tag: '' });
    if (value.length >= 2 && identOptions.length > 0) {
      const filtered = [...new Set(identOptions.map(o => o.ident_code))].filter(i => i.toLowerCase().includes(value.toLowerCase()));
      setFilteredIdentOptions(filtered.slice(0, 50));
    } else {
      setFilteredIdentOptions([...new Set(identOptions.map(o => o.ident_code))].slice(0, 50));
    }
    setTagOptions([]);
  };

  // Load tags for selected ident
  const handleIdentSelect = async (identCode) => {
    setCurrentMaterial({ ...currentMaterial, ident_code: identCode, tag: '' });
    if (identCode) {
      const { data } = await supabase.from('project_materials').select('tag_number').eq('ident_code', identCode).not('tag_number', 'is', null);
      if (data) {
        const unique = [...new Set(data.map(d => d.tag_number).filter(Boolean))];
        setTagOptions(unique);
      } else {
        setTagOptions([]);
      }
    }
    setOverQuantityWarning(null);
    setProjectQtyExhausted(false);
  };

  // HF duplicate check with date and person
  const checkHfDuplicate = async (hf) => {
    if (!hf) { setHfError(null); return false; }
    const { data } = await supabase.from('requests').select('id, request_number, created_at, requester_user_id').eq('hf_number', hf).neq('status', 'Cancelled');
    if (data && data.length > 0) {
      const { data: userData } = await supabase.from('users').select('full_name').eq('id', data[0].requester_user_id).single();
      setHfError({
        message: `HF "${hf}" already requested`,
        request: String(data[0].request_number).padStart(5, '0'),
        date: new Date(data[0].created_at).toLocaleDateString(),
        person: userData?.full_name || 'Unknown'
      });
      return true;
    }
    setHfError(null);
    return false;
  };

  const handleHfChange = async (value) => {
    setHfNumber(value);
    if (value.length >= 2) await checkHfDuplicate(value);
    else setHfError(null);
  };

  // Check project qty vs record_out
  const checkProjectQtyAvailable = async (identCode, requestedQty) => {
    if (!identCode) return true;
    const { data: projData } = await supabase.from('project_materials').select('pos_qty').eq('ident_code', identCode);
    const projectQty = projData?.reduce((sum, d) => sum + (d.pos_qty || 0), 0) || 0;
    const { data: invData } = await supabase.from('inventory').select('record_out').eq('ident_code', identCode).single();
    const recordOut = invData?.record_out || 0;
    const { data: reqData } = await supabase.from('request_components').select('quantity').eq('ident_code', identCode).not('status', 'in', '("Done","Cancelled")');
    const alreadyRequested = reqData?.reduce((sum, d) => sum + (d.quantity || 0), 0) || 0;
    const available = projectQty - recordOut - alreadyRequested;
    if (available <= 0) {
      setProjectQtyExhausted(true);
      setOverQuantityWarning({ ident_code: identCode, projectQty, recordOut, alreadyRequested, available: 0 });
      return false;
    } else if (parseInt(requestedQty || 0) > available) {
      setProjectQtyExhausted(false);
      setOverQuantityWarning({ ident_code: identCode, projectQty, recordOut, alreadyRequested, available, totalRequested: alreadyRequested + parseInt(requestedQty || 0) });
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
    setIdentOptions([]);
    setHfNumber('');
    setHfError(null);
    setDescription('');
    setTestPackNumber('');
    setMaterials([]);
    setOverQuantityWarning(null);
    setProjectQtyExhausted(false);
    setSecondaryCollector('');
  };

  const addMaterial = async () => {
    if (!currentMaterial.ident_code || !currentMaterial.qty) return;
    if (requestType === 'Piping') await checkProjectQtyAvailable(currentMaterial.ident_code, currentMaterial.qty);
    const selected = identOptions.find(o => o.ident_code === currentMaterial.ident_code);
    setMaterials([...materials, { ident_code: currentMaterial.ident_code, tag: currentMaterial.tag, description: selected?.description || '', qty: currentMaterial.qty, pos_qty: selected?.pos_qty || 0 }]);
    setCurrentMaterial({ ident_code: '', tag: '', qty: '' });
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
      if (requestType === 'Piping') {
        if (!isoNumber) throw new Error('ISO Number required');
        if (!spoolNumber) throw new Error('Full Spool Number required');
        if (subCategory === 'Erection' && !hfNumber) throw new Error('HF Number required for Erection');
        if (subCategory === 'Erection' && hfError) throw new Error('Cannot create request with duplicate HF');
        if (materials.length === 0) throw new Error('Add at least one material');
      }
      if (requestType === 'Mechanical' && !description) throw new Error('Description required');
      if (requestType === 'TestPack') {
        if (!testPackNumber) throw new Error('Test Pack Number required');
        if (missingType === 'Material' && materials.length === 0) throw new Error('Add at least one material');
      }

      const { data: counterData } = await supabase.rpc('get_next_request_number');
      const reqNumber = counterData || nextNumber;

      const { data: request, error: reqError } = await supabase.from('requests').insert({
        request_number: reqNumber, sub_number: 0, requester_user_id: user.id,
        request_type: requestType, sub_category: requestType === 'Piping' ? subCategory : null,
        iso_number: requestType !== 'TestPack' ? (isoNumber || null) : null,
        full_spool_number: requestType !== 'TestPack' ? (spoolNumber || null) : null,
        hf_number: (requestType === 'Piping' && subCategory === 'Erection') ? (hfNumber || null) : null,
        test_pack_number: requestType === 'TestPack' ? testPackNumber : null,
        missing_type: requestType === 'TestPack' ? missingType : null,
        secondary_collector: requestType === 'TestPack' ? (secondaryCollector || null) : null,
        description: description || null
      }).select().single();

      if (reqError) throw reqError;

      let status = destination === 'site' ? 'Site' : destination === 'yard' ? 'Yard' : 'Eng';

      if (requestType === 'Mechanical') {
        await supabase.from('request_components').insert({ request_id: request.id, ident_code: 'MECHANICAL', description: description, quantity: 1, status: status, current_location: destination === 'yard' ? 'YARD' : 'SITE' });
      } else {
        for (const mat of materials) {
          const { data: comp } = await supabase.from('request_components').insert({
            request_id: request.id, ident_code: mat.ident_code, tag: mat.tag || null,
            iso_number: requestType === 'Piping' ? isoNumber : null,
            full_spool_number: requestType === 'Piping' ? spoolNumber : null,
            tag_number: mat.tag || null, description: mat.description,
            quantity: parseInt(mat.qty), status: status, current_location: destination === 'yard' ? 'YARD' : 'SITE'
          }).select().single();
          if (comp) {
            await supabase.from('component_history').insert({ component_id: comp.id, action: 'Request Created', from_status: null, to_status: status, performed_by_user_id: user.id, performed_by_name: user.full_name, note: `Request ${String(reqNumber).padStart(5, '0')}-0 sent to ${destination.toUpperCase()}` });
          }
        }
      }

      setMessage({ type: 'success', text: `Request ${String(reqNumber).padStart(5, '0')}-0 created successfully!` });
      setIsoNumber(''); setSpoolNumber(''); setSpoolOptions([]); setHfNumber(''); setHfError(null);
      setDescription(''); setTestPackNumber(''); setMaterials([]);
      setOverQuantityWarning(null); setProjectQtyExhausted(false); setSecondaryCollector('');
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
        <div style={{ padding: '8px 16px', backgroundColor: '#f3f4f6', borderRadius: '6px', fontSize: '14px' }}>
          Preview: <strong>{String(nextNumber).padStart(5, '0')}-0</strong>
        </div>
      </div>

      {message.text && (
        <div style={{ padding: '12px 16px', borderRadius: '6px', marginBottom: '16px', backgroundColor: message.type === 'success' ? '#D1FAE5' : '#FEE2E2', color: message.type === 'success' ? '#065F46' : '#DC2626' }}>{message.text}</div>
      )}

      <div style={styles.card}>
        <div style={{ padding: '24px' }}>
          {/* Request Type Selection */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{ ...styles.label, marginBottom: '12px' }}>Request Type</label>
            <div style={{ display: 'flex', gap: '24px' }}>
              {REQUEST_TYPES.map(type => (
                <label key={type} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input type="radio" name="requestType" value={type} checked={requestType === type} onChange={(e) => handleRequestTypeChange(e.target.value)} disabled={!canModify} style={{ width: '18px', height: '18px' }} />
                  <span style={{ fontWeight: requestType === type ? '600' : '400', fontSize: '15px' }}>{type}</span>
                </label>
              ))}
            </div>
          </div>

          {/* PIPING FORM */}
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
                  <input type="text" list="iso-options" value={isoNumber} onChange={(e) => handleIsoInput(e.target.value)} onBlur={(e) => handleIsoSelect(e.target.value)} style={styles.input} placeholder="Type to search ISO..." disabled={!canModify} />
                  <datalist id="iso-options">{filteredIsoOptions.map(iso => <option key={iso} value={iso} />)}</datalist>
                </div>
                <div>
                  <label style={styles.label}>Full Spool Number *</label>
                  <input type="text" list="spool-options" value={spoolNumber} onChange={(e) => handleSpoolInput(e.target.value)} onBlur={(e) => handleSpoolSelect(e.target.value)} style={{ ...styles.input, backgroundColor: isoNumber ? 'white' : '#f3f4f6' }} placeholder={isoNumber ? "Type to search spool..." : "Select ISO first"} disabled={!canModify || !isoNumber} />
                  <datalist id="spool-options">{filteredSpoolOptions.map(s => <option key={s} value={s} />)}</datalist>
                </div>
              </div>

              {/* HF Number with duplicate check */}
              {subCategory === 'Erection' && (
                <div style={{ marginBottom: '20px', padding: '16px', backgroundColor: hfError ? '#FEE2E2' : '#FEF3C7', borderRadius: '8px', border: `2px solid ${hfError ? '#EF4444' : '#F59E0B'}` }}>
                  <label style={{ ...styles.label, color: hfError ? '#DC2626' : '#92400E' }}>🔩 HF Number (Flanged Joint) *</label>
                  <input type="text" value={hfNumber} onChange={(e) => handleHfChange(e.target.value)} style={{ ...styles.input, backgroundColor: 'white', borderColor: hfError ? '#EF4444' : '#d1d5db' }} placeholder="Enter HF Number" disabled={!canModify} />
                  {hfError && (
                    <div style={{ marginTop: '12px', padding: '12px', backgroundColor: 'white', borderRadius: '6px', border: '1px solid #EF4444' }}>
                      <p style={{ fontWeight: '600', color: '#DC2626', marginBottom: '8px' }}>⚠️ {hfError.message}</p>
                      <p style={{ fontSize: '13px', color: '#6b7280' }}><strong>Request:</strong> {hfError.request}<br /><strong>Date:</strong> {hfError.date}<br /><strong>Requested by:</strong> {hfError.person}</p>
                    </div>
                  )}
                </div>
              )}

              <div style={{ marginBottom: '20px' }}>
                <label style={styles.label}>Description (optional)</label>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} style={{ ...styles.input, minHeight: '80px', resize: 'vertical' }} placeholder="Additional notes..." disabled={!canModify} />
              </div>
            </>
          )}

          {/* MECHANICAL FORM */}
          {requestType === 'Mechanical' && (
            <div style={{ marginBottom: '20px' }}>
              <label style={styles.label}>Description *</label>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} style={{ ...styles.input, minHeight: '120px', resize: 'vertical' }} placeholder="Describe the mechanical request..." disabled={!canModify} />
            </div>
          )}

          {/* TESTPACK FORM - FIXED: Spool autocomplete */}
          {requestType === 'TestPack' && (
            <>
              <div style={{ marginBottom: '20px', padding: '16px', backgroundColor: '#DBEAFE', borderRadius: '8px', border: '1px solid #3B82F6' }}>
                <label style={{ ...styles.label, color: '#1E40AF' }}>📋 Test Pack Number *</label>
                <input type="text" value={testPackNumber} onChange={(e) => setTestPackNumber(e.target.value)} style={{ ...styles.input, backgroundColor: 'white', fontSize: '16px' }} placeholder="e.g. TP-2024-001" disabled={!canModify} />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={styles.label}>Secondary Collector (optional)</label>
                <input type="text" list="users-list" value={secondaryCollector} onChange={(e) => setSecondaryCollector(e.target.value)} style={styles.input} placeholder="Search user name..." disabled={!canModify} />
                <datalist id="users-list">{allUsers.map(u => <option key={u.id} value={u.full_name}>{u.full_name} ({u.badge_number})</option>)}</datalist>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={styles.label}>Missing Type</label>
                <div style={{ display: 'flex', gap: '24px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                    <input type="radio" name="missingType" value="Material" checked={missingType === 'Material'} onChange={(e) => setMissingType(e.target.value)} style={{ width: '18px', height: '18px' }} />
                    <span style={{ fontWeight: missingType === 'Material' ? '600' : '400' }}>Material</span>
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                    <input type="radio" name="missingType" value="Spool" checked={missingType === 'Spool'} onChange={(e) => setMissingType(e.target.value)} style={{ width: '18px', height: '18px' }} />
                    <span style={{ fontWeight: missingType === 'Spool' ? '600' : '400' }}>Spool</span>
                  </label>
                </div>
              </div>

              {/* FIXED: Spool selection with autocomplete showing spool numbers, filtered */}
              {missingType === 'Spool' && (
                <TestPackSpoolSelector
                  value={description}
                  onChange={setDescription}
                  disabled={!canModify}
                />
              )}
            </>
          )}

          {/* MATERIALS SECTION */}
          {requestType !== 'Mechanical' && (requestType !== 'TestPack' || missingType === 'Material') && (
            <div style={{ marginTop: '24px', padding: '20px', backgroundColor: '#f9fafb', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
              <h4 style={{ fontWeight: '600', marginBottom: '16px' }}>📦 Add Materials</h4>
              
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 100px 80px', gap: '12px', alignItems: 'end' }}>
                <div>
                  <label style={styles.label}>Ident Code</label>
                  <input type="text" list="ident-options" value={currentMaterial.ident_code} onChange={(e) => handleIdentInput(e.target.value)} onBlur={(e) => handleIdentSelect(e.target.value)} style={{ ...styles.input, backgroundColor: (requestType === 'Piping' && !spoolNumber) ? '#f3f4f6' : 'white' }} placeholder={requestType === 'Piping' && !spoolNumber ? "Select spool first" : "Type to search..."} disabled={!canModify || (requestType === 'Piping' && !spoolNumber)} />
                  <datalist id="ident-options">{filteredIdentOptions.map(code => <option key={code} value={code} />)}</datalist>
                </div>
                <div>
                  <label style={styles.label}>Tag</label>
                  <select value={currentMaterial.tag} onChange={(e) => setCurrentMaterial({ ...currentMaterial, tag: e.target.value })} style={styles.select} disabled={!canModify || !currentMaterial.ident_code}>
                    <option value="">{currentMaterial.ident_code ? 'None' : 'Select Ident first'}</option>
                    {tagOptions.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label style={styles.label}>Qty</label>
                  <input type="number" value={currentMaterial.qty} onChange={(e) => setCurrentMaterial({ ...currentMaterial, qty: e.target.value })} style={styles.input} min="1" disabled={!canModify} />
                </div>
                <button onClick={addMaterial} style={{ ...styles.button, ...styles.buttonPrimary, height: '42px', justifyContent: 'center' }} disabled={!canModify || !currentMaterial.ident_code || !currentMaterial.qty}>+ Add</button>
              </div>

              {/* Project Qty Exhausted Warning */}
              {projectQtyExhausted && (
                <div style={{ marginTop: '16px', padding: '16px', backgroundColor: '#FEE2E2', border: '2px solid #EF4444', borderRadius: '8px', color: '#DC2626' }}>
                  <div style={{ fontWeight: '700', marginBottom: '8px', fontSize: '15px' }}>🚫 PROJECT QUANTITY ALREADY COLLECTED</div>
                  <div style={{ fontSize: '13px', marginBottom: '8px' }}>
                    For <strong>{overQuantityWarning?.ident_code}</strong>:
                    <br />• Project Qty: <strong>{overQuantityWarning?.projectQty}</strong>
                    <br />• Already Collected (record_out): <strong>{overQuantityWarning?.recordOut}</strong>
                    <br />• Already Requested: <strong>{overQuantityWarning?.alreadyRequested}</strong>
                  </div>
                  <div style={{ padding: '10px', backgroundColor: '#FECACA', borderRadius: '4px', fontWeight: '600' }}>⚠️ For this item you can only send to Engineering</div>
                </div>
              )}

              {/* Over-Quantity Warning */}
              {hasWarning && !projectQtyExhausted && (
                <div style={{ marginTop: '16px', padding: '12px 16px', backgroundColor: '#FEF3C7', border: '2px solid #F59E0B', borderRadius: '8px', color: '#92400E' }}>
                  <div style={{ fontWeight: '600', marginBottom: '4px' }}>⚠️ Over-Quantity Warning for {overQuantityWarning.ident_code}</div>
                  <div style={{ fontSize: '13px' }}>Available: <strong>{overQuantityWarning.available}</strong> | Requested: <strong>{overQuantityWarning.totalRequested}</strong></div>
                </div>
              )}

              {/* Materials List */}
              {materials.length > 0 && (
                <table style={{ ...styles.table, marginTop: '16px' }}>
                  <thead><tr><th style={styles.th}>Code</th><th style={styles.th}>Description</th><th style={styles.th}>Tag</th><th style={styles.th}>Qty</th><th style={{ ...styles.th, backgroundColor: COLORS.purple, color: 'white' }}>Project</th><th style={styles.th}></th></tr></thead>
                  <tbody>
                    {materials.map((mat, idx) => (
                      <tr key={idx}>
                        <td style={{ ...styles.td, fontFamily: 'monospace' }}>{mat.ident_code}</td>
                        <td style={styles.td}>{mat.description}</td>
                        <td style={styles.td}>{mat.tag || '-'}</td>
                        <td style={styles.td}>{mat.qty}</td>
                        <td style={{ ...styles.td, backgroundColor: '#F3E8FF' }}>{mat.pos_qty}</td>
                        <td style={styles.td}><ActionButton color={COLORS.primary} onClick={() => removeMaterial(idx)} title="Remove">×</ActionButton></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {/* SUBMIT BUTTONS */}
          <div style={{ marginTop: '24px', paddingTop: '24px', borderTop: '1px solid #e5e7eb', display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
            <button onClick={() => submitRequest('site')} disabled={!canModify || loading || siteYardDisabled}
              style={{ ...styles.button, backgroundColor: siteYardDisabled ? '#d1d5db' : COLORS.info, color: 'white', cursor: siteYardDisabled ? 'not-allowed' : 'pointer' }}
              title={siteYardDisabled ? 'Disabled - use Engineering' : ''}>📤 Send to WH Site</button>
            <button onClick={() => submitRequest('yard')} disabled={!canModify || loading || siteYardDisabled}
              style={{ ...styles.button, backgroundColor: siteYardDisabled ? '#d1d5db' : COLORS.secondary, color: 'white', cursor: siteYardDisabled ? 'not-allowed' : 'pointer' }}
              title={siteYardDisabled ? 'Disabled - use Engineering' : ''}>📤 Send to WH Yard</button>
            <button onClick={() => submitRequest('engineering')} disabled={!canModify || loading}
              style={{ ...styles.button, backgroundColor: COLORS.purple, color: 'white', border: siteYardDisabled ? '3px solid #7C3AED' : 'none' }}>
              ⚙️ Send to Engineering {siteYardDisabled && '(Required)'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// FIXED: TestPack Spool Selector - shows spool numbers with autocomplete, filters out SP000/SPSUP/SPTAG
function TestPackSpoolSelector({ value, onChange, disabled }) {
  const [spoolInput, setSpoolInput] = useState(value || '');
  const [allSpools, setAllSpools] = useState([]);
  const [filteredSpools, setFilteredSpools] = useState([]);

  useEffect(() => {
    loadAllSpools();
  }, []);

  const loadAllSpools = async () => {
    const { data } = await supabase.from('project_materials').select('full_spool_number').order('full_spool_number');
    if (data) {
      // Get unique spools and filter out SP000, SPSUP, SPTAG
      const unique = [...new Set(data.map(d => d.full_spool_number).filter(Boolean))];
      const filtered = unique.filter(s => {
        const upper = s.toUpperCase();
        return !upper.includes('SP000') && !upper.includes('SPSUP') && !upper.includes('SPTAG');
      });
      setAllSpools(filtered);
      setFilteredSpools(filtered.slice(0, 50));
    }
  };

  const handleInput = (val) => {
    setSpoolInput(val);
    onChange(val);
    if (val.length >= 2) {
      const filtered = allSpools.filter(s => s.toLowerCase().includes(val.toLowerCase()));
      setFilteredSpools(filtered.slice(0, 50));
    } else {
      setFilteredSpools(allSpools.slice(0, 50));
    }
  };

  return (
    <div style={{ marginBottom: '20px' }}>
      <label style={styles.label}>Missing Spool Number *</label>
      <input
        type="text"
        list="testpack-spool-options"
        value={spoolInput}
        onChange={(e) => handleInput(e.target.value)}
        style={styles.input}
        placeholder="Type to search spool number..."
        disabled={disabled}
      />
      <datalist id="testpack-spool-options">
        {filteredSpools.map(s => <option key={s} value={s}>{s}</option>)}
      </datalist>
      <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '6px' }}>Start typing to see matching spool numbers (excludes SP000, SPSUP, SPTAG)</p>
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
    if (user) {
      loadBadges();
      const interval = setInterval(loadBadges, 30000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const loadBadges = async () => {
    const counts = {};
    const statuses = ['Site', 'Yard', 'Eng', 'Trans', 'Order', 'Ordered', 'Spare', 'Mng', 'HF', 'TP', 'ToCollect'];
    for (const status of statuses) {
      const { data } = await supabase.from('request_components').select('id', { count: 'exact', head: true }).eq('status', status);
      counts[status] = data?.length || 0;
    }
    setBadges({
      whSite: counts.Site,
      whYard: counts.Yard,
      engineering: counts.Eng,
      siteIn: counts.Trans,
      orders: counts.Order,
      materialIn: counts.Ordered,
      spareParts: counts.Spare,
      management: counts.Mng,
      hfPage: counts.HF,
      testPackPage: counts.TP,
      toBeCollected: counts.ToCollect
    });
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
    requests: 'Requests',
    mir: 'MIR',
    materialIn: 'Material In',
    siteIn: 'Site IN',
    whSite: 'WH Site',
    whYard: 'WH Yard',
    engineering: 'Engineering',
    hfPage: 'HF - Flanged Joints',
    testPackPage: 'TestPack',
    toBeCollected: 'To Be Collected',
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
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1f2937' }}>
            {pageTitles[currentPage] || 'Dashboard'}
          </h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span style={{ fontSize: '14px', color: '#6b7280' }}>
              👤 {user.full_name} ({user.role})
            </span>
            <button
              onClick={handleLogout}
              style={{ ...styles.button, ...styles.buttonSecondary }}
            >
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

// ============================================================
// MIR PAGE - REDESIGNED: Piping/Mechanical first, different fields
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
      created_by: user.id,
      status: 'Open'
    });

    setShowCreateModal(false);
    loadMirs();
  };

  const canModify = user.role === 'admin' || user.perm_mir === 'modify';

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading...</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }}>
        <button onClick={openCreateModal} disabled={!canModify} style={{ ...styles.button, ...styles.buttonPrimary }}>+ New MIR</button>
      </div>

      <div style={styles.card}>
        <div style={styles.cardHeader}><h3 style={{ fontWeight: '600' }}>Material Issue Reports ({mirs.length})</h3></div>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Type</th>
              <th style={styles.th}>MIR #</th>
              <th style={styles.th}>RK #</th>
              <th style={styles.th}>Category</th>
              <th style={styles.th}>Forecast</th>
              <th style={styles.th}>Status</th>
              <th style={styles.th}>Created</th>
            </tr>
          </thead>
          <tbody>
            {mirs.map(mir => (
              <tr key={mir.id}>
                <td style={styles.td}>
                  <span style={{ ...styles.statusBadge, backgroundColor: mir.mir_type === 'Piping' ? COLORS.info : COLORS.purple }}>{mir.mir_type}</span>
                </td>
                <td style={{ ...styles.td, fontFamily: 'monospace', fontWeight: '600' }}>{mir.mir_number || '-'}</td>
                <td style={{ ...styles.td, fontFamily: 'monospace', color: COLORS.info }}>{mir.rk_number}</td>
                <td style={styles.td}>{mir.category || '-'}</td>
                <td style={styles.td}>{mir.forecast_date ? new Date(mir.forecast_date).toLocaleDateString() : '-'}</td>
                <td style={styles.td}><span style={{ ...styles.statusBadge, backgroundColor: mir.status === 'Open' ? COLORS.info : mir.status === 'Closed' ? COLORS.success : COLORS.gray }}>{mir.status}</span></td>
                <td style={styles.td}>{new Date(mir.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
            {mirs.length === 0 && <tr><td colSpan="7" style={{ ...styles.td, textAlign: 'center', color: '#9ca3af' }}>No MIRs</td></tr>}
          </tbody>
        </table>
      </div>

      {/* Create MIR Modal - REDESIGNED */}
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
// WH SITE PAGE
// ============================================================
function WHSitePage({ user }) {
  const [components, setComponents] = useState([]);
  const [engNotes, setEngNotes] = useState([]);
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
    const { data: siteData } = await supabase.from('request_components').select(`*, requests (request_number, sub_number, sub_category, request_type, requester_user_id)`).eq('status', 'Site');
    const { data: notesData } = await supabase.from('request_components').select(`*, requests (request_number, sub_number)`).eq('has_eng_check', true).eq('eng_check_sent_to', 'Site');
    if (siteData) setComponents(siteData);
    if (notesData) setEngNotes(notesData);
    setLoading(false);
  };

  const logHistory = async (compId, action, fromStatus, toStatus, note) => {
    await supabase.from('component_history').insert({ component_id: compId, action, from_status: fromStatus, to_status: toStatus, performed_by_user_id: user.id, performed_by_name: user.full_name, note });
  };

  const handleAction = async (component, action) => {
    try {
      switch (action) {
        case 'ready': setSelectedComponent(component); setShowDestPopup(true); return;
        case 'pt': setSelectedComponent(component); setShowPartialModal(true); return;
        case 'yard':
          await supabase.from('request_components').update({ status: 'Yard', current_location: 'YARD' }).eq('id', component.id);
          await logHistory(component.id, 'Sent to Yard', 'Site', 'Yard', '');
          break;
        case 'eng':
          await supabase.from('request_components').update({ status: 'Eng' }).eq('id', component.id);
          await logHistory(component.id, 'Sent to Engineering', 'Site', 'Eng', '');
          break;
        case 'delete':
          if (confirm('Delete this component?')) {
            await supabase.from('request_components').update({ status: 'Cancelled' }).eq('id', component.id);
            await logHistory(component.id, 'Cancelled', 'Site', 'Cancelled', '');
          }
          break;
        case 'ack':
          await supabase.from('request_components').update({ has_eng_check: false, eng_check_message: null, eng_check_sent_to: null }).eq('id', component.id);
          break;
      }
      loadComponents();
    } catch (error) { alert('Error: ' + error.message); }
  };

  const handleDestinationSelect = async (dest) => {
    const component = selectedComponent;
    let newStatus = dest === 'siteIn' ? 'ToCollect' : dest === 'hf' ? 'HF' : 'TP';
    let note = dest === 'siteIn' ? 'Ready for collection' : dest === 'hf' ? 'Sent to HF Page' : 'Sent to TestPack Page';
    await supabase.from('request_components').update({ status: newStatus }).eq('id', component.id);
    await logHistory(component.id, `Ready - ${dest.toUpperCase()}`, 'Site', newStatus, note);
    setShowDestPopup(false);
    setSelectedComponent(null);
    loadComponents();
  };

  const submitPartial = async () => {
    if (!partialQty || parseInt(partialQty) >= selectedComponent.quantity) { alert('Partial quantity must be less than total'); return; }
    const sendQty = parseInt(partialQty);
    const remainingQty = selectedComponent.quantity - sendQty;
    await supabase.from('request_components').update({ quantity: sendQty, status: 'ToCollect' }).eq('id', selectedComponent.id);
    await logHistory(selectedComponent.id, 'Partial Split', 'Site', 'ToCollect', `Qty ${sendQty} ready, ${remainingQty} remains`);
    const { data: subData } = await supabase.from('requests').select('sub_number').eq('request_number', selectedComponent.requests.request_number).order('sub_number', { ascending: false }).limit(1);
    const nextSub = (subData?.[0]?.sub_number || 0) + 1;
    const { data: newReq } = await supabase.from('requests').insert({ request_number: selectedComponent.requests.request_number, sub_number: nextSub, request_type: selectedComponent.requests.request_type, sub_category: selectedComponent.requests.sub_category }).select().single();
    await supabase.from('request_components').insert({ request_id: newReq.id, ident_code: selectedComponent.ident_code, description: selectedComponent.description, quantity: remainingQty, status: 'Site', current_location: 'SITE' });
    setShowPartialModal(false);
    setPartialQty('');
    loadComponents();
  };

  const canModify = user.role === 'admin' || user.perm_wh_site === 'modify';

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading...</div>;

  return (
    <div>
      {engNotes.length > 0 && (
        <div style={{ backgroundColor: '#F3E8FF', border: '1px solid #A855F7', borderRadius: '8px', padding: '16px', marginBottom: '24px' }}>
          <h4 style={{ fontWeight: '600', color: '#7C3AED', marginBottom: '12px' }}>📝 Notes from Engineering ({engNotes.length})</h4>
          {engNotes.map(note => (
            <div key={note.id} style={{ backgroundColor: 'white', padding: '12px', borderRadius: '6px', marginBottom: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div><span style={{ fontFamily: 'monospace', fontWeight: '600' }}>{note.ident_code}</span><span style={{ marginLeft: '12px', color: '#6b7280' }}>{note.eng_check_message}</span></div>
              <ActionButton color={COLORS.success} onClick={() => handleAction(note, 'ack')} disabled={!canModify} title="Acknowledge">✓</ActionButton>
            </div>
          ))}
        </div>
      )}

      <div style={styles.card}>
        <div style={styles.cardHeader}><h3 style={{ fontWeight: '600' }}>WH Site - Components ({components.length})</h3></div>
        <table style={styles.table}>
          <thead><tr><th style={styles.th}>Request</th><th style={styles.th}>Code</th><th style={styles.th}>Description</th><th style={styles.th}>Qty</th><th style={styles.th}>Category</th><th style={styles.th}>Actions</th></tr></thead>
          <tbody>
            {components.map(comp => (
              <tr key={comp.id}>
                <td style={{ ...styles.td, fontFamily: 'monospace', fontWeight: '600' }}>{String(comp.requests?.request_number).padStart(5, '0')}-{comp.requests?.sub_number}</td>
                <td style={{ ...styles.td, fontFamily: 'monospace' }}>{comp.ident_code}</td>
                <td style={styles.td}>{comp.description}</td>
                <td style={styles.td}>{comp.quantity}</td>
                <td style={styles.td}>{comp.requests?.sub_category || comp.requests?.request_type}</td>
                <td style={styles.td}>
                  <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                    <ActionButton color={COLORS.success} onClick={() => handleAction(comp, 'ready')} disabled={!canModify} title="Ready">✓</ActionButton>
                    <ActionButton color={COLORS.warning} onClick={() => handleAction(comp, 'pt')} disabled={!canModify} title="Partial">PT</ActionButton>
                    <ActionButton color={COLORS.secondary} onClick={() => handleAction(comp, 'yard')} disabled={!canModify} title="Yard">Y</ActionButton>
                    <ActionButton color={COLORS.purple} onClick={() => handleAction(comp, 'eng')} disabled={!canModify} title="Engineering">UT</ActionButton>
                    <ActionButton color={COLORS.primary} onClick={() => handleAction(comp, 'delete')} disabled={!canModify} title="Delete">🗑️</ActionButton>
                    <ActionButton color={COLORS.gray} onClick={() => { setHistoryComponentId(comp.id); setShowHistory(true); }} title="History">ℹ️</ActionButton>
                  </div>
                </td>
              </tr>
            ))}
            {components.length === 0 && <tr><td colSpan="6" style={{ ...styles.td, textAlign: 'center', color: '#9ca3af' }}>No components in WH Site</td></tr>}
          </tbody>
        </table>
      </div>

      <DestinationPopup isOpen={showDestPopup} onClose={() => setShowDestPopup(false)} onSelect={handleDestinationSelect} title="Where to send the material?" />
      
      <Modal isOpen={showPartialModal} onClose={() => setShowPartialModal(false)} title="Partial Split">
        <p style={{ marginBottom: '16px' }}><strong>{selectedComponent?.ident_code}</strong> - Total Qty: {selectedComponent?.quantity}</p>
        <div style={{ marginBottom: '16px' }}>
          <label style={styles.label}>Available Quantity</label>
          <input type="number" value={partialQty} onChange={(e) => setPartialQty(e.target.value)} style={styles.input} min="1" max={selectedComponent?.quantity - 1} />
          <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '6px' }}>Remaining: {(selectedComponent?.quantity || 0) - (parseInt(partialQty) || 0)}</p>
        </div>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          <button onClick={() => setShowPartialModal(false)} style={{ ...styles.button, ...styles.buttonSecondary }}>Cancel</button>
          <button onClick={submitPartial} style={{ ...styles.button, backgroundColor: COLORS.warning, color: 'white' }}>Split</button>
        </div>
      </Modal>

      <HistoryPopup isOpen={showHistory} onClose={() => setShowHistory(false)} componentId={historyComponentId} />
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
  const [showDestPopup, setShowDestPopup] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [historyComponentId, setHistoryComponentId] = useState(null);

  useEffect(() => { loadComponents(); }, []);

  const loadComponents = async () => {
    setLoading(true);
    const { data: yardData } = await supabase.from('request_components').select(`*, requests (request_number, sub_number, sub_category, request_type)`).eq('status', 'Yard');
    if (yardData) {
      setComponents(yardData);
      const codes = [...new Set(yardData.map(c => c.ident_code))];
      if (codes.length > 0) {
        const { data: invData } = await supabase.from('inventory').select('ident_code, yard_qty').in('ident_code', codes);
        const invMap = {};
        invData?.forEach(i => { invMap[i.ident_code] = i.yard_qty || 0; });
        setInventory(invMap);
      }
    }
    setLoading(false);
  };

  const logHistory = async (compId, action, fromStatus, toStatus, note) => {
    await supabase.from('component_history').insert({ component_id: compId, action, from_status: fromStatus, to_status: toStatus, performed_by_user_id: user.id, performed_by_name: user.full_name, note });
  };

  const handleAction = async (component, action) => {
    const available = inventory[component.ident_code] || 0;
    try {
      switch (action) {
        case 'found':
          if (available < component.quantity) { alert(`Only ${available} available in YARD!`); return; }
          setSelectedComponent(component); setShowDestPopup(true); return;
        case 'pt': setSelectedComponent(component); setShowPartialModal(true); return;
        case 'eng':
          await supabase.from('request_components').update({ status: 'Eng' }).eq('id', component.id);
          await logHistory(component.id, 'Sent to Engineering', 'Yard', 'Eng', '');
          break;
        case 'return':
          await supabase.from('request_components').update({ status: 'Site', current_location: 'SITE' }).eq('id', component.id);
          await logHistory(component.id, 'Returned to Site', 'Yard', 'Site', '');
          break;
        case 'delete':
          if (confirm('Delete this component?')) {
            await supabase.from('request_components').update({ status: 'Cancelled' }).eq('id', component.id);
            await logHistory(component.id, 'Cancelled', 'Yard', 'Cancelled', '');
          }
          break;
      }
      loadComponents();
    } catch (error) { alert('Error: ' + error.message); }
  };

  const handleDestinationSelect = async (dest) => {
    const component = selectedComponent;
    await supabase.rpc('decrement_yard_qty', { p_ident_code: component.ident_code, p_qty: component.quantity });
    let newStatus = dest === 'siteIn' ? 'Trans' : dest === 'hf' ? 'HF' : 'TP';
    let note = dest === 'siteIn' ? 'In transit to Site' : dest === 'hf' ? 'Sent to HF Page' : 'Sent to TestPack Page';
    await supabase.from('request_components').update({ status: newStatus }).eq('id', component.id);
    await logHistory(component.id, `Found - ${dest.toUpperCase()}`, 'Yard', newStatus, note);
    await supabase.from('movements').insert({ ident_code: component.ident_code, movement_type: 'TRANSFER', quantity: component.quantity, from_location: 'YARD', to_location: dest === 'siteIn' ? 'TRANSIT' : dest.toUpperCase(), performed_by: user.full_name });
    setShowDestPopup(false);
    setSelectedComponent(null);
    loadComponents();
  };

  const submitPartial = async () => {
    const available = inventory[selectedComponent.ident_code] || 0;
    if (!partialQty || parseInt(partialQty) > available) { alert(`Max available: ${available}`); return; }
    const sendQty = parseInt(partialQty);
    const remainingQty = selectedComponent.quantity - sendQty;
    await supabase.from('request_components').update({ quantity: sendQty, status: 'Trans' }).eq('id', selectedComponent.id);
    await supabase.rpc('decrement_yard_qty', { p_ident_code: selectedComponent.ident_code, p_qty: sendQty });
    await logHistory(selectedComponent.id, 'Partial Found', 'Yard', 'Trans', `Qty ${sendQty} sent, ${remainingQty} to Order`);
    const { data: subData } = await supabase.from('requests').select('sub_number').eq('request_number', selectedComponent.requests.request_number).order('sub_number', { ascending: false }).limit(1);
    const nextSub = (subData?.[0]?.sub_number || 0) + 1;
    const { data: newReq } = await supabase.from('requests').insert({ request_number: selectedComponent.requests.request_number, sub_number: nextSub, request_type: selectedComponent.requests.request_type, sub_category: selectedComponent.requests.sub_category }).select().single();
    await supabase.from('request_components').insert({ request_id: newReq.id, ident_code: selectedComponent.ident_code, description: selectedComponent.description, quantity: remainingQty, status: 'Order', current_location: 'YARD' });
    await supabase.from('movements').insert({ ident_code: selectedComponent.ident_code, movement_type: 'TRANSFER', quantity: sendQty, from_location: 'YARD', to_location: 'TRANSIT', performed_by: user.full_name, note: `Partial - ${remainingQty} to order` });
    setShowPartialModal(false);
    setPartialQty('');
    loadComponents();
  };

  const canModify = user.role === 'admin' || user.perm_wh_yard === 'modify';

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading...</div>;

  return (
    <div>
      <div style={styles.card}>
        <div style={styles.cardHeader}><h3 style={{ fontWeight: '600' }}>WH Yard - Components ({components.length})</h3></div>
        <table style={styles.table}>
          <thead><tr><th style={styles.th}>Request</th><th style={styles.th}>Code</th><th style={styles.th}>Description</th><th style={styles.th}>Requested</th><th style={styles.th}>Available</th><th style={styles.th}>Actions</th></tr></thead>
          <tbody>
            {components.map(comp => {
              const available = inventory[comp.ident_code] || 0;
              const canFulfill = available >= comp.quantity;
              return (
                <tr key={comp.id}>
                  <td style={{ ...styles.td, fontFamily: 'monospace', fontWeight: '600' }}>{String(comp.requests?.request_number).padStart(5, '0')}-{comp.requests?.sub_number}</td>
                  <td style={{ ...styles.td, fontFamily: 'monospace' }}>{comp.ident_code}</td>
                  <td style={styles.td}>{comp.description}</td>
                  <td style={styles.td}>{comp.quantity}</td>
                  <td style={styles.td}><span style={{ fontWeight: '600', color: canFulfill ? COLORS.success : COLORS.primary }}>{available}</span></td>
                  <td style={styles.td}>
                    <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                      <ActionButton color={canFulfill ? COLORS.success : COLORS.gray} onClick={() => handleAction(comp, 'found')} disabled={!canModify || !canFulfill} title={canFulfill ? "Found" : "Insufficient qty"}>✓</ActionButton>
                      <ActionButton color={COLORS.warning} onClick={() => handleAction(comp, 'pt')} disabled={!canModify || available === 0} title="Partial">PT</ActionButton>
                      <ActionButton color={COLORS.purple} onClick={() => handleAction(comp, 'eng')} disabled={!canModify} title="Engineering">UT</ActionButton>
                      <ActionButton color={COLORS.gray} onClick={() => handleAction(comp, 'return')} disabled={!canModify} title="Return to Site">↩</ActionButton>
                      <ActionButton color={COLORS.primary} onClick={() => handleAction(comp, 'delete')} disabled={!canModify} title="Delete">🗑️</ActionButton>
                      <ActionButton color={COLORS.gray} onClick={() => { setHistoryComponentId(comp.id); setShowHistory(true); }} title="History">ℹ️</ActionButton>
                    </div>
                  </td>
                </tr>
              );
            })}
            {components.length === 0 && <tr><td colSpan="6" style={{ ...styles.td, textAlign: 'center', color: '#9ca3af' }}>No components in WH Yard</td></tr>}
          </tbody>
        </table>
      </div>

      <DestinationPopup isOpen={showDestPopup} onClose={() => setShowDestPopup(false)} onSelect={handleDestinationSelect} title="Where to send the found material?" />

      <Modal isOpen={showPartialModal} onClose={() => setShowPartialModal(false)} title="Partial Send">
        <p style={{ marginBottom: '16px' }}><strong>{selectedComponent?.ident_code}</strong><br />Requested: {selectedComponent?.quantity} | Available: {inventory[selectedComponent?.ident_code] || 0}</p>
        <div style={{ marginBottom: '16px' }}>
          <label style={styles.label}>Quantity to send</label>
          <input type="number" value={partialQty} onChange={(e) => setPartialQty(e.target.value)} style={styles.input} min="1" max={inventory[selectedComponent?.ident_code] || 0} />
          <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '6px' }}>Rest will go to Orders</p>
        </div>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          <button onClick={() => setShowPartialModal(false)} style={{ ...styles.button, ...styles.buttonSecondary }}>Cancel</button>
          <button onClick={submitPartial} style={{ ...styles.button, backgroundColor: COLORS.warning, color: 'white' }}>Send Partial</button>
        </div>
      </Modal>

      <HistoryPopup isOpen={showHistory} onClose={() => setShowHistory(false)} componentId={historyComponentId} />
    </div>
  );
}

// ============================================================
// ENGINEERING PAGE
// ============================================================
function EngineeringPage({ user }) {
  const [components, setComponents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [selectedComponent, setSelectedComponent] = useState(null);
  const [noteMessage, setNoteMessage] = useState('');
  const [noteDest, setNoteDest] = useState('Site');
  const [showPartialModal, setShowPartialModal] = useState(false);
  const [partialQty, setPartialQty] = useState('');
  const [showHistory, setShowHistory] = useState(false);
  const [historyComponentId, setHistoryComponentId] = useState(null);

  useEffect(() => { loadComponents(); }, []);

  const loadComponents = async () => {
    setLoading(true);
    const { data } = await supabase.from('request_components').select(`*, requests (request_number, sub_number, sub_category, request_type)`).eq('status', 'Eng');
    if (data) setComponents(data);
    setLoading(false);
  };

  const logHistory = async (compId, action, fromStatus, toStatus, note) => {
    await supabase.from('component_history').insert({ component_id: compId, action, from_status: fromStatus, to_status: toStatus, performed_by_user_id: user.id, performed_by_name: user.full_name, note });
  };

  const handleAction = async (component, action) => {
    try {
      switch (action) {
        case 'resolved':
          await supabase.from('request_components').update({ status: 'Site', current_location: 'SITE' }).eq('id', component.id);
          await logHistory(component.id, 'Resolved by Engineering', 'Eng', 'Site', '');
          break;
        case 'pt': setSelectedComponent(component); setShowPartialModal(true); return;
        case 'note': setSelectedComponent(component); setShowNoteModal(true); return;
        case 'spare':
          await supabase.from('request_components').update({ status: 'Spare' }).eq('id', component.id);
          await logHistory(component.id, 'Sent to Spare Parts', 'Eng', 'Spare', '');
          break;
        case 'mng':
          await supabase.from('request_components').update({ status: 'Mng' }).eq('id', component.id);
          await logHistory(component.id, 'Sent to Management', 'Eng', 'Mng', '');
          break;
        case 'return':
          await supabase.from('request_components').update({ status: 'Site', current_location: 'SITE' }).eq('id', component.id);
          await logHistory(component.id, 'Returned to Site', 'Eng', 'Site', '');
          break;
        case 'delete':
          if (confirm('Delete this component?')) {
            await supabase.from('request_components').update({ status: 'Cancelled' }).eq('id', component.id);
            await logHistory(component.id, 'Cancelled', 'Eng', 'Cancelled', '');
          }
          break;
      }
      loadComponents();
    } catch (error) { alert('Error: ' + error.message); }
  };

  const sendNote = async () => {
    if (!noteMessage.trim()) { alert('Enter a message'); return; }
    await supabase.from('request_components').update({ has_eng_check: true, eng_check_message: noteMessage, eng_check_sent_to: noteDest, status: noteDest }).eq('id', selectedComponent.id);
    await logHistory(selectedComponent.id, `Note sent to ${noteDest}`, 'Eng', noteDest, noteMessage);
    setShowNoteModal(false);
    setNoteMessage('');
    loadComponents();
  };

  const submitPartial = async () => {
    if (!partialQty || parseInt(partialQty) >= selectedComponent.quantity) { alert('Partial quantity must be less than total'); return; }
    const resolvedQty = parseInt(partialQty);
    const remainingQty = selectedComponent.quantity - resolvedQty;
    await supabase.from('request_components').update({ quantity: resolvedQty, status: 'Site' }).eq('id', selectedComponent.id);
    await logHistory(selectedComponent.id, 'Partial Resolved', 'Eng', 'Site', `Qty ${resolvedQty} resolved`);
    const { data: subData } = await supabase.from('requests').select('sub_number').eq('request_number', selectedComponent.requests.request_number).order('sub_number', { ascending: false }).limit(1);
    const nextSub = (subData?.[0]?.sub_number || 0) + 1;
    const { data: newReq } = await supabase.from('requests').insert({ request_number: selectedComponent.requests.request_number, sub_number: nextSub, request_type: selectedComponent.requests.request_type, sub_category: selectedComponent.requests.sub_category }).select().single();
    await supabase.from('request_components').insert({ request_id: newReq.id, ident_code: selectedComponent.ident_code, description: selectedComponent.description, quantity: remainingQty, status: 'Eng' });
    setShowPartialModal(false);
    setPartialQty('');
    loadComponents();
  };

  const canModify = user.role === 'admin' || user.perm_engineering === 'modify';

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading...</div>;

  return (
    <div>
      <div style={styles.card}>
        <div style={styles.cardHeader}><h3 style={{ fontWeight: '600' }}>Engineering - Components ({components.length})</h3></div>
        <table style={styles.table}>
          <thead><tr><th style={styles.th}>Request</th><th style={styles.th}>Code</th><th style={styles.th}>Description</th><th style={styles.th}>Qty</th><th style={styles.th}>Category</th><th style={styles.th}>Actions</th></tr></thead>
          <tbody>
            {components.map(comp => (
              <tr key={comp.id}>
                <td style={{ ...styles.td, fontFamily: 'monospace', fontWeight: '600' }}>{String(comp.requests?.request_number).padStart(5, '0')}-{comp.requests?.sub_number}</td>
                <td style={{ ...styles.td, fontFamily: 'monospace' }}>{comp.ident_code}</td>
                <td style={styles.td}>{comp.description}</td>
                <td style={styles.td}>{comp.quantity}</td>
                <td style={styles.td}>{comp.requests?.sub_category || comp.requests?.request_type}</td>
                <td style={styles.td}>
                  <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                    <ActionButton color={COLORS.success} onClick={() => handleAction(comp, 'resolved')} disabled={!canModify} title="Resolved">✓</ActionButton>
                    <ActionButton color={COLORS.warning} onClick={() => handleAction(comp, 'pt')} disabled={!canModify} title="Partial">PT</ActionButton>
                    <ActionButton color={COLORS.info} onClick={() => handleAction(comp, 'note')} disabled={!canModify} title="Send Note">📝</ActionButton>
                    <ActionButton color={COLORS.pink} onClick={() => handleAction(comp, 'spare')} disabled={!canModify} title="Spare Parts">Sp</ActionButton>
                    <ActionButton color={COLORS.yellow} onClick={() => handleAction(comp, 'mng')} disabled={!canModify} title="Management">Mng</ActionButton>
                    <ActionButton color={COLORS.gray} onClick={() => handleAction(comp, 'return')} disabled={!canModify} title="Return">↩</ActionButton>
                    <ActionButton color={COLORS.primary} onClick={() => handleAction(comp, 'delete')} disabled={!canModify} title="Delete">🗑️</ActionButton>
                    <ActionButton color={COLORS.gray} onClick={() => { setHistoryComponentId(comp.id); setShowHistory(true); }} title="History">ℹ️</ActionButton>
                  </div>
                </td>
              </tr>
            ))}
            {components.length === 0 && <tr><td colSpan="6" style={{ ...styles.td, textAlign: 'center', color: '#9ca3af' }}>No components in Engineering</td></tr>}
          </tbody>
        </table>
      </div>

      <Modal isOpen={showNoteModal} onClose={() => setShowNoteModal(false)} title="📝 Send Note">
        <p style={{ marginBottom: '16px' }}><strong>{selectedComponent?.ident_code}</strong></p>
        <div style={{ marginBottom: '16px' }}>
          <label style={styles.label}>Send to</label>
          <div style={{ display: 'flex', gap: '16px' }}>
            {['Site', 'Yard'].map(dest => (
              <label key={dest} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input type="radio" name="noteDest" value={dest} checked={noteDest === dest} onChange={(e) => setNoteDest(e.target.value)} style={{ width: '18px', height: '18px' }} />
                <span>WH {dest}</span>
              </label>
            ))}
          </div>
        </div>
        <div style={{ marginBottom: '16px' }}>
          <label style={styles.label}>Message</label>
          <textarea value={noteMessage} onChange={(e) => setNoteMessage(e.target.value)} style={{ ...styles.input, minHeight: '100px' }} placeholder="Enter message for warehouse..." />
        </div>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          <button onClick={() => setShowNoteModal(false)} style={{ ...styles.button, ...styles.buttonSecondary }}>Cancel</button>
          <button onClick={sendNote} style={{ ...styles.button, backgroundColor: COLORS.info, color: 'white' }}>Send Note</button>
        </div>
      </Modal>

      <Modal isOpen={showPartialModal} onClose={() => setShowPartialModal(false)} title="Partial Resolved">
        <p style={{ marginBottom: '16px' }}><strong>{selectedComponent?.ident_code}</strong> - Total Qty: {selectedComponent?.quantity}</p>
        <div style={{ marginBottom: '16px' }}>
          <label style={styles.label}>Resolved Quantity</label>
          <input type="number" value={partialQty} onChange={(e) => setPartialQty(e.target.value)} style={styles.input} min="1" max={selectedComponent?.quantity - 1} />
        </div>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          <button onClick={() => setShowPartialModal(false)} style={{ ...styles.button, ...styles.buttonSecondary }}>Cancel</button>
          <button onClick={submitPartial} style={{ ...styles.button, backgroundColor: COLORS.warning, color: 'white' }}>Split</button>
        </div>
      </Modal>

      <HistoryPopup isOpen={showHistory} onClose={() => setShowHistory(false)} componentId={historyComponentId} />
    </div>
  );
}

// ============================================================
// HF PAGE
// ============================================================
function HFPage({ user }) {
  const [components, setComponents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showHistory, setShowHistory] = useState(false);
  const [historyComponentId, setHistoryComponentId] = useState(null);

  useEffect(() => { loadComponents(); }, []);

  const loadComponents = async () => {
    setLoading(true);
    const { data } = await supabase.from('request_components').select(`*, requests (request_number, sub_number, hf_number, sub_category)`).eq('status', 'HF');
    if (data) setComponents(data);
    setLoading(false);
  };

  const logHistory = async (compId, action, fromStatus, toStatus, note) => {
    await supabase.from('component_history').insert({ component_id: compId, action, from_status: fromStatus, to_status: toStatus, performed_by_user_id: user.id, performed_by_name: user.full_name, note });
  };

  const handleComplete = async (component) => {
    await supabase.from('request_components').update({ status: 'ToCollect' }).eq('id', component.id);
    await logHistory(component.id, 'HF Completed', 'HF', 'ToCollect', 'Ready for collection');
    loadComponents();
  };

  const handleReturn = async (component) => {
    await supabase.from('request_components').update({ status: 'Site' }).eq('id', component.id);
    await logHistory(component.id, 'Returned from HF', 'HF', 'Site', '');
    loadComponents();
  };

  const canModify = user.role === 'admin' || user.perm_wh_site === 'modify';

  // Group by HF Number
  const grouped = components.reduce((acc, comp) => {
    const hf = comp.requests?.hf_number || 'No HF';
    if (!acc[hf]) acc[hf] = [];
    acc[hf].push(comp);
    return acc;
  }, {});

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading...</div>;

  return (
    <div>
      <div style={{ marginBottom: '16px', padding: '16px', backgroundColor: '#F0FDFA', borderRadius: '8px', border: '1px solid #0D9488' }}>
        <h3 style={{ fontWeight: '600', color: COLORS.teal }}>🔩 HF (Flanged Joints) - {components.length} items</h3>
        <p style={{ fontSize: '13px', color: '#6b7280', marginTop: '4px' }}>Group materials by HF number. Complete all items in an HF to mark ready.</p>
      </div>

      {Object.keys(grouped).length === 0 ? (
        <div style={{ ...styles.card, padding: '40px', textAlign: 'center', color: '#9ca3af' }}>No HF items pending</div>
      ) : (
        Object.entries(grouped).map(([hf, items]) => (
          <div key={hf} style={{ ...styles.card, marginBottom: '16px' }}>
            <div style={{ ...styles.cardHeader, backgroundColor: '#F0FDFA' }}>
              <h3 style={{ fontWeight: '600', color: COLORS.teal }}>🔩 HF: {hf}</h3>
              <span style={{ ...styles.statusBadge, backgroundColor: COLORS.teal }}>{items.length} items</span>
            </div>
            <table style={styles.table}>
              <thead><tr><th style={styles.th}>Request</th><th style={styles.th}>Code</th><th style={styles.th}>Description</th><th style={styles.th}>Qty</th><th style={styles.th}>Actions</th></tr></thead>
              <tbody>
                {items.map(comp => (
                  <tr key={comp.id}>
                    <td style={{ ...styles.td, fontFamily: 'monospace', fontWeight: '600' }}>{String(comp.requests?.request_number).padStart(5, '0')}-{comp.requests?.sub_number}</td>
                    <td style={{ ...styles.td, fontFamily: 'monospace' }}>{comp.ident_code}</td>
                    <td style={styles.td}>{comp.description}</td>
                    <td style={styles.td}>{comp.quantity}</td>
                    <td style={styles.td}>
                      <div style={{ display: 'flex', gap: '4px' }}>
                        <ActionButton color={COLORS.success} onClick={() => handleComplete(comp)} disabled={!canModify} title="Complete">✓</ActionButton>
                        <ActionButton color={COLORS.gray} onClick={() => handleReturn(comp)} disabled={!canModify} title="Return">↩</ActionButton>
                        <ActionButton color={COLORS.gray} onClick={() => { setHistoryComponentId(comp.id); setShowHistory(true); }} title="History">ℹ️</ActionButton>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))
      )}

      <HistoryPopup isOpen={showHistory} onClose={() => setShowHistory(false)} componentId={historyComponentId} />
    </div>
  );
}

// ============================================================
// TESTPACK PAGE - FIXED: Shows spool_number with autocomplete, filters SP000/SPSUP/SPTAG
// ============================================================
function TestPackPage({ user }) {
  const [components, setComponents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showHistory, setShowHistory] = useState(false);
  const [historyComponentId, setHistoryComponentId] = useState(null);
  const [showAddSpoolModal, setShowAddSpoolModal] = useState(false);
  const [selectedTP, setSelectedTP] = useState(null);
  const [spoolInput, setSpoolInput] = useState('');
  const [allSpools, setAllSpools] = useState([]);
  const [filteredSpools, setFilteredSpools] = useState([]);

  useEffect(() => { loadComponents(); loadAllSpools(); }, []);

  const loadComponents = async () => {
    setLoading(true);
    const { data } = await supabase.from('request_components').select(`*, requests (request_number, sub_number, test_pack_number, missing_type, secondary_collector)`).eq('status', 'TP');
    if (data) setComponents(data);
    setLoading(false);
  };

  // FIXED: Load all spools for autocomplete, filter out SP000, SPSUP, SPTAG
  const loadAllSpools = async () => {
    const { data } = await supabase.from('project_materials').select('full_spool_number').order('full_spool_number');
    if (data) {
      const unique = [...new Set(data.map(d => d.full_spool_number).filter(Boolean))];
      const filtered = unique.filter(s => {
        const upper = s.toUpperCase();
        return !upper.includes('SP000') && !upper.includes('SPSUP') && !upper.includes('SPTAG');
      });
      setAllSpools(filtered);
      setFilteredSpools(filtered.slice(0, 50));
    }
  };

  const handleSpoolInput = (val) => {
    setSpoolInput(val);
    if (val.length >= 2) {
      const filtered = allSpools.filter(s => s.toLowerCase().includes(val.toLowerCase()));
      setFilteredSpools(filtered.slice(0, 50));
    } else {
      setFilteredSpools(allSpools.slice(0, 50));
    }
  };

  const logHistory = async (compId, action, fromStatus, toStatus, note) => {
    await supabase.from('component_history').insert({ component_id: compId, action, from_status: fromStatus, to_status: toStatus, performed_by_user_id: user.id, performed_by_name: user.full_name, note });
  };

  const handleComplete = async (component) => {
    await supabase.from('request_components').update({ status: 'ToCollect' }).eq('id', component.id);
    await logHistory(component.id, 'TestPack Completed', 'TP', 'ToCollect', 'Ready for collection');
    loadComponents();
  };

  const handleReturn = async (component) => {
    await supabase.from('request_components').update({ status: 'Site' }).eq('id', component.id);
    await logHistory(component.id, 'Returned from TestPack', 'TP', 'Site', '');
    loadComponents();
  };

  const openAddSpool = (tpNumber) => {
    setSelectedTP(tpNumber);
    setSpoolInput('');
    setShowAddSpoolModal(true);
  };

  const addSpoolToTP = async () => {
    if (!spoolInput) { alert('Select a spool'); return; }
    // Find original request for this TP
    const tpComp = components.find(c => c.requests?.test_pack_number === selectedTP);
    if (!tpComp) { alert('TestPack not found'); return; }
    
    await supabase.from('request_components').insert({
      request_id: tpComp.request_id,
      ident_code: 'SPOOL',
      description: spoolInput,
      full_spool_number: spoolInput,
      quantity: 1,
      status: 'TP'
    });
    setShowAddSpoolModal(false);
    loadComponents();
  };

  const canModify = user.role === 'admin' || user.perm_wh_site === 'modify';

  // Group by TestPack Number
  const grouped = components.reduce((acc, comp) => {
    const tp = comp.requests?.test_pack_number || 'No TP';
    if (!acc[tp]) acc[tp] = { items: [], missingType: comp.requests?.missing_type, secondary: comp.requests?.secondary_collector };
    acc[tp].items.push(comp);
    return acc;
  }, {});

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading...</div>;

  return (
    <div>
      <div style={{ marginBottom: '16px', padding: '16px', backgroundColor: '#F5F3FF', borderRadius: '8px', border: '1px solid #7C3AED' }}>
        <h3 style={{ fontWeight: '600', color: COLORS.purple }}>📋 TestPack - {components.length} items</h3>
        <p style={{ fontSize: '13px', color: '#6b7280', marginTop: '4px' }}>Group materials by TestPack. Complete all items to mark ready.</p>
      </div>

      {Object.keys(grouped).length === 0 ? (
        <div style={{ ...styles.card, padding: '40px', textAlign: 'center', color: '#9ca3af' }}>No TestPack items pending</div>
      ) : (
        Object.entries(grouped).map(([tp, data]) => (
          <div key={tp} style={{ ...styles.card, marginBottom: '16px' }}>
            <div style={{ ...styles.cardHeader, backgroundColor: '#F5F3FF' }}>
              <div>
                <h3 style={{ fontWeight: '600', color: COLORS.purple }}>📋 TP: {tp}</h3>
                <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
                  Type: {data.missingType} {data.secondary && `| Secondary: ${data.secondary}`}
                </div>
              </div>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <span style={{ ...styles.statusBadge, backgroundColor: COLORS.purple }}>{data.items.length} items</span>
                <button onClick={() => openAddSpool(tp)} style={{ ...styles.button, backgroundColor: COLORS.purple, color: 'white', padding: '6px 12px' }}>+ Add Spool</button>
              </div>
            </div>
            <table style={styles.table}>
              <thead><tr><th style={styles.th}>Request</th><th style={styles.th}>Spool/Code</th><th style={styles.th}>Description</th><th style={styles.th}>Qty</th><th style={styles.th}>Actions</th></tr></thead>
              <tbody>
                {data.items.map(comp => (
                  <tr key={comp.id}>
                    <td style={{ ...styles.td, fontFamily: 'monospace', fontWeight: '600' }}>{String(comp.requests?.request_number).padStart(5, '0')}-{comp.requests?.sub_number}</td>
                    <td style={{ ...styles.td, fontFamily: 'monospace', color: COLORS.purple, fontWeight: '600' }}>{comp.full_spool_number || comp.ident_code}</td>
                    <td style={styles.td}>{comp.description}</td>
                    <td style={styles.td}>{comp.quantity}</td>
                    <td style={styles.td}>
                      <div style={{ display: 'flex', gap: '4px' }}>
                        <ActionButton color={COLORS.success} onClick={() => handleComplete(comp)} disabled={!canModify} title="Complete">✓</ActionButton>
                        <ActionButton color={COLORS.gray} onClick={() => handleReturn(comp)} disabled={!canModify} title="Return">↩</ActionButton>
                        <ActionButton color={COLORS.gray} onClick={() => { setHistoryComponentId(comp.id); setShowHistory(true); }} title="History">ℹ️</ActionButton>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))
      )}

      {/* Add Spool Modal with Autocomplete */}
      <Modal isOpen={showAddSpoolModal} onClose={() => setShowAddSpoolModal(false)} title="Add Spool to TestPack">
        <p style={{ marginBottom: '16px' }}>Adding spool to: <strong>{selectedTP}</strong></p>
        <div style={{ marginBottom: '16px' }}>
          <label style={styles.label}>Spool Number</label>
          <input
            type="text"
            list="tp-spool-list"
            value={spoolInput}
            onChange={(e) => handleSpoolInput(e.target.value)}
            style={styles.input}
            placeholder="Type to search spool..."
          />
          <datalist id="tp-spool-list">
            {filteredSpools.map(s => <option key={s} value={s}>{s}</option>)}
          </datalist>
          <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '6px' }}>Excludes SP000, SPSUP, SPTAG</p>
        </div>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          <button onClick={() => setShowAddSpoolModal(false)} style={{ ...styles.button, ...styles.buttonSecondary }}>Cancel</button>
          <button onClick={addSpoolToTP} style={{ ...styles.button, backgroundColor: COLORS.purple, color: 'white' }}>Add Spool</button>
        </div>
      </Modal>

      <HistoryPopup isOpen={showHistory} onClose={() => setShowHistory(false)} componentId={historyComponentId} />
    </div>
  );
}

// ============================================================
// TO BE COLLECTED PAGE
// ============================================================
function ToBeCollectedPage({ user }) {
  const [components, setComponents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showHistory, setShowHistory] = useState(false);
  const [historyComponentId, setHistoryComponentId] = useState(null);
  const [showDeliverModal, setShowDeliverModal] = useState(false);
  const [selectedComponent, setSelectedComponent] = useState(null);
  const [voucherNumber, setVoucherNumber] = useState('');

  useEffect(() => { loadComponents(); }, []);

  const loadComponents = async () => {
    setLoading(true);
    const { data } = await supabase.from('request_components').select(`*, requests (request_number, sub_number, sub_category, request_type, hf_number, test_pack_number)`).eq('status', 'ToCollect');
    if (data) setComponents(data);
    setLoading(false);
  };

  const logHistory = async (compId, action, fromStatus, toStatus, note) => {
    await supabase.from('component_history').insert({ component_id: compId, action, from_status: fromStatus, to_status: toStatus, performed_by_user_id: user.id, performed_by_name: user.full_name, note });
  };

  const openDeliver = (comp) => {
    setSelectedComponent(comp);
    setVoucherNumber('');
    setShowDeliverModal(true);
  };

  const confirmDeliver = async () => {
    await supabase.from('request_components').update({ status: 'Done', voucher_number: voucherNumber || null }).eq('id', selectedComponent.id);
    await logHistory(selectedComponent.id, 'Delivered', 'ToCollect', 'Done', voucherNumber ? `Voucher: ${voucherNumber}` : '');
    // Update record_out
    const { data: inv } = await supabase.from('inventory').select('record_out').eq('ident_code', selectedComponent.ident_code).single();
    const newRecordOut = (inv?.record_out || 0) + selectedComponent.quantity;
    await supabase.from('inventory').update({ record_out: newRecordOut }).eq('ident_code', selectedComponent.ident_code);
    await supabase.from('movements').insert({ ident_code: selectedComponent.ident_code, movement_type: 'OUT', quantity: selectedComponent.quantity, from_location: 'SITE', to_location: 'DELIVERED', performed_by: user.full_name, note: voucherNumber ? `Voucher: ${voucherNumber}` : '' });
    setShowDeliverModal(false);
    loadComponents();
  };

  const handleReturn = async (comp) => {
    await supabase.from('request_components').update({ status: 'Site' }).eq('id', comp.id);
    await logHistory(comp.id, 'Returned from Collection', 'ToCollect', 'Site', '');
    loadComponents();
  };

  const canModify = user.role === 'admin' || user.perm_wh_site === 'modify';

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading...</div>;

  return (
    <div>
      <div style={{ marginBottom: '16px', padding: '16px', backgroundColor: '#D1FAE5', borderRadius: '8px', border: '1px solid #16a34a' }}>
        <h3 style={{ fontWeight: '600', color: COLORS.success }}>✅ To Be Collected - {components.length} items</h3>
        <p style={{ fontSize: '13px', color: '#6b7280', marginTop: '4px' }}>Materials ready for pickup by requesters</p>
      </div>

      <div style={styles.card}>
        <table style={styles.table}>
          <thead><tr><th style={styles.th}>Request</th><th style={styles.th}>Code</th><th style={styles.th}>Description</th><th style={styles.th}>Qty</th><th style={styles.th}>HF/TP</th><th style={styles.th}>Actions</th></tr></thead>
          <tbody>
            {components.map(comp => (
              <tr key={comp.id}>
                <td style={{ ...styles.td, fontFamily: 'monospace', fontWeight: '600' }}>{String(comp.requests?.request_number).padStart(5, '0')}-{comp.requests?.sub_number}</td>
                <td style={{ ...styles.td, fontFamily: 'monospace' }}>{comp.ident_code}</td>
                <td style={styles.td}>{comp.description}</td>
                <td style={styles.td}>{comp.quantity}</td>
                <td style={styles.td}>{comp.requests?.hf_number || comp.requests?.test_pack_number || '-'}</td>
                <td style={styles.td}>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    <ActionButton color={COLORS.success} onClick={() => openDeliver(comp)} disabled={!canModify} title="Deliver">📤</ActionButton>
                    <ActionButton color={COLORS.gray} onClick={() => handleReturn(comp)} disabled={!canModify} title="Return">↩</ActionButton>
                    <ActionButton color={COLORS.gray} onClick={() => { setHistoryComponentId(comp.id); setShowHistory(true); }} title="History">ℹ️</ActionButton>
                  </div>
                </td>
              </tr>
            ))}
            {components.length === 0 && <tr><td colSpan="6" style={{ ...styles.td, textAlign: 'center', color: '#9ca3af' }}>No items to collect</td></tr>}
          </tbody>
        </table>
      </div>

      <Modal isOpen={showDeliverModal} onClose={() => setShowDeliverModal(false)} title="📤 Confirm Delivery">
        <p style={{ marginBottom: '16px' }}><strong>{selectedComponent?.ident_code}</strong> - Qty: {selectedComponent?.quantity}</p>
        <div style={{ marginBottom: '16px' }}>
          <label style={styles.label}>Voucher Number (optional)</label>
          <input type="text" value={voucherNumber} onChange={(e) => setVoucherNumber(e.target.value)} style={styles.input} placeholder="Enter voucher number..." />
        </div>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          <button onClick={() => setShowDeliverModal(false)} style={{ ...styles.button, ...styles.buttonSecondary }}>Cancel</button>
          <button onClick={confirmDeliver} style={{ ...styles.button, backgroundColor: COLORS.success, color: 'white' }}>Confirm Delivery</button>
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
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({ ident_code: '', description: '', quantity: '', supplier: '' });

  useEffect(() => { loadItems(); }, []);

  const loadItems = async () => {
    setLoading(true);
    const { data } = await supabase.from('material_in').select('*').eq('status', 'Pending').order('created_at', { ascending: false });
    if (data) setItems(data);
    setLoading(false);
  };

  const handleReceive = async (item) => {
    await supabase.from('material_in').update({ status: 'Received', received_at: new Date().toISOString(), received_by: user.full_name }).eq('id', item.id);
    const { data: inv } = await supabase.from('inventory').select('id, yard_qty').eq('ident_code', item.ident_code).single();
    if (inv) {
      await supabase.from('inventory').update({ yard_qty: (inv.yard_qty || 0) + item.quantity }).eq('id', inv.id);
    } else {
      await supabase.from('inventory').insert({ ident_code: item.ident_code, description: item.description, yard_qty: item.quantity, site_qty: 0, lost_qty: 0, broken_qty: 0 });
    }
    await supabase.from('movements').insert({ ident_code: item.ident_code, movement_type: 'IN', quantity: item.quantity, from_location: 'SUPPLIER', to_location: 'YARD', performed_by: user.full_name, note: item.supplier ? `From: ${item.supplier}` : '' });
    loadItems();
  };

  const submitAdd = async () => {
    if (!formData.ident_code || !formData.quantity) { alert('Enter ident code and quantity'); return; }
    await supabase.from('material_in').insert({ ident_code: formData.ident_code, description: formData.description, quantity: parseInt(formData.quantity), supplier: formData.supplier, status: 'Pending', created_by: user.id });
    setShowAddModal(false);
    setFormData({ ident_code: '', description: '', quantity: '', supplier: '' });
    loadItems();
  };

  const canModify = user.role === 'admin' || user.perm_material_in === 'modify';

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading...</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }}>
        <button onClick={() => setShowAddModal(true)} disabled={!canModify} style={{ ...styles.button, ...styles.buttonPrimary }}>+ Add Incoming</button>
      </div>

      <div style={styles.card}>
        <div style={styles.cardHeader}><h3 style={{ fontWeight: '600' }}>Material In - Pending ({items.length})</h3></div>
        <table style={styles.table}>
          <thead><tr><th style={styles.th}>Date</th><th style={styles.th}>Code</th><th style={styles.th}>Description</th><th style={styles.th}>Qty</th><th style={styles.th}>Supplier</th><th style={styles.th}>Actions</th></tr></thead>
          <tbody>
            {items.map(item => (
              <tr key={item.id}>
                <td style={styles.td}>{new Date(item.created_at).toLocaleDateString()}</td>
                <td style={{ ...styles.td, fontFamily: 'monospace', fontWeight: '600' }}>{item.ident_code}</td>
                <td style={styles.td}>{item.description}</td>
                <td style={styles.td}>{item.quantity}</td>
                <td style={styles.td}>{item.supplier || '-'}</td>
                <td style={styles.td}>
                  <ActionButton color={COLORS.success} onClick={() => handleReceive(item)} disabled={!canModify} title="Receive">✓</ActionButton>
                </td>
              </tr>
            ))}
            {items.length === 0 && <tr><td colSpan="6" style={{ ...styles.td, textAlign: 'center', color: '#9ca3af' }}>No pending materials</td></tr>}
          </tbody>
        </table>
      </div>

      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="+ Add Incoming Material">
        <div style={{ marginBottom: '16px' }}><label style={styles.label}>Ident Code *</label><input type="text" value={formData.ident_code} onChange={(e) => setFormData({ ...formData, ident_code: e.target.value })} style={styles.input} /></div>
        <div style={{ marginBottom: '16px' }}><label style={styles.label}>Description</label><input type="text" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} style={styles.input} /></div>
        <div style={{ marginBottom: '16px' }}><label style={styles.label}>Quantity *</label><input type="number" value={formData.quantity} onChange={(e) => setFormData({ ...formData, quantity: e.target.value })} style={styles.input} min="1" /></div>
        <div style={{ marginBottom: '16px' }}><label style={styles.label}>Supplier</label><input type="text" value={formData.supplier} onChange={(e) => setFormData({ ...formData, supplier: e.target.value })} style={styles.input} /></div>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          <button onClick={() => setShowAddModal(false)} style={{ ...styles.button, ...styles.buttonSecondary }}>Cancel</button>
          <button onClick={submitAdd} style={{ ...styles.button, ...styles.buttonPrimary }}>Add</button>
        </div>
      </Modal>
    </div>
  );
}

// ============================================================
// SITE IN PAGE
// ============================================================
function SiteInPage({ user }) {
  const [components, setComponents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadComponents(); }, []);

  const loadComponents = async () => {
    setLoading(true);
    const { data } = await supabase.from('request_components').select(`*, requests (request_number, sub_number)`).eq('status', 'Trans');
    if (data) setComponents(data);
    setLoading(false);
  };

  const logHistory = async (compId, action, fromStatus, toStatus, note) => {
    await supabase.from('component_history').insert({ component_id: compId, action, from_status: fromStatus, to_status: toStatus, performed_by_user_id: user.id, performed_by_name: user.full_name, note });
  };

  const handleReceive = async (comp) => {
    await supabase.from('request_components').update({ status: 'ToCollect', current_location: 'SITE' }).eq('id', comp.id);
    await logHistory(comp.id, 'Received at Site', 'Trans', 'ToCollect', '');
    const { data: inv } = await supabase.from('inventory').select('id, site_qty').eq('ident_code', comp.ident_code).single();
    if (inv) {
      await supabase.from('inventory').update({ site_qty: (inv.site_qty || 0) + comp.quantity }).eq('id', inv.id);
    }
    await supabase.from('movements').insert({ ident_code: comp.ident_code, movement_type: 'TRANSFER', quantity: comp.quantity, from_location: 'TRANSIT', to_location: 'SITE', performed_by: user.full_name });
    loadComponents();
  };

  const canModify = user.role === 'admin' || user.perm_site_in === 'modify';

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading...</div>;

  return (
    <div>
      <div style={{ marginBottom: '16px', padding: '16px', backgroundColor: '#DBEAFE', borderRadius: '8px', border: '1px solid #3B82F6' }}>
        <h3 style={{ fontWeight: '600', color: COLORS.info }}>🏗️ Site IN - {components.length} items in transit</h3>
        <p style={{ fontSize: '13px', color: '#6b7280', marginTop: '4px' }}>Materials being transferred from Yard to Site</p>
      </div>

      <div style={styles.card}>
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
                  <ActionButton color={COLORS.success} onClick={() => handleReceive(comp)} disabled={!canModify} title="Receive">✓</ActionButton>
                </td>
              </tr>
            ))}
            {components.length === 0 && <tr><td colSpan="5" style={{ ...styles.td, textAlign: 'center', color: '#9ca3af' }}>No materials in transit</td></tr>}
          </tbody>
        </table>
      </div>
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

  const logHistory = async (compId, action, fromStatus, toStatus, note) => {
    await supabase.from('component_history').insert({ component_id: compId, action, from_status: fromStatus, to_status: toStatus, performed_by_user_id: user.id, performed_by_name: user.full_name, note });
  };

  const handleAction = async (comp, action) => {
    switch (action) {
      case 'resolve':
        await supabase.from('request_components').update({ status: 'Site' }).eq('id', comp.id);
        await logHistory(comp.id, 'Spare Part Resolved', 'Spare', 'Site', '');
        break;
      case 'return':
        await supabase.from('request_components').update({ status: 'Eng' }).eq('id', comp.id);
        await logHistory(comp.id, 'Returned to Engineering', 'Spare', 'Eng', '');
        break;
    }
    loadComponents();
  };

  const canModify = user.role === 'admin' || user.perm_spare_parts === 'modify';

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading...</div>;

  return (
    <div>
      <div style={{ marginBottom: '16px', padding: '16px', backgroundColor: '#FDF2F8', borderRadius: '8px', border: '1px solid #EC4899' }}>
        <h3 style={{ fontWeight: '600', color: COLORS.pink }}>🔧 Spare Parts - {components.length} items</h3>
      </div>

      <div style={styles.card}>
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
                  <div style={{ display: 'flex', gap: '4px' }}>
                    <ActionButton color={COLORS.success} onClick={() => handleAction(comp, 'resolve')} disabled={!canModify} title="Resolve">✓</ActionButton>
                    <ActionButton color={COLORS.gray} onClick={() => handleAction(comp, 'return')} disabled={!canModify} title="Return">↩</ActionButton>
                  </div>
                </td>
              </tr>
            ))}
            {components.length === 0 && <tr><td colSpan="5" style={{ ...styles.td, textAlign: 'center', color: '#9ca3af' }}>No spare parts items</td></tr>}
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
  const [tab, setTab] = useState('toOrder');
  const [toOrder, setToOrder] = useState([]);
  const [ordered, setOrdered] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadOrders(); }, []);

  const loadOrders = async () => {
    setLoading(true);
    const { data: toOrderData } = await supabase.from('request_components').select(`*, requests (request_number, sub_number)`).eq('status', 'Order');
    const { data: orderedData } = await supabase.from('request_components').select(`*, requests (request_number, sub_number)`).eq('status', 'Ordered');
    if (toOrderData) setToOrder(toOrderData);
    if (orderedData) setOrdered(orderedData);
    setLoading(false);
  };

  const logHistory = async (compId, action, fromStatus, toStatus, note) => {
    await supabase.from('component_history').insert({ component_id: compId, action, from_status: fromStatus, to_status: toStatus, performed_by_user_id: user.id, performed_by_name: user.full_name, note });
  };

  const handleOrder = async (comp) => {
    await supabase.from('request_components').update({ status: 'Ordered' }).eq('id', comp.id);
    await logHistory(comp.id, 'Ordered', 'Order', 'Ordered', '');
    loadOrders();
  };

  const handleReceived = async (comp) => {
    await supabase.from('request_components').update({ status: 'Yard' }).eq('id', comp.id);
    await logHistory(comp.id, 'Order Received', 'Ordered', 'Yard', '');
    const { data: inv } = await supabase.from('inventory').select('id, yard_qty').eq('ident_code', comp.ident_code).single();
    if (inv) {
      await supabase.from('inventory').update({ yard_qty: (inv.yard_qty || 0) + comp.quantity }).eq('id', inv.id);
    }
    await supabase.from('movements').insert({ ident_code: comp.ident_code, movement_type: 'IN', quantity: comp.quantity, from_location: 'ORDER', to_location: 'YARD', performed_by: user.full_name });
    loadOrders();
  };

  const canModify = user.role === 'admin' || user.perm_orders === 'modify';

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading...</div>;

  const currentData = tab === 'toOrder' ? toOrder : ordered;

  return (
    <div>
      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
        <button onClick={() => setTab('toOrder')} style={{ ...styles.button, backgroundColor: tab === 'toOrder' ? COLORS.primary : '#f3f4f6', color: tab === 'toOrder' ? 'white' : '#374151' }}>
          To Order ({toOrder.length})
        </button>
        <button onClick={() => setTab('ordered')} style={{ ...styles.button, backgroundColor: tab === 'ordered' ? COLORS.cyan : '#f3f4f6', color: tab === 'ordered' ? 'white' : '#374151' }}>
          Ordered ({ordered.length})
        </button>
      </div>

      <div style={styles.card}>
        <div style={styles.cardHeader}><h3 style={{ fontWeight: '600' }}>{tab === 'toOrder' ? 'To Order' : 'Ordered'}</h3></div>
        <table style={styles.table}>
          <thead><tr><th style={styles.th}>Request</th><th style={styles.th}>Code</th><th style={styles.th}>Description</th><th style={styles.th}>Qty</th><th style={styles.th}>Actions</th></tr></thead>
          <tbody>
            {currentData.map(comp => (
              <tr key={comp.id}>
                <td style={{ ...styles.td, fontFamily: 'monospace', fontWeight: '600' }}>{String(comp.requests?.request_number).padStart(5, '0')}-{comp.requests?.sub_number}</td>
                <td style={{ ...styles.td, fontFamily: 'monospace' }}>{comp.ident_code}</td>
                <td style={styles.td}>{comp.description}</td>
                <td style={styles.td}>{comp.quantity}</td>
                <td style={styles.td}>
                  {tab === 'toOrder' ? (
                    <ActionButton color={COLORS.cyan} onClick={() => handleOrder(comp)} disabled={!canModify} title="Mark Ordered">🛒</ActionButton>
                  ) : (
                    <ActionButton color={COLORS.success} onClick={() => handleReceived(comp)} disabled={!canModify} title="Received">✓</ActionButton>
                  )}
                </td>
              </tr>
            ))}
            {currentData.length === 0 && <tr><td colSpan="5" style={{ ...styles.td, textAlign: 'center', color: '#9ca3af' }}>No items</td></tr>}
          </tbody>
        </table>
      </div>
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
  const [formData, setFormData] = useState({ ident_code: '', movement_type: 'IN', quantity: '', from_location: '', to_location: '', note: '' });

  useEffect(() => { loadMovements(); }, []);

  const loadMovements = async () => {
    setLoading(true);
    const { data } = await supabase.from('movements').select('*').order('created_at', { ascending: false }).limit(100);
    if (data) setMovements(data);
    setLoading(false);
  };

  const submitAdd = async () => {
    if (!formData.ident_code || !formData.quantity) { alert('Enter ident code and quantity'); return; }
    await supabase.from('movements').insert({ ...formData, quantity: parseInt(formData.quantity), performed_by: user.full_name });
    setShowAddModal(false);
    setFormData({ ident_code: '', movement_type: 'IN', quantity: '', from_location: '', to_location: '', note: '' });
    loadMovements();
  };

  const canModify = user.role === 'admin' || user.perm_movements === 'modify';

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading...</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }}>
        <button onClick={() => setShowAddModal(true)} disabled={!canModify} style={{ ...styles.button, ...styles.buttonPrimary }}>+ Add Movement</button>
      </div>

      <div style={styles.card}>
        <div style={styles.cardHeader}><h3 style={{ fontWeight: '600' }}>Movements Log (Last 100)</h3></div>
        <table style={styles.table}>
          <thead><tr><th style={styles.th}>Date</th><th style={styles.th}>Type</th><th style={styles.th}>Code</th><th style={styles.th}>Qty</th><th style={styles.th}>From → To</th><th style={styles.th}>Note</th><th style={styles.th}>By</th></tr></thead>
          <tbody>
            {movements.map(mov => (
              <tr key={mov.id}>
                <td style={styles.td}>{new Date(mov.created_at).toLocaleString()}</td>
                <td style={styles.td}><span style={{ ...styles.statusBadge, backgroundColor: mov.movement_type === 'IN' ? COLORS.success : mov.movement_type === 'OUT' ? COLORS.primary : mov.movement_type === 'LOST' ? COLORS.orange : mov.movement_type === 'BROKEN' ? COLORS.purple : COLORS.gray }}>{mov.movement_type}</span></td>
                <td style={{ ...styles.td, fontFamily: 'monospace' }}>{mov.ident_code}</td>
                <td style={styles.td}>{mov.quantity}</td>
                <td style={styles.td}>{mov.from_location} → {mov.to_location}</td>
                <td style={styles.td}>{mov.note || '-'}</td>
                <td style={styles.td}>{mov.performed_by}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="+ Add Movement">
        <div style={{ marginBottom: '16px' }}><label style={styles.label}>Ident Code *</label><input type="text" value={formData.ident_code} onChange={(e) => setFormData({ ...formData, ident_code: e.target.value })} style={styles.input} /></div>
        <div style={{ marginBottom: '16px' }}><label style={styles.label}>Type</label><select value={formData.movement_type} onChange={(e) => setFormData({ ...formData, movement_type: e.target.value })} style={styles.select}>{MOVEMENT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}</select></div>
        <div style={{ marginBottom: '16px' }}><label style={styles.label}>Quantity *</label><input type="number" value={formData.quantity} onChange={(e) => setFormData({ ...formData, quantity: e.target.value })} style={styles.input} min="1" /></div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
          <div><label style={styles.label}>From</label><input type="text" value={formData.from_location} onChange={(e) => setFormData({ ...formData, from_location: e.target.value })} style={styles.input} /></div>
          <div><label style={styles.label}>To</label><input type="text" value={formData.to_location} onChange={(e) => setFormData({ ...formData, to_location: e.target.value })} style={styles.input} /></div>
        </div>
        <div style={{ marginBottom: '16px' }}><label style={styles.label}>Note</label><input type="text" value={formData.note} onChange={(e) => setFormData({ ...formData, note: e.target.value })} style={styles.input} /></div>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          <button onClick={() => setShowAddModal(false)} style={{ ...styles.button, ...styles.buttonSecondary }}>Cancel</button>
          <button onClick={submitAdd} style={{ ...styles.button, ...styles.buttonPrimary }}>Add</button>
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

  const logHistory = async (compId, action, fromStatus, toStatus, note) => {
    await supabase.from('component_history').insert({ component_id: compId, action, from_status: fromStatus, to_status: toStatus, performed_by_user_id: user.id, performed_by_name: user.full_name, note });
  };

  const handleDecision = async (comp, decision) => {
    let newStatus = decision === 'internal' ? 'Order' : 'Ordered';
    let note = decision === 'internal' ? 'Internal Order' : 'Client Order';
    await supabase.from('request_components').update({ status: newStatus, order_type: decision }).eq('id', comp.id);
    await logHistory(comp.id, `Management Decision: ${note}`, 'Mng', newStatus, '');
    loadComponents();
  };

  const canModify = user.role === 'admin' || user.perm_management === 'modify';

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading...</div>;

  return (
    <div>
      <div style={{ marginBottom: '16px', padding: '16px', backgroundColor: '#FEF9C3', borderRadius: '8px', border: '1px solid #CA8A04' }}>
        <h3 style={{ fontWeight: '600', color: COLORS.yellow }}>💼 Management Decisions - {components.length} items</h3>
      </div>

      <div style={styles.card}>
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
                  <div style={{ display: 'flex', gap: '4px' }}>
                    <ActionButton color={COLORS.info} onClick={() => handleDecision(comp, 'internal')} disabled={!canModify} title="Internal Order">🏢</ActionButton>
                    <ActionButton color={COLORS.cyan} onClick={() => handleDecision(comp, 'client')} disabled={!canModify} title="Client Order">👤</ActionButton>
                  </div>
                </td>
              </tr>
            ))}
            {components.length === 0 && <tr><td colSpan="5" style={{ ...styles.td, textAlign: 'center', color: '#9ca3af' }}>No items pending decision</td></tr>}
          </tbody>
        </table>
      </div>
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
  const [showBalanceModal, setShowBalanceModal] = useState(false);
  const [balanceForm, setBalanceForm] = useState({ ident_code: '', yard_qty: '', site_qty: '', lost_qty: '', broken_qty: '', note: '' });

  useEffect(() => { loadInventory(); }, []);

  const loadInventory = async () => {
    setLoading(true);
    const { data } = await supabase.from('inventory').select('*').order('ident_code');
    if (data) setInventory(data);
    setLoading(false);
  };

  const filtered = inventory.filter(item =>
    item.ident_code?.toLowerCase().includes(search.toLowerCase()) ||
    item.description?.toLowerCase().includes(search.toLowerCase())
  );

  const submitBalance = async () => {
    if (!balanceForm.ident_code) { alert('Enter ident code'); return; }
    const { data: existing } = await supabase.from('inventory').select('id').eq('ident_code', balanceForm.ident_code).single();
    const updateData = {};
    if (balanceForm.yard_qty !== '') updateData.yard_qty = parseInt(balanceForm.yard_qty);
    if (balanceForm.site_qty !== '') updateData.site_qty = parseInt(balanceForm.site_qty);
    if (balanceForm.lost_qty !== '') updateData.lost_qty = parseInt(balanceForm.lost_qty);
    if (balanceForm.broken_qty !== '') updateData.broken_qty = parseInt(balanceForm.broken_qty);
    
    if (existing) {
      await supabase.from('inventory').update(updateData).eq('id', existing.id);
    } else {
      await supabase.from('inventory').insert({ ident_code: balanceForm.ident_code, ...updateData });
    }
    
    await supabase.from('movements').insert({ ident_code: balanceForm.ident_code, movement_type: 'BAL', quantity: 0, from_location: 'BALANCE', to_location: 'BALANCE', performed_by: user.full_name, note: balanceForm.note || 'Manual balance' });
    
    setShowBalanceModal(false);
    setBalanceForm({ ident_code: '', yard_qty: '', site_qty: '', lost_qty: '', broken_qty: '', note: '' });
    loadInventory();
  };

  const canModify = user.role === 'admin' || user.perm_database === 'modify';
  const totals = { yard: 0, site: 0, lost: 0, broken: 0 };
  filtered.forEach(i => { totals.yard += i.yard_qty || 0; totals.site += i.site_qty || 0; totals.lost += i.lost_qty || 0; totals.broken += i.broken_qty || 0; });

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading...</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} style={{ ...styles.input, maxWidth: '300px' }} placeholder="Search code or description..." />
        <button onClick={() => setShowBalanceModal(true)} disabled={!canModify} style={{ ...styles.button, backgroundColor: COLORS.info, color: 'white' }}>+ Manual Balance</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
        <StatBox title="YARD" value={totals.yard.toLocaleString()} color={COLORS.secondary} />
        <StatBox title="SITE" value={totals.site.toLocaleString()} color={COLORS.info} />
        <StatBox title="LOST" value={totals.lost.toLocaleString()} color={COLORS.orange} />
        <StatBox title="BROKEN" value={totals.broken.toLocaleString()} color={COLORS.purple} />
      </div>

      <div style={styles.card}>
        <div style={styles.cardHeader}><h3 style={{ fontWeight: '600' }}>Inventory Database ({filtered.length} items)</h3></div>
        <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
          <table style={styles.table}>
            <thead style={{ position: 'sticky', top: 0 }}>
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
              {filtered.slice(0, 200).map(item => {
                const total = (item.yard_qty || 0) + (item.site_qty || 0) + (item.lost_qty || 0) + (item.broken_qty || 0);
                return (
                  <tr key={item.id}>
                    <td style={{ ...styles.td, fontFamily: 'monospace', fontWeight: '600' }}>{item.ident_code}</td>
                    <td style={styles.td}>{item.description || '-'}</td>
                    <td style={{ ...styles.td, textAlign: 'center', fontWeight: '600' }}>{item.yard_qty || 0}</td>
                    <td style={{ ...styles.td, textAlign: 'center', fontWeight: '600' }}>{item.site_qty || 0}</td>
                    <td style={{ ...styles.td, textAlign: 'center', fontWeight: '600' }}>{item.lost_qty || 0}</td>
                    <td style={{ ...styles.td, textAlign: 'center', fontWeight: '600' }}>{item.broken_qty || 0}</td>
                    <td style={{ ...styles.td, textAlign: 'center', fontWeight: '600', color: COLORS.primary }}>{total}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {filtered.length > 200 && <div style={{ padding: '16px', textAlign: 'center', color: '#6b7280', fontSize: '13px' }}>Showing first 200 of {filtered.length} items. Use search to filter.</div>}
      </div>

      <Modal isOpen={showBalanceModal} onClose={() => setShowBalanceModal(false)} title="+ Manual Balance">
        <div style={{ marginBottom: '16px' }}><label style={styles.label}>Ident Code *</label><input type="text" value={balanceForm.ident_code} onChange={(e) => setBalanceForm({ ...balanceForm, ident_code: e.target.value })} style={styles.input} /></div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', marginBottom: '16px' }}>
          <div><label style={{ ...styles.label, color: COLORS.secondary }}>Yard Qty</label><input type="number" value={balanceForm.yard_qty} onChange={(e) => setBalanceForm({ ...balanceForm, yard_qty: e.target.value })} style={styles.input} /></div>
          <div><label style={{ ...styles.label, color: COLORS.info }}>Site Qty</label><input type="number" value={balanceForm.site_qty} onChange={(e) => setBalanceForm({ ...balanceForm, site_qty: e.target.value })} style={styles.input} /></div>
          <div><label style={{ ...styles.label, color: COLORS.orange }}>Lost Qty</label><input type="number" value={balanceForm.lost_qty} onChange={(e) => setBalanceForm({ ...balanceForm, lost_qty: e.target.value })} style={styles.input} /></div>
          <div><label style={{ ...styles.label, color: COLORS.purple }}>Broken Qty</label><input type="number" value={balanceForm.broken_qty} onChange={(e) => setBalanceForm({ ...balanceForm, broken_qty: e.target.value })} style={styles.input} /></div>
        </div>
        <div style={{ marginBottom: '16px' }}><label style={styles.label}>Note</label><input type="text" value={balanceForm.note} onChange={(e) => setBalanceForm({ ...balanceForm, note: e.target.value })} style={styles.input} placeholder="Reason for balance..." /></div>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          <button onClick={() => setShowBalanceModal(false)} style={{ ...styles.button, ...styles.buttonSecondary }}>Cancel</button>
          <button onClick={submitBalance} style={{ ...styles.button, backgroundColor: COLORS.info, color: 'white' }}>Save Balance</button>
        </div>
      </Modal>
    </div>
  );
}

// ============================================================
// MAIN APP COMPONENT
// ============================================================
function App() {
  const [user, setUser] = useState(null);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [collapsed, setCollapsed] = useState(false);
  const [badges, setBadges] = useState({});

  useEffect(() => {
    const savedUser = localStorage.getItem('mm_user');
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  useEffect(() => {
    if (user) loadBadges();
  }, [user, currentPage]);

  const loadBadges = async () => {
    const { data: siteData } = await supabase.from('request_components').select('id', { count: 'exact' }).eq('status', 'Site');
    const { data: yardData } = await supabase.from('request_components').select('id', { count: 'exact' }).eq('status', 'Yard');
    const { data: transData } = await supabase.from('request_components').select('id', { count: 'exact' }).eq('status', 'Trans');
    const { data: engData } = await supabase.from('request_components').select('id', { count: 'exact' }).eq('status', 'Eng');
    const { data: orderData } = await supabase.from('request_components').select('id', { count: 'exact' }).eq('status', 'Order');
    const { data: mngData } = await supabase.from('request_components').select('id', { count: 'exact' }).eq('status', 'Mng');
    const { data: collectData } = await supabase.from('request_components').select('id', { count: 'exact' }).eq('status', 'ToCollect');
    const { data: hfData } = await supabase.from('request_components').select('id', { count: 'exact' }).eq('status', 'HF');
    const { data: tpData } = await supabase.from('request_components').select('id', { count: 'exact' }).eq('status', 'TP');
    const { data: spareData } = await supabase.from('request_components').select('id', { count: 'exact' }).eq('status', 'Spare');
    
    setBadges({
      whSite: siteData?.length || 0,
      whYard: yardData?.length || 0,
      siteIn: transData?.length || 0,
      engineering: engData?.length || 0,
      orders: orderData?.length || 0,
      management: mngData?.length || 0,
      toBeCollected: collectData?.length || 0,
      hfPage: hfData?.length || 0,
      testPackPage: tpData?.length || 0,
      spareParts: spareData?.length || 0
    });
  };

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('mm_user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('mm_user');
  };

  if (!user) return <LoginScreen onLogin={handleLogin} />;

  const pageTitles = {
    dashboard: 'Dashboard',
    requests: 'Requests',
    mir: 'MIR',
    materialIn: 'Material In',
    siteIn: 'Site IN',
    whSite: 'WH Site',
    whYard: 'WH Yard',
    engineering: 'Engineering',
    hfPage: 'HF',
    testPackPage: 'TestPack',
    toBeCollected: 'To Collect',
    spareParts: 'Spare Parts',
    orders: 'Orders',
    log: 'Log',
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
      <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} user={user} collapsed={collapsed} setCollapsed={setCollapsed} badges={badges} />
      <div style={styles.main}>
        <header style={styles.header}>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1f2937' }}>{pageTitles[currentPage]}</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span style={{ fontSize: '14px', color: '#6b7280' }}>👤 {user.full_name}</span>
            <button onClick={handleLogout} style={{ ...styles.button, ...styles.buttonSecondary }}>Logout</button>
          </div>
        </header>
        <main style={styles.content}>{renderPage()}</main>
      </div>
    </div>
  );
}

export default App;
