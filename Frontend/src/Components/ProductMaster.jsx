import React from "react";
class ProductMaster extends React.Component {
  state = {
    selectedCategory: "", // Initialize the selectedCategory state
  };
  componentDidMount() {
    $(".chosen-select").chosen();
    
    $(document).ready(() => {
      $("#Category").on("change", (event) => {
        this.setState({ selectedCategory: event.target.value });
      });
      var TableAPI = {
        scrollX: true,
        scrollY: true,
        select: true,
        info: false,
        lengthChange: false,
        // searching: false,
        // paging: false,
        language: {
          emptyTable: " ",
        },
        keys: {
          keys: [13, 38, 40, 37, 39],
        },
        ajax: {
          url: "http://localhost:9000/ProductfetchAllData",
          method: "POST", // specify the HTTP method
          headers: {
            "Content-Type": "application/json", // specify the content type
          },
          body: JSON.stringify({}), // specify the request body
          dataSrc: (json) => {
            const jsonString = JSON.stringify(json, null, 2);
            console.log(jsonString);
            return json;
          },
        },
        columns: [
          { data: "ProductName" },
          { data: "UOM" },
          { data: "IsReusable" },
          // Add more columns as needed
        ],
        
      };
      const dataTable = $("#ExampleTable").DataTable(TableAPI);
      $("#ExampleTable").on(
        "key.dt",
        function (e, datatable, key, cell, originalEvent) {
          // If ENTER key is pressed
          if (key === 13) {
            const rowData = $("#ExampleTable").DataTable().row(".selected").data();

            console.log(rowData);
            if (typeof rowData === "undefined") return;
            // if (rowData) {
            //   console.log(rowData)
            // //   this.reverseDataToForm(rowData);
            // }
            var ProductID = rowData.ProductID;

            fetch("http://localhost:9000/ProductFetchData", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ ProductID: ProductID }),
            })
              .then(response => response.json())
              .then(data => {
                console.log(data[0]);
                new ProductMaster().Reverse(data[0]);
              })
              .catch(error => {
                console.error('Error:', error);
              });
            
          }
        }
      );
      $("#ExampleTable").on("key-focus.dt", function (e, datatable, cell) {
        // Select highlighted row
        $(dataTable.row(cell.index().row).node()).addClass("selected");
      });
      $("#ExampleTable").on("key-blur.dt", function (e, datatable, cell) {
        // Deselect highlighted row
        $(dataTable.row(cell.index().row).node()).removeClass("selected");
      });
    });
  }
  Reverse(Details) {
    for (var key in Details) {
      if ($(`#${key}`).hasClass("chosen-select")){
      $(`#${key}`).val(Details[key]).trigger("chosen:updated");
      } else if (key === "Active" || key === "IsReusable") {
      $(`#${key}`).prop("checked", Details[key] === "1");
      } else {
      $(`#${key}`).val(Details[key]);
      }
    }
    }
  FormJSON = () => {
    var type = $(
      "#ProductMaster input,#ProductMaster select,#ProductMaster textarea"
    ).toArray();
    console.log(type);
    var Details = {};
    for (var key in type) {
      if (type[key].type === "checkbox") {
        Details[type[key].id] = type[key].checked ? 1 : 0;
        $(type[key]).prop("checked", false);
      } else if ($(type[key]).hasClass("chosen-select")) {
        Details[type[key].id] = $(type[key]).val();
        $(type[key]).val("").trigger("chosen:updated");
      } else {
        Details[type[key].id] = $(type[key]).val();
      }
    }
    console.log(Details);
    fetch("http://localhost:9000/InsertProduct", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(Details),
    })
      .then(response => response.json())
      .then(data => {
        Swal.fire({
          title: data.notifier,
          text: data.message,
          icon: data.notifier,
          confirmButtonText: "OK",
        });

        $("#ExampleTable").DataTable().ajax.reload().draw();
      })
      .catch(error => {
        Swal.fire({
          title: "Error",
          text: error.message,
          icon: "error",
          confirmButtonText: "OK",
        });
      });
    
    console.log(Details);
    var Details = {
      ProductName: $("#ProductName").val(),
      UOM: $("#UOM").val(),
      // Prize: $("#Prize").val(),
      IsReusable: $("#IsReusable").val(),
      //   PaymentGroup: $("#PaymentGroup").val(),
      //   EmailID: $("#EmailID").val(),
      //   MobileNO: $("#MobileNO").val(),
      //   Designation: $("#Designation").val(),
    };

    // Add the data to the DataTable
    const dataTable = $("#ExampleTable").DataTable();
    const rowData = {
      ProductName: Details.ProductName,
      UOM: Details.UOM,
      // Prize: Details.Prize,
      IsReusable: Details.IsReusable,
    };

    $(
      "#ProductMaster input,#ProductMaster select,#ProductMaster textarea,"
    ).val("");
  };
  // resetFormFields = () => {
  //   $("input, textarea, select, check").val("");
  // };
  render() {
    return (
      <div className="content-wrapper">
     
        {/* <div className=""> */}
          <section className="content">
            <div className="container-fluid">
              {/* <div className="row"> */}
                <div className="col-lg-12">
                  <div className="row">
                    <div className="col-lg-7 pl-2">
                      <div className="card card primary" id="ProductMaster">
                        <div className="card-header bg-blue">
                          <h3 className="card-title">Product Master</h3>
                        </div>
                        <div className="card-body">
                          <div className="row pt-3">
                            
                            <div className="pt-0">
                              {/* <label className="form-label">BillNo</label> */}
                              <input
                                type="hidden"
                                className="form-control"
                                id="ProductID"
                              />
                            </div>
                            <div className="col-lg-3">
                              <label className="form-label">ProductName</label>
                              <input
                                type="text"
                                className="form-control"
                                id="ProductName"
                              />
                            </div>
                            <div className="col-lg-3">
                              <label className="form-label">Category</label>
                              <select
                                className="form-control chosen-select"
                                id="Category"
                                data-placeholder=" "
                              >
                                <option></option>
                                <option>Beverages</option>
                                <option>Fast Food</option>
                                <option>Hot Meals</option>
                                <option>Desserts</option>
                                <option>Specials</option>
                                <option>Custom Orders</option>
                                <option>Bakery</option>
                                <option>Cafeteria Services</option>
                                <option>Pre-Packaged Items</option>
                              </select>
                            </div>
                            {/* <div className="col-lg-2"> */}
                            <div className="col-lg-3">
                              <label className="form-label">SubCategory</label>
                              <input
                                type="text"
                                className="form-control"
                                id="SubCategory"
                              />
                            </div>
                            <div className="col-lg-3">
                              <label className="form-label">MinStock</label>
                              <input
                                className="form-control"
                                id="MinStock"
                                type="text"
                              ></input>
                            </div>
                            {/* <div className="col-lg-2">
                              <label className="form-label">Prize</label>
                              <input
                                className="form-control"
                                id="Prize"
                                type="text"
                              ></input>
                            </div> */}
                            <div className="col-lg-3">
                              <label className="form-label">Code</label>
                              <input
                                className="form-control"
                                id="Code"
                                type="text"
                              ></input>
                            </div>
                            <div className="col-lg-3">
                              <label className="form-label">OtherName</label>
                              <input
                                className="form-control"
                                id="OtherName"
                                type="text"
                              ></input>
                            </div>
                            <div className="col-lg-3">
                              <label className="form-label">ExpDate</label>
                              <input
                                className="form-control"
                                id="ExpDate"
                                type="date"
                                style={{
                                  display:
                                    this.state.selectedCategory ===
                                      "Beverages" ||
                                    this.state.selectedCategory === "Fast Food"
                                      ? "block"
                                      : "none",
                                }}
                              />
                            </div>
                            <div className="col-lg-3">
                              <label className="form-label">BatchNo</label>
                              <input
                                className="form-control"
                                id="BatchNo"
                                type="text"
                              ></input>
                            </div>
                            {/* <div className="col-lg-2">
                              <label className="form-label">UOM</label>
                              <select
                                className="form-control chosen-select"
                                id="UOM"
                                data-placeholder=" "
                              >
                                <option></option>
                                <option>Kgs</option>
                                <option>Litre</option>
                                <option>ml</option>
                                <option>Nos</option>
                                <option>Box</option>
                                <option>Piece</option>
                              </select>
                            </div> */}
                            <div className="pt-0">
                              {/* <label className="form-label">BillNo</label> */}
                              <input
                                type="hidden"
                                className="form-control"
                                id="UOM"
                                value="1"
                              />
                            </div>
                            <div className="col-lg-3">
                              <label className="form-label">HSNNo</label>
                              <input
                                className="form-control"
                                id="HSNNo"
                                type="text"
                              ></input>
                            </div>
                            <div className="col-lg-3">
                              <label className="form-label">Supplier</label>
                              <input
                                className="form-control"
                                id="Supplier"
                                type="text"
                              ></input>
                            </div>
                            <div className="col-lg-3">
                              <label className="form-label">Discount</label>
                              <input
                                className="form-control"
                                id="Discount"
                                type="text"
                              ></input>
                            </div>
                            <div className="col-lg-3">
                              <label className="form-label">Tax</label>
                              <input
                                className="form-control"
                                id="Tax"
                                type="text"
                              ></input>
                            </div>
                            <div className="col-lg-3">
                              <label className="form-label">BarcodeNo</label>
                              <input
                                className="form-control"
                                id="BarcodeNo"
                                type="text"
                              ></input>
                            </div>

                            <div className="col-lg-3">
                              <label className="form-label">Hint</label>
                              <input
                                className="form-control"
                                id="Hint"
                                type="text"
                              ></input>
                            </div>
                            <div className="col-lg-3">
                              <label className="checkbox-label">Active</label>
                              <input
                                type="checkbox"
                                id="Active"
                                className="form-control"
                                value="checkboxValue"
                              />
                            </div>
                            <div className="col-lg-3">
                              <label className="checkbox-label">
                                IsReusable
                              </label>
                              <input
                                type="checkbox"
                                id="IsReusable"
                                className="form-control"
                                value="checkboxValue"
                              />
                            </div>
                          </div>
                          <div className="col-lg-2 mt-3">
                            <button
                              type="Submit"
                              className="btn btn-success"
                              onClick={() => this.FormJSON()}
                            >
                              Submit
                            </button>
                          </div>
                          <div className="mt-3"></div>
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-5 pl-0 pr-1">
                      <div className="card card-danger">
                        <div className="card-header">
                          <h3 className="card-title">Product Details</h3>
                        </div>
                        <div className="card-body">
                          <table
                            id="ExampleTable"
                            className="table-hover table-condensed"
                            width="100%"
                          >
                            <thead>
                              <tr>
                                <th>ProductName</th>
                                <th>UOM </th>
                                {/* <th>Prize</th> */}
                                <th>IsReusable</th>
                                {/* <th>NOP</th>
                                <th>Price</th>
                                <th>Net.Amt</th> */}
                                {/* Add more columns as needed */}
                              </tr>
                            </thead>
                            <tfoot>
                              <tr>
                                <th>ProductName</th>
                                <th>UOM</th>
                                {/* <th>Prize</th> */}
                                <th>IsReusable</th>
                                {/* <th>NOP</th>
                                <th>Price</th>
                                <th>Net.Amt</th> */}
                              </tr>
                            </tfoot>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            {/* </div> */}
          </section>
        </div>
      // </div>
    );
  }
}

export default ProductMaster;
