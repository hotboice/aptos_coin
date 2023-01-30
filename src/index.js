const {
  AptosAccount,
  HexString,
  AptosClient,
  TxnBuilderTypes,
  BCS,
} = require("aptos");
const client = new AptosClient("https://fullnode.testnet.aptoslabs.com");

(async () => {
  const account = new AptosAccount(
    new HexString(
      "0c75646870ff311c7cf98520c2a795307da617c1303761a593b78025206b6d4b"
    ).toUint8Array()
  );
  const address = account.address().hexString;
  const resource = await client.getAccountResource(
    address,
    "0x1::coin::CoinStore<0x1::aptos_coin::AptosCoin>"
  );
  console.log(`${JSON.stringify(resource["data"]["coin"])}`);

  await jjmm_coin_info();
  await register(
    "0x000000000000000000000000000000000000000000000000000000000000cafe::jjmm::JjmmCoin",
    account
  );
})();

async function jjmm_coin_info() {
  const resource = await client.getAccountResource(
    "0x000000000000000000000000000000000000000000000000000000000000cafe",
    "0x1::coin::CoinInfo<0x000000000000000000000000000000000000000000000000000000000000cafe::jjmm::JjmmCoin>"
  );
  console.log(resource["data"]);
}

async function register(typeArgs, accountFrom) {
  const entryFunctionPayload =
    new TxnBuilderTypes.TransactionPayloadEntryFunction(
      TxnBuilderTypes.EntryFunction.natural(
        `0x1::managed_coin`,
        "register",
        [
          new TxnBuilderTypes.TypeTagStruct(
            TxnBuilderTypes.StructTag.fromString(typeArgs)
          ),
        ],
        []
      )
    );

  const [{ sequence_number: sequenceNumber }, chainId] = await Promise.all([
    client.getAccount(accountFrom.address()),
    client.getChainId(),
  ]);

  const rawTxn = new TxnBuilderTypes.RawTransaction(
    TxnBuilderTypes.AccountAddress.fromHex(accountFrom.address()),
    BigInt(sequenceNumber),
    entryFunctionPayload,
    1000n,
    100n,
    BigInt(Math.floor(Date.now() / 1000) + 10),
    new TxnBuilderTypes.ChainId(chainId)
  );

  const bcsTxn = AptosClient.generateBCSTransaction(accountFrom, rawTxn);
  const pendingTxn = await client.submitSignedBCSTransaction(bcsTxn);
  console.log(pendingTxn.hash);
}
