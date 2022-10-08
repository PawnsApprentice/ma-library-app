<template>
    <div class="flex flex-wrap">
        <!--        Spinner for initial table load       -->
        <div v-if="!storeLibrary.booksLoaded" class="w-full">
            <a-spin tip="Loading...">
                <a-alert
                    message="Retrieving Data"
                    description="Please Hold"
                ></a-alert>
            </a-spin>
        </div>
        <!--       MODAL FOR NOTIFY BUTTON     -->
        <a-modal v-model:visible="modalNotifyVisible" title="Notify User"
                 @ok="notifyHandleOk"
                 @cancel="notifyHandleCancel"
        >
            <p>Are you sure you want to notify the user to return the book?</p>
        </a-modal>
        <!--       MODAL FOR DELETE BUTTON     -->
        <a-modal v-model:visible="modalDeleteVisible" class="mt-52"
                 title="Delete Book"
                 @ok="deleteHandleOk"
                 @cancel="deleteHandleCancel"
        >
            <p>Are you sure you want to delete the selected book?</p>
        </a-modal>
        <!--        MODAL FOR IMAGES       -->
        <a-modal v-model:visible="modalVisible" footer='' @ok="handleOk">
            <a-image
                class = "pl-[135px] ml-32 mt-10"
                :width="200"
                :height="400"
                :preview="false"
                v-bind:src="modalImage"
            />
        </a-modal>
        <!--        DRAWER FOR ADD BUTTON        -->
        <a-drawer
            v-model:visible="addVisible"
            class="custom-class"
            title="Add Books"
            placement="right"
            width = 800
            @after-visible-change="afterVisibleChange"
        >
            <div class="">
                <!--        FORM FOR ADD BOOKS     -->
                <a-form
                    class=" w-6/12 mt-12"
                    :model="formState"
                    name="basic"
                    :label-col="{ span: 8}"
                    :wrapper-col="{ span: 19}"
                    autocomplete="off"
                    @finish="onFinish"
                    @finishFailed="onFinishFailed"
                >
                    <a-form-item
                        class="mb-10"
                        label="Title"
                        name="bookTitle"
                        :rules="[{ required: true, message: 'Please input the Book Title!' }]"
                    >
                        <a-auto-complete
                            v-model:value="formState.bookTitle"
                            :options="options"
                            style="width: 200px"
                            @select="onSelect"
                            @search="onSearch"
                        />
                        <a-spin v-if="apiFetching" class="pl-2"/>
                    </a-form-item>
                    <a-form-item
                        class="mb-10"
                        label="ISBN"
                        name="bookIsbn"
                        :rules="[{ required: true, message: 'Please input the name of the author!' }]"
                    >
                        <a-input v-model:value="formState.bookIsbn"/>
                    </a-form-item>
                    <a-form-item
                        class="mb-10"
                        label="Author"
                        name="bookAuthor"
                        :rules="[{ required: true, message: 'Please input the name of the author!' }]"
                    >
                        <a-input v-model:value="formState.bookAuthor"/>
                    </a-form-item>
                    <a-form-item
                        class="mb-10"
                        label="Image URL"
                        name="bookImage"
                        :rules="[{ required: true, message: 'Please input the url for the book image' }]"
                    >
                        <a-input v-model:value="formState.bookImage"/>
                    </a-form-item>
                    <a-image
                        class = "pl-[120px]"
                        :width="200"
                        v-bind:src="formState.bookImage"
                        :preview=false
                    />
                    <br/>
                    <a-button class = "ml-[125px] mt-10 mb-10" type="primary"
                              size="large"
                              html-type="submit"
                    >Add</a-button>
                </a-form>
            </div>
        </a-drawer>
        <!--        DRAWER FOR EDIT BUTTON        -->
        <a-drawer
            v-model:visible="editVisible"
            class="custom-class"
            title="Edit Book"
            placement="right"
            width = 800
            @after-visible-change="afterVisibleChange"
        >
            <div class="">
                <!--        FORM FOR EDIT BOOKS         -->
                <a-form
                    class=" w-6/12 mt-12"
                    :model="formStateEdit"
                    name="basic"
                    :label-col="{ span: 8}"
                    :wrapper-col="{ span: 19}"
                    autocomplete="off"
                    @finish="onFinishEdit"
                    @finishFailed="onFinishFailedEdit"
                >

                    <a-form-item
                        class="mb-10"
                        label="Title"
                        name="bookTitle"
                        :rules="[{ required: true, message: 'Please input the Book Title!' }]"
                    >
                        <a-input v-model:value="formStateEdit.bookTitle"/>
                    </a-form-item>
                    <a-form-item
                        class="mb-10"
                        label="ISBN"
                        name="bookIsbn"
                        :rules="[{ required: true, message: 'Please input the name of the author!' }]"
                    >
                        <a-input v-model:value="formStateEdit.bookIsbn"/>
                    </a-form-item>
                    <a-form-item
                        class="mb-10"
                        label="Author"
                        name="bookAuthor"
                        :rules="[{ required: true, message: 'Please input the name of the author!' }]"
                    >
                        <a-input v-model:value="formStateEdit.bookAuthor"/>
                    </a-form-item>
                    <a-form-item
                        class="mb-10"
                        label="Image URL"
                        name="bookImage"
                        :rules="[{ required: true, message: 'Please input the url for the book image' }]"
                    >
                        <a-input v-model:value="formStateEdit.bookImage"/>
                    </a-form-item>
                    <a-image
                        class = "pl-[120px]"
                        :width="200"
                        v-bind:src="formStateEdit.bookImage"
                    />
                    <br/>
                    <a-button class = "ml-[125px] mt-10 mb-10" type="primary"
                              size="large"
                              html-type="submit"
                    >Edit</a-button>
                </a-form>
            </div>
        </a-drawer>
        <!--        COMPONENTS ON PAGE LOAD     -->
        <div class = "w-full">
            <div class = "pl-12 pt-20 w-full">
                <a-dropdown>
                    <template #overlay>
                        <a-menu @click="handleDropdownClick">
                            <a-menu-item key="1">
                                <UserOutlined/>
                                User Email
                            </a-menu-item>
                            <a-menu-item key="2">
                                <UserOutlined/>
                                Book Title
                            </a-menu-item>
                            <a-menu-item key="3">
                                <UserOutlined/>
                                ISBN
                            </a-menu-item>
                        </a-menu>
                    </template>
                    <a-button type="primary">
                        {{ buttonDropdownSelected }}
                        <DownOutlined/>
                    </a-button>
                </a-dropdown>
                <a-input v-model:value="filteredUser" class = "ml-5 w-2/12"
                         placeholder="Filter by User Email/Book Title/Isbn"
                         @keyup.enter="filterUserBooks"
                         @change="resetFilterUserBooks"
                />
            </div>
            <div v-if="storeLibrary.booksLoaded" class="flex justify-between w-full px-12 pt-10">
                <div>
                    <a-dropdown>
                        <template #overlay>
                            <a-menu @click="handleDropdownStatusClick">
                                <a-menu-item key="1">
                                    <UserOutlined/>
                                    Available
                                </a-menu-item>
                                <a-menu-item key="2">
                                    <UserOutlined/>
                                    Reserved
                                </a-menu-item>
                                <a-menu-item key="3">
                                    <UserOutlined/>
                                    Both
                                </a-menu-item>
                            </a-menu>
                        </template>
                        <a-button type="primary">
                            {{ buttonDropdownSelectedStatus }}
                            <DownOutlined/>
                        </a-button>
                    </a-dropdown>
                </div>
                <a-button title="Add Book"
                          type="primary"
                          @click="showAddDrawer"
                >
                    <template #icon>
                        <plus-outlined class = "text-lg"/>
                    </template>
                </a-button>
            </div>
        </div>
        <a-table
            v-if="storeLibrary.booksLoaded"
            class="w-full px-12 pt-7 " size="small"
            :data-source="storeLibrary.books"
            :pagination="{ pageSize: 5}"
        >
            <!--        TABLE COMPONENT         -->
            <a-table-column key="image_url" class='w-20' title="">
                <template #default="{ record }">
                    <a-image
                        :width="50"
                        :preview="false"
                        v-bind:src="record.image_url"
                        @click="showImageModal(record)"
                    />
                </template>
            </a-table-column>
            <a-table-column key="title" title="Title" data-index="title"/>
            <a-table-column key="isbn" title="Isbn" data-index="isbn"/>
            <a-table-column key="author" title="Author" data-index="author"/>
            <a-table-column key="loaned_by" title="Loaned By" data-index="loaned_by">
                <template #default="{ record }">
                    <span v-if="record.status === 'RESERVED'">
                        {{record.loaned_by}}
                    </span>
                </template>
            </a-table-column>
            <a-table-column key="status" title="Status" data-index="status">
                <template #default="{ record }">
                    <span v-if="record.status === 'AVAILABLE'" class ="text-green-500">
                        <a-tag color="green">{{record.status}}</a-tag>
                    </span>
                    <span v-if="record.status === 'RESERVED'" class= "text-rose-700">
                        <a-tag color="red">{{record.status}}</a-tag>
                    </span>
                </template>
            </a-table-column>
            <a-table-column key="action" title="Action">
                <template #default="{ record }">
                    <span>
                        <a-button class="md:mb-3 lg:pb-2 " type="primary" @click="showEditDrawer(record)">Edit</a-button>
                        <a-divider type="vertical"/>
                        <a-button class="md:mb-3 lg:mb-0" type="primary"
                                  danger
                                  @click="deleteBook(record)"
                        >Delete</a-button>
                        <template v-if= "record.status === 'AVAILABLE'">
                            <a-divider type="vertical"/>
                            <a-button type = "primary"  @click="checkoutBook(record)">Checkout</a-button>
                        </template>
                        <template  v-if= "(record.loaned_by === currentUser) && (record.status === 'RESERVED')">
                            <a-divider type="vertical"/>
                            <a-button type = "primary"   @click="returnBook(record)">Return</a-button>
                        </template>
                        <template v-if= "(record.loaned_by != currentUser) && (record.status === 'RESERVED')">
                            <a-divider type="vertical"/>
                            <a-button type = "primary" @click="notifyUser(record)">Notify</a-button>
                        </template>
                    </span>
                </template>
            </a-table-column>
        </a-table>
        <!--        DRAWER FOR ADD BUTTON        -->

    </div>
