<?php
/**
 * Plugin Name:       Txp Slider
 * Description:       Example block scaffolded with Create Block tool.
 * Requires at least: 5.9
 * Requires PHP:      7.0
 * Version:           0.1.2
 * Author:            marsian
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       txp-slider
 *
 * @package           create-block
 */

/**
 * Registers the block using the metadata loaded from the `block.json` file.
 */
function create_block_txp_slider_block_init() {
	register_block_type( __DIR__ . '/build', array(
		'render_callback' => 'txp_slider_render_front_slider'
	) );
}
add_action( 'init', 'create_block_txp_slider_block_init' );


require plugin_dir_path( __FILE__ ) . './src/txp-front.php';