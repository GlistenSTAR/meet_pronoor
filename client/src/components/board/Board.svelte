<script>
  import { afterUpdate, onMount } from "svelte";
  import { Icon } from "svelte-fontawesome";
  import { faMicrophone } from "@fortawesome/free-solid-svg-icons/faMicrophone";
  import { faVideo } from "@fortawesome/free-solid-svg-icons/faVideo";
  import { getNotificationsContext } from "svelte-notifications";
  import openSocket from "socket.io-client";

  import {
    user,
    friends,
    selectedFriend,
    socketURL,
    messages,
  } from "../../store";
  import { searchUsers } from "../../apis/auth";
  import { saveMessage } from "../../apis/message";
  import isEmpty from "../../utils/is-empty";

  import MessageItem from "./MessageItem.svelte";
  import FriendItem from "./FriendItem.svelte";

  const { addNotification } = getNotificationsContext();

  let search_key;
  let userData;
  let totalFriends;
  let friend;
  let socket_url;
  let message = "";
  let msgs;

  messages.subscribe((v) => {
    msgs = v;
  });

  socketURL.subscribe((v) => {
    socket_url = v;
  });

  const socket = openSocket(socket_url);

  socket.on("createMessage", (data) => {
    data.receiver_time = new Date().toLocaleTimeString();
    const newMsg = new Array();
    newMsg.sender = data.sender;
    newMsg.receiver = data.receiver;
    newMsg.message = data.message;
    newMsg.sender_time = data.sender_time;
    newMsg.receiver_time = data.receiver_time;
    if (isEmpty(msgs)) {
      msgs = newMsg;
    } else {
      msgs.push(newMsg);
    }
    messages.set(msgs);
    socket.emit("updateTime", data);
  });

  onMount(() => {
    searchUsers();
  });

  afterUpdate(() => {
    if (!isEmpty(document.getElementsByClassName("msg-appear-field")[0])) {
      document.getElementsByClassName("msg-appear-field")[0].scrollTop =
        document.getElementsByClassName("msg-appear-field")[0].scrollHeight;
    }
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
      const msgDada = {
        sender: userData.nickname,
        receiver: friend.nickname,
        message: message,
        sender_time: new Date().toLocaleTimeString(),
        receiver_time: "",
      };

      const res = await saveMessage(msgDada, socket);

      if (res === "success") {
        message = "";
      }
    }
  };
</script>

<div class="d-flex total-height">
  <!-- Users list field -->
  <div class="users-field">
    <div class="search-field">
      <img src={`../../${userData.avatar}`} alt="avatar" class="main-avatar" />
      <p class="mt-2 font-weight-bolder avatar-text">{userData.nickname}</p>
      <input
        type="text"
        class="form-control form-control-sm mt-3 search-input"
        placeholder="Search users"
        bind:value={search_key}
      />
    </div>
    <div class="users-list mt-3 text-left">
      {#if !isEmpty(totalFriends)}
        {#each totalFriends as friend}
          <FriendItem {friend} />
        {/each}
      {/if}
    </div>
  </div>

  <!-- Chat field -->
  <div class="chat-field">
    <!-- Tools field -->
    <div class="d-flex justify-content-between px-3">
      {#if !isEmpty(friend)}
        <div class="d-flex align-items-center">
          <img
            src={`../../${friend.avatar}`}
            alt="avatar2"
            class="friend-avatar"
          />
          <span class="ml-2 font-weight-bolder avatar-text"
            >{friend.nickname}</span
          >
        </div>
      {:else}
        <p class="m-0 font-weight-bolder avatar-text">Select a friend</p>
      {/if}
      <div class="d-flex align-items-center">
        <Icon icon={faMicrophone} class="icon mr-3" />
        <Icon icon={faVideo} class="icon" />
      </div>
    </div>
    <div class="message-field mt-2">
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
</div>

<style>
  .users-field {
    position: relative;
    width: 350px;
    height: 100%;
    background-color: #615550;
    box-shadow: 0 6px 8px rgba(0, 0, 0, 0.8);
    z-index: 1;
    padding-top: 70px;
    padding-left: 1rem;
    padding-right: 1rem;
    padding-bottom: 2rem;
  }

  .main-avatar {
    width: 100px;
    height: 100px;
    border-radius: 10px;
    border: 2px solid #f96714;
    cursor: pointer;
  }

  .friend-avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    border: 2px solid #f96714;
    cursor: pointer;
  }

  .chat-field {
    width: 100%;
    height: 100%;
    padding-top: 80px;
    padding-left: 2rem;
    padding-right: 2rem;
    padding-bottom: 2rem;
    background-color: white;
    /* background-color: #f7f3ba; */
    position: relative;
  }

  .message-field {
    border-radius: 15px;
    padding: 1rem 1rem 4rem 1rem;
    position: relative;
    height: 93%;
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
    height: 70%;
    overflow-y: auto;
  }

  .search-field {
    height: 30%;
  }

  .message-box {
    position: absolute;
    bottom: 10px;
    width: 90%;
    border-radius: 20px;
    padding: 10px 25px;
    border-color: #f96714 !important;
  }
  .message-box:focus {
    border-color: #f96714 !important;
    box-shadow: 0 0 0 0.2rem rgb(249, 103, 20, 25%);
  }

  .search-input:focus {
    border-color: #f96714 !important;
    box-shadow: 0 0 0 0.2rem rgb(249, 103, 20, 25%);
  }

  :global(.icon) {
    color: #f96714;
    font-size: 1.5em;
  }

  :global(.icon:hover) {
    font-size: 1.7em;
    cursor: pointer;
  }

  .avatar-text {
    color: #f96714;
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
