import React from 'react';
import { ExternalLink, Phone, Tag, Package, User, MessageSquare } from 'lucide-react';
import type { ComponentItem } from '../types';

interface Props {
  item: ComponentItem;
}

const ComponentCard: React.FC<Props> = ({ item }) => {
  const saveAmount = item.CurrentPrice - item.SellingPrice;
  const savePercent = Math.round((saveAmount / item.CurrentPrice) * 100);

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-md transition-shadow flex flex-col h-full">
      <div className="aspect-video w-full bg-slate-100 dark:bg-slate-900 relative shrink-0">
        {item.ImageUrl ? (
          <img src={item.ImageUrl} alt={item.Name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-400">
            <Package size={48} />
          </div>
        )}
        <div className="absolute top-2 right-2 flex gap-2">
          <span className={`px-2 py-1 rounded-md text-xs font-bold ${
            item.State === 'New' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
          }`}>
            {item.State}
          </span>
          {item.Count > 0 && (
            <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-md text-xs font-bold">
              Qty: {item.Count}
            </span>
          )}
        </div>
      </div>

      <div className="p-4 flex flex-col flex-1">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white line-clamp-1 mb-1">
          {item.Name}
        </h3>
        
        <div className="flex items-baseline gap-2 mb-3">
          <span className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
            ${item.SellingPrice}
          </span>
          {saveAmount > 0 && (
            <span className="text-xs text-green-600 font-medium">
              Save ${saveAmount} ({savePercent}%)
            </span>
          )}
        </div>

        <div className="space-y-2 mb-4 text-sm text-slate-600 dark:text-slate-400 flex-1">
          <div className="flex items-center gap-2">
            <User size={14} className="shrink-0" />
            <span className="truncate">{item.SellerName}</span>
          </div>
          {item.State === 'Used' && (
            <div className="flex items-center gap-2">
              <Tag size={14} className="shrink-0" />
              <span className="truncate">Used for: {item.Usage}</span>
            </div>
          )}
          {item.Notes && (
            <div className="mt-3 p-2 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-100 dark:border-slate-700">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 mb-1 uppercase tracking-wider">
                <MessageSquare size={10} /> Notes
              </div>
              <p className="text-xs line-clamp-3 leading-relaxed italic">
                "{item.Notes}"
              </p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-2 mt-auto pt-4">
          <a
            href={item.ProductLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 px-3 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors text-sm font-medium"
          >
            <ExternalLink size={14} /> Link
          </a>
          <a
            href={`tel:${item.SellerNumber}`}
            className="flex items-center justify-center gap-2 px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
          >
            <Phone size={14} /> Call
          </a>
        </div>
      </div>
    </div>
  );
};

export default ComponentCard;
