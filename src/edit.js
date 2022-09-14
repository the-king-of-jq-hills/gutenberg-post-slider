
/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-i18n/
 */
import { __ } from '@wordpress/i18n';
import { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
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
	GradientPicker,
	RangeControl,
    __experimentalRadio as Radio,
    __experimentalRadioGroup as RadioGroup,
} from '@wordpress/components';


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

	const { align, gradient, textColor, siteURL, overlayBgOpecity, numberOfPosts } = attributes;

	const blockProps = useBlockProps({
		className: 'txp-dynamic-align-'+align,		
	});
	
	const onChangeAlign = ( newAlign ) => {
		setAttributes( { 
			align: newAlign === undefined ? 'none' : newAlign, 
		} )
	}
	const onChangeTextColor = ( newTextColor ) => {
		setAttributes( { textColor: newTextColor } )
	}

	const onChangesiteURL = ( newsiteURL ) => {
		setAttributes( { siteURL : newsiteURL } )
	}

	const onChangenumberOfPosts = ( newnumberOfPosts ) => {
		setAttributes( { numberOfPosts : newnumberOfPosts } )
	}

	const onChangesoverlayBgOpecity = ( newoverlayBgOpecity ) => {
		setAttributes( { overlayBgOpecity : newoverlayBgOpecity } )
	}	
	
	const onChangeGradient = ( currentGradient ) => { setAttributes( { gradient : currentGradient } ) }

	//https://wptavern.com/wp-json/wp/v2/posts?per_page=1

    const [posts, setPosts] = useState([]);
    useEffect(() => {
        async function loadPosts() {
			const blogURL = siteURL+"wp-json/wp/v2/posts?per_page="+numberOfPosts;
			console.log(blogURL + " : " + numberOfPosts );
            const response = await fetch(blogURL);
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
		  return formattedDate;	
	}

	const slides = posts.map((post, index) => {
		const overlayBgOpecityfloat = overlayBgOpecity/100;
		return (
		<React.Fragment>	
			<SwiperSlide key={ `slide-${index}` } style={ { backgroundImage: "url("+post.episode_featured_image+")" } } >
				<div className='txp-slider-gradient-overlay' style={ { backgroundImage: `${gradient}`, opacity: `${overlayBgOpecityfloat}` } } ></div>
				<div className="txp-slider-content-wrap">
					<h2 className='txp-post-title'>{ post.title.rendered }</h2>
					<div className='txp-publish-date'>{ fixDate(post.date) }</div>
					<a className='txp-post-link' href={post.link} rel="nofollow" target="_blank">{ __("View Post", "txp-slider") }</a>
				</div>
				
			</SwiperSlide>
		</React.Fragment> 
		);
	})

	return(	
		
		<>
			<InspectorControls>
				<PanelBody 
					title={ __("Slider Settings", "txp-slider") }
					initialOpen= {true}
				>
					<PanelRow>
						<fieldset>
							<GradientPicker
								label={ __("Background Overlay", "txp-slider") } 
								value={ gradient }
								onChange={ onChangeGradient }
								gradients={ [
									{
										name: 'JShine',
										gradient:
											'linear-gradient(135deg,#12c2e9 0%,#c471ed 50%,#f64f59 100%)',
										slug: 'jshine',
									},
									{
										name: 'Moonlit Asteroid',
										gradient:
											'linear-gradient(135deg,#0F2027 0%, #203A43 0%, #2c5364 100%)',
										slug: 'moonlit-asteroid',
									},
									{
										name: 'Rastafarie',
										gradient:
											'linear-gradient(135deg,#1E9600 0%, #FFF200 0%, #FF0000 100%)',
										slug: 'rastafari',
									},
								] }
							/>
							<RangeControl
								label="Background Opecity"
								value={ overlayBgOpecity }
								onChange={ onChangesoverlayBgOpecity } 
								//onChange={ ( newOverlayBgOpecity ) => setAttributes( { overlayBgOpecity : newOverlayBgOpecity } ) }
								min={ 1 }
								max={ 100 }
							/>
						</fieldset>
					</PanelRow>
					<PanelRow>
						<fieldset>
							<TextControl
								label={ __("Enter Blog URL", "txp-slider") } 
								value={ siteURL } 
								onChange={ onChangesiteURL } 
								help={ __("Add Your URL", "txp-slider") }
							>
							</TextControl>
							<RangeControl
								label="Number of Posts"
								value={ numberOfPosts }
								onChange={ onChangenumberOfPosts } 								
								min={ 1 }
								max={ 10 }
							/>
							<RadioGroup label="Text Align" onChange={ onChangeAlign } checked={ align }>
								<Radio value="left">Left</Radio>
								<Radio value="center">Center</Radio>
								<Radio value="right">Right</Radio>
							</RadioGroup>					
						</fieldset>
					</PanelRow>
				</PanelBody>
			</InspectorControls>
			<div className='txp-blockwrap' {...blockProps} >
					<Swiper 
						modules={[Navigation, Pagination, Scrollbar, A11y]}
						navigation
						pagination={{ clickable: true }}
						scrollbar={{ draggable: true }}
						//slidesPerView={3}
						//spaceBetween= {32}
					>
						{slides}	
					</Swiper>
			</div>		
		</>
	);
}
