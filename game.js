let board, ctx;
const bw=360, bh=640;
let GO=false, sc=0;

const bwid=34, bhei=24;
const bx=bw/8, by=bh/2;
let bird={x:bx,y:by,w:bwid,h:bhei};
let bImg=new Image();

const parr=[], pw=64, ph=512, px=bw;
let tImg=new Image(), bImgP=new Image();

let vy=0, g=0.4, vx=-2;

window.onload = ()=> {
  board = document.getElementById("board");
  board.width = bw; board.height = bh;
  ctx = board.getContext("2d");

  bImg.src="flappybird.png";
  tImg.src="toppipe.png";
  bImgP.src="bottompipe.png";

  requestAnimationFrame(upd);
  setInterval(plPipe,1600);
  document.addEventListener("keydown", mvBird);
};

function upd(){
  requestAnimationFrame(upd);
  if(GO) return;

  ctx.clearRect(0,0,bw,bh);

  vy += g;
  bird.y = Math.max(bird.y+vy,0);
  ctx.drawImage(bImg, bird.x, bird.y, bird.w, bird.h);

  if(bird.y>bh) GO=true;

  parr.forEach(p=>{
    p.x += vx;
    ctx.drawImage(p.img,p.x,p.y,p.w,p.h);

    if(!p.passed && bird.x >p.x+p.w){
      sc += 0.5;
      p.passed=true;
    }
    if(hit(bird,p)) GO=true;
  });

  while(parr.length && parr[0].x < -pw) parr.shift();

  ctx.fillStyle="white";
  ctx.font="20px sans-serif";
  ctx.fillText(`SC:${sc}`,5,45);

  if(GO){
    ctx.fillText("GAME OVER",5,90);
    ctx.fillText("PRESS ENTER TO RESTART",5,120);
  }
}

function plPipe(){
  if(GO) return;
  const ry = -ph/4 - Math.random()*(ph/2);
  const gap = bh/4;

  parr.push({img:tImg,x:px,y:ry,w:pw,h:ph,passed:false});
  parr.push({img:bImgP,x:px,y:ry+ph+gap,w:pw,h:ph,passed:false});
}

function mvBird(e){
  if(["Space","ArrowUp","Enter","KeyX"].includes(e.code)){
    vy=-6;
    if(GO){
      bird.y=by;
      vy=0; sc=0; parr.length=0; GO=false;
    }
  }
}

function hit(a,b){
  return a.x < b.x+b.w &&
         a.x+a.w > b.x &&
         a.y < b.y+b.h &&
         a.y+a.h > b.y;
}
