"use client";

import { useTranslation } from '@/context/LanguageContext';
import React, { useState } from 'react';
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import { FaX } from 'react-icons/fa6';

const ContactContent = () => {
    const { isLoading, t } = useTranslation("common");
    
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState('');

    if (isLoading) {
        return <div className="flex justify-center items-center min-h-screen">
            <div className="loader"></div>
        </div>;
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitStatus('');
    
        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
    
            const result = await response.json();
            
            if (result.success) {
                setSubmitStatus('success');
                setFormData({ name: '', email: '', subject: '', message: '' });
            } else {
                setSubmitStatus('error');
            }
        } catch (error) {
            setSubmitStatus('error');
            console.error('Error submitting form:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const socialLinks = [
        {
            icon: <FaGithub className="text-xl" />,
            label: 'GitHub',
            url: 'https://github.com/fleizean',
            color: 'hover:text-gray-800'
        },
        {
            icon: <FaLinkedin className="text-xl" />,
            label: 'LinkedIn',
            url: 'https://www.linkedin.com/in/fleizean/',
            color: 'hover:text-blue-600'
        },
        {
            icon: <FaX className="text-xl" />,
            label: 'Twitter',
            url: 'https://twitter.com/fleizean',
            color: 'hover:text-gray-800'
        }
    ];

    return (
        <section className="relative w-full z-50 transition-all duration-300 py-20 md:py-28 lg:py-36 dark:blue-900 dark:bg-opacity-50 dark:bg-gray-800 min-h-screen">
            <div className="container mx-auto px-4 sm:px-6 md:px-10 lg:px-20 xl:px-60 py-6 sm:py-10">
            <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-10 text-gray-700 dark:text-gray-300">
                {t('contact.page_title')}
            </h2>

            <div className="grid md:grid-cols-2 gap-8 md:gap-12">
                {/* Left Column */}
                <div className="space-y-6">
                <div>
                    <h3 className="font-bold mb-4 text-lg dark:text-gray-300">{t('contact.sections.left.title')}</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                    {t('contact.sections.left.description')}
                    </p>
                </div>
                
                {/* Contact Info */}
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                    <span className="text-lg flex-shrink-0">✉️</span>
                    <div>
                        <span className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider block">
                        {t('contact.sections.contact_info.email.label')}
                        </span>
                        <a href="mailto:nsyagz@gmail.com" className="text-gray-700 hover:text-black dark:text-gray-300 dark:hover:text-white font-medium transition-colors">
                        {t('contact.sections.contact_info.email.value')}
                        </a>
                    </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                    <span className="text-lg flex-shrink-0">📍</span>
                    <div>
                        <span className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider block">
                        {t('contact.sections.contact_info.location.label')}
                        </span>
                        <a href="https://www.google.com/maps/place/Kocaeli,+Turkey" target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-black dark:text-gray-300 dark:hover:text-white font-medium transition-colors">
                        {t('contact.sections.contact_info.location.value')}
                        </a>
                    </div>
                    </div>
                </div>

                {/* Social Links */}
                <div>
                    <h4 className="font-semibold mb-3 text-gray-700 dark:text-gray-300">Follow me</h4>
                    <div className="flex gap-4">
                    {socialLinks.map((social, index) => (
                        <a
                        key={index}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`text-gray-500 ${social.color} transition-colors p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 dark:text-gray-400`}
                        title={social.label}
                        >
                        <span className="text-xl">{social.icon}</span>
                        </a>
                    ))}
                    </div>
                </div>
                {/* Quick Contact */}
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <h4 className="font-semibold mb-3 text-gray-700 dark:text-gray-300">{t('contact.sections.quick_contact.title')}</h4>
                    <div className="space-y-2">
                    <a href="mailto:nsyagz@gmail.com" className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm font-medium text-gray-700 dark:text-gray-300 w-full sm:w-auto">
                        <span className="text-xs">✉️</span>
                        {t('contact.sections.quick_contact.actions.email')}
                    </a>
                    <br className="sm:hidden" />
                    <a href="https://www.linkedin.com/in/fleizean/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm font-medium text-gray-700 dark:text-gray-300 w-full sm:w-auto sm:ml-2">
                        <span className="text-xs">💼</span>
                        {t('contact.sections.quick_contact.actions.linkedin')}
                    </a>
                    </div>
                </div>
                </div>

                {/* Right Column - Form */}
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
                <h3 className="font-bold mb-4 text-lg dark:text-gray-300">{t('contact.sections.form.title')}</h3>
                
                <div className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        {t('contact.sections.form.fields.name.label')} *
                        </label>
                        <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200 dark:focus:ring-gray-700 focus:border-gray-400 dark:focus:border-gray-500 transition-colors text-sm bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                        placeholder={t('contact.sections.form.fields.name.placeholder')}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        {t('contact.sections.form.fields.email.label')} *
                        </label>
                        <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200 dark:focus:ring-gray-700 focus:border-gray-400 dark:focus:border-gray-500 transition-colors text-sm bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                        placeholder={t('contact.sections.form.fields.email.placeholder')}
                        />
                    </div>
                    </div>

                    <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        {t('contact.sections.form.fields.subject.label')} *
                    </label>
                    <input
                        type="text"
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200 dark:focus:ring-gray-700 focus:border-gray-400 dark:focus:border-gray-500 transition-colors text-sm bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                        placeholder={t('contact.sections.form.fields.subject.placeholder')}
                    />
                    </div>

                    <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        {t('contact.sections.form.fields.message.label')} *
                    </label>
                    <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        rows={5}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200 dark:focus:ring-gray-700 focus:border-gray-400 dark:focus:border-gray-500 transition-colors text-sm resize-none bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                        placeholder={t('contact.sections.form.fields.message.placeholder')}
                    />
                    </div>

                    <button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="w-full bg-gray-800 dark:bg-gray-700 text-white py-2 px-4 rounded-lg hover:bg-black dark:hover:bg-gray-600 transition-colors duration-200 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                    {isSubmitting ? t('contact.sections.form.submit_button.loading') : t('contact.sections.form.submit_button.default')}
                    </button>

                    {submitStatus === 'success' && (
                    <div className="p-3 bg-green-100 dark:bg-green-900 border border-green-300 dark:border-green-700 rounded-lg text-green-700 dark:text-green-300 text-sm">
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