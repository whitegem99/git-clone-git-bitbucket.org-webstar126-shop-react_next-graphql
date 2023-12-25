import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import get from 'lodash/get'
import { useMutation } from '@apollo/react-hooks'

import firebase from '../../firebase'
import { CHAT_MESSAGE_SEND_VIDEO } from '../../libs/graphql/buyerDashboard'

const CommentInVideoPopup = ({ videoId, brandId, companyId }) => {
  const [conversations, setConversations] = useState([])
  const [typeMessage, setTypeMessage] = useState('')

  const [commentCreateByCompany] = useMutation(CHAT_MESSAGE_SEND_VIDEO)

  useEffect(() => {
    ;(async () => {
      await setConversations([])
      const conversationsRef = firebase
        .database()
        .ref('comments')
        .orderByKey()
      conversationsRef.on('child_added', data => {
        const conversationsArray = []
        conversationsArray.push(data.val())
        setConversations(prevConversations => [
          ...prevConversations,
          ...conversationsArray
        ])
      })
      conversationsRef.on('child_changed', data => {
        const temp = data.val()
        setConversations(prevConversations =>
          prevConversations.map(item =>
            item._id === temp._id
              ? { ...item, last_message: temp.last_message }
              : item
          )
        )
      })
      return () => {
        conversationsRef.off()
      }
    })()
  }, [])

  const handleSubmit = async e => {
    e.preventDefault()
    if (typeMessage.length === 0) {
      return toast.error('Kindly enter message')
    }
    try {
      const recipientKlass = 'Company'
      const recipientId = companyId

      const {
        data: {
          commentCreateByCompany: { comment, errors }
        }
      } = await commentCreateByCompany({
        variables: {
          body: typeMessage,
          recipientKlass,
          recipientId,
          sellerBrandId: brandId,
          videoId
        }
      })

      if (comment) {
        setTypeMessage('')
        return true
      }
      const error = get(errors, '0.message.0', null)
      return toast.error(error || 'Server error')
    } catch (error) {
      return toast.error('Server error')
    }
  }

  return (
    <>
      <div
        className="comment-section p-4 font-lg"
        style={{
          borderBottom: '1px solid #dce0eb',
          fontWeight: 600,
          fontFamily: 'ProximaNova-Bold, sans-serif'
        }}
      >
        Comments
      </div>
      <div
        style={{ height: '595px', overflowY: 'scroll', overflowX: 'hidden' }}
      >
        {conversations &&
        conversations.length &&
        conversations.filter(itm => itm.video_id === videoId) &&
        conversations.filter(itm => itm.video_id === videoId).length ? (
          conversations
            .filter(itm => itm.video_id === videoId)
            .map(itm => (
              <div className="card rounded-pill mt-2" key={itm._id}>
                <div className="row">
                  <div className="col-auto font-weight-bold align-self-center">
                    {itm.sender_type === 'Buyer' ? (
                      `${itm.sender_name} :`
                    ) : (
                      <img
                        src={itm.seller_brand_logo}
                        alt="logo"
                        style={{ width: '100px', objectFit: 'contain' }}
                      />
                    )}
                  </div>
                  <div className="col pl-0">{itm.body}</div>
                </div>
              </div>
            ))
        ) : (
          <div className="no-comments">
            <img alt="comments-icon" src="/assets/images/comments-icon.svg" />
            <p>No comments to display</p>
          </div>
        )}
      </div>
      <div>
        <form onSubmit={handleSubmit}>
          <div className="comment-box">
            <input
              type="text"
              value={typeMessage}
              name="message"
              placeholder="Ask/Comment about the product..."
              onChange={e => setTypeMessage(e.target.value)}
            />
            <button type="submit" className="btn btn-white btn-sm">
              <i className="fpq-send" />
            </button>
          </div>
        </form>
      </div>
    </>
  )
}

export default CommentInVideoPopup
