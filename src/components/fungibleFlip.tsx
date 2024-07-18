import React, {useState} from 'react';
import {ethers} from "ethers";
import Alert from './alert';
import { Howl } from 'howler';
import axios from 'axios';
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

    const chainID = 168587773;

    const provider = new ethers.JsonRpcProvider('https://rpc.ankr.com/blast_testnet_sepolia/647924a9aa98249697add40f8edd819ae04c3e97ef701d2e425617aff280850f');

    const contractAddress = "0x7f03cB79551BD307675eE06C3775929d81d9f7dD";

    const contract = new ethers.Contract(contractAddress, flipABI.abi, provider);

    const isConnected = Boolean(userAddress);

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
                await locateStage(accounts[0]);
            } catch (error) {
                console.log('Error connecting...');
            }
        } else {
            alert('MetaMask not detected');
        }
    }

    async function locateStage(address: string) {
        // @ts-ignore
        if (window.ethereum) {
            // @ts-ignore
            const provider = new ethers.BrowserProvider(window.ethereum)
            const signer = await provider.getSigner();
            const contract = new ethers.Contract(
                contractAddress,
                flipABI.abi,
                signer
            );
            try {
                await updateLevel(address);
                const sequenceNumber = await contract.sequenceNumbers(address);
                if (Number(sequenceNumber) === 0) {
                    setStage(0);
                }
                else {
                    const request = await contract.requests(sequenceNumber);
                    setAmount(Number(ethers.formatEther(request[1])));
                    setChoice(Number(request[4]));
                    setStage(2);
                }
            } catch (err) {
                setStage(0);
                console.log("error: ", err);
            }
        }
    }

    async function updateLevel(address: string) {
        // @ts-ignore
        if (window.ethereum) {
            // @ts-ignore
            const provider = new ethers.BrowserProvider(window.ethereum)
            const signer = await provider.getSigner();
            const contract = new ethers.Contract(
                contractAddress,
                flipABI.abi,
                signer
            );
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
                const randomNumber = ethers.randomBytes(32);
                const commitment = ethers.keccak256(randomNumber);
                const result = await contract.deposit(randomNumber, commitment, choice, {value: ethers.parseEther(String(amount))});
                if(!muted) playSound('deposit');
                await handleSubscribeDeposit();
                console.log(result);
            } catch (err) {
                setStage(0);
                console.log("error: ", err);
            }
        }
    }

    async function handleSubscribeDeposit() {

        const eventFilter = contract.filters.Deposit(userAddress, null);

        try {
            // @ts-ignore
            document.getElementById("coin").style.animationIterationCount = "infinite";
            // @ts-ignore
            document.getElementById("coin").style.animationTimingFunction = "linear";
            // @ts-ignore
            document.getElementById("coin").style.animationPlayState = "running";

            await contract.on(eventFilter, (event) => {
                console.log('Event data:', event);
                handleFlip();
                contract.off(eventFilter);
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

    async function handleFlip() {
        try {
            // @ts-ignore
            if (window.ethereum) {
                setStage(3);
                // @ts-ignore
                const provider = new ethers.BrowserProvider(window.ethereum);
                const signer = await provider.getSigner();
                const contract = new ethers.Contract(
                    contractAddress,
                    flipABI.abi,
                    signer
                );
                const network = await provider.getNetwork();
                if (Number(network.chainId) !== chainID) {
                    setShowChainAlert(true);
                    setStage(2);
                    return;
                }

                // @ts-ignore
                const delay = ms => new Promise(res => setTimeout(res, ms));
                await delay(6000);

                const sequence = await contract.sequenceNumbers(userAddress);
                const sequenceNumber = Number(sequence);

                let response;
                let success = false;

                const makeApiCall = async () => {
                    while (!success) {
                        try {
                            response = await axios.get('https://fungible-flip-adbb52f6006a.herokuapp.com/api/getRevelation', {
                                params: { sequenceNumber: sequence },
                            });

                            // @ts-ignore
                            if (response && response.data && response.data.value && response.data.value.data) {
                                success = true; // Exit the loop if call is successful
                            } else {
                                await delay(6000);
                            }
                        } catch (error) {
                            console.error('API call failed, retrying...', error);
                            await delay(1000);
                        }
                    }
                };

                await makeApiCall();

                if(!muted) playSound('background');
                // @ts-ignore
                document.getElementById("coin").style.animationIterationCount = 1;
                // @ts-ignore
                document.getElementById("coin").style.animationPlayState = "paused";

                // @ts-ignore
                const entropyCommitment = `0x${response.data.value.data}`;
                const result = await contract.flip(sequenceNumber, entropyCommitment);
                await handleSubscribeFlip();
                await updateLevel(userAddress);
                console.log(result);
            }
        } catch (err) {
            // @ts-ignore
            document.getElementById("coin").style.animationIterationCount = 1;
            // @ts-ignore
            document.getElementById("coin").style.animationPlayState = "paused";
            setStage(2);
            console.log("error: ", err);
        }
    }

    async function handleSubscribeFlip() {

        const eventFilter = contract.filters.Result(userAddress, null, null, null);

        try {
            // @ts-ignore
            document.getElementById("coin").style.animationName = "flipping";
            // @ts-ignore
            document.getElementById("coin").style.animationTimingFunction = "linear";
            // @ts-ignore
            document.getElementById("coin").style.animationIterationCount = "infinite";
            // @ts-ignore
            document.getElementById("coin").style.animationPlayState = "running";

            if(!muted) playSound('flip');

            await contract.on(eventFilter, (event) => {
                console.log('Event data:', event);

                setFlipResult(Number(event.args[2]));

                // @ts-ignore
                document.getElementById("coin").style.animationIterationCount = 1;
                // @ts-ignore
                document.getElementById("coin").style.animationPlayState = "paused";

                setStage(4);

                if (event.args[1] === event.args[2]) {
                    if(!muted) playSound('win');
                } else {
                    if(!muted) playSound('lose');
                }

                contract.off(eventFilter);
            });
        } catch (error) {
            setStage(0);
            console.error('Error subscribing to events:', error);
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
                <Alert message="Please switch to the Blast Sepolia network" type="error" onClose={handleAlertClose} />
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
                                    className={`amount-btn ${amount === 0.025 ? "amount-btn-selected" : ""}`}
                                    onClick={() => {
                                        setAmount(0.025);
                                        setStage(0);
                                    }}
                                >
                                    0.025
                                </button>
                                <button
                                    className={`amount-btn ${amount === 0.05 ? "amount-btn-selected" : ""}`}
                                    onClick={() => {
                                        setAmount(0.05);
                                        setStage(0);
                                    }}
                                >
                                    0.05
                                </button>
                                <button
                                    className={`amount-btn ${amount === 0.1 ? "amount-btn-selected" : ""}`}
                                    onClick={() => {
                                        setAmount(0.1);
                                        setStage(0);
                                    }}
                                >
                                    0.1
                                </button>
                            </div>
                        </div>
                    ) }
                    {isConnected ? (
                        stage === 2 ? (
                            <button className="flip-btn" onClick={handleFlip}> {getTextButton()} </button>
                        ) : (
                            <button className="flip-btn" onClick={stage === 3 ? () => {} : (choice > 1 || amount === 0) ? handleNullInput : handleDeposit}> {getTextButton()} </button>
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