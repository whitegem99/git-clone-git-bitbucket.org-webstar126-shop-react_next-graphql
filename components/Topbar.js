import ReactResponsiveSelect from 'react-responsive-select'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleDown } from '@fortawesome/free-solid-svg-icons'

const Topbar = ({ filter, filters, setFilter }) => {
  return (
    <div className="top-bar d-sm-flex align-items-center justify-content-lg-end">
      <div className="ml-lg-5 ml-sm-auto d-flex align-items-center">
        <p className="mb-0 ws-nowrap">Filter By :</p>
        <div className="pq-select_picker ml-2">
          <div className="pq-select_picker">
            <ReactResponsiveSelect
              name="make"
              options={filters}
              selectedValue={filter}
              onChange={select => setFilter(select.value)}
              caretIcon={<FontAwesomeIcon icon={faAngleDown} key="select" />}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Topbar
