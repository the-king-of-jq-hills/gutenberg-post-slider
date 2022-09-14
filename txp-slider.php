<?php
/**
 * Plugin Name:       Txp Slider
 * Description:       Example block scaffolded with Create Block tool.
 * Requires at least: 5.9
 * Requires PHP:      7.0
 * Version:           0.1.0
 * Author:            marsian
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       txp-slider
 *
 * @package           create-block
 */

/**
 * Registers the block using the metadata loaded from the `block.json` file.
 * Behind the scenes, it registers also all assets so they can be enqueued
 * through the block editor in the corresponding context.
 *
 * @see https://developer.wordpress.org/reference/functions/register_block_type/
 */
function create_block_txp_slider_block_init() {
	register_block_type( __DIR__ . '/build', array(
		'render_callback' => 'txp_slider_render_front_slider'
	) );
}
add_action( 'init', 'create_block_txp_slider_block_init' );


require plugin_dir_path( __FILE__ ) . './txp-front.php';