-- MySQL dump 10.13  Distrib 5.1.72, for Win64 (unknown)
--
-- Host: localhost    Database: myBettyWorld
-- ------------------------------------------------------
-- Server version	5.1.72-community

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
-- Table structure for table `chercheurs`
--

DROP TABLE IF EXISTS `chercheurs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `chercheurs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Chercheur` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `chercheurs`
--

LOCK TABLES `chercheurs` WRITE;
/*!40000 ALTER TABLE `chercheurs` DISABLE KEYS */;
INSERT INTO `chercheurs` VALUES (23,'A. Balicki'),(1,'Alacie Tullaugaq et Lucy Amarualik'),(12,'Bent Jensen'),(22,'Beverley Cavanagh'),(10,'Christian Leden'),(18,'Claude Desgoffe'),(19,'D. Harvey'),(15,'Diamond Jenness'),(14,'Erik Holtved'),(17,'Guy Mary-Rousseli├¿re'),(8,'H.C. Peterson'),(21,'Jean-Jacques Nattiez'),(5,'Jette Bang'),(16,'Kazuyuki Tanimoto'),(25,'Lorne Smith'),(7,'M├óli├órak\' Vebaek'),(9,'Michael Hauser'),(24,'Nicole Beaudry'),(2,'Ola Okfors'),(3,'Poul Rovsing Olsen'),(20,'Ramon Pelinski'),(13,'Regitze Margrethe Soby'),(6,'Simon Gelskov'),(11,'Trebitsch et Stiasny'),(4,'William Thalbitser');
/*!40000 ALTER TABLE `chercheurs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `disques`
--

DROP TABLE IF EXISTS `disques`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `disques` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `Disque` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `disques`
--

