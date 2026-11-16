# Lighthouse audits

Audit a production build with Lighthouse 13.5.0. Install Chrome or set
`CHROME_PATH` to an existing Chromium executable. The script runs Lighthouse
through `npx` and adds no dependency to the site.

Build and serve the site first, then run the audit from `projects/website`:

```sh
bun run build
bun run start -p 3008
LIGHTHOUSE_OUTPUT_DIR=/tmp/anda-before bun run lighthouse
```

The default route set is `/nl`, `/nl/boodschap`, `/nl/pilaren`, `/nl/diepte`,
`/nl/ands`, `/nl/boek`, `/nl/contact` and `/en`. Pass routes to audit others:

```sh
bun run lighthouse /tr /nl/statuten
```

Never audit `/`: it answers 307 to a locale chosen from `Accept-Language`, so
its score would belong to the destination. Reports and `summary.json` keep both
the requested and the final URL. A redirected route gets no summary scores and
the script exits unsuccessfully, while the destination's raw report is kept for
diagnosis.

Run before and after audits one after the other on the same machine and Chrome
version, with no concurrent builds or test runs, and keep the base URL, route
list and device configuration the same. The default is mobile; set
`LIGHTHOUSE_FORM_FACTOR=desktop` for desktop. `LIGHTHOUSE_BASE_URL` (default
`http://localhost:3008`) points the audit at another server, and
`LIGHTHOUSE_CHROME_FLAGS` overrides `--headless` when the local Chrome needs
more flags. Each summary row also records the total transferred bytes
(`totalByteWeight`), which varies far less between runs than the timings.
