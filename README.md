# Socialite Providers Website

Our site is built with [Vuepress](https://vuepress.vuejs.org/).


## Building

```bash
yarn dev # Run developmnent server
yarn build # Build the static site
```

## Adding new Channels

Open `providers.js` and add your channel to the correct category. The slug should be set as the github repository name.
`maintainers` is a list of github usernames that maintain the channel (they appear in the header of the channel page on the website)

This will add the channel to the sidebar, and pull in the `README.md` from the repository during the build. 

```js
...

name: 'Social / Platform', providers: [
      {
        slug: 'Apple', name: 'Apple',
        maintainers: [],
      },
      {
        slug: 'Auth0', name: 'Auth0',
        maintainers: [],
      },

...
```


## Deploying
This website is deployed automatically using [Netlify](https://app.netlify.com).
   
Branch previews are build for each PR.

## Contribution

Contributions are welcome. Feel free to create an Issue or PR.
