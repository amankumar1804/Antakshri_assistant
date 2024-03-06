import React, { Component } from 'react'
import Login from './Login'
import Signup from './Signup'

class main extends Component {

    constructor(params) {
        super(params)

        this.state = {
            form : 0
        }
       
    }

    
    change = ()=>{
        
        var temp = this.state.form
        
        this.setState(
            
            {
                form: (temp + 1)%2
            }
        )
    }   

    render() {
        return (
           
           <div className=' d-flex flex-sm-row flex-m-column'>
                <div id='startImg' >
                    <h1>
                        Let's Play.
                    </h1>
                    <h5>Play with friends or online players.</h5>
                    <div className='mb-4'>
                        <a href='/about'>
                            <button className='btn btnPrimary'>About</button>
                        </a>
                    </div>
                    
                </div>
                <div className='register'>
                    
                    <Signup show={this.state.form} change={this.change}/>
                    <Login show={this.state.form} change={this.change} />
                </div>
           </div>
         
        )
    }
}

export default main
