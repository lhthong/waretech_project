-- MySQL dump 10.13  Distrib 8.0.41, for Win64 (x86_64)
--
-- Host: localhost    Database: kho_hang_db
-- ------------------------------------------------------
-- Server version	8.0.41

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `banners`
--

DROP TABLE IF EXISTS `banners`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `banners` (
  `id` int NOT NULL AUTO_INCREMENT,
  `image_url` varchar(255) NOT NULL,
  `is_active` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `banners`
--

LOCK TABLES `banners` WRITE;
/*!40000 ALTER TABLE `banners` DISABLE KEYS */;
INSERT INTO `banners` VALUES (8,'/uploads/banners/1748446280604-175965824.jpg',0),(9,'/uploads/banners/1748446803980-129537675.jpg',1),(10,'/uploads/banners/1748446810374-330961433.jpg',1);
/*!40000 ALTER TABLE `banners` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cart_items`
--

DROP TABLE IF EXISTS `cart_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cart_items` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `product_id` int NOT NULL,
  `quantity` int NOT NULL DEFAULT '1',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_user_product` (`user_id`,`product_id`),
  KEY `product_id` (`product_id`),
  CONSTRAINT `cart_items_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`iduser`),
  CONSTRAINT `cart_items_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=59 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cart_items`
--

LOCK TABLES `cart_items` WRITE;
/*!40000 ALTER TABLE `cart_items` DISABLE KEYS */;
INSERT INTO `cart_items` VALUES (46,24,20,2,'2025-06-14 10:08:01','2025-06-18 22:45:36'),(53,43,23,1,'2025-07-12 11:16:28','2025-07-12 11:16:28');
/*!40000 ALTER TABLE `cart_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categories` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'ID danh mục',
  `categorie_name` varchar(100) DEFAULT NULL,
  `icon` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `categorie_name` (`categorie_name`)
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` VALUES (1,'Điện Thoại','FaMobileAlt'),(2,'Laptop','FaLaptop'),(8,'Tai Nghe','FaHeadphones'),(19,'Chuột','FaMouse'),(20,'Đồng Hồ','FaClock'),(21,'Sạc Dự Phòng','FaBatteryFull'),(22,'Bàn Phím','FaKeyboard'),(23,'Máy Ảnh','FaCamera');
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `faq`
--

DROP TABLE IF EXISTS `faq`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `faq` (
  `id` int NOT NULL AUTO_INCREMENT,
  `question` text NOT NULL,
  `answer` text NOT NULL,
  `keywords` text,
  `alternative_questions` text,
  `status` tinyint(1) DEFAULT '1',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `faq`
--

LOCK TABLES `faq` WRITE;
/*!40000 ALTER TABLE `faq` DISABLE KEYS */;
INSERT INTO `faq` VALUES (1,'Bảo hành sản phẩm thế nào?','Sản phẩm được bảo hành 12 tháng tại trung tâm WareTech.','bảo hành, sản phẩm','Làm sao để bảo hành? Chính sách bảo hành ra sao?',1,'2025-06-04 06:23:50','2025-06-07 10:58:37'),(5,'Chính sách đổi trả như thế nào?','Bạn có thể đổi trả sản phẩm trong vòng 7 ngày kể từ ngày nhận hàng, nếu sản phẩm còn nguyên tem và chưa sử dụng.','đổi trả, hoàn hàng, hoàn tiền','Tôi muốn đổi hàng thì sao? Có được trả lại hàng không? Hoàn tiền như thế nào?',1,'2025-06-04 06:46:23','2025-06-30 10:58:06'),(6,'Có những phương thức thanh toán nào?','Chúng tôi chấp nhận thanh toán qua Momo và tiền mặt khi nhận hàng.','thanh toán, momo, tiền mặt','Tôi có thể thanh toán qua ví điện tử không? Có nhận tiền mặt khi giao hàng không? Các hình thức thanh toán?',1,'2025-06-07 03:51:15','2025-06-07 03:51:15'),(7,'Phí giao hàng được tính như thế nào?','Phí giao hàng được tính theo khoảng cách và trọng lượng đơn hàng, hiển thị rõ trước khi thanh toán.','giao hàng, phí ship, vận chuyển','Phí ship là bao nhiêu? Tôi phải trả phí giao hàng không? Cách tính phí vận chuyển?',1,'2025-06-07 03:52:39','2025-06-07 03:52:39'),(9,'Có chương trình khuyến mãi nào không?','Chúng tôi thường có các chương trình khuyến mãi vào dịp lễ, bạn có thể theo dõi trang web để cập nhật thông tin mới nhất.','khuyến mãi, giảm giá, chương trình','Khi nào có khuyến mãi? Có mã giảm giá không? Làm thế nào để nhận khuyến mãi?',0,'2025-06-30 11:11:57','2025-06-30 18:12:15');
/*!40000 ALTER TABLE `faq` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `featured_products`
--

DROP TABLE IF EXISTS `featured_products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `featured_products` (
  `id` int NOT NULL AUTO_INCREMENT,
  `product_id` int NOT NULL,
  `type` enum('featured','new') NOT NULL,
  `priority` int DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `product_id` (`product_id`),
  CONSTRAINT `featured_products_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `featured_products`
--

LOCK TABLES `featured_products` WRITE;
/*!40000 ALTER TABLE `featured_products` DISABLE KEYS */;
INSERT INTO `featured_products` VALUES (2,21,'featured',1),(3,22,'featured',4),(5,23,'featured',3),(6,23,'new',5),(7,24,'featured',5),(8,20,'featured',6),(9,20,'new',1),(10,21,'new',2),(11,25,'new',3),(12,27,'new',4);
/*!40000 ALTER TABLE `featured_products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_details`
--

DROP TABLE IF EXISTS `order_details`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_details` (
  `id` int NOT NULL AUTO_INCREMENT,
  `don_hang_id` int DEFAULT NULL,
  `product_id` int DEFAULT NULL,
  `so_luong` int DEFAULT NULL,
  `tong_tien` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `don_hang_id` (`don_hang_id`),
  KEY `product_id` (`product_id`),
  CONSTRAINT `order_details_ibfk_1` FOREIGN KEY (`don_hang_id`) REFERENCES `orders` (`id`),
  CONSTRAINT `order_details_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=101 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_details`
--

LOCK TABLES `order_details` WRITE;
/*!40000 ALTER TABLE `order_details` DISABLE KEYS */;
INSERT INTO `order_details` VALUES (3,2,21,1,5405000),(4,2,20,2,10258000),(5,3,23,1,1100000),(6,3,22,2,5038000),(7,4,25,1,115000),(8,4,24,2,460000),(9,5,27,1,3450000),(10,5,26,1,200000),(11,6,26,1,200000),(12,7,25,1,115000),(13,7,24,1,230000),(14,8,26,1,200000),(15,9,24,1,230000),(16,10,24,3,690000),(17,11,24,4,920000),(18,13,20,1,5129000),(19,17,20,2,10258000),(20,19,20,1,5129000),(21,20,22,1,2519000),(22,21,24,3,690000),(23,22,27,1,3450000),(24,23,23,2,2200000),(25,24,24,4,920000),(26,25,23,2,2200000),(27,26,27,2,6900000),(28,27,26,2,400000),(29,28,21,1,5405000),(30,29,25,5,575000),(31,30,24,5,1150000),(32,31,24,4,920000),(33,32,24,4,920000),(34,33,24,4,920000),(35,34,24,4,920000),(36,35,22,1,2519000),(37,36,21,1,5405000),(38,37,24,4,920000),(39,38,26,3,600000),(40,39,25,5,575000),(41,40,20,1,5129000),(42,41,20,1,5129000),(43,42,20,1,5129000),(44,43,25,1,115000),(45,43,24,1,230000),(46,44,26,1,200000),(47,44,25,1,115000),(48,44,24,1,230000),(49,45,25,7,805000),(50,46,24,4,920000),(51,47,26,3,600000),(52,48,26,3,600000),(53,49,26,3,600000),(54,50,20,1,5129000),(55,51,21,1,5405000),(56,52,31,1,4025000),(57,53,31,1,4025000),(58,54,31,1,4025000),(59,55,31,1,4025000),(60,56,31,1,4025000),(61,57,25,1,115000),(62,58,31,1,4025000),(63,59,31,1,4025000),(64,60,31,1,4025000),(65,61,25,1,115000),(66,62,20,1,5129000),(67,63,26,1,3450000),(68,64,21,1,5405000),(69,65,21,1,5405000),(70,66,20,1,5129000),(71,67,27,1,3450000),(72,68,29,1,11500000),(73,69,28,1,9200000),(74,70,27,1,3450000),(75,71,25,1,115000),(76,72,35,1,15345000),(77,73,24,1,230000),(78,74,24,1,230000),(79,75,24,1,230000),(80,76,22,1,2519000),(81,77,25,1,115000),(82,78,25,2,230000),(83,79,24,1,230000),(84,80,25,1,115000),(85,81,24,1,230000),(86,82,25,1,115000),(87,83,24,1,230000),(88,84,24,1,230000),(89,85,24,2,460000),(90,86,24,3,690000),(91,87,24,3,690000),(92,88,22,1,2519000),(93,89,21,1,5405000),(94,90,25,1,115000),(95,91,25,1,115000),(96,92,25,1,115000),(97,93,30,1,5750000),(98,94,22,1,2519000),(99,95,28,1,9200000),(100,96,28,1,9200000);
/*!40000 ALTER TABLE `order_details` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders` (
  `id` int NOT NULL AUTO_INCREMENT,
  `ma_don_hang` varchar(50) DEFAULT NULL,
  `user_id` int DEFAULT NULL,
  `trang_thai` enum('choxacnhan','daxacnhan','danggiao','hoanthanh','dahuy') DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `tong_tien` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `ma_don_hang` (`ma_don_hang`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`iduser`)
) ENGINE=InnoDB AUTO_INCREMENT=97 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` VALUES (2,'DH-1747967380159',24,'danggiao','2025-05-22 19:29:40',15663000),(3,'DH-1747968124021',24,'hoanthanh','2025-05-22 19:42:04',6138000),(4,'DH-1747968274665',24,'dahuy','2025-05-22 19:44:35',575000),(5,'DH-1748302747721',24,'daxacnhan','2025-05-26 16:39:08',3650000),(6,'DH-1748303826345',24,'daxacnhan','2025-05-26 16:57:06',200000),(7,'DH-1748402548585',24,'choxacnhan','2025-05-27 20:22:29',345000),(8,'DH-1748415157443',24,'daxacnhan','2025-05-27 23:52:37',200000),(9,'DH-1748507689369',24,'daxacnhan','2025-05-29 01:34:49',230000),(10,'DH-1748508229571',24,'daxacnhan','2025-05-29 01:43:50',690000),(11,'DH-1748561676117',24,'daxacnhan','2025-05-29 16:34:36',920000),(13,'DH-1748594332499',24,'choxacnhan','2025-05-30 01:38:53',5149000),(17,'DH-1748600164694',24,'choxacnhan','2025-05-30 03:16:05',10278000),(19,'DH-1748603439977',24,'daxacnhan','2025-05-30 04:10:40',5129828),(20,'DH-1748604848600',24,'daxacnhan','2025-05-30 04:34:09',2519828),(21,'DH-1748605126677',24,'dahuy','2025-05-30 04:38:47',690828),(22,'DH-1748614166217',24,'daxacnhan','2025-05-30 07:09:26',3450828),(23,'DH-1748614370650',24,'choxacnhan','2025-05-30 07:12:51',2200828),(24,'DH-1748650355927',24,'daxacnhan','2025-05-30 17:12:36',920828),(25,'DH-1748650654617',24,'daxacnhan','2025-05-30 17:17:35',2200828),(26,'DH-1748658485512',24,'daxacnhan','2025-05-30 19:28:06',6900828),(27,'DH-1748658678108',24,'daxacnhan','2025-05-30 19:31:18',400828),(28,'DH-1748659180150',24,'choxacnhan','2025-05-30 19:39:40',5405828),(29,'DH-1748659612423',24,'daxacnhan','2025-05-30 19:46:52',575828),(30,'DH-1748659796041',24,'daxacnhan','2025-05-30 19:49:56',1181242),(31,'DH-1748662454715',24,'choxacnhan','2025-05-30 20:34:15',920828),(32,'DH-1748662718077',24,'choxacnhan','2025-05-30 20:38:38',920828),(33,'DH-1748662898217',24,'choxacnhan','2025-05-30 20:41:38',920828),(34,'DH-1748663146870',24,'hoanthanh','2025-05-30 20:45:47',920828),(35,'DH-1748668180171',24,'daxacnhan','2025-05-30 22:09:40',2519828),(36,'DH-1748669565233',24,'daxacnhan','2025-05-30 22:32:45',5405828),(37,'DH-1748675083208',24,'daxacnhan','2025-05-31 00:04:43',920828),(38,'DH-1748675479194',24,'daxacnhan','2025-05-31 00:11:19',600828),(39,'DH-1748676685967',24,'daxacnhan','2025-05-31 00:31:26',575828),(40,'DH-1748677050290',24,'choxacnhan','2025-05-31 00:37:30',5129828),(41,'DH-1748677235749',24,'choxacnhan','2025-05-31 00:40:36',5129828),(42,'DH-1748677477856',24,'choxacnhan','2025-05-31 00:44:38',5129828),(43,'DH-1748766950164',24,'daxacnhan','2025-06-01 01:35:50',376242),(44,'DH-1748795066719',24,'hoanthanh','2025-06-01 09:24:27',576242),(45,'DH-1748833509597',24,'hoanthanh','2025-06-01 20:05:10',836242),(46,'DH-1748833684854',24,'hoanthanh','2025-06-01 20:08:05',951242),(47,'DH-1748908214063',24,'dahuy','2025-06-02 16:50:14',631242),(48,'DH-1748908372496',24,'dahuy','2025-06-02 16:52:53',631242),(49,'DH-1748908942091',24,'hoanthanh','2025-06-02 17:02:22',631242),(50,'DH-1748910172815',24,'hoanthanh','2025-06-02 17:22:53',5160242),(51,'DH-1748913262854',24,'hoanthanh','2025-06-02 18:14:23',5436242),(52,'DH-1749688473982',24,'hoanthanh','2025-06-11 17:34:34',4056242),(53,'DH-1749688645276',24,'choxacnhan','2025-06-11 17:37:25',4056242),(54,'DH-1749688997865',24,'choxacnhan','2025-06-11 17:43:18',4056242),(55,'DH-1749689140955',24,'choxacnhan','2025-06-11 17:45:41',4056242),(56,'DH-1749689369722',24,'choxacnhan','2025-06-11 17:49:30',4056242),(57,'DH-1749689713957',24,'daxacnhan','2025-06-11 17:55:14',146242),(58,'DH-1749689824547',24,'daxacnhan','2025-06-11 17:57:05',4025828),(59,'DH-1749696471507',24,'daxacnhan','2025-06-11 19:47:52',4025828),(60,'DH-1749710991173',24,'hoanthanh','2025-06-11 23:49:51',4056242),(61,'DH-1749790540666',24,'hoanthanh','2025-06-12 21:55:41',115828),(62,'DH-1749797523315',24,'choxacnhan','2025-06-12 23:52:03',5151703),(63,'DH-1749798963269',24,'dahuy','2025-06-13 00:16:03',3450828),(64,'DH-1749800244222',24,'dahuy','2025-06-13 00:37:24',5427703),(65,'DH-1749800380019',24,'dahuy','2025-06-13 00:39:40',5405828),(66,'DH-1749800996699',24,'daxacnhan','2025-06-13 00:49:57',5149000),(67,'DH-1749820286621',24,'hoanthanh','2025-06-13 06:11:27',3472703),(68,'DH-1749829427129',24,'daxacnhan','2025-06-13 08:43:47',11500828),(69,'DH-1749829753864',24,'daxacnhan','2025-06-13 08:49:14',9200828),(70,'DH-1749830008931',24,'dahuy','2025-06-13 08:53:29',3450828),(71,'DH-1749830144739',24,'daxacnhan','2025-06-13 08:55:45',137703),(72,'DH-1750216611221',24,'hoanthanh','2025-06-17 20:16:51',15345828),(73,'DH-1751874407721',43,'dahuy','2025-07-07 00:46:48',230828),(74,'DH-1751874704199',43,'dahuy','2025-07-07 00:51:44',230828),(75,'DH-1751875004443',43,'daxacnhan','2025-07-07 00:56:44',230828),(76,'DH-1751881119300',43,'dahuy','2025-07-07 02:38:39',2519828),(77,'DH-1751881682350',43,'dahuy','2025-07-07 02:48:02',115828),(78,'DH-1751882231175',43,'dahuy','2025-07-07 02:57:11',230828),(79,'DH-1751883313459',43,'daxacnhan','2025-07-07 03:15:13',230828),(80,'DH-1751884416593',43,'hoanthanh','2025-07-07 03:33:37',115828),(81,'DH-1751899230381',24,'hoanthanh','2025-07-07 07:40:30',250000),(82,'DH-1751981878265',24,'hoanthanh','2025-07-08 06:37:58',115828),(83,'DH-1751984391993',24,'hoanthanh','2025-07-08 07:19:52',230828),(84,'DH-1752136425971',44,'hoanthanh','2025-07-10 01:33:46',230828),(85,'DH-1752136754443',44,'hoanthanh','2025-07-10 01:39:14',491242),(86,'DH-1752137508338',44,'hoanthanh','2025-07-10 01:51:48',721242),(87,'DH-1752139024724',24,'hoanthanh','2025-07-10 02:17:05',721242),(88,'DH-1752140090279',24,'hoanthanh','2025-07-10 02:34:50',2550242),(89,'DH-1752142932822',43,'dahuy','2025-07-10 03:22:13',5405828),(90,'DH-1752143186839',43,'dahuy','2025-07-10 03:26:27',115828),(91,'DH-1752143418849',43,'dahuy','2025-07-10 03:30:19',115828),(92,'DH-1752145611347',24,'hoanthanh','2025-07-10 04:06:51',115828),(93,'DH-1752318242134',43,'dahuy','2025-07-12 04:04:02',5781242),(94,'DH-1752318714997',43,'hoanthanh','2025-07-12 04:11:55',2519828),(95,'DH-1752319463163',43,'hoanthanh','2025-07-12 04:24:23',9231242),(96,'DH-1752321209684',43,'hoanthanh','2025-07-12 04:53:30',9231242);
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payments`
--

DROP TABLE IF EXISTS `payments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `don_hang_id` int DEFAULT NULL,
  `amount` int DEFAULT NULL,
  `method` enum('COD','Momo','Paypal') DEFAULT NULL,
  `status` enum('dangcho','dathanhtoan','loithanhtoan') DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `transaction_id` varchar(50) DEFAULT NULL,
  `bank_code` varchar(20) DEFAULT NULL,
  `pay_date` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `don_hang_id` (`don_hang_id`),
  CONSTRAINT `payments_ibfk_1` FOREIGN KEY (`don_hang_id`) REFERENCES `orders` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=161 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payments`
--

LOCK TABLES `payments` WRITE;
/*!40000 ALTER TABLE `payments` DISABLE KEYS */;
INSERT INTO `payments` VALUES (46,7,345000,'Momo','loithanhtoan','2025-05-27 22:13:42','4500342585',NULL,'2025-05-28 05:14:28'),(47,5,3650000,'Momo','dathanhtoan','2025-05-27 22:15:11','4500342618',NULL,'2025-05-28 05:16:03'),(51,8,200000,'Momo','dathanhtoan','2025-05-28 01:02:22','4500392983',NULL,'2025-05-28 08:06:09'),(52,6,200000,'COD','dathanhtoan','2025-05-28 01:24:50',NULL,NULL,'2025-05-28 08:28:22'),(55,10,690000,'Momo','dathanhtoan','2025-05-29 01:44:07','3304448113',NULL,'2025-05-29 08:44:56'),(56,11,920000,'Momo','loithanhtoan','2025-05-29 16:35:01','1748561714292',NULL,'2025-05-29 23:35:14'),(58,11,920000,'Momo','dathanhtoan','2025-05-29 19:35:48','3304453760',NULL,'2025-05-30 02:36:35'),(59,19,5129828,'Momo','dathanhtoan','2025-05-30 04:10:40','3304457746',NULL,'2025-05-30 11:11:32'),(60,20,2519828,'Momo','dathanhtoan','2025-05-30 04:34:09','3304457943',NULL,'2025-05-30 11:34:48'),(61,21,690828,'COD','dangcho','2025-05-30 04:38:47',NULL,NULL,NULL),(62,22,3450828,'Momo','dathanhtoan','2025-05-30 07:09:28','3304458750',NULL,'2025-05-30 14:10:24'),(63,23,2200828,'Momo','loithanhtoan','2025-05-30 07:12:53','1748614385006',NULL,'2025-05-30 14:13:05'),(64,24,920828,'Momo','dathanhtoan','2025-05-30 17:12:38','3304521322',NULL,'2025-05-31 00:14:08'),(65,25,2200828,'Momo','dathanhtoan','2025-05-30 17:17:37','3304521382',NULL,'2025-05-31 00:18:34'),(66,26,6900828,'Momo','dathanhtoan','2025-05-30 19:28:08','3304521881',NULL,'2025-05-31 02:29:31'),(67,27,400828,'Momo','dathanhtoan','2025-05-30 19:31:20','3304521938',NULL,'2025-05-31 02:31:35'),(68,28,5405828,'Momo','dangcho','2025-05-30 19:39:42',NULL,NULL,NULL),(69,29,575828,'Momo','dathanhtoan','2025-05-30 19:46:54','3304522000',NULL,'2025-05-31 02:47:29'),(70,30,1181242,'COD','dangcho','2025-05-30 19:49:58',NULL,NULL,NULL),(71,31,920828,'COD','dangcho','2025-05-30 20:34:17',NULL,NULL,NULL),(72,34,920828,'COD','dathanhtoan','2025-05-30 20:45:49',NULL,NULL,'2025-05-31 03:47:28'),(73,35,2519828,'Momo','dathanhtoan','2025-05-30 22:09:42','4501344076',NULL,'2025-05-31 05:11:08'),(74,36,5405828,'Momo','dathanhtoan','2025-05-30 22:32:47','4501351142',NULL,'2025-05-31 05:33:36'),(75,37,920828,'Momo','dathanhtoan','2025-05-31 00:04:45','4501377869',NULL,'2025-05-31 07:05:29'),(76,38,600828,'Momo','dathanhtoan','2025-05-31 00:11:21','4501379409',NULL,'2025-05-31 07:12:05'),(77,39,575828,'Momo','dathanhtoan','2025-05-31 00:31:28','4501385322',NULL,'2025-05-31 07:32:13'),(78,40,5129828,'Momo','loithanhtoan','2025-05-31 00:37:32','1748677062166',NULL,'2025-05-31 07:37:39'),(79,41,5129828,'Momo','loithanhtoan','2025-05-31 00:40:38','1748677246661',NULL,'2025-05-31 07:40:43'),(80,42,5129828,'Momo','loithanhtoan','2025-05-31 00:44:40','1748677497935',NULL,'2025-05-31 07:44:54'),(81,43,376242,'Momo','dathanhtoan','2025-06-01 01:35:53','3304529215',NULL,'2025-06-01 08:37:17'),(82,44,576242,'Momo','dathanhtoan','2025-06-01 09:24:29','3304600145',NULL,'2025-06-01 16:25:46'),(83,45,836242,'Momo','dathanhtoan','2025-06-01 20:05:12','3304602782',NULL,'2025-06-02 03:06:43'),(84,46,951242,'Momo','dathanhtoan','2025-06-01 20:08:07','3304602788',NULL,'2025-06-02 03:08:31'),(85,47,631242,'Momo','dangcho','2025-06-02 16:50:16',NULL,NULL,NULL),(86,48,631242,'Momo','dangcho','2025-06-02 16:52:55',NULL,NULL,NULL),(87,49,631242,'Momo','dathanhtoan','2025-06-02 17:02:24','4502543814',NULL,'2025-06-03 00:19:04'),(88,49,631242,'Momo','dangcho','2025-06-02 17:06:40',NULL,NULL,NULL),(89,49,631242,'Momo','dangcho','2025-06-02 17:11:20',NULL,NULL,NULL),(90,49,631242,'Momo','dangcho','2025-06-02 17:17:05',NULL,NULL,NULL),(91,50,5160242,'Momo','dathanhtoan','2025-06-02 17:22:55','4502545343',NULL,'2025-06-03 00:23:43'),(92,51,5436242,'Momo','dathanhtoan','2025-06-02 18:14:25','4502560481',NULL,'2025-06-03 01:15:16'),(93,52,4056242,'Momo','dathanhtoan','2025-06-11 17:34:36','4507431055',NULL,'2025-06-13 04:47:26'),(94,53,4056242,'Momo','loithanhtoan','2025-06-11 17:37:27','1749688912237',NULL,'2025-06-12 00:41:16'),(95,54,4056242,'Momo','loithanhtoan','2025-06-11 17:43:20','4506919519',NULL,'2025-06-12 00:44:25'),(96,55,4056242,'Momo','loithanhtoan','2025-06-11 17:45:43','4506779570',NULL,'2025-06-12 00:46:44'),(97,56,4056242,'Momo','loithanhtoan','2025-06-11 17:49:32','4506899535',NULL,'2025-06-12 00:51:06'),(98,57,146242,'Momo','dathanhtoan','2025-06-11 17:55:16','4506779649',NULL,'2025-06-12 00:55:37'),(99,58,4025828,'Momo','dathanhtoan','2025-06-11 17:57:07','4506919625',NULL,'2025-06-12 00:57:25'),(100,59,4025828,'Momo','dathanhtoan','2025-06-11 19:47:54','4506680611',NULL,'2025-06-12 02:49:11'),(101,60,4056242,'Momo','dathanhtoan','2025-06-11 23:49:53','4506682777',NULL,'2025-06-12 06:50:48'),(102,52,4056242,'Paypal','dangcho','2025-06-12 20:11:31','1YX89311U8539160T',NULL,NULL),(103,52,4056242,'Paypal','dangcho','2025-06-12 20:27:01','87U57914LP018245V',NULL,NULL),(104,52,4056242,'Paypal','dangcho','2025-06-12 20:38:20','73U674410E980720L',NULL,NULL),(105,52,4056242,'Paypal','dangcho','2025-06-12 20:38:45','2W60200548337783L',NULL,NULL),(106,52,4056242,'Paypal','dangcho','2025-06-12 21:14:47','42M49495X5343654L',NULL,NULL),(107,52,4056242,'Paypal','dangcho','2025-06-12 21:17:41','6SD38343M1685493S',NULL,NULL),(108,52,4056242,'Momo','dangcho','2025-06-12 21:38:51',NULL,NULL,NULL),(109,52,4056242,'Momo','dangcho','2025-06-12 21:42:50',NULL,NULL,NULL),(110,52,4056242,'Momo','dangcho','2025-06-12 21:43:05',NULL,NULL,NULL),(111,52,4056242,'Momo','dangcho','2025-06-12 21:46:01',NULL,NULL,NULL),(112,52,4056242,'Momo','dangcho','2025-06-12 21:46:56',NULL,NULL,NULL),(113,61,115828,'Momo','dathanhtoan','2025-06-12 21:55:43','4507480917',NULL,'2025-06-13 04:56:15'),(114,62,5151703,'Paypal','dangcho','2025-06-12 23:52:07','9J386829DS283841B',NULL,NULL),(115,63,3450828,'Paypal','dangcho','2025-06-13 00:16:08','2RL68256M8478354M',NULL,NULL),(116,65,5405828,'Paypal','dangcho','2025-06-13 00:39:44','6FM344699M2727804',NULL,NULL),(128,66,5149000,'Paypal','dathanhtoan','2025-06-13 03:00:12','8PM22919B8052872U',NULL,'2025-06-13 10:00:23'),(129,67,3472703,'Paypal','dathanhtoan','2025-06-13 06:11:29','3F435500FC419324S',NULL,'2025-06-13 13:12:41'),(130,68,11500828,'Paypal','dathanhtoan','2025-06-13 08:43:49','0TT21886L41240949',NULL,'2025-06-13 15:45:00'),(131,69,9200828,'Paypal','dathanhtoan','2025-06-13 08:49:16','8V7082854S740510R',NULL,'2025-06-13 15:50:04'),(132,70,3450828,'Momo','loithanhtoan','2025-06-13 08:53:31','1749830127129',NULL,'2025-06-13 15:54:48'),(133,71,137703,'Momo','dathanhtoan','2025-06-13 08:55:47','4507455307',NULL,'2025-06-13 15:56:22'),(134,72,15345828,'Paypal','dathanhtoan','2025-06-17 20:16:53','2TC09286GS8739608',NULL,'2025-06-18 03:17:20'),(135,73,230828,'Momo','dangcho','2025-07-07 00:46:50',NULL,NULL,NULL),(136,74,230828,'Momo','dangcho','2025-07-07 00:51:46',NULL,NULL,NULL),(137,75,230828,'Momo','dangcho','2025-07-07 00:56:47',NULL,NULL,NULL),(138,76,2519828,'Momo','dangcho','2025-07-07 02:38:41',NULL,NULL,NULL),(139,77,115828,'Momo','dangcho','2025-07-07 02:48:04',NULL,NULL,NULL),(140,78,230828,'Momo','dangcho','2025-07-07 02:57:13',NULL,NULL,NULL),(141,79,230828,'Momo','dangcho','2025-07-07 03:15:16',NULL,NULL,NULL),(142,80,115828,'Momo','dangcho','2025-07-07 03:33:39',NULL,NULL,NULL),(143,76,2519828,'Momo','dangcho','2025-07-07 06:59:59',NULL,NULL,NULL),(144,76,2519828,'Momo','dangcho','2025-07-07 07:08:05',NULL,NULL,NULL),(145,81,250000,'Momo','dangcho','2025-07-07 07:40:57',NULL,NULL,NULL),(146,82,115828,'Paypal','dathanhtoan','2025-07-08 06:38:00','2S795148HH090604E',NULL,'2025-07-08 13:38:45'),(147,83,230828,'Paypal','dathanhtoan','2025-07-08 07:19:54','8635298787600760J',NULL,'2025-07-08 14:20:16'),(148,84,230828,'Momo','dathanhtoan','2025-07-10 01:33:48','4538837600',NULL,'2025-07-10 08:34:46'),(149,85,491242,'Momo','dathanhtoan','2025-07-10 01:39:17','4538997617',NULL,'2025-07-10 08:42:31'),(150,86,721242,'Momo','dathanhtoan','2025-07-10 01:51:50','4539017751',NULL,'2025-07-10 08:53:32'),(151,87,721242,'Momo','dathanhtoan','2025-07-10 02:17:07','4539018025',NULL,'2025-07-10 09:18:58'),(152,88,2550242,'Momo','dathanhtoan','2025-07-10 02:34:52','4539137367',NULL,'2025-07-10 09:37:10'),(153,89,5405828,'Momo','dangcho','2025-07-10 03:22:15',NULL,NULL,NULL),(154,90,115828,'Momo','dangcho','2025-07-10 03:26:29',NULL,NULL,NULL),(155,91,115828,'Momo','dangcho','2025-07-10 03:30:21',NULL,NULL,NULL),(156,92,115828,'Momo','dathanhtoan','2025-07-10 04:06:53','4539757861',NULL,'2025-07-10 11:07:45'),(157,93,5781242,'Momo','dangcho','2025-07-12 04:04:04',NULL,NULL,NULL),(158,94,2519828,'Momo','dathanhtoan','2025-07-12 04:11:57','4541453664',NULL,'2025-07-12 11:12:39'),(159,95,9231242,'Momo','dathanhtoan','2025-07-12 04:24:25','4541313762',NULL,'2025-07-12 11:25:40'),(160,96,9231242,'Momo','dathanhtoan','2025-07-12 04:53:32','4541453805',NULL,'2025-07-12 11:54:26');
/*!40000 ALTER TABLE `payments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `phieu_nhap`
--

DROP TABLE IF EXISTS `phieu_nhap`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `phieu_nhap` (
  `id` int NOT NULL AUTO_INCREMENT,
  `product_id` int NOT NULL,
  `so_luong` int NOT NULL,
  `user_id` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `supplier_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_product_nhap` (`product_id`),
  KEY `user_id` (`user_id`),
  KEY `supplier_id` (`supplier_id`),
  CONSTRAINT `phieu_nhap_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE,
  CONSTRAINT `phieu_nhap_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`iduser`) ON DELETE CASCADE,
  CONSTRAINT `phieu_nhap_ibfk_3` FOREIGN KEY (`supplier_id`) REFERENCES `suppliers` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=39 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `phieu_nhap`
--

LOCK TABLES `phieu_nhap` WRITE;
/*!40000 ALTER TABLE `phieu_nhap` DISABLE KEYS */;
INSERT INTO `phieu_nhap` VALUES (7,20,400,24,'2025-04-23 01:26:13',3),(8,21,400,24,'2025-04-23 01:42:00',4),(10,26,300,24,'2025-04-24 23:39:31',3),(11,23,200,24,'2025-04-25 02:13:30',4),(12,24,300,24,'2025-04-26 17:38:54',4),(13,28,200,24,'2025-06-11 16:36:06',4),(14,25,400,24,'2025-06-11 16:37:30',4),(15,27,400,24,'2025-06-11 16:38:47',3),(16,29,200,24,'2025-06-11 16:46:13',4),(17,30,300,24,'2025-06-11 16:52:15',4),(18,31,300,24,'2025-06-11 16:59:48',3),(19,32,200,24,'2025-06-11 17:05:40',3),(20,33,300,24,'2025-06-11 17:12:41',3),(21,34,200,24,'2025-06-11 17:19:58',3),(23,35,100,24,'2025-06-11 17:26:34',3),(24,36,300,24,'2025-07-11 23:55:25',8),(25,37,399,24,'2025-07-12 00:00:39',9),(26,38,400,24,'2025-07-12 00:06:00',9),(27,39,350,24,'2025-07-12 00:09:23',8),(28,40,300,24,'2025-07-12 00:13:39',4),(30,41,400,24,'2025-07-12 00:19:10',10),(31,42,400,24,'2025-07-12 00:22:56',9),(32,43,400,24,'2025-07-12 00:27:09',7),(33,44,499,24,'2025-07-12 00:31:57',9),(34,45,300,24,'2025-07-12 00:35:10',3),(35,46,430,24,'2025-07-12 00:38:26',7),(36,47,476,24,'2025-07-12 00:43:49',8),(37,48,400,24,'2025-07-12 00:47:10',4),(38,49,200,24,'2025-07-12 00:49:52',4);
/*!40000 ALTER TABLE `phieu_nhap` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `update_stock_after_import` AFTER INSERT ON `phieu_nhap` FOR EACH ROW BEGIN
  UPDATE products
  SET stock_quantity = stock_quantity + NEW.so_luong
  WHERE id = NEW.product_id;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `update_stock_after_update_import` BEFORE UPDATE ON `phieu_nhap` FOR EACH ROW BEGIN
  DECLARE stock_difference INT;

  -- Tính chênh lệch số lượng (mới - cũ)
  SET stock_difference = NEW.so_luong - OLD.so_luong;

  -- Cập nhật lại tồn kho dựa trên chênh lệch số lượng
  UPDATE products
  SET stock_quantity = stock_quantity + stock_difference
  WHERE id = NEW.product_id;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `phieu_xuat`
--

DROP TABLE IF EXISTS `phieu_xuat`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `phieu_xuat` (
  `id` int NOT NULL AUTO_INCREMENT,
  `product_id` int NOT NULL,
  `so_luong` int NOT NULL,
  `user_id` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_product_xuat` (`product_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `phieu_xuat_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE,
  CONSTRAINT `phieu_xuat_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`iduser`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `phieu_xuat`
--

LOCK TABLES `phieu_xuat` WRITE;
/*!40000 ALTER TABLE `phieu_xuat` DISABLE KEYS */;
INSERT INTO `phieu_xuat` VALUES (6,20,300,24,'2025-04-23 01:26:31'),(8,22,200,24,'2025-04-23 16:10:35'),(9,26,200,24,'2025-04-24 23:46:41'),(12,28,50,24,'2025-06-11 16:36:28'),(13,36,100,24,'2025-07-11 23:55:42'),(14,37,100,24,'2025-07-12 00:00:51'),(15,38,199,24,'2025-07-12 00:06:09'),(16,39,100,24,'2025-07-12 00:09:35'),(17,40,150,24,'2025-07-12 00:14:04'),(18,41,150,24,'2025-07-12 00:19:16'),(19,42,100,24,'2025-07-12 00:23:14'),(20,43,230,24,'2025-07-12 00:27:25'),(21,44,200,24,'2025-07-12 00:32:12'),(22,45,50,24,'2025-07-12 00:35:18'),(23,46,149,24,'2025-07-12 00:38:43'),(24,47,156,24,'2025-07-12 00:44:05'),(25,48,234,24,'2025-07-12 00:47:21'),(26,49,100,24,'2025-07-12 00:50:00');
/*!40000 ALTER TABLE `phieu_xuat` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `check_stock_before_export` BEFORE INSERT ON `phieu_xuat` FOR EACH ROW BEGIN
  DECLARE current_stock INT;
  
  -- Lấy số lượng tồn kho hiện tại
  SELECT stock_quantity INTO current_stock FROM products WHERE id = NEW.product_id;
  
  -- Nếu tồn kho không đủ, báo lỗi và không cho phép xuất hàng
  IF current_stock < NEW.so_luong THEN
    SIGNAL SQLSTATE '45000' 
    SET MESSAGE_TEXT = 'Lỗi: Số lượng tồn kho không đủ!';
  END IF;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `update_stock_after_export` AFTER INSERT ON `phieu_xuat` FOR EACH ROW BEGIN
  UPDATE products
  SET stock_quantity = stock_quantity - NEW.so_luong
  WHERE id = NEW.product_id;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `update_stock_after_update_export` BEFORE UPDATE ON `phieu_xuat` FOR EACH ROW BEGIN
  DECLARE stock_difference INT;

  -- Tính chênh lệch số lượng (mới - cũ)
  SET stock_difference = OLD.so_luong - NEW.so_luong;

  -- Cập nhật lại tồn kho dựa trên chênh lệch số lượng
  UPDATE products
  SET stock_quantity = stock_quantity + stock_difference
  WHERE id = NEW.product_id;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `product_images`
--

DROP TABLE IF EXISTS `product_images`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_images` (
  `id` int NOT NULL AUTO_INCREMENT,
  `product_id` int DEFAULT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `is_main` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `product_id` (`product_id`),
  CONSTRAINT `product_images_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=274 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_images`
--

LOCK TABLES `product_images` WRITE;
/*!40000 ALTER TABLE `product_images` DISABLE KEYS */;
INSERT INTO `product_images` VALUES (123,20,'/uploads/product-images/86fbf845-0957-4708-9693-3cbc26290259.webp',1),(124,20,'/uploads/product-images/68dce683-49e0-421f-bd43-f8c8c5865936.webp',0),(125,20,'/uploads/product-images/8516cc6b-4a73-4e73-8940-519033b4bc19.webp',0),(127,20,'/uploads/product-images/0a1e7ac7-4a59-4511-8c91-36c68d967ed1.webp',0),(128,22,'/uploads/product-images/8a24ccdc-0b51-406c-ae94-e73b45624abd.webp',1),(129,22,'/uploads/product-images/edf74860-88eb-4cc6-9d5c-7e95b03ecaa6.webp',0),(130,22,'/uploads/product-images/33997543-bed1-4093-ac16-f4ac19ece4a6.webp',0),(131,23,'/uploads/product-images/39e14425-57fc-4980-b61f-79710cae8866.webp',1),(132,23,'/uploads/product-images/e97cf070-3252-4291-b450-adf18c44b981.webp',0),(133,23,'/uploads/product-images/01328b87-d390-4b7f-b18d-ffb4318db47d.webp',0),(134,23,'/uploads/product-images/111754c5-21e2-433f-9775-3f296b3ec9be.webp',0),(135,23,'/uploads/product-images/cb65b6e7-8513-4ee7-8b77-e984db06a325.webp',0),(136,24,'/uploads/product-images/59b3da57-7d35-40a4-afd9-3f1948645cca.webp',1),(137,24,'/uploads/product-images/76695f4f-deac-415c-a18e-10c26e66db33.webp',0),(138,24,'/uploads/product-images/208efe1e-618c-4a76-9dc2-6eaf69ffaed1.webp',0),(139,24,'/uploads/product-images/660ce555-0e7d-4475-a8b6-826301378876.webp',0),(140,24,'/uploads/product-images/f01fea47-8cf4-4eac-9a7c-066fe4660cd1.webp',0),(141,21,'/uploads/product-images/0427cedb-9aaa-461f-83a5-f12370315382.webp',1),(142,21,'/uploads/product-images/c45d4816-226d-4d21-ac9e-720c29288d3a.webp',0),(143,21,'/uploads/product-images/05055226-1557-45c6-a7ac-e500737859cb.webp',0),(144,21,'/uploads/product-images/fa7d27cc-70c8-4a2b-93dd-7c3315ae6de1.webp',0),(145,25,'/uploads/product-images/afb0c347-0d6c-4678-aa91-a088cc6f2887.webp',1),(146,25,'/uploads/product-images/db0f6dbc-3daf-404e-9b5f-4fe9d54f63f9.webp',0),(147,25,'/uploads/product-images/409d1617-0827-432b-8481-bfbae14af3c6.webp',0),(148,25,'/uploads/product-images/413691c7-6554-4b25-a6c3-259217039367.webp',0),(149,25,'/uploads/product-images/2901c225-603d-41ef-bdd1-b2ae06d79c11.webp',0),(150,26,'/uploads/product-images/055efbae-06e3-40ca-9db5-9ac3ffd281c0.webp',1),(151,26,'/uploads/product-images/b840cfaa-0fd7-48c7-aae4-2f97d766029f.webp',0),(152,26,'/uploads/product-images/9f737e1c-9e13-4a96-821a-b3d5473b828b.webp',0),(153,26,'/uploads/product-images/3a5e274c-0975-4a00-b732-cb0aa71972e0.webp',0),(154,26,'/uploads/product-images/b9db0957-9eb9-4e91-a67e-a7f65b3b6e12.webp',0),(159,20,'/uploads/product-images/799cd715-dbbd-413d-b335-7e3b956e3eb9.webp',0),(160,27,'/uploads/product-images/150c1968-cc9f-423e-8e42-057bd5233914.webp',1),(161,27,'/uploads/product-images/790e1526-725b-4398-848a-c512125c2611.webp',0),(162,27,'/uploads/product-images/a184c0a5-53f0-4659-aac9-758962affe12.webp',0),(163,27,'/uploads/product-images/8ac84d35-dd4b-43a7-a79d-e39c5cad3dd6.webp',0),(164,27,'/uploads/product-images/257a06d3-b0f6-4591-8c70-6d61d2ee3f71.webp',0),(165,28,'/uploads/product-images/5421ffe5-7581-4ed2-aa8b-e1c783bfe609.webp',1),(166,28,'/uploads/product-images/0a892f4a-1c41-42a8-b81b-2170eaa2fa82.webp',0),(167,28,'/uploads/product-images/3120860a-4d1e-4c91-a87e-5428f8c6628c.webp',0),(168,28,'/uploads/product-images/07655693-39ec-40c2-9d16-c4c243b5c3d2.webp',0),(169,28,'/uploads/product-images/02da33df-8cd2-4dcf-b68c-6f14ed825fa5.webp',0),(170,29,'/uploads/product-images/42b02681-8f4b-4212-ba04-27394ce1d6f8.webp',1),(171,29,'/uploads/product-images/8403d558-18a9-4bed-972b-4fb34b7b98d0.webp',0),(172,29,'/uploads/product-images/0d3e7c7b-4604-4f19-9f12-c543fa1b9a82.webp',0),(173,29,'/uploads/product-images/21253680-5a1b-4400-bf4a-3549c5a43bb3.webp',0),(174,29,'/uploads/product-images/61c300ea-15a4-431e-a42f-d278f988cdc7.webp',0),(175,30,'/uploads/product-images/77ab320c-677d-47e8-a574-3ad5a31c8e1d.webp',1),(176,30,'/uploads/product-images/c1c00a97-9f47-415d-876c-5a58f74cd4b9.webp',0),(177,30,'/uploads/product-images/ceed1743-bf10-414e-b416-80f9a8533620.webp',0),(178,30,'/uploads/product-images/5c22701d-18b9-49f3-97f9-cbd9fc14bef9.webp',0),(179,31,'/uploads/product-images/504f8780-f3ac-4e87-914b-eb1514a81bd5.webp',1),(181,31,'/uploads/product-images/cd0055f5-ea2d-4e39-a226-d35c6130541b.webp',0),(182,31,'/uploads/product-images/27b0a5eb-743d-4922-b77a-5268f21909b0.webp',0),(183,31,'/uploads/product-images/184d8a3b-b24b-427e-b9d9-e8bd23d201ff.webp',0),(184,32,'/uploads/product-images/1b727ef2-851c-4f80-a995-f951e00a3017.webp',1),(185,32,'/uploads/product-images/893c0885-7bde-4d56-9e44-680ae443ceda.webp',0),(186,32,'/uploads/product-images/46619076-4dad-44fd-b0e3-96e798901325.webp',0),(187,32,'/uploads/product-images/65cad104-9e90-4b95-9b34-fafed66f05aa.webp',0),(188,32,'/uploads/product-images/8b3ca767-e8a3-4476-881e-7d635c26bfd0.webp',0),(189,33,'/uploads/product-images/d13a9c7d-49cc-438b-91c5-d4dcb7332ca1.webp',1),(190,33,'/uploads/product-images/89f7588f-cac7-455a-a9c6-7b4211c96ce1.webp',0),(191,33,'/uploads/product-images/101a3a39-850b-42a2-976e-2f0b5740d273.webp',0),(192,33,'/uploads/product-images/eedebeb8-4688-4653-ab52-3ca097f68a7b.webp',0),(193,33,'/uploads/product-images/b88c9b46-8828-4f80-94c4-4270caea1e83.webp',0),(194,34,'/uploads/product-images/6acd672c-b443-4db1-8ef2-cc1166afe337.webp',1),(195,34,'/uploads/product-images/4b8fa07c-a6aa-48d1-b333-d4dbf9538142.webp',0),(196,34,'/uploads/product-images/bafed5ca-ba4c-4b2e-9898-146484074fc6.webp',0),(197,34,'/uploads/product-images/14d3f41c-7ad7-47b5-a9fc-d566540f4ff8.webp',0),(198,34,'/uploads/product-images/80b9ef4e-d840-44a2-8940-7792209bbb2f.webp',0),(199,34,'/uploads/product-images/095e26cf-072b-477b-a667-8604dc9cdb77.webp',0),(200,35,'/uploads/product-images/64e0be9b-8382-4ebc-b99c-c1ea68f828b1.webp',1),(201,35,'/uploads/product-images/c3ec5096-b6b0-4f84-9ab3-4b3db543cbd2.webp',0),(202,35,'/uploads/product-images/5fce2099-ac4a-49f6-958a-79be57c17d6a.webp',0),(203,35,'/uploads/product-images/2454e802-1c22-4a62-88c5-6d31cc416485.webp',0),(204,35,'/uploads/product-images/41816852-b818-4d4d-9620-f558c2140e0c.webp',0),(205,36,'/uploads/product-images/cac03fd5-b07e-4cfb-93cc-cfcff1cb8c47.png',1),(206,36,'/uploads/product-images/fae69462-63c7-4154-b3d1-312a3ea58604.png',0),(207,36,'/uploads/product-images/688883f2-623e-4c53-97da-ec362502cfb7.png',0),(208,36,'/uploads/product-images/52ed2b55-fe9e-4a26-a602-47a13766e3a9.png',0),(209,36,'/uploads/product-images/df396d00-42ed-4884-be3f-498399f4c30c.png',0),(210,37,'/uploads/product-images/066d82ca-e397-456f-a3f7-1dd0647e5a71.png',1),(211,37,'/uploads/product-images/c041386a-e52b-46b0-b172-31c5e0e19609.png',0),(212,37,'/uploads/product-images/3b087ea3-3d50-4e0a-b0df-a80aac4668fe.png',0),(213,37,'/uploads/product-images/533ad841-d14e-42ae-ab88-4d2db84a7390.png',0),(214,37,'/uploads/product-images/c6bd01e1-cf68-4d2e-bf9f-f1c451e3c08f.png',0),(215,38,'/uploads/product-images/e66aa5f5-048b-4421-9709-ea00b2b93c06.jpg',1),(216,38,'/uploads/product-images/5c780699-c0cf-4cd2-85ab-174efcf7fde3.jpg',0),(217,38,'/uploads/product-images/0591801f-5aea-48fd-9155-ffe0b3087978.jpg',0),(218,38,'/uploads/product-images/aefb2fd7-7207-49f2-8de3-b995184e4f38.jpg',0),(219,38,'/uploads/product-images/a15349bc-1972-478a-941e-a7c9cf18fcc2.png',0),(220,39,'/uploads/product-images/399cb9f2-3245-4dfb-ad6c-702d35ca0592.png',1),(221,39,'/uploads/product-images/7fd28522-d9b2-40c9-a78a-b1d2232b249e.png',0),(222,39,'/uploads/product-images/dd713b61-4185-4d86-b263-697d42dda9ef.png',0),(223,39,'/uploads/product-images/82e8fc02-457b-4115-b10b-a6a2673381c3.png',0),(224,39,'/uploads/product-images/aba17446-66f6-47f6-88e7-41ae68382eaa.png',0),(225,40,'/uploads/product-images/92c75c2b-d7c2-4687-933f-d8ad1953d9b0.png',1),(226,40,'/uploads/product-images/1b652341-3566-4223-8b4d-13ea481d2b2f.png',0),(227,40,'/uploads/product-images/c0eaba01-0662-4115-b615-e56dcf2b6983.png',0),(228,40,'/uploads/product-images/a5b1d84c-1d32-451d-9610-06f45d33853e.png',0),(229,40,'/uploads/product-images/bbb8bf06-4e5f-4ba8-a99f-7a19e4d8bcb7.png',0),(230,41,'/uploads/product-images/66cbd0f3-dae0-450a-9e13-3188393e94de.png',1),(231,41,'/uploads/product-images/d7ea0223-cd02-4e93-a510-cac50d8e87f0.png',0),(232,41,'/uploads/product-images/d2ccd8aa-e6ae-45bb-bd84-866447e195cd.png',0),(233,41,'/uploads/product-images/16e6c97e-1fb7-4624-9717-bd0dd5fb8b0e.png',0),(234,41,'/uploads/product-images/8c73d090-7d15-4ea5-be2b-74ef5d8bf5b0.png',0),(235,42,'/uploads/product-images/464efe30-1e9e-4763-b39f-9eec9c4f8964.png',1),(236,42,'/uploads/product-images/5d4b1424-7c4d-46bf-be5a-e7c2dc06595a.png',0),(237,42,'/uploads/product-images/e434c8fa-6900-4cda-bfd5-1e8770c136e5.png',0),(238,42,'/uploads/product-images/6b4cfd6f-5b3c-450d-9fe9-4b51f51ac483.png',0),(239,42,'/uploads/product-images/331c43ab-29a6-4450-ad32-4cbac09984bf.png',0),(240,42,'/uploads/product-images/181192dd-4aed-4de9-a38c-06ea03214c81.png',0),(241,42,'/uploads/product-images/4be99583-126f-43b3-9c95-45b022316986.png',0),(242,43,'/uploads/product-images/2121c22e-a56d-49a6-8dc0-7811e714f015.png',1),(243,43,'/uploads/product-images/af748842-9625-4a0b-bf72-3fb0df547266.png',0),(244,43,'/uploads/product-images/3f6aa362-595f-457c-8c96-ae5f3864b14c.png',0),(245,43,'/uploads/product-images/68d7e207-e54c-4589-864e-da2824be67f0.png',0),(246,43,'/uploads/product-images/a054fc90-084f-4c47-974f-88046cb03e33.png',0),(247,43,'/uploads/product-images/10b2b247-f636-4a02-a8f6-f4dba99fa0c5.png',0),(248,44,'/uploads/product-images/e6406d67-45ce-4377-8599-5ec3c287a36d.png',1),(249,44,'/uploads/product-images/9af056d0-9d26-46cf-8858-03fbcd47a0e2.png',0),(250,44,'/uploads/product-images/824aed8f-7622-449c-bd67-b166cddab837.png',0),(251,45,'/uploads/product-images/2ed8c4c3-aafb-4f57-8b21-4ec34748d14a.png',1),(252,45,'/uploads/product-images/c247d708-2554-4daa-8c70-5ef937bbd5cc.png',0),(253,45,'/uploads/product-images/ca168c29-a240-4336-96c8-2a3b2237a075.png',0),(254,45,'/uploads/product-images/0a639bb1-df32-4130-9c74-a208c441f312.png',0),(255,45,'/uploads/product-images/73fb2246-bfa6-448c-9d26-77bce0b8d8ed.png',0),(256,46,'/uploads/product-images/8ab225ae-ff8b-44bf-a9e3-085e2cf69de3.png',1),(257,46,'/uploads/product-images/f50b850e-69b0-45d6-bad3-a9f8dda07549.png',0),(258,46,'/uploads/product-images/8a657a79-732a-40d2-becc-3299210909b2.png',0),(259,46,'/uploads/product-images/2ddeed00-5729-4da5-a6f7-331e9e599477.png',0),(260,46,'/uploads/product-images/9b8b1aeb-f0e8-4087-a1a2-c0aab368c874.png',0),(261,47,'/uploads/product-images/9ec8f38c-a249-4ad6-be8d-d058b91ed660.png',1),(262,47,'/uploads/product-images/245bca43-6e25-40c0-9ebc-bd139524db88.png',0),(263,47,'/uploads/product-images/10a8a8ce-9ede-4258-900a-f67949a5b2e6.png',0),(264,49,'/uploads/product-images/98200c1c-5837-4c11-ac14-daa0e8d37bdc.png',1),(265,49,'/uploads/product-images/1119c0bf-9831-4813-b221-6090d0cfecf6.png',0),(266,49,'/uploads/product-images/78db1301-bd8f-4aa1-8418-e18ab091c74c.png',0),(267,49,'/uploads/product-images/5a2dea8c-11d3-41b2-bb32-3a1bd199a3a2.png',0),(268,49,'/uploads/product-images/9192061b-cb86-441b-9a68-34df99c2e1bd.png',0),(269,48,'/uploads/product-images/bbfae825-d1e4-46af-a3a3-997666b55717.png',1),(270,48,'/uploads/product-images/5eb7d116-9a56-4eda-9e06-1aebdb04afbc.png',0),(271,48,'/uploads/product-images/ba9c1cd1-762e-4ab4-9a11-bbc780e59afa.png',0),(272,48,'/uploads/product-images/d3946c13-dd4c-41f7-ab53-81145872c67a.png',0),(273,48,'/uploads/product-images/0248d4ad-4372-4cbc-85c7-30109821df52.png',0);
/*!40000 ALTER TABLE `product_images` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_reviews`
--

DROP TABLE IF EXISTS `product_reviews`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_reviews` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `product_id` int NOT NULL,
  `rating` int NOT NULL,
  `comment` text,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_user_product` (`user_id`,`product_id`),
  KEY `product_id` (`product_id`),
  CONSTRAINT `product_reviews_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`iduser`) ON DELETE CASCADE,
  CONSTRAINT `product_reviews_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_reviews`
--

LOCK TABLES `product_reviews` WRITE;
/*!40000 ALTER TABLE `product_reviews` DISABLE KEYS */;
INSERT INTO `product_reviews` VALUES (1,24,20,5,'Sản phẩm tuyệt vời!','2023-05-01 10:30:00'),(2,24,21,4,'Chất lượng tốt, nhưng giá hơi cao.','2023-05-02 11:00:00'),(9,43,20,4,'sản phẩm đẹp, sang trọng, bắt mắt','2025-06-30 01:06:08'),(10,43,24,4,'Sản phẩm chất lương, nghe rõ, cách âm tốt','2025-07-07 07:07:09'),(11,43,26,4,'Sản phẩm đẹp, sang trọng','2025-07-12 10:13:24');
/*!40000 ALTER TABLE `product_reviews` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `products` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'ID sản phẩm',
  `product_name` varchar(100) DEFAULT NULL,
  `product_code` varchar(50) DEFAULT NULL,
  `description` text,
  `category_id` int DEFAULT NULL,
  `import_price` int NOT NULL,
  `sell_price` int NOT NULL,
  `stock_quantity` int NOT NULL DEFAULT '0',
  `min_stock_level` int DEFAULT NULL,
  `max_stock_level` int DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `product_code` (`product_code`),
  KEY `category_id` (`category_id`),
  CONSTRAINT `products_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=51 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES (20,'Điện thoại Vivo Y11','ĐT01','GIỚI THIỆU:\nVivo Y11 là một chiếc điện thoại thông minh tuyệt vời thuộc dòng Y series, sản phẩm nổi tiếng với sự kết hợp giữa ngoại hình đẹp mắt và hiệu suất ấn tượng. Với thiết kế chăm chú đến từng chi tiết Vivo Y11 mang đến cho người dùng một trải nghiệm di động đầy ấn tượng và tiện ích.\nTHIẾT KẾ:\nVivo Y11 là một tác phẩm nghệ thuật di động với thiết kế chăm chút đến từng đường nét, tạo ra một sự hài hòa giữa ngoại hình và sự thoải mái khi sử dụng.Mặt lưng của Vivo Y11 là điểm nhấn lôi cuốn lấy cảm hứng từ vẻ đẹp của những viên ngọc quý. Thiết kế chuyển sắc độc đáo tạo ra một hiệu ứng ánh sáng độc đáo khi di chuyển điện thoại dưới ánh nắng mặt trời.\nVivo Y11 sở hữu màn hình tràn 6.35″ với viền siêu mỏng, tối ưu hóa không gian hiển thị mà vẫn giữ được sự nhẹ nhàng và thanh thoát. Ngoài ra, góc cạnh của Vivo Y11 được bo tròn mềm mại tạo cảm giác thoải mái khi cầm nắm và sử dụng trong thời gian dài.\nMÀN HÌNH:\nĐiện thoại Vivo Y11 sở hữu màn hình IPS LCD rộng 6.35 in, độ phân giải HD+ 720 x 1544 pixels cho khả năng hiển thị tốt. Màn hình được thiết kế theo phong cách giọt nước chiếm rất ít không gian màn hình nên hoàn toàn không gây ảnh hưởng đến khả năng quan sát của người dùng.',1,4460000,5129000,100,150,210,NULL),(21,'Laptop Lenovo Thinkbook X AI','LT01','Lenovo chính thức cho ra mắt dòng sản phẩm Lenovo Thinkbook X AI với ngoại hình sang trọng, màn hình sống động cùng nhiều tính năng mới. Đặc biệt với sự nâng cấp mạnh mẽ với bộ vi xử lý Intel Core Ultra hứa hẹn mang đến hiệu năng vượt trội, đáp ứng tốt nhu cầu công việc và giải trí của người dùng. Theo nhiều nhận định của chuyên gia, Thinkbook X AI 2024 sẽ phù hợp với các nhà sáng tạo nội dung hoặc những ai thường xuyên phải di chuyển.\nMáy vẫn được kế thừa những đường nét đặc trưng nhất của dòng Thinkbook. Sản phẩm được thiết kế theo phong cách tối giản nhưng tổng thể máy vẫn toát lên được vẻ sang trọng và hiện đại.\n*Cấu hình chi tiết:\n- CPU: Ultra 5 125H (3.6 GHz up to 4.5 GHz, 14 Cores, 18 Threads, 18MB Cache)\n- RAM: 16GB LPDDR5X 8400 MHz, \n- Ổ cứng: 1TB PCIe NVMe M.2 SSD\n- Card VGA: Intel Arc Graphics\n- Màn hình: 13.5″, 2.8K (2880x1920), IPS, 500nits, 120Hz, tỷ lệ 3:2, 100%sRGB\n- Cổng kết nối: 3 cổng Thunderbolt 4 tốc độ truyền tải dữ liệu tới 40Gbps, jack tai nghe, công tắc E-camera shutter\n- Trọng lượng: 1.14kg\n- Pin: 4-cell (74Wh)\n- Hệ điều hành: Windows 11 bản quyền\n- Tình trạng: Mới 100%',2,4700000,5405000,199,60,150,NULL),(22,'Tai nghe Bluetooth 5.3TWS Pro4','TN01','Mô tả:\n\nTên: Tai nghe không dây\n\nMô hình sản phẩm: PRO4;\n\nLoại: trong tai;\n\nMàu: Đen, Trắng, Hồng, tím;\n\nDung lượng tai nghe: 25mAh;\n\nDung lượng hộp sạc: 250mAh;\n\nThời gian sử dụng: 3-4 giờ;\n\nHiệu suất chống thấm nước: IPX5;\n\nDanh sách đóng gói:\n\n2 x Tai nghe\n\n1 x Cáp sạc\n\n1 x Hướng dẫn sử dụng\n\n1 x Hộp đóng gói\n\nLưu ý:\n\nDo đo lường thủ công, xin vui lòng cho phép sự khác biệt 1-3 cm, cảm ơn (tất cả các phép đo tính bằng cm, xin lưu ý rằng 1 cm = 0,39 inch). \n\nCó thể có sự khác biệt về màu sắc do máy tính hoặc điện thoại thông minh khác nhau, xin vui lòng bỏ qua cho tôi!',8,2290000,2519000,298,150,250,NULL),(23,'Tai nghe X55TWS Bluetooth 5.49','TN02','Loại pin Pin Lithium Polymeter\n\nDung lượng pin tai nghe 30mAh\n\nHộp sạc dung lượng pin 200mAh\n\nLoại sạc Sạc hút từ tính tai nghe, sạc loại C\n\nThời gian sạc tai nghe Khoảng 40 phút\n\nHộp sạc thời gian sạc Khoảng 1,5 giờ\n\nThời gian sử dụng tai nghe Khoảng 3-4 giờ\n\nHộp sạc thời gian sạc Khoảng 3 lần\n\nChế độ thao tác chạm\n\nNgôn ngữ chương trình cơ sở Tiếng Anh trung tính\n\nChất liệu ABS + PC\n\nMàu đen TRẮNG XANH TÍM\n\nHướng dẫn điều khiển nút tai nghe\n\nNhấn nút tai nghe chính / phụ một lần: Trả lời / ngắt cuộc gọi.\n\nNhấp đúp vào nút tai nghe chính / phụ: Âm lượng + / -.\n\nNhấn và giữ nút tai nghe chính / phụ trong 2 giây: Bài hát tiếp theo / trước đó.\n\nNhấp ba lần vào nút tai nghe chính / phụ: trợ lý giọng nói\n\nNhấn và giữ nút tai nghe chính / phụ trong 5 giây: Bật / tắt nguồn.',8,1000000,1100000,100,70,200,NULL),(24,'Tai Nghe Bluetooth BRIDIO TH10','TN03',' Được thiết kế để mang lại sự thoải mái, những chiếc tai nghe này có trọng lượng nhẹ, vừa vặn thoáng khí, đảm bảo không bị đau tai ngay cả khi đeo trong thời gian dài.',8,200000,230000,189,100,300,NULL),(25,'Tai nghe Bluetooth Transformers TF-T20','TN04','Chào mừng bạn đến với cửa hàng của chúng tôi, chúng tôi cam kết cung cấp cho khách hàng những sản phẩm mạnh mẽ và dịch vụ tuyệt vời.\n\nChúng tôi chúc bạn mua sắm vui vẻ và một ngày tuyệt vời trong cửa hàng của chúng tôi.\n\n\n\nTính năng:\n\nÂm thanh vòm 1.8D, chip 5.3 (hai loa), dung lượng lớn, tai nghe Bluetooth không dây thực sự\n\n2.Màng loa bass Graphene, công nghệ tần số cao Hi-Fi, trình điều khiển động 13mm\n\n3.Tự động ghép nối khởi động, tích hợp IC giảm tiếng ồn chủ động, cuộc gọi HD, phát bluetooth 5.3 không có độ trễ\n\n4.Kết nối không dây Bluetooth 5.3, truyền tín hiệu ổn định và nhanh chóng\n\n5.Điều khiển cảm ứng, dễ sử dụng và vận hành\n\n\n\nThiết kế mặt trước theo phong cách chiến đấu, đường nét mượt mà và thể thao, kết hợp với phong cách thiết kế chủ đề Transformers Bumblebee và phong cách thiết kế chủ đề Megatron, vừa vặn với tai nghe mà không gây cảm giác, nhẹ nhàng và thoải mái khi đeo, thời lượng pin dài, hỗ trợ âm thanh phân tích độ nét cao, Đeo thoải mái, chế độ kép nghe nhạc trò chơi, độ trễ cực thấp 30 mili giây. Micrô đón silicon đơn, giảm tiếng ồn thông minh ENC và cuộc gọi rõ ràng.\n\n\n\nMô hình: Người vận chuyển TF-T20\n\nLoại sản phẩm: Tai nghe Bluetooth tai treo\n\nLoa âm đơn: Φ16,2mm\n\nTrở kháng loa: 16Ω\n\nDải tần số đáp ứng: 20HZ-20KHz\n\nĐộ nhạy: 105dB + 3dB\n\nThời gian sạc: Khoảng 2 giờ\n\nPhiên bản Bluetooth: V5.4\n\nKhoảng cách truyền Bluetooth: 8-10 mét\n\nGiao diện sạc: Loại-c\n\nThời gian nghe nhạc: khoảng 4 giờ\n\nThời gian sạc: Khoảng 2 giờ\n\nDung lượng pin tai nghe: 40mAh\n\nDung lượng pin ngăn sạc: 300mAh',8,100000,115000,396,100,500,NULL),(26,'Điện thoại HONOR X5 Plus','ĐT0540','Thiết kế HONOR X5 Plus gọn nhẹ, màu sắc trung tính hài hòa\n\nĐiện thoại di động HONOR X5 Plus 4GB/64GB dễ dàng thu hút ngay từ cái nhìn đầu tiên với thiết kế gọn nhẹ. Máy nhỏ gọn cầm nắm khá dễ dàng với kích thước lần lượt là 163.32 x 75.07 x 8.35mm. Người dùng cũng sẽ khá thích thú khi máy chỉ nặng 188 gram (bao gồm pin), kết cấu chắc chắn mang lại cảm giác nhẹ nhàng, vừa vặn ngay cả khi phải cầm trên tay hàng giờ đồng hồ.\n\nƯu điểm thiết kế mỏng nhẹ là một điểm cộng cao cho Honor thế hệ X5 Plus, nó có thể dễ dàng được cầm nắm và bỏ vào túi xách, túi quần hoặc túi áo một cách thuận tiện. Không chỉ giúp tiết kiệm không gian, thiết kế mỏng nhẹ còn tạo ra một cảm giác sang trọng và hiện đại cho người dùng.',1,3000000,3450000,100,50,200,NULL),(27,'Điện Thoại OPPO A38','DT080','ĐIỆN THOẠI OPPO A38 (6GB/128GB)\n\n\n\n- Thiết kế thời trang, độ bền ấn tượng \n\n- Bắt trọn khoảnh khắc với bộ đôi camera ấn tượng\n\n- Hiệu năng ổn định các tác vụ, bộ nhớ trong lớn 128G \n\n- Pin lớn, sạc siêu nhanh SUPERVOOC 33W\n\n\n\nBẢO HÀNH 12 THÁNG TẠI TẤT CẢ TTBH CỦA OPPO TRÊN TOÀN QUỐC.',1,3000000,3450000,399,100,500,NULL),(28,'iPhone 13 128GB ','DT02','iPhone 13 được trang bị chip A15 Bionic mạnh mẽ với 6 nhân CPU và 4 nhân GPU, cung cấp mức hiệu năng vượt trội, giúp xử lý nhanh chóng các tác vụ nặng. Màn hình Super Retina XDR 6.1 inch trên máy cũng được đánh giá cao khi mang tới hình ảnh sắc nét với độ sáng cao, tối ưu hóa trải nghiệm xem nội dung dưới mọi điều kiện ánh sáng. Chưa hết, iPhone13 còn sở hữu hệ thống camera kép 12MP với công nghệ ổn định hình ảnh quang học (OIS) cải thiện khả năng quay film, chụp hình, ngay cả khi đang ở trong môi trường ánh sáng yếu.\nàn hình màn hình Super Retina XDR độ sáng cao\nMàn hình Super Retina XDR trên iPhone13 phiên bản thường mang lại một bước tiến đáng kể trong công nghệ hiển thị. Với kích thước 6.1 inch, lớn hơn iPhone 13 mini (5.4 inch) và độ phân giải 2532 x 1170 pixel, màn hình này giúp tái hiện hình ảnh với độ chi tiết sắc nét và màu sắc sống động. \nCamera kép 12MP, hỗ trợ ổn định hình ảnh quang học\nHệ thống camera kép trên iPhone 13 cũng được xem là một trong những điểm mạnh đáng chú ý của dòng phân khúc iPhone hiện đại này. Theo đó, máy được trang bị cảm biến chính 12MP và khẩu độ f/1,6, cung cấp khả năng chụp ảnh rõ nét ngay cả khi ở môi trường yếu ánh sáng. Đi kèm là camera góc siêu rộng 12MP với khẩu độ f/2,4, mở rộng khả năng chụp cảnh rộng mà không làm mất đi chi tiết. ',1,8000000,9200000,148,100,500,NULL),(29,'Samsung Galaxy S25 Plus 256GB','DT03','Samsung S25 Plus được đánh giá cao về mặt hiệu năng nhờ sở hữu chip Snapdragon 8 Elite mạnh mẽ, mang lại khả năng xử lý vượt trội. Màn hình hiển thị Dynamic AMOLED của máy lớn 6.7 inch với độ phân giải QHD+, đảm bảo trải nghiệm hình ảnh sắc nét và sống động. Kèm theo đó là bộ nhớ RAM 12GB cùng tùy chọn lưu trữ 256GB giúp người dùng thoải mái lưu trữ dữ liệu và chạy nhiều ứng dụng mượt mà.\nGalaxy S25 Plus sở hữu thiết kế hiện đại với viền kim loại cứng cáp, tạo cảm giác cầm nắm dễ chịu mà vẫn đảm bảo độ bền. Chất liệu Armor Aluminum giúp hạn chế trầy xước và va đập. Kích thước mỏng nhẹ mang lại sự gọn gàng và linh hoạt khi sử dụng.',1,10000000,11500000,200,100,500,NULL),(30,'Xiaomi Redmi Note 13 Pro 8GB 256GB','DT04','Xiaomi Redmi Note 13 Pro 8GB 256GB sở hữu chip Helio G99-Ultra, RAM 8GB, ROM 256GB, bộ 3 camera 200MP – 8MP – 2MP quay phim FHD+, camera selfie 16MP, màn hình Xiaomi AMOLED 120Hz 6.67 inches, pin 5000mAh sạc nhanh 67W.\nXiaomi Redmi Note 13 Pro 8GB 256GB sở hữu sức mạnh vượt trội so với phiên bản tiền nhiệm. Cùng với đó, mẫu điện thoại thuộc Redmi Note 13 series này còn có kiểu dáng vô cùng hiện đại, thời thượng với cụm camera bắt mắt. Redmi Note 13 Pro còn được trang bị viên pin khủng cho trải nghiệm luôn xuyên suốt.',1,5000000,5750000,300,100,500,NULL),(31,'Xiaomi Redmi 14C 4GB 128GB','DT05','Xiaomi Redmi 14C sở hữu vi xử lý MediaTek Helio G81-Ultra mạnh mẽ, giúp xử lý mượt mà các tác vụ hàng ngày và chơi game ổn định. Với màn hình 6.88 inch độ phân giải Full HD+, Redmi 14C mang lại trải nghiệm hình ảnh rõ nét và sống động. Đặc biệt, máy còn sở hữu dung lượng pin lớn 5160mAh đảm bảo thời gian sử dụng dài lâu, kết hợp với khả năng sạc nhanh, đem lại sự tiện lợi và liền mạch.\nXiaomi Redmi 14C với chipset MediaTek Helio G81-Ultra, giúp tối ưu hóa hiệu suất và tiết kiệm năng lượng hơn so với thế hệ 13C tiền nhiệm. Khi đi kèm với RAM 4GB, chipset này đảm bảo đem đến cho khả năng xử lý đa nhiệm xuất sắc. Nó cho phép người sử dụng dễ dàng chuyển đổi giữa các ứng dụng, tác vụ một cách nhanh chóng và hiệu quả. ',1,3500000,4025000,298,100,500,NULL),(32,'iPhone 12 64GB','DT06','Dù Apple vừa giới thiệu dòng điện thoại iPhone 13 series tuy nhiên iPhone 12 vẫn đang là một trong những sự lựa chọn hàng đầu ở thời điểm hiện tại. Chiếc flagship năm 2020 của \"Táo khuyết\" đang nhận được rất nhiều sự quan tâm của người dùng bởi mức giá dễ tiếp cận hơn so với thời điểm ra mắt, đồng thời được trang bị cấu hình, màn hình, camera ấn tượng trong tầm giá.\niPhone 12 gây ấn tượng với người dùng bởi thiết kế vuông vức quen thuộc, đây là thiết kế đã từng xuất hiện trên thế hệ iPhone 5 trước đó. Điện thoại được hoàn thiện mỏng hơn với cụm camera lớn hơn.\n\nĐặc biệt, máy được trang bị một khung viền thép không gỉ. Mặt lưng điện thoại iPhone 12 được trang bị một mặt kính Ceramic Shield bóng bẩy, gây được sự chú ý của người đối diện.\n\nVề kích thước cụ thể, máy có thông số từng cạnh lần lượt là 146.7 x 71.5 x 7.4 mm cùng cân nặng khoảng 164g. Tổng thể, máy khá mỏng nhẹ thích hợp với cả người dùng nam và nữ cũng như thích hợp với nhiều kích thước tay khác nhau.',1,7450000,8567500,200,100,500,NULL),(33,'Samsung Galaxy M55 5G 8GB 256GB','DT07','Điện thoại Samsung Galaxy M55 5G 8GB 256GB được trang bị màn hình Super AMOLED Plus 6.7 inch FullHD+, chất lượng sắc nét, mượt mà với tần số quét 120Hz. Sản phẩm Samsung Galaxy M trang bị chip Snapdragon 7 Gen 1 cùng 8GB RAM và 256GB bộ nhớ trong, chạy mượt mà mọi tác vụ. \nĐiện thoại Samsung Galaxy M55 5G 8GB 256GB sở hữu thiết kế mỏng nhẹ với độ dày chỉ 7.8mm và trọng lượng 180g, dễ cầm nắm và sử dụng mà không gây cảm giác mỏi tay. Mặt lưng của máy sở hữu thiết kế tối giản, mang lại vẻ ngoài tinh tế, cao cấp, không thua kém các mẫu flagship. Cụm camera được bố trí gọn gàng, hài hòa với tổng thể, tạo nên một thiết kế đẹp mắt và hiện đại. ',1,6700000,7705000,300,100,500,NULL),(34,'Realme 13+ 5G 8GB 256GB','DT08','Điện thoại realme 13 Plus 5G mang đến một thế giới trải nghiệm mới cho người dùng thông qua đa dạng đặc điểm nâng cấp ưu trội. Chiếc smartphone này hứa hẹn sẽ chinh phục tốt mọi nhu cầu hoạt động với hiệu suất ổn định, đa tính năng.\nDimensity 7300 vượt trội, RAM khỏe\nSở hữu chip Dimensity 7300 Energy của MediaTek. Bộ CPU 4nm 8 nhân này cung cấp tốc độ xung nhịp cao 2.5GHz đi cùng card đồ họa Mali-G615, giúp máy realme 13+ cải thiện hiệu năng một cách ấn tượng. \nCamera cảm biến Sony LYT-600\nCamera realme 13+ với điểm ảnh 16MP kèm đa dạng chế độ tính năng cũng cho phép người dùng chụp ảnh chân dung sắc nét, cảm biến Sony LYT-600 cho ống kính chính với độ phân giải 50MP. Camera góc siêu rộng 8MP giúp người dùng thoải mái chụp ảnh theo nhu cầu. Kèm theo đó hệ thống máy ảnh cũng hỗ trợ OIS cùng những cải tiến về thuật toán xử lý ảnh giúp hình ảnh chân thực và sắc nét hơn. ',1,6790000,7469000,200,100,500,NULL),(35,'Laptop Lenovo IdeaPad Slim 3 14IRH10 83K00008VN','LT02','Laptop Lenovo IdeaPad Slim 3 14IRH10 83K00008VN với chip xử lý Intel Core i5-13420H có 8 nhân và 12 luồng, đảm bảo hiệu năng mạnh mẽ cho đa nhiệm. Cùng với đó, bộ nhớ RAM 16GB DDR5-4800MHz và SSD 512GB PCIe 4.0 mang lại tốc độ phản hồi nhanh chóng. Màn hình 14 inch WUXGA IPS 300 nits sắc nét và pin 60Wh, giúp duy trì trải nghiệm ổn định và liền mạch.\nLaptop Lenovo IdeaPad Slim 3 14IRH10 83K00008VN được trang bị bộ vi xử lý Intel Core i5-13420H với 8 nhân (4P + 4E), 12 luồng, và tốc độ tối đa 4.6GHz, cho khả năng xử lý ấn tượng. Chip này được tối ưu cho các hoạt động văn phòng, đồ họa cơ bản, và giải trí cơ bản. Chipset Intel SoC Platform cũng giúp đồng điều tiết năng lượng và nâng cao hiệu suất xử lý.\nVới 16GB RAM DDR5-4800, laptop Lenovo IdeaPad Slim 3 14IRH10 83K00008VN có khả năng xử lý một cách mượt mà, không gặp phải tình trạng giật lag. Bộ nhớ DDR5 còn tiết kiệm năng lượng hơn 20% so với DDR4 mà giúp tốc độ truyền tải dữ liệu lên tới 4800MT/s. Người sử dụng cũng có lựa chọn nâng cấp RAM lên 24GB để phù hợp hơn với những yêu cầu cao hơn.',2,13950000,15345000,99,100,400,NULL),(36,'Chuột Gaming không dây Logitech G304 Lightspeed','C01','Thiết kế đột phá, nổi bật với nhiều nút lập trình\nChuột gaming không dây Logitech G304 Lightspeed được nhà sản xuất gia công vô cùng tỉ mỉ với tiêu chí là đặt nhu cầu của người sử dụng hàng đầu. Chuột sở hữu 6 nút lập trình chính giữa và ở cả 2 bên. Các nút kích chuột chính vô cùng bền bỉ với khả năng 10 triệu lần nhấp chuột.\nThời lượng pin lớn, mắt cảm biến Hero\nChuột gaming không dây Logitech G304 Lightspeed là một trong những chiếc chuột không dây mang đến thời lượng pin sử dụng vượt trội so với các sản phẩm cùng phân khúc. Chuột mang lại cho người dùng 250h sử dụng chỉ với một chiếc pin AA.',19,700000,770000,200,100,500,NULL),(37,'Chuột không dây Logitech MX Anywhere 3S','C02','Kết nối không dây thông minh\nChuột Logitech MX Anywhere 3S được trang bị công nghệ kết nối không dây thông minh, cho phép bạn kết nối nhanh chóng và ổn định với máy tính của bạn. Điều này giúp tiết kiệm thời gian và loại bỏ những phiền toái về dây cáp.\nTrải nghiệm độ nhạy DPI cao hơn\nVới cảm biến 8,000 DPI, chuột đảm bảo mượt mà và chính xác trong mọi hoạt động. Từ công việc văn phòng đến chơi game, bạn có thể tùy chỉnh độ nhạy DPI theo nhu cầu cá nhân.',19,1500000,1575000,299,100,500,NULL),(38,'Chuột Gaming không dây Asus TUF M4','C03','Chất liệu nhựa PBT cao cấp\nChuột Gaming không dây Asus TUF M4 thiết kế nhỏ gọn và được làm từ chất liệu nhựa PBT cao cấp có thể chống được mài mòn trong quá trình sử dụng lâu. Và có thể giúp cho người sử dụng được cảm giác an toàn và chắc hơn.\nKết nối không dây ổn định và mạnh\nChuột Gaming không dây Asus TUF M4 được nhà sản xuất cho phép sử dụng bộ chuẩn kết nối không dây kép Wireless 2.4Ghz và Bluetooth mạnh giúp mang lại đường truyền ổn định và nhanh chóng hơn và có thể sử dụng được nhiều thiết bị khác nhau ở môi trường khác.',19,700000,735000,201,100,400,NULL),(39,'Chuột không dây Bluetooth Huawei CD23','C04','Thiết kế hiện đại\nChuột Huawei CD23 được thiết kế nhằm hướng đến trải nghiệm cầm nắm thoải mái và tiện lợi cho khách hàng. Với thiết kế nhỏ gọn và nhẹ, nó dễ dàng bỏ vào túi và mang đi bất cứ nơi nào bạn muốn.\nKết nối không dây nhanh chóng\nMột tính năng đặc biệt của chuột Huawei CD23 là khả năng điều chỉnh DPI, bạn có thể tăng hoặc giảm độ nhạy của chuột để phù hợp với nhu cầu sử dụng của mình. Tuy nhiên, để tận hưởng tính năng này, bạn cần kết nối máy chủ với trình quản lý PC chạy phiên bản 11.1.6 trở lên.',19,650000,682500,250,100,400,NULL),(40,'Đồng hồ thông minh Huawei Watch GT 5','DH01','Đồng hồ Huawei Watch GT 5 được trang bị màn hình AMOLED có độ phân giải 466 x 466 pixel, giúp hiển thị sắc nét, rõ ràng ngay cả dưới ánh sáng mạnh. Bên cạnh đó, chiếc đồng hồ thông minh Huawei này còn tích hợp kèm nhiều tính năng thông minh như theo dõi nhịp tim, giấc ngủ và sức khỏe tổng quát, cùng khả năng kết nối Bluetooth để nghe gọi và nhận thông báo tiện lợi. Ngoài ra, thời lượng pin của đồng hồ cũng có thể kéo dài đến 14 ngày cho phiên bản 46mm và 7 ngày cho phiên bản 41mm, mang đến sự tiện lợi cho người dùng trong các hoạt động hàng ngày. ',20,2000000,2100000,150,100,400,NULL),(41,'Đồng hồ thông minh Huawei Watch Fit 4','DH02','Đồng hồ Huawei Watch Fit 4 sở hữu màn hình AMOLED 1.82 inch sắc nét, vỏ làm từ hợp kim nhôm, kích thước 43.0 × 38.0 × 9.5 mm nặng khoảng 27g (chưa bao gồm dây). Sản phẩm đồng hồ thông minh Huawei hỗ trợ kết nối Bluetooth 5.2, và tương thích với Android 8.0 hoặc iOS 13.0 trở lên. Pin đồng hồ sử dụng tối đa 10 ngày, kháng nước chuẩn 5ATM và sở hữu phiên bản dây đeo cao su tổng hợp nhiều màu.',20,1564000,1642200,250,100,400,NULL),(42,'Đồng hồ thông minh Xiaomi Watch S4','DH03','Đồng hồ Xiaomi Watch S4 nổi bật với màn hình AMOLED 1.43 inch sắc nét, độ sáng lên đến 2000 nits cùng thời lượng pin ấn tượng lên đến 15 ngày. Với Xiaomi HyperOS 2, mang lại trải nghiệm điều khiển thông minh. Đồng hồ trang bị các tính năng sức khỏe như đo nhịp tim, theo dõi giấc ngủ, bài tập hít thở giúp người dùng chăm sóc sức khỏe toàn diện.',20,3000000,3150000,300,100,400,NULL),(43,'Đồng hồ thông minh Amazfit Active 2','DH04','Đồng hồ Amazfit Active 2 sở hữu thiết kế truyền thống với màn hình AMOLED dạng tròn 1.32 inch mang tới sự tinh tế và khả năng đọc tối ưu. Công nghệ BioTracker giúp thiết bị nâng cao khả năng thu thập dữ liệu sức khoẻ. Mẫu đồng hồ Amazfit này còn được tích hợp nhiều tiện ích như thiết lập bản đồ, huấn luyện viên, hỗ trợ AI',20,2500000,2625000,170,100,400,NULL),(44,'Đồng hồ định vị trẻ em Viettel MyKID 4G Lite','DH05','Đồng hồ định vị trẻ em Viettel MyKID 4G Lite trang bị màn hình cảm ứng 1.4 inch 240 x 240 pixels cùng viên pin 680mAh cho thời gian sử dụng nhiều ngày. Thiết bị hỗ trợ định vị đa chế độ GPS, A-GPS, Wifi, LBS chính xác và giám sát từ xa thông qua ứng dụng MyKID Viettel. Ngoài ra, đồng hồ còn tích hợp nhiều tính năng hiện đại như nghe gọi, tin nhắn thoại, xem lịch sử hành trình,...',20,1000000,1150000,299,100,400,NULL),(45,'Pin sạc dự phòng Aukey 10000MAH PD 20W & QC 3.0 (PB-N83S)','SDP01','Pin dung lượng cao, dùng thoải mái\nPin dự phòng PB-N83S sở hữu dung lượng 10000mAh nên có thể sạc được điện thoại, tai nghe và đồng hồ thông minh. Điều này giúp người dùng luôn chủ động trong mọi tình huống.\nTrang bị 2 cổng sạc cùng tốc độ sạc nhanh\nPin dự phòng Aukey được trang bị hai cổng sạc ra gồm USB-A và Type-C, cho phép sạc cùng lúc nhiều thiết bị. Trong đó, cổng Type-C đóng vai trò kép, vừa là cổng sạc ra vừa là cổng sạc vào.',21,400000,420000,250,100,400,NULL),(46,'Pin sạc dự phòng Energizer 20000mAh /3.7V Li-Polymer - UE20055PQ','SDP02','Đáp ứng nhu cầu sử dụng liên tục cùng 3 cổng sạc\nSở hữu dung lượng 20000mAh, giúp bạn sạc một chiếc smartphone thông thường lên tới 72 giờ rất phù hợp cho những chuyến đi dài mà không phải lo lắng về việc hết pin. Với kích thước nhỏ gọn và trọng lượng 400g, giúp bạn dễ dàng mang theo.\nKiểm soát dung lượng pin dễ dàng cùng PowerSafe Management\nPin sạc dự phòng 20000mAhEnergizer UE20055PQ  còn trang bị đèn LED hỗ trợ hiển thị trạng thái pin còn lại. Thay vì phải ước lượng lượng pin, đèn LED này giúp bạn theo dõi được lượng pin còn lại để có kế hoạch sạc pin kịp thời.',21,550000,605000,281,100,400,NULL),(47,'Bàn phím cơ E-DRA không dây EK368L Alpha','BP01','Switch Huano chất lượng cùng keycap ABS Doubleshot tăng độ bền\nBàn phím cơ không dây E-DRA EK368L Alpha được trang bị bộ switch của Huano quốc dân có độ bền cao cùng với tốc độ phản hồi ổn định. Bàn phím mang đến trải nghiệm gõ phím êm ái, độ nảy cao cùng với cách sắp xếp phím hợp lý cho độ chính xác trong từng thao tác.\nBàn phím layout 68 cùng kết nối 2 chế độ dễ dàng setup tiết kiệm không gian\nBàn phím cơ không dây E-DRA EK368L Alpha có layout 68 phím siêu gọn, đầy đủ tiện ích và lược bỏ bớt những phím ít dùng để cho kích thước phù hợp với không gian bàn nhỏ gọn. Ngoài ra bàn phím còn có kết nối không dây bằng 2 chế độ 2.4GHz và Bluetooth tiện lợi.',22,450000,472500,320,100,400,NULL),(48,'Bàn phím cơ Aula S2022 Blue Switch','BP02','Bàn phím cơ AULA S2022 Blue Switch là một sản phẩm bàn phím AULA đáng tin cậy với độ bền vượt trội, tuổi thọ phím lên đến 60 triệu lần bấm. Sản phẩm kết nối thông qua dây cắm USB 2.0, mang lại sự ổn định và mượt mà. Hiệu ứng đèn nền LED Rainbow với nhiều chế độ tùy chỉnh khác nhau tạo ra không gian chơi game sôi động và thú vị. Sử dụng blue switch, bàn phím có âm thanh clicky đúng chuẩn và cảm giác gõ phím rõ ràng.',22,477000,524700,166,100,500,NULL),(49,'Máy ảnh Canon EOS R50','MA01','Canon R50 với cảm biến APS-C CMOS 24.2MP cùng trọng lượng nhẹ 375g giúp người dùng dễ dàng mang theo và sử dụng. Đồng thời, Canon EOS R50 mang đến khả năng quay video ấn tượng với độ phân giải cao 4K 30p và Full HD 120p, đáp ứng mọi nhu cầu sáng tạo của bạn. Cùng với đó là khả năng chụp hình liên tục lên đến 15 khung hình mỗi giây trên máy ảnh Canon này.',23,18000000,18900000,100,100,300,NULL);
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `shipping_info`
--

DROP TABLE IF EXISTS `shipping_info`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `shipping_info` (
  `id` int NOT NULL AUTO_INCREMENT,
  `order_id` int NOT NULL,
  `recipient_name` varchar(100) NOT NULL,
  `phone` varchar(15) NOT NULL,
  `street_address` varchar(255) DEFAULT NULL,
  `ward` varchar(100) DEFAULT NULL,
  `district` varchar(100) DEFAULT NULL,
  `province` varchar(100) DEFAULT NULL,
  `note` text,
  `shipping_method` enum('tieuchuan','nhanh') NOT NULL,
  `shipping_fee` int DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `order_id` (`order_id`),
  CONSTRAINT `shipping_info_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=81 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `shipping_info`
--

LOCK TABLES `shipping_info` WRITE;
/*!40000 ALTER TABLE `shipping_info` DISABLE KEYS */;
INSERT INTO `shipping_info` VALUES (1,13,'Nguyen Van A','0912345678','123 Le Loi','Phuong 1','Quan 1','Ho Chi Minh','Giao trong gio hanh chinh','tieuchuan',20000,'2025-05-30 01:38:53','2025-05-30 01:38:53'),(2,17,'Nguyen Van B','0912348678','1234 Le Loi','Phuong 5','Quan 2','Ho Chi Minh','Giao trong gio hanh chinh','tieuchuan',20000,'2025-05-30 03:16:05','2025-05-30 03:16:05'),(3,19,'le huy a','0902345675','178/23 phan văn hân ','Phường 17','Quận Bình Thạnh','Thành phố Hồ Chí Minh','nhanh','tieuchuan',828,'2025-05-30 04:10:40','2025-05-30 04:10:40'),(4,20,'le huy sang','0896512556','178/23 phan văn hân ','Phường 17','Quận Bình Thạnh','Thành phố Hồ Chí Minh','giao buổi trưa','tieuchuan',828,'2025-05-30 04:34:09','2025-05-30 04:34:09'),(5,21,'nguyễn tấn sang','0908765437','178/23 phan văn hân','Phường 17','Quận Bình Thạnh','Thành phố Hồ Chí Minh','','tieuchuan',828,'2025-05-30 04:38:47','2025-05-30 04:38:47'),(6,22,'nguyễn giang sơn','0957864578','178/23 phan văn hân ','Phường 17','Quận Bình Thạnh','Thành phố Hồ Chí Minh','','tieuchuan',828,'2025-05-30 07:09:26','2025-05-30 07:09:26'),(7,23,'nguyễn nhật tân','0795555777','178/23 phan văn hân ','Phường 17','Quận Bình Thạnh','Thành phố Hồ Chí Minh','','tieuchuan',828,'2025-05-30 07:12:51','2025-05-30 07:12:51'),(8,24,'lê hoài phương','0905678745','178/23 phan văn hân ','Phường 17','Quận Bình Thạnh','Thành phố Hồ Chí Minh','','tieuchuan',828,'2025-05-30 17:12:36','2025-05-30 17:12:36'),(9,25,'NTN','0896523446','178/23 phan văn hân ','Phường 17','Quận Bình Thạnh','Thành phố Hồ Chí Minh','','tieuchuan',828,'2025-05-30 17:17:35','2025-05-30 17:17:35'),(10,26,'lê huy đô','0905645876','178/23 phan văn hân','Phường 17','Quận Bình Thạnh','Thành phố Hồ Chí Minh','','tieuchuan',828,'2025-05-30 19:28:06','2025-05-30 19:28:06'),(11,27,'le huy c','0906758764','178/23 phan văn hân ','Phường 17','Quận Bình Thạnh','Thành phố Hồ Chí Minh','','tieuchuan',828,'2025-05-30 19:31:18','2025-05-30 19:31:18'),(12,28,'le thị huyền trang','0904562347','178/23 phan văn hân','Phường 17','Quận Bình Thạnh','Thành phố Hồ Chí Minh','','tieuchuan',828,'2025-05-30 19:39:40','2025-05-30 19:39:40'),(13,29,'nguyễn thị hoài','0798567345','178/23 phan văn hân','Phường 17','Quận Bình Thạnh','Thành phố Hồ Chí Minh','','tieuchuan',828,'2025-05-30 19:46:52','2025-05-30 19:46:52'),(14,30,'phan anh kiệt','0908765432','178/23 phan văn hân','Phường 17','Quận Bình Thạnh','Thành phố Hồ Chí Minh','giao buổi tối','nhanh',31242,'2025-05-30 19:49:56','2025-05-30 19:49:56'),(15,31,'Ma nhật tân ','0904562457','178/23 phan văn hân','Phường 17','Quận Bình Thạnh','Thành phố Hồ Chí Minh','','tieuchuan',828,'2025-05-30 20:34:15','2025-05-30 20:34:15'),(16,32,'Ma nhật tân','0908768796','178/23 phan văn hân','Phường 17','Quận Bình Thạnh','Thành phố Hồ Chí Minh','','tieuchuan',828,'2025-05-30 20:38:38','2025-05-30 20:38:38'),(17,33,'nguyễn giang hà','0945673657','178/23 phan văn hân','Phường 17','Quận Bình Thạnh','Thành phố Hồ Chí Minh','','tieuchuan',828,'2025-05-30 20:41:38','2025-05-30 20:41:38'),(18,34,'le huy c','0905679994','178/23 phan văn hân','Phường 17','Quận Bình Thạnh','Thành phố Hồ Chí Minh','','tieuchuan',828,'2025-05-30 20:45:47','2025-05-30 20:45:47'),(19,35,'Lê văn hậu','0908765675','178/23 phan văn hân','Phường 17','Quận Bình Thạnh','Thành phố Hồ Chí Minh','giao buổi đêm','tieuchuan',828,'2025-05-30 22:09:40','2025-05-30 22:09:40'),(20,36,'lê văn kiên','0896789556','178/23 phan văn hân','Phường 17','Quận Bình Thạnh','Thành phố Hồ Chí Minh','','tieuchuan',828,'2025-05-30 22:32:45','2025-05-30 22:32:45'),(21,37,'trần quang vinh','0904446667','178/23 phan văn hân','Phường 17','Quận Bình Thạnh','Thành phố Hồ Chí Minh','','tieuchuan',828,'2025-05-31 00:04:43','2025-05-31 00:04:43'),(22,38,'Quang Huy','0904445556','178/23 phan văn hân','Phường 17','Quận Bình Thạnh','Thành phố Hồ Chí Minh','','tieuchuan',828,'2025-05-31 00:11:19','2025-05-31 00:11:19'),(23,39,'Trần mạnh cường','0908887776','178/23 phan văn hân','Phường 17','Quận Bình Thạnh','Thành phố Hồ Chí Minh','','tieuchuan',828,'2025-05-31 00:31:26','2025-05-31 00:31:26'),(24,40,'Nguyễn thị viết','0909998887','178/23 phan văn hân','Phường 17','Quận Bình Thạnh','Thành phố Hồ Chí Minh','','tieuchuan',828,'2025-05-31 00:37:30','2025-05-31 00:37:30'),(25,41,'trần mạnh khang','0905556663','178/23 phan văn hân ','Phường 17','Quận Bình Thạnh','Thành phố Hồ Chí Minh','','tieuchuan',828,'2025-05-31 00:40:36','2025-05-31 00:40:36'),(26,42,'nguyễn phú','0908897658','178/23 phan văn hân ','Phường 17','Quận Bình Thạnh','Thành phố Hồ Chí Minh','','tieuchuan',828,'2025-05-31 00:44:38','2025-05-31 00:44:38'),(27,43,'Phan Anh Quân','0908887776','178/23 phan văn hân ','Phường 17','Quận Bình Thạnh','Thành phố Hồ Chí Minh','','nhanh',31242,'2025-06-01 01:35:50','2025-06-01 01:35:50'),(28,44,'Nguyễn Văn Tiến','0904447775','178/23 phan văn hân ','Phường 17','Quận Bình Thạnh','Thành phố Hồ Chí Minh','','nhanh',31242,'2025-06-01 09:24:27','2025-06-01 09:24:27'),(29,45,'Lê Hồng Tâm','0904567776','178/23 phan văn hân ','Phường 17','Quận Bình Thạnh','Thành phố Hồ Chí Minh','','nhanh',31242,'2025-06-01 20:05:10','2025-06-01 20:05:10'),(30,46,'Trần Huy Hoàng','0895556667','178/23 phan văn hân','Phường 17','Quận Bình Thạnh','Thành phố Hồ Chí Minh','','nhanh',31242,'2025-06-01 20:08:05','2025-06-01 20:08:05'),(31,47,'Trần quang huy','0796555777','178/23 phan văn hân ','Phường 17','Quận Bình Thạnh','Thành phố Hồ Chí Minh','','nhanh',31242,'2025-06-02 16:50:14','2025-06-02 16:50:14'),(32,48,'nguyễn giang hai','0908887755','178/23 phan văn hân ','Phường 17','Quận Bình Thạnh','Thành phố Hồ Chí Minh','','nhanh',31242,'2025-06-02 16:52:53','2025-06-02 16:52:53'),(33,49,'nguyễn tấn sĩ','0905678755','178/23 phan văn hân ','Phường 17','Quận Bình Thạnh','Thành phố Hồ Chí Minh','','nhanh',31242,'2025-06-02 17:02:22','2025-06-02 17:02:22'),(34,50,'nguyễn nhật Vũ','0905678733','178/23 phan văn hân ','Phường 17','Quận Bình Thạnh','Thành phố Hồ Chí Minh','','nhanh',31242,'2025-06-02 17:22:53','2025-06-02 17:22:53'),(35,51,'nguyễn tấn vũ','0908765422','178/23 phan văn hân ','Phường 17','Quận Bình Thạnh','Thành phố Hồ Chí Minh','','nhanh',31242,'2025-06-02 18:14:23','2025-06-02 18:14:23'),(36,52,'Nguyễn Hải Nam','0896655455','178/23 phan văn hân','Phường 17','Quận Bình Thạnh','Thành phố Hồ Chí Minh','Giao buổi trưa','nhanh',31242,'2025-06-11 17:34:34','2025-06-11 17:34:34'),(37,53,'Nguyễn Nam Hải','0904567776','178/23 phan văn hân','Phường 17','Quận Bình Thạnh','Thành phố Hồ Chí Minh','Giao buổi trưa','nhanh',31242,'2025-06-11 17:37:25','2025-06-11 17:37:25'),(38,54,'Nguyễn Hải Nam','0904567772','178/23 phan văn hân','Phường 17','Quận Bình Thạnh','Thành phố Hồ Chí Minh','Giao vào buổi trưa','nhanh',31242,'2025-06-11 17:43:18','2025-06-11 17:43:18'),(39,55,'Nguyễn Hải Nam','0904567772','178/23 phan văn hân','Phường 17','Quận Bình Thạnh','Thành phố Hồ Chí Minh','Giao hàng buổi trưa','nhanh',31242,'2025-06-11 17:45:41','2025-06-11 17:45:41'),(40,56,'Nguyễn Hải Nam','0904768874','178/23 phan văn hân','Phường 17','Quận Bình Thạnh','Thành phố Hồ Chí Minh','Giao hàng buổi trưa','nhanh',31242,'2025-06-11 17:49:30','2025-06-11 17:49:30'),(41,57,'Nguyễn Hải Nam','0905554443','178/23 phan văn hân ','Phường 17','Quận Bình Thạnh','Thành phố Hồ Chí Minh','','nhanh',31242,'2025-06-11 17:55:14','2025-06-11 17:55:14'),(42,58,'Nguyễn Minh Huy','0896544622','178/23 phan văn hân','Phường 17','Quận Bình Thạnh','Thành phố Hồ Chí Minh','','tieuchuan',828,'2025-06-11 17:57:05','2025-06-11 17:57:05'),(43,59,'Trần Nhân Tông','0976543456','178/23 phan văn hân','Phường 17','Quận Bình Thạnh','Thành phố Hồ Chí Minh','','tieuchuan',828,'2025-06-11 19:47:52','2025-06-11 19:47:52'),(44,60,'Nguyễn Văn D','0905556664','178/23 phan văn hân','Phường 17','Quận Bình Thạnh','Thành phố Hồ Chí Minh','','nhanh',31242,'2025-06-11 23:49:51','2025-06-11 23:49:51'),(45,61,'Trần Văn Nghĩa','0796667775','178/23 phan văn hân','Phường 17','Quận Bình Thạnh','Thành phố Hồ Chí Minh','','tieuchuan',828,'2025-06-12 21:55:41','2025-06-12 21:55:41'),(46,62,'nguyễn tấn sang','0795346789','178/23 phan văn hân','Phường 17','Quận Bình Thạnh','Thành phố Hồ Chí Minh','','tieuchuan',22703,'2025-06-12 23:52:03','2025-06-12 23:52:03'),(47,63,'nguyễn tấn sang','0896512445','178/23 phan văn hân','Phường 17','Quận Bình Thạnh','Thành phố Hồ Chí Minh','','tieuchuan',828,'2025-06-13 00:16:03','2025-06-13 00:16:03'),(48,64,'nguyễn tấn sầu','0896512446','178/23 phan văn hân','Phường 17','Quận Bình Thạnh','Thành phố Hồ Chí Minh','','tieuchuan',22703,'2025-06-13 00:37:24','2025-06-13 00:37:24'),(49,65,'le huy đức','0896512444','178/23 phan văn hân ','Phường 17','Quận Bình Thạnh','Thành phố Hồ Chí Minh','','tieuchuan',828,'2025-06-13 00:39:40','2025-06-13 00:39:40'),(50,66,'Nguyen Van B','0912348678','1234 Le Loi','Phuong 5','Quan 2','Ho Chi Minh','Giao trong gio hanh chinh','tieuchuan',20000,'2025-06-13 00:49:57','2025-06-13 00:49:57'),(51,67,'Lê Hồng Tâm','0896512448','178/23 phan văn hân','Phường 17','Quận Bình Thạnh','Thành phố Hồ Chí Minh','','tieuchuan',22703,'2025-06-13 06:11:27','2025-06-13 06:11:27'),(52,68,'lê mạnh hùng','0896512449','178/23 phan văn hân ','Phường 17','Quận Bình Thạnh','Thành phố Hồ Chí Minh','','tieuchuan',828,'2025-06-13 08:43:47','2025-06-13 08:43:47'),(53,69,'võ công lưu','0896512443','178/23 phan văn hân ','Phường 17','Quận Bình Thạnh','Thành phố Hồ Chí Minh','','tieuchuan',828,'2025-06-13 08:49:14','2025-06-13 08:49:14'),(54,70,'Nguyễn Văn Tiên','0896512455','178/23 phan văn hân','Phường 17','Quận Bình Thạnh','Thành phố Hồ Chí Minh','','tieuchuan',828,'2025-06-13 08:53:29','2025-06-13 08:53:29'),(55,71,'Nguyễn Văn Trường','0896512454','178/23 phan văn hân','Phường 17','Quận Bình Thạnh','Thành phố Hồ Chí Minh','','tieuchuan',22703,'2025-06-13 08:55:45','2025-06-13 08:55:45'),(56,72,'Trần Văn Hiếu','0896512678','178/23 phan văn hân','Phường 17','Quận Bình Thạnh','Thành phố Hồ Chí Minh','','tieuchuan',828,'2025-06-17 20:16:51','2025-06-17 20:16:51'),(57,73,'Lê Huy Thông','0795504516','178/23 phan văn hân ','Phường 17','Quận Bình Thạnh','Thành phố Hồ Chí Minh','giao buổi trưa','tieuchuan',828,'2025-07-07 00:46:48','2025-07-07 00:46:48'),(58,74,'Lê Huy Thông','0795504516','178/23 phan văn hân  ','Phường 17','Quận Bình Thạnh','Thành phố Hồ Chí Minh','Giao buổi trưa','tieuchuan',828,'2025-07-07 00:51:44','2025-07-07 00:51:44'),(59,75,'Lê Huy Thông','0795504516','178/23 phan văn hân  ','Phường 17','Quận Bình Thạnh','Thành phố Hồ Chí Minh','Giao buổi trưa','tieuchuan',828,'2025-07-07 00:56:44','2025-07-07 00:56:44'),(60,76,'Tân Phúc Sang','0978456778','178/23 phan văn hân ','Phường 17','Quận Bình Thạnh','Thành phố Hồ Chí Minh','','tieuchuan',828,'2025-07-07 02:38:39','2025-07-07 02:38:39'),(61,77,'Trần Minh Phúc','0999666645','178/23 phan văn hân ','Phường 17','Quận Bình Thạnh','Thành phố Hồ Chí Minh','','tieuchuan',828,'2025-07-07 02:48:02','2025-07-07 02:48:02'),(62,78,'Nguyễn Văn Phung','0999345678','178/23 phan văn hân','Phường 17','Quận Bình Thạnh','Thành phố Hồ Chí Minh','','tieuchuan',828,'2025-07-07 02:57:11','2025-07-07 02:57:11'),(63,79,'le huy đức','0789765234','178/23 phan văn hân','Phường 17','Quận Bình Thạnh','Thành phố Hồ Chí Minh','','tieuchuan',828,'2025-07-07 03:15:13','2025-07-07 03:15:13'),(64,80,'le huy tân','0896512445','178/23 phan văn hân','Phường 17','Quận Bình Thạnh','Thành phố Hồ Chí Minh','','tieuchuan',828,'2025-07-07 03:33:37','2025-07-07 03:33:37'),(65,81,'Nguyen Van B','0912348678','1234 Le Loi','Phuong 5','Quan 2','Ho Chi Minh','Giao trong gio hanh chinh','tieuchuan',20000,'2025-07-07 07:40:30','2025-07-07 07:40:30'),(66,82,'Nguyễn Văn Phúc','0798456333','178/23 phan văn hân','Phường 17','Quận Bình Thạnh','Thành phố Hồ Chí Minh','','tieuchuan',828,'2025-07-08 06:37:58','2025-07-08 06:37:58'),(67,83,'Lê Hồng Nhã','0985647783','178/23 phan văn hân','Phường 17','Quận Bình Thạnh','Thành phố Hồ Chí Minh','','tieuchuan',828,'2025-07-08 07:19:52','2025-07-08 07:19:52'),(68,84,'Trần Văn Quốc','0798676323','178/23 phan văn hân','Phường 17','Quận Bình Thạnh','Thành phố Hồ Chí Minh','','tieuchuan',828,'2025-07-10 01:33:46','2025-07-10 01:33:46'),(69,85,'Lê Thành Quang','0905454437','178/23 phan văn hân','Phường 17','Quận Bình Thạnh','Thành phố Hồ Chí Minh','Giao buổi trưa','nhanh',31242,'2025-07-10 01:39:14','2025-07-10 01:39:14'),(70,86,'Lê Thanh Quang','0795706414','178/23 Phan Văn Hân ','Phường 17','Quận Bình Thạnh','Thành phố Hồ Chí Minh','Giao hàng buổi trưa giúp tôi','nhanh',31242,'2025-07-10 01:51:48','2025-07-10 01:51:48'),(71,87,'Lê Thanh Quang','0904788275','178/23 Phan Văn Hân ','Phường 17','Quận Bình Thạnh','Thành phố Hồ Chí Minh','Giao hàng buổi trưa giúp tôi','nhanh',31242,'2025-07-10 02:17:05','2025-07-10 02:17:05'),(72,88,'Lê Thành Quang','0896512448','178/23 Phan Văn Hân ','Phường 17','Quận Bình Thạnh','Thành phố Hồ Chí Minh','Giao hàng buổi trưa giúp tôi','nhanh',31242,'2025-07-10 02:34:50','2025-07-10 02:34:50'),(73,89,'Nguyễn Văn Thanh','0908786544','178/23 Phan Văn Hân ','Phường 17','Quận Bình Thạnh','Thành phố Hồ Chí Minh','','tieuchuan',828,'2025-07-10 03:22:13','2025-07-10 03:22:13'),(74,90,'Nguyễn Văn Thanh','0908786544','178/23 Phan Văn Hân','Phường 17','Quận Bình Thạnh','Thành phố Hồ Chí Minh','','tieuchuan',828,'2025-07-10 03:26:27','2025-07-10 03:26:27'),(75,91,'Nguyễn Văn Thanh','0908786544','178/23 Phan Văn Hân ','Phường 17','Quận Bình Thạnh','Thành phố Hồ Chí Minh','','tieuchuan',828,'2025-07-10 03:30:19','2025-07-10 03:30:19'),(76,92,'Nguyễn Văn Thanh','0908786549','178/23 Phan Văn Hân ','Phường 17','Quận Bình Thạnh','Thành phố Hồ Chí Minh','','tieuchuan',828,'2025-07-10 04:06:51','2025-07-10 04:06:51'),(77,93,'Lê Huy Thông','0904564453','178/23 Phan Văn Hân ','Phường 17','Quận Bình Thạnh','Thành phố Hồ Chí Minh','Giao hàng buổi trưa','nhanh',31242,'2025-07-12 04:04:02','2025-07-12 04:04:02'),(78,94,'le huy nghĩa','0905673465','178/23 Phan Văn Hân','Phường 17','Quận Bình Thạnh','Thành phố Hồ Chí Minh','','tieuchuan',828,'2025-07-12 04:11:55','2025-07-12 04:11:55'),(79,95,'Lê Huy Thông','0987651244','178/23 Phan Văn Hân ','Phường 17','Quận Bình Thạnh','Thành phố Hồ Chí Minh','Giao buổi trưa','nhanh',31242,'2025-07-12 04:24:23','2025-07-12 04:24:23'),(80,96,'Nguyễn Văn Nghĩa','0903346674','178/23 Phan Văn Hân','Phường 17','Quận Bình Thạnh','Thành phố Hồ Chí Minh','Giao buổi trưa','nhanh',31242,'2025-07-12 04:53:30','2025-07-12 04:53:30');
/*!40000 ALTER TABLE `shipping_info` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `suppliers`
--

DROP TABLE IF EXISTS `suppliers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `suppliers` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `phone` varchar(15) DEFAULT NULL,
  `address` text,
  `email` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `suppliers`
--

LOCK TABLES `suppliers` WRITE;
/*!40000 ALTER TABLE `suppliers` DISABLE KEYS */;
INSERT INTO `suppliers` VALUES (3,'Công Ty Tnhh Sản Xuất Thương Mại','0999966554','405 Đ. Xô Viết Nghệ Tĩnh, Phường 14, Bình Thạnh, Hồ Chí Minh','sxtm@gmail.com'),(4,'Công Ty Tnhh Sản Xuất Công Nghiệp','0123556654','20/5 Đ. Đinh Bộ Lĩnh, Phường 14, Bình Thạnh, Hồ Chí Minh','delta@gmail.com'),(7,'Công ty TNHH FPT Semiconductor','024 7300 8899','Tòa nhà FPT, số 17 Duy Tân, Cầu Giấy, Hà Nội','contact@fpt-semiconductor.com'),(8,'Công ty Cổ phần Bkav','024 3786 8888','Tòa nhà Bkav, Khu đô thị mới Cầu Giấy, Hà Nội',' contact@bkav.com'),(9,'Công ty Cổ phần Công nghệ DTT','024 3719 9999',' Tòa nhà DTT, số 19 Thụy Khuê, Tây Hồ, Hà Nội','info@dtt.vn'),(10,'Công ty TNHH Foxconn Việt Nam','0204 3823 888','KCN Quang Châu, Bắc Giang','vietnam.service@foxconn.com');
/*!40000 ALTER TABLE `suppliers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `iduser` int NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) DEFAULT NULL,
  `fullname` varchar(100) NOT NULL,
  `phone` varchar(15) DEFAULT NULL,
  `gender` enum('male','female') DEFAULT NULL,
  `address` varchar(500) DEFAULT NULL,
  `avatar` varchar(255) DEFAULT NULL,
  `permission` enum('admin','staff','client') DEFAULT NULL,
  `tokenVersion` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`iduser`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `phone` (`phone`),
  UNIQUE KEY `cccd` (`address`)
) ENGINE=InnoDB AUTO_INCREMENT=45 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (24,'lhthong@gmail.com','$2b$10$kSj4HAMdjogrE/68Q2JbquQ2YEgPYoS5leyRdczNYuBZU5sQzYhVi','Lê Huy Thông','0795346988','male','178/23 Phan Văn Hân, Phường 17, Quận Bình Thạnh, TP Hồ Chí Minh','/uploads/avatars/1751884911677-116975867.webp','admin',6),(43,'khachhang@gmail.com','$2b$10$2vRj5bFr6ZF5Vp71zu.Oc.PYL0mBTLXzn6yIdD3jcKCMvOP/knSP.','khachhang','0896512446','male','45A Hoa Lan , P7 , Phú Nhuận','/uploads/avatars/1749952348486-228263766.webp','client',0),(44,'lhsang@gmail.com','$2b$10$loDhf4dgpPdo0/xMZkgYJuTy5tjBvrKdAbgHu2B/lkRHWXvKgIV9a','Lê Huy Sáng','0896512334','male','Thạch Hạ, TP. Hà Tĩnh, Tỉnh Hà Tĩnh','/uploads/avatars/1752136315734-164943565.jpeg','staff',0);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping routines for database 'kho_hang_db'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-07-13 11:21:56
