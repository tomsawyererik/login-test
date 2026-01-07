<script lang="ts">
	import { createClient } from '$lib/supabase/client';
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';

	let supabase = $state<ReturnType<typeof createClient> | null>(null);
	let sessions = $state<any[]>([]);
	let loading = $state(true);

	onMount(() => {
		if (browser) {
			supabase = createClient();
			fetchSessions();
		}
	});

	async function fetchSessions() {
		if (!supabase) return;

		loading = true;
		try {
			// Get current user
			const { data: { session }, error: authError } = await supabase.auth.getSession();
			
			if (authError || !session?.user) {
				console.error('Error getting user session:', authError);
				sessions = [];
				return;
			}

			// Fetch training sessions
			const { data: sessionsData, error: sessionsError } = await supabase
				.from('training_sessions')
				.select('id, exercise_id, distance, results, total_count, created_at')
				.eq('user_id', session.user.id)
				.order('created_at', { ascending: false });

			if (sessionsError) {
				console.error('Error fetching sessions:', sessionsError);
				sessions = [];
				return;
			}

			if (!sessionsData || sessionsData.length === 0) {
				sessions = [];
				return;
			}

			// Get unique exercise IDs
			const exerciseIds = [...new Set(sessionsData.map(s => s.exercise_id).filter(Boolean))];

			// Fetch exercises
			let exercisesMap = new Map();
			if (exerciseIds.length > 0) {
				const { data: exercisesData, error: exercisesError } = await supabase
					.from('exercises')
					.select('id, name, color, level')
					.in('id', exerciseIds);

				if (!exercisesError && exercisesData) {
					exercisesMap = new Map(exercisesData.map(ex => [ex.id, ex]));
				}
			}

			// Join sessions with exercises
			sessions = sessionsData.map(session => ({
				...session,
				exercises: exercisesMap.get(session.exercise_id) || null
			}));
		} catch (error) {
			console.error('Error fetching sessions:', error);
			sessions = [];
		} finally {
			loading = false;
		}
	}

	function formatDate(dateString: string): string {
		const date = new Date(dateString);
		return date.toLocaleDateString('sv-SE', {
			year: 'numeric',
			month: 'short',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		});
	}

	function getResultsText(results: any): string {
		if (!results) return 'Inga resultat';
		
		const parts: string[] = [];
		if (results.BRA !== undefined) parts.push(`BRA: ${results.BRA}`);
		if (results.OK !== undefined) parts.push(`OK: ${results.OK}`);
		if (results.UNDERKÄNT !== undefined) parts.push(`UNDERKÄNT: ${results.UNDERKÄNT}`);
		
		// Handle other result types
		Object.keys(results).forEach(key => {
			if (!['BRA', 'OK', 'UNDERKÄNT'].includes(key)) {
				parts.push(`${key}: ${results[key]}`);
			}
		});
		
		return parts.join(' • ');
	}

	const totalSessions = $derived(sessions.length);
	const totalAttempts = $derived(sessions.reduce((sum, s) => sum + (s.total_count || 0), 0));
</script>

<div class="page-container">
	<h1>Statistics</h1>

	{#if loading}
		<div class="loading">Loading...</div>
	{:else if sessions.length === 0}
		<div class="empty-state">
			<p>Inga träningssessioner hittades ännu.</p>
			<p>Börja träna för att se statistik här!</p>
		</div>
	{:else}
		<div class="stats-overview">
			<div class="stat-card">
				<div class="stat-value">{totalSessions}</div>
				<div class="stat-label">Totalt antal sessioner</div>
			</div>
			<div class="stat-card">
				<div class="stat-value">{totalAttempts}</div>
				<div class="stat-label">Totalt antal försök</div>
			</div>
		</div>

		<div class="sessions-list">
			<h2>Senaste sessioner</h2>
			{#each sessions as session}
				<div class="session-card">
					<div class="session-header">
						<div class="session-title">
							<div 
								class="exercise-color" 
								style="background-color: {session.exercises?.color || '#6b7280'}"
							></div>
							<div>
								<h3>{session.exercises?.name || 'Okänd övning'}</h3>
								<p class="session-meta">
									Nivå {session.exercises?.level || '?'} • {session.distance}m
								</p>
							</div>
						</div>
						<div class="session-date">
							{formatDate(session.created_at)}
						</div>
					</div>
					<div class="session-results">
						<div class="results-text">
							{getResultsText(session.results)}
						</div>
						<div class="total-count">
							Totalt: <strong>{session.total_count}</strong> försök
						</div>
					</div>
				</div>
			{/each}
		</div>
	{/if}
</div>

<style>
	.page-container {
		min-height: 100vh;
		padding: 2rem;
		padding-left: calc(64px + 2rem);
		background: #f9fafb;
	}

	h1 {
		margin: 0 0 2rem 0;
		font-size: 2rem;
		font-weight: 700;
		color: #1f2937;
		text-align: left;
	}

	h2 {
		margin: 2rem 0 1rem 0;
		font-size: 1.5rem;
		font-weight: 600;
		color: #1f2937;
	}

	.loading {
		padding: 2rem;
		text-align: center;
		color: #6b7280;
	}

	.empty-state {
		padding: 3rem;
		text-align: center;
		color: #6b7280;
	}

	.empty-state p {
		margin: 0.5rem 0;
	}

	.stats-overview {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
		gap: 1.5rem;
		margin-bottom: 2rem;
	}

	.stat-card {
		background: white;
		padding: 1.5rem;
		border-radius: 8px;
		box-shadow: 0 2px 4px -1px rgba(0, 0, 0, 0.1);
		text-align: center;
	}

	.stat-value {
		font-size: 2.5rem;
		font-weight: 700;
		color: #3b82f6;
		margin-bottom: 0.5rem;
	}

	.stat-label {
		font-size: 0.875rem;
		color: #6b7280;
		font-weight: 500;
	}

	.sessions-list {
		margin-top: 2rem;
	}

	.session-card {
		background: white;
		border-radius: 8px;
		padding: 1.5rem;
		margin-bottom: 1rem;
		box-shadow: 0 2px 4px -1px rgba(0, 0, 0, 0.1);
	}

	.session-header {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		margin-bottom: 1rem;
		padding-bottom: 1rem;
		border-bottom: 1px solid #e5e7eb;
	}

	.session-title {
		display: flex;
		align-items: center;
		gap: 1rem;
		flex: 1;
	}

	.exercise-color {
		width: 4px;
		height: 40px;
		border-radius: 2px;
		flex-shrink: 0;
	}

	.session-title h3 {
		margin: 0;
		font-size: 1.25rem;
		font-weight: 600;
		color: #1f2937;
	}

	.session-meta {
		margin: 0.25rem 0 0 0;
		font-size: 0.875rem;
		color: #6b7280;
	}

	.session-date {
		font-size: 0.875rem;
		color: #6b7280;
		white-space: nowrap;
	}

	.session-results {
		display: flex;
		justify-content: space-between;
		align-items: center;
		flex-wrap: wrap;
		gap: 1rem;
	}

	.results-text {
		font-size: 1rem;
		color: #374151;
		flex: 1;
		min-width: 200px;
	}

	.total-count {
		font-size: 0.875rem;
		color: #6b7280;
	}

	.total-count strong {
		color: #1f2937;
		font-weight: 600;
	}
</style>

