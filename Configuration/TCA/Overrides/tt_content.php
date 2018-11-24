<?php
if (!defined('TYPO3_MODE'))
    die('Access denied.');

/**
 * Register new Content fields
 *
 */
call_user_func(function() {
    $_EXTKEY = 'content_effects';

    // Available Effects from Animate.css
    $cfxItems = [
        'bounce', 'flash', 'pulse', 'rubberBand', 'shake', 'headShake', 'swing', 'tada', 'wobble', 'jello', 'hinge', 'jackInTheBox', 'heartBeat',
        'bounceIn', 'bounceInDown', 'bounceInLeft', 'bounceInRight', 'bounceInUp',
        'bounceOut', 'bounceOutDown', 'bounceOutLeft', 'bounceOutRight', 'bounceOutUp',
        'fadeIn', 'fadeInDown', 'fadeInDownBig', 'fadeInLeft', 'fadeInLeftBig', 'fadeInRight', 'fadeInRightBig', 'fadeInUp', 'fadeInUpBig',
        'fadeOut', 'fadeOutDown', 'fadeOutDownBig', 'fadeOutLeft', 'fadeOutLeftBig', 'fadeOutRight', 'fadeOutRightBig', 'fadeOutUp', 'fadeOutUpBig',
        'flipInX', 'flipInY', 'flipOutX', 'flipOutY',
        'lightSpeedIn', 'lightSpeedOut',
        'rotateIn', 'rotateInDownLeft', 'rotateInDownRight', 'rotateInUpLeft', 'rotateInUpRight', 'rotateOut', 'rotateOutDownLeft', 'rotateOutDownRight', 'rotateOutUpLeft', 'rotateOutUpRight',
        'rollIn', 'rollOut',
        'zoomIn', 'zoomInDown', 'zoomInLeft', 'zoomInRight', 'zoomInUp', 'zoomOut', 'zoomOutDown', 'zoomOutLeft', 'zoomOutRight', 'zoomOutUp',
        'slideInDown', 'slideInLeft', 'slideInRight', 'slideInUp', 'slideOutDown', 'slideOutLeft', 'slideOutRight', 'slideOutUp'
    ];

    // Make TCA Items
    $items = [];
    foreach ( $cfxItems as $item ) {
        $item = trim($item);
        $items[] = [$item, $item];
    }

    unset($cfxItems);

    // Create the new fields
    $temporaryColumns = array(
        'cfx_enable' => [
            'exclude' => 1,
            'label'   => 'LLL:EXT:' . $_EXTKEY . '/Resources/Private/Language/tca.xlf:cfx_enable',
            'config'  => array(
                'type' => 'check',
                'default' => 0
            )
        ],
        'cfx_effect' => [
            'exclude' => 1,
            'label'   => 'LLL:EXT:' . $_EXTKEY . '/Resources/Private/Language/tca.xlf:cfx_effect',
            'config'  => array(
                    'type'             => 'select',
                    'renderType'       => 'selectSingle',
                    'multiple'         => 0,
                    'size'             => 1,
                    'maxitems'         => 1,
                    'minitems'         => 1,
                    'allownonidvalues' => 1,
                    'items'            => $items
            )
        ],
        'cfx_infinite' => [
            'exclude' => 1,
            'label'   => 'LLL:EXT:' . $_EXTKEY . '/Resources/Private/Language/tca.xlf:cfx_infinite',
            'config'  => array(
                'type' => 'check',
                'default' => 0
            )
        ],
        'cfx_speed' => [
            'exclude' => 1,
            'label'   => 'LLL:EXT:' . $_EXTKEY . '/Resources/Private/Language/tca.xlf:cfx_speed',
            'config'  => array(
                'type'             => 'select',
                'renderType'       => 'selectSingle',
                'multiple'         => 0,
                'size'             => 1,
                'maxitems'         => 1,
                'minitems'         => 1,
                'allownonidvalues' => 1,
                'items'            => [
                    ['LLL:EXT:' . $_EXTKEY . '/Resources/Private/Language/tca.xlf:default', ''],
                    ['slow (2s)', 'slow'],
                    ['slower (3s)', 'slower'],
                    ['fast (800ms)', 'fast'],
                    ['faster (500ms)', 'faster']
                ]
            )
        ],
        'cfx_delay' => [
            'exclude' => 1,
            'label'   => 'LLL:EXT:' . $_EXTKEY . '/Resources/Private/Language/tca.xlf:cfx_delay',
            'config'  => array(
                'type'             => 'select',
                'renderType'       => 'selectSingle',
                'multiple'         => 0,
                'size'             => 1,
                'maxitems'         => 1,
                'minitems'         => 1,
                'allownonidvalues' => 1,
                'items'            => [
                    ['LLL:EXT:' . $_EXTKEY . '/Resources/Private/Language/tca.xlf:default', ''],
                    ['500ms', 'delay-05s'],
                    ['1s', 'delay-1s'],
                    ['2s', 'delay-2s'],
                    ['3s', 'delay-3s'],
                    ['4s', 'delay-4s'],
                    ['5s', 'delay-5s']
                ]
            )
        ]
    );

    // Register new TCA Fields
    \TYPO3\CMS\Core\Utility\ExtensionManagementUtility::addTCAcolumns(
        'tt_content',
        $temporaryColumns
    );

    // Add them to all CTypes
    \TYPO3\CMS\Core\Utility\ExtensionManagementUtility::addToAllTCAtypes(
        'tt_content',
        '--div--;LLL:EXT:' . $_EXTKEY . '/Resources/Private/Language/tca.xlf:cfxSheet, cfx_enable, cfx_effect, cfx_infinite, cfx_speed, cfx_delay'
    );
});