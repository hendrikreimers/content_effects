<?php
if (!defined('TYPO3_MODE'))
    die('Access denied.');

/**
 * Register Page TSconfig
 *
 */
call_user_func(function() {
    $_EXTKEY = 'content_effects';
    $ucc     = \TYPO3\CMS\Core\Utility\GeneralUtility::underscoredToUpperCamelCase($_EXTKEY);

    \TYPO3\CMS\Core\Utility\ExtensionManagementUtility::registerPageTSConfigFile(
        $_EXTKEY,
        'Configuration/PageTSconfig/TSconfig.typoscript',
        $ucc . ': Default'
    );

    \TYPO3\CMS\Core\Utility\ExtensionManagementUtility::registerPageTSConfigFile(
        $_EXTKEY,
        'Configuration/PageTSconfig/optionalMinimal.typoscript',
        $ucc . ': Minimal (Optional)'
    );
});