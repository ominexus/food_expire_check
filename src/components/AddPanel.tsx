import React, { useState } from 'react';
import { getExpiryFromDays } from '../utils/date-utils';
import { PlusCircle } from 'lucide-react';

const PRESETS = [
  { name: 'Milk', days: 7, icon: '🥛' },
  { name: 'Eggs', days: 14, icon: '🥚' },
  { name: 'Meat', days: 3, icon: '🥩' },
  { name: 'Veg', days: 5, icon: '🥦' },
  { name: 'Bread', days: 4, icon: '🍞' },
  { name: 'Fruit', days: 7, icon: '🍎' },
];

interface Props {
  onAdd: (name: string, category: string, expiresAt: string) => void;
}

export const AddPanel: React.FC<Props> = ({ onAdd }) => {
  const [name, setName] = useState('');
  const [showManual, setShowManual] = useState(false);

  const handlePresetClick = (preset: typeof PRESETS[0]) => {
    const expiry = getExpiryFromDays(preset.days);
    onAdd(preset.name, preset.icon, expiry);
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;
    onAdd(name, '🍽️', getExpiryFromDays(7)); // Default 7 days for manual
    setName('');
    setShowManual(false);
  };

  return (
    <div className="card" style={{ border: '2px dashed #cbd5e1', background: '#f1f5f9' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '12px' }}>
        {PRESETS.map((preset) => (
          <button
            key={preset.name}
            onClick={() => handlePresetClick(preset)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              padding: '8px',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              background: 'white',
              cursor: 'pointer'
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
            cursor: 'pointer'
          }}
        >
          <PlusCircle size={20} />
          <span>Manual Add</span>
        </button>
      ) : (
        <form onSubmit={handleManualSubmit} style={{ display: 'flex', gap: '8px' }}>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Item name..."
            style={{
              flex: 1,
              padding: '8px',
              borderRadius: '8px',
              border: '1px solid #cbd5e1'
            }}
            autoFocus
          />
          <button
            type="submit"
            style={{
              padding: '8px 16px',
              background: 'var(--color-safe)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
          >
            Add
          </button>
        </form>
      )}
    </div>
  );
};
