const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function main() {
  console.log('Starting Intelligent Prompts Database Seeder...');
  
  const srcDir = path.join(
    'C:',
    'Users',
    'ASUS',
    'Desktop',
    'lead',
    'frontend',
    'asset',
    'prompt tools & languages files'
  );

  if (!fs.existsSync(srcDir)) {
    console.error(`Source directory not found at: ${srcDir}`);
    process.exit(1);
  }

  const files = fs.readdirSync(srcDir);
  console.log(`Found ${files.length} custom prompt files to analyze.`);

  let successCount = 0;

  for (const file of files) {
    const filePath = path.join(srcDir, file);
    const stats = fs.statSync(filePath);
    
    if (!stats.isFile()) continue;

    console.log(`Analyzing file: ${file}...`);
    const content = fs.readFileSync(filePath, 'utf8').trim();

    // Intelligent title and role mapping based on file content analysis
    let title = '';
    let category = 'Developer Rules';

    const contentLower = content.toLowerCase();

    if (contentLower.includes('django') && contentLower.includes('python')) {
      title = 'Senior Django Backend & API Engineer';
    } else if (contentLower.includes('laravel') && contentLower.includes('php')) {
      title = 'Senior Laravel Backend & API Engineer';
    } else if (contentLower.includes('swift') && contentLower.includes('swiftui')) {
      title = 'Senior iOS Engineer (Swift & SwiftUI)';
    } else if (contentLower.includes('net backend') || contentLower.includes('asp.net') || contentLower.includes('c#')) {
      title = 'Senior .NET Backend & API Engineer';
    } else if (contentLower.includes('pandas') && contentLower.includes('jupyter')) {
      title = 'Senior Data Analyst (Python, Pandas, Jupyter)';
    } else if (contentLower.includes('tailwind') && contentLower.includes('next.js')) {
      title = 'Senior Frontend Engineer (React, Next.js, Tailwind)';
    } else if (contentLower.includes('monorepo') && contentLower.includes('supabase')) {
      title = 'Senior Full-Stack TypeScript Monorepo Engineer';
    } else if (contentLower.includes('expo') && contentLower.includes('react native') && contentLower.includes('navigation')) {
      // Check if it's the general ruleset or specific
      if (file.includes('mobile-ruleset')) {
        title = 'Senior Mobile Ruleset (React Native, Expo)';
      } else {
        title = 'Senior Expo React Native Engineer';
      }
    } else {
      // Fallback clean title from filename
      title = file
        .replace('.mdc', '')
        .replace('.md', '')
        .replace(/[-_]+/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    }

    // Uniquify Copilot generic tags if any duplicates still map
    if (title.startsWith('Copilot Instructions')) {
      if (file.includes('(1)')) title = 'Senior Mobile Engineer (React Native & Expo)';
      else if (file.includes('(2)')) title = 'Senior Laravel Backend & API Engineer';
      else if (file.includes('(3)')) title = 'Senior iOS Engineer (Swift & SwiftUI)';
      else if (file.includes('(4)')) title = 'Senior Mobile Engineer (TypeScript & Expo)';
      else if (file.includes('(5)')) title = 'Senior Expo React Native Engineer';
      else if (file.includes('(6)')) title = 'Senior Full-Stack TypeScript Monorepo Engineer';
      else if (file.includes('(7)')) title = 'Senior .NET Backend & API Engineer';
    }

    // Generate descriptive summaries
    let description = `Official system instructions and coding patterns for ${title}.`;
    const firstLine = content.split('\n').find(line => line.trim().length > 20 && !line.includes('You are GitHub Copilot'));
    if (firstLine) {
      description = firstLine.replace(/^[#\-\*\s]+/, '').trim();
      if (description.length > 120) {
        description = description.substring(0, 117) + '...';
      }
    }

    try {
      // Delete old placeholder entry if exists to keep database perfectly clean
      const oldTitle = file
        .replace('.mdc', '')
        .replace('.md', '')
        .replace(/[-_]+/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

      await prisma.prompt.deleteMany({
        where: {
          OR: [
            { title: oldTitle },
            { title: title }
          ]
        }
      });

      // Insert new professional categorized prompt entry
      await prisma.prompt.create({
        data: {
          title: title,
          category: category,
          content: content,
          description: description
        }
      });
      successCount++;
      console.log(`[Analyzed & Seeded] "${title}"`);
    } catch (err) {
      console.error(`[Error] Failed to seed custom prompt from file "${file}":`, err);
    }
  }

  console.log(`🎉 Success! Dynamically recognized and upgraded ${successCount} custom prompt cards with professional titles.`);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
