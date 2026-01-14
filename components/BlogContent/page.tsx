'use client';

import { useTranslation } from '@/context/LanguageContext';
import React from 'react';
import { MediumPost } from '@/lib/medium';
import Image from 'next/image';

interface BlogContentProps {
  posts: MediumPost[];
}

export default function BlogContent({ posts }: BlogContentProps) {
  const { isLoading, t } = useTranslation('common');

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <div className="relative w-full z-10 transition-all duration-300 py-8 sm:py-12 md:py-16 lg:py-20 min-h-screen">
      <div className="container mx-auto px-8 lg:px-60 py-10">
        <h1 className="text-4xl sm:text-5xl font-bold mb-8 text-gray-900 dark:text-gray-300">
          {t('blog.title') || 'bloglarım (medium kurduyum)'}
        </h1>

        {posts.length === 0 ? (
          <p className="text-gray-700 dark:text-gray-400">
            {t('blog.no_posts') || 'No blog posts available.'}
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {posts.map((post) => (
              <a
                key={post.link}
                href={post.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group block bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-2 border-transparent hover:border-gradient"
                style={
                  {
                    '--hover-border': 'linear-gradient(135deg, #2a2a2a, #555555, #7a7a7a)',
                  } as React.CSSProperties
                }
              >
                {post.thumbnail && (
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={post.thumbnail}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      width={500}
                      height={500}
                    />
                  </div>
                )}

                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-gray-300 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-600 group-hover:to-pink-500 transition-all duration-300">
                    {post.title}
                  </h3>

                  <p className="text-gray-700 dark:text-gray-400 text-sm mb-4 line-clamp-3">
                    {post.contentSnippet}
                  </p>

                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <time className="text-sm text-gray-700 dark:text-gray-400 font-medium">
                      {new Date(post.pubDate).toLocaleDateString('tr-TR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </time>

                    {post.categories && post.categories.length > 0 && (
                      <div className="flex gap-2 flex-wrap">
                        {post.categories.slice(0, 2).map((category, index) => (
                          <span
                            key={category}
                            className="text-xs px-2.5 py-1 rounded text-white font-medium"
                            style={{
                              background:
                                index === 0
                                  ? 'linear-gradient(135deg, #2a2a2a, #555555)'
                                  : 'linear-gradient(135deg, #555555, #7a7a7a)',
                            }}
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
            className="inline-block px-8 py-3 text-white rounded-lg hover:opacity-90 hover:scale-105 transition-all duration-300 font-medium shadow-lg"
            style={{ background: 'linear-gradient(135deg, #2a2a2a, #555555)' }}
          >
            {t('blog.view_all') || 'View All on Medium →'}
          </a>
        </div>
      </div>
    </div>
  );
}
