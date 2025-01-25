import abiFactory from "../ABI/Factory.json";
import abiToken from "../ABI/Token.json";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { Coins, Plus, Wallet, ArrowRight, RefreshCw } from "lucide-react";
import Starfield from "../components/Starfield";

function Saved() {
  const [state, setState] = useState({
    provider: null,
    signer: null,
    contractFactory: null,
  });
  const [account, setAccount] = useState("None");
  const [tokens, setTokens] = useState([]);
  const [tokenSales, setTokenSales] = useState([]);
  const [form, setForm] = useState({ name: "", symbol: "" });
  const [loading, setLoading] = useState(false);
  const [purchaseAmount, setPurchaseAmount] = useState("1");

  const contractAddressFactory = "0x2512E463CE79Cefe4E885298Cd6BB0b016B3DC2C";
  const contractABIFactory = abiFactory.abi;
  // console.log(contractABIFactory);

  const connectWallet = async () => {
    setLoading(true);
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("MetaMask is not installed. Please install MetaMask to use this DApp.");
        return;
      }

      const accounts = await ethereum.request({ method: "eth_requestAccounts" });
      if (accounts.length === 0) {
        alert("No wallet accounts found. Please connect a wallet.");
        return;
      }

      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const contractFactory = new ethers.Contract(contractAddressFactory, contractABIFactory, signer);

      setAccount(accounts[0]);
      console.log(accounts[0]);
      setState({ provider, signer, contractFactory });

      ethereum.on("accountsChanged", (updatedAccounts) => {
        if (updatedAccounts.length === 0) {
          setAccount("None");
          alert("Wallet disconnected. Please reconnect.");
        } else {
          setAccount(updatedAccounts[0]);
        }
      });

      ethereum.on("chainChanged", () => {
        window.location.reload();
      });
    } catch (error) {
      console.error("Error connecting wallet:", error);
      alert("Failed to connect wallet. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fetchTokens = async () => {
    if (!state.contractFactory) return;
    setLoading(true);

    try {
      const totalTokens = await state.contractFactory.totalTokens();
      const tokensArray = [];
      const salesArray = [];

      for (let i = 0; i < totalTokens; i++) {
        const tokenAddress = await state.contractFactory.tokens(i);
        const sale = await state.contractFactory.getTokenSale(i);
        tokensArray.push(tokenAddress);
        salesArray.push(sale);
      }

      setTokens(tokensArray);
      setTokenSales(salesArray);
    } catch (error) {
      console.error("Error fetching tokens:", error);
    } finally {
      setLoading(false);
    }
  };


  const createToken = async () => {
    if (!state.contractFactory) return;
    setLoading(true);

    try {
      const tx = await state.contractFactory.create(form.name, form.symbol, {
        value: ethers.utils.parseEther("0.1"),
      });

      await tx.wait();
      alert("Token created successfully!");
      fetchTokens();
      setForm({ name: "", symbol: "" });
    } catch (error) {
      console.error("Error creating token:", error);
      alert("Failed to create token. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const buyToken = async (tokenAddress, amount) => {
    if (!state.contractFactory) return;
    setLoading(true);

    try {
      const tokenSale = tokenSales.find((sale) => sale.token === tokenAddress);
      const cost = await state.contractFactory.getCost(tokenSale.sold);
      const totalCost = ethers.BigNumber.from(cost).mul(amount);

      const tx = await state.contractFactory.buy(tokenAddress, amount, {
        value: totalCost,
      });

      await tx.wait();
      alert("Token purchased successfully!");
      fetchTokens();
    } catch (error) {
      console.error("Error buying token:", error);
      alert("Failed to purchase token. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    connectWallet();
  }, []);

  useEffect(() => {
    fetchTokens();
  }, [state.contractFactory]);

  return (
    <div className="min-h-screen to-black text-white pt-0 p-[4rem] relative">
      {/* Starfield as a background */}
      <div className="absolute inset-0 z-0">
        {/* <Starfield /> */}
      </div>

      {/* Main content */}
      <div className="container mx-auto px-6 py-10 z-10 relative">
        <header className="flex justify-between items-center mb-16">
          <div className="flex items-center space-x-3">
            <Coins className="w-10 h-10 text-pink-400" />
            
          </div>
          <div className="flex items-center space-x-6">
            <button
              onClick={fetchTokens}
              className="p-3 rounded-full hover:bg-white/10 transition-colors"
              title="Refresh tokens"
            >
              <RefreshCw className="w-6 h-6" />
            </button>
            {/* <button
              onClick={connectWallet}
              disabled={loading}
              className="flex items-center space-x-3 bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-3 rounded-lg hover:opacity-80 transition-opacity disabled:opacity-50"
            >
              <Wallet className="w-6 h-6" />
              <span>{account === "None" ? "Connect Wallet" : `${account.slice(0, 6)}...${account.slice(-4)}`}</span>
            </button> */}
          </div>
        </header>

        <section>
          <h2 className="text-3xl font-semibold mb-6">Available Tokens</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {tokens.length === 0 ? (
              <p className="col-span-full text-center text-gray-500">No tokens available</p>
            ) : (
              tokens.map((token, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-xl shadow-md border border-gray-700"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold">
                        {tokenSales[index]?.name || "Loading..."}
                      </h3>
                      <p className="text-sm text-gray-400 break-words">{token}</p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded text-sm font-medium ${
                        tokenSales[index]?.isOpen
                          ? "bg-green-600 text-green-100"
                          : "bg-red-600 text-red-100"
                      }`}
                    >
                      {tokenSales[index]?.isOpen ? "Open" : "Closed"}
                    </span>
                  </div>
                  <div className="space-y-2 mb-6">
                    <p className="flex justify-between">
                      <span className="text-gray-400">Sold:</span>
                      <span>{ethers.utils.formatEther(tokenSales[index]?.sold || 0)} Tokens</span>
                    </p>
                    <p className="flex justify-between">
                      <span className="text-gray-400">Raised:</span>
                      <span>{ethers.utils.formatEther(tokenSales[index]?.raised || 0)} ETH</span>
                    </p>
                  </div>
                  <div className="flex space-x-3">
                    <input
                      type="number"
                      value={purchaseAmount}
                      onChange={(e) => setPurchaseAmount(e.target.value)}
                      className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-500"
                      min="1"
                      placeholder="Amount"
                    />
                    <button
                      onClick={() => buyToken(token, purchaseAmount)}
                      disabled={loading || !tokenSales[index]?.isOpen}
                      className="bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-3 rounded-lg hover:opacity-80 transition-opacity disabled:opacity-50"
                    >
                      {loading ? "Buying..." : "Buy"}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

export default Saved;
