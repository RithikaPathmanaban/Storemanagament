ALTER PROC LedgerMaster01(
@LedgerID INT=0,
@LedgerType VARCHAR(55)='',
@Name VARCHAR(55)='',
@Address VARCHAR(155)='',
@BranchDetails NVARCHAR(MAX)='{}',
@Pincode INT=0,
@EmailID VARCHAR(55)='',
@PhoneNo BIGINT=0,
@GSTIN VARCHAR(55)='',
@Active BIT=0,
@APIType VARCHAR(55)=''
)
AS
BEGIN
	IF(@APIType='FetchLedgerBaseDetails')
	BEGIN
		SELECT * FROM LedgerMaster
	END
	ELSE IF (@APIType='FetchLedgerRowDetails')
	BEGIN
		SELECT * FROM LedgerMaster WHERE LedgerID=@LedgerID
	END
	else IF (@APIType='StoreLedgerInU')
	BEGIN
		IF(@LedgerID=0)
		BEGIN
			IF EXISTS(SELECT 1 FROM LedgerMaster WHERE Name=@Name)
			BEGIN
				SELECT 'Ledger Details Cannot Be Inserted' as Message, 'error' as notifier
			END
			ELSE
			BEGIN
				INSERT INTO LedgerMaster(LedgerType,Name,Address,BranchDetails,Pincode,EmailID,PhoneNO,GSTIN,Active)
				VALUES(@LedgerType,@Name,@Address,@BranchDetails,@Pincode,@EmailID,@PhoneNo,@GSTIN,@Active)
				SELECT 'Ledger Details are Inserted Successfully' as Message, 'success' as notifier
			END
		END
		ELSE
		BEGIN
			IF EXISTS(SELECT 1 FROM LedgerMaster WHERE Name=@Name AND LedgerID<>@LedgerID)
			BEGIN
				SELECT 'Ledger Details Cannot Be Updated' as Message, 'error' as notifier
			END
			ELSE
			BEGIN
				UPDATE LedgerMaster
				SET 
				LedgerType=@LedgerType,
				Name=@Name,
				Address=@Address,
				BranchDetails=@BranchDetails,
				Pincode=@Pincode,
				EmailID=@EmailID,
				PhoneNO=@PhoneNo,
				GSTIN=@GSTIN,
				Active=@Active
				WHERE Name=@Name AND LedgerID=@LedgerID
				SELECT 'Ledger Details are Updated Successfully' as Message, 'success' as notifier
			END
		END
	END
END

	

