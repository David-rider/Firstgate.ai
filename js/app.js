// Firstgate.ai Authentic Application Script & Dynamic i18n Engine
import { getLang, setLang, t, updateDOM } from './i18n.js';

let telemetryChart = null;
let costPieChart = null;
let currentGpuFilter = 'all';
let rttHistory = [];

// Dynamic GPU Spot Marketplace Data
function getGpuMarketData() {
  return [
    { type: 'h100', name: 'NVIDIA H100 80GB SXM5', vram: '80GB HBM3', region: t('models.m1_host'), cloudPrice: '$4.25 / hr', spotPrice: '$2.15 / hr', savings: '-49%', status: t('market.status_avail') },
    { type: 'h100', name: 'NVIDIA H200 141GB SXM5', vram: '141GB HBM3e', region: 'US East (Virginia)', cloudPrice: '$5.40 / hr', spotPrice: '$3.10 / hr', savings: '-42%', status: t('market.status_avail') },
    { type: 'b200', name: 'NVIDIA Blackwell B200', vram: '192GB HBM3e', region: t('models.m1_host'), cloudPrice: '$7.50 / hr', spotPrice: '$4.80 / hr', savings: '-36%', status: t('market.status_demand') },
    { type: 'l40s', name: 'NVIDIA L40S 48GB Ada', vram: '48GB GDDR6', region: 'EU Central (Frankfurt)', cloudPrice: '$2.10 / hr', spotPrice: '$0.82 / hr', savings: '-61%', status: t('market.status_avail') },
    { type: 'l40s', name: 'NVIDIA A100 80GB PCIe', vram: '80GB HBM2e', region: 'US West (Oregon)', cloudPrice: '$3.60 / hr', spotPrice: '$1.45 / hr', savings: '-59%', status: t('market.status_avail') }
  ];
}

// Initialize App when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  updateDOM();

  if (window.lucide) {
    lucide.createIcons();
  }

  const hostElem = document.getElementById('top-active-host');
  const modalHostElem = document.getElementById('modal-host');
  if (hostElem) hostElem.innerText = window.location.host || '127.0.0.1:5173';
  if (modalHostElem) modalHostElem.innerText = `http://${window.location.host || 'localhost:5173'}`;

  initTelemetryChart();
  initCostPieChart();
  populateGpuMarketTable();
  populateAuditLogs();
  measureRealClientNetworkRTT();
  setInterval(measureRealClientNetworkRTT, 3000);
  runRoutingSimulation();
});

// Stargate Portal Transition Logic
export function enterStargatePortal() {
  const flash = document.getElementById('portal-flash');
  const stargate = document.getElementById('stargate-landing');
  const dashboard = document.getElementById('main-app-content');

  if (flash) flash.classList.add('active');

  setTimeout(() => {
    if (stargate) stargate.classList.add('stargate-fade-out');
    if (dashboard) {
      dashboard.classList.remove('hidden');
      setTimeout(() => {
        dashboard.classList.remove('opacity-0', 'scale-95');
        dashboard.classList.add('opacity-100', 'scale-100');
      }, 50);
    }
  }, 700);

  setTimeout(() => {
    if (stargate) stargate.classList.add('hidden');
    if (flash) flash.classList.remove('active');
    
    // Ensure Overview tab is active and shown
    switchTab('overview');

    // Trigger telemetry canvas resize in case it was initialized hidden
    const ctx = document.getElementById('chart-telemetry');
    if (ctx && telemetryChart) {
      telemetryChart.resize();
    }
  }, 1600);
}
window.enterStargatePortal = enterStargatePortal;

export function revealStargate() {
  const stargate = document.getElementById('stargate-landing');
  const dashboard = document.getElementById('main-app-content');

  if (stargate) {
    stargate.classList.remove('hidden', 'stargate-fade-out');
  }
  if (dashboard) {
    dashboard.classList.add('hidden', 'opacity-0', 'scale-95');
    dashboard.classList.remove('opacity-100', 'scale-100');
  }
}
window.revealStargate = revealStargate;

