import type { DocumentStatus } from "@/features/documents/types";

export default function StatusBadge({ status }: { status: DocumentStatus }) {
  return <span>{status}</span>;
}
