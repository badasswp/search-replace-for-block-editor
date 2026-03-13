# Changelog

## 1.10.0
* Feat: Added translation languages for `Japanese`,`Indonesian`, `Turkish`, `Polish`, `Dutch`, `Brazil` and `Portuguese`.
* Feat: Add toggle for Regex expression matching.
* Feat: Add Plugin options page.
* Feat: Add Shortcut command (CMD + F).
* Feat: Add custom hooks: `afterSearchReplace`, `excludedPostTypes`, `regexPattern`.
* Refactor: Use `replaceInput` in place of repeated instances of `text`.
* Test: Add e2e tests for plugin codebase.
* Tested up to WP 6.9.

## 1.9.0
* Feat: Use Composer setup for plugin.
* Tested up to WP 6.9.

## 1.8.0
* Feat: Add Search & Replace feature for table head, foot & caption.
* Fix: Reset `Replace` input field.
* Tested up to WP 6.8.

## 1.7.0
* Fix: Issue with rich content replacement (HTML bearing string).
* Feat: On Modal open, show items found for Highlighted text.
* Fix: Console warnings & errors.
* Tested up to WP 6.8.

## 1.6.0
* Feat: Add search and replace functionality for __Table Block__.
* Feat: Add new custom hook `search-replace-for-block-editor.handleAttributeReplacement`.
* Docs: Update README docs.
* Tested up to WP 6.8.

## 1.5.0
* Fix: Missing icon due to recent WP 6.8 upgrade.
* Feat: Add local WP dev env.
* Chore: Update Plugin contributors list.
* Update README docs.
* Tested up to WP 6.7.2.

## 1.4.0
* Feat: Add search icon to Toolbar.
* Feat: Add new custom hook `search-replace-for-block-editor.replaceBlockAttribute`.
* Chore: Enforce WP linting across plugin.
* Test: Improve unit tests cases.
* Refactor: Search & Replace core logic to use `replaceBlockAttribute` hook.
* Tested up to WP 6.7.2.

## 1.3.0
* Feat: Add Search count feature.
* Tested up to WP 6.7.2.

## 1.2.3
* Fix: Crashing Gutenberg Block Editor on Toggle Block Inserter.
* Tested up to WP 6.7.1.

## 1.2.2
* Fix style issues for WP 6.6.2.
* Fix timeout issues causing Icon not to load.
* Fix backward compatibility issues due to WP upgrade.
* Apply coding standards.
* Update README notes.
* Tested up to WP 6.7.1.

## 1.2.1
* Fix in modal selection issue.
* Fix missing tooltip component.
* Fix block editor selection issue due to iframe.
* Update README notes.
* Tested up to WP 6.7.1.

## 1.2.0
* Fix WP upgrade 6.7 issues.
* Add text selection shortcut functionality.
* Update README notes.
* Tested up to WP 6.7.0.

## 1.1.1
* Update README notes.
* Update asset icons & screenshots.
* Tested up to WP 6.6.2.

## 1.1.0
* Feat: Case Sensitive checkbox.
* Update asset images and screenshots.
* Fix Bugs and Linting issues.
* Update README.txt file.
* Update Translation files.
* Tested up to WP 6.6.2.

## 1.0.4
* Update README.txt file.

## 1.0.3
* Implement Build Workflow
* Replace `mt_rand` with `string` for asset enqueuing.
* Fix Bugs and Linting issues.
* Tested up to WP 6.6.1.

## 1.0.2
* Fix styling issues observed on search icon.
* Implement case sensitivity feature for search and replace.
* Add custom hook - `search-replace-for-block-editor.caseSensitive`.
* Load assets via plugin directory URL.
* Address bugs and linting issues.
* Tested up to WP 6.6.1.

## 1.0.1
* Handle edge cases with quote, pullquote & details block.
* Add custom hook - `search-replace-for-block-editor.keyboardShortcut`.
* Fix Bugs & linting issues.
* Updated Unit Tests & README notes.
* Tested up to WP 6.6.

## 1.0.0 (Initial Release)
* Ability to Search & Replace text within the Block Editor.
* Custom Hooks - `search-replace-for-block-editor.allowedBlocks`.
* Provided support for Arabic, Chinese, Hebrew, Hindi, Russian, German, Italian, Croatian, Spanish & French languages.
* Unit Tests coverage.
* Tested up to WP 6.5.5.
