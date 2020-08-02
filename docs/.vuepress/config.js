const categories = require('../../providers')

const generatedSidebar = categories.map(cat => {
  return {
    title: cat.name,
    collapsable: cat.collapsable || false,
    children: cat.providers.map(c => {
      return [`/${c.slug}/`, c.name]
    }),
  }
})

module.exports = {
  title: 'Socialite Providers',
  description: 'A Collection of Providers for Laravel Socialite',
  dest: './dist',

  themeConfig: {
    algolia: {
      // apiKey: '662d6a5e1b798d17b5eaaeb770b415e7',
      // indexName: 'SocialiteProviders'
    },
    providerCount: categories.reduce((count, cat) => count + cat.providers.length, 0),
    sidebarDepth: 1,
    nav: [
      { text: 'About / FAQ', link: '/about' },
      { text: 'Contribute', link: '/contribute' },
      { text: 'Github', link: 'https://github.com/SocialiteProviders', },
      { text: 'Packagist', link: 'https://packagist.org/packages/socialiteproviders/', },
    ],
    sidebar: [
      {
        title: 'Documentation',
        collapsable: false,
        children: [
          ['/about', 'About / FAQ'],
          ['/usage', 'Installation & Usage'],
          ['/contribute', 'Contribute'],
        ]
      }
    ].concat(generatedSidebar),
  },
  async additionalPages () {
    let allProviders = []

    categories.map(cat => {
      cat.providers.map(c => {
        if (cat.name === 'Deprecated') c.deprecated = true;
        allProviders.push(c)
      })
    })

    const axios = require('axios')
    const { mapLimit } = require('async')

    return await mapLimit(allProviders, 3, async (provider) => {
      if (!global['REPO_CACHE']) global['REPO_CACHE'] = {};

      if (!global['REPO_CACHE'][provider.slug]) {
        let content;
        try {
          const res = await axios.get(`https://raw.githubusercontent.com/SocialiteProviders/${provider.slug}/master/README.md`)
          content = res.data
          console.log(`Fetched readme for ${provider.slug}`)
        } catch (e) {
          console.error(`Failed to fetch readme for ${provider.slug}: ${e}`)
          content = ''
        }

        content = `<ProviderHeader slug="${provider.slug}" :maintainers='${JSON.stringify(provider.maintainers)}'></ProviderHeader>\n` + content

        if (provider.deprecated) {
          content = `::: danger
This provider is deprecated. Please see the [GitHub Repo](https://github.com/SocialiteProviders/${provider.slug}) for more information
:::\n` + content
        }

        global['REPO_CACHE'][provider.slug] = {
          path: `/${provider.slug}/`,
          content,
        }
      }

      return global['REPO_CACHE'][provider.slug]
    })
  },
  head: [
    ['link', { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-icon-180x180.png' }],
    ['link', { rel: 'icon" type="image/png', sizes: '32x32', href: '/favicon-32x32.png' }],
    ['link', { rel: 'icon" type="image/png', sizes: '16x16', href: '/favicon-16x16.png' }],
    ['link', { rel: 'manifest', href: '/site.webmanifest' }],
    ['style', {}, 'img + .icon.outbound {display: none;}']
  ],
  extraWatchFiles: [
    '../../providers.js'
  ],
  plugins: [
    // [
    //   '@vuepress/google-analytics',
    //   {
    //     'ga': 'UA-150688103-1'
    //   }
    // ]
  ]
}


