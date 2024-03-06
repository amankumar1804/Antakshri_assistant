import axios from 'axios';
import { collection, doc, onSnapshot, query, updateDoc, where ,deleteDoc} from 'firebase/firestore';
import $ from 'jquery';
import { Component } from "react";
import swal from 'sweetalert2';
import { db } from '../firebase-config';
import Loader from './loading';
import Navbar from './navbar';

class Game extends Component{
    queryParams = new URLSearchParams(window.location.search)
    room = this.queryParams.get("id")

    state = {
        players:[],
        score:[],
        time:250,
        genres:[],
        dataLoad:false,
        loading: true,
        lyric:'',
        words:'',
        round:0,
        Totolrounds:0
    }

    speechRecognition  =  window.webkitSpeechRecognition
    recognition = new this.speechRecognition()
    content = ''
    control = ''
    timer = {}

    fetch = (d)=>{

        
        if(this.state.players[d] === sessionStorage.getItem('user') && this.state.dataLoad ===  false && this.state.round > 0){
            this.setState({
                dataLoad:true,
                loading:true
            })

            // console.log(this.state.dataLoad)
           axios.post('/api',{
             genre:this.state.genres,
             lyrics: this.state.words
           }).then((res) =>{
            // console.log(res.data)

            var list = ''
            res.data.forEach((e,i)=> {
                list += `<option value=${e[0]}>${e[1]}</option>`
            })

            swal.fire({
                title: 'SELECT SONG',
                html: `<select id="single-select" class='form-control mb-5'>
                         ${list}
                    </select>`,
            allowOutsideClick: false,
                confirmButtonText: 'Confirm',
                focusConfirm: false,
                preConfirm: () => {
                  const song = swal.getPopup().querySelector('#single-select').value
                    // console.log(song)
                  return song
                }
              }).then((result) => {
                    // console.log(result.value)
                    axios.post('/lyrics',{
                        id:result.value
                    }).then(
                       res => {
                         this.setState({
                            lyric:res.data,
                            loading:false,
                            time:20
                         })
                       }
                    )
        
              })
          
           })
        }

        
    }

    componentDidMount(){
      
        $('#stop').attr('disabled',true)
        const q = query(collection(db, "games"), where("__name__", "==", this.room));

        var t = query(collection(db,'users'),where('__name__','==', sessionStorage.getItem('userId')))
        onSnapshot(t , snapshot => {
       
           var users = []
           snapshot.forEach((doc) => {
               users.push({...doc.data(),id:doc.id});
           });
        //    console.log('change in users')
           this.setState({
            genres: users[0]['genres']
           })
           
         })
       
       onSnapshot(q , snapshot => {
            
            var rooms = []
            snapshot.forEach((doc) => {
                rooms.push({...doc.data(),id:doc.id});
            });
            // console.log('change in gameRef')
            this.setState({
                
                players: rooms[0]['players'],
                score: rooms[0]['score'],
                current: rooms[0]['current'],
                time:250,
                dataLoad : false,
                loading:false,
                words: rooms[0]['lyric'],
                round:  rooms[0]['round'],
                Totolrounds:rooms[0]['Totalrounds']
            })

          
            if(rooms[0]['round'] === 0){
                var ind = rooms[0]['score'].indexOf(Math.max(...rooms[0]['score']))
                swal.fire({
                    'title':"congratulations " + rooms[0]['players'][ind],
                    'text' : 'You won.',
                    allowOutsideClick: false,
                    background: 'white'
                }).then(()=>
                    {
                    window.location.href = window.location.origin
                    deleteDoc(doc(db, "games", this.room))}
                )
        }
       })

      
       this.recognition.continuous = true
    
       this.recognition.onstart = ()=>{
         console.log('microphone started....')
       }
       this.recognition.onend = async()=>{
         console.log('microphone Stoped....')

         swal.fire({
            title:'Your time has ended.'
         })
         await this.changePlayer()
        
        $('#text').text('')
       }

       this.recognition.onresult = (e)=>{
            var current = e.resultIndex
            var transcript = e.results[current][0].transcript
            this.content += transcript
            // console.log(this.content)
            $('#text').text(this.content)
       }

       
        setInterval(()=>{
            this.setState({
                time : this.state.time - 1
            })
        },1000)
        
        
    }