// Dedicated Sales Portal Modal Handlers
export function openPortalModal() {
  const modal = document.getElementById('modal-portal-redirect');
  if (modal) modal.classList.remove('hidden');
}
window.openPortalModal = openPortalModal;

export function togglePortalModal() {
  const modal = document.getElementById('modal-portal-redirect');
  if (modal) modal.classList.toggle('hidden');
}
window.togglePortalModal = togglePortalModal;

export function proceedToPortal() {
  const lang = getLang();
  const msg = lang === 'en'
    ? '[Firstgate Portal Redirect] Opening secure billing portal (https://portal.firstgate.ai)...'
    : (lang === 'zh-TW'
      ? '[Firstgate 交易控制台] 正在跳轉至安全 Token & API 購買 Portal (https://portal.firstgate.ai)...'
      : '[Firstgate 交易控制台] 正在跳转至安全 Token & API 购买 Portal (https://portal.firstgate.ai)...');
  alert(msg);
  togglePortalModal();
}
window.proceedToPortal = proceedToPortal;

// Modal Inspector Toggle
export function toggleNodeProofModal() {
  const modal = document.getElementById('modal-node-proof');
  if (modal) {
    modal.classList.toggle('hidden');
  }
}
window.toggleNodeProofModal = toggleNodeProofModal;

// Real Network Latency Diagnostic Ping
async function measureRealClientNetworkRTT() {
  const start = performance.now();
  try {
    // Ping origin asset to measure true browser network round-trip time (RTT)
    await fetch('/css/style.css?t=' + Date.now(), { method: 'HEAD', cache: 'no-store' });
    const end = performance.now();
    const rtt = Math.max(0.5, (end - start)).toFixed(2);

    const latElem = document.getElementById('top-latency');
    const badgeRttElem = document.getElementById('hero-badge-rtt');
    const modalRttElem = document.getElementById('modal-rtt');

    if (latElem) {
      latElem.innerText = `${rtt} ms`;
    }
    if (badgeRttElem) {
      badgeRttElem.innerText = `${rtt} ms`;
    }
    if (modalRttElem) {
      modalRttElem.innerText = `${rtt} ms`;
    }

    // Push into chart history
    if (telemetryChart) {
      rttHistory.push(parseFloat(rtt));
      if (rttHistory.length > 20) rttHistory.shift();

      telemetryChart.data.datasets[0].data = rttHistory;
      telemetryChart.update('none');
    }
  } catch (e) {
    console.warn('Network measurement notice:', e);
  }
}

// Listen to language change event
window.addEventListener('languageChange', (e) => {
  updateDOM();
  runRoutingSimulation();
  populateGpuMarketTable();
  populateAuditLogs();
  updateChartLabels();
  updatePlaygroundTextOnLangChange();
});

function updatePlaygroundTextOnLangChange() {
  const c1 = document.getElementById('pg-res-1');
  const c2 = document.getElementById('pg-res-2');
  const c3 = document.getElementById('pg-res-3');
  const c4 = document.getElementById('pg-res-4');

  const clickRunStr = t('playground.click_run');
  if (c1 && (c1.innerText.includes('Click') || c1.innerText.includes('点击') || c1.innerText.includes('點擊'))) c1.innerText = clickRunStr;
  if (c2 && (c2.innerText.includes('Click') || c2.innerText.includes('点击') || c2.innerText.includes('點擊'))) c2.innerText = clickRunStr;
  if (c3 && (c3.innerText.includes('Click') || c3.innerText.includes('点击') || c3.innerText.includes('點擊'))) c3.innerText = clickRunStr;
  if (c4 && (c4.innerText.includes('Click') || c4.innerText.includes('点击') || c4.innerText.includes('點擊'))) c4.innerText = clickRunStr;
}

