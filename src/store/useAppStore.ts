import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';

interface AppState {
    uuid: string;
    streak: number;
    lastPlayedDate: string | null;
    bookmarks: number[];
    history: number[];

    initUser: () => void;
    incrementStreak: () => void;
    toggleBookmark: (id: number) => void;
    addHistory: (id: number) => void;
}

export const useAppStore = create<AppState>()(
    persist(
        (set, get) => ({
            uuid: '',
            streak: 0,
            lastPlayedDate: null,
            bookmarks: [],
            history: [],

            initUser: () => {
                const { uuid } = get();
                if (!uuid) {
                    set({ uuid: uuidv4() });
                }
            },

            incrementStreak: () => {
                const now = new Date();
                const kstOffset = 9 * 60 * 60 * 1000;
                const today = new Date(now.getTime() + kstOffset).toISOString().split('T')[0];

                const { lastPlayedDate, streak } = get();

                if (lastPlayedDate === today) return;

                const yesterday = new Date(now.getTime() + kstOffset);
                yesterday.setDate(yesterday.getDate() - 1);
                const yesterdayStr = yesterday.toISOString().split('T')[0];

                set({
                    streak: lastPlayedDate === yesterdayStr ? streak + 1 : 1,
                    lastPlayedDate: today,
                });
            },

            toggleBookmark: (id) => {
                set((state) => {
                    const isBookmarked = state.bookmarks.includes(id);
                    return {
                        bookmarks: isBookmarked
                            ? state.bookmarks.filter((bId) => bId !== id)
                            : [...state.bookmarks, id],
                    };
                });
            },

            addHistory: (id) => {
                set((state) => {
                    const filtered = state.history.filter((hId) => hId !== id);
                    const newHistory = [id, ...filtered].slice(0, 30);
                    return { history: newHistory };
                });
            },
        }),
        {
            name: 'toss-finance-storage',
        }
    )
);
