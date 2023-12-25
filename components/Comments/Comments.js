import React, { useEffect, useState } from 'react'
import { useMutation } from '@apollo/react-hooks'
import { toast } from 'react-toastify'
import get from 'lodash/get'
import Link from 'next/link'

import { CHAT_MESSAGE_SEND_VIDEO } from '../../libs/graphql/buyerDashboard'
import firebase from '../../firebase'

const COMPANY = 'Company'

const Comments = ({
  videoId,
  brandId,
  companyId,
  token,
  isTitleShow = true
}) => {
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
      return toast.error('Please enter message')
    }
    try {
      const recipientKlass = COMPANY
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
      {isTitleShow && <h3 className="d-none">Comments</h3>}
      <>
        {conversations &&
        conversations.length > 0 &&
        conversations.filter(itm => itm.video_id === videoId) &&
        conversations.filter(itm => itm.video_id === videoId).length > 0 ? (
          <div className="comment-list">
            {conversations
              .filter(itm => itm.video_id === videoId)
              .map(itm => {
                return (
                  <div>
                    <div className="comment-content" key={itm._id}>
                      <div className="sender-name">
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
                      <div className="comment-text">{itm.body}</div>
                    </div>
                  </div>
                )
              })}
          </div>
        ) : (
          <div className="comment-list no-scroll">
            <div className="no-comments">
              <img alt="comments-icon" src="/assets/images/comments-icon.svg" />
              <p>No comments to display</p>
            </div>
          </div>
        )}
      </>
      {token ? (
        <div className="message-input">
          <form onSubmit={handleSubmit}>
            <div className="comment-box">
              <input
                type="text"
                value={typeMessage}
                name="message"
                placeholder="Ask Questions..."
                autoComplete={false}
                onChange={e => setTypeMessage(e.target.value)}
              />
              <button type="submit" className="btn btn-white btn-sm">
                <i className="fpq-send" />
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="message-input">
          <div className="login-section">
            <Link href="/login">Login to send comments</Link>
          </div>
        </div>
      )}
    </>
  )
}

export default Comments
