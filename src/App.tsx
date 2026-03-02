/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { 
  Search, 
  ChevronRight, 
  CreditCard, 
  ArrowUpRight, 
  ArrowDownLeft, 
  LayoutDashboard, 
  History, 
  Wallet, 
  ShieldCheck, 
  LogOut,
  User,
  Bell,
  Menu,
  X,
  Smartphone,
  Landmark,
  Plus
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// --- Types ---

type View = 'login' | 'dashboard' | 'transfer' | 'transactions' | 'loans' | 'cards' | 'settings' | 'beneficiaries' | 'profile';

interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: 'credit' | 'debit';
  category: string;
  status: 'Completed' | 'Pending' | 'Failed';
  referenceId: string;
}

interface Bank {
  id: string;
  name: string;
  logo: string;
}

interface Beneficiary {
  id: string;
  name: string;
  accountNumber: string;
  sortCode: string;
  bankName: string;
}

// --- Mock Data ---

const USER_PROFILE = {
  name: "Mr. Arthur Sterling",
  fullName: "Arthur Sterling",
  age: 59,
  gender: "Male",
  sex: "Male",
  membershipNumber: "4356731456",
  email: "arthur.sterling@barclays-wealth.com",
  phone: "+44 7700 900521",
  address: "15-17 Grosvenor Gardens, London SW1W 0BD, United Kingdom",
  kycStatus: "Verified",
  status: "UK Taxpayer - Royal Household Member",
  accounts: [
    { type: "Current Account", balance: 3000000.00, currency: "GBP", number: "20-33-55 12345678" },
    { type: "Savings Account", balance: 200000.00, currency: "GBP", number: "20-33-55 87654321" }
  ],
  manager: {
    name: "Sarah Jenkins",
    role: "Senior Wealth Manager",
    phone: "+44 20 7123 4567"
  }
};

const BANKS: Bank[] = [
  { id: '1', name: 'HSBC UK', logo: 'H' },
  { id: '2', name: 'Lloyds Bank', logo: 'L' },
  { id: '3', name: 'NatWest', logo: 'N' },
  { id: '4', name: 'Santander UK', logo: 'S' },
  { id: '5', name: 'Nationwide', logo: 'N' },
  { id: '6', name: 'Royal Bank of Scotland', logo: 'R' },
  { id: '7', name: 'Halifax', logo: 'H' },
  { id: '8', name: 'Monzo', logo: 'M' },
  { id: '9', name: 'Starling Bank', logo: 'S' },
  { id: '10', name: 'Revolut', logo: 'R' },
  { id: '11', name: 'Standard Chartered', logo: 'S' },
  { id: '12', name: 'Tesco Bank', logo: 'T' },
  { id: '13', name: 'Sainsbury\'s Bank', logo: 'S' },
  { id: '14', name: 'Virgin Money', logo: 'V' },
  { id: '15', name: 'TSB Bank', logo: 'T' },
  { id: '16', name: 'Metro Bank', logo: 'M' },
  { id: '17', name: 'Clydesdale Bank', logo: 'C' },
  { id: '18', name: 'Yorkshire Bank', logo: 'Y' },
  { id: '19', name: 'Co-operative Bank', logo: 'C' },
  { id: '20', name: 'First Direct', logo: 'F' },
];

