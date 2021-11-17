<script>
  import { selectedFriend } from "../../store";
  import { getMessages } from "../../apis/message";

  export let friend;

  const selectFriend = () => {
    selectedFriend.set(friend);
    getMessages(friend.nickname);
  };
</script>

{#if $selectedFriend.nickname === friend.nickname}
  <div class="mb-1 friend-item selected" on:click={selectFriend}>
    <img src={`../../${friend.avatar}`} alt="avatar2" class="friend-avatar" />
    <span class="ml-2 font-weight-bolder nickname">{friend.nickname}</span>
  </div>
{:else}
  <div class="mb-1 friend-item" on:click={selectFriend}>
    <img src={`../../${friend.avatar}`} alt="avatar2" class="friend-avatar" />
    <span class="ml-2 font-weight-bolder nickname">{friend.nickname}</span>
  </div>
{/if}

<style>
  .friend-avatar {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    border: 2px solid #cecbc9;
    cursor: pointer;
  }

  .friend-item {
    cursor: pointer;
    padding: 5px;
  }

  .friend-item:hover {
    background-color: #988781;
    border-radius: 15px;
  }

  .selected {
    background-color: #988781;
    border-radius: 15px;
  }

  .nickname {
    color: #cecbc9;
  }
</style>
