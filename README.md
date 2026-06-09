# SHIT VAULT

SHIT VAULT is a Windows desktop tray app built with Tauri, React, TypeScript, Zustand, Vitest, and Rust.

The shell is now stable product infrastructure. The first fully landed module is `prevent-sleep`, which in product terms is a desktop keepalive tool rather than a literal sleep-toggle label.

## Current State

- Tray-first Windows desktop app.
- Starts hidden and opens from the tray.
- Tray menu is localized in Chinese.
- Main shell UI is fixed at `455 x 660`.
- Bottom-right popup shell with transparent rounded window styling.
- Left drawer navigation and card system are complete enough to protect.
- `prevent-sleep` is now fully wired to native Windows behavior.
- Installer packaging is enabled through Tauri NSIS bundling.

## Prevent Sleep

The `prevent-sleep` card is no longer a placeholder. It now runs a native Rust keepalive runtime through Tauri commands.

Current behavior:

- Default mode is `idle-keepalive`.
- Default idle activation threshold is `2 minutes 30 seconds`.
- Default repeat interval after activation is `5 seconds`.
- Idle detection uses both keyboard and mouse inactivity.
- Keepalive action uses the current screen and targets a bottom-left safe point with a `48px` inset.
- The keepalive action performs a double click when the idle condition is met.
- Continuous clicking mode is also supported.
- Continuous clicking is gated by a hotkey and defaults to `PgDn`.
- Press once to start continuous clicking, press again to stop.
- Moving the mouse also stops continuous clicking.
- Only one mode can be armed at a time.
- Settings are locked while the card is enabled.
- Windows execution-state API is used as a silent backup layer.
- The card only shows inline text for real error or degraded states.

## Distribution

Runnable desktop executable:

```text
src-tauri/target/release/shit-vault.exe
```

NSIS installer:

```text
src-tauri/target/release/bundle/nsis/SHIT VAULT_0.1.0_x64-setup.exe
```

Helper launch script:

```text
launch-shit-vault.cmd
```

## Documentation

- [Agent operating guide](AGENTS.md)
- [Glossary](CONTEXT.md)
- [Handoff](docs/HANDOFF.md)
- [Prevent Sleep PRD](docs/PRD-prevent-sleep.md)

## Tech Stack

- React 18
- TypeScript
- Vite
- Zustand
- Vitest
- Tauri 2
- Rust

## Quick Start

Install dependencies:

```bash
npm install
```

Run frontend dev server:

```bash
npm run dev
```

Run tests:

```bash
npm test
```

Build frontend:

```bash
npm run build
```

Run Tauri dev app:

```bash
npm run tauri:dev
```

Build a runnable exe without installer bundling:

```bash
npm run tauri:build-exe
```

Build the NSIS installer:

```bash
npm run tauri:build
```

If `cargo` is not available in the current PowerShell session:

```powershell
$env:PATH = "$env:USERPROFILE\.cargo\bin;$env:PATH"
```

## Project Structure

```text
src/
  app/
    shell/
    registry/
    layout/
    state/
    hooks/
    ui/
  modules/
    auto-mixing/
    prevent-sleep/
src-tauri/
  src/
    main.rs
docs/
```

## Module Contract

Every module exports a `ModuleDefinition` from `module.ts`:

- `manifest`
- `CardComponent`
- `SettingsComponent`
- `defaultState`
- `defaultSettings`

The shell discovers modules automatically. Adding a normal module should not require editing `AppShell`, `DashboardPage`, or tray code.

## Development Rules

- Keep shell code stable.
- Put feature behavior inside modules and Tauri commands.
- Keep module state separate from module settings.
- Update card enabled state only after real command success.
- Show concise error feedback when a native command fails.
- Preserve the shared `CardFrame` visual language.

## Verification

Recommended checks before commit:

```bash
npm test
npm run build
cargo check --manifest-path src-tauri/Cargo.toml
npm run tauri:build-exe
git diff --check
```

## Next Focus

With the shell and `prevent-sleep` module landed, the next work should shift to the remaining cards and deeper desktop QA around real-world monitor layouts, scaling, tray behavior, and long-running native module reliability.
