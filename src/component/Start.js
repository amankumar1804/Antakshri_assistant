import React, { Component } from 'react'
import Main from './main'
import Logged from './logged'
import {collection,query,doc,where,onSnapshot,updateDoc} from 'firebase/firestore'
import {db} from '../firebase-config'

class startPage extends Component {
	constructor(param) {
		super(param)

		this.state = {
			user: "",
			child: <Main logging={this.logging} />
		}
	}

	componentDidMount() {
		var user = window.sessionStorage.getItem('user')

		if (user) {
			this.logging(user)
		}

		
	}

	logging = (user) => {

		this.setState(
			{
				user: user,
				child: <Logged userName={user} />
			}
		)

	}


	render() {
		return (

			<div id="start">

				{this.state.child}
				
			</div>

		)
	}
}

export default startPage
