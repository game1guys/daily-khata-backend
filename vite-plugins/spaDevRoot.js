/**
 * Serve Daily-KHATA React SPA at Vite dev server root (e.g. :5174) instead of the
 * default Laravel+Vite placeholder. Laravel app should still run on APP_URL for /api.
 */
export function spaDevRoot() {
    return {
        name: 'daily-khata-spa-dev-root',
        enforce: 'pre',
        configureServer(server) {
            server.middlewares.use((req, res, next) => {
                if (req.method !== 'GET') {
                    return next();
                }
                const path = req.url?.split('?')[0] ?? '';
                if (path !== '/' && path !== '/index.html') {
                    return next();
                }

                const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Daily-KHATA</title>
</head>
<body>
  <div id="root"></div>
  <script type="module">
import RefreshRuntime from "/@react-refresh";
RefreshRuntime.injectIntoGlobalHook(window);
window.$RefreshReg$ = () => {};
window.$RefreshSig$ = () => (type) => type;
window.__vite_plugin_react_preamble_installed__ = true;
  </script>
  <script type="module" src="/@vite/client"></script>
  <script type="module" src="/resources/js/daily-khata-web/main.tsx"></script>
</body>
</html>`;

                res.statusCode = 200;
                res.setHeader('Content-Type', 'text/html; charset=utf-8');
                res.end(html);
            });
        },
    };
}
