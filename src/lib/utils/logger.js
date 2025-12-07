// ═══════════════════════════════════════════════════════════════
// 🔧 Logger Utility - کنترل نمایش console.log
// ═══════════════════════════════════════════════════════════════

// تنظیم این مقدار برای فعال/غیرفعال کردن لاگ‌ها
export const DEBUG_MODE = false;

// ذخیره console اصلی
const originalConsole = {
    log: console.log,
    warn: console.warn,
    error: console.error,
    info: console.info,
    debug: console.debug
};

// تابع لاگ که قابل کنترل است
export function log(...args) {
    if (DEBUG_MODE) {
        originalConsole.log(...args);
    }
}

export function warn(...args) {
    if (DEBUG_MODE) {
        originalConsole.warn(...args);
    }
}

export function error(...args) {
    // خطاها همیشه نمایش داده می‌شوند
    originalConsole.error(...args);
}

export function info(...args) {
    if (DEBUG_MODE) {
        originalConsole.info(...args);
    }
}

// Override کردن console سراسری (اختیاری)
export function enableGlobalOverride() {
    console.log = log;
    console.warn = warn;
    console.info = info;
    console.debug = log;
}

// بازگرداندن console به حالت اصلی
export function disableGlobalOverride() {
    console.log = originalConsole.log;
    console.warn = originalConsole.warn;
    console.info = originalConsole.info;
    console.debug = originalConsole.debug;
}

// Export default object
export default {
    log,
    warn,
    error,
    info,
    DEBUG_MODE,
    enableGlobalOverride,
    disableGlobalOverride
};
