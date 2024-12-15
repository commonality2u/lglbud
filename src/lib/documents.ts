import { createClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';

export type UploadDocumentProps = {
  file: File;
  type: string;
  caseNumber?: string;
  metadata?: Record<string, any>;
};

export async function uploadDocument({ 
  file, 
  type, 
  caseNumber, 
  metadata 
}: UploadDocumentProps) {
  try {
    const fileExt = file.name.split('.').pop()?.toLowerCase();
    const fileName = `${uuidv4()}.${fileExt}`;
    const filePath = `${type}/${caseNumber || 'uncategorized'}/${fileName}`;

    // 1. Upload to Supabase Storage
    const { error: uploadError, data } = await supabase.storage
      .from('documents')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) throw uploadError;

    // 2. Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('documents')
      .getPublicUrl(filePath);

    // 3. Create database record
    const { error: dbError, data: document } = await supabase
      .from('documents')
      .insert({
        id: uuidv4(),
        title: file.name,
        type,
        case_number: caseNumber,
        size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
        status: 'pending',
        metadata,
        storage_path: filePath,
        url: publicUrl,
        original_file_type: fileExt
      })
      .select()
      .single();

    if (dbError) throw dbError;

    // 4. If it's an audio file, trigger transcription
    if (type === 'audio_transcript') {
      // Trigger serverless function for transcription
      const { error: fnError } = await supabase.functions.invoke('transcribe-audio', {
        body: { 
          fileUrl: publicUrl,
          documentId: document.id
        }
      });

      if (fnError) throw fnError;
    }

    return { document, publicUrl };
  } catch (error) {
    console.error('Error uploading document:', error);
    throw error;
  }
}

export async function getDocuments() {
  const { data, error } = await supabase
    .from('documents')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function deleteDocument(id: string) {
  const { data: document } = await supabase
    .from('documents')
    .select('storage_path')
    .eq('id', id)
    .single();

  if (document?.storage_path) {
    // Delete from storage
    await supabase.storage
      .from('documents')
      .remove([document.storage_path]);
  }

  // Delete database record
  const { error } = await supabase
    .from('documents')
    .delete()
    .eq('id', id);

  if (error) throw error;
} 