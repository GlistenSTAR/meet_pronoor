<script>
  import { selectedFriend } from "../../store";
  import { getMessages } from "../../apis/message";

  export let friend;

  const selectFriend = () => {
    selectedFriend.set(friend);
    getMessages(friend.nickname);
  };
</script>

<div class="mb-1 friend-item" on:click={selectFriend}>
  <img src={`../../${friend.avatar}`} alt="avatar2" class="friend-avatar" />
  <span class="ml-2 font-weight-bolder text-white">{friend.nickname}</span>
</div>

<style>
  .friend-avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    border: 2px solid #f96714;
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
</style>
