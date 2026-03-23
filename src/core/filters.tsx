import { addAction, addFilter } from '@wordpress/hooks';

/**
 * Replace Block Attribute.
 *
 * This function replaces the block attribute
 * based on the block name.
 *
 * @since 1.4.0
 *
 * @param {Function} replaceBlockAttribute Replace Block Attribute.
 * @param {string}   name                  Block Name.
 * @param {any}      args                  Block Arguments.
 *
 * @return {void}
 */
addAction(
	'search-replace-for-block-editor.replaceBlockAttribute',
	'srfbe',
	( replaceBlockAttribute, name, args ) => {
		switch ( name ) {
			case 'core/quote':
				replaceBlockAttribute( args, 'citation' );
				break;

			case 'core/pullquote':
				replaceBlockAttribute( args, 'value' );
				replaceBlockAttribute( args, 'citation' );
				break;

			case 'core/details':
				replaceBlockAttribute( args, 'summary' );
				break;

			case 'core/table':
				replaceBlockAttribute( args, 'head' );
				replaceBlockAttribute( args, 'body' );
				replaceBlockAttribute( args, 'foot' );
				replaceBlockAttribute( args, 'caption' );
				break;

			default:
				replaceBlockAttribute( args, 'content' );
				break;
		}
	}
);

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
addFilter(
	'search-replace-for-block-editor.handleAttributeReplacement',
	'srfbe',
	( oldAttr, args ) => {
		const { name, pattern, handleAttributeReplacement } = args;

		switch ( name ) {
			case 'core/table':
				const tableString: string = JSON.stringify( oldAttr ).replace(
					pattern,
					handleAttributeReplacement
				);

				return {
					newAttr: JSON.parse( tableString || '{}' ),
					isChanged: tableString !== JSON.stringify( oldAttr ),
				};

			default:
				const defaultString: string = oldAttr.replace(
					pattern,
					handleAttributeReplacement
				);

				return {
					newAttr: defaultString,
					isChanged: defaultString !== oldAttr,
				};
		}
	}
);
