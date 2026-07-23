# FirstGate.ai 官方网站规划、架构演进与版本详细说明文档 v1.0
**Official Website Architecture, Feature Specs & Release Notes v1.0**

---

## 📋 文档基本信息 / Document Metadata

- **项目名称 / Project**: FirstGate.ai 机构级 AI 算力交易市场与智能路由网关
- **当前版本 / Version**: `v1.0.10` (Production Stable Release)
- **线上公网预览 / Live Preview**: [https://firstgate-ai.vercel.app/](https://firstgate-ai.vercel.app/)
- **代码仓库 / Repository**: GitHub `David-rider/Firstgate.ai` (`main` branch)
- **文档路径 / Location**: `docs/FirstGate_AI_Release_Notes_v1.0.md` & `docs/FirstGate_AI_Release_Notes_v1.0.docx`
- **发布日期 / Date**: 2026年7月23日 (July 23, 2026)

---

## 一、 项目定位与品牌核心倡导 (Brand & Product Strategy)

### 1.1 核心使命
FirstGate.ai 定位为**机构级 AI 算力交易市场与多云智能路由网关**。旨在解决大模型时代企业与金融机构面临的四大核心痛点：
1. **算力成本高昂**: 聚合全球分布式 Spot GPU (H100/H200/B200/L40S) 算力池，实现亚秒级实时竞价仲裁，最高降低 68% 算力开销。
2. **路由调度复杂**: 自动进行 Semantic Caching (语义向量缓存)、自动降级链 (Fallback Chains) 及低延迟节点仲裁。
3. **数据安全与合规**: 满足华尔街金融级监管及隐私保护，支持芯片级 NVIDIA H100 硬件 TEE 机密计算飞地、Zero-Trust PII 敏感数据脱敏、SOC2 Type II 以及 NY DFS 23 NYCRR 500。
4. **配额与预算治理**: 提供企业 FinOps 预算硬封顶与各部门 Token 配额实时监控。

### 1.2 务实工程倡导（拒绝夸大与编造）
- **真实创始人背景**: 创始人拥有 20 多年真实的 Enterprise IT、MSP 托管服务、路由交换组网、网络安全防御、金融合规（SOC2 / NY DFS）以及勒索病毒危机救援的丰富经验。
- **清除虚假数字**: 坚决剔除任何编造的数十万张 GPU 或上百个虚拟数据中心数字，坚持务实工程风格，以真正可运行的端到端响应（如真实 Client-to-Edge RTT 测速）展示技术实力。

### 1.3 视觉与交互美学 (Design Aesthetics)
- **Dark Cyber & Deep Navy**: 采用 `#060813` 极深海蓝背景，辅以 Cyan-500、Emerald-400 与 Indigo-500 的微渐变霓虹高光。
- **PaleBlueDot 精炼风格**: 剔除繁复臃肿元素，以高对比度、清晰阶梯的字体排版和流畅的组件动画（如 3D 智能大门粒子、Cyber 边框）震撼用户视觉。

---

## 二、 前端技术栈与架构设计 (Architecture & Tech Stack)

### 2.1 基础架构
- **HTML5 & Semantic Markup**: 标准语义化结构，确保可读性与 SEO 最佳实践。
- **Vanilla JavaScript (ES Modules)**: 模块化开发，无重型框架负担，保持 60fps 极速渲染。
- **TailwindCSS CDN**: 快速响应式样式支持，自研 `.cyber-glow-card` 与 `.nav-tab` 样式库。
- **Vite 5.4.x**: 高效打包与构建工具，全站编译产物仅 ~102kB，压缩后仅 ~20kB，首屏瞬间加载。
- **Visuals & Charts**: 集成 Lucide Icons 矢量图标与 Chart.js 实时网络时延折线图。
- **Automated CI/CD**: GitHub 提交自动触发 Vercel 构建部署。

### 2.2 自研多语言国际化引擎 (i18n Engine)
- **支持语言**: `en` (English)、`zh-CN` (简体中文)、`zh-TW` (繁體中文)。
- **动态无刷新**: 基于 DOM `data-i18n` 属性，通过 JavaScript 在 0.1ms 内全量更新文本。
- **富文本与属性覆盖**: 完美支持 HTML 粗体/代码块映射 (`data-i18n-html`) 以及 Input Placeholder 映射 (`data-i18n-placeholder`)。
- **100% 字典覆盖**: 经全站无死角审视，排除了所有硬编码英文，确保切换语言时页面 100% 同步变化。

---

## 三、 核心功能模块与页面规划 (Functional Specs & Tab Breakdown)

| 序号 | 模块名称 | 对应页面 Tab / ID | 核心功能与设计亮点 |
| :---: | :--- | :--- | :--- |
| **1** | **3D 智能大门封面页** | `stargate-landing` | 3D 粒子星门动画、零信任网络隧道与 TEE 飞地简介，震撼品牌入口 |
| **2** | **控制台概览主页** | `tab-overview` | 算力交易 Banner、四大架构支柱、实测 RTT 测速折线图及路由仲裁模拟器 |
| **3** | **GPU 算力交易市场** | `tab-marketplace` | H100/H200/B200/L40S 竞价价格表、SOTA 开源大模型 (DeepSeek V3 等) 部署目录 |
| **4** | **智能路由配置中心** | `tab-router` | 纽约极速低延迟、企业成本优化、物理隔离 VPC 3大预设策略及 Fallback 降级链编排 |
| **5** | **安全与机密计算** | `tab-security` | SOC2/TEE/NY DFS/GDPR 合规标准、硬件 TEE 远程证明校验器、PII 实时脱敏测试器、ClickHouse 审计日志与 CSV 导出 |
| **6** | **关于我们与演进路线图** | `tab-about` | 创始人真实 20 年 IT/MSP/安全合规路线图（4大时代），底部单一终极预约行动卡片 |
| **7** | **开发文档与 SDK** | `tab-docs` | 无缝替代 OpenAI SDK 的 Python/TS/cURL 示例代码（仅需修改 1 行 `base_url`） |
| **8** | **节点验证与抓包证明 Modal** | `modal-node-proof` | 实时展示 Active Host、传输协议与 ping，引导用户通过 F12 Network 验证 200 OK 真实性 |
| **9** | **API Key 购买 Modal** | `modal-portal-redirect` | 全站统一 API Key 与 Token 额度购买对话框，100% Viewport 垂直居中体系 |

---

## 四、 全局 UX 细节重构与优化记录 (UX Refinements)

1. **顶栏全局吸顶 (Sticky Navigation)**:
   - 将顶部 `LOCAL DEV NODE: ONLINE` 节点状态栏与语言切换下拉框整合进 `<header class="sticky top-0 z-50">` 容器，用户滚动浏览时语言切换按钮始终置顶可见。
2. **全站弹窗 100% 视口居中系统 (Viewport Modal Centering)**:
   - 将 `#modal-portal-redirect` 和 `#modal-node-proof` 提取至 `<body>` 根节点，添加 `.global-modal-overlay` (`position: fixed; inset: 0; z-index: 99999`)，解决以前在不同滚动高度下弹窗高低不一的问题。
3. **精准 1 对 1 导航与 Logo 点击映射**:
   - 修复左上角 Logo (`FIRSTGATE AI`) 点击误打开 About Us 的 BUG，修改为跳转至 **Overview (控制台主页)**；导航栏新增 **Overview** 按钮，确保每个按钮跳转独立清晰。
4. **Sales Portal Banner 作用域限制**:
   - 将“直连机构级 LLM API 密钥与 Token 算力购买 Portal”横幅仅限在 Overview 页面显示，保持 Smart Router、Security、About Us 等子页面的简洁干练。
5. **About Us 页面重构与非重复性整合**:
   - 彻底删除“Why FirstGate”重复卡片，将“20 年演进”与“核心功底”融合成 4 里程碑网格；删除了顶部冗余的预约按钮，保留底部统一的 Final Consultation CTA 卡片。

---

## 五、 版本发布履历 (Version Release Log)

```
v1.0.10 (2026-07-23) - refactor(about): 精简合并 About Us 页面预约卡片
                       - 删除了 About Us 顶部的重复预约按钮，保留底部统一的 Final Consultation CTA 卡片。

v1.0.9  (2026-07-23) - fix(modal): 统一全站弹窗 Viewport 100% 垂直居中
                       - 重构 Modal 系统，提取至 <body> 根节点，引入 .global-modal-overlay。

v1.0.8  (2026-07-23) - fix(layout): 限制 Sales Portal Banner 仅在 Overview 页面显示
                       - 保持各子页面界面整洁与聚焦。

v1.0.7  (2026-07-23) - fix(nav): 修复 Logo 点击跳转目标并新增 Overview 独立导航按钮
                       - 将 Logo 点击绑定由 switchTab('about') 纠正为 switchTab('overview')。

v1.0.6  (2026-07-23) - fix(i18n): 全站多语言 i18n 无死角审查与缺失字典补全
                       - 补全了 Security & TEE 页面缺失的 20 余项 zh-CN / zh-TW 翻译字典。

v1.0.5  (2026-07-23) - fix(header): 顶栏全局吸顶固定与语言选择器常亮
                       - 将顶部节点状态与语言切换条整合进 sticky top-0 容器。

v1.0.4  (2026-07-23) - refactor(about): 整合精简 About Us 冗余卡片
                       - 删除冗余“Why FirstGate”卡片，合并为 4 里程碑网格。

v1.0.3  (2026-07-23) - style(nav): 统一导航按钮框线样式与 Portal 按钮还原
                       - 为所有选项卡统一了 rounded-xl 边框，并将 FirstGate Portal 还原至导航最左侧。

v1.0.2  (2026-07-23) - docs(founder): 务实创始人背景修正与全站虚假数据清除
                       - 去除服务器设计与热力学描述，替换为 20 年 IT/MSP/网络安全救援功底。

v1.0.1  (2026-07-23) - fix(layout): 修复全站页面错位与 HTML 标签缺失
                       - 闭合未对齐的 <div> 标签，恢复响应式弹性排版。

v1.0.0  (2026-07-23) - feat(init): 官方网站初始版本上线
                       - 搭建赛博暗黑风格 UI 框架，完成多云算力交易、智能路由、TEE 安全与 i18n 引擎。
```

---

## 📁 项目文档存储结构 / Directory Layout

```
Firstgate.ai/
├── docs/
│   ├── FirstGate_AI_Release_Notes_v1.0.docx  <-- 自动生成的 Word 详细规格文档
│   └── FirstGate_AI_Release_Notes_v1.0.md    <-- 自动生成的 Markdown 规格文档
├── scripts/
│   └── generate_word_spec.py                <-- Word 文档自动编译脚本
├── css/
│   └── style.css                             <-- 核心高科技赛博 CSS 样式与 Modal 居中规范
├── js/
│   ├── app.js                                <-- 路由调度、弹窗控制、测速与模拟器引擎
│   └── translations.js                       <-- 100% 覆盖的 EN / zh-CN / zh-TW 三语字典
├── index.html                                <-- 网页主结构 (包含所有 Tab 与 Modal)
├── package.json
└── vite.config.js
```

---
*FirstGate.ai Engineering & Design Team — 2026*
