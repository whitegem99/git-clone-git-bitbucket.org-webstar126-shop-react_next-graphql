import { Row, Col } from 'reactstrap'

const NoVideos = ({ emptyText }) => {
  return (
    <div>
      <Row>
        <Col lg="5" md="6" sm="6">
          <img
            src="/assets/images/no-videos.png"
            className="w-100"
            alt="no videos"
          />
        </Col>
        <Col lg="4" md="6" sm="6">
          <div className="text-center d-flex align-items-center justify-content-center h-100 flex-column">
            <h6 className="text-danger mb-3 mt-sm-0 mt-3">{emptyText}</h6>
          </div>
        </Col>
      </Row>
    </div>
  )
}

export default NoVideos
