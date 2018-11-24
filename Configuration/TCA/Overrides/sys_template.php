<?php
if (!defined('TYPO3_MODE'))
    die('Access denied.');

/**
 * Register TypoScript Template
 */
call_user_func(function() {
    $_EXTKEY = 'content_effects';
    $ucc     = \TYPO3\CMS\Core\Utility\GeneralUtility::underscoredToUpperCamelCase($_EXTKEY);

    \TYPO3\CMS\Core\Utility\ExtensionManagementUtility::addStaticFile(
        $_EXTKEY,
        'Configuration/TypoScript/',
        $ucc . ': Default'
    );

    \TYPO3\CMS\Core\Utility\ExtensionManagementUtility::addStaticFile(
        $_EXTKEY,
        'Configuration/TypoScript/optionalMinimal',
        $ucc . ': Minimal (Optional)'
    );
});