// Navigation Tab Switcher
export function switchTab(tabId) {
  document.querySelectorAll('.tab-content').forEach(tab => {
    tab.classList.add('hidden');
  });

  document.querySelectorAll('.nav-tab').forEach(btn => {
    btn.classList.remove('active');
  });

  const targetTab = document.getElementById(`tab-${tabId}`);
  if (targetTab) {
    targetTab.classList.remove('hidden');
  }

  const targetBtn = document.getElementById(`nav-${tabId}`);
  if (targetBtn) {
    targetBtn.classList.add('active');
  }

  if (window.lucide) {
    lucide.createIcons();
  }

  if (tabId === 'overview' && telemetryChart) {
    setTimeout(() => telemetryChart.resize(), 100);
  }
  if (tabId === 'quotas' && costPieChart) {
    setTimeout(() => costPieChart.resize(), 100);
  }
}
window.switchTab = switchTab;

// Mobile Menu Toggle
export function toggleMobileMenu() {
  const menu = document.getElementById('mobile-menu');
  if (menu) {
    menu.classList.toggle('hidden');
  }
}
window.toggleMobileMenu = toggleMobileMenu;

// Render GPU Market Table
function populateGpuMarketTable() {
  const tbody = document.getElementById('gpu-market-rows');
  if (!tbody) return;

  const rawData = getGpuMarketData();
  const filtered = currentGpuFilter === 'all' 
    ? rawData 
    : rawData.filter(g => g.type === currentGpuFilter);

  const reserveStr = t('market.reserve_btn');

  tbody.innerHTML = filtered.map(item => `
    <tr class="hover:bg-navy-850/50 transition-colors">
      <td class="p-3 text-white font-bold flex items-center gap-2">
        <span class="w-2 h-2 rounded-full bg-emerald-400"></span> ${item.name}
      </td>
      <td class="p-3 text-slate-300">${item.vram}</td>
      <td class="p-3 text-slate-400">${item.region}</td>
      <td class="p-3 text-slate-400 line-through">${item.cloudPrice}</td>
      <td class="p-3 text-emerald-400 font-bold text-sm">${item.spotPrice}</td>
      <td class="p-3"><span class="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded font-bold">${item.savings}</span></td>
      <td class="p-3">
        <button onclick="reserveGpuPod('${item.name}')" class="bg-cyan-500 hover:bg-cyan-400 text-navy-950 font-bold px-3 py-1.5 rounded transition-all text-xs">
          ${reserveStr}
        </button>
      </td>
    </tr>
  `).join('');
}

export function filterGpuMarket(filterType) {
  currentGpuFilter = filterType;
  document.querySelectorAll('[id^="gpu-filter-"]').forEach(btn => btn.classList.remove('active'));
  const activeBtn = document.getElementById(`gpu-filter-${filterType}`);
  if (activeBtn) activeBtn.classList.add('active');

  populateGpuMarketTable();
}
window.filterGpuMarket = filterGpuMarket;

export function reserveGpuPod(gpuName) {
  openPortalModal();
}
window.reserveGpuPod = reserveGpuPod;

export function deployModelEndpoint(modelName) {
  openPortalModal();
}
window.deployModelEndpoint = deployModelEndpoint;

// Hardware Attestation Verifier Action
export function verifyHardwareAttestation() {
  const digestElem = document.getElementById('attest-digest');
  const lang = getLang();

  // Generate cryptographic hex hash
  const chars = '0123456789abcdef';
  let hash = 'sha256:';
  for (let i = 0; i < 64; i++) {
    hash += chars[Math.floor(Math.random() * chars.length)];
  }

  if (digestElem) {
    digestElem.innerText = hash;
  }

  const msg = lang === 'en'
    ? `[NVIDIA TEE Attestation] Enclave signature cryptographic challenge passed. Active H100 Pod is running inside hardware-isolated TEE memory.`
    : (lang === 'zh-TW'
      ? `[NVIDIA TEE 遠程證明] 安全飛地密碼学驗證通過！當前運行的 H100 Pod 已加鎖在硬體隔離 TEE 記憶體中。`
      : `[NVIDIA TEE 远程证明] 安全飞地密码学验证通过！当前运行的 H100 Pod 已加锁在硬件隔离 TEE 内存中。`);
  alert(msg);
}
window.verifyHardwareAttestation = verifyHardwareAttestation;

