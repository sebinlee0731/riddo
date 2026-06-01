import type { ReactNode } from "react";

export interface TabsProps {
  value: string;
  onChange: (value: string) => void;
  children: ReactNode;
}

export default function Tabs({ children }: TabsProps) {
  return <div role="tablist">{children}</div>;
}
