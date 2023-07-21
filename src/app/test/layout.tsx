import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'react-multiple-api-manager test',
  description: 'react-multiple-api-manager test',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>{children}</>
  );
}
