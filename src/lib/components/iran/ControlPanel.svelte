<script>
import { MAP_CONFIG, BACKGROUND_COLORS, regionGroups, provinceNames, provinceColors } from '$lib/config';
import { log } from '$lib/utils/logger';

export let visible = true;
export let mapComponent = null;

let config = JSON.parse(JSON.stringify(MAP_CONFIG));
let bgColors = JSON.parse(JSON.stringify(BACKGROUND_COLORS));

// Helper function to handle input events
function handleInput(path) {
	return (e) => {
		const value = e.target.value;
		updateConfig(path, value);
	};
}

// Helper function to handle checkbox events
function handleCheckbox(path, checked) {
	const keys = path.split('.');
	let obj = config;
	for (let i = 0; i < keys.length - 1; i++) obj = obj[keys[i]];
	obj[keys[keys.length - 1]] = checked;
	
	let globalObj = MAP_CONFIG;
	for (let i = 0; i < keys.length - 1; i++) globalObj = globalObj[keys[i]];
	globalObj[keys[keys.length - 1]] = checked;
	
	if (mapComponent?.applyConfigChanges) {
		mapComponent.applyConfigChanges(path, checked);
	}
	config = config;
}

// Helper function to handle color input events
function handleColorInput(callback) {
	return (e) => {
		const value = e.target.value;
		callback(value);
	};
}

function updateConfig(path, value) {
	const numValue = parseFloat(value);
	log(`⚙️ updateConfig: path=${path}, value=${numValue}`);
	
	const keys = path.split('.');
	let obj = config;
	for (let i = 0; i < keys.length - 1; i++) obj = obj[keys[i]];
	obj[keys[keys.length - 1]] = numValue;
	
	let globalObj = MAP_CONFIG;
	for (let i = 0; i < keys.length - 1; i++) globalObj = globalObj[keys[i]];
	globalObj[keys[keys.length - 1]] = numValue;
	
	if (mapComponent?.applyConfigChanges) {
		log(`📤 Calling applyConfigChanges for ${path}`);
		mapComponent.applyConfigChanges(path, numValue);
	} else {
		log(`⚠️ mapComponent.applyConfigChanges not available`);
	}
	config = config;
}

function updateBackground(type, value) {
	log(`🎨 updateBackground called: type=${type}, value=${value}`);
	bgColors[type] = value;
	BACKGROUND_COLORS[type] = value;
	
	// Apply background changes immediately using CSS variables
	if (typeof document !== 'undefined') {
		if (type === 'primary') {
			log(`✅ Setting --bg-primary to ${value}`);
			// Update CSS variables on both html and body
			document.documentElement.style.setProperty('--bg-primary', value);
			document.body.style.setProperty('--bg-primary', value);
			
			// Update the gradient
			document.body.style.background = `radial-gradient(ellipse at center, ${bgColors.secondary} 0%, ${value} 100%)`;
			log(`✅ Updated body background gradient`);
			
			// Update Three.js scene background
			if (mapComponent?.updateBackgroundColor) {
				mapComponent.updateBackgroundColor('primary', value);
			}
		} else if (type === 'secondary') {
			log(`✅ Setting --bg-secondary to ${value}`);
			// Update CSS variables on both html and body
			document.documentElement.style.setProperty('--bg-secondary', value);
			document.body.style.setProperty('--bg-secondary', value);
			
			// Update the gradient
			document.body.style.background = `radial-gradient(ellipse at center, ${value} 0%, ${bgColors.primary} 100%)`;
			log(`✅ Updated body background gradient`);
		}
	}
	bgColors = bgColors;
	log(`📊 Current bgColors:`, bgColors);
}

function updateColor(region, value) {
	// Update region color in real-time
	if (mapComponent?.updateRegionColor) {
		mapComponent.updateRegionColor(region, value);
	}
	
	// Update local config
	const color = parseInt(value.replace('#', ''), 16);
	regionGroups[region].color = color;
	config = config;
}

function updateWaterColor(waterKey, value) {
	// Update water color in real-time
	if (mapComponent?.updateWaterColor) {
		mapComponent.updateWaterColor(waterKey, value);
	}
	
	// Update local config
	const color = parseInt(value.replace('#', ''), 16);
	config.waterColors[waterKey] = color;
	MAP_CONFIG.waterColors[waterKey] = color;
	config = config;
}

