<template>
    <div class="flex flex-wrap">
        <!--        Spinner for initial table load       -->
        <div v-if="!storeLibrary.requestsLoaded" class="w-full">
            <a-spin tip="Loading...">
                <a-alert
                    message="Retrieving Data"
                    description="Please Hold"
                ></a-alert>
            </a-spin>
        </div>
        <!--       MODAL TO VIEW REQUEST REASON    -->
        <a-modal v-model:visible="modalReasonVisible" title="Reason"
                 footer=''
                 @ok="reasonHandleOk"
                 @cancel="reasonHandleCancel"
        >
            <p>{{storeReason}}</p>
        </a-modal>
        <!--       MODAL TO GIVE USER REJECTION REASON    -->
        <a-modal v-model:visible="modalRejectionReasonVisible" title="Rejection Reason"
                 footer=''
                 @cancel="reasonRejectionHandleCancel"
        >
            <p>{{rejectionReason}}</p>
        </a-modal>
        <!--        DRAWER FOR ADD BUTTON        -->
        <a-drawer
            v-model:visible="addVisible"
            class="custom-class"
            title="New Request"
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
                        name="requestBookTitle"
                        :rules="[{ required: true, message: 'Please input the Book Title!' }]"
                    >
                        <a-auto-complete
                            v-model:value="formState.requestBookTitle"
                            :options="options"
                            style="width: 200px"
                            @select="onSelect"
                            @search="onSearch"
                        />
                        <a-spin v-if="apiFetching" class="ml-2"/>
                    </a-form-item>
                    <a-form-item
                        class="mb-10"
                        label="ISBN"
                        name="requestBookIsbn"
                        :rules="[{ required: true, message: 'Please input the Isbn of the book!' }]"
                    >
                        <a-input v-model:value="formState.requestBookIsbn"/>
                    </a-form-item>
                    <a-form-item
                        class="mb-10"
                        label="Amazon Link"
                        name="requestAmazonLink"
                        :rules="[{ required: true, message: 'Please input the name of the author!' }]"
                    >
                        <a-input v-model:value="formState.requestAmazonLink"/>
                    </a-form-item>
                    <a-form-item
                        class="mb-10"
                        label="Request Reason"
                        name="requestReason"
                        :rules="[{ required: true, message: 'Please input the url for the book image' }]"
                    >
                        <a-input v-model:value="formState.requestReason"/>
                    </a-form-item>
                    <a-button class = "ml-[120px] mt-10 mb-10" type="primary"
                              size="large"
                              html-type="submit"
                    >Add</a-button>
                </a-form>
            </div>
        </a-drawer>
        <!--        COMPONENTS ON PAGE LOAD     -->
        <div class="w-full">
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
                         @keyup.enter="filterUserRequests"
                         @change="resetFilterUserRequests"
                />
            </div>
            <div v-if="storeLibrary.requestsLoaded" class="flex justify-between w-full px-12 pt-10">
                <div>
                    <a-dropdown>
                        <template #overlay>
                            <a-menu @click="handleDropdownStatusClick">
                                <a-menu-item key="1">
                                    <UserOutlined/>
                                    Accepted
                                </a-menu-item>
                                <a-menu-item key="2">
                                    <UserOutlined/>
                                    Rejected
                                </a-menu-item>
                                <a-menu-item key="3">
                                    <UserOutlined/>
                                    Pending
                                </a-menu-item>
                                <a-menu-item key="4">
                                    <UserOutlined/>
                                    All
                                </a-menu-item>
                            </a-menu>
                        </template>
                        <a-button type="primary">
                            {{ buttonDropdownSelectedStatus }}
                            <DownOutlined/>
                        </a-button>
                    </a-dropdown>
                </div>
                <a-button class = "" title="New Request"
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
            v-if="storeLibrary.requestsLoaded"
            class="w-full px-12 mt-5" size="small"
            :data-source="storeLibrary.requests"
            :pagination="{ pageSize: 5}"
        >
            <!--        TABLE COMPONENT         -->
            <a-table-column key="title" title="Title" data-index="title"/>
            <a-table-column key="isbn" title="Isbn" data-index="isbn"/>
            <a-table-column key="amazon_link" title="Amazon Link" data-index="amazon_link"/>
            <a-table-column key="reason" title="Request Reason" data-index="reason">
                <template #default="{ record }">
                    <a-button type="primary"
                              size="small"
                              @click="showReason(record)"
                    >View Reason</a-button>
                </template>
            </a-table-column>
            <a-table-column key="status" title="Status" data-index="status">
                <template #default="{ record }">
                    <span v-if="record.status === 'PENDING'" class ="text-blue-600">
                        <a-tag color="blue">{{record.status}}</a-tag>
                    </span>
                    <span v-if="record.status === 'ACCEPTED'" class= "text-green-500">
                        <a-tag color="green">{{record.status}}</a-tag>
                    </span>
                    <span v-if="record.status === 'REJECTED'">
                        <a-button class="md:mb-3 lg:mb-0" type="primary"
                                  size="small"
                                  danger
                                  @click="giveUserReason(record)"
                        >{{record.status}}</a-button>
                    </span>
                </template>
            </a-table-column>
        </a-table>
    </div>
