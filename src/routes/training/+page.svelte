<script lang="ts">
	import { createClient } from '$lib/supabase/client';
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import * as LucideIcons from 'lucide-svelte';

	let selectedMode = $state<'shooting' | 'pointing'>('shooting');
	let selectedExercise = $state<string | null>(null);
	let distance = $state<number | null>(null);
	let exercises = $state<Array<{ id: string; name: string; catergory: string; order: number; color: string; short_desc: string; level: number; icon: string }>>([]);
	let loading = $state(true);
	let supabase = $state<ReturnType<typeof createClient> | null>(null);

	const distances = [6, 7, 8, 9, 10];

	const currentExercise = $derived(exercises.find(ex => ex.id === selectedExercise));

	let distanceSection: HTMLDivElement;
	let startSection: HTMLDivElement;

	function scrollToDistance() {
		if (distanceSection) {
			distanceSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
		}
	}

	function scrollToStart() {
		if (startSection) {
			startSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
		}
	}

	// Convert kebab-case to PascalCase (e.g., "alarm-clock-off" -> "AlarmClockOff")
	function kebabToPascal(str: string): string {
		return str
			.split('-')
			.map(word => word.charAt(0).toUpperCase() + word.slice(1))
			.join('');
	}

	function getIconComponent(iconName: string) {
		if (!iconName) return null;
		const componentName = kebabToPascal(iconName);
		return (LucideIcons as any)[componentName] || null;
	}

	onMount(() => {
		if (browser) {
			supabase = createClient();
			fetchExercises();
		}
	});

	async function fetchExercises() {
		if (!supabase) return;
		
		loading = true;
		try {
			const { data, error } = await supabase
				.from('exercises')
				.select('id, name, catergory, order, color, short_desc, level, icon')
				.eq('catergory', selectedMode === 'shooting' ? 'Shooting' : 'Pointing')
				.order('order', { ascending: true });

			if (error) {
				console.error('Error fetching exercises:', error);
				exercises = [];
			} else {
				exercises = data || [];
			}
		} catch (error) {
			console.error('Error fetching exercises:', error);
			exercises = [];
		} finally {
			loading = false;
		}
	}

	$effect(() => {
		// Reset selection and fetch exercises when mode changes
		selectedExercise = null;
		if (supabase) {
			fetchExercises();
		}
	});
</script>

