import * as pdfjsLib from 'pdfjs-dist';

// Ensure the PDF.js worker is properly configured via a reliable CDN
if (typeof window !== 'undefined') {
  try {
    const version = pdfjsLib.version || '4.10.38';
    // Use unpkg with fallback to cdnjs or local
    pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${version}/build/pdf.worker.min.mjs`;
  } catch (err) {
    console.warn('PDF.js worker initialization notice:', err);
  }
}

/**
 * Extracts text from a PDF file using client-side pdfjs-dist.
 * @param {File} file - PDF file uploaded by user
 * @returns {Promise<{text: string, pageCount: number, wordCount: number, charCount: number, fileName: string, fileSizeKB: string}>}
 */
export async function extractTextFromPDF(file) {
  try {
    const arrayBuffer = await file.arrayBuffer();

    const loadingTask = pdfjsLib.getDocument({
      data: arrayBuffer,
      useSystemFonts: true,
      stopAtErrors: false,
    });

    const pdfDoc = await loadingTask.promise;
    const numPages = pdfDoc.numPages;
    const pageTexts = [];

    for (let pageNum = 1; pageNum <= numPages; pageNum++) {
      const page = await pdfDoc.getPage(pageNum);
      const textContent = await page.getTextContent();
      
      // Assemble items preserving line flow where possible
      let lastY = null;
      let pageString = '';
      
      for (const item of textContent.items) {
        if ('str' in item) {
          if (lastY !== null && Math.abs(item.transform[5] - lastY) > 5) {
            pageString += '\n';
          } else if (pageString.length > 0 && !pageString.endsWith(' ') && !pageString.endsWith('\n')) {
            pageString += ' ';
          }
          pageString += item.str;
          lastY = item.transform[5];
        }
      }

      if (pageString.trim()) {
        pageTexts.push(pageString.trim());
      }
    }

    const fullText = pageTexts.join('\n\n');
    const wordCount = fullText ? fullText.split(/\s+/).filter(Boolean).length : 0;

    return {
      text: fullText,
      pageCount: numPages,
      wordCount,
      charCount: fullText.length,
      fileName: file.name,
      fileSizeKB: (file.size / 1024).toFixed(1),
    };
  } catch (error) {
    console.error('PDF extraction error:', error);
    if (error.name === 'PasswordException') {
      throw new Error('This PDF is password-protected. Please upload an unlocked PDF.');
    }
    throw new Error(`Failed to extract text from PDF: ${error.message || 'Unknown error'}`);
  }
}

/**
 * Extracts text from a plain text (.txt) file.
 * @param {File} file 
 */
export async function extractTextFromTXT(file) {
  try {
    const text = await file.text();
    const cleanedText = text.trim();
    const wordCount = cleanedText ? cleanedText.split(/\s+/).filter(Boolean).length : 0;

    return {
      text: cleanedText,
      pageCount: 1,
      wordCount,
      charCount: cleanedText.length,
      fileName: file.name,
      fileSizeKB: (file.size / 1024).toFixed(1),
    };
  } catch (error) {
    console.error('TXT extraction error:', error);
    throw new Error(`Failed to read text file: ${error.message || 'Unknown error'}`);
  }
}

/**
 * High-level parser that inspects file extension/MIME and calls the appropriate extractor.
 * @param {File} file 
 */
export async function parseResumeFile(file) {
  if (!file) throw new Error('No file provided for parsing.');

  const isPDF = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
  const isTXT = file.type.startsWith('text/') || file.name.toLowerCase().endsWith('.txt') || file.name.toLowerCase().endsWith('.md');

  if (isPDF) {
    return await extractTextFromPDF(file);
  } else if (isTXT) {
    return await extractTextFromTXT(file);
  } else {
    throw new Error('Unsupported file format. Please upload a .pdf or .txt file.');
  }
}
