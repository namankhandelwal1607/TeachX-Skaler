// import React from "react";
// import { NavLink } from "react-router-dom";

// import { useState, useEffect } from "react";
// const Navigation = () => {
//   const [walletAddress, setWalletAddress] = useState(null);

//   const connectWallet = async () => {
//     if (window.ethereum) {
//       try {
//         const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
//         setWalletAddress(accounts[0]);
//       } catch (error) {
//         console.error("User rejected the request.");
//       }
//     } else {
//       alert("MetaMask is not installed. Please install it to use this feature.");
//     }
//   };

//   const disconnectWallet = () => {
//     setWalletAddress(null);
//   };

//   useEffect(() => {
//     if (window.ethereum) {
//       window.ethereum.on('accountsChanged', (accounts) => {
//         if (accounts.length > 0) {
//           setWalletAddress(accounts[0]);
//         } else {
//           setWalletAddress(null);
//         }
//       });
//     }
//   }, []);

//   return (
//     <div className="relative w-full mt-16">
//       <nav className="w-[40%] mx-auto flex justify-around align-middle border border-cyan rounded-lg">
//       <NavLink
//           to="/"
//           end
//           className={({ isActive }) =>
//             `w-full text-base text-center font-nunito m-2.5 ${
//               isActive
//                 ? "bg-cyan text-gray-300"
//                 : "bg-gray-200 text-gray-100 hover:text-cyan active:bg-cyan active:text-gray-300"
//             } border-0 cursor-pointer rounded capitalize font-semibold`
//           }
//         >
//           Home
//         </NavLink>

//         <NavLink
//           to="/stock"
//           className={({ isActive }) =>
//             `w-full text-base text-center font-nunito m-2.5 ${
//               isActive
//                 ? "bg-cyan text-gray-300"
//                 : "bg-gray-200 text-gray-100 hover:text-cyan active:bg-cyan active:text-gray-300"
//             } border-0 cursor-pointer rounded capitalize font-semibold`
//           }
//         >
//           Stock
//         </NavLink>

//         <NavLink
//           to="/crypto"
//           className={({ isActive }) =>
//             `w-full text-base text-center font-nunito m-2.5 ${
//               isActive
//                 ? "bg-cyan text-gray-300"
//                 : "bg-gray-200 text-gray-100 hover:text-cyan active:bg-cyan active:text-gray-300"
//             } border-0 cursor-pointer rounded capitalize font-semibold`
//           }
//         >
//           Crypto
//         </NavLink>

//         <NavLink
//           to="/trending"
//           className={({ isActive }) =>
//             `w-full text-base text-center font-nunito m-2.5 ${
//               isActive
//                 ? "bg-cyan text-gray-300"
//                 : "bg-gray-200 text-gray-100 hover:text-cyan active:bg-cyan active:text-gray-300"
//             } border-0 cursor-pointer rounded capitalize font-semibold`
//           }
//         >
//           Trending
//         </NavLink>

//         <NavLink
//           to="/saved"
//           className={({ isActive }) =>
//             `w-full text-base text-center font-nunito m-2.5 ${
//               isActive
//                 ? "bg-cyan text-gray-300"
//                 : "bg-gray-200 text-gray-100 hover:text-cyan active:bg-cyan active:text-gray-300"
//             } border-0 cursor-pointer rounded capitalize font-semibold`
//           }
//         >
//           Portfolio
//         </NavLink>
//       </nav>

//       <button
//         className="absolute top-[-1rem] right-[1rem] text-black font-semibold py-2 px-4 rounded bg-black hover:bg-gray-800 active:bg-gray-700 transition-colors duration-300 ease-in-out"
//         style={{ backgroundColor: "#14FFEC", transition: "background-color 0.3s" }}
//         onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#0DA79A")}
//         onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#14FFEC")}
//         onClick={walletAddress ? disconnectWallet : connectWallet}
//       >
//         <span> {walletAddress ? "Disconnect" : "Connect Wallet"}</span>
//       </button>
//     </div>
//   );
// };

// export default Navigation;


import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { ChevronDown, Wallet, Globe, Settings } from "lucide-react";

const Navigation = () => {
  const [walletAddress, setWalletAddress] = useState(null);

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setWalletAddress(accounts[0]);
      } catch (error) {
        console.error("User rejected the request.");
      }
    } else {
      alert("MetaMask is not installed. Please install it to use this feature.");
    }
  };

  const disconnectWallet = () => {
    setWalletAddress(null);
  };

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length > 0) {
          setWalletAddress(accounts[0]);
        } else {
          setWalletAddress(null);
        }
      });
    }
  }, []);

  return (
    <nav className="flex items-center justify-between px-4 py-2 bg-[#0F1A1F] border-b border-gray-800 w-full">
      <div className="flex items-center space-x-8">
        {/* Logo */}
        <NavLink to="/" className="flex items-center space-x-2">
          {/* <img
            src="https://cryptologos.cc/logos/hyperliquid-hype-logo.png"
            alt="Logo"
            className="h-8 w-8"
          /> */}
          <span className="text-white font-semibold text-lg">TeachX</span>
        </NavLink>

        {/* Main Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `px-3 py-2 text-sm font-medium transition-colors ${
                isActive ? 'text-[#00FFD1]' : 'text-white hover:text-[#00FFD1]'
              }`
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/stock"
            className={({ isActive }) =>
              `px-3 py-2 text-sm font-medium transition-colors ${
                isActive ? 'text-[#00FFD1]' : 'text-white hover:text-[#00FFD1]'
              }`
            }
          >
            Create
          </NavLink>
          <NavLink
            to="/saved"
            className={({ isActive }) =>
              `px-3 py-2 text-sm font-medium transition-colors ${
                isActive ? 'text-[#00FFD1]' : 'text-white hover:text-[#00FFD1]'
              }`
            }
          >
            Buy
          </NavLink>
          <NavLink
            to="/crypto"
            className={({ isActive }) =>
              `px-3 py-2 text-sm font-medium transition-colors ${
                isActive ? 'text-[#00FFD1]' : 'text-white hover:text-[#00FFD1]'
              }`
            }
          >
            Crypto
          </NavLink>
          <NavLink
            to="/trending"
            className={({ isActive }) =>
              `px-3 py-2 text-sm font-medium transition-colors ${
                isActive ? 'text-[#00FFD1]' : 'text-white hover:text-[#00FFD1]'
              }`
            }
          >
            Trending
          </NavLink>
        </div>
      </div>

      {/* Right Side */}
      <div className="flex items-center space-x-4">
        <button className="p-2 text-white hover:text-[#00FFD1] rounded-full transition-colors">
          <Globe className="w-5 h-5" />
        </button>
        <button className="p-2 text-white hover:text-[#00FFD1] rounded-full transition-colors">
          <Settings className="w-5 h-5" />
        </button>
        <button
          onClick={walletAddress ? disconnectWallet : connectWallet}
          className="flex items-center space-x-2 bg-[#00FFD1] text-[#0D1117] px-4 py-2 rounded-lg hover:bg-[#00E6BC] transition-colors"
        >
          <Wallet className="w-4 h-4" />
          <span className="font-medium">
            {walletAddress
              ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`
              : "Connect"}
          </span>
        </button>
      </div>
    </nav>
  );
};

export default Navigation;