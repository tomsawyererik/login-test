<script lang="ts">
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { createClient } from '$lib/supabase/client';
	import { goto } from '$app/navigation';
	import Grid1 from './Grid1.svelte';
	import Grid2 from './Grid2.svelte';

	let supabase = $state<ReturnType<typeof createClient> | null>(null);
	let exerciseId = $derived($page.url.searchParams.get('exercise'));
	let distanceParam = $derived($page.url.searchParams.get('distance'));
	let exercise = $state<any>(null);
	let loading = $state(true);

	// Map of module names to components
	const modules: Record<string, any> = {
		'Grid1': Grid1,
		'Grid2': Grid2
		// Add more modules here as you create them
	};

	function getModuleComponent(moduleName: string | null) {
		if (!moduleName) return null;
		return modules[moduleName] || null;
	}

	onMount(() => {
		if (browser) {
			supabase = createClient();
			if (exerciseId) {
				fetchExercise();
			} else {
				// Redirect back if no exercise ID
				goto('/training');
			}
		}
	});

	async function fetchExercise() {
		if (!supabase || !exerciseId) return;
		
		loading = true;
		try {
			const { data, error } = await supabase
				.from('exercises')
				.select('*')
				.eq('id', exerciseId)
				.single();

			if (error) {
				console.error('Error fetching exercise:', error);
				goto('/training');
			} else {
				exercise = data;
			}
		} catch (error) {
			console.error('Error fetching exercise:', error);
			goto('/training');
		} finally {
			loading = false;
		}
	}

	const ModuleComponent = $derived(getModuleComponent(exercise?.module));
</script>

<div class="page-container">
	{#if loading}
		<p>Loading...</p>
	{:else if exercise}
		<h1>Training Session</h1>
		<p>Exercise: {exercise.name}</p>
		<p>Distance: {distanceParam}m</p>
		<p>Level: {exercise.level}</p>
		
		{#if ModuleComponent}
			<svelte:component this={ModuleComponent} exercise={exercise} distance={distanceParam} />
		{:else}
			<p>No module specified for this exercise. Please add a 'module' field to the exercise in Supabase.</p>
		{/if}
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

	p {
		margin: 0.5rem 0;
		color: #374151;
	}
</style>

