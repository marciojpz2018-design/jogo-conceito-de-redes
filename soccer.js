(() => {
  'use strict';
  const teams=[
    {name:'Lionel Messi',abbr:'LM',c1:'#4fa3d8',c2:'#f1eee7',skin:'#c88f6b',hair:'#4b3427',style:'short',beard:'trim',build:'compact'},
    {name:'Cristiano Ronaldo',abbr:'CR',c1:'#d32637',c2:'#f0eee7',skin:'#d8a17a',hair:'#25201d',style:'slick',beard:'clean',build:'athletic'},
    {name:'Neymar Jr.',abbr:'NJ',c1:'#e5c830',c2:'#26834e',skin:'#c98e68',hair:'#30251f',style:'mohawk',beard:'stubble',build:'lean'},
    {name:'Diego Maradona',abbr:'DM',c1:'#78badd',c2:'#f1eee7',skin:'#c78b65',hair:'#33251f',style:'curly',beard:'stubble',build:'stocky'},
    {name:'Pelé',abbr:'P',c1:'#e5c830',c2:'#26834e',skin:'#80513b',hair:'#171817',style:'close',beard:'clean',build:'athletic'},
    {name:'Ronaldinho',abbr:'R10',c1:'#087447',c2:'#f6f3e7',skin:'#915d44',hair:'#161513',style:'longcurly',beard:'stubble',build:'lean'},
    {name:'Kylian Mbappé',abbr:'KM',c1:'#183b7a',c2:'#dc263e',skin:'#80513b',hair:'#171817',style:'close',beard:'clean',build:'athletic'},
    {name:'Erling Haaland',abbr:'EH',c1:'#74b9dc',c2:'#f0eee7',skin:'#e2b999',hair:'#c9a75c',style:'long',beard:'blond',build:'tall'},
    {name:'Vinícius Júnior',abbr:'VJ',c1:'#f0ede6',c2:'#2860ac',skin:'#87563f',hair:'#171817',style:'fade',beard:'stubble',build:'lean'},
    {name:'Mohamed Salah',abbr:'MS',c1:'#c92734',c2:'#f3eee2',skin:'#a36d50',hair:'#211b18',style:'curly',beard:'full',build:'athletic'},
    {name:'Zinedine Zidane',abbr:'ZZ',c1:'#f0ede6',c2:'#2860ac',skin:'#c69573',hair:'#44352b',style:'bald',beard:'stubble',build:'athletic'},
    {name:'David Beckham',abbr:'DB',c1:'#f0eee7',c2:'#17191e',skin:'#dfb08e',hair:'#aa8151',style:'slick',beard:'trim',build:'athletic'},
    {name:'Chaves',abbr:'CH',c1:'#9d8e65',c2:'#e9dcb5',skin:'#e8ae80',hair:'#513c2c',style:'short',beard:'clean',build:'compact',characterArt:'chaves'},
    {name:'Kratos',abbr:'KR',c1:'#883b32',c2:'#d6bd92',skin:'#ddd6cc',hair:'#48372e',style:'bald',beard:'full',build:'athletic',characterArt:'kratos'},
    {name:'Madara',abbr:'MD',c1:'#8e303b',c2:'#252b3b',skin:'#e1b99e',hair:'#19212f',style:'long',beard:'clean',build:'tall',characterArt:'madara'},
    {name:'Kick Buttowski',abbr:'KB',c1:'#f4eee4',c2:'#d82c32',skin:'#edb68d',hair:'#382923',style:'short',beard:'clean',build:'compact',characterArt:'kick-buttowski'},
    {name:'Bob Esponja',abbr:'BE',c1:'#f5da34',c2:'#805134',skin:'#f9dc36',hair:'#c5ae25',style:'bald',beard:'clean',build:'stocky',characterArt:'bob-esponja'},
    {name:'Lula Molusco',abbr:'LQ',c1:'#a36c38',c2:'#95c7bc',skin:'#95c7bc',hair:'#60988e',style:'bald',beard:'clean',build:'tall',characterArt:'lula-molusco'},
    {name:'Lula',abbr:'LU',c1:'#b82f39',c2:'#f5f1e9',skin:'#dfaf8c',hair:'#deded8',style:'short',beard:'full',build:'stocky',characterArt:'lula'},
    {name:'Bolsonaro',abbr:'JB',c1:'#258747',c2:'#efcf42',skin:'#e3b18e',hair:'#3c352f',style:'slick',beard:'clean',build:'athletic',characterArt:'bolsonaro'},
    {name:'Zé Pilintra',abbr:'ZP',c1:'#f4f0e6',c2:'#c62734',skin:'#925a36',hair:'#25201b',style:'short',beard:'trim',build:'lean',characterArt:'ze-pilintra'},
    {name:'Professor Xavier',abbr:'PX',c1:'#263d6c',c2:'#dce4ec',skin:'#e0ac8c',hair:'#775746',style:'bald',beard:'clean',build:'compact',characterArt:'professor-xavier',wheelchair:true}
  ].map((player,id)=>({id,...player}));
  const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
  // Local artwork and normalized head regions, sourced in assets/players/CREDITS.md.
  const playerArt={
    0:{file:'messi',head:[.30,.03,.40,.37]},
    1:{file:'ronaldo',head:[.23,.04,.54,.47]},
    2:{file:'neymar',head:[.27,.04,.45,.48]},
    3:{file:'maradona',head:[.22,.06,.57,.44]},
    6:{file:'mbappe',head:[.25,.04,.50,.42]},
    7:{file:'haaland',head:[.27,.03,.45,.46]},
    8:{file:'vinicius',head:[.30,.05,.40,.42]},
    9:{file:'salah',head:[.23,.02,.54,.47]}
  };
  const headImages=new Map();
  teams.forEach(t=>{
    if(t.characterArt){
      t.portrait=`assets/characters/${t.characterArt}.png`;
      const crops={chaves:[.20,.02,.60,.50],kratos:[.25,0,.50,.50],madara:[.15,0,.70,.53],'kick-buttowski':[.14,.12,.45,.44],'bob-esponja':[.23,.03,.60,.59],'lula-molusco':[.29,.01,.33,.46],lula:[.24,0,.52,.53],bolsonaro:[.24,0,.52,.52],'ze-pilintra':[.20,0,.60,.52],'professor-xavier':[.25,0,.50,.47]};
      t.headCrop=crops[t.characterArt];
    }
    const art=playerArt[t.id];if(!art&&!t.characterArt)return;
    if(art){t.portrait=`assets/players/${art.file}.png`;t.headCrop=art.head;}
    const image=new Image();image.onload=()=>{headImages.set(t.id,image);if(game)draw()};image.src=t.portrait;
  });
  function portrait(t,className){
    return t.portrait?`<img class="${className}" src="${t.portrait}" alt="Caricatura de ${t.name}" decoding="async">`:`<span class="${className} portrait-initials" style="--c1:${t.c1};--c2:${t.c2}">${t.abbr}</span>`;
  }
  let saved={};try{saved=JSON.parse(localStorage.getItem('headSoccerSettings')||'{}')}catch{}
  const state={teams:Array.isArray(saved.teams)&&saved.teams.length===2?saved.teams.map(n=>Math.max(0,Math.min(teams.length-1,+n||0))):[0,1],pick:0,mode:'ai',stadium:'brazil',duration:90,swap:false,round:0,competitionPoints:0,eliminated:false};
  const screens=['home','setup','match','result'];
  function show(name){screens.forEach(s=>$('#'+s).classList.toggle('hidden',s!==name));if(name==='setup')renderTeams()}
  function team(id){return teams[id]}
  function emblem(t,el){el.textContent=t.abbr;el.style.setProperty('--c1',t.c1);el.style.setProperty('--c2',t.c2);el.title=t.name}
  function persist(){try{localStorage.setItem('headSoccerSettings',JSON.stringify({teams:state.teams,mode:$('#mode').value,stadium:$('#stadium').value,duration:$('#duration').value,kitType:$('#kitType').value,aiDifficulty:$('#aiDifficulty').value}))}catch{}}
  if(saved.mode)$('#mode').value=saved.mode;if(saved.stadium)$('#stadium').value=saved.stadium;if(saved.duration)$('#duration').value=saved.duration;if(saved.kitType)$('#kitType').value=saved.kitType;if(saved.aiDifficulty)$('#aiDifficulty').value=saved.aiDifficulty;
  function renderTeams(){state.teams.forEach((id,i)=>{const t=team(id);$('#teamName'+(i+1)).textContent=t.name;emblem(t,$('#crest'+(i+1)));const card=$('#teamCard'+(i+1));card.querySelector('.player-portrait')?.remove();card.insertAdjacentHTML('afterbegin',portrait(t,'player-portrait'));const kit=$('#kit'+(i+1));kit.style.setProperty('--c1',$('#kitType').value==='away'?t.c2:t.c1);kit.style.setProperty('--c2',$('#kitType').value==='away'?t.c1:t.c2)});$('#opponentLabel').textContent=$('#mode').value==='local'?'JOGADOR 2':'IA';$('#difficultyOption').classList.toggle('hidden',$('#mode').value!=='ai');persist()}
  const grid=$('#teamGrid');teams.forEach(t=>{const b=document.createElement('button');b.className='team-choice';b.innerHTML=`${portrait(t,"choice-portrait")}<span>${t.name}</span>`;b.onclick=()=>{state.teams[state.pick]=t.id;$('#teamDrawer').classList.add('hidden');renderTeams()};grid.append(b)});
  $$('[data-action="setup"]').forEach(b=>b.onclick=()=>show('setup'));$$('[data-action="home"]').forEach(b=>b.onclick=()=>show('setup'));
  $$('.pick').forEach(b=>b.onclick=()=>{state.pick=+b.dataset.pick;$('#teamDrawer').classList.remove('hidden')});$('#closeDrawer').onclick=()=>$('#teamDrawer').classList.add('hidden');$('#swapTeams').onclick=()=>{state.teams.reverse();renderTeams()};$('#mode').onchange=renderTeams;$('#aiDifficulty').onchange=persist;$('#kitType').onchange=renderTeams;$('#stadium').onchange=persist;$('#duration').onchange=persist;
  $('#fullscreen').onclick=()=>{if(!document.fullscreenElement)document.documentElement.requestFullscreen?.();else document.exitFullscreen?.()};
  const canvas=$('#game'),ctx=canvas.getContext('2d');let game=null,last=0,raf=0,acc=0,paused=false,audioCtx=null;
  const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
  function sound(freq=440,dur=.09,type='sine',vol=.035){try{audioCtx??=new(window.AudioContext||window.webkitAudioContext)();const o=audioCtx.createOscillator(),g=audioCtx.createGain();o.type=type;o.frequency.value=freq;g.gain.setValueAtTime(vol,audioCtx.currentTime);g.gain.exponentialRampToValueAtTime(.001,audioCtx.currentTime+dur);o.connect(g).connect(audioCtx.destination);o.start();o.stop(audioCtx.currentTime+dur)}catch{}}
  function resize(){const r=canvas.getBoundingClientRect(),d=Math.min(devicePixelRatio||1,2);canvas.width=Math.max(1,Math.round(r.width*d));canvas.height=Math.max(1,Math.round(r.height*d));if(game)draw()}
  new ResizeObserver(resize).observe(canvas);
  const keys=new Set();window.addEventListener('keydown',e=>{if(['ArrowLeft','ArrowRight','ArrowUp',' ','Enter'].includes(e.key))e.preventDefault();if(!keys.has(e.key)){keys.add(e.key);if(game&&!paused){if(e.key==='Enter'&&game.players[1].kickReady<=0)special(1);if(e.key==='Escape')togglePause()}}});window.addEventListener('keyup',e=>keys.delete(e.key));
  const W=960,H=520,ground=442,goalH=142;
  const networkQuestions=[
    {text:'Qual equipamento encaminha pacotes entre redes diferentes?',options:['Switch','Roteador','Hub'],correct:1},
    {text:'Qual serviço traduz nomes de sites em endereços IP?',options:['DNS','HTTP','FTP'],correct:0},
    {text:'O que é uma LAN?',options:['Uma rede local','Um navegador','Um cabo de energia'],correct:0},
    {text:'Qual protocolo é usado para acessar páginas da web?',options:['FTP','DHCP','HTTP'],correct:2},
    {text:'Qual é a função de um endereço IP?',options:['Aumentar a velocidade do computador','Identificar uma interface na rede','Armazenar senhas'],correct:1},
    {text:'Qual serviço atribui endereços IP automaticamente?',options:['DNS','DHCP','HTML'],correct:1}
  ];
  let activeQuiz=null,pendingNext=false;
  function openQuiz(playerIndex=null,power=null){
    const question=networkQuestions[Math.floor(Math.random()*networkQuestions.length)];
    activeQuiz={playerIndex,power,question,answered:false};paused=true;keys.clear();
    $('#networkQuiz .eyebrow').textContent=power?`${playerIndex===1&&game.players[1].ai?'IA':'JOGADOR '+(playerIndex+1)} • PODER DE ${power==='speed'?'VELOCIDADE':'CONGELAMENTO'}`:'PERGUNTA DE REDES';
    $('#networkQuiz h2').textContent=question.text;
    $('#quizFeedback').textContent=power?'Acerte para liberar o poder. Você tem uma tentativa.':'';
    $('#quizContinue').classList.add('hidden');
    $$('.quiz-answer').forEach((button,i)=>{button.textContent=question.options[i];button.disabled=false;});
    $('#networkQuiz').classList.remove('hidden');$('.quiz-answer').focus();
  }
  function start(next=false){pendingNext=next;show('match');openQuiz();}function beginMatch(next=false){state.mode=$('#mode').value;state.stadium=$('#stadium').value;state.duration=+$('#duration').value;if(!next){state.round=0;state.competitionPoints=0;state.eliminated=false;if(['br','world','knockout'].includes(state.mode)){const pool=teams.filter(t=>t.id!==state.teams[0]);state.opponents=Array.from({length:4},(_,i)=>pool[(state.teams[0]*3+i*5)%pool.length].id);state.teams[1]=state.opponents[0]}}else{state.round++;state.teams[1]=state.opponents[state.round]};paused=false;$('#pauseOverlay').classList.add('hidden');$('#goalBanner').classList.add('hidden');$('#matchPhase').textContent=state.mode==='br'?'BRASILEIRÃO • '+(state.round+1)+'/4':state.mode==='world'?'MUNDIAL • '+(state.round+1)+'/4':state.mode==='knockout'?'ELIMINATÓRIA • '+(state.round+1)+'/4':'TEMPO 1';$('#hudName1').textContent=team(state.teams[0]).name;$('#hudName2').textContent=team(state.teams[1]).name;emblem(team(state.teams[0]),$('#hudCrest1'));emblem(team(state.teams[1]),$('#hudCrest2'));$('#score1').textContent='0';$('#score2').textContent='0';game={time:state.duration,score:[0,0],players:[],ball:{x:480,y:230,vx:120,vy:-170,r:17,trail:0},flash:0,shake:0,net:0,particles:[],ended:false,goalLock:false,overtime:0,elapsed:0,powerup:null,nextPowerup:8+Math.random()*7,freezePowerup:null,nextFreezePowerup:14+Math.random()*10};makePlayers();show('match');resize();last=performance.now();acc=0;cancelAnimationFrame(raf);raf=requestAnimationFrame(loop)}
  function makePlayers(){const colors=state.teams.map(id=>{const t=team(id);return $('#kitType').value==='away'?t.c2:t.c1});game.players=[{x:195,y:ground-28,vx:0,vy:0,r:26,h:34,team:0,color:colors[0],kickReady:0,jumpReady:0,onGround:true,facing:1,ai:false,celebrate:0},{x:765,y:ground-28,vx:0,vy:0,r:26,h:34,team:1,color:colors[1],kickReady:0,jumpReady:0,onGround:true,facing:-1,ai:state.mode!=='local',celebrate:0}];}
  // Click handlers receive a MouseEvent; keep it from being interpreted as a
  // request to advance a tournament round (which requires opponents[]).
  $('#startMatch').onclick=()=>start(false);
  $$('.quiz-answer').forEach((button,index)=>button.addEventListener('click',()=>{
    if(!activeQuiz||activeQuiz.answered)return;
    const quiz=activeQuiz,correct=index===quiz.question.correct;
    if(!quiz.power){
      if(correct){activeQuiz=null;$('#networkQuiz').classList.add('hidden');beginMatch(pendingNext)}
      else $('#quizFeedback').textContent='Resposta incorreta. Tente novamente.';
      return;
    }
    quiz.answered=true;
    $$('.quiz-answer').forEach(b=>b.disabled=true);
    if(correct){
      if(quiz.power==='speed')game.players[quiz.playerIndex].speedBoost=7;
      else game.players[1-quiz.playerIndex].stunned=5;
      $('#quizFeedback').textContent=quiz.power==='speed'?'Correto! Velocidade 4× por 7 segundos.':'Correto! Adversário congelado por 5 segundos.';
      sound(740,.18,'triangle',.06);
    }else{
      $('#quizFeedback').textContent=`Resposta incorreta. O poder foi perdido. Resposta certa: ${quiz.question.options[quiz.question.correct]}.`;
    }
    $('#quizContinue').textContent='CONTINUAR PARTIDA';
    $('#quizContinue').classList.remove('hidden');$('#quizContinue').focus();
  }));
  $('#quizContinue').onclick=()=>{
    if(!activeQuiz?.power||!activeQuiz.answered)return;
    activeQuiz=null;$('#networkQuiz').classList.add('hidden');keys.clear();
    acc=0;last=performance.now();paused=false;
  };  function special(i){const p=game?.players[i];if(!p||p.kickReady>0)return;p.kickReady=.72;const b=game.ball;let dx=b.x-p.x,dy=b.y-(p.y-p.h*.35);if(Math.abs(dx)>140||Math.abs(dy)>140){dx=p.facing;dy=-.2}else{dx=Math.sign(dx||p.facing);dy=(dy-10)/100}const n=Math.hypot(dx,dy)||1;b.vx=dx/n*620;b.vy=dy/n*620-150;b.kickOwner=i;b.kickLock=.18;game.shake=8;game.flash=.15;game.ball.trail=.45;sound(160,.18,'sawtooth',.06);setTimeout(()=>sound(90,.24,'triangle',.055),45)}
  function jump(p){if(p.jumpReady<=0){p.vy=-465;p.jumpReady=.2;p.onGround=false;sound(290,.055,'triangle',.018)}}
  function ai(p,dt){const b=game.ball;const levels={easy:{lead:.06,speed:270,accel:2.1,react:80,jump:95,kick:0.48},medium:{lead:.13,speed:360,accel:2.8,react:120,jump:135,kick:.95},hard:{lead:.2,speed:430,accel:3.5,react:175,jump:170,kick:1.55},veryhard:{lead:.27,speed:490,accel:4.2,react:230,jump:205,kick:2.3},overpowered:{lead:.34,speed:560,accel:5,react:290,jump:245,kick:3.2}};const d=levels[$("#aiDifficulty").value]||levels.medium;const targetX=clamp(b.x+clamp(b.vx*d.lead,-130,130),W*.53,W-65);const dx=targetX-p.x,boost=p.speedBoost>0?4:1;p.vx=clamp(p.vx+clamp(dx*d.accel*boost-p.vx*2.8,-560*boost,560*boost)*dt,-d.speed*boost,d.speed*boost);if(b.y<p.y-42&&Math.abs(b.x-p.x)<d.jump&&p.onGround)jump(p);if(Math.abs(b.x-p.x)<d.react&&Math.abs(b.y-(p.y-p.h))<150&&p.kickReady<=0&&Math.random()<dt*d.kick)special(1);p.facing=dx<0?-1:1}
  function update(dt){if(!game||paused||game.ended)return;game.elapsed+=dt;for(const p of game.players){p.speedBoost=Math.max(0,(p.speedBoost||0)-dt);p.stunned=Math.max(0,(p.stunned||0)-dt);}if(game.elapsed>=game.nextPowerup&&!game.powerup){game.powerup={x:120+Math.random()*(W-240),y:ground-32,life:12};game.nextPowerup=game.elapsed+18+Math.random()*12}if(game.powerup){game.powerup.life-=dt;if(game.powerup.life<=0)game.powerup=null;else for(let i=0;i<game.players.length;i++){const p=game.players[i];if(Math.hypot(p.x-game.powerup.x,(p.y-36)-game.powerup.y)<42){game.powerup=null;openQuiz(i,'speed');return}}}if(game.elapsed>=game.nextFreezePowerup&&!game.freezePowerup){game.freezePowerup={x:130+Math.random()*(W-260),y:205+Math.random()*105,life:14};game.nextFreezePowerup=game.elapsed+22+Math.random()*18}if(game.freezePowerup){game.freezePowerup.life-=dt;if(game.freezePowerup.life<=0)game.freezePowerup=null;else for(let i=0;i<game.players.length;i++){const p=game.players[i];if(Math.hypot(p.x-game.freezePowerup.x,(p.y-70)-game.freezePowerup.y)<43){game.freezePowerup=null;openQuiz(i,'freeze');return}}}game.time-=dt;if(game.time<=0){game.time=0;if(game.score[0]===game.score[1]){if(!game.overtime){game.overtime=1;game.time=15;$('#matchPhase').textContent='PRORROGAÇÃO';sound(550,.25,'triangle')}else if(game.overtime===1){game.overtime=2;game.time=15;$('#matchPhase').textContent='GOL DE OURO'}else finish()}else finish();if(game.ended)return}
    const b=game.ball,bx0=b.x,by0=b.y;b.vy+=560*dt;b.x+=b.vx*dt;b.y+=b.vy*dt;b.vx*=Math.pow(.999,dt*60);b.vy*=Math.pow(.999,dt*60);b.trail=Math.max(0,b.trail-dt);b.kickLock=Math.max(0,(b.kickLock||0)-dt);game.shake=Math.max(0,game.shake-dt*25);game.flash=Math.max(0,game.flash-dt);game.net=Math.max(0,game.net-dt);
    if(b.y+b.r>ground){b.y=ground-b.r;if(b.vy>30)sound(115,.045,'triangle',.016);b.vy=-Math.max(Math.abs(b.vy)*.92,360);b.vx*=.985}
    if(b.y-b.r<38){b.y=38+b.r;b.vy=Math.abs(b.vy)*.86}
    const goalTop=ground-goalH;
    if(b.x-b.r<30){if(b.y>goalTop){if(b.x<12)scoreGoal(1)}else{b.x=30+b.r;b.vx=Math.abs(b.vx)*.78}}
    if(b.x+b.r>W-30){if(b.y>goalTop){if(b.x>W-12)scoreGoal(0)}else{b.x=W-30-b.r;b.vx=-Math.abs(b.vx)*.78}}
    b.vx=clamp(b.vx,-600,600);b.vy=clamp(b.vy,-760,760);
    for(let i=0;i<2;i++){const p=game.players[i],px0=p.x,py0=p.y;p.kickReady=Math.max(0,p.kickReady-dt);p.jumpReady=Math.max(0,p.jumpReady-dt);p.celebrate=Math.max(0,p.celebrate-dt);if(p.stunned>0){p.vx=0;p.vy=0;continue}if(p.ai)ai(p,dt);else{const left=i===0?'a':'ArrowLeft',right=i===0?'d':'ArrowRight',up=i===0?'w':'ArrowUp';const dir=(keys.has(right)?1:0)-(keys.has(left)?1:0);p.vx+=((dir*440*(p.speedBoost>0?4:1))-p.vx)*Math.min(1,dt*14);if(keys.has(up)&&p.onGround)jump(p);if(dir)p.facing=dir}p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=1000*dt;if(p.y>ground-28){p.y=ground-28;p.vy=0;p.onGround=true}p.x=clamp(p.x,62,W-62);const body=sweptPlayerHit(b,bx0,by0,p,px0,py0,-41,43),head=sweptPlayerHit(b,bx0,by0,p,px0,py0,-86,48);if((b.kickLock<=0||b.kickOwner!==i)&&(body||head)){const hit=head&&(!body||head.t<body.t)?{...head,head:true}:{...body,head:false};resolvePlayerHit(b,p,hit)}}
    $('#clock').textContent=`${String(Math.floor(game.time/60)).padStart(2,'0')}:${String(Math.floor(game.time%60)).padStart(2,'0')}`;updateParticles(dt);draw()}
  function sweptPlayerHit(b,bx0,by0,p,px0,py0,offsetY,radius){const sx=bx0-px0,sy=by0-(py0+offsetY),dx=(b.x-bx0)-(p.x-px0),dy=(b.y-by0)-(p.y-py0),len2=dx*dx+dy*dy,t=len2?clamp(-(sx*dx+sy*dy)/len2,0,1):0,nx0=sx+dx*t,ny0=sy+dy*t,d=Math.hypot(nx0,ny0),sum=radius+b.r;if(d>=sum)return null;let nx=nx0/(d||1),ny=ny0/(d||1);if(d<.001){const fx=b.x-(p.x),fy=b.y-(p.y+offsetY),fd=Math.hypot(fx,fy)||1;nx=fx/fd;ny=fy/fd}return {t,nx,ny,offsetY,radius}}
  function resolvePlayerHit(b,p,hit){const {nx,ny,offsetY}=hit;b.x=p.x+nx*(hit.radius+b.r+2);b.y=p.y+offsetY+ny*(hit.radius+b.r+2);const relative=(b.vx-p.vx)*nx+(b.vy-p.vy)*ny,target=Math.max(hit.head?460:360,relative*1.08);b.vx+=nx*(target-relative);b.vy+=ny*(target-relative);if(hit.head){b.vx+=p.vx*.12;if(ny<-.15)sound(240,.05,'triangle',.018)}}
  function scoreGoal(scorer){if(game.ended||game.goalLock)return;game.goalLock=true;game.score[scorer]++;$(`#score${scorer+1}`).textContent=game.score[scorer];game.net=.8;game.players.forEach(p=>p.celebrate=1.3);game.ball.trail=0;$('#goalBanner').textContent='GOOOOL!';$('#goalBanner').classList.remove('hidden');for(let i=0;i<42;i++){const a=Math.random()*Math.PI*2,v=80+Math.random()*320;game.particles.push({x:scorer===0?35:W-35,y:ground-goalH/2,vx:Math.cos(a)*v,vy:Math.sin(a)*v-100,life:.7+Math.random()*.9,color:Math.random()>.5?'#d7f36a':'#ff6038'})}sound(660,.22,'triangle',.06);setTimeout(()=>sound(880,.4,'triangle',.05),160);setTimeout(()=>$('#goalBanner').classList.add('hidden'),1300);setTimeout(()=>{if(game&&!game.ended){resetRound();}},1050)}
  function resetRound(){game.goalLock=false;game.ball={x:480,y:190,vx:(Math.random()-.5)*100,vy:-170,r:17,trail:0};game.players[0].x=190;game.players[1].x=770;game.players.forEach(p=>{p.y=ground-28;p.vx=0;p.vy=0;p.onGround=true})}
  function updateParticles(dt){game.particles=game.particles.filter(p=>p.life>0);for(const p of game.particles){p.life-=dt;p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=400*dt}}
  function showChampionCelebration(active){const panel=$('#championCelebration'),confetti=$('#championConfetti');panel.classList.toggle('hidden',!active);confetti.replaceChildren();if(!active)return;for(let i=0;i<54;i++){const bit=document.createElement('i');bit.className='confetti-bit';bit.style.setProperty('--x',Math.random()*100+'%');bit.style.setProperty('--delay',Math.random()*1.8+'s');bit.style.setProperty('--duration',2.1+Math.random()*2+'s');bit.style.setProperty('--hue',Math.floor(Math.random()*360));confetti.append(bit)}}  function finish(){if(game.ended)return;game.ended=true;const tied=game.score[0]===game.score[1],won=game.score[0]>game.score[1];const competition=['br','world','knockout'].includes(state.mode);const champion=competition&&state.round>=3&&won;if(competition){if(won)state.competitionPoints+=3;else if(tied)state.competitionPoints++;if(state.mode==='knockout'&&!won)state.eliminated=true}$('#resultTitle').textContent=tied?'EMPATE!':won?'VITÓRIA!':'DERROTA';$('#resultName1').textContent=team(state.teams[0]).name;$('#resultName2').textContent=team(state.teams[1]).name;$('#resultScore').textContent=`${game.score[0]} — ${game.score[1]}`;$('#resultMessage').textContent=competition?state.eliminated?'Eliminado do torneio.':`Pontos no campeonato: ${state.competitionPoints}.`:(tied?'Tudo igual depois do gol de ouro.':won?'A torcida vai lembrar dessa partida.':'Hora de pedir a revanche.');const next=$('#nextTournament');next.classList.toggle('hidden',!competition||state.eliminated||state.round>=3);if(state.round>=3&&competition)$('#resultMessage').textContent=`Competição encerrada • ${state.competitionPoints} pontos${state.mode==='knockout'&&won?' • CAMPEÃO!':''}`;showChampionCelebration(champion);show('result');sound(440,.6,'sine',.04)}
  function loop(now){if(!game||game.ended)return;let dt=Math.min((now-last)/1000,.04);last=now;if(!paused){acc+=dt;while(acc>=1/120){update(1/120);acc-=1/120}}raf=requestAnimationFrame(loop)}
  function togglePause(){if(!game||game.ended||activeQuiz)return;paused=!paused;$('#pauseOverlay').classList.toggle('hidden',!paused);if(!paused)last=performance.now()}
  $('#pause').onclick=togglePause;$('#resume').onclick=togglePause;$('#quitMatch').onclick=()=>{paused=true;cancelAnimationFrame(raf);show('setup')};$('#rematch').onclick=()=>start(false);$('#nextTournament').onclick=()=>start(true);
  function draw(){if(!game)return;const dpr=canvas.width/Math.max(1,canvas.getBoundingClientRect().width),sx=canvas.width/W,sy=canvas.height/H;ctx.setTransform(sx,0,0,sy,0,0);const night=state.stadium==='night',bg=night?'#101b35':state.stadium==='europe'?'#38845a':'#246c4e';ctx.fillStyle=night?'#15203a':'#30865a';ctx.fillRect(0,0,W,H);ctx.save();if(game.shake)ctx.translate((Math.random()-.5)*game.shake,(Math.random()-.5)*game.shake);
    // crowd and stadium tiers
    const crowdTop=night?'#10182a':'#142e40',crowdMid=night?'#19243a':'#1c3d50';ctx.fillStyle=crowdTop;ctx.fillRect(0,0,W,100);ctx.fillStyle=crowdMid;ctx.beginPath();ctx.moveTo(0,20);ctx.lineTo(W,20);ctx.lineTo(W,91);ctx.lineTo(0,91);ctx.fill();ctx.fillStyle='#081a2a';ctx.fillRect(0,0,W,11);ctx.fillStyle=night?'#b6c7ff':'#d5e5d0';ctx.fillRect(0,92,W,8);for(let i=0;i<11;i++){const x=i*96-12;ctx.fillStyle=night?'#97a9ff':'#fff0bd';ctx.beginPath();ctx.arc(x+44,22,25,Math.PI,Math.PI*2);ctx.fill();ctx.fillStyle=night?'#b6c7ff':'#fff1cc';ctx.fillRect(x+22,21,44,3)}
    const shirtColors=['#f4d36b','#e9eee5','#d6504b','#65b4df','#8ecf7a','#bc8bdc'];for(let row=0;row<3;row++){for(let col=0;col<64;col++){const x=col*16+((row%2)*8),y=41+row*16,phase=performance.now()*.006+col*.72+row*1.9,wave=Math.sin(phase)*5,shirt=shirtColors[(col*3+row*5)%shirtColors.length];ctx.strokeStyle='#deb28b';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x-3,y+30);ctx.lineTo(x-6+wave,y+1);ctx.moveTo(x+3,y+30);ctx.lineTo(x+7-wave,y-2);ctx.stroke();ctx.fillStyle=shirt;ctx.beginPath();ctx.ellipse(x,y+8,5,7,0,0,Math.PI*2);ctx.fill();ctx.fillStyle=['#d6a27c','#efc49c','#a96e52','#e6b39a'][col%4];ctx.beginPath();ctx.arc(x,y,4,0,Math.PI*2);ctx.fill()}}
    ctx.fillStyle='#e84d40';ctx.fillRect(0,89,W,5);ctx.fillStyle='#f7e8bf';ctx.font='800 10px Arial';ctx.textAlign='center';ctx.fillText('HEAD SOCCER CHAMPIONS  •  TORCIDA PRESENTE  •  HEAD SOCCER CHAMPIONS',W/2,87);
    // field, stripes and lines
    const grad=ctx.createLinearGradient(0,100,0,ground);grad.addColorStop(0,bg);grad.addColorStop(1,'#174b38');ctx.fillStyle=grad;ctx.fillRect(0,100,W,ground-100);for(let x=30;x<W;x+=116){ctx.fillStyle='rgba(255,255,255,.045)';ctx.fillRect(x,100,58,ground-100)}ctx.strokeStyle='#e8f2d7cc';ctx.lineWidth=3;ctx.strokeRect(30,100,W-60,ground-100);ctx.beginPath();ctx.moveTo(W/2,100);ctx.lineTo(W/2,ground);ctx.stroke();ctx.beginPath();ctx.arc(W/2,(100+ground)/2,78,0,Math.PI*2);ctx.stroke();ctx.beginPath();ctx.arc(W/2,(100+ground)/2,4,0,Math.PI*2);ctx.fillStyle='#f1f4df';ctx.fill();
    const gy=ground-goalH;ctx.fillStyle='#cbd8c7';ctx.fillRect(3,gy,27,goalH);ctx.fillRect(W-30,gy,27,goalH);ctx.strokeStyle='#eff2dd';ctx.lineWidth=4;ctx.strokeRect(4,gy,26,goalH);ctx.strokeRect(W-30,gy,26,goalH);ctx.strokeStyle='#ffffff44';ctx.lineWidth=1;for(let y=gy+8;y<ground;y+=14){ctx.beginPath();ctx.moveTo(5,y);ctx.lineTo(29,y);ctx.moveTo(W-29,y);ctx.lineTo(W-5,y);ctx.stroke()}for(let x=7;x<30;x+=8){ctx.beginPath();ctx.moveTo(x,gy);ctx.lineTo(x,ground);ctx.moveTo(W-x,gy);ctx.lineTo(W-x,ground);ctx.stroke()}
    if(window.HeadSoccer3D?.ready){window.HeadSoccer3D.render(game.players.map((p,i)=>({...p,appearance:{...team(state.teams[i]),c1:p.color}})))}else for(const [i,p] of game.players.entries()){drawPlayer(p,i);if(p.stunned>0)drawFreezeEffect(p)}const b=game.ball;if(b.trail){for(let i=6;i>=0;i--){ctx.globalAlpha=(1-i/7)*.13;ctx.beginPath();ctx.arc(b.x-b.vx*.018*i,b.y-b.vy*.014*i,b.r*(1-i*.07),0,Math.PI*2);ctx.fillStyle=i%2?'#ffe56d':'#ff6538';ctx.fill()}ctx.globalAlpha=1}drawBall(b);for(const p of game.particles){ctx.globalAlpha=clamp(p.life,0,1);ctx.fillStyle=p.color;ctx.fillRect(p.x,p.y,5,5)}ctx.globalAlpha=1;if(game.net){ctx.fillStyle=`rgba(255,255,255,${game.net*.15})`;ctx.fillRect(0,gy,30,goalH);ctx.fillRect(W-30,gy,30,goalH)}if(game.powerup){const q=game.powerup,pulse=1+Math.sin(performance.now()/120)*.12;ctx.save();ctx.translate(q.x,q.y);ctx.scale(pulse,pulse);ctx.shadowColor='#d7f36a';ctx.shadowBlur=24;ctx.fillStyle='#d7f36a';ctx.beginPath();ctx.arc(0,0,19,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;ctx.fillStyle='#102a40';ctx.font='900 23px Arial';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText('⚡',0,1);ctx.restore()}if(game.freezePowerup){const q=game.freezePowerup,pulse=1+Math.sin(performance.now()/140)*.1;ctx.save();ctx.translate(q.x,q.y);ctx.scale(pulse,pulse);ctx.shadowColor='#74d9ff';ctx.shadowBlur=25;ctx.fillStyle='#91e5ff';ctx.beginPath();ctx.arc(0,0,19,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;ctx.fillStyle='#123149';ctx.font='900 22px Arial';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText('❄',0,1);ctx.restore()}for(let i=0;i<game.players.length;i++){const p=game.players[i];if(p.stunned>0){ctx.fillStyle='#91e5ff';ctx.font='800 15px Arial';ctx.textAlign='center';ctx.fillText('❄ PARADO '+Math.ceil(p.stunned)+'s',p.x,p.y-120)}if(p.speedBoost>0){ctx.fillStyle='#d7f36a';ctx.font='800 15px Arial';ctx.textAlign='center';ctx.fillText('⚡ 4× '+Math.ceil(p.speedBoost)+'s',p.x,p.y-120)}}ctx.restore();if(game.flash){ctx.fillStyle=`rgba(255,245,190,${game.flash*.3})`;ctx.fillRect(0,0,W,H)}}
  function drawBall(b){const shadowY=ground-3,fade=clamp(1-(ground-b.y)/260,.2,.75);ctx.fillStyle=`rgba(4,18,24,${fade})`;ctx.beginPath();ctx.ellipse(b.x+4,shadowY,Math.max(7,18-(ground-b.y)*.025),5,0,0,Math.PI*2);ctx.fill();ctx.save();ctx.translate(b.x,b.y);ctx.rotate(performance.now()/410);const ballGrad=ctx.createRadialGradient(-6,-8,2,0,0,b.r+2);ballGrad.addColorStop(0,'#fff');ballGrad.addColorStop(.72,'#f1eee4');ballGrad.addColorStop(1,'#a8b6ba');ctx.fillStyle=ballGrad;ctx.beginPath();ctx.arc(0,0,b.r,0,Math.PI*2);ctx.fill();ctx.fillStyle='#172532';for(let j=0;j<5;j++){const a=j*Math.PI*2/5;ctx.beginPath();ctx.arc(Math.cos(a)*10,Math.sin(a)*10,4,0,Math.PI*2);ctx.fill()}ctx.strokeStyle='#526067';ctx.lineWidth=1;ctx.beginPath();ctx.arc(0,0,b.r-2,0,Math.PI*2);ctx.stroke();ctx.restore()}
  function drawFreezeEffect(p){const x=p.x,y=p.y,phase=performance.now()/180;ctx.save();ctx.globalAlpha=.34;ctx.fillStyle='#74d9ff';ctx.beginPath();ctx.ellipse(x,y-48,42,78,0,0,Math.PI*2);ctx.fill();ctx.globalAlpha=.95;ctx.strokeStyle='#a8efff';ctx.lineWidth=3;ctx.beginPath();ctx.ellipse(x,y-48,42,78,0,0,Math.PI*2);ctx.stroke();ctx.globalAlpha=.85;for(let i=0;i<6;i++){const a=i*Math.PI/3+phase*.12,px=x+Math.cos(a)*39,py=y-49+Math.sin(a)*71;ctx.save();ctx.translate(px,py);ctx.rotate(a);ctx.fillStyle='#c9f6ff';ctx.beginPath();ctx.moveTo(0,-12);ctx.lineTo(6,0);ctx.lineTo(0,12);ctx.lineTo(-6,0);ctx.closePath();ctx.fill();ctx.restore()}for(let i=0;i<13;i++){const sx=x+Math.sin(phase+i*8.2)*47,sy=y-112+((phase*15+i*29)%115);ctx.fillStyle=i%3===0?'#ffffff':'#b8efff';ctx.globalAlpha=.65+Math.sin(phase+i)*.25;ctx.beginPath();ctx.arc(sx,sy,2+(i%3),0,Math.PI*2);ctx.fill()}ctx.globalAlpha=.9;ctx.fillStyle='#c9f6ff';ctx.font='900 19px Arial';ctx.textAlign='center';ctx.fillText('❄',x,y-136);ctx.restore()}  function drawPlayer(p,i){const x=p.x,y=p.y,dir=p.facing,t=team(state.teams[i]),away=$('#kitType').value==='away',shirt=away?t.c2:t.c1,trim=away?t.c1:t.c2,cycle=performance.now()/95+i*1.6,run=Math.sin(cycle)*Math.min(7,Math.abs(p.vx)/38),jumping=!p.onGround?Math.min(1,Math.abs(p.vy)/420):0;if(t.wheelchair&&headImages.has(t.id)){const sprite=headImages.get(t.id),h=144,w=h*sprite.width/sprite.height;ctx.save();ctx.translate(x,y);ctx.scale(dir,1);ctx.drawImage(sprite,-w/2,-h,w,h);ctx.restore();return}ctx.fillStyle='#06192388';ctx.beginPath();ctx.ellipse(x,ground-2,32+Math.abs(p.y-(ground-28))*.06,7,0,0,Math.PI*2);ctx.fill();if(p.celebrate){ctx.strokeStyle='#d7f36a';ctx.lineWidth=4;ctx.beginPath();ctx.arc(x,y-71,48,Math.PI,Math.PI*2);ctx.stroke()}ctx.lineCap='round';ctx.strokeStyle='#d9e0dc';ctx.lineWidth=13;ctx.beginPath();ctx.moveTo(x-9,y-27);ctx.lineTo(x-13+run,y-7);ctx.moveTo(x+9,y-27);ctx.lineTo(x+13-run,y-7);ctx.stroke();ctx.strokeStyle='#141e2d';ctx.lineWidth=9;ctx.beginPath();ctx.moveTo(x-13+run,y-7);ctx.lineTo(x-23+run,y-3);ctx.moveTo(x+13-run,y-7);ctx.lineTo(x+23-run,y-3);ctx.stroke();ctx.fillStyle='#f5f4e9';ctx.beginPath();ctx.ellipse(x-24+run,y-2,9,4,-.1,0,Math.PI*2);ctx.ellipse(x+22-run,y-2,9,4,.1,0,Math.PI*2);ctx.fill();ctx.fillStyle=shirt;ctx.beginPath();ctx.roundRect(x-25,y-63,50,44,10);ctx.fill();ctx.save();ctx.beginPath();ctx.roundRect(x-25,y-63,50,44,10);ctx.clip();ctx.fillStyle=trim;for(let k=-2;k<=2;k++){ctx.globalAlpha=k===0?.85:.46;ctx.fillRect(x+k*13-3,y-62,6,45)}ctx.globalAlpha=1;ctx.fillStyle='#ffffff55';ctx.fillRect(x-24,y-61,48,4);ctx.restore();ctx.fillStyle='#fff';ctx.font='900 14px Arial';ctx.textAlign='center';ctx.fillText(i===0?'10':'9',x,y-34);ctx.fillStyle=trim;ctx.beginPath();ctx.moveTo(x-8,y-62);ctx.lineTo(x,y-54);ctx.lineTo(x+8,y-62);ctx.lineTo(x+4,y-64);ctx.lineTo(x,y-59);ctx.lineTo(x-4,y-64);ctx.fill();ctx.strokeStyle='#d9a87e';ctx.lineWidth=9;ctx.beginPath();ctx.moveTo(x-22,y-54);ctx.lineTo(x-30,y-37+run*.5);ctx.moveTo(x+22,y-54);ctx.lineTo(x+30,y-37-run*.5);ctx.stroke();const headImage=headImages.get(t.id);if(headImage){const [cx,cy,cw,ch]=t.headCrop,headH=70,headW=headH*cw*headImage.width/(ch*headImage.height);ctx.save();ctx.translate(x,y-95+jumping*3);ctx.scale(dir,1);ctx.drawImage(headImage,cx*headImage.width,cy*headImage.height,cw*headImage.width,ch*headImage.height,-headW/2,-headH/2,headW,headH);ctx.restore();return}const hx=x+dir*5,hy=y-86+jumping*3;ctx.fillStyle='#8b5746';ctx.beginPath();ctx.ellipse(hx,hy+2,31,30,0,0,Math.PI*2);ctx.fill();const face=ctx.createRadialGradient(hx-9,hy-10,3,hx,hy,34);face.addColorStop(0,'#f4c79d');face.addColorStop(1,'#c18464');ctx.fillStyle=face;ctx.beginPath();ctx.ellipse(hx,hy,29,28,0,0,Math.PI*2);ctx.fill();ctx.fillStyle=i===0?'#38251d':'#20212a';ctx.beginPath();if(i===0){ctx.ellipse(hx,hy-18,29,14,-.1,Math.PI,Math.PI*2);ctx.fill();ctx.fillRect(hx-27,hy-18,12,15);ctx.fillRect(hx+13,hy-20,14,12)}else{ctx.ellipse(hx,hy-20,30,10,0,Math.PI,Math.PI*2);ctx.fill();ctx.beginPath();ctx.moveTo(hx-26,hy-18);ctx.quadraticCurveTo(hx-4,hy-30,hx+6,hy-13);ctx.quadraticCurveTo(hx+15,hy-5,hx+25,hy-16);ctx.lineTo(hx+26,hy-8);ctx.quadraticCurveTo(hx+2,hy-5,hx-26,hy-10);ctx.fill()}for(const ex of [-1,1]){const eyeX=hx+dir*8+ex*7;ctx.fillStyle='#fff';ctx.beginPath();ctx.ellipse(eyeX,hy-1,5,7,0,0,Math.PI*2);ctx.fill();ctx.fillStyle='#172334';ctx.beginPath();ctx.arc(eyeX+dir*1.5,hy,2.7,0,Math.PI*2);ctx.fill();ctx.strokeStyle='#513428';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(eyeX-4,hy-9);ctx.lineTo(eyeX+3,hy-10);ctx.stroke()}ctx.fillStyle='#a86650';ctx.beginPath();ctx.ellipse(hx+dir*3,hy+30,4,2,0,0,Math.PI*2);ctx.fill();ctx.strokeStyle='#713f36';ctx.lineWidth=2.4;ctx.beginPath();ctx.arc(hx+dir*3,hy+8,8,.18,Math.PI-.18);ctx.stroke()}
})();




















