export const PLAYER_VERSION = '0.1.0'
import {AudioEngine} from "./core/audio-engine"
import type {SongInfo} from "./config/type"

const engine = new AudioEngine()
const song : SongInfo = {

    id : 1 ,
    title : 'a love song',
    src : '../a-love-song.mp3',
    duration : 5.57

}
engine.load(song)

const playBtn = document.createElement('button')
playBtn.textContent = '播放'
playBtn.addEventListener('click',() => engine.play())

const pauseBtn = document.createElement('button')
pauseBtn.textContent = '暂停'
pauseBtn.addEventListener('click', () => engine.pause())

function helloword() {
    return "helloword"

}
console.log(helloword())


const app = document.querySelector<HTMLDivElement>('#app')
if(app){
    app.textContent = 'Hello World'   // 这里 TS 会报错
    app.appendChild(playBtn)
    app.appendChild(pauseBtn)
}

engine.onTimeUpdate((cur, dur) =>{
    console.log(cur, dur)
})