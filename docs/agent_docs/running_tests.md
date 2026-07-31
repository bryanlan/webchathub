# Running Tests

## Primary Safe Checks
- `python3 -m json.tool crx-extracted/manifest.json >/dev/null` - validates manifest JSON syntax.
- `find crx-extracted -maxdepth 2 -type f -printf '%P\n' | sort` - lists the checked-in unpacked artifact files and reveals missing manifest-referenced files.
- `unzip -l Simple-Chat-Hub-2.0.0.crx.zip` - lists the outer packaged CRX archive without extracting or mutating the repo. This is only the first package check; it does not inspect the nested CRX payload.

## Targeted Static Checks
- Manifest references: compare `crx-extracted/manifest.json` paths to `find crx-extracted -maxdepth 2 -type f -printf '%P\n' | sort` before claiming the unpacked bundle is loadable.
- Permissions and host allowlist: inspect `crx-extracted/manifest.json` and confirm `host_permissions`, `permissions`, and `web_accessible_resources` remain intentionally scoped.
- Runtime allowlist guard: inspect `crx-extracted/assets/chunk-cdf2dc81.js` for the built-in app config plus `__ALLOW_HOSTS`, `__filterApps`, `__isAllowedUrl`, and `__installGuard`.
- UI/runtime imports: inspect `crx-extracted/assets/chunk-809f580f.js` as the UI/runtime bundle that imports `chunk-cdf2dc81.js` plus missing checked-in chunks including `chunk-936fa2ae.js` and `chunk-a783bd53.js`.
- Background registration: inspect `crx-extracted/assets/chunk-93671912.js` for dynamic rule registration, content-script registration, `/assets/index.ts-loader-7fda2deb.js`, and Claude main-world script handling.
- Content-script behavior: inspect `crx-extracted/assets/chunk-b76f4e26.js` for send/readiness/capture behavior and Claude helper injection requests.
- Claude helper: inspect `crx-extracted/assets/claude-main.js` for Claude-page-specific behavior.
- Nested CRX payload: parse `Simple-Chat-Hub-2.0.0.crx.zip` through the contained CRX payload before claiming package alignment. Check its nested `manifest.json`, permissions, host permissions, and asset names against `crx-extracted/`.
- Reference coverage: compare manifest resources, static JS imports, and dynamic script/resource path strings against the checked-in tree. Include manifest resources such as `assets/chunk-936fa2ae.js` and `assets/chunk-a783bd53.js`, static JS imports of those chunks, the dynamic `/assets/index.ts-loader-7fda2deb.js` registration from `chunk-93671912.js`, and hashed UI/support asset URLs referenced by `chunk-809f580f.js`.

## Manual Runtime Validation
Manual browser validation is required for behavior changes in compiled assets, permissions, capture flows, or UI behavior. Use Chrome or Edge extension developer mode.

The checked-in `crx-extracted/` directory is not currently a complete unpacked extension because manifest-referenced files such as `chatHub.html`, `service-worker-loader.js`, `img/*`, `assets/chunk-936fa2ae.js`, and `assets/chunk-a783bd53.js` are absent. It also lacks the dynamically registered `/assets/index.ts-loader-7fda2deb.js` and hashed UI/support assets referenced by `chunk-809f580f.js`, including the logo, donation QR, and prompt-intro files. Load a complete unpacked bundle when validating fork runtime behavior.

Do not use the packaged CRX as a substitute for fork runtime validation unless it is rebuilt or proven aligned. The current nested CRX is drifted: its manifest has broad `<all_urls>` host access, lacks `tabCapture` and `desktopCapture`, and omits `assets/claude-main.js`.

For Claude preview validation:
- Open Claude from the hub.
- Select the Claude tab in the browser capture prompt.
- Check that the preview stream, zoom, pan, and fit controls work.
- Confirm permission prompts and shared-tab state match the intended flow.

## Non-Tests
- Do not treat deploy, restore, migration, promotion, scheduler, production data, or external submission commands as tests for this repository.
- Do not broaden host permissions or bypass the allowlist to make a validation path pass.
- Do not use `diff -u crx-original/manifest.json crx-extracted/manifest.json` unless `crx-original/` exists in the checkout being tested.
- Do not treat `unzip -l Simple-Chat-Hub-2.0.0.crx.zip` as proof that the nested CRX runtime matches `crx-extracted/`.

## Known Gaps
- There is no root install/build/test toolchain in this repo.
- There is no automated browser suite in this repo.
- Static manifest and package checks do not prove extension UI, chatbot automation, or capture behavior works.
