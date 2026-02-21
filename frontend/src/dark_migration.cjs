const fs = require('fs');
const path = require('path');

function processDir(dir) {
    const files = fs.readdirSync(dir);

    for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            processDir(fullPath);
        } else if (file.endsWith('.jsx') || file.endsWith('.js')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let initialContent = content;

            // Simple string replacement to append dark variants for commonly used classes
            const replacements = [
                { match: /\bbg-white\b/g, replace: 'bg-white dark:bg-slate-900' },
                { match: /\bbg-slate-50\b/g, replace: 'bg-slate-50 dark:bg-slate-800' },
                { match: /\bbg-slate-100\b/g, replace: 'bg-slate-100 dark:bg-slate-800/50' },
                { match: /\btext-slate-900\b/g, replace: 'text-slate-900 dark:text-slate-50' },
                { match: /\btext-slate-800\b/g, replace: 'text-slate-800 dark:text-slate-100' },
                { match: /\btext-slate-700\b/g, replace: 'text-slate-700 dark:text-slate-200' },
                { match: /\btext-slate-600\b/g, replace: 'text-slate-600 dark:text-slate-300' },
                { match: /\btext-slate-500\b/g, replace: 'text-slate-500 dark:text-slate-400' },
                { match: /\btext-slate-400\b/g, replace: 'text-slate-400 dark:text-slate-500' },
                { match: /\bborder-slate-200\b/g, replace: 'border-slate-200 dark:border-slate-700' },
                { match: /\bborder-slate-100\b/g, replace: 'border-slate-100 dark:border-slate-800' },
                { match: /\btext-white\b/g, replace: 'text-white dark:text-slate-50' },
                { match: /\Bbg-slate-50\b/g, replace: 'bg-slate-50 dark:bg-slate-800' }
            ];

            for (const r of replacements) {
                // To avoid multiple dark: classes if the script runs twice
                if (!content.includes(r.replace.split(' ')[1])) {
                    content = content.replace(r.match, r.replace);
                }
            }

            if (content !== initialContent) {
                fs.writeFileSync(fullPath, content, 'utf8');
                console.log(`Updated: ${fullPath}`);
            }
        }
    }
}

processDir('/Users/saidurgaphani/Workspace/ForageAscend_KL/PPTracker/frontend/src/');
console.log('Update complete.');
