import React from 'react';

interface DailyQuoteProps {
    quote: string;
}

export const DailyQuote: React.FC<DailyQuoteProps> = ({ quote }) => {
    return (
        <div className="px-6 py-2">
            <div className="flex flex-col items-center justify-center px-4 py-3.5 bg-[#3182F6]/10 rounded-2xl">
                <span className="text-[11px] font-bold text-[#3182F6] mb-1 opacity-80 uppercase tracking-widest">오늘의 금융 한 줄</span>
                <p className="text-[#3182F6] font-semibold text-center text-[15px] leading-snug tracking-tight">
                    "{quote}"
                </p>
            </div>
        </div>
    );
};
