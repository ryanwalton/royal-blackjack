import { useState, useEffect, useRef, useCallback } from "react";

// card data
const SUITS  = ["♠","♥","♦","♣"];
const VALUES = ["A","2","3","4","5","6","7","8","9","10","J","Q","K"];

const CARD_BACKS = [
  { id:"classic",   name:"Classic Navy",     price:0,    color:"#1a1a2e", accent:"#c9a84c", pattern:"diagonal", perkDesc:"The tried-and-true. Nothing flashy — just you and the cards." },
  { id:"crimson",   name:"Crimson Velvet",   price:1500,  color:"#6b0f1a", accent:"#ff6b6b", pattern:"dots",     perkDesc:"Rich, bold, slightly threatening. The dealer will take you seriously." },
  { id:"emerald",   name:"Emerald Isle",     price:2500,  color:"#064e3b", accent:"#6ee7b7", pattern:"diamond",  perkDesc:"Cool as a cucumber. Luck of the Irish sold separately." },
  { id:"midnight",  name:"Midnight Gold",    price:4000,  color:"#0c0c1e", accent:"#ffd700", pattern:"stars",    perkDesc:"For players who bet big and sleep late. Stars optional." },
  { id:"obsidian",  name:"Obsidian Flame",   price:6000,  color:"#1a0a00", accent:"#ff4500", pattern:"flame",    perkDesc:"Hot hands only. If you're on a cold streak, maybe not yet." },
  { id:"royal",     name:"Royal Sapphire",   price:8500, color:"#0a1628", accent:"#60a5fa", pattern:"crest",    perkDesc:"Reserved for royalty — or those with excellent taste and too many chips." },
  { id:"rose",      name:"Rose Gold",        price:3000,  color:"#2a0a14", accent:"#f4a7b9", pattern:"dots",     perkDesc:"Soft on the outside. Ruthless at the table." },
  { id:"arctic",    name:"Arctic Frost",     price:4500,  color:"#061828", accent:"#a8d8ea", pattern:"diagonal", perkDesc:"Ice cold decisions. Your opponent's sweat will vary." },
  { id:"amber",     name:"Amber Dusk",       price:5000,  color:"#1a0e00", accent:"#f59e0b", pattern:"diamond",  perkDesc:"Warm tones for when the evening is going very, very well." },
  { id:"serpent",   name:"Serpent Scale",    price:7000,  color:"#081a0e", accent:"#4ade80", pattern:"flame",    perkDesc:"Slippery. Unpredictable. The house is confused too." },
  { id:"dusk",      name:"Dusk Crimson",     price:7500, color:"#1a0505", accent:"#fb7185", pattern:"stars",    perkDesc:"For the player who thrives at the end of a long night." },
  { id:"astral",    name:"Astral Purple",    price:8000, color:"#0d0520", accent:"#a78bfa", pattern:"crest",    perkDesc:"Tuned to a different frequency. The cards agree." },
  { id:"carbon",    name:"Carbon Noir",      price:10000, color:"#080808", accent:"#94a3b8", pattern:"diagonal", perkDesc:"Matte black. Says nothing. Means everything." },
  { id:"inferno",   name:"Inferno",          price:12000, color:"#1a0000", accent:"#ef4444", pattern:"flame",    perkDesc:"This deck runs hot. So do your hands, apparently." },
  { id:"celestial", name:"Celestial White",  price:15000, color:"#e8e8f0", accent:"#818cf8", pattern:"stars",    perkDesc:"Blinding. Majestic. Somehow still losing to a 6." },
  { id:"void",      name:"Void Black",       price:18000, color:"#020202", accent:"#7c3aed", pattern:"crest",    perkDesc:"From the abyss. Where your chips go sometimes." },
  { id:"gilded",    name:"Gilded Sovereign", price:22000, color:"#0e0900", accent:"#fbbf24", pattern:"diamond",  perkDesc:"Hand-pressed gold leaf aesthetic. Chips not included." },
  { id:"prism",     name:"Prism",            price:30000, color:"#050510", accent:"#38bdf8", pattern:"dots",     perkDesc:"Splits light. Doesn't split pairs. That's your job." },
];

const DEALERS = [
  { id:"victoria", name:"Honey",    title:"The Professional", price:0,   emoji:"👩‍💼", accentColor:"#c9a84c", skinTone:"#c68642", hairColor:"#1a1a1a", outfitColor:"#1a2a4a", lipColor:"#c0392b", perkName:"Standard Rules",    perkIcon:"⚖️", perkDesc:"Classic Vegas rules." },
  { id:"max",      name:"Pitbull",  title:"Mr. 305 🎤",       price:15000, emoji:"🕶️",  accentColor:"#5dade2", skinTone:"#d4956a", hairColor:"#111111", outfitColor:"#1a2535", lipColor:"#666",     perkName:"+15% Win Bonus",    perkIcon:"💹", perkDesc:"All wins pay +15% extra chips. Dale." },
  { id:"luna",     name:"Madame Leota", title:"The Mystic",       price:25000, emoji:"🔮",  accentColor:"#c084fc", skinTone:"#f0e0d0", hairColor:"#180a28", outfitColor:"#2d1a4d", lipColor:"#9b59b6",  perkName:"Card Hint",         perkIcon:"🌙", perkDesc:"Shows Hit/Stand advice." },
  { id:"rex",      name:"Sly Guy",  title:"The Legend",       price:40000, emoji:"🎩",  accentColor:"#e74c3c", skinTone:"#c8956a", hairColor:"#3a2010", outfitColor:"#3d0c02", lipColor:"#8b4513",  perkName:"Blackjack pays 2×", perkIcon:"👑", perkDesc:"BJ pays double, dealer busts more." },
  { id:"nova",     name:"Easy Eric",title:"The Rookie",       price:12000, emoji:"⭐",  accentColor:"#60a5fa", skinTone:"#ffe4c4", hairColor:"#8b4513", outfitColor:"#1e3a5f", lipColor:"#ff7b93",  perkName:"Rookie Mistake",    perkIcon:"🎲", perkDesc:"15% chance dealer over-draws." },
  { id:"koda",     name:"Penny",    title:"The Good Girl 🐾", price:20000, emoji:"🐺",  accentColor:"#fb923c", skinTone:"#f0ece8", hairColor:"#c8956a", outfitColor:"#c8956a", lipColor:"#1a0800",  perkName:"Chaotic Energy",    perkIcon:"🦴", perkDesc:"Totally unpredictable. Just like her. 15% chance of a bonus bark payout." },
];

const TABLES = [
  { id:"classic",   name:"Green Felt",       price:0,    from:"#0e4d26", to:"#041a0e", border:"#c9a84c", perkDesc:"A classic for a reason. Countless fortunes won and lost right here." },
  { id:"burgundy",  name:"Burgundy Lounge",  price:2000,  from:"#4a0e1a", to:"#1a0408", border:"#ff6b6b", perkDesc:"Dim lighting, smooth jazz, questionable decisions. Perfection." },
  { id:"navy",      name:"Blue Velvet",      price:3000,  from:"#0e1a4d", to:"#04081a", border:"#60a5fa", perkDesc:"As deep as your poker face. As calm as your nerves definitely aren't." },
  { id:"onyx",      name:"Onyx Reserve",     price:4500,  from:"#1a1a1a", to:"#080808", border:"#ffd700", perkDesc:"Exclusive. Dramatic. The table that says 'I've done this before.'" },
  { id:"violet",    name:"Violet Dream",     price:7000,  from:"#2d1a4d", to:"#100818", border:"#c084fc", perkDesc:"Is this a casino or a fever dream? Why not both." },
  { id:"amber",     name:"Amber Lounge",     price:2500,  from:"#2a1400", to:"#0e0700", border:"#f59e0b", perkDesc:"Warm, inviting, and somehow you always order one more drink here." },
  { id:"rose",      name:"Rose Royale",      price:3500,  from:"#2a0a18", to:"#0e0408", border:"#f9a8d4", perkDesc:"Elegant, pink, and absolutely not to be underestimated." },
  { id:"forest",    name:"Deep Forest",      price:3000,  from:"#0a1e10", to:"#030a05", border:"#4ade80", perkDesc:"Serene as a walk in the woods. Until the dealer hits 21." },
  { id:"crimson",   name:"Crimson Parlour",  price:5000,  from:"#2a0808", to:"#0e0202", border:"#ef4444", perkDesc:"Intense. Passionate. You will not be playing it safe here." },
  { id:"arctic",    name:"Arctic Suite",     price:6000,  from:"#061828", to:"#02080e", border:"#bae6fd", perkDesc:"Cold, calculated, and the A/C is definitely broken." },
  { id:"dusk",      name:"Dusk Horizon",     price:8000, from:"#1a0a28", to:"#080410", border:"#fb923c", perkDesc:"The kind of table you find at sunset in Monaco. Or so you imagine." },
  { id:"void",      name:"The Void",         price:11000, from:"#030303", to:"#000000", border:"#7c3aed", perkDesc:"Where chips go to disappear. They look great doing it though." },
  { id:"jade",      name:"Jade Palace",      price:13000, from:"#042810", to:"#010e06", border:"#6ee7b7", perkDesc:"Refined. Ancient. The odds remain aggressively modern." },
  { id:"gilded",    name:"Gilded Hall",      price:18000, from:"#1a0e00", to:"#0a0500", border:"#fbbf24", perkDesc:"Gold everywhere. Even the losses feel expensive." },
  { id:"nebula",    name:"Nebula",           price:25000, from:"#08041a", to:"#020108", border:"#818cf8", perkDesc:"A table floating somewhere between Andromeda and a bad beat." },
];

const CHIP_SETS = [
  { id:"classic",   name:"Casino Classic",  price:0,    perkDesc:"Red, blue, purple. The OGs. You know what they're worth.", chipColors:{1:["#2d5a1b","#5cb85c"],5:["#7b241c","#e74c3c"],10:["#1a5276","#5dade2"],25:["#6c3483","#a569bd"],100:["#2c3e50","#1abc9c"],1000:["#1a0e00","#f1c40f"],10000:["#0a0010","#e040fb"]} },
  { id:"gold",      name:"All Gold",        price:2500,  perkDesc:"When you want to flex even before you've won anything.", chipColors:{1:["#5a4a00","#c8a800"],5:["#7b5800","#f1c40f"],10:["#7b5800","#f39c12"],25:["#7b5800","#e67e22"],100:["#7b5800","#d4a017"],1000:["#3a2800","#ffe566"],10000:["#1a1000","#fff0a0"]} },
  { id:"neon",      name:"Neon Nights",     price:3500,  perkDesc:"Glows in the dark. Your losses will be beautifully lit.", chipColors:{1:["#0d0d0d","#00ff44"],5:["#0d0d0d","#ff0080"],10:["#0d0d0d","#00ffff"],25:["#0d0d0d","#80ff00"],100:["#0d0d0d","#ff8000"],1000:["#0d0d0d","#ffffff"],10000:["#0d0d0d","#ffff00"]} },
  { id:"platinum",  name:"Platinum VIP",    price:5500,  perkDesc:"Understated. Immaculate. The chips of someone who tips well.", chipColors:{1:["#1a1a1a","#aaaaaa"],5:["#3d3d3d","#c0c0c0"],10:["#2a2a2a","#e8e8e8"],25:["#1a1a1a","#f0f0f0"],100:["#0d0d0d","#ffffff"],1000:["#1a1000","#ffd700"],10000:["#0a0820","#c084fc"]} },
  { id:"rose",      name:"Rose & Cream",    price:2500,  perkDesc:"Dainty? Maybe. But watch how fast they disappear from your stack.", chipColors:{1:["#5a1a2a","#f9a8d4"],5:["#4a0e1a","#fb7185"],10:["#3a0a14","#fda4af"],25:["#2a0608","#e11d48"],100:["#1a0204","#be123c"],1000:["#1a0010","#f0abfc"],10000:["#0a0008","#e879f9"]} },
  { id:"arctic",    name:"Arctic Ice",      price:4000,  perkDesc:"Cool to the touch. Cold-blooded at the table.", chipColors:{1:["#061828","#bae6fd"],5:["#04101e","#7dd3fc"],10:["#030c18","#38bdf8"],25:["#020810","#0ea5e9"],100:["#010406","#0284c7"],1000:["#001020","#f0f9ff"],10000:["#000810","#ffd700"]} },
  { id:"jade",      name:"Jade Dynasty",    price:5000,  perkDesc:"Ancient wisdom. Timeless losses. Beautiful chips though.", chipColors:{1:["#042810","#6ee7b7"],5:["#031c0a","#34d399"],10:["#021206","#10b981"],25:["#010a04","#059669"],100:["#000602","#047857"],1000:["#001a08","#ffd700"],10000:["#000e04","#f0c0ff"]} },
  { id:"fire",      name:"Fire & Ash",      price:6500,  perkDesc:"For the player who bets with their gut. And occasionally their entire bankroll.", chipColors:{1:["#1a0500","#fed7aa"],5:["#2a0800","#fb923c"],10:["#280600","#f97316"],25:["#200400","#ea580c"],100:["#180200","#c2410c"],1000:["#0a0000","#fbbf24"],10000:["#050000","#ffffff"]} },
  { id:"cosmic",    name:"Cosmic Drift",    price:7500,  perkDesc:"Space-themed. The house edge is still very much earthbound.", chipColors:{1:["#0d0520","#c4b5fd"],5:["#0a0318","#a78bfa"],10:["#080210","#8b5cf6"],25:["#050110","#7c3aed"],100:["#030008","#6d28d9"],1000:["#010004","#f0abfc"],10000:["#000002","#fbbf24"]} },
  { id:"onyx",      name:"Onyx & Silver",   price:9000, perkDesc:"Matte black body. Silver rim. The tuxedo of chip sets.", chipColors:{1:["#0a0a0a","#94a3b8"],5:["#080808","#64748b"],10:["#060606","#475569"],25:["#040404","#334155"],100:["#020202","#1e293b"],1000:["#0a0a00","#fbbf24"],10000:["#050508","#e040fb"]} },
  { id:"inferno",   name:"Inferno Stack",   price:12000, perkDesc:"They practically burn a hole in your pocket. Spend them first.", chipColors:{1:["#1a0000","#fca5a5"],5:["#1a0200","#f87171"],10:["#180000","#ef4444"],25:["#140000","#dc2626"],100:["#100000","#b91c1c"],1000:["#080000","#fbbf24"],10000:["#040000","#ffffff"]} },
  { id:"celestial", name:"Celestial Set",   price:16000, perkDesc:"Forged in starlight. Wagered in desperation. Same as always.", chipColors:{1:["#050510","#e0e7ff"],5:["#040410","#c7d2fe"],10:["#030310","#a5b4fc"],25:["#02020e","#818cf8"],100:["#01010c","#6366f1"],1000:["#010008","#fbbf24"],10000:["#000004","#f0abfc"]} },
];

