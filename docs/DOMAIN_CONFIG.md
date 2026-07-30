# FirstGate.ai 域名统一配置指南 (Domain Configuration Guide)

## 当前生效域名

**`https://firstgate.ai/`**（根目录部署，非子目录）

托管平台：WP Engine。以下 5 处指针已于 2026-07-30 全部同步至该域名。

| # | 文件 | 配置项 | 当前值 |
| :-: | --- | --- | --- |
| 1 | `public/robots.txt` | `Sitemap:` | `https://firstgate.ai/sitemap.xml` |
| 2 | `public/sitemap.xml` | `<loc>` | `https://firstgate.ai/` |
| 3 | `index.html` | `rel="canonical"` | `https://firstgate.ai/` |
| 4 | `index.html` | `og:url` | `https://firstgate.ai/` |
| 5 | `index.html` | `og:image` | `https://firstgate.ai/images/gpu_cluster_hero.png` |

---

## 再次更换域名时的操作

若未来再次迁移域名，需同步更新上表全部 5 处。可用以下命令一次性定位：

```bash
grep -rn "firstgate.ai" index.html public/robots.txt public/sitemap.xml
```

> ⚠️ **若改为子目录部署**（如 `https://firstgate.ai/platform/`），除域名外还须在 canonical、og:url、sitemap `<loc>` 中补上子目录路径，否则 SEO 收录会指向错误地址。
> 构建产物本身为全相对路径（`vite.config.js` 中 `base: './'`），**支持任意子目录部署，无需改动构建配置**。

---

## 相关但独立的域名（尚未上线，勿混淆）

| 域名 | 用途 | 状态 |
| --- | --- | --- |
| `portal.firstgate.ai` | 用户认证、API Key 签发、Token 购买与结算 | **未上线** —— 上线时须执行 [PORTAL_LAUNCH_CHECKLIST.md](PORTAL_LAUNCH_CHECKLIST.md) |
| `gateway.firstgate.ai` | LLM API 推理网关（SDK 文档中的 `base_url`） | **未上线** |

这两个域名不参与上表的 SEO 指针配置。

---

## WP Engine 部署（标准 WordPress 托管）

> **既定条件**：托管平台为 WP Engine **标准 WordPress 托管**（非 Atlas），已付费，不可更换。
> 本站为纯静态构建（无 PHP / 无数据库），与该平台的设计定位存在天然差异，以下约束均由此而来。

### 1. 部署方式：本地构建 + SFTP 上传

标准 WordPress 托管环境**不执行 Node 构建**，须本地打包后上传：

```bash
npm run export
```

产出 `dist/` 与 `FirstGate_AI_MMDDYYYY_vX.Y.Z.zip`，通过 SFTP 上传解压。**每次内容更新都需重复此流程**（无 Git 自动部署）。

### 2. 根目录部署：已有成功先例

团队此前已在 WP Engine 以**相同方式**（构建产物输出至 `out/`、以 `index.html` 为入口）托管过另一站点，**运行正常**。
因此本项不再视为阻塞风险，按既有经验部署即可。

- ✅ 构建产物为全相对路径（`vite.config.js` 中 `base: './'`），根目录与子目录部署**均可开箱即用，无需改动构建配置**
- ✅ `npm run export` 会在 `dist/` 之外同步产出一份 `out/`，与既有 WP Engine 上传习惯一致

> ⚠️ **但先例未必覆盖"重复部署"场景** —— 见下方第 5 节。首次部署正常，不等于第二次更新后仍然正常。

### 3. 无客户端路由（有利条件）

所有 Tab 切换均为 JS 显隐，全站只有一个真实 URL。**无需配置 SPA rewrite，不会出现刷新 404。**

### 4. 安全响应头：改用 meta 标签下发

标准 WordPress 托管**不提供 nginx 配置自助权限**，原有方案全部受阻：

