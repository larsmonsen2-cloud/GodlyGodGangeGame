import { writeFileSync } from 'node:fs';
import { createServer } from 'vite';
const server = await createServer({ server: { middlewareMode: true } });
try {
 const { balanceMarkdown } = await server.ssrLoadModule('/src/balance.ts');
 writeFileSync('docs/arena-balance.md', balanceMarkdown());
 console.log('Updated docs/arena-balance.md');
} finally { await server.close(); }
