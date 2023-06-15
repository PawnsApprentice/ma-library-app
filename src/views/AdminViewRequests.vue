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
        <!--       MODAL FOR ACCEPT BUTTON     -->
        <a-modal v-model:visible="modalAcceptVisible" class="mt-52"
                 title="Accept Request"
                 @ok="acceptHandleOk"
                 @cancel="acceptHandleCancel"
        >
            <p>Are you sure you want to accept the selected request?</p>
        </a-modal>
        <!--       MODAL TO VIEW REQUEST REASON    -->
        <a-modal v-model:visible="modalReasonVisible" class="mt-52"
                 title="Reason"
                 footer=''
                 @ok="reasonHandleOk"
                 @cancel="reasonHandleCancel"
        >
            <p>{{storeReason}}</p>
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
                <!--        FORM FOR REQUEST BOOK    -->
                <a-form
                    class=" w-6/12 mt-12"
                    :model="formState"
                    name="basic"
                    :label-col="{ span: 8}"
                    :wrapper-col="{ span: 19}"
                    autocomplete="off"
                    @finish="onFinish"
                >
                    <a-form-item
                        class="mb-10"
                        label="Title"
                        name="requestBookTitle"
                        :rules="[{ required: true, message: 'Please input the title of the book!' }]"
                    >
                        <a-input v-model:value="formState.requestBookTitle"/>
                        <a-spin v-if="apiFetching" class="ml-2"/>
                    </a-form-item>
                    <a-form-item
                        class="mb-10"
                        label="ISBN"
                        name="requestBookIsbn"
                        :rules="[{ required: true, message: 'Please input the isbn of the book!' }]"
                    >
                        <a-input v-model:value="formState.requestBookIsbn"/>
                    </a-form-item>
                    <a-form-item
                        class="mb-10"
                        label="Amazon Link"
                        name="requestAmazonLink"
                        :rules="[{ required: true, message: 'Please input the amazon link for the book!' }]"
                    >
                        <a-input v-model:value="formState.requestAmazonLink"/>
                    </a-form-item>
                    <a-form-item
                        class="mb-10"
                        label="Request Reason"
                        name="requestReason"
                        :rules="[{ required: true, message: 'Please write the reason for the request' }]"
                    >
                        <a-input v-model:value="formState.requestReason"/>
                    </a-form-item>
                    <a-button class = "ml-[125px] mb-10" type="primary"
                              size="large"
                              html-type="submit"
                    >Add</a-button>
                </a-form>
            </div>
        </a-drawer>
        <!--        DRAWER FOR REJECT BUTTON        -->
        <a-drawer
            v-model:visible="rejectVisible"
            class="custom-class"
            title="Rejection Form"
            placement="right"
            width = 800
            @after-visible-change="afterVisibleChange"
        >
            <div class="">
                <!--        FORM FOR REJECT REQUESTS       -->
                <a-form
                    class=" w-8/12 mt-12"
                    :model="formStateReject"
                    name="basic"
                    :label-col="{ span: 8}"
                    :wrapper-col="{ span: 19}"
                    autocomplete="off"
                    @finish="onFinishReject"
                    @finishFailed="onFinishFailedReject"
                >
                    <a-form-item
                        class="mb-10 -ml-4"
                        label="Rejection Reason"
                        name="rejectionReason"
                        :rules="[{ required: true, message: 'Please input the reason for the rejection!' }]"
                    >
                        <a-textarea
                            v-model:value="formStateReject.rejectionReason"
                            class="ml-3 w-full"
                            placeholder="Enter the rejection reason"
                            rows="5"
                        />
                    </a-form-item>
                    <a-button class = "ml-[170px] mb-10" type="primary"
                              size="large"
                              html-type="submit"
                    >Reject Request</a-button>
                </a-form>
            </div>
        </a-drawer>
        <!--        COMPONENTS ON PAGE LOAD     -->
        <div class="w-full">
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
            class="ma-keyword-table w-full px-12 mt-5" size="small"
            :data-source="storeLibrary.requests"
            :pagination="{ pageSize: 5}"
        >
            <!--        TABLE COMPONENT         -->
            <a-table-column key="requested_by" title="Requested By" data-index="requested_by"/>
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
                    <span v-if="record.status === 'REJECTED'" class= "text-rose-700">
                        <a-tag color="red">{{record.status}}</a-tag>
                    </span>
                </template>
            </a-table-column>
            <a-table-column v-if="(!storeLibrary.checkedAccepted && !storeLibrary.checkedRejected) " key="action" title="Action">
                <template #default="{ record }">
                    <span v-if="(record.status === 'PENDING')">
                        <a-button type="primary" @click="acceptRequest(record)">Accept</a-button>
                        <a-divider type="vertical"/>
                        <a-button type="primary" danger @click="showRejectDrawer(record)">Reject</a-button>
                    </span>
                </template>
            </a-table-column>
        </a-table>
    </div>
