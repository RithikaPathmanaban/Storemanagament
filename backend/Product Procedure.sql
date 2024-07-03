USE [StoreManagement]
GO
/****** Object:  StoredProcedure [dbo].[StoreMaster01]    Script Date: 05-02-2024 14:39:25 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
ALTER PROC [dbo].[StoreMaster01](
@ProductName VARCHAR(55)='',
@ProductID INT=0,
@CategoryID INT=0,
@SubCategoryID INT=0,
@UOM VARCHAR(55)='',
@MRP DECIMAL(10,2)=0,
@HSNCode BIGINT=0,
@Tax INT=0,
@Active bit=0,
@APIType VARCHAR(55)='',
@ID INT =0,
@Type VARCHAR(55) ='',
@Caption VARCHAR(155)=''
)
AS
BEGIN
	IF(@APIType='FetchProductBaseDetails')
	BEGIN
		SELECT P.ProductID,P.ProductName,c.Caption AS CategoryName,c1.Caption AS SubCategoryName,P.CategoryID,P.SubCategoryID,P.UOM,P.MRP,P.HSNCode,P.Tax,P.Active 
		FROM Product P
		 join CategoryMaster c ON P.CategoryID=c.ID
		 join CategoryMaster c1 ON P.SubCategoryID=c1.ID
		WHERE P.Active=1
	END
	ELSE IF(@APIType='FetchRowDetails')
	BEGIN
		SELECT * FROM Product WHERE ProductID=@ProductID
	END
	ELSE IF (@APIType='StoreProductInsUp')
	BEGIN
		print(@ProductID)
		IF (@ProductID=0)
		BEGIN
			IF EXISTS(SELECT 1 FROM Product WHERE ProductName=@ProductName)
			BEGIN
				SELECT 'Product Details Cannot Be Inserted' AS Message,'error' AS notifier
			END
			ELSE
			BEGIN
				INSERT INTO Product(ProductName,CategoryID,SubCategoryID,UOM,MRP,HSNCode,Tax,Active)
				VALUES(@ProductName,@CategoryID,@SubCategoryID,@UOM,@MRP,@HSNCode,@Tax,@Active)
				SELECT 'Product Details are Inserted Successfully' AS Message, 'success' AS notifier
			END
		END
		ELSE
		BEGIN
			IF EXISTS(SELECT 1 FROM Product WHERE ProductName=@ProductName AND @ProductID<>@ProductID)
			BEGIN
				SELECT 'Product Details Cannot Be Updated' AS Message, 'error' AS notifier
			END
			ELSE
			BEGIN
				UPDATE Product
				SET
				ProductName=@ProductName,
				CategoryID=@CategoryID,
				SubCategoryID=@SubCategoryID,
				UOM=@UOM,
				MRP=@MRP,
				HSNCode=@HSNCode,
				Tax=@Tax,
				Active=@Active
				where ProductID=@ProductID
				SELECT 'Product Details are Updated Successfully' AS Message,'success' AS notifier
			END
		END
	END
	ELSE IF(@APIType='StoreCategoryInsUp')
	BEGIN
		IF @ID=0
		BEGIN
			IF EXISTS(SELECT 1 FROM CategoryMaster where Caption=@Caption)
			BEGIN
				SELECT 'Category Details Cannot Be Inserted' AS MESSAGE,'error' AS notifier
			END
			ELSE
			BEGIN
				INSERT INTO CategoryMaster(Type,Caption,Active)
				VALUES(@Type,@Caption,@Active)
				SELECT 'Category Details Inserted Successfully' AS MESSAGE,'success' AS notifier
			END
		END
		ELSE
		BEGIN
			IF EXISTS(SELECT 1 FROM CategoryMaster WHERE Caption=@Caption and ID<> @ID)
			BEGIN
				SELECT 'Category Details Cannot Be Updated' AS MESSAGE, 'error' AS notifier
			END
			ELSE
			BEGIN
				UPDATE CategoryMaster
				SET
				Type=@Type,
				Caption=@Caption,
				Active=@Active
				WHERE ID=@ID AND Caption=@Caption
			END
		END
	END
END


	