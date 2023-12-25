import { Modal, ModalBody, ModalHeader } from 'reactstrap'
import React from 'react'

import withApollo from '../libs/apollo'

const DescriptionPopup = props => {
  const { open, close, description } = props

  const resetAndClose = () => {
    close()
  }
  return (
    <>
      <Modal
        isOpen={open}
        toggle={() => {
          resetAndClose()
        }}
        className="round modal-lg description-modal"
      >
        <ModalHeader toggle={resetAndClose}>Description</ModalHeader>
        <ModalBody>{description}</ModalBody>
      </Modal>
    </>
  )
}
export default withApollo(DescriptionPopup)
