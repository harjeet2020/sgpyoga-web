# Vendored third-party scripts

These are exact, unmodified copies of third-party libraries (apart from a one-line license header on the two i18next files, which ship without one). They're served from our own domain instead of a CDN.

| File | Library | Version | License |
|---|---|---|---|
| `i18next.min.js` | [i18next](https://github.com/i18next/i18next) | 26.4.2 | MIT |
| `i18nextBrowserLanguageDetector.min.js` | [i18next-browser-languagedetector](https://github.com/i18next/i18next-browser-languageDetector) | 8.2.1 | MIT |
| `fuse.min.js` | [Fuse.js](https://www.fusejs.io/) (blog search) | 7.0.0 | Apache-2.0 |

## Why self-host?

The pages used to load these from `unpkg.com` without a version (for example `unpkg.com/i18next/...`). unpkg answers an unversioned URL with a **302 redirect** to the current version, so every page view paid an extra round trip per script. Those redirect responses are only cacheable for 60 seconds. It also meant a breaking upstream release would reach the live site with no deploy on our side.

Serving pinned copies from our own origin removes the redirects, the extra DNS/TLS connection to a third party, and the risk of surprise upgrades.

## Updating

Upgrade deliberately, one library at a time:

```sh
curl -fL https://unpkg.com/i18next@<version>/dist/umd/i18next.min.js -o js/vendor/i18next.min.js
```

Then re-add the license header line, update the table above, run `npm run build`, and check the language switcher on a few pages before deploying.
