CREATE procedure InwardMaster(
@PrimaryBillKey int=0,
@DepartmentID int=0,
@Status varchar(255)='',
@BillBookID int=0,
@BillBookDetails nvarchar(max)='{}',
@Narration varchar(255)='',
@ExpectedDeliveryDate date='',
@ActualDeliveryDate date='',
@LedgerID int=0,
@PurchasedOrder int=0,
@ReceivedOrder int=0,
@Staff01ID int=0,
@Staff01Details nvarchar(max)='{}',
@InvoiceNumber varchar(255)='',
@AddCaptionValue int=0,
@SubCaptionValue int=0,
@Tax int=0,
@TotalAmount int=0,
@ModeOfPayment varchar(255)='',
@ProductID int=0,
@Quantity int=0,
@UOM varchar(55)='',
@Staff02ID int=0,
@Staff02Details nvarchar(max)='',
@Discount int=0,
@DiscountAmount int=0,
@Price int=0,
@NetPrice int=0,
@Tax1 int=0,
@ExpDate date='',
@Api varchar(155)=''
)as
begin
	if @Api='FetchInwardBaseDetails'
	begin
		--Inward01
		select Inw.PrimaryBillKey,C.Caption,Inw.Status,Inw.BillBookID,Inw.BillBookDetails,Inw.Narration,Inw.ExpectedDeliveryDate,Inw.ActualDeliveryDate,Led.Name,Inw.PurchasedOrder,Inw.ReceivedOrder,Led1.Name,Inw.Staff01Details,Inw.InvoiceNumber,Inw.AddCaptionValue,Inw.SubCaptionValue,Inw.Tax,Inw.TotalAmount,Inw.ModeOfPayment
		from Inward01 Inw
		join CategoryMaster C on Inw.DepartmentID=C.ID
		join LedgerMaster Led on Inw.LedgerID=Led.LedgerID
		join LedgerMaster Led1 on Inw.Staff01ID= Led1.LedgerID

		--Inward02
		select Inw.ID,P.ProductID,C.Caption,Inw.Quantity,Inw.UOM,Led.Name,Inw.Staff02Details,Inw.Discount,Inw.DiscountAmount,Inw.Price,Inw.NetPrice,Inw.Tax,Inw.TotalAmount,Inw.ExpDate
		from Inward02 Inw
		join CategoryMaster C on Inw.DepartmentID=C.ID
		join ProductMaster P on Inw.ProductID=P.ProductID
		join LedgerMaster Led on Inw.Staff02ID=Led.LedgerID
	end
	else if(@Api='InsUpInwardDetails')
	begin
		if(@PrimaryBillKey=0)
		begin
			insert into Inward01(DepartmentID,Status,BillBookID,BillBookDetails,Narration,ExpectedDeliveryDate,ActualDeliveryDate,LedgerID,PurchasedOrder,ReceivedOrder,Staff01ID,Staff01Details,InvoiceNumber,AddCaptionValue,SubCaptionValue,Tax,TotalAmount,ModeOfPayment)
			values(@DepartmentID,@Status,@BillBookID,@BillBookDetails,@Narration,@ExpectedDeliveryDate,@ActualDeliveryDate,@LedgerID,@PurchasedOrder,@ReceivedOrder,@Staff01ID,@Staff01Details,@InvoiceNumber,@AddCaptionValue,@SubCaptionValue,@Tax,@TotalAmount,@ModeOfPayment)
			SELECT 'Inward01 Details are Inserted Successfully' AS MESSAGE, 'success' AS notifier
		end
		else
		begin
			Update Inward01
			set 
			DepartmentID=@DepartmentID,
			Status=@Status,
			BillBookID=@BillBookID,
			BillBookDetails=@BillBookDetails,
			Narration=@Narration,
			ExpectedDeliveryDate=@ExpectedDeliveryDate,
			ActualDeliveryDate=@ActualDeliveryDate,
			LedgerID=@LedgerID,
			PurchasedOrder=@PurchasedOrder,
			ReceivedOrder=@ReceivedOrder,
			Staff01ID=@Staff01ID,
			Staff01Details=@Staff01Details,
			InvoiceNumber=@InvoiceNumber,
			AddCaptionValue=@AddCaptionValue,
			SubCaptionValue=@SubCaptionValue,
			Tax=@Tax,
			TotalAmount=@TotalAmount,
			ModeOfPayment=@ModeOfPayment
			where PrimaryBillKey=@PrimaryBillKey
			SELECT 'Inward01 Details are Updated Successfully' AS MESSAGE,'success' AS notifier
		end
		if(@ProductID=0)
		begin
			insert into Inward02(ProductID,DepartmentID,Quantity,UOM,Staff02ID,Staff02Details,Discount,DiscountAmount,Price,NetPrice,Tax,ExpDate)
			values(@ProductID,@DepartmentID,@Quantity,@UOM,@Staff02ID,@Staff02Details,@Discount,@DiscountAmount,@Price,@NetPrice,@Tax1,@ExpDate)
			SELECT 'Inward02 Details are Inserted Successfully' AS MESSAGE, 'success' AS notifier
		end
		else
		begin
			update Inward02
			set 
			DepartmentID=@DepartmentID,
			Quantity=@Quantity,
			UOM=@UOM,
			Staff02ID=@Staff02ID,
			Staff02Details=@Staff02Details,
			Discount=@Discount,
			@DiscountAmount=@DiscountAmount,
			Price=@Price,
			NetPrice=@NetPrice,
			Tax=@Tax1,
			TotalAmount=@TotalAmount,
			ExpDate=@ExpDate
			where ProductID=@ProductID
			SELECT 'Inward02 Details are Updated Successfully' AS MESSAGE,'success' AS notifier
		end
	end
end
