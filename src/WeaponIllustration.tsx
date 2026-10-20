import { weaponShapes } from './weaponVisuals';
import { WEAPONS, type WeaponId } from './weapons';

export function WeaponIllustration({ weapon }: { weapon: WeaponId }) {
  return <svg className={`weapon-art tier-${WEAPONS[weapon].tier}`} viewBox="-65 -160 130 195" role="img" aria-label={WEAPONS[weapon].name}>
    {weaponShapes(weapon).map((shape, index) => {
      const props = { fill: shape.fill, opacity: shape.opacity ?? 1 };
      if (shape.type === 'polygon') return <polygon key={index} {...props} points={shape.points.map(point => point.join(',')).join(' ')} />;
      if (shape.type === 'ellipse') return <ellipse key={index} {...props} cx={shape.x} cy={shape.y} rx={shape.width / 2} ry={shape.height / 2} />;
      return <rect key={index} {...props} x={shape.x} y={shape.y} width={shape.width} height={shape.height} />;
    })}
  </svg>;
}
