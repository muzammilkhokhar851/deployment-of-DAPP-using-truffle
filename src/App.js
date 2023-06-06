import { useState, useEffect } from "react";
import SimpleStorage from "./contracts/SimpleStorage.json";
import Web3 from "web3";
import "./App.css";

function App() {
  const [state, setState] = useState({web3: null,contract: null });
  const [data, setData] = useState("nill");
  useEffect(() => {
    const provider = new Web3.providers.HttpProvider("HTTP://127.0.0.1:7545");

    async function template() {
      const web3 = new Web3(provider);
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = SimpleStorage.networks[networkId];
      //to intract with a smart contract we require two things
      //1- ABI CODE
      //2- CONTRACT ADDRESS

      
      const contract = new web3.eth.Contract(
        SimpleStorage.abi,
        deployedNetwork.address
      );

      //instance of our smart contract
      console.log(contract);

      setState({ web3: web3, contract: contract });
    }
    provider && template();
  }, []);//template ends here

  useEffect(() => {
    const { contract } = state;
    async function readData() {
      const data = await contract.methods.getter().call();
      //console.log(data);
      setData(data);
    }
    contract && readData();
  }, [state]);

  async function writeData() {
    const { contract } = state;
    const data = document.querySelector("#value").value;
    await contract.methods.setter(data).send({ from: "0xe5D720a60da50E76bCf30680A491B4169e09b484" });
    window.location.reload();
  }

  return (
    <>
      <h1>Welcome to Dapp</h1>
      <div className="App">
        <p className="text">Contract Data : {data}</p>
        <div>
          <input type="text" id="value" required="required"></input>
        </div>

        <button onClick={writeData} className="button button2">
          Change Data
        </button>
      </div>
    </>
  );
}

export default App;