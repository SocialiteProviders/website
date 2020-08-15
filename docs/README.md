---
home: true
actionText: Get Started →
actionLink: /about/
features:
- title: Simplicity First
  details: Minimal setup with a familiar structure helps you focus on developing your newest product.
- title: Seamless Integration
  details: Following the same API as Laravel Socialite allows for a seamless integration.
- title: Powerful Support
  details: The Socialite Manager grants you access to both custom and official providers.
---

<style>
.maintain {
    display: block;
    margin-top: 0.3em;
    color: #989898;
}
</style>


``` bash
# install
composer require socialiteproviders/twitter

# register
protected $listen = [
    \SocialiteProviders\Manager\SocialiteWasCalled::class => [
        'SocialiteProviders\Twitter\TwitterExtendSocialite@handle'
    ],
];

# configure
'twitter' => [
    'client_id' => env('TWITTER_KEY'),
    'client_secret' => env('TWITTER_SECRET'),
    'redirect' => env('TWITTER_REDIRECT_URI'),
]

# start building
return Socialite::driver('twitter')->redirect();
```

<div class="footer">
    MIT Licensed | Copyright © {{ (new Date).getFullYear() }} | <a href="https://github.com/orgs/socialiteproviders/people">Contributors</a>
    <small class="maintain">Maintained by <a href="https://atymic.dev">atymic</a></small>
</div>
