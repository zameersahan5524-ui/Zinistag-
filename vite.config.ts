import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import fs from 'fs';
import path from 'path';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    {
      name: 'serve-videos-optimized',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          const parsedUrl = (req.url || '').split('?')[0];

          // Video Streaming with HTTP 206 Partial Content & Caching
          if (parsedUrl.startsWith('/videos/')) {
            const fileName = path.basename(parsedUrl);
            const filePath = path.resolve(__dirname, 'public/videos', fileName);

            if (fs.existsSync(filePath)) {
              const stat = fs.statSync(filePath);
              const fileSize = stat.size;
              const range = req.headers.range;

              res.setHeader('Accept-Ranges', 'bytes');
              res.setHeader('Content-Type', 'video/mp4');
              res.setHeader('Cache-Control', 'public, max-age=604800, stale-while-revalidate=86400');
              res.setHeader('Access-Control-Allow-Origin', '*');

              if (range) {
                const parts = range.replace(/bytes=/, '').split('-');
                const start = parseInt(parts[0], 10);
                const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

                if (start >= fileSize || end >= fileSize || start > end) {
                  res.writeHead(416, {
                    'Content-Range': `bytes */${fileSize}`
                  });
                  res.end();
                  return;
                }

                const chunksize = end - start + 1;
                res.writeHead(206, {
                  'Content-Range': `bytes ${start}-${end}/${fileSize}`,
                  'Content-Length': chunksize
                });

                const stream = fs.createReadStream(filePath, { start, end });
                req.on('close', () => stream.destroy());
                stream.pipe(res);
                return;
              } else {
                res.writeHead(200, {
                  'Content-Length': fileSize
                });
                const stream = fs.createReadStream(filePath);
                req.on('close', () => stream.destroy());
                stream.pipe(res);
                return;
              }
            }
          }

          next();
        });
      }
    },
    {
      name: 'serve-aab-direct',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (req.url === '/app-release.aab' || req.url?.startsWith('/app-release.aab?')) {
            const possiblePaths = [
              path.resolve(__dirname, 'public/app-release.aab'),
              path.resolve(__dirname, 'app-release.aab'),
              path.resolve(__dirname, 'dist/app-release.aab')
            ];
            for (const filePath of possiblePaths) {
              if (fs.existsSync(filePath)) {
                const stat = fs.statSync(filePath);
                res.writeHead(200, {
                  'Content-Type': 'application/octet-stream',
                  'Content-Disposition': 'attachment; filename="app-release.aab"',
                  'Content-Length': stat.size,
                  'Access-Control-Allow-Origin': '*',
                  'Cache-Control': 'no-cache'
                });
                fs.createReadStream(filePath).pipe(res);
                return;
              }
            }
          }
          next();
        });
      }
    }
  ],
  server: {
    port: 3000,
    host: '0.0.0.0',
    strictPort: true
  }
});
