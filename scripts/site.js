/* roncartoons.de – Dekoration (Stifte, Krümel, Tape) + Mail-Schutz. Keine externen Dienste, keine Cookies. */
(function(){
"use strict";
var BASE=(document.currentScript&&document.currentScript.src)?document.currentScript.src.replace(/scripts\/site\.js.*$/,""):"/";
var SZ={"A_shaving_big":[238,240],"A_shaving_big_green":[238,240],"A_shaving_big_lblue":[238,240],"A_shaving_big_red":[238,240],"A_shaving_big_turq":[238,240],"A_shaving_big_yellow":[238,240],"B_shaving_a":[127,224],"B_shaving_a_blue":[127,224],"B_shaving_a_red":[127,224],"B_shaving_a_turq":[127,224],"B_shaving_a_yellow":[127,224],"C_cap_grey":[167,90],"C_cap_yellow":[195,79],"C_eraser":[114,90],"C_sharpener":[120,118],"C_sharpener2":[121,115],"D_blue_0":[420,463],"D_blue_1":[420,373],"D_graphite_0":[420,373],"D_graphite_1":[420,375],"D_green_0":[420,325],"D_green_1":[420,512],"D_lblue_0":[420,463],"D_lblue_1":[420,375],"D_red_0":[420,512],"D_red_1":[420,325],"D_yellow_0":[420,325],"D_yellow_1":[420,405],"M_green":[682,78],"M_grey":[664,92],"P_blue_dark":[891,41],"P_green":[861,43],"P_lblue_jumbo":[378,37],"P_red":[867,46],"P_steel_jumbo":[466,37],"P_tombow":[806,37],"P_yellow":[867,41],"T_brush":[528,69],"T_dark":[706,69],"T_fine_blue":[752,61],"T_fude":[654,55],"T_grey":[708,57],"tape_lilac_1":[339,165],"tape_lilac_2":[399,168],"tape_lilac_3":[520,139],"tape_mint_1":[339,165],"tape_mint_2":[399,168],"tape_mint_3":[520,139],"tape_peach_1":[339,165],"tape_peach_2":[399,168],"tape_peach_3":[520,139],"tape_rose_1":[339,165],"tape_rose_2":[399,168],"tape_rose_3":[520,139],"tape_sky_1":[339,165],"tape_sky_2":[399,168],"tape_sky_3":[520,139],"tape_yellow_1":[339,165],"tape_yellow_2":[399,168],"tape_yellow_3":[520,139]};

/* ---------- Mail ohne Klartext im HTML ---------- */
document.querySelectorAll("a.mail").forEach(function(a){
  var u=a.getAttribute("data-u"),d=a.getAttribute("data-d");if(!u||!d)return;
  var m=u+"@"+d;a.href="mailto:"+m;if(!a.getAttribute("data-keep"))a.textContent=m;
});

/* ---------- Dekoration ---------- */
var page=document.querySelector(".page");
if(!page||!window.Image)return;
var DECO=true;
var seed=0,str=(page.getAttribute("data-deco")||"x");for(var i=0;i<str.length;i++)seed=(seed*31+str.charCodeAt(i))>>>0;
function rng(s){return function(){s|=0;s=s+0x6D2B79F5|0;var t=Math.imul(s^s>>>15,1|s);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
var R;
function pick(a){return a[Math.floor(R()*a.length)]}
function between(a,b){return a+R()*(b-a)}

/* kind: p=Buntstift/Graphit (liefert Krümel in c-Farbe), m=Copic, t=Pentel/Fineliner (beide: keine Krümel in der Nähe) */
var PEN=[
 ["P_blue_dark","p","blue"],["P_green","p","green"],["P_yellow","p","yellow"],["P_red","p","red"],
 ["P_steel_jumbo","p","lblue"],["P_tombow","p","graphite"],
 ["M_grey","m"],["M_green","m"],
 ["T_brush","t"],["T_fude","t"],["T_fine_blue","t"],["T_dark","t"],["T_grey","t"]];
var CHIP=["C_sharpener","C_sharpener2","C_eraser","C_cap_grey","C_cap_yellow"];
function dustFile(c,v){return"D_"+c+"_"+(v%2)}
function chipFile(c,alt){
  if(c==="graphite")return "A_shaving_big";
  if(alt){return c==="green"?"B_shaving_a":"B_shaving_a_"+(c==="lblue"?"blue":c)}
  return c==="blue"?"A_shaving_big":"A_shaving_big_"+c;
}
var RAD=Math.PI/180;
function size(n){return SZ[n]||[400,40]}
function mk(src,cls){var im=new Image();im.src=BASE+"style/deko/"+src+".webp";im.alt="";im.setAttribute("data-gen","1");im.setAttribute("aria-hidden","true");im.decoding="async";im.className=cls;return im}
/* Strecke (Stiftachse) und Abstand eines Punkts dazu */
function segDist(px,py,s){
  var vx=s.x2-s.x1,vy=s.y2-s.y1,l=vx*vx+vy*vy,t=l?((px-s.x1)*vx+(py-s.y1)*vy)/l:0;t=Math.max(0,Math.min(1,t));
  var dx=px-(s.x1+t*vx),dy=py-(s.y1+t*vy);return Math.sqrt(dx*dx+dy*dy)}

var items,usedD;
/* Stift: Spitze liegt bei (x,y), Körper läuft in Richtung (-cos a, -sin a) */
function addPen(it,x,y,a,k,cls){
  var sz=size(it[0]),L=sz[0]*k,Hh=sz[1]*k;
  var d=document.createElement("div");d.className="sh"+(cls?" "+cls:"");d.setAttribute("data-gen","1");d.setAttribute("aria-hidden","true");
  d.style.left=x+"px";d.style.top=y+"px";
  var r=document.createElement("div");r.className="rot";r.style.transform="rotate("+a+"deg)";
  var im=new Image();im.src=BASE+"style/deko/"+it[0]+".webp";im.alt="";im.decoding="async";im.style.width=L+"px";
  r.appendChild(im);d.appendChild(r);page.appendChild(d);
  var o={n:it[0],k:it[1],c:it[2],x:x,y:y,a:a,L:L,T:Hh,x1:x,y1:y,x2:x-Math.cos(a*RAD)*L,y2:y-Math.sin(a*RAD)*L};
  items.push(o);return o}
function addChip(n,x,y,rot,k){
  var sz=size(n),w=sz[0]*k,h=sz[1]*k;
  var im=mk(n,"chip");im.style.width=w+"px";im.style.left=(x-w/2)+"px";im.style.top=(y-h/2)+"px";im.style.transform="rotate("+rot+"deg)";page.appendChild(im);
  items.push({k:"c",x1:x-w/2,y1:y,x2:x+w/2,y2:y,T:h})}
/* Krümel an der Spitze eines Buntstifts: Farbe = Stiftfarbe, nie über einem Stift, nie bei Copic/Pentel */
function crumbs(o,box){
  if(o.k!=="p"||!o.c||R()>.9)return;
  var nUsed=usedD[o.c]||0;if(nUsed>=2)return;               /* jede Farbe höchstens zweimal, dann gespiegelt */
  var tx=Math.cos(o.a*RAD),ty=Math.sin(o.a*RAD),f=dustFile(o.c,nUsed),ds=size(f);
  var w=Math.min(box.maxW||190,between(150,200)),h=w*ds[1]/ds[0];if(w<90)return;
  for(var tr=0;tr<8;tr++){
    var dist=30+h*0.5+tr*10+w*0.3*Math.abs(tx);
    var cx=o.x+tx*dist+between(-18,18)*Math.abs(ty),cy=o.y+ty*dist+between(-12,12);
    cx=Math.min(Math.max(cx,box.x0+w/2),box.x1-w/2);if(cy-h/2<box.y0||cy+h/2>box.y1)continue;
    var ok=items.every(function(q){
      if(q.k==="c")return Math.abs(cy-q.y1)>h/2+q.T/2+10||cx<q.x1-w/2-10||cx>q.x2+w/2+10;
      var lim=Math.min(w,h)*0.5+q.T*0.5+8;
      if(q.k==="m"||q.k==="t")return segDist(cx,cy,q)>Math.min(w,h)*0.5+q.T*0.5+110;
      return segDist(cx,cy,q)>lim});
    if(!ok)continue;
    var im=mk(f,"dust");im.style.width=w+"px";im.style.left=(cx-w/2)+"px";im.style.top=(cy-h/2)+"px";if(nUsed)im.style.transform="scaleX(-1) rotate("+Math.round(between(-25,25))+"deg)";page.appendChild(im);usedD[o.c]=nUsed+1;
    if(R()<.6){
      var cf=chipFile(o.c,R()<.4),cs=size(cf),cw=cs[0]*0.28,ch=cs[1]*0.28,
          px=cx+between(-w*.3,w*.3),py=cy+(ty<0?-1:1)*(h*.5+ch*.5+6);
      if(px-cw/2>box.x0&&px+cw/2<box.x1&&py-ch/2>box.y0&&py+ch/2<box.y1){
        var i3=mk(cf,"chip");i3.style.width=cw+"px";i3.style.left=(px-cw/2)+"px";i3.style.top=(py-ch/2)+"px";i3.style.transform="rotate("+Math.round(between(-40,40))+"deg)";page.appendChild(i3)}}
    items.push({k:"d",x1:cx-w/2,y1:cy,x2:cx+w/2,y2:cy,T:h});
    return}
}

function build(){
  if(!DECO)return;
  Array.prototype.slice.call(page.querySelectorAll("[data-gen]")).forEach(function(n){n.remove()});
  R=rng(seed);items=[];usedD={};
  var sheet=page.querySelector(".sheet");if(!sheet)return;
  var W=page.clientWidth,H=page.offsetHeight,sl=sheet.offsetLeft,sr=sl+sheet.offsetWidth,sb=sheet.offsetTop+sheet.offsetHeight;
  var K=0.5,used={};
  function free(list){var c=list.filter(function(p){return!used[p[0]]});return c.length?c:list}

  /* ---- Seitenränder: Stifte liegen komplett sichtbar, steil entlang der Blattkante ---- */
  var mL=sl,mR=W-sr,occ={L:[],R:[]};
  if(Math.min(mL,mR)>=120){
    [["L",mL],["R",mR]].forEach(function(S){
      var side=S[0],m=S[1],avail=m-22,y=between(180,250),n=0;
      while(n<4&&y<Math.min(sb-420,1900)){
        var it=pick(free(R()<.6?PEN.filter(function(p){return p[1]==="p"}):PEN));used[it[0]]=1;
        var sz=size(it[0]),k=K,L=sz[0]*k,cos84=Math.cos(84*RAD);
        if(avail-4<L*cos84){k=(avail-4)/(cos84*sz[0]);L=sz[0]*k}
        var th0=Math.acos(Math.min(1,(avail-4)/L))/RAD,th=Math.min(84,Math.max(th0+2,58)+between(0,12));
        var up=R()<.5,                       /* Spitze oben? */
            dy=L*Math.sin(th*RAD),cr=(it[1]==="p"?170:0);
        var a=side==="L"?(up?-th:th):(up?180+th:180-th);
        var onto=R()<.55?between(16,38):0,                /* Spitze ragt manchmal ein Stück aufs Blatt */
            tipx=side==="L"?sl-16+onto:sr+16-onto,top=y+(up?cr:0),tipy=up?top:top+dy;
        if((up?tipy+dy:tipy)>sb-20||top<20)break;
        var o=addPen(it,tipx,tipy,a,k,"");
        var over=R()<.6?between(14,36):0,               /* Krümel dürfen ein wenig aufs Blatt */
            box={x0:side==="L"?6:sr+10-over,x1:side==="L"?sl-10+over:W-6,y0:60,y1:sb-60,maxW:Math.max(0,m-40)};
        crumbs(o,box);
        occ[side].push([top-(up?cr:0)-20,top+dy+(up?0:cr)+20]);
        y=top+dy+(up?0:cr)+between(50,120);n++;
      }
    });
    /* Kleinteile in freien Lücken am Rand */
    CHIP.slice().sort(function(){return R()-.5}).slice(0,3).forEach(function(n,j){
      var side=j%2?"R":"L",m=side==="L"?mL:mR,sz=size(n),w=sz[0]*.5;
      for(var t=0;t<14;t++){
        var y=between(160,Math.min(sb-200,1800)),ok=occ[side].every(function(v){return y<v[0]-w||y>v[1]+w});
        if(!ok)continue;
        var x=side==="L"?between(w/2+8,m-w/2-24):sr+between(w/2+24,m-w/2-8);
        addChip(n,x,y,between(-40,40),.5);occ[side].push([y-w,y+w]);break}
    });
  }

  /* ---- Unten: liegende Stifte im Streifen unter dem Blatt, nie über Inhalt ---- */
  var strip=H-sb;
  if(strip>=70){
    var nb=W<620?1:(W<960?2:3),pool=PEN.filter(function(p){return p[1]==="p"}),x=sl+between(6,40),longI=Math.floor(R()*nb);
    for(var i=0;i<nb;i++){
      var it=pick(free(pool));used[it[0]]=1;
      var sz=size(it[0]),k=K,L=sz[0]*k;
      if(L>sr-sl-30){k=(sr-sl-30)/sz[0];L=sz[0]*k}
      if(x+L>sr-10){if(i>0)break;x=sl+10;if(x+L>sr-10)break}
      var long=i===longI,tipRight=R()<.6,ang=between(-12,12)*(i%2?-1:1);
      var a=tipRight?ang:180+ang,cy=H-(long?between(strip-30,strip+40):between(34,Math.max(40,strip-48)));
      if(long)cy=Math.max(cy,sb+8+10);
      var tipx=tipRight?x+L:x;
      var o=addPen(it,tipx,cy,a,k,"");
      crumbs(o,{x0:6,x1:W-6,y0:sb-30,y1:H-6,maxW:200});
      x+=L+between(40,110);
    }
  }
}

/* Tapes aus data-tape: "farbe-nr:x:y:breite:winkel" je Eintrag (x,y in px oder %, relativ zum Blatt) */
document.querySelectorAll(".sheet[data-tape]").forEach(function(sh){
  sh.getAttribute("data-tape").split(";").forEach(function(t){
    var q=t.split(":");if(q.length<5)return;
    var im=new Image();im.src=BASE+"style/deko/tape_"+q[0].replace("-","_")+".webp";im.alt="";im.className="tape";im.setAttribute("aria-hidden","true");
    var st=im.style;st.width=q[3]+"px";st.transform="rotate("+q[4]+"deg)";
    var xs=q[1],ys=q[2];
    if(xs.charAt(0)==="r"){st.right=xs.slice(1)+"px"}else if(xs==="c"){st.left="50%";st.marginLeft=(-q[3]/2)+"px"}else st.left=xs+"px";
    if(ys.charAt(0)==="b"){st.bottom=ys.slice(1)+"px"}else st.top=ys+"px";
    sh.appendChild(im);
  });
});

var tm;build();
window.addEventListener("resize",function(){clearTimeout(tm);tm=setTimeout(build,200)});
window.addEventListener("load",function(){build()});
})();
