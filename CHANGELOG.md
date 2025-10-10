# Changelog

All notable changes to this project will be documented in this file.

This changelog summarizes the most significant updates for each major revision. For example, the `V0.4` entry covers all changes within the `0.4.x` series.

---

## V0.5
### Added
- Expanded ad-blocking on the **Video** page to cover more promotion types.
- Expanded content blocking to the **floor card** recommendations on the **Main** Page.

### Fixed
- Fixed a database write race condition that occurred when opening multiple Bilibili tabs. For simplicity and to ensure data is always up-to-date, the script now only writes to the database after checking for content changes, avoiding the use of timestamps or locks.

### Changed
- Replaced the inefficient periodic scan (`setInterval`) with a modern `MutationObserver` for vastly improved performance and responsiveness.

---

## V0.4
### Added
- A local blacklist cache, which is used as a fallback when the Bilibili API is unreachable.

### Fixed
- Critical bugs on the **Video** page by safely hiding content (`card.style.display = 'none'`) instead of removing it, which prevents conflicts with Bilibili's scripts.

### Changed
- Refined console output by hiding repetitive debug messages and preventing repeated warnings for a cleaner user experience.

---

## V0.3
### Added
- Support for hiding promotions and ads on the **Main Page**.

### Removed
- Temporarily disabled ad-blocking on the **Video** page due to bugs.

---

## V0.2
### Added
- Support for hiding content on the **Video** page.
- Implemented periodic scanning to handle dynamically loaded content (AJAX).

---

## V0.1
### Added
- Initial release.
- Support for hiding content on the **Main page**, **Popular**, and **Rank** pages.