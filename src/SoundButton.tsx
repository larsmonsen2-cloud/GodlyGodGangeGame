import { useSyncExternalStore } from 'react';
import { sound } from './sound';

export function SoundButton() {
  const enabled = useSyncExternalStore(sound.subscribe, sound.getSnapshot);
  return <button type="button" className="sound-button" aria-label="Lydeffekter" aria-pressed={enabled} title={enabled ? 'Slå av lydeffekter' : 'Slå på lydeffekter'} onClick={() => sound.setEnabled(!enabled)}>
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true"><path d="M4 9h4l5-4v14l-5-4H4z" />{enabled ? <path d="M16 8c3 2 3 6 0 8m3-11c5 4 5 10 0 14" /> : <path d="m17 9 5 6m0-6-5 6" />}</svg>
    <span>{enabled ? 'Lyd på' : 'Lyd av'}</span>
  </button>;
}
