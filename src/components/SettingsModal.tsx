'use client';

import React, { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { RentData } from '../utils/rentUtils';

interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
    data: RentData;
    onSave: (newData: RentData) => void;
}

// Helper component for dynamic width input to keep units sticky at 8px
const AutoWidthInput: React.FC<{
    value: string;
    onChange: (val: string) => void;
    placeholder: string;
    unit?: string;
    type?: string;
    className?: string;
    required?: boolean;
    min?: string;
    max?: string;
}> = ({ value, onChange, placeholder, unit, type = "text", className = "", required, min, max }) => {
    const spanRef = useRef<HTMLSpanElement>(null);
    const [width, setWidth] = useState(0);

    useEffect(() => {
        if (spanRef.current) {
            // Add a small buffer for cursor and padding
            setWidth(spanRef.current.offsetWidth + 2);
        }
    }, [value, placeholder]);

    return (
        <div className="flex items-center gap-[8px] w-full">
            <div className="relative flex items-center min-w-0">
                <input
                    type={type}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    required={required}
                    min={min}
                    max={max}
                    className={`bg-transparent text-white focus:outline-none text-sm transition-all duration-75 ${className}`}
                    style={{ width: `${Math.max(width, 20)}px` }}
                />
                {/* Measuring span */}
                <span
                    ref={spanRef}
                    className="absolute invisible whitespace-pre font-sans text-sm px-0"
                >
                    {value || placeholder}
                </span>
            </div>
            {unit && (
                <span className="text-zinc-500 text-sm font-bold shrink-0">{unit}</span>
            )}
        </div>
    );
};

export const SettingsModal: React.FC<SettingsModalProps> = ({
    isOpen,
    onClose,
    data,
    onSave,
}) => {
    const [formData, setFormData] = useState<RentData>(data);

    useEffect(() => {
        setFormData(data);
    }, [data, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
        onClose();
    };

    const handleDateChange = (val: string) => {
        // Extract only digits
        let digits = val.replace(/\D/g, '').substring(0, 8);

        let yearStr = digits.substring(0, 4);
        let monthStr = digits.substring(4, 6);
        let dayStr = digits.substring(6, 8);

        // [Validation] Month: 1-12
        if (monthStr.length === 2) {
            let m = parseInt(monthStr, 10);
            if (m > 12) monthStr = '12';
            if (m === 0) monthStr = '01';
        }

        // [Validation] Day: Max days in month/year
        if (dayStr.length === 2 && monthStr.length === 2 && yearStr.length === 4) {
            let y = parseInt(yearStr, 10);
            let m = parseInt(monthStr, 10);
            let d = parseInt(dayStr, 10);

            // Get actual max days for this month
            const maxDays = new Date(y, m, 0).getDate();
            if (d > maxDays) dayStr = String(maxDays).padStart(2, '0');
            if (d === 0) dayStr = '01';
        }

        // Format for display: YYYY.MM.DD
        let formatted = yearStr;
        if (monthStr) formatted += '.' + monthStr;
        if (dayStr) formatted += '.' + dayStr;

        // Internal store uses YYYY-MM-DD
        setFormData({ ...formData, startDate: formatted.replace(/\./g, '-') });
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
                        <label className="block text-sm font-medium text-zinc-400 mb-1 text-[11px] md:text-sm">매달 납부액</label>
                        <div className="flex items-center bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 focus-within:border-[#F22E30] transition-colors">
                            <AutoWidthInput
                                placeholder="예: 600,000"
                                value={formData.totalRent === 0 ? '' : formData.totalRent.toLocaleString()}
                                unit="원"
                                onChange={(val) => {
                                    const raw = val.replace(/,/g, '');
                                    if (raw === '') {
                                        setFormData({ ...formData, totalRent: 0 });
                                    } else if (!isNaN(Number(raw))) {
                                        setFormData({ ...formData, totalRent: Number(raw) });
                                    }
                                }}
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-zinc-400 mb-1 text-[11px] md:text-sm">최초 입주일 (YYYY.MM.DD)</label>
                        <div className="flex items-center bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 focus-within:border-[#F22E30] transition-colors">
                            <input
                                type="text"
                                placeholder="예: 2026.01.18"
                                value={formData.startDate.replace(/-/g, '.')}
                                onChange={(e) => handleDateChange(e.target.value)}
                                className="w-full bg-transparent text-white focus:outline-none text-sm"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-zinc-400 mb-1 text-[11px] md:text-sm">매달 납부일</label>
                        <div className="flex items-center bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 focus-within:border-[#F22E30] transition-colors">
                            <AutoWidthInput
                                type="number"
                                min="1"
                                max="31"
                                placeholder="예: 25"
                                value={formData.paymentDay === 0 ? '' : String(formData.paymentDay)}
                                unit="일"
                                className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                onChange={(val) => {
                                    if (val === '') {
                                        setFormData({ ...formData, paymentDay: 0 });
                                        return;
                                    }
                                    let num = parseInt(val, 10);
                                    if (isNaN(num)) return;
                                    if (num > 31) num = 31;
                                    if (num < 1) num = 1;
                                    setFormData({ ...formData, paymentDay: num });
                                }}
                                required
                            />
                        </div>
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
