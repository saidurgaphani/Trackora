const fs = require('fs');
const path = require('path');

const srcDir = path.resolve(__dirname, '../Trackora/src');
const destDir = path.resolve(__dirname, './src');

// Keep ui components where they are standard
const uiSrc = path.join(srcDir, 'components/ui');
const uiDest = path.join(destDir, 'components/ui');

// Put trackora's specific landing components in /landing
const componentsSrc = path.join(srcDir, 'components');
const componentsDest = path.join(destDir, 'components/landing');

const pagesSrc = path.join(srcDir, 'pages');
const assetsSrc = path.join(srcDir, 'assets');
const assetsDest = path.join(destDir, 'assets');

function ensureDir(dir) {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
}

ensureDir(uiDest);
ensureDir(componentsDest);
ensureDir(assetsDest);

// 1. Copy UI
fs.readdirSync(uiSrc).forEach(file => {
    fs.copyFileSync(path.join(uiSrc, file), path.join(uiDest, file));
});

// 2. Copy components (not 'ui') and modify imports
fs.readdirSync(componentsSrc).forEach(file => {
    const fullPath = path.join(componentsSrc, file);
    if (!fs.statSync(fullPath).isDirectory()) {
        let content = fs.readFileSync(fullPath, 'utf8');
        // Replace absolute @/components/ imports to point to @/components/landing unless it is ui/
        content = content.replace(/@\/components\/(?!ui\/)/g, '@/components/landing/');
        fs.writeFileSync(path.join(componentsDest, file), content);
    }
});

// 3. Copy pages
const indexPage = path.join(pagesSrc, 'Index.tsx');
if (fs.existsSync(indexPage)) {
    let content = fs.readFileSync(indexPage, 'utf8');
    content = content.replace(/@\/components\/(?!ui\/)/g, '@/components/landing/');
    fs.writeFileSync(path.join(destDir, 'pages/Landing.tsx'), content);
}

// 4. Copy assets
if (fs.existsSync(assetsSrc)) {
    fs.readdirSync(assetsSrc).forEach(file => {
        fs.copyFileSync(path.join(assetsSrc, file), path.join(assetsDest, file));
    });
}

// 5. Append required CSS
const oldCss = fs.readFileSync(path.join(destDir, 'index.css'), 'utf8');
// Append trackora theme vars inside a sub block so it doesn't conflict, or just append root
const trackoraCss = `
@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 220 20% 12%;
    --card: 0 0% 100%;
    --card-foreground: 220 20% 12%;
    --popover: 0 0% 100%;
    --popover-foreground: 220 20% 12%;
    --primary: 25 95% 53%;
    --primary-foreground: 0 0% 100%;
    --secondary: 33 100% 96%;
    --secondary-foreground: 20 92% 48%;
    --muted: 220 14% 96%;
    --muted-foreground: 220 10% 46%;
    --accent: 25 95% 53%;
    --accent-foreground: 0 0% 100%;
    --destructive: 0 84% 60%;
    --destructive-foreground: 0 0% 100%;
    --border: 220 13% 91%;
    --input: 220 13% 91%;
    --ring: 25 95% 53%;
    --radius: 0.75rem;
    --hero-gradient: linear-gradient(135deg, hsl(25 95% 53%), hsl(20 92% 48%));
    --card-shadow: 0 4px 24px -4px hsl(220 20% 12% / 0.08);
    --card-shadow-hover: 0 8px 32px -4px hsl(220 20% 12% / 0.14);
  }

  .dark {
    --background: 220 20% 7%;
    --foreground: 0 0% 95%;
    --card: 220 20% 10%;
    --card-foreground: 0 0% 95%;
    --popover: 220 20% 10%;
    --popover-foreground: 0 0% 95%;
    --primary: 25 95% 60%;
    --primary-foreground: 0 0% 100%;
    --secondary: 220 20% 14%;
    --secondary-foreground: 0 0% 90%;
    --muted: 220 20% 14%;
    --muted-foreground: 220 10% 60%;
    --accent: 25 95% 60%;
    --accent-foreground: 0 0% 100%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 0 0% 100%;
    --border: 220 20% 18%;
    --input: 220 20% 18%;
    --ring: 25 95% 60%;
  }
}

@layer utilities {
  .text-gradient-primary {
    @apply bg-clip-text text-transparent;
    background-image: var(--hero-gradient);
  }
  .shadow-card {
    box-shadow: var(--card-shadow);
  }
  .shadow-card-hover {
    box-shadow: var(--card-shadow-hover);
  }
}

@keyframes marquee {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}

.animate-marquee {
  animation: marquee 25s linear infinite;
}
`;

if (!oldCss.includes('--hero-gradient')) {
    fs.writeFileSync(path.join(destDir, 'index.css'), oldCss + '\\n' + trackoraCss);
}

console.log('Copy complete!');
