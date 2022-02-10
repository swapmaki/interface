import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { AbstractConnector } from '@web3-react/abstract-connector'
import { useWeb3React } from '@web3-react/core'
import Image from 'next/image'
import { useRouter } from 'next/router'
import React, { useMemo } from 'react'
import styled from 'styled-components'
import { fortmatic, injected, portis, walletconnect, walletlink } from '../../connectors'
import { BridgeContextName, NetworkContextName } from '../../constants'
import { shortenAddress } from '../../functions/format'
import useENSName from '../../hooks/useENSName'
import WalletModal from '../../modals/WalletModal'
import { useWalletModalToggle } from '../../state/application/hooks'
import { isTransactionRecent, useAllTransactions } from '../../state/transactions/hooks'
import { TransactionDetails } from '../../state/transactions/reducer'
import Loader from '../Loader'
import Web3Connect from '../Web3Connect'

const IconWrapper = styled.div<{ size?: number }>`
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
  justify-content: center;
  & > * {
    height: ${({ size }) => (size ? size + 'px' : '32px')};
    width: ${({ size }) => (size ? size + 'px' : '32px')};
  }
`

// we want the latest one to come first, so return negative if a is after b
function newTransactionsFirst(a: TransactionDetails, b: TransactionDetails) {
  return b.addedTime - a.addedTime
}

const SOCK = (
  <span role="img" aria-label="has socks emoji" style={{ marginTop: -4, marginBottom: -4 }}>
    🧦
  </span>
)

// eslint-disable-next-line react/prop-types
function StatusIcon({ connector }: { connector: AbstractConnector }) {
  if (connector === injected) {
    return <Image src="/images/logo.png" alt="Injected (MetaMask etc...)" width={20} height={20} />
    // return <Identicon />
  } else if (connector === walletconnect) {
    return (
      <IconWrapper size={16}>
        <Image src="/images/wallets/wallet-connect.png" alt={'Wallet Connect'} width="16px" height="16px" />
      </IconWrapper>
    )
  } else if (connector.constructor.name === 'LatticeConnector') {
    return (
      <IconWrapper size={16}>
        <Image src="/images/wallets/lattice.png" alt={'Lattice'} width="16px" height="16px" />
      </IconWrapper>
    )
  } else if (connector === walletlink) {
    return (
      <IconWrapper size={16}>
        <Image src="/images/wallets/coinbase.svg" alt={'Coinbase Wallet'} width="16px" height="16px" />
      </IconWrapper>
    )
  } else if (connector === fortmatic) {
    return (
      <IconWrapper size={16}>
        <Image src="/images/wallets/fortmatic.png" alt={'Fortmatic'} width="16px" height="16px" />
      </IconWrapper>
    )
  } else if (connector === portis) {
    return (
      <IconWrapper size={16}>
        <Image src="/images/wallets/portis.png" alt={'Portis'} width="16px" height="16px" />
      </IconWrapper>
    )
  }
  return null
}

function Web3StatusInner() {
  const { i18n } = useLingui()
  const { account, connector } = useWeb3React()
  const { account: bridgeAccount } = useWeb3React(BridgeContextName)
  const { route } = useRouter()

  const { ENSName } = useENSName(account ?? undefined)

  const allTransactions = useAllTransactions()

  const sortedRecentTransactions = useMemo(() => {
    const txs = Object.values(allTransactions)
    return txs.filter(isTransactionRecent).sort(newTransactionsFirst)
  }, [allTransactions])

  const pending = sortedRecentTransactions
    .filter((tx) => {
      if (tx.receipt) {
        return false
      } else if (tx.archer && tx.archer.deadline * 1000 - Date.now() < 0) {
        return false
      } else {
        return true
      }
    })
    .map((tx) => tx.hash)

  const hasPendingTransactions = !!pending.length

  const toggleWalletModal = useWalletModalToggle()

  if (bridgeAccount && (route == '/bridge' || route == '/bridge/history')) {
    return (
      <div
        id="web3-status-connected"
        className="flex items-center px-3 py-2 text-bold rounded-lg bg-transparent text-sm"
      >
        <div className="mr-2">{shortenAddress(bridgeAccount)}</div>
      </div>
    )
  } else {
    if (account) {
      return (
        <div
          id="web3-status-connected"
          className="flex items-center px-3 py-2 text-bold rounded-lg bg-transparent text-sm"
          onClick={toggleWalletModal}
        >
          {hasPendingTransactions ? (
            <div className="flex items-center justify-between">
              <div className="pr-2">
                {pending?.length} {i18n._(t`Pending`)}
              </div>{' '}
              <Loader stroke="white" />
            </div>
          ) : (
            <div className="mr-2">{ENSName || shortenAddress(account)}</div>
          )}
          {/* {!hasPendingTransactions && connector && <StatusIcon connector={connector} />} */}
        </div>
      )
    } else {
      return (
        <Web3Connect
          style={{ paddingTop: '6px', paddingBottom: '6px' }}
          className="!bg-dark-900 bg-gradient-to-r from-pink/80 hover:from-pink to-purple/80 hover:to-purple text-white h-[38px] text-bold border-2 border-dark-800 hover:border-dark-700"
        />
      )
    }
  }
}

export default function Web3Status() {
  const { active, account } = useWeb3React()
  const contextNetwork = useWeb3React(NetworkContextName)

  const { ENSName } = useENSName(account ?? undefined)

  const allTransactions = useAllTransactions()

  const sortedRecentTransactions = useMemo(() => {
    const txs = Object.values(allTransactions)
    return txs.filter(isTransactionRecent).sort(newTransactionsFirst)
  }, [allTransactions])

  const pending = sortedRecentTransactions.filter((tx) => !tx.receipt).map((tx) => tx.hash)
  const confirmed = sortedRecentTransactions.filter((tx) => tx.receipt).map((tx) => tx.hash)

  if (!contextNetwork.active && !active) {
    return null
  }

  return (
    <>
      <Web3StatusInner />
      <WalletModal ENSName={ENSName ?? undefined} pendingTransactions={pending} confirmedTransactions={confirmed} />
    </>
  )
}
