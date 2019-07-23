import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Modal } from '../../components/Modal';
import { EditorModal } from '../../components/OrderManage/EditorModal';
import { Dimmed } from '../../components/OrderManage/Dimmed';

import * as modalActions from '../../store/modules/modal';
import * as orderActions from '../../store/modules/order';
import * as orderTemplateActions from '../../store/modules/orderTemplate';

class EditorModalContainer extends Component {

  handleChange = (e, kind) => {
    const { ModalActions } = this.props;
    ModalActions.change({
      name: e.target.name,
      value: e.target.value,
      kind: kind
    });
  }

  handleChangeAddInput =(e) => {
    const { ModalActions } = this.props;
    ModalActions.changeAddInput({
      value: e.target.value
    })
  }

  handleChangeAddMode = (mode) => {
    const { ModalActions } = this.props;
    ModalActions.changeAddMode(mode)
  }

  handleAddList = (list) => {
    const { ModalActions } = this.props;
    ModalActions.addList(list)
    ModalActions.changeAddMode(false)
  }

  handleDeleteList = (id, kind) => {
    const { ModalActions } = this.props;
    ModalActions.deleteList({
      id: id, 
      kind: kind
    })
  }

  handlePatch = () => {
    const { OrderActions, ModalActions, OrderTemplateActions } = this.props;
    const { loggedInfo, modalContents, orderContents } = this.props;
    const userId = loggedInfo.get('_id');
    const id = modalContents.get('_id');
    const contents = modalContents.get('contents');
    OrderActions.patchOrder({
      id: id,
      contents: contents
    })

    // 현재 수정한 modal의 content list(modalContent)와 이전에 사용하던 content list(orderContent)가 다르면 템플릿 변경
    if(orderContents.get('contents') !== contents) {
      const templateList = [];
      contents.template.map(
        (temp) => templateList.push(temp.label)
      )
      OrderTemplateActions.patchOrderTemplate({
        userId: userId,
        template: templateList
      })
    }

    ModalActions.hide()
  }

  handleHide = () => {
    const { ModalActions } = this.props;
    ModalActions.hide()
  }

  render() {
    const { customerById, modalContents, visible, addMode, addContent } = this.props;
    const { handleChange, handleChangeAddInput, handleChangeAddMode, handleAddList, handleDeleteList, handlePatch, handleHide } = this;
    return(
      visible==="editor" &&
      <div>
        <Modal mode={visible}>
          <EditorModal
          addMode={addMode}
          addContent={addContent}
          name={modalContents.getIn(['customerId', 'name'])}
          state={modalContents.getIn(['customerId', 'state'])}
          contents={modalContents.toJS().contents}
          detail={modalContents.toJS().detail}
          onChange={handleChange}
          onChangeAddInput={handleChangeAddInput}
          onChangeAddMode={handleChangeAddMode}
          onAddList={handleAddList}
          onDeleteList={handleDeleteList}
          handlePatch={handlePatch}
          handleHide={handleHide}
          >
          </EditorModal>
        </Modal>
        <Dimmed/>
      </div>
    )
  }
}

export default connect(
  (state) => ({
    loggedInfo: state.user.get('loggedInfo'),
    modalContents: state.modal.get('modalContents'),
    orderContents: state.order.get('orderById'),
    addContent: state.modal.get('addContent'),
    visible: state.modal.get('visible'),
    addMode: state.modal.get('addMode')
  }),
  (dispatch) => ({
    ModalActions : bindActionCreators(modalActions, dispatch),
    OrderActions : bindActionCreators(orderActions, dispatch),
    OrderTemplateActions: bindActionCreators(orderTemplateActions, dispatch)
  })
)(EditorModalContainer);