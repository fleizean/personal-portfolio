import React from 'react';
import { Metadata } from 'next';
import { getMediumPosts } from '@/lib/medium';
import BlogContent from '@/components/BlogContent/page';

export const metadata: Metadata = {
    title: 'Blog',
    description: 'Read my latest articles and thoughts on software development, design, and technology.',
    alternates: {
        canonical: '/blog',
    },
};

export const revalidate = 3600;

export default async function Blog() {
    const posts = await getMediumPosts();

    return <BlogContent posts={posts} />;
}
