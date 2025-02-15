import {
  MODAL_ACCOUNT_CREATE,
  MODAL_ACCOUNT_IMPORT,
  MODAL_ACCOUNT_SELECT_OPTIONS,
  MODAL_ASSET_SELECTOR,
  MODAL_CLAIM_GIFT_CARD,
  MODAL_CLAIM_SUCCESS,
  MODAL_CONFIRM,
  MODAL_CONFIRM_ACCOUNT_LIST,
  MODAL_CONFIRM_CONNECT,
  MODAL_CONFIRM_RAW_SIGN,
  MODAL_CONFIRM_UNSAFE_SIGN,
  MODAL_CONFIRM_TRANSACTION_SIGN,
  MODAL_CONSENSUS_INFO,
  MODAL_DEFAULT,
  MODAL_ERROR_LOG,
  MODAL_FORM_SELECT_OPTIONS,
  MODAL_HELP,
  MODAL_MESSAGE_SIGN,
  MODAL_MULTISIG_PROPOSAL_CONFIRM_ACTION,
  MODAL_MULTISIG_VAULT_CREATE,
  MODAL_NETWORK_SWITCHER,
  MODAL_PAYLOAD_FORM,
  MODAL_PRIVATE_KEY_EXPORT,
  MODAL_PRIVATE_KEY_IMPORT,
  MODAL_PROTOCOL_SELECT,
  MODAL_SCAN_QR,
  MODAL_RECIPIENT_HELPER,
  MODAL_RECIPIENT_INFO,
  MODAL_RESET_WALLET,
  MODAL_TRANSFER_RECEIVE,
  MODAL_TRANSFER_SEND,
  MODAL_DAPP_BROWSER_ACTIONS,
  MODAL_WALLET_CONNECT,
  MODAL_WARNING_DAPP_BROWSER,
  MODAL_BIOMETRIC_LOGIN,
  MODAL_ENABLE_BIOMETRIC_LOGIN,
  MODAL_AIR_GAP_IMPORT_ACCOUNTS,
  MODAL_SIGN_AIR_GAP_TRANSACTION,
  MODAL_ADDRESS_BOOK_IMPORT,
  MODAL_SHARE_ADDRESS,
  MODAL_ADDRESS_BOOK_ACCOUNT_SELECTOR,
  MODAL_SET_PASSWORD,
  MODAL_PASSWORD_LOGIN,
  MODAL_PERMISSION_MANAGER,
  PROTOCOL_VIEW_TRANSFER_RECEIVE,
  PROTOCOL_VIEW_TRANSFER_SEND,
} from '@/constants';
import { useModals } from '@/composables';

import NetworkSwitcherModal from '@/popup/components/Modals/NetworkSwitcherModal.vue';

import AccountCreate from '../components/Modals/AccountCreate.vue';
import Default from '../components/Modals/Default.vue';
import ProtocolSpecificView from '../components/ProtocolSpecificView.vue';
import ProtocolSelect from '../components/Modals/ProtocolSelect.vue';
import AccountImport from '../components/Modals/AccountImport.vue';
import AccountSelectOptions from '../components/Modals/AccountSelectOptions.vue';
import ClaimSuccess from '../components/Modals/ClaimSuccess.vue';
import Confirm from '../components/Modals/Confirm.vue';
import ConfirmConnect from '../pages/Popups/Connect.vue';
import ConfirmAccountList from '../pages/Popups/AccountList.vue';

import ErrorLog from '../components/Modals/ErrorLog.vue';
import PrivateKeyExport from '../components/Modals/PrivateKeyExport.vue';
import FormSelectOptions from '../components/Modals/FormSelectOptions.vue';
import ConfirmTransactionSign from '../components/Modals/ConfirmTransactionSign.vue';
import ConfirmRawSign from '../components/Modals/ConfirmRawSign.vue';
import ConfirmUnsafeSign from '../components/Modals/ConfirmUnsafeSign.vue';
import QrCodeScanner from '../components/Modals/QrCodeScanner.vue';
import Help from '../components/Modals/Help.vue';
import AssetSelector from '../components/Modals/AssetSelector.vue';
import ResetWallet from '../components/Modals/ResetWalletModal.vue';
import RecipientHelper from '../components/Modals/RecipientHelper.vue';
import RecipientInfo from '../components/Modals/RecipientInfo.vue';
import ConsensusInfo from '../components/Modals/ConsensusInfo.vue';
import PayloadForm from '../components/Modals/PayloadForm.vue';
import ClaimGiftCard from '../components/Modals/ClaimGiftCard.vue';
import MultisigVaultCreate from '../components/Modals/MultisigVaultCreate.vue';
import WarningDappBrowser from '../components/Modals/WarningDappBrowser.vue';
import MultisigProposalConfirmActions from '../components/Modals/MultisigProposalConfirmActions.vue';
import MessageSign from '../pages/Popups/MessageSign.vue';
import BrowserActions from '../components/Modals/BrowserActions.vue';
import BiometricLogin from '../components/Modals/BiometricLogin.vue';
import EnableBiometricLogin from '../components/Modals/EnableBiometricLogin.vue';
import WalletConnect from '../components/Modals/WalletConnectModal.vue';
import AirGapImportAccounts from '../components/Modals/AirGapImportAccounts.vue';
import SignAirGapTransaction from '../components/Modals/SignAirGapTransaction.vue';
import AddressBookImport from '../components/Modals/AddressBookImport.vue';
import ShareAddress from '../components/ShareAddress.vue';
import AddressBookAccountSelector from '../components/Modals/AddressBookAccountSelector.vue';
import SetPassword from '../components/Modals/SetPassword.vue';
import PasswordLogin from '../components/Modals/PasswordLogin.vue';
import PrivateKeyImport from '../components/Modals/PrivateKeyImport.vue';
import PermissionManager from '../components/Modals/PermissionManager.vue';

