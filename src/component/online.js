import { Component } from 'react'
import {db} from '../firebase-config'
import { collection,query,where,onSnapshot,doc,arrayUnion,updateDoc,arrayRemove, setDoc,deleteDoc} from 'firebase/firestore'
import Navbar from './navbar'
import $ from 'jquery'
import Loader from './loading'
import {Navigate} from 'react-router-dom'
import swal from 'sweetalert2'

class Online extends Component{
    queryParams = new URLSearchParams(window.location.search)
   room = this.queryParams.get("id")
    roomRef =  collection(db, "rooms")
    userRef = collection(db, 'users')
    user = sessionStorage.getItem('user')

   state = {
    loading:true,
     online:[],
     currunt:[],
     created_by:'',
     start:false,
     
   }

   // Add Player to waiting room
   addPlayer = ()=>{
        var q = doc(db,'rooms',this.room)
        
        updateDoc(q,{
        players:arrayUnion(this.user)
        })
    }

    //remove player from waiting room
    removeplayer = ()=>{
        var q = doc(db,'rooms',this.room)
        
        updateDoc(q,{
        players:arrayRemove(this.user)
        })
   }

   // Check if game exist by this id
   check = ()=>{
    const q = query(collection(db, "games"), where("__name__", "==", this.room));
       
        onSnapshot(q , snapshot => {
            
            var rooms = []
            snapshot.forEach((doc) => {
                rooms.push({...doc.data(),id:doc.id});
            });
            // console.log(rooms)
            if(rooms.length > 0){
                this.setState({
                    start:true
                })
            }
        })
   }

   componentDidMount = ()=>{
      this.check()

        var q = query(this.roomRef , where('__name__','==',this.room))
         onSnapshot(q,snapshot => {
            
            var rooms = []
            snapshot.forEach((doc) => {
                rooms.push({...doc.data(),id:doc.id});
            });

            
  
            this.setState({
                
                currunt:rooms[0]['players'],
                created_by: rooms[0]['created_by']
            })
            
        }
            
        )
         q = query(this.userRef, where("active", "==", true));
         onSnapshot(q,snapshot => {
            
            var users = []
            snapshot.forEach((doc) => {
                users.push({...doc.data(),id:doc.id});
            });

            
           var userNames = []
            var cur = this.state.currunt
            
            users.forEach((e) => {
                
                if(e['id'] === sessionStorage.getItem('userId'))return;
                if(cur.includes(e['username']))return;
                userNames.push([e['id'] , e['username']])
            })
          
            this.setState({
                loading:false,
                online: userNames
            })
        }
            
        )
        window.addEventListener('beforeunload',(e)=>{
            e.preventDefault()
           return this.removeplayer()
        })
      this.addPlayer()
        // window.location.reload()
   }
   
   
   componentDidUpdate(){
        this.check()
        if(this.user === this.state.created_by){

            $('.control').show()
            $('.revControl').hide()
        }
    }
    componentWillUnmount(){
        this.removeplayer()
    }

   
    // Send Notification to players
   sendNotification = (rec)=>{
        setDoc(doc(collection(db,'notifications'),this.room + rec), {
            'sender' : sessionStorage.getItem('user'),
            'receiver' : rec,
            'roomId' : this.room
        })
   }

   // Start the game
   startGame = async()=>{
   
    if(this.state.currunt.length === 1){
        swal.fire({
            title:'Game must have at least 2 players.'
        }).then(() => {
            window.location.href = window.location.origin
        })
    }
    await deleteDoc(doc(db,'rooms',this.room))
    var score = new Array(this.state.currunt.length).fill(0)
    await setDoc(doc(collection(db,'games'),this.room),{
        players:this.state.currunt,
        score: score,
        current:0,
        lyric:'love',
        round: $('#rounds').val() * score.length,
        Totalrounds : $('#rounds').val() * score.length
    })

    this.setState({
        start:true
    })
}
    render(){
        let list = [];
        if(this.state.online.length > 0){
           list =  this.state.online.map((user,id) => {
                return <div className='text-center p-2 mt-2 d-flex flex-row  justify-content-around' key={id}>
                    <h5>{user[1]}</h5>
                    <button className='btn btn-primary' onClick={()=>{this.sendNotification(user[0])}}>+</button>
                </div>
            })
        }
        else{
            list = <h3>No other online players.</h3>
        }

        if(this.state.loading)return <>
            <Navbar />
            <Loader/>
        </>
        if(this.state.start)return <Navigate to={"../game?id="+this.room}/>

        else
        return <div>
            <Navbar />
            
            <div className='text-center'>
                <button className='control btn btnPrimary m-3' onClick={()=>this.startGame()}>Start Game</button>
                <h1 className='revControl m-3 text-danger'>Wait For Host...  </h1>
            </div>

            <div className='control'>
            <div className='my-3 d-flex flex-row justify-content-center'>
                    <legend className='col-1 me-2' htmlFor='rounds'>Rounds</legend>
                    <div className='col-3'>
                        <input  id='rounds' defaultValue={5} min={1} max={15} className='form-control' type='number'/>
                    </div>
                </div>
           </div>

            <div className='darkContainer conatiner  d-flex flex-row justify-content-between'>
                <div className='col-6 text-center '>
                    <h1><strong>Online Players</strong></h1>
                    <hr/>
                    {list}
                    
                </div>

                <div className='col-6 text-center '>
                    <h1><strong>Waiting Players</strong></h1>
                    <hr/>
                    {this.state.currunt.map((e,i)=>{
                        return <h5 key={i} class='pt-2'>{e}</h5>
                    })}
                </div>
                
            </div>
           
        </div>
    }
    
}
export default Online