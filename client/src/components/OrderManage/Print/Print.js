import React, { Component } from "react";
import './Print.scss';

class Print extends Component {
  render() {
    const { name, phone, orderNumber, date, address, contents, detail, images } = this.props;

    const numContentsList = contents.length;
    const contentsList = contents.template.map(
      function(content, i) {
        return(
          <div key={i} className="print-contents-row">
            <div className="print-contents-label">{content.label}</div>
            <div className="print-contents-value">{content.value}</div>
          </div>
        )    
      }    
    )

    let imageDivs = [];
    for(let i = 1; i < images.length; i++){
      imageDivs.push(
        <div className="print-page-wrapper">
          <img className="print-full-image" src={images[i]}/>
        </div>
      )
    }

    const header = <div className="print-header-inform">https://esbmakers.com/order/{orderNumber}</div>    
    const footer = <div className="print-footer-inform"></div>

    return(
      <div>
        <div className="print-page-wrapper">
          {header}
          <div className="print-banner-name">온라인 주문서</div>
          <div className="print-header-wrapper">
            <table className="print-header-orders">
              <tbody>
                <tr className="print-header-element"><td>주문자</td><td>{name} 고객님</td></tr>
                <tr className="print-header-element"><td>전화번호</td><td>{phone}</td></tr>
                <tr className="print-header-element"><td>주문번호</td><td>{orderNumber}</td></tr>
                <tr className="print-header-element"><td>주문날짜</td><td>{date}</td></tr>
                <tr className="print-header-element"><td>주소</td><td>{address}</td></tr>
              </tbody>
            </table>
            <div className="print-header-image">
              {images &&
                // <img className="print-image-wrapper" src={images[0]}/>
                <img src={images[0]}/>
              }
            </div>
          </div>
          <div className="order-table-wrapper">
            <div className="order-table-view">
              {contentsList}
            </div>
            <div className="order-table-view">
              <div className="print-contents-label" style={{width: "100%"}}>특이사항</div>
              <div className="print-contents-value" style={{width: "100%"}}>{detail}</div>
            </div>
          </div>
        </div>
        {imageDivs}
      </div>
    )
  }
}

export default Print;
