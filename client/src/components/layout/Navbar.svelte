<script>
  import { Router, Link } from "svelte-navigator";
  import { logout } from "../../apis/auth";

  import { user } from "../../store";

  const logoutUser = () => {
    logout();
  };

  let userData;

  user.subscribe((v) => {
    userData = v;
  });
</script>

<Router>
  <nav
    class="navbar navbar-expand-sm navbar-light py-2 px-4 justify-content-between"
  >
    <div class="d-flex">
      <Link class="navbar-brand" to="/">
        <span class="pronoor-brand">Pronoor Meeting</span>
      </Link>
      <ul class="navbar-nav">
        <li class="nav-item">
          <Link class="nav-link" to="/"><span>Meeting Room</span></Link>
        </li>
      </ul>
    </div>
    <ul class="navbar-nav">
      <li class="nav-item">
        <Link class="nav-link" to="/myAccount"
          ><span>{userData.nickname}</span></Link
        >
      </li>
      <li class="nav-item ml-3">
        <div class="nav-link logout-btn" on:click={logoutUser}>Logout</div>
      </li>
    </ul>
  </nav>
</Router>

<style>
  .logout-btn {
    cursor: pointer;
  }

  .navbar {
    overflow: hidden;
    position: fixed;
    width: 100vw;
    top: 0;
    z-index: 9999;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.5);
    background-color: white;
  }

  .nav-item:hover {
    border-bottom: 3px solid #f96714;
    padding-left: 8px;
    padding-right: 8px;
    border-bottom-left-radius: 40%;
    border-bottom-right-radius: 40%;
  }

  .nav-item .nav-link {
    color: #f96714 !important;
  }

  .nav-item .nav-link span {
    color: #f96714 !important;
  }

  .nav-item:hover .nav-link {
    color: #f96714 !important;
  }

  .nav-item:hover .nav-link span {
    color: #f96714 !important;
  }

  .pronoor-brand {
    color: #f96714 !important;
    font-weight: bolder;
  }
</style>
