type EventName =
    | 'app_visit'
    | 'term_view'
    | 'term_flip'
    | 'quiz_answer'
    | 'quiz_complete'
    | 'share_click'
    | 'bookmark_click';

export const logEvent = (eventName: EventName, payload?: Record<string, unknown>) => {
    const timestamp = new Date().toISOString();
    console.log(
        `%c[Analytics 📊] %c${eventName}`,
        'color: #3182F6; font-weight: bold;',
        'color: #111; font-weight: bold;',
        { timestamp, ...payload }
    );
};
