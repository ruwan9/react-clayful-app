import clayful from "clayful/client-js";
import React, { useEffect, useState } from "react";
import { Table } from "react-bootstrap";

function HistoryPage() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    var Order = clayful.Order;

    var options = {
      customer: localStorage.getItem("accessToken"),
    };

    Order.listForMe(options, function (err, result) {
      if (err) {
        // Error case
        console.log(err.code);
        return;
      }

      var data = result.data;
      setHistory(data);
      // console.log(data);
    });
  }, []);
  console.log(history);

  return (
    <div className="pageWrapper">
      <div style={{ width: "50%", fontSize: 24, fontWeight: 500 }}>주문 내역</div>
      <br />
      <Table>
        <thead>
          <tr>
            <th>#</th>
            <th>주문 번호</th>
            <th>총 주문 가격</th>
            <th>주문 일시</th>
          </tr>
        </thead>
        {history.map((item, index) => (
          <tbody key={item._id}>
            <tr>
              <td>{index + 1}</td>
              <td>{item._id}</td>
              <td>{item.total.amount.converted}</td>
              <td>{item.createdAt.formatted}</td>
            </tr>
          </tbody>
        ))}
      </Table>
    </div>
  );
}

export default HistoryPage;
