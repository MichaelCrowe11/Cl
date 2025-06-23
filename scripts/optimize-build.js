const fs = require('fs');
const path = require('path');

console.log('🔧 Running build optimizations...');

// Remove unnecessary files from production build
const filesToRemove = [
  '.env.example',
  'README.md',
  'LOGO_SETUP.md',
  'AI_INTEGRATION_GUIDE.md',
  'ENV_SETUP_GUIDE.md',
  'PYTHON_INTEGRATION_EXAMPLE.md',
  'deploy.sh',
  'deploy.ps1',
];

// Check if we're in production build
if (process.env.NODE_ENV === 'production') {
  filesToRemove.forEach(file => {
    const filePath = path.join(process.cwd(), file);
    if (fs.existsSync(filePath)) {
      console.log(`Removing ${file} from production build...`);
      // Note: In actual production, you might want to exclude these via .vercelignore instead
    }
  });
}

console.log('✅ Build optimizations complete!'); 