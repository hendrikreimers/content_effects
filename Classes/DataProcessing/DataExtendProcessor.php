<?php
declare(strict_types = 1);

namespace K23\ContentEffects\DataProcessing;

use TYPO3\CMS\Core\Utility\GeneralUtility;
use TYPO3\CMS\Frontend\ContentObject\ContentObjectRenderer;
use TYPO3\CMS\Frontend\ContentObject\DataProcessorInterface;

/**
 * Class DataExtendProcessor
 *
 * This DataProcessor helps to extend the fluid_styled_content Templates and adds the effects class to it.
 * No need to overwrite the default layout of FSC Sysext.
 *
 * @package K23\ContentEffects\DataProcessing
 */
class DataExtendProcessor implements DataProcessorInterface
{
    /**
     * process function
     *
     * @param ContentObjectRenderer $cObj The data of the content element or page
     * @param array $contentObjectConfiguration The configuration of Content Object
     * @param array $processorConfiguration The configuration of this processor
     * @param array $processedData Key/value store of processed data (e.g. to be passed to a Fluid View)
     * @return array the processed data as key/value store
     */
    public function process(ContentObjectRenderer $cObj, array $contentObjectConfiguration, array $processorConfiguration, array $processedData)
    {
        // Return without changes, if nothing set
        if ( !isset($processorConfiguration['dataVariables.']) && !is_array($processorConfiguration['dataVariables.']) )
            return $processedData;

        // Process each variable
        foreach ( $processorConfiguration['dataVariables.'] as $variableName => $config ) {
            if ( isset($config['value.']) && is_array($config['value.']) ) {
                $value = $cObj->getContentObject($config['value'])->render($config['value.']);
            } elseif ( !isset($config['value']) ) {
                continue;
            } else $value = $config['value'];

            // Add space to value?
            if ( boolval($processorConfiguration['addSpaceToValue']) === true ) {
                $space = ' ';
            } else $space = '';

            // Default method or user set
            $method = ( isset($config['method']) && (strlen($config['method']) > 0) ) ? $config['method'] : 'append';

            // Remove the dot of variableName
            $variableName = substr($variableName, 0, strlen($variableName) - 1);

            // Decide how to use the new value for this variable
            switch( $method ) {
                case 'append':
                    $processedData['data'][$variableName] .= $space . $value;
                    break;
                case 'prepend':
                    $processedData['data'][$variableName] = $value . $space . $processedData[$variableName];
                    break;
                case 'overwrite':
                    $processedData['data'][$variableName] = $value;
                    break;
            }

            // that's all folks
            return $processedData;
        }
    }
}