// achievements
const ACHIEVEMENTS = [
  { id:"first_win",   name:"First Blood",     desc:"Win your first hand",         icon:"🩸", condition:s=>s.wins>=1 },
  { id:"high_roller", name:"High Roller",     desc:"Place a $100 bet",            icon:"💰", condition:s=>s.maxBet>=100 },
  { id:"blackjack",   name:"Natural!",        desc:"Hit a Blackjack",             icon:"⚡", condition:s=>s.blackjacks>=1 },
  { id:"win5",        name:"On a Roll",       desc:"Win 5 hands",                 icon:"🎲", condition:s=>s.wins>=5 },
  { id:"win25",       name:"Seasoned Player", desc:"Win 25 hands",                icon:"🏅", condition:s=>s.wins>=25 },
  { id:"win100",      name:"Casino Veteran",  desc:"Win 100 hands",               icon:"🎖️", condition:s=>s.wins>=100 },
  { id:"streak3",     name:"Hot Streak",      desc:"Win 3 in a row",              icon:"🔥", condition:s=>s.bestStreak>=3 },
  { id:"streak5",     name:"Unstoppable",     desc:"Win 5 in a row",              icon:"💥", condition:s=>s.bestStreak>=5 },
  { id:"rich",        name:"Loaded",          desc:"Accumulate $5,000",           icon:"🤑", condition:s=>s.maxChips>=5000 },
  { id:"shopper",     name:"Window Shopping", desc:"Buy your first item",         icon:"🛍️", condition:s=>s.purchases>=1 },
  { id:"collector",   name:"Collector",       desc:"Buy 5 store items",           icon:"💎", condition:s=>s.purchases>=5 },
  { id:"daily",       name:"Daily Devotion",  desc:"Claim your daily bonus",      icon:"📅", condition:s=>s.dailyClaims>=1 },
  { id:"double",      name:"Go Big",          desc:"Win a doubled-down hand",     icon:"✌️", condition:s=>s.doubleWins>=1 },
  { id:"comeback",    name:"Comeback Kid",    desc:"Win after going below $100",  icon:"💪", condition:s=>s.comeback },
];

// config
const DAILY_BONUS = 250;
const SAVE_KEY = "royalBJ_save_v5";

// helpers
function createDeck() { return SUITS.flatMap(s=>VALUES.map(v=>({suit:s,value:v}))).sort(()=>Math.random()-0.5); }
function cardNum(c) { if(["J","Q","K"].includes(c.value)) return 10; if(c.value==="A") return 11; return parseInt(c.value); }
function handTotal(h) { let t=h.reduce((s,c)=>s+cardNum(c),0),a=h.filter(c=>c.value==="A").length; while(t>21&&a-->0)t-=10; return t; }
function freshDeck() { return [...createDeck(),...createDeck(),...createDeck()]; }
function todayStr()  { return new Date().toDateString(); }

// basic strategy hint for Madame Leota
function getHint(playerHand, dealerUp) {
  const total=handTotal(playerHand), dv=cardNum(dealerUp), soft=playerHand.some(c=>c.value==="A")&&playerHand.length===2;
  if(total>=17) return {action:"STAND",reason:"Strong hand"};
  if(total<=8)  return {action:"HIT",  reason:"Too low to stand"};
  if(soft) return total>=19?{action:"STAND",reason:"Soft 19+ is strong"}:{action:"HIT",reason:"Soft hand"};
  if(total===16&&dv>=7) return {action:"HIT",  reason:"Dealer is strong"};
  if(total>=13&&dv<=6)  return {action:"STAND",reason:"Let dealer bust"};
  if(total>=12&&dv<=6)  return {action:"STAND",reason:"Dealer may bust"};
  return {action:"HIT",reason:"Dealer is strong"};
}

