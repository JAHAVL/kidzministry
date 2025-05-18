// This is a temporary script to debug policy ID issues

const fs = require('fs');
const path = require('path');

// Read the policyData.ts file
const policyPath = path.join(__dirname, 'data', 'policyData.ts');
const fileContent = fs.readFileSync(policyPath, 'utf8');

// Extract IDs
const idRegex = /id: ['"](.*)['"],/g;
let match;
const ids = [];

while ((match = idRegex.exec(fileContent)) !== null) {
  ids.push(match[1]);
}

// Print the IDs
console.log('Policy IDs:', ids);

// Check for duplicates
const uniqueIds = new Set(ids);
if (uniqueIds.size !== ids.length) {
  console.log('ALERT: Duplicate IDs found!');
  const duplicates = ids.filter((item, index) => ids.indexOf(item) !== index);
  console.log('Duplicate IDs:', duplicates);
} else {
  console.log('No duplicate IDs found.');
}

console.log('Total policies:', ids.length);
console.log('Unique IDs:', uniqueIds.size);
