<script>
  import { Router, Link } from "svelte-navigator";
</script>

<Router>
  <nav
    class="navbar navbar-expand-sm navbar-light py-2 px-4 justify-content-between"
  >
    <div class="d-flex">
      <Link class="navbar-brand" to="/">
        <!-- <span class="pronoor-brand">Pronoor Meeting</span> -->
        <span class="pronoor-brand">
          <img src="../logo.png" alt="logo" class="logo" />
        </span>
      </Link>
    </div>
    <ul class="navbar-nav">
      <li class="nav-item ml-3">
        <Link class="nav-link" to="/"><span>Chat Room</span></Link>
      </li>
    </ul>
  </nav>
</Router>

<style>
  .navbar {
    overflow: hidden;
    position: fixed;
    width: 100vw;
    top: 0;
    z-index: 9999;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.5);
    background-color: #615550;
  }

  .nav-item:hover {
    border-bottom: 3px solid #cecbc9;
    padding-left: 8px;
    padding-right: 8px;
    border-bottom-left-radius: 40%;
    border-bottom-right-radius: 40%;
  }

  .nav-item .nav-link {
    color: #cecbc9 !important;
  }

  .nav-item .nav-link span {
    color: #cecbc9 !important;
  }

  .nav-item:hover .nav-link {
    color: #cecbc9 !important;
  }

  .nav-item:hover .nav-link span {
    color: #cecbc9 !important;
  }

  .pronoor-brand {
    color: #cecbc9 !important;
    font-weight: bolder;
  }

  .logo {
    width: 200px;
  }
</style>
