"use client";

import { Tabs } from "@/components/ui/tabs";

const tabs = [
  { id: "details", label: "Details" },
  { id: "access", label: "Access Info" },
  { id: "tenants", label: "Tenants" },
  { id: "cases", label: "Active Cases" },
];

interface PropertyDetailTabsProps {
  activeTab: string;
  onTabChange: (id: string) => void;
}

export function PropertyDetailTabs({
  activeTab,
  onTabChange,
}: PropertyDetailTabsProps) {
  return <Tabs tabs={tabs} activeTab={activeTab} onTabChange={onTabChange} />;
}
