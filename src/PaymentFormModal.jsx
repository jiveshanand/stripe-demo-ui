import React from 'react';
import { Modal } from 'antd';

export function PaymentFormModal(props) {
  const { isOpen, handleSubmit, confirmLoading, handleCancel, children } =
    props;
  return (
    <Modal
      title='Title'
      open={isOpen}
      onOk={handleSubmit}
      confirmLoading={confirmLoading}
      onCancel={handleCancel}
    >
      {children}
    </Modal>
  );
}
