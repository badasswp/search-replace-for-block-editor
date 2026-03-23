import { __ } from '@wordpress/i18n';
import { search } from '@wordpress/icons';
import { addFilter } from '@wordpress/hooks';
import { BlockControls } from '@wordpress/block-editor';
import { Fragment } from '@wordpress/element';
import { ToolbarGroup, ToolbarButton } from '@wordpress/components';

import { getAllowedBlocks, getShortcutEvent } from './utils';

/**
 * Search & Replace Toolbar Icon.
 *
 * This function returns the settings object useful
 * for applying toolbar features to specific blocks within
 * the Gutenberg Block editor.
 *
 * @since 1.4.0
 *
 * @param {Object} settings Original block settings
 * @return {Object}         Filtered block settings
 */
export const SearchReplaceToolbarIcon = ( settings: any ): object => {
	const { name, edit } = settings;

	if ( getAllowedBlocks().indexOf( name ) === -1 ) {
		return settings;
	}

	settings.edit = ( props: any ) => {
		return (
			<Fragment>
				<BlockControls key="search-replace-toolbar">
					<ToolbarGroup>
						<ToolbarButton
							icon={ search }
							label="Edit"
							onClick={ () => {
								document.dispatchEvent( getShortcutEvent() );
							} }
							placeholder={ __(
								'Search & Replace',
								'search-replace-for-block-editor'
							) }
						/>
					</ToolbarGroup>
				</BlockControls>

				<div key="gutenberg-native-toolbar">{ edit( props ) }</div>
			</Fragment>
		);
	};

	return settings;
};

addFilter(
	'blocks.registerBlockType',
	'search-replace-for-block-editor/toolbar',
	SearchReplaceToolbarIcon
);
