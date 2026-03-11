import React from 'react';
import { Metadata } from 'next';
import { getMediumPosts } from '@/lib/medium';
import BlogContent from '@/components/BlogContent/page';
import { getPageMetadata } from '@/lib/getPageMetadata';

export async function generateMetadata(): Promise<Metadata> {
  return getPageMetadata('blog', '/blog');
}

export const revalidate = 3600;

export default async function Blog() {
  const posts = await getMediumPosts();

  return <BlogContent posts={posts} />;
}
