import React, { useEffect, useState } from "react";
import clayful from "clayful/client-js";
import "./PaymentPage.css";
import { useNavigate } from "react-router-dom";
import Postcode from "@actbase/react-daum-postcode";
import PostCodeModal from "../../components/PostCodeModal";

function PaymentPage() {
  const navigate = useNavigate();
  const [cart, setCart] = useState({});
  const [paymentMethods, setPaymentMethods] = useState([]);
  let options = {
    customer: localStorage.getItem("accessToken"),
  };
  let Cart = clayful.Cart;
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

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
  const [show, setShow] = useState(false);
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

  const handleCompletePaymentClick = () => {
    var Customer = clayful.Customer;
    const body = {
      name: {
        full: sendUserInfo.full,
      },
      mobile: sendUserInfo.mobile,
    };
    Customer.updateMe(body, options, function (err, result) {
      if (err) {
        // Error case
        console.log(err.code);
        return;
      }

      var headers = result.headers;
      var data = result.data;

      console.log(data);

      let items = [];
      cart.items.map((item) => {
        let itemVariable = {};
        itemVariable.bundleItems = item.bundleItems;
        itemVariable.product = item.product._id;
        itemVariable.quantity = item.quantity.raw;
        itemVariable.shippingMethod = item.shippingMethod._id;
        itemVariable.variant = item.variant._id;
        itemVariable._id = item._id;
        return items.push(itemVariable);
      });

      let payload = {
        items,
        currency: cart.currency.payment.code,
        paymentMethod,
        address: {
          shipping: {
            name: {
              full: recvUserInfo.full,
            },
            mobile: recvUserInfo.mobile,
            phone: recvUserInfo.phone,
            postcode: address.postCode,
            state: address.state,
            city: address.city,
            address1: address.address1,
            address2: address.address2,
            country: "KR",
          },
          billing: {
            name: {
              full: recvUserInfo.full,
            },
            mobile: recvUserInfo.mobile,
            phone: recvUserInfo.phone,
            postcode: address.postCode,
            state: address.state,
            city: address.city,
            address1: address.address1,
            address2: address.address2,
            country: "KR",
          },
        },
      };
      Cart.checkoutForMe("order", payload, options, function (err, result) {
        if (err) {
          // Error case
          console.log(err.code);
        }

        var data = result.data;

        console.log(data);

        Cart.emptyForMe(options, function (err, result) {
          if (err) {
            // Error case
            console.log(err.code);
          }

          var data = result.data;

          console.log(data);
          navigate("/history");
        });
      });
    });
  };

  const handleCompletePostCode = (data) => {
    let fullAddress = data.address;
    let extraAddress = "";

    if (data.addressType === "R") {
      if (data.bname !== "") {
        extraAddress += data.bname;
      }
      if (data.buildingName !== "") {
        extraAddress += extraAddress !== "" ? `, ${data.buildingName}` : data.buildingName;
      }
      fullAddress += extraAddress !== "" ? ` (${extraAddress})` : "";
    }

    handleClose();
    setAddress((prevState) => ({
      ...prevState,
      postCode: data.zonecode,
      state: data.side,
      city: data.sigungu,
      address1: fullAddress,
    }));
  };

  const handleAddress2Change = (event) => {
    setAddress((prevState) => ({
      ...prevState,
      address2: event.target.value,
    }));
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
            <h5>배송 정보</h5>
            <input type="text" placeholder="주소" readOnly onClick={() => setShow(true)} value={address.address1} />
            <input type="text" placeholder="상세주소" value={address.address2} onChange={handleAddress2Change} />
            <input type="text" placeholder="우편번호" readOnly value={address.postCode} />
            <h5>결제</h5>
            <select value={paymentMethod} onChange={(event) => setPaymentMethod(event.target.value)}>
              <option>결제 수단 선택</option>
              {paymentMethods.map((method) => (
                <option key={method.slug} value={method.slug}>
                  {method.name}
                </option>
              ))}
            </select>
            <button onClick={handleCompletePaymentClick} style={{ width: "100%", marginTop: 10 }}>
              주문
            </button>
            {paymentMethod === "bank-transfer" && <p>계좌번호: 1111-1111 클레이플 은행</p>}
            {paymentMethod === "clayful-iamport" && <p>계좌번호: 1234-5678 클레이플 은행</p>}
            <PostCodeModal show={show} handleClose={handleClose} handleCompletePostCode={handleCompletePostCode} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default PaymentPage;
