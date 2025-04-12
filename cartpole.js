const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let state = {
  x: 300, xDot: 0,
  theta: 0.1, thetaDot: 0
};

const gravity = 9.8;
const massCart = 1.0, massPole = 0.1, totalMass = massCart + massPole;
const length = 100, poleMassLength = massPole * length;
const forceMag = 10.0, tau = 0.02;

function step(action) {
  let { x, xDot, theta, thetaDot } = state;
  const force = action === 1 ? forceMag : -forceMag;
  const costheta = Math.cos(theta), sintheta = Math.sin(theta);
  const temp = (force + poleMassLength * thetaDot * thetaDot * sintheta) / totalMass;

  const thetaAcc = (gravity * sintheta - costheta * temp) /
    (length * (4.0 / 3.0 - massPole * costheta * costheta / totalMass));
  const xAcc = temp - poleMassLength * thetaAcc * costheta / totalMass;

  state.x += tau * xDot;
  state.xDot += tau * xAcc;
  state.theta += tau * thetaDot;
  state.thetaDot += tau * thetaAcc;
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const cartWidth = 50, cartHeight = 30;

  ctx.fillStyle = "#222";
  ctx.fillRect(state.x - cartWidth / 2, 300, cartWidth, cartHeight);

  ctx.save();
  ctx.translate(state.x, 300);
  ctx.rotate(state.theta);
  ctx.fillStyle = "#e91e63";
  ctx.fillRect(-5, 0, 10, -length);
  ctx.restore();
}
