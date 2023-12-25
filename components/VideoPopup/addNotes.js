import React from 'react'
import { Button, FormGroup, Input, Label, Spinner } from 'reactstrap'
import { useMutation } from '@apollo/react-hooks'
import { Formik } from 'formik'
import { toast } from 'react-toastify'
import get from 'lodash/get'

import { ORDER_ADD_BUYER_NOTE } from '../../libs/graphql/showroom'
import { addNotesSchema } from '../../libs/schema/cart'

const AddNotes = props => {
  const {
    setStep,
    // cartStateData,
    selectedBrand
  } = props
  const [orderAddBuyerNote] = useMutation(ORDER_ADD_BUYER_NOTE)

  const onNotesSubmit = async (values, { setSubmitting }) => {
    try {
      const {
        data: {
          orderAddAdditionalDetails: { orders, errors }
        }
      } = await orderAddBuyerNote({
        variables: {
          orderIds: selectedBrand.id, // cartStateData.map(itm => itm.id),
          buyerNotes: values.buyerNotes,
          buyerSignatureName: values.buyerSignatureName,
          preferredShipDateFrom: values.preferredShipDateFrom,
          preferredShipDateTo: values.preferredShipDateTo
        }
      })
      setSubmitting(false)
      if (orders) {
        setStep(prevStep => prevStep + 1)
        return 1
      }

      const error = get(errors, '0.message.0', null)

      return toast.error(error || 'Server error')
    } catch (error) {
      return toast.error('Server error')
    }
  }

  return (
    <>
      <Formik
        initialValues={{
          buyerNotes: '',
          buyerSignatureName: '',
          preferredShipDateFrom: '',
          preferredShipDateTo: ''
        }}
        validationSchema={addNotesSchema}
        onSubmit={onNotesSubmit}
      >
        {prop => (
          <form onSubmit={prop.handleSubmit}>
            <FormGroup className="form-group">
              <Label for="exampleEmail">
                Add notes or instructions for seller
              </Label>
              <Input
                type="textarea"
                name="buyerNotes"
                onChange={prop.handleChange}
                value={prop.values.buyerNotes}
              />
            </FormGroup>
            <FormGroup className="form-group">
              <Label for="exampleEmail">Add buyer name</Label>
              <Input
                type="text"
                className="mb-0"
                name="buyerSignatureName"
                onChange={prop.handleChange}
                value={prop.values.buyerSignatureName}
              />
              {prop.touched.buyerSignatureName &&
                prop.errors.buyerSignatureName && (
                  <span className="invalid-feedback d-block">
                    {prop.errors.buyerSignatureName}
                  </span>
                )}
            </FormGroup>
            <FormGroup className="form-group">
              <Label for="exampleEmail">Preferred ship date from</Label>
              <Input
                type="date"
                className="mb-0"
                name="preferredShipDateFrom"
                onChange={prop.handleChange}
                value={prop.values.preferredShipDateFrom}
              />
            </FormGroup>
            <FormGroup className="form-group">
              <Label for="exampleEmail">Preferred ship date to</Label>
              <Input
                type="date"
                className="mb-0"
                name="preferredShipDateTo"
                onChange={prop.handleChange}
                value={prop.values.preferredShipDateTo}
              />
            </FormGroup>
            <div className="d-flex justify-content-between align-items-center mt-3">
              <Button
                size="lg"
                color="dark"
                className="btn btn-outline btn-lg"
                outline
                onClick={() => setStep(prevStep => prevStep - 1)}
              >
                Back
              </Button>
              <Button
                size="lg"
                className="btn black-btn btn-lg mr-2"
                type="submit"
              >
                {prop.isSubmitting ? (
                  <Spinner
                    style={{ width: '21px', height: '21px' }}
                    color="white"
                  />
                ) : (
                  'Confirm'
                )}
              </Button>
            </div>
          </form>
        )}
      </Formik>
    </>
  )
}

export default AddNotes
