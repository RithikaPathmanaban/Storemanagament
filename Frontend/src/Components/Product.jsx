import React from "react";

class Product extends React.Component {
  AjaxScript = async (Action, PostData, api) => {
    console.log(PostData);
    const ClassObj = new Product();

    fetch("http://localhost:9000/" + api, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(PostData),
    })
      .then((response) => response.json())
      .then(async (data) => {
        if (Action === "StoreProductInsUp") {
          console.log(data);
          await $("#ProductTable").DataTable().ajax.reload().draw();

          Swal.fire({
            title: data.notifier,
            text: data.Message,
            icon: data.notifier,
            confirmButtonText: "OK",
          });
        } else if (Action === "FetchRowDetails") {
          // console.log(data[0]);
          ClassObj.Reverse(data[0]);
        }
      })
      .catch((error) => {
        Swal.fire({
          title: "Error",
          text: error.message,
          icon: "error",
          confirmButtonText: "OK",
        });
      });
  };

  componentDidMount() {
    const ClassObj = new Product();
    $(".chosen-select").chosen();
    $(document).ready(() => {
      var TableAPI = {
        // rowCallback: function (row, data) {
        //   if (data.Active === 0) {
        //     $(row).addClass("color", "red");
        //   }
        // },
        scrollX: true,
        scrollY: true,
        select: true,
        info: true,
        lengthChange: true,
        ordering: true,
        autoWidth: false,
        responsive: false,
        aLengthMenu: [
          [10, 15, 20, -1],
          [10, 15, 20, "All"],
        ],
        searching: true,
        paging: true,
        language: {
          emptyTable: " ",
        },
        keys: {
          keys: [13, 38, 40, 37, 39],
        },
        select: {
          style: "single",
          info: false,
        },
        ajax: {
          url: "http://localhost:9000/FetchProductBaseDetails",
          method: "POST",
          dataSrc: function (json) {
            return json;
          },
        },
        aoColumns: [
          { mData: "ProductName", width: "40%", className: "text-wrap" },
          { mData: "CategoryID", width: "20%", className: "text-wrap" },
          { mData: "SubCategoryID", width: "20%", className: "text-wrap" },
          { mData: "UOM", width: "20%", className: "text-right text-wrap" },
          { mData: "Tax", width: "20%", className: "text-right text-wrap" },
        ],
      };
      const dataTable = $("#ProductTable").DataTable(TableAPI);
      $("#ProductTable").on(
        "key.dt",
        function (e, datatable, key, cell, originalEvent) {
          const ClassObj = new Product();
          // If ENTER key is pressed
          if (key === 13) {
            const rowData = $("#ProductTable")
              .DataTable()
              .row(".selected")
              .data();

            // console.log(rowData);
            if (typeof rowData === "undefined") return;
            var ProductID = rowData.ProductID;
            ClassObj.AjaxScript(
              "FetchRowDetails",
              { ProductID: ProductID },
              "FetchRowDetails"
            );
          }
        }
      );
      $("#ProductTable").on("key-focus.dt", function (e, datatable, cell) {
        // Select highlighted row
        $(dataTable.row(cell.index().row).node()).addClass("selected");
      });
      $("#ProductTable").on("key-blur.dt", function (e, datatable, cell) {
        // Deselect highlighted row
        $(dataTable.row(cell.index().row).node()).removeClass("selected");
      });
      const addedRow = dataTable.rowData.draw().node();
      const activeStatus = details.Active;
      if (activeStatus !== "1") {
        $(addedRow).css("color", "red");
      }
    });
    document.addEventListener("keyup", ClassObj.KeyHandler);

  }
  componentWillUnmount() {
    const ClassObj = new Product();
    document.removeEventListener("keyup", ClassObj.KeyHandler);
  }
  KeyHandler = (e) => {
    const ClassObj = new Product();
    if (e.altKey && e.keyCode === 83) {
      console.log(e.target);
      ClassObj.AddData();
    }
  };

  AddData = () => {
    const ClassObj = new Product();
    const type = $(
      "#Product input[id],#Product select[id],#Product textarea[id]"
    ).toArray();
    let isValid = true;
    var details = {};
    for (const element of type) {
      if (element.type === "checkbox") {
        details[element.id] = element.checked ? 1 : 0;
        // $(element).prop("checked", false);
      } else if ($(element).hasClass("chosen-select")) {
        details[element.id] = $(element).val();
        // $(element).val("").trigger("chosen:updated");
      } else {
        details[element.id] = $(element).val();
      }
      if (!element.checkValidity()) {
        isValid = false;
      }
    }

    if (isValid) {
      $(".ValidationClass").removeClass("was-validated");
      ClassObj.AjaxScript("StoreProductInsUp", details, "StoreProductInsUp");
      const rowData = {
        ProductName: $("#ProductName").val(),
        CategoryID: $("#CategoryID").val(),
        SubCategoryID: $("#SubCategoryID").val(),
        UOM: $("#UOM").val(),
        Tax: $("#Tax").val(),
        Active: details.Active !== undefined ? details.Active : 1,
      };

      Swal.fire({
        title: "Saved Successfully",
        icon: "success",
        confirmButtonText: "OK",
      });
    } else {
      Swal.fire({
        title: "Fill all the fields",
        icon: "error",
        confirmButtonText: "OK",
      });

      $(".ValidationClass").addClass("was-validated");
      return;
    }
  };
  Reverse(Details) {
    for (var key in Details) {
      if ($(`#${key}`).hasClass("chosen-select")) {
        $(`#${key}`).val(Details[key]).trigger("chosen:updated");
      } else if (key === "Active" || key === "IsReusable") {
        $(`#${key}`).prop("checked", Details[key] === "1");
      } else {
        $(`#${key}`).val(Details[key]);
      }
    }
  }

  Reset() {
    $("#Product input, #Product select, #Product textarea").val("");
    $("#Product input[type='checkbox']").prop("checked", false);
    // $("#LedgerMaster chosen-select").val("").trigger("chosen:updated");
  }
  render() {
    return (
      <div className="content-wrapper">
        <section className="content-header">
          {/* <div className="container-fluid">
            <div className="row">
              
            </div>
          </div> */}
        </section>
        <section className="content">
          <div className="container-fluid">
            <div className="col-lg-12">
              <div className="row">
                <div className="col-lg-4 pl-2">
                  <div className="card card primary" id="Product">
                    <div className="card-header bg-blue">
                      <h3 className="card-title text-center mb-3">
                        <strong> ProductMaster </strong>
                      </h3>
                    </div>
                    <div className="card-body bg-white">
                      <div className="pt-0">
                        <input
                          type="hidden"
                          id="ProductID"
                          className="form-control"
                        />
                        <div className="row ValidationClass">
                          <div className="col-lg-4">
                            <label htmlFor="ProductName">ProductName</label>
                          </div>
                          <div className="col-lg-8">
                            <input
                              type="text"
                              id="ProductName"
                              className="form-control"
                              required
                            />
                          </div>
                        </div>
                        <hr />
                        <div className="row ValidationClass">
                          <div className="col-lg-4">
                            <label htmlFor="Category">Category</label>
                          </div>
                          <div className="col-lg-8">
                            <select
                              id="CategoryID"
                              className="form-control chosen-select"
                              required
                            >
                              <option value="1">Machinery</option>
                              <option value="7">Stationery</option>
                              <option value="4">Electrical</option>
                            </select>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-lg-4">
                            <label htmlFor="SubCategory">SubCategory</label>
                          </div>
                          <div className="col-lg-8">
                            <select
                              id="SubCategoryID"
                              className="form-control chosen-select"
                              required
                            >
                              <option value="2">Dofer</option>
                              <option value="3">Bolrous</option>
                              <option value="5">Wire</option>
                              <option value="6">Bulb</option>
                              <option value="8">Pen</option>
                              <option value="9">Scale</option>
                            </select>
                          </div>
                        </div>
                        <hr />
                        <div className="row text-bold">
                          <div className="col-lg-4 ">
                            UOM
                            <select
                              id="UOM"
                              className="form-control chosen-select"
                              required
                            >
                              <option value="NOP">NOP</option>
                              <option value="KGS">KGS</option>
                            </select>
                          </div>
                          <div className="col-lg-4 ValidationClass">
                            MRP
                            <input
                              type="text"
                              id="MRP"
                              className="form-control"
                              pattern="^[1-9]\d{0,4}$|^100000$"
                              onInput={(e) =>
                                (e.target.value = e.target.value.replace(
                                  /[^0-9]/g,
                                  ""
                                ))
                              }
                              required
                            />
                            <div className="invalid-feedback">
                              MRP should be less than 100000
                            </div>
                          </div>
                          <div className="col-lg-4 ValidationClass">
                            HSN Code
                            <input
                              type="text"
                              id="HSNCode"
                              className="form-control"
                              pattern="^\d{4}$|^\d{8}$"
                              onInput={(e) =>
                                (e.target.value = e.target.value.replace(
                                  /[^0-9]/g,
                                  ""
                                ))
                              }
                              required
                            />
                            <div className="invalid-feedback">
                              HSN code should be 4 or 8 digits
                            </div>
                          </div>
                        </div>
                        <div className="row text-bold">
                          <div className="col-lg-4 ValidationClass">
                            Tax %
                            <input
                              type="text"
                              id="Tax"
                              className="form-control"
                              pattern="^\d{1,2}$"
                              onInput={(e) =>
                                (e.target.value = e.target.value.replace(
                                  /[^0-9]/g,
                                  ""
                                ))
                              }
                              required
                            />
                            <div className="invalid-feedback">
                              Tax should be 1 or 2 digits
                            </div>
                          </div>
                          <div className="col-lg-4"></div>
                          <div className="col-lg-4 text-center">
                            Active
                            <div>
                              <input
                                className="form control form-control-sm"
                                type="checkbox"
                                id="Active"
                                defaultChecked
                              />
                            </div>
                          </div>
                        </div>
                        <hr />
                        <div className="row ">
                          <div className="col-lg-2">
                            <button
                              type="Submit"
                              className="btn btn-success"
                              onClick={this.AddData}
                            >
                              Save
                            </button>
                          </div>
                          <div className="col-lg-7"></div>
                          <div className="col-lg-2">
                            <button
                              className="btn btn-danger"
                              onClick={this.Reset}
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-6 pl-0 pr-1">
                  <div className="card card-danger">
                    <div className="card-header">
                      <h3 className="card-title">Product Details</h3>
                    </div>
                    <div className="card-body">
                      <table
                        id="ProductTable"
                        className="table-hover table-condensed"
                        width="100%"
                      >
                        <thead>
                          <tr>
                            <th>ProductName</th>
                            <th>Category</th>
                            <th>SubCategory</th>
                            <th>UOM</th>
                            <th>Tax</th>
                          </tr>
                        </thead>
                        <tfoot>
                          <tr>
                            <th>ProductName</th>
                            <th>Category</th>
                            <th>SubCategory</th>
                            <th>UOM</th>
                            <th>Tax</th>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }
}

export default Product;
