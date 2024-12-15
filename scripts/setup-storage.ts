import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

// Load environment variables from .env file
dotenv.config({ path: resolve(__dirname, '../.env') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing environment variables:');
  console.error('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? '✓' : '✗');
  console.error('SUPABASE_SERVICE_ROLE_KEY:', supabaseServiceKey ? '✓' : '✗');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function setupStorage() {
  try {
    // Create buckets for different document types
    const buckets = [
      'audio-files',
      'documents',
      'emails',
      'messages'
    ];

    for (const bucket of buckets) {
      console.log(`Creating bucket: ${bucket}...`);
      const { data, error } = await supabase
        .storage
        .createBucket(bucket, {
          public: false,
          fileSizeLimit: 52428800, // 50MB
          allowedMimeTypes: [
            'audio/*',
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'text/*',
            'message/rfc822'
          ]
        });

      if (error) {
        if (error.message.includes('already exists')) {
          console.log(`Bucket ${bucket} already exists`);
        } else {
          console.error(`Error creating bucket ${bucket}:`, error.message);
        }
      } else {
        console.log(`Created bucket: ${bucket}`);

        // Set up bucket policies
        console.log(`Setting up policies for bucket: ${bucket}...`);
        const { error: policyError } = await supabase
          .storage
          .from(bucket)
          .createSignedUploadUrl('test.txt');

        if (policyError) {
          console.error(`Error setting up policies for ${bucket}:`, policyError.message);
        } else {
          console.log(`Set up policies for bucket: ${bucket}`);
        }
      }
    }

    console.log('Storage setup completed successfully!');
  } catch (error) {
    console.error('Error setting up storage:', error);
    process.exit(1);
  }
}

setupStorage(); 