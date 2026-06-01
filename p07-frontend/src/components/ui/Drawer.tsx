import type { ReactNode } from "react";

export interface DrawerProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
}

export default function Drawer({ open, children }: DrawerProps) {
  if (!open) return null;
  return <aside>{children}</aside>;
}
