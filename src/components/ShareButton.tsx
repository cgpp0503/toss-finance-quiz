import React from 'react';
import { Share2 } from 'lucide-react';
import { logEvent } from '../utils/analytics';
import type { FinancialTerm } from '../types/finance';

interface ShareButtonProps {
    term: FinancialTerm;
}

export const ShareButton: React.FC<ShareButtonProps> = ({ term }) => {
    const handleShare = async () => {
        logEvent('share_click', { termId: term.id, termName: term.term });

        const isVariantA = Math.random() > 0.5;
        const titleText = isVariantA
            ? `오늘의 금융 퀴즈 성공 🎉`
            : `60초 금융 두뇌운동 완료 💪`;

        const shareMessage = `
${titleText}

${term.term} = ${term.summary}

🟩🟩⬛🟩🟩

하루 1분, 토스체로 경제 상식 채우기 👇
https://finance-mini.app
`.trim();

        if (typeof navigator !== 'undefined' && navigator.share) {
            try {
                await navigator.share({
                    title: '하루 1개 금융 상식',
                    text: shareMessage,
                });
            } catch (err) {
                console.error('공유가 취소되었거나 실패했습니다.', err);
            }
        } else {
            try {
                await navigator.clipboard.writeText(shareMessage);
                alert('공유 텍스트가 클립보드에 복사되었습니다! 🚀');
            } catch (err) {
                console.error('클립보드 복사 실패', err);
            }
        }
    };

    return (
        <button
            onClick={handleShare}
            className="flex items-center justify-center gap-2 w-full py-4 mt-4 bg-[#3182F6] hover:bg-[#1b64da] text-white font-bold text-[16px] rounded-2xl shadow-[0_4px_14px_0_rgba(49,130,246,0.39)] transition-all active:scale-[0.98]"
        >
            <Share2 size={18} strokeWidth={2.5} />
            <span>결과 자랑하기</span>
        </button>
    );
};
