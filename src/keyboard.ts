import type { GameStore } from './store';

type Key = Pick<KeyboardEvent, 'key' | 'code' | 'repeat' | 'ctrlKey' | 'metaKey' | 'altKey' | 'preventDefault'>;

export function makeKeyboardController(game: GameStore) {
  const held = new Set<string>();
  return {
    down(event: Key) {
      if (event.ctrlKey || event.metaKey || event.altKey || !(/^\d$/.test(event.key) || event.key === 'Backspace' || event.key === 'Enter')) return;
      event.preventDefault();
      if (event.repeat || held.has(event.code)) return;
      held.add(event.code);
      if (/^\d$/.test(event.key)) game.digit(event.key);
      else if (event.key === 'Backspace') game.backspace();
      else if (game.getSnapshot().feedback === 'reveal') game.next();
      else game.submit();
    },
    up(event: Pick<KeyboardEvent, 'code'>) { held.delete(event.code); },
    blur() { held.clear(); },
  };
}
