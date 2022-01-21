import React, { useEffect, useState } from "react";
import clayful from "clayful/client-js";
import "./PaymentPage.css";

function PaymentPage() {
  const [cart, setCart] = useState({});
  const [paymentMethods, setPaymentMethods] = useState([]);
  // 주문자
  const [sendUserInfo, setSendUserInfo] = useState({
    mobile: "",
    full: "",
  });
  // 주문자 수취자 동일
  const [isChecked, setIsChecked] = useState(false);
  // 수취자
  const [recvUserInfo, setRecvUserInfo] = useState({
    mobile: "",
    full: "",
  });
  // 배송
  const [address, setAddress] = useState({
    postCode: "",
    state: "",
    city: "",
    address1: "",
    address2: "",
    country: "",
  });
  // 결제 정보
  const [paymentMethod, setPaymentMethod] = useState("");

  const handleSendChange = (event) => {
    const { name, value } = event.target;
    setSendUserInfo((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  const onCheckboxClick = (event) => {
    if (isChecked) {
      setIsChecked(false);
      setRecvUserInfo({
        full: "",
        mobile: "",
      });
    } else {
      setIsChecked(true);
      setRecvUserInfo({
        full: sendUserInfo.full,
        mobile: sendUserInfo.mobile,
      });
    }
  };

  const handleRecvChange = (event) => {
    const { name, value } = event.target;
    setRecvUserInfo((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const getCartData = () => {
    let Cart = clayful.Cart;

    let options = {
      customer: localStorage.getItem("accessToken"),
    };

    Cart.getForMe({}, options, function (err, result) {
      if (err) {
        // Error case
        console.log(err.code);
        return;
      }
      let data = result.data;
      // console.log(data);
      setCart(data.cart);
    });
  };

  const getPaymentData = () => {
    var PaymentMethod = clayful.PaymentMethod;

    PaymentMethod.list({}, function (err, result) {
      if (err) {
        // Error case
        console.log(err.code);
        return;
      }
      var data = result.data;
      // console.log(data);
      setPaymentMethods(data);
    });
  };

  useEffect(() => {
    getCartData();
    getPaymentData();
  }, []);

  return (
    <div className="pageWrapper">
      <div className="payment">
        <div style={{ width: "100%", display: "flex", borderBottom: "1px solid #d2d2d7" }}>
          <div style={{ width: "50%", fontSize: 24, fontWeight: 500 }}>결제</div>
          <div style={{ width: "50%", display: "flex", justifyContent: "end" }}>주문 총 가격: {cart.total?.amount.raw + 3000}원 (3000원 배송비)</div>
        </div>
        <div style={{ marginTop: 16, width: "100%", display: "flex" }}>
          <div style={{ width: "49%" }}>
            <h5>주문자 정보</h5>
            <input onChange={handleSendChange} value={sendUserInfo.full} type="text" name="full" placeholder="주문자명" />
            <input onChange={handleSendChange} value={sendUserInfo.mobile} type="text" name="mobile" placeholder="무선 연락처" />
            <div>
              <input onChange={onCheckboxClick} checked={isChecked} type="checkbox" id="sameInfo" name="sameInfo" />
              &nbsp;
              <label htmlFor="sameInfo">수취자 정보도 위와 동일합니다.</label>
            </div>
          </div>
          <div style={{ width: "2%" }}></div>
          <div style={{ width: "49%" }}>
            <h5>수취자 정보</h5>
            <input onChange={handleRecvChange} value={recvUserInfo.full} type="text" name="full" placeholder="수취자명" />
            <input onChange={handleRecvChange} value={recvUserInfo.mobile} type="text" name="mobile" placeholder="무선 연락처" />
            <h5>배송 주소</h5>
            <input type="text" placeholder="주소" readOnly />
            <input type="text" placeholder="상세주소" />
            <input type="text" placeholder="우편번호" readOnly />
            <h5>결제</h5>
            <select name="" id="">
              <option value="">옵션</option>
            </select>
            <button style={{ width: "100%", marginTop: 10 }}>주문</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PaymentPage;
