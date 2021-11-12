<script>
	import { Router, Route } from "svelte-navigator";
	import { onMount } from "svelte";
	import Notifications from "svelte-notifications";

	import { loadUser, logout } from "./apis/auth";

	import PrivateRoute from "./components/privateRoute/PrivateRoute.svelte";

	import Register from "./components/auth/Register.svelte";
	import Login from "./components/auth/Login.svelte";
	import MyAccount from "./components/myAccount/MyAccount.svelte";
	import Home from "./components/layout/Home.svelte";

	onMount(() => {
		if (localStorage.token) {
			loadUser();
		}

		window.addEventListener("storage", () => {
			if (!localStorage.token) logout();
		});
	});
	export let url = "";
</script>

<main>
	<Notifications>
		<Router {url}>
			<PrivateRoute path="/">
				<Home />
			</PrivateRoute>
			<Route path="/auth/register" component={Register} />
			<Route path="/auth/login" component={Login} />
			<PrivateRoute path="/myAccount">
				<MyAccount />
			</PrivateRoute>
		</Router>
	</Notifications>
</main>

<style>
	main {
		text-align: center;
		padding: p;
		margin: 0 auto;
		height: 100vh;
	}
</style>
