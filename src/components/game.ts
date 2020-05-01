const Game = () => {
    var template =
    `
    <div class="background">
        <div class="gameContainer" id="gameContainer">
            <div class="menu">
                <div class="counter">
                    <h1 id="bombCounter">091</h1>
                </div>
                <div>
                    <button class="uibtn" id="newGameBtn"> 
                        <span class="material-icons" style="font-size:36px;">
                            fiber_new
                        </span>
                    </button> 
                    <button class="uibtn" id="settingBtn">
                        <span class="material-icons" style="font-size:36px;">
                            settings
                        </span>
                    </button>
                </div>
                <div class="counter">
                    <h1 id="timeCounter">012</h1>
                </div>
            </div>
            
            <div class="grid" id="grid">
            </div>
            
        </div>  

        <div class="dropdown-content" id="dropdown-content">
            <div class="bg">
            </div>


            <h1>Mineswepper</h1>
            <button id="changeSizeBtn">Change size</button>
            <input type="range" min="10" max="50" value="30" class="slider rangeInput" id="squareSizeSlider">
            <label for"nameInput">Nickname</label>
            <input class="nameInput" type="text" id="nameInput">
            </div>
        
    </div>
    `;
    return template;
}

export default Game