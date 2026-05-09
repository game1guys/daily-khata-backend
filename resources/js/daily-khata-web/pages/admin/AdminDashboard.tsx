import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Users, Activity, ListFilter, IndianRupee, Bell, Plus, Eye, X, ArrowUpRight, ArrowDownRight, TrendingUp, TrendingDown, Tag } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';
import toast, { Toaster } from 'react-hot-toast';

const guessLucideIcon = (name: string) => {
  const n = name.toLowerCase();
  if (n.includes('food') || n.includes('eat') || n.includes('restaurant') || n.includes('snack')) return 'Utensils';
  if (n.includes('travel') || n.includes('bus') || n.includes('transport') || n.includes('cab')) return 'Bus';
  if (n.includes('car') || n.includes('auto') || n.includes('fuel') || n.includes('gas')) return 'Car';
  if (n.includes('health') || n.includes('medicine') || n.includes('doctor') || n.includes('pharm')) return 'HeartPulse';
  if (n.includes('shop') || n.includes('cloth') || n.includes('mall') || n.includes('amazon')) return 'ShoppingBag';
  if (n.includes('bill') || n.includes('util') || n.includes('electric') || n.includes('water')) return 'Receipt';
  if (n.includes('home') || n.includes('house') || n.includes('rent') || n.includes('mortgage')) return 'Home';
  if (n.includes('edu') || n.includes('school') || n.includes('book') || n.includes('course')) return 'BookOpen';
  if (n.includes('entertain') || n.includes('movie') || n.includes('game') || n.includes('cinema')) return 'Gamepad2';
  if (n.includes('tech') || n.includes('gadget') || n.includes('phone') || n.includes('laptop')) return 'Smartphone';
  if (n.includes('sport') || n.includes('gym') || n.includes('fitness') || n.includes('workout')) return 'Dumbbell';
  if (n.includes('coffee') || n.includes('cafe')) return 'Coffee';
  if (n.includes('pet') || n.includes('dog') || n.includes('cat') || n.includes('vet')) return 'PawPrint';
  if (n.includes('music') || n.includes('spotify') || n.includes('concert')) return 'Music';
  if (n.includes('bank') || n.includes('fee') || n.includes('tax') || n.includes('interest')) return 'Landmark';
  if (n.includes('gift') || n.includes('present') || n.includes('party')) return 'Gift';
  if (n.includes('flight') || n.includes('plane') || n.includes('air')) return 'Plane';
  return 'CircleDollarSign'; // Ultimate default fallback
};

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

