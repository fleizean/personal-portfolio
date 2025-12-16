"use client";

import { useTranslation } from '@/context/LanguageContext';
import React from 'react';
import { MediumPost } from '@/lib/medium';

interface BlogContentProps {
    posts: MediumPost[];
}

export default function BlogContent({ posts }: BlogContentProps) {
    const { isLoading, t } = useTranslation("common");

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="loader"></div>
            </div>
        );
    }

    return (
        <div className="relative w-full z-50 transition-all duration-300 py-20 md:py-28 lg:py-36 dark:bg-gray-800 min-h-screen">
            <div className="container mx-auto px-8 lg:px-60 py-10">
                <h1 className="text-5xl font-bold mb-8">
                    {t('blog.title') || 'Blog'}
                </h1>
                
                {posts.length === 0 ? (
                    <p className="text-gray-500">
                        {t('blog.no_posts') || 'No blog posts available.'}
                    </p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {posts.map((post) => (
                            <a
                                key={post.link}
                                href={post.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group block bg-white dark:bg-gray-900 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                            >
                                {post.thumbnail && (
                                    <div className="relative h-48 overflow-hidden">
                                        <img
                                            src={post.thumbnail}
                                            alt={post.title}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                        />
                                    </div>
                                )}
                                
                                <div className="p-6">
                                    <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                                        {post.title}
                                    </h3>
                                    
                                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3">
                                        {post.contentSnippet}
                                    </p>
                                    
                                    <div className="flex items-center justify-between">
                                        <time className="text-sm text-gray-500">
                                            {new Date(post.pubDate).toLocaleDateString('tr-TR', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </time>
                                        
                                        {post.categories && post.categories.length > 0 && (
                                            <div className="flex gap-2">
                                                {post.categories.slice(0, 2).map((category) => (
                                                    <span
                                                        key={category}
                                                        className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded"
                                                    >
                                                        {category}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </a>
                        ))}
                    </div>
                )}
                
                <div className="mt-12 text-center">
                    <a
                        href="https://medium.com/@fleizean"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block px-6 py-3 bg-primary text-white rounded-lg hover:opacity-90 transition-opacity"
                    >
                        {t('blog.view_all') || 'View All on Medium →'}
                    </a>
                </div>
            </div>
        </div>
    );
}
