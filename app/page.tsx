import { Metadata } from 'next';
import Hero from '@/components/Hero/page';
import { getPageMetadata } from '@/lib/getPageMetadata';

export async function generateMetadata(): Promise<Metadata> {
  return getPageMetadata('home', '/');
}

export default function Home() {
  return (
    <>
      <Hero />
    </>
  );
}
