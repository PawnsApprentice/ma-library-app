import { defineStore } from 'pinia';
import { collection, getDocs, addDoc, query, where, doc, setDoc, onSnapshot } from 'firebase/firestore';
import { db } from '@/firebase/init';
import { message } from 'ant-design-vue';


export const useStoreLibrary = defineStore('storeLibrary', {
    state: () => {
        return {
            books: [],
            userLogged: '',
            userPrivilege: '',
            booksTemp: [],
            booksLoaded: false,
            requestsLoaded: false,
            requests: [],
            checkedReserved: false,
            checkedAvailable: false,
            checkedAccepted: false,
            checkedRejected: false,

        };
    },
    actions: {
        async getBooks() {
            const queryBooks = query(collection(db, 'books'), where('deleted_at', '==', ''));
            onSnapshot(queryBooks,(querySnapshot)=> {
                this.checkedAvailable = false;
                this.checkedReserved = false;
                this.books = [];
                querySnapshot.forEach((doc) => {
                    let book = {
                        id: doc.id,
                        image_url: doc.data().image_url,
                        title: doc.data().title,
                        isbn: doc.data().isbn,
                        author: doc.data().author,
                        status: doc.data().status,
                        added_at: doc.data().added_at,
                        added_by: doc.data().added_by,
                        loaned_by: doc.data().loaned_by,
                        loaned_at: doc.data().loaned_at,
                    };
                    this.books.push(book);
                });
                this.booksLoaded=true;
            });
        },
        async addBooks(title, isbn, author, imageUrl) {
            let currentDate = new Date(),
                addedtime = currentDate.toString();

            const docRef = await addDoc(collection(db, 'books'), {
                image_url: imageUrl,
                title: title,
                isbn: isbn,
                author: author,
                status: 'AVAILABLE',
                added_by: this.userLogged,
                added_at: addedtime,
                deleted_by: '',
                deleted_at: '',
                loaned_by: '',
                loaned_at: '',
                returned_at: '',
            });

            message.success('Successfully added book');

            console.log('Document written with ID: ', docRef.id);
        },
        async deleteBooks(idToDelete){
            let currentDate = new Date(),
                addedtime = currentDate.toString();
            await setDoc(doc(db,'books', idToDelete), {
                deleted_at: addedtime,
                deleted_by: this.userLogged,
                status: 'DELETED',

            }, { merge: true });

            message.success('Successfully deleted book');

        },
        async editBooks(idToDelete, title, isbn, author, imageUrl){
            await setDoc(doc(db,'books', idToDelete), {
                title: title,
                isbn: isbn,
                author: author,
                imageUrl: imageUrl,
            }, { merge: true });

            message.success('Successfully edited book');
        },
        async checkoutBooks(idToCheckout){
            let currentDate = new Date(),
                addedtime = currentDate.toString();
            await setDoc(doc(db,'books', idToCheckout), {
                loaned_by: this.userLogged,
                loaned_at: addedtime,
                status: 'RESERVED',
            }, { merge: true });

            message.success('Successfully checked out book');
        },
        async returnBooks(idToReturn){
            let currentDate = new Date(),
                addedtime = currentDate.toString();
            await setDoc(doc(db,'books', idToReturn), {
                status: 'AVAILABLE',
                returned_at: addedtime,
            }, { merge: true });
            message.success('Successfully returned book');
        },
        async getBooksByStatus(status, buttonDropdown, userInput) {
            let queryBooks = query(collection(db, 'books'), where('status', '!=', 'DELETED')); //show all books
            if (userInput.length !== 0){
                if (buttonDropdown === 'Book Title'){
                    queryBooks = query(collection(db, 'books'), where('title', '>=', userInput), where('title', '<=', userInput + '\uf8ff'));
                } else if (buttonDropdown === 'ISBN'){
                    queryBooks = query(collection(db, 'books'), where('isbn', '>=', userInput), where('isbn', '<=', userInput + '\uf8ff'));
                } else if (buttonDropdown ==='User Email'){
                    queryBooks = query(collection(db, 'books'), where('loaned_by', '>=', userInput), where('loaned_by', '<=', userInput + '\uf8ff'));
                }
            }
            const querySnapshot = await getDocs(queryBooks);
            this.books=[];
            querySnapshot.forEach((doc) => {
                let book = {
                    id: doc.id,
                    image_url: doc.data().image_url,
                    title: doc.data().title,
                    isbn: doc.data().isbn,
                    author: doc.data().author,
                    status: doc.data().status,
                    added_at: doc.data().added_at,
                    added_by: doc.data().added_by,
                    loaned_by: doc.data().loaned_by,
                    loaned_at: doc.data().loaned_at,
                };
                if ((status === 'Available' || status ==='Both') && buttonDropdown ==='User Email' &&userInput.length != 0) {
                    if (doc.data().status === 'RESERVED') {
                        this.books.push(book);
                    }
                } else if (status==='Available'){
                    if (doc.data().status === 'AVAILABLE'){
                        this.books.push(book);
                    }
                } else if (status === 'Reserved'){
                    if (doc.data().status === 'RESERVED'){
                        this.books.push(book);
                    }
                } else {
                    this.books.push(book);
                }

            });
            this.booksLoaded = true;
        },
        async getFilteredUserBooks(userInput, typeSelected) {
            let queryRequests = query(collection(db, 'books'), where('loaned_by', '>=', userInput), where('loaned_by', '<=', userInput + '\uf8ff'));
            if (typeSelected === 'Book Title'){
                queryRequests = query(collection(db, 'books'), where('title', '>=', userInput), where('title', '<=', userInput + '\uf8ff'));
            } else if (typeSelected === 'ISBN'){
                queryRequests = query(collection(db, 'books'), where('isbn', '>=', userInput), where('isbn', '<=', userInput + '\uf8ff'));
            }

            this.booksLoaded = false;
            const querySnapshot = await getDocs(queryRequests);
            this.books=[];
            querySnapshot.forEach((doc) => {
                let book = {
                    id: doc.id,
                    image_url: doc.data().image_url,
                    title: doc.data().title,
                    isbn: doc.data().isbn,
                    author: doc.data().author,
                    status: doc.data().status,
                    added_at: doc.data().added_at,
                    added_by: doc.data().added_by,
                    loaned_by: doc.data().loaned_by,
                    loaned_at: doc.data().loaned_at,
                };
                if (typeSelected === 'User Email'){
                    if (doc.data().status !== 'AVAILABLE'){
                        this.books.push(book);
                    }
                } else {
                    this.books.push(book);
                }
            });
            this.booksLoaded = true;
        },
        async addUsers(id, name, email){
            let currentDate = new Date(),
                addedtime = currentDate.toString();
            await setDoc(doc(db,'users', id), {
                id: id,
                name: name,
                email: email,
                created_at: addedtime,
            }, { merge: true });
            message.success('Successfully created User');
        },
        async getRequests() {
            this.requestsLoaded = false;
            this.checkedAccepted = false;
            this.checkedRejected = false;
            let queryRequests = query(collection(db, 'requests'), where('status', '==', 'PENDING'));
            if (this.userPrivilege === 'NORMAL'){
                queryRequests = query(collection(db, 'requests'), where('requested_by', '==', this.userLogged));
            }
            onSnapshot(queryRequests, (querySnapshot) => {
                this.requests = [];
                querySnapshot.forEach((doc) => {
                    let request= {
                        id: doc.id,
                        title: doc.data().title,
                        isbn: doc.data().isbn,
                        amazon_link: doc.data().amazon_link,
                        reason: doc.data().reason,
                        status: doc.data().status,
                        requested_by: doc.data().requested_by,
                        reject_reason: doc.data().reject_reason,
                    };
                    this.requests.push(request);
                });
                this.requestsLoaded = true;
            });
        },
        async addRequests(title, isbn, amazonlink, reason) {
            let currentDate = new Date(),
                addedtime = currentDate.toString();

            const docRef = await addDoc(collection(db, 'requests'), {
                title: title,
                isbn: isbn,
                reason: reason,
                amazon_link: amazonlink,
                requested_by: this.userLogged,
                requested_at: addedtime,
                rejected_by: '',
                rejected_at: '',
                accepted_by: '',
                accepted_at: '',
                status: 'PENDING',
                reject_reason: '',
            });

            message.success('Request has been submitted!');

            console.log('Document written with ID: ', docRef.id);
        },
        async acceptRequests(idToAccept){
            let currentDate = new Date(),
                addedtime = currentDate.toString();

            console.log(idToAccept);
            await setDoc(doc(db,'requests', idToAccept), {
                accepted_by: this.userLogged,
                accepted_at: addedtime,
                status: 'ACCEPTED',
            }, { merge: true });

            message.success('Request Accepted');

        },
        async rejectRequests(idToReject, reject_reason){
            let currentDate = new Date(),
                addedtime = currentDate.toString();
            await setDoc(doc(db,'requests', idToReject), {
                rejected_at: addedtime,
                rejected_by: this.userLogged,
                reject_reason: reject_reason,
                status: 'REJECTED',

            }, { merge: true });

            message.success('Request has been rejected');

        },
        async getRequestsByStatus(status, buttonDropdown, userInput) {
            let queryRequests = query(collection(db, 'requests'), where('status', '==', 'PENDING')); //show all books
            if (userInput.length !== 0){
                if (buttonDropdown === 'Book Title'){
                    queryRequests = query(collection(db, 'requests'), where('title', '>=', userInput), where('title', '<=', userInput + '\uf8ff'));
                } else if (buttonDropdown === 'ISBN'){
                    queryRequests = query(collection(db, 'requests'), where('isbn', '>=', userInput), where('isbn', '<=', userInput + '\uf8ff'));
                } else if (buttonDropdown ==='User Email'){
                    queryRequests = query(collection(db, 'requests'), where('requested_by', '>=', userInput), where('requested_by', '<=', userInput + '\uf8ff'));
                }
            } else {
                if (status === 'Accepted'){
                    queryRequests = query(collection(db, 'requests'), where('status', '==', 'ACCEPTED'));
                    console.log();
                } else if (status === 'Rejected'){
                    queryRequests = query(collection(db, 'requests'), where('status', '==', 'REJECTED'));
                }
                else if (status === 'All'){
                    queryRequests = query(collection(db, 'requests'));
                }
            }
            const querySnapshot = await getDocs(queryRequests);
            this.requests=[];
            querySnapshot.forEach((doc) => {
                let request = {
                    id: doc.id,
                    title: doc.data().title,
                    isbn: doc.data().isbn,
                    amazon_link: doc.data().amazon_link,
                    reason: doc.data().reason,
                    status: doc.data().status,
                    requested_by: doc.data().requested_by,
                    reject_reason: doc.data().reject_reason,
                };
                if (status === 'Accepted') {
                    if (doc.data().status === 'ACCEPTED') {
                        this.requests.push(request);
                    }
                } else if (status==='Rejected'){
                    if (doc.data().status === 'REJECTED'){
                        this.requests.push(request);
                    }
                } else if (status === 'Pending'){
                    if (doc.data().status === 'PENDING'){
                        this.requests.push(request);
                    }
                } else {
                    this.requests.push(request);
                }
            });
            this.booksLoaded = true;
        },

        async getRequestsByStatusNormal(status, buttonDropdown, userInput) {
            let queryRequests = query(collection(db, 'requests'), where('status', '==', 'PENDING')); //show all books
            if (userInput.length !== 0 && buttonDropdown !== 'Filter By'){
                if (buttonDropdown === 'Book Title'){
                    queryRequests = query(collection(db, 'requests'), where('title', '>=', userInput), where('title', '<=', userInput + '\uf8ff'));
                } else if (buttonDropdown === 'ISBN'){
                    queryRequests = query(collection(db, 'requests'), where('isbn', '>=', userInput), where('isbn', '<=', userInput + '\uf8ff'));
                } else if (buttonDropdown ==='User Email'){
                    queryRequests = query(collection(db, 'requests'), where('requested_by', '>=', userInput), where('requested_by', '<=', userInput + '\uf8ff'));
                }
            } else {
                console.log(status);
                if (status === 'Accepted'){
                    queryRequests = query(collection(db, 'requests'), where('status', '==', 'ACCEPTED'));
                } else if (status === 'Rejected'){
                    queryRequests = query(collection(db, 'requests'), where('status', '==', 'REJECTED'));
                } else if (status ==='All'){
                    queryRequests = query(collection(db, 'requests'));
                }
            }
            const querySnapshot = await getDocs(queryRequests);
            this.requests=[];
            querySnapshot.forEach((doc) => {
                let request = {
                    id: doc.id,
                    title: doc.data().title,
                    isbn: doc.data().isbn,
                    amazon_link: doc.data().amazon_link,
                    reason: doc.data().reason,
                    status: doc.data().status,
                    requested_by: doc.data().requested_by,
                    reject_reason: doc.data().reject_reason,
                };
                if (status === 'Accepted' && doc.data().requested_by === this.userLogged) {
                    console.log(status);
                    if (doc.data().status === 'ACCEPTED') {
                        this.requests.push(request);
                    }
                } else if (status==='Rejected' && doc.data().requested_by === this.userLogged){
                    if (doc.data().status === 'REJECTED'){
                        this.requests.push(request);
                    }
                } else if (status === 'Pending' && doc.data().requested_by === this.userLogged){
                    if (doc.data().status === 'PENDING'){
                        this.requests.push(request);
                    }
                } else if (doc.data().requested_by === this.userLogged) {
                    this.requests.push(request);
                }
            });
            this.booksLoaded = true;
        },

        async getFilteredUserRequests(userInput, typeSelected) {
            let queryRequests = query(collection(db, 'requests'), where('requested_by', '>=', userInput), where('requested_by', '<=', userInput + '\uf8ff'));
            if (typeSelected === 'Book Title'){
                console.log(userInput);
                queryRequests = query(collection(db, 'requests'), where('title', '>=', userInput), where('title', '<=', userInput + '\uf8ff'));
            } else if (typeSelected === 'ISBN'){
                queryRequests = query(collection(db, 'requests'), where('isbn', '>=', userInput), where('isbn', '<=', userInput + '\uf8ff'));
            }
            this.requestsLoaded = false;

            const querySnapshot = await getDocs(queryRequests);
            this.requests=[];
            querySnapshot.forEach((doc) => {
                let request = {
                    id: doc.id,
                    title: doc.data().title,
                    isbn: doc.data().isbn,
                    amazon_link: doc.data().amazon_link,
                    reason: doc.data().reason,
                    status: doc.data().status,
                    requested_by: doc.data().requested_by,
                };
                this.requests.push(request);

            });
            this.requestsLoaded = true;
        },
        async getFilteredUserRequestsNormal(userInput, typeSelected) {
            let queryRequests = query(collection(db, 'requests'), where('title', '>=', userInput), where('title', '<=', userInput + '\uf8ff'));

            if (typeSelected === 'ISBN'){
                queryRequests = query(collection(db, 'requests'), where('isbn', '>=', userInput), where('isbn', '<=', userInput + '\uf8ff'));
            }
            this.requestsLoaded = false;

            const querySnapshot = await getDocs(queryRequests);
            this.requests=[];
            console.log(this.userLogged);
            querySnapshot.forEach((doc) => {
                let request = {
                    id: doc.id,
                    title: doc.data().title,
                    isbn: doc.data().isbn,
                    amazon_link: doc.data().amazon_link,
                    reason: doc.data().reason,
                    status: doc.data().status,
                    requested_by: doc.data().requested_by,
                };
                if (doc.data().requested_by === this.userLogged){
                    this.requests.push(request);
                }

            });
            this.requestsLoaded = true;
        },
    },

});
