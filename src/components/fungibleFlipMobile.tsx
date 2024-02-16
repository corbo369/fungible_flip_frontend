import React, {useState} from 'react';
import {ethers} from "ethers";
import Alert from './alert';
import axios from 'axios';
import flipABI from '../assets/FungibleFlip.json';
import Heads from '../assets/images/heads.png';
import Tails from '../assets/images/tails.png';
import HeadsAnimation from '../assets/images/heads-animation.png';
import TailsAnimation from '../assets/images/tails-animation.png';
import './styles/fungibleFlipMobile.css';

const FungibleFlipMobile = () => {

    const [stage, setStage] = useState<number>(0);

    const [flipResult, setFlipResult] = useState<number>(0);

    const [choice, setChoice] = useState<number>(2);

    const [amount, setAmount] = useState<number>(0);

    const [level, setLevel] = useState<number>(0);

    const [experience, setExperience] = useState<number>(0);

    const [userAddress, setUserAddress] = useState<string>("");

    const [showChainAlert, setShowChainAlert] = useState(false);

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
                const network = await provider.getNetwork();
                if (Number(network.chainId) !== chainID) {
                    setShowChainAlert(true);
                    setStage(2);
                    return;
                }
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
                document.getElementById("coin").style.animationName = "flippingM";
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

                // @ts-ignore
                document.getElementById("coin").style.animationIterationCount = 1;
                // @ts-ignore
                document.getElementById("coin").style.animationPlayState = "paused";

                setStage(4);

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
        document.getElementById("coin").style.animationName = "spinningM";
        // @ts-ignore
        document.getElementById("coin").style.animationTimingFunction = "linear";
        setStage(0);
    }

    return (
        <div className="flip">
            <p className="titleM">FUNGIBLE FLIP</p>
            {showChainAlert && (
                <Alert message="Please switch to the Blast Sepolia network" type="error" onClose={handleAlertClose} />
            )}
            {stage === 4 ? (
                <div className="mainM">
                    <div className="coin-containerM">
                        {(flipResult === 0) ? (
                            <div id="coin" className="coin-resultM">
                                <div className="face front">
                                    <img className="front-img" src={TailsAnimation} alt="Tails"/>
                                </div>
                                <div className="face back">
                                    <img className="back-img" src={TailsAnimation} alt="Tails"/>
                                </div>
                            </div>
                        ) : (
                            <div id="coin" className="coin-resultM">
                                <div className="face front">
                                    <img className="front-img" src={HeadsAnimation} alt="Heads" />
                                </div>
                                <div className="face back">
                                    <img className="back-img" src={HeadsAnimation} alt="Heads" />
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="levelM">
                        <div className="levelbar-containerM">
                            <div className="levelbarM">
                                <div className="experienceM" style={{width: `${(experience / 1000) * 100}%`}}/>
                            </div>
                        </div>
                        Level {level}
                    </div>
                    {(choice === flipResult) ? (
                        <button className="result-txtM">You chose {getTextResult()} <br/> and doubled up</button>
                    ) : (
                        <button className="result-txtM">You chose {getTextResult()} <br/> and got rugged</button>
                    )}
                    <button className="result-btnM" onClick={handleFlipResult}>FLIP AGAIN</button>
                </div>
            ) : (
                <div className="mainM">
                    <div className="coin-containerM">
                        <div id="coin" className="coin-animatedM">
                            <div id="head" className="face front">
                                <img className="front-img" src={Heads} alt="Heads" />
                            </div>
                            <div id="tail" className="face back">
                                <img className="back-img" src={Tails} alt="Tails" />
                            </div>
                        </div>
                    </div>
                    <div className="levelM">
                        <div className="levelbar-containerM">
                            <div className="levelbarM">
                                <div className="experienceM" style={{width: `${(experience / 1000) * 100}%`}}/>
                            </div>
                        </div>
                        Level {level}
                    </div>
                    {(stage === 1 || stage === 2 || stage === 3) ? (
                        <div>
                            <button className="flip-infoM">
                                {getTextResult()} <br/> {amount} eth
                            </button>
                        </div>
                    ) : (
                        <div>
                            <div className="choicesM">
                                <button
                                    className={`choice-btnM ${choice === 1 ? "choice-btn-selectedM" : ""}`}
                                    onClick={handleHeads}
                                >
                                    HEADS
                                </button>
                                <button
                                    className={`choice-btnM ${choice === 0 ? "choice-btn-selectedM" : ""}`}
                                    onClick={handleTails}
                                >
                                    TAILS
                                </button>
                            </div>
                            <div className="amountsM">
                                <button
                                    className={`amount-btnM ${amount === 0.0025 ? "amount-btn-selectedM" : ""}`}
                                    onClick={() => {
                                        setAmount(0.0025);
                                        setStage(0);
                                    }}
                                >
                                    0.0025
                                </button>
                                <button
                                    className={`amount-btnM ${amount === 0.005 ? "amount-btn-selectedM" : ""}`}
                                    onClick={() => {
                                        setAmount(0.005);
                                        setStage(0);
                                    }}
                                >
                                    0.005
                                </button>
                                <button
                                    className={`amount-btnM ${amount === 0.01 ? "amount-btn-selectedM" : ""}`}
                                    onClick={() => {
                                        setAmount(0.01);
                                        setStage(0);
                                    }}
                                >
                                    0.01
                                </button>
                            </div>
                            <div className="amountsM">
                                <button
                                    className={`amount-btnM ${amount === 0.025 ? "amount-btn-selectedM" : ""}`}
                                    onClick={() => {
                                        setAmount(0.025);
                                        setStage(0);
                                    }}
                                >
                                    0.025
                                </button>
                                <button
                                    className={`amount-btnM ${amount === 0.05 ? "amount-btn-selectedM" : ""}`}
                                    onClick={() => {
                                        setAmount(0.05);
                                        setStage(0);
                                    }}
                                >
                                    0.05
                                </button>
                                <button
                                    className={`amount-btnM ${amount === 0.1 ? "amount-btn-selectedM" : ""}`}
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
                            <button className="flip-btnM" onClick={handleFlip}> {getTextButton()} </button>
                        ) : (
                            <button className="flip-btnM" onClick={(choice > 1 || amount === 0) ? handleNullInput : handleDeposit}> {getTextButton()} </button>
                        )
                    ) : (
                        <button className="flip-btnM" onClick={connectWallet}> CONNECT WALLET </button>
                    )}
                </div>
            )}
        </div>
    );
}

export default FungibleFlipMobile;