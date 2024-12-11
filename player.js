const next_but=document.querySelector('.next-song');
const prev_but=document.querySelector('.prev-song');
const skipbefore=document.querySelector('.skip-before');
const skipafter=document.querySelector('.skip-after');
const playsymbol=document.querySelectorAll('.pause_play');
const progress=document.querySelector('.progress');

const img=document.querySelector('.album-img');
const song=document.querySelector('audio');
const title=document.querySelector('.card-title');
const artist=document.querySelector('.artist-name');
const endTime=document.querySelector('.endTime');
const startTime=document.querySelector('.startTime');
const shuffler=document.querySelectorAll('.shuffler');
const loop=document.querySelectorAll('.loop');

const playlist=[
    {img:'pics/album1.png', song:'Songs/album1.mp3', name:'HIGHEST IN THE ROOM', artist:'Travis Scott'},
    {img:'pics/album2.jpg', song:'Songs/album2.mp3', name:'CIRCLES', artist:'Post Malone'},
    {img:'pics/album3.jpg', song:'Songs/album3.mp3', name:'DIE WITH A SMILE', artist:'Bruno Mars, Lady Gaga'},
    {img:'pics/album4.jpg', song:'Songs/album4.mp3', name:'SUPERMAN', artist:'Eminem'}
];

let currentSong=0;
const len=playlist.length;
const skiplen=5;

let shuffleSong=false;
let repeatSong=false;
let repeatOneSong=false;

const pause=playsymbol[0];
const play=playsymbol[1];

function playPause(){
    if(song.paused){
        song.play();
        pause.hidden=false;
        play.hidden=true;
    }else{
        song.pause();
        pause.hidden=true;
        play.hidden=false;
    }
}

playsymbol.forEach(e=>e.addEventListener('click',playPause));

function nextsong(){
    let nextSong=(currentSong+1)%len;
    if(shuffleSong){
        do{
            nextSong=Math.floor(Math.random()*len);
        }while(nextSong===currentSong);
    }
    if(repeatSong){
        nextSong=currentSong;
    }
    if(repeatOneSong){
        repeatOneSong=false;
        toggle('.repeat_one_on','.repeat_one',false);
        nextSong=currentSong;
    }
    SongPlay(nextSong);
}

function prevsong(){
    const nextSong=(currentSong-1+len)%len;
    SongPlay(nextSong);
}

function SongPlay(i){
    currentSong=i;
    img.src=playlist[i].img;
    song.querySelector('source').src=playlist[i].song;
    song.load();
    // song.play();
    playPause();
    title.innerHTML=playlist[i].name;
    artist.innerHTML=`-${playlist[i].artist}`;
    song.addEventListener('loadedmetadata',()=>{
        let time=song.duration;
        endTime.innerHTML=`${Math.floor(time/60)}:${Math.floor(time%60)<10?'0':''}${Math.floor(time%60)}`;
    })
}

song.addEventListener('timeupdate',()=>{
    if(song.paused){
        pause.hide=false;
        play.hide=true;
    }
})

song.addEventListener('canplaythrough',()=>{
    progress.max=song.duration;
})

if(song.play()){
    setInterval(()=>{
        progress.value=song.currentTime;
    },500);
}

song.addEventListener('timeupdate',()=>{
    if(song.currentTime>0){
        const playedPercent=song.currentTime/song.duration*100;
        progress.style.backgroundImage=`linear-gradient(90deg,#fce065 ${playedPercent}%, #ff1d58 ${playedPercent}%, #000 0)`;
    }
    if(Math.abs(song.currentTime-song.duration)<0.1){
        nextsong();
    }
    let time=song.currentTime;
    startTime.innerHTML=`${Math.floor(time/60)}:${Math.floor(time%60)<10?'0':''}${Math.floor(time%60)}`;
});

progress.oninput=()=>{
    song.currentTime=progress.value;
}

shuffler.forEach(e => {
    e.addEventListener('click',()=>{
        shuffleSong=!shuffleSong;
        toggle('.shuffle_on','.shuffle',shuffleSong);
    })
});

loop.forEach((but,i)=>{
    but.addEventListener('click',()=>{
        if(i===0 || i===1){
            repeatSong=!repeatSong;
            toggle('.repeat_on','.repeat',repeatSong);
        }
        else{
            repeatOneSong=!repeatOneSong;
            toggle('.repeat_one_on','.repeat_one',repeatOneSong);
        }
    })
});

function toggle(act,inact,c){
    const active=document.querySelector(act);
    const inactive=document.querySelector(inact);
    if(c){
        active.hidden=false;
        inactive.hidden=true;
    }else{
        active.hidden=true;
        inactive.hidden=false;
    }
}

next_but.addEventListener('click',nextsong);
prev_but.addEventListener('click',prevsong);
skipbefore.addEventListener('click',()=>{song.currentTime=Math.max(song.currentTime-skiplen,0)});
skipafter.addEventListener('click',()=>{song.currentTime=Math.min(song.currentTime+skiplen,song.duration)});

SongPlay(currentSong);