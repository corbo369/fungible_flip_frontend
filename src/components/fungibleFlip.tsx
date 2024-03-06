import React, {useState} from 'react';
import {ethers} from "ethers";
import { Howl } from 'howler';
import Alert from './alert';
import flipABI from '../assets/FungibleFlip.json';
import Mute from '../assets/images/mute.png';
import Twitter from '../assets/images/twitter.png';
import Heads from '../assets/images/heads.png';
import Tails from '../assets/images/tails.png';
import HeadsAnimation from '../assets/images/heads-animation.png';
import TailsAnimation from '../assets/images/tails-animation.png';
import './styles/fungibleFlip.css';

function playSound(name: string) {
    const soundMap = {
        'deposit': () => new Howl({
            src: [`${process.env.PUBLIC_URL}/audio/deposit.wav`],
            volume: .45,
            autoplay: false,
            preload: true,
        }),
        'background': () => new Howl({
            src: [`${process.env.PUBLIC_URL}/audio/background.wav`],
            volume: 0.24,
            autoplay: false,
            preload: true,
            loop: false,
        }),
        'flip': () => new Howl({
            src: [`${process.env.PUBLIC_URL}/audio/flip.wav`],
            volume: .45,
            autoplay: false,
            preload: true,
        }),
        'win': () => new Howl({
            src: [`${process.env.PUBLIC_URL}/audio/winner.wav`],
            volume: .33,
            autoplay: false,
            preload: true,
        }),
        'lose': () => new Howl({
            src: [`${process.env.PUBLIC_URL}/audio/loser.wav`],
            volume: .33,
            autoplay: false,
            preload: true,
        }),
    };
    // @ts-ignore
    const sound = soundMap[name]();
    sound.play();
    return sound;
}

