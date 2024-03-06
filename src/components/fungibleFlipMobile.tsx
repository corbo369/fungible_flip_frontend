import React, {useState} from 'react';
import {ethers} from "ethers";
import { useWatchContractEvent } from 'wagmi'
import { Howl } from 'howler';
import Alert from './alertMobile';
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

    const contractAddress = "0x0";

    const isConnected = Boolean(userAddress);

    const chainID = 81457;

    /*
    const contractInterface = new ethers.Interface(flipABI.abi);

    useWatchContractEvent({
        address: contractAddress,
        abi: flipABI.abi,
        args: [userAddress],
        eventName: 'Deposit',
        onLogs: (logs) => {
            console.log('Deposit event!', logs);
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
            }, 3000);
        },
    });

    useWatchContractEvent({
        address: contractAddress,
        abi: flipABI.abi,
        args: [userAddress],
        eventName: 'Result',
        onLogs: (logs) => {
            console.log('Result event!', logs);
            setTimeout(() => {
                const parsedLog = contractInterface.parseLog(logs[0]);
                // @ts-ignore
                setFlipResult(Number(parsedLog.args[2]));
                // @ts-ignore
                if(parsedLog.args[1] === parsedLog.args[2]) {
                    if (!muted) playSound('win');
                } else {
                    if (!muted) playSound('lose');
                }
                setStage(4);
            }, 6000);
        },
    });

    useWatchContractEvent({
        address: contractAddress,
        abi: flipABI.abi,
        eventName: '',
        onLogs: (logs) => {
            console.log('New logs for event!', logs);
        },
    });
    */

    /*
async function getStats() {
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
            const userStats = await contract.stats(userAddress);

            // Initialize an empty array to hold the decoded flips
            let flips: number[] = [];

            // Convert lastTen to a binary string, ensuring it's 32 characters long for all bits
            let binaryString = BigInt(userStats[0]).toString(2).padStart(32, '0');

            // New logic to ensure we only process actual flips
            let actualFlipsFound = false;

            for (let i = 30; i >= 0; i -= 2) {
                let bits = binaryString.substring(i, i + 2);

                // Determine if the current bits represent an actual flip
                if (bits !== "00" || actualFlipsFound) {
                    actualFlipsFound = true; // Mark that we've found an actual flip
                    switch(bits) {
                        case "00":
                            flips.push(1);
                            break;
                        case "01":
                            flips.push(2);
                            break;
                        case "10":
                            flips.push(3);
                            break;
                        case "11":
                            flips.push(4);
                            break;
                    }
                }
            }

            // Construct the last ten flips string representation
            let lastTenString = "Last Ten Flips:" + flips.map(flip => {
                switch (flip) {
                    case 1: return " Tails/Lost";
                    case 2: return " Tails/Won";
                    case 3: return " Heads/Lost";
                    case 4: return " Heads/Won";
                    default: return "";
                }
            }).join("");

            console.log(lastTenString);
            console.log("User stats for: " + userAddress);
            console.log("Total flips won: " + userStats[1].toString());
            console.log("Total flips lost: " + userStats[2].toString());
            console.log("Total heads chosen: " + userStats[3].toString());
            console.log("Total tails chosen: " + userStats[4].toString());
            if (userStats[5] === 0) {
                console.log("Streak: 0");
            } else if (userStats[5] >= 129) {
                console.log("Streak: win " + (Number(userStats[5]) - 128).toString());
            } else {
                console.log("Streak: lose " + Number(userStats[5]).toString());
            }
        } catch (err) {
            console.log("Error: ", err);
        }
    }
}
*/

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
            setStage(2);
            handleFlip();
        },
    });

    useWatchContractEvent({
        address: contractAddress,
        abi: flipABI.abi,
        args: [userAddress],
        eventName: 'Result',
        onLogs: (logs) => {
            console.log('New logs for Result event!', logs);
            const parsedLog = contractInterface.parseLog(logs[0]);
            // @ts-ignore
            setFlipResult(Number(parsedLog.args[2]));
            // @ts-ignore
            if(parsedLog.args[1] === parsedLog.args[2]) {
                if (!muted) playSound('win');
            } else {
                if (!muted) playSound('lose');
            }
            setStage(4);
        },
    });

    async function connectWallet() {
        if (userAddress === "") {
            setShowChainAlert(true);
            return;
        }
        else {
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

                // Wait for 12 seconds before the first API call
                await delay(12000);

                let response;
                let success = false;

                const sequence = await contract.sequenceNumbers(userAddress);
                const sequenceNumber = Number(sequence);

                // Function to make the API call with retry logic
                const makeApiCall = async () => {
                    while (!success) {
                        try {
                            response = await axios.get('https://fungible-flip-aea2a3335ad7.herokuapp.com/api/getRevelation', {
                                params: { sequenceNumber: sequence },
                            });
                            console.log(response);
                            if (response && response.data && response.data.value && response.data.value.data) {
                                if(!muted) playSound('background');
                                success = true; // Exit the loop if call is successful
                            } else {
                                // Wait for 3 seconds before retrying
                                await delay(3000);
                            }
                        } catch (error) {
                            console.error('API call failed, retrying...', error);
                            // Wait for 3 seconds before retrying
                            await delay(3000);
                        }
                    }
                };

                // Make the API call with retry logic
                await makeApiCall();

                // @ts-ignore
                const entropyCommitment = `0x${response.data.value.data}`;
                const result = await contract.flip(sequenceNumber, entropyCommitment);
                if(!muted) playSound('flip');
                // @ts-ignore
                document.getElementById("coin").style.animationName = "flipping-mobile";
                // @ts-ignore
                document.getElementById("coin").style.animationTimingFunction = "linear";
                // @ts-ignore
                document.getElementById("coin").style.animationIterationCount = "infinite";
                // @ts-ignore
                document.getElementById("coin").style.animationPlayState = "running";
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
                <Alert message="Mobile Support Coming Soon" type="error" onClose={handleAlertClose} />
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
                                    className={`amount-btn-mobile ${amount === 0.015 ? "amount-btn-mobile-selected" : ""}`}
                                    onClick={() => {
                                        setAmount(0.015);
                                        setStage(0);
                                    }}
                                >
                                    0.015
                                </button>
                                <button
                                    className={`amount-btn-mobile ${amount === 0.02 ? "amount-btn-mobile-selected" : ""}`}
                                    onClick={() => {
                                        setAmount(0.02);
                                        setStage(0);
                                    }}
                                >
                                    0.02
                                </button>
                                <button
                                    className={`amount-btn-mobile ${amount === 0.025 ? "amount-btn-mobile-selected" : ""}`}
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
                            <button className="flip-btn-mobile" onClick={handleFlip}> {getTextButton()} </button>
                        ) : (
                            <button className="flip-btn-mobile" onClick={(stage === 1 || stage === 3) ? () => {} : (choice > 1 || amount === 0) ? handleNullInput : handleDeposit}> {getTextButton()} </button>
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