import { computed, Ref } from 'vue';
import { Tag } from '@aeternity/aepp-sdk';
import type {
  AccountAddress,
  ITokenResolved,
  ITransaction,
  ObjectValues,
  TxFunctionRaw,
  TxType,
} from '@/types';
import {
  includes,
  getTxFunctionLabel,
  getTxTypeLabel,
  getTxTypeListLabel,
  toShiftedBigNumber,
  isAssetCoin,
} from '@/utils';
import { ASSET_TYPES, PROTOCOLS, TX_DIRECTION } from '@/constants';
import { ProtocolAdapterFactory } from '@/lib/ProtocolAdapterFactory';
import {
  AE_TRANSACTION_OWNERSHIP_STATUS,
  TX_RETURN_TYPE_OK,
  TX_FUNCTIONS,
  TX_FUNCTIONS_MULTISIG,
  TX_FUNCTIONS_TYPE_DEX,
} from '@/protocols/aeternity/config';
import {
  aettosToAe,
  getInnerTransaction,
  getOwnershipStatus,
  getTransactionTokenInfoResolver,
  getTxDirection,
  getTxFunctionParsed,
  getTxFunctionRaw,
  getTxOwnerAddress,
  getTxTag,
  isTransactionAex9,
  isTxDex,
} from '@/protocols/aeternity/helpers';
import { useFungibleTokens } from '@/composables/fungibleTokens';
import { useAccounts } from './accounts';
import { useAeSdk } from './aeSdk';

import { useTippingContracts } from './tippingContracts';

interface UseTransactionOptions {
  transaction: Ref<ITransaction | undefined>;
  transactionCustomOwner?: Ref<AccountAddress | undefined>;
  showDetailedAllowanceInfo?: boolean;
  hideFeeFromAssets?: boolean;
}

/**
 * Provide detailed information for the provided transaction based on other app states.
 */
