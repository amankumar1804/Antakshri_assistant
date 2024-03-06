import React, { Component } from 'react'
import {db} from '../firebase-config'
import {collection,addDoc ,query,where,onSnapshot} from 'firebase/firestore'

class Signup extends Component {
    genres = []
    userCollection = collection(db,'users')
    handleChange = e => {
        if(e.target.checked){
            this.genres.push(e.target.value)
           
        }
        else{
            for (var i = this.genres.length - 1; i >= 0; i--) {
                if (this.genres[i] === e.target.value) {
                 this.genres.splice(i, 1);
                }
            }
        }
       
    }

    submitSignupForm = () => {
        
        var user = document.getElementById("name")
        var password = document.getElementById("password")
        var confirm = document.getElementById("confirm")
        var errormsg = document.getElementById("errormsg")
        var signupbtn = document.getElementById('signupbtn')

        if (user.value === "") {
            errormsg.innerHTML = "<p >**PLEASE FILL DETAILS..</p>"
            user.focus()
            return;
        }
        if (password.value === "") {
            errormsg.innerHTML = "<p >**PLEASE FILL DETAILS.</p>"
            password.focus()
            return;
        }
        if (password.value.length < 8) {
            errormsg.innerHTML = "<p >**Password length must be atleast 8. </p>"
            password.focus()
            return;
        }
        if(this.genres.length === 0){
            errormsg.innerHTML = "<p >**Please select atleast one genre. </p>"
            return
        }
        
        
        
        const mypromise = new Promise((resolve,reject) => {
            signupbtn.disabled = true
            var q =  query(this.userCollection , where('username','==' , user.value))
            onSnapshot(q, snapshot => {
                let userA = []
                snapshot.docs.forEach((doc) => {
                    userA.push({...doc.data(),id:doc.id})
                })

                console.log(userA)
                resolve(userA)
                
            })
        })
       mypromise.then(response => {
            
            signupbtn.disabled = false
            if(response.length > 0){
                errormsg.innerHTML = '<p>**Username Taken</p>'
            }
            else{
                if (password.value === confirm.value) {
                    var id;
                    const createUser = async()=>{
                        var ref = await addDoc(this.userCollection,{"username":user.value , "password": password.value,'genres':this.genres,'active':true})
                        id = ref.id
                    }
                    createUser(user)
                    .then(response => { 
                        window.sessionStorage.setItem('user',user.value)
                        window.sessionStorage.setItem('userId',id)
                        window.location.reload() 
                    }
                    )
                    .catch(err => {
                        errormsg.innerHTML = err
                        
                    })
                
        
        
                }
                else {
                    errormsg.innerHTML = "<p >**password not matched</p>"
                    confirm.focus()
                    return;
                }
            }
       })
       
        
    }

    show = ()=>{
        
        if(this.props.show === 0){
            document.getElementById('signup').style.display = 'block'
        }
        else{
            document.getElementById('signup').style.display = 'none'
        }
    }
    
    componentDidUpdate(){
        this.show()
    }
    handleClick = e =>{
        if(e.key === 'Enter'){
            this.submitSignupForm();
        }
    }
    render() {
        
        return (
            <div>
                <div id="signup" className="shadow-lg" >
                    <div className='text-center'>
                        <h2>Sign Up</h2>
                        <p>Already a member?  <button className="btn btnSecondary border-none" onClick={() => this.props.change()}> Login  </button></p>  
                    </div>
                    
                    <form id='signupform'>
                        <label htmlFor='Username' >Username  </label>
                        <input type="text" className="form-control" name='username' id="name" placeholder='NAME' onKeyDown={this.handleClick.bind(this)}/><br></br>

                        <label htmlFor='password' >Password (Atleast 8 charecter)</label>
                        <input type="password" className="form-control" name='password' id="password" placeholder='PASSWORD' onKeyDown={this.handleClick.bind(this)}/><br></br>

                        <label htmlFor='confirm' >Confirm password  </label>
                        <input type="password" className="form-control" name='confirm' id="confirm" placeholder='CONFIRM PASSWORD' onKeyDown={this.handleClick.bind(this)}/><br></br>

                        <label >Genres : </label>
                        <div className='row p-3'>
                            <div className='col-6'>
                                <input className='mx-1' type='checkbox' id='pop' value="pop" onChange={this.handleChange.bind(this)}/>
                                <label htmlFor='pop'>Pop</label>   
                            </div>

                           <div  className='col-6'>
                                <input className='mx-1' type='checkbox' id='hiphop' value="hip hop"  onChange={this.handleChange.bind(this)}/>
                                <label htmlFor='hiphop'>Hip-Hop</label> 
                           </div>

                            <div  className='col-6'>
                                <input className='mx-1' type='checkbox' id='rap' value="rap"  onChange={this.handleChange.bind(this)}/>
                                <label htmlFor='rap'>Rap</label>   
                            </div>
                            <div  className='col-6'>
                                <input className='mx-1' type='checkbox' id='rock' value="rock"  onChange={this.handleChange.bind(this)}/>
                                <label htmlFor='rock'>Rock</label>   
                            </div>
                            <div  className='col-6'>
                                <input className='mx-1' type='checkbox' id='indie' value="indie"  onChange={this.handleChange.bind(this)}/>
                                <label htmlFor='indie'>Indie</label>   
                            </div>

                          
                        </div>
                    </form>
                
                    <button type='submit' id="signupbtn" className="w-100 btn btnPrimary" onClick={() => this.submitSignupForm()}>SIGN UP</button>
                    <p id="errormsg" className='text-danger'></p>
                </div>
            </div>
        )
    }
}

export default Signup
