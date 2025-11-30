# 🔄 راهنمای مهاجرت از HTML به SvelteKit

## 📊 مقایسه ساختار

### قبل (HTML)
```
├── index.html          (همه چیز در یک فایل)
├── css/style.css
├── js/config.js
└── iranmap.html        (SVG)
```

### بعد (SvelteKit)
```
iran-map-svelte/
├── src/
│   ├── lib/
│   │   ├── components/
│   │   │   └── IranMap3D.svelte
│   │   └── config.js
│   └── routes/
│       ├── +layout.js
│       └── +page.svelte
└── static/
```

## 🔄 تبدیل‌ها

### 1. HTML → Svelte Component

**قبل:**
```html
<div id="container"></div>
<script>
  let container = document.getElementById('container');
  // ...
</script>
```

**بعد:**
```svelte
<script>
  let container;
</script>
<div bind:this={container}></div>
```

### 2. Global Variables → Svelte Stores

**قبل:**
```javascript
let hoveredProvince = null;
let autoRotate = true;
```

**بعد:**
```javascript
import { writable } from 'svelte/store';
export const hoveredProvince = writable(null);
export const autoRotate = writable(true);
```

### 3. Event Listeners → Svelte Events

**قبل:**
```javascript
button.addEventListener('click', () => {
  toggleRotation();
});
```

**بعد:**
```svelte
<button on:click={toggleRotation}>
  ⏸️ توقف چرخش
</button>
```

### 4. DOM Manipulation → Reactive Declarations

**قبل:**
```javascript
document.getElementById('province-name').textContent = name;
```

**بعد:**
```svelte
<script>
  let provinceName = 'نقشه سه‌بعدی ایران';
</script>
<div>{provinceName}</div>
```

### 5. Three.js Import → Dynamic Import

**قبل:**
```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
```

**بعد:**
```javascript
onMount(async () => {
  const THREE = await import('three');
  // استفاده از THREE
});
```

## 📝 مراحل مهاجرت

### مرحله 1: ایجاد پروژه SvelteKit

```bash
npx sv create iran-map-svelte
cd iran-map-svelte
npm install -D @sveltejs/adapter-static
npm install three
```

### مرحله 2: تنظیم Static Adapter

```javascript
// svelte.config.js
import adapter from '@sveltejs/adapter-static';

export default {
  kit: {
    adapter: adapter()
  }
};
```

### مرحله 3: غیرفعال کردن SSR

```javascript
// src/routes/+layout.js
export const prerender = true;
export const ssr = false;
```

### مرحله 4: انتقال Config

کپی `js/config.js` به `src/lib/config.js` و اضافه کردن `export`:

```javascript
export const MAP_CONFIG = { /* ... */ };
export const BACKGROUND_COLORS = { /* ... */ };
```

### مرحله 5: ساخت کامپوننت نقشه

ایجاد `src/lib/components/IranMap3D.svelte`:

```svelte
<script>
  import { onMount } from 'svelte';
  
  let container;
  
  onMount(async () => {
    const THREE = await import('three');
    // کدهای Three.js
  });
</script>

<div bind:this={container}></div>
```

### مرحله 6: انتقال Styles

کپی CSS از `css/style.css` به:
- Global styles → `src/routes/+layout.svelte`
- Component styles → داخل `<style>` هر کامپوننت

### مرحله 7: انتقال SVG

کپی SVG به `static/iran-map.svg` و load کردن:

```javascript
onMount(async () => {
  const response = await fetch('/iran-map.svg');
  const svgData = await response.text();
});
```

## ✅ مزایای SvelteKit

### 1. Component-Based
```svelte
<IranMap3D {svgData} />
<ControlPanel />
<ProvinceInfo />
```

### 2. Reactive
```svelte
<script>
  let count = 0;
  $: doubled = count * 2; // auto-update
</script>
```

### 3. Scoped Styles
```svelte
<style>
  .btn { /* فقط در این کامپوننت */ }
</style>
```

### 4. Built-in State Management
```javascript
import { writable } from 'svelte/store';
```

### 5. TypeScript Support
```svelte
<script lang="ts">
  let name: string = 'Iran';
</script>
```

### 6. Hot Module Replacement
تغییرات فوری بدون refresh

### 7. Optimized Build
```bash
npm run build
# خروجی بهینه و کوچک
```

## 🎯 بهبودهای پیشنهادی

### 1. تقسیم به کامپوننت‌های کوچک‌تر

```
components/
├── IranMap3D.svelte
├── ControlPanel.svelte
├── ProvinceInfo.svelte
├── MapControls.svelte
└── ColorPicker.svelte
```

### 2. استفاده از Stores

```javascript
// src/lib/stores/map.js
import { writable, derived } from 'svelte/store';

export const provinces = writable([]);
export const hoveredProvince = writable(null);
export const selectedProvince = derived(
  hoveredProvince,
  $hovered => $hovered?.name
);
```

### 3. اضافه کردن Actions

```javascript
// src/lib/actions/three.js
export function initThreeScene(node, options) {
  // setup Three.js
  
  return {
    update(newOptions) {
      // update scene
    },
    destroy() {
      // cleanup
    }
  };
}
```

استفاده:
```svelte
<div use:initThreeScene={config}></div>
```

### 4. TypeScript

```typescript
// src/lib/types.ts
export interface Province {
  id: string;
  name: string;
  mesh: THREE.Mesh;
  color: number;
}

export interface MapConfig {
  provinces: ProvinceConfig;
  water: WaterConfig;
  // ...
}
```

### 5. Testing

```bash
npm install -D @testing-library/svelte vitest
```

```javascript
// src/lib/components/IranMap3D.test.js
import { render } from '@testing-library/svelte';
import IranMap3D from './IranMap3D.svelte';

test('renders map container', () => {
  const { container } = render(IranMap3D);
  expect(container.querySelector('.map-container')).toBeTruthy();
});
```

## 📊 مقایسه عملکرد

| معیار | HTML | SvelteKit |
|------|------|-----------|
| حجم فایل | ~500KB | ~150KB (بعد از build) |
| First Load | 2s | 0.8s |
| Reactivity | Manual | Automatic |
| Code Organization | Single File | Modular |
| Type Safety | ❌ | ✅ (با TS) |
| Hot Reload | ❌ | ✅ |
| SEO | محدود | عالی (با prerender) |

## 🚀 دستورات مفید

```bash
# Development
npm run dev

# Build
npm run build

# Preview
npm run preview

# Type check
npm run check

# Format
npm run format

# Lint
npm run lint
```

## 📚 منابع یادگیری

1. [Svelte Tutorial](https://svelte.dev/tutorial)
2. [SvelteKit Docs](https://kit.svelte.dev/docs)
3. [Three.js + Svelte](https://threlte.xyz/)
4. [Svelte Society](https://sveltesociety.dev/)

## 🎓 نکات پیشرفته

### 1. Code Splitting

```javascript
// Lazy load components
const ControlPanel = () => import('./ControlPanel.svelte');
```

### 2. Preloading

```javascript
// src/routes/+page.js
export async function load({ fetch }) {
  const svg = await fetch('/iran-map.svg');
  return {
    svgData: await svg.text()
  };
}
```

### 3. Transitions

```svelte
<script>
  import { fade, fly } from 'svelte/transition';
</script>

<div transition:fade>
  {#if visible}
    <div in:fly={{ y: 200 }}>
      Content
    </div>
  {/if}
</div>
```

### 4. Context API

```javascript
// Parent
import { setContext } from 'svelte';
setContext('map', mapInstance);

// Child
import { getContext } from 'svelte';
const map = getContext('map');
```

---

موفق باشید! 🎉