function updateProvinceColor(provinceKey, value) {
	// Update individual province color in real-time
	if (mapComponent?.updateProvinceColor) {
		mapComponent.updateProvinceColor(provinceKey, value);
	}
	config = config;
}

function updateBorderColor(type, value) {
	// Update border color for provinces or water
	const color = parseInt(value.replace('#', ''), 16);
	
	if (type === 'provinces') {
		config.provinces.borderColor = color;
		MAP_CONFIG.provinces.borderColor = color;
	} else if (type === 'water') {
		config.water.borderColor = color;
		MAP_CONFIG.water.borderColor = color;
	}
	
	if (mapComponent?.applyConfigChanges) {
		mapComponent.applyConfigChanges(`${type}.borderColor`, color);
	}
	config = config;
}

function clearBorderColor(type) {
	// Clear custom border color (use default)
	if (type === 'provinces') {
		config.provinces.borderColor = null;
		MAP_CONFIG.provinces.borderColor = null;
	} else if (type === 'water') {
		config.water.borderColor = null;
		MAP_CONFIG.water.borderColor = null;
	}
	
	if (mapComponent?.applyConfigChanges) {
		mapComponent.applyConfigChanges(`${type}.borderColor`, null);
	}
	config = config;
}

function fixPositions() {
	if (mapComponent?.fixProvincePositions) {
		const fixed = mapComponent.fixProvincePositions();
		alert(`✅ ${fixed} استان اصلاح شد`);
	}
}

function exportConfig() {
	const txt = `const MAP_CONFIG = ${JSON.stringify(MAP_CONFIG, null, 4)};`;
	navigator.clipboard.writeText(txt).then(() => alert('✅ کپی شد!')).catch(() => alert('❌ خطا در کپی'));
}

function resetDefaults() {
	if (confirm('بازگشت به پیش‌فرض؟')) location.reload();
}
</script>

<button class="toggle-btn" class:open={visible} on:click={() => visible = !visible}>
	{visible ? '✖ بستن' : '⚙️ تنظیمات'}
</button>

<div class="panel" class:hidden={!visible}>
<h3 style="color: white; font-size: 20px;">⚙️ تنظیمات نقشه</h3>

<div style="background: rgba(0,100,255,0.1); border: 1px solid rgba(0,150,255,0.3); border-radius: 8px; padding: 12px; margin-bottom: 15px; font-size: 11px; color: rgba(200,220,255,0.9);">
	<div style="font-weight: bold; margin-bottom: 5px; color: #00ddff;">📌 راهنمای سریع:</div>
	<div>• <strong>Bloom (گلو)</strong>: کنترل اصلی نورانی بودن</div>
	<div>• <strong>نورپردازی</strong>: روشنایی کلی صحنه</div>
	<div>• <strong>شفافیت</strong>: شفافیت سطوح داخلی</div>
	<div>• <strong>نور داخلی</strong>: درخشش رنگ‌ها</div>
</div>

<h3>🏛️ استان‌ها - شکل 3D</h3>
<div class="control-group">
	<label><span class="value">{config.provinces.extrudeDepth}</span><span class="range">(10-50)</span>ارتفاع دیواره استان‌ها</label>
	<input type="range" min="10" max="50" step="1" value={config.provinces.extrudeDepth} on:input={handleInput('provinces.extrudeDepth')} />
</div>
<div class="control-group">
	<label><span class="value">{config.provinces.bevelThickness}</span><span class="range">(1-5)</span>ضخامت Bevel</label>
	<input type="range" min="1" max="5" step="0.5" value={config.provinces.bevelThickness} on:input={handleInput('provinces.bevelThickness')} />
</div>
<div class="control-group">
	<label><span class="value">{config.provinces.bevelSize}</span><span class="range">(1-4)</span>اندازه Bevel</label>
	<input type="range" min="1" max="4" step="0.5" value={config.provinces.bevelSize} on:input={handleInput('provinces.bevelSize')} />
</div>

<h3>💎 استان‌ها - شیشه‌ای (عادی)</h3>
<div style="font-size: 11px; color: rgba(0,255,255,0.6); margin-bottom: 10px;">✅ تغییرات فوری اعمال می‌شود</div>
<div class="control-group">
	<label><span class="value">{config.provinces.defaultOpacity.toFixed(2)}</span><span class="range">(0-1)</span>شفافیت</label>
	<input type="range" min="0" max="1" step="0.05" value={config.provinces.defaultOpacity} on:input={handleInput('provinces.defaultOpacity')} />
