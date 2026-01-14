'use client';

import React from 'react';
import { useLanguage, useTranslation } from '@/context/LanguageContext';
import { HiExternalLink, HiDownload } from 'react-icons/hi';

const CVContent = () => {
  const { language } = useLanguage();
  const { t } = useTranslation('common');

  const pdfFile = language === 'tr' ? '/cv/ENES_YAGIZ_TR.pdf' : '/cv/ENES_YAGIZ_EN.pdf';

  const downloadPDF = () => {
    const link = document.createElement('a');
    link.href = pdfFile;
    link.download = pdfFile.split('/').pop() || 'resume.pdf';
    link.click();
  };

  return (
    <section className="relative w-full z-10 transition-all duration-300 py-8 sm:py-12 md:py-16 lg:py-20 min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-20 xl:px-60">
        <div className="flex flex-col items-center">
          <h1 className="text-3xl sm:text-4xl font-bold mb-6 text-gray-900 dark:text-gray-300">
            {t('hero.resumeButton')}
          </h1>

          {/* Controls */}
          <div className="flex flex-wrap gap-3 mb-6 justify-center">
            <a
              href={pdfFile}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 text-white rounded-lg hover:opacity-90 transition-all duration-300"
              style={{ background: 'linear-gradient(135deg, #2a2a2a, #555555)' }}
            >
              <HiExternalLink className="text-lg" />
              {t('cv.open_new_tab') || 'Open in New Tab'}
            </a>

            <button
              onClick={downloadPDF}
              className="inline-flex items-center gap-2 px-4 py-2 text-white rounded-lg hover:opacity-90 transition-all duration-300"
              style={{ background: 'linear-gradient(135deg, #2a2a2a, #555555)' }}
            >
              <HiDownload className="text-lg" />
              {t('cv.download') || 'Download'}
            </button>
          </div>

          {/* PDF Viewer */}
          <div className="w-full bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden">
            <iframe
              src={pdfFile}
              className="w-full h-[600px] sm:h-[700px] md:h-[800px] lg:h-[900px]"
              title="CV/Resume"
            />
          </div>

          {/* Mobile fallback message */}
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-4 text-center">
            {t('cv.mobile_note') ||
              'If the PDF doesn\'t display, please use the "Open in New Tab" or "Download" button above.'}
          </p>
        </div>
      </div>
    </section>
  );
};

export default CVContent;
