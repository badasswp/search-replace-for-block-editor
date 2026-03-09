<?php

namespace SearchReplaceForBlockEditor\Tests\Core;

use WP_Mock;
use Mockery;
use WP_Mock\Tools\TestCase;

use SearchReplaceForBlockEditor\Core\Container;
use SearchReplaceForBlockEditor\Services\Admin;
use SearchReplaceForBlockEditor\Services\Boot;
use SearchReplaceForBlockEditor\Abstracts\Service;

/**
 * @covers \SearchReplaceForBlockEditor\Core\Container::__construct
 * @covers \SearchReplaceForBlockEditor\Core\Container::register
 * @covers \SearchReplaceForBlockEditor\Services\Admin::register
 * @covers \SearchReplaceForBlockEditor\Services\Boot::register
 * @covers \SearchReplaceForBlockEditor\Abstracts\Service::get_instance
 */
class ContainerTest extends TestCase {
	public Container $container;

	public function setUp(): void {
		WP_Mock::setUp();
	}

	public function tearDown(): void {
		WP_Mock::tearDown();
	}

	public function test_container_contains_required_services() {
		$this->container = new Container();

		$this->assertTrue( in_array( Admin::class, Container::$services, true ) );
		$this->assertTrue( in_array( Boot::class, Container::$services, true ) );
	}

	public function test_register() {
		$container = new Container();

		/**
		 * Hack around unset Service::$instances.
		 *
		 * We create instances of services so we can
		 * have a populated version of the Service abstraction's instances.
		 */
		foreach ( Container::$services as $service ) {
			$service::get_instance();
		}

		WP_Mock::expectActionAdded(
			'admin_init',
			[
				Service::$services[ Admin::class ],
				'register_options_init',
			]
		);

		WP_Mock::expectActionAdded(
			'admin_menu',
			[
				Service::$services[ Admin::class ],
				'register_options_menu',
			]
		);

		WP_Mock::expectActionAdded(
			'admin_enqueue_scripts',
			[
				Service::$services[ Admin::class ],
				'register_options_styles',
			]
		);

		WP_Mock::expectActionAdded(
			'init',
			[
				Service::$services[ Boot::class ],
				'register_text_domain',
			]
		);

		WP_Mock::expectActionAdded(
			'enqueue_block_editor_assets',
			[
				Service::$services[ Boot::class ],
				'register_assets',
			]
		);

		$container->register();

		$this->assertConditionsMet();
	}
}
