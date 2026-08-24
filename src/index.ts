import {XfMusicPlayer} from "./player-element";

// 注册自定义元素（只执行一次，用 if 防止重复注册）
if (!customElements.get('xf-music-player')) {
    customElements.define('xf-music-player', XfMusicPlayer)
}

// 导出类，方便别人用 new XfMusicPlayer() 或做类型标注
export { XfMusicPlayer }