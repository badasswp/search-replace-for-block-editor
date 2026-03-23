<?php

namespace SearchReplaceForBlockEditor\Tests\Admin;

use WP_Mock;
use Mockery;
use Badasswp\WPMockTC\WPMockTestCase;

use SearchReplaceForBlockEditor\Admin\Options;

/**
 * @covers \SearchReplaceForBlockEditor\Admin\Options::get_form_page
 * @covers \SearchReplaceForBlockEditor\Admin\Options::get_form_submit
 * @covers \SearchReplaceForBlockEditor\Admin\Options::get_form_notice
 * @covers \SearchReplaceForBlockEditor\Admin\Options::get_form_fields
 */
class OptionsTest extends WPMockTestCase {
	public $providers;

	public function setUp(): void {
		parent::setUp();
	}

	public function tearDown(): void {
		parent::tearDown();
	}

	public function test_get_form_page() {
		$form_page = Options::get_form_page();

		$this->assertSame(
			$form_page,
			[
				'title'   => 'Search & Replace for Block Editor',
				'summary' => 'Search and replace text within the Block Editor.',
				'slug'    => 'search-replace-for-block-editor',
				'option'  => 'search_replace_for_block_editor',
			]
		);
	}

	public function test_get_form_submit() {
		$form_submit = Options::get_form_submit();

		$this->assertSame(
			$form_submit,
			[
				'heading' => 'Actions',
				'button'  => [
					'name'  => 'search_replace_for_block_editor_save_settings',
					'label' => 'Save Changes',
				],
				'nonce'   => [
					'name'   => 'search_replace_for_block_editor_settings_nonce',
					'action' => 'search_replace_for_block_editor_settings_action',
				],
			]
		);
	}

	public function test_get_form_fields() {
		$form_fields = Options::get_form_fields();

		$this->assertSame(
			$form_fields,
			[
				'toggle_options' => [
					'heading'  => 'Toggle Options',
					'controls' => [
						'case_matching'  => [
							'control' => 'checkbox',
							'label'   => 'Case Matching',
							'summary' => 'Enable Case Matching toggle by default.',
						],
						'regex_matching' => [
							'control' => 'checkbox',
							'label'   => 'Regex Matching',
							'summary' => 'Enable Regex Matching toggle by default.',
						],
					],
				],
				'other_options'  => [
					'heading'  => 'Other Options',
					'controls' => [
						'save_post'    => [
							'control' => 'checkbox',
							'label'   => 'Save Post',
							'summary' => 'Perform save after search & replace is completed.',
						],
						'close_modal'  => [
							'control' => 'checkbox',
							'label'   => 'Close Modal',
							'summary' => 'Close modal after search & replace is completed.',
						],
						'use_shortcut' => [
							'control' => 'checkbox',
							'label'   => 'Use Shortcut',
							'summary' => 'Enable Shortcut (CMD + F).',
						],
					],
				],
			]
		);
	}

	public function test_get_form_notice() {
		$form_notice = Options::get_form_notice();

		$this->assertSame(
			$form_notice,
			[
				'label' => 'Settings Saved.',
			]
		);
	}
}
