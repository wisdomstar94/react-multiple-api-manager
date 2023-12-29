import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'react-multiple-api-manager test2',
  description: 'react-multiple-api-manager test2',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>{children}</>
  );
}
