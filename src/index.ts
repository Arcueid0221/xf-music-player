export const PLAYER_VERSION = '0.1.0'
function helloword() {
    return "helloword"
    
}
console.log(helloword())


const app = document.querySelector<HTMLDivElement>('#app')
if(app){
    app.textContent = 'Hello World'   // 这里 TS 会报错
}
