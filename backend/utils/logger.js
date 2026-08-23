/**
 * Clean structured logger for TrendForge Backend
 * Ensures secrets (API keys, tokens) are NEVER printed to stdout or stored.
 */

function sanitize(data) {
  if (!data) return data;
  if (typeof data === 'string') {
    return data.replace(/(sk-[a-zA-Z0-9_-]{20,})|(Bearer\s+[a-zA-Z0-9._-]+)|(key-[a-zA-Z0-9]+)/gi, '[REDACTED_SECRET]');
  }
  if (typeof data === 'object') {
    const cleanObj = Array.isArray(data) ? [] : {};
    for (const key of Object.keys(data)) {
      if (/key|secret|token|password|auth|bearer/i.test(key)) {
        cleanObj[key] = '[REDACTED_SECRET]';
      } else {
        cleanObj[key] = sanitize(data[key]);
      }
    }
    return cleanObj;
  }
  return data;
}

const logger = {
  info: (msg, meta = {}) => {
    console.log(`[INFO] [${new Date().toISOString()}] ${msg}`, Object.keys(meta).length ? sanitize(meta) : '');
  },
  warn: (msg, meta = {}) => {
    console.warn(`[WARN] [${new Date().toISOString()}] ${msg}`, Object.keys(meta).length ? sanitize(meta) : '');
  },
  error: (msg, error = {}) => {
    console.error(`[ERROR] [${new Date().toISOString()}] ${msg}`, sanitize(error.message || error));
  },
  step: (stepIndex, tool, status, details = {}) => {
    console.log(`[STEP ${stepIndex}] [${tool}] -> ${status}`, sanitize(details));
  }
};

module.exports = logger;
