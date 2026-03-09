<?php
/**
 * Container class.
 *
 * This class is responsible for registering the
 * plugin services.
 *
 * @package SearchReplaceForBlockEditor
 */

namespace SearchReplaceForBlockEditor\Core;

use SearchReplaceForBlockEditor\Services\Admin;
use SearchReplaceForBlockEditor\Services\Boot;
use SearchReplaceForBlockEditor\Interfaces\Kernel;

class Container implements Kernel {
	/**
	 * Services.
	 *
	 * @since 1.0.0
	 *
	 * @var mixed[]
	 */
	public static array $services = [];

	/**
	 * Prepare Singletons.
	 *
	 * @since 1.0.0
	 */
	public function __construct() {
		static::$services = [
			Admin::class,
			Boot::class,
		];
	}

	/**
	 * Register Service.
	 *
	 * Establish singleton version for each Service
	 * concrete class.
	 *
	 * @since 1.0.0
	 *
	 * @return void
	 */
	public function register(): void {
		foreach ( static::$services as $service ) {
			( $service::get_instance() )->register();
		}
	}
}
