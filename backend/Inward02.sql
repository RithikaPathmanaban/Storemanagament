CREATE TABLE Inward02(
Inward02ID INT IDENTITY PRIMARY KEY NOT NULL,
WarehouseLocation VARCHAR(255) NULL,
ExpectedDeliveryDate DATE NULL,
QualityControlStatus VARCHAR(255) NULL,
QualityControlDate DATE NULL,
QualityControlNotes VARCHAR(255) NULL,
ReturnStatus VARCHAR(255) NULL,
ReturnReason VARCHAR(255) NULL,
ReturnDate DATE NULL,
ReturnQuantity INT NULL,
ReturnNotes VARCHAR(255) NULL,
DamagedStatus VARCHAR(255) NULL,
DamagedQuantity INT NULL,
DamagedDescription VARCHAR(255) NULL,
WarrantyInformation VARCHAR(255) NULL,
ProductID INT NOT NULL,
QuanityReceived INT NULL,
Price INT NULL,
TotalCost DECIMAL(10,2) NULL,
ExpiryDate DATE NULL,
Condition VARCHAR(255) NULL,
StorageInstructions VARCHAR(255) NULL,
CHECK ([Condition]='Unordered' OR [Condition]='damaged' OR [Condition]='used' OR [Condition]='new'),
FOREIGN KEY (Inward02ID)
REFERENCES Inward01(ID),
FOREIGN KEY (ProductID)
REFERENCES ProductMaster(ProductID));

SELECT * FROM Inward02;

DROP TABLE Inward02;