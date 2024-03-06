import React, { Component } from 'react'
import {db} from '../firebase-config'
import {collection,query,doc,where,onSnapshot,updateDoc} from 'firebase/firestore'

class Login extends Component {

    

    userCollection = collection(db,'users')
    submitLoginForm = async() => {
        
        var user = document.getElementById("loginName")
        var password = document.getElementById("loginPassword")
        var errormsg = document.getElementById("loginerrormsg")

        if(user.value === ""){
            user.focus()
            errormsg.innerHTML = "**PLEASE FILL DETAILS."
            return;
        }
        if(password.value === ""){
            password.focus()
            errormsg.innerHTML = "**PLEASE FILL DETAILS."
            return;
        }

        var q = query(this.userCollection , where('username','==' , user.value))
        q = query(q , where('password','==',password.value))
        onSnapshot(q, async(snapshot) => {
            let userA = []
            snapshot.docs.forEach((doc) => {
                userA.push({...doc.data(),id:doc.id})
            })
            // console.log(userA)

            if(userA.length === 1){
               await updateDoc(doc(db , 'users',userA[0].id), {
                    'active' : true
                })
                window.sessionStorage.setItem('user',user.value)
                window.sessionStorage.setItem('userId',userA[0].id)
                window.location.reload() 
            }
            else {
                errormsg.innerHTML = '<p>**User not exist.</p>'
            }
        })
    
       
    }
    
    show = ()=>{
        if(this.props.show === 1){
            document.getElementById('login').style.display = 'block'
        }
        else{
            document.getElementById('login').style.display = 'none'
        }
    }

    componentDidUpdate(){
       this.show()
    }
    componentDidMount(){
        this.show()
    }
    handleClick = e => {
        if(e.key === 'Enter'){
            this.submitLoginForm();
        }
    }
    render() {
        return (
            <div>
                <div id="login" className="shadow-lg" >
                    <div className='text-center'>
                    <h2>Login</h2>
                    <p>Haven't joined yet?<button className="btn btnSecondary ms-2" onClick={this.props.change}> Register </button></p>
                    </div>
                    <form id="loginForm">
                        <label htmlFor='Username' >Username : </label>
                        <input type="text" className="form-control" name='username' id="loginName" placeholder='NAME' onKeyDown={this.handleClick.bind(this)} /><br></br>

                        <label htmlFor='password' >Password : </label>
                        <input type="password" className="form-control" name='password' id="loginPassword" placeholder='PASSWORD' onKeyDown={this.handleClick.bind(this)}/><br></br>

                    </form>
                    <button type='submit' className="w-100 btn btnPrimary" onClick={() => this.submitLoginForm()}>LOGIN</button>
                    <p id="loginerrormsg" className='text-danger'></p>
                </div>
            </div>
        )
    }
}

export default Login
