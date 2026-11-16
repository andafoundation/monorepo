import { PoemsFilterProvider } from '@/components/poems/poems-filter-provider';

export default function PoemsLayout({ children }: { children: React.ReactNode }) {
  return <PoemsFilterProvider>{children}</PoemsFilterProvider>;
}
