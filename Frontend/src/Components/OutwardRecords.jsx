import React from "react";

class OutwardRecords extends React.Component{
    render(){
        return(
            <div>
                OutwardRecords
            </div>
        )
    }
}

export default OutwardRecords;



calculateTotal = (tableId) => {
    $(tableId)
      .find("tbody tr td:nth-child(2)")
      .map(function (e) {
        return parseFloat($(e).text()).reduce(
          (total, amount) => total + amount,
          0
        );
      });
  };