// dealer SVG portrait
function DealerPortrait({ dealerId, mood="idle" }) {
  const d = DEALERS.find(x=>x.id===dealerId)||DEALERS[0];
  const W=220, H=240;
  const cx=W/2;

  
  const headCY = 88, headRX = 46, headRY = 52;
  const eyeY   = headCY - 8;
  const eyeLX  = cx - 17, eyeRX2 = cx + 17;
  const mouthY = headCY + 22;
  const noseY  = headCY + 8;

  
  const M = {
    idle:      { eyeH:7,  browY:0,   mouthW:12, mouthC:3,   blush:0,    shake:false, bob:false,  glow:false,  pupilX:0,   teethShow:false },
    deal:      { eyeH:7,  browY:3,   mouthW:13, mouthC:4,   blush:0,    shake:false, bob:true,   glow:false,  pupilX:-2,  teethShow:false },
    thinking:  { eyeH:5,  browY:1,   mouthW:9,  mouthC:1,   blush:0,    shake:false, bob:false,  glow:false,  pupilX:5,   teethShow:false },
    win:       { eyeH:9,  browY:5,   mouthW:16, mouthC:9,   blush:0.18, shake:false, bob:true,   glow:true,   pupilX:0,   teethShow:true  },
    lose:      { eyeH:5,  browY:-4,  mouthW:12, mouthC:-6,  blush:0,    shake:false, bob:false,  glow:false,  pupilX:0,   teethShow:false },
    bust:      { eyeH:10, browY:-7,  mouthW:14, mouthC:-10, blush:0,    shake:true,  bob:false,  glow:false,  pupilX:0,   teethShow:false },
    blackjack: { eyeH:11, browY:8,   mouthW:18, mouthC:14,  blush:0.28, shake:false, bob:true,   glow:true,   pupilX:0,   teethShow:true  },
    shocked:   { eyeH:12, browY:10,  mouthW:10, mouthC:-3,  blush:0.1,  shake:true,  bob:false,  glow:false,  pupilX:0,   teethShow:false },
    laugh:     { eyeH:3,  browY:4,   mouthW:17, mouthC:15,  blush:0.3,  shake:false, bob:true,   glow:true,   pupilX:0,   teethShow:true  },
  };
  const m = M[mood] || M.idle;

  const anim = m.bob ? "dealerBob 0.45s ease-in-out infinite alternate"
             : m.shake ? "dealerShake 0.35s ease-in-out 2"
             : "dealerIdle 4s ease-in-out infinite";

  
  const HAIR = {
    victoria: `M ${cx-headRX*1.08},${headCY} Q ${cx-headRX*0.9},${headCY-headRY*1.5} ${cx},${headCY-headRY*1.15} Q ${cx+headRX*0.9},${headCY-headRY*1.5} ${cx+headRX*1.08},${headCY} Q ${cx+headRX},${headCY+headRY*0.6} ${cx+headRX*0.6},${headCY+headRY*1.3} Q ${cx},${headCY+headRY*1.6} ${cx-headRX*0.6},${headCY+headRY*1.3} Q ${cx-headRX},${headCY+headRY*0.6} Z`,
    max:      `M ${cx-headRX*1.05},${headCY-10} Q ${cx},${headCY-headRY*1.25} ${cx+headRX*1.05},${headCY-10} L ${cx+headRX*0.95},${headCY+5} Q ${cx},${headCY-5} ${cx-headRX*0.95},${headCY+5} Z`,
    luna:     `M ${cx-headRX*1.1},${headCY+5} Q ${cx-headRX*0.8},${headCY-headRY*1.6} ${cx},${headCY-headRY*1.2} Q ${cx+headRX*0.8},${headCY-headRY*1.6} ${cx+headRX*1.1},${headCY+5} Q ${cx+headRX*0.8},${headCY+headRY*0.9} ${cx+headRX*0.5},${headCY+headRY*1.8} Q ${cx},${headCY+headRY*2.1} ${cx-headRX*0.5},${headCY+headRY*1.8} Q ${cx-headRX*0.8},${headCY+headRY*0.9} Z`,
    rex:      null,
    nova:     `M ${cx-headRX*1.05},${headCY-5} Q ${cx-headRX*0.5},${headCY-headRY*1.35} ${cx},${headCY-headRY*1.15} Q ${cx+headRX*0.5},${headCY-headRY*1.35} ${cx+headRX*1.05},${headCY-5} L ${cx+headRX*0.88},${headCY+12} Q ${cx},${headCY+4} ${cx-headRX*0.88},${headCY+12} Z`,
    koda:     null,
  };

  const mouthPath = m.mouthC >= 0
    ? `M ${cx-m.mouthW},${mouthY} Q ${cx},${mouthY+m.mouthC} ${cx+m.mouthW},${mouthY}`
    : `M ${cx-m.mouthW},${mouthY+Math.abs(m.mouthC)*0.4} Q ${cx},${mouthY+m.mouthC} ${cx+m.mouthW},${mouthY+Math.abs(m.mouthC)*0.4}`;

  return (
    <div style={{animation:anim, display:"inline-block", filter: m.glow?`drop-shadow(0 0 16px ${d.accentColor}) drop-shadow(0 0 6px ${d.accentColor})`:"none", transition:"filter 0.5s ease"}}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} overflow="visible">
        <defs>
          <radialGradient id={`skin_${dealerId}`} cx="40%" cy="30%" r="70%">
            <stop offset="0%" stopColor={d.skinTone}/>
            <stop offset="100%" stopColor={d.skinTone} stopOpacity="0.88"/>
          </radialGradient>
          <radialGradient id={`ambg_${dealerId}`} cx="50%" cy="70%" r="55%">
            <stop offset="0%" stopColor={d.accentColor} stopOpacity="0.2"/>
            <stop offset="100%" stopColor="transparent"/>
          </radialGradient>
        </defs>

        
        <ellipse cx={cx} cy={H*0.75} rx={W*0.45} ry={H*0.35} fill={`url(#ambg_${dealerId})`}/>

        
        <path d={`M ${cx-70},${H} L ${cx-65},${headCY+headRY+30} Q ${cx-45},${headCY+headRY+14} ${cx-18},${headCY+headRY+8} L ${cx+18},${headCY+headRY+8} Q ${cx+45},${headCY+headRY+14} ${cx+65},${headCY+headRY+30} L ${cx+70},${H} Z`} fill={d.outfitColor}/>

        
        {dealerId==="victoria" && <>
          <path d={`M ${cx-45},${headCY+headRY+14} L ${cx-8},${headCY+headRY+40} L ${cx},${headCY+headRY+18}`} fill={d.outfitColor} stroke="#c9a84c33" strokeWidth="1"/>
          <path d={`M ${cx+45},${headCY+headRY+14} L ${cx+8},${headCY+headRY+40} L ${cx},${headCY+headRY+18}`} fill={d.outfitColor} stroke="#c9a84c33" strokeWidth="1"/>
          <path d={`M ${cx-8},${headCY+headRY+18} L ${cx},${headCY+headRY+14} L ${cx+8},${headCY+headRY+18} L ${cx+7},${headCY+headRY+55} L ${cx},${headCY+headRY+68} L ${cx-7},${headCY+headRY+55} Z`} fill="#c9a84c" opacity="0.85"/>
        </>}
        {dealerId==="max" && <>
          <rect x={cx-18} y={headCY+headRY+6} width={36} height={22} rx={11} fill="#333"/>
          <path d={`M ${cx-40},${headCY+headRY+20} L ${cx-14},${headCY+headRY+90} L ${cx+14},${headCY+headRY+90} L ${cx+40},${headCY+headRY+20}`} fill={d.outfitColor}/>
        </>}
        {dealerId==="luna" && <>
          {[{x:cx-28,y:headCY+headRY+30},{x:cx+22,y:headCY+headRY+22},{x:cx-10,y:headCY+headRY+65},{x:cx+35,y:headCY+headRY+58}].map((p2,i)=>(
            <text key={i} x={p2.x} y={p2.y} fontSize="11" fill="#c084fc" opacity="0.65">✦</text>
          ))}
          <path d={`M ${cx-50},${headCY+headRY+14} Q ${cx-60},${headCY+headRY+50} ${cx-40},${H}`} fill={d.outfitColor} stroke="#c084fc" strokeWidth="1" opacity="0.6"/>
          <path d={`M ${cx+50},${headCY+headRY+14} Q ${cx+60},${headCY+headRY+50} ${cx+40},${H}`} fill={d.outfitColor} stroke="#c084fc" strokeWidth="1" opacity="0.6"/>
        </>}
        {dealerId==="rex" && <>
          <path d={`M ${cx-42},${headCY+headRY+14} L ${cx-38},${headCY+headRY+80} L ${cx+38},${headCY+headRY+80} L ${cx+42},${headCY+headRY+14}`} fill="#8b2020"/>
          <path d={`M ${cx-10},${headCY+headRY+14} L ${cx},${headCY+headRY+10} L ${cx+10},${headCY+headRY+14} L ${cx+8},${headCY+headRY+32} L ${cx},${headCY+headRY+38} L ${cx-8},${headCY+headRY+32} Z`} fill="#c9a84c"/>
        </>}
        {dealerId==="nova" && <>
          <path d={`M ${cx-14},${headCY+headRY+14} L ${cx-4},${headCY+headRY+32} L ${cx},${headCY+headRY+20}`} fill="white" opacity="0.75"/>
          <path d={`M ${cx+14},${headCY+headRY+14} L ${cx+4},${headCY+headRY+32} L ${cx},${headCY+headRY+20}`} fill="white" opacity="0.75"/>
          <rect x={cx+8} y={headCY+headRY+42} width={34} height={20} rx={3} fill="white" opacity="0.65"/>
          <text x={cx+25} y={headCY+headRY+56} fontSize="7" textAnchor="middle" fill={d.outfitColor} fontWeight="bold">NOVA</text>
        </>}

        
        {dealerId==="koda" ? (
          <g>
            
            <ellipse cx={cx} cy={H*0.82} rx={62} ry={48} fill="#d4a574"/>
            <ellipse cx={cx} cy={H*0.82} rx={50} ry={38} fill="#f8f4f0"/>
            
            <ellipse cx={cx-30} cy={H-18} rx={16} ry={10} fill="#d4a574"/>
            <ellipse cx={cx+30} cy={H-18} rx={16} ry={10} fill="#d4a574"/>
            <ellipse cx={cx-30} cy={H-14} rx={13} ry={7} fill="#f8f4f0"/>
            <ellipse cx={cx+30} cy={H-14} rx={13} ry={7} fill="#f8f4f0"/>
            
            <rect x={cx-24} y={headCY+headRY-4} width={48} height={28} rx={8} fill="#f8f4f0"/>
            
            <path d={`M ${cx-headRX*0.68},${headCY-headRY*0.48} L ${cx-headRX*1.08},${headCY-headRY*1.65} L ${cx-headRX*0.22},${headCY-headRY*0.88} Z`} fill="#c8956a"/>
            <path d={`M ${cx+headRX*0.68},${headCY-headRY*0.48} L ${cx+headRX*1.08},${headCY-headRY*1.65} L ${cx+headRX*0.22},${headCY-headRY*0.88} Z`} fill="#c8956a"/>
            
            <path d={`M ${cx-headRX*0.64},${headCY-headRY*0.52} L ${cx-headRX*0.96},${headCY-headRY*1.46} L ${cx-headRX*0.26},${headCY-headRY*0.88} Z`} fill="#e8a0a0" opacity="0.7"/>
            <path d={`M ${cx+headRX*0.64},${headCY-headRY*0.52} L ${cx+headRX*0.96},${headCY-headRY*1.46} L ${cx+headRX*0.26},${headCY-headRY*0.88} Z`} fill="#e8a0a0" opacity="0.7"/>
            
            <ellipse cx={cx} cy={headCY} rx={headRX} ry={headRY} fill="#c8956a"/>
            
            <path d={`
              M ${cx},${headCY-headRY*0.06}
              Q ${cx+headRX*0.65},${headCY-headRY*0.12} ${cx+headRX*0.82},${headCY+6}
              Q ${cx+headRX*0.72},${headCY+headRY*0.55} ${cx+headRX*0.62},${headCY+headRY*0.88}
              Q ${cx+headRX*0.34},${headCY+headRY*1.04} ${cx},${headCY+headRY*1.02}
              Q ${cx-headRX*0.34},${headCY+headRY*1.04} ${cx-headRX*0.62},${headCY+headRY*0.88}
              Q ${cx-headRX*0.72},${headCY+headRY*0.55} ${cx-headRX*0.82},${headCY+6}
              Q ${cx-headRX*0.65},${headCY-headRY*0.12} ${cx},${headCY-headRY*0.06}
              Z`} fill="#f8f4f0"/>
            
            <path d={`M ${cx-14},${headCY-headRY*0.05} Q ${cx},${headCY-headRY*0.5} ${cx+14},${headCY-headRY*0.05}`} fill="#c8956a" opacity="0.6"/>
            
            <ellipse cx={cx} cy={headCY+headRY*0.55} rx={22} ry={16} fill="#f8f4f0"/>
            
            <ellipse cx={cx} cy={headCY+headRY*0.32} rx={11} ry={8} fill="#1a0800"/>
            <ellipse cx={cx-3} cy={headCY+headRY*0.28} rx={3.5} ry={2.5} fill="rgba(255,255,255,0.35)"/>
            
            <ellipse cx={eyeLX}  cy={eyeY-2} rx={9} ry={Math.min(m.eyeH,9)} fill="#1a0800"/>
            <ellipse cx={eyeRX2} cy={eyeY-2} rx={9} ry={Math.min(m.eyeH,9)} fill="#1a0800"/>
            <circle cx={eyeLX-2.5}  cy={eyeY-4} r={2.5} fill="white" opacity="0.7"/>
            <circle cx={eyeRX2-2.5} cy={eyeY-4} r={2.5} fill="white" opacity="0.7"/>
            
            <ellipse cx={eyeLX}  cy={eyeY-m.eyeH-6-m.browY*0.5} rx={6} ry={3} fill="#f8f4f0" opacity="0.9"/>
            <ellipse cx={eyeRX2} cy={eyeY-m.eyeH-6-m.browY*0.5} rx={6} ry={3} fill="#f8f4f0" opacity="0.9"/>
            
            {m.mouthC >= 4 ? (
              <g>
                <path d={`M ${cx-18},${headCY+headRY*0.62} Q ${cx},${headCY+headRY*0.62+m.mouthC*0.6} ${cx+18},${headCY+headRY*0.62}`} fill="none" stroke="#1a0800" strokeWidth="2.5" strokeLinecap="round"/>
                <path d={`M ${cx-14},${headCY+headRY*0.64} Q ${cx},${headCY+headRY*0.64+m.mouthC*0.55} ${cx+14},${headCY+headRY*0.64}`} fill="white" opacity="0.9"/>
                
                <ellipse cx={cx} cy={headCY+headRY*0.75+m.mouthC*0.3} rx={10} ry={7} fill="#e05070" opacity="0.9"/>
                <path d={`M ${cx-10},${headCY+headRY*0.75+m.mouthC*0.3} Q ${cx},${headCY+headRY*0.8+m.mouthC*0.35} ${cx+10},${headCY+headRY*0.75+m.mouthC*0.3}`} fill="none" stroke="#c03050" strokeWidth="1.5" opacity="0.6"/>
              </g>
            ) : (
              <path d={`M ${cx-14},${headCY+headRY*0.62} Q ${cx},${headCY+headRY*0.62+m.mouthC*0.5} ${cx+14},${headCY+headRY*0.62}`} fill="none" stroke="#1a0800" strokeWidth="2.5" strokeLinecap="round"/>
            )}
            
            {m.blush>0&&<>
              <ellipse cx={eyeLX-4}  cy={eyeY+12} rx={11} ry={6} fill="#ff8fa3" opacity={m.blush}/>
              <ellipse cx={eyeRX2+4} cy={eyeY+12} rx={11} ry={6} fill="#ff8fa3" opacity={m.blush}/>
            </>}
            
            {mood==="blackjack"&&[0,1,2].map(ii=>(
              <text key={ii} x={cx+(ii-1)*40} y={headCY-headRY-18-ii*8} fontSize="16" textAnchor="middle"
                fill={["#fb923c","#fbbf24","#fb923c"][ii]}
                style={{animation:`starPop 0.6s ${ii*0.15}s ease-out both`}}>🐾</text>
            ))}
            {mood==="win"&&<>
              <text x={cx-52} y={headCY-headRY-8} fontSize="18" style={{animation:"floatLeft 1s ease-out both"}}>🦴</text>
              <text x={cx+38} y={headCY-headRY-4} fontSize="16" style={{animation:"floatRight 1.1s ease-out both"}}>🐾</text>
            </>}
            {mood==="bust"&&<text x={cx} y={headCY-headRY-20} fontSize="16" textAnchor="middle" style={{animation:"popIn 0.25s ease-out"}}>😤</text>}
            {mood==="shocked"&&<text x={cx+headRX+6} y={headCY-8} fontSize="20" style={{animation:"popIn 0.2s ease-out"}}>!</text>}
            {mood==="laugh"&&<text x={cx-headRX-22} y={headCY+5} fontSize="16" style={{animation:"floatLeft 0.9s ease-out both"}}>😂</text>}
            {mood==="thinking"&&<text x={cx+headRX+4} y={headCY-headRY+20} fontSize="14" opacity="0.7" style={{animation:"popIn 0.3s ease-out"}}>...</text>}
          </g>
        ) : (
          <>
        
        <rect x={cx-11} y={headCY+headRY-6} width={22} height={26} rx={6} fill={`url(#skin_${dealerId})`}/>

        
        {HAIR[dealerId] && <path d={HAIR[dealerId]} fill={d.hairColor}/>}

        
        <ellipse cx={cx} cy={headCY} rx={headRX} ry={headRY} fill={`url(#skin_${dealerId})`}/>

        
        <ellipse cx={cx-headRX+2} cy={headCY+4} rx={8} ry={11} fill={d.skinTone}/>
        <ellipse cx={cx+headRX-2} cy={headCY+4} rx={8} ry={11} fill={d.skinTone}/>

        
        {dealerId!=="max" && <>
          <path d={`M ${eyeLX-11},${eyeY-m.eyeH-8-m.browY} Q ${eyeLX},${eyeY-m.eyeH-12-m.browY} ${eyeLX+11},${eyeY-m.eyeH-8-m.browY}`} fill="none" stroke={d.hairColor} strokeWidth="3.5" strokeLinecap="round"/>
          <path d={`M ${eyeRX2-11},${eyeY-m.eyeH-8-m.browY} Q ${eyeRX2},${eyeY-m.eyeH-12-m.browY} ${eyeRX2+11},${eyeY-m.eyeH-8-m.browY}`} fill="none" stroke={d.hairColor} strokeWidth="3.5" strokeLinecap="round"/>
        </>}

        
        {dealerId==="max" ? <>
          
          <rect x={eyeLX-13} y={eyeY-8} width={24} height={16} rx={4} fill="#111" stroke="#555" strokeWidth="1.2"/>
          <rect x={eyeRX2-11} y={eyeY-8} width={24} height={16} rx={4} fill="#111" stroke="#555" strokeWidth="1.2"/>
          <line x1={eyeLX+11} y1={eyeY} x2={eyeRX2-11} y2={eyeY} stroke="#555" strokeWidth="1.5"/>
          <line x1={eyeLX-13} y1={eyeY-2} x2={eyeLX-20} y2={eyeY-1} stroke="#555" strokeWidth="1.5"/>
          <line x1={eyeRX2+13} y1={eyeY-2} x2={eyeRX2+20} y2={eyeY-1} stroke="#555" strokeWidth="1.5"/>
        </> : <>
          
          <ellipse cx={eyeLX}  cy={eyeY} rx={10} ry={m.eyeH} fill="white"/>
          <ellipse cx={eyeRX2} cy={eyeY} rx={10} ry={m.eyeH} fill="white"/>
          
          {[eyeLX, eyeRX2].map((ex,i) => {
            const irisColor = dealerId==="luna"?"#7c3aed":dealerId==="nova"?"#2563eb":"#3d2010";
            const ry2 = Math.min(m.eyeH*0.85, 8);
            return <g key={i}>
              <ellipse cx={ex+m.pupilX} cy={eyeY} rx={7} ry={ry2} fill={irisColor}/>
              <ellipse cx={ex+m.pupilX} cy={eyeY} rx={4} ry={Math.min(ry2*0.65,5)} fill="#111"/>
              <circle  cx={ex+m.pupilX-2.5} cy={eyeY-2.5} r={2} fill="white" opacity="0.8"/>
            </g>;
          })}
          
          {[eyeLX, eyeRX2].map((ex,i)=>(
            <path key={i} d={`M ${ex-10},${eyeY-m.eyeH} Q ${ex},${eyeY-m.eyeH-4} ${ex+10},${eyeY-m.eyeH}`} fill="none" stroke={d.hairColor} strokeWidth="2.8" strokeLinecap="round"/>
          ))}
        </>}

        
        {m.blush>0&&<>
          <ellipse cx={eyeLX-6}  cy={eyeY+16} rx={13} ry={7} fill="#ff8fa3" opacity={m.blush}/>
          <ellipse cx={eyeRX2+6} cy={eyeY+16} rx={13} ry={7} fill="#ff8fa3" opacity={m.blush}/>
        </>}

        
        <path d={`M ${cx},${noseY-2} Q ${cx+6},${noseY+6} ${cx+8},${noseY+10}`} fill="none" stroke={d.skinTone==="f0c080"?"#c8804a":"#b07040"} strokeWidth="2.2" strokeLinecap="round" opacity="0.5"/>

        
        {m.teethShow && <path d={`M ${cx-m.mouthW+2},${mouthY+1} Q ${cx},${mouthY+m.mouthC*0.6} ${cx+m.mouthW-2},${mouthY+1}`} fill="white" opacity="0.9"/>}

        
        <path d={mouthPath} fill="none" stroke={d.lipColor} strokeWidth="3.5" strokeLinecap="round"/>
        <path d={`M ${cx-m.mouthW*0.55},${mouthY+(m.mouthC>0?m.mouthC*0.75:0)} Q ${cx},${mouthY+(m.mouthC>0?m.mouthC*1.05:m.mouthC*0.55)} ${cx+m.mouthW*0.55},${mouthY+(m.mouthC>0?m.mouthC*0.75:0)}`} fill="none" stroke={d.lipColor} strokeWidth="1.8" strokeLinecap="round" opacity="0.45"/>

        
        {dealerId==="luna" && <>
          <path d={`M ${cx-6},${headCY-headRY+2} Q ${cx-18},${headCY-headRY-22} ${cx},${headCY-headRY-14} Q ${cx-12},${headCY-headRY+2} ${cx-6},${headCY-headRY+2}`} fill="#c084fc"/>
          <circle cx={cx+8} cy={headCY-headRY-8} r={5} fill="#ffd700"/>
          <circle cx={cx+18} cy={headCY-headRY+2} r={3} fill="#ffd700" opacity="0.7"/>
          {["#c084fc","#ffd700","#60a5fa"].map((clr,i)=>(
            <circle key={i} cx={cx+(i-1)*32} cy={headCY-headRY-30-i*6} r={3.5} fill={clr} opacity="0.7"
              style={{animation:`lunaFloat ${1.8+i*0.4}s ${i*0.5}s ease-in-out infinite alternate`}}/>
          ))}
        </>}
        {dealerId==="rex" && <>
          <rect x={cx-36} y={headCY-headRY-52} width={72} height={56} rx={3} fill="#111"/>
          <rect x={cx-44} y={headCY-headRY-3}  width={88} height={12} rx={2} fill="#1e1008"/>
          <rect x={cx-34} y={headCY-headRY-52} width={68} height={7}  fill="#c9a84c" opacity="0.75"/>
          
          <circle cx={eyeRX2} cy={eyeY} r={15} fill="none" stroke="#c9a84c" strokeWidth="2" opacity="0.75"/>
          <line x1={eyeRX2+14} y1={eyeY+10} x2={eyeRX2+22} y2={eyeY+28} stroke="#c9a84c" strokeWidth="1.5" opacity="0.65"/>
        </>}

        
        {mood==="blackjack"&&[0,1,2,3].map(i=>(
          <text key={i} x={cx+(i-1.5)*36} y={headCY-headRY-20-i*10} fontSize="14" textAnchor="middle"
            fill={["#f1c40f","#c9a84c","#ffd700","#ffe066"][i]}
            style={{animation:`starPop 0.6s ${i*0.12}s ease-out both`}}>✦</text>
        ))}
        {mood==="win"&&<>
          <text x={cx-55} y={headCY-headRY-10} fontSize="18" style={{animation:"floatLeft 1s ease-out both"}}>🎉</text>
          <text x={cx+42} y={headCY-headRY-5}  fontSize="16" style={{animation:"floatRight 1.1s ease-out both"}}>💰</text>
        </>}
        {mood==="bust"&&<text x={cx} y={headCY-headRY-22} fontSize="16" textAnchor="middle" style={{animation:"popIn 0.25s ease-out"}}>💥</text>}
        {mood==="shocked"&&<text x={cx+headRX+5} y={headCY-10} fontSize="20" style={{animation:"popIn 0.2s ease-out"}}>!</text>}
        {mood==="laugh"&&<text x={cx-headRX-20} y={headCY+5} fontSize="16" style={{animation:"floatLeft 0.9s ease-out both"}}>😄</text>}
        {mood==="thinking"&&<text x={cx+headRX+4} y={headCY-headRY+20} fontSize="14" opacity="0.7" style={{animation:"popIn 0.3s ease-out"}}>...</text>}
          </>
        )}
      </svg>
    </div>
  );
}

