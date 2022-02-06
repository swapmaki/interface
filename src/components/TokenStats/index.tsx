import React, { useContext } from 'react'
import Image from 'next/image'
import { formatNumberScale } from '../../functions/format'
import { useTokenStatsModalToggle } from '../../state/application/hooks'
import { useWeb3React } from '@web3-react/core'
import TokenStatsModal from '../../modals/TokenStatsModal'
import { ChainId } from '../../sdk'
import { PriceContext } from '../../contexts/priceContext'

const supportedTokens = {
  GLMR: {
    name: 'Moonbeam',
    symbol: 'GLMR',
    icon: '/images/tokens/0x9f6Bb7Db6CF4C513B7DA54AE949a6f25A6187C07.png',
  },
  SOLAR: {
    name: 'Solarbeam Token',
    symbol: 'SOLAR',
    icon: '/images/tokens/solar.png',
    address: {
      [ChainId.MOONRIVER]: '0x6bD193Ee6D2104F14F94E2cA6efefae561A4334B',
    },
  },
}

interface TokenStatsProps {
  token: string
}

function TokenStatusInner({ token }) {
  const toggleModal = useTokenStatsModalToggle(token)

  const priceData = useContext(PriceContext)

  let price = 0;
  if (token.symbol.toLowerCase() == 'sdn'){
    price = priceData?.['glmr'];
  }
  if (token.symbol.toLowerCase() == 'sunf'){
    price = priceData?.['solar'];
  }

  return (
    <div className="flex pl-2" onClick={toggleModal}>
      {token.icon && (
        <Image
          src={token['icon']}
          alt={token['symbol']}
          width="24px"
          height="24px"
          objectFit="contain"
          className="rounded-md"
        />
      )}
      <div className="px-3 py-2 text-primary text-bold">
        {formatNumberScale(priceData?.[token.symbol.toLowerCase()], true, 2)}
      </div>
    </div>
  )
}

export default function TokenStats({ token, ...rest }: TokenStatsProps) {
  const selectedToken = supportedTokens[token]

  return (
    <>
      <TokenStatusInner token={selectedToken} />
      <TokenStatsModal token={selectedToken} />
    </>
  )
}