    componentDidUpdate=()=>{

        
        
        // console.log('updated')
        this.fetch(this.state.current)
        if(this.state.players[this.state.current] !== sessionStorage.getItem('user')){
            
            $('#play').hide()
            $('#lyric').hide()
            $('#stop').hide()
            $('#wait').show()
            $('#timer').hide()

        }
        else{
            
            $('#wait').hide()
            $('#play').show()
            // $('#stop').show()
            $('#timer').show()
            if(this.state.time <= 0){
                swal.fire({
                    title:'Your time has ended.'
                 })
                this.changePlayer()
            }
        }
       
        $('.rest').css('color','#696262')
        $(`#player${this.state.current}`).css('color','white')
        $(`#score${this.state.current}`).css('color','white')
  

    }

    microphoneStart = ()=>{
        this.recognition.start()  
        if(this.content.length){
            this.content += ''
        }
        $('#play').attr('disabled',true)
        $('#stop').show()
        $('#timer').hide()
       
          
       this.setState({
            time:60
         })
    }

    microphoneStop = ()=>{
       this.recognition.stop()
    //    console.log(this.content)
       $('#play').attr('disabled',false)
      
    }

    changePlayer = async()=>{
        var len = this.state.players.length
        

        await axios.post('/score',{
            lyric: this.state.lyric,
            text : this.content
        }).then(async(res) =>{
            // console.log(res)
            this.content = ''
            var score = this.state.score
            score[this.state.current] += res.data
            
            if($('#text').text().length === 0){
                await updateDoc(doc(db,'games',this.room),{
                    current: (this.state.current + 1) % len,
                    score:score,
                    round: this.state.round - 1
                    
                })
            }
            else{
                await updateDoc(doc(db,'games',this.room),{
                    current: (this.state.current + 1) % len,
                    score:score,
                    lyric: $('#text').text(),
                    round: this.state.round - 1
                })
            }

            // await updateDoc(doc(db,'games',this.room),{
            //     current: (this.state.current + 1) % len,
            //     score:score,
            //     lyric: $('#text').text()
            // })
          
        })
    }

    render(){
        if(this.state.loading)return <>
            <Navbar />
            <Loader/>
        </>
        else
        return <>
            <Navbar/>
            <h2 className='text-center'>
                Round {parseInt((this.state.Totolrounds - this.state.round) / this.state.players.length )  + 1}
            </h2>
            <div className='darkContainer container text-center d-flex flex-row h-25 m-auto my-2 '>

                <div className='col-6'>
                    <h2>Current Players</h2>
                    <hr/>
                    {this.state.players.map((p,i)=>{
                        return <h4 id={`player${i}`} className='rest' key={i}>{p}</h4>
                    })}
                </div>

                <div className='col-6'>
                    <h2>Score</h2>
                    <hr/>
                    {this.state.score.map((p,i)=>{
                        return <h4 id={`score${i}`} className='rest' key={i}>{p}</h4>
                    })}
                </div>

            </div>
            <div className='text-center' id='lyric'>
                 <p>
                    <a className="btn btn-danger"  data-bs-toggle="collapse" href="#collapseExample" role="button" aria-expanded="false" aria-controls="collapseExample">
                        Lyrics
                    </a>
                    
                </p>
                <div className="container collapse" id="collapseExample">
                    <div className="card card-body text-dark" style={{height:'120px',overflowY:'scroll'}}>
                        {this.state.lyric}
                    </div>
                </div>
            </div>
            <div className='mt-3 m-auto col-6 d-flex flex-row justify-content-around' >
            
                <button className='col-3 btn btn-primary shadow' onClick={()=>this.microphoneStart()} id='play' style={{display:'none'}}>
                    Play
                </button>
                <button className='col-3 btn btn-danger shadow' onClick={()=>this.microphoneStop()} id='stop'  style={{display:'none'}} >
                    Stop
                </button>
                <h3  className='text-danger' id='wait'  style={{display:'none'}}    >Wait for your turn</h3>

            </div>
           <div  className='d-flex flex-row justify-content-center mt-4'>
          
            <div className='container text-center'>
                    <h3  id='timer'  style={{display:'none'}}>{this.state.time} seconds</h3>
                    <textarea id="text" className='text-primary col-7 form-control' disabled={true}></textarea>
                </div>
                
           </div>
        </>
    }
}
export default Game