// jazz engine
const JAZZ_CHORDS = [
  [["D",3],["F",3],["A",3],["C",4]],
  [["G",3],["B",3],["D",4],["F",4]],
  [["C",3],["E",3],["G",3],["B",3]],
  [["A",3],["C",4],["E",4],["G",4]],
];
const JAZZ_BASS = [
  [["D",2],["E",2],["F",2],["A",2]],
  [["G",2],["A",2],["B",2],["D",3]],
  [["C",2],["D",2],["E",2],["G",2]],
  [["A",2],["B",2],["C",3],["E",3]],
];
const JAZZ_MELODY = [
  [["A",4],["C",5],["D",5],["F",5],["E",5],["D",5],["C",5],["A",4]],
  [["D",5],["C",5],["A",4],["G",4],["A",4],["C",5],["D",5],["F",5]],
  [["F",5],["E",5],["D",5],["C",5],["D",5],["E",5],["G",5],["F",5]],
  [["G",4],["A",4],["B",4],["D",5],["C",5],["A",4],["G",4],["E",4]],
];

function noteFreq(note, octave) {
  const map = {C:0,"C#":1,D:2,"D#":3,E:4,F:5,"F#":6,G:7,"G#":8,A:9,"A#":10,B:11};
  return 440 * Math.pow(2, (map[note] + (octave - 4) * 12 - 9) / 12);
}

function useJazz() {
  const actx   = useRef(null);
  const masterG = useRef(null);
  const playing = useRef(false);
  const beatNum = useRef(0);
  const timerId = useRef(null);

  function getCtx() {
    if (!actx.current) {
      actx.current = new (window.AudioContext || window.webkitAudioContext)();
      masterG.current = actx.current.createGain();
      masterG.current.gain.value = 0.15;
      masterG.current.connect(actx.current.destination);
    }
    return actx.current;
  }

  function playNote(freq, startTime, duration, shape, vol, ac, dest) {
    const osc = ac.createOscillator();
    const gain = ac.createGain();
    osc.connect(gain);
    gain.connect(dest);
    osc.type = shape;
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0, startTime);
    gain.gain.linearRampToValueAtTime(vol, startTime + 0.025);
    gain.gain.setValueAtTime(vol, startTime + duration * 0.7);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
    osc.start(startTime);
    osc.stop(startTime + duration + 0.05);
  }

  function playNoise(startTime, duration, vol, ac, dest) {
    const bufLen = Math.floor(ac.sampleRate * duration);
    const buf = ac.createBuffer(1, bufLen, ac.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < bufLen; i++) data[i] = Math.random() * 2 - 1;
    const src = ac.createBufferSource();
    const gain = ac.createGain();
    src.buffer = buf;
    src.connect(gain);
    gain.connect(dest);
    gain.gain.setValueAtTime(vol, startTime);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
    src.start(startTime);
  }

  const schedule = useCallback(() => {
    if (!playing.current) return;
    try {
      const ac = getCtx();
      const now = ac.currentTime;
      const bpm = 136;
      const beat = 60 / bpm;
      const bar = beat * 4;
      const ci = beatNum.current % 4;
      const dest = masterG.current;

      
      [beat, beat * 3].forEach(off => {
        JAZZ_CHORDS[ci].forEach((n, i) => {
          playNote(noteFreq(n[0], n[1]), now + off + i * 0.018, beat * 0.68, "triangle", 0.09, ac, dest);
        });
      });

      
      JAZZ_BASS[ci].forEach((n, i) => {
        playNote(noteFreq(n[0], n[1]), now + beat * i, beat * 0.82, "sine", 0.3, ac, dest);
      });

      
      for (let i = 0; i < 8; i++) {
        const vol = i % 2 === 0 ? 0.2 : 0.09;
        playNoise(now + beat * i * 0.5, 0.06, vol, ac, dest);
      }

      
      [0, beat * 2].forEach(off => {
        const osc = ac.createOscillator();
        const gain = ac.createGain();
        osc.connect(gain);
        gain.connect(dest);
        osc.type = "sine";
        osc.frequency.setValueAtTime(110, now + off);
        osc.frequency.exponentialRampToValueAtTime(42, now + off + 0.14);
        gain.gain.setValueAtTime(0.42, now + off);
        gain.gain.exponentialRampToValueAtTime(0.001, now + off + 0.2);
        osc.start(now + off);
        osc.stop(now + off + 0.22);
      });

      
      [beat, beat * 3].forEach(off => {
        playNoise(now + off, 0.17, 0.26, ac, dest);
      });

      
      if (beatNum.current % 2 === 0) {
        JAZZ_MELODY[ci].forEach((n, i) => {
          const swing = i % 2 === 1 ? beat * 0.055 : 0;
          playNote(noteFreq(n[0], n[1]), now + beat * i * 0.5 + swing, beat * 0.42, "sawtooth", 0.065, ac, dest);
        });
      }

      beatNum.current++;
      timerId.current = setTimeout(schedule, bar * 1000 - 25);
    } catch (e) {}
  }, []);

  const start = useCallback(() => {
    if (playing.current) return;
    playing.current = true;
    try { getCtx().resume(); } catch (e) {}
    beatNum.current = 0;
    schedule();
  }, [schedule]);

  const stop = useCallback(() => {
    playing.current = false;
    clearTimeout(timerId.current);
  }, []);

  return { start, stop };
}

// sound effects
function useSfx() {
  const actx = useRef(null);

  function getCtx() {
    if (!actx.current) {
      actx.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    return actx.current;
  }

  return useCallback((type) => {
    try {
      const ac = getCtx();
      const dest = ac.destination;

      function beep(freq, duration, shape, vol) {
        const osc = ac.createOscillator();
        const gain = ac.createGain();
        osc.connect(gain);
        gain.connect(dest);
        osc.type = shape;
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(vol, ac.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + duration);
        osc.start();
        osc.stop(ac.currentTime + duration + 0.05);
      }

      if (type === "deal")        { beep(800, 0.1, "triangle", 0.13); }
      else if (type === "chip")   { beep(1100, 0.07, "sine", 0.1); }
      else if (type === "win")    { [523,659,784].forEach((f,i) => setTimeout(() => beep(f, 0.22, "sine", 0.15), i * 100)); }
      else if (type === "blackjack") {
        // triumphant fanfare jingle
        const now = ac.currentTime;

        function note(freq, start, dur, vol=0.18, shape="sine") {
          const o = ac.createOscillator(), g = ac.createGain();
          o.connect(g); g.connect(dest);
          o.type = shape; o.frequency.value = freq;
          g.gain.setValueAtTime(0, now + start);
          g.gain.linearRampToValueAtTime(vol, now + start + 0.02);
          g.gain.setValueAtTime(vol, now + start + dur * 0.75);
          g.gain.exponentialRampToValueAtTime(0.001, now + start + dur);
          o.start(now + start); o.stop(now + start + dur + 0.05);
        }

        // melody: ta-ta-ta TAAAA ta-ta TAAAA!
        // C4  E4  G4  C5 (pause) E5  G5  C6
        const mel = [
          [523,  0.00, 0.12],
          [659,  0.13, 0.12],
          [784,  0.26, 0.12],
          [1047, 0.38, 0.32],
          [1047, 0.72, 0.10],
          [1175, 0.84, 0.10],
          [1319, 0.96, 0.55],
        ];
        mel.forEach(([f, s, d]) => note(f, s, d, 0.2, "sine"));

        // harmony (5ths below melody, quieter)
        const harm = [
          [392,  0.00, 0.12],
          [494,  0.13, 0.12],
          [587,  0.26, 0.12],
          [784,  0.38, 0.32],
          [784,  0.72, 0.10],
          [880,  0.84, 0.10],
          [988,  0.96, 0.55],
        ];
        harm.forEach(([f, s, d]) => note(f, s, d, 0.10, "triangle"));

        // punchy bass hits on the accented beats
        [[130, 0.00], [164, 0.38], [130, 0.96]].forEach(([f, s]) => note(f, s, 0.18, 0.22, "sine"));

        // shimmer: rapid high arpeggio on the final note
        [1047,1175,1319,1568,2093].forEach((f, i) => note(f, 1.0 + i*0.055, 0.18, 0.07, "sine"));
      }
      else if (type === "lose")   { beep(280, 0.4, "sawtooth", 0.12); }
      else if (type === "bust")   { [250,180].forEach((f,i) => setTimeout(() => beep(f, 0.22, "sawtooth", 0.12), i * 140)); }
      else if (type === "achievement") { [523,587,659,784,1047].forEach((f,i) => setTimeout(() => beep(f, 0.35, "sine", 0.14), i * 90)); }
      else if (type === "daily")  { [659,784,1047].forEach((f,i) => setTimeout(() => beep(f, 0.28, "sine", 0.15), i * 110)); }
      else if (type === "hint")   { beep(880, 0.12, "sine", 0.08); }
      else if (type === "bark") {
        
        const bufSize = ac.sampleRate * 0.18;
        const buf = ac.createBuffer(1, bufSize, ac.sampleRate);
        const data = buf.getChannelData(0);
        for (let i = 0; i < bufSize; i++) {
          const env = i < bufSize * 0.05 ? i / (bufSize * 0.05) : Math.pow(1 - (i - bufSize * 0.05) / (bufSize * 0.95), 1.8);
          data[i] = (Math.random() * 2 - 1) * env * 0.55;
        }
        const src = ac.createBufferSource();
        src.buffer = buf;
        const filt = ac.createBiquadFilter();
        filt.type = "bandpass";
        filt.frequency.value = 1100;
        filt.Q.value = 0.7;
        src.connect(filt);
        filt.connect(dest);
        src.start();
        
        setTimeout(() => {
          try {
            const buf2 = ac.createBuffer(1, Math.floor(ac.sampleRate * 0.14), ac.sampleRate);
            const d2 = buf2.getChannelData(0);
            for (let i = 0; i < d2.length; i++) {
              const env2 = Math.pow(1 - i / d2.length, 1.5);
              d2[i] = (Math.random() * 2 - 1) * env2 * 0.45;
            }
            const s2 = ac.createBufferSource();
            s2.buffer = buf2;
            const f2 = ac.createBiquadFilter();
            f2.type = "bandpass";
            f2.frequency.value = 900;
            f2.Q.value = 0.8;
            s2.connect(f2);
            f2.connect(dest);
            s2.start();
          } catch(e) {}
        }, 210);
      }
    } catch (e) {}
  }, []);
}

// save state
const defaultSave=()=>({chips:10000,ownedCards:["classic"],ownedDealers:["victoria"],ownedTables:["classic"],ownedChipSets:["classic"],equippedCard:"classic",equippedDealer:"victoria",equippedTable:"classic",equippedChipSet:"classic",stats:{wins:0,losses:0,pushes:0,blackjacks:0,maxBet:0,maxChips:10000,bestStreak:0,currentStreak:0,purchases:0,dailyClaims:0,doubleWins:0,comeback:false,lowestChips:10000},achievements:[],lastDaily:null});

// card back pattern renderer
function CardBackPattern({ backId, size=68 }) {
  const b = CARD_BACKS.find(x => x.id === backId) || CARD_BACKS[0];
  const h = Math.round(size * 1.46);
  const pad = Math.round(size * 0.08);
  const uid = `cb_${backId}_${size}`;

  function pat() {
    if (b.pattern === "dots")    return (<pattern id={uid} width="8" height="8" patternUnits="userSpaceOnUse"><circle cx="4" cy="4" r="1.5" fill={b.accent} opacity="0.4"/></pattern>);
    if (b.pattern === "diamond") return (<pattern id={uid} width="10" height="10" patternUnits="userSpaceOnUse"><polygon points="5,1 9,5 5,9 1,5" fill="none" stroke={b.accent} strokeWidth="0.8" opacity="0.4"/></pattern>);
    if (b.pattern === "stars")   return (<pattern id={uid} width="12" height="12" patternUnits="userSpaceOnUse"><text x="6" y="9" textAnchor="middle" fontSize="7" fill={b.accent} opacity="0.4">✦</text></pattern>);
    if (b.pattern === "flame")   return (<pattern id={uid} width="10" height="10" patternUnits="userSpaceOnUse"><path d="M5,8 Q3,5 5,2 Q7,5 5,8Z" fill={b.accent} opacity="0.3"/></pattern>);
    if (b.pattern === "crest")   return (<pattern id={uid} width="14" height="14" patternUnits="userSpaceOnUse"><text x="7" y="11" textAnchor="middle" fontSize="10" fill={b.accent} opacity="0.3">♛</text></pattern>);
    return (<pattern id={uid} width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="8" stroke={b.accent} strokeWidth="0.8" opacity="0.25"/></pattern>);
  }

  return (
    <svg width={size} height={h} style={{borderRadius:Math.round(size*0.13),display:"block",flexShrink:0}}>
      <defs>
        <linearGradient id={`bgl_${uid}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={b.color}/>
          <stop offset="100%" stopColor={b.accent} stopOpacity="0.2"/>
        </linearGradient>
        {pat()}
      </defs>
      <rect width={size} height={h} rx={Math.round(size*0.13)} fill={`url(#bgl_${uid})`}/>
      <rect width={size} height={h} rx={Math.round(size*0.13)} fill={`url(#${uid})`}/>
      <rect x={pad} y={pad} width={size-pad*2} height={h-pad*2} rx={Math.round(size*0.07)} fill="none" stroke={b.accent} strokeWidth="1" opacity="0.3"/>
    </svg>
  );
}

// playing card
function Card({ card, hidden=false, delay=0, cardBack="classic" }) {
  const isRed = card?.suit === "♥" || card?.suit === "♦";
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVis(true), delay);
    return () => clearTimeout(t);
  }, [delay]);
  return (
    <div style={{width:62,height:91,borderRadius:8,background:hidden?"transparent":"white",border:hidden?"none":"2px solid #e0d8c8",display:"flex",flexDirection:"column",justifyContent:"space-between",padding:hidden?0:"5px 6px",boxShadow:"0 4px 14px rgba(0,0,0,0.55)",transform:vis?"translateY(0)":"translateY(-22px)",opacity:vis?1:0,transition:"transform 0.32s cubic-bezier(0.34,1.56,0.64,1),opacity 0.28s ease",flexShrink:0,overflow:"hidden"}}>
      {hidden ? (
        <CardBackPattern backId={cardBack} size={60}/>
      ) : (
        <>
          <div style={{fontSize:11,fontWeight:700,color:isRed?"#c0392b":"#1a1a2e",lineHeight:1}}>{card.value}<br/>{card.suit}</div>
          <div style={{fontSize:21,textAlign:"center",color:isRed?"#c0392b":"#1a1a2e",lineHeight:1,fontWeight:700}}>{card.suit}</div>
          <div style={{fontSize:11,fontWeight:700,color:isRed?"#c0392b":"#1a1a2e",lineHeight:1,transform:"rotate(180deg)"}}>{card.value}<br/>{card.suit}</div>
        </>
      )}
    </div>
  );
}