LOCK TABLES `disques` WRITE;
/*!40000 ALTER TABLE `disques` DISABLE KEYS */;
INSERT INTO `disques` VALUES (5,'Canada: Inuit Games and Songs'),(3,'Canada: Jeux vocaux des Inuit'),(4,'Inuit Iglulik'),(2,'Inuit: fifty-five historical recordings'),(1,'Katutjatut Throat Singing');
/*!40000 ALTER TABLE `disques` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `geometries`
--

DROP TABLE IF EXISTS `geometries`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `geometries` (
  `id` int(10) NOT NULL,
  `type` varchar(32) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `geometries`
--

LOCK TABLES `geometries` WRITE;
/*!40000 ALTER TABLE `geometries` DISABLE KEYS */;
INSERT INTO `geometries` VALUES (0,'Point'),(1,'Line'),(2,'Polygon');
/*!40000 ALTER TABLE `geometries` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `master`
--

DROP TABLE IF EXISTS `master`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `master` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `Disque` int(11) DEFAULT NULL,
  `Piste` varchar(255) DEFAULT NULL,
  `Chercheur` int(11) DEFAULT NULL,
  `Ville` int(11) DEFAULT NULL,
  `Date` varchar(255) DEFAULT NULL,
  `Genre` varchar(255) DEFAULT NULL,
  `Voix` varchar(255) DEFAULT NULL,
  `Accompagnement` varchar(255) DEFAULT NULL,
  `Dessine` varchar(255) DEFAULT NULL,
  `Groupes` varchar(255) DEFAULT NULL,
  `creator` int(10) NOT NULL,
  `version` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `geometry` int(10) DEFAULT NULL,
  `removed` tinyint(3) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_master_disques` (`Disque`),
  KEY `FK_master_chercheurs` (`Chercheur`),
  KEY `FK_master_villes` (`Ville`),
  KEY `FK_master_users` (`creator`),
  KEY `FK_master_geometries` (`geometry`),
  CONSTRAINT `FK_master_chercheurs` FOREIGN KEY (`Chercheur`) REFERENCES `chercheurs` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `FK_master_disques` FOREIGN KEY (`Disque`) REFERENCES `disques` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `FK_master_geometries` FOREIGN KEY (`geometry`) REFERENCES `geometries` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `FK_master_users` FOREIGN KEY (`creator`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `FK_master_villes` FOREIGN KEY (`Ville`) REFERENCES `villes` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=238 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `master`
--

LOCK TABLES `master` WRITE;
/*!40000 ALTER TABLE `master` DISABLE KEYS */;
INSERT INTO `master` VALUES (1,1,'Naujaluk',1,1,'1998','Chant de gorge','Polyphonie induite','a capella','OUI',NULL,0,NULL,NULL,0),(2,1,'Qairurvaluk',1,1,'1998','Chant de gorge','Polyphonie induite','a capella','OUI',NULL,0,NULL,NULL,0),(3,1,'Pilurvirutik',1,1,'1998','Chant de gorge','Polyphonie induite','a capella','OUI',NULL,0,NULL,NULL,0),(4,1,'Piararmit Inaqutik',1,1,'1998','Chant de gorge','Polyphonie induite','a capella','OUI',NULL,0,NULL,NULL,0),(5,1,'Sinnasairutik',1,1,'1998','Chant de gorge','Polyphonie induite','a capella','OUI',NULL,0,NULL,NULL,0),(6,1,'Killuvaluk',1,1,'1998','Chant de gorge','Polyphonie induite','a capella','OUI',NULL,0,NULL,NULL,0),(7,1,'Nirliujaq',1,1,'1998','Chant de gorge','Polyphonie induite','a capella','OUI',NULL,0,NULL,NULL,0),(8,1,'Pinguagutik',1,1,'1998','Chant de gorge','Polyphonie induite','a capella','OUI',NULL,0,NULL,NULL,0),(9,1,'Anuriujaq',1,1,'1998','Chant de gorge','Polyphonie induite','a capella','OUI',NULL,0,NULL,NULL,0),(10,1,'Nunaqatigingitut',1,1,'1998','Chant de gorge','Polyphonie induite','a capella','OUI',NULL,0,NULL,NULL,0),(11,1,'Qimmirulapik',1,1,'1998','Chant de gorge','Polyphonie induite','a capella','OUI',NULL,0,NULL,NULL,0),(12,1,'Kasuvartaq',1,1,'1998','Chant de gorge','Polyphonie induite','a capella','OUI',NULL,0,NULL,NULL,0),(13,1,'Kuvallu',1,1,'1998','Chant de gorge','Polyphonie induite','a capella','OUI',NULL,0,NULL,NULL,0),(14,1,'Pinguarutik',1,1,'1998','Chant de gorge','Polyphonie induite','a capella','OUI',NULL,0,NULL,NULL,0),(15,2,'Entertaining song',2,3,'1980',NULL,NULL,NULL,'NON',NULL,0,NULL,NULL,0),(16,2,'Duel-song',3,4,'1961',NULL,NULL,NULL,'NON',NULL,0,NULL,NULL,0),(17,2,'Uaajeerneq-song',3,2,'1961',NULL,NULL,NULL,'NON',NULL,0,NULL,NULL,0),(18,2,'Duel-song',4,5,'1906',NULL,NULL,NULL,'NON',NULL,0,NULL,NULL,0),(19,2,'Kayak-song',4,5,'1906',NULL,NULL,NULL,'NON',NULL,0,NULL,NULL,0),(20,2,'Uaajeerneq-song',5,6,'1962',NULL,NULL,NULL,'NON',NULL,0,NULL,NULL,0),(21,2,'Entertaining song',4,5,'1906',NULL,NULL,NULL,'NON',NULL,0,NULL,NULL,0),(22,2,'Uaajeerneq-song',4,5,'1906',NULL,NULL,NULL,'NON',NULL,0,NULL,NULL,0),(23,2,'Lullaby',3,6,'1961',NULL,NULL,NULL,'NON',NULL,0,NULL,NULL,0),(24,2,'Charm-song',4,5,'1906',NULL,NULL,NULL,'NON',NULL,0,NULL,NULL,0),(25,2,'Charm-songs',3,5,'1961',NULL,NULL,NULL,'NON',NULL,0,NULL,NULL,0),(26,2,'Singing game',6,5,'1987',NULL,NULL,NULL,'NON',NULL,0,NULL,NULL,0),(27,2,'Duel-song',4,7,'1914',NULL,NULL,NULL,'NON',NULL,0,NULL,NULL,0),(28,2,'Qivittoq-song',7,8,'1965',NULL,NULL,NULL,'NON',NULL,0,NULL,NULL,0),(29,2,'Qivittoq-song',8,9,'1961',NULL,NULL,NULL,'NON',NULL,0,NULL,NULL,0),(30,2,'Mournful song',9,9,'1980',NULL,NULL,NULL,'NON',NULL,0,NULL,NULL,0),(31,2,'Qivittoq-song',7,10,'1963',NULL,NULL,NULL,'NON',NULL,0,NULL,NULL,0),(32,2,'Mournful song',7,10,'1963',NULL,NULL,NULL,'NON',NULL,0,NULL,NULL,0),(33,2,'Qivittoq-song',7,10,'1963',NULL,NULL,NULL,'NON',NULL,0,NULL,NULL,0),(34,2,'Teasing-song',7,11,'1963',NULL,NULL,NULL,'NON',NULL,0,NULL,NULL,0),(35,2,'Ukuarlivarisaa',4,12,'1914',NULL,NULL,NULL,'NON',NULL,0,NULL,NULL,0),(36,2,'Epic lyric song',4,13,'1905',NULL,NULL,NULL,'NON',NULL,0,NULL,NULL,0),(37,2,'Entertaining song',10,14,'1912',NULL,NULL,NULL,'NON',NULL,0,NULL,NULL,0),(38,2,'Traditional song',11,15,'1906',NULL,NULL,NULL,'NON',NULL,0,NULL,NULL,0),(39,2,'Entertaining song',11,16,'1906',NULL,NULL,NULL,'NON',NULL,0,NULL,NULL,0),(40,2,'Entertaining song',10,17,'1912',NULL,NULL,NULL,'NON',NULL,0,NULL,NULL,0),(41,2,'Traditional song',12,18,'1959',NULL,NULL,NULL,'NON',NULL,0,NULL,NULL,0),(42,2,'Entertaining song',10,14,'1912',NULL,NULL,NULL,'NON',NULL,0,NULL,NULL,0),(43,2,'Song in a story',13,19,'1964',NULL,NULL,NULL,'NON',NULL,0,NULL,NULL,0),(44,2,'Song in a fable',14,20,'1937',NULL,NULL,NULL,'NON',NULL,0,NULL,NULL,0),(45,2,'Charm song',9,20,'1984',NULL,NULL,NULL,'NON',NULL,0,NULL,NULL,0),(46,2,'Entertaining drum-song',9,20,'1984',NULL,NULL,NULL,'NON',NULL,0,NULL,NULL,0),(47,2,'Tiguak\'s song',9,20,'1962',NULL,NULL,NULL,'NON',NULL,0,NULL,NULL,0),(48,2,'In├╗tek\'s song',9,21,'1984',NULL,NULL,NULL,'NON',NULL,0,NULL,NULL,0),(49,2,'Entertaining drum-song',9,20,'1962',NULL,NULL,NULL,'NON',NULL,0,NULL,NULL,0),(50,2,'Her own song',15,22,'1916','Chant personnel','M├⌐lodie','a capella','OUI',NULL,0,NULL,NULL,0),(51,2,'Invocation song',9,20,'1962',NULL,NULL,NULL,'NON',NULL,0,NULL,NULL,0),(52,2,'Kajok\'s song',9,20,'1962',NULL,NULL,NULL,'NON',NULL,0,NULL,NULL,0),(53,2,'Variation of Kajok\'s song',14,23,'1937',NULL,NULL,NULL,'NON',NULL,0,NULL,NULL,0),(54,2,'His own song',10,23,'1909',NULL,NULL,NULL,'NON',NULL,0,NULL,NULL,0),(55,2,'Ihr├⌐\'s song',9,20,'1984',NULL,NULL,NULL,'NON',NULL,0,NULL,NULL,0),(56,2,'Sivso\'s song',5,20,'1962',NULL,NULL,NULL,'NON',NULL,0,NULL,NULL,0),(57,2,'Entertaining song',14,23,'1937',NULL,NULL,NULL,'NON',NULL,0,NULL,NULL,0),(58,2,'His own song',15,22,'1916','Chant personnel','M├⌐lodie','a capella','OUI',NULL,0,NULL,NULL,0),(59,2,'Entertaining song',16,22,'1985','Narration chant├⌐e','M├⌐lodie','a capella','OUI',NULL,0,NULL,NULL,0),(60,2,'Teasing-song',9,20,'1962',NULL,NULL,NULL,'NON',NULL,0,NULL,NULL,0),(61,2,'Song in a myth',9,20,'1962',NULL,NULL,NULL,'NON',NULL,0,NULL,NULL,0),(62,2,'His own song',9,24,'1962',NULL,NULL,NULL,'NON',NULL,0,NULL,NULL,0),(63,2,'Song of a shaman',9,24,'1962',NULL,NULL,NULL,'NON',NULL,0,NULL,NULL,0),(64,2,'Tornge\'s song',9,20,'1962',NULL,NULL,NULL,'NON',NULL,0,NULL,NULL,0),(65,2,'Entertaining song',9,20,'1962',NULL,NULL,NULL,'NON',NULL,0,NULL,NULL,0),(66,2,'Pualorssuak\'s song',9,20,'1962',NULL,NULL,NULL,'NON',NULL,0,NULL,NULL,0),(67,2,'Song in a story',17,25,'1965','Conte','M├⌐lodie','a capella','OUI',NULL,0,NULL,NULL,0),(68,2,'Entertaining song',18,26,'1954','Narration chant├⌐e','M├⌐lodie','a capella','OUI',NULL,0,NULL,NULL,0),(69,2,'Entertaining song',18,26,'1954','Narration chant├⌐e','M├⌐lodie','a capella','OUI',NULL,0,NULL,NULL,0),(70,3,'Qiarvaa (texte)',19,27,'1980',NULL,NULL,NULL,'OUI',NULL,0,NULL,NULL,0),(71,3,'Qiarvaa (avec ustensile)',19,28,'1980',NULL,NULL,NULL,'OUI',NULL,0,NULL,NULL,0),(72,3,'Niaqu',19,28,'1980',NULL,NULL,NULL,'OUI',NULL,0,NULL,NULL,0),(73,3,'Qatsivaaq',20,27,'1977',NULL,NULL,NULL,'OUI',NULL,0,NULL,NULL,0),(74,3,'Qatsivaaq',20,27,'1977',NULL,NULL,NULL,'OUI',NULL,0,NULL,NULL,0),(75,3,'Niaquinaq et Qiarpaaq',20,27,'1977',NULL,NULL,NULL,'OUI',NULL,0,NULL,NULL,0),(76,3,'Qattipaartuq (texte)',19,28,'1980',NULL,NULL,NULL,'OUI',NULL,0,NULL,NULL,0),(77,3,'Qiarpalik',21,29,'1977',NULL,NULL,NULL,'OUI',NULL,0,NULL,NULL,0),(78,3,'Qiiaaqjuittiarqtut',21,29,'1977',NULL,NULL,NULL,'OUI',NULL,0,NULL,NULL,0),(79,3,'Ullu (avec ustensiles)',19,28,'1980',NULL,NULL,NULL,'OUI',NULL,0,NULL,NULL,0),(80,3,'Qiarpaa (avec ustensile)',20,27,'1977',NULL,NULL,NULL,'OUI',NULL,0,NULL,NULL,0),(81,3,'Qiarpaa',19,27,'1980',NULL,NULL,NULL,'OUI',NULL,0,NULL,NULL,0),(82,3,'Umaqtuq',22,30,'1975',NULL,NULL,NULL,'OUI',NULL,0,NULL,NULL,0),(83,3,'Umpi (avec ustensiles)',21,28,'1980',NULL,NULL,NULL,'OUI',NULL,0,NULL,NULL,0),(99,3,'Quana',19,28,'1980',NULL,NULL,NULL,'OUI',NULL,0,NULL,NULL,0),(100,3,'Quananau (texte)',21,29,'1977',NULL,NULL,NULL,'OUI',NULL,0,NULL,NULL,0),(101,3,'Quananau',21,29,'1977',NULL,NULL,NULL,'OUI',NULL,0,NULL,NULL,0),(102,3,'Huangahaaq',21,29,'1977',NULL,NULL,NULL,'OUI',NULL,0,NULL,NULL,0),(103,3,'Marmatuq',21,29,'1977',NULL,NULL,NULL,'OUI',NULL,0,NULL,NULL,0),(104,3,'Iurnaaq',19,28,'1980',NULL,NULL,NULL,'OUI',NULL,0,NULL,NULL,0),(105,3,'Anuraqtuq',22,31,'1978',NULL,NULL,NULL,'OUI',NULL,0,NULL,NULL,0),(106,3,'Aqittuq',22,30,'1975',NULL,NULL,NULL,'OUI',NULL,0,NULL,NULL,0),(107,3,'Qiarpaa',19,27,'1980',NULL,NULL,NULL,'OUI',NULL,0,NULL,NULL,0),(108,3,'Qattipaartuq',22,30,'1975',NULL,NULL,NULL,'OUI',NULL,0,NULL,NULL,0),(109,3,'Niaquinaq',22,30,'1975',NULL,NULL,NULL,'OUI',NULL,0,NULL,NULL,0),(110,3,'Marmatuq et Haqalaqtuk',22,30,'1975',NULL,NULL,NULL,'OUI',NULL,0,NULL,NULL,0),(111,3,'Qiarpaa (texte)',20,27,'1977',NULL,NULL,NULL,'OUI',NULL,0,NULL,NULL,0),(112,3,'Qiarpaa',20,27,'1977',NULL,NULL,NULL,'OUI',NULL,0,NULL,NULL,0),(113,3,'Qattipaartuq',19,28,'1980',NULL,NULL,NULL,'OUI',NULL,0,NULL,NULL,0),(114,3,'Quarniarniaktok',23,31,'1960',NULL,NULL,NULL,'OUI',NULL,0,NULL,NULL,0),(115,3,'Kaperniarniaktok',23,31,'1960',NULL,NULL,NULL,'OUI',NULL,0,NULL,NULL,0),(116,3,'Qiarpalik',19,28,'1980',NULL,NULL,NULL,'OUI',NULL,0,NULL,NULL,0),(117,3,'Qiarpaa',20,27,'1977',NULL,NULL,NULL,'OUI',NULL,0,NULL,NULL,0),(118,3,'Quana',19,28,'1980',NULL,NULL,NULL,'OUI',NULL,0,NULL,NULL,0),(119,3,'Quarnana',21,25,'1976',NULL,NULL,NULL,'OUI',NULL,0,NULL,NULL,0),(120,3,'Angutinguarq',19,28,'1980',NULL,NULL,NULL,'OUI',NULL,0,NULL,NULL,0),(121,3,'Iurnaaq',19,28,'1980',NULL,NULL,NULL,'OUI',NULL,0,NULL,NULL,0),(122,3,'Qiarutsiaq',19,28,'1980',NULL,NULL,NULL,'OUI',NULL,0,NULL,NULL,0),(123,3,'Angutinguark (texte)',19,28,'1980',NULL,NULL,NULL,'OUI',NULL,0,NULL,NULL,0),(124,3,'Qiarpalik',19,28,'1980',NULL,NULL,NULL,'OUI',NULL,0,NULL,NULL,0),(125,3,'Qiarpa',20,27,'1977',NULL,NULL,NULL,'OUI',NULL,0,NULL,NULL,0),(126,3,'Huangahaaq',21,29,'1977',NULL,NULL,NULL,'OUI',NULL,0,NULL,NULL,0),(127,3,'Qiarpalik',21,29,'1977',NULL,NULL,NULL,'OUI',NULL,0,NULL,NULL,0),(128,3,'Qattippaartuk',21,29,'1977',NULL,NULL,NULL,'OUI',NULL,0,NULL,NULL,0),(129,3,'Qatsivaaq',20,27,'1977',NULL,NULL,NULL,'OUI',NULL,0,NULL,NULL,0),(130,3,'Niaquinaq',20,27,'1977',NULL,NULL,NULL,'OUI',NULL,0,NULL,NULL,0),(131,3,'Qattippartuk',21,29,'1977',NULL,NULL,NULL,'OUI',NULL,0,NULL,NULL,0),(132,3,'Quananau',21,29,'1977',NULL,NULL,NULL,'OUI',NULL,0,NULL,NULL,0),(133,3,'Hapapiyarktuk',21,25,'1977',NULL,NULL,NULL,'OUI',NULL,0,NULL,NULL,0),(134,3,'Qatsivaaq',19,28,'1980',NULL,NULL,NULL,'OUI',NULL,0,NULL,NULL,0),(135,3,'Kadjiparnartok',23,31,'1960',NULL,NULL,NULL,'OUI',NULL,0,NULL,NULL,0),(136,3,'Niaquinaq',22,30,'1975',NULL,NULL,NULL,'OUI',NULL,0,NULL,NULL,0),(137,3,'Quananau',21,29,'1977',NULL,NULL,NULL,'OUI',NULL,0,NULL,NULL,0),(138,3,'Quana',19,28,'1980',NULL,NULL,NULL,'OUI',NULL,0,NULL,NULL,0),(139,3,'Qiarlittiak',22,31,'1978',NULL,NULL,NULL,'OUI',NULL,0,NULL,NULL,0),(140,3,'Qiarpaa',20,27,'1980',NULL,NULL,NULL,'OUI',NULL,0,NULL,NULL,0),(141,3,'Immpijuutuq',22,30,'1975',NULL,NULL,NULL,'OUI',NULL,0,NULL,NULL,0),(142,3,'Iurnaaq',19,28,'1980',NULL,NULL,NULL,'OUI',NULL,0,NULL,NULL,0),(143,3,'Qiarpaa',20,27,'1977',NULL,NULL,NULL,'OUI',NULL,0,NULL,NULL,0),(144,3,'Siqusurtaqtuk (avec ustensile)',19,28,'1980',NULL,NULL,NULL,'OUI',NULL,0,NULL,NULL,0),(145,3,'Qilaaqjuittiarqut',21,29,'1977',NULL,NULL,NULL,'OUI',NULL,0,NULL,NULL,0),(146,3,'Quana',19,28,'1980',NULL,NULL,NULL,'OUI',NULL,0,NULL,NULL,0),(147,3,'Quanaqtuq',22,30,'1975',NULL,NULL,NULL,'OUI',NULL,0,NULL,NULL,0),(148,3,'Qiarvaktuq',22,31,'1978',NULL,NULL,NULL,'OUI',NULL,0,NULL,NULL,0),(149,3,'Uqsiqtuk',22,31,'1978',NULL,NULL,NULL,'OUI',NULL,0,NULL,NULL,0),(150,3,'Amerniaktok',23,31,'1960',NULL,NULL,NULL,'OUI',NULL,0,NULL,NULL,0),(151,3,'Niaqu',19,28,'1980',NULL,NULL,NULL,'OUI',NULL,0,NULL,NULL,0),(152,3,'Illuqumajanuarmatuk',22,30,'1975',NULL,NULL,NULL,'OUI',NULL,0,NULL,NULL,0),(153,3,'Illuquma (texte)',22,30,'1975',NULL,NULL,NULL,'OUI',NULL,0,NULL,NULL,0),(154,3,'Qiarpaa (avec ustensile)',20,27,'1977',NULL,NULL,NULL,'OUI',NULL,0,NULL,NULL,0),(155,3,'Niaqu',19,28,'1980',NULL,NULL,NULL,'OUI',NULL,0,NULL,NULL,0),(156,3,'Aqittuq',19,28,'1980',NULL,NULL,NULL,'OUI',NULL,0,NULL,NULL,0),(157,3,'Marmatuq (texte)',21,25,'1976',NULL,NULL,NULL,'OUI',NULL,0,NULL,NULL,0),(158,3,'Pirqusiqtuk',21,25,'1977',NULL,NULL,NULL,'OUI',NULL,0,NULL,NULL,0),(159,3,'Iurnaaq',19,28,'1980',NULL,NULL,NULL,'OUI',NULL,0,NULL,NULL,0),(160,3,'Qiarvaktuk',22,30,'1975',NULL,NULL,NULL,'OUI',NULL,0,NULL,NULL,0),(161,3,'Qiarpa',19,27,'1980',NULL,NULL,NULL,'OUI',NULL,0,NULL,NULL,0),(162,3,'Quananau',21,29,'1977',NULL,NULL,NULL,'OUI',NULL,0,NULL,NULL,0),(163,3,'Hiqnaqtuq',22,30,'1975',NULL,NULL,NULL,'OUI',NULL,0,NULL,NULL,0),(164,3,'Qiarpaa',20,27,'1977',NULL,NULL,NULL,'OUI',NULL,0,NULL,NULL,0),(165,3,'Siurnaqtuq',22,31,'1977',NULL,NULL,NULL,'OUI',NULL,0,NULL,NULL,0),(166,3,'Iqusuttak',19,28,'1980',NULL,NULL,NULL,'OUI',NULL,0,NULL,NULL,0),(167,3,'Illuqumajumuarmatuk',22,30,'1975',NULL,NULL,NULL,'OUI',NULL,0,NULL,NULL,0),(168,3,'Niaqu (texte)',19,28,'1980',NULL,NULL,NULL,'OUI',NULL,0,NULL,NULL,0),(169,3,'Niaqu (avec ustensile)',19,28,'1980',NULL,NULL,NULL,'OUI',NULL,0,NULL,NULL,0),(170,3,'Niakorniartuk',23,31,'1960',NULL,NULL,NULL,'OUI',NULL,0,NULL,NULL,0),(171,3,'Qiarpalik',24,32,'1978',NULL,NULL,NULL,'OUI',NULL,0,NULL,NULL,0),(172,3,'Qattipaartuk',21,25,'1976',NULL,NULL,NULL,'OUI',NULL,0,NULL,NULL,0),(173,3,'Qatsivaaq',20,27,'1980',NULL,NULL,NULL,'OUI',NULL,0,NULL,NULL,0),(174,3,'Qattipaartuk',21,25,'1976',NULL,NULL,NULL,'OUI',NULL,0,NULL,NULL,0),(175,4,'Pisiq with drum and women chorus',21,29,'1977',NULL,'H├⌐t├⌐rophonie','Tambour','NON',NULL,0,NULL,NULL,0),(176,4,'Three Pisiit linked together',21,25,'1976',NULL,NULL,NULL,'NON',NULL,0,NULL,NULL,0),(177,4,'Pisiit',21,33,'1985',NULL,NULL,NULL,'NON',NULL,0,NULL,NULL,0),(178,4,'Pisiit',21,25,'1976',NULL,NULL,NULL,'NON',NULL,0,NULL,NULL,0),(179,4,'Pisiq',21,29,'1977',NULL,NULL,NULL,'NON',NULL,0,NULL,NULL,0),(180,4,'Iviuti (Tournament song)',21,29,'1977',NULL,NULL,NULL,'NON',NULL,0,NULL,NULL,0),(181,4,'Iviuti',21,29,'1977',NULL,NULL,NULL,'NON',NULL,0,NULL,NULL,0),(182,4,'Three pisiit',25,33,'1964',NULL,NULL,NULL,'NON',NULL,0,NULL,NULL,0),(183,4,'Pisiq',21,34,'1978',NULL,NULL,NULL,'NON',NULL,0,NULL,NULL,0),(184,4,'Pisiq',21,34,'1978',NULL,NULL,NULL,'NON',NULL,0,NULL,NULL,0),(185,4,'Three pisiit',25,33,'1964',NULL,NULL,NULL,'NON',NULL,0,NULL,NULL,0),(186,4,'Three pisiit',25,33,'1964',NULL,NULL,NULL,'NON',NULL,0,NULL,NULL,0),(187,4,'Pisiq',21,33,'1985',NULL,NULL,NULL,'NON',NULL,0,NULL,NULL,0),(188,4,'Modern pisiq',21,25,'1976',NULL,NULL,NULL,'NON',NULL,0,NULL,NULL,0),(189,4,'Religious song',21,25,'1976',NULL,NULL,NULL,'NON',NULL,0,NULL,NULL,0),(190,4,'Anglican hymn',21,25,'1976',NULL,NULL,NULL,'NON',NULL,0,NULL,NULL,0),(191,4,'Sakausiq',21,34,'1978',NULL,NULL,NULL,'NON',NULL,0,NULL,NULL,0),(192,4,'Sakausiq',21,34,'1978',NULL,NULL,NULL,'NON',NULL,0,NULL,NULL,0),(193,4,'Sakausiq',21,34,'1978',NULL,NULL,NULL,'NON',NULL,0,NULL,NULL,0),(194,4,'Sakausiq',21,34,'1978',NULL,NULL,NULL,'NON',NULL,0,NULL,NULL,0),(195,4,'Sakausiq',21,25,'1976',NULL,NULL,NULL,'NON',NULL,0,NULL,NULL,0),(196,4,'Sakausiit',21,25,'1977',NULL,NULL,NULL,'NON',NULL,0,NULL,NULL,0),(197,4,'Sakausiq',21,34,'1978',NULL,NULL,NULL,'NON',NULL,0,NULL,NULL,0),(198,4,'Sakausiq from a narration by Letia Panikpakutsuk',21,25,'1977',NULL,NULL,NULL,'NON',NULL,0,NULL,NULL,0),(199,4,'Sakausiq',21,34,'1978',NULL,NULL,NULL,'NON',NULL,0,NULL,NULL,0),(200,4,'Sakausiq',21,34,'1978',NULL,NULL,NULL,'NON',NULL,0,NULL,NULL,0),(201,4,'Sakausiq',21,34,'1978',NULL,NULL,NULL,'NON',NULL,0,NULL,NULL,0),(202,4,'Sakausiq',21,29,'1977',NULL,NULL,NULL,'NON',NULL,0,NULL,NULL,0),(203,4,'Chant',21,34,'1978',NULL,NULL,NULL,'NON',NULL,0,NULL,NULL,0),(204,4,'Chant',21,29,'1977',NULL,NULL,NULL,'NON',NULL,0,NULL,NULL,0),(205,4,'Chant',21,34,'1978',NULL,NULL,NULL,'NON',NULL,0,NULL,NULL,0),(206,4,'Chant',21,34,'1978',NULL,NULL,NULL,'NON',NULL,0,NULL,NULL,0),(207,4,'Chant',21,34,'1978',NULL,NULL,NULL,'NON',NULL,0,NULL,NULL,0),(208,4,'Chant',21,25,'1976',NULL,NULL,NULL,'NON',NULL,0,NULL,NULL,0),(209,4,'Lullaby',21,29,'1977',NULL,NULL,NULL,'NON',NULL,0,NULL,NULL,0),(210,4,'Lullaby',21,33,'1985',NULL,NULL,NULL,'NON',NULL,0,NULL,NULL,0),(211,4,'Aqausiq',21,33,'1985',NULL,NULL,NULL,'NON',NULL,0,NULL,NULL,0),(212,4,'Three aqausiit composed for Nanau Koonoo and Uturqa',21,25,'1976',NULL,NULL,NULL,'NON',NULL,0,NULL,NULL,0),(213,4,'Hide and seek song',21,29,'1977',NULL,NULL,NULL,'NON',NULL,0,NULL,NULL,0),(214,4,'String game song',21,25,'1977',NULL,NULL,NULL,'NON',NULL,0,NULL,NULL,0),(215,4,'Juggling song',21,33,'1985',NULL,NULL,NULL,'NON',NULL,0,NULL,NULL,0),(216,4,'Tivajug',21,25,'1976',NULL,NULL,NULL,'NON',NULL,0,NULL,NULL,0),(217,4,'Qatipartuq',21,29,'1977',NULL,NULL,NULL,'NON',NULL,0,NULL,NULL,0),(218,4,'Qatipartuq',21,29,'1977',NULL,NULL,NULL,'NON',NULL,0,NULL,NULL,0),(219,4,'Qiarpalik',21,29,'1977',NULL,NULL,NULL,'NON',NULL,0,NULL,NULL,0),(220,4,'Qiarpalik',21,29,'1977',NULL,NULL,NULL,'NON',NULL,0,NULL,NULL,0),(221,4,'Quananau',21,29,'1977',NULL,NULL,NULL,'NON',NULL,0,NULL,NULL,0),(222,4,'Huangahaaq',21,29,'1977',NULL,NULL,NULL,'NON',NULL,0,NULL,NULL,0),(223,4,'Marmatuq',21,29,'1977',NULL,NULL,NULL,'NON',NULL,0,NULL,NULL,0),(224,4,'Nirdliruyartuk (Throat-games)',21,25,'1977',NULL,NULL,NULL,'NON',NULL,0,NULL,NULL,0),(225,4,'From ┬½The grand-mother and the son┬╗',21,29,'1977',NULL,NULL,NULL,'NON',NULL,0,NULL,NULL,0),(226,4,'From ┬½The whale, the sea scorpion, and the eagle that married human wives┬╗',21,29,'1977',NULL,NULL,NULL,'NON',NULL,0,NULL,NULL,0),(227,5,'Three Katajjait from Baffin Land',21,26,'1976',NULL,NULL,NULL,'NON',NULL,0,NULL,NULL,0),(228,5,'Illukitaaruti (Juggling song) from Baffin Land',21,26,'1976',NULL,NULL,NULL,'NON',NULL,0,NULL,NULL,0),(229,5,'Katajjaq from Hudson Bay',21,35,'1976',NULL,NULL,NULL,'NON',NULL,0,NULL,NULL,0),(230,5,'Katajjaq from Baffin Land',21,26,'1976',NULL,NULL,NULL,'NON','1',0,NULL,NULL,0),(231,5,'Katajjaq from Ungava Bay',21,36,'1976',NULL,NULL,NULL,'NON','1',0,NULL,NULL,0),(232,5,'About Animals - Aqausiq from Ungava Bay',21,36,'1976',NULL,NULL,NULL,'NON','2',0,NULL,NULL,0),(233,5,'About Animals - Song accompanying a string game from Baffin Land',21,26,'1976',NULL,NULL,NULL,'NON','2',0,NULL,NULL,0),(234,5,'Katajjait on \"hamma\"  from Baffin Land',21,26,'1976',NULL,NULL,NULL,'NON','3',0,NULL,NULL,0),(235,5,'Katajjait on \"hamma\" from Hudson Bay',21,35,'1976',NULL,NULL,NULL,'NON','3',0,NULL,NULL,0),(236,5,'Katajjait on \"hamma\"  from Baffin Land',21,36,'1976',NULL,NULL,NULL,'NON','3',0,NULL,NULL,0),(237,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,NULL,0);
/*!40000 ALTER TABLE `master` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `metadata`
--

DROP TABLE IF EXISTS `metadata`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `metadata` (
  `last-update` timestamp NULL DEFAULT NULL,
  `data` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `metadata`
--

LOCK TABLES `metadata` WRITE;
/*!40000 ALTER TABLE `metadata` DISABLE KEYS */;
/*!40000 ALTER TABLE `metadata` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `regions`
--

DROP TABLE IF EXISTS `regions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `regions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `Champ1` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `R├⌐gions` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `regions`
--

LOCK TABLES `regions` WRITE;
/*!40000 ALTER TABLE `regions` DISABLE KEYS */;
INSERT INTO `regions` VALUES (1,'Delta du Mackenzie',NULL),(2,'Cuivre',NULL),(3,'Netsilik',NULL),(4,'Iglulik',NULL),(5,'Terre de Baffin',NULL),(6,'Caribou',NULL),(7,'Sallirmiut',NULL),(8,'Ungava',NULL),(9,'C├┤te du Labrador',NULL),(10,'Groenland Est','Tunu'),(11,'Groenland Sud','Kujalleq'),(12,'Groenland Centre-Ouest',NULL),(13,'Uummannaq-Upernavik','Upernavik Archipelago'),(14,'Groenland Nord',NULL);
/*!40000 ALTER TABLE `regions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `id` int(10) NOT NULL,
  `name` varchar(50) NOT NULL,
  `email` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (0,'drivas','rivasdaniel1992@gmail.com');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `villes`
--

DROP TABLE IF EXISTS `villes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `villes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `autre_nom` varchar(255) DEFAULT NULL,
  `coordonnees` varchar(255) DEFAULT NULL,
  `region` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `autre_nom` (`autre_nom`),
  UNIQUE KEY `nom` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=37 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `villes`
--

LOCK TABLES `villes` WRITE;
/*!40000 ALTER TABLE `villes` DISABLE KEYS */;
INSERT INTO `villes` VALUES (1,'Puvirnituq',NULL,'60.037818, -77.265300',8),(2,'Kulusuk',NULL,'65.575483, -37.182757',10),(3,'Trinteqilaaq',NULL,'65.883491, -37.765076',10),(4,'Kuummiut',NULL,'65.858344, -37.007936',10),(5,'Tasiilaq','Angmagssalik','65.613549, -37.635469',10),(6,'Sermiligaaq',NULL,'65.903900, -36.373844',10),(7,'Umiivik',NULL,'68.533498, -52.816795',11),(8,'Ammassivik',NULL,'60.606706, -45.382507',11),(9,'Nanortalik',NULL,'60.142593, -45.241442',11),(10,'Illorpaat',NULL,'60.466675, -45.370287',11),(11,'Itilleq',' Itivdleq','66.577647, -53.421162',11),(12,'Alluitsup Paa','Sydpr├╕ven','60.464862, -45.566398',11),(13,'Aasiast',NULL,'68.709643, -52.868786',12),(14,'Qaarsut','Qaersut','70.715839, -52.618622',13),(15,'Uummannatsasq',NULL,NULL,13),(16,'Illorsuit','Igdlorssuit','71.238059, -53.519485',13),(17,'Kangersuatsiaq','Pr├╕ven','72.379735, -55.550086',13),(18,'Ikerasak',NULL,'70.494305, -51.328678',13),(19,'Kullorsuaq',NULL,'74.580148, -57.229901',13),(20,'Qaanaaq',NULL,'77.467094, -69.227600',14),(21,'Qeqertarsuaq',NULL,'69.243750, -53.540775',14),(22,'Kugluktuk','Coppermine','67.825392, -115.094041',2),(23,'Pituffik','Dundas','76.527197, -68.844506',14),(24,'Siorapaluk',NULL,'77.778162, -70.810490',14),(25,'Pond Inlet',NULL,'72.699978, -77.950895',4),(26,'Cape Dorset',NULL,'64.230448, -76.542512',5),(27,'Arviat','Eskimo Point','61.106747, -94.062531',6),(28,'Taloyoak','Spence Bay','69.537482, -93.525133',3),(29,'Igloolik',NULL,'69.372386, -81.822848',4),(30,'Uqsuqtuuq','Gjoa Haven','68.635349, -95.848123',3),(31,'Kugaaruk','Pelly Bay','68.534675, -89.824412',3),(32,'Ivujivik',NULL,'62.416508, -77.917043',5),(33,'Arctic Bay',NULL,'73.037901, -85.134534',4),(34,'Montr├⌐al',NULL,'45.500258, -73.565141',4),(35,'Sanikiluaq',NULL,'56.540752, -79.230442',5),(36,'Kangirsuk','Payne Bay','60.023433, -70.031980',9);
/*!40000 ALTER TABLE `villes` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2015-08-20 22:02:14
