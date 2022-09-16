<?php

/**
 * Function to create fronend of txp-slider
 *
 * @since    1.0.0
 */ 

// Disable direct file access.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
} 

$txpcolumns = 1;

function txp_slider_render_front_slider( $attr ) {

	$posts = '';
	$output = '';
	$slides = '';
	$columnclass = '';

	global $txpcolumns;
	$txpcolumns = $attr['numberOfColumns'];

	$blog_url = $attr['siteURL']."wp-json/wp/v2/posts?per_page=".$attr['numberOfPosts'];

	$response = wp_remote_get( $blog_url );

	// Exit if error.
	if ( is_wp_error( $response ) ) {
		return;
	}
	
	// Get the body.
	$posts = json_decode( wp_remote_retrieve_body( $response ) );

	// Exit if nothing is returned.
	if ( empty( $posts ) ) {
		return;
	}

	if ( ! empty( $posts ) ) {

		foreach ( $posts as $post ) {
			//print_r($post);
			$slides .= '<div class="swiper-slide" style="background-image : url(' . esc_url($post->episode_featured_image) . ') ">';
			$slides .= '<div class="txp-slider-gradient-overlay" style="background-image: ' . esc_attr($attr['gradient']) . '; opacity: ' . esc_attr($attr['overlayBgOpecity'])/100 . ' " ></div>';

			$slides .= '<div class="txp-slider-content-wrap">';

			$slides .= '<div class="txp-publish-date" aria-label="Published Date">' . esc_attr(date( 'F d, Y', strtotime( $post->modified ))) . '</div>';
			$slides .= '<h2 class="txp-post-title" aria-label="Post Title">' . esc_html($post->title->rendered) . '</h2>';
			$slides .= '<a class="txp-post-link" href=' . esc_url($post->link) . ' rel="nofollow" target="_blank" aria-label="Post Link">' . esc_html__("View Post", "txp-slider") . '</a>';

			$slides .= '</div>';

			$slides .= '</div>';
		}	

	}	

	if ( $txpcolumns > 1 )
	{
		$columnclass = "txp-multicolumn";
	} else {
		$columnclass = "txp-singlecolumn";
	}

	$output .= '<div class="txp-slider-wrap ' .$columnclass. ' txp-dynamic-align-'. $attr['align'] .'" >';
	$output .= '<div class="swiper txp-slider-swiper">';
	$output .= '<div class="swiper-wrapper">';

	$output .= $slides;
	
	$output .= '</div>';

	$output .= '<div class="swiper-button-next"></div>';
	$output .= '<div class="swiper-button-prev"></div>';
	$output .= '<div class="swiper-pagination"></div>';

	$output .= '</div>';
	$output .= '</div>';


	//print_r($attr);

	return $output ?? '<strong>Sorry! Could not find any post.</strong>';
}


add_action('wp_footer', 'txp_swiper_init_wp_footer');
function txp_swiper_init_wp_footer() {
	global $txpcolumns;
    ?>
        <script>
			var swiper = new Swiper(".txp-slider-swiper", {
				pagination: {
				el: ".swiper-pagination",
				clickable: true,
				},
				navigation: {
					nextEl: ".swiper-button-next",
					prevEl: ".swiper-button-prev",
				},
				slidesPerView: <?php echo $txpcolumns; ?>,
        		spaceBetween: 32,
				a11y: true,
				breakpoints: {
					// when window width is >= 320px
					320: {
						slidesPerView: 1,
						spaceBetween: 32,
					},
					// when window width is >= 640px
					768: {
						slidesPerView: <?php echo $txpcolumns; ?>,
						spaceBetween: 32,
					},
				},				
			});
        </script>
    <?php
}

add_action( 'wp_enqueue_scripts', 'txp_swiper_assets' );
function txp_swiper_assets() {
	wp_register_style( 'swiper-style', 'https://cdn.jsdelivr.net/npm/swiper/swiper-bundle.min.css' );
	wp_enqueue_style('swiper-style');

	wp_register_script( 'swiperjs', 'https://cdn.jsdelivr.net/npm/swiper/swiper-bundle.min.js', null, null, false );
	wp_enqueue_script('swiperjs');
}