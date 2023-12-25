import React from 'react'
import { Row, Col } from 'reactstrap'

function Footer() {
  return (
    <div className="footer">
      <Row>
        <Col lg="8" md="8" sm="8">
          <h6>Playback AI</h6>
          <ul className="footer-list">
            <li>Humanize Online Shopping</li>
            <li>©2020 Delta 4, Inc</li>
          </ul>
        </Col>
        <Col lg="2" md="2" sm="2">
          <h6>Contact</h6>
          <ul className="footer-list">
            <li>support@playback.ai</li>
          </ul>
        </Col>
        <Col lg="2" md="2" sm="2">
          <h6>Download</h6>
          <ul className="footer-list">
            <li>
              <a
                href="https://apps.apple.com/app/id1510872606"
                className="text-dark"
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="fpq-apple mr-2" />
                App Store
              </a>
            </li>
            <li>
              <a
                href="https://play.google.com/store/apps/details?id=com.playback.android"
                className="text-dark"
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="fpq-google-play mr-2" />
                Google Play
              </a>
            </li>
          </ul>
        </Col>
      </Row>
    </div>
  )
}

export default Footer
