// ── 설정 ──
// ⚠️  API 키를 여기에 직접 넣지 마세요.
// 로컬 테스트 시에만 사용하고, 프로덕션에서는 서버를 통해 키를 관리하세요.
// 자세한 내용은 README.md "API 키 보안" 섹션을 참고하세요.
const CONFIG = {
  apiUrl: 'https://api.anthropic.com/v1/messages',
  model: 'claude-sonnet-4-20250514',
  maxTokens: 1000,
  // apiKey: 'sk-ant-...'  ← 직접 입력 대신 환경변수나 서버 프록시 사용 권장
};

// ── 상태 ──
let selectedEmotion = '';
let chatHistory = [];
let breatheRunning = false;
let breatheTimer = null;
let breatheCycle = 0;

// ── 위로 카드 콘텐츠 ──
const AFFIRMATIONS = [
  "마음대로 안 되는 것들이 있어도, 그게 당신의 실패가 아니에요.",
  "지금 이 감정은 영원하지 않아요. 파도처럼 왔다가 가게 되어 있어요.",
  "통제할 수 없는 것들이 있어요. 그래도 괜찮아요.",
  "오늘 하루도 버텨낸 당신은 충분히 잘하고 있어요.",
  "완벽하지 않아도 당신은 충분히 가치 있는 사람이에요.",
  "힘들 때 쉬어가는 것도 용기예요.",
  "지금 느끼는 감정은 틀린 게 아니에요. 그냥 지금의 당신이에요.",
];

// ── 호흡 단계 ──
const BREATHE_PHASES = [
  { name: '들이쉬기', duration: 4000, anim: 'inhale' },
  { name: '잠깐 멈춤', duration: 4000, anim: 'hold' },
  { name: '내쉬기',   duration: 6000, anim: 'exhale' },
  { name: '쉬기',     duration: 2000, anim: 'rest' },
];

// ── AI 시스템 프롬프트 ──
function getSystemPrompt() {
  return `당신은 따뜻하고 공감 능력이 뛰어난 마음 상담 AI입니다.
사용자가 '${selectedEmotion}' 감정 상태로 접속했습니다.

다음 원칙을 따르세요:
- 판단하지 않고 진심으로 공감해주세요
- 강요하지 말고 부드럽게 안내하세요
- 해결책보다 먼저 감정을 인정해주세요
- 따뜻하고 친근한 한국어로 말해주세요 (존댓말 사용)
- 한 번에 너무 많은 내용을 쏟아내지 마세요
- 필요할 때 호흡법이나 글쓰기를 추천할 수 있어요

※ 이 서비스는 전문 심리상담을 대체하지 않습니다.`;
}

// ── Claude API 호출 ──
async function callClaude(messages, systemPrompt) {
  const apiKey = window.ANTHROPIC_API_KEY || CONFIG.apiKey;
  if (!apiKey) {
    throw new Error('API 키가 설정되지 않았습니다. index.html 상단의 주석을 참고하세요.');
  }

  const res = await fetch(CONFIG.apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: CONFIG.model,
      max_tokens: CONFIG.maxTokens,
      system: systemPrompt,
      messages,
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || `HTTP ${res.status}`);
  }

  const data = await res.json();
  return data.content?.[0]?.text || '';
}

// ── 화면 전환 ──
function selectEmotion(btn) {
  document.querySelectorAll('.emotion-btn').forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected');
  selectedEmotion = btn.dataset.emotion;
  document.getElementById('startBtn').classList.add('enabled');
}

function startApp() {
  if (!selectedEmotion) return;
  document.getElementById('welcome').classList.remove('active');
  document.getElementById('app').classList.add('active');
  document.getElementById('moodTag').textContent = selectedEmotion;
  loadAffirmations();
  sendInitialMessage();
}

function goBack() {
  resetBreathe();
  chatHistory = [];
  document.getElementById('chatMessages').innerHTML = '';
  document.getElementById('app').classList.remove('active');
  document.getElementById('welcome').classList.add('active');
}

function switchTab(tab, btn) {
  document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById('panel-' + tab).classList.add('active');
}

// ── 위로 카드 ──
function loadAffirmations() {
  const container = document.getElementById('affirmationCards');
  const shuffled = [...AFFIRMATIONS].sort(() => Math.random() - 0.5).slice(0, 3);
  container.innerHTML = shuffled.map(a => `
    <div class="affirmation-card">
      <div class="affirmation-card-dot"></div>
      <span>${a}</span>
    </div>
  `).join('');
}

// ── 채팅 ──
function appendMessage(who, text) {
  const container = document.getElementById('chatMessages');
  const div = document.createElement('div');
  div.className = `msg ${who}`;
  div.innerHTML = `
    <div class="msg-sender">${who === 'ai' ? '마음공간' : '나'}</div>
    <div class="msg-bubble">${text.replace(/\n/g, '<br>')}</div>
  `;
  container.appendChild(div);
  container.scrollTop = container.scrollHeight;
}

