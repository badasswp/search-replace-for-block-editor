<?php

namespace SearchReplaceForBlockEditor\Tests\Services;

use WP_Mock;
use Mockery;
use ReflectionClass;
use Badasswp\WPMockTC\WPMockTestCase;

use SearchReplaceForBlockEditor\Services\Boot;
use SearchReplaceForBlockEditor\Abstracts\Service;

/**
 * @covers \SearchReplaceForBlockEditor\Services\Boot::register
 * @covers \SearchReplaceForBlockEditor\Services\Boot::register_text_domain
 * @covers \SearchReplaceForBlockEditor\Services\Boot::register_assets
 * @covers \SearchReplaceForBlockEditor\Admin\Options::__callStatic
 * @covers \SearchReplaceForBlockEditor\Admin\Options::get_form_fields
 * @covers \SearchReplaceForBlockEditor\Admin\Options::get_form_notice
 * @covers \SearchReplaceForBlockEditor\Admin\Options::get_form_page
 * @covers \SearchReplaceForBlockEditor\Admin\Options::get_form_submit
 * @covers \SearchReplaceForBlockEditor\Admin\Options::init
 */
class BootTest extends WPMockTestCase {
	public Boot $boot;

	public function setUp(): void {
		parent::setUp();

		$this->boot = new Boot();
	}

	public function tearDown(): void {
		parent::tearDown();
	}

	public function test_register() {
		WP_Mock::expectActionAdded( 'init', [ $this->boot, 'register_text_domain' ] );
		WP_Mock::expectActionAdded( 'enqueue_block_editor_assets', [ $this->boot, 'register_assets' ] );

		$this->boot->register();

		$this->assertConditionsMet();
	}

	public function test_register_text_domain() {
		$boot = new ReflectionClass( Boot::class );

		WP_Mock::userFunction( 'plugin_basename' )
			->once()
			->with( $boot->getFileName() )
			->andReturn( '/inc/Services/Boot.php' );

		WP_Mock::userFunction( 'load_plugin_textdomain' )
			->once()
			->with(
				'search-replace-for-block-editor',
				false,
				'/inc/Services/../../languages'
			);

		$this->boot->register_text_domain();

		$this->assertConditionsMet();
	}

	public function test_register_assets() {
		$boot = new ReflectionClass( Boot::class );

		$mock_boot = Mockery::mock( Boot::class )->makePartial();
		$mock_boot->shouldAllowMockingProtectedMethods();

		global $wp_version;
		$wp_version = '6.9.1';

		WP_Mock::userFunction( 'plugin_dir_path' )
			->with( $boot->getFileName() )
			->andReturn( '/var/www/wp-content/plugins/search-replace-for-block-editor/inc/Services/' );

		WP_Mock::userFunction( 'plugins_url' )
			->with( 'search-replace-for-block-editor/dist/app.js' )
			->andReturn( 'https://example.com/wp-content/plugins/search-replace-for-block-editor/dist/app.js' );

		WP_Mock::userFunction( 'wp_enqueue_script' )
			->with(
				'search-replace-for-block-editor',
				'https://example.com/wp-content/plugins/search-replace-for-block-editor/dist/app.js',
				[
					'wp-i18n',
					'wp-element',
					'wp-blocks',
					'wp-components',
					'wp-editor',
					'wp-hooks',
					'wp-compose',
					'wp-plugins',
					'wp-edit-post',
				],
				'1750321560',
				false,
			);

		WP_Mock::userFunction( 'wp_set_script_translations' )
			->with(
				'search-replace-for-block-editor',
				'search-replace-for-block-editor',
				'/var/www/wp-content/plugins/search-replace-for-block-editor/inc/Services/../../languages',
			);

		WP_Mock::userFunction( 'get_option' )
			->with( 'search_replace_for_block_editor', [] )
			->andReturn( null );

		WP_Mock::userFunction( 'wp_localize_script' )
			->with(
				'search-replace-for-block-editor',
				'srfbe',
				[
					'wpVersion'              => '6.9.1',
					'isShortcutEnabled'      => null,
					'isCaseMatchingEnabled'  => null,
					'isRegexMatchingEnabled' => null,
					'isCloseModalEnabled'    => null,
					'isSavePostEnabled'      => null,
				]
			)
			->andReturn( null );

		$mock_boot->shouldReceive( 'get_assets' )
			->andReturn(
				[
					'dependencies' => [
						'wp-i18n',
						'wp-element',
						'wp-blocks',
						'wp-components',
						'wp-editor',
						'wp-hooks',
						'wp-compose',
						'wp-plugins',
						'wp-edit-post',
					],
					'version'      => '1750321560',
				]
			);

		$mock_boot->register_assets();

		$this->assertConditionsMet();
	}
}
