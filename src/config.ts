export const CONFIG = {
  minFactor: 1,
  maxFactor: 10,
  maxDigits: 3,
  maxNameLength: 20,
  strength: 5,
  weapon: {
    name: 'En pinne med ambisjoner',
    description: 'Overbevist om at den en dag skal bli et legendarisk sverd.',
    damage: 3,
  },
  timing: {
    correct: 1200,
    wrong: 350,
    correctPulse: 460,
    reveal: 430,
    attackForward: 170,
    attackSwing: 160,
    attackReturn: 280,
    hit: 90,
    damageFloat: 750,
    idle: 1500,
  },
  colors: [
    { id: 'forest', name: 'Skoggrønn', value: '#69b89a', dark: '#397d68' },
    { id: 'berry', name: 'Bærrosa', value: '#d6849a', dark: '#9b506b' },
    { id: 'sky', name: 'Himmelblå', value: '#7caedc', dark: '#507cad' },
  ],
} as const;

export type HeroColor = typeof CONFIG.colors[number]['id'];
export const attackDamage = CONFIG.strength + CONFIG.weapon.damage;
