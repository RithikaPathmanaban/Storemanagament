import React from "react";

class InwardRecords extends React.Component {
  componentDidMount() {
    const ClassObj = new InwardRecords();
    $(".chosen-select").chosen();
    $(document).ready(() => {
      var TableAPI = {
        // scrollX: true,
        scrollY: "60vh",
        select: true,
        info: false,
        lengthChange: true,
        ordering: true,
        autoWidth: false,
        responsive: false,
        searching: false,
        paging: false,
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
        aoColumns: [
          { mData: "ProductName", width: "40%", className: "text-wrap" },
          { mData: "UOM", width: "40%", className: "text-wrap" },
          { mData: "Staff02", width: "40%", className: "text-wrap" },
          { mData: "Discount", width: "40%", className: "text-wrap" },
          { mData: "Price", width: "40%", className: "text-wrap" },
          { mData: "NetPrice", width: "40%", className: "text-wrap" },
          { mData: "Tax", width: "40%", className: "text-wrap" },
          { mData: "ExpDate", width: "40%", className: "text-wrap" },
        ],
      };
      const dataTable = $("#Inward02Table").DataTable(TableAPI);
      $(
        "#AddCaptionValue td:nth-child(2), #SubCaptionValue td:nth-child(2)"
      ).addClass("text-right");
      const key = new $.fn.dataTable.KeyTable(dataTable);
      $("#Inward02Table").on(
        "key.dt",
        function (e, datatable, key, cell, originalEvent) {
          const ClassObj = new InwardRecords();
          // If ENTER key is pressed
          if (key === 13) {
            const rowData = $("#Inward02Table")
              .DataTable()
              .row(".selected")
              .data();
          }
        }
      );

      $("#Inward02Table").on("key-focus.dt", function (e, datatable, cell) {
        // Select highlighted row
        $(dataTable.row(cell.index().row).node()).addClass("selected");
      });
      $("#Inward02Table").on("key-blur.dt", function (e, datatable, cell) {
        // Deselect highlighted row
        $(dataTable.row(cell.index().row).node()).removeClass("selected");
      });

      function handleRowFocus(tableId) {
        $(`${tableId} tbody tr`).on("focusin", function () {
          $(this).addClass("selected");
        });
        $(`${tableId} tbody tr`).on("focusout", function () {
          $(this).removeClass("selected");
        });
      }

      handleRowFocus("#AddCaptionValue");
      handleRowFocus("#SubCaptionValue");
    });
    document.addEventListener("keyup", ClassObj.KeyHandler);
    $(document).delegate(
      'table tr td:nth-child(2n)[contenteditable="true"]',
      "keypress keyup keydown",
      (event) => {
        var self = $(event.target);
        if (
          (event.which != 46 || self.text().indexOf(".") != -1) &&
          (event.which < 48 || event.which > 57) &&
          event.which != 16
        ) {
          event.preventDefault();
        }
        if (self.text().length > 7) {
          self.text(self.text().slice(0, -1)).focus();
          Swal.fire({
            title: "Value length exceeded",
            icon: "error",
            confirmButtonText: "OK",
          });
        }
        // console.log()
        this.calculateTotal(self.parents("table").attr("id"));
        // this.calculateTotal("#SubCaptionValue");
      }
    );
  }
  componentWillUnmount() {
    const ClassObj = new InwardRecords();
    document.removeEventListener("keyup", ClassObj.KeyHandler);
  }
  KeyHandler = (e) => {
    const ClassObj = new InwardRecords();
    if (e.altKey && e.keyCode === 83) {
      console.log(e.target);
      ClassObj.AddData();
    }
  };

  calculateTotal = (tableId) => {
    console.log(tableId);
    const total =  $('#'+tableId + 'tbody tr td:nth-child(2)')
      .toArray()
      .map(function (e) {
        return Number($(e).text());
      })
      .reduce((a,b) => a + b,0);

	  console.log(total)

	  $('#AddTotal').text(total);
  };

  // calculateTotal = (tableId) => {
  //   let total = 0;
  //   $(tableId)
  //     .find("tbody tr td:nth-child(2)")
  //     .each(function () {
  //       total += parseFloat($(this).text()) || 0;
  //     });
  //   return total;
  // };

