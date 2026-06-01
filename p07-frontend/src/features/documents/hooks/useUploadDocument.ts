import { useState } from 'react';
import { uploadDocument, type UploadDocumentPayload } from '../api';

export function useUploadDocument() {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const upload = async (payload: UploadDocumentPayload) => {
    setIsUploading(true);
    setError(null);
    try {
      const res = await uploadDocument(payload);
      return res;
    } catch (e) {
      const msg = e instanceof Error ? e.message : '업로드 실패';
      setError(msg);
      throw e;
    } finally {
      setIsUploading(false);
    }
  };

  return { upload, isUploading, error };
}
