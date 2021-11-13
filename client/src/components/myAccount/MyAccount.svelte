<script>
  import { onMount } from "svelte";
  import { getNotificationsContext } from "svelte-notifications";

  import Navbar from "../layout/Navbar.svelte";

  import { updateUserData, changePassword } from "../../apis/auth";
  import { user, errors } from "../../store";

  const { addNotification } = getNotificationsContext();

  onMount(() => {
    errors.set({});
  });

  let userData = {
    nickname: "",
    email: "",
    avatar: "",
    oldPw: "",
    password: "",
    password2: "",
  };

  let avatarFile;

  let errs = {};

  errors.subscribe((value) => {
    errs = value;
  });

  user.subscribe((value) => {
    userData.nickname = value.nickname;
    userData.email = value.email;
    userData.avatar = value.avatar;
  });

  const selectAvatar = (e) => {
    const file = e.target.files[0];
    let reader = new FileReader();

    reader.onload = function () {
      document.getElementById("avatar").src = reader.result;
    };

    reader.readAsDataURL(file);
    avatarFile = file;
  };

  const updateUser = async () => {
    const formData = new FormData();
    formData.append("nickname", userData.nickname);
    formData.append("email", userData.email);
    formData.append("avatar", avatarFile);

    const res = await updateUserData(formData);

    if (res === "success") {
      addNotification({
        text: "Successfully saved",
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
  const changePW = async () => {
    const res = await changePassword(userData);

    if (res === "success") {
      addNotification({
        text: "Password successfully updated",
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

<Navbar />
<div class="d-flex justify-content-between container">
  <form
    class="text-left py-3 update-form"
    on:submit|preventDefault={updateUser}
  >
    <img
      src={`../../${userData.avatar}`}
      alt="avatar"
      id="avatar"
      class="user-avatar"
    />
    <input
      type="file"
      class="my-3 form-control-file"
      on:change={selectAvatar}
    />
    <div class="form-group">
      <label for="nickname">Nickname:</label>
      <input
        type="text"
        class="form-control"
        placeholder="Enter last name"
        name="nickname"
        id="nickname"
        bind:value={userData.nickname}
      />
      {#if errs.nickname}
        <div class="mt-2 text-red">{errs.nickname}</div>
      {/if}
    </div>
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
    <button type="submit" class="btn btn-primary">Save</button>
  </form>
  <form class="text-left py-3 pw-form" on:submit|preventDefault={changePW}>
    <div class="form-group">
      <label for="oldPw">Current Password:</label>
      <input
        type="password"
        class="form-control"
        placeholder="Enter current password"
        name="oldPw"
        id="oldPw"
        bind:value={userData.oldPw}
      />
      {#if errs.oldPw}
        <div class="mt-2 text-red">{errs.oldPw}</div>
      {/if}
    </div>
    <div class="form-group">
      <label for="password">New Password:</label>
      <input
        type="password"
        class="form-control"
        placeholder="Enter new password"
        name="password"
        id="password"
        bind:value={userData.password}
      />
      {#if errs.password}
        <div class="mt-2 text-red">{errs.password}</div>
      {/if}
    </div>
    <div class="form-group">
      <label for="password2">Confirm Password:</label>
      <input
        type="password"
        class="form-control"
        placeholder="Confirm password"
        name="password2"
        id="password2"
        bind:value={userData.password2}
      />
      {#if errs.password2}
        <div class="mt-2 text-red">{errs.password2}</div>
      {/if}
    </div>
    <button type="submit" class="btn btn-primary">Change Password</button>
  </form>
</div>

<style>
  .update-form {
    width: 30vw;
    max-width: 400px;
  }

  .pw-form {
    width: 30vw;
    max-width: 400px;
  }

  .text-red {
    color: red;
  }

  .user-avatar {
    width: 150px;
    height: 150px;
    border-radius: 10px;
    border: 2px solid #f96714;
    cursor: pointer;
  }

  .container {
    padding-top: 70px;
  }
</style>