export default () => {
  const { registerModal } = useModals();

  registerModal(MODAL_DEFAULT, {
    component: Default,
  });
  registerModal(MODAL_ACCOUNT_CREATE, {
    component: AccountCreate,
  });
  registerModal(MODAL_ACCOUNT_IMPORT, {
    component: AccountImport,
  });
  registerModal(MODAL_PRIVATE_KEY_IMPORT, {
    component: PrivateKeyImport,
  });
  registerModal(MODAL_AIR_GAP_IMPORT_ACCOUNTS, {
    component: AirGapImportAccounts,
  });
  registerModal(MODAL_CLAIM_SUCCESS, {
    component: ClaimSuccess,
  });
  registerModal(MODAL_CONFIRM, {
    component: Confirm,
  });
  registerModal(MODAL_ERROR_LOG, {
    component: ErrorLog,
  });
  registerModal(MODAL_FORM_SELECT_OPTIONS, {
    component: FormSelectOptions,
  });
  registerModal(MODAL_ACCOUNT_SELECT_OPTIONS, {
    component: AccountSelectOptions,
  });
  registerModal(MODAL_HELP, {
    component: Help,
  });
  registerModal(MODAL_CLAIM_GIFT_CARD, {
    component: ClaimGiftCard,
    showInPopupIfWebFrame: true,
  });
  registerModal(MODAL_CONFIRM_TRANSACTION_SIGN, {
    component: ConfirmTransactionSign,
    showInPopupIfWebFrame: true,
  });
  registerModal(MODAL_CONFIRM_RAW_SIGN, {
    component: ConfirmRawSign,
    showInPopupIfWebFrame: true,
  });
  registerModal(MODAL_CONFIRM_UNSAFE_SIGN, {
    component: ConfirmUnsafeSign,
    showInPopupIfWebFrame: true,
  });
  registerModal(MODAL_CONFIRM_CONNECT, {
    component: ConfirmConnect,
    showInPopupIfWebFrame: true,
  });
  registerModal(MODAL_CONFIRM_ACCOUNT_LIST, {
    component: ConfirmAccountList,
    showInPopupIfWebFrame: true,
  });
  registerModal(MODAL_PRIVATE_KEY_EXPORT, {
    component: PrivateKeyExport,
  });
  registerModal(MODAL_MESSAGE_SIGN, {
    component: MessageSign,
    showInPopupIfWebFrame: true,
  });
  registerModal(MODAL_SCAN_QR, {
    component: QrCodeScanner,
  });
  registerModal(MODAL_PROTOCOL_SELECT, {
    component: ProtocolSelect,
  });
  registerModal(MODAL_PERMISSION_MANAGER, {
    component: PermissionManager,
  });
  registerModal(MODAL_TRANSFER_RECEIVE, {
    component: ProtocolSpecificView,
    viewComponentName: PROTOCOL_VIEW_TRANSFER_RECEIVE,
  });
  registerModal(MODAL_TRANSFER_SEND, {
    component: ProtocolSpecificView,
    viewComponentName: PROTOCOL_VIEW_TRANSFER_SEND,
  });
  registerModal(MODAL_ASSET_SELECTOR, {
    component: AssetSelector,
  });
  registerModal(MODAL_RESET_WALLET, {
    component: ResetWallet,
  });
  registerModal(MODAL_RECIPIENT_HELPER, {
    component: RecipientHelper,
  });
  registerModal(MODAL_RECIPIENT_INFO, {
    component: RecipientInfo,
  });
  registerModal(MODAL_CONSENSUS_INFO, {
    component: ConsensusInfo,
  });
  registerModal(MODAL_PAYLOAD_FORM, {
    component: PayloadForm,
  });
  registerModal(MODAL_MULTISIG_VAULT_CREATE, {
    component: MultisigVaultCreate,
  });
  registerModal(MODAL_MULTISIG_PROPOSAL_CONFIRM_ACTION, {
    component: MultisigProposalConfirmActions,
  });
  registerModal(MODAL_NETWORK_SWITCHER, {
    component: NetworkSwitcherModal,
  });
  registerModal(MODAL_DAPP_BROWSER_ACTIONS, {
    component: BrowserActions,
  });
  registerModal(MODAL_WALLET_CONNECT, {
    component: WalletConnect,
  });
  registerModal(MODAL_WARNING_DAPP_BROWSER, {
    component: WarningDappBrowser,
  });
  registerModal(MODAL_BIOMETRIC_LOGIN, {
    component: BiometricLogin,
  });
  registerModal(MODAL_ENABLE_BIOMETRIC_LOGIN, {
    component: EnableBiometricLogin,
  });
  registerModal(MODAL_SIGN_AIR_GAP_TRANSACTION, {
    component: SignAirGapTransaction,
  });
  registerModal(MODAL_ADDRESS_BOOK_IMPORT, {
    component: AddressBookImport,
  });
  registerModal(MODAL_SHARE_ADDRESS, {
    component: ShareAddress,
  });
  registerModal(MODAL_ADDRESS_BOOK_ACCOUNT_SELECTOR, {
    component: AddressBookAccountSelector,
  });
  registerModal(MODAL_SET_PASSWORD, {
    component: SetPassword,
  });
  registerModal(MODAL_PASSWORD_LOGIN, {
    component: PasswordLogin,
  });
};
