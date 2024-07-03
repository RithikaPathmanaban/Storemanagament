CREATE TABLE Inward(
 ID INT PRIMARY KEY IDENTITY,
 Status VARCHAR(255),
 DeliveryDateExpected DATE,
 ActualDeliveryDate DATE,
 LedgerID INT,
 PurchaseOrder INT DEFAULT(0),
 ReceivedOrder INT DEFAULT(0),
 TotalCost DECIMAL(10,2) DEFAULT(0.00),
 TotalTax DECIMAL(10,2) DEFAULT(0.00),
 TotalDiscount DECIMAL(10,2) DEFAULT(0.00),
 ReceivingStaffID INT,
 ShippingCost	DECIMAL(10,2) DEFAULT(0.00),
 InvoiceNumber VARCHAR(255),
 ReturnStatus VARCHAR(255),
 TotalAmount AS ((([TotalCost]+[TotalTax])+[ShippingCost])-[TotalDiscount]),
 );
 SELECT * FROM Inward

 --CREATE TABLE Supplier(
 --SupplierID INT PRIMARY KEY NOT NULL,
 --SupplierName VARCHAR(255) NULL,
 --ContactPerson VARCHAR(255) NULL,
 --ContactEmail VARCHAR(255) NULL,
 --ContactPhone VARCHAR(255) NULL,
 --);



