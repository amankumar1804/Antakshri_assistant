from flask import Flask, jsonify, request
import score
#import voicetotext
import numpy as np 
import pandas as pd
import MLcode
app = Flask(__name__)
#print(recommend_song_genre(df,'love',['poP']))

@app.route('/')
def index():
    return "Hello, World!"

@app.route('/api', methods=['GET', 'POST'])
def get_data():
    lyrics = request.json['lyrics']
    genre = request.json['genre']
    # print(lyrics , genre)
    # lyrics = 'good'
    # genre = ['hip hop']
    res=[]
   
    print(type(lyrics) , type(genre))
    
    for word in lyrics.split(' ')[::-1]:
        
        print(word,sep='\n')
        for ele in MLcode[0](word,genre):
            res.append(ele)
        
        if len(res)>=5:
            break
    print("clear",sep='\n')
    
    if len(res) == 0:
        for ele in MLcode[0]('love',genre):
            res.append(ele)
    
    while len(res) > 10:
        res.pop()
    print(lyrics,len(res))
    return jsonify(res)

@app.route('/lyrics', methods=['GET', 'POST'])
def get_lyrics():
    id = request.json['id']
    # print(id)
    return MLcode[2](id)

@app.route('/score', methods=['GET','POST'])
def get_score():
    lyric = request.json['lyric']
    text = request.json['text']
    sc = score(lyric,text)*(len(text) * 0.5 )
    # print(sc)
    return str(int(sc))

if __name__ == '__main__':
    app.run(debug=True)
