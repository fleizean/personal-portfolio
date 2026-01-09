const config = {
    titleTemplate: '%s | Enes Yağız',
    defaultTitle: 'Enes Yağız - Full Stack Developer',
    description: 'Full Stack Developer crafting digital experiences through code and design. Exploring the balance between functionality and aesthetics.',
    canonical: 'https://fleizean.me',
    openGraph: {
        type: 'website',
        locale: 'en_US',
        url: 'https://fleizean.me',
        siteName: 'Enes Yağız Portfolio',
        title: 'Enes Yağız - Full Stack Developer',
        description: 'Full Stack Developer crafting digital experiences through code and design.',
        images: [
            {
                url: 'https://fleizean.me/logo.png',
                width: 1200,
                height: 630,
                alt: 'Enes Yağız Portfolio',
            },
        ],
    },
    twitter: {
        handle: '@fleizean',
        site: '@fleizean',
        cardType: 'summary_large_image',
        creator: '@fleizean',
        images: [
            {
                url: 'https://fleizean.me/logo.png',
                width: 1200,
                height: 630,
                alt: 'Enes Yağız Portfolio',
            },
        ],
    },
    additionalMetaTags: [
        {
            name: 'keywords',
            content: 'full stack developer, web development, react, next.js, typescript, .net, portfolio',
        },
        {
            name: 'author',
            content: 'Enes Yağız',
        },
    ],
    additionalLinkTags: [
        {
            rel: 'icon',
            href: '/favicon.ico',
        },
    ],
};

export default config;
