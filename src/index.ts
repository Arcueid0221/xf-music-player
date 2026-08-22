import {AudioEngine} from "./core/audio-engine"
import {createStore} from "./core/store"
import {nextIndex, prevIndex} from "./core/playlist"
import type {SongInfo} from "./config/type"

const song1: SongInfo = {
    id: 1 ,
    title: 'a love song',
    src: '/audio/a-love-song.mp3',
}

const song2: SongInfo = {
    id: 2 ,
    title: '化粧直し',
    src: '/audio/化粧直し.mp3',
}

const song3 : SongInfo = {
    id: 3 ,
    title: 'Steal A Kiss',
    src: '/audio/Steal-A-Kiss.mp3',
}

const songList: SongInfo[] = [
    song1,
    song2,
    song3,
]

const engine = new AudioEngine()
engine.load(songList[0])

const store = createStore({
    playlist: songList,
    currentIndex: 0,
    playMode: 'order',
})

store.subscribe((state) => {
    const song = state.playlist[state.currentIndex]
    engine.load(song)
    engine.play()
    console.log(song.title)
})

const playBtn = document.createElement('button')
playBtn.textContent = '播放'
playBtn.addEventListener('click',() => engine.play())

const pauseBtn = document.createElement('button')
pauseBtn.textContent = '暂停'
pauseBtn.addEventListener('click',() => engine.pause())

const nextBth = document.createElement('button')
nextBth.textContent = '下一首'
nextBth.addEventListener('click',()=> {
    const state = store.getState()
    const index = nextIndex(state.playlist.length, state.currentIndex, state.playMode)
    store.setState({currentIndex: index})
})

const prevBth = document.createElement('button')
prevBth.textContent = '上一首'
prevBth.addEventListener('click',()=> {
    const state = store.getState()
    const index = prevIndex(state.playlist.length, state.currentIndex, state.playMode)
    store.setState({currentIndex: index})
})

const modeBtn = document.createElement('button')
modeBtn.textContent = '换模式'
modeBtn.addEventListener('click', ()=>{
    const order = ['order', 'single', 'random'] as const
    const current = store.getState().playMode
    const index = order.indexOf(current)
    const next = order[(index + 1) % order.length]
    store.setState({ playMode: next })
    console.log(next)
})



const app = document.querySelector<HTMLDivElement>('#app')
if(app){
    app.appendChild(playBtn)
    app.appendChild(pauseBtn)
    app.appendChild(nextBth)
    app.appendChild(prevBth)
    app.appendChild(modeBtn)
}

engine.onTimeUpdate((cur, dur) =>{
    console.log(cur, dur)
})