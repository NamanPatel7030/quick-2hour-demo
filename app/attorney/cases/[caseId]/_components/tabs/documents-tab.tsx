'use client';

import * as React from 'react';
import { FileText, Upload, Image as ImageIcon, FileSpreadsheet, File as FileIcon, Eye, Download, Share2, Filter } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { documentsForCase } from '@/data/documents';
import { Avatar } from '@/components/ui/avatar';
import { formatRelative, formatDate } from '@/lib/format';
import { cn } from '@/utils/cn';
import { toast } from 'sonner';

const categories = ['All', 'Intake Form', 'Medical Record', 'Imaging', 'Insurance Correspondence', 'Lien', 'Settlement', 'Bill', 'Correspondence'];

export function DocumentsTab({ caseId }: { caseId: string }) {
  const docs = React.useMemo(() => documentsForCase(caseId), [caseId]);
  const [filter, setFilter] = React.useState('All');

  const filtered = filter === 'All' ? docs : docs.filter((d) => d.category === filter);

  const onUploadClick = () => {
    toast.success('Upload queued', { description: 'Drag-and-drop upload is mocked in the demo.' });
  };

  const onPreview = (name: string) => {
    toast.info('Preview unavailable', { description: `${name} — preview is mocked in the demo.` });
  };

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-col gap-1">
              <CardTitle>Documents</CardTitle>
              <span className="text-xs text-text-sub-600 tabular-nums">{docs.length} files · {formatRelative(docs[0]?.uploadedAt ?? new Date().toISOString())} last upload</span>
            </div>
            <Button variant="primary" size="md" onClick={onUploadClick}>
              <Upload className="size-4" />
              Upload file
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Upload zone */}
          <div className="rounded-xl border-2 border-dashed border-stroke-soft-200 bg-bg-weak-25 p-8 text-center mb-5 hover:border-primary-base/40 transition-colors cursor-pointer" onClick={onUploadClick}>
            <div className="flex flex-col items-center gap-2">
              <div className="flex size-12 items-center justify-center rounded-full bg-primary-lighter text-primary-base">
                <Upload className="size-5" />
              </div>
              <div>
                <p className="text-sm font-medium">Drop files here or click to browse</p>
                <p className="text-xs text-text-sub-600">PDF, DOCX, JPG, XLSX up to 50 MB each</p>
              </div>
            </div>
          </div>

          {/* Filter chips */}
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <Filter className="size-3.5 text-text-sub-600" />
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setFilter(c)}
                className={cn(
                  'rounded-full px-2.5 py-1 text-xs font-medium transition-colors',
                  filter === c
                    ? 'bg-primary-base text-text-white-0'
                    : 'bg-bg-weak-50 text-text-sub-600 hover:bg-bg-weak-25 hover:text-text-strong-950',
                )}
              >
                {c}
              </button>
            ))}
          </div>

          {/* Document grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {filtered.map((d) => {
              const Icon =
                d.fileType === 'pdf' ? FileText :
                d.fileType === 'jpg' ? ImageIcon :
                d.fileType === 'xlsx' ? FileSpreadsheet :
                FileIcon;
              const colorTone =
                d.fileType === 'pdf' ? 'bg-error-lighter text-error-dark' :
                d.fileType === 'jpg' ? 'bg-feature-lighter text-feature-dark' :
                d.fileType === 'xlsx' ? 'bg-success-lighter text-success-dark' :
                'bg-information-lighter text-information-dark';
              return (
                <div
                  key={d.id}
                  className="group rounded-lg border border-stroke-soft-200 bg-bg-white-0 p-3 hover:border-stroke-sub-300 hover:shadow-[0_4px_12px_rgba(15,23,42,0.05)] transition-all"
                >
                  <div className="flex items-start gap-3">
                    <div className={cn('flex size-10 shrink-0 items-center justify-center rounded-lg', colorTone)}>
                      <Icon className="size-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{d.name}</p>
                      <p className="text-xs text-text-sub-600">{d.category}</p>
                      <div className="mt-2 flex items-center justify-between text-[11px] text-text-soft-400">
                        <span className="tabular-nums">{(d.sizeKB / 1024).toFixed(1)} MB</span>
                        <span>{formatRelative(d.uploadedAt)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-stroke-soft-200 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-[11px] text-text-sub-600">
                      <Avatar initials={d.uploadedBy.initials} color="#94a3b8" size="xs" />
                      <span className="truncate max-w-[100px]">{d.uploadedBy.name}</span>
                    </div>
                    <div className="flex items-center gap-0.5">
                      <button onClick={() => onPreview(d.name)} className="rounded p-1 hover:bg-bg-weak-50 text-text-soft-400 hover:text-text-strong-950" aria-label="Preview">
                        <Eye className="size-3.5" />
                      </button>
                      <button className="rounded p-1 hover:bg-bg-weak-50 text-text-soft-400 hover:text-text-strong-950" aria-label="Download">
                        <Download className="size-3.5" />
                      </button>
                      {d.shared && (
                        <span className="rounded p-1 text-text-soft-400" title="Shared">
                          <Share2 className="size-3.5" />
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}