// hand display
function Hand({ hand, hideSecond=false, label, total, cardBack }) {
  return (
    <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:6}}>
      <div style={{fontSize:9,letterSpacing:3,color:"rgba(255,215,0,0.55)",fontFamily:"Georgia,serif"}}>{label}</div>
      <div style={{display:"flex"}}>
        {hand.map((c,i) => (
          <div key={i} style={{marginLeft:i>0?-15:0,zIndex:i}}>
            <Card card={c} hidden={hideSecond && i===1} delay={i*110} cardBack={cardBack}/>
          </div>
        ))}
      </div>
      <div style={{fontFamily:"Georgia,serif",fontSize:13,fontWeight:700,color:total>21?"#e74c3c":total===21?"#f1c40f":"white",background:"rgba(0,0,0,0.4)",padding:"2px 11px",borderRadius:18,border:`1px solid ${total>21?"#e74c3c55":"rgba(255,215,0,0.2)"}`}}>
        {total > 21 ? "BUST" : total}
      </div>
    </div>
  );
}

// chip button
function ChipBtn({ amount, onClick, disabled, chipColors }) {
  const c = (chipColors && chipColors[amount]) || ["#555","#888"];
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{width:50,height:50,borderRadius:"50%",background:`radial-gradient(circle at 35% 35%,${c[1]},${c[0]})`,border:"3px solid rgba(255,255,255,0.15)",color:"white",fontSize:11,fontWeight:700,fontFamily:"Georgia,serif",cursor:disabled?"not-allowed":"pointer",boxShadow:disabled?"none":"0 4px 10px rgba(0,0,0,0.4)",opacity:disabled?0.4:1,transition:"all 0.15s",outline:"none"}}
      onMouseEnter={e => { if (!disabled) e.currentTarget.style.transform = "scale(1.12) translateY(-2px)"; }}
      onMouseLeave={e => { if (!disabled) e.currentTarget.style.transform = "scale(1) translateY(0)"; }}
    >
      ${amount}
    </button>
  );
}

function Btn({ label, onClick, disabled, color="#c9a84c", small=false }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{padding:small?"6px 13px":"9px 19px",borderRadius:6,background:disabled?"#2a2a2a":`linear-gradient(180deg,${color},${color}bb)`,border:`1px solid ${disabled?"#333":color}`,color:disabled?"#555":"#1a0a00",fontFamily:"Georgia,serif",fontSize:small?10:12,fontWeight:700,letterSpacing:1,cursor:disabled?"not-allowed":"pointer",boxShadow:disabled?"none":`0 3px 8px ${color}44`,transition:"all 0.15s",outline:"none"}}
      onMouseEnter={e => { if (!disabled) e.currentTarget.style.transform = "translateY(-1px)"; }}
      onMouseLeave={e => { if (!disabled) e.currentTarget.style.transform = "translateY(0)"; }}
    >
      {label}
    </button>
  );
}

