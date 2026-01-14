'use client';

import { useTranslation } from '@/context/LanguageContext';
import React, { useState } from 'react';
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import { FaX } from 'react-icons/fa6';
import { useForm, SubmitHandler } from 'react-hook-form';

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const ContactContent = () => {
  const { isLoading, t } = useTranslation('common');
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ContactFormData>();
  const [submitStatus, setSubmitStatus] = useState('');

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="loader"></div>
      </div>
    );
  }

  const onSubmit: SubmitHandler<ContactFormData> = async (data) => {
    setSubmitStatus('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success) {
        setSubmitStatus('success');
        reset();
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      setSubmitStatus('error');
      console.error('Error submitting form:', error);
    }
  };

  const socialLinks = [
    {
      icon: <FaGithub className="text-xl" />,
      label: 'GitHub',
      url: 'https://github.com/fleizean',
      color: 'hover:text-gray-800',
    },
    {
      icon: <FaLinkedin className="text-xl" />,
      label: 'LinkedIn',
      url: 'https://www.linkedin.com/in/fleizean/',
      color: 'hover:text-blue-600',
    },
    {
      icon: <FaX className="text-xl" />,
      label: 'Twitter',
      url: 'https://twitter.com/fleizean',
      color: 'hover:text-gray-800',
    },
  ];

  return (
    <section className="relative w-full z-10 transition-all duration-300 py-8 sm:py-12 md:py-16 lg:py-20 min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-20 xl:px-60">
        <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-10 text-gray-900 dark:text-gray-300">
          {t('contact.page_title')}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 md:gap-12">
          {/* Left Column */}
          <div className="space-y-4 sm:space-y-6">
            <div>
              <h3 className="font-bold mb-3 sm:mb-4 text-base sm:text-lg dark:text-gray-300">
                {t('contact.sections.left.title')}
              </h3>
              <p className="text-black dark:text-gray-400 text-sm sm:text-base leading-relaxed">
                {t('contact.sections.left.description')}
              </p>
            </div>

            {/* Contact Info */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="text-lg flex-shrink-0">✉️</span>
                <div>
                  <span className="text-xs text-black dark:text-gray-400 uppercase tracking-wider block">
                    {t('contact.sections.contact_info.email.label')}
                  </span>
                  <a
                    href="mailto:nsyagz@gmail.com"
                    className="text-black hover:text-black dark:text-gray-300 dark:hover:text-white font-medium transition-colors"
                  >
                    {t('contact.sections.contact_info.email.value')}
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-lg flex-shrink-0">📍</span>
                <div>
                  <span className="text-xs text-black dark:text-gray-400 uppercase tracking-wider block">
                    {t('contact.sections.contact_info.location.label')}
                  </span>
                  <a
                    href="https://www.google.com/maps/place/Kocaeli,+Turkey"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-black hover:text-black dark:text-gray-300 dark:hover:text-white font-medium transition-colors"
                  >
                    {t('contact.sections.contact_info.location.value')}
                  </a>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div>
              <h4 className="font-semibold mb-3 text-sm sm:text-base text-gray-700 dark:text-gray-300">
                Follow me
              </h4>
              <div className="flex flex-wrap gap-3 sm:gap-4">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-black transition-all duration-300 p-2 rounded-lg hover:bg-gradient-to-r hover:from-gray-700 hover:to-gray-500 hover:text-white dark:text-gray-400 dark:hover:text-white"
                    title={social.label}
                  >
                    <span className="text-lg sm:text-xl">{social.icon}</span>
                  </a>
                ))}
              </div>
            </div>
            {/* Quick Contact */}
            <div className="pt-4 border-t border-gray-800 dark:border-gray-700">
              <h4 className="font-semibold mb-3 text-sm sm:text-base text-black dark:text-gray-300">
                {t('contact.sections.quick_contact.title')}
              </h4>
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-2">
                <a
                  href="mailto:nsyagz@gmail.com"
                  className="inline-flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-700 rounded-lg hover:border-transparent transition-all duration-300 text-sm font-medium text-black dark:text-gray-300 w-full sm:w-auto"
                  style={
                    {
                      '--hover-border': 'linear-gradient(135deg, #2a2a2a, #555555)',
                    } as React.CSSProperties
                  }
                >
                  <span className="text-xs">✉️</span>
                  {t('contact.sections.quick_contact.actions.email')}
                </a>
                <a
                  href="https://www.linkedin.com/in/fleizean/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-700 rounded-lg hover:border-transparent transition-all duration-300 text-sm font-medium text-black dark:text-gray-300 w-full sm:w-auto"
                  style={
                    {
                      '--hover-border': 'linear-gradient(135deg, #2a2a2a, #555555)',
                    } as React.CSSProperties
                  }
                >
                  <span className="text-xs">💼</span>
                  {t('contact.sections.quick_contact.actions.linkedin')}
                </a>
              </div>
            </div>
          </div>

          {/* Right Column - Form */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 sm:p-6">
            <h3 className="font-bold mb-4 text-base sm:text-lg dark:text-gray-300">
              {t('contact.sections.form.title')}
            </h3>

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t('contact.sections.form.fields.name.label')} *
                  </label>
                  <input
                    type="text"
                    {...register('name', { required: 'Name is required' })}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors text-sm bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 ${
                      errors.name
                        ? 'border-red-500 focus:ring-red-400'
                        : 'border-gray-300 dark:border-gray-600 focus:ring-purple-400 dark:focus:ring-purple-600'
                    }`}
                    placeholder={t('contact.sections.form.fields.name.placeholder')}
                  />
                  {errors.name && (
                    <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t('contact.sections.form.fields.email.label')} *
                  </label>
                  <input
                    type="email"
                    {...register('email', {
                      required: 'Email is required',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Invalid email address',
                      },
                    })}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors text-sm bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 ${
                      errors.email
                        ? 'border-red-500 focus:ring-red-400'
                        : 'border-gray-300 dark:border-gray-600 focus:ring-gray-200 dark:focus:ring-gray-700'
                    }`}
                    placeholder={t('contact.sections.form.fields.email.placeholder')}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t('contact.sections.form.fields.subject.label')} *
                </label>
                <input
                  type="text"
                  {...register('subject', { required: 'Subject is required' })}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors text-sm bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 ${
                    errors.subject
                      ? 'border-red-500 focus:ring-red-400'
                      : 'border-gray-300 dark:border-gray-600 focus:ring-gray-200 dark:focus:ring-gray-700'
                  }`}
                  placeholder={t('contact.sections.form.fields.subject.placeholder')}
                />
                {errors.subject && (
                  <p className="text-red-500 text-xs mt-1">{errors.subject.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t('contact.sections.form.fields.message.label')} *
                </label>
                <textarea
                  {...register('message', { required: 'Message is required' })}
                  rows={5}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors text-sm resize-none bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 ${
                    errors.message
                      ? 'border-red-500 focus:ring-red-400'
                      : 'border-gray-300 dark:border-gray-600 focus:ring-gray-200 dark:focus:ring-gray-700'
                  }`}
                  placeholder={t('contact.sections.form.fields.message.placeholder')}
                />
                {errors.message && (
                  <p className="text-red-500 text-xs mt-1">{errors.message.message}</p>
                )}
              </div>

              <button
                type="submit"
                onClick={handleSubmit(onSubmit)}
                disabled={isSubmitting}
                className="w-full text-white py-2 px-4 rounded-lg hover:scale-105 hover:shadow-lg transition-all duration-300 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ background: 'linear-gradient(135deg, #2a2a2a, #555555)' }}
              >
                {isSubmitting
                  ? t('contact.sections.form.submit_button.loading')
                  : t('contact.sections.form.submit_button.default')}
              </button>

              {submitStatus === 'success' && (
                <div
                  className="p-3 rounded-lg text-white text-sm font-medium"
                  style={{ background: 'linear-gradient(135deg, #2a2a2a, #555555)' }}
                >
                  {t('contact.sections.form.success_message')}
                </div>
              )}
            </div>

            <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
              {t('contact.sections.form.footer_note')}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactContent;