</div>
<div class="control-group">
	<label><span class="value">{config.provinces.defaultEmissiveIntensity.toFixed(2)}</span><span class="range">(0-0.5)</span>شدت نور داخلی</label>
	<input type="range" min="0" max="0.5" step="0.01" value={config.provinces.defaultEmissiveIntensity} on:input={handleInput('provinces.defaultEmissiveIntensity')} />
</div>
<div class="control-group">
	<label><span class="value">{config.provinces.metalness.toFixed(2)}</span><span class="range">(0-1)</span>فلزی بودن</label>
	<input type="range" min="0" max="1" step="0.05" value={config.provinces.metalness} on:input={handleInput('provinces.metalness')} />
</div>
<div class="control-group">
	<label><span class="value">{config.provinces.roughness.toFixed(2)}</span><span class="range">(0-1)</span>زبری سطح</label>
	<input type="range" min="0" max="1" step="0.05" value={config.provinces.roughness} on:input={handleInput('provinces.roughness')} />
</div>
<div class="control-group">
	<label><span class="value">{config.provinces.clearcoat.toFixed(2)}</span><span class="range">(0-1)</span>لایه شیشه‌ای</label>
	<input type="range" min="0" max="1" step="0.05" value={config.provinces.clearcoat} on:input={handleInput('provinces.clearcoat')} />
</div>
<div class="control-group">
	<label><span class="value">{config.provinces.clearcoatRoughness.toFixed(2)}</span><span class="range">(0-1)</span>زبری شیشه</label>
	<input type="range" min="0" max="1" step="0.05" value={config.provinces.clearcoatRoughness} on:input={handleInput('provinces.clearcoatRoughness')} />
</div>
<div class="control-group">
	<label><span class="value">{config.provinces.reflectivity.toFixed(2)}</span><span class="range">(0-1)</span>بازتاب نور</label>
	<input type="range" min="0" max="1" step="0.05" value={config.provinces.reflectivity} on:input={handleInput('provinces.reflectivity')} />
</div>

<h3>📐 استان‌ها - خطوط حاشیه</h3>
<div style="font-size: 11px; color: rgba(0,255,255,0.6); margin-bottom: 10px;">✅ تغییرات فوری اعمال می‌شود</div>
<div class="control-group">
	<label><span class="value">{config.provinces.borderOpacity.toFixed(2)}</span><span class="range">(0-1)</span>شفافیت خطوط</label>
	<input type="range" min="0" max="1" step="0.05" value={config.provinces.borderOpacity} on:input={handleInput('provinces.borderOpacity')} />
</div>
<div class="control-group">
	<label><span class="value">{config.provinces.borderWidth.toFixed(1)}</span><span class="range">(1-10)</span>ضخامت خطوط</label>
	<input type="range" min="1" max="10" step="0.5" value={config.provinces.borderWidth} on:input={handleInput('provinces.borderWidth')} />
</div>
<div class="control-group">
	<label><span class="value">{config.provinces.edgeAngle}</span><span class="range">(10-45)</span>زاویه لبه (کمتر = خطوط بیشتر)</label>
	<input type="range" min="10" max="45" step="1" value={config.provinces.edgeAngle} on:input={handleInput('provinces.edgeAngle')} />
</div>
<div class="control-group">
	<label><span class="value">{config.provinces.borderGlowIntensity?.toFixed(2) || '1.00'}</span><span class="range">(0-2)</span>شدت گلو خطوط</label>
	<input type="range" min="0" max="2" step="0.1" value={config.provinces.borderGlowIntensity || 1.0} on:input={handleInput('provinces.borderGlowIntensity')} />