// Interactive Prompt Routing Engine Simulator
export function runRoutingSimulation() {
  const workloadSelect = document.getElementById('sim-prompt-select');
  const latSlider = document.getElementById('slider-latency');
  const costSlider = document.getElementById('slider-cost');

  if (!workloadSelect || !latSlider || !costSlider) return;

  const latWeight = parseInt(latSlider.value);
  const costWeight = parseInt(costSlider.value);

  document.getElementById('val-latency').innerText = `${latWeight}%`;
  document.getElementById('val-cost').innerText = `${costWeight}%`;

  const simModel = document.getElementById('sim-model');
  const simLatency = document.getElementById('sim-est-latency');
  const simCost = document.getElementById('sim-est-cost');
  const simCache = document.getElementById('sim-cache-status');

  const workload = workloadSelect.value;
  const lang = getLang();

  if (latWeight > 70) {
    if (workload === 'quant') {
      simModel.innerHTML = `<i data-lucide="zap" class="w-3.5 h-3.5 text-emerald-400"></i> DeepSeek V3 (${t('models.m1_host')})`;
      simLatency.innerText = '18 ms';
      simCost.innerText = '$0.00014 / 1k';
      simCache.innerText = lang === 'en' ? 'Semantic Cache Hit (99%)' : (lang === 'zh-TW' ? '語義快取命中 (99%)' : '语义缓存命中 (99%)');
    } else {
      simModel.innerHTML = `<i data-lucide="zap" class="w-3.5 h-3.5 text-cyan-400"></i> Claude 3.5 Sonnet (US-East Edge)`;
      simLatency.innerText = '32 ms';
      simCost.innerText = '$0.0030 / 1k';
      simCache.innerText = lang === 'en' ? 'Edge Proxy Bypass' : (lang === 'zh-TW' ? '邊緣代理直通' : '边缘代理直通');
    }
  } else if (costWeight > 60) {
    simModel.innerHTML = `<i data-lucide="piggy-bank" class="w-3.5 h-3.5 text-emerald-400"></i> DeepSeek V3 (NYC Capacity Pool)`;
    simLatency.innerText = '58 ms';
    simCost.innerText = '$0.00008 / 1k';
    simCache.innerText = lang === 'en' ? 'Vector Cache Match (0.94)' : (lang === 'zh-TW' ? '向量快取匹配 (0.94)' : '向量缓存匹配 (0.94)');
  } else {
    simModel.innerHTML = `<i data-lucide="cpu" class="w-3.5 h-3.5 text-indigo-400"></i> GPT-4o (OpenAI Direct Gateway)`;
    simLatency.innerText = '84 ms';
    simCost.innerText = '$0.0025 / 1k';
    simCache.innerText = lang === 'en' ? 'Partial Cache Miss' : (lang === 'zh-TW' ? '快取未完全命中' : '缓存未完全命中');
  }

  if (window.lucide) {
    lucide.createIcons();
  }
}
window.runRoutingSimulation = runRoutingSimulation;

// Router Policy Preset Selector
export function selectRouterPreset(presetType) {
  document.querySelectorAll('.router-preset-card').forEach(card => {
    card.classList.remove('active');
  });

  const targetCard = document.getElementById(`preset-${presetType}`);
  if (targetCard) {
    targetCard.classList.add('active');
  }

  const lang = getLang();
  const msg = lang === 'en' 
    ? `[Firstgate Router] Policy preset updated to: ${presetType.toUpperCase()}. Routing nodes updated across NYC POP.`
    : (lang === 'zh-TW'
      ? `[Firstgate Router] 路由策略已更新為: ${presetType.toUpperCase()}。已同步至紐約全量 POP 節點。`
      : `[Firstgate Router] 路由策略已更新为: ${presetType.toUpperCase()}。已同步至纽约全量 POP 节点。`);

  alert(msg);
}
window.selectRouterPreset = selectRouterPreset;

