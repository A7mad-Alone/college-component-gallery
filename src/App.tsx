import { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Plus, Loader2, Package } from 'lucide-react';
import type { ComponentItem, FormData } from './types';
import ComponentCard from './components/ComponentCard';
import AddItemModal from './components/AddItemModal';

// Using Environment Variables for Vercel/Production
const API_URL = "";
const SECRET_KEY = "";

function App() {
  const [items, setItems] = useState<ComponentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterState, setFilterState] = useState<'All' | 'New' | 'Used'>('All');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchItems = async () => {
    if (!API_URL) {
      console.error('API_URL is not set in environment variables');
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const response = await axios.get(API_URL);
      const validItems = Array.isArray(response.data) 
        ? response.data.filter(item => item.Name && item.Name !== 'Name')
        : [];
      setItems(validItems);
    } catch (error) {
      console.error('Error fetching items:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleAddItem = async (data: FormData) => {
    try {
      await axios.post(API_URL, { ...data, key: SECRET_KEY });
      fetchItems();
    } catch (error) {
      console.error('Error adding item:', error);
      throw error;
    }
  };

  const filteredItems = items.filter(item => {
    const matchesSearch = (item.Name?.toString() || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (item.SellerName?.toString() || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (item.Notes?.toString() || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterState === 'All' || item.State === filterState;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100">
      <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="bg-indigo-600 p-2 rounded-lg shadow-lg shadow-indigo-500/20">
                <Package className="text-white" size={24} />
              </div>
              <h1 className="text-xl font-bold tracking-tight">Component Gallery</h1>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative flex-1 md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="text"
                  placeholder="Search name, seller, notes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-700 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                />
              </div>
              
              <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl font-semibold transition-all shadow-lg shadow-indigo-500/20 active:scale-95"
              >
                <Plus size={20} />
                <span className="hidden sm:inline">List Item</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-4 mb-8 overflow-x-auto pb-2 scrollbar-hide">
          <div className="flex items-center gap-2 text-slate-500 shrink-0">
            <span className="text-xs font-bold uppercase tracking-widest">Filter:</span>
          </div>
          {(['All', 'New', 'Used'] as const).map((state) => (
            <button
              key={state}
              onClick={() => setFilterState(state)}
              className={`px-6 py-1.5 rounded-full text-sm font-bold transition-all whitespace-nowrap ${
                filterState === state
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:border-indigo-500 active:scale-95'
              }`}
            >
              {state}
            </button>
          ))}
        </div>

        {!API_URL ? (
          <div className="text-center py-20 bg-amber-50 dark:bg-amber-900/10 rounded-3xl border border-amber-200 dark:border-amber-900/30">
            <h3 className="text-xl font-bold text-amber-800 dark:text-amber-400 mb-2">Configuration Missing</h3>
            <p className="text-amber-700 dark:text-amber-500">Please set your Vercel Environment Variables.</p>
          </div>
        ) : loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <Loader2 className="animate-spin text-indigo-600" size={48} />
            <p className="text-slate-500 font-bold tracking-wide animate-pulse">Fetching Components...</p>
          </div>
        ) : filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredItems.map((item, index) => (
              <ComponentCard key={index} item={item} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white dark:bg-slate-800 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-700">
            <Package className="mx-auto text-slate-300 dark:text-slate-600 mb-4" size={64} />
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No components found</h3>
            <p className="text-slate-500">Try adjusting your search or filters, or list a new item!</p>
          </div>
        )}
      </main>

      <footer className="py-12 text-center text-slate-400 text-xs font-medium tracking-widest uppercase">
        <p>© 2026 College Component Gallery • Stark's Lab Infrastructure</p>
      </footer>

      <AddItemModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddItem}
      />
    </div>
  );
}

export default App;
