<script lang="ts">
	let { exercise, distance } = $props();
	
	let scores = $state<Array<string>>([]);

	const scoreCounts = $derived({
		BRA: scores.filter(s => s === 'BRA').length,
		OK: scores.filter(s => s === 'OK').length,
		UNDERKÄNT: scores.filter(s => s === 'UNDERKÄNT').length
	});

	const totalClicks = $derived(scores.length);

	function getPercentage(result: string): number {
		if (totalClicks === 0) return 0;
		return Math.round((scoreCounts[result as keyof typeof scoreCounts] / totalClicks) * 100);
	}

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
		<div class="button-content">
			<span class="button-text">BRA</span>
			{#if totalClicks > 0}
				<span class="button-percentage">{getPercentage('BRA')}%</span>
			{/if}
		</div>
	</button>
	<button 
		class="grid-button button-ok"
		onclick={() => registerScore('OK')}
	>
		<div class="button-content">
			<span class="button-text">OK</span>
			{#if totalClicks > 0}
				<span class="button-percentage">{getPercentage('OK')}%</span>
			{/if}
		</div>
	</button>
	<button 
		class="grid-button button-underkant"
		onclick={() => registerScore('UNDERKÄNT')}
	>
		<div class="button-content">
			<span class="button-text">UNDERKÄNT</span>
			{#if totalClicks > 0}
				<span class="button-percentage">{getPercentage('UNDERKÄNT')}%</span>
			{/if}
		</div>
	</button>
</div>

<div class="summary-section">
	<h3 class="summary-title">Sammanfattning</h3>
	<div class="summary-content">
		<div class="summary-total">
			<span class="summary-label">Totalt:</span>
			<span class="summary-value">{totalClicks}</span>
		</div>
		<div class="summary-breakdown">
			<div class="summary-item">
				<span class="summary-item-label">BRA:</span>
				<span class="summary-item-value">{scoreCounts.BRA}</span>
			</div>
			<div class="summary-item">
				<span class="summary-item-label">OK:</span>
				<span class="summary-item-value">{scoreCounts.OK}</span>
			</div>
			<div class="summary-item">
				<span class="summary-item-label">UNDERKÄNT:</span>
				<span class="summary-item-value">{scoreCounts.UNDERKÄNT}</span>
			</div>
		</div>
	</div>
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
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.button-content {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.25rem;
	}

	.button-text {
		font-size: 1.125rem;
		font-weight: 600;
		color: white;
	}

	.button-percentage {
		font-size: 0.875rem;
		font-weight: 500;
		color: rgba(255, 255, 255, 0.8);
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

	.summary-section {
		margin-top: 2rem;
		padding: 1.5rem;
		background: white;
		border-radius: 8px;
		box-shadow: 0 2px 4px -1px rgba(0, 0, 0, 0.1);
	}

	.summary-title {
		margin: 0 0 1rem 0;
		font-size: 1.125rem;
		font-weight: 600;
		color: #1f2937;
	}

	.summary-content {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.summary-total {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding-bottom: 1rem;
		border-bottom: 1px solid #e5e7eb;
	}

	.summary-label {
		font-size: 1rem;
		font-weight: 600;
		color: #374151;
	}

	.summary-value {
		font-size: 1.25rem;
		font-weight: 700;
		color: #1f2937;
	}

	.summary-breakdown {
		display: flex;
		justify-content: space-around;
		gap: 1rem;
	}

	.summary-item {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.25rem;
		flex: 1;
	}

	.summary-item-label {
		font-size: 0.875rem;
		color: #6b7280;
	}

	.summary-item-value {
		font-size: 1.125rem;
		font-weight: 600;
		color: #1f2937;
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

