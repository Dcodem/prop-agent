"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandSeparator,
} from "@/components/ui/command";

export interface SearchEntities {
  tenants: { id: string; name: string; unitNumber: string | null }[];
  properties: { id: string; address: string; type: string }[];
  cases: { id: string; rawMessage: string; category: string | null; status: string }[];
}

interface CommandSearchProps {
  searchEntities?: SearchEntities;
}

export function CommandSearch({ searchEntities }: CommandSearchProps) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleSelect = useCallback(
    (href: string) => {
      setOpen(false);
      router.push(href);
    },
    [router]
  );

  const tenantItems = useMemo(
    () =>
      (searchEntities?.tenants ?? []).map((t) => ({
        id: t.id,
        label: `${t.name}${t.unitNumber ? ` — Unit ${t.unitNumber}` : ""}`,
        href: `/tenants/${t.id}`,
        icon: "person",
      })),
    [searchEntities?.tenants]
  );

  const propertyItems = useMemo(
    () =>
      (searchEntities?.properties ?? []).map((p) => ({
        id: p.id,
        label: p.address,
        href: `/properties/${p.id}`,
        icon: p.type === "commercial" ? "business" : "apartment",
      })),
    [searchEntities?.properties]
  );

  const caseItems = useMemo(
    () =>
      (searchEntities?.cases ?? []).slice(0, 20).map((c) => ({
        id: c.id,
        label: c.rawMessage.length > 60 ? c.rawMessage.slice(0, 60) + "…" : c.rawMessage,
        href: `/cases/${c.id}`,
        icon: "assignment",
      })),
    [searchEntities?.cases]
  );

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Search cases, properties, tenants..." />
      <CommandList>
        <CommandEmpty>
          <div className="flex flex-col items-center gap-2 py-4">
            <span className="material-symbols-outlined text-on-surface-variant text-2xl">search_off</span>
            <p className="text-sm text-on-surface-variant">No results found.</p>
          </div>
        </CommandEmpty>

        <CommandGroup heading="Pages">
          <CommandItem onSelect={() => handleSelect("/overview")}>
            <span className="material-symbols-outlined text-base mr-2 text-accent">dashboard</span>
            Dashboard
          </CommandItem>
          <CommandItem onSelect={() => handleSelect("/cases")}>
            <span className="material-symbols-outlined text-base mr-2 text-caution">assignment</span>
            Cases
          </CommandItem>
          <CommandItem onSelect={() => handleSelect("/properties")}>
            <span className="material-symbols-outlined text-base mr-2 text-info">domain</span>
            Properties
          </CommandItem>
          <CommandItem onSelect={() => handleSelect("/tenants")}>
            <span className="material-symbols-outlined text-base mr-2 text-purple">groups</span>
            Tenants
          </CommandItem>
          <CommandItem onSelect={() => handleSelect("/vendors")}>
            <span className="material-symbols-outlined text-base mr-2 text-warning-dim">engineering</span>
            Vendors
          </CommandItem>
          <CommandItem onSelect={() => handleSelect("/settings")}>
            <span className="material-symbols-outlined text-base mr-2 text-on-surface-variant">settings</span>
            Settings
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Actions">
          <CommandItem onSelect={() => handleSelect("/cases/new")}>
            <span className="material-symbols-outlined text-base mr-2 text-accent">add_circle</span>
            New Case
          </CommandItem>
          <CommandItem onSelect={() => handleSelect("/properties/new")}>
            <span className="material-symbols-outlined text-base mr-2 text-accent">add_circle</span>
            New Property
          </CommandItem>
          <CommandItem onSelect={() => handleSelect("/tenants/new")}>
            <span className="material-symbols-outlined text-base mr-2 text-accent">add_circle</span>
            New Tenant
          </CommandItem>
        </CommandGroup>

        {tenantItems.length > 0 && (
          <>
            <CommandSeparator />
            <CommandGroup heading="Tenants">
              {tenantItems.map((item) => (
                <CommandItem key={item.id} onSelect={() => handleSelect(item.href)}>
                  <span className="material-symbols-outlined text-base mr-2">{item.icon}</span>
                  {item.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </>
        )}

        {propertyItems.length > 0 && (
          <>
            <CommandSeparator />
            <CommandGroup heading="Properties">
              {propertyItems.map((item) => (
                <CommandItem key={item.id} onSelect={() => handleSelect(item.href)}>
                  <span className="material-symbols-outlined text-base mr-2">{item.icon}</span>
                  {item.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </>
        )}

        {caseItems.length > 0 && (
          <>
            <CommandSeparator />
            <CommandGroup heading="Cases">
              {caseItems.map((item) => (
                <CommandItem key={item.id} onSelect={() => handleSelect(item.href)}>
                  <span className="material-symbols-outlined text-base mr-2">{item.icon}</span>
                  {item.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </>
        )}
      </CommandList>
    </CommandDialog>
  );
}
