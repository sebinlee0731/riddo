import type { ReactNode } from "react";

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
}

export default function Modal({ open, children }: ModalProps) {
  if (!open) return null;
  return <div role="dialog">{children}</div>;
}
