// Diagnostic script to check for potential issues in the backend code

console.log('🔍 Diagnosing backend issues...\n');

// Check if required modules can be imported
const modulesToCheck = [
  './src/app.js',
  './src/server.js',
  './src/routes/auth.routes.js',
  './src/routes/user.routes.js',
  './src/routes/organization.routes.js',
  './src/routes/project.routes.js',
  './src/routes/generate.routes.js',
  './src/services/orchestrator.service.js',
  './src/services/llm.service.js',
  './src/services/ab-testing.service.js'
];

let issuesFound = 0;

modulesToCheck.forEach(modulePath => {
  try {
    require(modulePath);
    console.log(`✅ ${modulePath} - OK`);
  } catch (error) {
    console.log(`❌ ${modulePath} - ERROR: ${error.message}`);
    issuesFound++;
  }
});

console.log(`\n📊 Diagnosis complete:`);
console.log(`   Modules checked: ${modulesToCheck.length}`);
console.log(`   Issues found: ${issuesFound}`);

if (issuesFound === 0) {
  console.log('✅ No issues found! The backend should start successfully.');
} else {
  console.log('⚠️  Issues found. Please review the errors above.');
}