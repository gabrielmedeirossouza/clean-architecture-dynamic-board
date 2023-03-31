import { defineConfig } from 'vite';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export default defineConfig({
	resolve: {
		alias: [
			{ find: "@", replacement: path.resolve(path.dirname(fileURLToPath(import.meta.url)), "./src") },
		]
	}
});
