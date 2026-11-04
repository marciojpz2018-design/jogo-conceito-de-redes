import * as THREE from 'three';

// Original arcade combat racer. It shares the existing Three.js renderer and pixel-art canvas.
export const RACE_CHARACTERS = [
  { id:'scorpion', name:'SCORPION', vehicle:'Hellfire Kart', title:'Vingança Infernal', main:'Lança da Serpente', mainDesc:'Arpão flamejante atinge e incendeia o rival à frente.', secondary:'Chamas do Netherrealm', secondaryDesc:'Deixa uma faixa de fogo por quatro segundos.', passiveDesc:'Recebe bônus de velocidade com energia alta.', color:0xe64b2f, stats:{speed:55,accel:14,control:.74,weight:.72,recharge:1}, mainType:'fire', secondaryType:'firetrail', passive:'heat' },
  { id:'subzero', name:'SUB-ZERO', vehicle:'Lin Kuei Frostbite', title:'Tração Criomante', main:'Rajada de Gelo', mainDesc:'Onda congelante reduz velocidade e controle dos rivais.', secondary:'Escudo de Gelo', secondaryDesc:'Bloqueia um ataque e espalha fragmentos.', passiveDesc:'Mantém o controle nas curvas geladas.', color:0x55c8ed, stats:{speed:49,accel:13,control:.97,weight:.87,recharge:1.14}, mainType:'wave', secondaryType:'shield', passive:'polar' },
  { id:'raiden', name:'RAIDEN', vehicle:'Thunder God Raijin', title:'Bateria Celestial', main:'Relâmpago Encadeado', mainDesc:'Descarga elétrica atinge até três karts próximos.', secondary:'Sobrecarga do Trovão', secondaryDesc:'Aumenta aceleração e velocidade por três segundos.', passiveDesc:'Curvas e contatos carregam energia adicional.', color:0xe5c64b, stats:{speed:52,accel:18,control:.67,weight:.85,recharge:1.24}, mainType:'chain', secondaryType:'boost', passive:'battery' },
  { id:'liukang', name:'LIU KANG', vehicle:'Dragon Fury', title:'Voo do Dragão', main:'Punho do Dragão', mainDesc:'Projétil de fogo do dragão superaquecido atinge o alvo.', secondary:'Salto Voador', secondaryDesc:'Impulso frontal salta por cima de armadilhas.', passiveDesc:'Recebe energia extra nas rampas.', color:0xd14932, stats:{speed:54,accel:17,control:.82,weight:.7,recharge:1.04}, mainType:'fire', secondaryType:'windjump', passive:'aero' },
  { id:'smoke', name:'SMOKE', vehicle:'Enenra Phantom', title:'Guerreiro Espectral', main:'Cortina de Fumaça', mainDesc:'Envolve os rivais próximos em fumaça e tira o controle deles.', secondary:'Névoa de Fuga', secondaryDesc:'Encobre os rivais próximos e deixa uma nuvem na pista.', passiveDesc:'Recupera energia extra quando está atrás do pelotão.', color:0xb9c4ce, stats:{speed:52,accel:16,control:.86,weight:.74,recharge:1.14}, mainType:'fog', secondaryType:'fog', passive:'night' },
  { id:'noob', name:'NOOB SAIBOT', vehicle:'Shadow Wraith', title:'Espectro das Sombras', main:'Clone Sombrio', mainDesc:'Um projétil de sombra atinge e faz o rival rodar.', secondary:'Passo das Sombras', secondaryDesc:'Fica intangível por um instante e ganha impulso.', passiveDesc:'Recupera energia enquanto disputa as últimas posições.', color:0x63518e, stats:{speed:53,accel:15,control:.82,weight:.79,recharge:1.12}, mainType:'shadow', secondaryType:'windjump', passive:'night' },
  { id:'reptile', name:'REPTILE', vehicle:'Zaterran Acid Runner', title:'Sangue Frio', main:'Cuspe Ácido', mainDesc:'Veneno corrói a aceleração do alvo por cinco segundos.', secondary:'Mina Ácida', secondaryDesc:'Armadilha tóxica afeta quem passar por ela.', passiveDesc:'Efeitos negativos duram menos tempo.', color:0x62ba57, stats:{speed:51,accel:15,control:.84,weight:.7,recharge:1.08}, mainType:'poison', secondaryType:'mine', passive:'antidote' },
  { id:'kitana', name:'KITANA', vehicle:'Edenian Blue Razor', title:'Vento Edeniano', main:'Ciclone dos Leques', mainDesc:'Tornado teleguiado faz o rival rodar.', secondary:'Guarda dos Leques', secondaryDesc:'Reflete o próximo projétil contra o atacante.', passiveDesc:'Ganha impulso e energia ao saltar nas rampas.', color:0x4798d6, stats:{speed:54,accel:15,control:.96,weight:.62,recharge:1.08}, mainType:'tornado', secondaryType:'reflect', passive:'aero' },
  { id:'kunglao', name:'KUNG LAO', vehicle:'Razor Hat Racer', title:'Lâmina do Monastério', main:'Chapéu Giratório', mainDesc:'Lança o chapéu cortante teleguiado contra um adversário.', secondary:'Guarda do Monastério', secondaryDesc:'Armadura reduz colisões e impactos por cinco segundos.', passiveDesc:'Seu kart pesado domina colisões.', color:0xd1bd78, stats:{speed:50,accel:15,control:.88,weight:1.02,recharge:1.04}, mainType:'hat', secondaryType:'armor', passive:'heavy' },
  { id:'shao', name:'SHAO KAHN', vehicle:'Outworld Warlord Crusher', title:'Imperador da Arena', main:'Martelo do Imperador', mainDesc:'Abalo sísmico empurra karts e quebra obstáculos.', secondary:'Armadura do Outworld', secondaryDesc:'Reduz empurrões e dano por cinco segundos.', passiveDesc:'Perde menos velocidade e empurra karts leves.', color:0x8e4a56, stats:{speed:44,accel:10,control:.69,weight:1.34,recharge:.92}, mainType:'quake', secondaryType:'armor', passive:'heavy' }
];

const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const wrap=(v,m)=>((v%m)+m)%m;
const lerp=(a,b,t)=>a+(b-a)*t;

