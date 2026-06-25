'use client';

import * as React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { OverviewTab } from './tabs/overview-tab';
import { DocumentsTab } from './tabs/documents-tab';
import { BillingTab } from './tabs/billing-tab';
import { TimelineTab } from './tabs/timeline-tab';
import { LiensTab } from './tabs/liens-tab';
import { NotesTab } from './tabs/notes-tab';

const tabs = [
  { id: 'overview', label: 'Overview' },
  { id: 'documents', label: 'Documents' },
  { id: 'billing', label: 'Billing' },
  { id: 'timeline', label: 'Timeline' },
  { id: 'liens', label: 'Liens' },
  { id: 'notes', label: 'Notes' },
];

export function CaseWorkspaceTabs({
  caseId,
  initialTab,
}: {
  caseId: string;
  initialTab: string;
}) {
  const validTab = tabs.find((t) => t.id === initialTab)?.id ?? 'overview';

  return (
    <Tabs defaultValue={validTab} className="w-full">
      <TabsList>
        {tabs.map((t) => (
          <TabsTrigger key={t.id} value={t.id}>
            {t.label}
          </TabsTrigger>
        ))}
      </TabsList>
      <TabsContent value="overview"><OverviewTab caseId={caseId} /></TabsContent>
      <TabsContent value="documents"><DocumentsTab caseId={caseId} /></TabsContent>
      <TabsContent value="billing"><BillingTab caseId={caseId} /></TabsContent>
      <TabsContent value="timeline"><TimelineTab caseId={caseId} /></TabsContent>
      <TabsContent value="liens"><LiensTab caseId={caseId} /></TabsContent>
      <TabsContent value="notes"><NotesTab caseId={caseId} /></TabsContent>
    </Tabs>
  );
}