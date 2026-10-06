import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Interactive Map of Odisha – 30 Districts',
    alternates: { canonical: '/map' },
    description: 'Explore all 30 districts of Odisha on an interactive map. View population, area, literacy rates, and more for each district.',
};

export default function MapLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
