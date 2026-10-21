export const ARENAS=[
  {
    "id": 0,
    "name": "Skoglysningen",
    "theme": "Skog",
    "background": "#264d48",
    "accent": "#9db36c"
  },
  {
    "id": 1,
    "name": "Myras kommunekontor",
    "theme": "Myr",
    "background": "#304a4b",
    "accent": "#a6b767"
  },
  {
    "id": 2,
    "name": "Kryssfinerborgen",
    "theme": "Borg",
    "background": "#46515b",
    "accent": "#ccb282"
  },
  {
    "id": 3,
    "name": "Frostens venterom",
    "theme": "Is",
    "background": "#315f78",
    "accent": "#bbebef"
  },
  {
    "id": 4,
    "name": "Det våte hoff",
    "theme": "Hav",
    "background": "#234f69",
    "accent": "#72cdd1"
  },
  {
    "id": 5,
    "name": "Tordenakademiet",
    "theme": "Storm",
    "background": "#454469",
    "accent": "#c4b7eb"
  },
  {
    "id": 6,
    "name": "Krystallkammeret",
    "theme": "Krystall",
    "background": "#4d466d",
    "accent": "#aee5d9"
  },
  {
    "id": 7,
    "name": "Vulkanens styrerom",
    "theme": "Vulkan",
    "background": "#623d38",
    "accent": "#e5ab6e"
  },
  {
    "id": 8,
    "name": "Stjernebyråkratiet",
    "theme": "Kosmos",
    "background": "#30385f",
    "accent": "#cba9e8"
  },
  {
    "id": 9,
    "name": "Tronen uten ende",
    "theme": "Trone",
    "background": "#4b3356",
    "accent": "#efcc7c"
  }
] as const;
export const arenaIndex=(number:number)=>Math.floor((number-1)/10);
