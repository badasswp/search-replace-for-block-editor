=== Search and Replace for Block Editor ===
Contributors: badasswp, rajanand346, jargovi
Tags: search, replace, text, block, editor.
Requires at least: 6.0
Tested up to: 6.9
Stable tag: 1.10.0
Requires PHP: 7.4
License: GPLv2 or later
License URI: http://www.gnu.org/licenses/gpl-2.0.html

Search and Replace text within the WordPress Block Editor just like Microsoft Word or Google Docs. It's super fast, easy & just works!

== Installation ==

1. Go to 'Plugins > Add New' on your WordPress admin dashboard.
2. Search for 'Search and Replace for Block Editor' plugin from the official WordPress plugin repository.
3. Click 'Install Now' and then 'Activate'.
4. Create a new Post or Open an existing Post.
5. You should now see the 'Search and Replace' icon at the top left.

== Description ==

This plugin brings the familiar Search and Replace functionality that PC users have grown accustomed to in <strong>Microsoft Word</strong> and <strong>Google Docs</strong> to the Block Editor.

Now you can easily search and replace text right in the Block Editor. Its easy and does exactly what it says. You can also match the text case using the 'Match Case | Expression' toggle.

= ✔️ Features =

Our plugin comes with everything you need to find and replace text quicker and more efficiently.

✔️ <strong>Search & Replace</strong> text, typos, keywords faster.
✔️ <strong>Shortcut Keys</strong> - CMD + SHIFT + F.
✔️ <strong>Match Case</strong> Sensitivity.
✔️ <strong>Custom Hooks</strong> to help you customize plugin behaviour.
✔️ Available in <strong>mutiple langauges</strong> such as Arabic, Chinese, Hebrew, Hindi, Russian, German, Italian, Croatian, Spanish & French languages.
✔️ <strong>Backward compatible</strong>, works with most WP versions.

= ✨ Getting Started =

Create a new Post or open an existing Post. Locate the 'Search and Replace' icon at the <strong>top left</strong> corner of the Block Editor and click on it. Proceed to type in the text you wish to replace and click on 'Replace'.

