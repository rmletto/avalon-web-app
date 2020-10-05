import React, { Component } from 'react';
import "./popup.css";

/** Popup component
 * @param closePopup: a function that must be passed in that controls showing/hiding the popup
 */
class Popup extends Component {
	render() {
		return (
			<div className='popup'>
				<div className='popup-inner'>
					{this.props.children}
					<button onClick={this.props.closePopup}>Close</button>
				</div>
			</div>
		);
	}
}

export default Popup;