export function createRaceGame(renderer) {
  const scene=new THREE.Scene(); scene.background=new THREE.Color(0x172b35); scene.fog=new THREE.FogExp2(0x172b35,.009);
  const camera=new THREE.PerspectiveCamera(62,innerWidth/innerHeight,.1,420);
  camera.position.set(0,88,145);camera.lookAt(0,0,0);
  scene.add(new THREE.HemisphereLight(0xc9e8ff,0x29241d,2.1));
  const sun=new THREE.DirectionalLight(0xffd795,3); sun.position.set(-45,75,35); sun.castShadow=true; sun.shadow.mapSize.set(1024,1024); sun.shadow.camera.left=-100;sun.shadow.camera.right=100;sun.shadow.camera.top=100;sun.shadow.camera.bottom=-100; scene.add(sun);
  const mats={
    asphalt:new THREE.MeshStandardMaterial({color:0x373d42,roughness:.94}),line:new THREE.MeshBasicMaterial({color:0xe9dcaa}),edge:new THREE.MeshBasicMaterial({color:0xc9b97d}),
    grass:new THREE.MeshStandardMaterial({color:0x38313a,roughness:1}),volcano:new THREE.MeshStandardMaterial({color:0x66352f,roughness:1}),ice:new THREE.MeshStandardMaterial({color:0x496575,roughness:.8}),storm:new THREE.MeshStandardMaterial({color:0x3d4359,roughness:1}),temple:new THREE.MeshStandardMaterial({color:0x756348,roughness:1}),
    wall:new THREE.MeshStandardMaterial({color:0x827b68,roughness:.85}),rock:new THREE.MeshStandardMaterial({color:0x55514b,roughness:1}),lava:new THREE.MeshBasicMaterial({color:0xf45b2b}),crystal:new THREE.MeshStandardMaterial({color:0x7ee2ec,metalness:.18,roughness:.3,emissive:0x196d89,emissiveIntensity:.5}),
    capsule:new THREE.MeshStandardMaterial({color:0x6dfff0,metalness:.25,roughness:.22,emissive:0x148a94,emissiveIntensity:.7}),white:new THREE.MeshStandardMaterial({color:0xf8f0d0}),dark:new THREE.MeshStandardMaterial({color:0x18232a}),
    gold:new THREE.MeshStandardMaterial({color:0xffd459,emissive:0x815000,emissiveIntensity:.35}),
  };
  const shared={box:new THREE.BoxGeometry(1,1,1),sphere:new THREE.SphereGeometry(1,12,8),wheel:new THREE.CylinderGeometry(.42,.42,.28,12),capsule:new THREE.IcosahedronGeometry(.65,1),pillar:new THREE.CylinderGeometry(.5,.68,1,6),crystal:new THREE.ConeGeometry(1,2.2,5),barrier:new THREE.BoxGeometry(1,1,1),ring:new THREE.TorusGeometry(1,.22,7,22),plane:new THREE.PlaneGeometry(1,1)};
  const N=640,ROAD_WIDTH=15,HALF=ROAD_WIDTH/2;
  const curve=new THREE.CatmullRomCurve3([
    new THREE.Vector3(0,0,-61),new THREE.Vector3(36,0,-56),new THREE.Vector3(61,0,-36),new THREE.Vector3(67,0,0),new THREE.Vector3(56,0,38),new THREE.Vector3(31,0,57),new THREE.Vector3(-4,0,62),new THREE.Vector3(-40,0,53),new THREE.Vector3(-63,0,28),new THREE.Vector3(-69,0,-9),new THREE.Vector3(-54,0,-43),new THREE.Vector3(-28,0,-59)
  ],true,'catmullrom',.35);
  curve.arcLengthDivisions=1800; curve.updateArcLengths(); const trackLength=curve.getLength();
  function poseAt(distance,lane=0){
    const t=wrap(distance,trackLength)/trackLength,center=curve.getPointAt(t),tangent=curve.getTangentAt(t).normalize();
    const right=new THREE.Vector3(tangent.z,0,-tangent.x).normalize(); center.addScaledVector(right,lane); return {position:center,tangent,right,t};
  }
  function makeRoad(){
    const positions=[],indices=[];
    for(let i=0;i<=N;i++){
      const t=i/N,p=curve.getPointAt(t),tan=curve.getTangentAt(t),right=new THREE.Vector3(tan.z,0,-tan.x).normalize();
      positions.push(p.x-right.x*HALF,p.y-.08,p.z-right.z*HALF,p.x+right.x*HALF,p.y-.08,p.z+right.z*HALF);
      if(i<N){const a=i*2;indices.push(a,a+2,a+1,a+1,a+2,a+3)}
    }
    const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));g.setIndex(indices);g.computeVertexNormals();
    const road=new THREE.Mesh(g,mats.asphalt);road.receiveShadow=true;scene.add(road);
    const ground= new THREE.Mesh(new THREE.PlaneGeometry(360,360),mats.grass);ground.rotation.x=-Math.PI/2;ground.position.y=-.42;ground.receiveShadow=true;scene.add(ground);
    const dashCount=Math.ceil(N/3)*2,barrierCount=Math.ceil(N/3)*2;
    const dashBatch=new THREE.InstancedMesh(shared.box,mats.line,dashCount),barrierBatch=new THREE.InstancedMesh(shared.box,mats.edge,barrierCount),dummy=new THREE.Object3D();
    let di=0,bi=0;
    for(let i=0;i<N;i+=3){const p=curve.getPointAt(i/N),tan=curve.getTangentAt(i/N),right=new THREE.Vector3(tan.z,0,-tan.x).normalize();
      for(const lane of [-1.75,1.75]){dummy.position.copy(p).addScaledVector(right,lane);dummy.position.y=-.045;dummy.scale.set(.16,.035,1.4);dummy.rotation.set(0,Math.atan2(-tan.x,-tan.z),0);dummy.updateMatrix();dashBatch.setMatrixAt(di++,dummy.matrix)}
      for(const side of [-1,1]){dummy.position.copy(p).addScaledVector(right,side*(HALF+.45));dummy.position.y=.03;dummy.scale.set(.35,.42,1.3);dummy.rotation.set(0,Math.atan2(-tan.x,-tan.z),0);dummy.updateMatrix();barrierBatch.setMatrixAt(bi++,dummy.matrix)}
    }
    dashBatch.count=di;barrierBatch.count=bi;dashBatch.instanceMatrix.needsUpdate=true;barrierBatch.instanceMatrix.needsUpdate=true;barrierBatch.castShadow=true;scene.add(dashBatch,barrierBatch);
  }
  makeRoad();
  function groundTheme(t){return t<.25?mats.volcano:t<.5?mats.ice:t<.75?mats.storm:mats.temple}
  function addSectorScenery(){
    for(let i=0;i<72;i++){
      const t=i/72,p=curve.getPointAt(t),tan=curve.getTangentAt(t),right=new THREE.Vector3(tan.z,0,-tan.x).normalize(),theme=groundTheme(t);
      for(const side of [-1,1]){
        const offset=HALF+5+(i%3)*1.8,q=p.clone().addScaledVector(right,side*offset);
        const prop=new THREE.Group();prop.position.copy(q);prop.rotation.y=Math.atan2(-tan.x,-tan.z);scene.add(prop);
        if(t<.25){const b=new THREE.Mesh(shared.pillar,mats.rock);b.scale.set(2,2.7,2);b.position.y=1.1;prop.add(b);if(i%3===0){const lava=new THREE.Mesh(shared.box,mats.lava);lava.scale.set(5,.08,3);lava.position.set(side*2,-.26,0);prop.add(lava)}}
        else if(t<.5){const c=new THREE.Mesh(shared.crystal,mats.crystal);c.scale.set(1.2,1.5,1.2);c.position.y=.9;prop.add(c)}
        else if(t<.75){const pylon=new THREE.Mesh(shared.pillar,mats.wall);pylon.scale.set(.55,5,.55);pylon.position.y=2.2;prop.add(pylon);const spark=new THREE.Mesh(shared.sphere,mats.gold);spark.scale.set(.22,.22,.22);spark.position.y=4.7;prop.add(spark)}
        else{const col=new THREE.Mesh(shared.pillar,mats.temple);col.scale.set(1.2,4.5,1.2);col.position.y=2.05;prop.add(col);if(i%4===0){const cap=new THREE.Mesh(shared.box,mats.wall);cap.scale.set(2.3,.42,1.5);cap.position.y=4.45;prop.add(cap)}}
      }
    }
  }
  addSectorScenery();
  function addArch(distance,color,label){
    const p=poseAt(distance),g=new THREE.Group();g.position.copy(p.position);g.position.y=0;g.rotation.y=Math.atan2(-p.tangent.x,-p.tangent.z);scene.add(g);
    const ring=new THREE.Mesh(shared.ring,new THREE.MeshStandardMaterial({color,emissive:color,emissiveIntensity:.25,roughness:.45}));ring.scale.set(8,.62,1);ring.position.y=5;g.add(ring);
    for(const side of [-1,1]){const post=new THREE.Mesh(shared.box,mats.wall);post.scale.set(.65,5,.65);post.position.set(side*7.7,2.5,0);g.add(post)}
    g.userData.checkpoint=label;
  }
  addArch(0,0xffdc71,'LARGADA');for(let i=1;i<=4;i++)addArch(trackLength*i/4,[0xf47042,0x7ee2ec,0xb7adff,0xf3cf78][i-1],`CP ${i}`);
  function addStartLine(){const p=poseAt(0),g=new THREE.Group();g.position.copy(p.position);g.position.y=.005;g.rotation.y=Math.atan2(-p.tangent.x,-p.tangent.z);scene.add(g);for(let i=0;i<12;i++){const x=-7.2+i*1.2,block=new THREE.Mesh(shared.box,i%2?mats.dark:mats.white);block.scale.set(1.2,.05,1.3);block.position.set(x,0,0);g.add(block)}}addStartLine();

  const characterById=Object.fromEntries(RACE_CHARACTERS.map(c=>[c.id,c]));
  function makeDriverSprite(racer){
    const can=document.createElement('canvas');can.width=16;can.height=20;const ctx=can.getContext('2d');ctx.imageSmoothingEnabled=false;
    const color=`#${racer.character.color.toString(16).padStart(6,'0')}`;
    ctx.fillStyle='#17232c';ctx.fillRect(4,0,8,6);ctx.fillStyle=color;ctx.fillRect(3,5,10,10);ctx.fillStyle='#d3a57c';ctx.fillRect(5,6,6,6);ctx.fillStyle='#f6f0df';ctx.fillRect(6,8,1,1);ctx.fillRect(10,8,1,1);ctx.fillStyle=color;ctx.fillRect(1,7,3,7);ctx.fillRect(12,7,3,7);
    if(racer.id==='scorpion'){ctx.fillStyle='#ffcf55';ctx.fillRect(4,0,8,2);ctx.fillRect(5,3,6,2)}
    if(racer.id==='subzero'){ctx.fillStyle='#9cf4ff';ctx.fillRect(4,0,8,3);ctx.fillRect(4,9,8,2)}
    if(racer.id==='raiden'){ctx.fillStyle='#f1d768';ctx.fillRect(1,0,14,2);ctx.fillRect(3,2,10,2)}
    if(racer.id==='smoke'){ctx.fillStyle='#cbd5dc';ctx.fillRect(4,2,8,3);ctx.fillStyle='#e8f0f4';ctx.fillRect(5,7,6,2)}
    if(racer.id==='noob'){ctx.fillStyle='#090a12';ctx.fillRect(4,0,8,9);ctx.fillStyle='#9b82d5';ctx.fillRect(6,7,1,1);ctx.fillRect(10,7,1,1)}
    if(racer.id==='kunglao'){ctx.fillStyle='#d8c77f';ctx.fillRect(1,0,14,2);ctx.fillRect(5,2,6,2)}
    const tex=new THREE.CanvasTexture(can);tex.magFilter=THREE.NearestFilter;tex.minFilter=THREE.NearestFilter;tex.colorSpace=THREE.SRGBColorSpace;
    const sprite=new THREE.Sprite(new THREE.SpriteMaterial({map:tex,transparent:true,alphaTest:.08,depthWrite:false}));sprite.position.set(0,1.65,-.1);sprite.scale.set(1.25,1.55,1);return sprite;
  }
  function makeVehicle(racer){
    const root=new THREE.Group(),color=new THREE.MeshStandardMaterial({color:racer.character.color,metalness:.22,roughness:.4}),dark=new THREE.MeshStandardMaterial({color:0x20272a,roughness:.48});
    const body=new THREE.Mesh(shared.box,color);body.scale.set(1.72,.65,3);body.position.y=.65;body.castShadow=true;root.add(body);
    const nose=new THREE.Mesh(shared.box,color);nose.scale.set(1.28,.46,1.05);nose.position.set(0,.66,-1.85);root.add(nose);
    const cockpit=new THREE.Mesh(shared.box,new THREE.MeshStandardMaterial({color:0x314c59,metalness:.3,roughness:.18}));cockpit.scale.set(1.05,.68,1.15);cockpit.position.set(0,1.15,-.45);root.add(cockpit);
    const spoiler=new THREE.Mesh(shared.box,dark);spoiler.scale.set(1.6,.13,.28);spoiler.position.set(0,1.1,1.4);root.add(spoiler);
    for(const x of [-.96,.96])for(const z of [-.92,.92]){const w=new THREE.Mesh(shared.wheel,dark);w.rotation.z=Math.PI/2;w.position.set(x,.38,z);root.add(w)}
    root.add(makeDriverSprite(racer));
    const glow=new THREE.PointLight(racer.character.color,0,8);glow.position.set(0,.7,1.35);root.add(glow);racer.glow=glow;
    scene.add(root);return root;
  }
  const capsuleDistances=[];
  for(let i=0;i<24;i++)capsuleDistances.push({distance:(i+.5)*trackLength/24,lane:(i*7)%3-1,id:i,respawn:0,used:new Set(),mesh:null});
  function createCapsules(){for(const c of capsuleDistances){const p=poseAt(c.distance,c.lane*3.5);const group=new THREE.Group();group.position.copy(p.position);group.position.y=1.25;scene.add(group);const gem=new THREE.Mesh(shared.capsule,mats.capsule);gem.scale.set(.62,.83,.62);group.add(gem);const ring=new THREE.Mesh(shared.ring,mats.gold);ring.scale.set(.9,.9,.9);group.add(ring);c.mesh=group}}
  createCapsules();
  const hazardDefs=[];
  for(let i=0;i<16;i++){
    const distance=(i+.5)*trackLength/16,lane=(i*5+1)%3-1,type=i<4?'rock':i<8?'ice':i<12?'storm':'temple';
    const p=poseAt(distance,lane*3.5),hazard=new THREE.Group();hazard.position.copy(p.position);hazard.rotation.y=Math.atan2(-p.tangent.x,-p.tangent.z);scene.add(hazard);
    const obstacle=new THREE.Mesh(shared.box,type==='rock'?mats.rock:type==='ice'?mats.crystal:type==='storm'?mats.gold:mats.wall);obstacle.scale.set(1.55,1.45,1.4);obstacle.position.y=.73;obstacle.castShadow=true;hazard.add(obstacle);
    hazardDefs.push({distance,lane,type,group:hazard,broken:false});
  }
  const shortcuts=[{distance:trackLength*.215,lane:-1,label:'ATALHO VULCÂNICO'},{distance:trackLength*.715,lane:1,label:'PASSAGEM DO TEMPLO'}].map(s=>{const p=poseAt(s.distance,s.lane*3.5),g=new THREE.Group();g.position.copy(p.position);g.rotation.y=Math.atan2(-p.tangent.x,-p.tangent.z);scene.add(g);const a=new THREE.Mesh(shared.box,new THREE.MeshBasicMaterial({color:0x5bffcf}));a.scale.set(3.1,.13,8);a.position.y=.04;g.add(a);return {...s,mesh:g,used:new Set()}});
  const rampDefs=[.14,.46,.68].map((t,i)=>{const distance=t*trackLength,lane=i-1,p=poseAt(distance,lane*3.5),g=new THREE.Group();g.position.copy(p.position);g.rotation.y=Math.atan2(-p.tangent.x,-p.tangent.z);scene.add(g);const ramp=new THREE.Mesh(shared.box,new THREE.MeshStandardMaterial({color:i===0?0xed9b43:i===1?0x8be1ee:0xf0d277}));ramp.scale.set(3.6,.7,5);ramp.position.set(0,.27,0);ramp.rotation.x=-.15;g.add(ramp);return {distance,lane,group:g,used:new Set()}});

  const racers=[];
  const playerInputs={throttle:false,brake:false,left:false,right:false,drift:false};
  let padLaneLatch=false,padMainLatch=false,padSecondaryLatch=false,padRecoverLatch=false;
  let selectedId='scorpion',state='menu',countdown=3,elapsed=0,lastTime=0,playerFinished=false,onFinish=null;
  let ranking=[],shots=[],hazardEffects=[],particles=[],raceMessage='',messageTimer=0;
  let audioContext=null,sfxGain=null,musicGain=null,musicTimer=0,musicStep=0,engineOsc=null,engineGain=null;
  let quality=localStorage.getItem('race-quality')||'pixel';
  let sensitivity=Number(localStorage.getItem('race-sensitivity')||'1');
  const effectColors={fire:0xff6533,ice:0x66dff2,bolt:0xffe158,shadow:0x9f78e2,rock:0xc29467,wind:0x82f4db,poison:0x8be44e,magnet:0x7bb7ff,light:0xfff4ab,time:0xc9b8ff};
  function audioStart(){
    if(audioContext){if(audioContext.state==='suspended')audioContext.resume();return}
    const AC=window.AudioContext||window.webkitAudioContext;if(!AC)return;
    audioContext=new AC();sfxGain=audioContext.createGain();sfxGain.gain.value=Number(localStorage.getItem('race-sfx')??'.6');sfxGain.connect(audioContext.destination);
    musicGain=audioContext.createGain();musicGain.gain.value=Number(localStorage.getItem('race-music')??'.35');musicGain.connect(audioContext.destination);
    engineOsc=audioContext.createOscillator();engineGain=audioContext.createGain();engineOsc.type='sawtooth';engineOsc.frequency.value=54;engineGain.gain.value=.012;engineOsc.connect(engineGain);engineGain.connect(sfxGain);engineOsc.start();
    musicTimer=window.setInterval(()=>{if(state!=='race'||!audioContext)return;const notes=[110,138.59,164.81,220,164.81,138.59];const osc=audioContext.createOscillator(),gain=audioContext.createGain();osc.type='triangle';osc.frequency.value=notes[musicStep++%notes.length];gain.gain.setValueAtTime(.0001,audioContext.currentTime);gain.gain.exponentialRampToValueAtTime(.025,audioContext.currentTime+.025);gain.gain.exponentialRampToValueAtTime(.0001,audioContext.currentTime+.23);osc.connect(gain);gain.connect(musicGain);osc.start();osc.stop(audioContext.currentTime+.25)},260);
  }
  function beep(freq=440,duration=.12,type='sine'){
    if(!audioContext||!sfxGain)return;const o=audioContext.createOscillator(),g=audioContext.createGain();o.type=type;o.frequency.value=freq;g.gain.setValueAtTime(.0001,audioContext.currentTime);g.gain.exponentialRampToValueAtTime(.07,audioContext.currentTime+.012);g.gain.exponentialRampToValueAtTime(.0001,audioContext.currentTime+duration);o.connect(g);g.connect(sfxGain);o.start();o.stop(audioContext.currentTime+duration+.02)
  }
  function buildRacers(){
    for(const old of racers){scene.remove(old.root);old.root.traverse(node=>{if(node.material){const materials=Array.isArray(node.material)?node.material:[node.material];for(const material of materials){material.map?.dispose();material.dispose()}}})}
    racers.length=0;
    const order=RACE_CHARACTERS.map(c=>c.id);
    order.forEach((id,i)=>{
      const character=characterById[id],gridBack=Math.floor(i/2)*4+(i%2?1.7:0),lane=(i%3)-1;
      const r={id,character,isPlayer:id===selectedId,gridBack,progress:0,speed:0,lane,laneTarget:lane,energy:id===selectedId?25:20,
        mainCd:0,secondaryCd:0,boost:0,controlLoss:0,stun:0,phase:0,shield:0,armor:0,intangible:0,fog:0,poison:0,overheated:0,disabled:0,chrono:0,reflect:false,
        lap:0,nextCheckpoint:1,finished:false,finishTime:null,lastSplit:0,lastLap:0,bestLap:Infinity,lastOvertake:-10,oldRank:i,hits:0,overtakes:0,capsules:0,
        driftCharge:0,stuntCharge:0,history:[],ai:{skill:.78+Math.random()*.19,aggression:.35+Math.random()*.6,precision:.7+Math.random()*.28,reaction:.2+Math.random()*.45,timer:Math.random(),stuck:0,lastProgress:0},effects:{},projectiles:[],mineCd:0,shortcutLap:{},hazardCooldown:0,curveBonus:0};
      r.root=makeVehicle(r);r.root.position.set(0,-30,0);racerSetStats(r);racers.push(r);
    });
  }
  function racerSetStats(r){r.maxSpeed=r.character.stats.speed;r.accel=r.character.stats.accel;r.handling=r.character.stats.control;r.weight=r.character.stats.weight;r.recharge=r.character.stats.recharge}
  function player(){return racers.find(r=>r.isPlayer)}
  function createParticle(position,color,amount=12,scale=1){
    for(let i=0;i<amount;i++){const m=new THREE.Mesh(shared.sphere,new THREE.MeshBasicMaterial({color,transparent:true,opacity:.92}));m.scale.setScalar(.1+Math.random()*.22);m.position.copy(position);scene.add(m);particles.push({mesh:m,life:.45+Math.random()*.55,velocity:new THREE.Vector3((Math.random()-.5)*9,Math.random()*6,(Math.random()-.5)*9),scale})}
  }
  function toast(text,color='#ffe38b'){raceMessage=text;messageTimer=1.5;const el=document.getElementById('raceMessage');if(el){el.textContent=text;el.style.color=color;el.classList.add('show')} }
  function setPosition(r){
    const routeD=r.progress-r.gridBack,p=poseAt(routeD,r.lane*3.5),right=p.right;
    r.worldPosition=p.position.clone().add(new THREE.Vector3(0,.2,0));r.worldTangent=p.tangent;
    r.root.position.copy(r.worldPosition);r.root.position.addScaledVector(right,r.laneOffset||0);r.root.position.y+=r.phase>0?Math.sin(clamp(r.phase/.8,0,1)*Math.PI)*.65:0;r.root.rotation.y=Math.atan2(-p.tangent.x,-p.tangent.z)+(r.speed<0?Math.PI:0);
    r.root.rotation.z=(r.laneTarget-r.lane)*-.08+(r.stun>0?Math.sin(performance.now()*.03)*.22:0);
    r.root.visible=true;
  }
  function resetRace(id=selectedId){
    selectedId=id;state='countdown';countdown=3.4;elapsed=0;playerFinished=false;shots.forEach(x=>scene.remove(x.mesh));shots=[];hazardEffects.forEach(x=>scene.remove(x.mesh));hazardEffects=[];particles.forEach(x=>scene.remove(x.mesh));particles=[];ranking=[];buildRacers();
    capsuleDistances.forEach(c=>{c.used.clear();c.respawn=0;c.mesh.visible=true});hazardDefs.forEach(h=>{h.broken=false;h.group.visible=true});shortcuts.forEach(s=>s.used.clear());playerInputs.throttle=false;playerInputs.brake=false;audioStart();
    racers.forEach(setPosition);ranking=[...racers].sort((a,b)=>(b.progress-b.gridBack)-(a.progress-a.gridBack));ranking.forEach((r,i)=>r.oldRank=i);const p=player(),pose=poseAt(p.progress-p.gridBack,p.lane*3.5);camera.position.copy(pose.position).addScaledVector(pose.tangent,-12);camera.position.y=7;camera.lookAt(pose.position);updateOverlay('3');toast('POSIÇÕES! PREPARE-SE');
  }
  function updateOverlay(value){const el=document.getElementById('raceCountdown');if(el){el.textContent=value;el.classList.toggle('hidden',!value)}}
  function start(id=selectedId){resetRace(id)}
  function recover(r){if(!r)return;const lap=Math.max(0,r.lap-1),checkpoint=clamp(r.nextCheckpoint-1,0,3);r.progress=lap*trackLength+checkpoint*trackLength/4+2+r.gridBack;r.lane=0;r.laneTarget=0;r.speed=Math.max(12,r.speed*.72);r.stun=0;r.effects={};setPosition(r);if(r.isPlayer)toast('REPOSICIONADO NO CHECKPOINT','#b9f0ff')}
  function pause(){if(state==='race'){state='pause';document.getElementById('racePause')?.classList.remove('hidden');engineGain?.gain.setTargetAtTime(.001,audioContext.currentTime,.1)}else if(state==='pause')resume()}
  function resume(){if(state==='pause'){state='race';document.getElementById('racePause')?.classList.add('hidden');engineGain?.gain.setTargetAtTime(.012,audioContext.currentTime,.1)}}
  function setInput(key,on=true){
    const k=key.toLowerCase();if(k==='w'||k==='arrowup')playerInputs.throttle=on;else if(k==='s'||k==='arrowdown')playerInputs.brake=on;else if(k==='a'||k==='arrowleft')playerInputs.left=on;else if(k==='d'||k==='arrowright')playerInputs.right=on;else if(k===' ')playerInputs.drift=on;
    if(!on)return;
    if(k==='e'||k===' ')useMain(player());if(k==='shift')useSecondary(player());if(k==='r')recover(player());
  }
  function pointerAction(action,on=true){if(action==='accelerate')playerInputs.throttle=on;else if(action==='brake')playerInputs.brake=on;else if(action==='left')playerInputs.left=on;else if(action==='right')playerInputs.right=on;else if(action==='drift')playerInputs.drift=on;else if(on&&action==='main')useMain(player());else if(on&&action==='secondary')useSecondary(player())}
  function pollGamepad(){
    const pad=navigator.getGamepads?.()[0];if(!pad)return;
    playerInputs.throttle=!!pad.buttons[7]?.pressed||!!pad.buttons[0]?.pressed;
    playerInputs.brake=!!pad.buttons[6]?.pressed;playerInputs.drift=!!pad.buttons[1]?.pressed;
    const axis=pad.axes[0]||0;if(Math.abs(axis)<.3)padLaneLatch=false;else if(!padLaneLatch){playerInputs[axis<0?'left':'right']=true;padLaneLatch=true}
    const main=!!pad.buttons[3]?.pressed,secondary=!!pad.buttons[2]?.pressed,recoverButton=!!pad.buttons[8]?.pressed;
    if(main&&!padMainLatch)useMain(player());if(secondary&&!padSecondaryLatch)useSecondary(player());if(recoverButton&&!padRecoverLatch)recover(player());
    padMainLatch=main;padSecondaryLatch=secondary;padRecoverLatch=recoverButton;
  }

  function rankRacers(){
    ranking=[...racers].sort((a,b)=>{
      if(a.finished&&b.finished)return a.finishTime-b.finishTime;
      if(a.finished)return -1;if(b.finished)return 1;return (b.progress-b.gridBack)-(a.progress-a.gridBack)
    });
    ranking.forEach((r,i)=>{
      if(i<r.oldRank&&elapsed-r.lastOvertake>4&&r!==player()){r.energy=Math.min(100,r.energy+5);r.overtakes++;r.lastOvertake=elapsed}
      if(i<r.oldRank&&r===player()&&elapsed-r.lastOvertake>4){r.energy=Math.min(100,r.energy+5);r.overtakes++;r.lastOvertake=elapsed;toast(`ULTRAPASSAGEM · ${i+1}º LUGAR`)}
      r.oldRank=i;
    });
  }
  function updateCheckpoint(r,oldRoute,newRoute){
    if(newRoute<=oldRoute)return;
    const checkpoints=[trackLength*.25,trackLength*.5,trackLength*.75,trackLength];
    let cpDist=checkpoints[r.nextCheckpoint-1] + Math.floor(Math.max(0,oldRoute)/trackLength)*trackLength;
    while(newRoute>=cpDist){
      const cp=r.nextCheckpoint;
      if(cp===4){r.lastLap=elapsed-r.lastSplit;r.bestLap=Math.min(r.bestLap,r.lastLap);r.lastSplit=elapsed;r.lap++;r.nextCheckpoint=1;
        if(r.character.passive==='light'){r.energy=Math.min(100,r.energy+18);r.poison=0;r.stun=Math.max(0,r.stun-.5);r.overheated=0}
        if(r.isPlayer&&r.lap<=3)toast(`VOLTA ${Math.min(3,r.lap)} / 3`,'#fff0b3');
      }else{r.nextCheckpoint++;if(r.character.passive==='time')r.energy=Math.min(100,r.energy+4)}
      cpDist=checkpoints[r.nextCheckpoint-1]+Math.floor(Math.max(0,cpDist)/trackLength)*trackLength;
    }
    if(!r.finished&&newRoute>=trackLength*3){r.finished=true;r.finishTime=elapsed;r.speed=0;if(r.isPlayer){playerFinished=true;state='finished';updateOverlay('');document.getElementById('raceHud')?.classList.add('hidden');window.setTimeout(()=>onFinish?.(getResults()),350)}}
  }
  function getResults(){rankRacers();return {ranking:ranking.map((r,i)=>({place:i+1,name:r.character.name,vehicle:r.character.vehicle,id:r.id,time:r.finishTime??elapsed,bestLap:r.bestLap,hits:r.hits,overtakes:r.overtakes,capsules:r.capsules,finished:r.finished})),elapsed,player:player()?.id}}
  function energyGain(r,amount){r.energy=clamp(r.energy+amount*r.recharge,0,100)}
  function addEffect(r,key,duration,value=1,source=null){
    if(r.shield>0&&['slow','spin','poison','freeze','overheat'].includes(key)){r.shield=0;createParticle(r.worldPosition,0x8ceaff,16);for(const nearby of racers)if(nearby!==r&&Math.abs(nearby.progress-r.progress)<8)applyEffect(nearby,'slow',.8,.82,r);beep(290,.15,'triangle');if(r.reflect){const attacker=source||r.lastAttacker;if(attacker)applyEffect(attacker,'spin',.7,.55,r);r.reflect=false}return false}
    if(r.armor>0&&['slow','spin','poison','freeze','overheat'].includes(key))duration*=.45;
    if(r.character.passive==='antidote'&&(key==='poison'||key==='slow'||key==='freeze'))duration*=.58;
    if(key==='overheat')r.overheated=Math.max(r.overheated,duration);
    r.effects[key]={time:Math.max(r.effects[key]?.time||0,duration),value};return true
  }
  function applyEffect(r,key,duration,value=1,source=null){if(addEffect(r,key,duration,value,source)){if(source){source.hits++;r.lastAttacker=source}energyGain(r,4);createParticle(r.worldPosition,source?.character.color||0xffb26e,8);if(r.isPlayer)toast(key==='poison'?'VENENO!':key==='freeze'?'CONGELADO!':'ATINGIDO!','#ffad87')}}
  function chooseTarget(r,range=90,front=true){
    let choices=racers.filter(q=>q!==r&&!q.finished);if(front)choices=choices.filter(q=>(q.progress-q.gridBack)>(r.progress-r.gridBack)+.5);
    choices=choices.filter(q=>Math.abs(q.progress-q.gridBack-(r.progress-r.gridBack))<range);
    choices.sort((a,b)=>Math.abs(a.progress-r.progress)-Math.abs(b.progress-r.progress));return choices[0]||null
  }
  function spawnProjectile(r,target,type,color,count=1){
    for(let i=0;i<count;i++){
      let mesh;
      if(type==='hat'){
        mesh=new THREE.Group();const blade=new THREE.Mesh(new THREE.CylinderGeometry(.72,.72,.12,12),new THREE.MeshStandardMaterial({color,metalness:.72,roughness:.24}));blade.rotation.x=Math.PI/2;mesh.add(blade);
        const crown=new THREE.Mesh(new THREE.CylinderGeometry(.2,.28,.28,10),new THREE.MeshStandardMaterial({color:0x302b22,metalness:.25,roughness:.5}));crown.position.y=.14;mesh.add(crown);mesh.userData.spin=true;
      }else{mesh=new THREE.Mesh(shared.sphere,new THREE.MeshBasicMaterial({color,emissive:color,emissiveIntensity:.6}));mesh.scale.setScalar(type==='fire'?.68:.48)}
      scene.add(mesh);
      shots.push({from:r,target,type,color,mesh,age:-i*.14,duration:.52+i*.1,origin:r.worldPosition.clone(),targetStart:target?.worldPosition.clone()||r.worldPosition.clone()});
    }
  }
  function mainUse(r){
    if(!r)return false;
    const type=r.character.mainType,target=chooseTarget(r,95,true),color=effectColors[type==='wave'?'ice':type==='chain'?'bolt':type==='phase'||type==='shadow'?'shadow':type==='quake'?'rock':type==='tornado'||type==='hat'?'wind':type==='poison'?'poison':type==='pull'?'magnet':type==='beam'?'light':type==='chrono'?'time':type==='fog'?'shadow':'fire'];
    switch(type){
      case'fire':if(!target)return false;for(let i=0;i<3;i++)spawnProjectile(r,target,'fire',color,1);break;
      case'wave':{let targets=0;for(const q of racers)if(q!==r&&isAheadAndNear(r,q,36,1.3)){applyEffect(q,'freeze',2,.58,r);targets++}if(!targets)return false;spawnBurst(r,color,24);break}
      case'chain':{let hit=racers.filter(q=>q!==r&&!q.finished&&Math.abs(q.progress-r.progress)<58).sort((a,b)=>Math.abs(a.progress-r.progress)-Math.abs(b.progress-r.progress)).slice(0,3);if(!hit.length)return false;hit.forEach((q,i)=>{applyEffect(q,'slow',1.8,.62,r);createParticle(q.worldPosition,color,18);if(i<hit.length-1){const line=new THREE.Line(new THREE.BufferGeometry().setFromPoints([q.worldPosition,hit[i+1].worldPosition]),new THREE.LineBasicMaterial({color}));scene.add(line);window.setTimeout(()=>{scene.remove(line);line.geometry.dispose();line.material.dispose()},180)}});break}
      case'phase':r.intangible=2.5;break;
      case'fog':{let hit=0;for(const q of racers)if(q!==r&&!q.finished&&Math.abs(q.progress-r.progress)<48){q.fog=Math.max(q.fog,3.5);q.controlLoss=Math.max(q.controlLoss,1);applyEffect(q,'slow',1.5,.82,r);hit++}if(!hit)return false;spawnBurst(r,color,28);break}
      case'shadow':if(!target)return false;spawnProjectile(r,target,'shadow',color);break;
      case'hat':if(!target)return false;spawnProjectile(r,target,'hat',color);break;
      case'quake':for(const q of racers)if(q!==r&&Math.abs(q.progress-r.progress)<22){q.speed*=.72;q.laneTarget=clamp(q.lane+(q.lane===r.lane?(q.id.charCodeAt(0)%2?1:-1):Math.sign(q.lane-r.lane)),-1,1);applyEffect(q,'spin',.8,.5,r)}hazardDefs.forEach(h=>{if(!h.broken&&Math.abs(h.distance-wrap(r.progress,trackLength))<20){h.broken=true;h.group.visible=false}});spawnBurst(r,color,30);break;
      case'tornado':if(!target)return false;spawnProjectile(r,target,'tornado',color);break;
      case'poison':if(!target)return false;spawnProjectile(r,target,'poison',color);break;
      case'pull':for(const q of racers)if(q!==r&&Math.abs(q.progress-r.progress)<34){q.laneTarget=r.lane;applyEffect(q,'slow',1,.78,r)}spawnBurst(r,color,18);break;
      case'beam':if(!target)return false;spawnProjectile(r,target,'beam',color);target.disabled=Math.max(target.disabled,3);break;
      case'chrono':for(const q of racers)if(q!==r&&Math.abs(q.progress-r.progress)<72)q.chrono=Math.max(q.chrono,2);spawnBurst(r,color,32);break;
    }
    r.energy=0;r.mainCd=6.2/r.recharge;beep(220+Math.random()*280,.22,'sawtooth');if(r.isPlayer)toast(r.character.main.toUpperCase(),'#fff0ab');return true;
  }
  function isAheadAndNear(r,q,range,laneRange){const delta=q.progress-r.progress;return delta>0&&delta<range&&Math.abs(q.lane-r.lane)<laneRange}
  function spawnBurst(r,color,n=18){if(r.worldPosition)createParticle(r.worldPosition,color,n)}
  function secondaryUse(r){
    if(!r||r.energy<40||r.secondaryCd>0||r.disabled>0)return false;
    const type=r.character.secondaryType,color=effectColors[type==='firetrail'?'fire':type==='shield'||type==='reflect'?'ice':type==='boost'?'bolt':type==='fog'?'shadow':type==='armor'?'rock':type==='windjump'?'wind':type==='mine'?'poison':type==='repulse'?'magnet':'time';
    switch(type){
      case'firetrail':hazardEffects.push({type:'firetrail',distance:r.progress,lane:r.lane,color,time:4,mesh:makeHazardVisual(r,color)});break;
      case'shield':r.shield=1;r.reflect=false;break;
      case'boost':r.boost=Math.max(r.boost,3);r.controlLoss=Math.max(r.controlLoss,1.4);break;
      case'fog':for(const q of racers)if(q!==r&&Math.abs(q.progress-r.progress)<36)q.fog=Math.max(q.fog,3);hazardEffects.push({type:'fog',distance:r.progress,lane:r.lane,color,time:3,mesh:makeHazardVisual(r,color)});break;
      case'armor':r.armor=5;break;
      case'windjump':r.phase=Math.max(r.phase,.8);r.boost=Math.max(r.boost,1.8);break;
      case'mine':hazardEffects.push({type:'mine',distance:r.progress-9,lane:r.lane,color,time:12,owner:r,mesh:makeHazardVisual(r,color)});r.mineCd=6;break;
      case'repulse':for(const q of racers)if(q!==r&&Math.abs(q.progress-r.progress)<20){q.laneTarget=clamp(q.lane+(q.progress>=r.progress?1:-1),-1,1);q.speed*=.82}shots.forEach(s=>s.target===r&&(s.target=s.from));spawnBurst(r,color,20);break;
      case'reflect':r.shield=1;r.reflect=true;break;
      case'rewind':{const sample=r.history.find(h=>elapsed-h.time>1.8);if(sample){r.progress=sample.progress;r.lane=sample.lane;r.laneTarget=sample.lane;r.speed=Math.max(r.speed,sample.speed*.72);r.stun=0;r.effects={};}break}
    }
    r.energy-=40;r.secondaryCd=5.6/r.recharge;beep(360,.16,'triangle');if(r.isPlayer)toast(r.character.secondary.toUpperCase(),'#b8f4ff');return true;
  }
  function makeHazardVisual(r,color){const m=new THREE.Mesh(shared.sphere,new THREE.MeshBasicMaterial({color,transparent:true,opacity:.62}));m.scale.set(2.5,.7,2.5);scene.add(m);return m}
  function useMain(r){if(!r||r.energy<100||r.mainCd>0||r.disabled>0)return false;return mainUse(r)}
  function useSecondary(r){return secondaryUse(r)}
  function updateShots(dt){
    for(let i=shots.length-1;i>=0;i--){const s=shots[i];s.age+=dt;if(s.age<0)continue;
      if(!s.target||s.target.finished){s.mesh.position.copy(s.origin);s.age=s.duration+1}
      else{const targetPos=s.target.worldPosition||s.targetStart;const p=clamp(s.age/s.duration,0,1);s.mesh.position.lerpVectors(s.origin,targetPos,p);if(p>=1){
        if(s.target.intangible>0){s.age=s.duration+1;scene.remove(s.mesh);shots.splice(i,1);continue}
        if(s.type==='fire')applyEffect(s.target,'overheat',2,.64,s.from);else if(s.type==='tornado'||s.type==='shadow'||s.type==='hat')applyEffect(s.target,'spin',s.type==='hat'?1.05:1.25,.42,s.from);else if(s.type==='poison')applyEffect(s.target,'poison',5,.68,s.from);else if(s.type==='beam'){applyEffect(s.target,'slow',.7,.78,s.from);s.target.disabled=Math.max(s.target.disabled,3)}else applyEffect(s.target,'slow',1.4,.72,s.from);
        createParticle(s.target.worldPosition,s.color,16);beep(180,.12,'square');s.age=s.duration+1;
      }}
      if(s.age>s.duration){scene.remove(s.mesh);shots.splice(i,1)}
    }
  }
  function updateEffects(r,dt){
    for(const k of Object.keys(r.effects)){r.effects[k].time-=dt;if(r.effects[k].time<=0)delete r.effects[k]}
    for(const key of ['mainCd','secondaryCd','boost','controlLoss','stun','shield','armor','intangible','fog','poison','overheated','disabled','chrono','phase','mineCd','hazardCooldown'])r[key]=Math.max(0,(r[key]||0)-dt);
    for(const k of Object.keys(r.effects))if(k==='poison')r.poison=Math.max(r.poison,r.effects[k].time);
  }
  function capsuleUpdate(dt){
    for(const c of capsuleDistances){c.respawn=Math.max(0,c.respawn-dt);c.mesh.visible=c.respawn<=0;
      const p=poseAt(c.distance,c.lane*3.5);c.mesh.position.copy(p.position);c.mesh.position.y=1.3+Math.sin(elapsed*4+c.id)*.18;c.mesh.rotation.y=elapsed*1.8+c.id;
      if(c.respawn>0)continue;
      for(const r of racers){if(r.finished||c.used.has(r.id))continue;const rd=wrap(r.progress-r.gridBack,trackLength),delta=Math.min(Math.abs(rd-c.distance),trackLength-Math.abs(rd-c.distance));
        const magnet=r.character.passive==='magnet'?1.8:0;
        if(delta<2.3+magnet&&Math.abs(r.lane*3.5-c.lane*3.5)<2.5+magnet){c.used.add(r.id);energyGain(r,15);r.capsules++;createParticle(r.worldPosition,effectColors.magnet,14);beep(680,.1,'sine');if(r.isPlayer)toast('CÁPSULA +15 ENERGIA','#9afff2');if(c.used.size===racers.length){c.respawn=7;c.used.clear()}}
      }
    }
  }
  function hazardUpdate(dt){
    for(let i=hazardEffects.length-1;i>=0;i--){const h=hazardEffects[i];h.time-=dt;
      if(h.type==='firetrail'||h.type==='fog'||h.type==='mine'){const p=poseAt(h.distance,h.lane*3.5);h.mesh.position.copy(p.position);h.mesh.position.y=h.type==='mine'?.6:1.1;h.mesh.material.opacity=.3+.22*Math.sin(elapsed*9);}
      if(h.type==='firetrail'||h.type==='mine')for(const r of racers){const along=Math.abs(wrap(r.progress-r.gridBack-h.distance+trackLength/2,trackLength)-trackLength/2);if(r===h.owner||r.finished||along>2.4||Math.abs(r.lane-h.lane)>.4||r.hazardCooldown>0)continue;r.hazardCooldown=.85;applyEffect(r,h.type==='mine'?'poison':'overheat',h.type==='mine'?3:1.4,.7,h.owner);r.speed*=.76;createParticle(r.worldPosition,h.color,18)}
      if(h.time<=0){scene.remove(h.mesh);hazardEffects.splice(i,1)}
    }
    for(const h of hazardDefs){if(h.broken)continue;for(const r of racers){const rd=r.progress-r.gridBack,delta=Math.abs(wrap(rd-h.distance+trackLength/2,trackLength)-trackLength/2);if(delta<1.8&&Math.abs(r.lane-h.lane)<.42&&r.phase<=0&&r.intangible<=0&&r.hazardCooldown<=0){r.hazardCooldown=1.1;r.speed*=r.character.passive==='heavy' ? .87 : .68;applyEffect(r,h.type==='ice'?'freeze':'spin',h.type==='ice'?1.1:.65,.55);if(r.isPlayer)toast('OBSTÁCULO! USE A/D PARA DESVIAR','#ffb38a');createParticle(r.worldPosition,h.type==='ice'?effectColors.ice:effectColors.rock,16)}}}
    for(const s of shortcuts){s.mesh.visible=true;for(const r of racers){const rd=r.progress-r.gridBack,delta=Math.abs(wrap(rd-s.distance+trackLength/2,trackLength)-trackLength/2);if(delta<1.5&&Math.abs(r.lane-s.lane)<.4){const lap=Math.floor(Math.max(0,rd)/trackLength);if(s.used.has(`${r.id}:${lap}`))continue;s.used.add(`${r.id}:${lap}`);r.boost=Math.max(r.boost,2.8);r.speed=Math.min(r.maxSpeed*1.14,r.speed+4);energyGain(r,8);if(r.isPlayer)toast(`${s.label} · IMPULSO!`,'#8dffe0');createParticle(r.worldPosition,0x5bffcf,20)}}}
    for(const ramp of rampDefs)for(const r of racers){const rd=r.progress-r.gridBack,delta=Math.abs(wrap(rd-ramp.distance+trackLength/2,trackLength)-trackLength/2),lap=Math.floor(Math.max(0,rd)/trackLength);if(delta<1.35&&Math.abs(r.lane-ramp.lane)<.43&&!ramp.used.has(`${r.id}:${lap}`)){ramp.used.add(`${r.id}:${lap}`);r.boost=Math.max(r.boost,.8);r.phase=Math.max(r.phase,.45);energyGain(r,r.character.passive==='aero'?7:2);if(r.isPlayer)toast('SALTO PERFEITO · +ENERGIA','#adfff1');createParticle(r.worldPosition,effectColors.wind,12)}}
  }
  function trafficCollisions(dt){
    for(let i=0;i<racers.length;i++)for(let j=i+1;j<racers.length;j++){
      const a=racers[i],b=racers[j];if(a.finished||b.finished||a.intangible>0||b.intangible>0)continue;
      const along=Math.abs((a.progress-a.gridBack)-(b.progress-b.gridBack));if(along>2.7||Math.abs(a.lane-b.lane)>.42)continue;
      if(a.stun>0||b.stun>0)continue;const heavier=a.weight>=b.weight?a:b,lighter=heavier===a?b:a;
      lighter.speed*=Math.max(.82,.94-heavier.weight*.05);lighter.stun=Math.max(lighter.stun,.18);lighter.laneTarget=clamp(lighter.lane+(lighter.lane===heavier.lane?(lighter.id.charCodeAt(0)%2?1:-1):0),-1,1);
      if(heavier.isPlayer)energyGain(heavier,1.2);if(lighter.isPlayer)toast('CONTATO!','#ffd28d');
    }
  }
  function aiThink(r,dt,rank){
    r.ai.timer-=dt;
    if(r.ai.timer>0)return;r.ai.timer=.25+r.ai.reaction*.5;
    const routeD=r.progress-r.gridBack,look=poseAt(routeD+18),here=poseAt(routeD);
    const nearbyHazard=hazardDefs.find(h=>!h.broken&&Math.abs(h.distance-wrap(routeD,trackLength))<18&&Math.abs(h.lane-r.lane)<.75);
    const nearRacer=racers.find(q=>q!==r&&Math.abs(q.progress-r.progress)<8&&Math.abs(q.lane-r.lane)<.55);
    const capsule=capsuleDistances.map(c=>({c,d:Math.abs(wrap(c.distance-routeD+trackLength/2,trackLength)-trackLength/2)})).filter(x=>!x.c.used.has(r.id)&&x.d<55).sort((a,b)=>a.d-b.d)[0];
    if(nearbyHazard){const safe=[-1,0,1].filter(l=>l!==nearbyHazard.lane&&!racers.some(q=>q!==r&&Math.abs(q.progress-r.progress)<7&&Math.abs(q.lane-l)<.35));if(safe.length)r.laneTarget=safe[Math.floor(Math.random()*safe.length)]}
    else if(capsule&&Math.random()<.55)r.laneTarget=capsule.c.lane;
    else {const cut=shortcuts.find(s=>{const d=Math.abs(wrap(s.distance-routeD+trackLength/2,trackLength)-trackLength/2),lap=Math.floor(Math.max(0,routeD)/trackLength);return d<42&&!s.used.has(`${r.id}:${lap}`)});if(cut&&Math.random()<r.ai.precision)r.laneTarget=cut.lane}
    else if(r.fog>0&&Math.random()<.38)r.laneTarget=[-1,0,1][Math.floor(Math.random()*3)];
    else if(nearRacer&&Math.random()<r.ai.aggression*.3)r.laneTarget=clamp(r.lane+(Math.random()>.5?1:-1),-1,1);
    else if(Math.random()<.12)r.laneTarget=[-1,0,1][Math.floor(Math.random()*3)];
    const ahead=chooseTarget(r,65,true),threat=racers.some(q=>q!==r&&q.progress<r.progress&&r.progress-q.progress<13);
    if(r.energy>=40&&r.secondaryCd===0&&(threat||nearbyHazard||r.boost===0&&Math.random()<.06))secondaryUse(r);
    if(r.energy>=100&&r.mainCd===0&&r.disabled===0&&ahead&&(Math.abs(ahead.progress-r.progress)<65)&&(rank>2||Math.random()<r.ai.aggression*.55))mainUse(r);
    r.ai.lastProgress=r.progress;
  }
  function updateRacer(r,dt,rank){
    updateEffects(r,dt);if(r.finished){r.speed=0;setPosition(r);return}
    const oldRoute=r.progress-r.gridBack;
    if(r.isPlayer){
      if(playerInputs.left){r.laneTarget=clamp(r.laneTarget-1,-1,1);playerInputs.left=false}
      if(playerInputs.right){r.laneTarget=clamp(r.laneTarget+1,-1,1);playerInputs.right=false}
    }else aiThink(r,dt,rank);
    const assist=rank>=7?1.025:rank===0?.986:1;
    const passive=r.character.passive==='heat'&&r.energy>80?1.045:1;
    const boostFactor=r.boost>0?1.18:1;
    const statusFactor=(r.chrono>0 ? .53 : 1)*(r.poison>0 ? .83 : 1)*(r.overheated>0 ? .82 : 1)*(r.effects.freeze ? .65 : 1)*(r.effects.slow?.value||1)*(r.stun>0 ? .78 : 1);
    const controlFactor=Math.max(.28,1-r.controlLoss*.38-(r.effects.spin?.time>0 ? .48 : 0));
    let throttle=r.isPlayer?playerInputs.throttle:true,brake=r.isPlayer?playerInputs.brake:false;
    if(!r.isPlayer){throttle=true;const section=wrap(r.progress-r.gridBack,trackLength)/trackLength;if((section>.12&&section<.15)||(section>.46&&section<.49))brake=r.ai.precision<.8}
    const top=r.maxSpeed*boostFactor*passive*statusFactor*assist;
    if(throttle)r.speed+=r.accel*dt*(r.poison>0?.53:1)*(r.isPlayer?1.14:1.02+r.ai.skill*.16)*(r.boost>0?1.22:1);
    else r.speed-=3.7*dt;
    if(brake){r.speed-=r.speed>0?17*dt:0;r.speed-=r.speed<=0?8*dt:0}
    if(playerInputs.drift&&r.isPlayer){r.speed-=.8*dt;r.driftCharge+=dt;if(r.driftCharge>=.7){r.driftCharge=0;energyGain(r,2);r.curveBonus+=.7}}
    else r.driftCharge=0;
    if(r.boost>0)r.speed=Math.min(top,r.speed+4*dt);
    r.speed=clamp(r.speed,-8,top);
    const routeT=wrap(r.progress-r.gridBack,trackLength)/trackLength,surfaceFactor=routeT>.25&&routeT<.5&&r.character.passive!=='polar' ? .78 : 1;
    const laneRate=(3.6+r.handling*3.8)*sensitivity;const lateralError=r.laneTarget-r.lane;
    r.lane+=clamp(lateralError,-laneRate*dt,laneRate*dt)*controlFactor*surfaceFactor;
    if(r.glow)r.glow.intensity=r.intangible>0?2.8:r.shield>0?1.8:r.boost>0?1.1:0;
    if(r.lane<-1.17||r.lane>1.17){r.speed*=Math.max(0,1-dt*.8);r.lane=clamp(r.lane,-1.22,1.22)}
    if(r.phase>0){r.speed=Math.max(r.speed,top*.84);r.phase=Math.max(0,r.phase-dt)}
    if(r.character.passive==='heavy'&&r.hazardCooldown>0)r.speed+=.35*dt;
    if(r.character.passive==='night'&&rank>4)energyGain(r,.5*dt);
    const oldSpeed=r.speed;r.progress+=r.speed*dt;
    if(r.progress<0)r.progress=0;
    energyGain(r,.58*dt);
    if(r.character.passive==='battery'&&Math.abs(lateralError)>.05&&r.curveBonus>0){energyGain(r,.6*dt)}
    if(r.curveBonus>0)r.curveBonus=Math.max(0,r.curveBonus-dt);
    if(r.history.length===0||elapsed-r.history[0].time>.12)r.history.unshift({time:elapsed,progress:r.progress,lane:r.lane,speed:r.speed});
    r.history=r.history.filter(h=>elapsed-h.time<2.5);
    const routeNow=r.progress-r.gridBack;
    updateCheckpoint(r,oldRoute,routeNow);
    if(r.ai){if(Math.abs(r.progress-r.ai.lastProgress)<.1)r.ai.stuck+=dt;else r.ai.stuck=0;if(r.ai.stuck>3){r.progress=Math.max(0,(r.lap-1)*trackLength+trackLength*(r.nextCheckpoint-1)/4+3);r.lane=r.laneTarget=0;r.speed=r.maxSpeed*.48;r.ai.stuck=0}}
    setPosition(r);
    if(r.isPlayer&&engineOsc&&audioContext){engineOsc.frequency.setTargetAtTime(48+Math.max(0,r.speed)*2.4,audioContext.currentTime,.08);engineGain.gain.setTargetAtTime(state==='race'?.012:.001,audioContext.currentTime,.1)}
  }
  function updateParticles(dt){for(let i=particles.length-1;i>=0;i--){const p=particles[i];p.life-=dt;p.mesh.position.addScaledVector(p.velocity,dt);p.velocity.y-=8*dt;p.mesh.material.opacity=clamp(p.life,0,1);if(p.life<=0){scene.remove(p.mesh);p.mesh.material.dispose();particles.splice(i,1)}}}
  function updateMap(){
    const c=document.getElementById('raceMap');if(!c)return;const x=c.getContext('2d');x.clearRect(0,0,c.width,c.height);x.fillStyle='#10251dcc';x.fillRect(0,0,c.width,c.height);x.strokeStyle='#a9b49b';x.lineWidth=8;x.lineJoin='round';x.beginPath();
    for(let i=0;i<=180;i++){const p=curve.getPointAt(i/180),px=c.width/2+p.x*.65,py=c.height/2+p.z*.65;if(i===0)x.moveTo(px,py);else x.lineTo(px,py)}x.closePath();x.stroke();
    for(const r of racers){if(!r.root.visible)continue;const p=r.worldPosition;x.fillStyle=r.isPlayer?'#fff18b':`#${r.character.color.toString(16).padStart(6,'0')}`;x.fillRect(c.width/2+p.x*.65-2,c.height/2+p.z*.65-2,5,5)}
  }
  function updateHUD(){
    const p=player();if(!p)return;rankRacers();const place=ranking.indexOf(p)+1;
    const pos=document.getElementById('racePosition'),lap=document.getElementById('raceLap'),speed=document.getElementById('raceSpeed'),energy=document.getElementById('energyValue'),fill=document.getElementById('energyFill');
    if(pos)pos.textContent=`${place}/10`;if(lap)lap.textContent=`${Math.min(3,Math.max(1,p.lap))}/3`;if(speed)speed.innerHTML=`${Math.round(Math.max(0,p.speed)*3.6)} <small>km/h</small>`;if(energy)energy.textContent=`${Math.floor(p.energy)}%`;if(fill)fill.style.width=`${p.energy}%`;
    const sec=document.getElementById('secondaryPower'),main=document.getElementById('primaryPower');if(sec){sec.disabled=p.energy<40||p.secondaryCd>0||p.disabled>0;sec.classList.toggle('ready',!sec.disabled);const name=document.getElementById('secondaryName');if(name)name.textContent=`${p.character.secondary}${p.secondaryCd>0?` · ${p.secondaryCd.toFixed(0)}s`:''}`}
    if(main){main.disabled=p.energy<100||p.mainCd>0||p.disabled>0;main.classList.toggle('ready',!main.disabled);const name=document.getElementById('primaryName');if(name)name.textContent=`${p.character.main}${p.mainCd>0?` · ${p.mainCd.toFixed(0)}s`:''}`}
    const board=document.getElementById('raceLeaderboard');if(board){board.innerHTML=ranking.slice(0,5).map((r,i)=>`<div class="leader-row ${r.isPlayer?'you':''}"><b>${i+1}</b><span>${r.character.name}</span><i style="background:#${r.character.color.toString(16).padStart(6,'0')}"></i></div>`).join('')}
    updateMap();
  }
  function update(dt){
    if(state==='countdown'){
      countdown-=dt;elapsed+=dt;
      if(countdown<=0){state='race';elapsed=0;updateOverlay('VAI!');beep(740,.45,'square');window.setTimeout(()=>updateOverlay(''),550)}else updateOverlay(String(Math.ceil(countdown)));
      return;
    }
    if(state!=='race')return;
    pollGamepad();
    elapsed+=dt;
    rankRacers();for(let i=0;i<racers.length;i++)updateRacer(racers[i],dt,ranking.indexOf(racers[i]));
    trafficCollisions(dt);capsuleUpdate(dt);hazardUpdate(dt);updateShots(dt);updateParticles(dt);
    if(messageTimer>0){messageTimer-=dt;if(messageTimer<=0)document.getElementById('raceMessage')?.classList.remove('show')}
    updateHUD();const p=player();if(p?.isPlayer&&state==='race'){
      scene.fog.density=p.fog>0 ? .027 : .009;
      const pose=poseAt(p.progress-p.gridBack,p.lane*3.5),desired=pose.position.clone().addScaledVector(pose.tangent,-12);desired.y=6.2+Math.min(2,p.speed*.025);
      camera.position.lerp(desired,1-Math.exp(-dt*3.4));const look=pose.position.clone().addScaledVector(pose.tangent,12);look.y=1.15;camera.lookAt(look);
      const turbo=p.boost>0;camera.fov=lerp(camera.fov,turbo?70:62,1-Math.exp(-dt*2));camera.updateProjectionMatrix();
    }
  }
  function render(){renderer.render(scene,camera)}
  function startSelected(){return start(selectedId)}
  function stop(){state='menu';playerInputs.throttle=false;playerInputs.brake=false;document.getElementById('racePause')?.classList.add('hidden');document.getElementById('raceHud')?.classList.add('hidden')}
  function getCharacterData(id){return characterById[id]}
  function allCharacters(){return RACE_CHARACTERS}
  function updateQuality(){const pixel=localStorage.getItem('race-quality')!=='sharp';renderer.setPixelRatio(pixel ? .52 : 1);renderer.setSize(innerWidth,innerHeight);camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix()}
  function setVolumes(sfx,music){if(sfx!==undefined&&sfxGain)sfxGain.gain.setTargetAtTime(Number(sfx),audioContext.currentTime,.08);if(music!==undefined&&musicGain)musicGain.gain.setTargetAtTime(Number(music),audioContext.currentTime,.08)}
  function setSensitivity(v){sensitivity=clamp(Number(v)||1,.6,1.8);localStorage.setItem('race-sensitivity',String(sensitivity))}
  return {start,startSelected,pause,resume,stop,update,render,setInput,pointerAction,getResults,allCharacters,getCharacterData,updateQuality,setVolumes,setSensitivity,get state(){return state},get selectedId(){return selectedId},set selectedId(v){selectedId=v},get trackLength(){return trackLength},set onFinish(fn){onFinish=fn}};
}
