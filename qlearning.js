let episode = 1;
let qTable = null; // Will load from JSON

// Binning thresholds (must match what was used in Python)
const bins = [
  [-4.8, -2.4, 0, 2.4, 4.8],           // x
  [-5, -2.5, 0, 2.5, 5],               // xDot
  [-0.418, -0.2, 0, 0.2, 0.418],       // theta
  [-5, -2.5, 0, 2.5, 5]                // thetaDot
];

function digitize(value, binEdges) {
  for (let i = 0; i < binEdges.length; i++) {
    if (value < binEdges[i]) return i;
  }
  return binEdges.length;
}

function getAction() {
  if (!qTable) return state.theta > 0 ? 1 : 0;

  const s = [
    digitize(state.x, bins[0]),
    digitize(state.xDot, bins[1]),
    digitize(state.theta, bins[2]),
    digitize(state.thetaDot, bins[3])
  ];

  try {
    let ref = qTable;
    for (let i = 0; i < 4; i++) ref = ref[s[i]];
    return ref.indexOf(Math.max(...ref));
  } catch (e) {
    console.warn("Invalid state access:", s);
    return 0;
  }
}

function update() {
  const action = getAction();
  step(action);
  draw();
  document.getElementById("episode").textContent = episode;

  if (Math.abs(state.theta) > Math.PI / 6 || state.x < 50 || state.x > 550) {
    episode++;
    state = {
      x: 300,
      xDot: 0,
      theta: (Math.random() - 0.5) * 0.2,
      thetaDot: 0
    };
  }

  requestAnimationFrame(update);
}

fetch("q_table.json")
  .then(res => res.json())
  .then(data => { qTable = data; update(); })
  .catch(() => update());
