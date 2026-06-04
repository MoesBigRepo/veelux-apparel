import { renderToReadableStream, renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router';
import { HelmetProvider, type HelmetServerState } from '@dr.pogodin/react-helmet';
import App from './App';

/**
 * SSG render for one route, two passes:
 *  1. Streaming pass with allReady — forces every React.lazy route chunk to
 *     load and resolve (renderToString alone would emit Suspense fallbacks).
 *  2. renderToString pass — lazy components now resolve synchronously and the
 *     helmet server state captures the route's head (title/meta/link/JSON-LD).
 */
export async function render(path: string) {
  let helmet: HelmetServerState | undefined;
  const tree = (capture: boolean) => (
    <HelmetProvider onServerState={capture ? (s) => { helmet = s; } : undefined}>
      <StaticRouter location={path} basename={import.meta.env.BASE_URL}>
        <App />
      </StaticRouter>
    </HelmetProvider>
  );

  // Pass 1: warm lazy chunks.
  const warm = await renderToReadableStream(tree(false));
  await warm.allReady;
  await new Response(warm).text();

  // Pass 2: synchronous capture.
  const html = renderToString(tree(true));
  return { html, helmet };
}