/** Same-origin `/api` when empty (Laravel). Set VITE_BACKEND_URL when SPA runs on another port (e.g. Vite :5173). */
const API_ORIGIN = (import.meta.env.VITE_BACKEND_URL as string | undefined) ?? '';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();

  // View State (Persisted)
  const [activeTab, setActiveTab] = useState(localStorage.getItem('dailyKhataAdminTab') || 'overview');

  useEffect(() => {
    localStorage.setItem('dailyKhataAdminTab', activeTab);
  }, [activeTab]);

  const [session, setSession] = useState<any>(null);

  // Data State
  const [stats, setStats] = useState({ totalUsers: 0, activeSubscriptions: 0 });
  const [users, setUsers] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);

  // Advanced Global States
  const [topSpenders, setTopSpenders] = useState<any[]>([]);
  const [topEarners, setTopEarners] = useState<any[]>([]);

  // Modal State
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [userTransactions, setUserTransactions] = useState<any[]>([]);

  // Form State
  // Pagination State
  const [userPage, setUserPage] = useState(1);
  const [userTotalPages, setUserTotalPages] = useState(1);
  const [userTotalRecords, setUserTotalRecords] = useState(0);

  const [notifList, setNotifList] = useState<any[]>([]);
  const [notifPage, setNotifPage] = useState(1);
  const [notifTotalPages, setNotifTotalPages] = useState(1);
  const [notifTotalRecords, setNotifTotalRecords] = useState(0);

  const [newCatName, setNewCatName] = useState('');
  const [newCatType, setNewCatType] = useState('expense');
  const [newCatIcon, setNewCatIcon] = useState('');
  const [notifTitle, setNotifTitle] = useState('');
  const [notifMessage, setNotifMessage] = useState('');
  const [notifImage, setNotifImage] = useState('');
  const [notifTarget, setNotifTarget] = useState('all');

  // Provisioning Form State
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPhone, setNewUserPhone] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('');
  const [newUserTier, setNewUserTier] = useState('free');
  const [isProvisioning, setIsProvisioning] = useState(false);
  const [isProvisionModalOpen, setIsProvisionModalOpen] = useState(false);

  const [promos, setPromos] = useState<any[]>([]);
  const [newPromoCode, setNewPromoCode] = useState('');
  const [newPromoPercent, setNewPromoPercent] = useState('15');
  const [newPromoMaxUses, setNewPromoMaxUses] = useState('');
  const [newPromoExpires, setNewPromoExpires] = useState('');
  const [promoSaving, setPromoSaving] = useState(false);

  const backendBase = () => `${API_ORIGIN}/api/admin`;

  const fetchPromos = async () => {
    try {
      const resp = await fetch(`${backendBase()}/promo-codes`);
      if (resp.ok) {
        const data = await resp.json();
        setPromos(data.promos || []);
      }
    } catch (err) {
      console.error('Promo list error', err);
    }
  };

  const createPromo = async (e: React.FormEvent) => {
    e.preventDefault();
    setPromoSaving(true);
    try {
      const resp = await fetch(`${backendBase()}/promo-codes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: newPromoCode,
          percent_off: Number(newPromoPercent),
          max_uses: newPromoMaxUses.trim() ? Number(newPromoMaxUses) : null,
          expires_at: newPromoExpires.trim() ? newPromoExpires : null,
        }),
      });
      const data = await resp.json();
      if (!resp.ok) throw new Error(data.error || 'Failed');
      toast.success(`Promo ${data.promo?.code || ''} created`);
      setNewPromoCode('');
      setNewPromoMaxUses('');
      setNewPromoExpires('');
      fetchPromos();
    } catch (err: any) {
      toast.error(err.message || 'Could not create promo');
    } finally {
      setPromoSaving(false);
    }
  };

  const togglePromoActive = async (p: any) => {
    try {
      const resp = await fetch(`${backendBase()}/promo-codes/${p.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_active: !p.is_active }),
      });
      const data = await resp.json();
      if (!resp.ok) throw new Error(data.error || 'Failed');
      toast.success(p.is_active ? 'Promo deactivated' : 'Promo activated');
      fetchPromos();
    } catch (err: any) {
      toast.error(err.message || 'Update failed');
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error("Image too large. Please use under 10 MB (or upload a smaller / compressed PNG/JPG).");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setNotifImage(reader.result as string); // Save as Base64 encoded string directly into DB
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/admin/login');
      } else {
        setSession(session);
      }
    };

    init();
  }, [navigate]);

  useEffect(() => {
    if (session) {
      if (activeTab === 'overview') fetchCoreData();
      if (activeTab === 'users') fetchPaginatedUsers(userPage);
      if (activeTab === 'notifications') fetchPaginatedNotifs(notifPage);
      if (activeTab === 'categories') fetchCoreData(); // fallback for categories
      if (activeTab === 'promos') fetchPromos();
    }
  }, [session, activeTab, userPage, notifPage]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/admin/login');
  };

  const fetchPaginatedUsers = async (pageArg: number) => {
    try {
      const url = `${API_ORIGIN}/api/admin/users-paginated?page=${pageArg}&limit=10`;
      const resp = await fetch(url);
      if (resp.ok) {
        const data = await resp.json();
        setUsers(data.users || []);
        setUserTotalPages(data.totalPages || 1);
        setUserTotalRecords(data.total || 0);
      }
    } catch (err) { console.error("Pagination Fetch Intercept:", err); }
  };

  const fetchPaginatedNotifs = async (pageArg: number) => {
    try {
      const url = `${API_ORIGIN}/api/admin/notifications-paginated?page=${pageArg}&limit=10`;
      const resp = await fetch(url);
      if (resp.ok) {
        const data = await resp.json();
        setNotifList(data.notifications || []);
        setNotifTotalPages(data.totalPages || 1);
        setNotifTotalRecords(data.total || 0);
      }
    } catch (err) { console.error("Notif Fetch Intercept:", err); }
  };

  const fetchCoreData = async () => {
    try {
      // 1. Fetch Deep Matrix minimal stats and categories via Node Express Admin-Bypass Route
      const coreUrl = `${API_ORIGIN}/api/admin/core-data`;
      const coreResponse = await fetch(coreUrl);
      if (coreResponse.ok) {
        const { stats: fetchedStats, categories: catData } = await coreResponse.json();
        setCategories(catData || []);
        setStats({
          totalUsers: fetchedStats?.totalUsers || 0,
          activeSubscriptions: fetchedStats?.activeSubscriptions || 0
        });
      }

      // Fetch Global Pulse Leaders (Top Spender/Earner metrics) from Node Express pipeline
      try {
        const url = `${API_ORIGIN}/api/admin/pulse-leaders`;
        const resp = await fetch(url);
        if (resp.ok) {
          const leaderData = await resp.json();
          setTopSpenders(leaderData.topSpenders || []);
          setTopEarners(leaderData.topEarners || []);
        }
      } catch (axErr) {
        console.warn('Backend API might be down, skipping leaders metrics.');
      }

    } catch (err) {
      console.error(err);
    }
  };

  const openUserModal = async (u: any) => {
    setSelectedUser(u);
    // Fetch user specific transactions utilizing Node Server RLS bypass endpoint
    try {
      const url = `${API_ORIGIN}/api/admin/ledger/${u.id}`;
      const response = await fetch(url);
      if (response.ok) {
        const { ledger } = await response.json();
        setUserTransactions(ledger || []);
      }
    } catch (err) {
      console.error("Ledger fetch intercept:", err);
    }
  };

  const createCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalIcon = newCatIcon.trim() !== '' ? newCatIcon.trim() : guessLucideIcon(newCatName);

    const { error } = await supabase.from('categories').insert({
      name: newCatName,
      type: newCatType,
      icon: finalIcon,
      color: '#3b82f6', // Default blue for dynamic creation
      user_id: null // Global
    });
    if (!error) {
      setNewCatName('');
      fetchCoreData();
      toast.success('Global Category Configured Successfully!');
    } else {
      toast.error('Error creating category. Ensure Admin privileges are active.');
    }
  };

  const sendNotification = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload: Record<string, string> = {
      title: notifTitle,
      message: notifMessage,
      target_tier: notifTarget,
    };
    if (notifImage.trim() !== '') {
      payload.image_url = notifImage.trim();
    }

    try {
      const resp = await fetch(`${backendBase()}/notifications/broadcast`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await resp.json();
      if (!resp.ok) {
        throw new Error(data.error || 'Broadcast failed');
      }
      const sent = data.push?.successCount ?? 0;
      const failed = data.push?.failureCount ?? 0;
      const eligible = data.eligible_devices ?? 0;
      const hint = data.hint as string | undefined;
      toast.success(
        `Saved & sent: ${sent} delivered${failed ? `, ${failed} failed` : ''} (${eligible} devices matched segment).`
      );
      if (hint) {
        toast(hint, { duration: 9000 });
      }
      setNotifTitle('');
      setNotifMessage('');
      setNotifImage('');
      setNotifPage(1);
      fetchPaginatedNotifs(1);
    } catch (err: any) {
      toast.error(err.message || 'Failed to send push notification.');
    }
  };

  const provisionNodeClient = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProvisioning(true);
    try {
      const response = await fetch(`${API_ORIGIN}/api/admin/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: newUserEmail,
          full_name: newUserName,
          phone: newUserPhone,
          subscription_tier: newUserTier,
          password: newUserPassword || undefined
        })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to provision user');

      toast.success('Success! Welcome Email & Temp Password Dispatched via SMTP.');

      // OPTIMISTIC UX UPDATE: Immediately inject into the user list so they appear without refresh
      setUsers(prev => [
        {
          id: data.data?.user?.id || Date.now(),
          full_name: newUserName,
          email: newUserEmail,
          phone: newUserPhone,
          subscription_tier: newUserTier,
          created_at: new Date().toISOString()
        },
        ...prev
      ]);

      setNewUserName('');
      setNewUserEmail('');
      setNewUserPhone('');
      setNewUserPassword('');
      setIsProvisionModalOpen(false); // Close Modal on success

      // Still trigger a background fetch to ensure state parity
      fetchCoreData();
      setUserPage(1);
      fetchPaginatedUsers(1);
    } catch (err: any) {
      toast.error(`Provisioning Intercepted: ${err.message}`);
    } finally {
      setIsProvisioning(false);
    }
  };

  if (!session) return <p className="p-10 font-sans text-center text-gray-400">Authenticating Secure Gateway...</p>;

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex text-slate-900 border-t-4 border-slate-900">
      <Toaster position="top-center" reverseOrder={false} />
      {/* Dynamic Sidebar */}
      <aside className="w-72 bg-white border-r border-gray-100 flex flex-col shadow-sm relative z-10">
        <div className="h-20 flex items-center px-6 border-b border-gray-50 bg-slate-900">
          {/* <img src={logoImg} alt="Logo" className="w-9 h-9 mr-3 brightness-0 invert opacity-90 object-contain drop-shadow" /> */}
          <span className="text-xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-sky-200 tracking-tight">
            Daily-KHATA
          </span>
          <span className="ml-3 px-2 py-0.5 rounded-md text-[10px] uppercase tracking-widest font-black bg-red-500 text-white">Super Admin</span>
        </div>
        <nav className="flex-1 p-4 space-y-2 mt-2">
          <button onClick={() => setActiveTab('overview')} className={`w-full flex items-center px-4 py-3.5 text-sm font-bold rounded-xl transition-all ${activeTab === 'overview' ? 'bg-blue-50 text-blue-700' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}>
            <Activity className="mr-3" size={18} /> Overview Pulse
          </button>
          <button onClick={() => setActiveTab('users')} className={`w-full flex items-center px-4 py-3.5 text-sm font-bold rounded-xl transition-all ${activeTab === 'users' ? 'bg-blue-50 text-blue-700' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}>
            <Users className="mr-3" size={18} /> User Governance
          </button>
          <button onClick={() => setActiveTab('categories')} className={`w-full flex items-center px-4 py-3.5 text-sm font-bold rounded-xl transition-all ${activeTab === 'categories' ? 'bg-blue-50 text-blue-700' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}>
            <ListFilter className="mr-3" size={18} /> Global Categories
          </button>
          <button onClick={() => setActiveTab('notifications')} className={`w-full flex items-center px-4 py-3.5 text-sm font-bold rounded-xl transition-all ${activeTab === 'notifications' ? 'bg-blue-50 text-blue-700' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}>
            <Bell className="mr-3" size={18} /> Push Notifications
          </button>
          <button onClick={() => setActiveTab('promos')} className={`w-full flex items-center px-4 py-3.5 text-sm font-bold rounded-xl transition-all ${activeTab === 'promos' ? 'bg-blue-50 text-blue-700' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}>
            <Tag className="mr-3" size={18} /> Promo codes
          </button>
        </nav>
        <div className="p-4 border-t border-gray-50 bg-slate-50/50">
          <button onClick={handleLogout} className="flex items-center justify-center w-full px-4 py-3 text-sm font-bold rounded-xl text-red-600 bg-white hover:bg-red-50 hover:shadow-sm border border-slate-200 transition-all">
            <LogOut className="mr-2" size={18} /> Disconnect Session
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-8 lg:p-12 overflow-y-auto relative">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-100/50 rounded-full blur-[100px] -z-10 pointer-events-none -translate-y-1/2 translate-x-1/4"></div>

        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="animate-in fade-in duration-300 relative z-10">
            <header className="mb-10">
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">System Pulse</h1>
              <p className="text-slate-500 mt-1 font-medium">Real-time analytical metrics of the master database.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-200/60 flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">Registered Users</p>
                  <h3 className="text-4xl font-black text-slate-900">{stats.totalUsers}</h3>
                </div>
                <div className="w-14 h-14 rounded-[1.2rem] bg-blue-50 flex items-center justify-center text-blue-600">
                  <Users size={28} />
                </div>
              </div>
              <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-200/60 flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">Active Subscriptions</p>
                  <h3 className="text-4xl font-black text-slate-900">{stats.activeSubscriptions}</h3>
                </div>
                <div className="w-14 h-14 rounded-[1.2rem] bg-emerald-50 flex items-center justify-center text-emerald-600">
                  <Activity size={28} />
                </div>
              </div>
              <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 p-6 rounded-[2rem] shadow-xl shadow-slate-900/10 border border-slate-700 flex items-center justify-between relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 rounded-full blur-2xl pointer-events-none"></div>
                <div className="relative z-10">
                  <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">ARR (Estimates)</p>
                  <h3 className="text-4xl font-black text-white">₹ {(stats.activeSubscriptions * 999).toLocaleString()}</h3>
                </div>
                <div className="relative z-10 w-14 h-14 rounded-[1.2rem] bg-white/10 flex items-center justify-center text-white backdrop-blur-md border border-white/20">
                  <IndianRupee size={28} />
                </div>
              </div>
            </div>

            {/* Global Leaders Display Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
              <div className="bg-white rounded-[2rem] shadow-sm border border-slate-200/60 p-8 h-fit">
                <h3 className="text-xl font-black text-slate-900 mb-6 flex items-center">
                  <TrendingDown className="text-red-500 mr-2" size={24} /> Top 5 Expenditures
                </h3>
                <div className="space-y-4">
                  {topSpenders.map((s, idx) => (
                    <div key={idx} className="flex justify-between items-center bg-slate-50 p-4 rounded-xl border border-slate-100/50">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-black text-slate-500 mr-3">{idx + 1}</div>
                        <p className="font-bold text-slate-800 text-sm truncate max-w-[150px]">{s.name}</p>
                      </div>
                      <p className="font-black text-red-600 tracking-tight">₹ {s.expense.toLocaleString()}</p>
                    </div>
                  ))}
                  {topSpenders.length === 0 && <p className="text-sm text-slate-400 font-medium">No active expense data detected in the entire network.</p>}
                </div>
              </div>

              <div className="bg-white rounded-[2rem] shadow-sm border border-slate-200/60 p-8 h-fit">
                <h3 className="text-xl font-black text-slate-900 mb-6 flex items-center">
                  <TrendingUp className="text-emerald-500 mr-2" size={24} /> Top 5 Earners
                </h3>
                <div className="space-y-4">
                  {topEarners.map((e, idx) => (
                    <div key={idx} className="flex justify-between items-center bg-slate-50 p-4 rounded-xl border border-slate-100/50">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-black text-slate-500 mr-3">{idx + 1}</div>
                        <p className="font-bold text-slate-800 text-sm truncate max-w-[150px]">{e.name}</p>
                      </div>
                      <p className="font-black text-emerald-600 tracking-tight">₹ {e.income.toLocaleString()}</p>
                    </div>
                  ))}
                  {topEarners.length === 0 && <p className="text-sm text-slate-400 font-medium">No active income data detected in the entire network.</p>}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* USERS TAB */}
        {activeTab === 'users' && (
          <div className="animate-in fade-in md:slide-in-from-bottom-4 duration-500">
            <header className="mb-8 flex justify-between items-end">
              <div>
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">User Governance</h1>
                <p className="text-slate-500 mt-1 font-medium">Deep-inspection of cross-sectional user activity & profiles.</p>
              </div>
              <button onClick={() => setIsProvisionModalOpen(true)} className="px-5 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all shadow-md flex items-center hover:-translate-y-0.5">
                <Plus size={18} className="mr-2" /> Add New User
              </button>
            </header>

            <div className="bg-white rounded-[2rem] shadow-sm border border-slate-200/60 overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-100">
                    <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Client Name</th>
                    <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Identifier</th>
                    <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Subscription</th>
                    <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {users.map((user, i) => (
                    <tr key={i} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-6 py-4 whitespace-nowrap text-[15px] font-bold text-slate-900">{user.full_name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-500">{user.phone || user.id.slice(0, 8)}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-[11px] font-black tracking-widest uppercase
                               ${user.subscription_tier === 'free' ? 'bg-slate-100 text-slate-600' : 'bg-gradient-to-r from-blue-500/10 to-indigo-500/10 text-blue-700 border border-blue-200/50'}
                             `}>
                          {user.subscription_tier?.replace('premium_', '') || 'FREE'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <button onClick={() => openUserModal(user)} className="inline-flex items-center px-4 py-2 bg-slate-900 text-white rounded-xl text-sm font-bold opacity-0 group-hover:opacity-100 transition-all hover:-translate-y-0.5 shadow-md">
                          <Eye size={16} className="mr-2" /> Inspect Ledger
                        </button>
                      </td>
                    </tr>
                  ))}
                  {users.length === 0 && (
                    <tr><td colSpan={4} className="p-10 text-center text-slate-500 font-medium">No users found. Ensure Admin RLS override is active.</td></tr>
                  )}
                </tbody>
              </table>

              {/* Users Pagination */}
              <div className="p-6 border-t border-slate-100 flex items-center justify-between bg-white">
                <span className="text-sm font-bold text-slate-500">Showing page {userPage} of {userTotalPages} ({userTotalRecords} Total Nodes)</span>
                <div className="flex space-x-2">
                  <button disabled={userPage === 1} onClick={() => setUserPage(p => p - 1)} className="px-5 py-2.5 border border-slate-200 rounded-xl text-[13px] font-black disabled:opacity-50 hover:bg-slate-50 transition-colors shadow-sm">Previous</button>
                  <button disabled={userPage === userTotalPages} onClick={() => setUserPage(p => p + 1)} className="px-5 py-2.5 border border-slate-200 rounded-xl text-[13px] font-black disabled:opacity-50 hover:bg-slate-50 transition-colors shadow-sm">Next</button>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* CATEGORIES TAB */}
        {activeTab === 'categories' && (
          <div className="animate-in fade-in md:slide-in-from-bottom-4 duration-500 max-w-4xl">
            <header className="mb-8">
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">Global Categories</h1>
              <p className="text-slate-500 mt-1 font-medium">Manage base categories provisioned to all users upon registration.</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Form */}
              <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-200/60 h-fit">
                <h3 className="text-xl font-black mb-6">Create Base Category</h3>
                <form onSubmit={createCategory} className="space-y-5">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Category Nomenclature</label>
                    <input type="text" value={newCatName} onChange={e => setNewCatName(e.target.value)} required className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium" placeholder="E.g., Streaming Services" />
                  </div>
                  <div className="grid grid-cols-2 gap-4 items-start">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Cashflow Vector</label>
                      <select value={newCatType} onChange={e => setNewCatType(e.target.value)} className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium appearance-none">
                        <option value="expense">Expense (Negative)</option>
                        <option value="income">Income (Positive)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[13px] font-bold text-slate-700 mb-2 truncate">Lucide Icon <span className="text-slate-400 font-normal">(Auto-Filled)</span></label>
                      <input type="text" value={newCatIcon} onChange={e => setNewCatIcon(e.target.value)} placeholder="e.g. ShoppingBag" className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium" />
                    </div>
                  </div>
                  <button type="submit" className="w-full py-4 mt-2 bg-slate-900 text-white rounded-2xl font-black shadow-lg shadow-slate-900/20 hover:-translate-y-0.5 transition-all text-[15px] flex items-center justify-center">
                    <Plus size={20} className="mr-2" /> Global Provision
                  </button>
                </form>
              </div>

              {/* List */}
              <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-200/60 overflow-hidden">
                <div className="px-8 py-6 border-b border-slate-100 bg-slate-50/50">
                  <h3 className="font-black text-lg">Active System Categories</h3>
                </div>
                <div className="divide-y divide-slate-100 max-h-[500px] overflow-y-auto">
                  {categories.map((c, i) => (
                    <div key={i} className="p-6 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-[1.2rem] bg-slate-100 flex items-center justify-center text-slate-700 border border-slate-200">
                          <ListFilter size={20} />
                        </div>
                        <div>
                          <p className="font-black text-slate-900 text-[15px]">{c.name}</p>
                          <p className="text-[12px] font-bold uppercase tracking-widest text-slate-400 mt-1">{c.type}</p>
                        </div>
                      </div>
                      <span className="px-3 py-1 bg-slate-100 rounded-full text-xs font-bold font-mono text-slate-500 border border-slate-200">{c.icon}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* NOTIFICATIONS TAB */}
        {activeTab === 'notifications' && (
          <div className="animate-in fade-in md:slide-in-from-bottom-4 duration-500 w-full">
            <header className="mb-8">
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">Broadcast Center</h1>
              <p className="text-slate-500 mt-1 font-medium">Deploy real-time push protocols directly to specific user clusters.</p>
            </header>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 w-full">
              {/* Form Container */}
              <div className="bg-white p-8 sm:p-10 rounded-[2.5rem] shadow-sm border border-slate-200/60 relative overflow-hidden h-fit">
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-400/10 rounded-full blur-[80px] -z-10 pointer-events-none translate-x-1/2 -translate-y-1/2"></div>

                <h3 className="text-xl font-black mb-6 flex items-center"><Bell className="text-emerald-500 mr-2" size={20} /> Compose Transmission</h3>
                <form onSubmit={sendNotification} className="relative z-10">
                  <div className="space-y-5">
                    <div>
                      <label className="block text-[13px] font-bold text-slate-700 mb-1.5 uppercase tracking-wide">Notification Title</label>
                      <input type="text" value={notifTitle} onChange={e => setNotifTitle(e.target.value)} required placeholder="e.g. Server Maintenance at 2AM UTC" className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-[1.2rem] focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all font-bold text-slate-900" />
                    </div>

                    <div>
                      <label className="block text-[13px] font-bold text-slate-700 mb-1.5 uppercase tracking-wide">Target Segment Matrix</label>
                      <div className="relative">
                        <select value={notifTarget} onChange={e => setNotifTarget(e.target.value)} className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-[1.2rem] focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all font-bold text-slate-900 appearance-none">
                          <option value="all">Global (All Registered Node Clients)</option>
                          <option value="free">Free Tier Users Only</option>
                          <option value="premium">All Paid Premium Users</option>
                          <option value="premium_mon">Premium Monthly Cohort</option>
                          <option value="premium_yr">Premium Yearly Cohort</option>
                          <option value="premium_life">Lifetime Founders</option>
                        </select>
                        <div className="absolute inset-y-0 right-6 flex items-center pointer-events-none">
                          <ArrowDownRight size={18} className="text-slate-400" />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[13px] font-bold text-slate-700 mb-1.5 uppercase tracking-wide">Message Payload</label>
                      <textarea value={notifMessage} onChange={e => setNotifMessage(e.target.value)} required rows={3} placeholder="Construct the alert payload..." className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-[1.2rem] focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all font-medium text-slate-600 resize-none"></textarea>
                    </div>

                    <div>
                      <label className="block text-[13px] font-bold text-slate-700 mb-1.5 uppercase tracking-wide">Featured Image Upload <span className="text-emerald-500 font-normal normal-case">(Optional)</span></label>
                      <input type="file" accept="image/*" onChange={handleImageUpload} className="w-full px-2 py-2 bg-slate-50 border border-slate-200 rounded-[1.2rem] focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all font-medium text-slate-600 file:cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-[12px] file:font-black file:bg-emerald-100 file:text-emerald-700 hover:file:bg-emerald-200" />

                      {notifImage && (
                        <div className="mt-3 relative w-full h-32 rounded-xl overflow-hidden border border-slate-200 shadow-sm bg-slate-100/50">
                          <img src={notifImage} alt="Preview" className="w-full h-full object-cover" />
                        </div>
                      )}
                    </div>
                  </div>

                  <button type="submit" className="w-full py-4 mt-8 bg-emerald-600 text-white rounded-[1.2rem] font-black tracking-wide shadow-lg shadow-emerald-600/30 hover:-translate-y-0.5 hover:bg-emerald-500 hover:shadow-emerald-500/40 transition-all text-[15px] flex items-center justify-center">
                    <Bell size={20} className="mr-2.5" /> Dispatch Push Protocol
                  </button>
                </form>
              </div>

              {/* List Container */}
              <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-200/60 flex flex-col h-full overflow-hidden max-h-[800px]">
                <div className="px-8 py-7 border-b border-slate-100 bg-slate-50/50">
                  <h3 className="font-black text-xl text-slate-900">Transmission History</h3>
                  <p className="text-[13px] font-bold text-slate-500 mt-1 uppercase tracking-widest">Global Broadcast Logs</p>
                </div>

                <div className="divide-y divide-slate-100 flex-1 overflow-y-auto bg-white">
                  {notifList.map((n: any, idx) => (
                    <div key={idx} className="p-6 hover:bg-slate-50/50 transition-all flex gap-5 group">
                      {n.image_url ? (
                        <img src={n.image_url} className="w-16 h-16 rounded-2xl object-cover border border-slate-200 shadow-sm" />
                      ) : (
                        <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center border border-slate-200 text-slate-400 group-hover:bg-slate-200 transition-colors">
                          <Bell size={24} strokeWidth={2.5} />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start gap-4">
                          <h4 className="font-black text-slate-900 text-base truncate pr-2">{n.title}</h4>
                          <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest px-2.5 py-1.5 bg-white border border-slate-200 rounded-md shadow-sm whitespace-nowrap">
                            Target: {n.target_tier.replace('premium_', 'PREMIUM ').toUpperCase()}
                          </span>
                        </div>
                        <p className="text-sm text-slate-600 font-medium mt-1.5 leading-snug line-clamp-2">{n.message}</p>
                        <p className="text-[11px] font-bold text-slate-400 mt-3 flex items-center"><Activity size={12} className="mr-1.5" /> Dep: {new Date(n.created_at).toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                  {notifList.length === 0 && (
                    <div className="p-16 text-center text-slate-400 font-bold flex flex-col items-center">
                      <Activity size={48} className="text-slate-200 mb-4" />
                      No Broadcast logs recorded.
                    </div>
                  )}
                </div>

                {/* Notification Pagination */}
                <div className="p-6 border-t border-slate-100 flex items-center justify-between bg-slate-50/50">
                  <span className="text-sm font-bold text-slate-500">Page {notifPage} of {notifTotalPages} <span className="text-[10px] text-slate-400 ml-1">({notifTotalRecords} Total)</span></span>
                  <div className="flex space-x-2">
                    <button disabled={notifPage === 1} onClick={() => setNotifPage(p => p - 1)} className="px-5 py-2.5 border border-slate-200 rounded-xl text-[13px] font-black disabled:opacity-50 hover:bg-white bg-transparent transition-colors shadow-sm disabled:shadow-none">Prev</button>
                    <button disabled={notifPage === notifTotalPages} onClick={() => setNotifPage(p => p + 1)} className="px-5 py-2.5 border border-slate-200 rounded-xl text-[13px] font-black hover:bg-white bg-transparent transition-colors shadow-sm disabled:opacity-50 disabled:shadow-none">Next</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'promos' && (
          <div className="animate-in fade-in duration-300 max-w-5xl">
            <header className="mb-8">
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">Subscription promo codes</h1>
              <p className="text-slate-500 mt-1 font-medium">
                Create percentage discounts for Razorpay checkout. Users enter the code in the mobile app before paying. Run the SQL in{' '}
                <code className="text-xs bg-slate-100 px-1 rounded">backend/sql/promo_codes.sql</code> once on Supabase if the table is missing.
              </p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <form onSubmit={createPromo} className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-200/60 space-y-5 h-fit">
                <h3 className="text-xl font-black flex items-center gap-2">
                  <Tag className="text-indigo-600" size={22} /> New promo
                </h3>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Code (stored uppercase)</label>
                  <input
                    value={newPromoCode}
                    onChange={(e) => setNewPromoCode(e.target.value)}
                    required
                    className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl font-mono font-bold uppercase"
                    placeholder="WELCOME15"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Discount % (1–100)</label>
                  <input
                    type="number"
                    min={1}
                    max={100}
                    value={newPromoPercent}
                    onChange={(e) => setNewPromoPercent(e.target.value)}
                    required
                    className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Max redemptions (empty = unlimited)</label>
                  <input
                    type="number"
                    min={1}
                    value={newPromoMaxUses}
                    onChange={(e) => setNewPromoMaxUses(e.target.value)}
                    className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl"
                    placeholder="e.g. 100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Expires (optional)</label>
                  <input
                    type="datetime-local"
                    value={newPromoExpires}
                    onChange={(e) => setNewPromoExpires(e.target.value)}
                    className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl"
                  />
                </div>
                <button
                  type="submit"
                  disabled={promoSaving}
                  className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black disabled:opacity-50 hover:bg-indigo-500 transition-colors"
                >
                  {promoSaving ? 'Saving…' : 'Create promo code'}
                </button>
              </form>

              <div className="bg-white rounded-[2rem] shadow-sm border border-slate-200/60 overflow-hidden">
                <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/80">
                  <h3 className="font-black text-lg">Active & past codes</h3>
                </div>
                <div className="divide-y divide-slate-100 max-h-[520px] overflow-y-auto">
                  {promos.map((p) => (
                    <div key={p.id} className="p-5 flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="font-mono font-black text-lg text-slate-900">{p.code}</p>
                        <p className="text-sm text-slate-500 font-medium mt-1">
                          {p.percent_off}% off · used {p.used_count ?? 0}
                          {p.max_uses != null ? ` / ${p.max_uses}` : ' · unlimited uses'}
                          {p.expires_at ? ` · expires ${new Date(p.expires_at).toLocaleString()}` : ''}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => togglePromoActive(p)}
                        className={`px-4 py-2 rounded-xl text-sm font-black ${
                          p.is_active ? 'bg-amber-100 text-amber-900 hover:bg-amber-200' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                        }`}
                      >
                        {p.is_active ? 'Deactivate' : 'Activate'}
                      </button>
                    </div>
                  ))}
                  {promos.length === 0 && (
                    <p className="p-10 text-center text-slate-400 font-medium">No promo codes yet — or the database table is not created.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* User INSPECT Modal Overlay */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-4xl max-h-[85vh] rounded-[2.5rem] shadow-[0_40px_100px_rgba(0,0,0,0.2)] overflow-hidden flex flex-col border border-slate-200">
            <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div>
                <h2 className="text-2xl font-black text-slate-900">{selectedUser.full_name}'s Ledger</h2>
                <p className="text-sm font-bold text-slate-500 mt-1 uppercase tracking-widest">{selectedUser.id}</p>
              </div>
              <button onClick={() => setSelectedUser(null)} className="p-3 bg-slate-200/50 hover:bg-red-100 text-slate-500 hover:text-red-600 rounded-full transition-colors">
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 bg-slate-50/30">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4">
                  <div className="w-14 h-14 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center">
                    <ArrowUpRight size={28} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-400 tracking-wider uppercase mb-1">Total Lifetime Spend</p>
                    <p className="text-2xl font-black text-slate-800">₹ {userTransactions.filter(t => t.type === 'expense').reduce((acc, curr) => acc + curr.amount, 0).toLocaleString()}</p>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4">
                  <div className="w-14 h-14 bg-emerald-50 text-emerald-500 rounded-2xl flex items-center justify-center">
                    <ArrowDownRight size={28} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-400 tracking-wider uppercase mb-1">Total Validated Income</p>
                    <p className="text-2xl font-black text-slate-800">₹ {userTransactions.filter(t => t.type === 'income').reduce((acc, curr) => acc + curr.amount, 0).toLocaleString()}</p>
                  </div>
                </div>
              </div>

              <h3 className="text-lg font-black mb-4">Raw Transaction Stream ({userTransactions.length} logs)</h3>
              {userTransactions.length > 0 ? (
                <div className="bg-white border text-left border-slate-200 rounded-[2rem] overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-slate-50 border-b border-slate-100 text-[11px] font-black text-slate-400 uppercase tracking-widest">
                      <tr><th className="p-5 pl-6">Sector</th><th className="p-5">Type</th><th className="p-5">Note/Metadata</th><th className="p-5 text-right pr-6">Amplitude</th></tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 text-sm font-medium">
                      {userTransactions.map((t, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/50">
                          <td className="p-5 pl-6">{t.categories?.name || 'Unassigned'}</td>
                          <td className="p-5">
                            <span className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase ${t.type === 'income' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>{t.type}</span>
                          </td>
                          <td className="p-5 text-slate-500 truncate max-w-[200px]">{t.note || '-'}</td>
                          <td className={`p-5 text-right font-black pr-6 ${t.type === 'income' ? 'text-emerald-600' : 'text-slate-900'}`}>
                            {t.type === 'income' ? '+' : '-'}{t.amount}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-slate-500 font-medium bg-white p-10 text-center rounded-[2rem] border border-slate-200 border-dashed">No structural transaction data found for this node.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* PROVISION NODE MODAL */}
      {isProvisionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsProvisionModalOpen(false)}></div>
          <div className="relative bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-8">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-black text-slate-900 flex items-center">
                  <Plus className="mr-2 text-emerald-500" /> Provision Node
                </h3>
                <button onClick={() => setIsProvisionModalOpen(false)} className="p-2 text-slate-400 hover:text-slate-700 bg-slate-100 rounded-full transition-colors">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={provisionNodeClient} className="space-y-4">
                <div>
                  <label className="block text-[12px] font-bold text-slate-700 mb-1.5 uppercase tracking-wide">Client Nomenclature</label>
                  <input type="text" value={newUserName} onChange={e => setNewUserName(e.target.value)} required placeholder="e.g. John Doe" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-medium text-slate-900" />
                </div>
                <div>
                  <label className="block text-[12px] font-bold text-slate-700 mb-1.5 uppercase tracking-wide">Secure Communication (Email)</label>
                  <input type="email" value={newUserEmail} onChange={e => setNewUserEmail(e.target.value)} required placeholder="john@example.com" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-medium text-slate-900" />
                </div>
                <div>
                  <label className="block text-[12px] font-bold text-slate-700 mb-1.5 uppercase tracking-wide">Encrypted Token (Phone)</label>
                  <input type="tel" value={newUserPhone} onChange={e => setNewUserPhone(e.target.value)} placeholder="+91 999 000 0000" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-medium text-slate-900" />
                </div>
                <div>
                  <label className="block text-[12px] font-bold text-slate-700 mb-1.5 uppercase tracking-wide">Manual Password <span className="text-[10px] text-slate-400 font-normal lowercase">(Optional auto-generates if empty)</span></label>
                  <input type="text" value={newUserPassword} onChange={e => setNewUserPassword(e.target.value)} placeholder="Leave empty for auto-generation" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-medium text-slate-900" />
                </div>
                <div>
                  <label className="block text-[12px] font-bold text-slate-700 mb-1.5 uppercase tracking-wide">Initial Sub-Tier Allocation</label>
                  <select value={newUserTier} onChange={e => setNewUserTier(e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-medium appearance-none">
                    <option value="free">Standard (Free)</option>
                    <option value="premium_mon">Premium Monthly</option>
                    <option value="premium_yr">Premium Yearly</option>
                    <option value="premium_life">Ultimate Lifetime</option>
                  </select>
                </div>

                <button type="submit" disabled={isProvisioning} className="w-full py-4 mt-2 bg-emerald-600 text-white rounded-xl font-black tracking-wide shadow-lg shadow-emerald-500/20 hover:-translate-y-0.5 hover:bg-emerald-500 transition-all text-[15px] flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed">
                  {isProvisioning ? 'Deploying...' : 'Fire Provision Protocol'}
                </button>
                <p className="text-[11px] text-center text-slate-400 font-medium mt-3 px-2">An automated Welcome transmission with a temporary key will be fired instantly via SMTP.</p>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
