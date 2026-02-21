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

            // Fix duplicate dark text color classes
            content = content.replace(/dark:text-slate-\d+\s+dark:text-slate-(\d+)/g, 'dark:text-slate-$1');

            // Fix duplicate dark:bg-slate-...
            content = content.replace(/dark:bg-slate-\d+\s+dark:bg-slate-(\d+)/g, 'dark:bg-slate-$1');

            if (content !== initialContent) {
                fs.writeFileSync(fullPath, content, 'utf8');
                console.log(`Cleaned duplicates: ${fullPath}`);
            }
        }
    }
}

processDir('/Users/saidurgaphani/Workspace/ForageAscend_KL/PPTracker/frontend/src/');
console.log('Cleanup complete.');
