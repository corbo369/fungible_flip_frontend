import React, {useState} from 'react';
import {ethers} from "ethers";
import { useWatchContractEvent } from 'wagmi'
import { Howl } from 'howler';
import Alert from './alert';
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

const FungibleFlipMobile = () => {

    const [stage, setStage] = useState<number>(0);

    const [flipResult, setFlipResult] = useState<number>(0);

    const [choice, setChoice] = useState<number>(2);

    const [amount, setAmount] = useState<number>(0);

    const [level, setLevel] = useState<number>(0);

    const [experience, setExperience] = useState<number>(0);

    const [userAddress, setUserAddress] = useState<string>("");

    const [leaderboardText, setLeaderboardText] = useState<string>("leaderboard");

    const [muted, setMuted] = useState<boolean>(false);

    const [showChainAlert, setShowChainAlert] = useState(false);

    const contractAddress = "0x7f03cB79551BD307675eE06C3775929d81d9f7dD";

    const isConnected = Boolean(userAddress);

    const chainID = 168587773;

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

    const contractInterface = new ethers.Interface(flipABI.abi);

    useWatchContractEvent({
        address: contractAddress,
        abi: flipABI.abi,
        args: [userAddress],
        eventName: 'Deposit',
        onLogs: (logs) => {
            console.log('New logs!', logs);
            setTimeout(() => {
                setStage(2);
                // @ts-ignore
                document.getElementById("coin").style.animationIterationCount = 1;
                // @ts-ignore
                document.getElementById("coin").style.animationPlayState = "paused";
            }, 12000);
        },
    });

    useWatchContractEvent({
        address: contractAddress,
        abi: flipABI.abi,
        args: [userAddress],
        eventName: 'Result',
        onLogs: (logs) => {
            console.log('New logs for Result event!', logs);
            logs.forEach(log => {
                const parsedLog = contractInterface.parseLog(log);
                console.log("Parsed log:", parsedLog);
                // @ts-ignore
                if (parsedLog.args && parsedLog.args[2] !== undefined) {
                    // @ts-ignore
                    setFlipResult(Number(parsedLog.args[2]));
                    setStage(4);
                }
                // @ts-ignore
                if (Number(parsedLog.args[2]) === choice) {
                    if (!muted) playSound('win');
                } else {
                    if (!muted) playSound('lose');
                }
            });
        },
    });

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
            document.getElementById("coin").style.animationIterationCount = "infinite";
            // @ts-ignore
            document.getElementById("coin").style.animationTimingFunction = "linear";
            // @ts-ignore
            document.getElementById("coin").style.animationPlayState = "running";
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
            if(!muted) playSound('deposit');
            setTimeout(() => {
                if(!muted) playSound('background');
            }, 12000);
            try {
                const randomNumber = ethers.randomBytes(32);
                const commitment = ethers.keccak256(randomNumber);
                const result = await contract.deposit(randomNumber, commitment, choice, {value: ethers.parseEther(String(amount))});
                console.log(result);
            } catch (err) {
                setStage(0);
                console.log("error: ", err);
            }
        }
    }

    async function handleFlip() {
        try {
            // @ts-ignore
            if (window.ethereum) {
                setStage(3);
                // @ts-ignore
                document.getElementById("coin").style.animationName = "flipping-mobile";
                // @ts-ignore
                document.getElementById("coin").style.animationTimingFunction = "linear";
                // @ts-ignore
                document.getElementById("coin").style.animationIterationCount = "infinite";
                // @ts-ignore
                document.getElementById("coin").style.animationPlayState = "running";
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
                if(!muted) playSound('flip');
                const sequence = await contract.sequenceNumbers(userAddress);
                const sequenceNumber = Number(sequence);
                const response = await axios.get('https://fungible-flip-aea2a3335ad7.herokuapp.com/api/getRevelation', {
                    params: {
                        sequenceNumber: sequence,
                    },
                });
                const entropyCommitment = `0x${response.data.value.data}`;
                const result = await contract.flip(sequenceNumber, entropyCommitment);
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

    async function handleFlipResult() {
        // @ts-ignore
        document.getElementById("coin").style.animationPlayState = "paused";
        // @ts-ignore
        document.getElementById("coin").style.animationName = "spinning-mobile";
        // @ts-ignore
        document.getElementById("coin").style.animationTimingFunction = "linear";
        setStage(0);
        await updateLevel(userAddress);
    }

    return (
        <div className="flip">
            {showChainAlert && (
                <Alert message="Please switch to the Blast Sepolia network" type="error" onClose={handleAlertClose} />
            )}
            <p className="title-mobile">FUNGIBLE FLIP</p>
            <div className="middle-container-mobile">
                <a href="https://twitter.com/FungibleFlip" target="_">
                    <button className="social-btn-mobile">
                        <img className="twitter-mobile" src={Twitter} alt="Twitter" />
                    </button>
                </a>
                <button
                    className={`social-btn-mobile ${muted ? "social-btn-mobile-selected" : ""}`}
                    onClick={() => setMuted(!muted)}
                >
                    <img className="mute-img-mobile" src={Mute} alt="Mute"/>
                </button>
                <button
                    className="leaderboard-btn-mobile"
                    onMouseEnter={() => setLeaderboardText("COMING SOON")}
                    onMouseLeave={() => setLeaderboardText("LEADERBOARD")}
                >
                    {leaderboardText}
                </button>
                <div className="level-mobile">
                    <div className="levelbar-container-mobile">
                        <div className="levelbar-mobile">
                            <div className="experience-mobile" style={{width: `${(experience / 1000) * 100}%`}}/>
                        </div>
                    </div>
                    Level {level}
                </div>
            </div>
            {stage === 4 ? (
                <div className="main-mobile">
                    <div className="coin-container-mobile">
                        {(flipResult === 0) ? (
                            <div id="coin" className="coin-result-mobile">
                                <div className="face front">
                                    <img className="front-img" src={TailsAnimation} alt="Tails"/>
                                </div>
                                <div className="face back">
                                    <img className="back-img" src={TailsAnimation} alt="Tails"/>
                                </div>
                            </div>
                        ) : (
                            <div id="coin" className="coin-result-mobile">
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
                        <button className="result-txt-mobile">You chose {getTextResult()} <br/> and doubled up</button>
                    ) : (
                        <button className="result-txt-mobile">You chose {getTextResult()} <br/> and got rugged</button>
                    )}
                    <button className="result-btn-mobile" onClick={handleFlipResult}>FLIP AGAIN</button>
                </div>
            ) : (
                <div className="main-mobile">
                    <div className="coin-container-mobile">
                        <div id="coin" className="coin-animated-mobile">
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
                            <button className="flip-info-mobile">
                                {getTextResult()} <br/> {amount} eth
                            </button>
                        </div>
                    ) : (
                        <div>
                            <div className="choices-mobile">
                                <button
                                    className={`choice-btn-mobile ${choice === 1 ? "choice-btn-mobile-selected" : ""}`}
                                    onClick={handleHeads}
                                >
                                    HEADS
                                </button>
                                <button
                                    className={`choice-btn-mobile ${choice === 0 ? "choice-btn-mobile-selected" : ""}`}
                                    onClick={handleTails}
                                >
                                    TAILS
                                </button>
                            </div>
                            <div className="amounts-mobile">
                                <button
                                    className={`amount-btn-mobile ${amount === 0.0025 ? "amount-btn-mobile-selected" : ""}`}
                                    onClick={() => {
                                        setAmount(0.0025);
                                        setStage(0);
                                    }}
                                >
                                    0.0025
                                </button>
                                <button
                                    className={`amount-btn-mobile ${amount === 0.005 ? "amount-btn-mobile-selected" : ""}`}
                                    onClick={() => {
                                        setAmount(0.005);
                                        setStage(0);
                                    }}
                                >
                                    0.005
                                </button>
                                <button
                                    className={`amount-btn-mobile ${amount === 0.01 ? "amount-btn-mobile-selected" : ""}`}
                                    onClick={() => {
                                        setAmount(0.01);
                                        setStage(0);
                                    }}
                                >
                                    0.01
                                </button>
                            </div>
                            <div className="amounts-mobile">
                                <button
                                    className={`amount-btn-mobile ${amount === 0.025 ? "amount-btn-mobile-selected" : ""}`}
                                    onClick={() => {
                                        setAmount(0.025);
                                        setStage(0);
                                    }}
                                >
                                    0.025
                                </button>
                                <button
                                    className={`amount-btn-mobile ${amount === 0.05 ? "amount-btn-mobile-selected" : ""}`}
                                    onClick={() => {
                                        setAmount(0.05);
                                        setStage(0);
                                    }}
                                >
                                    0.05
                                </button>
                                <button
                                    className={`amount-btn-mobile ${amount === 0.1 ? "amount-btn-mobile-selected" : ""}`}
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
                            <button className="flip-btn-mobile" onClick={handleFlip}> {getTextButton()} </button>
                        ) : (
                            <button className="flip-btn-mobile" onClick={(choice > 1 || amount === 0) ? handleNullInput : handleDeposit}> {getTextButton()} </button>
                        )
                    ) : (
                        <button className="flip-btn-mobile" onClick={connectWallet}> CONNECT WALLET </button>
                    )}
                </div>
            )}
        </div>
    );
}

export default FungibleFlipMobile;