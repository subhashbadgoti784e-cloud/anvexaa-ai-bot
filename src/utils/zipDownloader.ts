import JSZip from 'jszip';
import { DELIVERABLE_FILES } from '../data/deliverables';

export async function downloadProjectZip() {
  const zip = new JSZip();

  // Add all deliverable files to the zip
  for (const file of DELIVERABLE_FILES) {
    zip.file(file.filename, file.content);
  }

  // Also include a sample .env populated with template values
  zip.file('.env', DELIVERABLE_FILES.find(f => f.filename === '.env.example')?.content || '');

  // Generate zip file
  const blob = await zip.generateAsync({ type: 'blob' });
  
  // Trigger download
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'anvexaa_ai_whatsapp_bot.zip';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function downloadSingleFile(filename: string, content: string, mimeType: string = 'text/plain') {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
