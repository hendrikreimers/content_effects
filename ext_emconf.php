<?php

$EM_CONF[$_EXTKEY] = array(
	'title' => 'Content Effects',
	'description' => 'Make your site beautiful with animations. This Ext. adds to Content Elements animation features on scroll, using a jQuery plugin and Animate.css. You can use it for any other usecases too.',
	'category' => 'plugin',
	'author' => 'Hendrik Reimers (CORE23)',
    'author_email' => 'info@kern23.de',
    'author_company' => 'CORE23.com',
	'state' => 'stable',
	'internal' => '',
	'uploadfolder' => '0',
	'createDirs' => '',
	'clearCacheOnLoad' => 0,
	'version' => '1.0.0',
    'autoload' => [
        'psr-4' => [
            'K23\\ContentEffects\\' => 'Classes'
        ],
    ],
	'constraints' => array(
		'depends' => array(
            'typo3' => '8.7.0-9.5.99'
		),
        'conflicts' => array(
            'css_styled_content' => '8.7.0-9.5.99'
        ),
        'suggests' => array(

        )
	),
);