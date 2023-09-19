import type { EIP1193Provider } from '@web3-onboard/core';
import injectedModule from '@web3-onboard/injected-wallets';
import ledgerModule from '@web3-onboard/ledger';
import { init, useConnectWallet } from '@web3-onboard/react';
import walletConnectModule from '@web3-onboard/walletconnect';
import { useEffect, useState } from 'react';
import { singletonHook } from 'react-singleton-hook';

import icon from '@/assets/images/near_social_icon.svg';

const networkIcon = `
  <svg width="40" height="40" viewBox="0 0 84 85" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="m41.988 84.436.005-14.237a27.31 27.31 0 0 1-4.295-.34L35.49 83.922c2.142.34 4.328.514 6.5.514h-.002Zm6.498-.509a41.527 41.527 0 0 0 6.345-1.524L50.475 68.86c-1.36.444-2.769.782-4.187 1.005l2.198 14.063ZM29.14 82.395l4.367-13.541a27.161 27.161 0 0 1-3.97-1.656L23.107 79.88a41.235 41.235 0 0 0 6.034 2.515Zm31.722-2.498a41.406 41.406 0 0 0 5.569-3.434l-8.327-11.512a26.89 26.89 0 0 1-3.662 2.258l6.42 12.688ZM17.54 76.44l8.335-11.507a27.942 27.942 0 0 1-3.271-2.816L12.59 72.178l.008.009a41.858 41.858 0 0 0 4.942 4.254Zm53.774-4.168.086-.09a42.367 42.367 0 0 0 4.223-4.96L64.19 58.835a28.205 28.205 0 0 1-2.794 3.285l-.142.146 4.811 4.57 5.25 5.437ZM8.357 67.195l11.44-8.38a27.422 27.422 0 0 1-2.248-3.684L4.942 61.593a41.626 41.626 0 0 0 3.415 5.6v.002Zm70.688-5.574a42.1 42.1 0 0 0 2.502-6.072l-13.46-4.396a27.518 27.518 0 0 1-1.644 3.994l12.602 6.474ZM2.447 55.519l13.462-4.386a27.927 27.927 0 0 1-1.001-4.212L.93 49.137c.338 2.161.849 4.308 1.517 6.385v-.003Zm80.62-6.35c.34-2.156.511-4.356.514-6.538l-14.15-.009c0 1.443-.114 2.898-.339 4.324l13.976 2.222Zm-68.495-6.57c0-1.442.114-2.9.336-4.323L.93 36.059a42.612 42.612 0 0 0-.51 6.538h14.15l.002.003Zm54.526-4.3 13.978-2.209a42.189 42.189 0 0 0-1.512-6.384l-13.465 4.377c.441 1.37.777 2.786.999 4.212v.003ZM15.91 34.065c.44-1.37.995-2.716 1.642-3.997L4.944 23.604a42.07 42.07 0 0 0-2.497 6.071l13.46 4.391h.002Zm50.55-3.978 12.612-6.454a41.748 41.748 0 0 0-3.412-5.602l-11.445 8.374a27.68 27.68 0 0 1 2.244 3.685v-.003Zm-46.658-3.704a27.664 27.664 0 0 1 2.805-3.297l.028-.028L12.63 12.993l-.028.028a42.426 42.426 0 0 0-4.237 4.98l11.437 8.383Zm41.644-3.246 3.021-3.102 6.956-6.995-.022-.023a42.108 42.108 0 0 0-4.922-4.24l-8.34 11.501a27.567 27.567 0 0 1 3.257 2.808l.05.05Zm-35.537-2.89a27.153 27.153 0 0 1 3.662-2.255L23.16 5.303a41.38 41.38 0 0 0-5.568 3.43l8.318 11.515Zm28.57-2.233 6.44-12.676a41.214 41.214 0 0 0-6.032-2.518L50.51 16.36a27.17 27.17 0 0 1 3.97 1.658l-.002-.003Zm-20.934-1.672a27.612 27.612 0 0 1 4.186-1.002L35.542 1.275a41.263 41.263 0 0 0-6.345 1.521l4.348 13.547Zm12.78-.994 2.213-14.063A41.516 41.516 0 0 0 42.04.77l-.014 14.236c1.435 0 2.88.117 4.298.343Z" fill="#fff"/>
    <path d="M41.996 70.828V56.52a13.83 13.83 0 0 1-3.541-.463L34.762 69.88c2.357.628 4.79.948 7.234.948Zm7.233-.948a27.859 27.859 0 0 0 6.757-2.794l-7.16-12.39a13.513 13.513 0 0 1-3.287 1.358l3.69 13.826Zm-21.226-2.797 7.163-12.387a13.844 13.844 0 0 1-2.83-2.177l-.133-.129-4.52 4.758-5.547 5.407.082.078a28.13 28.13 0 0 0 5.788 4.45h-.003Zm33.771-4.444h.003a28.232 28.232 0 0 0 4.444-5.785l-12.385-7.166a13.752 13.752 0 0 1-2.177 2.828L61.774 62.64Zm-44.02-5.816 12.396-7.149a13.478 13.478 0 0 1-1.356-3.288l-13.83 3.678a27.897 27.897 0 0 0 2.79 6.759ZM69.02 50.1a28.2 28.2 0 0 0 .952-7.233l-14.31-.006c0 1.198-.157 2.39-.466 3.544L69.022 50.1Zm-40.687-7.255c0-1.198.157-2.39.469-3.544L14.98 35.6a27.96 27.96 0 0 0-.954 7.233l14.31.014h-.003ZM55.2 39.319l13.827-3.684a27.953 27.953 0 0 0-2.792-6.755l-12.393 7.154a13.509 13.509 0 0 1 1.358 3.285Zm-25.036-3.302a13.746 13.746 0 0 1 2.146-2.794l.037-.037-5.118-5.117-4.922-5.075-.09.087a27.994 27.994 0 0 0-4.435 5.765l12.382 7.171Zm-2.935-7.95.059.058-.06-.059Zm24.438 5.136 5.068-5.067 5.17-4.926-.128-.132a28.1 28.1 0 0 0-5.775-4.441L48.834 31.02a13.77 13.77 0 0 1 2.797 2.146l.036.037Zm-16.492-2.191a13.533 13.533 0 0 1 3.285-1.358l-3.68-13.826a27.866 27.866 0 0 0-6.76 2.792l7.155 12.392Zm10.373-1.352 3.7-13.823a28.085 28.085 0 0 0-7.233-.954l-.008 14.308c1.198 0 2.39.157 3.544.466l-.003.003Z" fill="#fff"/>
  </svg>
`

