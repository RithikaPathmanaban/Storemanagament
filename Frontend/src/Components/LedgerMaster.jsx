import React from "react";

class LedgerMaster extends React.Component {
  AjaxScript = async (Action, PostData, api) => {
    console.log(PostData);
    const ClassObj = new LedgerMaster();

    fetch("http://localhost:9000/" + api, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(PostData),
    })
      .then((response) => response.json())
      .then(async (data) => {
        if (Action === "StoreLedgerInU") {
          console.log(data);
          await $("#LedgerTable").DataTable().ajax.reload().draw();

          Swal.fire({
            title: data.notifier,
            text: data.Message,
            icon: data.notifier,
            confirmButtonText: "OK",
          });
        } else if (Action === "FetchLedgerRowDetails") {
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
    $(".chosen-select").chosen();
    $(document).ready(() => {
      var TableAPI = {
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
          url: "http://localhost:9000/FetchLedgerBaseDetails",
          method: "POST",
          dataSrc: function (json) {
            return json;
          },
        },
        aoColumns: [
          { mData: "LedgerType", width: "40%", className: "text-nowrap" },
          { mData: "Name", width: "20%", className: "text-nowrap" },
          { mData: "PhoneNO", width: "20%", className: "text-nowrap" },
          { mData: "Active", width: "20%", className: "text-right text-nowrap" },      
        ],
      };
      var BranchTableAPI = {
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
          url: "http://localhost:9000/FetchBranchDetails", 
          method: "POST",
          dataSrc: function (json) {
            // console.log(json);
            return json;
            
          },
        },
        aoColumns: [
          { mData: "BranchName", width: "40%", className: "text-nowrap" },
          { mData: "BranchPinCode", width: "20%", className: "text-nowrap" },
          { mData: "BranchContact", width: "20%", className: "text-nowrap" },
          { mData: "GSTIN", width: "10%", className: "text-nowrap" },
          { mData: "BranchEmailID", width: "10%", className: "text-right text-nowrap" },
        ],
      };

      const dataTable = $("#LedgerTable").DataTable(TableAPI);
      $("#LedgerTable").on(
        "key.dt",
      function (e, datatable, key, cell, originalEvent) {
          const ClassObj = new LedgerMaster();
          // If ENTER key is pressed
          if (key === 13) {
            const rowData = $("#LedgerTable")
              .DataTable()
              .row(".selected")
              .data();

            console.log(rowData);
            if (typeof rowData === "undefined") return;
            var LedgerID = rowData.LedgerID;
            ClassObj.AjaxScript(
              "FetchLedgerRowDetails",
              { LedgerID: LedgerID },
              "FetchLedgerRowDetails"
            );
          }
        }
      );
      $("#LedgerTable").on("key-focus.dt", function (e, datatable, cell) {
        // Select highlighted row
        $(dataTable.row(cell.index().row).node()).addClass("selected");
      });
      $("#LedgerTable").on("key-blur.dt", function (e, datatable, cell) {
        // Deselect highlighted row
        $(dataTable.row(cell.index().row).node()).removeClass("selected");
      });
      const modaltable = $("#BranchTable").DataTable(BranchTableAPI);
      $("#BranchTable").on(
        "key.dt",
        function (e, datatable, key, cell, originalEvent) {
          if (key === 13) {
            const rowData = $("#BranchTable")
              .DataTable()
              .row(".selected")
              .data();
            console.log(rowData);
            if (typeof rowData === "undefined") return;
            new LedgerMaster().Reverse(rowData);
          }
        }
      );
      $("#BranchTable").on("key-focus.dt", function (e, datatable, cell) {
        // Select highlighted row
        $(modaltable.row(cell.index().row).node()).addClass("selected");
      });
      $("#BranchTable").on("key-blur.dt", function (e, datatable, cell) {
        // Deselect highlighted row
        $(modaltable.row(cell.index().row).node()).removeClass("selected");
      });
    });
  }
  AddData = () => {
    const ClassObj = new LedgerMaster();
    const type = $(
      "#LedgerMaster input,#LedgerMaster select,#LedgerMaster textarea"
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
    console.log(details);
    if (isValid) {
      $(".ValidationClass").removeClass("was-validated");
      ClassObj.AjaxScript("StoreLedgerInU", details, "StoreLedgerInU");
      const rowData = {
        LedgerType:  $("#LedgerType").val(),
        Name: $("#Name").val(),
        PhoneNO:  $("#PhoneNO").val(),
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
  ModalAddData = () => {
    const type = $(
      "#BranchModal input,#BranchModal select,#BranchModal textarea"
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
    console.log(details);
    if (isValid) {
      $(".ValidationClass").removeClass("was-validated");
      const rowData = {
        BranchName:$("#BranchName").val(),
        BranchPinCode: $("#BranchPinCode").val(),
        BranchContact: $("#BranchContact").val(),
        GSTIN: $("#GSTIN").val(),
        BranchEmailID: $("#BranchEmailID").val()
      };
      // const modaltable = $("#BranchTable").DataTable();
      // const addedRow = modaltable.row.add(Object.values(rowData)).draw().node();

      Swal.fire({
        title: "Saved Successfully",
        icon: "success",
        confirmButtonText: "OK",
      });
      // this.ModalRemoveData();
      console.log(rowdata);
    } else {
      Swal.fire({
        title: "Fill all the fields",
        icon: "error",
        confirmButtonText: "OK",
      });
      $(".ValidationClass").addClass("was-validated");
    }
    return;
  };
  // Reverse(Details) {
  //   for (var key in Details) {
  //     if ($(`#${key}`).hasClass("chosen-select")) {
  //       $(`#${key}`).val(Details[key]).trigger("chosen:updated");
  //     } else if (key === "Active" || key === "IsReusable") {
  //       $(`#${key}`).prop("checked", Details[key] === "1");
  //     } else {
  //       $(`#${key}`).val(Details[key]);
  //     }
  //   }
  // }
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
    $("#LedgerMaster input,#LedgerMaster select,#LedgerMaster textarea").val(
      ""
    );
    $("#LedgerMaster input[type='checkbox']").prop("checked", false);
    $("#LedgerMaster chosen-select").val("").trigger("chosen:updated");
  }
  ModalRemoveData = () => {
    $("#BranchModal input, #BranchModal textarea ").val("");
  };

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
                  <div className="card card primary" id="LedgerMaster">
                    <div className="card-header bg-blue">
                      <h3 className="card-title text-center mb-3">
                        <strong> LedgerMaster </strong>
                      </h3>
                    </div>
                    <div className="card-body bg-white">
                      <div className="pt-0">
                        <input
                          type="hidden"
                          id="LedgerID"
                          className="form-control"
                        />
                        <div className="row pt-3">
                          <div className="col-lg-4">
                            <label htmlFor="LedgerType">LedgerType</label>
                          </div>
                          <div className="col-lg-8">
                            <select
                              id="LedgerType"
                              className="form-control chosen-select"
                            >
                              <option></option>
                              <option value="1">Staff</option>
                              <option value="2">Supplier</option>
                            </select>
                          </div>
                        </div>
                        <div className="row pt-3 ValidationClass">
                          <div className="col-lg-4">
                            <label htmlFor="Name">Name</label>
                          </div>
                          <div className="col-lg-8">
                            <input
                              type="text"
                              id="Name"
                              className="form-control"
                              required
                            />
                          </div>
                        </div>
                        <div className="row pt-3 ValidationClass">
                          <div className="col-lg-4">
                            <label htmlFor="Address">Address</label>
                          </div>
                          <div className="col-lg-8">
                            <textarea
                              id="Address"
                              className="form-control"
                              rows="3"
                              placeholder="Enter address..."
                              required
                            ></textarea>
                          </div>
                        </div>
                        <hr />
                        <div className="row pt-3 text-bold">
                          <div className="col-lg-4 ValidationClass">
                            Pin Code
                            <input
                              type="text"
                              id="PinCode"
                              className="form-control"
                              pattern="^\d{6}"
                              onInput={(e) =>
                                (e.target.value = e.target.value.replace(
                                  /[^0-9]/g,
                                  ""
                                ))
                              }
                              required
                            />
                            <div className="invalid-feedback">
                              Pincode should be only 6 digits
                            </div>
                          </div>
                          <div className="col-lg-5 ValidationClass">
                            Phone No
                            <input
                              type="tel"
                              id="PhoneNO"
                              className="form-control"
                              pattern="^\d{10}"
                              onInput={(e) =>
                                (e.target.value = e.target.value.replace(
                                  /[^0-9]/g,
                                  ""
                                ))
                              }
                              required
                            />
                            <div className="invalid-feedback">
                              Invalid Contact
                            </div>
                          </div>
                          {/* <div className="row mt-2"> */}
                          <div className="col-lg-3">
                            BranchDetails
                            <button
                              type="button"
                              className="btn btn-primary"
                              data-bs-toggle="modal"
                              data-bs-target="#BranchModal"
                            >
                              Details
                            </button>
                          </div>
                          <div className="modal" id="BranchModal">
                            <div className="modal-dialog modal-xl">
                              <div className="modal-content">
                                <div className="modal-header">
                                  <h4 className="modal-title">
                                    Enter Branch Details
                                  </h4>
                                  <button
                                    type="button"
                                    className="btn-close"
                                    data-bs-dismiss="modal"
                                  ></button>
                                </div>
                                <div className="modal-body">
                                  <div className="row">
                                    <div className="col-lg-4 ValidationClass">
                                      <div className="row">
                                        <div className="col-lg-5">
                                          <b>Name</b>
                                        </div>
                                        <div className="col-lg-7">
                                          <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Enter branch name"
                                            id="BranchName"
                                            required
                                          />
                                        </div>
                                      </div>
                                      <div className="row">
                                        <div className="col-lg-5 mt-3">
                                          <b>Address</b>
                                        </div>
                                        <div className="col-lg-7 mt-3">
                                          <textarea
                                            type="text"
                                            className="form-control"
                                            id="BranchAddress"
                                            placeholder="Enter Branch Address"
                                            required
                                          ></textarea>
                                        </div>
                                      </div>
                                      <div className="row">
                                        <div className="col-lg-5 mt-3">
                                          <b>PinCode</b>
                                        </div>
                                        <div className="col-lg-7 mt-3">
                                          <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Enter Pincode"
                                            id="BranchPinCode"
                                            pattern="^\d{6}"
                                            onInput={(e) =>
                                              (e.target.value =
                                                e.target.value.replace(
                                                  /[^0-9]/g,
                                                  ""
                                                ))
                                            }
                                            required
                                          />
                                          <div className="invalid-feedback">
                                            Pincode should be only 6 digits
                                          </div>
                                        </div>
                                      </div>
                                      <div className="row">
                                        <div className="col-lg-5 mt-3">
                                          <b>GSTIN</b>
                                        </div>
                                        <div className="col-lg-7 mt-3">
                                          <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Enter GSTIN"
                                            id="GSTIN"
                                            pattern="([0-9]{16}|[U]{1}[R]{1}[P]{1})"
                                            required
                                          />
                                          <div className="invalid-feedback">
                                            GSTIN should be URP or 16 digits
                                          </div>
                                        </div>
                                      </div>
                                      <div className="row">
                                        <div className="col-lg-5 mt-3">
                                          <b>Contact</b>
                                        </div>
                                        <div className="col-lg-7 mt-3">
                                          <input
                                            type="tel"
                                            className="form-control"
                                            placeholder="Enter Contact number"
                                            id="BranchContact"
                                            pattern="^\d{4} ?\d{3} ?\d{3}"
                                            onInput={(e) =>
                                              (e.target.value =
                                                e.target.value.replace(
                                                  /[^0-9]/g,
                                                  ""
                                                ))
                                            }
                                            required
                                          />
                                          <div className="invalid-feedback">
                                            Invalid Contact
                                          </div>
                                        </div>
                                      </div>
                                      <div className="row">
                                        <div className="col-lg-5 mt-3">
                                          <b>EmailID</b>
                                        </div>
                                        <div className="col-lg-7 mt-3">
                                          <input
                                            type="email"
                                            id="BranchEmailID"
                                            className="form-control"
                                            pattern="^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
                                            required
                                          />

                                          <div className="invalid-feedback">
                                            Invalid EmailID
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="col-lg-8 ">
                                      <table
                                        id="BranchTable"
                                        className="display"
                                        style={{ width: "100%" }}
                                      >
                                        <thead>
                                          <tr>
                                            <th>Name</th>
                                            <th>PinCode</th>
                                            <th>Contact</th>
                                            <th>GSTIN</th>
                                            <th>EmailID</th>
                                          </tr>
                                        </thead>
                                        <tfoot>
                                          <tr>
                                            <th>Name</th>
                                            <th>PinCode</th>
                                            <th>Contact</th>
                                            <th>GSTIN</th>
                                            <th>EmailID</th>
                                          </tr>
                                        </tfoot>
                                      </table>
                                    </div>
                                  </div>
                                </div>
                                <div className="modal-footer">
                                  <div className="row">
                                    <div className="col-lg-6">
                                      <button
                                        type="Submit"
                                        id="ModalSubmit"
                                        className="  btn btn-primary"
                                        onClick={this.ModalAddData}
                                      >
                                        Submit
                                      </button>
                                    </div>
                                    <div className="col-lg-6">
                                      <button
                                        type="button"
                                        className="btn btn-danger"
                                        data-bs-dismiss="modal"
                                      >
                                        Save
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          {/* </div> */}
                        </div>

                        <div className="row pt-3 ValidationClass">
                          <div className="col-lg-4">
                            <label htmlFor="EmailID">EmailID</label>
                          </div>
                          <div className="col-lg-8">
                            <input
                              type="email"
                              id="EmailID"
                              className="form-control"
                              pattern="^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
                              required
                            />

                            <div className="invalid-feedback">
                              Invalid EmailID
                            </div>
                          </div>
                        </div>
                        <hr />
                        <div className="row">
                          <div className="col-lg-2">
                            <button
                              type="Submit"
                              className="btn btn-success"
                              onClick={this.AddData}
                            >
                              Save
                            </button>
                          </div>
                          <div className="col-lg-8 text-center text-bold">
                          Active
                            <div className="form-check form-switch">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                id="Active
                                "
                                defaultChecked
                              />
                            </div>
                          </div>
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
                      <h3 className="card-title">Ledger Details</h3>
                    </div>
                    <div className="card-body">
                      <table
                        id="LedgerTable"
                        className="table-hover table-condensed"
                        width="100%"
                      >
                        <thead>
                          <tr>
                            <th>LedgerType</th>
                            <th>Name</th>
                            <th>PhoneNO</th>
                            <th>Active</th>
                          </tr>
                        </thead>
                        <tfoot>
                          <tr>
                            <th>LedgerType</th>
                            <th>Name</th>
                            <th>PhoneNO</th>
                            <th>Active</th>
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

export default LedgerMaster;
