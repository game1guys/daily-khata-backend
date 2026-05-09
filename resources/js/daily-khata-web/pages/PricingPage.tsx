import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Check, X, ArrowLeft, Star, Infinity, Calendar, Clock } from 'lucide-react';

const plans = [
  {
    name: 'Free',
    price: '₹0',
    cycle: '/forever',
    icon: <Clock className="text-slate-400" size={24} />,
    color: 'from-slate-100 to-slate-200',
    textColor: 'text-slate-800',
    buttonAccent: 'bg-slate-200 text-slate-800 hover:bg-slate-300',
    features: [
      { text: 'Daily income/expense entry', included: true },
      { text: 'Basic categories (Food, Travel)', included: true },
      { text: 'Simple monthly summary', included: true },
      { text: 'Limited entries (≈ 100/mo)', included: true },
      { text: 'Limited Udhar (2-3 parties)', included: true },
      { text: 'Ads included', falseText: true, included: false },
      { text: 'Cloud Backup & Sync', included: false },
      { text: 'Custom categories', included: false },
    ],
  },
  {
    name: 'Premium Monthly',
    price: '₹29',
    cycle: '/month',
    icon: <Calendar className="text-blue-500" size={24} />,
    color: 'from-blue-50 to-blue-100',
    textColor: 'text-blue-900',
    buttonAccent: 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-500/30',
    features: [
      { text: 'Unlimited entries & Parties', included: true },
      { text: 'Advanced reports & Charts', included: true },
      { text: 'Custom categories', included: true },
      { text: 'Photo attach bills/receipts', included: true },
      { text: 'Cloud Backup & Sync', included: true },
      { text: 'No Ads', included: true },
    ],
  },
  {
    name: 'Premium Yearly',
    price: '₹199',
    cycle: '/year',
    icon: <Star fill="currentColor" className="text-amber-400" size={24} />,
    highlight: 'Best Value ⭐',
    color: 'from-slate-900 via-slate-800 to-slate-900 text-white',
    textColor: 'text-white',
    buttonAccent: 'bg-gradient-to-r from-amber-400 to-orange-500 text-slate-900 hover:scale-105 shadow-amber-500/40',
    features: [
      { text: 'Unlimited entries & Parties', included: true },
      { text: 'Advanced reports & Charts', included: true },
      { text: 'Custom categories', included: true },
      { text: 'Photo attach bills/receipts', included: true },
      { text: 'Budget limit alerts', included: true },
      { text: 'Cloud Backup & Sync', included: true },
      { text: 'App lock & Export', included: true },
      { text: 'No Ads', included: true },
    ],
  },
  {
    name: 'Premium Lifetime',
    price: '₹699',
    cycle: '/once',
    icon: <Infinity className="text-emerald-500" size={24} />,
    color: 'from-emerald-50 to-teal-100',
    textColor: 'text-teal-900',
    buttonAccent: 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-500/30',
    features: [
      { text: 'All Yearly Features', included: true },
      { text: 'Pay once, use forever', included: true },
      { text: 'Early access to updates', included: true },
      { text: 'VIP Support', included: true },
    ],
  }
];

const PricingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#fafcff] font-sans pb-24 relative overflow-hidden">
      {/* Dynamic Backgrounds */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-gradient-to-b from-blue-300/20 to-transparent rounded-full blur-[100px] -z-10 mix-blend-multiply"></div>
      
      <nav className="fixed w-full z-50 pt-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center h-16">
          <Link to="/" className="inline-flex items-center px-4 py-2 text-sm font-bold rounded-xl bg-white/50 backdrop-blur-md border border-slate-200 text-slate-700 hover:bg-white hover:text-blue-600 hover:shadow-lg transition-all">
            <ArrowLeft className="mr-2" size={18} /> Back to Home
          </Link>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-32 pb-16 relative z-10">
        <motion.div
           initial={{ opacity: 0, scale: 0.9 }}
           animate={{ opacity: 1, scale: 1 }}
           className="inline-flex items-center px-5 py-2 rounded-full bg-blue-100/50 text-blue-700 font-bold text-sm mb-6 border border-blue-200 backdrop-blur-md"
        >
           Choose Your Freedom
        </motion.div>
        <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tight leading-tight">
          Pricing That Makes <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500">Perfect Sense.</span>
        </h1>
        <p className="mt-6 text-xl text-slate-500 max-w-2xl mx-auto font-medium">
          Whether you want to try it free or unlock maximum financial clarity for life, we have a tier designed exactly for you.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-stretch max-w-6xl mx-auto">
          
          {plans.map((plan, idx) => (
            <motion.div 
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
              className={`relative rounded-[2.5rem] p-8 pb-10 shadow-2xl bg-gradient-to-br ${plan.color} border border-white/20 overflow-hidden flex flex-col h-full`}
              style={plan.highlight ? { transform: 'scale(1.03)', zIndex: 10, boxShadow: '0 30px 60px -15px rgba(0,0,0,0.3)' } : {}}
            >
              {plan.highlight && (
                <div className="absolute top-0 left-0 w-full bg-gradient-to-r from-amber-400 to-orange-500 text-center py-1.5 text-xs font-black uppercase tracking-widest text-slate-900">
                  {plan.highlight}
                </div>
              )}
              
              <div className={`mt-${plan.highlight ? '6' : '0'}`}>
                <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center mb-6 shadow-inner border border-white/30">
                  {plan.icon}
                </div>
                
                <h3 className={`text-2xl font-black ${plan.textColor}`}>{plan.name}</h3>
                
                <div className="my-6 flex items-baseline gap-1">
                  <span className={`text-5xl font-black tracking-tighter ${plan.textColor}`}>{plan.price}</span>
                  <span className={`font-semibold opacity-70 ${plan.textColor}`}>{plan.cycle}</span>
                </div>
                
                <button className={`w-full py-4 px-6 rounded-2xl font-bold uppercase tracking-wider text-sm transition-all duration-300 shadow-lg ${plan.buttonAccent}`}>
                  Get {plan.name}
                </button>
              </div>

              <div className="mt-8 flex-1">
                <ul className="space-y-4">
                  {plan.features.map((feature, i) => (
                    <li key={i} className={`flex items-start text-sm font-semibold leading-relaxed ${feature.included ? plan.textColor : 'text-slate-400 opacity-60'}`}>
                      {feature.included ? (
                        <Check className="mr-3 flex-shrink-0 mt-0.5 opacity-80" size={18} />
                      ) : (
                        <X className="mr-3 flex-shrink-0 mt-0.5" size={18} />
                      )}
                      <span className={'falseText' in feature && feature.falseText ? 'line-through' : ''}>{feature.text}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}

        </div>
      </div>
    </div>
  );
};

export default PricingPage;
