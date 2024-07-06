-- CreateTable
CREATE TABLE `Referral` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `referrerFullName` VARCHAR(191) NOT NULL,
    `referrerEmail` VARCHAR(191) NOT NULL,
    `refereeFullName` VARCHAR(191) NOT NULL,
    `refereeEmail` VARCHAR(191) NOT NULL,
    `relationshipToReferee` VARCHAR(191) NOT NULL,
    `positionBeingReferred` VARCHAR(191) NOT NULL,
    `reasonForReferral` VARCHAR(191) NOT NULL,
    `permissionGranted` BOOLEAN NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
