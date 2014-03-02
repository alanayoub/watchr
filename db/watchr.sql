SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL';

CREATE SCHEMA IF NOT EXISTS `watchr` DEFAULT CHARACTER SET latin1 COLLATE latin1_swedish_ci ;
USE `watchr` ;

-- -----------------------------------------------------
-- Table `watchr`.`user`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `watchr`.`user` ;

CREATE  TABLE IF NOT EXISTS `watchr`.`user` (
  `id` INT NOT NULL AUTO_INCREMENT ,
  `username` VARCHAR(254) NOT NULL ,
  `password` CHAR(128) NOT NULL ,
  `salt` CHAR(32) NOT NULL ,
  `creation_date` VARCHAR(45) NOT NULL DEFAULT 'now()' ,
  `confirmed` TINYINT(1) NOT NULL DEFAULT 0 ,
  `active` TINYINT(1) NOT NULL DEFAULT 0 ,
  `uuid` CHAR(32) NOT NULL ,
  PRIMARY KEY (`id`) ,
  UNIQUE INDEX `iduser_UNIQUE` (`id` ASC) ,
  UNIQUE INDEX `email_UNIQUE` (`username` ASC) ,
  UNIQUE INDEX `uuid_UNIQUE` (`uuid` ASC) )
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `watchr`.`login_attempt`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `watchr`.`login_attempt` ;

CREATE  TABLE IF NOT EXISTS `watchr`.`login_attempt` (
  `id` INT NOT NULL AUTO_INCREMENT ,
  `ip` VARCHAR(45) NULL ,
  `browser` VARCHAR(45) NULL ,
  `success` TINYINT(1) NOT NULL ,
  `timestamp` TIMESTAMP NOT NULL DEFAULT now() ,
  `username` VARCHAR(254) NULL ,
  PRIMARY KEY (`id`) ,
  UNIQUE INDEX `id_UNIQUE` (`id` ASC) )
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `watchr`.`task`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `watchr`.`task` ;

CREATE  TABLE IF NOT EXISTS `watchr`.`task` (
  `id` INT NOT NULL AUTO_INCREMENT ,
  `user_id` INT NOT NULL ,
  `url` VARCHAR(2083) NOT NULL ,
  `css` VARCHAR(255) NULL ,
  `xpath` VARCHAR(255) NULL ,
  `creation_date` TIMESTAMP NOT NULL DEFAULT now() ,
  `active` TINYINT(1) NOT NULL DEFAULT 1 ,
  `latest_scrape` TIMESTAMP NULL ,
  `title` VARCHAR(100) NULL ,
  `type` VARCHAR(6) NULL ,
  PRIMARY KEY (`id`, `user_id`) ,
  UNIQUE INDEX `task_UNIQUE` (`id` ASC) ,
  INDEX `fk_task_user1` (`user_id` ASC) ,
  CONSTRAINT `fk_task_user1`
    FOREIGN KEY (`user_id` )
    REFERENCES `watchr`.`user` (`id` )
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `watchr`.`result`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `watchr`.`result` ;

CREATE  TABLE IF NOT EXISTS `watchr`.`result` (
  `id` INT NOT NULL AUTO_INCREMENT ,
  `value` VARCHAR(1024) NULL ,
  `asof` TIMESTAMP NULL DEFAULT now() ,
  `task_id` INT NOT NULL ,
  PRIMARY KEY (`id`, `task_id`) ,
  UNIQUE INDEX `id_UNIQUE` (`id` ASC) ,
  INDEX `fk_results_task1` (`task_id` ASC) ,
  CONSTRAINT `fk_results_task1`
    FOREIGN KEY (`task_id` )
    REFERENCES `watchr`.`task` (`id` )
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


CREATE USER `alan` IDENTIFIED BY 'sdfaslkj&sdlkjklsdfjklj"$skldTfjsdklaf';


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
