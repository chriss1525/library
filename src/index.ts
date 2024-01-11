import { Canister, ic, update, query, Principal, text, Vec, Record, Opt, Result, Err, Ok, blob, nat64, Variant, StableBTreeMap, bool } from 'azle';;


// define library struct
const LibraryCard = Record({
    id: nat64,
    owner: Principal,
    booksBorrowed: Vec(text),
    isActive: bool
});
type LibraryCard = typeof LibraryCard.tsType;

// define book struct
const Book = Record({
    title: text,
    isBorrowed: bool
});
type Book = typeof Book.tsType;

// define generateId function
function generateId(): nat64 {
    return ic.time();
}

// handle errors
const Error = Variant({
    CardDoesNotExist: nat64,
    BookDoesNotExist: text
});

// define libraryCards and books
let libraryCards = StableBTreeMap<nat64, LibraryCard>(0);
let books = StableBTreeMap<text, Book>(1);

// define library canister
export default Canister({
    /**
     * method to issue card
     * @param owner: Principal
     * @returns LibraryCard
     */
    issueCard: update([Principal], LibraryCard, (owner) => {
        const id = generateId();
        const card: LibraryCard = {
            id,
            owner,
            booksBorrowed: [],
            isActive: true
        };

        libraryCards.insert(card.id, card);

        return card;
    }),

    /**
     * method to revoke card
     * @param id: nat64
     * @returns LibraryCard
     */
    revokeCard: update([nat64], Result(LibraryCard, Error), (id) => {
        const cardOpt = libraryCards.get(id);

        if ('None' in cardOpt) {
            return Err({
                CardDoesNotExist: id
            });
        }

        const card = cardOpt.Some;
        card.isActive = false;
        libraryCards.insert(card.id, card);

        return Ok(card);
    }),

    /**
     * method to get card
     * @param id: nat64
     * @params book title: text
     * @returns book: Book
     */
    issueBook: update([nat64, text], Result(Book, Error), (cardId, bookTitle) => {
        const cardOpt = libraryCards.get(cardId);

        if ('None' in cardOpt) {
            return Err({
                CardDoesNotExist: cardId
            });
        }

        const bookOpt = books.get(bookTitle);

        if ('None' in bookOpt) {
            return Err({
                BookDoesNotExist: bookTitle
            });
        }

        const card = cardOpt.Some;
        const book = bookOpt.Some;

        if (!book.isBorrowed && card.isActive) {
            book.isBorrowed = true;
            card.booksBorrowed.push(bookTitle);
            books.insert(bookTitle, book);
            libraryCards.insert(cardId, card);
        }

        return Ok(book);
    }),

    /**
     * method to return book
     * @param id: nat64
     * @params book title: text
     * @returns book: Book
     */
    returnBook: update([nat64, text], Result(Book, Error), (cardId, bookTitle) => {
        const cardOpt = libraryCards.get(cardId);

        if ('None' in cardOpt) {
            return Err({
                CardDoesNotExist: cardId
            });
        }

        const bookOpt = books.get(bookTitle);

        if ('None' in bookOpt) {
            return Err({
                BookDoesNotExist: bookTitle
            });
        }

        const card = cardOpt.Some;
        const book = bookOpt.Some;

        if (book.isBorrowed && card.isActive) {
            book.isBorrowed = false;
            card.booksBorrowed = card.booksBorrowed.filter((title) => title !== bookTitle);
            books.insert(bookTitle, book);
            libraryCards.insert(cardId, card);
        }

        return Ok(book);
    }),

    /**
     * method to list all books
     * @returns books: Vec<Book>
     */
    listBooks: query([], Vec(Book), () => {
        return books.values();
    }),
    
    /**
     * method to list all borrowed books per card
     * @param id: nat64
     * @returns books: Vec<text>
     */
    listBorrowedBooks: query([nat64], Vec(text), (cardId) => {
        const cardOpt = libraryCards.get(cardId);

        if ('None' in cardOpt) {
            return [];
        }

        const card = cardOpt.Some;

        return card.booksBorrowed;
    }),

    /**
     * method to list all returned books per card
     * @param id: nat64
     * @returns books: Vec<text>
     */
    listReturnedBooks: query([nat64], Vec(text), (cardId) => {
        const cardOpt = libraryCards.get(cardId);

        if ('None' in cardOpt) {
            return [];
        }

        const card = cardOpt.Some;

        return books.keys().filter((title) => !card.booksBorrowed.includes(title));
    }),

    /**
     * method to list all active cards
     * @returns cards: Vec<LibraryCard>
     */
    listActiveCards: query([], Vec(LibraryCard), () => {
        return libraryCards.values().filter((card) => card.isActive);
    }),
    
    /**
     * method to list all inactive cards
     * @returns cards: Vec<LibraryCard>
     */
    createBook: update([text], Book, (title) => {
        const book: Book = {
            title,
            isBorrowed: false
        };

        books.insert(title, book);

        return book;
    }),
});
