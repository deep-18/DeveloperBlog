import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import SpinnerGIF from './spinner.gif'

const Spinner = props => {
    return (
        <Fragment>
            <img src={SpinnerGIF} style={{width: '200px', margin: 'auto', display: 'block'}} alt="Loading.."/>
        </Fragment>
    )
}

// Spinner.propTypes = {

// }

export default Spinner
