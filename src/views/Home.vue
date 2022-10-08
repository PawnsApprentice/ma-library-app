<template>
    <div>
    </div>
</template>

<script setup>
    import { db } from '../firebase/init';
    import { useStoreLibrary } from '@/stores/storeLibrary.js';
    import { doc, setDoc, getDoc } from 'firebase/firestore';
    import { onMounted, ref } from 'vue';
    import router from '@/router';

    const userId = ref('');
    const userName = ref('');
    const userEmail = ref('');
    const storeLibrary = useStoreLibrary();

    const fakePayload = {
        sub: '133434',
        username: 'hassam.abdullah@mobileaction.co',
        membershipType: 'ADMIN',
        accountId: 1001,
        maAdmin: false,
        type: 'access',
        platform: 'SEARCHADS_COM',
        imp: 133523,
        fullAccessImp: false,
        cpModeImp: false,
        iat: 1662354275,
        exp: 1632351970,
        features: [
            'EXPORT_CSV',
            'ACCESS_SDK_INTELLIGENCE',
            'ACCESS_SDK_INTELLIGENCE',
            'ACCESS_ADMIN_DASHBOARD',
            //ACCESS_ADMIN_DASHBOARD
            //ADMIN_MANAGE_ADMINS
        ],
    };
    async function createUser() {
        userId.value = fakePayload.accountId.toString();
        userName.value = emailUsername(fakePayload.username);
        userEmail.value =  fakePayload.username;
        const docRef = doc(db, 'users', userId.value );
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            console.log('exists');
        } else {
            await storeLibrary.addUsers(userId.value, userName.value, userEmail.value);
        }
    }

    function emailUsername(emailAddress) {
        return emailAddress.split('@')[0];
    }

    async function checkJsonCredentials(){
        await createUser();
        storeLibrary.userLogged = userEmail.value;
        if (fakePayload.features.includes('ADMIN_MANAGE_ADMINS') ){
            storeLibrary.userPrivilege = 'ADMIN';
            await router.push('/admin-view-book');
        } else {
            storeLibrary.userPrivilege = 'NORMAL';
            await router.push('/normal-view-book');
            console.log('normal user');
        }
    }

    onMounted(() =>{
        checkJsonCredentials();
    });

</script>
