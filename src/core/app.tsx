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
} from '@wordpress/components';

import { Shortcut } from './shortcut';
import {
	getAllowedBlocks,
	getBlockEditorIframe,
	ifIsCaseSensitiveBasedOnFilter,
	isSelectionInModal,
	isWpVersionGreaterThanOrEqualTo,
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
	const {
		isShortcutEnabled,
		isCaseMatchingEnabled,
		isRegexMatchingEnabled,
		isCloseModalEnabled,
		isSavePostEnabled,
	} = srfbe;

	const [ replacements, setReplacements ] = useState< number >( 0 );
	const [ isModalVisible, setIsModalVisible ] = useState< boolean >( false );
	const [ context, setContext ] = useState< boolean >( false );
	const [ searchInput, setSearchInput ] = useState< string >( '' );
	const [ replaceInput, setReplaceInput ] = useState< string >( '' );

	// Toggles.
	const [ isCaseSensitive, setIsCaseSensitive ] = useState< boolean >(
		isCaseMatchingEnabled
	);
	const [ isRegexExpression, setIsRegexExpression ] = useState< boolean >(
		isRegexMatchingEnabled
	);

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
	const handleCaseToggle = ( newValue: boolean ): void => {
		setIsCaseSensitive( newValue );
	};

	/**
	 * Handle regex-expression toggle feature
	 * to enable user perform regex-enabled search
	 * and replacements.
	 *
	 * @since 1.10.0
	 *
	 * @param {boolean} newValue
	 * @return {void}
	 */
	const handleRegexToggle = ( newValue: boolean ): void => {
		setIsRegexExpression( newValue );
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
	}, [ searchInput, isCaseSensitive, isRegexExpression ] );

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

		if ( ! searchInput ) {
			return;
		}

		// Prepare raw string pattern.
		const rawPattern = `(?<!<[^>]*)${ searchInput }(?<![^>]*<)`;

		// Get Regex search pattern.
		const regexPattern: RegExp = new RegExp(
			rawPattern,
			ifIsCaseSensitiveBasedOnFilter() || isCaseSensitive ? 'g' : 'gi'
		);

		/**
		 * Filter the way we set the pattern, let users
		 * customise their search pattern here.
		 *
		 * @since 1.10.0
		 *
		 * @param {RegExp} regexPattern Regex search pattern.
		 * @param {string} rawPattern   Raw string pattern to be searched.
		 * @param {Object} Params       Params containing `searchInput`, `replaceInput`, `status`,
		 *                              `isCaseSensitive`, `isRegexExpression`, & `srfbe`.
		 *
		 * @return {RegExp} Filtered Search pattern.
		 */
		const pattern = applyFilters(
			'search-replace-for-block-editor.regexPattern',
			regexPattern,
			rawPattern,
			{
				searchInput,
				replaceInput,
				status,
				isCaseSensitive,
				isRegexExpression,
				srfbe,
			}
		) as RegExp;

		select( 'core/block-editor' )
			.getBlocks()
			.forEach( ( element: any ) => {
				recursivelyReplace( element, pattern, replaceInput, status );
			} );

		if ( status && isSavePostEnabled ) {
			( dispatch( 'core/editor' ) as any ).savePost();
		}

		if ( status && isCloseModalEnabled ) {
			closeModal();

			// Let the user know, since you're closing the modal.
			( dispatch( 'core/notices' ) as any ).createSuccessNotice(
				`${ replacements } item(s) replaced successfully.`,
				{
					id: 'srfbe-id',
					isDismissible: true,
					type: 'default',
				}
			);
		}

		/**
		 * After Search & Replace.
		 *
		 * Fires after the search & replace
		 * activity is completed.
		 *
		 * @since 1.10.0
		 *
		 * @param {Object}  params            Params.
		 * @param {number}  replacements      Number of replacements (or searches if status is false).
		 * @param {string}  searchInput       The search input string.
		 * @param {string}  replaceInput      The replace input string.
		 * @param {RegExp}  pattern           The regex expression pattern.
		 * @param {boolean} status            The context (true for replacements, false for searches).
		 * @param {boolean} isCaseSensitive   Is search & replace operation case sensitive.
		 * @param {boolean} isRegexExpression Is search & replace operation regex based.
		 * @param {Object}  srfbe             Localized values passed to JS.
		 *
		 * @return {void}
		 */
		doAction( 'search-replace-for-block-editor.afterSearchReplace', {
			replacements,
			searchInput,
			replaceInput,
			pattern,
			status,
			isCaseSensitive,
			isRegexExpression,
			srfbe,
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
	const SafeShortcut = (): JSX.Element | null => {
		if ( ! isWpVersionGreaterThanOrEqualTo( '6.4.0' ) ) {
			return null;
		}

		// Enable by default (set true, if null).
		if ( isShortcutEnabled || null === isShortcutEnabled ) {
			return <Shortcut onKeyDown={ openModal } />;
		}

		return null;
	};

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
							placeholder="Lorem ipsum..."
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
								'Match case',
								'search-replace-for-block-editor'
							) }
							checked={ isCaseSensitive }
							onChange={ handleCaseToggle }
							__nextHasNoMarginBottom
						/>
						<ToggleControl
							label={ __(
								'Use regular expression',
								'search-replace-for-block-editor'
							) }
							checked={ isRegexExpression }
							onChange={ handleRegexToggle }
							__nextHasNoMarginBottom
						/>
					</div>

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