  AddData = () => {
    const type = $(
      "#InwardRecords input[id],#InwardRecords select[id],#InwardRecords textarea[id]"
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
  render() {
    // const addTotal = this.calculateTotal("#AddCaptionValue");
    // const subTotal = this.calculateTotal("#SubCaptionValue");

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
                <div className="col-lg-8 pl-2">
                  <div className="card card primary" id="Inward">
                    <div className="card-header bg-blue">
                      <h3 className="card-title text-center mb-3">
                        <strong> InwardMaster </strong>
                      </h3>
                    </div>
                    <div className="card-body bg-white">
                      <div className="pt-0">
                        <div className="row text-bold">
                          <input
                            type="hidden"
                            id="PrimaryBillKey"
                            className="form-control"
                          />
                          <div className="col-lg-2 ValidationClass">
                            Invoice No
                            <input
                              type="text"
                              id="InvoiceNumber"
                              className="form-control form-control-sm"
                              required
                            />
                          </div>
                          < div className="col-lg-2  ValidationClass">
                            Department
                            <select
                              id="DepartmentID"
                              className="form-control chosen-select"
                              required
                            >
                              <option value="1011">HR</option>
                              <option value="1012">Production</option>
                              <option value="1013">Sales</option>
                            </select>
                          </div>
                          <div className="col-lg-2  ValidationClass">
                            Bill Book
                            <select
                              id="BillBookID"
                              className="form-control chosen-select form-control-sm"
                              required
                            >
                              <option value="1">2021</option>
                              <option value="2">2022</option>
                              <option value="3">2023</option>
                              <option value="4">2024</option>
                              <option value="5">2025</option>
                            </select>
                          </div>
                          <div className="col-lg-2  ValidationClass">
                            Bill No
                            <input
                              type="text"
                              id="BillNo"
                              className="form-control form-control-sm"
                              required
                            />
                          </div>
                          <div className="col-lg-2  ValidationClass">
                            Supplier
                            <input
                              type="text"
                              id="LedgerID"
                              className="form-control form-control-sm"
                              required
                            />
                          </div>

                          <div className="col-lg-2  ValidationClass">
                            Staff01
                            <select
                              id="Staff01ID"
                              className="form-control chosen-select form-control-sm"
                              required
                            >
                              <option value="11">Umar</option>
                              <option value="12">Marees</option>
                              <option value="13">Venkatesh</option>
                              <option value="14">Swetha</option>
                              <option value="15">Nivetha</option>
                            </select>
                          </div>
                          <input
                            type="hidden"
                            id="Staff02Details"
                            className="form-control form-control-sm"
                          />
                          <input
                            type="hidden"
                            id="DiscountAmount"
                            className="form-control form-control-sm"
                          />
                          <input
                            type="hidden"
                            id="PrimaryBillKey"
                            className="form-control form-control-sm"
                          />
                          <input
                            type="hidden"
                            id="Status"
                            className="form-control form-control-sm"
                          />
                          <input
                            type="hidden"
                            id="BillBookDetails"
                            className="form-control form-control-sm"
                          />
                          <input
                            type="hidden"
                            id="Narration"
                            className="form-control form-control-sm"
                          />
                          <input
                            type="hidden"
                            id="OrderPlaced"
                            className="form-control form-control-sm"
                          />
                          <input
                            type="hidden"
                            id="ReceivedOrder"
                            className="form-control form-control-sm"
                          />
                          <input
                            type="hidden"
                            id="Staff01ID"
                            className="form-control form-control-sm"
                          />
                          <input
                            type="hidden"
                            id="Staff01Details"
                            className="form-control form-control-sm"
                          />
                          <input
                            type="hidden"
                            id="TaxAmount"
                            className="form-control form-control-sm"
                          />
                          <input
                            type="hidden"
                            id="ModeOfPayment"
                            className="form-control form-control-sm"
                          />
                        </div>
                        <hr />
                        <div className="row">
                          <table
                            id="Inward02Table"
                            className="table-hover table-condensed"
                            width="100%"
                          >
                            <thead>
                              <tr>
                                <th id="ProductID">Product Name</th>
                                <th id="UOM">UOM</th>
                                <th id="Discount">Discount</th>
                                <th id="Price">Price</th>
                                <th id="NetPrice">Net Price</th>
                                <th id="Tax">Tax</th>
                                <th id="ExpDate">Total Amount</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td>
                                  {" "}
                                  <input
                                    type="text"
                                    id="ProductName"
                                    className="form-control form-control-sm"
                                    style={{ padding: "0px" }}
                                  />
                                </td>
                                <td>
                                  {" "}
                                  <input
                                    type="text"
                                    id="UOM"
                                    className="form-control form-control-sm"
                                  />
                                </td>
                                <td>
                                  {" "}
                                  <input
                                    type="text"
                                    id="Discount"
                                    className="form-control form-control-sm"
                                  />
                                </td>
                                <td>
                                  {" "}
                                  <input
                                    type="text"
                                    id="Price"
                                    className="form-control form-control-sm"
                                  />
                                </td>
                                <td>
                                  {" "}
                                  <input
                                    type="text"
                                    id="NetPrice"
                                    className="form-control form-control-sm"
                                  />
                                </td>
                                <td>
                                  {" "}
                                  <input
                                    type="text"
                                    id="Tax"
                                    className="form-control form-control-sm"
                                  />
                                </td>
                                <td>
                                  {" "}
                                  <input
                                    type="text"
                                    id="TotalAmount"
                                    className="form-control form-control-sm"
                                  />
                                </td>
                              </tr>
                            </tbody>
                            <tfoot>
                              <tr>
                                <th></th>
                                <th></th>
                                <th></th>
                                <th></th>
                                <th></th>
                                <th></th>
                                <th id="TotalAmount">TotalAmount</th>
                              </tr>
                            </tfoot>
                          </table>
                        </div>
                        <div className="row mt-2 ml-2">
                          <div className="col-lg-2">
                            <button
                              type="Submit"
                              className="btn btn-success"
                              onClick={this.AddData}
                            >
                              Save
                            </button>
                          </div>
                          <div className="col-lg-8"></div>
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
                      {/* </div> */}
                    </div>
                  </div>
                </div>
                <div className="col-lg-4 pl-0 pr-1">
                  <div className="card card-danger">
                    <div className="card-header">
                      {/* <h3 className="card-title">Product Details</h3> */}
                    </div>
                    <div className="card-body">
                      <ul className="nav nav-tabs" role="tablist">
                        <li className="nav-item">
                          <a
                            className="nav-link active text-bold"
                            data-toggle="tab"
                            href="#tabs-1"
                            role="tab"
                          >
                            Add
                          </a>
                        </li>
                        <li className="nav-item">
                          <a
                            className="nav-link text-bold"
                            data-toggle="tab"
                            href="#tabs-2"
                            role="tab"
                          >
                            Sub
                          </a>
                        </li>
                      </ul>
                      <div className="tab-content">
                        <div
                          className="tab-pane active"
                          id="tabs-1"
                          role="tabpanel"
                        >
                          <table id="AddCaptionValue" width="100%">
                            <thead className="text-bold bg-indigo ">
                              <tr>
                                <th>Description</th>
                                <th>Amount</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td className="text-bold">Gunny</td>
                                <td
                                  contentEditable="true"
                                  suppressContentEditableWarning={true}
                                ></td>
                              </tr>
                              <tr>
                                <td className="text-bold">Basket</td>
                                <td
                                  contentEditable="true"
                                  suppressContentEditableWarning={true}
                                ></td>
                              </tr>
                              <tr>
                                <td className="text-bold">Box</td>
                                <td
                                  contentEditable="true"
                                  suppressContentEditableWarning={true}
                                ></td>
                              </tr>
                              <tr>
                                <td className="text-bold">AdvancedAmount</td>
                                <td
                                  contentEditable="true"
                                  suppressContentEditableWarning={true}
                                ></td>
                              </tr>
                              <tr>
                                <td
                                  contentEditable="true"
                                  suppressContentEditableWarning={true}
                                  className="text-bold"
                                >
                                  Others
                                </td>
                                <td
                                  contentEditable="true"
                                  suppressContentEditableWarning={true}
                                ></td>
                              </tr>
                            </tbody>
                            <tfoot>
                              <tr>
                                <th>Total</th>
                                <th id="AddTotal"></th>
                              </tr>
                            </tfoot>
                          </table>
                        </div>
                        <div className="tab-pane" id="tabs-2" role="tabpanel">
                          <table id="SubCaptionValue" width="100%">
                            <thead className="text-bold bg-indigo ">
                              <tr>
                                <th>Description</th>
                                <th>Amount</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td className="text-bold">Less</td>
                                <td
                                  contentEditable="true"
                                  suppressContentEditableWarning={true}
                                ></td>
                              </tr>
                              <tr>
                                <td className="text-bold">CreditNote</td>
                                <td
                                  contentEditable="true"
                                  suppressContentEditableWarning={true}
                                ></td>
                              </tr>

                              <tr>
                                <td
                                  contentEditable="true"
                                  suppressContentEditableWarning={true}
                                  className="text-bold"
                                >
                                  Others
                                </td>
                                <td
                                  contentEditable="true"
                                  suppressContentEditableWarning={true}
                                ></td>
                              </tr>
                            </tbody>
                            <tfoot>
                              <tr>
                                <th>Total</th>
                                <th ></th>
                              </tr>
                            </tfoot>
                          </table>
                        </div>
                      </div>
                      <hr />
                      <div className=" row text-bold">
                        <div className="col-lg-6">
                          <label>ExpectedDeliveryDate</label>
                        </div>
                        <div className="col-lg-4">
                          <input
                            type="date"
                            id="ExpectedDeliveryDate"
                            className="form-control form-control-sm"
                            required
                          />
                        </div>
                      </div>
                      <div className="row text-bold mt-2">
                        <div className="col-lg-6">
                          <label>ActualDeliveryDate</label>
                        </div>
                        <div className="col-lg-4">
                          <input
                            type="date"
                            id="ActualDeliveryDate"
                            className="form-control form-control-sm"
                            required
                          />
                        </div>
                      </div>
                      <div className="mt-1 row text-bold">
                        <div className="col-lg-6        ">
                          <label>TransDate</label>
                        </div>
                        <div className="col-lg-4">
                          <input
                            type="date"
                            id="TransDate"
                            className="form-control form-control-sm"
                            required
                          />
                        </div>
                      </div>
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

export default InwardRecords;
