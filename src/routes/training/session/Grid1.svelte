<script lang="ts">
	let { exercise, distance } = $props();
	
	let scores = $state<Array<string>>([]);

	function registerScore(result: string) {
		scores = [...scores, result];
		console.log('Registered score:', result);
	}

	function handleComplete() {
		// TODO: Save session results and navigate back
		console.log('Completing session with scores:', scores);
	}
</script>

<div class="grid1-container">
	<button 
		class="grid-button button-bra"
		onclick={() => registerScore('BRA')}
	>
		BRA
	</button>
	<button 
		class="grid-button button-ok"
		onclick={() => registerScore('OK')}
	>
		OK
	</button>
	<button 
		class="grid-button button-underkant"
		onclick={() => registerScore('UNDERKÄNT')}
	>
		UNDERKÄNT
	</button>
</div>

<div class="complete-section">
	<button 
		class="complete-button"
		onclick={handleComplete}
		disabled={scores.length === 0}
	>
		Avsluta
	</button>
</div>

<style>
	.grid1-container {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 1.5rem;
		margin-top: 2rem;
	}

	.grid-button {
		padding: 2rem;
		background: white;
		border: none;
		border-radius: 8px;
		font-size: 1.125rem;
		font-weight: 600;
		color: white;
		cursor: pointer;
		transition: all 0.2s ease;
		box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
		width: 100%;
		min-width: 0;
	}

	.button-bra {
		background-color: #10b981;
	}

	.button-ok {
		background-color: #f97316;
	}

	.button-underkant {
		background-color: #ef4444;
	}

	.grid-button:hover {
		opacity: 0.9;
		transform: translateY(-2px);
		box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.2), 0 4px 6px -2px rgba(0, 0, 0, 0.1);
	}

	.grid-button:active {
		transform: translateY(0);
		box-shadow: 0 2px 4px -1px rgba(0, 0, 0, 0.2);
	}

	.complete-section {
		margin-top: 3rem;
		display: flex;
		justify-content: center;
	}

	.complete-button {
		padding: 1rem 3rem;
		background-color: #3b82f6;
		color: white;
		border: none;
		border-radius: 8px;
		font-size: 1.125rem;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.complete-button:hover:not(:disabled) {
		background-color: #2563eb;
		transform: translateY(-2px);
		box-shadow: 0 4px 6px -1px rgba(59, 130, 246, 0.3);
	}

	.complete-button:disabled {
		background-color: #9ca3af;
		cursor: not-allowed;
		opacity: 0.6;
	}
</style>

