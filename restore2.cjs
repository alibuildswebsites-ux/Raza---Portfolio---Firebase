const fs = require('fs');

function wrapReturnBlock(file) {
  const content = fs.readFileSync(file, 'utf8');
  
  const returnIndex = content.lastIndexOf('return (');
  if (returnIndex === -1) return;
  
  const beforeReturn = content.slice(0, returnIndex + 8);
  const afterReturn = content.slice(returnIndex + 8);
  
  const newContent = beforeReturn + '\n    <>\n' + afterReturn.replace(/\s*\);\s*};\s*export default [^;]+;?\s*$/, '\n    </>\n  );\n};\n\nexport default ' + file.split('/').pop().replace('.tsx', '') + ';');
  
  fs.writeFileSync(file, newContent);
}

wrapReturnBlock('components/sections/ProjectsSection.tsx');
wrapReturnBlock('components/sections/TestimonialsSection.tsx');
wrapReturnBlock('components/sections/AboutSection.tsx');
wrapReturnBlock('components/sections/HeroSection.tsx');
