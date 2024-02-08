import { StatusBar } from 'expo-status-bar';
import {
  ChainInfo,
  Ethereum,
  PolygonMumbai,
  SolanaDevnet,
  EthereumSepolia
} from '@particle-network/chains';

import {
  Env,
  LoginType,
  ParticleInfo,
  SocialLoginPrompt,
  SupportAuthType,
  WalletDisplay
} from '@particle-network/rn-auth';

import {
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';

import {
  AccountInfo,
  CommonError,
  DappMetaData,
  LoginResp,
  ParticleConnectConfig,
  WalletType,
} from '@particle-network/rn-connect';
import BigNumber from 'bignumber.js';

import { getSepoliaTestnetTransaction, getSolanaTransaction, getEthereumTransacion} from './utils/helper';
import { PNAccount } from './PNAccount';
import * as particleConnect from '@particle-network/rn-connect';
import * as particleWallet from '@particle-network/rn-wallet';
import * as particleAuth from '@particle-network/rn-auth';


var state = { currentLoadingBtn: '', currentOptions: [], currentKey: '' };

export async function init() {
  // Get your project id and client from dashboard,
  // https://dashboard.particle.network/

  ParticleInfo.projectId = '1eaefe68-dee4-4caa-85d7-5c8c857a0b8e'; // your project id
  ParticleInfo.clientKey = 'cS25OpXeGhLwjHVVbFzu43DMiu3jLeC7qLbVxHOb'; // your client key

  if (ParticleInfo.projectId == '' || ParticleInfo.clientKey == '') {
    throw new Error(
      'You need set project info, Get your project id and client from dashboard, https://dashboard.particle.network'
    );
  }

  const chainInfo = EthereumSepolia;
  const env = Env.Dev;
  const walletMetaData = {
    walletConnectProjectId: '75ac08814504606fc06126541ace9df6',
    name: 'Particle Connect',
    icon: 'https://connect.particle.network/icons/512.png',
    url: 'https://connect.particle.network',
    description: 'Particle Wallet',
  };
  const dappMetaData = new DappMetaData(
    '75ac08814504606fc06126541ace9df6',
    'Particle Connect',
    'https://connect.particle.network/icons/512.png',
    'https://connect.particle.network',
    'Particle Wallet',
    '',
    ''
  );

  try {
    particleConnect.init(chainInfo, env, dappMetaData);
    particleWallet.initWallet(walletMetaData);
  } catch (error) {
    console.log(error)
  }
}

let pnaccount = null;
export async function connectParticle() {
  const result = await particleConnect.connect(WalletType.Particle);
  console.log(result)
  if (result.status) {
    console.log('connect success');
    const account = result.data;
    pnaccount = new PNAccount(
      account.icons,
      account.name,
      account.publicAddress,
      account.url
    );
    console.log('pnaccount = ', pnaccount);


  } else {

    const error = result.data;
    console.log(error);

  }
};
export async function openWallet() {
  try {
    particleWallet.navigatorWallet(WalletDisplay.Token);
  } catch (error) {
    console.log(error)
  }
}

async function sendTransaction() {
  const amount = "10000000000";
  const transaction = await getEthereumTransacion(pnaccount.publicAddress, "0x8962752Cea41a6fad429372398c947B7F2002085",  BigNumber(amount));  
  console.log(transaction);
  const publicAddress = pnaccount.publicAddress;
  const result = await particleConnect.signAndSendTransaction(WalletType.Particle, publicAddress, transaction);
  if (result.status) {
    const signature = result.data;
    console.log("signAndSendTransaction:", signature);
  } else {
    const error = result.data;
    console.log(error);
  }
}


  const setSepolia = async () => {
    const publicAddress = TestAccountEVM.publicAddress;
    const chainId = 137; // polygon mainnet

    const result = await particleConnect.switchEthereumChain(WalletType.MetaMask, publicAddress, chainId);

    if (result.status) {
        const data = result.data;
        console.log(data);
    } else {
        const error = result.data;
        console.log(error);
    }
}


var data = [
  { key: 'Init', function: init },
  { key: 'Connect particle', function: connectParticle },
  { key: 'Open Wallet', function: openWallet },
]

export default function App() {
  return (
    <SafeAreaView style={styles.container} >
      <FlatList
        data={data}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.buttonStyle}
            onPress={async () => {
              await item.function();
            }}
          >
            <Text style={styles.textStyle}>{item.key}</Text>
          </TouchableOpacity>
        )}
      />

      <TouchableOpacity onPress={setSepolia} style={styles.buttonStyle} >
            <Text>set sepolia</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={sendTransaction} style={styles.buttonStyle} >
            <Text>send amount</Text>
      </TouchableOpacity>
    </SafeAreaView>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginTop: 200,
  },

  content: {
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'flex-start',
    height: '60%',
    marginTop: -200,
  },

  logo: {
    width: 100,
    height: 100,
    marginTop: 0,
  },
  buttonStyle: {
    backgroundColor: 'rgba(78, 116, 289, 1)',
    borderRadius: 3,
    margin: 10,
    height: 30,
    width: 300,
    justifyContent: 'center',
  },

  textStyle: {
    color: 'white',
    textAlign: 'center',
  },
});