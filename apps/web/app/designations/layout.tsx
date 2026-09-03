import type { Metadata } from 'next';
export const metadata: Metadata = { title: 'Designations' };
export default function DesignationsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
