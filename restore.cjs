const fs = require('fs');

function replaceReturnBlock(file, replacementFile, trimTail = 0) {
  const content = fs.readFileSync(file, 'utf8');
  let replacement = fs.readFileSync(replacementFile, 'utf8');
  
  if (trimTail > 0) {
    const lines = replacement.split('\n');
    replacement = lines.slice(0, lines.length - trimTail).join('\n');
  }

  const returnIndex = content.lastIndexOf('return (');
  if (returnIndex === -1) { console.error("No return found in", file); return; }
  
  const beforeReturn = content.slice(0, returnIndex);
  
  // Wrap replacement in return () if necessary
  const newContent = beforeReturn + 'return (\n' + replacement + '\n  );\n};\n\nexport default ' + file.split('/').pop().replace('.tsx', '') + ';';
  
  fs.writeFileSync(file, newContent);
  console.log("Restored", file);
}

replaceReturnBlock('components/sections/ProjectsSection.tsx', '/tmp/projects_raw.tsx', 3);
replaceReturnBlock('components/sections/TestimonialsSection.tsx', '/tmp/old_testimonials.txt', 2);
replaceReturnBlock('components/sections/AboutSection.tsx', '/tmp/about_raw.tsx', 2);
replaceReturnBlock('components/sections/HeroSection.tsx', '/tmp/hero_raw.tsx', 1);

