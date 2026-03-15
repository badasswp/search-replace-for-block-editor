import { applyFilters } from '@wordpress/hooks';
import { getBlockTypes } from '@wordpress/blocks';

/**
 * Allowed Blocks.
 *
 * This function filters the list of text blocks
 * using the `allowedBlocks` hook.
 *
 * @since 1.0.0
 *
 * @return {string[]} List of Allowed Blocks.
 */
export const getAllowedBlocks = (): string[] => {
	/**
	 * Allow Text Blocks.
	 *
	 * Filter and allow only these Specific blocks
	 * for the Search & Replace.
	 *
	 * @since 1.0.0
	 *
	 * @param {string[]} blocks List of Blocks.
	 * @return {string[]}
	 */
	return applyFilters(
		'search-replace-for-block-editor.allowedBlocks',
		getTextBlocks()
	) as string[];
};

/**
 * Get Text Blocks.
 *
 * This function grabs the list of text blocks
 * and returns the block names.
 *
 * @since 1.0.0
 *
 * @return {string[]} List of Text Blocks.
 */
export const getTextBlocks = (): string[] => {
	type BlockType = ReturnType< typeof getBlockTypes >[ number ];

	const textBlocks = getBlockTypes()
		.filter( ( block: BlockType ) => {
			return !! ( block?.category === 'text' );
		} )
		.map( ( block: BlockType ) => {
			return block?.name;
		} );

	return textBlocks.length ? textBlocks : getFallbackTextBlocks();
};

/**
 * Get ShortCut.
 *
 * This function filters the user's preferred
 * shortcut option.
 *
 * @since 1.0.1
 *
 * @return {Object} Shortcut Option.
 */
export const getShortcut = (): { modifier: string; character: string } => {
	const options = {
		CMD: {
			modifier: 'primary',
			character: 'f',
		},
		SHIFT: {
			modifier: 'primaryShift',
			character: 'f',
		},
		ALT: {
			modifier: 'primaryAlt',
			character: 'f',
		},
	};

	/**
	 * Filter Keyboard Shortcut.
	 *
	 * By default the passed option would be SHIFT which
	 * represents `CMD + SHIFT + F`.
	 *
	 * @since 1.0.1
	 *
	 * @param {Object} Shortcut Option.
	 * @return {Object}
	 */
	return applyFilters(
		'search-replace-for-block-editor.keyboardShortcut',
		options.CMD
	) as { modifier: string; character: string };
};

/**
 * Determine if a Search & Replace activity is case-sensitive
 * and treat accordingly.
 *
 * @since 1.0.2
 *
 * @return {boolean} Is Case Sensitive.
 */
export const ifIsCaseSensitiveBasedOnFilter = (): boolean => {
	/**
	 * Filter Case Sensitivity.
	 *
	 * By default this would be a falsy value.
	 *
	 * @since 1.0.2
	 *
	 * @param {boolean} Case Sensitivity.
	 * @return {boolean}
	 */
	return applyFilters(
		'search-replace-for-block-editor.caseSensitive',
		false
	) as boolean;
};

/**
 * Get Editor Root.
 *
 * This callback will attempt to grab the Editor root
 * where we will inject our App container.
 *
 * @since 1.2.0
 *
 * @return Promise<HTMLElement | Error> A Promise that resolves to a HTMLElement, if successful.
 */
export const getEditorRoot = (): Promise< HTMLElement | Error > => {
	let elapsedTime: number = 0;
	const interval: number = 100;

	const selector: string = isWpVersionGreaterThanOrEqualTo( '6.6.0' )
		? '.editor-header__toolbar'
		: '.edit-post-header__toolbar';

	return new Promise( ( resolve, reject ) => {
		const intervalId = setInterval( () => {
			elapsedTime += interval;
			const root = document.querySelector(
				selector
			) as HTMLElement | null;

			if ( root ) {
				clearInterval( intervalId );
				resolve( root );
			}

			if ( elapsedTime > 100 * interval ) {
				clearInterval( intervalId );
				reject( new Error( 'Unable to get Editor root container...' ) );
			}
		}, interval );
	} );
};

/**
 * Get App Container.
 *
 * Create an DIV container within the Editor root where
 * we will inject our React app.
 *
 * @since 1.2.0
 *
 * @param {HTMLElement} parent - The Parent DOM element.
 * @return {HTMLDivElement} HTML Div Element
 */
export const getAppRoot = ( parent: HTMLElement ): HTMLDivElement => {
	const container: HTMLDivElement = document.createElement( 'div' );
	container.id = 'search-replace';
	parent.appendChild( container );

	return container;
};

/**
 * Get iFrame Document.
 *
 * Retrieves the document object of the Block Editor
 * iframe with the name "editor-canvas".
 *
 * @since 1.2.1
 *
 * @return {Document} Document Object.
 */
export const getBlockEditorIframe = (): Document => {
	const editor = document.querySelector( 'iframe[name="editor-canvas"]' );

	return editor && editor instanceof HTMLIFrameElement
		? editor.contentDocument || editor.contentWindow?.document
		: document;
};

/**
 * Check if the selection is made inside the,
 * `search-replace-modal`.
 *
 * @since 1.2.1
 *
 * @return {boolean} Is Selection in Modal.
 */
