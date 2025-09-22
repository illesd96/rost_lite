#!/usr/bin/env node

/**
 * Staging Database Setup Script
 * This script helps you set up your staging database with the correct schema
 */

const { execSync } = require('child_process');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🚀 Staging Database Setup');
console.log('=========================\n');

console.log('Please provide your staging database connection string from Neon:');
console.log('(It should look like: postgresql://username:password@ep-xxx.us-east-1.aws.neon.tech/neondb?sslmode=require)\n');

rl.question('Staging DATABASE_URL: ', (databaseUrl) => {
  if (!databaseUrl || !databaseUrl.includes('postgresql://')) {
    console.error('❌ Invalid database URL provided');
    process.exit(1);
  }

  console.log('\n📊 Setting up database schema...');
  
  try {
    // Set the DATABASE_URL environment variable temporarily
    process.env.DATABASE_URL = databaseUrl;
    
    console.log('🔄 Generating migration files...');
    execSync('npm run db:generate', { stdio: 'inherit' });
    
    console.log('🔄 Pushing schema to staging database...');
    execSync('npm run db:push', { stdio: 'inherit' });
    
    console.log('\n✅ Staging database setup completed successfully!');
    console.log('\n📋 Next steps:');
    console.log('1. Copy this DATABASE_URL to your Vercel environment variables');
    console.log('2. Set up other environment variables in Vercel');
    console.log('3. Deploy your staging branch');
    console.log('\n🔗 Your DATABASE_URL for Vercel:');
    console.log(databaseUrl);
    
  } catch (error) {
    console.error('❌ Error setting up database:', error.message);
    process.exit(1);
  }
  
  rl.close();
});
