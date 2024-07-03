CREATE TABLE ProductMaster(

ProductID INT IDENTITY PRIMARY KEY,
ProductName VARCHAR(255),
Category VARCHAR(255),
SubCategory VARCHAR(255),
MinStock VARCHAR(255),
Code VARCHAR(255),
OtherName VARCHAR(255),
ExpDate VARCHAR(255),
BatchNo VARCHAR(255),
UOM VARCHAR(255),
HSNNo VARCHAR(255),
IsReusable VARCHAR(255),
Supplier VARCHAR(255),
Discount VARCHAR(255),
Tax VARCHAR(255),
BarcodeNo VARCHAR(255),
Active VARCHAR(255),
Hint VARCHAR(255)
)
DROP TABLE ProductMaster
SELECT * FROM ProductMaster

ALTER PROCEDURE CombinedProductProcedure
        @APIType VARCHAR(50),
        @ProductID INT = NULL,
        @ProductName VARCHAR(255) = NULL,
		@Category VARCHAR(255) = NULL,
		@SubCategory VARCHAR(255) = NULL,
		@MinStock VARCHAR(255)= NULL,
		@Code VARCHAR(255) = NULL,
		@OtherName	VARCHAR(255) = NULL,
		@ExpDate VARCHAR(255) = NULL,
		@BatchNo VARCHAR(255) = NULL,
		@UOM VARCHAR(255) = NULL,
		@HSNNo	VARCHAR(255) = NULL,
		@IsReusable VARCHAR(255) = NULL,
		@Supplier VARCHAR(255) = NULL,
		@Discount VARCHAR(255) = NULL,
		@Tax	VARCHAR(255) = NULL,
		@BarcodeNo VARCHAR(255) = NULL,
		@Active VARCHAR(255) = NULL,
		@Hint VARCHAR(255) = NULL
AS
BEGIN
    IF @APIType = 'InsertProduct'
    BEGIN
        IF @ProductID IS NOT NULL AND EXISTS (SELECT 1 FROM ProductMaster WHERE ProductID = @ProductID)
	BEGIN 
		 UPDATE ProductMaster
            SET
              ProductName = @ProductName,
              Category = @Category,
			  SubCategory = @SubCategory,
			  MinStock = @MinStock,
			  Code = @Code,
			  OtherName = @OtherName,
			  ExpDate = @ExpDate,
			  BatchNo = @BatchNo,
			  UOM = @UOM,
			  HSNNo = @HSNNo,
			  IsReusable = @IsReusable,
			  Supplier = @Supplier,
			  Discount = @Discount,
			  Tax = @Tax,
			  BarcodeNo = @BarcodeNo,
			  Active = @Active,
			  Hint = @Hint
            WHERE ProductID = @ProductID;
		SELECT 'Updated' AS Message, 'success' AS Notifier;
	END

	ELSE IF @ProductID IS NULL
		BEGIN
				INSERT INTO ProductMaster(ProductName, Category, SubCategory, MinStock, Code, OtherName, ExpDate, BatchNo, UOM, HSNNo, IsReusable, Supplier, Discount, Tax, BarcodeNo, Active, Hint)
				VALUES (@ProductName, @Category, @SubCategory, @MinStock,@Code, @OtherName, @ExpDate, @BatchNo, @UOM, @HSNNo, @IsReusable, @Supplier, @Discount, @Tax, @BarcodeNo, @Active, @Hint);
				SELECT 'INSERTED' AS Message, 'success' AS Notifier;
		END
    END
    ELSE IF @APIType = 'ProductFetchData'
    BEGIN
        IF @ProductID IS NOT NULL
        BEGIN
            SELECT * FROM ProductMaster WHERE ProductID = @ProductID;
        END
        ELSE
        BEGIN
            SELECT ProductID, ProductName, UOM ,IsReusable FROM ProductMaster ;
        END
    END
    ELSE IF @APIType = 'ProductfetchAllData'
    BEGIN
        SELECT * FROM ProductMaster;
    END
END



exec CombinedProductProcedure
@APIType = 'ProductfetchAllData'

INSERT INTO ProductMaster (ProductName, Category, SubCategory, MinStock, Code, OtherName, ExpDate, BatchNo, UOM, HSNNo, IsReusable, Supplier, Discount, Tax, BarcodeNo, Active, Hint)
VALUES
    ('Silver Plate', 'Plate', 'Silver Plates', '20' ,'12345', 'Shiny Plate', '2024-06-30', 'BATCH001', 'kg', '123456', 'Yes', 'Plate Suppliers Inc.', '10.00', '5.00', '67890', '1', 'Buy 1 Get 1 Free'),
    ('Paper Napkins', 'Tableware', 'Napkins', '50', '23456', 'Eco-Friendly Napkins', '2024-07-15', 'BATCH002', 'Each', '789012', 'No', 'Eco Supplies Co.', '5.00', '18.00', '78901', '1', 'Eco-friendly '),
    ('Sugar Bagasse Plate', 'Plate', 'Sugar Bagasse Plates', '30','34567', 'Eco Plate', '2024-08-31', 'BATCH003', 'Each', '345678', 'Yes', 'Eco Plates Ltd.', '15.00', '12.00', '89012', '1', 'Eco-friendly and biodegradable'),
    ('Water Bottle', 'Bottle', 'Plastic Bottles', '10','45678', 'Hydration Bottle', '2024-09-15', 'BATCH004', 'Liter', '456789', 'Yes', 'Hydrate Supplies Inc.', '10.00', '8.00', '90123', '1', 'Stay hydrated on the go'),
    ('Coffee Beans', 'Beverage', 'Coffee', '5','56789', 'Arabica Coffee', '2024-10-31', 'BATCH005', 'Kg', '567890', 'No', 'Coffee Delights', '20.00', '10.00', '01234', '1', 'Premium coffee beans'),
    ('Tea Bags', 'Beverage', 'Tea', '10', '67890', 'Green Tea Bags', '2025-01-31', 'BATCH006', 'Each', '678901', 'Yes', 'Tea Emporium', '15.00', '5.00', '12345', '1', 'Healthy and refreshing'),
    ('Plastic Cutlery Set', 'Cutlery', 'Plastic Cutlery', '30', '78901', 'Disposable Cutlery', '2024-12-15', 'BATCH007', 'Set', '789012', 'Yes', 'PlasticWare Ltd.', '10.00', '8.00', '23456', '1', 'Convenient and disposable'),
    ('Soft Drinks', 'Beverage', 'Soda', '40', '89012', 'Cola and Fruity Flavors', '2024-11-30', 'BATCH008', 'Liter', '890123', 'No', 'Soda Paradise', '5.00', '18.00', '34567', '1', 'Refreshing beverages'),
    ('Lemonade Mix', 'Beverage', 'Mixers', '15','90123', 'Tangy Lemon Flavor', '2025-02-28', 'BATCH009', 'Kg', '901234', 'No', 'Mix It Up', '15.00', '12.00', '45678', '1', 'Summer thirst quencher'),
    ('Pizza Box', 'Packaging', 'Boxes', '20','01234', 'Takeout Box', '2024-10-15', 'BATCH010', 'Each', '012345', 'Yes', 'Packaging Solutions Inc.', '10.00', '5.00', '56789', '1', 'Protect your pizza');


declare @ProductID int=2
SELECT * FROM ProductMaster WHERE ProductID = @ProductID;