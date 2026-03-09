<?php
/**
 * Options Class.
 *
 * This class is responsible for holding the Admin
 * page options.
 *
 * @package SearchReplaceForBlockEditor
 */

namespace SearchReplaceForBlockEditor\Admin;

class Options {
	/**
	 * The Form.
	 *
	 * This array defines every single aspect of the
	 * Form displayed on the Admin options page.
	 *
	 * @since 1.0.0
	 */
	public static array $form;

	/**
	 * Define custom static method for calling
	 * dynamic methods for e.g. Options::get_page_title().
	 *
	 * @since 1.0.0
	 *
	 * @param string  $method Method name.
	 * @param mixed[] $args   Method args.
	 *
	 * @return string|mixed[]
	 */
	public static function __callStatic( $method, $args ) {
		static::init();

		$keys = substr( $method, strpos( $method, '_' ) + 1 );
		$keys = explode( '_', $keys );

		$value = '';

		foreach ( $keys as $key ) {
			$value = empty( $value ) ? ( static::$form[ $key ] ?? '' ) : ( $value[ $key ] ?? '' );
		}

		return $value;
	}

	/**
	 * Set up Form.
	 *
	 * @since 1.0.0
	 *
	 * @return void
	 */
	public static function init(): void {
		static::$form = [
			'page'   => static::get_form_page(),
			'notice' => static::get_form_notice(),
			'fields' => static::get_form_fields(),
			'submit' => static::get_form_submit(),
		];
	}

	/**
	 * Form Page.
	 *
	 * The Form page items containg the Page title,
	 * summary, slug and option name.
	 *
	 * @since 1.0.0
	 *
	 * @return mixed[]
	 */
	public static function get_form_page(): array {
		return [
			'title'   => esc_html__(
				'Search & Replace for Block Editor',
				'search-replace-for-block-editor'
			),
			'summary' => esc_html__(
				'Search and replace text within the Block Editor.',
				'search-replace-for-block-editor'
			),
			'slug'    => 'search-replace-for-block-editor',
			'option'  => 'search_replace_for_block_editor',
		];
	}

	/**
	 * Form Submit.
	 *
	 * The Form submit items containing the heading,
	 * button name & label and nonce params.
	 *
	 * @since 1.0.0
	 *
	 * @return mixed[]
	 */
	public static function get_form_submit(): array {
		return [
			'heading' => esc_html__( 'Actions', 'search-replace-for-block-editor' ),
			'button'  => [
				'name'  => 'search_replace_for_block_editor_save_settings',
				'label' => esc_html__( 'Save Changes', 'search-replace-for-block-editor' ),
			],
			'nonce'   => [
				'name'   => 'search_replace_for_block_editor_settings_nonce',
				'action' => 'search_replace_for_block_editor_settings_action',
			],
		];
	}

	/**
	 * Form Fields.
	 *
	 * The Form field items containing the heading for
	 * each group block and controls.
	 *
	 * @since 1.0.0
	 *
	 * @return mixed[]
	 */
	public static function get_form_fields() {
		return [
			'general_options' => [
				'heading'  => esc_html__( 'General Options', 'search-replace-for-block-editor' ),
				'controls' => [
					'case_matching'  => [
						'control' => esc_attr( 'checkbox' ),
						'label'   => esc_html__( 'Case Matching', 'search-replace-for-block-editor' ),
						'summary' => esc_html__( 'Enable Case Matching toggle by default.', 'search-replace-for-block-editor' ),
					],
					'regex_matching' => [
						'control' => esc_attr( 'checkbox' ),
						'label'   => esc_html__( 'Regex Matching', 'search-replace-for-block-editor' ),
						'summary' => esc_html__( 'Enable Regex Matching toggle by default.', 'search-replace-for-block-editor' ),
					],
					'save_post'      => [
						'control' => esc_attr( 'checkbox' ),
						'label'   => esc_html__( 'Save Post', 'search-replace-for-block-editor' ),
						'summary' => esc_html__( 'Perform save after search & replace is completed.', 'search-replace-for-block-editor' ),
					],
					'close_modal'    => [
						'control' => esc_attr( 'checkbox' ),
						'label'   => esc_html__( 'Close Modal', 'search-replace-for-block-editor' ),
						'summary' => esc_html__( 'Close modal after search & replace is completed.', 'search-replace-for-block-editor' ),
					],
					'use_shortcut'   => [
						'control' => esc_attr( 'checkbox' ),
						'label'   => esc_html__( 'Use Shortcut', 'search-replace-for-block-editor' ),
						'summary' => esc_html__( 'Enable Shortcut (CMD + F).', 'search-replace-for-block-editor' ),
					],
				],
			],
		];
	}

	/**
	 * Form Notice.
	 *
	 * The Form notice containing the notice
	 * text displayed on save.
	 *
	 * @since 1.0.0
	 *
	 * @return mixed[]
	 */
	public static function get_form_notice() {
		return [
			'label' => esc_html__( 'Settings Saved.', 'search-replace-for-block-editor' ),
		];
	}
}
