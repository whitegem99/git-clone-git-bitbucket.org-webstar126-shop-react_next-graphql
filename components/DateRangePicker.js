import React, { useState } from 'react'
import moment from 'moment'
import 'react-dates/initialize'
import 'react-dates/lib/css/_datepicker.css'
import { DateRangePicker, isInclusivelyBeforeDay } from 'react-dates'

const DateRangePickerComponent = ({
  startDateId,
  endDateId,
  fromDate,
  toDate,
  datePickerChange
}) => {
  const [focused, setFocusedInput] = useState(null)
  const onFocusChangeRangeHandler = focusedInput => {
    setFocusedInput(focusedInput)
  }
  return (
    <DateRangePicker
      startDate={fromDate}
      startDateId={startDateId}
      endDate={toDate}
      endDateId={endDateId}
      onDatesChange={({ startDate, endDate }) =>
        datePickerChange(startDate, endDate)
      }
      focusedInput={focused}
      onFocusChange={focusedInput => onFocusChangeRangeHandler(focusedInput)}
      displayFormat={() => 'DD/MM/YYYY'}
      isOutsideRange={day => !isInclusivelyBeforeDay(day, moment())}
    />
  )
}

export default DateRangePickerComponent