export const isSelectionInModal = (): boolean => {
	const modalSelector: string = '.search-replace-modal';

	// eslint-disable-next-line @wordpress/no-global-get-selection
	const selection = window.getSelection() as Selection | null;

	const targetDiv = document.querySelector(
		modalSelector
	) as HTMLElement | null;

	if ( ! selection?.rangeCount || ! targetDiv ) {
		return false;
	}

	const range: Range = selection.getRangeAt( 0 );

	return (
		targetDiv.contains( range.startContainer ) &&
		targetDiv.contains( range.endContainer )
	);
};

/**
 * Standardize Version.
 *
 * This function takes an array of version numbers
 * and ensures that it has exactly three elements.
 *
 * @since 1.5.0
 *
 * @param {number[]} versionArray - Array of version numbers.
 * @return {number[]} Standardized version array.
 */
export const standardizeVersion = ( versionArray: number[] ): number[] => {
	const standardizedVersion = [ ...versionArray ];
	while ( standardizedVersion.length < 3 ) {
		standardizedVersion.push( 0 );
	}

	return standardizedVersion;
};

/**
 * Check if it's up to WP version.
 *
 * @since 1.2.2
 *
 * @param {string} version WP Version.
 * @return {boolean} Is WP Version.
 */
export const isWpVersionGreaterThanOrEqualTo = ( version: string ): boolean => {
	if ( typeof version !== 'string' ) {
		return false;
	}

	const argVersion = version;
	const { wpVersion: sysVersion } = srfbe as { wpVersion: string };

	const argVersionArray = standardizeVersion(
		argVersion.split( '.' ).map( Number )
	);
	const sysVersionArray = standardizeVersion(
		sysVersion.split( '.' ).map( Number )
	);

	const argVersionRadix: number = getNumberToBase10( argVersionArray );
	const sysVersionRadix: number = getNumberToBase10( sysVersionArray );

	return ! ( sysVersionRadix < argVersionRadix );
};

/**
 * Given an array of numbers, get the Radix
 * (converted to base 10). For e.g. [5, 6, 1] becomes
 * 561 or [2, 7, 4] becomes 274.
 *
 * @since 1.2.2
 *
 * @param {number[]} values Array of positive numbers.
 * @return {number} Get Radix.
 */
export const getNumberToBase10 = ( values: number[] ): number => {
	if ( ! Array.isArray( values ) ) {
		return 0;
	}

	for ( let i = 0; i < values.length; i++ ) {
		if ( ! Number.isInteger( values[ i ] ) ) {
			return 0;
		}
	}

	const radix: number = values.reduce(
		( sum: number, value: number, index: number ) => {
			return sum + value * Math.pow( 10, values.length - 1 - index );
		},
		0
	);

	return radix;
};

/**
 * Get Fallback Text Blocks.
 *
 * This function returns a list of fallback text blocks
 * that can be used in case the `allowedBlocks` hook
 * returns an empty array.
 *
 * @since 1.4.0
 *
 * @return {string[]} List of Fallback Text Blocks.
 */
export const getFallbackTextBlocks = (): string[] => {
	return [
		'core/paragraph',
		'core/heading',
		'core/list',
		'core/list-item',
		'core/quote',
		'core/code',
		'core/details',
		'core/missing',
		'core/preformatted',
		'core/pullquote',
		'core/table',
		'core/verse',
		'core/footnotes',
		'core/freeform',
	];
};

/**
 * Get Shortcut Event.
 *
 * This function returns a Keyboard event for
 * the plugin's shortcut action.
 *
 * @since 1.4.0
 *
 * @return {KeyboardEvent} The Keyboard event for the shortcut action.
 */
export const getShortcutEvent = (): KeyboardEvent => {
	return new KeyboardEvent( 'keydown', {
		key: 'F',
		code: 'KeyF',
		keyCode: 70,
		charCode: 70,
		metaKey: true,
		ctrlKey: navigator.platform.includes( 'Mac' ) ? false : true,
		bubbles: true,
	} );
};

/**
 * Is Allowed for Post type.
 *
 * This function checkes to see that the plugin
 * is allowed for a specific post type.
 *
 * @since 1.10.0
 *
 * @return {boolean} True/false.
 */
export const isAllowedForPostType = (): boolean => {
	const { postType } = srfbe;

	// Bail out, if undefined.
	if ( ! postType ) {
		return false;
	}

	/**
	 * Filter if a Post has access to
	 * Search & Replace app.
	 *
	 * @since 1.10.0
	 *
	 * @param {string[]} excludedPostTypes Excluded Post types.
	 * @return {string[]}
	 */
	const excludedPostTypes = applyFilters(
		'search-replace-for-block-editor.excludedPostTypes',
		[]
	) as string[];

	// Bail out, if excluded.
	if ( excludedPostTypes.includes( postType ) ) {
		return false;
	}

	return true;
};

/**
 * Escape user input for safe
 * literal RegExp usage.
 *
 * @since 1.10.0
 *
 * @param {string} value Raw user input.
 * @return {string} Escaped input.
 */
export const escapeRegex = ( value: string ): string => {
	if ( typeof value !== 'string' ) {
		return '';
	}

	return value.replace( /[.*+?^${}()|[\]\\]/g, '\\$&' );
};

/**
 * Get Search Pattern.
 *
 * This function returns a string pattern
 * that targets only texts within valid HTML markup.
 *
 * @since 1.10.0
 *
 * @param {string} searchText Search Text.
 * @return {string} Search Pattern.
 */
export const getPattern = ( searchText: string ): string =>
	`(?<!<[^>]*)${ searchText }(?<![^>]*<)`;
