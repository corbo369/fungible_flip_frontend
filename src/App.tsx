import React from 'react';
import { WagmiProvider } from 'wagmi';
import { config } from './config';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Background from './components/background';
import FungibleFlip from './components/fungibleFlip';
import BackgroundMobile from "./components/backgroundMobile";
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

    const queryClient = new QueryClient();

    if (isMobile()) {
        return (
            <WagmiProvider config={config}>
                <QueryClientProvider client={queryClient}>
                    <div className="App">
                        <BackgroundMobile/>
                        <FungibleFlipMobile/>
                    </div>
                </QueryClientProvider>
            </WagmiProvider>
        );
    } else {
        return (
            <WagmiProvider config={config}>
                <QueryClientProvider client={queryClient}>
                    <div className="App">
                        <Background/>
                        <FungibleFlip/>
                    </div>
                </QueryClientProvider>
            </WagmiProvider>
        );
    }
}

export default App;
