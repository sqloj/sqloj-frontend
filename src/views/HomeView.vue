<script lang="ts">
  import {onBeforeMount } from 'vue';
  import {useRouter } from 'vue-router';

  export default ({
    setup() {
      const router = useRouter();
      onBeforeMount(() => {
        router.replace('/Login');
      });
    },
  });
</script>
