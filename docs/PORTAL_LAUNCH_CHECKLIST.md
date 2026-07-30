# Portal 上线回滚清单 (Portal Launch Rollback Checklist)

> **背景**：`portal.firstgate.ai`（用户认证 / API Key 签发 / Token 购买与结算）截至 **2026-07-30 尚未上线**。
> 为避免对外做出"已可购买"的不实陈述，主站已于 2026-07-30 将全部 Portal 相关文案改为 **"即将开放 / Coming Soon"**，并**移除了假跳转逻辑**。
>
> ⚠️ **Portal 正式上线当天，必须按本清单逐项回滚，否则站点会持续显示"尚未上线"而与事实不符。**
>
> 相关：[DOMAIN_CONFIG.md](DOMAIN_CONFIG.md)

---

## 一、i18n 文案回滚 —— `js/translations.js`

以下 8 个键需要在 **en / zh-CN / zh-TW 三个语言块**中同时修改（共 24 处）。
"当前值"是上线前的临时文案，"上线后目标"是建议恢复的表述。

### 1. `nav.sales_portal_ready` — Overview 页横幅角标

| 语言 | 当前值（未上线） | 上线后目标 |
| --- | --- | --- |
| en | `COMMERCIAL SALES PORTAL — COMING SOON` | `COMMERCIAL SALES PORTAL LIVE` |
| zh-CN | `商业销售与算力交易 Portal（即将开放）` | `商业销售与算力交易 Portal` |
| zh-TW | `商業銷售與算力交易 Portal（即將開放）` | `商業銷售與算力交易 Portal` |

### 2. `nav.console_btn` — 顶部导航 + Hero 区 CTA 按钮（HTML 中出现 3 处）

| 语言 | 当前值 | 上线后目标 |
| --- | --- | --- |
| en | `API Key & Token (Coming Soon)` | `Buy API Key & Token` |
| zh-CN | `API Key & Token（即将开放）` | `购买 API Key & Token` |
| zh-TW | `API Key & Token（即將開放）` | `購買 API Key & Token` |

### 3. `portal.banner_title`

| 语言 | 当前值 | 上线后目标 |
| --- | --- | --- |
| en | `Institutional LLM API & Token Purchase Portal (Launching Soon)` | 去掉 `(Launching Soon)` |
| zh-CN | `机构级 LLM API 密钥与 Token 算力购买 Portal（即将开放）` | 去掉 `（即将开放）` |
| zh-TW | `機構級 LLM API 密鑰與 Token 算力購買 Portal（即將開放）` | 去掉 `（即將開放）` |

### 4. `portal.banner_desc`

当前三语均以 **"该 Portal 目前仍在开发中，尚未开放。"** / `The portal is currently in development and not yet open.` 结尾。
**上线后删除该结尾句**，并将"未来将通过…提供" / `will be offered through` 改回现在时的可购买表述。

### 5. `portal.launch_btn`

| 语言 | 当前值 | 上线后目标 |
| --- | --- | --- |
| en | `View Portal Launch Status` | `Launch API & Token Portal 🚀` |
| zh-CN | `查看 Portal 开放进度` | `前往 API & Token 算力交易控制台 🚀` |
| zh-TW | `查看 Portal 開放進度` | `前往 API & Token 算力交易控制台 🚀` |

### 6. `portal.modal_title`

| 语言 | 当前值 | 上线后目标 |
| --- | --- | --- |
| en | `Firstgate API & Token Portal — Not Yet Live` | `Redirecting to Firstgate API & Token Sales Portal` |
| zh-CN | `Firstgate API 与 Token 购买 Portal —— 尚未上线` | `正在跳转至 Firstgate API 密钥与 Token 购买控制台` |
| zh-TW | `Firstgate API 與 Token 購買 Portal —— 尚未上線` | `正在跳轉至 Firstgate API 密鑰與 Token 購買控制台` |

### 7. `portal.modal_desc`

⚠️ **本项最关键。** 当前三语均含这句免责声明：

> **"本站当前不提供任何购买、账号注册或支付功能。"**
> `No purchase, account registration, or payment function is available on this site today.`

上线后**必须删除该句**（否则与实际功能矛盾），并改回跳转说明，例如：
`您即将跳转至安全交易控制台 (portal.firstgate.ai)，用以管理 API 密钥、充值 Token 余额及查阅交易发票。`

> 注意：原始文案曾写"开具**增值税发票**"，此表述涉及具体税务承诺，恢复时建议改为中性的"查阅交易发票"，除非确已具备该能力。

### 8. `portal.status_val` / `portal.status_label` / `portal.host_label`

这三个键是为"未上线状态卡"新增的。上线后**该状态卡整体移除**（见第二节），三个键可一并删除。
删除后务必运行 `node scripts/check_syntax.js` 确认三语键数仍然一致。

### 9. `portal.modal_ack`

当前值 `Understood` / `我知道了`。上线后弹窗恢复双按钮，此键由 `modal.cancel_btn` + 新的 proceed 键取代，可删除。

---

## 二、结构回滚 —— `index.html`

位置：`#modal-portal-redirect` 弹窗（文件末尾附近）

**1. 删除"未上线状态卡"**，恢复为跳转确认信息：

