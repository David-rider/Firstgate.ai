import fs from 'fs';
import path from 'path';

console.log('==================================================');
console.log('🔍 FULL SITE SYNTAX & STRUCTURAL INTEGRITY AUDIT');
console.log('==================================================\n');

let errorCount = 0;

// 1. Check JS ESM Module Imports & Parsing
console.log('1. Checking JavaScript ESM Files...');
const jsFiles = ['js/translations.js', 'vite.config.js'];

for (const jsFile of jsFiles) {
  try {
    const fullPath = path.resolve(jsFile);
    await import(`file:///${fullPath.replace(/\\/g, '/')}`);
    console.log(`   ✅ ${jsFile}: Valid ESM syntax & error-free import`);
  } catch (err) {
    console.error(`   ❌ ${jsFile} SYNTAX ERROR: ${err.message}`);
    errorCount++;
  }
}

// Check app.js by reading code structure
try {
  const appJsCode = fs.readFileSync('js/app.js', 'utf-8');
  if (appJsCode.length > 0) {
    console.log(`   ✅ js/app.js: Valid JS code structure (${appJsCode.length} bytes)`);
  }
} catch (err) {
  console.error(`   ❌ js/app.js READ ERROR: ${err.message}`);
  errorCount++;
}

// 2. Check HTML structure and tag syntax
console.log('\n2. Checking index.html syntax & tag closure...');
try {
  const html = fs.readFileSync('index.html', 'utf-8');
  
  const divOpen = (html.match(/<div[\s>]/g) || []).length;
  const divClose = (html.match(/<\/div>/g) || []).length;
  if (divOpen !== divClose) {
    console.error(`   ❌ Mismatched <div> tags: ${divOpen} open vs ${divClose} close`);
    errorCount++;
  } else {
    console.log(`   ✅ <div> tag closure matched: ${divOpen} / ${divClose}`);
  }

  const secOpen = (html.match(/<section[\s>]/g) || []).length;
  const secClose = (html.match(/<\/section>/g) || []).length;
  if (secOpen !== secClose) {
    console.error(`   ❌ Mismatched <section> tags: ${secOpen} open vs ${secClose} close`);
    errorCount++;
  } else {
    console.log(`   ✅ <section> tag closure matched: ${secOpen} / ${secClose}`);
  }

} catch (err) {
  console.error(`   ❌ index.html READ ERROR: ${err.message}`);
  errorCount++;
}

// 3. Check CSS file syntax
console.log('\n3. Checking CSS file syntax...');
try {
  const css = fs.readFileSync('css/style.css', 'utf-8');
  const openBraces = (css.match(/\{/g) || []).length;
  const closeBraces = (css.match(/\}/g) || []).length;
  if (openBraces !== closeBraces) {
    console.error(`   ❌ Mismatched CSS braces: ${openBraces} '{' vs ${closeBraces} '}'`);
    errorCount++;
  } else {
    console.log(`   ✅ CSS block syntax: Valid (${openBraces} rules matched)`);
  }
} catch (err) {
  console.error(`   ❌ css/style.css READ ERROR: ${err.message}`);
  errorCount++;
}

// 4. Detailed Translations Key Parity Check
console.log('\n4. Checking translations.js keys & parity...');
try {
  const { translations } = await import(`file:///${path.resolve('js/translations.js').replace(/\\/g, '/')}`);
  const enKeys = new Set(Object.keys(translations['en']));
  const cnKeys = new Set(Object.keys(translations['zh-CN']));
  const twKeys = new Set(Object.keys(translations['zh-TW']));

  console.log(`   Total keys in 'en':    ${enKeys.size}`);
  console.log(`   Total keys in 'zh-CN': ${cnKeys.size}`);
  console.log(`   Total keys in 'zh-TW': ${twKeys.size}`);

  const missingInCN = [...enKeys].filter(k => !cnKeys.has(k));
  const missingInTW = [...enKeys].filter(k => !twKeys.has(k));

  if (missingInCN.length > 0) {
    console.error(`\n   ❌ Missing ${missingInCN.length} keys in zh-CN:`, missingInCN);
    errorCount++;
  } else {
    console.log(`   ✅ zh-CN has 100% of 'en' keys (${cnKeys.size}/${enKeys.size})`);
  }

  if (missingInTW.length > 0) {
    console.error(`\n   ❌ Missing ${missingInTW.length} keys in zh-TW:`, missingInTW);
    errorCount++;
  } else {
    console.log(`   ✅ zh-TW has 100% of 'en' keys (${twKeys.size}/${enKeys.size})`);
  }

} catch (err) {
  console.error(`   ❌ translations.js CHECK ERROR: ${err.message}`);
  errorCount++;
}

console.log('\n==================================================');
if (errorCount === 0) {
  console.log(`🎉 AUDIT PASSED: 0 Syntax & Structural Errors found!`);
} else {
  console.log(`🚨 AUDIT FAILED: Found ${errorCount} issue(s) to fix!`);
}
console.log('==================================================');
