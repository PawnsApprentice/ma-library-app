<template>
    <div v-if="storeLibrary.userPrivilege === 'ADMIN'" class="pl-5">
        <a-menu v-model:selectedKeys="current" mode="horizontal">
            <a-menu-item key="books"  @click="goToViewBooks">
                <template #icon>
                    <RocketTwoTone rotate="50"/>
                </template>
                BOOKS
            </a-menu-item>
            <a-menu-item key="requests" @click="goToViewRequests">
                <template #icon>
                    <RocketTwoTone rotate="50"/>
                </template>
                REQUESTS
            </a-menu-item>
        </a-menu>
    </div>
    <div v-if="storeLibrary.userPrivilege === 'NORMAL'" class="pl-5">
        <a-menu v-model:selectedKeys="current" mode="horizontal">
            <a-menu-item key="books"  @click="goToViewNormalBooks">
                <template #icon>
                    <RocketTwoTone rotate="50"/>
                </template>
                BOOKS
            </a-menu-item>
            <a-menu-item key="requests" @click="goToViewNormalRequests">
                <template #icon>
                    <RocketTwoTone rotate="50"/>
                </template>
                REQUESTS
            </a-menu-item>
        </a-menu>
    </div>
</template>

<script setup>
    import { RocketTwoTone } from '@ant-design/icons-vue';
    import { onMounted, ref } from 'vue';
    import { useStoreLibrary } from '@/stores/storeLibrary';
    import router from '@/router';

    const current = ref(['books']);
    const storeLibrary = useStoreLibrary();


    function goToViewBooks(){
        router.push('/admin-view-book');
    }
    function goToViewRequests(){
        router.push('/admin-view-requests');
    }
    function goToViewNormalBooks(){
        router.push('/normal-view-book');
    }
    function goToViewNormalRequests(){
        router.push('/normal-view-requests');
    }

    /*
mounted
*/
    onMounted(()=> {
        storeLibrary.getRequests();
    });
</script>
