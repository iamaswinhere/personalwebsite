/**
 * Environment Variable Loader
 * Fetches .env file and parses it for the browser.
 * Note: This requires the site to be served via a web server (e.g., Live Server), not file:// protocol.
 */
const EnvLoader = {
    variables: {},

    async load() {
        try {
            const response = await fetch('./.env');
            if (!response.ok) {
                console.warn('Failed to load .env file');
                return;
            }
            const text = await response.text();
            this.parse(text);
            this.notify();
        } catch (error) {
            console.error('Error loading .env file:', error);
            // Fallback hardcoded values if fetch fails (e.g. file:// protocol)
            this.variables = {
                EMAILJS_SERVICE_ID: "service_8c1dh5l",
                EMAILJS_TEMPLATE_ID: "template_yg1eq5z",
                EMAILJS_PUBLIC_KEY: "YKL6q15I_ye09BF-c"
            };
            this.notify();
        }
    },

    parse(text) {
        const lines = text.split('\n');
        lines.forEach(line => {
            // Skip comments and empty lines
            if (!line || line.startsWith('#')) return;

            const [key, value] = line.split('=');
            if (key && value) {
                this.variables[key.trim()] = value.trim();
            }
        });

        // Expose globally
        window.env = this.variables;
    },

    notify() {
        // Dispatch event so script.js knows variables are ready
        window.dispatchEvent(new Event('env-ready'));
    }
};

// Start loading
EnvLoader.load();
