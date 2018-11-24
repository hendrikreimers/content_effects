.. include:: ../Includes.txt


.. _admin-manual:

Administrator Manual
====================

Target group: **Administrators**

The extension will automaticly include all necessary JS and CSS files. It uses a custom
DataProcessor to hook into the frame_class Variable of the content element, to extend the
Classes Attribute and not to overwrite the fluid_styled_content Default Layout Template.

Over the constants editor you can include jQuery (v3.3.1) too, if you want.

That's all.


.. _admin-installation:

Installation
------------

This extension requires jQuery (v3.3.1) and fluidStyledContent. If you're not having jQuery already, you can enable it over the TypoScript Conditions.

To install the extension, perform the following steps:

#. Go to the Extension Manager
#. Install the extension
#. Load the static template and the optional template too, if you want to limitate the effects
#. Include the Page TSconfig as the same.

.. _admin-configuration:

Configuration
-------------

For details, please take a look at the TSconfig and TypoScript of this ext. It's really simple.