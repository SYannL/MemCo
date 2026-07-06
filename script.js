const architecture = document.querySelector('.architecture');
const modeButtons = [...document.querySelectorAll('.mode-button')];
const stageDots = [...document.querySelectorAll('.stage-dot')];
const statusIndex = document.querySelector('.status-index');
const statusTitle = document.querySelector('.flow-status strong');
const statusText = document.querySelector('.flow-status p');

const copy = {
  train: [
    ['01', 'Construct local graph memory', 'Outcome-annotated trajectories preserve actions, failures, corrections, and scene grounding.'],
    ['02', 'Promote transferable workflows', 'Clients abstract scene details and send only reliable workflow, repair, and precondition candidates.'],
    ['03', 'Aggregate global experience', 'The server aligns cross-agent support and updates a shared global workflow memory.']
  ],
  infer: [
    ['01', 'Observe the unseen state', 'The agent identifies its goal, current state, available actions, and decision phase.'],
    ['02', 'Retrieve complementary evidence', 'Local memory grounds executable choices while global memory contributes transferable procedures.'],
    ['03', 'Render decisive context', 'Adaptive routing composes grounding, workflow, and failure caution before the next action.']
  ]
};

let mode = 'train';
let stage = 0;
let timer;

function render() {
  architecture.dataset.mode = mode;
  architecture.classList.remove('stage-0', 'stage-1', 'stage-2');
  architecture.classList.add(`stage-${stage}`);
  document.querySelectorAll('.agent').forEach((agent, index) => agent.classList.toggle('active', stage === 0 && index === 0));
  stageDots.forEach((dot, index) => dot.classList.toggle('active', index === stage));
  const [index, title, text] = copy[mode][stage];
  statusIndex.textContent = index;
  statusTitle.textContent = title;
  statusText.textContent = text;
}

function restartTimer() {
  clearInterval(timer);
  timer = setInterval(() => {
    stage = (stage + 1) % 3;
    render();
  }, 4200);
}

function setStage(next) {
  stage = (next + 3) % 3;
  render();
  restartTimer();
}

modeButtons.forEach(button => button.addEventListener('click', () => {
  mode = button.dataset.mode;
  stage = 0;
  modeButtons.forEach(item => {
    const selected = item === button;
    item.classList.toggle('active', selected);
    item.setAttribute('aria-pressed', String(selected));
  });
  render();
  restartTimer();
}));

stageDots.forEach(dot => dot.addEventListener('click', () => setStage(Number(dot.dataset.stage))));
document.querySelector('#previous-stage').addEventListener('click', () => setStage(stage - 1));
document.querySelector('#next-stage').addEventListener('click', () => setStage(stage + 1));

document.querySelector('#copy-citation').addEventListener('click', async event => {
  const button = event.currentTarget;
  try {
    await navigator.clipboard.writeText(button.dataset.copy);
    button.textContent = 'Copied';
    setTimeout(() => { button.textContent = 'Copy plain citation'; }, 1600);
  } catch {
    button.textContent = 'Copy unavailable';
  }
});

render();
restartTimer();
