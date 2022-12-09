import React, { useState, useEffect, useContext } from "react";
import { ethers } from "ethers";
import { appContext } from "../App";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { providers } from "ethers";
import connectbtn from "../assets2/connect-wallet.png";
import title from "../assets2/title.png";

const Login = () => {

  const [error,setError]=useState("");
  const [saleComplete,setSaleComplete] = useState(false);
  const [loading,setLoading]=useState(true)

  const [login, setLogin, provider, setProvider, accounts, setAccounts, totalMinted, setTotalMinted, contractAddress, contractABI,, isMetamaskAvailable, setIsMetamaskAvailable] =
    useContext(appContext);

  const rpcURL = "https://bsc-dataseed1.binance.org/";

  useEffect(() => {
    getTotalSupply();
    if (isMetamaskAvailable == null) {
      if(window.ethereum!=null){
        setIsMetamaskAvailable(true)
      }
      else{
        setIsMetamaskAvailable(false)
      }
    }
  }, []);

  async function ConnectWallet() {
    if (window.ethereum) {
      var Account = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      var Provider = new ethers.providers.Web3Provider(window.ethereum);
      var signer = Provider.getSigner();
      var chain = (await signer.getChainId());
      console.log(chain);
    }
    else {
      const provider = new WalletConnectProvider({
        rpc:rpcURL
      });
      var Account = await provider.enable();
      var Provider = new providers.Web3Provider(provider);
      var signer = Provider.getSigner();
      var chain = (await signer.getChainId());
      console.log(chain);
    }
      if (Account.length > 0) {
        if(chain==56){
        setLogin(true);
        setAccounts(Account);
        console.log(Provider);
        setProvider(Provider);
        }
        else{
          setError("Please network switch to BSC");
        }
      }
      console.log(chain);
    }

  async function getTotalSupply() {
    const contract = new ethers.Contract(
      contractAddress,
      contractABI,
      new ethers.providers.getDefaultProvider(
        rpcURL
      )
    );
    try {
      const response = (await contract.totalSupply()).toString();
      setTotalMinted(response);
      setLoading(false);
      if(response===500){
        setSaleComplete(true);
      }
      console.log(response);
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div className="Container">
       
      <div className="transparentBox">
        {/* <img className="frame" src={frame}/> */}
        {/* <div className="logoDiv"> */}
          <img className="logoDiv" src={title}/>
        {/* </div> */}
        <div>
          <p style={{marginBottom:"120px",marginTop: "120px"}}> {totalMinted}/500 NFTs Minted!</p>
        </div>
        <div>
          <p style={{marginBottom:"20px"}}>Connect Wallet To Mint!</p>
          </div>
        <div>
        <img src={connectbtn}
          className="buttonConnect"
          onClick={() => {
            if(!saleComplete&&!loading)
              ConnectWallet();
          }}
        />
          {/* {!loading?<>{saleComplete?<>Sale Completed..</>:<>Connect Wallet</>}</>:<>...</>} */}
          </div>
        <p style={{marginRight:"auto",marginLeft:"auto",marginTop:'35px',letterSpacing:"1.5px" ,color:"yellow"}}>{error}</p>
      </div>
    </div>
  );
};

export default Login;

