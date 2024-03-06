import { Component } from 'react'
import {db} from '../firebase-config'
import Navbar from './navbar'
import {Navigate} from 'react-router-dom'
import { collection,query,where,onSnapshot,doc,updateDoc,arrayUnion ,arrayRemove,deleteDoc,setDoc} from 'firebase/firestore'
import $ from 'jquery'
import Loader from './loading'
import swal from 'sweetalert2'
class Room extends Component{
   queryParams = new URLSearchParams(window.location.search)
   room = this.queryParams.get("id")
   user = sessionStorage.getItem('user')

   state = {
    loading:true,
    players:[],
    created_by:'',
    start:false
   }
   addPlayer = ()=>{
      var q = doc(db,'rooms',this.room)
      
      updateDoc(q,{
        players:arrayUnion(this.user)
      })
   }

   removeplayer = ()=>{
    var q = doc(db,'rooms',this.room)
    
    updateDoc(q,{
      players:arrayRemove(this.user)
    })
   }

   getplayers = ()=>{
       const q = query(collection(db, "rooms"), where("__name__", "==", this.room));
       
       onSnapshot(q , snapshot => {
            
            var rooms = []
            snapshot.forEach((doc) => {
                rooms.push({...doc.data(),id:doc.id});
            });

            // console.log(rooms)
            this.setState({
                loading:false,
                players: rooms[0]['players'],
                created_by: rooms[0]['created_by']
            })
       })
   }

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

  
    componentDidMount(){
        
        this.check()
        window.addEventListener('beforeunload',(e)=>{
            e.preventDefault()
           return this.removeplayer()
        })
      this.addPlayer()
      this.getplayers()

    //   console.log(this.state.players);
       
    }
    componentDidUpdate(){
        this.check()
        if(this.user === this.state.created_by){
            // console.log('saf')
            $('.control').show()
            $('.revControl').hide()
        }
    }
    componentWillUnmount(){
        this.removeplayer()
    }

    startGame = async()=>{

        if(this.state.players.length === 1){
            swal.fire({
                title:'Game must have at least 2 players.'
            }).then(() => {
                window.location.href = window.location.origin
            })
        }
        await deleteDoc(doc(db,'rooms',this.room))
        var score =  new Array(this.state.players.length).fill(0)
        await setDoc(doc(collection(db,'games'),this.room),{
            players:this.state.players,
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
        if(this.state.loading)return <>
            <Navbar />
            <Loader/>
        </>
        if(this.state.start)return <Navigate to={"../game?id="+this.room}/>
        else
        return <>
            <Navbar />
            <div className='text-center m-3'>
            
                <button className='control btn btnPrimary m-2' onClick={()=>this.startGame()}>Start Game</button>
                <h1 className='revControl m-3 text-danger'>Wait For Host... </h1>
                <div className='control'>
            <div className='my-3 d-flex flex-row justify-content-center'>
                    <legend className='col-1' htmlFor='rounds'>Rounds</legend>
                    <div className='col-3'>
                        <input  id='rounds' defaultValue={5} min={1} max={15} className='form-control' type='number'/>
                    </div>
                </div>
           </div>
                <div className=' darkContainer '>
                <h1>Players List</h1>
                <hr/>
                <div className=' container mt-3 d-flex flex-column justify-content-center '>
                    {
                        this.state.players.map((name,id) => {
                            return <h4 className='m-1' key={id}>{name}</h4>
                        })
                    }
                </div>
                
                </div>
            </div>
        </>
    }
}

export default Room