AddData=()=>{
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
}