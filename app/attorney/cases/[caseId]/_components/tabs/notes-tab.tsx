'use client';

import * as React from 'react';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Send, Bold, Italic, List, Link as LinkIcon } from 'lucide-react';
import { toast } from 'sonner';

const sampleNotes = [
  {
    id: 'n1',
    author: 'Danny Rackow',
    initials: 'DR',
    color: '#3D5AFE',
    title: 'Senior Partner',
    body: 'Reviewed the latest MRI report. Significant disc herniation at L4-L5 with nerve impingement. Demand letter should reflect the long-term impact and the need for ongoing PT.',
    at: '2026-06-22T15:42:00Z',
  },
  {
    id: 'n2',
    author: 'Jessica Marquez',
    initials: 'JM',
    color: '#F472B6',
    title: 'Case Manager',
    body: 'Spoke with the client today. He is still experiencing numbness in his right leg. Will schedule a follow-up with his treating physician.',
    at: '2026-06-19T11:22:00Z',
  },
  {
    id: 'n3',
    author: 'Danny Rackow',
    initials: 'DR',
    color: '#3D5AFE',
    title: 'Senior Partner',
    body: 'Counter offer sent to State Farm at $215K. Waiting on response. Have backup documentation ready in case they come back low.',
    at: '2026-06-15T10:11:00Z',
  },
];

export function NotesTab({ caseId }: { caseId: string }) {
  const [notes, setNotes] = React.useState(sampleNotes);
  const [draft, setDraft] = React.useState('');

  const onPost = () => {
    if (!draft.trim()) return;
    setNotes((prev) => [
      {
        id: `n-${Date.now()}`,
        author: 'Danny Rackow',
        initials: 'DR',
        color: '#3D5AFE',
        title: 'Senior Partner',
        body: draft.trim(),
        at: new Date().toISOString(),
      },
      ...prev,
    ]);
    setDraft('');
    toast.success('Note added');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Notes ({notes.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-3">
            {notes.map((n) => (
              <div key={n.id} className="flex items-start gap-3 rounded-lg border border-stroke-soft-200 bg-bg-white-0 p-4">
                <Avatar initials={n.initials} color={n.color} size="md" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold">{n.author}</span>
                      <span className="text-xs text-text-sub-600">· {n.title}</span>
                    </div>
                    <span className="text-[11px] text-text-soft-400">
                      {new Date(n.at).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="mt-1.5 text-sm leading-relaxed text-text-strong-950 whitespace-pre-wrap">{n.body}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Add note</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-3">
            <div className="rounded-lg border border-stroke-soft-200 overflow-hidden focus-within:ring-2 focus-within:ring-primary-base">
              <div className="flex items-center gap-0.5 px-2 py-1 border-b border-stroke-soft-200 bg-bg-weak-25">
                <button className="rounded p-1.5 hover:bg-bg-weak-50 text-text-sub-600"><Bold className="size-3.5" /></button>
                <button className="rounded p-1.5 hover:bg-bg-weak-50 text-text-sub-600"><Italic className="size-3.5" /></button>
                <button className="rounded p-1.5 hover:bg-bg-weak-50 text-text-sub-600"><List className="size-3.5" /></button>
                <button className="rounded p-1.5 hover:bg-bg-weak-50 text-text-sub-600"><LinkIcon className="size-3.5" /></button>
              </div>
              <Textarea
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="Write a note for this case..."
                className="min-h-[140px] border-0 rounded-none focus-visible:ring-0 focus-visible:ring-offset-0"
              />
            </div>
            <Button variant="primary" size="md" onClick={onPost} disabled={!draft.trim()}>
              <Send className="size-4" />
              Post note
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}