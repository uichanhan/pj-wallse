'use client';

import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { RentData } from '../utils/rentUtils';

interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
    data: RentData;
    onSave: (newData: RentData) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
    isOpen,
    onClose,
    data,
    onSave,
}) => {
    const [formData, setFormData] = useState<RentData>(data);

    useEffect(() => {
        setFormData(data);
    }, [data]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-2xl">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-[#F22E30]">월세 설정</h2>
                    <button onClick={onClose} className="text-zinc-400 hover:text-white transition-colors">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-zinc-400 mb-1 text-[11px] md:text-sm">사용자 이름</label>
                        <input
                            type="text"
                            value={formData.userName || ''}
                            onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
                            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#F22E30] transition-colors text-sm"
                            placeholder="예: 홍길동"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-zinc-400 mb-1 text-[11px] md:text-sm">합산 납부액 (월세+공과금+관리비)</label>
                        <input
                            type="number"
                            value={formData.totalRent}
                            onChange={(e) => setFormData({ ...formData, totalRent: Number(e.target.value) })}
                            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#F22E30] transition-colors text-sm"
                            placeholder="예: 600000"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-zinc-400 mb-1 text-[11px] md:text-sm">최초 입주일 (YYYY.MM.DD)</label>
                        <input
                            type="text"
                            placeholder="예: 2026.01.18"
                            pattern="\d{4}\.\d{2}\.\d{2}"
                            maxLength={10}
                            value={formData.startDate.replace(/-/g, '.')}
                            onChange={(e) => {
                                // Extract only up to 8 digits
                                let digits = e.target.value.replace(/\D/g, '').substring(0, 8);

                                // Format as YYYY.MM.DD
                                let formatted = '';
                                if (digits.length >= 1) {
                                    formatted += digits.substring(0, 4);
                                    if (digits.length > 4) {
                                        formatted += '.' + digits.substring(4, 6);
                                        if (digits.length > 6) {
                                            formatted += '.' + digits.substring(6, 8);
                                        }
                                    }
                                }

                                // Internal storage as YYYY-MM-DD
                                let internal = formatted.replace(/\./g, '-');
                                setFormData({ ...formData, startDate: internal });
                            }}
                            onBlur={(e) => {
                                // Ensure standard YYYY-MM-DD on blur if valid
                                const val = e.target.value;
                                const parts = val.split('.');
                                if (parts.length === 3 && parts[0].length === 4 && parts[1].length === 2 && parts[2].length === 2) {
                                    setFormData({ ...formData, startDate: parts.join('-') });
                                }
                            }}
                            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#F22E30] transition-colors text-sm"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-zinc-400 mb-1 text-[11px] md:text-sm">매달 납부일</label>
                        <input
                            type="number"
                            min="1"
                            max="31"
                            value={formData.paymentDay}
                            onChange={(e) => setFormData({ ...formData, paymentDay: Number(e.target.value) })}
                            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#F22E30] transition-colors text-sm"
                            placeholder="예: 25"
                            required
                        />
                    </div>
                    <div className="mt-6">
                        <button
                            type="submit"
                            className="w-full bg-[#F22E30] text-white font-bold py-3 rounded-lg hover:brightness-90 active:scale-95 transition-all outline-none text-sm"
                        >
                            설정 저장하기
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
