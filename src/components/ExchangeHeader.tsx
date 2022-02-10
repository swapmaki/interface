import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { useRouter } from 'next/router'
import React, { FC } from 'react'
import Typography from '../components/Typography'
import { Currency, Percent } from '../sdk'
import Settings from './Settings'

const getQuery = (input, output) => {
  if (!input && !output) return

  if (input && !output) {
    return { inputCurrency: input.address || 'ETH' }
  } else if (input && output) {
    return { inputCurrency: input.address, outputCurrency: output.address }
  }
}

interface ExchangeHeaderProps {
  input?: Currency
  output?: Currency
  allowedSlippage?: Percent
}

const ExchangeHeader: FC<ExchangeHeaderProps> = ({ input, output, allowedSlippage }) => {
  const { i18n } = useLingui()
  const router = useRouter()
  const isRemove = router.asPath.startsWith('/exchange/remove')
  const isAdd = router.asPath.startsWith('/exchange/add')

  return (
    <>
      <div className="flex justify-between mb-4 space-x-3 items-center text-bold">
        <div className="flex items-center">
          <Typography component="h1" className="text-bold" variant="base">
            {isAdd ? i18n._(t`Add Liquidity`) : isRemove ? i18n._(t`Remove Liquidity`) : i18n._(t`Swap`)}
          </Typography>
        </div>
        <div className="flex items-center">
          <div className="grid grid-flow-col gap-1">
            <div className="relative w-full h-full rounded hover:bg-dark-800 flex items-center">
              <Settings placeholderSlippage={allowedSlippage} />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default ExchangeHeader
