<script>
	let { data } = $props();
</script>

<h1>Dashboard</h1>

<p>Logged in as: {data.locals.auth.username}</p>

<form action="/logout" method="POST">
	<button type="submit">Logout</button>
</form>
