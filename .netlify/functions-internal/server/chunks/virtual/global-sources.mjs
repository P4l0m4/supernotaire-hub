const sources = [
    {
        "context": {
            "name": "sitemap:urls",
            "description": "Set with the `sitemap.urls` config."
        },
        "urls": [],
        "sourceType": "user"
    },
    {
        "context": {
            "name": "nuxt:pages",
            "description": "Generated from your static page files.",
            "tips": [
                "Can be disabled with `{ excludeAppSources: ['nuxt:pages'] }`."
            ]
        },
        "urls": [
            {
                "loc": "/"
            },
            {
                "loc": "/contact"
            },
            {
                "loc": "/notaires"
            },
            {
                "loc": "/vendeurs"
            },
            {
                "loc": "/tutoriels"
            },
            {
                "loc": "/inscription"
            },
            {
                "loc": "/faq-notaires"
            },
            {
                "loc": "/faq-vendeurs"
            },
            {
                "loc": "/outils"
            },
            {
                "loc": "/annuaire"
            },
            {
                "loc": "/comment-ca-marche"
            },
            {
                "loc": "/outils/pre-etat-date"
            },
            {
                "loc": "/outils/valeur-fonciere"
            },
            {
                "loc": "/outils/text-from-document"
            }
        ],
        "sourceType": "app"
    }
];

export { sources };
//# sourceMappingURL=global-sources.mjs.map
