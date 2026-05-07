const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

function parseCSV(content) {
  const lines = [];
  let row = [];
  let cell = '';
  let inQuotes = false;

  for (let i = 0; i < content.length; i++) {
    const char = content[i];
    const nextChar = content[i + 1];

    if (inQuotes) {
      if (char === '"') {
        if (nextChar === '"') {
          cell += '"';
          i++; // Skip next quote
        } else {
          inQuotes = false;
        }
      } else {
        cell += char;
      }
    } else {
      if (char === '"') {
        inQuotes = true;
      } else if (char === ',') {
        row.push(cell);
        cell = '';
      } else if (char === '\n' || char === '\r') {
        if (char === '\r' && nextChar === '\n') {
          i++;
        }
        row.push(cell);
        lines.push(row);
        row = [];
        cell = '';
      } else {
        cell += char;
      }
    }
  }
  if (row.length > 0 || cell !== '') {
    row.push(cell);
    lines.push(row);
  }
  return lines;
}

async function main() {
  console.log('Starting Prompt Database Seeder...');
  
  const csvPath = path.join(
    'C:',
    'Users',
    'ASUS',
    'Desktop',
    'lead',
    'frontend',
    'asset',
    'prompt db',
    'prompts.chat-main',
    'prompts.chat-main',
    'prompts.csv'
  );

  if (!fs.existsSync(csvPath)) {
    console.error(`CSV file not found at path: ${csvPath}`);
    process.exit(1);
  }

  console.log('Reading prompts.csv...');
  const csvContent = fs.readFileSync(csvPath, 'utf8');
  
  console.log('Parsing CSV content...');
  const rows = parseCSV(csvContent);
  
  // Shift headers
  const headers = rows.shift();
  console.log(`Headers found: ${headers ? headers.join(', ') : 'None'}`);
  console.log(`Total rows parsed from CSV: ${rows.length}`);

  // Filter out any invalid/empty rows
  const validRows = rows.filter(r => r.length >= 2 && r[0] && r[1]);
  console.log(`Valid prompts found: ${validRows.length}`);

  console.log('Clearing existing Prompts table to avoid duplicates...');
  await prisma.prompt.deleteMany({});

  console.log('Inserting prompts in batches...');
  const batchSize = 100;
  let successCount = 0;

  for (let i = 0; i < validRows.length; i += batchSize) {
    const batch = validRows.slice(i, i + batchSize);
    
    const promptData = batch.map(row => {
      const act = row[0].trim();
      const promptText = row[1].trim();
      const forDevs = row[2] ? row[2].trim().toUpperCase() === 'TRUE' : false;
      const type = row[3] ? row[3].trim() : 'TEXT';

      // Auto category mapping
      let category = 'General';
      if (forDevs) {
        category = 'Coding';
      } else if (['Storyteller', 'Poet', 'Rapper', 'Novelist', 'Screenwriter'].includes(act)) {
        category = 'Creative';
      } else if (['Math Teacher', 'Philosophy Teacher', 'Instructor in a School'].includes(act)) {
        category = 'Education';
      } else if (['Life Coach', 'Relationship Coach', 'Mental Health Adviser', 'Personal Trainer'].includes(act)) {
        category = 'Lifestyle';
      } else if (['Synonym Finder', 'English Translator and Improver', 'Emoji Translator'].includes(act)) {
        category = 'Language';
      }

      // Generate clean description
      let description = `Activate the ${act} persona for specialized assistance and context-aware responses.`;
      if (promptText.length > 120) {
        description = promptText.substring(0, 117) + '...';
      }

      return {
        title: act,
        category: category,
        content: promptText,
        description: description
      };
    });

    try {
      await prisma.prompt.createMany({
        data: promptData,
        skipDuplicates: true
      });
      successCount += promptData.length;
      console.log(`[Batch Progress] Successfully inserted prompts: ${successCount} / ${validRows.length}`);
    } catch (err) {
      console.error(`Error inserting batch at index ${i}:`, err);
    }
  }

  console.log(`🎉 Database Seeding Complete! Seeded ${successCount} prompts successfully.`);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
