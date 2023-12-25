import { Row, Col } from 'reactstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'

const Loading = () => {
  return (
    <div>
      <Row>
        <Col sm="12">
          <p className="lead">
            <FontAwesomeIcon icon={faSpinner} className="fa-pulse mr-2" />{' '}
            Loading
          </p>
        </Col>
      </Row>
    </div>
  )
}

export default Loading
