<script>
  import { onMount } from "svelte";
  import { getNotificationsContext } from "svelte-notifications";
  import { Router, Link } from "svelte-navigator";

  import { login } from "../../apis/auth";
  import { errors } from "../../store";

  const { addNotification } = getNotificationsContext();

  onMount(() => {
    errors.set({});
  });

  let userData = {
    email: "",
    password: "",
  };

  let errs = {};

  errors.subscribe((value) => {
    errs = value;
  });

  const signIn = async () => {
    const res = await login(userData);
    if (res === "success") {
      addNotification({
        text: "You successfully logged in",
        position: "top-right",
        type: "success",
        removeAfter: 3000,
      });
    } else {
      addNotification({
        text: "Error occured",
        position: "top-right",
        type: "danger",
        removeAfter: 3000,
      });
    }
  };
</script>

<div class="d-flex justify-content-center align-items-center full-height">
  <div>
    <h3>Login</h3>
    <div class="d-flex justify-content-center">
      <form
        class="text-left py-3 login"
        on:submit|preventDefault={signIn}
        novalidate
      >
        <div class="form-group">
          <label for="email">Email:</label>
          <input
            type="email"
            class="form-control"
            placeholder="Enter email"
            name="email"
            id="email"
            bind:value={userData.email}
          />
          {#if errs.email}
            <div class="mt-2 text-red">{errs.email}</div>
          {/if}
        </div>
        <div class="form-group">
          <label for="password">Password:</label>
          <input
            type="password"
            class="form-control"
            placeholder="Enter password"
            name="password"
            id="password"
            bind:value={userData.password}
          />
          {#if errs.password}
            <div class="mt-2 text-red">{errs.password}</div>
          {/if}
        </div>
        <div class="mt-4">
          <button type="submit" class="btn btn-primary">Sign In</button>
          <Router>
            <Link to="/auth/register">
              <button type="button" class="btn btn-secondary ml-3"
                >Create Account</button
              >
            </Link>
          </Router>
        </div>
      </form>
    </div>
  </div>
</div>

<style>
  .login {
    width: 50vw;
    max-width: 600px;
  }

  .text-red {
    color: red;
  }
</style>
