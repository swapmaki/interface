import { ChainId } from '../sdk'

export type TokenInfo = {
  id: string
  name: string
  symbol: string
  decimals?: number
}

type PairInfo = {
  id: number
  token0: TokenInfo
  token1?: TokenInfo
  name?: string
  symbol?: string
}

type AddressMap = {
  [chainId: number]: {
    [address: string]: PairInfo
  }
}

export const POOLS: AddressMap = {
  [ChainId.MOONBEAM]: {
    '0xd8688C8f1591280E1267C9AEFB586a9BeFE50dA5': {
      id: 0,
      token0: {
        id: '0x8f552a71efe5eefc207bf75485b356a0b3f01ec9',
        name: 'USD Coin',
        symbol: 'USDC',
        decimals: 6,
      },
      token1: {
        id: '0xa649325aa7c5093d12d6f98eb4378deae68ce23f',
        name: 'Binance BUSD',
        symbol: 'BUSD',
        decimals: 18,
      },
      name: 'Solarbeam LP',
      symbol: 'SLP',
    },
  },
}