</div>
<div class="color-group">
	<input type="color" value={config.provinces.borderColor ? '#' + config.provinces.borderColor.toString(16).padStart(6, '0') : '#ffffff'} on:change={handleColorInput((v) => updateBorderColor('provinces', v))} />
	<label>رنگ خطوط سفارشی</label>
	{#if config.provinces.borderColor}
		<button class="clear-color-btn" on:click={() => clearBorderColor('provinces')}>✖</button>
	{/if}
</div>
<div style="font-size: 10px; color: rgba(150,150,150,0.7); margin-top: -8px; margin-bottom: 10px;">
	💡 اگر رنگ سفارشی نباشد، از رنگ استان استفاده می‌شود
</div>
<div class="control-group">
	<label style="display: flex; align-items: center; gap: 8px;">
		<input type="checkbox" checked={config.provinces.borderOnTopOnly} on:change={(e) => handleCheckbox('provinces.borderOnTopOnly', e.target.checked)} />
		<span>فقط خطوط روی سطح بالا</span>
	</label>
</div>

<h3>✨ استان‌ها - هاور</h3>
<div style="background: rgba(0,255,100,0.1); border: 1px solid rgba(0,255,150,0.3); border-radius: 8px; padding: 12px; margin-bottom: 15px; font-size: 11px; color: rgba(150,255,200,0.9);">
	<div style="font-weight: bold; margin-bottom: 5px; color: #00ff88;">✅ انیمیشن smooth فعال است</div>
	<div>استان‌ها با انیمیشن نرم بالا می‌آیند</div>
</div>
<div class="control-group">
	<label><span class="value">{config.provinces.hoverHeight}</span><span class="range">(20-100)</span>ارتفاع بالا آمدن</label>
	<input type="range" min="20" max="100" step="5" value={config.provinces.hoverHeight} on:input={handleInput('provinces.hoverHeight')} />
</div>
<div class="control-group">
	<label><span class="value">{config.provinces.hoverOpacity.toFixed(2)}</span><span class="range">(0-1)</span>شفافیت هاور</label>
	<input type="range" min="0" max="1" step="0.05" value={config.provinces.hoverOpacity} on:input={handleInput('provinces.hoverOpacity')} />
</div>
<div class="control-group">
	<label><span class="value">{config.provinces.hoverEmissiveIntensity.toFixed(2)}</span><span class="range">(0-1.5)</span>شدت نور هاور</label>
	<input type="range" min="0" max="1.5" step="0.05" value={config.provinces.hoverEmissiveIntensity} on:input={handleInput('provinces.hoverEmissiveIntensity')} />
</div>
<div class="control-group">
	<label><span class="value">{config.provinces.hoverScale.toFixed(2)}</span><span class="range">(1-1.1)</span>بزرگ‌نمایی</label>
	<input type="range" min="1" max="1.1" step="0.01" value={config.provinces.hoverScale} on:input={handleInput('provinces.hoverScale')} />
</div>
<div class="control-group">
	<label><span class="value">{config.provinces.hoverAnimationDuration}</span><span class="range">(200-1000)</span>مدت انیمیشن بالا آمدن (ms)</label>
	<input type="range" min="200" max="1000" step="50" value={config.provinces.hoverAnimationDuration} on:input={handleInput('provinces.hoverAnimationDuration')} />
</div>
<div class="control-group">
	<label><span class="value">{config.provinces.resetAnimationDuration}</span><span class="range">(200-1000)</span>مدت انیمیشن برگشت (ms)</label>
	<input type="range" min="200" max="1000" step="50" value={config.provinces.resetAnimationDuration} on:input={handleInput('provinces.resetAnimationDuration')} />
</div>

<h3>🎨 استان‌ها - پترن</h3>
<div class="control-group">
	<label><span class="value">{config.provinces.patternOpacity.toFixed(2)}</span><span class="range">(0-1)</span>شفافیت پترن</label>
	<input type="range" min="0" max="1" step="0.05" value={config.provinces.patternOpacity} on:input={handleInput('provinces.patternOpacity')} />
</div>
<div class="control-group">
	<label><span class="value">{config.provinces.patternLineOpacity.toFixed(2)}</span><span class="range">(0-0.3)</span>شفافیت خطوط</label>
	<input type="range" min="0" max="0.3" step="0.01" value={config.provinces.patternLineOpacity} on:input={handleInput('provinces.patternLineOpacity')} />
</div>
<div class="control-group">
	<label><span class="value">{config.provinces.patternDotOpacity.toFixed(2)}</span><span class="range">(0-0.2)</span>شفافیت نقطه‌ها</label>
	<input type="range" min="0" max="0.2" step="0.01" value={config.provinces.patternDotOpacity} on:input={handleInput('provinces.patternDotOpacity')} />
</div>
<div class="control-group">
	<label><span class="value">{config.provinces.patternLineSpacing}</span><span class="range">(2-8)</span>فاصله خطوط</label>
	<input type="range" min="2" max="8" step="1" value={config.provinces.patternLineSpacing} on:input={handleInput('provinces.patternLineSpacing')} />
</div>
<div class="control-group">
	<label><span class="value">{config.provinces.patternDotSpacing}</span><span class="range">(4-16)</span>فاصله نقطه‌ها</label>
	<input type="range" min="4" max="16" step="1" value={config.provinces.patternDotSpacing} on:input={handleInput('provinces.patternDotSpacing')} />
</div>

<h3>🌊 دریاها - شکل و مواد</h3>
<div class="control-group">
	<label><span class="value">{config.water.extrudeDepth}</span><span class="range">(5-50)</span>ارتفاع دیواره دریاها</label>
	<input type="range" min="5" max="50" step="1" value={config.water.extrudeDepth} on:input={handleInput('water.extrudeDepth')} />
</div>
<div class="control-group">
	<label><span class="value">{config.water.opacity.toFixed(2)}</span><span class="range">(0-1)</span>شفافیت</label>
	<input type="range" min="0" max="1" step="0.05" value={config.water.opacity} on:input={handleInput('water.opacity')} />
</div>
<div class="control-group">
	<label><span class="value">{config.water.emissiveIntensity.toFixed(2)}</span><span class="range">(0-0.5)</span>شدت نور داخلی</label>
	<input type="range" min="0" max="0.5" step="0.01" value={config.water.emissiveIntensity} on:input={handleInput('water.emissiveIntensity')} />
</div>
<div class="control-group">
	<label><span class="value">{config.water.clearcoat.toFixed(2)}</span><span class="range">(0-1)</span>لایه شیشه‌ای</label>
	<input type="range" min="0" max="1" step="0.05" value={config.water.clearcoat} on:input={handleInput('water.clearcoat')} />
</div>

<h3>🌊 دریاها - خطوط حاشیه</h3>
<div style="font-size: 11px; color: rgba(0,200,255,0.6); margin-bottom: 10px;">💡 برای کاهش خطوط، زاویه لبه را بالاتر ببرید</div>
<div class="control-group">
	<label><span class="value">{config.water.borderOpacity.toFixed(2)}</span><span class="range">(0-1)</span>شفافیت خطوط</label>
	<input type="range" min="0" max="1" step="0.05" value={config.water.borderOpacity} on:input={handleInput('water.borderOpacity')} />
</div>
<div class="control-group">
	<label><span class="value">{config.water.borderWidth?.toFixed(1) || '3.0'}</span><span class="range">(1-10)</span>ضخامت خطوط</label>
	<input type="range" min="1" max="10" step="0.5" value={config.water.borderWidth || 3} on:input={handleInput('water.borderWidth')} />
</div>
<div class="control-group">
	<label><span class="value">{config.water.edgeAngle}</span><span class="range">(10-60)</span>زاویه لبه (بالاتر = خطوط کمتر)</label>
	<input type="range" min="10" max="60" step="1" value={config.water.edgeAngle} on:input={handleInput('water.edgeAngle')} />
</div>
<div class="control-group">
	<label><span class="value">{config.water.borderGlowIntensity?.toFixed(2) || '1.00'}</span><span class="range">(0-2)</span>شدت گلو خطوط</label>
	<input type="range" min="0" max="2" step="0.1" value={config.water.borderGlowIntensity || 1.0} on:input={handleInput('water.borderGlowIntensity')} />
</div>
<div class="color-group">
	<input type="color" value={config.water.borderColor ? '#' + config.water.borderColor.toString(16).padStart(6, '0') : '#00bbdd'} on:change={handleColorInput((v) => updateBorderColor('water', v))} />
	<label>رنگ خطوط سفارشی</label>
	{#if config.water.borderColor}
		<button class="clear-color-btn" on:click={() => clearBorderColor('water')}>✖</button>
	{/if}
</div>
<div style="font-size: 10px; color: rgba(150,150,150,0.7); margin-top: -8px; margin-bottom: 10px;">
	💡 اگر رنگ سفارشی نباشد، از رنگ دریا استفاده می‌شود
</div>
<div class="control-group">
	<label style="display: flex; align-items: center; gap: 8px;">
		<input type="checkbox" checked={config.water.borderOnTopOnly} on:change={(e) => handleCheckbox('water.borderOnTopOnly', e.target.checked)} />
		<span>فقط خطوط روی سطح بالا</span>
	</label>
</div>

<h3>🌊 رنگ دریاها</h3>
<div style="font-size: 11px; color: rgba(0,255,0,0.6); margin-bottom: 10px;">✅ تغییر رنگ‌ها فوری اعمال می‌شود</div>
<div class="color-group">
	<input type="color" value="#{config.waterColors.caspian.toString(16).padStart(6, '0')}" on:change={handleColorInput((v) => updateWaterColor('caspian', v))} />
	<label>دریای خزر</label>
</div>
<div class="color-group">
	<input type="color" value="#{config.waterColors.southWaters.toString(16).padStart(6, '0')}" on:change={handleColorInput((v) => updateWaterColor('southWaters', v))} />
	<label>خلیج فارس و دریای عمان</label>
</div>
<div class="color-group">
	<input type="color" value="#{config.waterColors.urmia.toString(16).padStart(6, '0')}" on:change={handleColorInput((v) => updateWaterColor('urmia', v))} />
	<label>دریاچه ارومیه</label>
</div>
<div class="color-group">
	<input type="color" value="#{config.waterColors.jazmourian.toString(16).padStart(6, '0')}" on:change={handleColorInput((v) => updateWaterColor('jazmourian', v))} />
	<label>دریاچه جازموریان</label>
</div>

<h3>💫 افکت Bloom (گلو)</h3>
<div style="font-size: 11px; color: rgba(255,255,0,0.6); margin-bottom: 10px;">⚡ تنظیم کلیدی برای نورانی بودن نقشه</div>
<div class="control-group">
	<label><span class="value">{config.bloom.strength.toFixed(1)}</span><span class="range">(0-3)</span>قدرت گلو</label>
	<input type="range" min="0" max="3" step="0.1" value={config.bloom.strength} on:input={handleInput('bloom.strength')} />
</div>
<div class="control-group">
	<label><span class="value">{config.bloom.radius.toFixed(2)}</span><span class="range">(0-1)</span>شعاع گلو</label>
	<input type="range" min="0" max="1" step="0.05" value={config.bloom.radius} on:input={handleInput('bloom.radius')} />
</div>
<div class="control-group">
	<label><span class="value">{config.bloom.threshold.toFixed(2)}</span><span class="range">(0-1)</span>آستانه روشنایی</label>
	<input type="range" min="0" max="1" step="0.05" value={config.bloom.threshold} on:input={handleInput('bloom.threshold')} />
</div>

<h3>📷 دوربین</h3>
<div class="control-group">
	<label><span class="value">{config.camera.fov}</span><span class="range">(30-75)</span>زاویه دید</label>
	<input type="range" min="30" max="75" step="5" value={config.camera.fov} on:input={handleInput('camera.fov')} />
</div>
<div class="control-group">
	<label><span class="value">{config.camera.positionY}</span><span class="range">(300-800)</span>ارتفاع</label>
	<input type="range" min="300" max="800" step="50" value={config.camera.positionY} on:input={handleInput('camera.positionY')} />
</div>
<div class="control-group">
	<label><span class="value">{config.camera.positionZ}</span><span class="range">(500-1200)</span>فاصله</label>
	<input type="range" min="500" max="1200" step="50" value={config.camera.positionZ} on:input={handleInput('camera.positionZ')} />
</div>
<div class="control-group">
	<label><span class="value">{config.camera.autoRotateSpeed.toFixed(1)}</span><span class="range">(0-2)</span>سرعت چرخش</label>
	<input type="range" min="0" max="2" step="0.1" value={config.camera.autoRotateSpeed} on:input={handleInput('camera.autoRotateSpeed')} />
</div>

<h3>💡 نورپردازی</h3>
<div style="font-size: 11px; color: rgba(255,200,0,0.6); margin-bottom: 10px;">💡 کنترل روشنایی کلی نقشه</div>
<div class="control-group">
	<label><span class="value">{config.lighting.ambientIntensity.toFixed(2)}</span><span class="range">(0-1)</span>نور محیطی</label>
	<input type="range" min="0" max="1" step="0.05" value={config.lighting.ambientIntensity} on:input={handleInput('lighting.ambientIntensity')} />
</div>
<div class="control-group">
	<label><span class="value">{config.lighting.directionalIntensity.toFixed(2)}</span><span class="range">(0-2)</span>نور جهت‌دار</label>
	<input type="range" min="0" max="2" step="0.1" value={config.lighting.directionalIntensity} on:input={handleInput('lighting.directionalIntensity')} />
</div>
<div class="control-group">
	<label><span class="value">{config.lighting.rimLight1Intensity.toFixed(2)}</span><span class="range">(0-2)</span>نور لبه 1</label>
	<input type="range" min="0" max="2" step="0.1" value={config.lighting.rimLight1Intensity} on:input={handleInput('lighting.rimLight1Intensity')} />
</div>
<div class="control-group">
	<label><span class="value">{config.lighting.rimLight2Intensity.toFixed(2)}</span><span class="range">(0-2)</span>نور لبه 2</label>
	<input type="range" min="0" max="2" step="0.1" value={config.lighting.rimLight2Intensity} on:input={handleInput('lighting.rimLight2Intensity')} />
</div>
<div class="control-group">
	<label><span class="value">{config.lighting.rimLight3Intensity.toFixed(2)}</span><span class="range">(0-2)</span>نور لبه 3</label>
	<input type="range" min="0" max="2" step="0.1" value={config.lighting.rimLight3Intensity} on:input={handleInput('lighting.rimLight3Intensity')} />
</div>

<h3>🎨 پس‌زمینه</h3>
<div class="color-group">
	<input type="color" value={bgColors.primary} on:change={handleColorInput((v) => updateBackground('primary', v))} />
	<label>رنگ اصلی پس‌زمینه</label>
</div>
<div class="color-group">
	<input type="color" value={bgColors.secondary} on:change={handleColorInput((v) => updateBackground('secondary', v))} />
	<label>رنگ ثانویه گرادیانت</label>
</div>
<div class="control-group">
	<label><span class="value">{config.background.vignette.toFixed(2)}</span><span class="range">(0-1)</span>شدت Vignette</label>
	<input type="range" min="0" max="1" step="0.05" value={config.background.vignette} on:input={handleInput('background.vignette')} />
</div>

<h3>🌈 رنگ مناطق</h3>
<div style="font-size: 11px; color: rgba(0,255,0,0.6); margin-bottom: 10px;">✅ تغییر رنگ‌ها فوری اعمال می‌شود</div>
{#each Object.entries(regionGroups) as [key, region]}
<div class="color-group">
	<input type="color" value="#{region.color.toString(16).padStart(6, '0')}" on:change={handleColorInput((v) => updateColor(key, v))} />
	<label>{region.name}</label>
</div>
{/each}

<h3>🎨 رنگ استان‌های جداگانه</h3>
<div style="font-size: 11px; color: rgba(255,200,0,0.6); margin-bottom: 10px;">
	💡 رنگ هر استان را جداگانه تنظیم کنید<br/>
	اگر تنظیم نکنید، از رنگ منطقه استفاده می‌شود
</div>
{#each Object.entries(provinceNames).sort((a, b) => a[1].localeCompare(b[1], 'fa')) as [key, name]}
<div class="color-group">
	<input type="color" value="#{(provinceColors[key] || 0xffffff).toString(16).padStart(6, '0')}" on:change={handleColorInput((v) => updateProvinceColor(key, v))} />
	<label>{name}</label>
</div>
{/each}

<button class="action-btn" on:click={fixPositions}>🔧 اصلاح موقعیت استان‌ها</button>
<button class="action-btn" on:click={exportConfig}>📋 کپی تنظیمات</button>
<button class="reset-btn" on:click={resetDefaults}>🔄 بازگشت به پیش‌فرض</button>
</div>


<style>
.toggle-btn {
	position: fixed; left: 20px; top: 20px;
	background: rgba(0, 255, 255, 0.2);
	border: 2px solid rgba(0, 255, 255, 0.5);
	color: #00ffff; padding: 10px 15px;
	border-radius: 8px; cursor: pointer; z-index: 999;
	font-family: 'vazirmatn', Tahoma, sans-serif;
	font-size: 14px; font-weight: 600;
	backdrop-filter: blur(10px); transition: all 0.3s;
}
.toggle-btn:hover {
	background: rgba(0, 255, 255, 0.4);
	box-shadow: 0 0 20px rgba(0, 255, 255, 0.6);
}
.toggle-btn.open { left: 390px; }

.panel {
	position: fixed; left: 20px; top: 20px;
	width: 350px; max-height: 90vh;
	background: rgba(5, 10, 20, 0.95);
	backdrop-filter: blur(20px);
	border: 2px solid rgba(0, 255, 255, 0.3);
	border-radius: 12px; padding: 20px; z-index: 1000;
	overflow-y: auto;
	box-shadow: 0 0 40px rgba(0, 255, 255, 0.2);
	transition: transform 0.3s ease;
	font-family: 'vazirmatn', Tahoma, sans-serif;
	direction: rtl;
}
.panel.hidden { transform: translateX(-400px); }
.panel::-webkit-scrollbar { width: 8px; }
.panel::-webkit-scrollbar-track {
	background: rgba(0, 0, 0, 0.3);
	border-radius: 4px;
}
.panel::-webkit-scrollbar-thumb {
	background: rgba(0, 255, 255, 0.5);
	border-radius: 4px;
}

h3 {
	color: #00ffff; font-size: 18px;
	margin: 15px 0 10px 0; padding-bottom: 8px;
	border-bottom: 1px solid rgba(0, 255, 255, 0.3);
	text-shadow: 0 0 10px currentColor;
}
h3:first-child { margin-top: 0; }

.control-group { margin-bottom: 15px; }
.control-group label {
	display: block;
	color: rgba(255, 255, 255, 0.9);
	font-size: 12px; margin-bottom: 5px;
	text-align: right;
}
.value {
	display: inline-block; float: left;
	color: #00ffff; font-size: 11px; font-weight: bold;
}
.range {
	display: inline-block; float: left;
	color: rgba(255, 255, 255, 0.5);
	font-size: 10px; margin-right: 8px;
}

input[type="range"] {
	width: 100%; height: 4px;
	background: rgba(0, 255, 255, 0.2);
	border-radius: 2px; outline: none;
	-webkit-appearance: none;
}
input[type="range"]::-webkit-slider-thumb {
	-webkit-appearance: none;
	width: 14px; height: 14px;
	background: #00ffff; border-radius: 50%;
	cursor: pointer;
	box-shadow: 0 0 10px rgba(0, 255, 255, 0.8);
}
input[type="range"]::-moz-range-thumb {
	width: 14px; height: 14px;
	background: #00ffff; border-radius: 50%;
	cursor: pointer; border: none;
	box-shadow: 0 0 10px rgba(0, 255, 255, 0.8);
}

.color-group {
	display: flex; gap: 10px;
	align-items: center; margin-bottom: 10px;
	position: relative;
}
.color-group input[type="color"] {
	width: 50px; height: 30px;
	border: 2px solid rgba(0, 255, 255, 0.5);
	border-radius: 5px;
	background: transparent; cursor: pointer;
}
.color-group label {
	flex: 1; margin: 0; text-align: right;
	color: rgba(255, 255, 255, 0.9);
	font-size: 12px;
}
.clear-color-btn {
	background: rgba(255, 50, 50, 0.3);
	border: 1px solid rgba(255, 100, 100, 0.5);
	color: #ff6666;
	padding: 4px 8px;
	border-radius: 4px;
	cursor: pointer;
	font-size: 12px;
	font-weight: bold;
	transition: all 0.2s;
}
.clear-color-btn:hover {
	background: rgba(255, 50, 50, 0.5);
	box-shadow: 0 0 10px rgba(255, 100, 100, 0.4);
}

.action-btn {
	width: 100%;
	background: linear-gradient(135deg, rgba(0, 255, 200, 0.3), rgba(0, 200, 255, 0.2));
	border: 2px solid rgba(0, 255, 200, 0.5);
	color: #00ffcc; padding: 10px;
	border-radius: 8px; cursor: pointer;
	font-family: 'vazirmatn', Tahoma, sans-serif;
	font-size: 13px; font-weight: 600;
	margin-top: 10px; transition: all 0.3s;
}
.action-btn:hover {
	background: linear-gradient(135deg, rgba(0, 255, 200, 0.5), rgba(0, 200, 255, 0.3));
	box-shadow: 0 0 20px rgba(0, 255, 200, 0.6);
}

.reset-btn {
	width: 100%;
	background: linear-gradient(135deg, rgba(255, 100, 100, 0.3), rgba(255, 50, 50, 0.2));
	border: 2px solid rgba(255, 100, 100, 0.5);
	color: #ff6666; padding: 10px;
	border-radius: 8px; cursor: pointer;
	font-family: 'vazirmatn', Tahoma, sans-serif;
	font-size: 13px; font-weight: 600;
	margin-top: 15px; transition: all 0.3s;
}
.reset-btn:hover {
	background: linear-gradient(135deg, rgba(255, 100, 100, 0.5), rgba(255, 50, 50, 0.3));
	box-shadow: 0 0 20px rgba(255, 100, 100, 0.6);
}
</style>
