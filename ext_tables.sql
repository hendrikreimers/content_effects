#
# Table structure for table 'tt_content'
#
CREATE TABLE tt_content (
	cfx_enable tinyint(1) unsigned DEFAULT '0' NOT NULL,
	cfx_effect varchar(255) DEFAULT '' NOT NULL,
	cfx_infinite tinyint(1) unsigned DEFAULT '0' NOT NULL,
	cfx_speed varchar(15) DEFAULT '' NOT NULL,
	cfx_delay varchar(15) DEFAULT '' NOT NULL,
);
