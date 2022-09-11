
/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-i18n/
 */
import { __ } from '@wordpress/i18n';
import React, { useEffect, useState } from 'react';

/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops
 */
 import { 
	useBlockProps, 
	AlignmentControl, 
	BlockControls,
	InspectorControls,
	PanelColorSettings
} from '@wordpress/block-editor';

import {
	TextControl,
	PanelBody,
	PanelRow,
	ToggleControl,
	ExternalLink,
	CheckboxControl,
	RadioControl,
	SelectControl,
} from '@wordpress/components';

import { Button } from '@wordpress/components';
import { MediaUpload, MediaUploadCheck, MediaPlaceholder } from '@wordpress/block-editor';

/**
 * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
 * Those files can contain any CSS code that gets applied to the editor.
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */
import './editor.scss';

/**
 * The edit function describes the structure of your block in the context of the
 * editor. This represents what the editor will render when the block is used.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#edit
 *
 * @return {WPElement} Element to render.
 */
export default function Edit({attributes, setAttributes}) {

	const { align, backgroundColor, textColor, siteURL, theImage } = attributes;

	const blockProps = useBlockProps({
		className: 'txp-dynamic-align-'+align,		
	});
	
	const onChangeAlign = ( newAlign ) => {
		console.log(newAlign);
		setAttributes( { 
			align: newAlign === undefined ? 'none' : newAlign, 
		} )
	}
	const onChangeBackgroundColor = ( newBackgroundColor ) => {
		setAttributes( { backgroundColor: newBackgroundColor } )
	}
	const onChangeTextColor = ( newTextColor ) => {
		setAttributes( { textColor: newTextColor } )
	}

	const onChangesiteURL = ( newsiteURL ) => {
		setAttributes( { siteURL : newsiteURL } )
	}
	
	//const thImageURL = "url("+theImage+")";
	const mediaPreview = !! theImage && (
		<img src={ theImage } />
	);

	//https://wptavern.com/wp-json/wp/v2/posts?per_page=1
    const [posts, setPosts] = useState([]);
    useEffect(() => {
        async function loadPosts() {
            const response = await fetch('https://wptavern.com/wp-json/wp/v2/posts?per_page=2');
            if(!response.ok) {
                // oups! something went wrong
                return;
            }
    
            const posts = await response.json();
            setPosts(posts);
        }
    
        loadPosts();
   }, [])

   	const fixDate = ( postDate ) => {
		postDate = postDate.split('T')[0];
		let formattedDate = new Date(postDate).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: '2-digit'
		  
		  })
		  return postDate;	
	}

	const slides = posts.map((post, index) => {
		<div key={ `slide-${index}` } >
			{ console.log("Title : " + post.title.rendered + " : " + post.episode_featured_image + "Link : " + post.link + " Date : " + fixDate(post.date) ) }
			<img src={ post.episode_featured_image } alt="" />
			<div className='txp-post-title'>{ post.title.rendered }</div>
		</div>
	})

	return(	
		
		<>
			<InspectorControls>
				<PanelColorSettings
					title={ __('Color Settings', 'txp-slider') }
					initialOpen={ false }
					colorSettings={ [
						{
							value: textColor,
							onChange: onChangeTextColor,
							label: __("Text Color", "txp-slider")
						},
						{
							value: backgroundColor,
							onChange: onChangeBackgroundColor,
							label: __("Background Color", "txp-slider")							
						}
					] }
				/>
				<PanelBody 
					title={ __("Link Settings", "txp-slider") }
					initialOpen= {true}
				>
					<PanelRow>
						<fieldset>
							<TextControl
								label={ __("Enter Link URL", "txp-slider") } 
								value={ siteURL } 
								onChange={ onChangesiteURL } 
								help={ __("Add Your URL", "txp-slider") }
							>
							</TextControl>
						</fieldset>
					</PanelRow>
				</PanelBody>
			</InspectorControls>
			<BlockControls group="block">
				<AlignmentControl
					value={ align }
					onChange={ onChangeAlign }
				/>
			</BlockControls>
			<div className='txp-blockwrap' {...blockProps} >
					<MediaPlaceholder
						onSelect = {
							( el ) => {
								setAttributes( { theImage: el.url } );
								console.log("URL is : " + el.url);
							}
						}
						allowedTypes = { [ 'image' ] }
						multiple = { false }
						labels = { { title: 'The Image' } }
						mediaPreview = { mediaPreview }
					>
					</MediaPlaceholder>	
			</div>		
		</>
	);
}
