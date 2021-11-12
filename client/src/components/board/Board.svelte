<script>
  import { Icon } from "svelte-fontawesome";
  import { faMicrophone } from "@fortawesome/free-solid-svg-icons/faMicrophone";
  import { faVideo } from "@fortawesome/free-solid-svg-icons/faVideo";

  import { user } from "../../store";

  import MessageItem from "./MessageItem.svelte";

  let search_key;
  let userData;

  user.subscribe((v) => {
    userData = v;
  });
</script>

<div class="d-flex total-height">
  <!-- Users list field -->
  <div class="users-list">
    <img src={`../../${userData.avatar}`} alt="avatar" class="main-avatar" />
    <p class="mt-2 font-weight-bolder avatar-text">Night Fury</p>
    <input
      type="text"
      class="form-control form-control-sm mt-3 search-input"
      placeholder="Search users"
      bind:value={search_key}
    />
  </div>

  <!-- Chat field -->
  <div class="chat-field">
    <!-- Tools field -->
    <div class="d-flex justify-content-between px-3">
      <div class="d-flex align-items-center">
        <img src="./default.png" alt="avatar2" class="friend-avatar" />
        <span class="ml-2 font-weight-bolder avatar-text">Tiger</span>
      </div>
      <div class="d-flex align-items-center">
        <Icon icon={faMicrophone} class="icon mr-3" />
        <Icon icon={faVideo} class="icon" />
      </div>
    </div>
    <div class="message-field bg-secondary mt-2">
      <div class="d-flex justify-content-center">
        <input
          type="text"
          placeholder="Type a message"
          class="form-control-lg form-control message-box"
        />
      </div>
      <div class="msg-appear-field">
        <MessageItem />
        <MessageItem />
        <MessageItem />
        <MessageItem />
        <MessageItem />
        <MessageItem />
        <MessageItem />
        <MessageItem />
        <MessageItem />
        <MessageItem />
        <MessageItem />
        <MessageItem />
        <MessageItem />
      </div>
    </div>
  </div>
</div>

<style>
  .users-list {
    width: 350px;
    background-color: #615550;
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.8);
    z-index: 1;
    padding: 0 1rem;
  }

  .main-avatar {
    width: 100px;
    height: 100px;
    margin-top: 70px;
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
    padding-top: 80px;
    padding-left: 2rem;
    padding-right: 2rem;
    padding-bottom: 2rem;
    background-color: #f7f3ba;
    position: relative;
  }

  .message-field {
    border-radius: 15px;
    padding: 1rem 1rem 4rem 1rem;
    position: relative;
    height: 93%;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  }

  .msg-appear-field {
    height: 100%;
    width: 100%;
    overflow-y: auto;
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
</style>
