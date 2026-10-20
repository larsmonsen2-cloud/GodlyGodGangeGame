import { enemyShapes } from './enemyVisuals';
import { enemyById, type EnemyId } from './enemies';

export function EnemyIllustration({ enemy }: { enemy: EnemyId }) {
  return <svg className="enemy-art" viewBox="-145 -365 290 380" role="img" aria-label={enemyById(enemy).name}>
    {enemyShapes(enemy).map((shape, index) => {
      const props = { fill: shape.fill, opacity: shape.opacity ?? 1 };
      if (shape.type === 'polygon') return <polygon key={index} {...props} points={shape.points.map(point => point.join(',')).join(' ')} />;
      if (shape.type === 'ellipse') return <ellipse key={index} {...props} cx={shape.x} cy={shape.y} rx={shape.width / 2} ry={shape.height / 2} />;
      return <rect key={index} {...props} x={shape.x} y={shape.y} width={shape.width} height={shape.height} />;
    })}
  </svg>;
}
