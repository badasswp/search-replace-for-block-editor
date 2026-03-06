describe( 'search-replace-for-block-editor.allowedBlocks', () => {
	it( 'passes and returns Blocks with filters applied', () => {
		jest.doMock( '@wordpress/hooks', () => ( {
			applyFilters: jest.fn( ( hook: string, arg: string[] ) => {
				return [ ...arg, 'core/table' ];
			} ),
		} ) );

		jest.doMock( '../../../src/core/utils', () => ( {
			getTextBlocks: jest.fn( () => {
				return [
					'core/paragraph',
					'core/pullquote',
					'core/preformatted',
				];
			} ),
			getAllowedBlocks: jest.fn( () => {
				const { applyFilters } = require( '@wordpress/hooks' );
				const { getTextBlocks } = require( '../../../src/core/utils' );
				return applyFilters(
					'search-replace-for-block-editor.allowedBlocks',
					getTextBlocks()
				);
			} ),
		} ) );

		const { getAllowedBlocks } = require( '../../../src/core/utils' );
		const blocks = getAllowedBlocks();
		expect( blocks ).toEqual( [
			'core/paragraph',
			'core/pullquote',
			'core/preformatted',
			'core/table',
		] );
		expect( blocks.length ).toEqual( 4 );
	} );

	it( 'passes and returns empty array of ', () => {
		jest.doMock( '@wordpress/hooks', () => ( {
			applyFilters: jest.fn( ( hook: string, arg: string[] ) => {
				return [];
			} ),
		} ) );

		jest.doMock( '../../../src/core/utils', () => ( {
			getTextBlocks: jest.fn( () => {
				return [
					'core/paragraph',
					'core/pullquote',
					'core/preformatted',
				];
			} ),
			getAllowedBlocks: jest.fn( () => {
				const { applyFilters } = require( '@wordpress/hooks' );
				const { getTextBlocks } = require( '../../../src/core/utils' );
				return applyFilters(
					'search-replace-for-block-editor.allowedBlocks',
					getTextBlocks()
				);
			} ),
		} ) );

		const { getAllowedBlocks } = require( '../../../src/core/utils' );
		const blocks = getAllowedBlocks();
		expect( blocks ).toEqual( [] );
		expect( blocks.length ).toEqual( 0 );
	} );

	afterEach( () => {
		jest.unmock( '@wordpress/hooks' );
		jest.unmock( '../../../src/core/utils' );
		jest.resetModules();
	} );
} );

describe( 'search-replace-for-block-editor.keyboardShortcut', () => {
	it( 'passes and returns the default keyboard shortcut', () => {
		jest.doMock( '@wordpress/hooks', () => ( {
			applyFilters: jest.fn( ( hook: string, arg: object ) => arg ),
		} ) );

		const { getShortcut } = require( '../../../src/core/utils' );
		const shortcut = getShortcut();
		expect( shortcut ).toStrictEqual( {
			character: 'f',
			modifier: 'primaryShift',
		} );
	} );

	it( 'passes and returns a custom keyboard shortcut', () => {
		jest.doMock( '@wordpress/hooks', () => ( {
			applyFilters: jest.fn( ( hook: string, arg: object ) => {
				return { ...arg, character: 'j' };
			} ),
		} ) );

		const { getShortcut } = require( '../../../src/core/utils' );
		const shortcut = getShortcut();
		expect( shortcut ).toStrictEqual( {
			character: 'j',
			modifier: 'primaryShift',
		} );
	} );

	afterEach( () => {
		jest.unmock( '@wordpress/hooks' );
		jest.unmock( '../../../src/core/utils' );
		jest.resetModules();
	} );
} );