<div class="page-container">
	<h1>Training session</h1>
	
	<div class="mode-toggle">
		<button 
			class="mode-button"
			class:active={selectedMode === 'shooting'}
			onclick={() => selectedMode = 'shooting'}
		>
			Shooting
		</button>
		<button 
			class="mode-button"
			class:active={selectedMode === 'pointing'}
			onclick={() => selectedMode = 'pointing'}
		>
			Pointing
		</button>
	</div>

	<div class="exercises-section">
		<h2 class="section-header">1. Choose Exercise</h2>
		
		{#if loading}
			<p>Loading exercises...</p>
		{:else if exercises.length === 0}
			<p>No exercises found for {selectedMode}.</p>
		{:else}
			<div class="exercises-grid">
				{#each exercises as exercise (exercise.id)}
					<button
						class="exercise-card"
						class:selected={selectedExercise === exercise.id}
						onclick={() => {
							selectedExercise = exercise.id;
							distance = null; // Reset distance when selecting new exercise
							setTimeout(() => scrollToDistance(), 100);
						}}
					>
						<div class="exercise-icon" style="background-color: {exercise.color || '#e5e7eb'};">
							{#if exercise.icon}
								{@const IconComponent = getIconComponent(exercise.icon)}
								{#if IconComponent}
									<svelte:component this={IconComponent} size={32} color="white" />
								{/if}
							{/if}
						</div>
						<div class="exercise-content">
							<div class="exercise-header">
								<div class="exercise-title-section">
									<p class="exercise-number">Övning {exercise.order}</p>
									<h3 class="exercise-title">{exercise.name}</h3>
								</div>
								<div class="exercise-level">
									<span class="level-badge" style="background-color: {exercise.color || '#3b82f6'};">
										Level {exercise.level}
									</span>
								</div>
							</div>
							<p class="exercise-description">{exercise.short_desc}</p>
						</div>
					</button>
				{/each}
			</div>
		{/if}
	</div>

	{#if selectedExercise}
		<div class="distance-section" bind:this={distanceSection}>
			<h2 class="section-header">2. Select distance</h2>
			
			<div class="distance-grid">
				{#each distances as distanceValue}
					<button
						class="distance-card"
						class:selected={distance === distanceValue}
						onclick={() => {
							distance = distanceValue;
							setTimeout(() => scrollToStart(), 100);
						}}
					>
						<div class="distance-circle">
							<span class="distance-number">{distanceValue}</span>
						</div>
						<p class="distance-label">meters</p>
					</button>
				{/each}
			</div>
		</div>
	{/if}

	{#if selectedExercise && distance && currentExercise}
		<div class="start-section" bind:this={startSection}>
			<button
				class="start-card"
				onclick={() => goto(`/training/session?exercise=${selectedExercise}&distance=${distance}`)}
			>
				<div class="start-content">
					<h3 class="start-title">Redo att börja!</h3>
					<p class="start-exercise">Övning {currentExercise.order}: {currentExercise.name} - {distance}m</p>
					<p class="start-level">Nivå {currentExercise.level} - {currentExercise.short_desc}</p>
				</div>
				<div class="start-button">Starta Övning</div>
			</button>
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

	.mode-toggle {
		display: flex;
		gap: 0.5rem;
		margin-top: 1rem;
	}

	.mode-button {
		padding: 0.75rem 1.5rem;
		border: none;
		background: transparent;
		color: #9ca3af;
		font-size: 1rem;
		font-weight: 600;
		cursor: pointer;
		border-radius: 8px;
		transition: all 0.2s ease;
	}

	.mode-button.active {
		background: white;
		color: #1f2937;
		box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
	}

	.mode-button:hover:not(.active) {
		color: #6b7280;
	}

	.exercises-section {
		margin-top: 3rem;
	}

	.section-header {
		margin: 0 0 1.5rem 0;
		font-size: 1.5rem;
		font-weight: 700;
		color: #1f2937;
		text-align: left;
	}

	.exercises-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
		gap: 1.5rem;
	}

	.exercise-card {
		display: flex;
		gap: 1rem;
		padding: 1.5rem;
		background: white;
		border: 2px solid #e5e7eb;
		border-radius: 8px;
		cursor: pointer;
		text-align: left;
		transition: all 0.2s ease;
	}

	.exercise-card:hover {
		border-color: #d1d5db;
		box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
	}

	.exercise-card.selected {
		border-color: #3b82f6;
		box-shadow: 0 4px 6px -1px rgba(59, 130, 246, 0.2);
	}

	.exercise-icon {
		width: 60px;
		height: 80px;
		border-radius: 8px;
		flex-shrink: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		background-color: #e5e7eb;
	}

	.exercise-content {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.exercise-header {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		gap: 1rem;
	}

	.exercise-title-section {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.exercise-number {
		margin: 0;
		font-size: 0.875rem;
		font-weight: 600;
		color: #6b7280;
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.exercise-title {
		margin: 0;
		font-size: 1.125rem;
		font-weight: 700;
		color: #1f2937;
		line-height: 1.4;
	}

	.exercise-level {
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		gap: 0.25rem;
		flex-shrink: 0;
	}

	.level-badge {
		padding: 0.25rem 0.75rem;
		border-radius: 9999px;
		color: white;
		font-size: 0.75rem;
		font-weight: 600;
		white-space: nowrap;
	}

	.difficulty {
		margin: 0;
		font-size: 0.875rem;
		color: #6b7280;
	}

	.exercise-description {
		margin: 0;
		font-size: 0.875rem;
		color: #6b7280;
		line-height: 1.5;
	}

	.distance-section {
		margin-top: 3rem;
	}

	.distance-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
		gap: 1.5rem;
		margin-top: 1.5rem;
	}

	.distance-card {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.75rem;
		padding: 1.5rem;
		background: white;
		border: 2px solid #e5e7eb;
		border-radius: 8px;
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.distance-card:hover {
		border-color: #d1d5db;
		box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
	}

	.distance-card.selected {
		border-color: #3b82f6;
		box-shadow: 0 4px 6px -1px rgba(59, 130, 246, 0.2);
	}

	.distance-circle {
		width: 60px;
		height: 60px;
		border-radius: 50%;
		background-color: #f3f4f6;
		display: flex;
		align-items: center;
		justify-content: center;
		border: 2px solid #e5e7eb;
		transition: all 0.2s ease;
	}

	.distance-card.selected .distance-circle {
		background-color: #3b82f6;
		border-color: #3b82f6;
	}

	.distance-number {
		font-size: 1.5rem;
		font-weight: 700;
		color: #1f2937;
		transition: color 0.2s ease;
	}

	.distance-card.selected .distance-number {
		color: white;
	}

	.distance-label {
		margin: 0;
		font-size: 0.875rem;
		color: #6b7280;
		font-weight: 500;
	}

	.start-section {
		margin-top: 3rem;
	}

	.start-card {
		display: flex;
		justify-content: space-between;
		align-items: center;
		width: 100%;
		padding: 2rem;
		background: white;
		border: 2px solid #e5e7eb;
		border-radius: 8px;
		cursor: pointer;
		transition: all 0.2s ease;
		text-align: left;
	}

	.start-card:hover {
		border-color: #3b82f6;
		box-shadow: 0 4px 6px -1px rgba(59, 130, 246, 0.2);
	}

	.start-content {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.start-title {
		margin: 0;
		font-size: 1.5rem;
		font-weight: 700;
		color: #1f2937;
	}

	.start-exercise {
		margin: 0;
		font-size: 1.125rem;
		font-weight: 600;
		color: #374151;
	}

	.start-level {
		margin: 0;
		font-size: 0.875rem;
		color: #6b7280;
	}

	.start-button {
		padding: 0.75rem 2rem;
		background-color: #3b82f6;
		color: white;
		border: none;
		border-radius: 6px;
		font-size: 1rem;
		font-weight: 600;
		flex-shrink: 0;
		pointer-events: none;
	}
</style>

