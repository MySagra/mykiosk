# MySagra Kiosk

Start page for the laptop running in kiosk mode: large buttons to the MySagra
apps (MyAmministratore, MyCassa, MyNumeri, MyComanda), with a clock and the
status of each app (green = online, red = not responding).

- Next.js 16 (App Router), Tailwind 4, shadcn/ui, lucide: the same stack as the other MySagra apps.
- Works **without internet**: fonts are bundled in the image, no CDN.
- **One image** for on-site and cloud: everything is configured through
  environment variables when the container starts, no rebuild needed.
- App status is checked **by the server** (`GET /api/health`), so there are no
  CORS issues. Offline apps are dimmed but stay clickable.

## Environment variables

| Variable               | Default   | Description                                              |
| ---------------------- | --------- | -------------------------------------------------------- |
| `MYAMMINISTRATORE_URL` | —         | MyAmministratore URL. Empty = button hidden              |
| `MYCASSA_URL`          | —         | MyCassa URL                                              |
| `MYNUMERI_URL`         | —         | MyNumeri URL                                             |
| `MYCOMANDA_URL`        | —         | MyComanda URL                                            |
| `KIOSK_TITLE`          | `MySagra` | Title at the top                                         |
| `KIOSK_CHECK_INTERVAL` | `15`      | Seconds between status checks; `0` = disabled            |

URLs must be complete (`http://` or `https://`). If a value is invalid the
container stops immediately and the log says which variable to fix.

For `https` URLs signed by the local CA, mount `rootCA.pem` and set
`NODE_EXTRA_CA_CERTS=/app/rootCA.pem` (already done in `docker-compose.yml`),
otherwise the status check marks the app as offline.

### Adding an app

Add an entry to [`lib/apps.ts`](lib/apps.ts) (id, name, environment variable,
lucide icon, color) and its description to
[`lib/i18n/locales`](lib/i18n/locales) (`it.ts` and `en.ts`: TypeScript flags
a missing one), then rebuild the image. The button appears once the new
variable is set.

## Language

Italian and English, like the other MySagra apps (i18next). Switch with the
**IT / EN** buttons in the bottom-right corner; the choice is saved in the
kiosk browser (`localStorage`, key `app_lang`). The title comes from the
`KIOSK_TITLE` environment variable and is not translated.

## Running on-site

On the MySagra server (`192.168.50.100`):

```bash
cp .env.example .env        # on-site URLs are already filled in
cp /path/to/rootCA.pem .    # the same one MyCassa/MyNumeri mount, if the apps use https
docker compose up -d --build
```

The kiosk is served at `http://192.168.50.100:3036`. To change buttons or
title, edit `.env` and run `docker compose up -d` (no rebuild).

## Running in the cloud

Same image, different variables only (see the cloud example in
`.env.example`):

```bash
docker run -d --name mykiosk -p 3036:3036 \
  -e MYCASSA_URL=https://cassa.yoursagra.example \
  -e MYNUMERI_URL=https://numeri.yoursagra.example \
  mysagra-mykiosk:local
```

Put it behind the reverse proxy like the other apps.

## CI and Docker image

- **CI** ([`.github/workflows/ci.yml`](.github/workflows/ci.yml)): on every push
  and pull request to `main` it runs lint, type check and build.
- **Publish** ([`.github/workflows/publish.yml`](.github/workflows/publish.yml)):
  on every published GitHub release (or manually) it builds the image for
  `linux/amd64` and `linux/arm64` and pushes it to
  `ghcr.io/mysagra/mysagra-mykiosk`, tagged with the release version and
  `latest`. The version is shown in the container startup log.

To use the published image instead of building locally, set in
`docker-compose.yml`:

```yaml
image: ghcr.io/mysagra/mysagra-mykiosk:latest
```

and remove the `build:` section.

## Development

```bash
npm install
MYCASSA_URL=http://localhost:3031 npm run dev   # http://localhost:3036
```

## Kiosk homepage

On the laptop (Debian + cage), open the browser in kiosk mode on the kiosk
URL, for example in the service or script that starts cage:

```bash
cage -- chromium --kiosk --noerrdialogs --disable-translate --no-first-run http://192.168.50.100:3036
```

or with Firefox:

```bash
cage -- firefox --kiosk http://192.168.50.100:3036
```

Apps open in the same window and the kiosk has no address bar or back button:
to return to the landing page you need a link in the app, the `Alt+←`
shortcut, or a browser restart.