const networkColor = `#1B706D`

const web3onboardKey = 'web3-onboard:connectedWallets';

const wcV1InitOptions = {
  qrcodeModalOptions: {
    mobileLinks: ['metamask', 'argent', 'trust'],
  },
  connectFirstChainId: true,
};

const walletConnect = walletConnectModule(wcV1InitOptions);
const ledger = ledgerModule();
const injected = injectedModule();

// initialize Onboard
export const onboard = init({
  wallets: [injected, walletConnect, ledger],
  chains: [
    {
      id: 1,
      token: 'ETH',
      label: 'Ethereum Mainnet',
      rpcUrl: 'https://rpc.ankr.com/eth',
    },
    {
      id: 5,
      token: 'ETH',
      label: 'Goerli - Ethereum Testnet',
      rpcUrl: 'https://rpc.ankr.com/eth_goerli',
    },
    {
      id: 5001,
      token: 'MNT',
      label: 'Mantle Testnet',
      rpcUrl: 'https://rpc.testnet.mantle.xyz',
      color: networkColor,
      icon: networkIcon,
    },
    {
      id: 5000,
      token: 'MNT',
      label: 'Mantle',
      rpcUrl: 'https://rpc.mantle.xyz',
      color: networkColor,
      icon: networkIcon,
    },
  ],
  appMetadata: {
    name: 'NEAR',
    icon: icon.src,
    description: 'NEAR - BOS',
  },
  theme: 'dark',
  containerElements: {
    // connectModal: '#near-social-navigation-bar',
    // accountCenter: "#near-social-web3-account",
  },
});

type EthersProviderContext = {
  provider?: EIP1193Provider;
  useConnectWallet: typeof useConnectWallet;
};

const defaultEthersProviderContext: EthersProviderContext = { useConnectWallet };

export const useEthersProviderContext = singletonHook(defaultEthersProviderContext, () => {
  const [{ wallet }] = useConnectWallet();
  const [ethersProvider, setEthersProvider] = useState(defaultEthersProviderContext);

  useEffect(() => {
    (async () => {
      if (typeof localStorage === 'undefined') return;

      const walletsSub = onboard.state.select('wallets');

      // TODO: do we need to unsubscribe?
      // const { unsubscribe } = walletsSub.subscribe((wallets) => {
      walletsSub.subscribe((wallets) => {
        const connectedWallets = wallets.map(({ label }) => label);
        localStorage.setItem(web3onboardKey, JSON.stringify(connectedWallets));
      });

      const previouslyConnectedWallets = JSON.parse(localStorage.getItem(web3onboardKey) || '[]');

      if (previouslyConnectedWallets) {
        // You can also auto connect "silently" and disable all onboard modals to avoid them flashing on page load
        await onboard.connectWallet({
          autoSelect: {
            label: previouslyConnectedWallets[0],
            disableModals: true,
          },
        });
      }
    })();
  }, []);

  useEffect(() => {
    if (!wallet) return;

    setEthersProvider({
      provider: wallet.provider,
      useConnectWallet,
    });
  }, [wallet]);

  return ethersProvider;
});