| 方式 | 可行性 | 说明 |
| --- | :-: | --- |
| `vercel.json` | ❌ | 平台不同，不存在 |
| PHP 设置响应头 | ❌ | 静态 `.html` 由 nginx 直接返回，**不经过 PHP** |
| `.htaccess` | ❌ | 平台使用 nginx，支持有限 |
| 提工单加 nginx 规则 | ⚠️ | 或可行，但每次变更都需走工单 |
| **HTML meta 标签** | ✅ | **本项目采用此方案** |

**已落地**：`<meta name="referrer" content="strict-origin-when-cross-origin">`（`index.html` 头部）

**规划中**：CSP 同样以 `<meta http-equiv="Content-Security-Policy">` 下发。该方式随构建产物走，改 CSP 即改代码，无需求助平台——在本平台上反而比响应头方式更易迭代。

> **meta 方式的固有限制**：`frame-ancestors`、`report-uri`、`sandbox` 三个指令**仅响应头有效**。
> 其中 `frame-ancestors`（防点击劫持）建议单独提一次工单，请 WP Engine 配置 `X-Frame-Options: SAMEORIGIN`，一次配好即可。

**SRI 不受平台影响**（`integrity` 属性写在 HTML 内），Chart.js 与 Lucide 的完整性校验在本平台照常生效。

**CSP 的前置条件不变**：须先完成 Tailwind 本地化 + 约 53 处内联 `onclick` 改事件委托，否则必须开启 `'unsafe-inline'`，CSP 写在哪里都失去意义。详见 [PORTAL_LAUNCH_CHECKLIST.md](PORTAL_LAUNCH_CHECKLIST.md) §4。

### 5. 缓存策略（本平台上唯一的真实风险项）

> **注意**：此问题**只在第二次及以后的部署时才会显现**。
> 首次部署一切正常，因此"以前托管过、运行正常"并不能证明本项安全——除非那个站点在上线后确实做过内容更新并验证过。

失败链路：

```
更新部署 → assets 文件名因内容哈希而改变 → 旧文件被删除
        → 用户浏览器命中缓存的旧 index.html
        → 旧 HTML 引用的 assets 文件名已不存在 → 404 → 白屏
```

平台缓存为 WordPress 页面缓存设计，静态站需按下表区别对待，**我方无法自助配置，须提工单**：

| 文件 | 策略 | 原因 |
| --- | --- | --- |
| `assets/index-*.js` / `*.css` | 长期缓存（1 年） | 文件名含内容哈希，内容变则名变 |
| `fonts/*.woff2` | 长期缓存 | 内容不变 |
| **`index.html`** | **不缓存 / 极短 TTL** | ⚠️ **最高风险项**：缓存过久 → 用户拿到旧 HTML → 其引用的哈希文件名已被删除 → **白屏** |
| `ping.txt` | 不缓存 | RTT 探针依赖实时响应 |

---

## 附：WP Engine 支持工单模板

根目录部署已有内部成功先例，故工单聚焦于**缓存规则**（首要）与**响应头**（次要）。可直接复制发送：

```text
Subject: Per-path cache rules for a static site deploy — index.html must not be cached

We host a fully static site (HTML/CSS/JS only — no PHP, no database) on our
standard WordPress hosting install, served at https://firstgate.ai/.
Two configuration requests:

1. CACHE CONTROL  [priority]
   Our build uses content-hashed asset filenames. We need these per-path rules:
     - /assets/*  and /fonts/*   -> long cache (up to 1 year), immutable
     - /index.html               -> NO cache (or very short TTL)
     - /ping.txt                 -> NO cache

   The index.html rule is the critical one. On every redeploy the hashed asset
   filenames change and the previous files are removed. If index.html is served
   from cache, visitors get stale HTML pointing at asset filenames that no longer
   exist — the page renders blank. Note this only surfaces on the SECOND and
   later deploys, not the first.

   Can these per-path cache rules be configured for our install? If per-path
   rules are not available, what is the recommended way to guarantee index.html
   is always served fresh?

2. RESPONSE HEADERS
   Can custom response headers be added for this install? We need only one:
     - X-Frame-Options: SAMEORIGIN
   (All other security policies are delivered via HTML meta tags.)

Thank you.
```

