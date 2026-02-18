'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { Dashboard } from '@/components/Dashboard';
import { SettingsModal } from '@/components/SettingsModal';
import { useLocalStorage } from '@/hooks/useRentCounter';
import { RentData } from '@/utils/rentUtils';
import { useSearchParams, useRouter } from 'next/navigation';

const DEFAULT_DATA: RentData = {
  userName: '',
  totalRent: 0,
  startDate: new Date().toISOString().split('T')[0],
  paymentDay: 1,
};

function HomeContent() {
  const [rentData, setRentData] = useLocalStorage<RentData>('rent_counter_data', DEFAULT_DATA);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isFirstTime, setIsFirstTime] = useState(false);

  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    // URL Preset Logic
    const name = searchParams.get('name');
    const rent = searchParams.get('rent');
    const date = searchParams.get('date');
    const payday = searchParams.get('payday');

    if (rent || name || date || payday) {
      const newData: RentData = {
        userName: name || rentData.userName || '',
        totalRent: rent ? Number(rent) : (rentData.totalRent || 0),
        startDate: date || rentData.startDate || new Date().toISOString().split('T')[0],
        paymentDay: payday ? Number(payday) : (rentData.paymentDay || 1),
      };

      // Only update if it's different from current to avoid loops
      if (JSON.stringify(newData) !== JSON.stringify(rentData)) {
        setRentData(newData);
        // Clear URL params after applying
        router.replace('/');
      }
    }
  }, [searchParams, rentData, setRentData, router]);

  useEffect(() => {
    // Check if data is uninitialized (totalRent is 0)
    if (rentData.totalRent === 0) {
      setIsFirstTime(true);
      setIsSettingsOpen(true);
    }
  }, [rentData.totalRent]);

  const handleSave = (newData: RentData) => {
    setRentData(newData);
    setIsFirstTime(false);
  };

  return (
    <main className="min-h-screen">
      {rentData.totalRent > 0 ? (
        <Dashboard
          rentData={rentData}
          onOpenSettings={() => setIsSettingsOpen(true)}
        />
      ) : (
        <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 text-center">
          <h1 className="text-4xl font-black text-[#F22E30] mb-4">월세 체감 카운터</h1>
          <p className="text-zinc-400 mb-8">당신의 소중한 월급이 공중분해되는 현장을 목격하세요.</p>
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="px-8 py-4 bg-[#F22E30] text-white font-bold rounded-full shadow-lg shadow-red-900/50 hover:scale-105 transition-transform"
          >
            시작하기 (월세 입력)
          </button>
        </div>
      )}

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => !isFirstTime && setIsSettingsOpen(false)}
        data={rentData}
        onSave={handleSave}
      />
    </main>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black" />}>
      <HomeContent />
    </Suspense>
  );
}
