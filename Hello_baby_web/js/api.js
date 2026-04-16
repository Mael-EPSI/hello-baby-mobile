// API helper – wraps fetch with auth headers, timeout and error handling
const Api = {
  async request(endpoint, options = {}) {
    const url = buildUrl(endpoint);
    const token = Auth.getToken();

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), Config.APP.TIMEOUT);

    const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    try {
      if (Config.DEV.SHOW_API_LOGS) console.log(`[API] ${options.method || 'GET'} ${url}`);

      const res = await fetch(url, {
        ...options,
        headers,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const text = await res.text();
      if (isHtmlResponse(text)) throw new Error(Config.ERROR_MESSAGES.BACKEND_DOWN);

      let data;
      try { data = JSON.parse(text); } catch { data = text; }

      if (!res.ok) {
        const msg = (data && data.message) || (data && data.error) || `Erreur ${res.status}`;
        throw new Error(msg);
      }

      return data;
    } catch (err) {
      clearTimeout(timeoutId);
      if (err.name === 'AbortError') throw new Error(Config.ERROR_MESSAGES.TIMEOUT);
      throw err;
    }
  },

  get(endpoint) {
    return this.request(endpoint, { method: 'GET' });
  },

  post(endpoint, body) {
    return this.request(endpoint, { method: 'POST', body: JSON.stringify(body) });
  },

  patch(endpoint, body) {
    return this.request(endpoint, { method: 'PATCH', body: JSON.stringify(body) });
  },

  put(endpoint, body) {
    return this.request(endpoint, { method: 'PUT', body: JSON.stringify(body) });
  },

  delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  },
};
