create table ProductMaster(
ProductID int identity(1,1) primary key not null,
ProductName varchar(155) not null,
CategoryID int not null,
SubCategoryID int not null,
UOM varchar(255) not null,
MRP decimal(10,2) not null,
HSNCode Bigint not null,
Tax int not null
)