const GENERATE_TRANSACTIONS = (): Transaction[] => {
  const baseTransactions: Transaction[] = [
    { id: 't1', date: '2024-02-28', description: 'Waitrose & Partners', amount: 84.50, type: 'debit', category: 'Groceries', status: 'Completed', referenceId: 'REF-88219' },
    { id: 't2', date: '2024-02-27', description: 'Shell Fuel Station', amount: 75.00, type: 'debit', category: 'Transport', status: 'Completed', referenceId: 'REF-11203' },
    { id: 't3', date: '2024-02-25', description: 'Dividend Payment - BP PLC', amount: 12500.00, type: 'credit', category: 'Investment', status: 'Completed', referenceId: 'REF-99210' },
    { id: 't4', date: '2024-02-20', description: 'HMRC Tax Refund', amount: 4200.00, type: 'credit', category: 'Tax', status: 'Completed', referenceId: 'REF-44129' },
    { id: 't5', date: '2019-11-12', description: 'Initial Deposit - Inheritance', amount: 2500000.00, type: 'credit', category: 'Transfer', status: 'Completed', referenceId: 'REF-00001' },
    { id: 't6', date: '2019-08-05', description: 'Land Registry Fees', amount: 1200.00, type: 'debit', category: 'Legal', status: 'Completed', referenceId: 'REF-00002' },
    { id: 't7', date: '2020-05-15', description: 'Sotheby\'s Auction House', amount: 45000.00, type: 'debit', category: 'Luxury', status: 'Completed', referenceId: 'REF-00003' },
  ];

  const merchants = ['Amazon', 'Apple Store', 'Netflix', 'Spotify', 'Uber', 'Starbucks', 'Tesco', 'Sainsbury\'s', 'Zara', 'H&M', 'British Airways', 'Trainline'];
  const categories = ['Shopping', 'Entertainment', 'Transport', 'Groceries', 'Travel'];

  for (let i = 8; i <= 35; i++) {
    const isDebit = Math.random() > 0.2;
    baseTransactions.push({
      id: `t${i}`,
      date: `2024-01-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
      description: merchants[Math.floor(Math.random() * merchants.length)],
      amount: Math.floor(Math.random() * 500) + 10,
      type: isDebit ? 'debit' : 'credit',
      category: categories[Math.floor(Math.random() * categories.length)],
      status: Math.random() > 0.1 ? 'Completed' : 'Pending',
      referenceId: `REF-${Math.floor(Math.random() * 90000) + 10000}`
    });
  }

  return baseTransactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

const TRANSACTIONS = GENERATE_TRANSACTIONS();

const INITIAL_BENEFICIARIES: Beneficiary[] = [
  { id: 'b1', name: 'James Wilson', accountNumber: '88776655', sortCode: '10-20-30', bankName: 'HSBC UK' },
  { id: 'b2', name: 'Emma Thompson', accountNumber: '11223344', sortCode: '40-50-60', bankName: 'Lloyds Bank' },
];

// --- Components ---

const BarclaysLogo = ({ className = "h-8" }: { className?: string }) => (
  <div className={`flex items-center gap-2 ${className}`}>
    <svg viewBox="0 0 100 100" className="h-full fill-[#00aeef]">
      <path d="M50 5L10 25V75L50 95L90 75V25L50 5ZM50 15L80 30V70L50 85L20 70V30L50 15Z" />
      <path d="M50 30L35 45H45V70H55V45H65L50 30Z" />
    </svg>
    <span className="font-bold text-[#00395d] tracking-widest text-xl">BARCLAYS</span>
  </div>
);

export default function App() {
  const [view, setView] = useState<View>('login');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCardFrozen, setIsCardFrozen] = useState(false);
  const [transferStep, setTransferStep] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBank, setSelectedBank] = useState<Bank | null>(null);
  const [transferData, setTransferData] = useState({
    accountNumber: '',
    sortCode: '',
    amount: '',
    reference: ''
  });
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [transactionSearch, setTransactionSearch] = useState('');
  const [transactionFilter, setTransactionFilter] = useState({
    type: 'all',
    status: 'all'
  });

  const filteredBanks = useMemo(() => 
    BANKS.filter(bank => bank.name.toLowerCase().includes(searchQuery.toLowerCase())),
    [searchQuery]
  );

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const lastName = formData.get('lastName')?.toString().toLowerCase();
    const membership = formData.get('membership')?.toString();

    if (lastName === 'arthur' && membership === '4356731456') {
      setView('dashboard');
    } else {
      alert('Invalid login details. Please use: \nLast Name: arthur \nMembership: 4356731456');
    }
  };

  const renderLogin = () => (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="bg-white border-b border-slate-200 p-4 flex justify-between items-center">
        <BarclaysLogo />
        <div className="flex items-center gap-2 text-[#00395d] font-medium">
          <ShieldCheck size={20} />
          <span>Secure</span>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-md bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="bg-[#00aeef] p-8 text-white">
            <h1 className="text-3xl font-light mb-2">Log in to Online Banking</h1>
            <p className="text-white/80">How would you like to log in?</p>
          </div>

          <form onSubmit={handleLogin} className="p-8 space-y-6">
            <div className="flex border-b border-slate-200 mb-6">
              <button type="button" className="flex-1 pb-4 border-b-2 border-[#00aeef] text-[#00395d] font-medium">Membership number</button>
              <button type="button" className="flex-1 pb-4 text-slate-400">Card number</button>
              <button type="button" className="flex-1 pb-4 text-slate-400">Sort code</button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Last name</label>
                <input 
                  type="text" 
                  name="lastName"
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#00aeef] focus:border-transparent outline-none transition-all"
                  placeholder="e.g. arthur"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Membership number (10 digits)</label>
                <input 
                  type="text" 
                  name="membership"
                  maxLength={10}
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#00aeef] focus:border-transparent outline-none transition-all"
                  placeholder="e.g. 4356731456"
                  required
                />
                <button type="button" className="text-[#00aeef] text-sm mt-2 hover:underline">Don't know your membership number?</button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input type="checkbox" id="remember" className="rounded text-[#00aeef]" />
              <label htmlFor="remember" className="text-sm text-slate-600">Remember my last name and login method (optional)</label>
            </div>

            <button 
              type="submit"
              className="w-full bg-[#00aeef] hover:bg-[#008cc0] text-white font-bold py-4 rounded-full transition-colors shadow-lg shadow-[#00aeef]/20"
            >
              Continue
            </button>
          </form>

          <div className="p-8 bg-slate-50 border-t border-slate-200">
            <h3 className="font-bold text-[#00395d] mb-4">Frequently asked questions</h3>
            <ul className="space-y-3 text-sm text-[#00aeef]">
              <li className="hover:underline cursor-pointer">How do I register for Online Banking?</li>
              <li className="hover:underline cursor-pointer">What is my membership number?</li>
              <li className="hover:underline cursor-pointer">I've forgotten my passcode</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );

  const renderDashboard = () => (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 bg-black/50 z-[60]"
            />
            <motion.div 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-80 bg-[#00395d] text-white z-[70] p-6 shadow-2xl"
            >
              <div className="flex justify-between items-center mb-12">
                <BarclaysLogo className="h-6 invert brightness-0" />
                <button onClick={() => setIsSidebarOpen(false)} className="p-2 hover:bg-white/10 rounded-lg">
                  <X size={24} />
                </button>
              </div>

              <div className="mb-8 p-4 bg-white/10 rounded-2xl">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-[#00aeef] rounded-full flex items-center justify-center text-white font-bold">
                    {USER_PROFILE.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <p className="font-bold text-sm">{USER_PROFILE.name}</p>
                    <p className="text-[10px] text-white/60">ID: {USER_PROFILE.membershipNumber}</p>
                  </div>
                </div>
                <div className="space-y-2 text-[10px] text-white/80">
                  <p className="flex items-center gap-2"><Smartphone size={12} /> {USER_PROFILE.age} years old • {USER_PROFILE.sex}</p>
                  <p className="flex items-center gap-2 truncate"><User size={12} /> {USER_PROFILE.email}</p>
                </div>
                <div className="mt-4 flex gap-2">
                  <button onClick={() => { setView('profile'); setIsSidebarOpen(false); }} className="flex-1 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-[10px] font-bold transition-colors">Edit Profile</button>
                  <button onClick={() => { setView('login'); setIsSidebarOpen(false); }} className="flex-1 py-1.5 bg-red-500/20 hover:bg-red-500/40 text-red-300 rounded-lg text-[10px] font-bold transition-colors">Log out</button>
                </div>
              </div>

              <nav className="space-y-2">
                <button onClick={() => { setView('dashboard'); setIsSidebarOpen(false); }} className="w-full flex items-center gap-4 p-4 rounded-xl hover:bg-white/10 transition-colors">
                  <LayoutDashboard size={20} /> <span className="font-medium">Dashboard</span>
                </button>
                <button onClick={() => { setView('profile'); setIsSidebarOpen(false); }} className="w-full flex items-center gap-4 p-4 rounded-xl hover:bg-white/10 transition-colors">
                  <User size={20} /> <span className="font-medium">Profile Management</span>
                </button>
                <button onClick={() => { setView('transactions'); setIsSidebarOpen(false); }} className="w-full flex items-center gap-4 p-4 rounded-xl hover:bg-white/10 transition-colors">
                  <History size={20} /> <span className="font-medium">Transactions</span>
                </button>
                <button onClick={() => { setView('transfer'); setIsSidebarOpen(false); }} className="w-full flex items-center gap-4 p-4 rounded-xl hover:bg-white/10 transition-colors">
                  <ArrowUpRight size={20} /> <span className="font-medium">Payments</span>
                </button>
                <button onClick={() => { setView('cards'); setIsSidebarOpen(false); }} className="w-full flex items-center gap-4 p-4 rounded-xl hover:bg-white/10 transition-colors">
                  <CreditCard size={20} /> <span className="font-medium">Cards</span>
                </button>
                <button onClick={() => { setView('loans'); setIsSidebarOpen(false); }} className="w-full flex items-center gap-4 p-4 rounded-xl hover:bg-white/10 transition-colors">
                  <Landmark size={20} /> <span className="font-medium">Loans</span>
                </button>
                <div className="h-px bg-white/10 my-4" />
                <button onClick={() => { setView('settings'); setIsSidebarOpen(false); }} className="w-full flex items-center gap-4 p-4 rounded-xl hover:bg-white/10 transition-colors text-left">
                  <ShieldCheck size={20} className="shrink-0" /> <span className="font-medium">Settings & 2FA</span>
                </button>
                <button onClick={() => { setView('login'); setIsSidebarOpen(false); }} className="w-full flex items-center gap-4 p-4 rounded-xl hover:bg-red-500/20 text-red-400 transition-colors">
                  <LogOut size={20} /> <span className="font-medium">Log out</span>
                </button>
              </nav>

              <div className="absolute bottom-8 left-6 right-6 p-4 bg-white/5 rounded-2xl">
                <p className="text-xs text-white/40 uppercase font-bold mb-2">Account Manager</p>
                <p className="font-bold">{USER_PROFILE.manager.name}</p>
                <p className="text-xs text-white/60">{USER_PROFILE.manager.role}</p>
                <button className="w-full mt-4 py-2 bg-[#00aeef] rounded-full text-sm font-bold">Call Manager</button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <header className="bg-[#00395d] text-white p-4 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsSidebarOpen(true)} className="p-2 hover:bg-white/10 rounded-lg">
              <Menu size={24} />
            </button>
            <BarclaysLogo className="h-6 invert brightness-0" />
          </div>
          <div className="flex items-center gap-4">
            <Bell size={20} className="text-white/80" />
            <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full">
              <div className="w-6 h-6 bg-[#00aeef] rounded-full flex items-center justify-center text-[10px] font-bold">AS</div>
              <span className="text-sm font-medium">Arthur</span>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-5xl mx-auto w-full p-4 md:p-8 space-y-8">
        {/* Improved Profile Management Section on Home Page */}
        <section className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
            <h3 className="font-bold text-[#00395d] text-lg flex items-center gap-2">
              <User size={20} className="text-[#00aeef]" /> Profile & Security Hub
            </h3>
            <div className="flex gap-2">
              <button onClick={() => setView('profile')} className="px-4 py-1.5 bg-[#00aeef] text-white text-xs font-bold rounded-full hover:bg-[#008cc0] transition-colors">Manage Profile</button>
              <button onClick={() => setView('settings')} className="px-4 py-1.5 border border-slate-200 text-[#00395d] text-xs font-bold rounded-full hover:bg-slate-50 transition-colors">Security Settings</button>
            </div>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="space-y-4">
              <div>
                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mb-1">Personal Details</p>
                <p className="text-sm font-bold text-[#00395d]">{USER_PROFILE.fullName}</p>
                <p className="text-xs text-slate-500 truncate">{USER_PROFILE.email}</p>
                <p className="text-xs text-slate-500">{USER_PROFILE.phone}</p>
              </div>
              <div className="pt-4 border-t border-slate-100">
                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mb-1">KYC & Identity</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-full text-[10px] font-bold">
                    <ShieldCheck size={12} /> {USER_PROFILE.kycStatus}
                  </span>
                  <span className="text-[10px] text-slate-400">Verified 2024</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mb-1">Security Status</p>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500">2FA Protection</span>
                    <span className="text-emerald-600 font-bold flex items-center gap-1"><ShieldCheck size={12} /> Active</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500">Device Trust</span>
                    <span className="text-emerald-600 font-bold">Trusted</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500">Last Login</span>
                    <span className="text-[#00395d] font-medium">Today, 16:00</span>
                  </div>
                </div>
              </div>
              <div className="pt-4 border-t border-slate-100">
                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mb-1">Digital Documents</p>
                <button className="text-[10px] text-[#00aeef] font-bold hover:underline flex items-center gap-1 mt-1">
                  View Tax Certificates <ChevronRight size={12} />
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mb-1">Transfer Limits</p>
                <div className="mt-2">
                  <div className="flex justify-between text-[10px] mb-1">
                    <span className="text-slate-500">Daily Limit</span>
                    <span className="text-[#00395d] font-bold">£25k / £100k</span>
                  </div>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full">
                    <div className="bg-[#00aeef] h-full w-1/4 rounded-full" />
                  </div>
                </div>
              </div>
              <div className="pt-4 border-t border-slate-100">
                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mb-1">Linked Services</p>
                <div className="flex gap-2 mt-2">
                  <div className="w-6 h-6 bg-slate-100 rounded flex items-center justify-center text-[10px] font-bold text-slate-400">P</div>
                  <div className="w-6 h-6 bg-slate-100 rounded flex items-center justify-center text-[10px] font-bold text-slate-400">A</div>
                  <div className="w-6 h-6 bg-slate-100 rounded flex items-center justify-center text-[10px] font-bold text-slate-400">G</div>
                </div>
              </div>
            </div>

            <div className="bg-[#00395d] p-4 rounded-xl text-white flex flex-col justify-between">
              <div>
                <p className="text-[10px] text-white/40 uppercase font-bold tracking-widest mb-2">Private Banker</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#00aeef] rounded-full flex items-center justify-center text-white text-xs font-bold border border-white/20">SJ</div>
                  <div>
                    <p className="text-sm font-bold">{USER_PROFILE.manager.name}</p>
                    <p className="text-[10px] text-white/60">{USER_PROFILE.manager.role}</p>
                  </div>
                </div>
              </div>
              <button onClick={() => alert(`Connecting to ${USER_PROFILE.manager.name}...`)} className="w-full mt-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-full text-xs font-bold transition-colors">
                Secure Message
              </button>
            </div>
          </div>
        </section>

        {/* Balances */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {USER_PROFILE.accounts.map((acc, idx) => (
            <motion.div 
              key={idx}
              whileHover={{ y: -4 }}
              className="bg-white p-8 rounded-2xl shadow-sm border-l-4 border-l-[#00aeef] border border-slate-200 relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Wallet size={80} />
              </div>
              <p className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-1">{acc.type}</p>
              <p className="text-xs text-slate-400 mb-4">{acc.number}</p>
              <h3 className="text-4xl font-bold text-[#00395d]">
                £{acc.balance.toLocaleString('en-GB', { minimumFractionDigits: 2 })}
              </h3>
              <div className="mt-6 flex gap-3">
                <button onClick={() => setView('transactions')} className="text-sm font-bold text-[#00aeef] flex items-center gap-1 hover:underline">
                  View transactions <ChevronRight size={16} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Quick Actions */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button onClick={() => { setView('transfer'); setTransferStep(1); }} className="bg-white p-6 rounded-2xl border border-slate-200 flex flex-col items-center gap-3 hover:border-[#00aeef] hover:shadow-md transition-all group">
            <div className="w-12 h-12 bg-[#00aeef]/10 rounded-full flex items-center justify-center text-[#00aeef] group-hover:bg-[#00aeef] group-hover:text-white transition-colors">
              <ArrowUpRight size={24} />
            </div>
            <span className="font-bold text-[#00395d]">Pay & Transfer</span>
          </button>
          <button onClick={() => setView('loans')} className="bg-white p-6 rounded-2xl border border-slate-200 flex flex-col items-center gap-3 hover:border-[#00aeef] hover:shadow-md transition-all group">
            <div className="w-12 h-12 bg-[#00aeef]/10 rounded-full flex items-center justify-center text-[#00aeef] group-hover:bg-[#00aeef] group-hover:text-white transition-colors">
              <Landmark size={24} />
            </div>
            <span className="font-bold text-[#00395d]">Loans</span>
          </button>
          <button onClick={() => setView('cards')} className="bg-white p-6 rounded-2xl border border-slate-200 flex flex-col items-center gap-3 hover:border-[#00aeef] hover:shadow-md transition-all group">
            <div className="w-12 h-12 bg-[#00aeef]/10 rounded-full flex items-center justify-center text-[#00aeef] group-hover:bg-[#00aeef] group-hover:text-white transition-colors">
              <CreditCard size={24} />
            </div>
            <span className="font-bold text-[#00395d]">Cards</span>
          </button>
          <button className="bg-white p-6 rounded-2xl border border-slate-200 flex flex-col items-center gap-3 hover:border-[#00aeef] hover:shadow-md transition-all group">
            <div className="w-12 h-12 bg-[#00aeef]/10 rounded-full flex items-center justify-center text-[#00aeef] group-hover:bg-[#00aeef] group-hover:text-white transition-colors">
              <Plus size={24} />
            </div>
            <span className="font-bold text-[#00395d]">New Account</span>
          </button>
        </section>

        {/* Recent Transactions Preview */}
        <section className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center">
            <h3 className="font-bold text-[#00395d] text-lg">Recent Transactions</h3>
            <button onClick={() => setView('transactions')} className="text-[#00aeef] text-sm font-bold hover:underline">View all</button>
          </div>
          <div className="divide-y divide-slate-100">
            {TRANSACTIONS.slice(0, 4).map(t => (
              <div key={t.id} className="p-4 flex justify-between items-center hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${t.type === 'credit' ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-600'}`}>
                    {t.type === 'credit' ? <ArrowDownLeft size={20} /> : <ArrowUpRight size={20} />}
                  </div>
                  <div>
                    <p className="font-bold text-[#00395d]">{t.description}</p>
                    <p className="text-xs text-slate-400">{new Date(t.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })} • {t.category}</p>
                  </div>
                </div>
                <p className={`font-bold ${t.type === 'credit' ? 'text-emerald-600' : 'text-[#00395d]'}`}>
                  {t.type === 'credit' ? '+' : '-'}£{t.amount.toLocaleString('en-GB', { minimumFractionDigits: 2 })}
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Mobile Nav */}
      <nav className="md:hidden bg-white border-t border-slate-200 p-2 flex justify-around sticky bottom-0">
        <button onClick={() => setView('dashboard')} className={`flex flex-col items-center p-2 ${view === 'dashboard' ? 'text-[#00aeef]' : 'text-slate-400'}`}>
          <LayoutDashboard size={20} />
          <span className="text-[10px] mt-1">Home</span>
        </button>
        <button onClick={() => setView('transactions')} className={`flex flex-col items-center p-2 ${view === 'transactions' ? 'text-[#00aeef]' : 'text-slate-400'}`}>
          <History size={20} />
          <span className="text-[10px] mt-1">Activity</span>
        </button>
        <button onClick={() => setView('transfer')} className={`flex flex-col items-center p-2 ${view === 'transfer' ? 'text-[#00aeef]' : 'text-slate-400'}`}>
          <ArrowUpRight size={20} />
          <span className="text-[10px] mt-1">Pay</span>
        </button>
        <button onClick={() => setView('cards')} className={`flex flex-col items-center p-2 ${view === 'cards' ? 'text-[#00aeef]' : 'text-slate-400'}`}>
          <CreditCard size={20} />
          <span className="text-[10px] mt-1">Cards</span>
        </button>
      </nav>
    </div>
  );

  const renderTransfer = () => (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="bg-[#00395d] text-white p-4">
        <div className="max-w-3xl mx-auto flex items-center gap-4">
          <button onClick={() => setView('dashboard')} className="p-2 hover:bg-white/10 rounded-lg">
            <X size={24} />
          </button>
          <h1 className="text-xl font-bold">Pay & Transfer</h1>
        </div>
      </header>

      <main className="flex-1 max-w-3xl mx-auto w-full p-6">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          {/* Progress Bar */}
          <div className="h-1 bg-slate-100 flex">
            <div className={`h-full bg-[#00aeef] transition-all duration-500 ${transferStep === 1 ? 'w-1/4' : transferStep === 2 ? 'w-2/4' : transferStep === 3 ? 'w-3/4' : 'w-full'}`} />
          </div>

          <div className="p-8">
            {transferStep === 1 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                <h2 className="text-2xl font-bold text-[#00395d] mb-6">Who are you paying?</h2>
                
                <div className="flex gap-4 mb-8">
                  <button className="flex-1 py-3 bg-[#00aeef] text-white rounded-xl font-bold text-sm">External Transfer</button>
                  <button className="flex-1 py-3 bg-slate-100 text-[#00395d] rounded-xl font-bold text-sm">Internal (My Accounts)</button>
                </div>

                <div className="relative mb-8">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                  <input 
                    type="text" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search bank name..."
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#00aeef] outline-none"
                  />
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                  {filteredBanks.map(bank => (
                    <button 
                      key={bank.id}
                      onClick={() => { setSelectedBank(bank); setTransferStep(2); }}
                      className="flex items-center gap-4 p-4 border border-slate-100 rounded-xl hover:border-[#00aeef] hover:bg-slate-50 transition-all text-left"
                    >
                      <div className="w-10 h-10 bg-[#00395d] text-white rounded-lg flex items-center justify-center font-bold">
                        {bank.logo}
                      </div>
                      <span className="font-bold text-[#00395d]">{bank.name}</span>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {transferStep === 2 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl mb-6">
                  <div className="w-12 h-12 bg-[#00395d] text-white rounded-lg flex items-center justify-center font-bold text-xl">
                    {selectedBank?.logo}
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">Recipient Bank</p>
                    <p className="text-lg font-bold text-[#00395d]">{selectedBank?.name}</p>
                  </div>
                  <button onClick={() => setTransferStep(1)} className="ml-auto text-[#00aeef] text-sm font-bold">Change</button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-[#00395d] mb-2">Account Number</label>
                    <input 
                      type="text" 
                      maxLength={8} 
                      value={transferData.accountNumber}
                      onChange={(e) => setTransferData({...transferData, accountNumber: e.target.value})}
                      className="w-full p-4 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-[#00aeef]" 
                      placeholder="8 digits" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-[#00395d] mb-2">Sort Code / Routine Number</label>
                    <input 
                      type="text" 
                      maxLength={6} 
                      value={transferData.sortCode}
                      onChange={(e) => setTransferData({...transferData, sortCode: e.target.value})}
                      className="w-full p-4 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-[#00aeef]" 
                      placeholder="6 digits" 
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-[#00395d] mb-2">Amount (£)</label>
                  <input 
                    type="number" 
                    value={transferData.amount}
                    onChange={(e) => setTransferData({...transferData, amount: e.target.value})}
                    className="w-full p-4 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-[#00aeef] text-2xl font-bold" 
                    placeholder="0.00" 
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-[#00395d] mb-2">Reference (Optional)</label>
                  <input 
                    type="text" 
                    value={transferData.reference}
                    onChange={(e) => setTransferData({...transferData, reference: e.target.value})}
                    className="w-full p-4 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-[#00aeef]" 
                    placeholder="e.g. Rent" 
                  />
                </div>

                <button 
                  onClick={() => setTransferStep(3)}
                  className="w-full bg-[#00aeef] text-white font-bold py-4 rounded-full shadow-lg shadow-[#00aeef]/20 hover:bg-[#008cc0] transition-all"
                >
                  Continue to Security
                </button>
              </motion.div>
            )}

            {transferStep === 3 && (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center space-y-6">
                <div className="w-20 h-20 bg-[#00aeef]/10 text-[#00aeef] rounded-full flex items-center justify-center mx-auto">
                  <Smartphone size={40} />
                </div>
                <h2 className="text-2xl font-bold text-[#00395d]">Security Verification</h2>
                <p className="text-slate-600">We've sent a 6-digit OTP code to your registered mobile number ending in •••• 5521</p>
                
                <div className="flex justify-center gap-2">
                  {[0, 1, 2, 3, 4, 5].map(i => (
                    <input 
                      key={i}
                      type="text" 
                      maxLength={1}
                      value={otp[i]}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (/^\d*$/.test(val)) {
                          const newOtp = [...otp];
                          newOtp[i] = val;
                          setOtp(newOtp);
                          if (val.length === 1 && i < 5) {
                            (e.target.nextSibling as HTMLInputElement)?.focus();
                          }
                        }
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Backspace' && !otp[i] && i > 0) {
                          (e.currentTarget.previousSibling as HTMLInputElement)?.focus();
                        }
                      }}
                      className="w-12 h-14 border-2 border-slate-200 rounded-xl text-center text-2xl font-bold focus:border-[#00aeef] outline-none"
                    />
                  ))}
                </div>

                <div className="pt-4">
                  <p className="text-xs text-slate-400 mb-4">For testing, use code: <span className="font-bold">240298</span></p>
                  <button 
                    onClick={() => {
                      if (otp.join('') === '240298') {
                        setTransferStep(4);
                      } else {
                        alert('Invalid OTP code. Please use 240298');
                      }
                    }}
                    className="w-full bg-[#00395d] text-white font-bold py-4 rounded-full hover:bg-[#002a45] transition-all"
                  >
                    Verify Code
                  </button>
                </div>
                <button className="text-[#00aeef] font-bold text-sm">Resend code</button>
              </motion.div>
            )}

            {transferStep === 4 && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                <h2 className="text-2xl font-bold text-[#00395d] text-center">Confirm Transfer Details</h2>
                
                <div className="bg-slate-50 rounded-2xl p-6 space-y-4">
                  <div className="flex justify-between border-b border-slate-200 pb-3">
                    <span className="text-slate-500">Recipient Bank</span>
                    <span className="font-bold text-[#00395d]">{selectedBank?.name}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-200 pb-3">
                    <span className="text-slate-500">Account Number</span>
                    <span className="font-bold text-[#00395d]">{transferData.accountNumber}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-200 pb-3">
                    <span className="text-slate-500">Sort Code</span>
                    <span className="font-bold text-[#00395d]">{transferData.sortCode}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-200 pb-3">
                    <span className="text-slate-500">Reference</span>
                    <span className="font-bold text-[#00395d]">{transferData.reference || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between pt-2">
                    <span className="text-slate-500 text-lg">Total Amount</span>
                    <span className="font-bold text-[#00395d] text-2xl">£{parseFloat(transferData.amount).toLocaleString('en-GB', { minimumFractionDigits: 2 })}</span>
                  </div>
                </div>

                <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl flex gap-3">
                  <ShieldCheck className="text-amber-600 shrink-0" size={20} />
                  <p className="text-xs text-amber-800">Please ensure the details are correct. Transfers to other UK banks are usually instant but can take up to 2 hours.</p>
                </div>

                <button 
                  onClick={() => setTransferStep(5)}
                  className="w-full bg-[#00aeef] text-white font-bold py-4 rounded-full shadow-lg shadow-[#00aeef]/20 hover:bg-[#008cc0] transition-all"
                >
                  Confirm & Send Payment
                </button>
                <button onClick={() => setTransferStep(2)} className="w-full text-slate-500 font-bold py-2">Back to Edit</button>
              </motion.div>
            )}

            {transferStep === 5 && (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-12 space-y-6">
                <div className="w-24 h-24 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <History size={48} className="animate-pulse" />
                </div>
                <h2 className="text-3xl font-bold text-[#00395d]">Transfer Pending</h2>
                <div className="bg-amber-50 border border-amber-200 p-6 rounded-2xl max-w-sm mx-auto">
                  <p className="text-amber-900 font-medium">Waiting for email confirmation</p>
                  <p className="text-xs text-amber-700 mt-2">Your transfer has been initiated and is currently being processed. You will receive an email once it is completed.</p>
                </div>
                <div className="pt-8">
                  <button 
                    onClick={() => {
                      setView('dashboard');
                      setTransferStep(1);
                      setTransferData({ accountNumber: '', sortCode: '', amount: '', reference: '' });
                      setOtp(['', '', '', '', '', '']);
                    }}
                    className="bg-[#00395d] text-white px-8 py-3 rounded-full font-bold hover:bg-[#002a45] transition-all"
                  >
                    Return to Dashboard
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </main>
    </div>
  );

  const renderProfile = () => (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="bg-[#00395d] text-white p-4 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <button onClick={() => setView('dashboard')} className="p-2 hover:bg-white/10 rounded-lg">
            <X size={24} />
          </button>
          <h1 className="text-xl font-bold">Profile & Security Management</h1>
        </div>
      </header>

      <main className="flex-1 max-w-4xl mx-auto w-full p-4 md:p-8 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Main Info */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-8 bg-slate-50 border-b border-slate-200 flex flex-col md:flex-row items-center gap-6">
                <div className="w-24 h-24 bg-white rounded-full shadow-sm border border-slate-200 flex items-center justify-center text-slate-400 shrink-0">
                  <User size={48} />
                </div>
                <div className="text-center md:text-left">
                  <h2 className="text-3xl font-bold text-[#00395d]">{USER_PROFILE.fullName}</h2>
                  <p className="text-slate-500 font-medium">{USER_PROFILE.status}</p>
                  <div className="flex flex-wrap justify-center md:justify-start gap-3 mt-3">
                    <span className="px-3 py-1 bg-[#00aeef]/10 text-[#00aeef] rounded-full text-xs font-bold">ID: {USER_PROFILE.membershipNumber}</span>
                    <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold flex items-center gap-1">
                      <ShieldCheck size={14} /> KYC {USER_PROFILE.kycStatus}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Full Legal Name</label>
                    <p className="text-[#00395d] font-bold text-lg">{USER_PROFILE.fullName}</p>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Registered Email</label>
                    <p className="text-[#00395d] font-bold text-lg">{USER_PROFILE.email}</p>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Mobile Number</label>
                    <p className="text-[#00395d] font-bold text-lg">{USER_PROFILE.phone}</p>
                  </div>
                </div>
                <div className="space-y-6">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Residential Address</label>
                    <p className="text-[#00395d] font-bold text-lg leading-relaxed">{USER_PROFILE.address}</p>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Date of Birth / Age</label>
                    <p className="text-[#00395d] font-bold text-lg">01 Jan 1965 ({USER_PROFILE.age} years)</p>
                  </div>
                </div>
              </div>
              
              <div className="p-8 bg-slate-50 border-t border-slate-200 flex gap-4">
                <button className="flex-1 bg-[#00aeef] text-white font-bold py-4 rounded-full hover:bg-[#008cc0] transition-all shadow-lg shadow-[#00aeef]/20">
                  Update Profile Details
                </button>
                <button onClick={() => setView('login')} className="flex-1 border border-red-200 text-red-500 font-bold py-4 rounded-full hover:bg-red-50 transition-all flex items-center justify-center gap-2">
                  <LogOut size={20} /> Log out
                </button>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
              <h3 className="text-xl font-bold text-[#00395d] mb-6">Communication Preferences</h3>
              <div className="space-y-4">
                {[
                  { label: 'Email Notifications', desc: 'Receive statements and alerts via email', active: true },
                  { label: 'SMS Alerts', desc: 'Get real-time transaction alerts on your phone', active: true },
                  { label: 'Marketing Offers', desc: 'Personalized offers from Barclays and partners', active: false },
                ].map((pref, i) => (
                  <div key={i} className="flex items-center justify-between p-4 border border-slate-100 rounded-xl">
                    <div>
                      <p className="font-bold text-[#00395d]">{pref.label}</p>
                      <p className="text-xs text-slate-400">{pref.desc}</p>
                    </div>
                    <div className={`w-12 h-6 rounded-full relative cursor-pointer transition-colors ${pref.active ? 'bg-[#00aeef]' : 'bg-slate-200'}`}>
                      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all ${pref.active ? 'left-7' : 'left-1'}`} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Security & Manager */}
          <div className="space-y-6">
            <div className="bg-[#00395d] text-white rounded-2xl p-6 shadow-lg">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <ShieldCheck size={20} className="text-[#00aeef]" /> Security Status
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-white/60">2FA Verification</span>
                  <span className="bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded font-bold text-[10px]">ACTIVE</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-white/60">Biometric Login</span>
                  <span className="bg-white/10 text-white/40 px-2 py-0.5 rounded font-bold text-[10px]">DISABLED</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-white/60">Last Security Review</span>
                  <span className="text-white/80 font-medium">12 Feb 2024</span>
                </div>
                <button className="w-full mt-4 py-3 bg-white/10 hover:bg-white/20 rounded-xl text-sm font-bold transition-colors">
                  Security Settings
                </button>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
              <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mb-4">Your Account Manager</p>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-[#00395d] font-bold text-xl border-2 border-[#00aeef]">
                  SJ
                </div>
                <div>
                  <p className="font-bold text-[#00395d] text-lg">{USER_PROFILE.manager.name}</p>
                  <p className="text-xs text-slate-500">{USER_PROFILE.manager.role}</p>
                </div>
              </div>
              <div className="space-y-3">
                <button className="w-full py-3 bg-[#00aeef] text-white rounded-full text-sm font-bold hover:bg-[#008cc0] transition-colors">
                  Book an Appointment
                </button>
                <button className="w-full py-3 border border-slate-200 text-[#00395d] rounded-full text-sm font-bold hover:bg-slate-50 transition-colors">
                  Send Secure Message
                </button>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 p-6 rounded-2xl">
              <h4 className="font-bold text-amber-900 flex items-center gap-2 mb-2">
                <ShieldCheck size={18} /> Security Notice
              </h4>
              <p className="text-xs text-amber-800 leading-relaxed">
                To change your primary phone number or residential address, you may need to visit a branch with valid photo ID for verification.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );

  const renderTransactions = () => {
    const filteredTransactions = TRANSACTIONS.filter(t => {
      const matchesSearch = t.description.toLowerCase().includes(transactionSearch.toLowerCase()) || 
                           t.referenceId.toLowerCase().includes(transactionSearch.toLowerCase());
      const matchesType = transactionFilter.type === 'all' || t.type === transactionFilter.type;
      const matchesStatus = transactionFilter.status === 'all' || t.status === transactionFilter.status;
      return matchesSearch && matchesType && matchesStatus;
    });

    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <header className="bg-[#00395d] text-white p-4 sticky top-0 z-50">
          <div className="max-w-4xl mx-auto flex items-center gap-4">
            <button onClick={() => setView('dashboard')} className="p-2 hover:bg-white/10 rounded-lg">
              <X size={24} />
            </button>
            <h1 className="text-xl font-bold">Transaction History</h1>
          </div>
        </header>

        <main className="flex-1 max-w-4xl mx-auto w-full p-4 md:p-6">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-[80vh]">
            <div className="p-6 bg-slate-50 border-b border-slate-200 space-y-4">
              <div className="flex flex-wrap gap-4 items-center justify-between">
                <div className="relative flex-1 min-w-[200px]">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    type="text" 
                    value={transactionSearch}
                    onChange={(e) => setTransactionSearch(e.target.value)}
                    placeholder="Search merchant or reference ID..." 
                    className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#00aeef]" 
                  />
                </div>
                <div className="flex gap-2">
                  <button onClick={() => alert('Downloading PDF...')} className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold text-[#00395d] hover:bg-slate-50">PDF</button>
                  <button onClick={() => alert('Downloading CSV...')} className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold text-[#00395d] hover:bg-slate-50">CSV</button>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <select 
                  value={transactionFilter.type}
                  onChange={(e) => setTransactionFilter({...transactionFilter, type: e.target.value})}
                  className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-xs font-medium outline-none"
                >
                  <option value="all">All Types</option>
                  <option value="debit">Debits</option>
                  <option value="credit">Credits</option>
                </select>
                <select 
                  value={transactionFilter.status}
                  onChange={(e) => setTransactionFilter({...transactionFilter, status: e.target.value})}
                  className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-xs font-medium outline-none"
                >
                  <option value="all">All Statuses</option>
                  <option value="Completed">Completed</option>
                  <option value="Pending">Pending</option>
                </select>
                <button onClick={() => { setTransactionSearch(''); setTransactionFilter({type: 'all', status: 'all'}); }} className="text-xs text-[#00aeef] font-bold">Clear Filters</button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar divide-y divide-slate-100">
              {filteredTransactions.length === 0 ? (
                <div className="p-12 text-center text-slate-400">
                  <History size={48} className="mx-auto mb-4 opacity-20" />
                  <p>No transactions found matching your criteria.</p>
                </div>
              ) : (
                filteredTransactions.map(t => (
                  <div key={t.id} className="p-6 flex justify-between items-center hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${t.type === 'credit' ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-600'}`}>
                        {t.type === 'credit' ? <ArrowDownLeft size={24} /> : <ArrowUpRight size={24} />}
                      </div>
                      <div>
                        <p className="font-bold text-[#00395d] text-lg">{t.description}</p>
                        <div className="flex items-center gap-2 text-sm text-slate-400">
                          <span>{new Date(t.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                          <span>•</span>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${t.status === 'Completed' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                            {t.status}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-300 mt-1">Ref: {t.referenceId}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-bold text-xl ${t.type === 'credit' ? 'text-emerald-600' : 'text-[#00395d]'}`}>
                        {t.type === 'credit' ? '+' : '-'}£{t.amount.toLocaleString('en-GB', { minimumFractionDigits: 2 })}
                      </p>
                      <p className="text-xs text-slate-400">{t.category}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </main>
      </div>
    );
  };

  const renderLoans = () => (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="bg-[#00395d] text-white p-4">
        <div className="max-w-3xl mx-auto flex items-center gap-4">
          <button onClick={() => setView('dashboard')} className="p-2 hover:bg-white/10 rounded-lg">
            <X size={24} />
          </button>
          <h1 className="text-xl font-bold">Loans & Mortgages</h1>
        </div>
      </header>
      <main className="flex-1 max-w-3xl mx-auto w-full p-6 space-y-6">
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-bold text-[#00395d]">Personal Loan</h2>
              <p className="text-slate-400 text-sm">Account ending in •••• 9901</p>
            </div>
            <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold">ACTIVE</span>
          </div>
          <div className="grid grid-cols-2 gap-8">
            <div>
              <p className="text-xs text-slate-400 uppercase font-bold mb-1">Remaining Balance</p>
              <p className="text-3xl font-bold text-[#00395d]">£12,450.00</p>
            </div>
            <div>
              <p className="text-xs text-slate-400 uppercase font-bold mb-1">Next Payment</p>
              <p className="text-3xl font-bold text-[#00395d]">£345.00</p>
              <p className="text-xs text-slate-400">Due 15 Mar 2024</p>
            </div>
          </div>
          <div className="mt-8 h-2 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-[#00aeef] w-3/4" />
          </div>
          <p className="text-xs text-slate-400 mt-2">75% of your loan has been repaid</p>
        </div>

        <div className="bg-[#00aeef] p-8 rounded-2xl text-white flex justify-between items-center">
          <div>
            <h3 className="text-xl font-bold mb-1">Need a new loan?</h3>
            <p className="text-white/80">Get an instant decision on loans up to £50,000.</p>
          </div>
          <button className="bg-white text-[#00aeef] font-bold px-6 py-3 rounded-full hover:bg-slate-50 transition-colors">Apply Now</button>
        </div>
      </main>
    </div>
  );

  const renderCards = () => (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="bg-[#00395d] text-white p-4">
        <div className="max-w-3xl mx-auto flex items-center gap-4">
          <button onClick={() => setView('dashboard')} className="p-2 hover:bg-white/10 rounded-lg">
            <X size={24} />
          </button>
          <h1 className="text-xl font-bold">Linked Cards</h1>
        </div>
      </header>
      <main className="flex-1 max-w-3xl mx-auto w-full p-6 space-y-6">
        <div className="relative h-56 w-full max-w-sm mx-auto bg-gradient-to-br from-[#00395d] to-[#00aeef] rounded-2xl p-8 text-white shadow-xl overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-20">
            <BarclaysLogo className="h-12 invert brightness-0" />
          </div>
          <div className="flex flex-col h-full justify-between">
            <div className="flex justify-between items-start">
              <div className="w-12 h-10 bg-yellow-400/80 rounded-md" /> {/* Chip */}
              <Smartphone size={24} />
            </div>
            <div>
              <p className="text-xl tracking-[0.2em] font-mono mb-4">•••• •••• •••• 4421</p>
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-[10px] uppercase opacity-60">Card Holder</p>
                  <p className="font-bold tracking-wider">ARTHUR STERLING</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase opacity-60">Expires</p>
                  <p className="font-bold">09/28</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 divide-y divide-slate-100">
          <button 
            onClick={() => setIsCardFrozen(!isCardFrozen)}
            className="w-full p-6 flex justify-between items-center hover:bg-slate-50 transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isCardFrozen ? 'bg-amber-100 text-amber-600' : 'bg-slate-100 text-slate-600'}`}>
                <ShieldCheck size={20} />
              </div>
              <div className="text-left">
                <p className="font-bold text-[#00395d]">{isCardFrozen ? 'Unfreeze Card' : 'Freeze Card'}</p>
                <p className="text-xs text-slate-400">{isCardFrozen ? 'Your card is currently blocked' : 'Temporarily block all transactions'}</p>
              </div>
            </div>
            <div className={`w-12 h-6 rounded-full relative transition-colors ${isCardFrozen ? 'bg-[#00aeef]' : 'bg-slate-200'}`}>
              <motion.div 
                animate={{ x: isCardFrozen ? 24 : 4 }}
                className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm" 
              />
            </div>
          </button>
          <button className="w-full p-6 flex justify-between items-center hover:bg-slate-50 transition-colors">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-600">
                <Smartphone size={20} />
              </div>
              <div className="text-left">
                <p className="font-bold text-[#00395d]">View PIN</p>
                <p className="text-xs text-slate-400">Securely view your card PIN</p>
              </div>
            </div>
            <ChevronRight size={20} className="text-slate-300" />
          </button>
        </div>
      </main>
    </div>
  );

  return (
    <div className="font-sans text-slate-900">
      <AnimatePresence mode="wait">
        {view === 'login' && renderLogin()}
        {view === 'dashboard' && renderDashboard()}
        {view === 'transfer' && renderTransfer()}
        {view === 'transactions' && renderTransactions()}
        {view === 'loans' && renderLoans()}
        {view === 'cards' && renderCards()}
        {view === 'profile' && renderProfile()}
      </AnimatePresence>
    </div>
  );
}