You can get a taste of how this works, by using the [demo](https://tastewp.com/create/NMS/8.0/6.7.0/search-replace-for-block-editor/twentytwentythree?ni=true&origin=wp) link.

= ⚡ Shortcut Keys & Text Selection =

To quickly access the Search and Replace modal, press <strong>CTRL + SHIFT + F</strong>. This will fire up the dialog box where you can quickly change things.

You can also <strong>select text</strong> on your Block Editor and <strong>use the Shortcut</strong>. This will grab the text you have selected and fire up your dialog box with the text already typed into it. This makes working with the Search and Replace tool faster.

= 🔌🎨 Plug and Play or Customize =

The Search & Replace for Block Editor plugin is built to work right out of the box. Simply install, activate and start using.

Want to add your personal touch? All of our documentation can be found [here](https://github.com/badasswp/search-and-replace). You can override the plugin's behaviour with custom logic of your own using [hooks](https://github.com/badasswp/search-and-replace?tab=readme-ov-file#hooks).

== Screenshots ==

1. Search & Replace for Block Editor icon - Locate the top left of the Block Editor.
2. Search & Replace for Block Editor modal - Search and Replace text in the Block Editor.
3. Match Case in Search & Replace - Now you can match the case of the text and Search and Replace.
4. Search & Replace icon in Toolbar - For a faster workflow you can use the toolbar icon in the Toolbar.
5. Search & Replace Toolbar icon in action - Make changes a lot quicker and get more done in less time.

== Changelog ==

= 1.10.0 =
* Feat: Add toggle for Regex expression matching.
* Feat: Add Plugin options page.
* Feat: Add Shortcut command (CMD + F).
* Feat: Add custom hooks: `afterSearchReplace`, `excludedPostTypes`, `regexPattern`.
* Test: Add e2e tests for plugin codebase.
* Tested up to WP 6.9.

= 1.9.0 =
* Feat: Use Composer setup for plugin.
* Tested up to WP 6.9.

= 1.8.0 =
* Feat: Add Search & Replace feature for table head, foot & caption.
* Fix: Reset `Replace` input field.
* Tested up to WP 6.8.

= 1.7.0 =
* Fix: Issue with rich content replacement (HTML bearing string).
* Feat: On Modal open, show items found for Highlighted text.
* Fix: Console warnings & errors.
* Tested up to WP 6.8.

= 1.6.0 =
* Feat: Add search and replace functionality for __Table Block__.
* Feat: Add new custom hook `search-replace-for-block-editor.handleAttributeReplacement`.
* Docs: Update README docs.
* Tested up to WP 6.8.

= 1.5.0 =
* Fix: Missing icon due to recent WP 6.8 upgrade.
* Feat: Add local WP dev env.
* Chore: Update Plugin contributors list.
* Update README docs.
* Tested up to WP 6.7.2.

= 1.4.0 =
* Feat: Add search icon to Toolbar.
* Feat: Add new custom hook `search-replace-for-block-editor.replaceBlockAttribute`.
* Chore: Enforce WP linting across plugin.
* Test: Improve unit tests cases.
* Refactor: Search & Replace core logic to use `replaceBlockAttribute` hook.
* Tested up to WP 6.7.2.

= 1.3.0 =
* Feat: Add Search count feature.
* Tested up to WP 6.7.2.

= 1.2.3 =
* Fix: Crashing Gutenberg Block Editor on Toggle Block Inserter.
* Tested up to WP 6.7.2.

= 1.2.2 =
* Fix style issues for WP 6.6.2.
* Fix timeout issues causing Icon not to load.
* Fix backward compatibility issues due to WP upgrade.
* Apply coding standards.
* Update README notes.
* Tested up to WP 6.7.1.

= 1.2.1 =
* Fix in modal selection issue.
* Fix missing tooltip component.
* Fix block editor selection issue due to iframe.
* Update README notes.
* Tested up to WP 6.7.1.

= 1.2.0 =
* Fix WP upgrade 6.7 issues.
* Add text selection shortcut functionality.
* Update README notes.
* Tested up to WP 6.7.0.

= 1.1.1 =
* Update README notes.
* Update asset icons & screenshots.
* Tested up to WP 6.6.2.

= 1.1.0 =
* Feat: Case Sensitive toggle.
* Update asset images and screenshots.
* Fix Bugs and Linting issues.
* Update README.txt file.
* Update Translation files.
* Tested up to WP 6.6.2.

= 1.0.4 =
* Update README.txt file.

= 1.0.3 =
* Implement Build Workflow
* Replace `mt_rand` with `string` for asset enqueuing.
* Fix Bugs and Linting issues.
* Tested up to WP 6.6.1.

= 1.0.2 =
* Fix styling issues observed on search icon.
* Implement case sensitivity feature for search and replace.
* Add custom hook - `search-replace-for-block-editor.caseSensitive`.
* Load assets via plugin directory URL.
* Address bugs and linting issues.
* Tested up to WP 6.6.1.

= 1.0.1 =
* Handle edge cases with quote, pullquote & details block.
* Add custom hook - `search-replace-for-block-editor.keyboardShortcut`.
* Fix Bugs & linting issues.
* Updated Unit Tests & README notes.
* Tested up to WP 6.6.

= 1.0.0 =
* Ability to Search & Replace text within the Block Editor.
* Custom Hooks - `search-replace-for-block-editor.allowedBlocks`.
* Provided support for Arabic, Chinese, Hebrew, Hindi, Russian, German, Italian, Croatian, Spanish & French languages.
* Unit Tests coverage.
* Tested up to WP 6.5.5.

== Contribute ==

If you'd like to contribute to the development of this plugin, you can find it on [GitHub](https://github.com/badasswp/search-and-replace).

To build, clone repo and run `npm install && npm run build`
