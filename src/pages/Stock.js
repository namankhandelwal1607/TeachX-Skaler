import abiFactory from "../ABI/Factory.json";
import abiToken from "../ABI/Token.json";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { Coins, Plus, Wallet, ArrowRight, RefreshCw } from "lucide-react";
import Starfield from "../components/Starfield";

function Stock() {
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
    if (state.contractFactory) fetchTokens();
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
            <Coins className="w-10 h-10 text-[#00FFD1]" />
            
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

        <section className="bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-xl shadow-lg mb-10">
          <div className="flex items-center space-x-3 mb-6">
            <Plus className="w-7 h-7 text-[#00FFD1]" />
            <h2 className="text-3xl font-semibold">Create New Token</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input
              type="text"
              placeholder="Token Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
            <input
              type="text"
              placeholder="Token Symbol"
              value={form.symbol}
              onChange={(e) => setForm({ ...form, symbol: e.target.value })}
              className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
          </div>
          <button
            onClick={createToken}
            disabled={loading || !form.name || !form.symbol}
            className="mt-6 w-full bg-gradient-to-r from-[#00FFD1] via-[#00FFC4] to-[#00FFD1] py-3 rounded-lg hover:opacity-80 transition-opacity disabled:opacity-50 text-lg font-medium"
            >
            {loading ? "Creating..." : "Create Token"}
          </button>
        </section>
      </div>
    </div>
  );
}

export default Stock;
