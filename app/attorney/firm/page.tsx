'use client';

import * as React from 'react';
import {
  Save,
  Building2,
  MapPin,
  Phone,
  UserCircle2,
  ImageIcon,
  Upload,
  Trash2,
} from 'lucide-react';
import { PageHeader } from '@/components/portal/page-header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { pathoraFirm } from '@/data/firm';

export default function FirmProfilePage() {
  const [firm, setFirm] = React.useState(pathoraFirm);
  const [savedAt, setSavedAt] = React.useState<string | null>(null);

  const update = <K extends keyof typeof firm>(key: K, value: (typeof firm)[K]) => {
    setFirm((prev) => ({ ...prev, [key]: value }));
  };

  const updateAddress = (k: 'line1' | 'city' | 'state' | 'zip', v: string) =>
    setFirm((p) => ({ ...p, address: { ...p.address, [k]: v } }));

  const updateContact = (k: 'name' | 'email' | 'phone' | 'fax', v: string) =>
    setFirm((p) => ({ ...p, primaryContact: { ...p.primaryContact, [k]: v } }));

  const handleSave = () => {
    setSavedAt(new Date().toISOString());
    // In a real app, POST to API here.
  };

  return (
    <div className="pb-24">
      <PageHeader
        title="Firm Profile"
        description={`Manage ${pathoraFirm.name}'s information.`}
        meta={
          <div className="flex items-center gap-3 text-xs text-text-sub-600">
            <span className="inline-flex items-center gap-1.5">
              <span className="size-1.5 rounded-full bg-success-base" />
              <span>{pathoraFirm.attorneys} attorneys</span>
            </span>
            <span className="text-text-soft-400">·</span>
            <span>{pathoraFirm.caseManagers} case managers</span>
            <span className="text-text-soft-400">·</span>
            <span className="tabular-nums">{pathoraFirm.activeClients} active clients</span>
          </div>
        }
      />

      <div className="flex flex-col gap-5">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2.5">
              <span className="flex size-8 items-center justify-center rounded-lg bg-primary-lighter text-primary-base">
                <Building2 className="size-4" />
              </span>
              <div>
                <CardTitle>Firm details</CardTitle>
                <CardDescription>Legal entity and registration info.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="firm-name">Firm name</Label>
              <Input
                id="firm-name"
                value={firm.name}
                onChange={(e) => update('name', e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="firm-tax">Tax ID</Label>
              <Input
                id="firm-tax"
                value={firm.taxId}
                onChange={(e) => update('taxId', e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="firm-type">Firm type</Label>
              <Input
                id="firm-type"
                value={firm.firmType}
                onChange={(e) => update('firmType', e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="firm-website">Website</Label>
              <Input
                id="firm-website"
                value={firm.website}
                onChange={(e) => update('website', e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2.5">
              <span className="flex size-8 items-center justify-center rounded-lg bg-information-lighter text-information-dark">
                <MapPin className="size-4" />
              </span>
              <div>
                <CardTitle>Address</CardTitle>
                <CardDescription>Primary office address.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-6 gap-4">
            <div className="flex flex-col gap-1.5 sm:col-span-6">
              <Label htmlFor="addr-line1">Street address</Label>
              <Input
                id="addr-line1"
                value={firm.address.line1}
                onChange={(e) => updateAddress('line1', e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1.5 sm:col-span-3">
              <Label htmlFor="addr-city">City</Label>
              <Input
                id="addr-city"
                value={firm.address.city}
                onChange={(e) => updateAddress('city', e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1.5 sm:col-span-1">
              <Label htmlFor="addr-state">State</Label>
              <Input
                id="addr-state"
                value={firm.address.state}
                onChange={(e) => updateAddress('state', e.target.value)}
                maxLength={2}
              />
            </div>
            <div className="flex flex-col gap-1.5 sm:col-span-2">
              <Label htmlFor="addr-zip">ZIP</Label>
              <Input
                id="addr-zip"
                value={firm.address.zip}
                onChange={(e) => updateAddress('zip', e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2.5">
              <span className="flex size-8 items-center justify-center rounded-lg bg-success-lighter text-success-dark">
                <Phone className="size-4" />
              </span>
              <div>
                <CardTitle>Contact</CardTitle>
                <CardDescription>Public-facing contact information.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="main-phone">Main phone</Label>
              <Input
                id="main-phone"
                value={firm.mainPhone}
                onChange={(e) => update('mainPhone', e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="main-email">Main email</Label>
              <Input
                id="main-email"
                type="email"
                value={firm.mainEmail}
                onChange={(e) => update('mainEmail', e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2.5">
              <span className="flex size-8 items-center justify-center rounded-lg bg-warning-lighter text-warning-dark">
                <UserCircle2 className="size-4" />
              </span>
              <div>
                <CardTitle>Primary contact</CardTitle>
                <CardDescription>Person responsible for firm-wide administration.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="pc-name">Name</Label>
              <Input
                id="pc-name"
                value={firm.primaryContact.name}
                onChange={(e) => updateContact('name', e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="pc-email">Email</Label>
              <Input
                id="pc-email"
                type="email"
                value={firm.primaryContact.email}
                onChange={(e) => updateContact('email', e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="pc-phone">Phone</Label>
              <Input
                id="pc-phone"
                value={firm.primaryContact.phone}
                onChange={(e) => updateContact('phone', e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="pc-fax">Fax</Label>
              <Input
                id="pc-fax"
                value={firm.primaryContact.fax}
                onChange={(e) => updateContact('fax', e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1.5 sm:col-span-2">
              <Label htmlFor="pc-notes">Internal notes</Label>
              <Textarea
                id="pc-notes"
                placeholder="Anything admins should know about the primary contact..."
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2.5">
              <span className="flex size-8 items-center justify-center rounded-lg bg-error-lighter text-error-dark">
                <ImageIcon className="size-4" />
              </span>
              <div>
                <CardTitle>Logo</CardTitle>
                <CardDescription>PNG or SVG, square, at least 256×256.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-stroke-soft-200 bg-bg-weak-25 px-6 py-10 text-center transition-colors hover:border-primary-base/50 hover:bg-primary-lighter/30">
              <span className="flex size-12 items-center justify-center rounded-full bg-bg-white-0 border border-stroke-soft-200 text-text-sub-600">
                <Upload className="size-5" />
              </span>
              <div className="flex flex-col gap-1">
                <p className="text-sm font-medium text-text-strong-950">
                  Drop your firm logo here
                </p>
                <p className="text-xs text-text-sub-600">
                  or click to browse — PNG, JPG, or SVG up to 5MB
                </p>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <Button variant="outline" size="sm">
                  <Upload className="size-3.5" />
                  Choose file
                </Button>
                <Button variant="ghost" size="sm">
                  <Trash2 className="size-3.5" />
                  Remove
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-30 border-t border-stroke-soft-200 bg-bg-white-0/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-3 px-6 py-3 lg:pl-[280px]">
          <div className="flex items-center gap-2 text-xs text-text-sub-600">
            {savedAt ? (
              <>
                <span className="size-1.5 rounded-full bg-success-base" />
                <span>Saved {new Date(savedAt).toLocaleTimeString()}</span>
              </>
            ) : (
              <>
                <span className="size-1.5 rounded-full bg-text-soft-400" />
                <span>Unsaved changes</span>
              </>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="md">
              Cancel
            </Button>
            <Button variant="primary" size="md" onClick={handleSave}>
              <Save className="size-4" />
              Save changes
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}