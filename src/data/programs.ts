/** The six programs listed in the Services section, shared with the program details dialog. */
export const programs = [
  { name: 'Individual therapy', tags: ['+ 50-Min Sessions', '+ Personalized Care'], image: 'c015c.png' },
  { name: 'Stress & anxiety support', tags: ['+ 8 Weeks Sessions', '+ Beginner Friendly'], image: '0c189.png' },
  { name: 'Couples & family care', tags: ['+ Joint Sessions', '+ Relationship Focused'], image: '506ba.png' },
  { name: 'Yoga & Mentoring', tags: ['+ Practical Sessions', '+ Personalized Outcomes'], image: 'd456c.png' },
  { name: 'Mindfulness practice', tags: ['+ Daily Practice Sessions', '+ Guided Exercises'], image: 'ac63c.png' },
  { name: 'Personal growth coaching', tags: ['+ Daily Practice Sessions', '+ Personalized Growth'], image: '79171.png' },
];

/** Which program the hero's "How are you feeling today?" choices lead to. */
export const feelingToProgram: Record<string, number> = {
  'Constant Stress': 1,
  'Trouble Sleeping': 1,
  'Self Doubt': 5,
  'Emotional Burnout': 0,
  'Feeling Overwhelmed': 4,
};