export function useTransactionData({
  transaction,
  transactionCustomOwner,
  showDetailedAllowanceInfo = false,
  hideFeeFromAssets = false,
}: UseTransactionOptions) {
  const { dexContracts } = useAeSdk();
  const { accounts, activeAccount } = useAccounts();
  const { tippingContractAddresses } = useTippingContracts();
  const { getProtocolAvailableTokens, getTxAmountTotal, getTxAssetSymbol } = useFungibleTokens();

  const protocol = computed(() => transaction.value?.protocol || PROTOCOLS.aeternity);
  const outerTx = computed(() => transaction.value?.tx);
  const innerTx = computed(() => outerTx.value ? getInnerTransaction(outerTx.value) : undefined);
  const outerTxTag = computed(() => outerTx.value ? getTxTag(outerTx.value) : null);
  const innerTxTag = computed(() => innerTx.value ? getTxTag(innerTx.value) : null);
  const txType = computed(() => outerTxTag.value ? Tag[outerTxTag.value] as TxType : null);
  const txFunctionParsed = computed(() => getTxFunctionParsed(innerTx.value?.function));
  const txFunctionRaw = computed(() => getTxFunctionRaw(innerTx.value?.function));

  /**
   * Transaction TX type value converted into human readable label
   * displayed on the transaction details page.
   */
  const txTypeLabel = computed((): string => txType.value ? getTxTypeLabel(txType.value) : '');

  /**
   * Transaction TX type value converted into human readable label
   * displayed on the transaction lists.
   */
  const txTypeListLabel = computed((): string => {
    const listTranslation = (txType.value) ? getTxTypeListLabel(txType.value) : '';
    return listTranslation ?? txTypeLabel.value;
  });

  /**
   * Transaction TX function value converted into human readable label
   */
  const txFunctionLabel = computed(
    (): string => (outerTx.value?.function)
      ? getTxFunctionLabel(outerTx.value.function as TxFunctionRaw)
      : '',
  );

  const isTransactionCoin = computed(
    (): boolean => outerTx.value?.contractId ? isAssetCoin(outerTx.value.contractId) : true,
  );

  const isNonTokenContract = computed(
    (): boolean => (
      !getProtocolAvailableTokens(protocol.value)[innerTx.value?.contractId]
      || innerTxTag.value === Tag.ContractCreateTx
    ),
  );

  const isDex = computed((): boolean => isTxDex(innerTx.value, dexContracts.value));

  const isDexAllowance = computed((): boolean => (
    !!innerTx.value
    && includes(TX_FUNCTIONS_TYPE_DEX.allowance, txFunctionRaw.value)
    && !!getProtocolAvailableTokens(PROTOCOLS.aeternity)[innerTx.value.contractId]
  ));

  const isDexLiquidityAdd = computed(
    (): boolean => includes(TX_FUNCTIONS_TYPE_DEX.addLiquidity, txFunctionRaw.value),
  );
  const isDexLiquidityRemove = computed(
    (): boolean => includes(TX_FUNCTIONS_TYPE_DEX.removeLiquidity, txFunctionRaw.value),
  );
  const isDexPool = computed(
    (): boolean => includes(TX_FUNCTIONS_TYPE_DEX.pool, txFunctionRaw.value),
  );
  const isDexSwap = computed(
    (): boolean => includes(TX_FUNCTIONS_TYPE_DEX.swap, txFunctionRaw.value),
  );
  const isDexMaxSpent = computed(
    (): boolean => includes(TX_FUNCTIONS_TYPE_DEX.maxSpent, txFunctionRaw.value),
  );
  const isDexMinReceived = computed(
    (): boolean => includes(TX_FUNCTIONS_TYPE_DEX.minReceived, txFunctionRaw.value),
  );

  const isMultisig = computed((): boolean => (
    !!outerTx.value?.function
    && (
      includes(Object.values(TX_FUNCTIONS_MULTISIG), outerTx.value.function)
      || !!outerTx.value.payerId
    )
  ));

  const isAex9 = computed(
    () => transaction.value && isTransactionAex9(transaction.value),
  );

  const isTip = computed((): boolean => !!(
    innerTx.value?.contractId
    && innerTx.value?.function
    && includes(
      [tippingContractAddresses.value.tippingV1!, tippingContractAddresses.value.tippingV2!],
      innerTx.value.contractId,
    )
    && includes(
      [TX_FUNCTIONS.tip, TX_FUNCTIONS.retip, TX_FUNCTIONS.claim],
      innerTx.value.function,
    )
  ));

  const isErrorTransaction = computed(
    (): boolean => {
      const { returnType } = outerTx.value || {};
      return !!(returnType && returnType !== TX_RETURN_TYPE_OK);
    },
  );

  const txOwnerAddress = computed(() => getTxOwnerAddress(innerTx.value));

  const ownershipStatus = computed(() => getOwnershipStatus(
    activeAccount.value,
    accounts.value,
    innerTx.value,
  ));

  const direction = computed(
    (): ObjectValues<typeof TX_DIRECTION> => (innerTx.value?.function === TX_FUNCTIONS.claim)
      ? TX_DIRECTION.received
      : getTxDirection(
        outerTx.value?.payerId ? outerTx.value : innerTx.value,
        transactionCustomOwner?.value
        || transaction.value?.transactionOwner
        || (
          ownershipStatus.value !== AE_TRANSACTION_OWNERSHIP_STATUS.current
          && txOwnerAddress.value
        )
        || activeAccount.value.address,
      ),
  );

  /**
   * Amount and fee calculated based on the direction.
   */
  const amountTotal = computed(
    (): number => (transaction.value)
      ? getTxAmountTotal(transaction.value, direction.value)
      : 0,
  );

  /**
   * List of assets used within the transaction.
   * Contains more than one item if the transaction is for example a swapping event.
   */
  const transactionAssets = computed((): ITokenResolved[] => {
    if (!transaction.value?.tx) {
      return [];
    }

    const adapter = ProtocolAdapterFactory.getAdapter(protocol.value);
    const protocolTokens = getProtocolAvailableTokens(protocol.value);

    /**
     * Fake token to represent the fee in the transaction.
     * TODO: fee for Ethereum is in ETH and for aeternity it's in aettos. Need to unify this.
     */
    const feeToken: ITokenResolved = {
      ...adapter.getDefaultCoin(),
      amount: (protocol.value === PROTOCOLS.aeternity && outerTx.value?.fee)
        ? aettosToAe(outerTx.value.fee) : outerTx.value?.fee,
      assetType: ASSET_TYPES.coin,
    };

    // TODO move AE specific logic to adapter and store resolved data in the transactions
    if (protocol.value === PROTOCOLS.aeternity) {
      // AE DEX and wrapped AE (WAE)
      if (
        isDex.value
        && txFunctionParsed.value
        && (!isDexAllowance.value || showDetailedAllowanceInfo)
      ) {
        const functionResolver = getTransactionTokenInfoResolver(txFunctionParsed.value);
        if (functionResolver) {
          return functionResolver({ tx: outerTx.value } as ITransaction, protocolTokens)
            .tokens
            .map(({
              amount,
              decimals,
              ...otherAssetData
            }) => ({
              amount: +toShiftedBigNumber(amount!, -decimals!),
              ...otherAssetData,
            }));
        }
      }
    }

    const amount = (isDexAllowance.value)
      ? toShiftedBigNumber(innerTx.value?.fee || 0, -adapter.coinPrecision).toNumber()
      : amountTotal.value;
    const isReceived = direction.value === TX_DIRECTION.received;

    if (
      isTransactionCoin.value
      || isDexAllowance.value
      || isMultisig.value
      || isNonTokenContract.value
    ) {
      return [{
        ...innerTx.value || {},
        ...adapter.getDefaultCoin(),
        amount,
        assetType: ASSET_TYPES.coin,
        isReceived,
      }];
    }

    const token = protocolTokens[outerTx.value!.contractId];

    return [{
      ...innerTx.value || {},
      ...token || {},
      amount,
      assetType: ASSET_TYPES.token,
      contractId: outerTx.value?.contractId,
      isReceived,
      name: token?.name,
      protocol,
      symbol: getTxAssetSymbol(transaction.value),
    }].concat(isReceived || hideFeeFromAssets ? [] : [feeToken]);
  });

  function getOwnershipAddress(externalOwnerAddress?: AccountAddress): AccountAddress {
    const { current, subAccount } = AE_TRANSACTION_OWNERSHIP_STATUS;
    switch (ownershipStatus.value) {
      case current:
        return activeAccount.value.address;
      case subAccount: {
        const { accountId, callerId } = innerTx.value || {};
        return accounts.value
          .find(({ address }) => [accountId, callerId].includes(address))?.address!;
      }
      default: {
        return externalOwnerAddress || txOwnerAddress.value!;
      }
    }
  }

  return {
    amountTotal,
    outerTxTag,
    innerTxTag,
    innerTx,
    txTypeLabel,
    txTypeListLabel,
    txFunctionLabel,
    txFunctionParsed,
    txFunctionRaw,
    isAex9,
    isErrorTransaction,
    isDex,
    isDexAllowance,
    isDexLiquidityAdd,
    isDexLiquidityRemove,
    isDexMaxSpent,
    isDexMinReceived,
    isDexPool,
    isDexSwap,
    isMultisig,
    isTip,
    isTransactionCoin,
    direction,
    transactionAssets,
    getOwnershipAddress,
  };
}
