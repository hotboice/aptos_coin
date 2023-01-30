module xjj::jjmm {
    use std::string;
    use std::signer;
    use aptos_framework::coin;

    const Name: vector<u8> = b"Jjmm Coin";
    const Symbol: vector<u8> = b"JJMM";
    const Decimals: u8 = 8;
    const MonitorSupply: bool = true;
    const TotalSupply: u64 = 15000000000;

    struct JjmmCoin has key {}

    fun init_module(account: &signer) {
        let (burn_cap, freeze_cap, mint_cap) = coin::initialize<JjmmCoin>(account, string::utf8(Name), string::utf8(Symbol), Decimals, MonitorSupply);
        coin::register<JjmmCoin>(account);
        let coins_minted = coin::mint<JjmmCoin>(TotalSupply, &mint_cap);
        coin::deposit(signer::address_of(account), coins_minted);

        coin::destroy_burn_cap<JjmmCoin>(burn_cap);
        coin::destroy_freeze_cap<JjmmCoin>(freeze_cap);
        coin::destroy_mint_cap<JjmmCoin>(mint_cap);
    }
}