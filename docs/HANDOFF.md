# Handoff

## Current Goal

SHIT VAULT main shell is complete enough to protect. The first real module, `prevent-sleep`, is now landed end-to-end and the project has also been packaged for desktop distribution with a GitHub Release.

The next session should treat the shell as stable infrastructure and focus on either:

- deeper desktop QA for the landed `prevent-sleep` module, or
- building the next real module card on top of the existing module contract.

## Current Status

- Branch: `main`
- Latest pushed commit: `dc8d76a` - `Add installer packaging and update prevent sleep docs`
- Previous major feature commit: `f8aecb5` - `Refine prevent sleep module and card controls`
- GitHub Release: `v0.1.0`
- Release page: `https://github.com/Dave-oioioi/SHIT/releases/tag/v0.1.0`

## Completed

- Converted the project into a Windows desktop Tauri tray app.
- Locked the product into a tray-first flow:
  - app starts hidden
  - opens from tray
  - hides instead of behaving like a normal desktop window
- Built and polished the shell UI:
  - left drawer navigation
  - protected shared `CardFrame`
  - bottom-right popup shell presentation
  - transparent rounded window treatment
  - tightened control styling and visual consistency
- Localized tray menu items to Chinese.
- Added a working native `prevent-sleep` runtime in Rust.
- Wired the `prevent-sleep` card to real Tauri commands.
- Implemented mode-locked settings behavior while the card is enabled.
- Packaged the app as:
  - runnable release exe
  - NSIS installer
- Published GitHub Release `v0.1.0` with installer asset attached.
- Updated `README.md` to reflect the actual landed feature set.

## Prevent Sleep: Real Product Meaning

`prevent-sleep` is now a keepalive / mouse activity module, not a pure literal system sleep toggle.

Current implemented behavior:

- Default mode is `idle-keepalive`.
- Default idle activation threshold is `150s`.
- Default idle repeat interval is `5s`.
- Idle detection uses both keyboard and mouse input.
- Keepalive targets the current monitor.
- Safe click position is the bottom-left work area with `48px` inset.
- Idle keepalive performs a double-click pulse when triggered.
- Continuous clicking mode is also supported.
- Continuous mode is hotkey-gated and defaults to `PgDn`.
- Press once to start continuous clicking.
- Press again to stop.
- Moving the mouse also stops continuous clicking.
- Only one mode can be armed at a time.
- Settings are disabled while the module is enabled.
- Windows execution-state API is used as a hidden fallback layer.
- Inline UI text should appear only for real error or degraded states.

## Distribution State

Release executable:

- `src-tauri/target/release/shit-vault.exe`

Installer:

- `src-tauri/target/release/bundle/nsis/SHIT VAULT_0.1.0_x64-setup.exe`

Published release asset:

- `https://github.com/Dave-oioioi/SHIT/releases/download/v0.1.0/SHIT.VAULT_0.1.0_x64-setup.exe`

Important note:

- `src-tauri/tauri.conf.json` now explicitly enables bundling with NSIS through:
  - `bundle.active = true`
  - `bundle.targets = "nsis"`

## Key Files

- `AGENTS.md`
  - project operating rules and non-negotiables
- `README.md`
  - current product and distribution overview
- `docs/PRD-prevent-sleep.md`
  - older PRD; still useful for context but now partially outdated in semantics
- `src-tauri/src/main.rs`
  - tray behavior, window show/hide, menu, command registration
- `src-tauri/src/prevent_sleep.rs`
  - native keepalive runtime and Windows input behavior
- `src-tauri/tauri.conf.json`
  - app name, window config, installer bundling
- `src/app/ui/CardFrame.tsx`
  - shared card control UI
- `src/styles.css`
  - shared shell and card styling, including unified control language
- `src/modules/prevent-sleep/PreventSleepCard.tsx`
  - command invocation, status polling, runtime feedback
- `src/modules/prevent-sleep/PreventSleepSettings.tsx`
  - keepalive mode and timing settings UI
- `src/modules/prevent-sleep/defaults.ts`
  - default runtime state and default user settings

## Important Decisions

- Shell code is protected infrastructure. Do not redesign it casually.
- New feature behavior should be implemented as modules, not shell edits.
- Native desktop behavior must live behind Tauri/Rust commands.
- Card switches should only reflect actual native command success.
- Shared card interaction language should stay centralized in `CardFrame` and shared styles.
- `prevent-sleep` and its real keepalive semantics are intentionally divergent in naming; document this carefully when expanding the product.
- Installer flow is now active and valid for distribution.

## Open Issues / Risks

- Real-world QA is still important for `prevent-sleep` because current-monitor safe clicking can feel different across:
  - taskbar layouts
  - display scaling
  - multi-monitor arrangements
  - icon-dense desktop setups
- Continuous clicking should keep receiving desktop QA attention to confirm:
  - stop on mouse movement feels correct
  - hotkey toggle never sticks
  - long-running sessions stay stable
- Some older docs still describe an earlier meaning of `prevent-sleep`; treat them carefully and update them when they become blocking.
- The next module work should avoid leaking module-specific behavior back into shell code.

## Suggested Skills

- `grill-me`
  - for pressure-testing product semantics and future module behavior
- `tdd`
  - for module/runtime interaction changes
- `diagnose`
  - if Windows cursor behavior, `SendInput`, or timing becomes inconsistent
- `frontend-design`
  - only when the user explicitly requests more shell/card visual work
- `ui-ux-pro-max`
  - when card interaction quality or settings clarity needs another pass

## Next Step Recommendation

Pick one of these two paths:

1. Desktop QA pass for `prevent-sleep`
   - verify idle keepalive across multi-monitor and scaling setups
   - verify continuous mode start/stop reliability
   - verify no accidental corner-click side effects in real usage

2. Start the next module card
   - keep the shell untouched
   - follow the existing module contract
   - mirror the same React -> Tauri -> Rust pattern if OS behavior is needed
