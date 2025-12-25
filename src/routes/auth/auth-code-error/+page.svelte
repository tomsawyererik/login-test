<script lang="ts">
	import { goto } from '$app/navigation';
</script>

<div class="error-container">
	<div class="error-card">
		<h1>Authentication Error</h1>
		<p>There was an error authenticating your request. Please try again.</p>
		<button onclick={() => goto('/')} class="btn">Go to Login</button>
	</div>
</div>

<style>
	.error-container {
		display: flex;
		justify-content: center;
		align-items: center;
		min-height: 100vh;
		padding: 1rem;
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
	}

	.error-card {
		background: white;
		border-radius: 12px;
		padding: 2.5rem;
		width: 100%;
		max-width: 420px;
		box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
		text-align: center;
	}

	h1 {
		margin: 0 0 1rem 0;
		font-size: 2rem;
		font-weight: 700;
		color: #dc2626;
	}

	p {
		margin: 0 0 2rem 0;
		color: #6b7280;
	}

	.btn {
		padding: 0.75rem 1.5rem;
		background-color: #667eea;
		color: white;
		border: none;
		border-radius: 6px;
		font-size: 1rem;
		font-weight: 600;
		cursor: pointer;
		transition: background-color 0.2s;
	}

	.btn:hover {
		background-color: #5568d3;
	}
</style>

