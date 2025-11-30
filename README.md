# 🗺️ نقشه سه‌بعدی ایران - SvelteKit

نسخه SvelteKit از نقشه سه‌بعدی تعاملی ایران با Three.js

## 🚀 شروع سریع

```bash
# نصب وابستگی‌ها
npm install

# اجرای سرور توسعه
npm run dev

# ساخت نسخه production (static)
npm run build

# پیش‌نمایش build
npm run preview
```

## 📁 ساختار پروژه

```
iran-map-svelte/
├── src/
│   ├── lib/
│   │   ├── components/
│   │   │   └── IranMap3D.svelte      # کامپوننت اصلی نقشه
│   │   └── config.js                  # تنظیمات نقشه
│   └── routes/
│       ├── +layout.js                 # تنظیمات SSR و prerender
│       └── +page.svelte               # صفحه اصلی
├── static/                            # فایل‌های استاتیک
├── svelte.config.js                   # تنظیمات SvelteKit
└── package.json
```

## ⚙️ تنظیمات

### Static Adapter

پروژه از `@sveltejs/adapter-static` استفاده می‌کنه که خروجی HTML استاتیک تولید می‌کنه.

```javascript
// svelte.config.js
import adapter from '@sveltejs/adapter-static';
```

### Prerendering

```javascript
// src/routes/+layout.js
export const prerender = true;
export const ssr = false;
```

## 🎨 کامپوننت‌ها

### `IranMap3D.svelte`

کامپوننت اصلی که نقشه سه‌بعدی رو رندر می‌کنه.

**Props:**
- `svgData`: داده SVG نقشه ایران

**Features:**
- ✅ Dynamic import برای Three.js (client-side only)
- ✅ Reactive به تغییرات
- ✅ Auto cleanup on destroy
- ✅ Responsive

### `+page.svelte`

صفحه اصلی با UI controls

## 📦 وابستگی‌ها

```json
{
  "dependencies": {
    "three": "^0.160.0"
  },
  "devDependencies": {
    "@sveltejs/adapter-static": "^3.0.0",
    "@sveltejs/kit": "^2.0.0",
    "svelte": "^5.0.0"
  }
}
```

## 🔧 نصب Three.js

```bash
npm install three
```

## 📝 نکات مهم

### 1. Client-Side Only

Three.js فقط در browser کار می‌کنه، پس باید:

```javascript
onMount(async () => {
  const THREE = await import('three');
  // استفاده از THREE
});
```

### 2. SSR غیرفعال

```javascript
export const ssr = false;
```

### 3. Prerender فعال

```javascript
export const prerender = true;
```

## 🎯 مراحل بعدی

### 1. اضافه کردن SVG

فایل SVG نقشه رو در `static/` قرار بدید:

```
static/
└── iran-map.svg
```

بعد در `+page.svelte`:

```javascript
onMount(async () => {
  const response = await fetch('/iran-map.svg');
  svgData = await response.text();
});
```

### 2. اضافه کردن پنل کنترل

یک کامپوننت `ControlPanel.svelte` بسازید:

```svelte
<script>
  import { MAP_CONFIG } from '$lib/config';
  // ...
</script>
```

### 3. اضافه کردن Stores

برای state management:

```javascript
// src/lib/stores.js
import { writable } from 'svelte/store';

export const hoveredProvince = writable(null);
export const autoRotate = writable(true);
```

### 4. اضافه کردن TypeScript

```bash
npm install -D typescript
```

تغییر `.svelte` به `.svelte` با `<script lang="ts">`

## 🏗️ Build

```bash
# ساخت static HTML
npm run build

# خروجی در build/ یا .svelte-kit/output/
```

## 🌐 Deploy

### Vercel

```bash
npm install -g vercel
vercel
```

### Netlify

```bash
npm install -g netlify-cli
netlify deploy
```

### GitHub Pages

```bash
npm run build
# محتویات build/ را push کنید
```

## 🎨 Styling

### Global Styles

در `src/app.css` یا `+layout.svelte`:

```css
:global(body) {
  font-family: 'vazirmatn', sans-serif;
}
```

### Component Styles

```svelte
<style>
  .my-class {
    /* scoped styles */
  }
</style>
```

## 🐛 عیب‌یابی

### Three.js import error

```javascript
// ✅ درست
onMount(async () => {
  const THREE = await import('three');
});

// ❌ اشتباه
import * as THREE from 'three'; // در top-level
```

### Window is not defined

```javascript
// استفاده از onMount
onMount(() => {
  // کدهایی که به window نیاز دارند
});
```

## 📚 منابع

- [SvelteKit Docs](https://kit.svelte.dev/)
- [Three.js Docs](https://threejs.org/docs/)
- [Svelte Tutorial](https://svelte.dev/tutorial)

## 📄 لایسنس

MIT

---

ساخته شده با ❤️ و Svelte
