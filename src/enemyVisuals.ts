import { enemyById, type EnemyId } from './enemies';
import type { WeaponShape } from './weaponVisuals';
export function enemyShapes(id:EnemyId):WeaponShape[] {
 const {visual:v}=enemyById(id), shapes:WeaponShape[]=[];
 const ellipse=(x:number,y:number,width:number,height:number,fill:string,opacity=1)=>shapes.push({type:'ellipse',x,y,width,height,fill,opacity});
 const rect=(x:number,y:number,width:number,height:number,fill:string)=>shapes.push({type:'rect',x,y,width,height,fill});
 const poly=(points:number[][],fill:string,opacity=1)=>shapes.push({type:'polygon',points,fill,opacity});
 const eyes=(y:number,wide=14)=>{ellipse(-wide,y,9,12,'#24352f');ellipse(wide,y,9,12,'#24352f');rect(-9,y+20,18,4,'#354039');};
 if(v.kind==='slime') {
  ellipse(0,-62,160,120,v.color);ellipse(-21,-85,43,23,'#d2df94',.6);ellipse(0,-10,176,22,v.color);eyes(-70,25);poly([[-37,-86],[-12,-80],[-13,-86]],'#415d3d');poly([[14,-86],[36,-91],[35,-85]],'#415d3d');
 } else if(v.kind==='flame') {
  poly([[-60,-10],[-77,-81],[-45,-65],[-51,-140],[-15,-119],[8,-218],[37,-150],[55,-179],[69,-90],[45,-6]],v.color);
  poly([[-36,-8],[-43,-64],[-15,-58],[0,-124],[23,-81],[36,-13]],v.accent);eyes(-85,19);
 } else if(v.kind==='shadow'||v.kind==='mage') {
  ellipse(0,-106,145,170,v.accent,.1);
  poly([[-57,-8],[-38,-128],[-39,-177],[0,-221],[41,-177],[35,-128],[65,-8],[22,-20],[0,-5],[-23,-20]],v.color);
  ellipse(0,-157,58,51,'#263242');ellipse(-13,-160,10,8,v.accent);ellipse(13,-160,10,8,v.accent);
  if(v.kind==='mage'){poly([[-55,-181],[0,-256],[39,-181]],v.accent);rect(64,-166,8,159,'#967450');ellipse(68,-179,27,34,v.accent);poly([[-24,-72],[0,-99],[24,-72],[0,-46]],v.accent);}
 } else {
  rect(-39,-44,26,42,'#34463f');rect(13,-44,26,42,'#34463f');
  if(v.kind==='royal') poly([[-49,-167],[-87,-5],[86,-5],[51,-167]],'#633d57');
  const breadth=v.kind==='royal'?138:v.kind==='wood'?68:100;
  ellipse(0,-101,breadth,137,v.color);rect(-breadth/2,-145,breadth,58,v.color);
  rect(-breadth/2,-63,breadth,13,v.accent);ellipse(0,-58,17,17,'#e5ce83');
  ellipse(-breadth/2-8,-120,27,45,v.color);ellipse(breadth/2+8,-120,27,45,v.color);
  ellipse(0,-180,v.kind==='royal'?88:69,68,v.kind==='wood'?'#c6a46f':v.color);
  if(v.kind==='armor'){rect(-36,-190,72,19,'#31424a');rect(-22,-185,15,5,'#e6dcb5');rect(8,-185,15,5,'#e6dcb5');poly([[-23,-213],[0,-236],[28,-213]],v.accent);rect(-5,-168,10,36,v.accent);}
  else eyes(-181);
  if(v.kind==='wood'){poly([[-39,-199],[-14,-230],[0,-213],[29,-237],[39,-199]],v.accent);rect(56,-190,10,181,'#79553c');poly([[56,-165],[40,-187],[44,-195],[65,-178]],'#79553c');}
  else {rect(75,-172,8,144,'#79553c');poly([[67,-175],[70,-225],[83,-245],[94,-220],[90,-175]],v.accent);rect(63,-176,32,9,'#dab866');}
 }
 const variant=v.variant??0;
 if(variant){
  if(variant%4===0){poly([[-32,-195],[-66,-248],[-51,-190]],v.accent);poly([[32,-195],[66,-248],[51,-190]],v.accent);}
  if(variant%4===1){poly([[-40,-146],[-109,-196],[-90,-62],[-43,-90]],v.accent,.85);poly([[40,-146],[109,-196],[90,-62],[43,-90]],v.accent,.85);}
  if(variant%4===2){poly([[-74,-157],[-110,-132],[-100,-57],[-68,-33],[-39,-68],[-42,-137]],v.accent);rect(-80,-132,8,68,'#f1e4bc');rect(-100,-108,48,8,'#f1e4bc');}
  if(variant%4===3){ellipse(77,-150,54,48,v.accent);rect(72,-140,10,126,'#d1b47a');poly([[-38,-205],[0,-278],[38,-205]],v.accent);}
  if(variant%2)rect(-28,-175,56,7,v.accent);else ellipse(0,-150,25,12,v.accent);
 }
 if(v.crown){poly([[-39,-209],[-48,-244],[-20,-232],[0,-260],[20,-232],[48,-244],[39,-209]],v.accent);ellipse(0,-231,10,13,'#c56370');}
 return shapes.map(shape=>shape.type==='polygon'?{...shape,points:shape.points.map(([x,y])=>[x*v.size,y*v.size])}:{...shape,x:shape.x*v.size,y:shape.y*v.size,width:shape.width*v.size,height:shape.height*v.size});
}
