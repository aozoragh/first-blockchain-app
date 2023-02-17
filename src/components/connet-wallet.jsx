import React, { useEffect, useState } from "react";
import * as ethers from 'ethers';

import { contract_address } from '../contract/address'
import { contract_abi } from '../contract/abi'

// import solidity file
// import '../solidity/NameContract'

const Web3 = require("web3");
console.log("url: ", window.ethereum)
const web3 = new Web3(window.ethereum);

const ConnectWallet = () => {

    const [address, setAddress] = useState('');
    const [toAddress, setToAddress] = useState('');
    const [amoutEther, setAmountEther] = useState(0);
    const [contractName, setContractName] = useState();
    const [contractTotalSupply, setContractTotalSupply] = useState();

    const connect = () => {
        if (window.ethereum) {
            window.ethereum.request({ method: 'eth_requestAccounts' }).then(res => {
                console.log("wallet address: ", res)
                setAddress(res[0]);
            })
        }
        else {
            console.log("Please install metamask extension!!!");
        }

        // if (typeof web3 !== "undefined") {
        //     const web3js = new Web3(web3.currentProvider);
        // }
        // else {
        //     console.log("warning for install metamask.");
        // }
    }

    const getBalance = () => {

        // let bal = window.ethereum.getBalance(0x58C70742281819d541CF63cc0aC657372D2A5F06, "latest");
        console.log("bal: ", web3.eth.getBalance("0x58C70742281819d541CF63cc0aC657372D2A5F06", "latest"));
        window.ethereum.request({ method: 'eth_getBalance', params: [address, 'latest'] }).then(balance => {
            // Return string value to convert it into int balance
            console.log("balance: ", balance)

            // Yarn add ethers for using ethers utils or
            // npm install ethers
            console.log("ethers: ", ethers.formatEther(balance))
            // Format the string into main latest balance
        })
    }

    const sendEther = () => {

        const accounts = [address, toAddress]

        const accountInfo = web3.eth.getAccounts();
        console.log(accountInfo);
        console.log(address);
        console.log(123131231, toAddress);
        console.log(amoutEther)

        web3.eth.sendTransaction({ from: accounts[0], to: accounts[1], value: web3.utils.toWei(amoutEther, "ether") })
    }

    const checkNetwork = async (targetNetworkId) => {
        if (window.ethereum) {
            const currentChainId = await window.ethereum.request({
                method: 'eth_chainId',
            });
            console.log(currentChainId)
            console.log(targetNetworkId)
            // return true if network id is the same
            if (currentChainId === targetNetworkId) return true;
            // return false is network id is different
            return false;
        }
    };

    const switchChain = async () => {
        const targetNetworkId = '0x4';
        var checkNetworkValue = undefined;
        await checkNetwork(targetNetworkId).then(res => checkNetworkValue = res)
        if (checkNetworkValue) {
            alert("Same network.");
            return;
        }

        await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{ chainId: targetNetworkId }]
        })

        window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: targetNetworkId }],
        });
        // refresh
        // window.location.reload();
    }

    const getContractInfo = async () => {
        await window.ethereum.enable();
        // ------------------------ get contract name and totalSupply-------------------------------------------------------------------


        const NameContract = new web3.eth.Contract(contract_abi, contract_address);
        const name = NameContract.methods.getName().call();
        console.log(1231223, name)
        // NameContract.methods.totalSupply().call().then(value => setContractTotalSupply(value));
        // NameContract.methods.name().call().then(name => setContractName(name));
        // NameContract.methods.totalSupply().call().then(value => setContractTotalSupply(value));
    }



    useEffect(() => {
        console.log("project started.")


    }, [])

    return (
        <div className="container">
            <h1>Welcome to my first Blockchain Application!</h1>
            <button className="btn" onClick={() => connect()}>Connect Metamask!!!</button>
            <button className="btn" onClick={() => getBalance()}>Get balance!!!</button>

            <div className="get-other-wallet">
                Address: <input type="text" onChange={e => setToAddress(e.target.value)} />
                ethers: <input type="text" onChange={e => setAmountEther(e.target.value)} />
                <button onClick={() => sendEther()}>Send</button>
            </div>

            <div className="switch-chain">
                <button onClick={() => switchChain()}>Switch Chain</button>
            </div>

            <div className="using-func-contract">
                <button onClick={() => getContractInfo()}>Get Contract Info</button>
                Name: <span>{contractName}</span>
                totalSupply: <span>{contractTotalSupply}</span>
            </div>

        </div>
    )
}
export default ConnectWallet;