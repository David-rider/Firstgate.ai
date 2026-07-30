# FirstGate.ai 域名统一配置指南 (Domain Configuration Guide)

当平台由默认预览测试域名 `https://firstgate-ai.vercel.app/` 迁移绑定至自有独立域名（如 `https://firstgate.ai/`）时，请在以下 4 处全局指针文件中同步更新 URL：

1. **`public/robots.txt`**: 
   `Sitemap: https://YOUR_CUSTOM_DOMAIN/sitemap.xml`

2. **`public/sitemap.xml`**: 
   `<loc>https://YOUR_CUSTOM_DOMAIN/</loc>`

3. **`index.html` (Canonical)**: 
   `<link rel="canonical" href="https://YOUR_CUSTOM_DOMAIN/">`

4. **`index.html` (OpenGraph & Meta)**: 
   `<meta property="og:url" content="https://YOUR_CUSTOM_DOMAIN/">`
   `<meta property="og:image" content="https://YOUR_CUSTOM_DOMAIN/images/gpu_cluster_hero.png">`
