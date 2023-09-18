import { computed } from 'vue';
import { camelCase } from 'lodash-es';
import type {
  IDefaultComposableOptions,
  ITokenList,
  ITokenResolved,
  ITransaction,
  TxFunctionParsed,
} from '@/types';
import { PROTOCOL_BITCOIN, TX_DIRECTION } from '@/constants';
import { toShiftedBigNumber } from '@/utils';
import {
  AE_COIN_PRECISION,
  AE_SYMBOL,
} from '@/protocols/aeternity/config';
import {
  getInnerTransaction,
  getTransactionTokenInfoResolver,
  isTransactionAex9,
} from '@/protocols/aeternity/helpers';
import { BTC_SYMBOL } from '@/protocols/bitcoin/config';
import { getTxAmountTotal as getBitcoinTxAmountTotal } from '@/protocols/bitcoin/helpers';

interface UseTransactionTokensOptions extends IDefaultComposableOptions {
  transaction: ITransaction
  direction: string
  isAllowance: boolean
  showDetailedAllowanceInfo?: boolean
}

export function useTransactionTokens({
  store,
  direction,
  isAllowance,
  transaction,
  showDetailedAllowanceInfo = false,
}: UseTransactionTokensOptions) {
  const getTxSymbol = computed(() => store.getters.getTxSymbol);
  const getTxAmountTotal = computed(() => store.getters.getTxAmountTotal);
  const innerTx = computed(() => getInnerTransaction(transaction.tx));

  const availableTokens = computed<ITokenList>(
    () => (store.state as any).fungibleTokens.availableTokens,
  );

  const transactionFunction = computed(() => {
    if (innerTx.value?.function) {
      const functionName = camelCase(innerTx.value?.function) as TxFunctionParsed;

      // TODO this line needs refactoring in TransactionResolver
      return getTransactionTokenInfoResolver(functionName);
    }
    return null;
  });

  const tokens = computed((): ITokenResolved[] => {
    if (!transaction) {
      return [];
    }
    if (
      innerTx.value
      && transactionFunction.value
      && (!isAllowance || showDetailedAllowanceInfo)
    ) {
      return transactionFunction.value(
        transaction,
        availableTokens.value,
      ).tokens.map(({ amount, decimals, ...otherToken }) => ({
        amount: +toShiftedBigNumber(amount!, -decimals!),
        ...otherToken,
      }));
    }
    if (transaction.protocol === PROTOCOL_BITCOIN) {
      return [{
        ...innerTx.value || {},
        amount: getBitcoinTxAmountTotal(transaction, direction === TX_DIRECTION.received),
        symbol: BTC_SYMBOL,
        isReceived: direction === TX_DIRECTION.received,
      }];
    }

    return [{
      ...innerTx.value || {},
      amount: isAllowance
        ? toShiftedBigNumber(innerTx.value?.fee || 0, -AE_COIN_PRECISION)
        : getTxAmountTotal.value(transaction, direction),
      symbol: isAllowance ? AE_SYMBOL : getTxSymbol.value(transaction),
      isReceived: direction === TX_DIRECTION.received,
      isAe:
        isAllowance
        || (
          getTxSymbol.value(transaction) === AE_SYMBOL
          && !isTransactionAex9(transaction)
        ),
    }];
  });

  return {
    tokens,
  };
}
