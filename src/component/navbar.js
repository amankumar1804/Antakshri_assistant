import React, { Component } from 'react'
import swal from 'sweetalert2';
import {db} from '../firebase-config'
import { updateDoc,doc, } from 'firebase/firestore'


class navbar extends Component {

    logout = ()=>{
        swal.fire({
            title: 'Are you sure?',
            text: "You will be logged Out!!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Logout'
        }).then(res => {
            if(res.isConfirmed){
               var func = async() => {
                    const user = sessionStorage.getItem('userId')
                    console.log(user)
                    await updateDoc(doc(db , 'users',user ), {
                        'active' : false
                    })
                    console.log('slkhf')
                    window.sessionStorage.removeItem('user')
                    window.sessionStorage.removeItem('userId')
                    window.location.href = window.location.origin
               }
                
               func()
                
               
                
            }
        })
        
    }
    removePlayer = ()=>{
        var v = doc(db , 'users',sessionStorage.getItem('userId'))
        updateDoc(v, {
           'active' : false
       })
   }
   addplayer = ()=>{
        var v = doc(db , 'users',sessionStorage.getItem('userId'))
        updateDoc(v, {
        'active' : true
    })
   }
   componentDidMount(){
       window.addEventListener('beforeunload',(e)=>{
           e.preventDefault()
          return this.removePlayer()
       })
       this.addplayer()
   }
   componentWillUnmount(){
    this.removePlayer()
   }
   toHome = ()=>{
        
    window.location.href =  window.location.origin
}
    render() {
        return (
            <>
            <nav className='navbar shadow'>
                <div className='container-fluid'>
                   <div className='brand'  onClick={()=>this.toHome()}>
                        <img id='logo' src='/logo.png' alt='.'/>
                        <h1 className='navbar-brand m-0 ms-3'>Antakshari Assistant</h1>
                   </div>
                    
                    <div className='d-flex flex-rows'>
                        <button  type={"button"} className='btn btn-danger  nav-item' onClick={()=>this.logout()}>Logout</button>
                    </div>
                </div>
            </nav>

            
            </>
        )
    }
}

export default navbar
