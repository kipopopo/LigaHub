import { teams } from '@/lib/placeholder-data';

export function generateStaticParams() {
  return teams.map((team) => ({ slug: team.slug }));
}

export default function TeamSlugLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
