import type { TableHTMLAttributes } from "react";

export default function Table(props: TableHTMLAttributes<HTMLTableElement>) {
  return <table {...props} />;
}