function showTyping() {
  const container = document.getElementById('chatMessages');
  const div = document.createElement('div');
  div.className = 'msg ai';
  div.id = 'typingMsg';
  div.innerHTML = `
    <div class="msg-sender">마음공간</div>
    <div class="typing-indicator">
      <div class="dot"></div><div class="dot"></div><div class="dot"></div>
    </div>`;
  container.appendChild(div);
  container.scrollTop = container.scrollHeight;
}

function removeTyping() {
  const t = document.getElementById('typingMsg');
  if (t) t.remove();
}

async function sendInitialMessage() {
  chatHistory = [{
    role: 'user',
    content: `저는 지금 ${selectedEmotion} 상태예요. 공감해주세요.`
  }];
  showTyping();
  try {
    const reply = await callClaude(chatHistory, getSystemPrompt());
    chatHistory.push({ role: 'assistant', content: reply });
    removeTyping();
    appendMessage('ai', reply);
  } catch (e) {
    removeTyping();
    appendMessage('ai', `연결에 문제가 생겼어요. (${e.message})\n\n그래도 이 공간에서 편하게 쉬어 가세요 🌿`);
  }
}

async function sendMessage() {
  const input = document.getElementById('chatInput');
  const text = input.value.trim();
  if (!text) return;

  input.value = '';
  input.style.height = 'auto';
  appendMessage('user', text);
  chatHistory.push({ role: 'user', content: text });

  showTyping();
  try {
    const reply = await callClaude(chatHistory, getSystemPrompt());
    chatHistory.push({ role: 'assistant', content: reply });
    removeTyping();
    appendMessage('ai', reply);
  } catch (e) {
    removeTyping();
    appendMessage('ai', '잠시 연결이 끊겼어요. 다시 시도해주세요 🌱');
  }
}

function handleKey(e) {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
}

function autoResize(el) {
  el.style.height = 'auto';
  el.style.height = Math.min(el.scrollHeight, 100) + 'px';
}

// ── 호흡 ──
function startBreathe() {
  if (breatheRunning) return;
  breatheRunning = true;
  breatheCycle = 0;
  runPhase(0);
}

function runPhase(idx) {
  if (!breatheRunning) return;
  const phase = BREATHE_PHASES[idx % BREATHE_PHASES.length];
  const circle = document.getElementById('breatheCircle');

  circle.className = 'breathe-circle ' + phase.anim;
  circle.textContent = phase.name;
  document.getElementById('breathePhase').textContent = phase.name;

  if (idx > 0 && idx % BREATHE_PHASES.length === 0) breatheCycle++;
  document.getElementById('breatheCount').textContent =
    breatheCycle > 0 ? `${breatheCycle}번째 호흡` : '';

  breatheTimer = setTimeout(() => runPhase(idx + 1), phase.duration);
}

function resetBreathe() {
  breatheRunning = false;
  clearTimeout(breatheTimer);
  breatheCycle = 0;
  const circle = document.getElementById('breatheCircle');
  if (circle) {
    circle.className = 'breathe-circle';
    circle.textContent = '시작';
  }
  const phaseEl = document.getElementById('breathePhase');
  if (phaseEl) phaseEl.textContent = '원을 누르면 시작해요';
  const countEl = document.getElementById('breatheCount');
  if (countEl) countEl.textContent = '';
}

// ── 감정 일기 ──
async function analyzeJournal() {
  const text = document.getElementById('journalText').value.trim();
  if (!text) {
    alert('먼저 마음을 적어보세요.');
    return;
  }

  const insight = document.getElementById('journalInsight');
  const insightText = document.getElementById('insightText');
  insight.classList.add('visible');
  insightText.innerHTML = '<div class="insight-loading"><div class="i-dot"></div><div class="i-dot"></div><div class="i-dot"></div></div>';

  try {
    const reply = await callClaude(
      [{ role: 'user', content: `내 일기:\n"${text}"\n\n이 감정들에 대해 공감해주세요.` }],
      `당신은 따뜻한 마음 상담 전문가입니다.
사용자가 적은 일기를 읽고, 감정을 인정하고 위로하는 짧은 인사이트를 3-4문장으로 작성하세요.
판단하거나 충고하지 말고, 한국어 존댓말로 따뜻하게 작성하세요.`
    );
    insightText.textContent = reply;
  } catch (e) {
    insightText.textContent = '연결이 안 됐어요. 그래도 당신의 감정은 소중해요 🌿';
  }
}

function clearJournal() {
  document.getElementById('journalText').value = '';
  const insight = document.getElementById('journalInsight');
  insight.classList.remove('visible');
}