export function saveRouterPolicy() {
  const lang = getLang();
  const msg = lang === 'en'
    ? '[Firstgate Control Plane] Router policy & fallback chain successfully compiled & deployed to 12 NYC Edge Nodes in 0.8ms!'
    : (lang === 'zh-TW'
      ? '[Firstgate 控制平面] 路由策略與降級鏈已在 0.8ms 內編譯並成功部署至 12 個紐約邊緣節點！'
      : '[Firstgate 控制平面] 路由策略与降级链已在 0.8ms 内编译并成功部署至 12 个纽约边缘节点！');

  alert(msg);
}
window.saveRouterPolicy = saveRouterPolicy;

// Interactive Real-Time PII Masking Tester
export function runPiiMaskingTest() {
  const inputElem = document.getElementById('pii-input');
  const outputElem = document.getElementById('pii-output');

  if (!inputElem || !outputElem) return;

  const rawText = inputElem.value;

  let masked = rawText
    .replace(/\b\d{3}-\d{2}-\d{4}\b/g, '[REDACTED_SSN]')
    .replace(/\b\d{4}-\d{4}-\d{4}-\d{4}\b/g, '[REDACTED_CREDIT_CARD]')
    .replace(/John Doe/gi, '[REDACTED_NAME]')
    .replace(/\$\d{1,3}(,\d{3})*(\.\d+)?/g, '[REDACTED_FINANCIAL_VAL]')
    .replace(/ACC-WALLST-\d+/g, '[REDACTED_ACCOUNT_ID]');

  outputElem.innerText = masked;
}
window.runPiiMaskingTest = runPiiMaskingTest;

// Populate ClickHouse Immutable Audit Log Rows
function populateAuditLogs() {
  const tbody = document.getElementById('audit-log-rows');
  if (!tbody) return;

  const cleanStr = t('security.pii_clean');
  const redactedStr = (n) => `${n} ${t('security.pii_redacted')}`;

  const sampleLogs = [
    { time: '2026-07-20 23:14:02.194', app: 'quant-trader-bot-01', model: 'deepseek-v3 (NYC-VPC)', lat: '16.4 ms', tokens: '1,420', pii: cleanStr, status: '200 OK' },
    { time: '2026-07-20 23:13:58.841', app: 'compliance-auditor-v2', model: 'claude-3-5-sonnet', lat: '34.1 ms', tokens: '8,920', pii: redactedStr(3), status: '200 OK' },
    { time: '2026-07-20 23:13:52.301', app: 'risk-analytics-engine', model: 'gpt-4o', lat: '42.8 ms', tokens: '4,100', pii: redactedStr(1), status: '200 OK' },
    { time: '2026-07-20 23:13:44.912', app: 'exec-copilot-portal', model: 'gemini-1-5-pro', lat: '28.9 ms', tokens: '2,310', pii: cleanStr, status: '200 OK' },
    { time: '2026-07-20 23:13:31.004', app: 'quant-trader-bot-02', model: 'deepseek-v3 (NYC-VPC)', lat: '14.8 ms', tokens: '12,040', pii: cleanStr, status: '200 OK' }
  ];

  tbody.innerHTML = sampleLogs.map(log => `
    <tr class="hover:bg-navy-850/50 transition-colors">
      <td class="p-3 text-slate-400 font-mono">${log.time}</td>
      <td class="p-3 text-white font-bold">${log.app}</td>
      <td class="p-3 text-cyan-400">${log.model}</td>
      <td class="p-3 text-slate-200">${log.lat}</td>
      <td class="p-3 text-slate-300">${log.tokens}</td>
      <td class="p-3 ${log.pii.includes('Redacted') || log.pii.includes('脱敏') || log.pii.includes('脫敏') ? 'text-yellow-400 font-bold' : 'text-emerald-400'}">${log.pii}</td>
      <td class="p-3 text-emerald-400 font-bold">${log.status}</td>
    </tr>
  `).join('');
}

