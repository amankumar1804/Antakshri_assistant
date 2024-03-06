import { Component } from "react";
import {db} from '../firebase-config'
import { collection,query,where,onSnapshot,deleteDoc,doc} from 'firebase/firestore'   
import Navbar from './navbar'

class Notifications extends Component{
    state = {

        notification:[]
    }
    notiRef = collection(db, 'notifications')
    usersRef = collection(db, 'users')
    componentDidMount(){
        var q = query(this.notiRef , where('receiver', '==' , sessionStorage.getItem('userId')))
        onSnapshot(q,snapshot => {
            
            var noti = []
            snapshot.forEach((doc) => {
                noti.push({...doc.data(),id:doc.id});
             
            });

            var senders = []
            noti.forEach(e =>{
                
                senders.push([e['sender'],e['id'],e['roomId']])
            })
            
            console.log(senders)
            if(senders.length > 0){
                document.getElementById('noNoti').style.display = 'none'
                document.getElementById('notifications').style.display = 'block'
            }
            else {
                document.getElementById('noNoti').style.display = 'block'
                document.getElementById('notifications').style.display = 'none'
            }
            this.setState(
                {
                    
                    notification : senders
                }
            )
            
            
        })

    }

    toHome = ()=>{
        
        window.location.href =  window.location.origin
    }

    cancel = async(id)=>{
        await deleteDoc(doc(db, "notifications",id ));
    }

    confirm = async(id,roomId)=>{
        
        await deleteDoc(doc(db, "notifications",id ));
        window.location.href = window.location.origin + '/online?id=' + roomId
    }
    render(){
       
        return <>
        <Navbar/>
        
        <div className="my-3 text-center">
            <button className="col-1    btn btnPrimary shadow"  onClick={()=>{this.toHome()}}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-left" viewBox="0 0 16 16">
                        <path fill-rule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"/>
                    </svg> Back
            </button>
        </div>

        <h1 id='noNoti' className="text-center">No New Notifications</h1>
        <div className="d-flex  flex-column m-3 " id="notifications">
            {this.state.notification.map((e) => {
                return <div className="darkContainer container d-flex flex-row justify-content-between" key={e[1]}>
                    <h5 className="pt-2 m-0 text-center">{e[0]}</h5>

                    <div >

                        <button className="btn btn-primary mx-2 " onClick={()=>{this.confirm(e[1],e[2])}}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-check-lg" viewBox="0 0 16 16">
                            <path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425a.247.247 0 0 1 .02-.022Z"/>
                            </svg>
                        </button>
                        
                        <button className="btn btn-danger" onClick={()=>{this.cancel(e[1])}}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-x-lg" viewBox="0 0 16 16">
                                <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z"/>
                            </svg>
                        </button>

                    </div>
                </div>
            })}
        </div>
        </>
    }
}
export default Notifications