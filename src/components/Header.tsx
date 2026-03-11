import React from 'react';
import { Flame } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';

export const Header: React.FC = () => {
    const streak = useAppStore((state) => state.streak);

    return (
        <header className="flex items-center justify-between px-6 py-4 bg-[#F2F4F6]">
            <div className="flex flex-col">
                <h1 className="text-[22px] font-bold text-gray-900 tracking-tight leading-tight">
                    하루 1개 금융 상식
                </h1>
                <p className="text-[13px] text-gray-500 font-medium mt-0.5">
                    매일 3초 투자로 경제 마스터하기
                </p>
            </div>

            <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-full shadow-sm">
                <Flame
                    className={`w-[18px] h-[18px] ${streak > 0 ? 'text-[#22C55E]' : 'text-gray-300'}`}
                    strokeWidth={2.5}
                />
                <span className="text-[14px] font-bold text-gray-800">
                    {streak}일째
                </span>
            </div>
        </header>
    );
};