```html
<!-- 当前（未上线）：删除整块 -->
<div class="bg-navy-950 p-3 rounded-xl border border-navy-800 space-y-1 font-mono text-[11px]">
  <div><span data-i18n="portal.host_label">Planned Portal Host</span>: <strong class="text-slate-300">portal.firstgate.ai</strong></div>
  <div><span data-i18n="portal.status_label">Current Status</span>: <strong class="text-yellow-400" data-i18n="portal.status_val">IN DEVELOPMENT — NOT YET LIVE</strong></div>
</div>
```

> ⚠️ 恢复时**不要**照抄历史版本里的 `Billing Status: SSL Encrypted 256-bit` —— 该表述是对一个当时并不存在的主机做安全声明，属不实陈述。如需展示安全信息，应描述 Portal 实际具备的能力。

**2. 恢复双按钮布局**：当前为单个"我知道了"按钮（`data-i18n="portal.modal_ack"`），上线后恢复为 `Cancel`（`modal.cancel_btn`）+ 跳转按钮。

---

## 三、跳转逻辑接线 —— `js/app.js`

当前状态（**故意不做跳转**）：

```js
// NOTE: The billing portal (portal.firstgate.ai) is not live yet, so there is
// deliberately no redirect handler here. When the portal launches, wire the modal
// action to a real <a href> pointing at the single PORTAL_URL constant below.
export const PORTAL_URL = 'https://portal.firstgate.ai';
```

上线时的接线要求：

1. **用真实 `<a href>`，不要用 JS 跳转** —— 用户可悬停查看真实目标地址，多一道人眼校验：
   ```html
   <a href="https://portal.firstgate.ai" rel="noopener noreferrer">…</a>
   ```
2. **域名只保留 `PORTAL_URL` 这一处定义** —— 便于审计与 CSP 白名单维护，不要在多处硬编码。
3. **跳转 URL 中不得携带任何个人信息或敏感参数**（邮箱、账号、token 等）。
4. 历史上的 `proceedToPortal()` 函数（弹 alert 假装跳转）**已删除，不要恢复**。

---

## 四、上线前的安全前置条件

Portal 一旦上线，主站就成为**通往认证与支付页面的入口**。被投毒的第三方脚本可以改写跳转目标，把用户导向仿冒 Portal 骗取凭证与卡号。因此以下事项应在 Portal 上线**之前**完成：

- [x] **SRI** —— Chart.js / Lucide 已加 `integrity` 哈希（2026-07-30 完成，不受托管平台影响）
- [x] **Referrer-Policy** —— 已以 meta 标签下发（2026-07-30 完成）
- [ ] **Tailwind 本地化** —— 移除 `cdn.tailwindcss.com` 运行时依赖
- [ ] **内联 onclick 改事件委托** —— 约 53 处，是启用严格 CSP 的前置条件
- [ ] **CSP** —— 以 `<meta http-equiv="Content-Security-Policy">` 下发（托管平台为 WP Engine 标准 WordPress 托管，无响应头自助配置权限，详见 [DOMAIN_CONFIG.md](DOMAIN_CONFIG.md) §4）。含 `script-src` 白名单与 `base-uri 'self'`
- [ ] **`X-Frame-Options`** —— `frame-ancestors` 指令在 meta 方式下**无效**，防点击劫持须单独提工单请 WP Engine 配置响应头
- [ ] **Portal 自身**：建议支付走 Stripe/Paddle 等托管式结账，使卡号永不进入自有前端与服务器，可大幅压缩 PCI-DSS 合规范围

---

## 五、同时需要复查的相邻表述

Portal 上线时，以下内容也应一并复核是否仍然准确：

| 位置 | 当前表述 | 复查要点 |
| --- | --- | --- |
| `legal.sec1_text`（法律弹窗第 1 节） | 声明本站为"交互式演示平台"，全站数据为仿真 | Portal 上线后主站是否仍纯演示？如已承载真实交易入口需调整措辞 |
| SDK 文档页 | `base_url = "https://gateway.firstgate.ai/v1"`、示例 key `fg_live_nyc_98f4201ab` | **网关是否同步上线？** 若否，需比照 Portal 加"尚未开放"标识 |
| 全站 `SIMULATED` / `示意数据` 角标 | GPU 价格表、路由器、Playground、配额表等 | 若对应数据仍为演示数据，**角标保留不动** |
| 合规路线图卡片 | `PLANNED` / `IN PROGRESS` / `DESIGN READY` | 仅在取得实际审计结论后才可变更状态 |

---

## 六、回滚完成后的验证

```bash
node scripts/check_syntax.js     # 三语键数一致、无重复键
npm run build                    # 构建通过
```

并在浏览器中逐一确认：

- [ ] 三种语言下横幅、CTA 按钮、弹窗标题与正文均无"即将开放 / Coming Soon / 尚未上线"残留
- [ ] 全站搜索确认无遗漏：`grep -rn "即将开放\|即將開放\|Coming Soon\|Not Yet Live\|尚未上线\|尚未上線" index.html js/`
- [ ] 点击跳转按钮确实导航至 `https://portal.firstgate.ai`，且目标地址正确

---

*记录建立：2026-07-30 · 对应版本 v1.1.0*