</template>

<script setup>
    import { useStoreLibrary } from '@/stores/storeLibrary.js';
    import { onMounted, reactive, ref } from 'vue';
    import { PlusOutlined, DownOutlined } from '@ant-design/icons-vue';
    import emailjs from '@emailjs/browser';
    import { message } from 'ant-design-vue';

    //initialize store library
    const storeLibrary = useStoreLibrary();

    //shows the spinner in adds button drawer
    const apiFetching = ref(false);

    //retrieves current user from store for html validation
    const currentUser = storeLibrary.userLogged;

    //Notify Button Logic
    const userNotificationRef = ref({});
    const modalNotifyVisible = ref(false);
    function notifyUser(record){
        userNotificationRef.value=record;
        modalNotifyVisible.value = true;
    }
    async function notifyHandleOk(){
        const templateParams = {
            to_email: userNotificationRef.value.loaned_by,
        };
        emailjs.send(import.meta.env.VITE_SERVICE_ID,import.meta.env.VITE_TEMPLATE_ID, templateParams, import.meta.env.VITE_PUBLIC_KEY)
            .then((response) => {
                console.log('SUCCESS!', response.status, response.text);
                message.success('User has been notified');
            }, (err) => {
                console.log('FAILED...', err);
                message.error('User could not be notified');
            });
        modalNotifyVisible.value=false;
    }
    function notifyHandleCancel(){
        modalNotifyVisible.value=false;
    }

    //Modal Image Logic
    const modalImage = ref('');
    const modalVisible = ref(false);
    function showModal(){
        modalVisible.value = true;
    }
    function showImageModal(record){
        modalImage.value = record.image_url;
        showModal();
    }

    //Delete Modal Logic
    const userSelectionRef = ref({});
    const modalDeleteVisible = ref(false);
    async function deleteHandleOk(){
        await storeLibrary.deleteBooks(userSelectionRef.value.id);
        modalDeleteVisible.value=false;
    }
    function deleteHandleCancel(){
        modalDeleteVisible.value=false;
    }
    function deleteBook(record){
        userSelectionRef.value = record;
        modalDeleteVisible.value = true;
        filteredUser.value = '';
        storeLibrary.getBooks();
    }
    const filteredUser = ref(''); //used in delete function above

    //Add form logic
    const options = ref([]);
    const booksJsonArr = ref([]);
    async function onSearch(searchtext){
        clearTimeout(debounce.value);
        debounce.value = setTimeout(async () => {
            await findBookInfo();
            if (booksJsonArr.value.length > 1){
                console.log(booksJsonArr.value[0]);
                options.value =  [{ value: booksJsonArr.value[0].title }, { value: booksJsonArr.value[1].title }, { value: booksJsonArr.value[2].title }];
            }
        }, 1300);
    }
    function onSelect(value){
        for (let ar in booksJsonArr.value){
            if (booksJsonArr.value[ar].title === value){
                formState.bookIsbn = booksJsonArr.value[ar].isbn;
                formState.bookAuthor = booksJsonArr.value[ar].author;
                formState.bookImage = booksJsonArr.value[ar].image;

            }
        }
    }

    //Add Drawer Logic
    const addVisible = ref(false);
    function showAddDrawer() {
        addVisible.value = true;
    }
    const formState = reactive({
        bookIsbn: '',
        bookTitle: '',
        bookAuthor: '',
        bookImage: '',
    });
    //onFinish add books form method
    function onFinish() {
        storeLibrary.addBooks(formState.bookTitle,formState.bookIsbn,formState.bookAuthor,formState.bookImage);
        addVisible.value=false;
        formState.bookTitle = '';
        formState.bookAuthor = '';
        formState.bookIsbn = '';
        formState.bookImage = '';
    }

    //Edit drawer logic
    const formStateEdit = reactive({
        bookIsbn: '',
        bookTitle: '',
        bookAuthor: '',
        bookImage: '',
    });
    const refBookSelected = reactive({});
    const editVisible = ref(false);
    function showEditDrawer(record){
        refBookSelected.value = record;
        formStateEdit.bookTitle = record.title;
        formStateEdit.bookAuthor = record.author;
        formStateEdit.bookIsbn = record.isbn;
        formStateEdit.bookImage = record.image_url;
        editVisible.value = true;
    }
    function onFinishEdit(){
        storeLibrary.editBooks(refBookSelected.value.id, formStateEdit.bookTitle,formStateEdit.bookIsbn,formStateEdit.bookAuthor,formStateEdit.bookImage);
        editVisible.value=false;
        formStateEdit.bookTitle = '';
        formStateEdit.bookAuthor = '';
        formStateEdit.bookIsbn = '';
        formStateEdit.bookImage = '';
    }

    //Filter By UserID, Book Title, Isbn Button Logic
    const buttonDropdownSelected = ref('Filter By');
    function filterUserBooks(){
        if (buttonDropdownSelected.value !== 'Filter By'){
            storeLibrary.getFilteredUserBooks(filteredUser.value, buttonDropdownSelected.value);
            buttonDropdownSelectedStatus.value = 'Filter (By Status)';
        }

    }
    function resetFilterUserBooks(){
        if (filteredUser.value === ''){
            storeLibrary.getBooks();
        }
    }
    function handleDropdownClick(e){
        console.log(typeof e.key);
        if (e.key === '1'){
            buttonDropdownSelected.value='User Email';
        } else if (e.key === '2'){
            buttonDropdownSelected.value='Book Title';
        } else {
            buttonDropdownSelected.value='ISBN';
        }
    }

    //Filter By Book status i.e Reserved/Available Button Logic
    const buttonDropdownSelectedStatus = ref('Filter (By Status)');
    function handleDropdownStatusClick(e){
        if (e.key === '1'){
            buttonDropdownSelectedStatus.value='Available';
        } else if (e.key === '2'){
            buttonDropdownSelectedStatus.value='Reserved';
        } else {
            buttonDropdownSelectedStatus.value='Both';
        }
        storeLibrary.getBooksByStatus(buttonDropdownSelectedStatus.value, buttonDropdownSelected.value, filteredUser.value);
    }

    //Logic to make an api call and retrieve data about book while user is typing in add form
    const debounce = ref(null);
    async function findBookInfo(){
        if (formState.bookTitle.length > 3){
            booksJsonArr.value=[];
            apiFetching.value=true;
            await fetch(`http://openlibrary.org/search.json?q=${formState.bookTitle}&limit=3`)
                .then(a => a.json())
                .then((response) => {
                    for (let i = 0; i < 3; i++){
                        let tempIsbn = response.docs[i].isbn[0];
                        let temp = {
                            author: response.docs[i].author_name,
                            title: response.docs[i].title,
                            isbn: response.docs[i].isbn[0],
                            image: 'https://covers.openlibrary.org/b/isbn/'+tempIsbn+'-M.jpg',
                        };
                        booksJsonArr.value.push(temp);
                    }
                })
                .catch((error) => {
                    console.log('No such book exists in the records');
                });
            apiFetching.value=false;
        }
    }

    //Function to checkout the book
    function checkoutBook(record){
        storeLibrary.checkoutBooks(record.id);
        filteredUser.value = '';
    }

    //Function to return the book
    function returnBook(record){
        storeLibrary.returnBooks(record.id);
        filteredUser.value = '';
    }

    /* mounted method */
    onMounted(()=> {
        storeLibrary.getBooks();
    });
</script>

