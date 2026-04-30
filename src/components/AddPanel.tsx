import React, { useState } from 'react';
import { getExpiryFromDays } from '../utils/date-utils';
import { PlusCircle, Loader2 } from 'lucide-react';
import { fetchFoodImage } from '../utils/image-service';

const PRESETS = [
  { name: '우유', days: 7, icon: '🥛' },
  { name: '계란', days: 14, icon: '🥚' },
  { name: '고기', days: 3, icon: '🥩' },
  { name: '야채', days: 5, icon: '🥦' },
  { name: '빵', days: 4, icon: '🍞' },
  { name: '과일', days: 7, icon: '🍎' },
];

interface Props {
  onAdd: (name: string, category: string, expiresAt: string, imageUrl?: string) => void;
}

export const AddPanel: React.FC<Props> = ({ onAdd }) => {
  const [name, setName] = useState('');
  const [date, setDate] = useState(getExpiryFromDays(7));
  const [showManual, setShowManual] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const handlePresetClick = async (preset: typeof PRESETS[0]) => {
    if (isSearching) return;
    setIsSearching(true);
    const expiry = getExpiryFromDays(preset.days);
    const imageUrl = await fetchFoodImage(preset.name);
    onAdd(preset.name, preset.icon, expiry, imageUrl);
    setIsSearching(false);
  };

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || isSearching) return;
    
    setIsSearching(true);
    const imageUrl = await fetchFoodImage(name);
    onAdd(name, '🍽️', date, imageUrl);
    
    setName('');
    setIsSearching(false);
    setShowManual(false);
  };

  return (
    <div className="card" style={{ border: '2px dashed #cbd5e1', background: '#f1f5f9' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '12px' }}>
        {PRESETS.map((preset) => (
          <button
            key={preset.name}
            disabled={isSearching}
            onClick={() => handlePresetClick(preset)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              padding: '8px',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              background: 'white',
              cursor: isSearching ? 'not-allowed' : 'pointer',
              opacity: isSearching ? 0.7 : 1
            }}
          >
            <span style={{ fontSize: '1.5rem' }}>{preset.icon}</span>
            <span style={{ fontSize: '0.8rem', marginTop: '4px' }}>{preset.name}</span>
          </button>
        ))}
      </div>

      {!showManual ? (
        <button
          onClick={() => setShowManual(true)}
          disabled={isSearching}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            padding: '10px',
            background: 'var(--text-primary)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: isSearching ? 'not-allowed' : 'pointer'
          }}
        >
          {isSearching ? <Loader2 className="animate-spin" size={20} /> : <PlusCircle size={20} />}
          <span>{isSearching ? 'Searching Image...' : 'Manual Add'}</span>
        </button>
      ) : (
        <form onSubmit={handleManualSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Item name (e.g. 사과)"
            style={{
              padding: '10px',
              borderRadius: '8px',
              border: '1px solid #cbd5e1'
            }}
            autoFocus
          />
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Expires:</span>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              style={{
                flex: 1,
                padding: '8px',
                borderRadius: '8px',
                border: '1px solid #cbd5e1'
              }}
            />
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              type="button"
              onClick={() => setShowManual(false)}
              style={{
                flex: 1,
                padding: '10px',
                background: '#e2e8f0',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSearching}
              style={{
                flex: 2,
                padding: '10px',
                background: 'var(--color-safe)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: isSearching ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              {isSearching && <Loader2 className="animate-spin" size={18} />}
              {isSearching ? 'Adding...' : 'Add Item'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
