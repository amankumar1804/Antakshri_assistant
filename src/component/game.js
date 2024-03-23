import React, { Component } from "react";
import axios from 'axios';
import swal from 'sweetalert2';
import $ from 'jquery';
import { collection, doc, onSnapshot, query, updateDoc, deleteDoc, where } from 'firebase/firestore';
import { db } from '../firebase-config';
import Loader from './loading';
import Navbar from './navbar';

class Game extends Component {
    queryParams = new URLSearchParams(window.location.search);
    room = this.queryParams.get("id");

    state = {
        players: [],
        score: [],
        time: 250,
        genres: [],
        dataLoad: false,
        loading: true,
        lyric: '',
        words: '',
        round: 0,
        Totalrounds: 0
    }

    recognition = window.webkitSpeechRecognition ? new window.webkitSpeechRecognition() : null;
    content = '';

    componentDidMount() {
        if (!this.recognition) {
            console.error('SpeechRecognition API is not supported in this browser.');
            return;
        }

        $('#stop').attr('disabled', true);

        this.fetchData();
        this.listenForChanges();

        this.recognition.continuous = true;
        this.recognition.onstart = this.handleRecognitionStart;
        this.recognition.onend = this.handleRecognitionEnd;
        this.recognition.onresult = this.handleRecognitionResult;

        setInterval(() => {
            this.setState(prevState => ({
                time: prevState.time - 1
            }));
        }, 1000);
    }

    fetchData = async () => {
        const usersSnapshot = await query(collection(db, 'users'), where('__name__', '==', sessionStorage.getItem('userId'))).get();
        const users = usersSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
        const genres = users[0]['genres'];

        const gameSnapshot = await query(collection(db, "games"), where("__name__", "==", this.room)).get();
        if (!gameSnapshot.empty) {
            const gameData = gameSnapshot.docs[0].data();
            const { players, score, lyric, round, Totalrounds } = gameData;
            this.setState({
                players,
                score,
                genres,
                loading: false,
                lyric,
                round,
                Totalrounds
            });
        }
    }

    listenForChanges = () => {
        const gameRef = doc(db, "games", this.room);
        onSnapshot(gameRef, snapshot => {
            if (snapshot.exists()) {
                const gameData = snapshot.data();
                const { round, score } = gameData;
                this.setState({ round, score });
                if (round === 0) {
                    const ind = score.indexOf(Math.max(...score));
                    swal.fire({
                        title: "Congratulations " + this.state.players[ind],
                        text: 'You won.',
                        allowOutsideClick: false,
                        background: 'white'
                    }).then(() => {
                        window.location.href = window.location.origin;
                        deleteDoc(gameRef);
                    });
                }
            }
        });
    }

    handleRecognitionStart = () => {
        console.log('Microphone started....');
    }

    handleRecognitionEnd = async () => {
        console.log('Microphone stopped....');

        swal.fire({
            title: 'Your time has ended.'
        });

        await this.handlePlayerChange();

        $('#text').text('');
    }

    handleRecognitionResult = (e) => {
        const current = e.resultIndex;
        const transcript = e.results[current][0].transcript;
        this.content += transcript;
        $('#text').text(this.content);
    }

    handlePlayerChange = async () => {
        const len = this.state.players.length;
        const res = await axios.post('/score', { lyric: this.state.lyric, text: this.content });
        this.content = '';
        const score = [...this.state.score];
        score[this.state.current] += res.data;
        const updates = {
            current: (this.state.current + 1) % len,
            score,
            lyric: $('#text').text(),
            round: this.state.round - 1
        };
        await updateDoc(doc(db, 'games', this.room), updates);
    }

    microphoneStart = () => {
        this.recognition.start();
        if (this.content.length) {
            this.content += '';
        }
        $('#play').attr('disabled', true);
        $('#stop').show();
        $('#timer').hide();
        this.setState({ time: 60 });
    }

    microphoneStop = () => {
        this.recognition.stop();
        $('#play').attr('disabled', false);
    }

    render() {
        const { loading, players, score, lyric, time } = this.state;

        if (loading) {
            return (
                <>
                    <Navbar />
                    <Loader />
                </>
            );
        }

        return (
            <>
                <Navbar />
                <h2 className='text-center'>
                    Round {parseInt((this.state.Totalrounds - this.state.round) / this.state.players.length) + 1}
                </h2>
                {/* Render players, score, lyric, and other UI components */}
            </>
        );
    }
}

export default Game;
