const Game = () => {
    var template =
    `
    <div class="background">
        <div class="gameContainer">
            <div class="menu">
                <div class="counter">
                    <h1>091</h1>
                </div>
                <div class="midButtons">
                    <button id="newGameBtn">New game</button>
                    <button id="changeSizeBtn">Change size</button>
                </div>
                <div class="counter">
                    <h1>012</h1>
                </div>
            </div>

            
            
            <div class="grid" id="grid">
            </div>
        </div>  
  
    </div>
    `;
    return template;
}

export default Game