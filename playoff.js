// Use same teams array / sorting logic as standings
const TOTAL_MATCHES = 8;

// --- REPLACE teams with current standings data (or import) ---
const teams = [
  {name:'Arabian Kings', matches:8, wins:5, losses:3, points:10, nrr:-0.359},
  {name:'Knight Riders', matches:8, wins:6, losses:2, points:12, nrr:+8.983},
  {name:'Flying Falcon', matches:8, wins:4, losses:4, points:8, nrr:-0.022},
  {name:'Power Heaters', matches:8, wins:4, losses:4, points:8, nrr:-3.462},
  {name:'All-round Royals', matches:8, wins:1, losses:7, points:2, nrr:-5.555}
];

// pick top4 based on same sort rules
function pickTop4(arr){
  const copy = arr.slice();
  copy.sort((a,b)=>{
    if(b.points!==a.points) return b.points-a.points;
    if(b.nrr!==a.nrr) return b.nrr-a.nrr;
    if(b.wins!==a.wins) return b.wins-a.wins;
    return a.matches-b.matches;
  });
  return copy.slice(0,4);
}

// state to track winners
const state = {
  q1Winner: null,
  q1Loser: null,
  elWinner: null,
  elLoser: null,
  q2Winner: null,
  q2Loser: null,
  finalWinner: null
};

const top4 = pickTop4(teams);
// map top4 to positions: r1,r2,r3,r4
const r1 = top4[0]?.name || "TBD";
const r2 = top4[1]?.name || "TBD";
const r3 = top4[2]?.name || "TBD";
const r4 = top4[3]?.name || "TBD";

// helper to set button text
function setInitialButtons(){
  // Qualifier 1
  document.getElementById('q1_home').textContent = r1;
  document.getElementById('q1_away').textContent = r2;
  // Eliminator
  document.getElementById('el_home').textContent = r3;
  document.getElementById('el_away').textContent = r4;
  // Clear others
  document.getElementById('q2_home').textContent = "TBD";
  document.getElementById('q2_away').textContent = "TBD";
  document.getElementById('final_home').textContent = "TBD";
  document.getElementById('final_away').textContent = "TBD";
}
setInitialButtons();

// utility: mark win visually
function markWin(buttonId){
  // remove previous wins
  document.querySelectorAll('.teamBtn').forEach(b=>b.classList.remove('win'));
  const btn = document.getElementById(buttonId);
  btn.classList.add('win');
}

// handlers
// Q1: if pick winner among r1/r2
document.getElementById('q1_home').addEventListener('click', ()=>{
  state.q1Winner = r1; state.q1Loser = r2;
  markWin('q1_home');
  updateAfterQ1();
});
document.getElementById('q1_away').addEventListener('click', ()=>{
  state.q1Winner = r2; state.q1Loser = r1;
  markWin('q1_away');
  updateAfterQ1();
});

// Eliminator
document.getElementById('el_home').addEventListener('click', ()=>{
  state.elWinner = r3; state.elLoser = r4;
  markWin('el_home');
  updateAfterEliminator();
});
document.getElementById('el_away').addEventListener('click', ()=>{
  state.elWinner = r4; state.elLoser = r3;
  markWin('el_away');
  updateAfterEliminator();
});

function updateAfterQ1(){
  // Q1 loser will play winner of Eliminator in Q2 (if elWinner known)
  if(state.elWinner){
    document.getElementById('q2_home').textContent = state.q1Loser;
    document.getElementById('q2_away').textContent = state.elWinner;
  } else {
    // show placeholder: Q1 loser vs (Winner Elim)
    document.getElementById('q2_home').textContent = state.q1Loser;
    document.getElementById('q2_away').textContent = "Winner Eliminator";
  }
  // Final placeholder: Q1 winner as one side
  document.getElementById('final_home').textContent = state.q1Winner;
  document.getElementById('final_away').textContent = state.q2Winner || "Winner Q2";
}

function updateAfterEliminator(){
  if(state.q1Loser){
    document.getElementById('q2_home').textContent = state.q1Loser;
    document.getElementById('q2_away').textContent = state.elWinner;
  } else {
    document.getElementById('q2_home').textContent = "Loser Q1";
    document.getElementById('q2_away').textContent = state.elWinner;
  }
  // if Q1 winner exists set final home
  if(state.q1Winner) document.getElementById('final_home').textContent = state.q1Winner;
  document.getElementById('final_away').textContent = state.q2Winner || "Winner Q2";
}

// Q2 handlers (these buttons will be clickable once Q2 sides are set)
document.getElementById('q2_home').addEventListener('click', ()=>{
  // only allow if both teams known
  const a = document.getElementById('q2_home').textContent;
  const b = document.getElementById('q2_away').textContent;
  if(a && b && a!=="TBD" && b!=="TBD" && a!=="Loser Q1" && b!=="Winner Eliminator"){
    state.q2Winner = a; state.q2Loser = b;
    markWin('q2_home');
    document.getElementById('final_away').textContent = state.q2Winner;
  } else {
    // if placeholder, ignore
  }
});
document.getElementById('q2_away').addEventListener('click', ()=>{
  const a = document.getElementById('q2_home').textContent;
  const b = document.getElementById('q2_away').textContent;
  if(a && b && a!=="TBD" && b!=="TBD" && a!=="Loser Q1" && b!=="Winner Eliminator"){
    state.q2Winner = b; state.q2Loser = a;
    markWin('q2_away');
    document.getElementById('final_away').textContent = state.q2Winner;
  }
});

// Final handlers
document.getElementById('final_home').addEventListener('click', ()=>{
  const a = document.getElementById('final_home').textContent;
  const b = document.getElementById('final_away').textContent;
  if(a && b && a!=="TBD" && b!=="TBD"){
    state.finalWinner = a;
    markWin('final_home');
    alert('Champion: ' + state.finalWinner);
  }
});
document.getElementById('final_away').addEventListener('click', ()=>{
  const a = document.getElementById('final_home').textContent;
  const b = document.getElementById('final_away').textContent;
  if(a && b && a!=="TBD" && b!=="TBD"){
    state.finalWinner = b;
    markWin('final_away');
    alert('Champion: ' + state.finalWinner);
  }
});

// Reset
document.getElementById('resetBtn').addEventListener('click', ()=>{
  // clear state and UI
  for(let k of ['q1Winner','q1Loser','elWinner','elLoser','q2Winner','q2Loser','finalWinner']) state[k]=null;
  setInitialButtons();
  document.querySelectorAll('.teamBtn').forEach(b=>b.classList.remove('win'));
});


// initialize placeholders if we already have winners (none)
updateAfterQ1();
updateAfterEliminator();
