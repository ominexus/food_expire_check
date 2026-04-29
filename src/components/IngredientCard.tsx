import React from 'react';
import { getDaysRemaining } from '../utils/date-utils';
import { CheckCircle, Clock, AlertTriangle } from 'lucide-react';

interface Ingredient {
  id: string;
  name: string;
  category: string;
  expires_at: string;
  is_consumed: boolean;
}

interface Props {
  item: Ingredient;
  onConsume: (id: string) => void;
}

export const IngredientCard: React.FC<Props> = ({ item, onConsume }) => {
  const days = getDaysRemaining(item.expires_at);
  
  const getStatus = () => {
    if (days <= 0) return { label: 'Expired', class: 'danger', icon: <AlertTriangle size={18} /> };
    if (days <= 3) return { label: `${days} days left`, class: 'warning', icon: <Clock size={18} /> };
    return { label: `${days} days left`, class: 'safe', icon: <Clock size={18} /> };
  };

  const status = getStatus();
  
  // Max width of 100% for 14+ days, proportional below that
  const barWidth = Math.min(100, Math.max(0, (days / 14) * 100));

  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h3 style={{ fontSize: '1.1rem' }}>{item.category} {item.name}</h3>
          <div className={`status-${status.class}`} style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.9rem', marginTop: '4px' }}>
            {status.icon}
            <span>{status.label}</span>
          </div>
        </div>
        <button 
          onClick={() => onConsume(item.id)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}
          title="Mark as consumed"
        >
          <CheckCircle size={24} />
        </button>
      </div>
      <div className={`timeline-bar bg-${status.class}`} style={{ width: `${barWidth}%` }} />
    </div>
  );
};
