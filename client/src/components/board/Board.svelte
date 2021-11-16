<script>
  import { afterUpdate, onMount } from "svelte";
  import { Icon } from "svelte-fontawesome";
  import { faEllipsisV } from "@fortawesome/free-solid-svg-icons/faEllipsisV";
  import { getNotificationsContext } from "svelte-notifications";
  import openSocket from "socket.io-client";
  import Dropdown from "sv-bootstrap-dropdown";

  import {
    user,
    friends,
    selectedFriend,
    socketURL,
    messages,
  } from "../../store";
  import { searchUsers, logout } from "../../apis/auth";
  import { saveMessage } from "../../apis/message";
  import isEmpty from "../../utils/is-empty";

  import MessageItem from "./MessageItem.svelte";
  import FriendItem from "./FriendItem.svelte";
  import Profile from "../myAccount/Profile.svelte";
  import Security from "../myAccount/Security.svelte";
  import Greeting from "./Greeting.svelte";

  const { addNotification } = getNotificationsContext();

  let search_key;
  let userData;
  let totalFriends;
  let friend;
  let socket_url;
  let message = "";
  let msgs = [];
  let dropdownTrigger;
  let innerHeight;

  messages.subscribe((v) => {
    msgs = v;
  });

  socketURL.subscribe((v) => {
    socket_url = v;
  });

  const socket = openSocket(socket_url);

  socket.on("createMessage", (data) => {
    console.log("socket");
    data.receiver_time = new Date().toLocaleTimeString();
    const newMsg = new Array();
    newMsg.sender = data.sender;
    newMsg.receiver = data.receiver;
    newMsg.message = data.message;
    newMsg.sender_time = data.sender_time;
    newMsg.receiver_time = data.receiver_time;
    if (isEmpty(msgs)) {
      msgs[0] = newMsg;
    } else {
      msgs.push(newMsg);
    }
    console.log(newMsg);
    messages.set(msgs);
    socket.emit("updateTime", data);
  });

  onMount(() => {
    searchUsers();
  });

  afterUpdate(() => {
    const element = document.querySelector(".msg-appear-field");
    if (element !== null) element.scrollTop = element.scrollHeight;
  });

  user.subscribe((v) => {
    userData = v;
  });

  friends.subscribe((v) => {
    totalFriends = v;
  });

  selectedFriend.subscribe((v) => {
    friend = v;
  });

  const sendMessage = async () => {
    if (isEmpty(friend)) {
      addNotification({
        text: "Select a friend!",
        position: "top-right",
        type: "danger",
        removeAfter: 3000,
      });
    } else if (isEmpty(message)) {
      addNotification({
        text: "Input a message!",
        position: "top-right",
        type: "danger",
        removeAfter: 3000,
      });
    } else {
      const msgData = {
        sender: userData.nickname,
        receiver: friend.nickname,
        message: message,
        sender_time: new Date().toLocaleTimeString(),
        receiver_time: "",
      };

      const res = await saveMessage(msgData);

      if (res === "success") {
        message = "";
        socket.emit("createMessage", msgData);
      }
    }
  };

  const clickLogout = () => {
    logout();
  };

  window.process = {
    env: "production",
  };
</script>

