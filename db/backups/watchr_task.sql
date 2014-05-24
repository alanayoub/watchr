CREATE DATABASE  IF NOT EXISTS `watchr` /*!40100 DEFAULT CHARACTER SET latin1 */;
USE `watchr`;
-- MySQL dump 10.14  Distrib 5.5.34-MariaDB, for debian-linux-gnu (x86_64)
--
-- Host: localhost    Database: watchr
-- ------------------------------------------------------
-- Server version	5.5.34-MariaDB-1~raring-log

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `task`
--

DROP TABLE IF EXISTS `task`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `task` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `url` varchar(2083) NOT NULL,
  `css` varchar(255) DEFAULT NULL,
  `regex` varchar(100) DEFAULT NULL,
  `xpath` varchar(255) DEFAULT NULL,
  `creation_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `active` tinyint(1) NOT NULL DEFAULT '1',
  `latest_scrape` timestamp NULL DEFAULT NULL,
  `title` varchar(100) DEFAULT NULL,
  `type` varchar(6) DEFAULT NULL,
  `failed` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`id`,`user_id`),
  UNIQUE KEY `task_UNIQUE` (`id`),
  KEY `fk_task_user1` (`user_id`),
  CONSTRAINT `fk_task_user1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=55 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `task`
--

LOCK TABLES `task` WRITE;
/*!40000 ALTER TABLE `task` DISABLE KEYS */;
INSERT INTO `task` VALUES (4,1,'http://www.rentmychest.com/','center a',NULL,NULL,'2013-12-27 16:01:38',0,'2014-04-06 11:42:00','Rentmychest test',NULL,NULL),(5,1,'https://www.mtgox.com/','#lastPrice',NULL,NULL,'2013-12-27 16:15:21',1,'2014-02-12 21:27:24','Bitcoin Latest Price','Number',1),(8,1,'http://uk.hotels.com/','.footer-bar .trust .text strong','',NULL,'2013-12-28 15:16:20',1,'2014-04-25 14:35:21','Number of Hotels on hcom','Number',0),(9,1,'http://www.bbc.co.uk/news/','.top-story-header',NULL,NULL,'2013-12-28 15:17:15',1,'2014-04-25 14:44:39','BBC News top story','String',0),(17,1,'https://news.ycombinator.com/','table table tbody tr:first-child td[class=title] a',NULL,NULL,'2014-01-02 15:14:22',1,'2014-04-25 14:35:04','Top Hacker news story','String',0),(18,1,'http://www.amazon.co.uk/','.s9TitleText:first',NULL,NULL,'2014-01-02 15:23:38',1,'2014-04-25 14:35:09','Some Amazon thing',NULL,0),(19,1,'http://www.amazon.co.uk/gp/product/B003IR1CEU/ref=s9_simh_gw_p147_d1_i1?pf_rd_m=A3P5ROKL5A1OLE&pf_rd_s=center-2&pf_rd_r=1V23PYAQXJBNCJNSZYSB&pf_rd_t=101&pf_rd_p=455344027&pf_rd_i=468294','.priceLarge',NULL,NULL,'2014-01-02 17:34:22',1,'2014-04-25 14:34:59','3TB Harddrive price','Number',0),(20,1,'http://www.alanayoub.com/','.post-header:first',NULL,NULL,'2014-01-03 09:29:59',0,'2014-04-06 11:44:34','My Blog',NULL,NULL),(21,1,'http://www.irishtimes.com/','.index_story .h2:first',NULL,NULL,'2014-01-12 12:57:09',0,'2014-04-06 11:44:48','Ireland news',NULL,NULL),(22,1,'http://techcrunch.com/','.post-title:first',NULL,NULL,'2014-01-19 11:11:01',0,'2014-04-06 11:44:49','Tech crunch',NULL,NULL),(23,1,'http://www.reddit.com/','#siteTable .title:first a:first',NULL,NULL,'2014-01-19 17:05:02',0,'2014-04-06 11:41:54','Reddit',NULL,NULL),(24,1,'http://failblog.org/','.post-header .title:first a',NULL,NULL,'2014-01-19 17:24:09',1,'2014-04-21 20:31:48','Failblog','String',1),(25,1,'http://metro.co.uk/','.title:first',NULL,NULL,'2014-01-19 17:26:39',0,'2014-04-06 12:58:45','Metro',NULL,NULL),(26,1,'http://www.reddit.com/','p.title:first a',NULL,NULL,'2014-02-12 16:08:02',0,'2014-04-06 11:44:48','More Reddit',NULL,NULL),(27,1,'http://stackoverflow.com/','.question-summary:first a',NULL,NULL,'2014-02-12 16:42:58',1,'2014-04-21 20:40:23','Stackoverflow top question','String',1),(28,1,'http://www.wired.co.uk/','.linkList3 h2:first a',NULL,NULL,'2014-02-12 16:49:43',0,'2014-04-06 11:44:45','Wired top story',NULL,NULL),(29,1,'http://www.amazon.co.uk/APC-Smart-UPS-1000VA-LCD-230V/dp/B003IR1CEU/ref=sr_1_11?ie=UTF8&qid=1394359922&sr=8-11&keywords=ups','.priceLarge','',NULL,'2014-03-09 10:13:40',1,'2014-04-25 14:35:09','UPS','Number',0),(30,1,'http://www.cwjobs.co.uk/JobSearch/Results.aspx?Keywords=javascript&Rate=500&RateType=4&LTxt=london&Radius=5','#rptSearchResults_ctl00_lnkJobTitle',NULL,NULL,'2014-04-12 08:46:01',1,'2014-04-25 14:35:40','CWJobs','String',0),(31,1,'http://www.html5rocks.com/en/','.title:first',NULL,NULL,'2014-04-12 08:57:03',1,'2014-04-25 14:35:29','HTML5Rocks','String',0),(32,1,'http://www.reddit.com/r/funny/','.sitetable .title.may-blank:first',NULL,NULL,'2014-04-12 09:36:53',0,'2014-04-12 10:02:03','Reddit funny',NULL,NULL),(33,1,'http://www.reddit.com/r/todayilearned/','.sitetable .title.may-blank:first',NULL,NULL,'2014-04-12 09:42:04',0,'2014-04-12 10:07:15','Reddit TIL',NULL,NULL),(34,1,'http://www.reddit.com/r/technology/','.sitetable .title.may-blank:first',NULL,NULL,'2014-04-12 09:44:31',0,'2014-04-12 10:09:34','Reddit Technology',NULL,NULL),(35,1,'http://www.reddit.com/r/science/','.sitetable .title.may-blank:first',NULL,NULL,'2014-04-12 09:50:47',0,'2014-04-12 10:16:04','Reddit Science',NULL,NULL),(36,1,'http://www.reddit.com/r/Music/','.sitetable .title.may-blank:first',NULL,NULL,'2014-04-12 09:54:45',0,'2014-04-12 10:19:54','Reddit Music',NULL,NULL),(37,1,'http://www.inertramblings.com/','.entry-title:first a',NULL,NULL,'2014-04-12 09:58:42',0,'2014-04-12 09:58:42','Random 1',NULL,NULL),(38,1,'http://www.bostonglobe.com/','.story-title.hed-lead a',NULL,NULL,'2014-04-12 10:02:00',0,'2014-04-12 10:02:00','Random 2',NULL,NULL),(39,1,'http://www.wallpaper.com/','.featuredText .title a',NULL,NULL,'2014-04-12 10:22:52',0,'2014-04-12 11:38:35','Wallpaper',NULL,NULL),(40,1,'http://www.vegasvalleybookfest.org/','#content .post .title a',NULL,NULL,'2014-04-12 10:27:07',0,'2014-04-12 11:42:23','Random 3',NULL,NULL),(41,1,'http://www.scientificamerican.com/','.agendaFeaturedTitle',NULL,NULL,'2014-04-12 10:30:47',0,'2014-04-12 11:21:12','Random 4',NULL,NULL),(42,1,'http://london.craigslist.co.uk/search/cas/?query=w4m','.content .row:first .pl a',NULL,NULL,'2014-04-12 10:36:13',0,'2014-04-12 11:26:31','Random 5',NULL,NULL),(43,1,'http://inthesetimes.com/','.text-holder:first h3',NULL,NULL,'2014-04-12 10:40:25',0,'2014-04-12 11:30:45','Random 5',NULL,NULL),(44,1,'http://www.motherjones.com/','.field-content h3:first a',NULL,NULL,'2014-04-12 11:31:04',0,'2014-04-12 11:31:04','Random 6',NULL,NULL),(45,1,'http://eulogyrecordings.com/','#content .post-title a:first',NULL,NULL,'2014-04-12 11:35:21',0,'2014-04-12 11:35:21','Random 7',NULL,NULL),(46,1,'http://www.ba.no/','.df-style-maintitle a:first',NULL,NULL,'2014-04-12 11:40:15',0,'2014-04-12 11:40:15','Random 8',NULL,NULL),(47,1,'http://www.tagesspiegel.de/','.hcf-teaser-list .hcf-headline:first',NULL,NULL,'2014-04-13 08:52:51',0,'2014-04-13 08:52:51','Random 9',NULL,NULL),(48,1,'http://www.eluniversal.com/','.columna_izquierda .PB10:first a',NULL,NULL,'2014-04-13 08:56:22',0,'2014-04-13 08:56:22','Random 10',NULL,NULL),(49,1,'http://www.amazon.co.uk/gp/product/1782166327/ref=s9_simh_gw_p14_d12_i1?pf_rd_m=A3P5ROKL5A1OLE&pf_rd_s=center-2&pf_rd_r=0VKCXTS4XEG7A7T0AS98&pf_rd_t=101&pf_rd_p=455344027&pf_rd_i=468294','.priceLarge',NULL,NULL,'2014-04-13 09:03:27',1,'2014-04-25 14:35:20','Node book price','Number',0),(50,1,'http://www.ikea.com/gb/en/catalog/products/00116595/','#price1','',NULL,'2014-04-19 08:47:38',1,'2014-04-25 14:43:51','Ikea LIATORP Bookcase','Number',0),(51,1,'http://www.makeuseof.com/tag/ubuntu-remote-desktop-builtin-vnc-compatible-dead-easy/','.entry-title',NULL,NULL,'2014-04-19 08:53:20',0,'2014-04-19 08:53:20','test',NULL,NULL),(52,1,'http://www.autotrader.co.uk/search/used/cars/bentley/continental_supersports/postcode/n32tr/radius/1500/maximum-age/up_to_4_years_old/sort/default/onesearchad/used%2Cnearlynew%2Cnew/price-from/30000','.deal-price:first',NULL,NULL,'2014-04-19 15:54:45',1,'2014-04-25 14:44:36','Cheapest Bentley Continental SuperSport under 4 years old','String',0),(53,3,'http://www.amazon.co.uk/gp/product/1118185463/ref=s9_simh_gw_p14_d0_i1?pf_rd_m=A3P5ROKL5A1OLE&pf_rd_s=center-2&pf_rd_r=011VND47THDYWFAQ0A66&pf_rd_t=101&pf_rd_p=455344027&pf_rd_i=468294','.priceLarge',NULL,NULL,'2014-04-25 14:36:22',1,'2014-04-25 14:36:22','Nodejs book','String',NULL),(54,3,'http://www.amazon.co.uk/gp/product/1782166327/ref=s9_simh_gw_p14_d0_i4?pf_rd_m=A3P5ROKL5A1OLE&pf_rd_s=center-2&pf_rd_r=0FH29R9EDGSZ0JSP77AT&pf_rd_t=101&pf_rd_p=455344027&pf_rd_i=468294','.priceLarge',NULL,NULL,'2014-04-25 14:37:54',1,'2014-04-25 14:37:54','Mastering Nodejs book',NULL,NULL);
/*!40000 ALTER TABLE `task` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2014-04-25 15:49:10
