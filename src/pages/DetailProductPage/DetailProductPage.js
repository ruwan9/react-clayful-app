import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import clayful from "clayful/client-js";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import ProductInfo from "./Sections/ProductInfo";

function DetailProductPage() {
  const params = useParams();
  const productId = params.productId;

  const [item, setItem] = useState({});

  useEffect(() => {
    let Product = clayful.Product;
    let options = {};

    Product.get(productId, options, function (err, result) {
      if (err) {
        // Error case
        console.log(err.code);
        return;
      }

      let data = result.data;
      // console.log(data);
      setItem(data);
    });
  }, [productId]);

  return (
    <div>
      {/* <div>{item.description}</div> */}
      <div className="pageWrapper">
        <Row>
          <Col md>
            <div>
              <img style={{ width: "100%" }} src={item.thumbnail?.url} alt="Img" />
            </div>
          </Col>
          <Col md>
            <ProductInfo detail={item} />
          </Col>
        </Row>
      </div>

      {/* 보안적으로 위험하긴 하만 일단 이렇게 진행 */}
      <div dangerouslySetInnerHTML={{ __html: item.description }} />
    </div>
  );
}

export default DetailProductPage;
