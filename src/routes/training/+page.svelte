<script lang="ts">
	let selectedMode = $state<'shooting' | 'pointing'>('shooting');
	let selectedExercise = $state<number | null>(null);

	// Exercise data structure - will be replaced with database calls later
	type Exercise = {
		id: number;
		title: string;
		level: number;
		difficulty: string;
		description: string;
		iconColor: string;
	};

	const exercises: Record<'shooting' | 'pointing', Exercise[]> = {
		shooting: [
			{
				id: 1,
				title: 'Exercise 1: Basic Target',
				level: 1,
				difficulty: 'Beginner',
				description: 'Practice hitting a target ball in the center square rectangle.',
				iconColor: '#3b82f6'
			},
			{
				id: 2,
				title: 'Exercise 2: With Obstacles',
				level: 1,
				difficulty: 'Beginner',
				description: 'Hit the target ball in the middle with an obstacle ball 40cm in front.',
				iconColor: '#8b5cf6'
			}
		],
		pointing: [
			{
				id: 3,
				title: 'Exercise 1: Pointing Basics',
				level: 1,
				difficulty: 'Beginner',
				description: 'Learn the fundamentals of pointing technique.',
				iconColor: '#10b981'
			}
		]
	};

	$effect(() => {
		// Reset selection when mode changes
		selectedExercise = null;
	});

	const currentExercises = $derived(exercises[selectedMode]);
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
		
		<div class="exercises-grid">
			{#each currentExercises as exercise (exercise.id)}
				<button
					class="exercise-card"
					class:selected={selectedExercise === exercise.id}
					onclick={() => selectedExercise = exercise.id}
				>
					<div class="exercise-icon" style="background-color: {exercise.iconColor};">
						<!-- Icon placeholder - will add icons later -->
					</div>
					<div class="exercise-content">
						<div class="exercise-header">
							<h3 class="exercise-title">{exercise.title}</h3>
							<div class="exercise-level">
								<span class="level-badge" style="background-color: {exercise.iconColor};">
									Level {exercise.level}
								</span>
								<p class="difficulty">{exercise.difficulty}</p>
							</div>
						</div>
						<p class="exercise-description">{exercise.description}</p>
					</div>
				</button>
			{/each}
		</div>
	</div>
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

	.exercise-title {
		margin: 0;
		font-size: 1.125rem;
		font-weight: 700;
		color: #1f2937;
		line-height: 1.4;
		flex: 1;
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
</style>

