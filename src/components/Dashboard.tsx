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
        const unitDisplay = selectedUnit.suffix;
        const text = `💸 실시간 방세 보고서 (${selectedUnit.name})\n- 오늘 발생한 방값: ${convert(today).toLocaleString(undefined, { maximumFractionDigits: 2 })}${unitDisplay}\n- 이번 달 누적: ${convert(thisMonth).toLocaleString(undefined, { maximumFractionDigits: 2 })}${unitDisplay}\n- 입주일 이후 누적: ${convert(monthly).toLocaleString(undefined, { maximumFractionDigits: 2 })}${unitDisplay}\n우리 같이 힘내자... #월세지옥 #킹받네`;

        if (navigator.share) {
            navigator.share({
                title: '월세 체감 카운터',
                text: text,
                url: window.location.href,
            }).catch(console.error);
        } else {
            navigator.clipboard.writeText(text);
            alert('보고서가 복사되었습니다. 친구에게 보여주세요!');
        }
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
                        className="text-5xl md:text-8xl font-black tabular-nums flex items-baseline justify-center flex-wrap"
                    >
                        <span className="text-2xl md:text-4xl text-zinc-400 font-bold mr-3 tracking-normal">{selectedUnit.name}</span>
                        <span className="bg-[linear-gradient(180deg,#F22E30_0%,#C61056_70%,#F85877_100%)] bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(242,46,48,0.4)] tracking-tighter">
                            {convert(today).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                        <span className="text-xl md:text-3xl uppercase ml-1 tracking-normal bg-[linear-gradient(180deg,#F22E30_0%,#C61056_70%,#F85877_100%)] bg-clip-text text-transparent">{selectedUnit.suffix}</span>
                    </div>
                </div>

                <div className="space-y-2">
                    <p className="text-[#F22E30] text-xs md:text-sm font-medium uppercase tracking-normal">지금까지 발생한 이번달 월세</p>
                    <div className="text-2xl md:text-4xl font-bold tabular-nums text-white flex items-baseline justify-center">
                        <span className="text-lg md:text-2xl text-zinc-500 font-bold mr-2 tracking-normal">{selectedUnit.name}</span>
                        <span className="tracking-tighter">{convert(thisMonth).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                        <span className="text-sm md:text-lg ml-1 tracking-normal">{selectedUnit.suffix}</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 pt-8 w-full">
                    <div className="bg-black/50 backdrop-blur-md p-6 rounded-2xl border border-zinc-800">
                        <p className="text-zinc-500 text-[10px] md:text-xs mb-2 uppercase tracking-wide">입주일 이후로 발생한 방값</p>
                        <div className="text-2xl md:text-3xl font-bold tabular-nums text-white flex items-baseline justify-start md:justify-center">
                            <span className="text-sm md:text-lg text-zinc-500 font-bold mr-2 tracking-normal">{selectedUnit.name}</span>
                            <span className="tracking-tighter">{convert(monthly).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                            <span className="text-xs md:text-sm ml-1 tracking-normal">{selectedUnit.suffix}</span>
                        </div>
                    </div>
                    <div className="bg-black/50 backdrop-blur-md p-6 rounded-2xl border border-zinc-800 flex flex-col justify-center items-center">
                        <div className="h-8 flex items-center justify-center overflow-hidden w-full text-center px-2">
                            <AnimatePresence mode="wait">
                                <motion.p
                                    key={jokeIndex}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="text-zinc-300 italic text-[11px] md:text-sm line-clamp-1"
                                >
                                    {JOKES[jokeIndex]}
                                </motion.p>
                            </AnimatePresence>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row justify-center items-center gap-4 pt-8 w-full max-w-sm mx-auto">
                    <div className="relative flex-1 w-full md:w-auto">
                        <button
                            onClick={() => setIsUnitMenuOpen(!isUnitMenuOpen)}
                            className="w-full h-14 flex items-center justify-center gap-2 bg-transparent text-white border border-white/20 rounded-full font-bold hover:bg-white/10 transition-all text-sm md:text-base"
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
                        className="flex-1 w-full md:w-auto h-14 flex items-center justify-center gap-2 bg-white text-black rounded-full font-bold hover:bg-zinc-200 transition-all active:scale-95 text-sm md:text-base"
                    >
                        <Share2 size={20} />
                        결과 공유하기
                    </button>
                </div>
            </motion.div>

            {/* Decorative glass elements could go here if assets were available */}
            <div className="fixed bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[#F22E30]/5 to-transparent pointer-events-none" />
        </div>
    );
};
