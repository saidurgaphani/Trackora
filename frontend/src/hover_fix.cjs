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

            // Fix hover pseudo-classes corrupted by simple string replace
            // E.g. hover:bg-slate-50 dark:bg-slate-800 -> hover:bg-slate-50 dark:hover:bg-slate-800
            content = content.replace(/hover:bg-slate-50 dark:bg-slate-800/g, 'hover:bg-slate-50 dark:hover:bg-slate-800');
            content = content.replace(/hover:bg-slate-100 dark:bg-slate-800\/50/g, 'hover:bg-slate-100 dark:hover:bg-slate-800/50');
            content = content.replace(/hover:text-slate-900 dark:text-slate-50/g, 'hover:text-slate-900 dark:hover:text-slate-50');
            content = content.replace(/hover:bg-red-50(\s|"|')/g, 'hover:bg-red-50 dark:hover:bg-red-900/30$1');

            if (content !== initialContent) {
                fs.writeFileSync(fullPath, content, 'utf8');
                console.log(`Updated hover states: ${fullPath}`);
            }
        }
    }
}

processDir('/Users/saidurgaphani/Workspace/ForageAscend_KL/PPTracker/frontend/src/');
console.log('Hover fix complete.');
