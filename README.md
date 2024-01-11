# library

Welcome to your decentralized Library system. It is a fun way to keep track of library cards and books borrowed. List your books when you create a book, issue cards with unique IDs, and allow users to borrow and return books while keeping track of the unique card IDs.

## Methods

- createBook: Creates an instance of a book in the library system
- issueBook: issues a book to a specific caard number
- issueCard: issus card to a user
- listActiveCards: lists all active cards in the system
- listBooks: list all books in the system
- listBorrowedBooks: lists all books borrowed by a specific card owner
- listReturnedBooks: list all books returned by a specific card owner
- returnBook: return a borrowed book
- revokeCard: make a card inactive


## Installation

You can always refer to [The Azle Book](https://demergent-labs.github.io/azle/) for more in-depth documentation.

`dfx` is the tool you will use to interact with the IC locally and on mainnet. If you don't already have it installed:

```bash
npm run dfx_install
```

Next you will want to start a replica, which is a local instance of the IC that you can deploy your canisters to:

```bash
dfx start --background --clean
```

If you ever want to stop the replica:

```bash
dfx stop
```

Now you can deploy your canister locally:

```bash
npm install
dfx deploy
```

dfx deploy runs the build command and deploys the canister locally.

To call the methods on your canister head to the link displayed after running dfx deploy. The link is the candid UI where you can pass the different arguments to the UI functions.

