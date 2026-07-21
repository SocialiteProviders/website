---
title: Contribute
---

# Contribute

## Creating a Provider

* Create the provider class
* Create a listener/handler
* Create a composer.json file and add <em>socialiteproviders/manager</em> (<a href="https://github.com/SocialiteProviders/Manager">See the manager package.</a>) in the "require" section.
* If using OAuth1 you need to also create a server class.
* Generate documentation for the provider by running `docgen.php` in the `tools` folder. (and customise if required).
* Set the `category` in the README frontmatter (see below).
* If the provider's repository name differs from its `src/` directory name, add it to `split-overrides.json` in the repository root.

### Provider category

Each provider's `README.md` starts with a frontmatter block that tells the
website which category to list the provider under:

```markdown
---
category: Productivity / Business
---

# YourProvider
```

`docgen.php` writes this for you with a default of `Misc` — change it to the
category that fits best. The valid categories are the section headings in the
sidebar:

`Social / Platform`, `Gaming`, `Education / Career`, `Productivity / Business`,
`Government / University`, `Payments`, `Music`, `Misc`

You can also set an optional `name` to control how the provider is displayed if
it should differ from the directory name:

```markdown
---
category: Payments
name: My Payment Provider
---
```

Once your PR is merged with the `new-provider` label, the provider is added to
this website automatically — you don't need to open a PR against the website
repo. The frontmatter itself is stripped from the rendered page.

To speed up the creation of your provider you can use the <a href="https://github.com/SocialiteProviders/Generators">generator</a>.

Look at the already created <a href="#providers">providers</a> and the <a href="https://github.com/SocialiteProviders/Manager">Manager</a> package for inspiration.

## Submitting a new provider

Send new provider pull requests to the <a href="https://github.com/SocialiteProviders/Providers">Providers</a> repo.

## Creating a handler

Below is an example handler. You need to add the fully qualified class name to the `listen[]` in the `EventServiceProvider`.

* <a href="https://laravel.com/docs/8.x/events">See also the Laravel docs about events</a>
* `providername` is the name of the provider such as `meetup`.
* You will need to change the namespaces to match your vendor and package name.

```php
namespace Your\Name\Space;

use SocialiteProviders\Manager\SocialiteWasCalled;

class ProviderNameExtendSocialite
{
    public function handle(SocialiteWasCalled $socialiteWasCalled)
    {
        $socialiteWasCalled->extendSocialite('providername', 'Your\Name\Space\ProviderName');
    }
}
```

## Resources

* <a href="https://medium.com/@morrislaptop/adding-auth-providers-to-laravel-socialite-ca0335929e42">See this article on Medium</a> about creating a new provider
* <a href="https://laravel.com/docs/8.x/events">Laravel docs on events</a>

## Overriding a Built-in Provider

You can easily override a built-in laravel/socialite provider by creating a new provider with exactly the same name (i.e. 'facebook').

## Tests

If we have tests in the repo (currently and foreseeably only the <a href="https://github.com/SocialiteProviders/Manager">Manager</a> package)
you need to have tests cover any changes submitted in a pull request.  We currently use PHPUnit and Mockery for our test suite.

## Style

Run PHP-CS-Fixer on your machine and put a .styleci.yml into the repository with preset: symfony to make sure that pull requests and merges follow the <a href="http://symfony.com/doc/current/contributing/code/standards.html">Symfony Coding Standards</a>.
