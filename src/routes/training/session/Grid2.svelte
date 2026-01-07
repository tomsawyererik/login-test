<script lang="ts">
	let { exercise, distance } = $props();
</script>

<div class="grid2-container">
	<button class="grid-button">Button 1</button>
	<button class="grid-button">Button 2</button>
	<button class="grid-button">Button 3</button>
	<button class="grid-button">Button 4</button>
</div>

<style>
	.grid2-container {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 1.5rem;
		margin-top: 2rem;
	}

	.grid-button {
		padding: 2rem;
		background: white;
		border: 2px solid #e5e7eb;
		border-radius: 8px;
		font-size: 1.125rem;
		font-weight: 600;
		color: #1f2937;
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.grid-button:hover {
		border-color: #3b82f6;
		box-shadow: 0 4px 6px -1px rgba(59, 130, 246, 0.2);
	}
</style>



