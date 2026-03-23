#![no_std]
use soroban_sdk::{contract, contractimpl, vec, Env, String, Vec};

/// The primary `hello-world` smart contract structure.
/// This contract serves as a basic example of interacting with the Soroban environment,
/// demonstrating how to receive arguments and return customized data structures.
#[contract]
pub struct Contract;

// This is a sample contract. Replace this placeholder with your own contract logic.
// A corresponding test example is available in `test.rs`.
//
// For comprehensive examples, visit <https://github.com/stellar/soroban-examples>.
// The repository includes use cases for the Stellar ecosystem, such as data storage on
// the blockchain, token swaps, liquidity pools, and more.
//
// Refer to the official documentation:
// <https://developers.stellar.org/docs/build/smart-contracts/overview>.
#[contractimpl]
impl Contract {
    /// Returns a greeting vector containing the environment string "Hello" and the provided `to` string.
    ///
    /// This function demonstrates basic parameter passing and vector instantiation in Soroban.
    /// It pairs a hardcoded "Hello" string prefix with the user-supplied string argument to
    /// construct a personalized greeting.
    ///
    /// # Arguments
    ///
    /// * `env` - The active Soroban environment state, required for allocating and returning on-chain types.
    /// * `to` - The recipient string to be greeted.
    ///
    /// # Returns
    ///
    /// A `Vec<String>` containing exactly two elements: the string "Hello", and the provided `to` string.
    pub fn hello(env: Env, to: String) -> Vec<String> {
        vec![&env, String::from_str(&env, "Hello"), to]
    }
}

mod test;
