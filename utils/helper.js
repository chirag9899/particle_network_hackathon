import { EvmService, JsonRpcRequest, SerializeTransactionParams, SolanaReqBodyMethod } from '@particle-network/rn-auth';
import BigNumber from 'bignumber.js';
import { TestAccountSolana, TestAccountEVM } from './TestAccount';
import axios from 'axios';

export async function getSolanaTransaction(from) {
    // mock a solana native transaction
    // send some native on solana devnet

    const sender = from;
    const receiver = TestAccountSolana.receiverAddress;
    const amount = 10000000;
    const obj = { sender: sender, receiver: receiver, lamports: amount };
    const rpcUrl = 'https://rpc.particle.network/';
    const pathname = 'solana';
    const chainId = 103;

    const result = await JsonRpcRequest(
        rpcUrl,
        pathname,
        SolanaReqBodyMethod.enhancedSerializeTransaction,
        [SerializeTransactionParams.transferSol, obj],
        chainId
    );

    console.log(result.transaction.serialized);
    return result.transaction.serialized;
}

export async function getSplTokenTransaction(from) {
    // mock a solana spl token transaction
    // send some spl token on solana devnet

    const sender = from;
    const receiver = TestAccountSolana.receiverAddress;
    const amount = parseInt(TestAccountSolana.amount);
    const mint = TestAccountSolana.tokenContractAddress;
    const obj = { sender: sender, receiver: receiver, amount: amount, mint: mint };
    const rpcUrl = 'https://rpc.particle.network/';
    const pathname = 'solana';
    const chainId = 103;

    const result = await JsonRpcRequest(
        rpcUrl,
        pathname,
        SolanaReqBodyMethod.enhancedSerializeTransaction,
        [SerializeTransactionParams.transferToken, obj],
        chainId
    );

    console.log(result.transaction.serialized);
    return result.transaction.serialized;
}

export async function getSepoliaTestnetTransaction(from) {
    try {

        (async () => {
            const response = await axios.post('https://rpc.particle.network/evm-chain', {
                chainId: 11155111,
                jsonrpc: '2.0',
                id: 1,
                method: 'particle_getTokensAndNFTs',
                params: ['0x329a7f8b91Ce7479035cb1B5D62AB41845830Ce8'],
            }, {
                auth: {
                    username: '1eaefe68-dee4-4caa-85d7-5c8c857a0b8e',
                    password: 'ss3JBAnUrc2l0eXtTKtnXXMuCrGH5BJ8f7MOq8Zp',
                }
            });

            console.log(response.data);
        })();
    } catch (error) {
        console.error('Error creating Sepolia transaction:', error);
        throw error; // Re-throw for proper error handling
    }
}


export async function getEthereumTransacion(from, to, amount) {
    // mock a evm native transaction,
    // type is 0x2, should work in Ethereum, Polygon and other blockchains which support EIP1559
    // send 0.01 native
    return await EvmService.createTransaction(from, '0x', amount, to);
}

export async function getEthereumTransacionLegacy(from, to, amount) {
    // mock a evm native transaction,
    // type is 0x0, should work in BSC and other blockchains which don't support EIP1559
    // send 0.01 native

    return await EvmService.createTransaction(from, '0x', amount, to);
}

export async function getEvmTokenTransaction(from, to, amount, contractAddress) {
    // mock a evm token transaction,
    // type is 0x2, should work in Ethereum, Polygon and other blockchains which support EIP1559
    // send 0.01 token
    const data = await EvmService.erc20Transfer(contractAddress, to, amount.toString(10));
    return await EvmService.createTransaction(from, data, BigNumber(0), to);
}

export async function getEvmTokenTransactionLegacy(
    from,
    to,
    amount,
    contractAddress
) {
    // mock a evm token transaction,
    // type is 0x0, should work in BSC and other blockchains which don't support EIP1559
    // send 0.01 token

    const data = await EvmService.erc20Transfer(contractAddress, to, amount.toString(10));
    return await EvmService.createTransaction(from, data, BigNumber(0), to);
}
