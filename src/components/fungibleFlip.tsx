import React, {useState} from 'react';
import {ethers} from "ethers";
import axios from 'axios';
import flipABI from '../assets/FungibleFlip.json';
import Heads from '../assets/images/heads.png';
import Tails from '../assets/images/tails.png';
import HeadsAnimation from '../assets/images/heads-animation.png';
import TailsAnimation from '../assets/images/tails-animation.png';
import './styles/fungibleFlip.css';

function isMetaMaskInstalled() {
    // @ts-ignore
    return Boolean(window.ethereum && window.ethereum.isMetaMask);
}

const FungibleFlip = () => {

    const [stage, setStage] = useState<number>(0);

    const [flipResult, setFlipResult] = useState<number>(0);

    const [choice, setChoice] = useState<number>(2);

    const [amount, setAmount] = useState<number>(0);

    const [level, setLevel] = useState<number>(0);

    const [experience, setExperience] = useState<number>(0);

    const [userAddress, setUserAddress] = useState<string>("");

    const [leaderboardText, setLeaderboardText] = useState<string>("leaderboard");

    const provider = new ethers.JsonRpcProvider('https://rpc.ankr.com/blast_testnet_sepolia/647924a9aa98249697add40f8edd819ae04c3e97ef701d2e425617aff280850f');

    const contractAddress = "0x85c76C78713690C4563959bfc89c82D1CA5aF7d4";

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

    async function connectWallet() {
        if (isMetaMaskInstalled()) {
            // @ts-ignore
            window.ethereum
                .request({
                    method: 'wallet_switchEthereumChain',
                    params: [{ chainId: '0x168587773' }],
                })
                .then((result: any) => {
                    console.log(result);
                })
                .catch((error: any) => {
                    console.error(error);
                });
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
            const provider = new ethers.BrowserProvider(window.ethereum)
            const signer = await provider.getSigner();
            const contract = new ethers.Contract(
                contractAddress,
                flipABI.abi,
                signer
            );
            try {
                const randomNumber = ethers.randomBytes(32);
                const commitment = ethers.keccak256(randomNumber);
                const result = await contract.deposit(randomNumber, commitment, choice, {value: ethers.parseEther(String(amount))});
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
                setTimeout(() => {
                    setStage(2);
                    // @ts-ignore
                    document.getElementById("coin").style.animationIterationCount = 1;
                    // @ts-ignore
                    document.getElementById("coin").style.animationPlayState = "paused";
                }, 12000);
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
                const sequence = await contract.sequenceNumbers(userAddress);
                const sequenceNumber = Number(sequence);
                const response = await axios.get('https://fungible-flip-aea2a3335ad7.herokuapp.com/api/getRevelation', {
                    params: {
                        sequenceNumber: sequence,
                    },
                });
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

            setTimeout(() => {
                // @ts-ignore
                document.getElementById("coin").style.animationName = "flipping";
                // @ts-ignore
                document.getElementById("coin").style.animationTimingFunction = "linear";
                // @ts-ignore
                document.getElementById("coin").style.animationIterationCount = "infinite";
                // @ts-ignore
                document.getElementById("coin").style.animationPlayState = "running";
            }, 300);

            await contract.on(eventFilter, (event) => {
                console.log('Event data:', event);

                setFlipResult(Number(event.args[2]));

                setStage(4);
                // @ts-ignore
                document.getElementById("coin").style.animationIterationCount = 1;
                // @ts-ignore
                document.getElementById("coin").style.animationPlayState = "paused";

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
                </div>
                <p className="title">FUNGIBLE FLIP</p>
                <div className="level">
                    {userAddress.substring(0, 5) + "..." + userAddress.substring(40, 42)}
                    <div className="levelbar-container">
                        <div className="levelbar">
                            <div className="experience" style={{width: `${(experience / 1000) * 100}%`}}/>
                        </div>
                    </div>
                    Level {level}
                </div>
            </div>
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
                            <button className="flip-btn" onClick={(choice > 1 || amount === 0) ? handleNullInput : handleDeposit}> {getTextButton()} </button>
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