import React, { useState, useContext,useEffect } from "react";
import { ethers } from "ethers";
import { useMoralisWeb3Api } from "react-moralis";
import { appContext } from "../App";
import {SiBinance} from 'react-icons/si'
import title from "../assets2/title.png";
import add from "../assets2/+.png";
import sub from "../assets2/_.png";
import num from "../assets2/+ numeric-button.png";
import nft from "../assets2/question-mark-frame.png";
import mint from "../assets2/mint-button .png";
import mintMore from "../assets2/mint-more.png";

const MintPage = () => {
  const [
    login,
    setLogin,
    provider,
    setProvider,
    accounts,
    setAccounts,
    totalMinted,
    setTotalMinted,
    contractAddress,
    contractABI,
    accountAddress
  ] = useContext(appContext);

  useEffect(() => {
    async function mintCheck(){
      var balance = ethers.utils.formatEther(await provider.getBalance(accounts[0]))
      setBalance(balance)
      if(parseFloat(balance)<0.4){
        setWarning("**Low Balance**")
      }
      else{
        var btn = document.getElementById('mintBTN')
        btn.disabled = false
        btn.innerHTML = 'MINT!'
      }
    }
    if(balance<0){
      mintCheck()
    }
    return () => {
      window.ethereum.removeListener('chainChanged', ()=>{});
      window.ethereum.removeListener('accountsChanged', ()=>{});
      window.ethereum.removeListener('disconnect', ()=>{});
    }
  }, []);

  function quantityClick(bool){
    var amount = mintAmount
    if(bool){
      amount+=1
      setMintAmount(amount)
    }
    else{
      amount-=1
      setMintAmount(amount)
    }
    if(parseFloat(balance)<0.4*(amount)){
      console.log('low')
      setWarning("**Low Balance**")
      var btn = document.getElementById('mintBTN')
      btn.disabled = true
      btn.innerHTML = '...'
    }
    else{
      setWarning('')
      var btn = document.getElementById('mintBTN')
      btn.disabled = false
      btn.innerHTML = 'MINT!'
    }
  }
  

  window.ethereum.on('accountsChanged', () =>{setLogin(false)});
  window.ethereum.on('disconnect', () =>{setLogin(false)});
  window.ethereum.on('chainChanged', () => {setLogin(false)});

  const [showNFTs,setShowNFTs] = useState(false)
  const [mintAmount, setMintAmount] = useState(1);
  const [mintedNFTs,setMintedNFTs] = useState([]) 
  const [loading,setLoading] = useState(false)
  const [message,setMessage] = useState("Loading...")
  const [warning,setWarning] = useState("")
  const url = 'https://santafloki.mypinata.cloud/ipfs'
  const cid = '/QmYTZJgpMdbHuGJbAxSTwnwHbaMr98gU4RNqUdxbH6NnAW/'
  const [balance,setBalance] = useState(-1)

  async function getMintedNFTsImage(mintedID,mintedCount){
    var nftArray = []
    await setTimeout(1000);
    for(var i=mintedID;i<mintedID+mintedCount;i++){
      // const options = {chain: "ropsten", address: contractAddress, token_id:i};
      // console.log(options)
      // const NFT = (await Web3Api.token.getTokenIdMetadata(options))
      nftArray.push(i)
    }
    setShowNFTs(true);
    console.log(nftArray)
    setMintedNFTs(nftArray);
    setLoading(false);
  }

  async function getMintedID() {
    const contract = new ethers.Contract(
      contractAddress,
      contractABI,
      provider
    );
    try {
      const response = parseInt((await contract.totalSupply()).toString())+1;
      return response;
    } catch (err) {
      console.log(err);
    }
  }

  const MintFunction = async () => {
    setLoading(true);
    setMessage("Minting...!");
    var mintedID = await getMintedID()
    const contract = new ethers.Contract(
        contractAddress,
        contractABI,
        provider.getSigner()
    );
    try {
      var value = mintAmount*0.4
      value = ethers.utils.parseEther(value.toString())
      console.log(value.toString())
      const response = await contract.mintBatch(mintAmount,{value:value.toString()});
      const tx = await response.wait()
      if(tx['status']===1){
        setMessage("Minted! Loading NFTs...")
        getMintedNFTsImage(mintedID,mintAmount)
      }
    } 
    catch (err) {
        console.log(err);
        setMessage('Failed!');
        resetLoading();
    }
    
  }

  async function resetLoading(){
    setTimeout(() => {
      setLoading(false)
      setMessage("Loading...");
    }, 2000);
  }

  function resetFromNFTDisplay(){
    setShowNFTs(false);
    setMintedNFTs([]);
  }

  return (
    <>
      <div className="Container">
        <div className="transparentBox">
        <img className="logoDiv" src={title}/>
        <div>
          {/* <p style={{}}>Anniversary Edition</p> */}
          </div>
          <>
          {loading?
          <h1>{message}</h1>
          :
          <>
          {!showNFTs?
          <>
          <div className="gifDiv">
            <img style={{display:"block",marginLeft:"auto",marginRight:"auto"}} src={nft}/>
            <h1 className="nftsGifText">?</h1>
          </div>
          <div className="mintBtnDiv">
            
            <div className="counterbtn">
            <div>
          <img style={{}} src={sub}
            style={{marginLeft:"auto",marginRight:"auto",cursor:"pointer",width:"35px"}}
            onClick={() => {
              {
                mintAmount > 1 ? quantityClick(false) : <></>;
              }
            }}
          />
          </div>

          <div style={{marginLeft:"30px",marginRight:"30px"}}>
          <img style={{width:"45px"}} src={num} />
            <div className="numbering">{mintAmount}</div>
          </div>

            <div>
          <img src={add}
            style={{marginLeft:"auto",marginRight:"auto",cursor:"pointer",width:"35px"}}
            onClick={() => {
              {
                mintAmount < 4 ? quantityClick(true) : <></>;
              }
            }}
          />
          </div>

          </div>

              <p style={{marginTop:"0px"}}>{Math.round((mintAmount*0.4)*10)/10} <SiBinance style={{width:'20px',height:'20px',color:'#F3BA2F'}}/></p>

          <div style={{}}>
            <img src={mint} style={{width:"150px",marginTop:"-10px",marginBottom:"-15px",cursor:"pointer"}} disabled id='mintBTN' onClick={MintFunction}/>
          </div>

          <p style={{}}>0.4 <SiBinance style={{width:'20px',height:'20px',color:'#F3BA2F'}}/> / NFT</p>
          <p id='warning' style={{color:'yellow'}}>{warning}</p>
          </div>
          </>:
          <>
          <div className="nftBox">
            <p className="nftText">NFTs Minted!</p>
            <div className="nftImagesDiv">
              {mintedNFTs.map(element =>{
                return(<img className="nftImage" src={url+cid+element+'.png'}/>);
              })}
                {/* <img className="nftImage" src={nft}/>
                <img className="nftImage" src={nft}/>
                <img className="nftImage" src={nft}/>
                <img className="nftImage" src={nft}/> */}

            </div>
                </div>

              <div>
            <img src={mintMore}
            style={{marginLeft:"auto",marginRight:"auto",cursor:"pointer",width:"200px"}}
                onClick={()=>{
                  resetFromNFTDisplay()
                }}/>
                </div>
            
            </>

          }
          </>
          }
          </>
         </div>
      </div>
    </>
  );
};

export default MintPage;
