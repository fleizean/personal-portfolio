'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { SchoolExperience } from '@/types/schoolexperience';
import { useTranslation } from '@/context/LanguageContext';
import { useTheme } from '@/context/ThemeContext';

const SchoolLifeContent: React.FC = () => {
  const { isLoading, t } = useTranslation('common');
  const { theme } = useTheme();
  const [badgeLoaded, setBadgeLoaded] = React.useState(false);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="loader"></div>
      </div>
    );
  }

  const schoolExperiences =
    (t('school.experiences', { returnObjects: true }) as SchoolExperience[]) || [];

  return (
    <section className="relative w-full z-10 transition-all duration-300 py-8 sm:py-12 md:py-16 lg:py-20 min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-20 xl:px-60">
        <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-10 text-gray-700 dark:text-gray-300 dark:hover:text-white">
          {t('school.section_title')}
        </h2>

        <div className="flex justify-start mb-8">
          <a href="https://github.com/oakoudad/badge42" className="block">
            {!badgeLoaded && (
              <div className="w-64 h-16 rounded-lg bg-gray-200 dark:bg-gray-700 animate-pulse" />
            )}
            <img
              src="https://badge.mediaplus.ma/colorfulwaves/eyagiz?1337Badge=off&UM6P=off"
              alt="eyagiz's 42 stats"
              className={`transition-opacity duration-500 ${badgeLoaded ? 'opacity-100' : 'opacity-0 h-0'}`}
              onLoad={() => setBadgeLoaded(true)}
            />
          </a>
        </div>

        <div>
          <ul className="space-y-4">
            {schoolExperiences.map((experience, index) => (
              <li key={index} className="pb-3">
                <div className="flex flex-col md:flex-row items-start justify-between gap-4">
                  <div className="flex items-baseline gap-2 w-full md:w-auto">
                    <span className="text-lg">🎓</span>
                    <div className="w-full">
                      <div className="flex flex-wrap items-center gap-1">
                        <span className="font-medium text-black dark:text-gray-300 dark:hover:text-white">
                          {experience.title}
                        </span>
                        <span className="font-xs text-black dark:text-gray-300 dark:hover:text-white">
                          {experience.link ? (
                            <Link
                              href={experience.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-black hover:text-black dark:text-gray-300 dark:hover:text-white"
                            >
                              • {experience.period}
                            </Link>
                          ) : (
                            `• ${experience.period}`
                          )}
                        </span>
                      </div>
                      <p className="text-sm text-black mt-1 dark:text-gray-400">
                        {experience.description}
                      </p>

                      <div className="mt-4">
                        <h4 className="font-semibold mb-2 dark:text-gray-300 dark:hover:text-white">
                          {t('school.key_experiences_title')}
                        </h4>
                        <ul className="list-disc pl-5 space-y-1">
                          {experience.highlights.map((highlight, i) => (
                            <li key={i} className="text-sm text-black dark:text-gray-400">
                              {highlight}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="mt-6">
                        <h4 className="font-semibold mb-2 dark:text-gray-300 dark:hover:text-white">
                          {t('school.experiences.0.reflection_title')}
                        </h4>
                        <p className="text-sm text-black italic dark:text-gray-400">
                          &ldquo;{t('school.experiences.0.reflection')}&rdquo;
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-8">
          <h3 className="font-bold mb-4 dark:text-gray-300 dark:hover:text-white">
            {t('school.looking_back_title')}
          </h3>
          <div className="flex items-baseline gap-2">
            <span className="text-lg flex-shrink-0">✨</span>
            <p className="text-sm text-black dark:text-gray-400">{t('school.looking_back_text')}</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SchoolLifeContent;
