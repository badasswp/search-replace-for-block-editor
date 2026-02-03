import { __ } from '@wordpress/i18n';
import { search } from '@wordpress/icons';
import { applyFilters, doAction } from '@wordpress/hooks';
import { dispatch, select } from '@wordpress/data';
import { useState, useEffect, useRef } from '@wordpress/element';
import {
	Modal,
	TextControl,
	ToggleControl,
	Button,
	Tooltip,
	Notice,
} from '@wordpress/components';

import { Shortcut } from './shortcut';
import {
	getAllowedBlocks,
	getBlockEditorIframe,
	isCaseSensitive,
	isSelectionInModal,
	isWpVersionGreaterThanOrEqualTo,
	escapeRegExp,
} from './utils';

import '../styles/app.scss';

/**
 * Search & Replace for Block Editor.
 *
 * This function returns a JSX component that comprises
 * the Tooltip, Search Icon, Modal & Shortcut.
 *
 * @since 1.0.0
 *
 * @return {JSX.Element} Search & Replace for Block Editor.
 */
const SearchReplaceForBlockEditor = (): JSX.Element => {
	const [ replacements, setReplacements ] = useState< number >( 0 );
	const [ isModalVisible, setIsModalVisible ] = useState< boolean >( false );
	const [ searchInput, setSearchInput ] = useState< string >( '' );
	const [ replaceInput, setReplaceInput ] = useState< string >( '' );
	const [ caseSensitive, setCaseSensitive ] = useState< boolean >( false );
	const [ useRegex, setUseRegex ] = useState< boolean >( false );
	const [ context, setContext ] = useState< boolean >( false );
	const [ error, setError ] = useState< string >( '' );

	// Reference to the first field inside the modal.
	const searchFieldRef = useRef< HTMLInputElement | null >( null );

	/**
	 * Open Modal.
	 *
	 * @since 1.0.0
	 *
	 * @return {void}
	 */
	const openModal = (): void => {
		setIsModalVisible( true );

		// Get selected text, if any.
		const selectedText: string = getBlockEditorIframe()
			.getSelection()
			.toString();

		// By default, reset count, search & replace inputs.
		if ( ! selectedText ) {
			setReplacements( 0 );
			setSearchInput( '' );
			setReplaceInput( '' );
			setError( '' );
		}
	};

	/**
	 * Close Modal.
	 *
	 * @since 1.0.0
	 *
	 * @return {void}
	 */
	const closeModal = (): void => {
		setIsModalVisible( false );
	};

	/**
	 * Handle case sensitive toggle feature
	 * to enable user perform case-sensitive search
	 * and replacements.
	 *
	 * @since 1.1.0
	 *
	 * @param {boolean} newValue
	 * @return {void}
	 */
	const handleCaseSensitive = ( newValue: boolean ): void => {
		setCaseSensitive( newValue );
	};

	/**
	 * Handle regex toggle and persist preference.
	 *
	 * @since 1.10.0
	 *
	 * @param {boolean} newValue
	 * @return {void}
	 */
	const handleUseRegex = ( newValue: boolean ): void => {
		setUseRegex( newValue );
		setError( '' );
		persistRegexPreference( newValue );
	};

	/**
	 * Listen for changes to input or case-sensitivity
	 * and perform Searches only.
	 *
	 * @since 1.3.0
	 *
	 * @return {void}
	 */
	useEffect( () => {
		replace();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [ searchInput, caseSensitive, useRegex ] );

	/**
	 * Modal Focus.
	 *
	 * Automatically focus the user's cursor on the
	 * modal's first text-field input when the modal
	 * becomes visible.
	 *
	 * @since 1.7.0
	 */
	useEffect( () => {
		if ( isModalVisible && searchFieldRef.current ) {
			requestAnimationFrame( () => {
				searchFieldRef.current?.focus();
			} );
		}
	}, [ isModalVisible ] );

	/**
	 * Load persisted preference on first render.
	 *
	 * @since 1.10.0
	 */
	useEffect( () => {
		setUseRegex( getPersistedRegexPreference() );
	}, [] );

	/**
	 * Get regex preference from core/preferences.
	 *
	 * @since 1.10.0
	 *
	 * @return {boolean} Whether regex is enabled.
	 */
	const getPersistedRegexPreference = (): boolean => {
		const scope = 'search-replace-for-block-editor';
		const key = 'useRegex';

		try {
			const prefSelect = select( 'core/preferences' ) as any;
			if ( prefSelect?.get ) {
				const value = prefSelect.get( scope, key );
				if ( typeof value === 'boolean' ) {
					return value;
				}
			}
		} catch ( e ) {
			// Ignore preference store errors.
		}

		return false;
	};

	/**
	 * Persist regex preference per user.
	 *
	 * @since 1.10.0
	 *
	 * @param {boolean} value
	 * @return {void}
	 */
	const persistRegexPreference = ( value: boolean ): void => {
		const scope = 'search-replace-for-block-editor';
		const key = 'useRegex';

		try {
			const prefDispatch = dispatch( 'core/preferences' ) as any;
			if ( prefDispatch?.set ) {
				prefDispatch.set( scope, key, value );
			}
		} catch ( e ) {
			// Ignore preference store errors.
		}
	};

	/**
	 * Handle the implementation for when the user
	 * clicks the 'Replace' button.
	 *
	 * @since 1.0.0
	 * @since 1.3.0 Pass in context param (status) to determine if it is Search or Replace.
	 *
	 * @param {boolean} status The status of the context.
	 * @return {void}
	 */
	const replace = ( status: boolean = false ): void => {
		setContext( status );
		setReplacements( 0 );
		setError( '' );

		if ( ! searchInput ) {
			return;
		}

		const searchValue = useRegex
			? searchInput
			: escapeRegExp( searchInput );
		let pattern: RegExp;

		try {
			pattern = new RegExp(
				`(?<!<[^>]*)${ searchValue }(?<![^>]*<)`,
				isCaseSensitive() || caseSensitive ? 'g' : 'gi'
			);
		} catch ( err ) {
			const details =
				err instanceof Error && err.message ? ` ${ err.message }` : '';
			setError(
				__(
					'Invalid regular expression.',
					'search-replace-for-block-editor'
				) + details
			);
			return;
		}

		select( 'core/block-editor' )
			.getBlocks()
			.forEach( ( element: any ) => {
				recursivelyReplace( element, pattern, replaceInput, status );
			} );
	};

	/**
	 * Recursively traverse and replace the text in the
	 * Block Editor with the user's text. Perform attribute update
	 * on a case by case basis based on mutating attribute.
	 *
	 * @since 1.0.0
	 * @since 1.0.1 Handle edge-cases for quote, pullquote & details block.
	 * @since 1.3.0 Pass in context param (status) to determine if it is Search or Replace.
	 *
	 * @param {any}     element Gutenberg editor block.
	 * @param {RegExp}  pattern Search pattern.
	 * @param {string}  text    Replace pattern.
	 * @param {boolean} status  True (Replace), False (Search).
	 *
	 * @return {void}
	 */
	const recursivelyReplace = (
		element: any,
		pattern: RegExp,
		text: string,
		status: boolean
	): void => {
		const { name, innerBlocks } = element;

		if ( getAllowedBlocks().indexOf( name ) !== -1 ) {
			const args = { element, pattern, text, status };

			/**
			 * Replace Block Attribute.
			 *
			 * Fires when the block attribute is being replaced.
			 *
			 * @since 1.4.0
			 *
			 * @param {Function} replaceBlockAttribute Replace Block Attribute.
			 * @param {string}   name                  Block Name.
			 * @param {any}      args                  Block Arguments.
			 *
			 * @return {void}
			 */
			doAction(
				'search-replace-for-block-editor.replaceBlockAttribute',
				replaceBlockAttribute,
				name,
				args
			);
		}

		if ( innerBlocks.length ) {
			innerBlocks.forEach( ( innerElement: any ) => {
				recursivelyReplace( innerElement, pattern, text, status );
			} );
		}
	};

	/**
	 * Do the actual job of replacing the string
	 * by dispatching the change using the block's clientId
	 * as reference.
	 *
	 * @since 1.0.1
	 *
	 * @param {any}    args      Args object containing element, pattern and text.
	 * @param {string} attribute The attribute to be mutated e.g. content.
	 *
	 * @return {void}
	 */
	const replaceBlockAttribute = ( args: any, attribute: string ): void => {
		const property = {};
		const {
			pattern,
			text,
			element: { attributes, clientId, name },
			status,
		} = args;

		if (
			undefined === attributes ||
			undefined === attributes[ attribute ]
		) {
			return;
		}

		const oldAttr =
			attributes[ attribute ].originalHTML || attributes[ attribute ];

		/**
		 * Replace Callback.
		 *
		 * @return {string} Replacement Text.
		 */
		const handleAttributeReplacement = (): string => {
			setReplacements( ( items: number ) => items + 1 );
			return text;
		};

		/**
		 * Filter the way we handle the attribute replacement
		 * to cater for special types of blocks.
		 *
		 * @since 1.6.0
		 *
		 * @param {any}      oldAttr                    Old Attribute.
		 * @param {string}   name                       Block Name.
		 * @param {RegExp}   pattern                    Search pattern.
		 * @param {Function} handleAttributeReplacement Handle Attribute Replacement.
		 *
		 * @return {Object}
		 */
		const { newAttr, isChanged } = applyFilters(
			'search-replace-for-block-editor.handleAttributeReplacement',
			oldAttr,
			{
				name,
				pattern,
				handleAttributeReplacement,
			}
		) as { newAttr: any; isChanged: boolean };

		if ( ! isChanged ) {
			return;
		}

		// Set the property attribute.
		property[ attribute ] = newAttr;

		// Update block property or content (if replace).
		if ( status ) {
			( dispatch( 'core/block-editor' ) as any ).updateBlockAttributes(
				clientId,
				property
			);
		}
	};

	/**
	 * Listen for Selection.
	 *
	 * Constantly listen for when the user selects a
	 * a text in the Block Editor.
	 *
	 * @since 1.2.0
	 *
	 * @return {void}
	 */
	useEffect( () => {
		const editor = getBlockEditorIframe();

		if ( ! editor || editor === document ) {
			return;
		}

		editor.addEventListener( 'selectionchange', handleSelection );

		return () => {
			editor.removeEventListener( 'selectionchange', handleSelection );
		};
	} );

	/**
	 * On Selection.
	 *
	 * Populate the search field when the user selects
	 * a text range in the Block Editor.
	 *
	 * @since 1.2.0
	 *
	 * @return {void}
	 */
	const handleSelection = (): void => {
		const selectedText: string = getBlockEditorIframe()
			.getSelection()
			.toString();

		if ( selectedText && ! isSelectionInModal() ) {
			setSearchInput( selectedText );
		}
	};

	/**
	 * Safe Shortcut.
	 *
	 * Check if the current WP version is greater than or equal to 6.4.0
	 * before rendering the Shortcut component.
	 *
	 * @since 1.4.0
	 * @return {JSX.Element|null} Shortcut.
	 */
	const SafeShortcut = (): JSX.Element | null =>
		isWpVersionGreaterThanOrEqualTo( '6.4.0' ) ? (
			<Shortcut onKeyDown={ openModal } />
		) : null;

	return (
		<>
			<SafeShortcut />
			<Tooltip
				text={ __(
					'Search & Replace',
					'search-replace-for-block-editor'
				) }
			>
				<Button
					icon={ search }
					label={ __(
						'Search & Replace',
						'search-replace-for-block-editor'
					) }
					onClick={ openModal }
				/>
			</Tooltip>
			{ isModalVisible && (
				<Modal
					title={ __(
						'Search & Replace',
						'search-replace-for-block-editor'
					) }
					onRequestClose={ closeModal }
					className="search-replace-modal"
				>
					<div id="search-replace-modal__text-group">
						<TextControl
							type="text"
							ref={ searchFieldRef }
							label={ __( 'Search' ) }
							value={ searchInput }
							onChange={ ( value ) => setSearchInput( value ) }
							placeholder={ __(
								'Lorem ipsum…',
								'search-replace-for-block-editor'
							) }
							__nextHasNoMarginBottom
							__next40pxDefaultSize
						/>
						<TextControl
							type="text"
							label={ __( 'Replace' ) }
							value={ replaceInput }
							onChange={ ( value ) => setReplaceInput( value ) }
							__nextHasNoMarginBottom
							__next40pxDefaultSize
						/>
					</div>

					<div id="search-replace-modal__toggle">
						<ToggleControl
							label={ __(
								'Match Case',
								'search-replace-for-block-editor'
							) }
							checked={ caseSensitive }
							onChange={ handleCaseSensitive }
							__nextHasNoMarginBottom
						/>
						<ToggleControl
							label={ __(
								'Use Regular Expression',
								'search-replace-for-block-editor'
							) }
							checked={ useRegex }
							onChange={ handleUseRegex }
							__nextHasNoMarginBottom
						/>
					</div>

					{ error ? (
						<Notice status="error" isDismissible={ false }>
							{ error }
						</Notice>
					) : null }

					{ replacements ? (
						<div id="search-replace-modal__notification">
							<p>
								{ context ? (
									<>
										<strong>{ replacements }</strong>{ ' ' }
										{ __(
											'item(s) replaced successfully',
											'search-replace-for-block-editor'
										) }
										.
									</>
								) : (
									<>
										<strong>{ replacements }</strong>{ ' ' }
										{ __(
											'item(s) found',
											'search-replace-for-block-editor'
										) }
										.
									</>
								) }
							</p>
						</div>
					) : (
						''
					) }

					<div id="search-replace-modal__button-group">
						<Button
							variant="primary"
							onClick={ () => replace( true ) }
						>
							{ __( 'Replace' ) }
						</Button>
						<Button variant="secondary" onClick={ closeModal }>
							{ __( 'Done' ) }
						</Button>
					</div>
				</Modal>
			) }
		</>
	);
};

export default SearchReplaceForBlockEditor;
