'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, Share2, AlertCircle, ChevronDown } from 'lucide-react';
import { useRentCounter } from '../hooks/useRentCounter';
import { RentData, UNIT_LIST, RentUnit } from '../utils/rentUtils';
import { MoneyEffects } from './MoneyEffects';

const JOKES = [
    "이 돈이면 국밥이 몇 그릇이야?",
    "숨만 쉬어도 돈이 나가네...",
    "월급은 통장을 스칠 뿐...",
    "커피 한 잔 덜 마시면 뭐해, 월세가 이건데.",
    "집주인 웃음소리가 여기까지 들린다.",
    "오늘도 누군가의 대출 이자를 대신 갚아주고 계시는군요.",
    "한강 뷰는 아니어도 한강 물 온도는 체크하게 되네.",
    "월세 내려고 태어난 건 아닐 텐데."
];

interface DashboardProps {
    rentData: RentData;
    onOpenSettings: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ rentData, onOpenSettings }) => {
    const { today, monthly, thisMonth, perSecond } = useRentCounter(rentData);
    const [selectedUnit, setSelectedUnit] = useState<RentUnit>(UNIT_LIST[0]);
    const [isUnitMenuOpen, setIsUnitMenuOpen] = useState(false);
    const [copied, setCopied] = useState(false);
    const [jokeIndex, setJokeIndex] = useState(0);
    const [isShaking, setIsShaking] = useState(false);
    const [lastMilestone, setLastMilestone] = useState(0);

    const todayProgress = useMemo(() => {
        const dailyRent = perSecond * 24 * 3600;
        if (dailyRent === 0) return 0;
        return Math.min(today / dailyRent, 1);
    }, [today, perSecond]);

    const convert = (value: number) => {
        return value / selectedUnit.value;
    };

    const renderValue = (value: number, sizeClasses: { whole: string, decimal: string, unit: string }, options?: { isGradient?: boolean }) => {
        const formatted = convert(value).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        const [whole, decimal] = formatted.split('.');

        return (
            <span className="inline-flex items-baseline flex-wrap">
                <span className={sizeClasses.whole}>{whole}</span>
                <span
                    className={`${sizeClasses.decimal} ${options?.isGradient ? 'bg-clip-text text-transparent' : 'text-white/50'}`}
                    style={options?.isGradient ? { backgroundImage: 'linear-gradient(180deg,#F22E3080_0%,#C6105680_70%,#F8587780_100%)' } : undefined}
                >
                    .{decimal}
                </span>
                <span className={sizeClasses.unit + " ml-1 uppercase tracking-wide"}>{selectedUnit.suffix}</span>
            </span>
        );
    };

    // Milestone shake effect (every 1000 KRW)
    useEffect(() => {
        const currentMilestone = Math.floor(monthly / 1000);
        if (currentMilestone > lastMilestone && lastMilestone !== 0) {
            setIsShaking(true);
            setLastMilestone(currentMilestone);
            setTimeout(() => setIsShaking(false), 500);
        } else if (lastMilestone === 0 && monthly > 0) {
            setLastMilestone(currentMilestone);
        }
    }, [monthly, lastMilestone]);

    // Rotate jokes every 5 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            setJokeIndex((prev) => (prev + 1) % JOKES.length);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    const handleShare = () => {
        const shareUrl = "https://pj-wallse-gepzphhfz-uichans-projects.vercel.app/";

        navigator.clipboard.writeText(shareUrl).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }).catch(err => {
            console.error('Copy failed:', err);
        });
    };

    return (
        <div className={`min-h-screen flex flex-col items-center justify-center p-6 bg-black text-white relative overflow-hidden ${isShaking ? 'animate-shake' : ''}`}>
            {/* Interactive Visual Effects */}
            <MoneyEffects progress={todayProgress} unitName={selectedUnit.name} />

            {/* Header */}
            <div className="absolute top-6 right-6 flex gap-4 z-20">
                <button
                    onClick={onOpenSettings}
                    className="p-2 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-[#F22E30] hover:border-[#F22E30] transition-all"
                >
                    <Settings size={24} />
                </button>
            </div>

            {/* Hero Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-2xl text-center space-y-8 z-10 relative"
            >
                <div className="space-y-4">
                    <h1 className="text-zinc-500 font-medium tracking-tight uppercase text-xs md:text-sm">
                        <span className="text-[#F22E30] font-bold">{rentData.userName || '친구'}</span>님의 오늘 발생하고 있는 실시간 방세
                    </h1>
                    <div
                        className="text-5xl md:text-8xl font-black tabular-nums flex items-baseline justify-center flex-wrap w-full px-4"
                    >
                        <span className="text-2xl md:text-4xl text-zinc-400 font-bold mr-3 tracking-wider">{selectedUnit.name}</span>
                        <span className="bg-[linear-gradient(180deg,#F22E30_0%,#C61056_70%,#F85877_100%)] bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(242,46,48,0.4)] tracking-tighter pr-10">
                            {renderValue(today, {
                                whole: "",
                                decimal: "",
                                unit: "text-xl md:text-3xl bg-[linear-gradient(180deg,#F22E30_0%,#C61056_70%,#F85877_100%)] bg-clip-text text-transparent"
                            }, { isGradient: true })}
                        </span>
                    </div>
                </div>

                {/* 2단: 감성 문구 (D) */}
                <div className="py-8 h-24 flex items-center justify-center overflow-hidden w-full text-center px-6">
                    <AnimatePresence mode="wait">
                        <motion.p
                            key={jokeIndex}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="text-zinc-400 italic text-sm md:text-lg line-clamp-2 max-w-lg"
                        >
                            &quot;{JOKES[jokeIndex]}&quot;
                        </motion.p>
                    </AnimatePresence>
                </div>

                {/* 3단: 2열 그리드 (C, B) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 pt-4 w-full">
                    {/* 왼쪽: 입주일 이후 발생 방값 (C) */}
                    <div className="bg-black/50 backdrop-blur-md p-6 rounded-2xl border border-zinc-800 h-40 flex flex-col justify-center items-center text-center">
                        <p className="text-zinc-500 text-[10px] md:text-xs mb-2 uppercase tracking-wide">입주일 이후로 발생한 방값</p>
                        <div className="text-2xl md:text-3xl font-bold tabular-nums text-white flex items-baseline justify-center">
                            <span className="text-sm md:text-lg text-zinc-500 font-bold mr-2 tracking-wider">{selectedUnit.name}</span>
                            <span className="tracking-tighter">
                                {renderValue(monthly, {
                                    whole: "",
                                    decimal: "",
                                    unit: "text-xs md:text-sm"
                                })}
                            </span>
                        </div>
                    </div>

                    {/* 오른쪽: 이번 달 누적 월세 (B) */}
                    <div className="bg-black/50 backdrop-blur-md p-6 rounded-2xl border border-zinc-800 h-40 flex flex-col justify-center items-center text-center">
                        <p className="text-zinc-500 text-[10px] md:text-xs mb-2 uppercase tracking-wide">지금까지 발생한 이번달 월세</p>
                        <div className="text-2xl md:text-3xl font-bold tabular-nums text-white flex items-baseline justify-center">
                            <span className="text-sm md:text-lg text-zinc-500 font-bold mr-2 tracking-wider">{selectedUnit.name}</span>
                            <span className="tracking-tighter">
                                {renderValue(thisMonth, {
                                    whole: "",
                                    decimal: "",
                                    unit: "text-xs md:text-sm"
                                })}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row justify-center items-center gap-4 pt-8 w-full max-w-sm mx-auto">
                    <div className="relative flex-1 w-full md:w-auto">
                        <button
                            onClick={() => setIsUnitMenuOpen(!isUnitMenuOpen)}
                            className="w-full h-14 py-3 flex items-center justify-center gap-2 bg-transparent text-white border border-white/20 rounded-full font-bold hover:bg-white/10 transition-all text-sm md:text-base outline-none"
                        >
                            <span className="text-zinc-400 font-normal mr-1 text-xs">단위:</span>
                            {selectedUnit.name}
                            <ChevronDown size={16} className={`transition-transform ${isUnitMenuOpen ? 'rotate-180' : ''}`} />
                        </button>

                        <AnimatePresence>
                            {isUnitMenuOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 10 }}
                                    className="absolute bottom-full mb-2 left-0 w-full bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-2xl z-30"
                                >
                                    {UNIT_LIST.map((unit) => (
                                        <button
                                            key={unit.name}
                                            onClick={() => {
                                                setSelectedUnit(unit);
                                                setIsUnitMenuOpen(false);
                                            }}
                                            className={`w-full text-left px-4 py-3 text-sm hover:bg-zinc-800 transition-colors ${selectedUnit.name === unit.name ? 'text-[#F22E30] font-bold' : 'text-zinc-400'}`}
                                        >
                                            {unit.name}
                                        </button>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <button
                        onClick={handleShare}
                        className={`flex-1 w-full md:w-auto h-14 py-3 flex items-center justify-center gap-2 rounded-full font-bold transition-all active:scale-95 text-sm md:text-base outline-none ${copied ? 'bg-green-500 text-white' : 'bg-white text-black hover:bg-zinc-200'}`}
                    >
                        {copied ? (
                            <>복사 완료!</>
                        ) : (
                            <>
                                <Share2 size={20} />
                                링크 공유하기
                            </>
                        )}
                    </button>
                </div>
            </motion.div>

            {/* Decorative glass elements could go here if assets were available */}
            <div className="fixed bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[#F22E30]/5 to-transparent pointer-events-none" />
        </div>
    );
};
