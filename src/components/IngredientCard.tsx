import React from 'react';
import { getDaysRemaining } from '../utils/date-utils';
import { CheckCircle, Clock, AlertTriangle } from 'lucide-react';

interface Ingredient {
  id: string;
  name: string;
  category: string;
  expires_at: string;
  is_consumed: boolean;
  image_url?: string;
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
    <div className="card" style={{ padding: 0, display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', padding: '16px', gap: '16px', alignItems: 'center' }}>
        <div style={{ 
          width: '60px', 
          height: '60px', 
          borderRadius: '12px', 
          overflow: 'hidden',
          background: '#f1f5f9',
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {item.image_url ? (
            <img 
              src={item.image_url} 
              alt={item.name} 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              onError={(e) => {
                (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${item.name}&background=random`;
              }}
            />
          ) : (
            <span style={{ fontSize: '2rem' }}>{item.category}</span>
          )}
        </div>

        <div style={{ flex: 1 }}>
          <h3 style={{ fontSize: '1.1rem', margin: 0 }}>{item.name}</h3>
          <div className={`status-${status.class}`} style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.9rem', marginTop: '4px' }}>
            {status.icon}
            <span>{status.label}</span>
          </div>
        </div>

        <button 
          onClick={() => onConsume(item.id)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', padding: '8px' }}
          title="Mark as consumed"
        >
          <CheckCircle size={28} />
        </button>
      </div>
      <div className={`timeline-bar bg-${status.class}`} style={{ width: `${barWidth}%`, position: 'relative', height: '6px' }} />
    </div>
  );
};
