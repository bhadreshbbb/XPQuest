import React, { Component } from 'react';
// import logo from '../logo.png';
import HeaderNFT from './HeaderNFT'

import './App.css';
import Web3 from 'web3';
import { Spinner } from 'reactstrap';
import { Image } from 'react-bootstrap'
import ChainlinkLogo from '../assets/chainlink.png'

import TropyChar from '../abis/TrophyChar.json'
import DungeonToken from '../abis/DungeonToken.json'

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isRewarded: false,
      isMinting: false,
      isLoggedIn: false,
      // items: [], 
      account: '',
      contract: null,
      usersNftCount: 0,
      trophies: [],
      loading: true
    };
    this.loadWeb3();
    this.loadBlockchainData();
  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert("Non ethereum browser detected. You should consider trying Metamask")
    }
  }

  async loadBlockchainData() {
    const web3 = window.web3
    const accounts = await web3.eth.getAccounts()
    this.setState({ account: accounts[0] })

    // const networkId = await web3.eth.net.getId()
    const networkData = TropyChar.networks[4]
    if (networkData) {
      const abi = TropyChar.abi;
      const address = networkData.address
      const contract = new web3.eth.Contract(abi, address)
      const contract2 = new web3.eth.Contract(DungeonToken.abi, DungeonToken.networks[4].address)
      //console.log(this.state.account)
      this.setState({ contract })
      this.setState({ contract2 })


      const usersNftCount = await contract.methods.usersNftCount(this.state.account).call()

      this.setState({ usersNftCount: Number(usersNftCount.toString()) })

      console.log(usersNftCount.toString());

      for (var i = 1; i <= this.state.usersNftCount; i++) {
        const trophy = await contract.methods.usersNft(this.state.account, i).call()
        //console.log(trophy);
        this.setState({
          trophies: [...this.state.trophies, trophy]
        })
      }

      //console.log('users trophies', this.state.usersNftCount, this.state.trophies)
    } else {
      window.alert('Smart contract not deployed to the detected network')
    }
  }

//   function loadBlockchainData = () => {
//     const web3 = window.web3
//     const networkId = web3.eth.net.getId()
//     const networkData = DungeonToken.networks[80001]

//     if (networkData) {
//         const abi = []
//         const address = networkData.address
//         contract = new web3.eth.Contract(DungeonToken.abi, address)

//     } else {
//         window.alert('Smart contract not deployed to the detected network')
//     }
// }


  render() {
    const isLoggedIn = this.state.isLoggedIn
    const isMinting = this.state.isMinting

    const isRewarded = this.state.isRewarded
    return (
      <div className="screen">
        
        <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
          <a
            className="navbar-brand col-sm-3 col-md-2 mr-0 text-header"
            href=""
            target="_blank"
            rel="noopener noreferrer"
          >
            Quest For Polygon
          </a>
          <ul className='navbar-nav px-3'>
            <li className="nav-item text-nowrap d-none d-sm-none d-sm-block">
              <small className='text-white'><span id='account' className='text-header1'>{this.state.account}</span></small>
            </li>
          </ul>
        </nav>
        
        <div className='nft-sec container-fluid mt-5'>
          <HeaderNFT />
          <div className='row'>
            <main role='main' className='col-lg-12 d-flex text-center'>
              <div className="trophy-section-header">
                <h5 className="trophy-title"><span>  </span>Your Trophy Cabinet <span> </span></h5>
                {/* <h5 className="text col-md-6 col-sm">Your Trophy Cabinet</h5> </div> */}
                {
                  // this.state.loading ? (
                  // <Spinner className='spinner' color="info" />
                  // <Spinner color="info" />
                  // ):
                }

              </div>
            </main>
          </div>
          <hr /><hr />

          <div className="dungeon trophy-cabinet row text-center">

            {/* <div className='row trophy-cabine'> */}
            {this.state.trophies.map((trophy, key) => {
              //console.log(trophy, key);
              let levelPass = trophy.levelPass.toString()
              let name = trophy.name.toString()
              let tokenId = trophy.tokenId.toString()
              let rarity = trophy.rarity.toString()
              let worth = trophy.worth.toString()

              const nftMint = ["https://ipfs.io/ipfs/QmPbBTESpMSsGjKisM73deE3PLqA76s2zh1nHhvAkAfYf4?filename=btc.png", "https://ipfs.io/ipfs/Qmb3jBv3xdDettAQokTxQc5T4G1buxY9oxRiSA9YepeRrP?filename=crystal.png", "https://ipfs.io/ipfs/QmZg13ohhyY9xBYnhF1XbAm8qjW43SjxDXsXTyTGFkezWX?filename=chest.png", "https://ipfs.io/ipfs/QmNyZd4czMAY8rxYjGK6b8SR69m2W9FHbkVsnCJstewkXY?filename=god.png", "https://ipfs.io/ipfs/QmXHYB8eEpEQjZq6Hc9vCHdPGwpHPjZfoRYQNwqNZVsKQ8?filename=diamond.png"]
              const random = Math.floor(Math.random() * nftMint.length);
              console.log(random, nftMint[random]);
              console.log(levelPass, name, tokenId, rarity, worth);
              return (
                <div key={key} className='gift'>
                  <div className="giftBox">
                    <Image src={nftMint[random]} roundedCircle style={{ height: 100, width: 100, alignSelf: 'center', justifyContent: 'center' }} />
                  </div>
                  <span className="trophy-info">Level: <span className="values">{levelPass}</span></span><br />
                  <span className="trophy-info">tokenID: <span className="values">{tokenId}</span></span><br />
                  <span className="trophy-info">Rarity: <span className="values">{rarity}</span></span><br />
                </div>
              )
            })}


            {/* </div> */}
          </div>
        </div >
      </div >
    );
  }
}
export default App