<svelte:window bind:innerHeight />
<Profile />
<Security />
<div class="d-flex total-height">
  <!-- Users list field -->
  <div class="users-field" style="height: {innerHeight}px;">
    <div>
      <div class="d-flex justify-content-between align-items-center">
        <div class="d-flex align-items-center">
          <img
            src={`../../${userData.avatar}`}
            alt="avatar"
            class="main-avatar"
          />
          <span class="ml-2 font-weight-bolder user-nickname"
            >{userData.nickname}</span
          >
        </div>
        <Dropdown triggerElement={dropdownTrigger}>
          <button type="button" class="btn btn-link" bind:this={dropdownTrigger}
            ><Icon icon={faEllipsisV} class="icon" /></button
          >
          <div slot="DropdownMenu">
            <button
              class="dropdown-item"
              type="button"
              data-toggle="modal"
              data-target="#profile">Profile</button
            >
            <button
              class="dropdown-item"
              type="button"
              data-toggle="modal"
              data-target="#security">Security</button
            >
            <button class="dropdown-item" type="button" on:click={clickLogout}
              >Logout</button
            >
          </div>
        </Dropdown>
      </div>
    </div>
    <input
      type="text"
      class="form-control form-control-sm mt-2 search-input"
      placeholder="Search users"
      bind:value={search_key}
    />
    <div
      class="users-list mt-3 text-left"
      style="height: {innerHeight - 190}px;"
    >
      {#if !isEmpty(totalFriends)}
        {#each totalFriends as friend}
          <FriendItem {friend} />
        {/each}
      {/if}
    </div>
  </div>

  {#if isEmpty(friend)}
    <Greeting />
  {:else}
    <!-- Chat field -->
    <div class="chat-field" style="height: {innerHeight}px;">
      <!-- Tools field -->
      <div class="d-flex justify-content-start px-3">
        <div class="d-flex align-items-center">
          <img
            src={`../../${friend.avatar}`}
            alt="avatar2"
            class="friend-avatar"
          />
          <span class="ml-2 font-weight-bolder friend-nickname"
            >{friend.nickname}</span
          >
        </div>
      </div>
      <!-- Message field -->
      <div class="message-field mt-2" style="height: {innerHeight - 140}px;">
        <form
          class="d-flex justify-content-center"
          on:submit|preventDefault={sendMessage}
        >
          <input
            type="text"
            placeholder="Type a message"
            class="form-control-lg form-control message-box"
            bind:value={message}
          />
        </form>
        <div class="msg-appear-field">
          {#if !isEmpty(msgs)}
            {#each msgs as msg}
              <MessageItem message={msg} />
            {/each}
          {/if}
        </div>
      </div>
    </div>
  {/if}
</div>

<style>
  .users-field {
    position: relative;
    width: 350px;
    background-color: #615550;
    box-shadow: 0 6px 8px rgba(0, 0, 0, 0.8);
    z-index: 1;
    padding-top: 70px;
    padding-left: 1rem;
    padding-right: 1rem;
    padding-bottom: 2rem;
  }

  .main-avatar {
    width: 50px;
    height: 50px;
    border-radius: 10px;
    border: 2px solid #cecbc9;
    cursor: pointer;
  }

  .friend-avatar {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    border: 2px solid #615550;
    cursor: pointer;
  }

  .chat-field {
    width: 100%;
    padding-top: 70px;
    padding-left: 1.5rem;
    padding-right: 1.5rem;
    padding-bottom: 1.5rem;
    background-color: #cecbc9;
    position: relative;
  }

  .message-field {
    border-radius: 15px;
    padding: 1rem 1rem 4rem 1rem;
    position: relative;
    background-color: #615550;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  }

  .msg-appear-field {
    height: 100%;
    width: 100%;
    overflow-y: auto;
  }

  .users-list {
    width: 100%;
    overflow-y: auto;
  }

  .message-box {
    position: absolute;
    bottom: 10px;
    width: 80%;
    max-width: 800px;
    border-radius: 20px;
    padding: 10px 25px;
    border-color: #cecbc9 !important;
  }
  .message-box:focus {
    border-color: #cecbc9 !important;
    box-shadow: 0 0 0 0.2rem rgba(211, 209, 209, 0.25);
  }

  .search-input:focus {
    border-color: #cecbc9 !important;
    box-shadow: 0 0 0 0.2rem rgba(211, 209, 209, 0.25);
  }

  :global(.icon) {
    color: #cecbc9;
    font-size: 1.5em;
  }

  :global(.icon:hover) {
    /* font-size: 1.7em; */
    cursor: pointer;
  }

  .user-nickname {
    color: #cecbc9;
  }

  .friend-nickname {
    color: #615550;
  }

  /* Custom scrollbar */
  /* width */
  ::-webkit-scrollbar {
    width: 10px;
  }

  /* Track */
  ::-webkit-scrollbar-track {
    /* box-shadow: inset 0 0 5px grey; */
    border-radius: 10px;
  }

  /* Handle */
  ::-webkit-scrollbar-thumb {
    background: lightgrey;
    border-radius: 10px;
  }

  /* Handle on hover */
  ::-webkit-scrollbar-thumb:hover {
    background: rgb(167, 165, 165);
  }
</style>