</template>

<script setup>
    import { useStoreLibrary } from '@/stores/storeLibrary.js';
    import { onMounted, reactive, ref } from 'vue';
    import { PlusOutlined, DownOutlined } from '@ant-design/icons-vue';

    //initialize store library
    const storeLibrary = useStoreLibrary();

    //modal logic for accepting request
    const userSelectionRef = ref({});
    const modalAcceptVisible = ref(false);
    function acceptHandleOk(){
        storeLibrary.acceptRequests(userSelectionRef.value.id);
        modalAcceptVisible.value=false;
    }
    function acceptHandleCancel(){
        modalAcceptVisible.value=false;
    }


    //modal logic for viewing the reason
    const storeReason = ref('');
    const modalReasonVisible = ref(false);
    function showReason(request){
        modalReasonVisible.value=true;
        storeReason.value = request.reason;
    }
    function reasonHandleCancel(){
        modalReasonVisible.value=false;
    }

    //Reject Drawer Logic
    const refRequestSelected = reactive({});
    const formStateReject = reactive({
        rejectionReason: '',
    });
    const rejectVisible = ref(false);
    function showRejectDrawer(record){
        refRequestSelected.value = record;
        rejectVisible.value = true;
    }
    function onFinishReject(){
        storeLibrary.rejectRequests(refRequestSelected.value.id, formStateReject.rejectionReason);
        rejectVisible.value=false;
        formStateReject.rejectionReason = '';
    }

    //Dropdown button Logic for searching requests via User Email/Book title etc
    const filteredUser = ref('');
    function filterUserRequests(){
        if (buttonDropdownSelected.value !== 'Filter By'){
            storeLibrary.getFilteredUserRequests(filteredUser.value, buttonDropdownSelected.value);
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
        if (e.key === '1'){
            buttonDropdownSelected.value='User Email';
        } else if (e.key === '2'){
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
        storeLibrary.getRequestsByStatus(buttonDropdownSelectedStatus.value, buttonDropdownSelected.value, filteredUser.value);
    }

    //Add drawer logic
    const formState = reactive({
        requestBookIsbn: '',
        requestBookTitle: '',
        requestAmazonLink: '',
        requestReason: '',
    });
    const addVisible = ref(false);
    function showAddDrawer(){
        addVisible.value = true;
    }
    function onFinish(){
        storeLibrary.addRequests(formState.requestBookTitle,formState.requestBookIsbn,formState.requestAmazonLink, formState.requestReason);
        addVisible.value=false;
        formState.requestBookTitle = '';
        formState.requestBookIsbn = '';
        formState.requestAmazonLink = '';
        formState.requestReason = '';
    }

    //Function to accept the request
    function acceptRequest(record){
        userSelectionRef.value = record;
        modalAcceptVisible.value = true;
    }

    /*
mounted
*/
    onMounted(()=> {
        storeLibrary.getRequests();
    });
</script>

