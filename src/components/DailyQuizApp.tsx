import React, { useState, useEffect } from 'react';
import { Bookmark, Share2, ChevronRight, Check, ChevronDown, ArrowLeft, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import dataset from '../data/finance_terms_top200_ko.json';
import type { FinancialTerm } from '../types/finance';

const quizData: FinancialTerm[] = dataset as FinancialTerm[];

type ViewMode = 'learn' | 'quiz' | 'result' | 'bookmarks';

export const DailyQuizApp: React.FC = () => {
    const [currentIndex, setCurrentIndex] = useState<number>(0);
    const [viewMode, setViewMode] = useState<ViewMode>('learn');
    const [selectedChoice, setSelectedChoice] = useState<number | null>(null);

    const [isExplanationOpen, setIsExplanationOpen] = useState<boolean>(false);
    const [isDescriptionOpen, setIsDescriptionOpen] = useState<boolean>(false);

    const [bookmarkedIds, setBookmarkedIds] = useState<number[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const today = new Date().toISOString().split('T')[0];
        const savedDate = localStorage.getItem('lastPlayedDate');
        const savedIndex = localStorage.getItem('lastPlayedIndex');
        const savedBookmarks = localStorage.getItem('quiz_bookmarks');

        if (savedBookmarks) {
            setBookmarkedIds(JSON.parse(savedBookmarks));
        }

        if (savedDate === today && savedIndex !== null) {
            setCurrentIndex(parseInt(savedIndex, 10));
        } else {
            const nextIndex = savedIndex !== null ? (parseInt(savedIndex, 10) + 1) % quizData.length : 0;
            setCurrentIndex(nextIndex);
            localStorage.setItem('lastPlayedDate', today);
            localStorage.setItem('lastPlayedIndex', nextIndex.toString());
        }
        setIsLoaded(true);
    }, []);

    const currentTerm = quizData[currentIndex];

    if (!isLoaded) return <div className="min-h-screen bg-[#F2F4F6]" />;
    if (!currentTerm) return <div className="min-h-screen bg-[#F2F4F6]" />;

    const isBookmarked = bookmarkedIds.includes(currentTerm.id);

    const toggleBookmark = () => {
        const newBookmarks = isBookmarked
            ? bookmarkedIds.filter(id => id !== currentTerm.id)
            : [...bookmarkedIds, currentTerm.id];
        setBookmarkedIds(newBookmarks);
        localStorage.setItem('quiz_bookmarks', JSON.stringify(newBookmarks));
    };

    const handleStartQuiz = () => {
        setViewMode('quiz');
        // 버튼 클릭 시 덜컥거림 없이 상단이 제거될 시간을 벌면서 약간 위로 스크롤 이동
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleSubmit = () => {
        if (selectedChoice === null) return;
        setViewMode('result');
        const isCorrect = selectedChoice === currentTerm.quiz.answer;
        if (typeof window !== 'undefined' && navigator.vibrate) {
            navigator.vibrate(isCorrect ? [30, 50, 30] : 100);
        }
    };

    const handleNext = () => {
        const nextIdx = (currentIndex + 1) % quizData.length;
        setCurrentIndex(nextIdx);

        setSelectedChoice(null);
        setIsExplanationOpen(false);
        setIsDescriptionOpen(false);
        setViewMode('learn');
        window.scrollTo({ top: 0, behavior: 'smooth' });

        localStorage.setItem('lastPlayedIndex', nextIdx.toString());
    };

    const handleShare = async () => {
        const shareContent = {
            title: '하루 1개 금융 상식',
            text: `${currentTerm.shareText}\n\n오늘의 금융 지식, 토스 스타일로 정복했어요! 💪`,
        };

        if (typeof navigator !== 'undefined' && navigator.share) {
            await navigator.share(shareContent).catch(() => { });
        } else {
            await navigator.clipboard.writeText(shareContent.text);
            alert('클립보드에 복사되었습니다!');
        }
    };

    return (
        <div className="min-h-screen bg-[#F2F4F6] text-gray-900 pb-12 font-sans flex justify-center">
            <div className="w-full max-w-[420px] flex flex-col relative px-5 pt-8 overflow-x-hidden">

                {/* 상단바: 북마크 버튼 */}
                <AnimatePresence>
                    {viewMode !== 'bookmarks' && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="flex justify-end mb-4 z-10 w-full"
                        >
                            <button
                                onClick={() => setViewMode('bookmarks')}
                                className="flex items-center gap-1.5 bg-white text-gray-700 px-4 py-2 rounded-full shadow-sm border border-gray-100 font-bold text-[14px] active:scale-95 transition-transform"
                            >
                                <Bookmark size={16} className={bookmarkedIds.includes(currentTerm.id) ? "fill-[#3182F6] text-[#3182F6]" : "text-[#3182F6]"} />
                                모아보기 <span className="text-[#3182F6]">{bookmarkedIds.length}</span>
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>

                <AnimatePresence mode="wait">
                    {viewMode === 'bookmarks' ? (
                        <motion.div
                            key="bookmarks-phase"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.25, ease: 'easeOut' }}
                            className="flex flex-col w-full"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <button
                                    onClick={() => setViewMode('learn')}
                                    className="p-2 -ml-2 text-gray-600 active:bg-gray-200 rounded-full transition-colors"
                                >
                                    <ArrowLeft size={24} />
                                </button>
                                <h2 className="text-[20px] font-bold text-gray-900 border-b-2 border-transparent">내가 모은 용어</h2>
                                <div className="w-10"></div> {/* 여백용 */}
                            </div>

                            {bookmarkedIds.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[24px] shadow-sm border border-gray-100">
                                    <Bookmark size={48} className="text-gray-200 mb-4" />
                                    <p className="text-gray-500 font-semibold mb-1">아직 북마크한 용어가 없네요.</p>
                                    <p className="text-gray-400 text-[14px]">마음에 드는 용어를 저장해보세요!</p>
                                </div>
                            ) : (
                                <div className="flex flex-col gap-4 pb-8">
                                    {bookmarkedIds.map(id => {
                                        const term = quizData.find(t => t.id === id);
                                        if (!term) return null;
                                        return (
                                            <div key={id} className="bg-white rounded-[20px] p-5 shadow-sm border border-gray-100 flex flex-col gap-2 relative">
                                                <div className="flex justify-between items-start mb-1">
                                                    <h3 className="text-[18.5px] font-extrabold text-[#3182F6]">{term.term}</h3>
                                                    <button
                                                        onClick={() => {
                                                            const newBookmarks = bookmarkedIds.filter(bId => bId !== id);
                                                            setBookmarkedIds(newBookmarks);
                                                            localStorage.setItem('quiz_bookmarks', JSON.stringify(newBookmarks));
                                                        }}
                                                        className="text-gray-400 p-1.5 -mr-1.5 -mt-1.5 active:bg-red-50 active:text-red-500 rounded-full transition-colors"
                                                    >
                                                        <X size={18} />
                                                    </button>
                                                </div>
                                                <p className="text-gray-700 font-medium text-[15.5px] leading-relaxed break-keep">
                                                    {term.summary}
                                                </p>
                                                <div className="mt-2 pt-3 border-t border-gray-50">
                                                    <p className="text-gray-500 text-[14px] leading-relaxed break-keep line-clamp-2">
                                                        {term.description}
                                                    </p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </motion.div>
                    ) : viewMode === 'learn' ? (
                        <motion.div
                            key="learn-phase"
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -16 }}
                            transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
                            className="flex flex-col w-full items-center"
                        >
                            {/* --- 큰 뜻 카드 UI --- */}
                            <div className="bg-white w-full rounded-[32px] shadow-sm border border-gray-100 p-8 pt-12 pb-14 relative flex flex-col items-center text-center mt-4 mb-6">
                                <button onClick={toggleBookmark} className="absolute top-6 right-6 p-2 bg-gray-50 rounded-full active:scale-95 transition-transform">
                                    <Bookmark size={22} className={isBookmarked ? "fill-[#3182F6] text-[#3182F6]" : "text-gray-300"} />
                                </button>
                                <span className="px-4 py-1.5 bg-blue-50 text-[#3182F6] rounded-full text-[14px] font-bold mb-6">
                                    오늘의 금융 한 줄
                                </span>
                                <h1 className="text-[36px] font-extrabold text-gray-900 mb-6 tracking-tight break-keep">
                                    {currentTerm.term}
                                </h1>
                                <p className="text-[18px] text-gray-600 font-medium leading-relaxed break-keep">
                                    {currentTerm.summary}
                                </p>
                            </div>

                            {/* --- 안내 문구 및 CTA --- */}

                            <button
                                onClick={handleStartQuiz}
                                className="w-full py-4.5 rounded-[16px] bg-[#3182F6] text-white font-bold text-[17px] shadow-[0_8px_24px_rgba(49,130,246,0.3)] transition-all active:scale-[0.98] hover:bg-[#1b64da]"
                            >
                                문제 풀이 시작
                            </button>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="quiz-phase"
                            layout
                            initial={{ opacity: 0, y: 16, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -16, scale: 0.98 }}
                            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                            className="flex flex-col w-full"
                        >
                            {/* --- 퀴즈 카드 --- */}
                            <motion.div layout className="bg-white rounded-[24px] shadow-sm border border-gray-100 p-6 mb-6">
                                <div className="mb-6">
                                    <span className="inline-block px-3 py-1 bg-gray-100 text-gray-600 rounded-lg text-[13px] font-bold mb-3">
                                        3초 퀴즈
                                    </span>
                                    <p className="text-[17.5px] font-bold leading-snug break-keep text-gray-800">
                                        {currentTerm.quiz.question}
                                    </p>
                                </div>

                                <div className="flex flex-col gap-2.5">
                                    {currentTerm.quiz.choices.map((choice, idx) => {
                                        const isSelected = selectedChoice === idx;
                                        const isAnswer = currentTerm.quiz.answer === idx;
                                        const isSubmitted = viewMode === 'result';

                                        let btnClass = "bg-[#F2F4F6] text-gray-700 border border-transparent hover:bg-gray-100";
                                        let showBadge = false;

                                        if (isSubmitted) {
                                            if (isAnswer) {
                                                btnClass = "bg-[#22C55E]/10 text-[#22C55E] border border-[#22C55E] font-bold";
                                                showBadge = true;
                                            } else if (isSelected) {
                                                btnClass = "bg-red-50 text-red-500 border border-red-200";
                                            } else {
                                                btnClass = "bg-[#F2F4F6] text-gray-300 opacity-60 border-transparent";
                                            }
                                        } else if (isSelected) {
                                            btnClass = "bg-[#3182F6]/10 text-[#3182F6] border border-[#3182F6] font-bold";
                                        }

                                        return (
                                            <button
                                                key={idx}
                                                disabled={isSubmitted}
                                                onClick={() => setSelectedChoice(idx)}
                                                className={`w-full text-left px-5 py-4 rounded-[16px] text-[15px] font-semibold transition-all active:scale-[0.98] flex items-center justify-between ${btnClass}`}
                                            >
                                                <span className="break-keep pr-2 leading-snug">{choice}</span>
                                                {showBadge && (
                                                    <span className="shrink-0 bg-[#22C55E] text-white text-[12px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm">
                                                        <Check size={12} strokeWidth={3} /> 정답
                                                    </span>
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                            </motion.div>

                            {/* --- 하단 동적 영역 (결과 확인 or 결과 영역) --- */}
                            <motion.div layout className="flex flex-col w-full">
                                <AnimatePresence mode="wait">
                                    {viewMode === 'quiz' && (
                                        <motion.div
                                            key="quiz-bottom"
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -20 }}
                                            transition={{ duration: 0.35, ease: "easeOut" }}
                                            className="w-full flex flex-col"
                                        >
                                            <button
                                                disabled={selectedChoice === null}
                                                onClick={handleSubmit}
                                                className={`w-full py-4.5 rounded-[16px] text-white font-bold text-[17px] transition-all shadow-lg ${selectedChoice !== null
                                                        ? 'bg-[#3182F6] hover:bg-[#1b64da] active:scale-[0.98]'
                                                        : 'bg-gray-300 opacity-60'
                                                    }`}
                                            >
                                                정답 확인하기
                                            </button>
                                        </motion.div>
                                    )}

                                    {viewMode === 'result' && (
                                        <motion.div
                                            key="result-bottom"
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -20 }}
                                            transition={{ duration: 0.35, ease: "easeOut" }}
                                            className="w-full flex flex-col"
                                        >
                                            <div className="flex flex-col gap-3 mb-8">
                                                {/* 해설 보기 아코디언 */}
                                                <div className="bg-white rounded-[20px] shadow-sm border border-gray-100 overflow-hidden">
                                                    <button
                                                        onClick={() => setIsExplanationOpen(!isExplanationOpen)}
                                                        className="w-full flex justify-between items-center p-5 active:bg-gray-50 transition-colors"
                                                    >
                                                        <span className="font-bold text-gray-900 text-[16px] flex items-center gap-2">
                                                            💡 해설 보기
                                                        </span>
                                                        <ChevronDown size={20} className={`text-gray-400 transition-transform duration-300 ${isExplanationOpen ? 'rotate-180' : ''}`} />
                                                    </button>
                                                    <AnimatePresence>
                                                        {isExplanationOpen && (
                                                            <motion.div
                                                                initial={{ height: 0, opacity: 0 }}
                                                                animate={{ height: 'auto', opacity: 1 }}
                                                                exit={{ height: 0, opacity: 0 }}
                                                                transition={{ duration: 0.25, ease: 'easeOut' }}
                                                                className="overflow-hidden"
                                                            >
                                                                <div className="px-5 pb-5 pt-1">
                                                                    <p className="text-[15px] text-[#3182F6] font-semibold bg-[#3182F6]/5 p-4 rounded-xl leading-snug break-keep">
                                                                        {currentTerm.quiz.explanation}
                                                                    </p>
                                                                </div>
                                                            </motion.div>
                                                        )}
                                                    </AnimatePresence>
                                                </div>

                                                {/* 좀 더 알아보기 아코디언 */}
                                                <div className="bg-white rounded-[20px] shadow-sm border border-gray-100 overflow-hidden">
                                                    <button
                                                        onClick={() => setIsDescriptionOpen(!isDescriptionOpen)}
                                                        className="w-full flex justify-between items-center p-5 active:bg-gray-50 transition-colors"
                                                    >
                                                        <span className="font-bold text-gray-900 text-[16px] flex items-center gap-2">
                                                            📖 좀 더 알아보기
                                                        </span>
                                                        <ChevronDown size={20} className={`text-gray-400 transition-transform duration-300 ${isDescriptionOpen ? 'rotate-180' : ''}`} />
                                                    </button>
                                                    <AnimatePresence>
                                                        {isDescriptionOpen && (
                                                            <motion.div
                                                                initial={{ height: 0, opacity: 0 }}
                                                                animate={{ height: 'auto', opacity: 1 }}
                                                                exit={{ height: 0, opacity: 0 }}
                                                                transition={{ duration: 0.25, ease: 'easeOut' }}
                                                                className="overflow-hidden"
                                                            >
                                                                <div className="px-5 pb-5 pt-1">
                                                                    <p className="text-[15px] text-gray-600 leading-relaxed font-medium break-keep">
                                                                        {currentTerm.description}
                                                                    </p>
                                                                </div>
                                                            </motion.div>
                                                        )}
                                                    </AnimatePresence>
                                                </div>

                                                {/* 결과 자랑하기 공유 버튼 */}
                                                <button
                                                    onClick={handleShare}
                                                    className="w-full flex items-center justify-center gap-2 bg-white text-gray-700 font-bold text-[16px] py-4 rounded-[16px] shadow-sm border border-gray-200 active:bg-gray-50 transition-colors"
                                                >
                                                    <Share2 size={18} />
                                                    결과 자랑하기
                                                </button>
                                            </div>

                                            {/* 다음 용어 보기 버튼 */}
                                            <button
                                                onClick={handleNext}
                                                className="w-full py-4.5 rounded-[16px] bg-[#22C55E] hover:bg-[#16a34a] text-white font-bold text-[17px] shadow-[0_8px_24px_rgba(34,197,94,0.3)] transition-all active:scale-[0.98] flex items-center justify-center gap-1"
                                            >
                                                다음 용어 보기 <ChevronRight size={20} />
                                            </button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>

                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};
