export const languages = {
  "English": ["American", "British", "Indian", "Australian"],
  "Spanish": ["Spain", "Mexican"],
  "French": ["France", "Canadian"],
  "German": ["Germany"],
};

export type Language = keyof typeof languages;
export type Accent = (typeof languages)[Language][number];

export const difficulties = ["Easy", "Medium", "Hard"] as const;
export type Difficulty = (typeof difficulties)[number];

export const emotions = ["Happy", "Sad", "Angry", "Excited", "Formal", "Calm"] as const;
export type Emotion = (typeof emotions)[number];


export const mockLeaderboard = [
  { rank: 1, name: 'Ava', score: 98, avatar: `https://placehold.co/40x40.png` },
  { rank: 2, name: 'Liam', score: 95, avatar: `https://placehold.co/40x40.png` },
  { rank: 3, name: 'Olivia', score: 92, avatar: `https://placehold.co/40x40.png` },
  { rank: 4, name: 'Noah', score: 89, avatar: `https://placehold.co/40x40.png` },
  { rank: 5, name: 'Emma', score: 87, avatar: `https://placehold.co/40x40.png` },
];
