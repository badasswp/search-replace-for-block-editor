<?php
/**
 * Plugin Name: Search and Replace for Block Editor
 * Plugin URI:  https://github.com/badasswp/search-and-replace
 * Description: Search and Replace text within the Block Editor.
 * Version:     1.10.0
 * Author:      badasswp
 * Author URI:  https://github.com/badasswp
 * License:     GPL v2 or later
 * License URI: https://www.gnu.org/licenses/gpl-3.0.html
 * Text Domain: search-replace-for-block-editor
 * Domain Path: /languages
 *
 * @package SearchReplaceForBlockEditor
 */

namespace badasswp\SearchReplaceForBlockEditor;

if ( ! defined( 'WPINC' ) ) {
	die;
}

define( 'SRFBE_AUTOLOAD', __DIR__ . '/vendor/autoload.php' );

// Composer Check.
if ( ! file_exists( SRFBE_AUTOLOAD ) ) {
	add_action(
		'admin_notices',
		function () {
			vprintf(
				/* translators: Plugin directory path. */
				esc_html__( 'Fatal Error: Composer not setup in %s', 'search-replace-for-block-editor' ),
				[ __DIR__ ]
			);
		}
	);

	return;
}

// Run Plugin.
require_once SRFBE_AUTOLOAD;
( \SearchReplaceForBlockEditor\Plugin::get_instance() )->run();
