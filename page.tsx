import type { Metadata } from 'next';
import APEXClubPage from './APEXClubPage';

export const metadata: Metadata = {
  title: 'APEX — Esports & Game Development | MLRIT',
  description:
    'APEX MLRIT — an Esports and Game Development community. Founded March 2024. Games, tournaments, hackathons, and the students building them.',
};

export default function Page() {
  return <APEXClubPage />;
}