</template>

<script setup>
    import { useStoreLibrary } from '@/stores/storeLibrary.js';
    import { onMounted, reactive, ref } from 'vue';
    import { PlusOutlined } from '@ant-design/icons-vue';

    //initialize store library
    const storeLibrary = useStoreLibrary();

    //Modal Logic for viewing request reason
    const storeReason = ref('');
    const modalReasonVisible = ref(false);
    function showReason(request){
        modalReasonVisible.value=true;
        storeReason.value = request.reason;
    }
    function reasonHandleCancel(){
        modalReasonVisible.value=false;
    }

    //Modal Logic for viewing rejection reason
    const modalRejectionReasonVisible = ref(false);
    const rejectionReason=ref('');
    function giveUserReason(reason){
        modalRejectionReasonVisible.value=true;
        rejectionReason.value  = reason.reject_reason;
    }
    function reasonRejectionHandleCancel(){
        modalRejectionReasonVisible.value=false;
    }

    //Dropdown button Logic for searching requests via User Email/Book title etc
    const filteredUser = ref('');
    function filterUserRequests(){
        if (buttonDropdownSelected.value !== 'Filter By'){
            storeLibrary.getFilteredUserRequestsNormal(filteredUser.value, buttonDropdownSelected.value);
            buttonDropdownSelectedStatus.value = 'Filter (By Status)';
        }
    }
    function resetFilterUserRequests(){
        if (filteredUser.value === ''){
            storeLibrary.getRequests();
        }
    }
    const buttonDropdownSelected = ref('Filter By');
    function handleDropdownClick(e){
        if (e.key === '2'){
            buttonDropdownSelected.value='Book Title';
        } else {
            buttonDropdownSelected.value='ISBN';
        }
    }

    //Dropdown button Logic for searching requests via request status
    const buttonDropdownSelectedStatus = ref('Filter (By Status)');
    function handleDropdownStatusClick(e){
        if (e.key === '1'){
            buttonDropdownSelectedStatus.value='Accepted';
        } else if (e.key === '2'){
            buttonDropdownSelectedStatus.value='Rejected';
        } else if (e.key === '3'){
            buttonDropdownSelectedStatus.value='Pending';
        } else {
            buttonDropdownSelectedStatus.value='All';
        }
        storeLibrary.getRequestsByStatusNormal(buttonDropdownSelectedStatus.value, buttonDropdownSelected.value, filteredUser.value);
    }

    //Add Request Drawer Logic
    const formState = reactive({
        requestBookIsbn: '',
        requestBookTitle: '',
        requestAmazonLink: '',
        requestReason: '',
    });
    const addVisible = ref(false);
    const showAddDrawer = () => {
        addVisible.value = true;
    };
    function onFinish(){
        storeLibrary.addRequests(formState.requestBookTitle,formState.requestBookIsbn,formState.requestAmazonLink, formState.requestReason);
        addVisible.value=false;
        formState.requestBookTitle = '';
        formState.requestBookIsbn = '';
        formState.requestAmazonLink = '';
        formState.requestReason = '';
    }

    /*
mounted
*/
    onMounted(()=> {
        storeLibrary.getRequests();
    });
</script>

<style scoped>

</style>
