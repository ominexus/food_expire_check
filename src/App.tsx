import { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';
import { IngredientCard } from './components/IngredientCard';
import { AddPanel } from './components/AddPanel';
import { Apple } from 'lucide-react';

interface Ingredient {
  id: string;
  name: string;
  category: string;
  expires_at: string;
  is_consumed: boolean;
}

function App() {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchIngredients();
  }, []);

  async function fetchIngredients() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('ingredients')
        .select('*')
        .eq('is_consumed', false)
        .order('expires_at', { ascending: true });

      if (error) throw error;
      setIngredients(data || []);
    } catch (error) {
      console.error('Error fetching ingredients:', error);
      // Mock data for demo if Supabase is not connected
      if (!import.meta.env.VITE_SUPABASE_URL) {
        setIngredients([
          { id: '1', name: 'Milk', category: '🥛', expires_at: new Date(Date.now() + 2*24*60*60*1000).toISOString(), is_consumed: false },
          { id: '2', name: 'Spinach', category: '🥬', expires_at: new Date(Date.now() - 1*24*60*60*1000).toISOString(), is_consumed: false },
          { id: '3', name: 'Eggs', category: '🥚', expires_at: new Date(Date.now() + 10*24*60*60*1000).toISOString(), is_consumed: false },
        ]);
      }
    } finally {
      setLoading(false);
    }
  }

  async function addIngredient(name: string, category: string, expiresAt: string) {
    try {
      const newIngredient = { name, category, expires_at: expiresAt, is_consumed: false };
      
      const { data, error } = await supabase
        .from('ingredients')
        .insert([newIngredient])
        .select();

      if (error) throw error;
      if (data) setIngredients(prev => [...prev, data[0]].sort((a, b) => a.expires_at.localeCompare(b.expires_at)));
    } catch (error) {
      console.error('Error adding ingredient:', error);
      // Local update for demo
      const mockNew = { id: Math.random().toString(), name, category, expires_at: expiresAt, is_consumed: false };
      setIngredients(prev => [...prev, mockNew].sort((a, b) => a.expires_at.localeCompare(b.expires_at)));
    }
  }

  async function consumeIngredient(id: string) {
    try {
      const { error } = await supabase
        .from('ingredients')
        .update({ is_consumed: true })
        .eq('id', id);

      if (error) throw error;
      setIngredients(prev => prev.filter(item => item.id !== id));
    } catch (error) {
      console.error('Error consuming ingredient:', error);
      // Local update for demo
      setIngredients(prev => prev.filter(item => item.id !== id));
    }
  }

  const expiredCount = ingredients.filter(i => new Date(i.expires_at).getTime() < new Date().setHours(0,0,0,0)).length;

  return (
    <div className="container">
      <header style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px', paddingTop: '20px' }}>
        <div style={{ background: 'var(--text-primary)', color: 'white', padding: '8px', borderRadius: '12px' }}>
          <Apple size={32} />
        </div>
        <div>
          <h1 style={{ fontSize: '1.5rem' }}>FoodExpire</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            {expiredCount > 0 ? `${expiredCount} items expired!` : 'Your fridge is looking good'}
          </p>
        </div>
      </header>

      <AddPanel onAdd={addIngredient} />

      <section style={{ marginTop: '24px' }}>
        <h2 style={{ fontSize: '1.1rem', marginBottom: '16px', color: 'var(--text-secondary)' }}>My Ingredients</h2>
        {loading && ingredients.length === 0 ? (
          <p>Loading...</p>
        ) : (
          ingredients.map(item => (
            <IngredientCard key={item.id} item={item} onConsume={consumeIngredient} />
          ))
        )}
        {!loading && ingredients.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
            <p>No ingredients tracked yet.</p>
            <p style={{ fontSize: '0.8rem' }}>Tap a preset above to start!</p>
          </div>
        )}
      </section>
    </div>
  );
}

export default App;