const FungibleFlip = () => {

    const [stage, setStage] = useState<number>(0);

    const [flipResult, setFlipResult] = useState<number>(0);

    const [choice, setChoice] = useState<number>(2);

    const [amount, setAmount] = useState<number>(0);

    const [level, setLevel] = useState<number>(0);

    const [experience, setExperience] = useState<number>(0);

    const [muted, setMuted] = useState<boolean>(false);

    const [showChainAlert, setShowChainAlert] = useState<boolean>(false);

    const [userAddress, setUserAddress] = useState<string>("");

    const [leaderboardText, setLeaderboardText] = useState<string>("leaderboard");

    const provider = new ethers.JsonRpcProvider(
        'https://rpc.ankr.com/blast/647924a9aa98249697add40f8edd819ae04c3e97ef701d2e425617aff280850f');

    const contractAddress = "0xbB0980E63A05FdFC165A915c4F8183299326f86a";

    const contract = new ethers.Contract(contractAddress, flipABI.abi, provider);

    const isConnected = Boolean(userAddress);

    const chainID = 81457;

    const getTextButton = () => {
        switch (stage) {
            case 0:
                return 'DEPOSIT';
            case 1:
                return 'DEPOSITING';
            case 2:
                return 'FLIP';
            case 3:
                return 'FLIPPING';
            case 5:
                return 'SELECT BOTH INPUTS';
            default:
                return '';
        }
    };

    const getTextResult = () => {
        switch (choice) {
            case 0:
                return 'TAILS';
            case 1:
                return 'HEADS';
            default:
                return 'NULL';
        }
    };

    const handleHeads = () => {
        setChoice(1);
        // @ts-ignore
        document.getElementById("head").style.transform = "rotateY(0deg)";
        // @ts-ignore
        document.getElementById("tail").style.transform = "rotateY(180deg)";
        setStage(0);
    }

    const handleTails = () => {
        setChoice(0);
        // @ts-ignore
        document.getElementById("tail").style.transform = "rotateY(0deg)";
        // @ts-ignore
        document.getElementById("head").style.transform = "rotateY(180deg)";
        setStage(0);
    }

    const handleNullInput = () => {
        setStage(5);
    }

    const handleAlertClose = () => {
        setShowChainAlert(false);
    };

    async function connectWallet() {
        // @ts-ignore
        if (window.ethereum && window.ethereum.isMetaMask) {
            try {
                // @ts-ignore
                const accounts = await window.ethereum.request({
                    method: 'eth_requestAccounts',
                });
                setUserAddress(accounts[0]);
                await updateLevel(accounts[0]);
            } catch (error) {
                console.log('Error connecting...');
            }
        } else {
            alert('MetaMask not detected');
        }
    }

    async function updateLevel(address: string) {
        // @ts-ignore
        if (window.ethereum) {
            try {
                const exp = await contract.experience(address);
                const level = await contract.level(address);
                setLevel(Number(level));
                setExperience(Number(exp));
            } catch (err) {
                console.log("error: ", err);
            }
        }
    }

    async function handleDeposit() {
        // @ts-ignore
        if (window.ethereum) {
            // @ts-ignore
            document.getElementById("coin").style.animationIterationCount = "infinite";
            // @ts-ignore
            document.getElementById("coin").style.animationTimingFunction = "linear";
            // @ts-ignore
            document.getElementById("coin").style.animationPlayState = "running";
            setStage(1);
            // @ts-ignore
            const provider = new ethers.BrowserProvider(window.ethereum)
            const signer = await provider.getSigner();
            const contract = new ethers.Contract(
                contractAddress,
                flipABI.abi,
                signer
            );
            const network = await provider.getNetwork();
            if (Number(network.chainId) !== chainID) {
                setShowChainAlert(true);
                setStage(0);
                return;
            }
            try {
                const result = await contract.deposit(choice, {value: ethers.parseEther(String(amount))});
                if(!muted) playSound('deposit');
                await handleSubscribe();
                console.log(result);
            } catch (err) {
                // @ts-ignore
                document.getElementById("coin").style.animationIterationCount = 1;
                // @ts-ignore
                document.getElementById("coin").style.animationPlayState = "paused";
                setStage(0);
                console.log("error: ", err);
            }
        }
    }

    async function handleSubscribe() {
        const depositFilter = contract.filters.Deposit(userAddress, null);
        const resultFilter = contract.filters.Result(userAddress, null, null, null);

        try {
            await contract.on(depositFilter, (event) => {
                console.log('Deposit event detected', event);
                if(!muted) playSound('background');
                setTimeout(() => {
                    setStage(3);
                    // @ts-ignore
                    document.getElementById("coin").style.animationName = "flipping";
                    // @ts-ignore
                    document.getElementById("coin").style.animationTimingFunction = "linear";
                    // @ts-ignore
                    document.getElementById("coin").style.animationIterationCount = "infinite";
                    // @ts-ignore
                    document.getElementById("coin").style.animationPlayState = "running";
                    if(!muted) playSound('flip');
                }, 2700);
                contract.off(depositFilter);
            });
            await contract.on(resultFilter, (event) => {
                console.log('Result event detected', event);
                setTimeout(() => {
                    // @ts-ignore
                    setFlipResult(Number(event.args[2]));
                    // @ts-ignore
                    if (event.args[1] === event.args[2]) {
                        if(!muted) playSound('win');
                    } else {
                        if(!muted) playSound('lose');
                    }
                    setStage(4);
                }, 3000);
                contract.off(resultFilter);
            });
        } catch (error) {
            // @ts-ignore
            document.getElementById("coin").style.animationIterationCount = 1;
            // @ts-ignore
            document.getElementById("coin").style.animationPlayState = "paused";
            setStage(0);
            console.log("error: ", error);
        }
    }

    async function handleFlipResult() {
        // @ts-ignore
        document.getElementById("coin").style.animationIterationCount = 1;
        // @ts-ignore
        document.getElementById("coin").style.animationPlayState = "paused";
        // @ts-ignore
        document.getElementById("coin").style.animationName = "spinning";
        // @ts-ignore
        document.getElementById("coin").style.animationTimingFunction = "linear";
        await updateLevel(userAddress);
        setStage(0);
    }

    return (
        <div className="flip">
            <div className="navbar">
                <div className="leaderboard-container">
                    <button
                        className="leaderboard-btn"
                        onMouseEnter={() => setLeaderboardText("COMING SOON")}
                        onMouseLeave={() => setLeaderboardText("LEADERBOARD")}
                    >
                        {leaderboardText}
                    </button>
                    <button
                        className={`mute-btn ${muted ? "mute-btn-selected" : ""}`}
                        onClick={() => setMuted(!muted)}
                    >
                        <img className="mute-img" src={Mute} alt="Mute"/>
                    </button>
                </div>
                <p className="title">FUNGIBLE FLIP</p>
                <div className="level-container">
                    <a href="https://twitter.com/FungibleFlip" target="_">
                        <button className="social-btn">
                            <img className="twitter" src={Twitter} alt="Twitter" />
                        </button>
                    </a>
                    <div className="levelbar-container">
                        {userAddress.substring(0, 5) + "..." + userAddress.substring(40, 42)}
                        <div className="levelbar">
                            <div className="experience" style={{width: `${(experience / 1000) * 100}%`}}/>
                        </div>
                        Level {level}
                    </div>
                </div>
            </div>
            {showChainAlert && (
                <Alert message="Please switch to the Blast network" type="error" onClose={handleAlertClose} />
            )}
            {stage === 4 ? (
                <div className="main">
                    <div className="coin-container">
                        {(flipResult === 0) ? (
                            <div id="coin" className="coin-result">
                                <div className="face front">
                                    <img className="front-img" src={TailsAnimation} alt="Tails"/>
                                </div>
                                <div className="face back">
                                    <img className="back-img" src={TailsAnimation} alt="Tails"/>
                                </div>
                            </div>
                        ) : (
                            <div id="coin" className="coin-result">
                                <div className="face front">
                                    <img className="front-img" src={HeadsAnimation} alt="Heads" />
                                </div>
                                <div className="face back">
                                    <img className="back-img" src={HeadsAnimation} alt="Heads" />
                                </div>
                            </div>
                        )}
                    </div>
                    {(choice === flipResult) ? (
                        <button className="result-txt">You chose {getTextResult()} <br/> and doubled up</button>
                    ) : (
                        <button className="result-txt">You chose {getTextResult()} <br/> and got rugged</button>
                    )}
                    <button className="result-btn" onClick={handleFlipResult}>FLIP AGAIN</button>
                </div>
            ) : (
                <div className="main">
                    <div className="coin-container">
                        <div id="coin" className="coin-animated">
                            <div id="head" className="face front">
                                <img className="front-img" src={Heads} alt="Heads" />
                            </div>
                            <div id="tail" className="face back">
                                <img className="back-img" src={Tails} alt="Tails" />
                            </div>
                        </div>
                    </div>
                    {(stage === 1 || stage === 2 || stage === 3) ? (
                        <div>
                            <button className="flip-info">
                                {getTextResult()} <br/> {amount} eth
                            </button>
                        </div>
                    ) : (
                        <div>
                            <div className="choices">
                                <button
                                    className={`choice-btn ${choice === 1 ? "choice-btn-selected" : ""}`}
                                    onClick={handleHeads}
                                >
                                    HEADS
                                </button>
                                <button
                                    className={`choice-btn ${choice === 0 ? "choice-btn-selected" : ""}`}
                                    onClick={handleTails}
                                >
                                    TAILS
                                </button>
                            </div>
                            <div className="amounts">
                                <button
                                    className={`amount-btn ${amount === 0.0025 ? "amount-btn-selected" : ""}`}
                                    onClick={() => {
                                        setAmount(0.0025);
                                        setStage(0);
                                    }}
                                >
                                    0.0025
                                </button>
                                <button
                                    className={`amount-btn ${amount === 0.005 ? "amount-btn-selected" : ""}`}
                                    onClick={() => {
                                        setAmount(0.005);
                                        setStage(0);
                                    }}
                                >
                                    0.005
                                </button>
                                <button
                                    className={`amount-btn ${amount === 0.01 ? "amount-btn-selected" : ""}`}
                                    onClick={() => {
                                        setAmount(0.01);
                                        setStage(0);
                                    }}
                                >
                                    0.01
                                </button>
                            </div>
                            <div className="amounts">
                                <button
                                    className={`amount-btn ${amount === 0.015 ? "amount-btn-selected" : ""}`}
                                    onClick={() => {
                                        setAmount(0.015);
                                        setStage(0);
                                    }}
                                >
                                    0.015
                                </button>
                                <button
                                    className={`amount-btn ${amount === 0.02 ? "amount-btn-selected" : ""}`}
                                    onClick={() => {
                                        setAmount(0.02);
                                        setStage(0);
                                    }}
                                >
                                    0.02
                                </button>
                                <button
                                    className={`amount-btn ${amount === 0.025 ? "amount-btn-selected" : ""}`}
                                    onClick={() => {
                                        setAmount(0.025);
                                        setStage(0);
                                    }}
                                >
                                    0.025
                                </button>
                            </div>
                        </div>
                    ) }
                    {isConnected ? (
                        stage === 2 ? (
                            <button className="flip-btn"> {getTextButton()} </button>
                        ) : (
                            <button className="flip-btn" onClick={(stage === 1 || stage === 3) ? () => {} : (choice > 1 || amount === 0) ? handleNullInput : handleDeposit}> {getTextButton()} </button>
                        )
                    ) : (
                        <button className="flip-btn" onClick={connectWallet}> CONNECT WALLET </button>
                    )}
                </div>
            )}
        </div>
    );
}

export default FungibleFlip;