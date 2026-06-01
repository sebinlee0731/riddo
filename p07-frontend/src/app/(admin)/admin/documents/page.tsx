'use client';

import React, { useMemo, useState } from 'react';
import DocumentPageHeader from '@/features/documents/components/DocumentPageHeader';
import StatusStrip from '@/features/documents/components/StatusStrip';
import DocumentTable from '@/features/documents/components/DocumentTable';
import DocumentUploadModal from '@/features/documents/components/DocumentUploadModal';
import DocumentDetailPanel from '@/features/documents/components/DocumentDetailPanel';
import { useDocuments } from '@/features/documents/hooks/useDocuments';
import { useDocumentDetail } from '@/features/documents/hooks/useDocumentDetail';
import type { DocumentSummary } from '@/features/documents/types';
import { DOCUMENT_CATEGORY_OPTIONS } from '@/features/documents/types';

export default function DocumentsPage() {
  const { data: documents, counts, isLoading, refetch: refetchDocuments } = useDocuments();

  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedDocumentId, setSelectedDocumentId] = useState<number | null>(null);

  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  
  const { data: documentDetail, refetch: refetchDetail } = useDocumentDetail(selectedDocumentId);

  const categoryOptions = useMemo(() => {
    const categories = new Set(documents.map((doc) => doc.category));
    const ordered = DOCUMENT_CATEGORY_OPTIONS.filter((category) => categories.has(category));
    const custom = Array.from(categories)
      .filter((category) => !DOCUMENT_CATEGORY_OPTIONS.includes(category as (typeof DOCUMENT_CATEGORY_OPTIONS)[number]))
      .sort((a, b) => a.localeCompare(b, 'ko'));
    return [...ordered, ...custom];
  }, [documents]);

  const filteredDocuments = documents.filter((doc) => {
    const matchesStatus = statusFilter === 'all' || doc.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || doc.category === categoryFilter;
    return matchesStatus && matchesCategory;
  });

  const handleListMutated = () => {
    void refetchDocuments();
    if (selectedDocumentId != null) {
      void refetchDetail();
    }
  };

  const handleUploadClick = () => {
    setIsUploadModalOpen(true);
  };

  const handleCloseUploadModal = () => {
    setIsUploadModalOpen(false);
  };

  const handleFilterChange = (status: string) => {
    setStatusFilter(status);
  };

  const handleRowClick = (doc: DocumentSummary) => {
    setSelectedDocumentId(doc.id);
  };

  const handleCloseDetailPanel = () => {
    setSelectedDocumentId(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <DocumentPageHeader 
          totalCount={counts.total} 
          onUploadClick={handleUploadClick} 
          activeFilter={statusFilter}
          onFilterChange={handleFilterChange} 
          activeCategoryFilter={categoryFilter}
          categoryOptions={categoryOptions}
          onCategoryFilterChange={setCategoryFilter}
        />
        
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          </div>
        ) : (
          <>
            <StatusStrip 
              counts={counts}
              activeFilter={statusFilter}
              onFilterChange={handleFilterChange}
             />
            <DocumentTable 
              documents={filteredDocuments} 
              onUploadClick={handleUploadClick} 
              onRowClick={handleRowClick} 
            />
          </>
        )}

        <DocumentUploadModal
          isOpen={isUploadModalOpen}
          onClose={handleCloseUploadModal}
          onUploaded={handleListMutated}
        />

        {selectedDocumentId != null && documentDetail && (
          <DocumentDetailPanel
            key={documentDetail.id}
            document={documentDetail}
            isOpen={true}
            onClose={handleCloseDetailPanel}
            onMutated={handleListMutated}
          />
        )}
      </div>
    </div>
  );
}
