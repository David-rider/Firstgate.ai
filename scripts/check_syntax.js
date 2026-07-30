import fs from 'fs';
import path from 'path';
import vm from 'vm';

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

// 4. Detailed Duplicate Key & Parity Check in translations.js
console.log('\n4. Checking translations.js Duplicate Keys & Parity...');
try {
  const fileContent = fs.readFileSync('js/translations.js', 'utf-8');
  const lines = fileContent.split('\n');

  let currentLang = null;
  const langKeyLines = { en: {}, 'zh-CN': {}, 'zh-TW': {} };
  const duplicates = [];

  lines.forEach((line, idx) => {
    const lineNum = idx + 1;
    if (line.includes("'en': {")) currentLang = 'en';
    else if (line.includes("'zh-CN': {")) currentLang = 'zh-CN';
    else if (line.includes("'zh-TW': {")) currentLang = 'zh-TW';

    if (currentLang) {
      const match = line.match(/^\s*['"]([a-zA-Z0-9_.-]+)['"]\s*:/);
      if (match) {
        const key = match[1];
        if (langKeyLines[currentLang][key]) {
          duplicates.push({ lang: currentLang, key, firstLine: langKeyLines[currentLang][key], dupLine: lineNum });
        } else {
          langKeyLines[currentLang][key] = lineNum;
        }
      }
    }
  });

  if (duplicates.length > 0) {
    console.error(`   ❌ CRITICAL: Found ${duplicates.length} DUPLICATE KEYS in translations.js!`);
    duplicates.forEach(d => {
      console.error(`      - [${d.lang}] Key '${d.key}' defined at line ${d.firstLine} AND line ${d.dupLine}`);
    });
    errorCount++;
  } else {
    console.log(`   ✅ NO duplicate keys found inside language blocks`);
  }

  const { translations } = await import(`file:///${path.resolve('js/translations.js').replace(/\\/g, '/')}`);
  const enKeys = new Set(Object.keys(translations['en']));
  const cnKeys = new Set(Object.keys(translations['zh-CN']));
  const twKeys = new Set(Object.keys(translations['zh-TW']));

  console.log(`   Total unique keys: en=${enKeys.size}, zh-CN=${cnKeys.size}, zh-TW=${twKeys.size}`);

  const missingInCN = [...enKeys].filter(k => !cnKeys.has(k));
  const missingInTW = [...enKeys].filter(k => !twKeys.has(k));

  if (missingInCN.length > 0) {
    console.error(`   ❌ Missing ${missingInCN.length} keys in zh-CN:`, missingInCN);
    errorCount++;
  } else {
    console.log(`   ✅ zh-CN has 100% parity with 'en' (${cnKeys.size}/${enKeys.size})`);
  }

  if (missingInTW.length > 0) {
    console.error(`   ❌ Missing ${missingInTW.length} keys in zh-TW:`, missingInTW);
    errorCount++;
  } else {
    console.log(`   ✅ zh-TW has 100% parity with 'en' (${twKeys.size}/${enKeys.size})`);
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