// store item card
function StoreItem({ item, type, chips, onBuy, onEquip, equipped }) {
  const canAfford = chips >= item.price;
  const isOwned = item.owned || item.price === 0;

  function renderPreview() {
    if (type === "card") return (<CardBackPattern backId={item.id} size={30}/>);
    if (type === "dealer") return (
      <div style={{width:36,height:36,borderRadius:"50%",background:`radial-gradient(circle at 35% 30%,${item.accentColor}77,${item.accentColor}22)`,border:`2px solid ${item.accentColor}44`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,flexShrink:0}}>
        {item.emoji}
      </div>
    );
    if (type === "table") return (
      <div style={{width:46,height:28,borderRadius:4,background:`linear-gradient(135deg,${item.from},${item.to})`,border:`2px solid ${item.border}44`,flexShrink:0}}/>
    );
    if (type === "chips") {
      const cc = item.chipColors || {};
      return (
        <div style={{display:"flex",gap:2,flexShrink:0}}>
          {[5,25].map(v => {
            const cl = cc[v] || ["#555","#888"];
            return (<div key={v} style={{width:18,height:18,borderRadius:"50%",background:`radial-gradient(circle at 35% 35%,${cl[1]},${cl[0]})`,border:"2px solid rgba(255,255,255,0.1)"}}/>);
          })}
        </div>
      );
    }
    return null;
  }

  return (
    <div style={{background:equipped?"linear-gradient(135deg,rgba(201,168,76,0.12),rgba(201,168,76,0.04))":"rgba(255,255,255,0.03)",border:equipped?"1px solid rgba(201,168,76,0.4)":"1px solid rgba(255,255,255,0.07)",borderRadius:10,padding:"10px 12px",position:"relative",overflow:"hidden"}}>
      {equipped && <div style={{position:"absolute",top:5,right:5,fontSize:7,letterSpacing:2,color:"#c9a84c",background:"rgba(201,168,76,0.12)",padding:"2px 5px",borderRadius:8}}>EQUIPPED</div>}
      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
        {renderPreview()}
        <div style={{minWidth:0}}>
          <div style={{fontFamily:"Georgia,serif",fontSize:11,fontWeight:700,color:"white",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{item.name}</div>
          {item.title && <div style={{fontSize:8,color:"rgba(255,215,0,0.5)"}}>{item.title}</div>}
          {item.perkName && <div style={{fontSize:8,color:"rgba(255,215,0,0.6)"}}>{item.perkIcon} {item.perkName}</div>}
          {item.perkDesc && <div style={{fontSize:8,color:"rgba(255,255,255,0.35)",marginTop:2,lineHeight:1.3}}>{item.perkDesc}</div>}
        </div>
      </div>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        {isOwned
          ? <span style={{fontSize:8,color:"#c9a84c",letterSpacing:1,fontWeight:700}}>✦ UNLOCKED</span>
          : <span style={{fontSize:11,fontWeight:700,color:canAfford?"#f1c40f":"#e74c3c",fontFamily:"Georgia,serif"}}>${item.price.toLocaleString()}</span>
        }
        {isOwned
          ? (!equipped && <Btn label="EQUIP" onClick={() => onEquip(item.id)} disabled={false} color="#c9a84c" small/>)
          : <Btn label="BUY" onClick={() => onBuy(item)} disabled={!canAfford} color="#27ae60" small/>
        }
      </div>
    </div>
  );
}

// achievement badge
function AchievBadge({ ach, unlocked }) {
  return (
    <div style={{background:unlocked?"linear-gradient(135deg,rgba(201,168,76,0.12),rgba(201,168,76,0.04))":"rgba(255,255,255,0.02)",border:unlocked?"1px solid rgba(201,168,76,0.35)":"1px solid rgba(255,255,255,0.06)",borderRadius:9,padding:"8px 10px",display:"flex",alignItems:"center",gap:8,opacity:unlocked?1:0.38}}>
      <div style={{fontSize:18,filter:unlocked?"none":"grayscale(1)",flexShrink:0}}>{ach.icon}</div>
      <div>
        <div style={{fontFamily:"Georgia,serif",fontSize:10,fontWeight:700,color:unlocked?"#c9a84c":"rgba(255,255,255,0.4)"}}>{ach.name}</div>
        <div style={{fontSize:8,color:"rgba(255,255,255,0.3)",marginTop:1}}>{ach.desc}</div>
      </div>
      {unlocked && <div style={{marginLeft:"auto",fontSize:8,color:"#c9a84c",flexShrink:0}}>✦</div>}
    </div>
  );
}

// dealer dialogue
const QUIPS={
  deal:{victoria:["Your move.","Cards are dealt.","Let's play.","Place your bets."],max:["Dale, let's go.","Show me what you got, dale.","Aye, nice bet.","Let's see, dale."],luna:["The cards whisper...","I sense your fortune.","The stars are watching.","Trust the cards."],rex:["Now this is a game!","Let's play!","I like your style.","Here we go!"],nova:["O-okay, game on!","Here we go!","I got this!","Let's do this!"],koda:["Woof woof woof!!","CARDS!! CARDS!! CARDS!!","Ooooo what are thoseeeee","I am READY. I am SO ready."]},
  win:{victoria:["Well played.","You earned that.","Good hand.","Impressive."],max:["DALE!!","DALE DALE DALE!!","Aye, that's what I'm talking about — DALE!!","Dale, mi gente!!"],luna:["The stars favoured you.","I foresaw this.","Fortune smiles.","As foretold."],rex:["Beautiful play!","That's what I'm talking about!","Outstanding!","Old Vegas magic!"],nova:["YES! You won!","Oh wow!!","I rooted for you!","Amazing!!"],koda:["Yesssssssss!!","GIMME THE FOOOOOOD WITH THE WINNNNINGS!!","WOOOOOO good human!!","BORK BORK BORK!! You did it!!"]},
  lose:{victoria:["House wins.","Better luck next time.","Try again.","The house thanks you."],max:["No dale for you.","That's the game, papi.","Can't dale every time.","No dale... yet."],luna:["The cards knew...","Fate can be cruel.","Perhaps next hand.","The cosmos shifts."],rex:["Don't lose heart!","Next hand, friend.","Happens to the best!","Shake it off!"],nova:["I'm so sorry...","I believed in you!","Bad luck...","You'll get 'em next time!"],koda:["NAYYYY!!","Didn't win, didn't win...","Ain't that a kick in the head?!","MEEEEEE... so sad right now."]},
  bust:{victoria:["Bust. Over 21.","Too many cards.","That's a bust."],max:["Bust! No dale!","Over 21, no dale today.","Classic. No dale."],luna:["The cards turned on you.","A painful reading.","The bust was foretold."],rex:["Ooh, busted! Tough break!","Shake it off!","Happens to all of us!"],nova:["Oh no, bust!!","That's so unlucky!","You okay??"],koda:["NOOOOOO the fooddddd!!","Didn't win, didn't win, DIDN'T WIN!!","Nooooooo I wanted the treatsssss!!"]},
  blackjack:{victoria:["Blackjack. Well done.","Natural 21. Excellent.","Impressive."],max:["BLACKJACK — DAAAALE!!","Natural 21? DALE!!","Oh you got me. Dale though!!"],luna:["BLACKJACK! The cosmos aligned!","I saw this in the cards!","Natural 21! Magnificent!"],rex:["BLACKJACK!! YEEHAW!","Magnificent! Drinks on me!","In 40 years — magnificent!"],nova:["BLACKJACK!!! OH MY GOSH!!!","AHHH YES!! BLACKJACK!","I'M LITERALLY SHAKING!!"],koda:["YESSSSSSS BLACKJACK BLACKJACK!!","OH THE TREATSSSSS ARE COMINGGGGG!!","BORK!! BORK BORK BORK!! WOOOOO!!"]},
  thinking:{victoria:["...","Calculating.","One moment."],max:["Hmm... dale?","Interesting...","Dale... or no dale..."],luna:["The cards reveal...","Reading the signs...","Hmm..."],rex:["Now let me see...","Interesting situation...","Hmm yes..."],nova:["Um... um...","Okay okay okay...","Thinking..."],koda:["...sniff sniff...","Hmmmmmm 👃","oooooOOOooo...","nose goes boop on card..."]},
};
const gq=(event,dealerId)=>{const pool=QUIPS[event]?.[dealerId]||QUIPS[event]?.victoria||["..."];return pool[Math.floor(Math.random()*pool.length)];};

// main app
export default function App() {
  const sfx=useSfx(), jazz=useJazz();
  const [musicOn,setMusicOn]=useState(false);

  const loadSave=()=>{try{const s=localStorage.getItem(SAVE_KEY);return s?JSON.parse(s):defaultSave();}catch{return defaultSave();}};
  const [save,setSave]=useState(loadSave);
  const updateSave=useCallback((updater)=>{setSave(prev=>{const next=typeof updater==="function"?updater(prev):{...prev,...updater};try{localStorage.setItem(SAVE_KEY,JSON.stringify(next));}catch{}return next;});},[]);
  const{chips,ownedCards,ownedDealers,ownedTables,ownedChipSets,equippedCard,equippedDealer,equippedTable,equippedChipSet,stats,achievements,lastDaily}=save;

  const[view,setView]=useState("game");
  const[storeTab,setStoreTab]=useState("card");
  const[notifs,setNotifs]=useState([]);
  const[achievPop,setAchievPop]=useState(null);

  
  const[deck,setDeck]=useState(freshDeck);
  const[playerHand,setPlayerHand]=useState([]);
  const[dealerHand,setDealerHand]=useState([]);
  const[bet,setBet]=useState(0);
  const[phase,setPhase]=useState("betting");
  const[result,setResult]=useState("");
  const[messages,setMessages]=useState([]);
  const[hint,setHint]=useState(null);

  
  const[splitHand,setSplitHand]=useState(null);
  const[splitBet,setSplitBet]=useState(0);
  const[lastBet,setLastBet]=useState(0);
  const[lastSplitBet,setLastSplitBet]=useState(0);
  const[activeSplit,setActiveSplit]=useState(0);
  const[splitResult,setSplitResult]=useState(null);

  
  const[dealerMood,setDealerMood]=useState("idle");
  const[speech,setSpeech]=useState("");
  const moodTimer=useRef(null), speechTimer=useRef(null);

  const activeTable=TABLES.find(t=>t.id===equippedTable)||TABLES[0];
  const activeDealer=DEALERS.find(d=>d.id===equippedDealer)||DEALERS[0];
  const activeCS=CHIP_SETS.find(c=>c.id===equippedChipSet)||CHIP_SETS[0];

  const setMood=(mood,dur=2200)=>{ clearTimeout(moodTimer.current); setDealerMood(mood); if(dur) moodTimer.current=setTimeout(()=>setDealerMood("idle"),dur); };
  const say=(txt,dur=2800)=>{ clearTimeout(speechTimer.current); setSpeech(txt); speechTimer.current=setTimeout(()=>setSpeech(""),dur); };
  const dealerReact=(event,mood,dur=2200)=>{ setMood(mood,dur); say(gq(event,equippedDealer),dur); if(equippedDealer==="koda")sfx("bark"); };

  const toggleMusic=()=>{ if(musicOn){jazz.stop();setMusicOn(false);}else{jazz.start();setMusicOn(true);} };
  const showNotif=useCallback((msg,color="#27ae60")=>{const id=Date.now()+Math.random();setNotifs(n=>[...n,{msg,color,id}]);setTimeout(()=>setNotifs(n=>n.filter(x=>x.id!==id)),2500);},[]);
  const checkAch=useCallback((ns,ca)=>{const nw=ACHIEVEMENTS.filter(a=>!ca.includes(a.id)&&a.condition(ns));if(!nw.length)return ca;nw.forEach((a,i)=>setTimeout(()=>{setAchievPop(a);sfx("achievement");setTimeout(()=>setAchievPop(null),3000);},i*3200));return[...ca,...nw.map(a=>a.id)];},[sfx]);

  const canClaimDaily=lastDaily!==todayStr();
  const claimDaily=()=>{if(!canClaimDaily)return;sfx("daily");dealerReact("win","laugh",2800);say("Here's your daily chips! 🎁",2800);showNotif(`🎁 Daily bonus! +$${DAILY_BONUS}`,"#f1c40f");updateSave(prev=>{const ns={...prev.stats,dailyClaims:prev.stats.dailyClaims+1};return{...prev,chips:prev.chips+DAILY_BONUS,lastDaily:todayStr(),stats:ns,achievements:checkAch(ns,prev.achievements)};});};

  const buyItem=(item,type)=>{if(chips<item.price)return;sfx("chip");const lk=type==="card"?"ownedCards":type==="dealer"?"ownedDealers":type==="table"?"ownedTables":"ownedChipSets";const ek=type==="card"?"equippedCard":type==="dealer"?"equippedDealer":type==="table"?"equippedTable":"equippedChipSet";showNotif(`✦ ${item.name} unlocked & equipped!`,"#c9a84c");updateSave(prev=>{const ns={...prev.stats,purchases:prev.stats.purchases+1};return{...prev,chips:prev.chips-item.price,[lk]:[...prev[lk],item.id],[ek]:item.id,stats:ns,achievements:checkAch(ns,prev.achievements)};});};
  const equipItem=(id,type)=>{sfx("chip");const key=type==="card"?"equippedCard":type==="dealer"?"equippedDealer":type==="table"?"equippedTable":"equippedChipSet";showNotif("Equipped!","#c9a84c");updateSave(prev=>({...prev,[key]:id}));};

  const placeBet=(amount)=>{if(chips<amount)return;sfx("chip");updateSave(prev=>({...prev,chips:Math.max(0,prev.chips-amount)}));setBet(b=>b+amount);};
  const clearBet=()=>{sfx("chip");updateSave(prev=>({...prev,chips:prev.chips+bet}));setBet(0);};
  // yolo
  const allIn=()=>{if(chips===0)return;sfx("chip");const amt=chips;updateSave(prev=>({...prev,chips:0}));setBet(b=>b+amt);};

  const startGame=()=>{
    if(bet===0)return;
    let d=deck.length<20?freshDeck():[...deck];
    const p=d.splice(0,2),dl=d.splice(0,2);
    setPlayerHand(p);setDealerHand(dl);setDeck(d);setResult("");setMessages([]);setHint(null);
    setSplitHand(null);setSplitBet(0);setActiveSplit(0);setSplitResult(null);
    sfx("deal");setTimeout(()=>sfx("deal"),130);setTimeout(()=>sfx("deal"),260);setTimeout(()=>sfx("deal"),390);
    dealerReact("deal","deal",1800);
    if(handTotal(p)===21){setTimeout(()=>resolveGame(p,dl,d,true),600);}
    else{setPhase("playing");if(equippedDealer==="luna"){setTimeout(()=>{const h=getHint(p,dl[0]);sfx("hint");setHint(h);setMood("thinking",1400);},700);}}
  };

  
  // suits don't matter for splits
  const canSplit = playerHand.length===2 && !splitHand &&
    (playerHand[0].value === playerHand[1].value ||
     (["10","J","Q","K"].includes(playerHand[0].value) && ["10","J","Q","K"].includes(playerHand[1].value)));
  const canAffordSplit = chips >= bet;

  const doSplit=()=>{
    if(!canSplit)return;
    sfx("chip"); sfx("deal");
    setMood("shocked",1600);
    say(["A split! Interesting...","Bold split!","Two hands — double the fun!","Let's see how this plays out!"][Math.floor(Math.random()*4)],1600);
    
    updateSave(prev=>({...prev,chips:Math.max(0,prev.chips-bet)}));
    setSplitBet(bet);
    
    const[nc1,nc2,...rest]=deck;
    const hand1=[playerHand[0],nc1];
    const hand2=[playerHand[1],nc2];
    setPlayerHand(hand1);
    setSplitHand(hand2);
    setDeck(rest);
    setActiveSplit(0);
    setHint(null);
    if(equippedDealer==="luna"){setTimeout(()=>{const h=getHint(hand1,dealerHand[0]);sfx("hint");setHint(h);},500);}
  };

  const currentHand = activeSplit===0 ? playerHand : (splitHand||[]);
  const currentBetForHand = activeSplit===0 ? bet : splitBet;

  const hit=()=>{
    sfx("deal"); setMood("thinking",1100);
    const[nc,...rest]=deck;
    const nh=[...currentHand,nc];
    setHint(null);
    if(activeSplit===0){setPlayerHand(nh);}else{setSplitHand(nh);}
    setDeck(rest);
    if(handTotal(nh)>=21){
      setTimeout(()=>{
        if(activeSplit===0&&splitHand&&splitBet>0){
          setActiveSplit(1);
          if(handTotal(nh)>21){
            setSplitResult(prev=>({...prev,main:{res:"bust",wa:0}}));
          }
          if(equippedDealer==="luna")setTimeout(()=>{const h=getHint(splitHand,dealerHand[0]);sfx("hint");setHint(h);},300);
        } else {
          resolveGame(activeSplit===0?nh:playerHand, dealerHand, rest, false, false, splitBet>0?(activeSplit===0?splitHand:null):null, splitBet>0?(activeSplit===0?null:nh):null);
        }
      },400);
    } else if(equippedDealer==="luna"){
      setTimeout(()=>{const h=getHint(nh,dealerHand[0]);sfx("hint");setHint(h);},380);
    }
  };

  const stand=()=>{
    setHint(null); setMood("thinking",900);
    say(["Interesting choice.","Standing, are we?","Okay then.","Alright."][Math.floor(Math.random()*4)],1100);
    if(activeSplit===0&&splitHand&&splitBet>0){
      setActiveSplit(1);
      if(equippedDealer==="luna")setTimeout(()=>{const h=getHint(splitHand,dealerHand[0]);sfx("hint");setHint(h);},300);
    } else {
      resolveGame(playerHand, dealerHand, deck, false, false, splitBet>0?splitHand:null, splitBet>0&&activeSplit===1?currentHand:null);
    }
  };

  const doubleDown=()=>{
    if(chips<currentBetForHand||currentHand.length!==2)return;
    sfx("chip");sfx("deal");setHint(null);setMood("shocked",1400);
    say(["Bold move!","Doubling down?!","Brave!","Going big?"][Math.floor(Math.random()*4)],1400);
    updateSave(prev=>({...prev,chips:Math.max(0,prev.chips-currentBetForHand)}));
    if(activeSplit===0){setBet(b=>b*2);}else{setSplitBet(b=>b*2);}
    const[nc,...rest]=deck;
    const nh=[...currentHand,nc];
    if(activeSplit===0){setPlayerHand(nh);}else{setSplitHand(nh);}
    setDeck(rest);
    setTimeout(()=>{
      if(activeSplit===0&&splitHand&&splitBet>0){
        setActiveSplit(1);
        if(equippedDealer==="luna")setTimeout(()=>{const h=getHint(splitHand,dealerHand[0]);sfx("hint");setHint(h);},300);
      } else {
        resolveGame(activeSplit===0?nh:playerHand, dealerHand, rest, false, true, splitBet>0?(activeSplit===0?splitHand:null):null, splitBet>0?(activeSplit===0?null:nh):null);
      }
    },400);
  };

  const resolveGame=(pHand, dHand, curDeck, isBJ=false, isDbl=false, splitH=null, finalSplitH=null)=>{
    setPhase("dealer");const thr=equippedDealer==="rex"?16:17;
    const run=(cards,d)=>{
      let tot=handTotal(cards);
      const ne=equippedDealer==="nova"&&tot>=thr&&Math.random()<0.15&&cards.length<=3;
      if(tot<thr||ne){
        if(ne){setMood("shocked",2000);say("Oops! Extra card! 😬",2000);}
        const nc=[...cards,d[0]];sfx("deal");setDealerHand(nc);
        setTimeout(()=>run(nc,d.slice(1)),520);
      } else {
        finalResult(pHand,cards,isBJ,isDbl,splitH||finalSplitH);
        setDeck(d);
      }
    };
    setTimeout(()=>run([...dHand],curDeck),600);
  };

  const finalResult=(pHand, dHand, isBJ, isDbl, resolvedSplitHand=null)=>{
    setLastBet(bet);
    setLastSplitBet(splitBet);
    const p=handTotal(pHand), dv=handTotal(dHand);
    const calcOutcome=(ph,betAmt,isBlackjack,isDouble)=>{
      let res="",wa=0;
      const pv=handTotal(ph);
      if(pv>21)              {res="bust"; wa=0;}
      else if(dv>21)         {res="win";  wa=isBlackjack?Math.floor(betAmt*(equippedDealer==="rex"?2:1.5)):betAmt;}
      else if(isBlackjack&&pv===21){res="blackjack";wa=Math.floor(betAmt*(equippedDealer==="rex"?2:1.5));}
      else if(pv>dv)         {res="win";  wa=betAmt;}
      else if(pv<dv)         {res="lose"; wa=0;}
      else                   {res="push"; wa=0;}
      if(equippedDealer==="max"&&(res==="win"||res==="blackjack")){const b=Math.floor(wa*0.15);wa+=b;}
      return{res,wa,pv};
    };

    const main=calcOutcome(pHand,bet,isBJ,isDbl);
    const split=resolvedSplitHand&&splitBet>0?calcOutcome(resolvedSplitHand,splitBet,false,false):null;

    
    const bestRes=split?(main.res==="blackjack"||split.res==="blackjack"?"blackjack":main.res==="win"||split.res==="win"?"win":main.res==="push"||split.res==="push"?"push":"lose"):main.res;
    if(bestRes==="blackjack"){sfx("blackjack");dealerReact("blackjack","blackjack",3800);}
    else if(bestRes==="win") {sfx("win");      dealerReact("win","win",2600);}
    else if(bestRes==="bust"||bestRes==="lose"){sfx(bestRes==="bust"?"bust":"lose");dealerReact(bestRes==="bust"?"bust":"lose",bestRes==="bust"?"bust":"lose",2600);}
    else{setMood("idle");say("Push — bet returned.",1800);}

    const mainPayout=main.res==="push"?bet:(main.res==="win"||main.res==="blackjack")?bet+main.wa:0;
    const splitPayout=split?(split.res==="push"?splitBet:(split.res==="win"||split.res==="blackjack")?splitBet+split.wa:0):0;

    setResult(main.res);
    const msgs=[];
    const fmtRes=(r,wa,label)=>{
      const prefix=label?`[${label}] `:"";
      if(r.res==="blackjack")return{text:`${prefix}✦ BLACKJACK! +$${Math.floor(r.wa)}`,color:"#f1c40f"};
      if(r.res==="win")      return{text:`${prefix}YOU WIN +$${r.wa}`,color:"#f1c40f"};
      if(r.res==="bust")     return{text:`${prefix}BUST –$${label==="SPLIT"?splitBet:bet}`,color:"#e74c3c"};
      if(r.res==="lose")     return{text:`${prefix}DEALER WINS –$${label==="SPLIT"?splitBet:bet}`,color:"#e74c3c"};
      return{text:`${prefix}PUSH`,color:"#95a5a6"};
    };
    if(split){
      msgs.push(fmtRes(main,main.wa,"HAND 1"));
      msgs.push(fmtRes(split,split.wa,"HAND 2"));
    } else {
      msgs.push(fmtRes(main,main.wa,""));
    }
    setMessages(msgs);

    updateSave(prev=>{
      const nc=Math.max(0,prev.chips+mainPayout+splitPayout);
      const won=main.res==="win"||main.res==="blackjack"||(split&&(split.res==="win"||split.res==="blackjack"));
      const ns2=won?prev.stats.currentStreak+1:0;
      const ic=prev.stats.lowestChips<100&&won;
      const ns={...prev.stats,
        wins:prev.stats.wins+(main.res==="win"||main.res==="blackjack"?1:0)+(split&&(split.res==="win"||split.res==="blackjack")?1:0),
        losses:prev.stats.losses+(main.res==="lose"||main.res==="bust"?1:0)+(split&&(split.res==="lose"||split.res==="bust")?1:0),
        pushes:prev.stats.pushes+(main.res==="push"?1:0)+(split&&split.res==="push"?1:0),
        blackjacks:prev.stats.blackjacks+(main.res==="blackjack"?1:0),
        maxBet:Math.max(prev.stats.maxBet,bet),
        maxChips:Math.max(prev.stats.maxChips,nc),
        lowestChips:Math.min(prev.stats.lowestChips,nc),
        currentStreak:ns2,
        bestStreak:Math.max(prev.stats.bestStreak,ns2),
        doubleWins:prev.stats.doubleWins+(isDbl&&(main.res==="win"||main.res==="blackjack")?1:0),
        comeback:prev.stats.comeback||ic
      };
      return{...prev,chips:nc,stats:ns,achievements:checkAch(ns,prev.achievements)};
    });
    setBet(0);setPhase("result");
  };

  const newRound=()=>{setPlayerHand([]);setDealerHand([]);setBet(0);setLastBet(0);setResult("");setMessages([]);setHint(null);setDealerMood("idle");setSpeech("");setPhase("betting");setSplitHand(null);setSplitBet(0);setLastSplitBet(0);setActiveSplit(0);setSplitResult(null);};

  const navTabs=[{id:"game",icon:"🃏"},{id:"store",icon:"🛍️"},{id:"achievements",icon:"🏆"}];
  const storeTabs=[{id:"card",label:"Card Backs"},{id:"dealer",label:"Dealers"},{id:"table",label:"Tables"},{id:"chips",label:"Chip Sets"}];

  return (
    <div style={{minHeight:"100vh",width:"100%",background:"radial-gradient(ellipse at 50% 0%,#0d1a0f 0%,#060e08 55%,#020602 100%)",display:"flex",flexDirection:"column",alignItems:"center",fontFamily:"Georgia,serif",padding:"10px 8px",overflow:"hidden"}}>

      
      <div style={{position:"fixed",top:12,left:"50%",transform:"translateX(-50%)",zIndex:300,display:"flex",flexDirection:"column",gap:4,alignItems:"center",pointerEvents:"none"}}>
        {notifs.map(n=><div key={n.id} style={{background:n.color,color:"#fff",padding:"7px 18px",borderRadius:28,fontWeight:700,fontSize:12,letterSpacing:1,boxShadow:`0 3px 14px ${n.color}88`,animation:"slideDown 0.3s ease",whiteSpace:"nowrap"}}>{n.msg}</div>)}
      </div>

      
      {achievPop&&<div style={{position:"fixed",bottom:20,left:"50%",transform:"translateX(-50%)",background:"linear-gradient(135deg,#1a1200,#2a1e00)",border:"1px solid rgba(201,168,76,0.5)",borderRadius:14,padding:"12px 20px",display:"flex",alignItems:"center",gap:12,boxShadow:"0 8px 30px rgba(0,0,0,0.7)",zIndex:300,animation:"slideUp 0.4s cubic-bezier(0.34,1.56,0.64,1)",minWidth:240}}>
        <div style={{fontSize:28}}>{achievPop.icon}</div>
        <div><div style={{fontSize:8,letterSpacing:3,color:"rgba(201,168,76,0.6)",marginBottom:2}}>ACHIEVEMENT UNLOCKED</div><div style={{fontFamily:"Georgia,serif",fontSize:14,fontWeight:700,color:"#c9a84c"}}>{achievPop.name}</div><div style={{fontSize:10,color:"rgba(255,255,255,0.5)",marginTop:1}}>{achievPop.desc}</div></div>
      </div>}

      <div style={{width:"100%",maxWidth:520,position:"relative",zIndex:1}}>

        
        <div style={{textAlign:"center",marginBottom:6}}>
          <div style={{fontSize:7,letterSpacing:7,color:"rgba(255,215,0,0.28)",marginBottom:1}}>✦ ROYAL ✦</div>
          <h1 style={{fontFamily:"Georgia,serif",fontSize:26,fontWeight:700,margin:0,background:"linear-gradient(180deg,#f9e784 0%,#c9a84c 50%,#8b6914 100%)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",letterSpacing:5,textTransform:"uppercase"}}>Blackjack</h1>
        </div>

        
        <div style={{display:"flex",gap:4,justifyContent:"center",alignItems:"center",marginBottom:7}}>
          {navTabs.map(t=><button key={t.id} onClick={()=>setView(t.id)} style={{padding:"5px 14px",borderRadius:28,background:view===t.id?"linear-gradient(180deg,#c9a84c,#8b6914)":"rgba(255,255,255,0.04)",border:view===t.id?"1px solid #c9a84c":"1px solid rgba(255,255,255,0.08)",color:view===t.id?"#1a0a00":"rgba(255,255,255,0.42)",fontFamily:"Georgia,serif",fontSize:10,fontWeight:700,cursor:"pointer",outline:"none",transition:"all 0.2s"}}>{t.icon} {t.id.toUpperCase()}</button>)}
          <button onClick={toggleMusic} style={{width:30,height:30,borderRadius:"50%",background:musicOn?"rgba(201,168,76,0.15)":"rgba(255,255,255,0.04)",border:musicOn?"1px solid rgba(201,168,76,0.4)":"1px solid rgba(255,255,255,0.08)",color:musicOn?"#c9a84c":"rgba(255,255,255,0.38)",fontSize:13,cursor:"pointer",outline:"none",display:"flex",alignItems:"center",justifyContent:"center"}}>{musicOn?"🎵":"🔇"}</button>
        </div>

        
        <div style={{display:"flex",justifyContent:"center",marginBottom:7}}>
          <div style={{background:"rgba(0,0,0,0.45)",border:"1px solid rgba(255,215,0,0.14)",borderRadius:28,padding:"4px 16px",display:"flex",gap:12,alignItems:"center"}}>
            <div style={{textAlign:"center"}}><div style={{fontSize:7,letterSpacing:3,color:"rgba(255,215,0,0.38)"}}>CHIPS</div><div style={{fontSize:18,fontWeight:700,color:"#f1c40f",fontFamily:"Georgia,serif"}}>${chips.toLocaleString()}</div></div>
            {bet>0&&<><div style={{width:1,height:22,background:"rgba(255,215,0,0.1)"}}/><div style={{textAlign:"center"}}><div style={{fontSize:7,letterSpacing:3,color:"rgba(255,215,0,0.38)"}}>BET</div><div style={{fontSize:18,fontWeight:700,color:"#e67e22",fontFamily:"Georgia,serif"}}>${bet}</div></div></>}
            <div style={{width:1,height:22,background:"rgba(255,215,0,0.1)"}}/>
            <div style={{display:"flex",gap:9,fontSize:9,color:"rgba(255,255,255,0.28)",letterSpacing:1}}>
              <span>W:{stats.wins}</span><span>L:{stats.losses}</span>
              {stats.currentStreak>1&&<span style={{color:"#f39c12"}}>🔥{stats.currentStreak}</span>}
            </div>
          </div>
        </div>

        
        {canClaimDaily&&view==="game"&&<div style={{background:"linear-gradient(135deg,rgba(241,196,15,0.09),rgba(230,126,34,0.06))",border:"1px solid rgba(241,196,15,0.2)",borderRadius:9,padding:"8px 13px",marginBottom:7,display:"flex",alignItems:"center",justifyContent:"space-between",cursor:"pointer"}} onMouseEnter={e=>e.currentTarget.style.opacity="0.85"} onMouseLeave={e=>e.currentTarget.style.opacity="1"}>
          <div style={{display:"flex",alignItems:"center",gap:7}}><span style={{fontSize:16}}>🎁</span><div><div style={{fontFamily:"Georgia,serif",fontSize:11,fontWeight:700,color:"#f1c40f"}}>Daily Bonus!</div><div style={{fontSize:8,color:"rgba(255,255,255,0.38)"}}>Free ${DAILY_BONUS} chips</div></div></div>
          <Btn label="CLAIM" onClick={claimDaily} disabled={false} color="#f1c40f" small/>
        </div>}

        
        {view==="game"&&<div style={{background:`radial-gradient(ellipse at 50% 30%,${activeTable.from} 0%,${activeTable.to} 100%)`,borderRadius:16,border:`2px solid ${activeTable.border}1a`,boxShadow:"0 18px 55px rgba(0,0,0,0.65)",overflow:"hidden"}}>

          
          <div style={{position:"relative",background:`linear-gradient(180deg,rgba(0,0,0,0.55) 0%,rgba(0,0,0,0.15) 100%)`,padding:"6px 0 0",display:"flex",justifyContent:"center",alignItems:"flex-end",minHeight:200,overflow:"hidden"}}>
            
            <div style={{position:"absolute",inset:0,background:`radial-gradient(ellipse at 50% 100%,${activeDealer.accentColor}18 0%,transparent 70%)`,pointerEvents:"none"}}/>

            
            <div style={{position:"relative",zIndex:2}}>
              <DealerPortrait dealerId={equippedDealer} mood={dealerMood}/>
            </div>

            
            {speech&&<div style={{position:"absolute",top:12,left:"50%",transform:"translateX(-50%)",maxWidth:260,background:"rgba(10,8,5,0.88)",border:`1px solid ${activeDealer.accentColor}44`,borderRadius:12,padding:"8px 14px",fontSize:11,color:"rgba(255,255,255,0.82)",fontStyle:"italic",textAlign:"center",zIndex:10,animation:"speechPop 0.3s cubic-bezier(0.34,1.56,0.64,1)",whiteSpace:"nowrap",boxShadow:`0 4px 16px rgba(0,0,0,0.5),0 0 8px ${activeDealer.accentColor}22`}}>
              <span style={{color:activeDealer.accentColor,marginRight:4}}>❝</span>{speech}<span style={{color:activeDealer.accentColor,marginLeft:4}}>❞</span>
              
              <div style={{position:"absolute",bottom:-7,left:"50%",transform:"translateX(-50%)",width:12,height:8,background:"rgba(10,8,5,0.88)",clipPath:"polygon(0 0,100% 0,50% 100%)",borderLeft:`1px solid ${activeDealer.accentColor}44`,borderRight:`1px solid ${activeDealer.accentColor}44`}}/>
            </div>}

            
            <div style={{position:"absolute",bottom:8,right:10,background:"rgba(0,0,0,0.5)",borderRadius:20,padding:"3px 10px",border:`1px solid ${activeDealer.accentColor}33`,display:"flex",alignItems:"center",gap:5,zIndex:3}}>
              <span style={{fontSize:12}}>{activeDealer.emoji}</span>
              <div><div style={{fontSize:9,color:"rgba(255,255,255,0.5)",letterSpacing:1}}>{activeDealer.name}</div><div style={{fontSize:7,color:activeDealer.accentColor,letterSpacing:1}}>{activeDealer.perkIcon} {activeDealer.perkName}</div></div>
            </div>
          </div>

          
          <div style={{padding:"14px 16px",display:"flex",flexDirection:"column",gap:12,alignItems:"center",position:"relative"}}>
            <div style={{position:"absolute",inset:8,borderRadius:10,border:`1px solid ${activeTable.border}0d`,pointerEvents:"none"}}/>

            {dealerHand.length>0&&<Hand hand={dealerHand} hideSecond={phase==="playing"} label="Dealer" total={phase==="playing"?cardNum(dealerHand[0]):handTotal(dealerHand)} cardBack={equippedCard}/>}

            {(playerHand.length>0||phase==="betting")&&<div style={{width:"75%",height:1,background:`linear-gradient(90deg,transparent,${activeTable.border}18,transparent)`}}/>}

            
            {playerHand.length>0&&(
              splitHand && splitHand.length>0 ? (
                <div style={{display:"flex",gap:14,justifyContent:"center",alignItems:"flex-start",flexWrap:"wrap"}}>
                  <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
                    <div style={{fontSize:8,letterSpacing:2,color:activeSplit===0&&phase==="playing"?"#f1c40f":"rgba(255,215,0,0.35)",fontFamily:"Georgia,serif",border:activeSplit===0&&phase==="playing"?"1px solid rgba(241,196,15,0.4)":"1px solid transparent",borderRadius:8,padding:"1px 7px"}}>{`HAND 1  $${phase==="result"?lastBet:bet}`}</div>
                    <Hand hand={playerHand} label="" total={handTotal(playerHand)} cardBack={equippedCard}/>
                    {phase==="result"&&messages[0]&&<div style={{fontFamily:"Georgia,serif",fontSize:12,fontWeight:700,color:messages[0].color,letterSpacing:2,textTransform:"uppercase",textShadow:`0 0 12px ${messages[0].color}88`,animation:"pulse 1.5s ease-in-out infinite",textAlign:"center",marginTop:2}}>{messages[0].text.replace(/^\[HAND 1\] /,"")}</div>}
                  </div>
                  <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
                    <div style={{fontSize:8,letterSpacing:2,color:activeSplit===1&&phase==="playing"?"#f1c40f":"rgba(255,215,0,0.35)",fontFamily:"Georgia,serif",border:activeSplit===1&&phase==="playing"?"1px solid rgba(241,196,15,0.4)":"1px solid transparent",borderRadius:8,padding:"1px 7px"}}>{`HAND 2  $${phase==="result"?lastSplitBet:splitBet}`}</div>
                    <Hand hand={splitHand} label="" total={handTotal(splitHand)} cardBack={equippedCard}/>
                    {phase==="result"&&messages[1]&&<div style={{fontFamily:"Georgia,serif",fontSize:12,fontWeight:700,color:messages[1].color,letterSpacing:2,textTransform:"uppercase",textShadow:`0 0 12px ${messages[1].color}88`,animation:"pulse 1.5s ease-in-out infinite",textAlign:"center",marginTop:2}}>{messages[1].text.replace(/^\[HAND 2\] /,"")}</div>}
                  </div>
                </div>
              ) : (
                <Hand hand={playerHand} label="Your Hand" total={handTotal(playerHand)} cardBack={equippedCard}/>
              )
            )}

            {hint&&phase==="playing"&&equippedDealer==="luna"&&<div style={{background:"linear-gradient(135deg,rgba(107,33,168,0.28),rgba(107,33,168,0.1))",border:"1px solid rgba(192,132,252,0.4)",borderRadius:9,padding:"7px 14px",display:"flex",alignItems:"center",gap:7,animation:"speechPop 0.35s ease"}}>
              <span style={{fontSize:14}}>🔮</span>
              <span style={{fontFamily:"Georgia,serif",fontSize:12,fontWeight:700,color:hint.action==="HIT"?"#60a5fa":"#6ee7b7",letterSpacing:2}}>{hint.action}</span>
              <span style={{fontSize:9,color:"rgba(255,255,255,0.4)",fontStyle:"italic"}}>— {hint.reason}</span>
            </div>}

            {/* single-hand result only */}
            {messages.length>0&&!(splitHand&&splitHand.length>0&&splitBet>0)&&<div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:3}}>
              {messages.map((m,i)=><div key={i} style={{fontFamily:"Georgia,serif",fontSize:i===0?16:12,fontWeight:700,color:m.color,letterSpacing:i===0?3:1,textTransform:"uppercase",textShadow:`0 0 16px ${m.color}88`,animation:i===0?"pulse 1.5s ease-in-out infinite":"none",textAlign:"center"}}>{m.text}</div>)}
            </div>}

            
            {phase==="betting"&&<div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:10,width:"100%"}}>
              <div style={{fontSize:8,letterSpacing:3,color:"rgba(255,215,0,0.38)"}}>PLACE YOUR BET</div>
              <div style={{display:"flex",gap:7,flexWrap:"wrap",justifyContent:"center"}}>
                {[1,5,10,25,100,...(chips>=1000?[1000]:[]),...(chips>=10000?[10000]:[])].map(v=><ChipBtn key={v} amount={v} onClick={()=>placeBet(v)} disabled={chips<v} chipColors={activeCS.chipColors}/>)}
              </div>
              <div style={{display:"flex",gap:7,flexWrap:"wrap",justifyContent:"center"}}>
                <Btn label="DEAL" onClick={startGame} disabled={bet===0} color="#27ae60"/>
                <Btn label="ALL IN 🔥" onClick={allIn} disabled={chips===0} color="#e74c3c"/>
                {bet>0&&<Btn label="CLEAR" onClick={clearBet} disabled={false} color="#d4ac0d"/>}
              </div>
            </div>}

            {phase==="playing"&&<div style={{display:"flex",gap:7,flexWrap:"wrap",justifyContent:"center"}}>
              <Btn label="HIT"    onClick={hit}        disabled={false}                                                    color="#27ae60"/>
              <Btn label="STAND"  onClick={stand}      disabled={false}                                                    color="#c9a84c"/>
              <div style={{position:"relative",display:"inline-block"}} title={currentHand.length===2&&chips<currentBetForHand?"Insufficient Funds":""}>
                <Btn label="DOUBLE" onClick={doubleDown} disabled={currentHand.length!==2||chips<currentBetForHand} color="#2980b9"/>
              </div>
              {canSplit&&(
                <div style={{position:"relative",display:"inline-block"}} title={!canAffordSplit?"Insufficient Funds":""}>
                  <Btn label="SPLIT" onClick={canAffordSplit?doSplit:()=>{}} disabled={!canAffordSplit} color="#9b59b6"/>
                </div>
              )}
            </div>}

            {phase==="result"&&<Btn label="NEXT HAND" onClick={newRound} disabled={false} color="#c9a84c"/>}
          </div>
        </div>}

        
        {view==="store"&&<div>
          <div style={{display:"flex",gap:3,marginBottom:10,overflowX:"auto",paddingBottom:2}}>
            {storeTabs.map(t=><button key={t.id} onClick={()=>setStoreTab(t.id)} style={{padding:"5px 12px",borderRadius:18,whiteSpace:"nowrap",background:storeTab===t.id?"rgba(201,168,76,0.12)":"rgba(255,255,255,0.03)",border:storeTab===t.id?"1px solid rgba(201,168,76,0.4)":"1px solid rgba(255,255,255,0.06)",color:storeTab===t.id?"#c9a84c":"rgba(255,255,255,0.32)",fontFamily:"Georgia,serif",fontSize:10,cursor:"pointer",outline:"none"}}>{t.label}</button>)}
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:7}}>
            {storeTab==="card"   &&CARD_BACKS.map(item=><StoreItem key={item.id} item={{...item,owned:ownedCards.includes(item.id)}}       type="card"   chips={chips} onBuy={i=>buyItem(i,"card")}   onEquip={id=>equipItem(id,"card")}   equipped={equippedCard===item.id}/>)}
            {storeTab==="dealer" &&DEALERS.map(item=>   <StoreItem key={item.id} item={{...item,owned:ownedDealers.includes(item.id)}}     type="dealer" chips={chips} onBuy={i=>buyItem(i,"dealer")} onEquip={id=>equipItem(id,"dealer")} equipped={equippedDealer===item.id}/>)}
            {storeTab==="table"  &&TABLES.map(item=>    <StoreItem key={item.id} item={{...item,owned:ownedTables.includes(item.id)}}      type="table"  chips={chips} onBuy={i=>buyItem(i,"table")}  onEquip={id=>equipItem(id,"table")}  equipped={equippedTable===item.id}/>)}
            {storeTab==="chips"  &&CHIP_SETS.map(item=> <StoreItem key={item.id} item={{...item,owned:ownedChipSets.includes(item.id)}}    type="chips"  chips={chips} onBuy={i=>buyItem(i,"chips")}  onEquip={id=>equipItem(id,"chips")}  equipped={equippedChipSet===item.id}/>)}
          </div>
        </div>}

        
        {view==="achievements"&&<div>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12,padding:"0 2px"}}>
            <div style={{fontFamily:"Georgia,serif",fontSize:12,color:"rgba(255,255,255,0.38)"}}><span style={{color:"#c9a84c",fontWeight:700}}>{achievements.length}</span> / {ACHIEVEMENTS.length} unlocked</div>
            <div style={{fontSize:9,letterSpacing:2,color:"rgba(255,215,0,0.28)"}}>W:{stats.wins} · BJ:{stats.blackjacks} · STREAK:{stats.bestStreak}</div>
          </div>
          <div style={{height:3,background:"rgba(255,255,255,0.06)",borderRadius:2,marginBottom:14,overflow:"hidden"}}>
            <div style={{height:"100%",width:`${(achievements.length/ACHIEVEMENTS.length)*100}%`,background:"linear-gradient(90deg,#8b6914,#c9a84c)",borderRadius:2,transition:"width 0.5s"}}/>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6}}>
            {ACHIEVEMENTS.map(a=><AchievBadge key={a.id} ach={a} unlocked={achievements.includes(a.id)}/>)}
          </div>
        </div>}

        {chips===0&&bet===0&&phase==="betting"&&view==="game"&&<div style={{textAlign:"center",marginTop:10}}>
          <Btn label="RELOAD $10,000" onClick={()=>updateSave(prev=>({...prev,chips:10000}))} disabled={false} color="#e74c3c"/>
        </div>}
      </div>

      <style>{`
        @keyframes dealerIdle   { 0%,100%{transform:translateY(0) rotate(0deg)} 50%{transform:translateY(-4px) rotate(0.4deg)} }
        @keyframes dealerBob    { from{transform:translateY(0) scale(1)} to{transform:translateY(-8px) scale(1.02)} }
        @keyframes dealerShake  { 0%,100%{transform:translateX(0)} 20%{transform:translateX(-6px) rotate(-1deg)} 40%{transform:translateX(6px) rotate(1deg)} 60%{transform:translateX(-4px)} 80%{transform:translateX(4px)} }
        @keyframes lunaFloat    { from{transform:translateY(0) scale(1)} to{transform:translateY(-8px) scale(1.15)} }
        @keyframes starPop      { 0%{opacity:0;transform:scale(0) translateY(0)} 60%{opacity:1;transform:scale(1.3) translateY(-14px)} 100%{opacity:0;transform:scale(0.8) translateY(-28px)} }
        @keyframes floatLeft    { 0%{opacity:0;transform:translate(0,0) scale(0.5)} 50%{opacity:1;transform:translate(-8px,-18px) scale(1.1)} 100%{opacity:0;transform:translate(-16px,-32px) scale(0.8)} }
        @keyframes floatRight   { 0%{opacity:0;transform:translate(0,0) scale(0.5)} 50%{opacity:1;transform:translate(8px,-14px) scale(1.1)} 100%{opacity:0;transform:translate(16px,-28px) scale(0.8)} }
        @keyframes popIn        { 0%{opacity:0;transform:scale(0)} 70%{transform:scale(1.3)} 100%{opacity:1;transform:scale(1)} }
        @keyframes speechPop    { 0%{opacity:0;transform:translateX(-50%) scale(0.85)} 100%{opacity:1;transform:translateX(-50%) scale(1)} }
        @keyframes pulse        { 0%,100%{opacity:1} 50%{opacity:0.62} }
        @keyframes slideDown    { from{opacity:0;transform:translateY(-8px)} to{opacity:1;transform:translateY(0)} }
        @keyframes slideUp      { from{opacity:0;transform:translateX(-50%) translateY(18px)} to{opacity:1;transform:translateX(-50%) translateY(0)} }
        *{box-sizing:border-box}
        ::-webkit-scrollbar{height:3px}::-webkit-scrollbar-thumb{background:rgba(255,215,0,0.14);border-radius:2px}
      `}</style>
    </div>
  );
}
