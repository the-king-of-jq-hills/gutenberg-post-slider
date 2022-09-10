/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops
 */
 import { __ } from '@wordpress/i18n';
 import { useBlockProps, 
	RichText,	
	AlignmentControl, 
	BlockControls,
	InspectorControls,
	PanelColorSettings 
} from '@wordpress/block-editor';

/**
 * The save function defines the way in which the different attributes should
 * be combined into the final markup, which is then serialized by the block
 * editor into `post_content`.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#save
 *
 * @return {WPElement} Element to render.
 */
 export default function save( { attributes } ) {

	const {align, theImage} = attributes;
	const blockProps = useBlockProps.save({
		className: 'txp-dynamic-align-'+align,
	});
	
	//console.log(attributes);
	return (
		<div className='txp-blockwrap' { ...blockProps } >
			<img
				src={ theImage }
				alt=""
				className='txp-image'
			/>
		</div>
	);
}
