import React from 'react'
import { PhotoPicker } from 'aws-amplify-react'
import { Storage, Auth, API, graphqlOperation } from 'aws-amplify'
import {
  Form,
  Button,
  Input,
  Notification,
  Radio,
  Progress,
} from 'element-react'
import { createProduct } from '../graphql/mutations'
import aws_exports from '../aws-exports'
import useForm from '../components/helpers/useForm'
import { convertDollarsToCents } from '../utils'

const NewProduct = ({ marketId }) => {
  const initialValues = {
    description: '',
    price: '',
    imagePreview: '',
    image: '',
    shipped: false,
  }
  const { values, handleChange, handleSubmit } = useForm(
    handleAddProduct,
    initialValues
  )

  async function handleAddProduct(event) {
    try {
      const visibility = 'public'
      const { identityId } = await Auth.currentCredentials()
      const fileName = `/${visibility}/${identityId}/${Date.now()}-${
        values.image.name
      }}`
      const uploadedFile = await Storage.put(fileName, values.image.file, {
        currentType: values.image.type,
      })
      const file = {
        key: uploadedFile.key,
        bucket: aws_exports.aws_user_files_s3_bucket,
        region: aws_exports.aws_project_region,
      }
      const input = {
        productMarketId: marketId,
        description: values.description,
        shipped: values.shipped,
        price: convertDollarsToCents(values.price),
        file,
      }
      const result = await API.graphql(
        graphqlOperation(createProduct, { input })
      )
      console.log('result: ', result)
      Notification({
        title: 'Success',
        message: 'Product successfully created',
        type: 'success',
      })
    } catch (error) {
      console.error('Error adding product: ', error)
    }
  }

  return (
    <div className="flex-center">
      <h2 className="header">Add New Product</h2>
      <div>
        <Form className="market-header">
          <Form.Item label="Add Product Description">
            <Input
              type="text"
              icon="information"
              value={values.description}
              placeholder="Description"
              onChange={description => handleChange({ description })}
            />
          </Form.Item>
          <Form.Item label="Set Product Price">
            <Input
              type="number"
              icon="plus"
              value={values.price}
              placeholder="Price ($USD)"
              onChange={price => handleChange({ price })}
            />
          </Form.Item>
          <Form.Item label="Is the product shipped or emailed to the customer?">
            <div className="text-center">
              <Radio
                value="true"
                checked={values.shipped === true}
                onChange={() => handleChange({ shipped: true })}
              >
                Shipped
              </Radio>
              <Radio
                value="false"
                checked={values.shipped === false}
                onChange={() => handleChange({ shipped: false })}
              >
                Emailed
              </Radio>
            </div>
          </Form.Item>
          {values.imagePreview && (
            <img
              className="image-preview"
              src={values.imagePreview}
              alt="Product Preview"
            />
          )}
          <PhotoPicker
            title="Product Image"
            preview="hidden"
            onLoad={url => handleChange({ imagePreview: url })}
            onPick={file => handleChange({ image: file })}
            theme={{
              formContainer: {
                margin: 0,
                padding: '0.8em',
              },
              formSection: {
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
              },
              sectionBody: {
                margin: 0,
                width: '250px',
              },
              sectionHeader: {
                padding: '0.2em',
                color: 'var(--darkAmazonOrange)',
              },
              photoPickerButton: {
                display: 'none',
              },
            }}
          />
          <Form.Item>
            <Button
              disabled={
                !values.description ||
                !values.price ||
                !values.image ||
                values.isSubmitting
              }
              type="primary"
              nativeType="submit"
              loading={values.isSubmitting}
              onClick={event => handleSubmit(event)}
            >
              {values.isSubmitting ? 'Uploading ...' : 'Add Product'}
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  )
}

export default NewProduct
