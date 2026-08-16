---
title: Contribute
---

# Contribute

## Creating a Provider

The <a href="https://github.com/SocialiteProviders/Providers">Providers</a> repo ships a scaffolding tool that writes every file a provider needs:

```bash
php tools/make-provider.php
```

It asks for the provider name, driver alias, OAuth version, display name, category, whether the
provider uses PKCE, and any extra config keys. From those answers it writes `Provider.php`,
`<Name>ExtendSocialite.php`, `composer.json` and `README.md` under `src/<Name>/`, plus a
`Server.php` for OAuth1 providers and an optional test suite under `tests/<Name>/`.

Every answer also has a flag, so it can run unattended:

```bash
php tools/make-provider.php --name=Frappe --oauth=2 --category=Misc --no-tests
```

Once it has run, there are three things the tool can't do for you:

* Fill in the `TODO`s in `Provider.php` against the provider's own OAuth documentation.
* Link that documentation in the `README.md`. Reviewers ask for it every time.
* Add yourself to `authors` in the provider's `composer.json`.

The generated `README.md` is a starting point, not the finished article — customise it for
anything specific to the provider, such as required scopes or non-obvious config.

You don't need to register the provider anywhere. Splitting to a standalone repo is automatic:
new `src/*` directories are detected from the merge commit and split out on release.

Look at the already created <a href="#providers">providers</a> and the
<a href="https://github.com/SocialiteProviders/Manager">Manager</a> package for inspiration.

::: tip Building a provider for one app?
The <a href="https://github.com/SocialiteProviders/Generators">Generators</a> package is a
different tool for a different job. It installs an Artisan command into a Laravel application and
generates a provider inside <em>that</em> app. Use it when you need a one-off provider you don't
intend to publish; use `make-provider.php` when you're contributing a provider here.
:::

## Category

Each provider's `README.md` needs a `category` key in its frontmatter, which is what files it on
this site:

```markdown
---
category: Misc
---
```

It must be one of:

`Social / Platform`, `Gaming`, `Education / Career`, `Productivity / Business`,
`Government / University`, `Payments`, `Music`, `Misc`

Anything else is rejected when the provider is merged, so a near-miss like `Business` will fail.
The scaffolding tool validates your answer, but a README edited by hand gets no such check.

## Submitting a new provider

Send new provider pull requests to the <a href="https://github.com/SocialiteProviders/Providers">Providers</a> repo.

## Creating a handler

Below is an example handler. You need to add the fully qualified class name to the `listen[]` in the `EventServiceProvider`.

* <a href="https://laravel.com/docs/events">See also the Laravel docs about events</a>
* `providername` is the name of the provider such as `meetup`.
* You will need to change the namespaces to match your vendor and package name.

```php
namespace Your\Name\Space;

use SocialiteProviders\Manager\SocialiteWasCalled;

class ProviderNameExtendSocialite
{
    public function handle(SocialiteWasCalled $socialiteWasCalled): void
    {
        $socialiteWasCalled->extendSocialite('providername', Provider::class);
    }
}
```

The alias passed to `extendSocialite()` is used verbatim as the key in `config/services.php`, so a
provider registered as `epic-games` reads the `epic-games` key — not `epic_games`.

## Resources

* <a href="https://medium.com/@morrislaptop/adding-auth-providers-to-laravel-socialite-ca0335929e42">See this article on Medium</a> about creating a new provider
* <a href="https://laravel.com/docs/events">Laravel docs on events</a>

## Overriding a Built-in Provider

You can easily override a built-in laravel/socialite provider by creating a new provider with exactly the same name (i.e. 'facebook').

## Tests

Tests aren't mandatory for a new provider, but they're wired up and welcome. Create
`tests/<Provider>/`, extend `SocialiteProviders\Tests\TestCase` and implement `provider()` to return
your provider class. CI picks the suite up automatically and runs it against the providers a pull
request touches — there's no workflow to edit.

Tests live at the repository root rather than under `src/`, because each provider is split to its own
repo on the `src/<Provider>` prefix; tests kept alongside the provider would ship in the published
package.

`TestCase` provides `makeProvider()`, `makeRequest()`, `makeHttpClient()` and `fixture()` for
stubbing responses, plus `makeRequestWithSession()` for providers that use PKCE.

We use PHPUnit and Mockery for the test suite.

## Style

Code style is handled by <a href="https://laravel.com/docs/pint">Pint</a>, configured in `pint.json`
at the repository root with the `laravel` preset:

```bash
vendor/bin/pint
```

Style is fixed automatically once a pull request is merged, so a PR that only fails on formatting
isn't a blocker.
