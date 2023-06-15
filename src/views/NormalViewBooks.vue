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
        <!--        MODAL FOR IMAGES       -->
        <a-modal v-model:visible="modalVisible" footer='' @ok="handleOk">
            <a-image
                class = "ml-[135px] mt-10"
                :width="200"
                :height="400"
                :preview="false"
                v-bind:src="modalImage"
            />
        </a-modal>
        <!--        COMPONENTS ON PAGE LOAD     -->
        <div class = "w-full">
            <div class = "pl-12 pt-20 w-full">
                <a-dropdown>
                    <template #overlay>
                        <a-menu @click="handleDropdownClick">
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
                         placeholder="Filter by Book Title/Isbn"
                         @keyup.enter="filterUserBooks"
                         @change="resetFilterUserBooks"
                />
            </div>
            <div v-if="storeLibrary.booksLoaded" class="flex justify-between w-11/12 pl-12 pt-10">
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
                        <template v-if= "record.status === 'AVAILABLE'">
                            <a-button class="md:mb-3 lg:pb-2" type = "primary"  @click="checkoutBook(record)">Checkout</a-button>
                        </template>
                        <template  v-if= "(record.loaned_by === currentUser) && (record.status === 'RESERVED')">
                            <a-divider type="vertical"/>
                            <a-button type = "primary"   @click="returnBook(record)">Return</a-button>
                        </template>
                    </span>
                </template>
            </a-table-column>
        </a-table>
    </div>
</template>

<script setup>
    import { useStoreLibrary } from '@/stores/storeLibrary.js';
    import { onMounted, ref } from 'vue';
    import { DownOutlined } from '@ant-design/icons-vue';

    //initialize store library
    const storeLibrary = useStoreLibrary();

    //retrieves current user from store
    const currentUser = storeLibrary.userLogged;


    //Dropdown logic for the filtration of the table via user email, title etc
    const filteredUser = ref('');
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
    const buttonDropdownSelected = ref('Filter By');
    function handleDropdownClick(e){
        if (e.key === '1'){
            buttonDropdownSelected.value='User Email';
        } else if (e.key === '2'){
            buttonDropdownSelected.value='Book Title';
        } else {
            buttonDropdownSelected.value='ISBN';
        }
    }

    //dropdown logic for the selection of available or reserved books
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

    //Image modal logic
    const modalImage = ref('');
    const modalVisible = ref(false);
    function showModal(){
        modalVisible.value = true;
    }
    function showImageModal(record){
        modalImage.value = record.image_url;
        showModal();
    }

    //Function to checkout the book
    function checkoutBook(record){
        storeLibrary.checkoutBooks(record.id);
    }

    //Function to return the book
    function returnBook(record){
        storeLibrary.returnBooks(record.id);
        filteredUser.value = '';
        storeLibrary.getBooks();
    }

    /*
mounted
*/
    onMounted(()=> {
        storeLibrary.getBooks();
    });
</script>
