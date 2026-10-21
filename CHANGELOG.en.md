# Changelog

[简体中文](CHANGELOG.md) | [English](CHANGELOG.en.md)

Based on the currently visible Git history. Unreleased entries do not indicate a production deployment or a published GitHub Release.

## Unreleased

### Added

- Configurable Google AdSense, account verification meta tag and dynamic `ads.txt`; homepage, article top/bottom and draggable widget placements.
- Advertising disabled by default, no live ads in previews, validated publisher IDs and an operator consent-management confirmation before enabling.
- Chinese/English privacy information, editable additions and a contact email.
- Bilingual contribution/security guidance, issue and PR templates, maintenance procedures, first-release draft and a CI workflow.

### Compatibility

- Advertising uses the existing settings JSON; no new database tables. Older settings default to ads disabled, while older clients preserve saved advertising settings when updating other fields.
- `/privacy/` and `/ads.txt` are reserved system routes.

## 2026-10-21

- `695bc70`: align header search and language controls.
- `4dbbcb2`: Chinese/English interfaces and documentation.
- `3086005`: common public blog imports and persistent article sidebars.
- `81131c0`: batch imports with optional categories.
- `823be74`: homepage featured covers use their natural aspect ratio.
- `1d5bf6d`, `3525d21`: imported metadata, locally hosted images and home navigation fixes.

## 2026-10-20

- `f5d13d9`, `e293182`: permanent trash deletion and empty-site defaults.
- `83a2309`: initial commit in the current public history, including blogging, article imports and video resources.

Development preceding the history reset is not counted here; no historical releases have been invented.
