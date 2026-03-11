export const getDailyIndex = (uuid: string, maxIndex: number): number => {
    if (!uuid || maxIndex <= 0) return 0;

    const now = new Date();
    const kstOffset = 9 * 60 * 60 * 1000;
    const kstDate = new Date(now.getTime() + kstOffset);
    const today = kstDate.toISOString().split('T')[0];

    const seedString = `${uuid}-${today}`;

    let hash = 0;
    for (let i = 0; i < seedString.length; i++) {
        const char = seedString.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }

    return Math.abs(hash) % maxIndex;
};
