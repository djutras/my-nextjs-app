'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../utils/supabase';

interface Calculation {
  id: number;
  num1: number;
  num2: number;
  result: number;
  created_at: string;
}

export default function Home() {
  const [num1, setNum1] = useState('');
  const [num2, setNum2] = useState('');
  const [result, setResult] = useState<number | null>(null);
  const [calculations, setCalculations] = useState<Calculation[]>([]);

  useEffect(() => {
    fetchCalculations();
  }, []);

  const fetchCalculations = async () => {
    const { data, error } = await supabase
      .from('calculations')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10);

    if (error) {
      console.error('Error fetching calculations:', error);
    } else {
      setCalculations(data || []);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const sum = Number(num1) + Number(num2);
    setResult(sum);

    // Save calculation to Supabase
    const { error } = await supabase
      .from('calculations')
      .insert([
        {
          num1: Number(num1),
          num2: Number(num2),
          result: sum,
        },
      ]);

    if (error) {
      console.error('Error saving calculation:', error);
    } else {
      fetchCalculations(); // Refresh the list
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
        <h1 className="text-2xl font-bold text-center mb-6">Number Calculator</h1>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="num1" className="block text-sm font-medium text-gray-700">
              First Number
            </label>
            <input
              type="number"
              id="num1"
              value={num1}
              onChange={(e) => setNum1(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label htmlFor="num2" className="block text-sm font-medium text-gray-700">
              Second Number
            </label>
            <input
              type="number"
              id="num2"
              value={num2}
              onChange={(e) => setNum2(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Calculate Sum
          </button>
        </form>

        {result !== null && (
          <div className="mt-6 p-4 bg-gray-50 rounded-md">
            <p className="text-center text-lg">
              Result: <span className="font-bold">{result}</span>
            </p>
          </div>
        )}

        {calculations.length > 0 && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Recent Calculations</h2>
            <div className="space-y-2">
              {calculations.map((calc) => (
                <div key={calc.id} className="p-3 bg-gray-50 rounded-md">
                  <p className="text-sm">
                    {calc.num1} + {calc.num2} = <strong>{calc.result}</strong>
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}