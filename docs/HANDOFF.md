# Handoff

## Current Goal

The SHIT VAULT shell is complete. The current feature focus is the `prevent-sleep` card, whose real product meaning is now a tray-based keepalive tool with mouse activity fallback, not a pure Windows power-management toggle.

## Completed

- Converted the project into a Windows desktop Tauri tray app.
- Added Tauri scripts and dependencies.
- Configured the app name, identifier, tray behavior, hidden startup, and bottom-right shell opening.
- Built a polished tray-first shell UI with left drawers, toolsets, cards, settings, and a Shit Vault info page.
- Refined transparent window corners, shell radius, shadows, and card controls.
- Added a desktop launch script and synced the desktop shortcut to the release exe.
- Localized tray menu items to Chinese.
- Cleaned registry typing, test encoding, `.gitignore` comments, and debug residue.
- Added documentation and README updates for the shell milestone.
- Added a native `prevent-sleep` module command path and inline module tests.

## Key Files

- `AGENTS.md` - future agent operating guide.
- `CONTEXT.md` - project glossary.
- `docs/PRD-prevent-sleep.md` - older PRD that should now be treated carefully because product meaning changed.
- `src-tauri/src/main.rs` - tray behavior, menu, window show/hide, position, Tauri command registration.
- `src-tauri/src/prevent_sleep.rs` - native keepalive runtime.
- `src/modules/prevent-sleep/PreventSleepCard.tsx` - keepalive card behavior and status polling.
- `src/modules/prevent-sleep/PreventSleepSettings.tsx` - inline keepalive threshold control.
- `src/app/registry/*` - module contract, validation, discovery.

## Important Decisions

- SHIT VAULT is a tray-first Windows desktop app.
- The shell is protected product infrastructure.
- Future features should be implemented as modules, not shell edits.
- The registry remains automatic via `import.meta.glob`.
- Real OS behavior must go through Tauri/Rust commands.
- Card switches should reflect real command success, not optimistic UI state.
- `prevent-sleep` is no longer just "prevent Windows sleep".
- For this product, `prevent-sleep` now means a keepalive card:
  - keyboard + mouse idle detection
  - current-screen bottom-left safe-point mouse action
  - double click and restore cursor
  - Windows execution-state API kept as a silent backup layer
- Normal running should stay visually quiet.
- Only degraded mode or true error should show short inline messaging.

## Open Issues

- The product name `prevent-sleep` and the actual semantics "keepalive / mouse activity fallback" are intentionally divergent and must be documented carefully.
- Real desktop QA is still important because safe-point double-click behavior depends on taskbar layout, icon density, scaling, and multi-monitor setups.
- The current module still needs continued scrutiny around accidental clicks, cursor feel, and timing edge cases when input resumes just before a pulse.
- App install/update flow is intentionally not finalized.
- Module persistence beyond current stores may need design once behavior is considered stable.

## Suggested Skills

- `grill-me` when pressure-testing product semantics and risky interaction design.
- `tdd` for module/runtime behavior work.
- `diagnose` if Windows cursor behavior or `SendInput` is inconsistent.
- `frontend-design` only if the user explicitly requests visual changes.

## Next Step Recommendation

Stabilize the `prevent-sleep` card around the agreed keepalive behavior:

- idle threshold controlled by slider with fixed ticks `1:30 / 2:30 / 3:30 / 5:00`
- current-screen bottom-left safe-point action with `48px` inset
- double click + cursor restore
- degrade silently into mouse-only keepalive if the Windows API backup fails
- show short inline text only for degrade/error states
- finish desktop QA before expanding to the next feature card
