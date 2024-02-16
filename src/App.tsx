import React from 'react';
import Background from './components/background';
import FungibleFlip from './components/fungibleFlip';
import FungibleFlipMobile from "./components/fungibleFlipMobile";

function App() {

    function isMobile() {
        // @ts-ignore
        const match = window.matchMedia || window.msMatchMedia;
        if(match) {
            const mq = match("(pointer:coarse)");
            return mq.matches;
        }
        return false;
    }

    if (isMobile()) {
        return (
            <div className="App">
                <FungibleFlipMobile/>
            </div>
        );
    } else {
        return (
            <div className="App">
                <Background/>
                <FungibleFlip/>
            </div>
        );
    }
}

export default App;
