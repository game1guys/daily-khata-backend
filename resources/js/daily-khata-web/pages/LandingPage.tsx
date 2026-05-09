import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  ArrowRight, Wallet, PieChart, ShieldCheck, Download, ChevronRight,
  CheckCircle2, Users, TrendingUp, Lock, Smartphone, Cloud, Star, Menu, X
} from 'lucide-react';

/* Using local images from assets folder */
import logoImg from '../assets/logo.png';
import mockupImg from '../assets/mockups.jpg';
import promo2Img from '../assets/promo2.jpg';
import Footer from '../components/Footer';

const LandingPage: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#fafcff] overflow-hidden font-sans relative">

      {/* Intense Ambient Orbs Background */}
      <div className="absolute top-0 right-0 w-[1400px] h-[1400px] bg-gradient-to-br from-blue-600/10 via-purple-600/10 to-emerald-400/5 rounded-full blur-[150px] -z-10 translate-x-1/4 -translate-y-1/4 mix-blend-multiply pointer-events-none"></div>
      <div className="absolute top-[40%] left-0 w-[1000px] h-[1000px] bg-gradient-to-tr from-sky-400/10 via-indigo-600/5 to-transparent rounded-full blur-[120px] -z-10 -translate-x-1/2 pointer-events-none"></div>

      {/* Ultra-Rich Glass Navbar */}
      <nav className="fixed w-full z-50 top-0 pt-4 px-4 sm:px-6 lg:px-8">
        <div className={`max-w-[1400px] mx-auto flex flex-col md:flex-row items-center justify-between bg-white/70 backdrop-blur-2xl border border-white/60 shadow-[0_15px_40px_-15px_rgba(0,0,0,0.06)] rounded-[2rem] px-6 sm:px-12 transition-all ${isMobileMenuOpen ? 'pb-4' : ''}`}>

          <div className="flex w-full md:w-auto items-center justify-between h-[5.5rem] md:h-[6.5rem]">
            <Link to="/" className="flex items-center gap-4">
              <img src={logoImg} alt="Daily Khata Logo" className="h-[4.5rem] sm:h-[5.5rem] md:h-[7rem] scale-[1.3] md:scale-[1.4] transform-gpu w-auto object-contain drop-shadow-sm ml-2 md:ml-4" />
              <span className="text-[1.8rem] font-black tracking-tighter text-slate-900 hidden lg:block ml-4">
                Daily-KHATA
              </span>
            </Link>

            <button
              className="md:hidden text-slate-800 p-2.5 bg-slate-100/60 hover:bg-slate-200/80 rounded-xl transition-colors focus:outline-none border border-slate-200/50"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>

          <div className={`${isMobileMenuOpen ? 'flex' : 'hidden'} md:flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 w-full md:w-auto pb-4 md:pb-0 pt-2 md:pt-0`}>
            <a href="#hero" onClick={() => setIsMobileMenuOpen(false)} className="w-full text-center md:w-auto px-5 py-3 text-[16px] font-bold text-slate-600 hover:text-blue-600 hover:bg-slate-100/80 rounded-2xl transition-all">Home</a>
            <a href="#features" onClick={() => setIsMobileMenuOpen(false)} className="w-full text-center md:w-auto px-5 py-3 text-[16px] font-bold text-slate-600 hover:text-blue-600 hover:bg-slate-100/80 rounded-2xl transition-all">Platform</a>
            <a href="#testimonials" onClick={() => setIsMobileMenuOpen(false)} className="w-full text-center md:w-auto px-5 py-3 text-[16px] font-bold text-slate-600 hover:text-blue-600 hover:bg-slate-100/80 rounded-2xl transition-all">Stories</a>
            <Link to="/pricing" onClick={() => setIsMobileMenuOpen(false)} className="w-full text-center md:w-auto px-5 py-3 text-[16px] font-bold text-blue-600 bg-blue-50/80 md:bg-transparent md:text-slate-600 md:hover:text-blue-600 hover:bg-blue-100/80 rounded-2xl transition-all">Pricing</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="hero" className="pt-[13rem] pb-24 relative max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-20 relative z-10">
          <div className="w-full lg:w-1/2 flex flex-col items-start xl:pr-10">
            <div className="inline-flex items-center px-4 py-2 rounded-full border border-sky-200 bg-sky-50/80 backdrop-blur-sm mb-8 shadow-sm">
              <span className="flex h-2.5 w-2.5 rounded-full bg-blue-600 mr-2 animate-pulse"></span>
              <span className="text-sm font-bold text-blue-700 uppercase tracking-widest text-[11px]">V 2.0 Is Live Globally</span>
            </div>

            <h1 className="text-6xl md:text-[5rem] lg:text-[6rem] font-black tracking-tighter text-slate-900 mb-6 leading-[1.05] drop-shadow-sm">
              Master Your Money <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 pb-2 inline-block">
                With Zero Effort.
              </span>
            </h1>

            <p className="mt-4 text-xl lg:text-[1.4rem] text-slate-600 font-medium leading-relaxed max-w-xl">
              From daily micro-expenses to complex enterprise ledgers. The world's most powerful, gorgeous, and intelligent finance tracker has arrived.
            </p>

            <div className="mt-12 flex flex-col sm:flex-row gap-5 w-full">
              <a href="#download" className="px-9 py-5 text-[17px] font-black rounded-[1.5rem] text-white bg-blue-600 hover:bg-blue-700 shadow-[0_20px_40px_-15px_rgba(37,99,235,0.5)] hover:shadow-[0_30px_60px_-15px_rgba(37,99,235,0.6)] hover:-translate-y-1 transition-all flex items-center justify-center gap-3">
                <Download size={22} /> Download The App
              </a>
              <Link to="/pricing" className="px-9 py-5 text-[17px] font-bold rounded-[1.5rem] text-slate-700 bg-white border-2 border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all flex items-center justify-center gap-2">
                Explore Pricing <ChevronRight size={22} />
              </Link>
            </div>

            <div className="mt-12 flex items-center gap-4 text-sm font-semibold text-slate-500">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map(i => (
                  <img key={i} src={`https://i.pravatar.cc/100?img=${i + 10}`} className="w-10 h-10 rounded-full border-2 border-white drop-shadow-sm" alt="User" />
                ))}
                <div className="w-10 h-10 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600 z-10">+2M</div>
              </div>
              <div>Trusted by 2,000,000+ businesses</div>
            </div>
          </div>

          <div className="w-full lg:w-1/2 relative">
            <div className="absolute inset-0 bg-gradient-to-bl from-blue-500/20 to-emerald-500/20 rounded-[3rem] blur-3xl -z-10 rotate-3"></div>
            <img
              src={mockupImg}
              alt="Daily Khata Platform Preview"
              className="w-full h-auto object-cover rounded-[3rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)] ring-2 ring-white/60"
            />
          </div>
        </div>
      </section>

      {/* Featured Brands Logos */}
      <section className="border-y border-slate-200/60 bg-white py-12">
        <div className="max-w-[1400px] mx-auto px-4 text-center">
          <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-8">Featured By Top Financial Institutions</p>
          <div className="flex flex-wrap justify-center gap-12 lg:gap-24 opacity-40 grayscale items-center">
            <h1 className="text-3xl font-black font-serif">FORBES.</h1>
            <h1 className="text-3xl font-black">TechCrunch</h1>
            <h1 className="text-3xl font-black italic tracking-tighter">WIRED</h1>
            <h1 className="text-3xl font-black uppercase font-mono">Bloomberg</h1>
            <h1 className="text-3xl font-black font-sans">Inc.</h1>
          </div>
        </div>
      </section>

      {/* Mega Features Grid */}
      <section id="features" className="py-32 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-5xl font-black text-slate-900 tracking-tight leading-tight mb-6">Designed to replace <br />every spreadsheet.</h2>
          <p className="text-xl text-slate-600 font-medium">Daily Khata acts as your single source of truth. Manage cash, reconcile bank statements, and resolve udhars with a unified dashboard.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            { title: "Smart Tracking", icon: <Wallet size={24} />, color: "text-blue-600", bg: "bg-blue-100/80", border: "hover:border-blue-300", shadow: "hover:shadow-blue-500/10", desc: "Instantly categorize inflows and outflows. Artificial intelligence helps suggest the right buckets for every receipt." },
            { title: "Deep Analytics", icon: <PieChart size={24} />, color: "text-purple-600", bg: "bg-purple-100/80", border: "hover:border-purple-300", shadow: "hover:shadow-purple-500/10", desc: "Forget calculators. Gain immediate multi-dimensional insights on expenditure limits and profit growth trajectories." },
            { title: "Secure Lock", icon: <Lock size={24} />, color: "text-emerald-600", bg: "bg-emerald-100/80", border: "hover:border-emerald-300", shadow: "hover:shadow-emerald-500/10", desc: "Your data is locked behind 256-bit AES encryption. Support for Biometrics, FaceID, and local PIN patterns." },
            { title: "Multi-Party Udhar", icon: <Users size={24} />, color: "text-orange-600", bg: "bg-orange-100/80", border: "hover:border-orange-300", shadow: "hover:shadow-orange-500/10", desc: "Manage credit dynamically. Automatically send WhatsApp reminders with attached invoice photos." },
            { title: "Cloud Synchronization", icon: <Cloud size={24} />, color: "text-sky-600", bg: "bg-sky-100/80", border: "hover:border-sky-300", shadow: "hover:shadow-sky-500/10", desc: "Login from your Mac, PC, or phone. Data sits safely in the cloud, syncing instantly across every connected endpoint." },
            { title: "Cross-Platform App", icon: <Smartphone size={24} />, color: "text-pink-600", bg: "bg-pink-100/80", border: "hover:border-pink-300", shadow: "hover:shadow-pink-500/10", desc: "Native iOS and Android applications written for perfect 120Hz scrolling, ensuring a buttery smooth offline experience." },
          ].map((feat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className={`p-10 rounded-[2rem] bg-white border border-slate-200 shadow-sm transition-all duration-300 hover:-translate-y-2 ${feat.border} ${feat.shadow} hover:shadow-2xl cursor-default`}
            >
              <div className={`w-14 h-14 rounded-2xl ${feat.bg} flex items-center justify-center ${feat.color} mb-6`}>
                {feat.icon}
              </div>
              <h3 className="text-2xl font-black text-slate-800 tracking-tight mb-4">{feat.title}</h3>
              <p className="text-[15px] font-medium text-slate-600 leading-relaxed">{feat.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Split Section 1: Dashboard Flow */}
      <section className="py-24 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12 relative">
        <div className="flex flex-col md:flex-row items-center gap-16 lg:gap-24">

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
            className="w-full md:w-1/2 relative group"
          >
            <div className="absolute inset-0 bg-blue-500 rounded-[3rem] blur-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-700"></div>
            {/* Horizonatal High Quality Image from Unsplash */}
            <img
              src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1400&q=80"
              alt="Macbook showing rich analytics"
              className="w-full aspect-[4/3] object-cover object-left-top rounded-[3rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] border border-white/80 relative z-10 hover:scale-[1.02] transition-transform duration-700"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
            className="w-full md:w-1/2"
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 mb-6 leading-[1.1] tracking-tighter">
              Track. Save. Grow. <br />
              <span className="text-blue-600">Simultaneously.</span>
            </h2>
            <p className="text-lg text-slate-600 font-medium leading-relaxed mb-10 max-w-lg">
              Daily KHATA is heavily engineered to automate your financial behaviors. We don't just record transactions; we predict patterns. By mapping your core expenses, we prevent leakage before it happens.
            </p>
            <ul className="space-y-6">
              <li className="flex items-center gap-5">
                <div className="flex-shrink-0 w-12 h-12 bg-white shadow-md text-emerald-600 rounded-full flex items-center justify-center border border-slate-100"><ShieldCheck size={22} /></div>
                <div className="flex flex-col"><span className="font-bold text-slate-800 text-[16px] tracking-wide">Military-Grade Storage</span><span className="text-sm text-slate-500 font-medium">AWS redundant backups instantly.</span></div>
              </li>
              <li className="flex items-center gap-5">
                <div className="flex-shrink-0 w-12 h-12 bg-white shadow-md text-blue-600 rounded-full flex items-center justify-center border border-slate-100"><TrendingUp size={22} /></div>
                <div className="flex flex-col"><span className="font-bold text-slate-800 text-[16px] tracking-wide">Automated Budget Algorithms</span><span className="text-sm text-slate-500 font-medium">Smart spending limits computed dynamically.</span></div>
              </li>
            </ul>
          </motion.div>
        </div>
      </section>

      {/* Break Out Metrics Banner */}
      <section className="my-20 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-blue-700 via-indigo-800 to-purple-900 rounded-[3rem] shadow-2xl overflow-hidden relative">
          <div className="absolute top-0 right-0 w-full h-full bg-[url('https://images.unsplash.com/photo-1639322537228-f710d846310a?w=1000')] bg-cover opacity-10 mix-blend-overlay"></div>
          <div className="py-20 px-10 text-center relative z-10 flex flex-col items-center">
            <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter mb-8 max-w-3xl">Ready to revolutionize your personal accounting?</h2>
            <div className="flex flex-col sm:flex-row gap-8 justify-center items-center">
              <div className="flex items-center gap-3 text-white">
                <CheckCircle2 className="text-emerald-400" size={28} /> <span className="text-xl font-bold">14-Day Free Premium</span>
              </div>
              <div className="flex items-center gap-3 text-white">
                <CheckCircle2 className="text-emerald-400" size={28} /> <span className="text-xl font-bold">Seamless Data Import</span>
              </div>
              <div className="flex items-center gap-3 text-white">
                <CheckCircle2 className="text-emerald-400" size={28} /> <span className="text-xl font-bold">Lifetime Value</span>
              </div>
            </div>
            <Link to="/pricing" className="mt-12 px-10 py-5 bg-white text-slate-900 rounded-2xl font-black text-lg hover:scale-105 transition-all shadow-xl shadow-white/10">Start Your Free Trial</Link>
          </div>
        </div>
      </section>

      {/* Split Section 2: Visual Analytics */}
      <section className="py-24 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12 relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-center gap-16 lg:gap-24">
          <motion.div
            initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
            className="w-full md:w-1/2 md:order-1 order-2"
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 mb-6 leading-[1.1] tracking-tighter">
              Visualizing finances <br />has never been so <br />
              <span className="text-[#a855f7]">intuitive.</span>
            </h2>
            <p className="text-lg text-slate-600 font-medium leading-relaxed mb-10 max-w-lg">
              If your books look like messy spreadsheets, you'll never understand the flow. We convert your raw financial data into highly interactive, zoomable, and filterable visual charts.
            </p>
            <Link to="/pricing" className="inline-flex items-center gap-3 px-8 py-4 bg-white border border-slate-200 hover:border-purple-300 shadow-md hover:shadow-lg rounded-2xl font-bold text-slate-800 transition-all text-[15px] uppercase tracking-wide">
              Tap into Premium Analytics <ArrowRight size={18} className="text-purple-500" />
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
            className="w-full md:w-1/2 md:order-2 order-1 relative group"
          >
            <div className="absolute inset-0 bg-purple-500 rounded-[3rem] blur-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-700"></div>
            {/* The promo2Img that user wants to retain, horizontal representation */}
            <img
              src={promo2Img}
              alt="Visual analytics"
              className="w-full aspect-[4/3] object-cover rounded-[3rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] border border-white/80 relative z-10 transition-transform duration-700 group-hover:scale-[1.02]"
            />
          </motion.div>
        </div>
      </section>

      {/* How it Works / Workflow section */}
      <section className="py-24 bg-white/50 border-y border-slate-200/50">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-black text-slate-900">How to achieve Zero Balance.</h2>
            <p className="mt-4 text-xl text-slate-500 font-medium">Three steps to absolute financial clarity.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center relative">
            <div className="hidden md:block absolute top-[4rem] left-[16%] w-[68%] h-0.5 border-t-2 border-dashed border-slate-300 -z-10"></div>

            <div className="flex flex-col items-center">
              <div className="w-32 h-32 rounded-full bg-white border-8 border-slate-50 shadow-xl flex items-center justify-center text-4xl font-black text-blue-600 mb-8 z-10">1</div>
              <h3 className="text-2xl font-black text-slate-800 mb-3">Install & Sync</h3>
              <p className="text-slate-500 font-medium px-4">Download the app, log in, and let your baseline structure be built in the secure cloud.</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-32 h-32 rounded-full bg-white border-8 border-slate-50 shadow-xl flex items-center justify-center text-4xl font-black text-blue-600 mb-8 z-10">2</div>
              <h3 className="text-2xl font-black text-slate-800 mb-3">Add Income</h3>
              <p className="text-slate-500 font-medium px-4">Register your monthly capitals. Attach receipts instantly by clicking pictures.</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-32 h-32 rounded-full bg-white border-8 border-slate-50 shadow-xl flex items-center justify-center text-4xl font-black text-blue-600 mb-8 z-10">3</div>
              <h3 className="text-2xl font-black text-slate-800 mb-3">Automate Growth</h3>
              <p className="text-slate-500 font-medium px-4">Spend normally. Let Daily KHATA notify you of budget thresholds & Udhar collections.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-32 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h2 className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">Wall of Love</h2>
          <p className="mt-4 text-xl text-slate-500 font-medium">See what serious users are saying about Daily-KHATA.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { name: "Rahul Sharma", role: "Freelance Designer", txt: "It's genuinely shocking how good this application is. The charts render instantly and parsing my 2,000 yearly expenses feels completely buttery smooth." },
            { name: "Sneha Patel", role: "Small Business Owner", txt: "The Udhar feature alone made me upgrade to Premium. Tracking which distributor owes me money via WhatsApp integrations is magical." },
            { name: "Arjun Verma", role: "Software Engineer", txt: "The UI is immaculate. You can easily tell the difference between typical apps and something crafted with extreme passion. Daily-KHATA is the latter." },
          ].map((r, i) => (
            <div key={i} className="p-8 pb-10 rounded-[2rem] bg-white border border-slate-200 shadow-sm relative pt-12">
              <div className="absolute -top-6 left-8 w-14 h-14 rounded-full border-4 border-[#fafcff] bg-blue-100 flex items-center justify-center overflow-hidden">
                <img src={`https://i.pravatar.cc/150?u=${i + 100}`} alt="avatar" />
              </div>
              <div className="flex gap-1 mb-4 text-amber-400">
                <Star fill="currentColor" size={16} /><Star fill="currentColor" size={16} /><Star fill="currentColor" size={16} /><Star fill="currentColor" size={16} /><Star fill="currentColor" size={16} />
              </div>
              <p className="text-slate-700 font-medium leading-relaxed italic text-lg mb-6">"{r.txt}"</p>
              <h4 className="font-bold text-slate-900 text-[15px]">{r.name}</h4>
              <p className="text-sm text-slate-500 font-medium">{r.role}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer component replaces the huge block */}
      <Footer />
    </div>
  );
};

export default LandingPage;