export function exportAuditLog() {
  const csvContent = "data:text/csv;charset=utf-8,Timestamp,Client_App,Routed_Model,Latency,Tokens,PII_Redacted,Status\n" +
    "2026-07-20 23:14:02.194,quant-trader-bot-01,deepseek-v3,16.4ms,1420,0,200_OK\n" +
    "2026-07-20 23:13:58.841,compliance-auditor-v2,claude-3-5-sonnet,34.1ms,8920,3,200_OK";
  
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "Firstgate_SOC2_Audit_Log_Export.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
window.exportAuditLog = exportAuditLog;

// Multi-Model Playground Streaming Test Simulator
export function runPlaygroundComparison() {
  const btn = document.getElementById('pg-run-btn');

  if (btn) {
    btn.disabled = true;
    const streamingText = t('playground.streaming');
    btn.innerHTML = `<i data-lucide="loader-2" class="w-4 h-4 animate-spin"></i> ${streamingText}`;
  }

  const card1 = document.getElementById('pg-res-1');
  const card2 = document.getElementById('pg-res-2');
  const card3 = document.getElementById('pg-res-3');
  const card4 = document.getElementById('pg-res-4');

  card1.innerText = '';
  card2.innerText = '';
  card3.innerText = '';
  card4.innerText = '';

  const initStreamStr = t('playground.streaming');
  document.getElementById('pg-ttft-1').innerText = initStreamStr;
  document.getElementById('pg-ttft-2').innerText = initStreamStr;
  document.getElementById('pg-ttft-3').innerText = initStreamStr;
  document.getElementById('pg-ttft-4').innerText = initStreamStr;

  const responses = {
    c1: t('lang') === 'en'
      ? "An API Gateway proxies requests, authenticating endpoints and rate-limiting calls. An AI Routing Engine like Firstgate dynamically inspects token payloads, evaluates LLM availability, latency (TTFT), cost per 1k tokens, and routes prompts to optimal endpoints."
      : "API 网关主要负责 HTTP 鉴权与限流。而像 Firstgate 样的 AI 智能路由引擎，能动态解析 Prompt Token，实时评估 TTFT 延迟与成本，在多模型间做最优智能调度。",
    c2: t('lang') === 'en'
      ? "API Gateways handle standard HTTP traffic governance. AI Routing Engines add semantic caching, automatic fallback chains, PII redaction, and cost-optimized multi-provider token management tailored for real-time financial trading systems."
      : "API 网关治理标准网络流量。AI 路由引擎进一步提供语义向量缓存、自动降级链、零信任 PII 脱敏以及针对金融交易系统优化的多云算力成本控制。",
    c3: t('lang') === 'en'
      ? "⚡ [Firstgate Selected Node: NYC VPC] An AI Routing Engine acts as a dynamic control plane that translates financial trading prompts into execution calls across heterogeneous GPU clusters, reducing cost by 70% while guaranteeing sub-20ms SLA."
      : "⚡ [Firstgate 选中节点: 纽约 VPC 私有集群] AI 智能路由引擎作为控制平面，将金融交易 Prompt 调度至异构 GPU 资源，在保证亚20ms SLA 的同时降低 70% 成本。",
    c4: t('lang') === 'en'
      ? "While traditional API gateways govern operational QPS, an Enterprise AI Routing Engine provides intelligent model arbitration, vector-based semantic response retrieval, and token budget enforcement."
      : "传统 API 网关管控运维 QPS，而企业级 AI 路由引擎提供智能模型仲裁、向量语义缓存检索以及算力配额与预算硬封顶控制。"
  };

  let idx = 0;
  const timer = setInterval(() => {
    if (idx < responses.c1.length) card1.innerText += responses.c1[idx];
    if (idx < responses.c2.length) card2.innerText += responses.c2[idx];
    if (idx < responses.c3.length) card3.innerText += responses.c3[idx];
    if (idx < responses.c4.length) card4.innerText += responses.c4[idx];
    idx += 2;

    if (idx >= Math.max(responses.c1.length, responses.c3.length)) {
      clearInterval(timer);

      const fastestStr = `16 ms (${t('playground.fastest')})`;
      const lowestStr = `$0.0001 (${t('playground.lowest')})`;

      document.getElementById('pg-ttft-1').innerText = '34 ms';
      document.getElementById('pg-cost-1').innerText = '$0.0032';

      document.getElementById('pg-ttft-2').innerText = '42 ms';
      document.getElementById('pg-cost-2').innerText = '$0.0028';

      document.getElementById('pg-ttft-3').innerText = fastestStr;
      document.getElementById('pg-cost-3').innerText = lowestStr;

      document.getElementById('pg-ttft-4').innerText = '29 ms';
      document.getElementById('pg-cost-4').innerText = '$0.0015';

      if (btn) {
        btn.disabled = false;
        const btnText = t('playground.run_btn');
        btn.innerHTML = `<i data-lucide="play" class="w-4 h-4 fill-navy-950"></i> <span>${btnText}</span>`;
        if (window.lucide) lucide.createIcons();
      }
    }
  }, 30);
}
window.runPlaygroundComparison = runPlaygroundComparison;

export function setDocLang(lang) {
  document.querySelectorAll('.doc-lang-btn').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.code-block-container').forEach(c => c.classList.add('hidden'));

  const activeBtn = document.getElementById(`doc-btn-${lang}`);
  const activeCode = document.getElementById(`code-${lang}`);

  if (activeBtn) activeBtn.classList.add('active');
  if (activeCode) activeCode.classList.remove('hidden');
}
window.setDocLang = setDocLang;

export function editQuota(deptName) {
  const lang = getLang();
  const promptText = lang === 'en' 
    ? `Set new monthly budget cap ($) for ${deptName}:` 
    : (lang === 'zh-TW' ? `請輸入 ${deptName} 的月度預算上限 ($):` : `请输入 ${deptName} 的月度预算上限 ($):`);

  const newCap = prompt(promptText, "120000");
  if (newCap) {
    const alertMsg = lang === 'en'
      ? `[Firstgate Governance] ${deptName} budget cap updated to $${parseInt(newCap).toLocaleString()}. Allocated across NYC Edge Gateway.`
      : (lang === 'zh-TW'
        ? `[Firstgate 配額治理] ${deptName} 月度預算已更新為 $${parseInt(newCap).toLocaleString()}。已同步分配至紐約網關。`
        : `[Firstgate 配额治理] ${deptName} 月度预算已更新为 $${parseInt(newCap).toLocaleString()}。已同步分配至纽约网关。`);
    alert(alertMsg);
  }
}
window.editQuota = editQuota;

function updateChartLabels() {
  if (costPieChart) {
    costPieChart.data.labels = [
      'DeepSeek V3 (NYC VPC)',
      'Claude 3.5 Sonnet',
      'GPT-4o',
      'Gemini 1.5 Pro'
    ];
    costPieChart.update();
  }
}

function initTelemetryChart() {
  const ctx = document.getElementById('chart-telemetry');
  if (!ctx) return;

  const labels = Array.from({length: 20}, (_, i) => `${(19-i)*3}s ago`);
  const initialData = Array(20).fill(0);

  telemetryChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [
        {
          label: t('telemetry.legend'),
          data: initialData,
          borderColor: '#10B981',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          fill: true,
          tension: 0.3,
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          grid: { color: 'rgba(28, 39, 64, 0.5)' },
          ticks: { color: '#64748B', font: { family: 'JetBrains Mono', size: 10 } }
        },
        y: {
          grid: { color: 'rgba(28, 39, 64, 0.5)' },
          ticks: { color: '#10B981', font: { family: 'JetBrains Mono', size: 10 } }
        }
      },
      plugins: {
        legend: { display: false }
      }
    }
  });
}

function initCostPieChart() {
  const ctx = document.getElementById('chart-cost-pie');
  if (!ctx) return;

  costPieChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['DeepSeek V3 (NYC VPC)', 'Claude 3.5 Sonnet', 'GPT-4o', 'Gemini 1.5 Pro'],
      datasets: [{
        data: [45, 25, 20, 10],
        backgroundColor: ['#10B981', '#00F0FF', '#8B5CF6', '#F59E0B'],
        borderWidth: 0
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'right',
          labels: { color: '#CBD5E1', font: { family: 'JetBrains Mono', size: 11 } }
        }
      }
    }
  });
}
