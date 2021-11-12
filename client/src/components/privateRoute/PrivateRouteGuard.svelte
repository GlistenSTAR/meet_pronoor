<script>
  import { useNavigate, useLocation } from "svelte-navigator";
  // import { auth } from "../../store";

  const navigate = useNavigate();
  const location = useLocation();

  // let isAuth;

  // auth.isAuthenticated.subscribe((value) => {
  //   isAuth = value;
  // });

  $: if (!localStorage.token) {
    navigate("/auth/login", {
      state: { from: $location.pathname },
      replace: true,
    });
  }
</script>

{#if localStorage.token}
  <slot />
{/if}
