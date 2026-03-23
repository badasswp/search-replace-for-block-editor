<?php

namespace SearchReplaceForBlockEditor\Tests\Services;

use WP_Mock;
use Mockery;
use WP_Screen;
use ReflectionClass;
use Badasswp\WPMockTC\WPMockTestCase;

use SearchReplaceForBlockEditor\Services\Admin;

/**
 * @covers \SearchReplaceForBlockEditor\Services\Admin::register
 * @covers \SearchReplaceForBlockEditor\Services\Admin::register_options_menu
 * @covers \SearchReplaceForBlockEditor\Services\Admin::register_options_init
 * @covers \SearchReplaceForBlockEditor\Services\Admin::register_options_styles
 * @covers \SearchReplaceForBlockEditor\Admin\Options::__callStatic
 * @covers \SearchReplaceForBlockEditor\Admin\Options::get_form_fields
 * @covers \SearchReplaceForBlockEditor\Admin\Options::get_form_notice
 * @covers \SearchReplaceForBlockEditor\Admin\Options::get_form_page
 * @covers \SearchReplaceForBlockEditor\Admin\Options::get_form_submit
 * @covers \SearchReplaceForBlockEditor\Admin\Options::init
 */
class AdminTest extends WPMockTestCase {
	public Admin $admin;

	public function setUp(): void {
		parent::setUp();

		WP_Mock::userFunction( 'get_option' )
			->with( 'search_replace_for_block_editor', [] )
			->andReturn( [] );

		$this->admin = new Admin();
	}

	public function tearDown(): void {
		parent::tearDown();
	}

	public function test_register() {
		WP_Mock::expectActionAdded( 'admin_init', [ $this->admin, 'register_options_init' ] );
		WP_Mock::expectActionAdded( 'admin_menu', [ $this->admin, 'register_options_menu' ] );
		WP_Mock::expectActionAdded( 'admin_enqueue_scripts', [ $this->admin, 'register_options_styles' ] );

		$this->admin->register();

		$this->assertConditionsMet();
	}

	public function test_register_options_menu() {
		WP_Mock::userFunction( 'add_menu_page' )
			->once()
			->with(
				'Search & Replace for Block Editor',
				'Search & Replace for Block Editor',
				'manage_options',
				'search-replace-for-block-editor',
				[ $this->admin, 'register_options_page' ],
				'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iY3VycmVudENvbG9yIj4KCQkJCQk8cGF0aCBkPSJNMTMgNWMtMy4zIDAtNiAyLjctNiA2IDAgMS40LjUgMi43IDEuMyAzLjdsLTMuOCAzLjggMS4xIDEuMSAzLjgtMy44YzEgLjggMi4zIDEuMyAzLjcgMS4zIDMuMyAwIDYtMi43IDYtNlMxNi4zIDUgMTMgNXptMCAxMC41Yy0yLjUgMC00LjUtMi00LjUtNC41czItNC41IDQuNS00LjUgNC41IDIgNC41IDQuNS0yIDQuNS00LjUgNC41eiIgLz4KCQkJCTwvc3ZnPg==',
				100
			)
			->andReturn( null );

		$menu = $this->admin->register_options_menu();

		$this->assertNull( $menu );
		$this->assertConditionsMet();
	}

	public function test_register_options_init_bails_out_if_any_nonce_settings_is_missing() {
		$_POST = [
			'search_replace_for_block_editor_save_settings' => true,
		];

		$settings = $this->admin->register_options_init();

		$this->assertNull( $settings );
		$this->assertConditionsMet();
	}

	public function test_register_options_init_bails_out_if_nonce_verification_fails() {
		$_POST = [
			'search_replace_for_block_editor_save_settings'  => true,
			'search_replace_for_block_editor_settings_nonce' => 'a8vbq3cg3sa',
		];

		WP_Mock::userFunction( 'wp_unslash' )
			->times( 1 )
			->with( 'a8vbq3cg3sa' )
			->andReturn( 'a8vbq3cg3sa' );

		WP_Mock::userFunction( 'sanitize_text_field' )
			->times( 1 )
			->with( 'a8vbq3cg3sa' )
			->andReturn( 'a8vbq3cg3sa' );

		WP_Mock::userFunction( 'wp_verify_nonce' )
			->once()
			->with( 'a8vbq3cg3sa', 'search_replace_for_block_editor_settings_action' )
			->andReturn( false );

		$settings = $this->admin->register_options_init();

		$this->assertNull( $settings );
		$this->assertConditionsMet();
	}

	public function test_register_options_init_passes() {
		$_POST = [
			'search_replace_for_block_editor_save_settings'  => true,
			'search_replace_for_block_editor_settings_nonce' => 'a8vbq3cg3sa',
		];

		WP_Mock::userFunction(
			'wp_unslash',
			[
				'return' => function ( $text ) {
					return $text;
				},
			]
		);

		WP_Mock::userFunction( 'sanitize_text_field' )
			->andReturnUsing(
				function ( $arg ) {
					return $arg;
				}
			);

		WP_Mock::userFunction( 'wp_verify_nonce' )
			->times( 1 )
			->with( 'a8vbq3cg3sa', 'search_replace_for_block_editor_settings_action' )
			->andReturn( true );

		WP_Mock::userFunction( 'update_option' )
			->once()
			->with(
				'search_replace_for_block_editor',
				[
					'case_matching'  => '',
					'regex_matching' => '',
					'save_post'      => '',
					'close_modal'    => '',
					'use_shortcut'   => '',
				]
			)
			->andReturn( null );

		$settings = $this->admin->register_options_init();

		$this->assertNull( $settings );
		$this->assertConditionsMet();
	}

	public function test_register_options_styles_passes() {
		$screen = Mockery::mock( WP_Screen::class )->makePartial();
		$screen->shouldAllowMockingProtectedMethods();
		$screen->id = 'toplevel_page_search-replace-for-block-editor';

		WP_Mock::userFunction( 'get_current_screen' )
			->andReturn( $screen );

		$reflection = new ReflectionClass( Admin::class );

		WP_Mock::userFunction( 'plugin_dir_url' )
			->with( $reflection->getFileName() )
			->andReturn( 'https://example.com/wp-content/plugins/search-replace-for-block-editor/inc/Services/' );

		WP_Mock::userFunction( 'wp_enqueue_style' )
			->with(
				'search-replace-for-block-editor',
				'https://example.com/wp-content/plugins/search-replace-for-block-editor/inc/Services/../../styles.css',
				[],
				true,
				'all'
			)
			->andReturn( null );

		$this->admin->register_options_styles();

		$this->assertConditionsMet();
	}

	public function test_register_options_styles_bails() {
		WP_Mock::userFunction( 'get_current_screen' )
			->andReturn( '' );

		$this->admin->register_options_styles();

		$this->assertConditionsMet();
	}
}
